#!/usr/bin/env bash
# Exit on error
set -o errexit

# Install dependencies
npm install
# Uncomment this line if you need to build your project
npm run build

# Ensure the Puppeteer cache directory exists
PUPPETEER_CACHE_DIR=/opt/render/.cache/puppeteer
mkdir -p $PUPPETEER_CACHE_DIR

# Install Puppeteer and download Chrome
npx puppeteer browsers install chrome

# Store Puppeteer cache in the build cache
echo "...Storing Puppeteer Cache in Build Cache"
mkdir -p /opt/render/project/src/.cache/puppeteer
cp -R $PUPPETEER_CACHE_DIR/* /opt/render/project/src/.cache/puppeteer/