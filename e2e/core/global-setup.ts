// Prepares the systems before the tests:
// 1. back-api and front-web respond.
// 2. front-web uses the same back-api as the tests.
// 3. The seed data exists.
// webServer empties the database (see playwright.config.ts); this file only warns if it did not.
// The tests never access the database. They use only the back-api endpoints.
import { backUrl, frontUrl } from './env';
import { seedUsers } from './seed-data';

const START_HINT = 'Run "npm start" in the root folder, or let Playwright start the servers.';

async function request(url: string, init?: RequestInit): Promise<Response> {
  try {
    return await fetch(url, init);
  } catch {
    throw new Error(`No response from ${url}. ${START_HINT}`);
  }
}

async function readJson(url: string): Promise<Record<string, unknown>> {
  const response = await request(url);
  if (!response.ok) throw new Error(`${url} returned ${response.status}. ${START_HINT}`);
  return (await response.json()) as Record<string, unknown>;
}

async function checkBack(): Promise<number> {
  const health = await readJson(`${backUrl}/api/health`);
  if (health.status !== 'ok') throw new Error(`back-api is not healthy: ${JSON.stringify(health)}`);
  return Number(health.runs);
}

async function checkFront(): Promise<void> {
  const response = await request(`${frontUrl}/`);
  if (!response.ok) throw new Error(`front-web returned ${response.status}. ${START_HINT}`);
  const config = await readJson(`${frontUrl}/runtime-config.json`);
  if (config.apiBaseUrl !== backUrl) {
    throw new Error(
      `front-web uses back-api ${String(config.apiBaseUrl)}, but the tests use ${backUrl}. ` +
        'Set the same URL in API_BASE_URL (front-web) and API_URL (e2e).',
    );
  }
}

// After scripts/reset.mjs, back-api records its first run. More runs mean a reused server.
function warnIfNotReset(runs: number): void {
  if (runs <= 1) return;
  console.warn(
    `[global-setup] back-api was reused (${runs} runs): the database was not reset. ` +
      'For a clean database, stop the servers and run "npm run reset" in the root folder.',
  );
}

async function seedUser(user: (typeof seedUsers)[number]): Promise<void> {
  const response = await request(`${backUrl}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });
  // 409: the user exists from an earlier run. That is the state we need.
  if (response.ok || response.status === 409) return;
  throw new Error(`Cannot seed user ${user.email}: ${response.status} ${await response.text()}`);
}

export default async function globalSetup(): Promise<void> {
  const runs = await checkBack();
  await checkFront();
  warnIfNotReset(runs);
  for (const user of seedUsers) await seedUser(user);
}
