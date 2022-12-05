var bubbleWidth = 700;
var bubbleHeight = 600;

function updateBubbles(data) {
  var svg = d3
    .select(".bubble")
    .append("svg")
    .attr("id", "bubble")
    .attr("width", bubbleWidth)
    .attr("height", bubbleHeight);

  var g = svg.append("g").selectAll("circle").data(data).enter().append("g");

  var node = g
    .append("circle")
    .attr("r", function (d) {
      return d.key.length < 5 ? 24 : 5 * d.key.length;
    })
    .attr("cx", bubbleWidth / 2)
    .attr("cy", bubbleHeight / 2)
    .style("fill", function (_, i) {
      return colors[i];
    })
    .style("fill-opacity", 0.5)
    .attr("stroke", function (_, i) {
      return colors[i];
    })
    .style("stroke-width", 4)
    .on("click", function (d) {
      if (!isRegion) selectedRegion = d.target.__data__.key;
      if (!isOwnership) selectBubble(d.target.__data__.key);
    })
    .on("mouseover", function (d) {
      if (!isOwnership) {
        d3.select(".lineChart")
          .selectAll("path")
          .attr("stroke-width", (_, i, j) => {
            return Array.from(j)[i].id === d.target.__data__.key ? 4.5 : 0.5;
          });
        if (isRegion) {
          var values = data.filter(
            (element) => element.key === d.target.__data__.key
          )[0].values;
          ind = -1;
          d3.select(".parallel")
            .selectAll("path")
            .attr("stroke-width", (d) => {
              return values.filter((e) => e.brand === d?.brand).length !== 0
                ? 4.5
                : 0.5;
            })
            .style("stroke", (d, i) => {
              if (d === null) return "#000";
              if (values.filter((e) => e.brand === d?.brand).length !== 0) {
                ind += 1;
                return colors[ind];
              }
              return colors[values.length + i];
            });
        }
      }
    })
    .on("mouseout", function (_) {
      if (!isOwnership) {
        d3.select(".lineChart").selectAll("path").attr("stroke-width", 1.5);
        d3.select(".parallel").selectAll("path").attr("stroke-width", 1.5);
      }
    });

  var simulation = d3
    .forceSimulation()
    .force(
      "center",
      d3
        .forceCenter()
        .x(bubbleWidth / 2)
        .y(bubbleHeight / 2)
    )
    .force("charge", d3.forceManyBody().strength(0.5))
    .force(
      "collide",
      d3.forceCollide().strength(0.01).radius(60).iterations(1)
    );

  simulation.nodes(data).on("tick", function (d) {
    node
      .attr("cx", function (d) {
        return d.x;
      })
      .attr("cy", function (d) {
        return d.y;
      });
    d3.selectAll("#bubbleText").remove();
    g.append("text")
      .attr("id", "bubbleText")
      .attr("x", function (d) {
        return d.x;
      })
      .attr("y", function (d) {
        return d.y + 2.5;
      })
      .style("text-anchor", "middle")
      .text((d) => {
        return d.key;
      });
  });
}
