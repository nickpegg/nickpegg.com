#!/bin/sh

if ! which gsutil > /dev/null; then
  echo "You need to install gsutil first!"
  exit 1
fi

if [ "x$1" = "xtest" ]; then
  gsutil -m rsync -d -r build/ gs://test.nickpegg.com
else
  echo "I don't know how to publish to prod yet!"
fi
