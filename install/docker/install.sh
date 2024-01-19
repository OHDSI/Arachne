#!/bin/bash

# Create necessary Folders
folders=(
  "~/ArachneDatanode"
)

for folder in "${folders[@]}"; do
  if [ ! -d "$folder" ]; then
    mkdir -p "$folder"
    echo "Folder $folder was created."
  else
    echo "Folder $folder already exists. Skipping creation."
  fi
done


cp datanode.env ~/ArachneDatanode/datanode.env
cd ~/ArachneDatanode
wget https://storage.googleapis.com/arachne-datanode/descriptor_base.json

echo "Script completed."