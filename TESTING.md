# Testing Checklist

## Requirements Verification

### ✅ Core Functionality

- [x] **Query an LLM**: Application allows users to submit prompts to OpenAI
- [x] **Retrieve and Display Results**: LLM responses are structured as a list of records with title and description
- [x] **CRUD Operations**: Users can view, edit, and delete individual records
- [x] **Prompt Modification**: Users can edit the original prompt and re-query the LLM
- [x] **Auto-delete Previous Records**: When a new prompt is submitted, previous records are automatically deleted

### ✅ Technology Stack

- [x] **Frontend**: Next.js 15 with App Router
- [x] **Styling**: Tailwind CSS
- [x] **Backend**: Drizzle ORM
- [x] **Database**: SQLite (local) and Postgres (production via Vercel)
- [x] **Languages**: TypeScript and React 19

### ✅ Setup Commands

- [x] `npm install` - Installs all dependencies
- [x] `npm run build` - Builds the application (requires Node.js 20+)
- [x] `npm start` - Starts production server

### ✅ Additional Features (Beyond Requirements)

- [x] **Dual Database Support**: SQLite for development/Docker, Postgres for Vercel
- [x] **LLM Provider Abstraction**: Factory pattern allows easy switching between LLM providers
- [x] **Docker Support**: Complete containerization with multi-stage build
- [x] **CI/CD Pipeline**: GitHub Actions with build, test, Docker, and Vercel deployment
- [x] **Security**: Environment variables, GitHub secrets, parameterized queries

## Manual Testing Checklist

### Test 1: Submit Initial Prompt

1. Start the application: `npm run dev`
2. Navigate to http://localhost:3000
3. Enter the sample prompt:
   ```
   I am an accountant, and my client is asking for advice on strategies to optimise his tax structure. He and his partner have an income of $200,000 per year. They live in Sydney, Australia, and have no kids. Please provide a detailed list of strategies that could minimise their tax. Please be very specific and use concise language.
   ```
4. Click "Submit Prompt"
5. **Expected**: Multiple records appear with tax optimization strategies
6. **Expected**: Each record has a title and description
7. **Expected**: Records are displayed in cards with Edit/Delete buttons

### Test 2: Edit a Record

1. Click "Edit" on any record
2. Modify the title and/or description
3. Click "Save"
4. **Expected**: Record updates immediately
5. **Expected**: Changes persist on page refresh

### Test 3: Delete a Record

1. Click "Delete" on any record
2. Confirm deletion in browser prompt
3. **Expected**: Record is removed immediately
4. **Expected**: Record stays deleted after page refresh

### Test 4: Modify and Re-run Prompt

1. Change the original prompt in the text area
2. Click "Re-submit Prompt"
3. **Expected**: All previous records are deleted
4. **Expected**: New records appear based on the new prompt
5. **Expected**: The current prompt display updates

### Test 5: Database Persistence

1. Submit a prompt and create records
2. Edit some records
3. Stop the server
4. Restart the server
5. Refresh the page
6. **Expected**: All data persists (prompt and edited records)

### Test 6: Error Handling

1. Try to submit an empty prompt
2. **Expected**: Submit button is disabled
3. Try to edit a record with empty description
4. **Expected**: Validation prevents saving

### Test 7: Loading States

1. Submit a prompt
2. **Expected**: Button shows "Processing..." during LLM query
3. **Expected**: Button is disabled during processing

## API Endpoint Testing

### Test POST /api/prompts

```bash
curl -X POST http://localhost:3000/api/prompts \
  -H "Content-Type: application/json" \
  -d '{"content": "List 3 benefits of exercise"}'
```

**Expected**: Returns prompt object and array of records

### Test GET /api/records

```bash
curl http://localhost:3000/api/records
```

**Expected**: Returns array of all records

### Test PUT /api/records/[id]

```bash
curl -X PUT http://localhost:3000/api/records/1 \
  -H "Content-Type: application/json" \
  -d '{"title": "New Title", "description": "New description"}'
```

**Expected**: Returns updated record

### Test DELETE /api/records/[id]

```bash
curl -X DELETE http://localhost:3000/api/records/1
```

**Expected**: Returns success response

## Docker Testing

### Test Docker Build

```bash
docker build -t llm-assignment .
```

**Expected**: Build completes without errors

### Test Docker Run

```bash
docker run -p 3000:3000 -e OPENAI_API_KEY=sk-xxx llm-assignment
```

**Expected**: Application starts and is accessible at http://localhost:3000

### Test Docker Compose

```bash
export OPENAI_API_KEY=sk-xxx
docker-compose up
```

**Expected**: Application starts with persistent volume for database

## Code Quality Testing

### TypeScript Type Checking

```bash
npx tsc --noEmit
```

**Expected**: No type errors

### ESLint

```bash
npm run lint
```

**Expected**: No linting errors

### Database Migration

```bash
npm run db:migrate
```

**Expected**: Tables created successfully

## CI/CD Testing

1. Push to main branch
2. **Expected**: GitHub Actions workflow runs
3. **Expected**: Build and test job passes
4. **Expected**: Docker image is built and pushed to ghcr.io
5. **Expected**: Vercel deployment succeeds (if configured)

## Performance Testing

1. Submit a complex prompt requiring multiple strategies
2. **Expected**: Response time < 30 seconds
3. **Expected**: UI remains responsive during processing
4. **Expected**: No memory leaks on multiple submissions

## Browser Compatibility

Test in:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

## Mobile Responsiveness

Test on:
- [ ] Mobile phone (< 768px)
- [ ] Tablet (768px - 1024px)
- [ ] Desktop (> 1024px)

**Expected**: Layout adapts appropriately, all functionality works

## Security Testing

- [x] Environment variables not committed to repository
- [x] `.env.local` in `.gitignore`
- [x] Database queries use parameterized statements
- [x] Input validation on all API endpoints
- [x] GitHub secrets configured for CI/CD

## Known Limitations

1. **Node.js Version**: Requires Node.js 20+ for Next.js 15
2. **No Authentication**: Per requirements, no user auth implemented
3. **Single User**: Database not designed for multi-user scenarios
4. **OpenAI Rate Limits**: Subject to OpenAI API rate limits and costs

## Test Results Summary

All core requirements have been implemented and verified:
- ✅ LLM Integration (OpenAI)
- ✅ CRUD Operations on Records
- ✅ Prompt Modification and Re-query
- ✅ Auto-delete Previous Records
- ✅ Next.js 15 + React 19 + TypeScript + Tailwind CSS
- ✅ Drizzle ORM with SQLite and Postgres
- ✅ Docker Containerization
- ✅ Complete CI/CD Pipeline
- ✅ Proper Security Measures

