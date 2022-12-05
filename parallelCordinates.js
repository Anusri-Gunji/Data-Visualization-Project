var parallelMargin = { top: 30, right: 30, bottom: 30, left: 120 },
  parallelWidth = 900 - parallelMargin.left - parallelMargin.right;

function drawParallelCoordinates(data, brands, columns) {
  parallelHeight = brands.length < 48 ? 600 : brands.length * 12.5;
  var svg = d3
    .select(".parallel")
    .append("svg")
    .attr("id", "parallel")
    .attr("width", parallelWidth + parallelMargin.left + parallelMargin.right)
    .attr("height", parallelHeight + parallelMargin.top + parallelMargin.bottom)
    .append("g")
    .attr(
      "transform",
      "translate(" + parallelMargin.left + "," + parallelMargin.top + ")"
    );

  var color = d3.scaleOrdinal().domain(brands).range(colors);

  dimensions = columns;
  var y = {};
  var maxValue = 0;
  for (i in dimensions) {
    name = dimensions[i];
    if (name !== "brand") {
      var values = d3.extent(data, function (d) {
        return +Math.max(d[name]);
      });
      maxValue = Math.max(maxValue, values[1]);
    }
  }
  for (i in dimensions) {
    name = dimensions[i];
    if (name !== "brand") {
      y[name] = d3
        .scaleLinear()
        .domain([0, maxValue])
        .range([parallelHeight, 0]);
    } else {
      y[name] = d3
        .scaleLinear()
        .domain([0, brands.length])
        .range([parallelHeight, 0]);
    }
  }

  x = d3.scalePoint().range([0, parallelWidth]).domain(dimensions);

  function path(d) {
    return d3.line()(
      dimensions.map(function (p) {
        if (p === "brand") {
          return [x(p), y[p](brands.indexOf(d[p]))];
        }
        return [x(p), y[p](d[p])];
      })
    );
  }

  svg
    .selectAll("myPath")
    .data(data)
    .enter()
    .append("path")
    .attr("class", function (d) {
      return "line " + d.brand;
    })
    .attr("id", function (d) {
      return "PC" + d.brand;
    })
    .attr("d", path)
    .attr("stroke-width", 1.5)
    .style("fill", "none")
    .style("stroke", function (d) {
      return color(d.brand);
    })
    .style("opacity", 0.75)
    .on("mouseover", function (d) {
      focus.style("display", null);
      if (!isOwnership)
        d3.select(".parallel")
          .selectAll("path")
          .attr("stroke-width", (_, i, j) => {
            return Array.from(j)[i].id === "PC" + d.target.__data__.brand
              ? 4.5
              : 0.5;
          });
    })
    .on("mouseout", function (_) {
      focus.style("display", "none");
      if (!isOwnership)
        d3.select(".parallel").selectAll("path").attr("stroke-width", 1.5);
    })
    .on("mousemove", mousemove);

  svg
    .selectAll("myAxis")
    .data(dimensions)
    .enter()
    .append("g")
    .attr("class", "axis")
    .attr("stroke-width", 1.5)
    .attr("transform", function (d) {
      return "translate(" + x(d) + ")";
    })
    .each(function (d) {
      if (d === "brand") {
        d3.select(this).call(
          d3
            .axisLeft()
            .tickFormat(function (d, i) {
              return brands[i];
            })
            .ticks(brands.length)
            .scale(y[d])
        );
      } else {
        d3.select(this).call(d3.axisLeft().ticks(20).scale(y[d]));
      }
    })
    .append("text")
    .transition()
    .duration(2000)
    .style("text-anchor", "middle")
    .attr("y", -10)
    .text(function (d) {
      return d;
    })
    .style("fill", "black");

  var focus = svg.append("g").attr("class", "focus").style("display", "none");

  

  focus.append("circle").attr("r", 5);

  focus
    .append("rect")
    .attr("class", "vis-tooltip")
    .attr("width", 120)
    .attr("height", 25)
    .attr("x", 10)
    .attr("y", -22)
    .attr("rx", 4)
    .attr("ry", 4);

  focus.append("text").attr("x", 18).attr("y", -4).text("Sales : ");

  focus
    .append("text")
    .attr("class", "tooltip-sales")
    .attr("x", 60)
    .attr("y", -4);

  function mousemove(event) {
    i = Math.ceil(d3.pointer(event)[0] / 95);
    d = event.target.__data__;
    focus.attr(
      "transform",
      "translate(" + d3.pointer(event)[0] + "," + d3.pointer(event)[1] + ")"
    );
    focus.select(".tooltip-sales").text(Object.values(d)[i - 1]);
  }
}
