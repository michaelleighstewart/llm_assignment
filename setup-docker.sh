#!/bin/bash

echo "🐳 Setting up Docker environment..."
echo ""

# Check if .env file exists for docker-compose
if [ ! -f .env ]; then
    echo "⚠️  No .env file found for Docker"
    echo "Creating .env file..."
    cat > .env << EOF
# OpenAI API Key for Docker deployment
OPENAI_API_KEY=your-openai-api-key-here
EOF
    echo "✅ Created .env file"
    echo ""
fi

# Check if OpenAI API key is set
if grep -q "your-openai-api-key-here" .env; then
    echo "⚠️  WARNING: OpenAI API key not configured in .env"
    echo "   Please edit .env and add your API key"
    echo ""
    exit 1
fi

# Create data directory if it doesn't exist
mkdir -p data

echo "🏗️  Building Docker image..."
docker-compose build

echo ""
echo "✅ Docker setup complete!"
echo ""
echo "To start the application with Docker, run:"
echo "  docker-compose up"
echo ""
echo "To start in detached mode:"
echo "  docker-compose up -d"
echo ""
echo "To stop the application:"
echo "  docker-compose down"
echo ""
echo "The application will be available at http://localhost:3000"

