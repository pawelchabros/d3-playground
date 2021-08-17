library(shiny)
library(glue)
library(purrr)
library(sass)

svg_width <- 600
svg_height <- 350
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
  render_d3_plot <- function(data, x, y) {
    get_domain <- function(values) {
      if (class(values) == "numeric") {
        return(range(values))
      } else if (class(values) == "character") {
        return(unique(values))
      }
    }
    session$sendCustomMessage("render_d3_plot", list(
      data = transpose(data),
      x = x,
      y = y,
      plotWidth = plot_width,
      plotHeight = plot_height,
      domainX = get_domain(data[, x]),
      domainY = get_domain(data[, y])
    ))
  }
  render_d3_plot(mtcars, "disp", "hp")
}

shinyApp(ui, server)
