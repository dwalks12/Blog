#!/usr/bin/env bash


OUTPUT_FOLDER="builds/test";


mkdir -p "builds/test"

sudo cp -r src/index.html "builds/test"

sudo cp -r src/assets/ "builds/test/assets"


sudo cp -r src/styling/. "builds/test/styling"

echo "Static build done!"
