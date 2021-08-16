$(function () {
  Shiny.addCustomMessageHandler(
    "render_d3_plot",
    function ({ data, plotWidth, plotHeight, domainX, domainY }) {
      const scaleX = d3.scaleLinear(domainX, [0, plotWidth]);
      const scaleY = d3.scaleLinear(domainY, [plotHeight, 0]);

      const axisX = d3.axisBottom(scaleX).tickSize(-plotHeight);
      const axisY = d3.axisLeft(scaleY).tickSize(-plotWidth);

      plot = d3.select("svg > .plot");
      plot.select(".axis-x").transition().call(axisX);
      plot.select(".axis-y").transition().call(axisY);
      plot
        .selectAll(".point")
        .data(data)
        .join(
          (enter) => {
            enter
              .append("circle")
              .attr("class", "point")
              .attr("r", 3)
              .attr("cx", (d) => scaleX(d.disp))
              .attr("cy", (d) => scaleY(d.hp));
          },
          (update) => {
            update.transition()
              .attr("cx", (d) => scaleX(d.disp))
              .attr("cy", (d) => scaleY(d.hp));
          }
        );
    }
  );
});
