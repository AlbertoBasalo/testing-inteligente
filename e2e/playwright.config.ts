import { defineConfig, devices } from '@playwright/test';

const isCI = !!process.env.CI;
const frontUrl = process.env.BASE_URL ?? 'http://localhost:4000';
const backUrl = process.env.API_URL ?? 'http://localhost:3000';

export default defineConfig({
  testDir: './tests',
  outputDir: './test-results',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : undefined,
  timeout: 30_000,
  expect: { timeout: 5_000 },
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
  ],
  use: {
    baseURL: frontUrl,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: [
    {
      command: 'npm start',
      cwd: '../projects/back',
      url: `${backUrl}/api/health`,
      env: { PORT: new URL(backUrl).port },
      reuseExistingServer: !isCI,
      timeout: 60_000,
    },
    {
      command: 'npm start',
      cwd: '../projects/front',
      url: frontUrl,
      env: { PORT: new URL(frontUrl).port, API_BASE_URL: backUrl },
      reuseExistingServer: !isCI,
      timeout: 60_000,
    },
  ],
});
