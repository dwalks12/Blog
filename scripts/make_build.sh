#!/usr/bin/env bash

#if [ "$(git status --porcelain | wc -l | xargs)" -ne "0" ]; then
#	echo "Please commit all changes before building.";
#	exit -1
#fi

if [ -z $NODE_ENV ]; then
	echo "Please specify NODE_ENV.";
	exit -1;
fi

if [ -z $OUTPUT_FOLDER ]; then
	echo "Please specify OUTPUT_FOLDER.";
	exit -1;
fi


npm run build

git add .
git commit -q -m "Creating '$NODE_ENV' build. [$(date)]"

echo "Build done.";
