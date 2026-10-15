import { expect, test } from '@playwright/test';

test('My first test', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'About' }).click();
  await page.getByRole('link', { name: 'Register' }).click();
  await expect(page).toHaveURL(/\/register$/);

  await page.getByRole('button', { name: 'Change theme' }).click();
  await page.getByRole('button', { name: 'Change theme' }).click();

  const email = page.getByRole('textbox', { name: 'Email' });
  await email.fill('a@b.c');
  await email.press('Tab');
  await expect(email).toHaveValue('a@b.c');
});
