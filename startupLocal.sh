#!/bin/bash

# To be run from the root.
# Starts a simple python http server
# Will build the html and js everytime a file in there is modified

trap 'kill $(jobs -p)' EXIT

python3 -m http.server --directory docs/ &
fswatch -or ./src | xargs -n1 sh -c './build.sh' &
wait
