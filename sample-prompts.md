# Sample Prompts for Testing

This file contains various prompts to test the LLM Assignment application with OpenAI Structured Outputs.

## 🧪 Quick Test Prompts

### Basic List Generation (5 items)
```
Give me 5 healthy breakfast ideas
```
**Expected:** 5 records with breakfast ideas

### Numbered List (7 items)
```
List 7 best practices for writing clean code
```
**Expected:** 7 records with coding best practices

### Business/Professional
```
I am an accountant, and my client is asking for advice on strategies to optimise his tax structure. He and his partner have an income of $200,000 per year. They live in Sydney, Australia, and have no kids. Please provide a detailed list of strategies that could minimise their tax. Please be very specific and use concise language.
```
**Expected:** Multiple tax optimization strategies with detailed descriptions

---

## 📝 Category-Based Test Prompts

### Food & Nutrition
```
Give me 6 quick and healthy lunch ideas for busy professionals
```

```
List 5 protein-rich snacks that are easy to prepare
```

### Fitness & Health
```
Provide 8 bodyweight exercises I can do at home without equipment
```

```
Give me 5 tips for improving sleep quality
```

### Productivity
```
List 10 productivity tips for remote workers working from home
```

```
Give me 7 time management techniques to be more efficient
```

### Travel
```
Recommend 6 must-visit destinations in Europe for first-time travelers
```

```
List 8 essential items to pack for a 2-week backpacking trip
```

### Technology
```
Provide 5 cybersecurity best practices for small businesses
```

```
List 7 tips for writing better API documentation
```

### Personal Finance
```
Give me 10 ways to save money on everyday expenses
```

```
List 5 investment strategies for beginners in their 20s
```

---

## 🎯 Edge Case Test Prompts

### Single Item Response
```
What is the best way to learn TypeScript?
```
**Expected:** 1 record (or possibly multiple steps/approaches)

### Complex Multi-Step Process
```
Explain how to deploy a Next.js application to Vercel step by step
```
**Expected:** Multiple records, each representing a step

### Short Answers
```
Give me 3 reasons why TypeScript is better than JavaScript
```
**Expected:** 3 concise records

### Detailed Technical
```
Explain 5 design patterns commonly used in React applications with examples
```
**Expected:** 5 records with pattern explanations

### Comparative Lists
```
Compare 4 different database options (SQL vs NoSQL) with pros and cons
```
**Expected:** 4 records, each comparing a database type

---

## 🔬 Structured Outputs Validation Tests

### Test Schema Compliance
```
Give me exactly 10 tips for learning a new programming language
```
**Expected:** Should return exactly 10 records in proper JSON format

### Test Optional Title Field
```
List advantages and disadvantages of microservices architecture
```
**Expected:** Records with or without titles (tests optional field)

### Test Description Length
```
Provide 5 detailed strategies for scaling a web application, including technical considerations and trade-offs
```
**Expected:** Records with longer, detailed descriptions

### Test Consistency
```
List 8 common JavaScript array methods with brief explanations
```
**Expected:** Consistent format across all 8 records

---

## 💼 Real-World Scenario Prompts

### Software Development
```
I'm building a React e-commerce application. Give me 7 essential features I should implement in the MVP.
```

```
List 6 security vulnerabilities to avoid when building a Node.js REST API
```

### Business Strategy
```
I'm launching a SaaS startup. Provide 8 marketing strategies for acquiring the first 100 customers.
```

```
Give me 5 key metrics every product manager should track
```

### Education
```
I want to learn web development from scratch. Give me a 10-step learning path.
```

```
List 7 resources for learning machine learning as a beginner
```

### Content Creation
```
Give me 10 blog post ideas for a tech startup's content marketing strategy
```

```
List 6 tips for creating engaging social media content
```

---

## 🌟 Creative Test Prompts

### Storytelling
```
Give me 5 plot ideas for a sci-fi short story
```

### Problem-Solving
```
List 7 creative solutions for reducing plastic waste in daily life
```

### Brainstorming
```
Generate 10 unique app ideas that solve everyday problems
```

### Decision Making
```
I'm deciding between remote work and office work. Give me 5 pros and 5 cons of each.
```

---

## ⚠️ Stress Test Prompts

### Large Number of Items
```
Give me 20 JavaScript interview questions for senior developers
```
**Expected:** Tests if the system can handle more records

### Very Short Prompt
```
Python tips
```
**Expected:** Should still generate structured response

### Ambiguous Prompt
```
Technology stuff
```
**Expected:** Should interpret and provide tech-related items

### Multiple Questions
```
What are RESTful APIs? How do they work? Give me 5 examples.
```
**Expected:** Should structure the response appropriately

---

## 📊 Testing Checklist

When testing each prompt, verify:

- [ ] Records are created in the database
- [ ] Each record has a proper structure (title, description)
- [ ] Title field is optional (some records may not have titles)
- [ ] Description field is always present and not empty
- [ ] Records are properly linked to the prompt (promptId)
- [ ] UI displays all records correctly
- [ ] Edit functionality works on each record
- [ ] Delete functionality works on each record
- [ ] New prompt replaces all previous records

---

## 🎓 Sample Testing Session

**Recommended testing flow:**

1. Start with a simple prompt:
   ```
   Give me 5 healthy breakfast ideas
   ```

2. Verify records appear correctly

3. Edit one record (change title and description)

4. Delete one record

5. Submit a new prompt:
   ```
   List 7 productivity tips for remote workers
   ```

6. Verify old records were deleted and new ones created

7. Test edge cases (single item, large list, etc.)

8. Test different categories to ensure variety works

---

## 🐛 Known Behaviors to Test

### What Should Work
- Prompts asking for specific numbers of items (5, 10, etc.)
- Prompts with detailed requirements
- Technical and non-technical topics
- Single-word and paragraph-length prompts

### What to Watch For
- If a prompt is too vague, GPT might return fewer items
- Very short prompts might get interpreted creatively
- Complex prompts might be broken into many small records

---

## 💡 Tips for Creating Your Own Prompts

**Good Prompts:**
- Be specific: "Give me 5 tips for..." is better than "tips"
- Include context: "For beginners" vs "For experts"
- Specify format: "List", "Provide", "Give me"
- Include numbers: "5 ways", "10 tips"

**Examples:**
✅ "Give me 7 beginner-friendly Python projects to build"
✅ "List 5 common React hooks with use cases"
✅ "Provide 8 tips for writing better commit messages"

❌ "Python stuff"
❌ "React"
❌ "Help me code"

---

## 🔗 Related Resources

- **OpenAI Structured Outputs Docs:** https://platform.openai.com/docs/guides/structured-outputs
- **Zod Documentation:** https://zod.dev/
- **Testing Your App:** http://localhost:3000 (local) or https://llm-assignment.vercel.app (production)

---

**Last Updated:** 2025-11-30
**Structured Outputs:** ✅ Enabled
**Model:** gpt-4o-mini

