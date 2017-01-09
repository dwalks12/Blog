#!/usr/bin/env bash

CURRBRANCH=$(git rev-parse --abbrev-ref HEAD)

error_exit () {
  echo "ERROR:" "$1" 1>&2
  exit 1
}

BUILDTYPE=$1
if [ "$BUILDTYPE" = "test" ]; then
	FROMBRANCH="development"
	TOBRANCH="test"
elif [ "$BUILDTYPE" = "live" ]; then
	FROMBRANCH="test"
	TOBRANCH="master"
else
	error_exit "Please specify proper BUILDTYPE (test or live)"
fi

echo ""
echo "#  STARTING DEPLOY FROM '$FROMBRANCH' TO '$TOBRANCH'  #"
echo ""

repo_is_clean() {
	return "$(git status --porcelain | wc -l | xargs)";
}

repo_is_clean || error_exit "Please make sure that the repository is not dirty."
(git checkout -q $FROMBRANCH && git pull -q) || error_exit "Could not update $FROMBRANCH branch."
npm run lint || error_exit "Please make sure there are no linter errors in $FROMBRANCH branch."
npm run build:$BUILDTYPE || error_exit "Could not make $BUILDTYPE build."
git push -q origin $FROMBRANCH || error_exit "Could not push $FROMBRANCH branch."

echo "Pushed updates to $FROMBRANCH."

(git checkout -q $TOBRANCH && git pull) || error_exit "Could not update $TOBRANCH branch."
git merge --no-ff --no-edit $FROMBRANCH || error_exit "Could not merge $FROMBRANCH into $TOBRANCH."
git push origin $TOBRANCH || error_exit "Could not push $TOBRANCH branch."

echo "Pushed updates to $TOBRANCH."

git checkout -q $CURRBRANCH
