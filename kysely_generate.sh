#!/bin/sh

read -p "Do you want to generate code? (y/n): " choice
case "$choice" in 
  y|Y ) 
    echo "Generating code..."
    POSTGRES_URL=$(node -p 'require("dotenv").config().parsed.POSTGRES_URL') && kysely-codegen --log-level=debug --print --dialect=postgres --url=$POSTGRES_URL
    ;;
  * ) 
    echo "Skipping code generation..."
    ;;
esac
