#!/bin/bash

echo "🔧 Setting up LLM Assignment Development Environment..."
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "⚠️  Creating .env.local from template..."
    cat > .env.local << EOF
# Local SQLite for development
DATABASE_URL=file:./local.db

# OpenAI API Key - Replace with your actual key
OPENAI_API_KEY=your-openai-api-key-here

# Environment
NODE_ENV=development
EOF
    echo "✅ Created .env.local - Please add your OpenAI API key!"
    echo ""
fi

# Check if OpenAI API key is set
if grep -q "your-openai-api-key-here" .env.local; then
    echo "⚠️  WARNING: OpenAI API key not configured in .env.local"
    echo "   Please edit .env.local and add your API key from:"
    echo "   https://platform.openai.com/api-keys"
    echo ""
fi

# Run database migration
echo "📊 Running database migrations..."
npm run db:migrate

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start the development server, run:"
echo "  npm run dev"
echo ""
echo "Then open http://localhost:3000 in your browser"


