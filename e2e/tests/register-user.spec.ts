import { expect, test } from '@playwright/test';

// Spec: specs/register-user.spec.yaml
test.describe('R0001 Register a user with valid data', () => {
  test('S001 Successful registration', async ({ page }) => {
    // Precondition: no user exists with this email, so each run uses a unique one.
    const user = {
      username: 'John Doe',
      email: `john.${Date.now()}@example.com`,
      password: 'SecurePassword123!',
    };

    // GIVEN the user is not registered
    await page.goto('/');
    await page
      .getByRole('navigation', { name: 'Main menu' })
      .getByRole('link', { name: 'Register' })
      .click();
    await expect(page).toHaveURL(/\/register$/);

    // WHEN the user submits valid registration data
    await page.getByRole('textbox', { name: 'Email' }).fill(user.email);
    await page.getByRole('textbox', { name: 'Name' }).fill(user.username);
    await page.getByRole('textbox', { name: 'Password' }).fill(user.password);
    await page.getByRole('button', { name: 'Register' }).click();

    // THEN the user is registered successfully and receives a confirmation
    await expect(page.getByText('Registration confirmed')).toBeVisible();
  });
});
