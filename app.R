library(shiny)
library(sass)
library(purrr)

plot_width <- 600
plot_height <- 400

ui <- fluidPage(
  tags$head(
    tags$script(src = "node_modules/d3/dist/d3.min.js"),
    tags$style(sass(sass_file("www/style.scss"))),
    tags$script(src = "index.js")
  ),
  tags$h2("D3-Playground"),
  div(
    class = "card",
    tags$svg(
      id = "plot",
      width = plot_width,
      height = plot_height,
      tags$g(
        class = "panel",
        tags$g(class = "x-axis"),
        tags$g(class = "y-axis")
      )
    )
  )
)

server <- function(input, output, session) {
  render_d3_plot <- function(data) {
    session$sendCustomMessage("render_d3_plot", list(
      data = transpose(mtcars),
      width = plot_width,
      height = plot_height
    ))
  }
  render_d3_plot(data)
}

shinyApp(ui, server)
