var d3 = require('d3');

var svg = d3.select('svg');

svg.selectAll('circle')
  .data([1000, 57, 112, 293])
  .enter().append('circle')
  .attr('cy', 60)
  .attr('cx', function(d, i) { return i*100 + 30; })
  .attr('r', function(d) { return Math.sqrt(d); });