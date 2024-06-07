#!/bin/sh

# Check for -y flag
AUTO_YES=false
while getopts ":y" opt; do
  case $opt in
    y)
      AUTO_YES=true
      ;;
    \?)
      echo "Invalid option: -$OPTARG" >&2
      exit 1
      ;;
  esac
done

if [ "$AUTO_YES" = true ]; then
  choice="y"
else
  read -p "Do you want to generate kysely schema (recommended)? (y/n): " choice
fi

case "$choice" in 
  y|Y ) 
    echo "Generating code..."
    node -p 'require("dotenv").config().parsed.POSTGRES_URL'
    process.env.POSTGRES_URL
    node -p process.env.POSTGRES_URL
    POSTGRES_URL=$(node -p 'require("dotenv").config().parsed.POSTGRES_URL')
    echo $POSTGRES_URL
    kysely-codegen --log-level=debug --print --dialect=postgres --url=$POSTGRES_URL
    ;;
  * ) 
    echo "Skipping code generation..."
    ;;
esac