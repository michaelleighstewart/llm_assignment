# Database Setup - Automatic Initialization

## ✅ Changes Made

Your database now automatically initializes in **all scenarios**:

### 1. **Local Development** (npm run dev)
- ✅ Runs migration on `npm install` (postinstall hook)
- ✅ Runs migration before starting dev server
- ✅ Creates `local.db` automatically

### 2. **Production Build** (npm start)
- ✅ Runs migration before starting server
- ✅ Ensures database exists before accepting requests

### 3. **Docker Deployment**
- ✅ Runs migration in docker-entrypoint.sh
- ✅ Creates database in `/app/data/local.db`
- ✅ Persists via volume mount to `./data`

## 🚀 How to Use

### Local Development

**Quick Setup (Recommended):**
```bash
# Windows
setup-dev.bat

# Linux/Mac
chmod +x setup-dev.sh
./setup-dev.sh
```

**Or manually:**
```bash
npm install          # Database created automatically
npm run dev          # Database initialized before server starts
```

### Docker

**Quick Setup (Recommended):**
```bash
# Windows
setup-docker.bat
docker-compose up

# Linux/Mac
chmod +x setup-docker.sh
./setup-docker.sh
docker-compose up
```

**Or manually:**
```bash
# 1. Create .env file
echo "OPENAI_API_KEY=your-key" > .env

# 2. Start with docker-compose
docker-compose up
```

## 📋 What Happens Automatically

### On npm install
```
npm install
  └─> postinstall hook
      └─> npm run db:migrate
          └─> Creates local.db with tables
```

### On npm run dev
```
npm run dev
  └─> npm run db:migrate
      └─> Ensures database exists
      └─> next dev
          └─> Server starts
```

### On npm start
```
npm start
  └─> npm run db:migrate
      └─> Ensures database exists
      └─> next start
          └─> Server starts
```

### On Docker startup
```
docker-compose up
  └─> Runs docker-entrypoint.sh
      └─> npm run db:migrate
          └─> Creates /app/data/local.db
      └─> node server.js
          └─> Server starts
```

## 🔍 Setup Scripts Included

### Development Setup
- `setup-dev.sh` (Linux/Mac)
- `setup-dev.bat` (Windows)

**These scripts:**
- ✅ Create `.env.local` if missing
- ✅ Run database migrations
- ✅ Check if API key is configured
- ✅ Provide helpful instructions

### Docker Setup
- `setup-docker.sh` (Linux/Mac)
- `setup-docker.bat` (Windows)

**These scripts:**
- ✅ Create `.env` file for docker-compose
- ✅ Check if API key is configured
- ✅ Create data directory
- ✅ Build Docker image
- ✅ Provide helpful instructions

## 📊 Database Locations

| Environment | Database Path | Persistence |
|-------------|--------------|-------------|
| Local Dev | `./local.db` | Git-ignored |
| Docker | `/app/data/local.db` | Volume mount to `./data` |
| Vercel | Postgres (remote) | Cloud-hosted |

## 🔒 Environment Files

### .env.local (Local Development)
```env
DATABASE_URL=file:./local.db
OPENAI_API_KEY=your-key-here
NODE_ENV=development
```

### .env (Docker)
```env
OPENAI_API_KEY=your-key-here
```

Both files are **git-ignored** for security.

## ✅ Benefits

1. **Zero Manual Steps** - Database just works
2. **Idempotent** - Safe to run multiple times
3. **Consistent** - Same behavior across all environments
4. **Fast** - SQLite setup is instant
5. **Reliable** - Migrations run before app starts

## 🐛 Troubleshooting

### Database not created?
Check if migrations ran:
```bash
npm run db:migrate
```

### Permission errors in Docker?
The container runs as user `nextjs` with proper permissions for `/app/data`

### Old database?
Delete and recreate:
```bash
# Local
rm local.db
npm run db:migrate

# Docker
rm -rf data/
docker-compose down -v
docker-compose up
```

## 📝 Migration Files

- `db/migrate-sqlite.ts` - SQLite migrations
- `db/migrate-postgres.ts` - Postgres migrations (for Vercel)
- `db/migrations/sqlite-init.sql` - SQLite schema
- `db/migrations/postgres-init.sql` - Postgres schema

All migrations are **idempotent** (safe to run multiple times).

