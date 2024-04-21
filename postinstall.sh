#!/bin/bash

npx patch-package;
# Detect the current operating system
if [[ "$OSTYPE" == "darwin"* ]]; then
  yarn pod-update;
fi