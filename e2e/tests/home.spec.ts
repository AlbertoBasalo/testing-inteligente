import { expect, test } from '@playwright/test';

test.describe('Home page', () => {
  test('responds with a successful status', async ({ page }) => {
    const response = await page.goto('/');

    expect(response?.ok()).toBe(true);
  });

  test('shows a title', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/.+/);
  });
});
