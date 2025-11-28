@echo off
echo 🔧 Setting up LLM Assignment Development Environment...
echo.

REM Check if .env.local exists
if not exist .env.local (
    echo ⚠️  Creating .env.local from template...
    (
        echo # Local SQLite for development
        echo DATABASE_URL=file:./local.db
        echo.
        echo # OpenAI API Key - Replace with your actual key
        echo OPENAI_API_KEY=your-openai-api-key-here
        echo.
        echo # Environment
        echo NODE_ENV=development
    ) > .env.local
    echo ✅ Created .env.local - Please add your OpenAI API key!
    echo.
)

REM Check if OpenAI API key is set
findstr /C:"your-openai-api-key-here" .env.local >nul
if %errorlevel%==0 (
    echo ⚠️  WARNING: OpenAI API key not configured in .env.local
    echo    Please edit .env.local and add your API key from:
    echo    https://platform.openai.com/api-keys
    echo.
)

REM Run database migration
echo 📊 Running database migrations...
call npm run db:migrate

echo.
echo ✅ Setup complete!
echo.
echo To start the development server, run:
echo   npm run dev
echo.
echo Then open http://localhost:3000 in your browser

