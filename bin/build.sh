#!/bin/bash
echo 'building for' $ENV 'environment'
rm -rf ./dist/*
NODE_ENV=$ENV ./node_modules/.bin/eslint ./src/standalone/**.js
NODE_ENV=$ENV ./node_modules/.bin/rollup -c ./rollup/standalone.js --environment ENV:$ENV
NODE_ENV=$ENV ./node_modules/.bin/terser --compress --mangle -- dist/notStore.js > ./dist/notStore.min.js
exit 0;
