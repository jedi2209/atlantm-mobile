#!/bin/bash

npx patch-package;
# Detect the current operating system
if [[ "$OSTYPE" == "darwin"* ]]; then
  yarn pod-update;
elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" || "$OSTYPE" == "win32" ]]; then
  # echo "Windows"
else
  # echo "Unknown operating system"
fi