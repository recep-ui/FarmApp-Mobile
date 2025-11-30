#!/bin/bash

# Render.com build script for frontend

echo "🔧 Installing frontend dependencies..."
npm install

echo "⚛️  Building React application..."
npm run build

echo "✅ Frontend build completed successfully!"
echo "📦 Build directory ready for deployment"
