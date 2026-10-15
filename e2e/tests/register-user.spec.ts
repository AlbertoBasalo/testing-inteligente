import { expect, test, type Page } from '@playwright/test';
import { existingUser } from '../core/seed-data';

async function openRegisterPage(page: Page): Promise<void> {
  await page.goto('/');
  await page
    .getByRole('navigation', { name: 'Main menu' })
    .getByRole('link', { name: 'Register' })
    .click();
  await expect(page).toHaveURL(/\/register$/);
}

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
    await openRegisterPage(page);

    // WHEN the user submits valid registration data
    await page.getByRole('textbox', { name: 'Email' }).fill(user.email);
    await page.getByRole('textbox', { name: 'Name' }).fill(user.username);
    await page.getByRole('textbox', { name: 'Password' }).fill(user.password);
    await page.getByRole('button', { name: 'Register' }).click();

    // THEN the user is registered successfully and receives a confirmation
    await expect(page.getByText('Registration confirmed')).toBeVisible();
  });
});

test.describe('R0002 Reject registration with an existing email', () => {
  test('S001 Registration with an existing email', async ({ page }) => {
    // Setup: global-setup creates the seed user with this email.
    const expectedError = 'Email already registered';

    // GIVEN a registered user exists with this email
    await openRegisterPage(page);

    // WHEN another registration is attempted with this email
    await page.getByRole('textbox', { name: 'Email' }).fill(existingUser.email);
    await page.getByRole('textbox', { name: 'Name' }).fill(existingUser.name);
    await page.getByRole('textbox', { name: 'Password' }).fill(existingUser.password);
    await page.getByRole('button', { name: 'Register' }).click();

    // THEN the registration fails and the system returns the expected error
    await expect(page.getByText(expectedError)).toBeVisible();
    await expect(page.getByText('Registration confirmed')).toBeHidden();
  });
});
