#!/bin/bash

previous_checksum="dummy"
while [ 1 ]; do
  checksum=$(md5 www/style.scss | md5)
  if [ "$checksum" != "$previous_checksum" ]; then
    touch -m app.R
  fi
  previous_checksum="$checksum"
  sleep 1
done &

Rscript -e '
  options(shiny.autoreload = TRUE);
  shiny::runApp(launch.browser = TRUE)
'
