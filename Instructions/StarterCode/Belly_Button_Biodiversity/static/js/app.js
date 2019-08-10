function buildMetadata(sample) {
  var defaultURL = '/metadata/' + sample;
 // Use `d3.json` to fetch the metadata for a sample
  d3.json(defaultURL).then(function(record_data) {
    data = [record_data];

    // build metadata table
    var meta_data_frame = d3.select('#sample-metadata')
    // Use `.html("") to clear any existing metadata
    .html('')
    .append('table')
    .attr('class', 'table table-striped')
    .append('tbody')
    .attr('id', 'metadata_table')

    // write to metadata table
    data.forEach((line) => {
      // Use `Object.entries` to add each key and value pair to the panel
      Object.entries(line).forEach(([key, value]) => {
        // skip wfreq
        if(key == 'WFREQ'){
          return;
        }
        var row = d3.select('#metadata_table').append('tr');
        row.append('td').html(`<strong><font size = '1'>${key}</font></strong>:`);
        row.append('td').html(`<font size ='1'>${value}</font>`);
      });
    });
  });
}

function buildCharts(sample) {
  var defaultURL = '/samples/' + sample;
  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(defaultURL).then(function(record_data) {
    // PIE CHART
      // HINT: You will need to use slice() to grab the top 10 sample_values,
      // otu_ids, and labels (10 each)
    data = [{
      labels: record_data.otu_ids.sort().slice(0,10),
      values: record_data.sample_values.sort().slice(0,10),
      hovertext: record_data.otu_labels.sort().slice(0,10),
      hoverinfo: 'hovertext',
      type: 'pie'
    }];

    var layout = {title: "Top 10 OTUs"}

    Plotly.newPlot('pie', data, layout);

    // BUBBLE CHART
    var trace1 = {
      x: record_data.otu_ids,
      y: record_data.sample_values,
      text: record_data.otu_labels,
      // hoverinfo: 'hovertext',
      mode: 'markers',
      marker: {
        size: record_data.sample_values,
        color: record_data.otu_ids,
        colorscale: "Earth",
        // hoverinfo : '(x,y)+ text'
      }
    }
    var data = [trace1];
    var bubbleLayout = {
         margin: { t: 0 },
         hovermode: "closest",
         xaxis: { title: "OTU ID" }
       };

    Plotly.newPlot('bubble', data, bubbleLayout);
  })
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
      .append("option")
      .text(sample)
      .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();