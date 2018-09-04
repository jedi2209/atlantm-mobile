#!/usr/bin/env bash -e

echo "NPM run clean\r\n";
npm run clean;

echo "Remove local gradle caches\r\n";

rm -rf $HOME/.gradle/caches/;

echo "Remove node_modules\r\n";
rm -rf node_modules;

echo "Init...[npm i]\r\n";
npm i;