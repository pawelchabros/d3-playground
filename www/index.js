$(function() {
  Shiny.addCustomMessageHandler(
    "render_d3_plot",
    function({ data, width, height }) {

      const selection = {};

      function setupProjection(projectionType, scale) {
        const projection = projectionType()
          .scale(scale)
          .translate([width / 2, height / 2]);
        return projection;
      }

      const projection0 = setupProjection(d3.geoOrthographic, 125);
      const path = d3.geoPath().projection(projection0);

      function rotate() {
        const timer = d3.timer(function(elapsed) {
          projection0.rotate([0.04 * elapsed - 120, 0, 0]);
          plot.selectAll("path")
            .attr("d", path);
          if (elapsed > 3000) {
            timer.stop();
            projectionTransition(selection.graticule);
            projectionTransition(selection.polygon);
          }
        });
      }

      function projectionTween(projection0, projection1) {
        return function(d) {
          let t = 0;
          function project(lambda, fi) {
            lambda *= 180 / Math.PI;
            fi *= 180 / Math.PI;
            const p0 = projection0([lambda, fi]);
            const p1 = projection1([lambda, fi]);
            return [(1 - t) * p0[0] + t * p1[0], (1 - t) * -p0[1] + t * -p1[1]];
          }
          const projection = setupProjection(() => d3.geoProjection(project), 0.5);
          const path = d3.geoPath()
            .projection(projection);
          return function(_) {
            t = _;
            return path(d);
          };
        };
      }

      function projectionTransition(selection) {
        selection.transition()
          .duration(1000)
          .attrTween("d", projectionTween(d3.geoOrthographic(), d3.geoEqualEarth()));
      }

      console.log(data);
      const plot = d3.select("svg > .plot");

      d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
        .then(render);

      function render(topo) {
        const graticule = d3.geoGraticule()
          .step([12, 12]);
        selection.graticule = plot.append("path")
          .datum(graticule)
          .attr("class", "graticule")
          .style("fill", "white")
          .style("stroke", "grey")
          .style("stroke-width", 0.3);
        selection.graticule.attr("d", path);
        selection.polygon = plot.selectAll(".polygon")
          .data(topo.features)
          .join("path")
          .attr("class", "polygon")
          .attr("fill", "steelblue");
        selection.polygon.attr("d", path);
      }
      rotate();
    }
  );
});
