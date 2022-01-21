library(shiny)
library(glue)
library(purrr)
library(readr)
library(sass)

plot_width <- 600
plot_height <- 400

main <- readr::read_csv("data/data_2021_main_dvs-soti_v1.1.csv")

data <- main %>%
  dplyr::select(country = Loc1Country, dplyr::contains("ToolsFor")) %>%
  dplyr::select_if(is.character) %>%
  dplyr::mutate_at(
    dplyr::vars(dplyr::contains("ToolsFor")),
    ~ !is.na(.x)
  ) %>%
  dplyr::rename_all(stringr::str_remove, "ToolsForDV_") %>%
  dplyr::group_by(country) %>%
  dplyr::summarise_all(mean)

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
  render_d3_plot(data)
}

shinyApp(ui, server)
