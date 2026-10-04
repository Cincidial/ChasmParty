#!/bin/bash

# To be run from the root.
# Starts a simple python http server
# Will build the html and js everytime a file in there is modified

./build.sh
trap 'kill $(jobs -p) 2>/dev/null' INT TERM EXIT

python3 -m http.server --directory docs/ &
inotifywait -mr -e close_write --include '\.(js|html)$' ./src | while read -r dir events file; do
    ./build.sh
done