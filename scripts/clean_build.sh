#!/usr/bin/env bash

if [ -z $OUTPUT_FOLDER ]; then
	OUTPUT_FOLDER="web";
fi

if [ -z $CLEAN_CACHE_ONLY ]; then
	rm -rf "./$OUTPUT_FOLDER"
else
	rm -rf "./$OUTPUT_FOLDER/ssi/cache/*.txt"
fi
