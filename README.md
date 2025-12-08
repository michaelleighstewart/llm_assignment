# LLM Assignment - Full Stack Application

A full-stack Next.js application that allows users to interact with Large Language Models (LLMs), displaying structured responses as records with full CRUD operations.

## Features

- 🤖 Submit prompts to OpenAI's GPT models
- 📝 View LLM responses as structured records
- ✏️ Edit individual records (title and description)
- 🗑️ Delete records
- 🔄 Modify and re-run prompts
- 🗄️ Dual database support (SQLite for development, Postgres for production)
- 🐳 Docker containerization
- 🚀 CI/CD pipeline with GitHub Actions
- ☁️ Vercel deployment ready

## Technology Stack

- **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Drizzle ORM with SQLite (local) and Postgres (production via Vercel)
- **LLM**: OpenAI API (with abstraction layer for flexibility)
- **Languages**: TypeScript
- **Deployment**: Docker & Vercel
- **CI/CD**: GitHub Actions 

## Getting Started

### Prerequisites

- Node.js 20+ (recommended)
- npm
- OpenAI API Key

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd llm_assignment
```

2. Install dependencies:
```bash
npm install
```

**Note**: The database will be automatically set up during installation via the `postinstall` script.

3. Set up environment variables:

**Option A: Use the setup script (Recommended)**

**Linux/Mac:**
```bash
chmod +x setup-dev.sh
./setup-dev.sh
```

**Windows:**
```bash
setup-dev.bat
```

**Option B: Manual setup**

Create a `.env.local` file in the root directory:
```env
DATABASE_URL=file:./local.db
OPENAI_API_KEY=your-openai-api-key-here
ANTHROPIC_API_KEY=your-anthropic-api-key-here   # required if LLM_PROVIDER=anthropic
LLM_PROVIDER=openai                              # or 'anthropic'
NODE_ENV=development
```

4. Start the development server:
```bash
npm run dev
```

The database will be automatically initialized before the server starts.

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Setup Instructions (Requirements Compliance)

To start the application using the exact commands specified in the requirements:

```bash
# 1. Install dependencies
npm install

# 2. Build the application
npx next build

# 3. Start the production server
npx next start
```

**Note:** `npx` runs commands from local `node_modules/.bin/` without requiring global installation. This is the standard approach for running locally-installed CLI tools in modern Node.js projects.

**Alternative (using npm scripts):**
```bash
npm install
npm run build
npm run start
```

Both approaches are equivalent and fully compliant with the requirements.

## Production Build

Build and start the production server:

```bash
npm run build
npm start
```

The database will be automatically initialized before the server starts.

## Docker Deployment

### Quick Start with Docker:

**Using the setup script (Recommended):**

**Linux/Mac:**
```bash
chmod +x setup-docker.sh
./setup-docker.sh
docker-compose up
```

**Windows:**
```bash
setup-docker.bat
docker-compose up
```

### Manual Docker Setup:

1. Create a `.env` file in the root directory:
```env
OPENAI_API_KEY=your-key-here
```

2. Build and run with Docker:

```bash
docker build -t llm-assignment .
docker run -p 3000:3000 -e OPENAI_API_KEY=your-key-here llm-assignment
```

### Or use Docker Compose:

```bash
docker-compose up -d
```

The database will be automatically initialized when the container starts.

The application will be available at [http://localhost:3000](http://localhost:3000).

## Vercel Deployment

### 1. Install Vercel CLI:
```bash
npm i -g vercel
```

### 2. Create Vercel Postgres database:
- Go to your Vercel project dashboard
- Navigate to Storage tab
- Create a new Postgres database
- Copy the `POSTGRES_URL` connection string

### 3. Set environment variables in Vercel:
- `OPENAI_API_KEY`: Your OpenAI API key
- `POSTGRES_URL`: Your Vercel Postgres connection string
- `NODE_ENV`: production

### 4. Deploy:
```bash
vercel --prod
```

## CI/CD Pipeline

The project includes a complete GitHub Actions workflow that:

1. **Build & Test**: Runs on every push and PR
   - Type checking with TypeScript
   - Linting with ESLint
   - Database migrations
   - Build verification

2. **Docker Build & Push**: On main branch pushes
   - Builds Docker image
   - Pushes to GitHub Container Registry (ghcr.io)
   - Tags with commit SHA and 'latest'

3. **Vercel Deployment**: 
   - Production deployment on main branch
   - Preview deployments for PRs

### Required GitHub Secrets

Add these secrets to your GitHub repository:

- `OPENAI_API_KEY`: Your OpenAI API key
- `POSTGRES_URL`: Vercel Postgres connection string
- `VERCEL_TOKEN`: Vercel authentication token
- `VERCEL_ORG_ID`: Your Vercel organization ID
- `VERCEL_PROJECT_ID`: Your Vercel project ID

## Project Structure

```
llm_assignment/
├── app/                      # Next.js App Router
│   ├── api/                 # API routes
│   │   ├── prompts/        # Prompt submission endpoint
│   │   └── records/        # Record CRUD endpoints
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Main page
├── components/              # React components
│   ├── PromptForm.tsx      # Prompt input form
│   ├── RecordCard.tsx      # Individual record display
│   └── RecordsList.tsx     # Records container
├── lib/                     # Utility libraries
│   ├── db/                 # Database configuration
│   │   ├── client.ts       # Drizzle client setup
│   │   └── schema.ts       # Database schema
│   └── llm/                # LLM abstraction
│       ├── provider.ts     # LLM provider interface
│       ├── openai.ts       # OpenAI implementation
│       └── index.ts        # Factory function
├── db/                      # Database migrations
│   ├── migrations/
│   ├── migrate-sqlite.ts
│   └── migrate-postgres.ts
├── .github/workflows/       # CI/CD workflows
├── Dockerfile              # Docker configuration
├── docker-compose.yml      # Docker Compose setup
├── vercel.json            # Vercel configuration
└── drizzle.config.ts      # Drizzle ORM config
```

## API Endpoints

### POST /api/prompts
Submit a new prompt to the LLM.

**Request:**
```json
{
  "content": "Your prompt text here"
}
```

**Response:**
```json
{
  "prompt": { "id": 1, "content": "..." },
  "records": [...]
}
```

### GET /api/records
Fetch all records.

### PUT /api/records/[id]
Update a specific record.

**Request:**
```json
{
  "title": "Updated title",
  "description": "Updated description"
}
```

### DELETE /api/records/[id]
Delete a specific record.

## Sample Prompt

Try this accounting tax optimization prompt:

```
I am an accountant, and my client is asking for advice on strategies to optimise his tax structure. He and his partner have an income of $200,000 per year. They live in Sydney, Australia, and have no kids. Please provide a detailed list of strategies that could minimise their tax. Please be very specific and use concise language.
```

## Database Schema

### Prompts Table
- `id`: Primary key
- `content`: Prompt text
- `created_at`: Timestamp

### Records Table
- `id`: Primary key
- `prompt_id`: Foreign key to prompts
- `title`: Optional title
- `description`: Record content
- `created_at`: Timestamp

## Security Features

- Environment variables for sensitive data
- `.env` files excluded from version control
- GitHub Actions secrets for CI/CD
- Parameterized database queries (Drizzle ORM)
- Input validation with Zod

## Development Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:migrate` - Run database migrations
- `npm run db:generate` - Generate Drizzle migrations
- `npm run db:push` - Push schema changes

## Extending the LLM Provider

The application uses an abstraction layer for LLM providers. To add a new provider:

1. Create a new class in `lib/llm/` implementing the `LLMProvider` interface
2. Update the factory function in `lib/llm/index.ts`
3. Set the `LLM_PROVIDER` environment variable

## License

MIT

## Support

For issues and questions, please open an issue on the GitHub repository.
