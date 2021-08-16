library(shiny)
library(glue)
library(purrr)
library(sass)

svg_width <- 700
svg_height <- 400
margin <- list(
  top = 30,
  right = 10,
  bottom = 30,
  left = 50
)
plot_width <- svg_width - margin$left - margin$right
plot_height <- svg_height - margin$top - margin$bottom

ui <- fluidPage(
  tags$head(
    tags$script(src = "node_modules/d3/dist/d3.min.js"),
    tags$style(sass(sass_file("www/style.scss"))),
    tags$script(src = "index.js")
  ),
  tags$h2("D3 Playground"),
  div(
    class = "card",
    tags$svg(
      width = svg_width,
      height = svg_height,
      tags$g(
        class = "plot",
        transform = glue("translate({margin$left}, {margin$top})"),
        tags$g(
          class = "axis-x",
          transform = glue("translate(0, {plot_height})"),
        ),
        tags$g(class = "axis-y")
      )
    )
  )
)

server <- function(input, output, session) {
  render_d3_plot <- function() {
    session$sendCustomMessage("render_d3_plot", list(
      data = transpose(mtcars),
      plotWidth = plot_width,
      plotHeight = plot_height,
      domainX = range(mtcars$disp),
      domainY = range(mtcars$hp)
    ))
  }
  render_d3_plot()
}

shinyApp(ui, server)
