$(function () {
  Shiny.addCustomMessageHandler(
    "render_d3_plot",
    async function ({ data, width, height }) {
      const plot = d3.select("#plot");
      const margin = {
        top: 10,
        right: 10,
        bottom: 50,
        left: 50,
      };
      const panel = {
        width: width - margin.left - margin.right,
        height: height - margin.top - margin.bottom,
      };
      plot
        .select(".panel")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);
      const scale = {
        x: d3.scaleLinear(
          d3.extent(data, (d) => d.mpg),
          [0, panel.width]
        ),
        y: d3.scaleLinear(
          d3.extent(data, (d) => d.disp),
          [0, panel.height]
        ),
      };
      const axis = {
        x: d3.axisBottom(scale.x),
        y: d3.axisLeft(scale.y),
      };
      plot
        .select(".x-axis")
        .attr("transform", `translate(0, ${panel.height})`)
        .call(axis.x);
      plot.select(".y-axis").call(axis.y);
      plot
        .select(".panel")
        .selectAll(".point")
        .data(data)
        .join((enter) => {
          enter
            .append("circle")
            .attr("class", "point")
            .attr("r", 2)
            .attr("cx", (d) => scale.x(d.mpg))
            .attr("cy", (d) => scale.y(d.disp));
        });
    }
  );
});
