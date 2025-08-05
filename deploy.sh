#!/bin/bash

echo "🚀 Building TallyPrime Assistant for deployment..."

# Clean previous builds
rm -rf dist

# Build the client
echo "📦 Building frontend..."
npm run build:client

# Create a simple deployment package
echo "📁 Creating deployment package..."
mkdir -p deploy-package
cp -r dist/* deploy-package/
cp package.json deploy-package/
cp -r server deploy-package/
cp -r shared deploy-package/

echo "✅ Deployment package ready in ./deploy-package/"
echo "📋 You can now:"
echo "   1. Upload ./deploy-package/ to any static hosting service"
echo "   2. Or run 'npm install && npm start' in the deploy-package directory"
echo "   3. For full functionality, deploy to Railway, Render, or similar Node.js hosting"

echo ""
echo "🌐 For quick testing, you can run:"
echo "   cd deploy-package && npm install && npm start"
