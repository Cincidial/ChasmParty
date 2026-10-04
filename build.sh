#!/bin/bash

# To be run from root
# Compiles new docs files for serving

html_index_file_content=$(cat src/index.html)
for file in src/templates/*.html; do
    cat "$file"
    echo ""
done > docs/templates.tmp
for file in src/js/*.js; do
    cat "$file"
    echo ""
done > docs/src.js

sed -e '/#REPLACE_WITH_TEMPLATES#/{
    r docs/templates.tmp
    d
}' src/index.html > docs/index.html
rm -f docs/templates.tmp
