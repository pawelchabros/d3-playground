$(function() {
  Shiny.addCustomMessageHandler(
    "render_d3_plot",
    async function({ data, width, height }) {
      const topo = await d3.json(
        "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"
      );
      topo.features.forEach((d) => {
        const country = d.properties.name;
        const countryData = data.find((d) => d.country === country);
        d.data = countryData;
      });
      console.log(topo);
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
        const tools = ["Excel", "R", "D3", "Tableau", "PowerBI"];
        const timer = d3.timer(function(elapsed) {
          const animationTime = 19200;
          projection0.rotate([0.025 * elapsed - 120, -((1 - (elapsed / animationTime)) * 15), 0]);
          plot.selectAll("path")
            .attr("d", path)
            .attr("fill", (d) => {
              const tool = tools[Math.min(tools.length - 1, Math.floor((elapsed / animationTime * tools.length)))];
              const color = d.data ? d3.interpolateGnBu(d.data[tool]) : "#eaeaea";
              return color;
            });
          if (elapsed > animationTime) {
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
          return function(_) {
            t = _;
            const projection = setupProjection(() => d3.geoProjection(project), 0.5)
              .preclip(function(stream) {
                const clip = Math.PI / 2 + t * Math.PI / 2;
                return d3.geoClipCircle(clip)(stream);
              });
            const path = d3.geoPath().projection(projection);
            return path(d);
          };
        };
      }

      function projectionTransition(selection) {
        selection.transition()
          .duration(1000)
          .attrTween("d", projectionTween(d3.geoOrthographic(), d3.geoEqualEarth()));
      }

      const plot = d3.select("svg > .plot");

      const graticule = d3.geoGraticule()
        .step([12, 12]);
      selection.graticule = plot.append("path")
        .datum(graticule)
        .attr("class", "graticule");
      selection.graticule.attr("d", path);
      selection.polygon = plot.selectAll(".polygon")
        .data(topo.features)
        .join("path")
        .attr("class", "polygon")
        .attr("fill", (d) => d.data ? d3.interpolateGnBu(d.data["Excel"]) : "#eaeaea");
      selection.polygon.attr("d", path);

      rotate();
    }
  );
});
