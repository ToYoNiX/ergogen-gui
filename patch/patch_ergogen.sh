#!/bin/sh
# Pull @ceoloide footprint library
if [ ! -d node_modules/ergogen ]; then
  echo "Installing Ergogen..."
  npm install ergogen
fi  
if [ -d node_modules/ergogen ]; then
  echo "Patching Ergogen..."
  if [ -d node_modules/ergogen/src/footprints/ceoloide ]; then 
    echo "Removing existing @ceoloide's footprint library"
    rm -rf node_modules/ergogen/src/footprints/ceoloide
  fi
  git clone https://github.com/ceoloide/ergogen-footprints.git node_modules/ergogen/src/footprints/ceoloide
  # Add the footprints to the index
  echo "Patching footprints/index.js..."
  cp -f patch/footprints_index.js node_modules/ergogen/src/footprints/index.js

else
  echo "Directory node_modules/ergogen not found."
fi