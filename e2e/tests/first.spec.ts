import { test } from '@playwright/test';

test('My first test', async ({ page }) => {
  await page.goto('http://localhost:4000/');
  await page.getByRole('link', { name: 'About' }).click();
  await page.getByRole('link', { name: 'Register' }).click();
  await page.getByRole('button', { name: 'Change theme' }).click();
  await page.getByRole('button', { name: 'Change theme' }).click();
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('a@b.c');
  await page.getByRole('textbox', { name: 'Email' }).press('Tab');
});