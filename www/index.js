$(function () {
  Shiny.addCustomMessageHandler(
    "render_d3_plot",
    function ({ data, x, y, plotWidth, plotHeight, domainX, domainY }) {
      const plot = d3.select("svg > .plot");
    }
  );
});
