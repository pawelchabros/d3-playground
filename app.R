library(shiny)
library(glue)
library(purrr)
library(sass)

plot_width <- 600
plot_height <- 400

ui <- fluidPage(
  tags$head(
    tags$script(src = "node_modules/d3/dist/d3.min.js"),
    tags$style(sass(sass_file("www/style.scss"))),
    tags$script(src = "index.js")
  ),
  tags$h2("World Map"),
  div(
    class = "card",
    tags$svg(
      width = plot_width,
      height = plot_height,
      tags$g(class = "plot")
    )
  )
)

server <- function(input, output, session) {
  render_d3_plot <- function(data) {
    session$sendCustomMessage("render_d3_plot", list(
      data = transpose(data),
      width = plot_width,
      height = plot_height
    ))
  }
  render_d3_plot(mtcars)
}

shinyApp(ui, server)
