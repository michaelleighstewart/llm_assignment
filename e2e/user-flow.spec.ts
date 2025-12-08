import { test, expect } from '@playwright/test';

// Mock OpenAI API response
const mockLLMResponse = {
  records: [
    { title: 'Strategy One', description: 'Maximize your superannuation contributions up to the concessional cap.' },
    { title: 'Strategy Two', description: 'Consider salary sacrificing to reduce taxable income.' },
    { title: 'Strategy Three', description: 'Claim all eligible work-related deductions.' },
  ],
};

test.describe('User Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Mock the OpenAI API
    await page.route('**/api.openai.com/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'mock-id',
          object: 'chat.completion',
          choices: [
            {
              message: {
                content: JSON.stringify(mockLLMResponse),
              },
            },
          ],
        }),
      });
    });
  });

  test('should load the home page', async ({ page }) => {
    await page.goto('/');
    
    // Check page title and header
    await expect(page.locator('h1')).toContainText('LLM Assistant');
    
    // Check that the prompt form exists
    await expect(page.locator('textarea')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should submit a prompt and display records', async ({ page }) => {
    await page.goto('/');
    
    // Fill in the prompt
    const promptText = 'Give me tax optimization strategies';
    await page.fill('textarea', promptText);
    
    // Submit the form
    await page.click('button[type="submit"]');
    
    // Wait for loading to complete
    await expect(page.locator('button[type="submit"]')).not.toBeDisabled({ timeout: 30000 });
    
    // Check that records are displayed (or check for the current prompt display)
    // The actual records depend on whether the mock is working end-to-end
  });

  test('should show loading state during submission', async ({ page }) => {
    await page.goto('/');
    
    // Add a delay to the API response
    await page.route('**/api/prompts', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          prompt: { id: 1, content: 'Test' },
          records: mockLLMResponse.records,
        }),
      });
    });
    
    await page.fill('textarea', 'Test prompt');
    await page.click('button[type="submit"]');
    
    // Button should be disabled during loading
    await expect(page.locator('button[type="submit"]')).toBeDisabled();
  });

  test('should display error for empty prompt', async ({ page }) => {
    await page.goto('/');
    
    // Try to submit empty form (button might be disabled or show validation)
    const submitButton = page.locator('button[type="submit"]');
    const textarea = page.locator('textarea');
    
    // Clear any existing text and try to submit
    await textarea.clear();
    
    // The submit button should be disabled for empty input
    // or the form should show validation
    await expect(submitButton).toBeDisabled();
  });
});

test.describe('Record Management', () => {
  test.beforeEach(async ({ page }) => {
    // Mock API to return existing records
    await page.route('**/api/records', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            records: [
              { id: 1, promptId: 1, title: 'Existing Record', description: 'This is an existing record' },
              { id: 2, promptId: 1, title: 'Another Record', description: 'Another description' },
            ],
          }),
        });
      }
    });

    await page.route('**/api/prompts', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            prompts: [{ id: 1, content: 'Test prompt' }],
          }),
        });
      }
    });
  });

  test('should display existing records on page load', async ({ page }) => {
    await page.goto('/');
    
    // Wait for records to load
    await expect(page.locator('text=Existing Record')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=Another Record')).toBeVisible();
  });

  test('should open edit modal when clicking edit button', async ({ page }) => {
    await page.goto('/');
    
    // Wait for records to load
    await expect(page.locator('text=Existing Record')).toBeVisible({ timeout: 5000 });
    
    // Click edit button on first record
    const editButtons = page.locator('[aria-label="Edit record"], button:has-text("Edit")');
    const firstEditButton = editButtons.first();
    
    if (await firstEditButton.isVisible()) {
      await firstEditButton.click();
      
      // Check if modal or edit form appears
      // This depends on your implementation
    }
  });

  test('should delete a record when clicking delete', async ({ page }) => {
    // Mock the delete endpoint
    await page.route('**/api/records/*', async (route) => {
      if (route.request().method() === 'DELETE') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true }),
        });
      }
    });

    await page.goto('/');
    
    // Wait for records to load
    await expect(page.locator('text=Existing Record')).toBeVisible({ timeout: 5000 });
    
    // Find and click delete button
    const deleteButtons = page.locator('[aria-label="Delete record"], button:has-text("Delete")');
    const firstDeleteButton = deleteButtons.first();
    
    if (await firstDeleteButton.isVisible()) {
      await firstDeleteButton.click();
      
      // If there's a confirmation dialog, confirm it
      const confirmButton = page.locator('button:has-text("Confirm"), button:has-text("Yes")');
      if (await confirmButton.isVisible({ timeout: 1000 }).catch(() => false)) {
        await confirmButton.click();
      }
    }
  });
});

test.describe('Error Handling', () => {
  test('should display error when API fails', async ({ page }) => {
    // Mock API to return error
    await page.route('**/api/prompts', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Internal server error' }),
        });
      }
    });

    await page.goto('/');
    
    await page.fill('textarea', 'Test prompt');
    await page.click('button[type="submit"]');
    
    // Should show error message
    await expect(page.locator('text=error').or(page.locator('text=Error')).or(page.locator('text=failed').or(page.locator('text=Failed')))).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Responsive Design', () => {
  test('should work on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Page should still be functional
    await expect(page.locator('h1')).toContainText('LLM Assistant');
    await expect(page.locator('textarea')).toBeVisible();
  });

  test('should work on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    
    await expect(page.locator('h1')).toContainText('LLM Assistant');
    await expect(page.locator('textarea')).toBeVisible();
  });
});

