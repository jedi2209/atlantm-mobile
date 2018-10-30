#!/usr/bin/env bash -e

echo "NPM run clean";
npm run clean;

echo "Remove local gradle caches";

rm -rf $HOME/.gradle/caches/;

echo "Remove node_modules";
rm -rf node_modules;

echo "Init...[npm i]";
npm i;
