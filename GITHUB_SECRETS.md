# GitHub Secrets Configuration Guide

This document outlines all the secrets that need to be configured in your GitHub repository for the CI/CD pipeline to work properly.

## Required GitHub Secrets

Navigate to your repository → Settings → Secrets and variables → Actions → New repository secret

### 1. OPENAI_API_KEY

**Description**: Your OpenAI API key for LLM integration

**How to get it**:
1. Go to https://platform.openai.com/api-keys
2. Click "Create new secret key"
3. Copy the key (you won't see it again)

**Value format**: `sk-...` (starts with sk-)

---

### 2. POSTGRES_URL

**Description**: Vercel Postgres database connection string (for production)

**How to get it**:
1. Create a Vercel project and link your repository
2. Go to Storage → Create Database → Postgres
3. Copy the `POSTGRES_URL` from the `.env.local` tab

**Value format**: `postgres://...`

**Note**: Only needed if you're deploying to Vercel

---

### 3. VERCEL_TOKEN

**Description**: Authentication token for Vercel CLI deployments

**How to get it**:
1. Go to https://vercel.com/account/tokens
2. Click "Create Token"
3. Give it a descriptive name (e.g., "GitHub Actions")
4. Copy the token

**Value format**: Long alphanumeric string

---

### 4. VERCEL_ORG_ID

**Description**: Your Vercel team/organization ID

**How to get it**:
1. Go to your Vercel project settings
2. Look under "General" → "Project Settings"
3. Find "Organization ID" or "Team ID"

**Alternative method**:
```bash
# Install Vercel CLI
npm i -g vercel

# Login and link project
vercel link

# Check .vercel/project.json for orgId
```

---

### 5. VERCEL_PROJECT_ID

**Description**: Your Vercel project ID

**How to get it**:
1. Go to your Vercel project settings
2. Look under "General" → "Project Settings"
3. Find "Project ID"

**Alternative method**:
```bash
# After running 'vercel link'
# Check .vercel/project.json for projectId
```

---

## Docker Registry (Optional)

The CI/CD pipeline uses GitHub Container Registry (ghcr.io) which automatically uses the `GITHUB_TOKEN` secret provided by GitHub Actions. No additional configuration is needed.

## Verification Checklist

After adding all secrets, verify:

- [ ] All 5 secrets are added to your repository
- [ ] Secret names match exactly (case-sensitive)
- [ ] No extra spaces in secret values
- [ ] OPENAI_API_KEY starts with "sk-"
- [ ] POSTGRES_URL starts with "postgres://"
- [ ] Vercel secrets are from the same project

## Testing the Setup

1. Push a commit to your main branch
2. Go to Actions tab in GitHub
3. Watch the workflow run
4. All jobs should complete successfully

## Troubleshooting

### Build fails with "OPENAI_API_KEY not set"
- Verify the secret name is exactly `OPENAI_API_KEY`
- Check for typos in the secret value

### Vercel deployment fails
- Ensure all three Vercel secrets are set correctly
- Verify the project is linked in Vercel dashboard
- Check that VERCEL_TOKEN has not expired

### Docker push fails
- Ensure GitHub Actions has permission to write packages
- Go to Settings → Actions → General → Workflow permissions
- Select "Read and write permissions"

## Security Best Practices

1. **Never commit secrets to the repository**
2. **Rotate tokens periodically** (every 90 days recommended)
3. **Use environment-specific secrets** (separate keys for dev/prod)
4. **Limit token permissions** to only what's needed
5. **Monitor API usage** for unusual activity

## Local Development

For local development, create a `.env.local` file (never commit this):

```env
DATABASE_URL=file:./local.db
OPENAI_API_KEY=sk-your-key-here
NODE_ENV=development
```

This file is already in `.gitignore` to prevent accidental commits.

