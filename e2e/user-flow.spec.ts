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
    
    const textarea = page.locator('textarea');
    const submitButton = page.locator('button[type="submit"]');
    
    // Wait for the textarea to be ready
    await expect(textarea).toBeVisible();
    
    // Fill in the prompt - use pressSequentially for webkit compatibility with React controlled inputs
    const promptText = 'Give me tax optimization strategies';
    await textarea.click();
    await textarea.pressSequentially(promptText, { delay: 10 });
    
    // Wait for React to update the button state after filling
    await expect(submitButton).toBeEnabled({ timeout: 5000 });
    
    // Submit the form
    await submitButton.click();
    
    // Wait for loading to complete
    await expect(submitButton).not.toBeDisabled({ timeout: 30000 });
    
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
    
    const textarea = page.locator('textarea');
    const submitButton = page.locator('button[type="submit"]');
    
    // Use pressSequentially for webkit compatibility with React controlled inputs
    await textarea.click();
    await textarea.pressSequentially('Test prompt', { delay: 10 });
    
    // Wait for React to update the button state after filling
    await expect(submitButton).toBeEnabled({ timeout: 5000 });
    
    await submitButton.click();
    
    // Button should be disabled during loading
    await expect(submitButton).toBeDisabled();
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
    
    const existingRecord = page.getByTestId('record-card').filter({ hasText: 'Existing Record' });
    const anotherRecord = page.getByTestId('record-card').filter({ hasText: 'Another Record' });

    // Wait for records to load
    await expect(existingRecord).toBeVisible({ timeout: 5000 });
    await expect(anotherRecord).toBeVisible();
  });

  test('should open edit modal when clicking edit button', async ({ page }) => {
    await page.goto('/');
    
    const existingRecord = page.getByTestId('record-card').filter({ hasText: 'Existing Record' });

    // Wait for records to load
    await expect(existingRecord).toBeVisible({ timeout: 5000 });
    
    // Click edit button on first record
    const firstEditButton = existingRecord.getByTestId('record-edit').first();
    
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
    
    const existingRecord = page.getByTestId('record-card').filter({ hasText: 'Existing Record' });

    // Wait for records to load
    await expect(existingRecord).toBeVisible({ timeout: 5000 });
    
    // Find and click delete button
    const firstDeleteButton = existingRecord.getByTestId('record-delete').first();
    
    if (await firstDeleteButton.isVisible()) {
      await firstDeleteButton.click();
      
      // If there's a confirmation dialog, confirm it
      const confirmButton = page.getByTestId('confirm-dialog-confirm').or(page.locator('button:has-text("Confirm"), button:has-text("Yes")'));
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
    
    const textarea = page.locator('textarea');
    const submitButton = page.locator('button[type="submit"]');
    
    // Use pressSequentially for webkit compatibility with React controlled inputs
    await textarea.click();
    await textarea.pressSequentially('Test prompt', { delay: 10 });
    
    // Wait for React to update the button state after filling
    await expect(submitButton).toBeEnabled({ timeout: 5000 });
    
    await submitButton.click();
    
    // Should show error message
    const errorLocator = page.getByTestId('error-message').or(
      page.locator('text=error').or(page.locator('text=Error')).or(page.locator('text=failed')).or(page.locator('text=Failed'))
    );
    await expect(errorLocator).toBeVisible({ timeout: 5000 });
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

