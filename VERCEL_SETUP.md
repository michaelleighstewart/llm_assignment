# Setup Instructions for Vercel Deployment

## Prerequisites
- A Vercel account
- GitHub repository with your code
- OpenAI API key

## Step 1: Create Vercel Project

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js

## Step 2: Create Postgres Database

1. In your Vercel project dashboard, go to the "Storage" tab
2. Click "Create Database"
3. Select "Postgres"
4. Choose a name for your database
5. Select a region close to your users
6. Click "Create"
7. Once created, go to the `.env.local` tab and copy the `POSTGRES_URL`

## Step 3: Configure Environment Variables

In your Vercel project settings:

1. Go to "Settings" → "Environment Variables"
2. Add the following variables:

| Name | Value | Environment |
|------|-------|-------------|
| `OPENAI_API_KEY` | Your OpenAI API key | Production, Preview, Development |
| `POSTGRES_URL` | Your Postgres connection string | Production, Preview |
| `NODE_ENV` | `production` | Production |

## Step 4: Get Vercel Credentials for GitHub Actions

1. Generate a Vercel token:
   - Go to [Account Settings → Tokens](https://vercel.com/account/tokens)
   - Create a new token
   - Copy it (you won't see it again)

2. Get your Organization ID:
   - Go to your project settings
   - Under "General", find "Project ID" and "Team ID"
   - Team ID = Organization ID

3. Get your Project ID:
   - Same location as above

## Step 5: Configure GitHub Secrets

In your GitHub repository:

1. Go to "Settings" → "Secrets and variables" → "Actions"
2. Add the following secrets:

| Secret Name | Value |
|-------------|-------|
| `OPENAI_API_KEY` | Your OpenAI API key |
| `POSTGRES_URL` | Your Vercel Postgres connection string |
| `VERCEL_TOKEN` | Token from Step 4 |
| `VERCEL_ORG_ID` | Organization ID from Step 4 |
| `VERCEL_PROJECT_ID` | Project ID from Step 4 |

## Step 6: Run Database Migration

After first deployment, you may need to manually run the Postgres migration:

Option 1: Use Vercel CLI locally
```bash
# Install Vercel CLI
npm i -g vercel

# Link to your project
vercel link

# Run migration
vercel env pull
POSTGRES_URL="your-postgres-url" tsx db/migrate-postgres.ts
```

Option 2: Add a one-time script in Vercel
1. Go to your project → "Settings" → "Functions"
2. You can trigger the migration through the Vercel dashboard SQL editor
3. Copy the contents of `db/migrations/postgres-init.sql`
4. Run it in the SQL editor

## Step 7: Deploy

### Automatic Deployment
- Push to your main branch
- GitHub Actions will automatically deploy to Vercel

### Manual Deployment
```bash
vercel --prod
```

## Verification

1. Visit your Vercel deployment URL
2. Submit a test prompt
3. Verify records are created and can be edited/deleted

## Troubleshooting

### Database Connection Issues
- Verify `POSTGRES_URL` is correctly set
- Check that the Postgres database is in the same region as your deployment
- Ensure the connection string includes SSL parameters

### Build Failures
- Check build logs in Vercel dashboard
- Verify all environment variables are set
- Ensure dependencies are correctly listed in `package.json`

### OpenAI API Errors
- Verify your API key is valid
- Check your OpenAI account has credits
- Review rate limits and quotas

## Monitoring

- View logs in Vercel dashboard under "Deployments" → "Functions"
- Set up Vercel Analytics for performance monitoring
- Configure error tracking (e.g., Sentry) for production monitoring

## Cost Considerations

- Vercel free tier includes:
  - 100GB bandwidth
  - 100GB-Hrs serverless function execution
- Vercel Postgres free tier:
  - 256 MB storage
  - 60 hours compute per month
- Monitor usage in Vercel dashboard
- OpenAI API costs vary by model and usage

