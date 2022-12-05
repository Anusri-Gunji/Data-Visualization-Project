var lineMargin = { top: 10, right: 30, bottom: 30, left: 60 },
  lineWidth = 700 - lineMargin.left - lineMargin.right,
  lineHeight = 400 - lineMargin.top - lineMargin.bottom;

function drawLineChart(data, max) {
  var svg = d3
    .select(".lineChart")
    .append("svg")
    .attr("id", "lineChart")
    .attr("width", lineWidth + lineMargin.left + lineMargin.right)
    .attr("height", lineHeight + lineMargin.top + lineMargin.bottom)
    .append("g")
    .attr(
      "transform",
      "translate(" + lineMargin.left + "," + lineMargin.top + ")"
    );
  var parseTime = d3.timeParse("%Y");
  data.forEach(function (d) {
    d.data.forEach(function (e) {
      e.date = parseTime(e.date);
    });
  });

  var x = d3
    .scaleTime()
    .domain(
      d3.extent(data[0].data, function (d) {
        return d.date;
      })
    )
    .range([0, lineWidth - lineMargin.right * 4]);
  svg
    .append("g")
    .transition()
    .duration(2000)
    .attr("transform", "translate(0," + lineHeight + ")")
    .call(d3.axisBottom(x));

  var y = d3.scaleLinear().domain([0, max]).range([lineHeight, 0]);
  svg.append("g").call(d3.axisLeft(y));
  svg
    .append("text")
    .transition()
    .duration(2000)
    .attr("transform", "rotate(-90)")
    .attr("y", 0)
    .attr("x", 0 - lineHeight / 2)
    .attr("dy", "1em")
    .attr("font-size", "16px")
    .attr("font-weight", "bold")
    .style("text-anchor", "middle")
    .text("Total Number of Sales");
  svg
    .append("text")
    .transition()
    .duration(2000)
    .attr("y", lineHeight + 10)
    .attr("x", lineWidth / 2 - lineMargin.right * 2)
    .attr("dy", "1em")
    .attr("font-weight", "bold")
    .attr("font-size", "16px")
    .style("text-anchor", "middle")
    .text("Year");

  data.forEach((element, index) => {
    svg
      .append("path")
      .datum(element.data)
      .attr("id", element.key)
      .attr("class", "overlay")
      .attr("fill", "none")
      .attr("stroke", function (d) {
        return colors[index];
      })
      .attr("stroke-width", 1.5)
      .attr(
        "d",
        d3
          .line()
          .x(function (d) {
            return x(d.date);
          })
          .y(function (d) {
            return y(d.sales);
          })
      )
      .on("mouseover", function () {
        focus.style("display", null);
      })
      .on("mouseout", function () {
        focus.style("display", "none");
      })
      .on("mousemove", mousemove);
  });
  var lineLegend = svg
    .selectAll(".lineLegend")
    .data(data)
    .enter()
    .append("g")
    
    .attr("class", "lineLegend")
    .attr("transform", function (d, i) {
      position = lineWidth - lineMargin.right * 4 + 10;
      return "translate(" + position + "," + i * 20 + ")";
    });
  lineLegend
    .append("text")
    .text(function (d) {
      return d.key;
    })
    .attr("transform", "translate(15,9)");
  lineLegend
    .append("rect")
    
    .attr("fill", function (d, i) {
      return colors[i];
    })
    .attr("width", 10)
    .attr("height", 10);

  var focus = svg.append("g").attr("class", "focus").style("display", "none");

  focus.append("circle").attr("r", 5);

  focus
    .append("rect")
    .attr("class", "vis-tooltip")
    .attr("width", 120)
    .attr("height", 50)
    .attr("x", 10)
    .attr("y", -22)
    .attr("rx", 4)
    .attr("ry", 4);

  focus
    .append("text")
    .attr("class", "tooltip-date")
    .attr("x", 18)
    .attr("y", -2);

  focus.append("text").attr("x", 18).attr("y", 18).text("Sales : ");

  focus
    .append("text")
    .attr("class", "tooltip-sales")
    .attr("x", 60)
    .attr("y", 18);

  var bisectDate = d3.bisector(function (d) {
      return d.date;
    }).left,
    dateFormatter = d3.timeFormat("%Y");

  function mousemove(event) {
    var x0 = x.invert(d3.pointer(event)[0]),
      i = bisectDate(event.target.__data__, x0, 1),
      d0 = event.target.__data__[i - 1],
      d1 = event.target.__data__[i],
      d = x0 - d0.date > d1.date - x0 ? d1 : d0;
    focus.attr("transform", "translate(" + x(d.date) + "," + y(d.sales) + ")");
    focus
      .select(".tooltip-date")
      .text(event.target.id + " - " + dateFormatter(d.date));
    focus.select(".tooltip-sales").text(d.sales);
  }
}
