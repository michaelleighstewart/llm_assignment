@echo off
echo 🐳 Setting up Docker environment...
echo.

REM Check if .env file exists for docker-compose
if not exist .env (
    echo ⚠️  No .env file found for Docker
    echo Creating .env file...
    (
        echo # OpenAI API Key for Docker deployment
        echo OPENAI_API_KEY=your-openai-api-key-here
    ) > .env
    echo ✅ Created .env file
    echo.
)

REM Check if OpenAI API key is set
findstr /C:"your-openai-api-key-here" .env >nul
if %errorlevel%==0 (
    echo ⚠️  WARNING: OpenAI API key not configured in .env
    echo    Please edit .env and add your API key
    echo.
    exit /b 1
)

REM Create data directory if it doesn't exist
if not exist data mkdir data

echo 🏗️  Building Docker image...
docker-compose build

echo.
echo ✅ Docker setup complete!
echo.
echo To start the application with Docker, run:
echo   docker-compose up
echo.
echo To start in detached mode:
echo   docker-compose up -d
echo.
echo To stop the application:
echo   docker-compose down
echo.
echo The application will be available at http://localhost:3000

