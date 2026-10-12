#!/bin/bash

# To be run from root
# Compiles new docs files for serving

html_index_file_content=$(cat src/index.html)
find src/templates -type f -name "*.html" -exec cat {} \; -exec echo "" \; > docs/templates.tmp
find src/js -type f -name "*.js" -exec cat {} \; -exec echo "" \; > docs/src.js

sed -e '/#REPLACE_WITH_TEMPLATES#/{
    r docs/templates.tmp
    d
}' src/index.html > docs/index.html
rm -f docs/templates.tmp
