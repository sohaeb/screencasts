define(["d3", "model"], function (d3, Model) {
  return function BarChart (container) {
    var model = Model(),
        xAxis = d3.svg.axis().orient("bottom"),
        yAxis = d3.svg.axis().orient("left").ticks(10, "%"),
        svg = d3.select(container).append("svg"),
        g = svg.append("g"),
        xAxisG = g.append("g").attr("class", "x axis"),
        yAxisG = g.append("g").attr("class", "y axis"),
        yAxisText = yAxisG.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end");

    model.margin = {top: 20, right: 20, bottom: 30, left: 40};

    model.when(["box", "margin"], function (box, margin) {
      model.width = box.width - margin.left - margin.right,
      model.height = box.height - margin.top - margin.bottom;
    });

    model.when("box", function (box) {
      svg.attr("width", box.width).attr("height", box.height);
    });

    model.when("margin", function (margin) {
      g.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    });

    model.when("height", function (height) {
      xAxisG.attr("transform", "translate(0," + height + ")");
    });

    model.when(["data", "xAttribute", "width"], function (data, xAttribute, width) {
      model.xScale = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1)
        .domain(data.map(function(d) { return d[xAttribute]; }));
    });

    model.when(["data", "yAttribute", "height"], function (data, yAttribute, height) {
      model.yScale = d3.scale.linear()
        .range([height, 0])
        .domain([0, d3.max(data, function(d) { return d[yAttribute]; })]);
    });

    model.when(["xScale"], function (xScale) {
      xAxis.scale(xScale)
      xAxisG.call(xAxis);
    });

    model.when(["yScale"], function (yScale) {
      yAxis.scale(yScale)
      yAxisG.call(yAxis);
    });

    model.when("yAxisLabel", yAxisText.text, yAxisText);

    model.when(["data", "xAttribute", "yAttribute", "xScale", "yScale", "height"],
        function (data, xAttribute, yAttribute, xScale, yScale, height) {
      var bars = g.selectAll(".bar").data(data);

      bars.enter().append("rect").attr("class", "bar");

      bars.attr("x", function(d) { return xScale(d[xAttribute]); })
        .attr("width", xScale.rangeBand())
        .attr("y", function(d) { return yScale(d[yAttribute]); })
        .attr("height", function(d) { return height - yScale(d[yAttribute]); });

      bars.exit().remove();
    });

    return model;
  };
});
