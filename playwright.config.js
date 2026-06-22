// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/**
 * Configuração Playwright — testes E2E do FitApp contra o Expo Web.
 *
 * Sobe automaticamente:
 *   1. json-server (backend mock)  -> http://localhost:3000
 *   2. Expo Web (React Native Web) -> http://localhost:8081
 *
 * As evidências de print ficam em tests/evidencias/.
 * O relatório HTML fica em tests/playwright-report/.
 */

const WEB_PORT = 8081;
const API_PORT = 3000;
const BASE_URL = `http://localhost:${WEB_PORT}`;

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 90_000,
  expect: { timeout: 20_000 },

  reporter: [
    ['list'],
    ['html', { outputFolder: 'tests/playwright-report', open: 'never' }],
  ],

  use: {
    baseURL: BASE_URL,
    headless: true,
    viewport: { width: 420, height: 900 }, // proporção mobile (portrait)
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
    video: { mode: 'on', size: { width: 420, height: 900 } },
    actionTimeout: 20_000,
    navigationTimeout: 60_000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], viewport: { width: 420, height: 900 } },
    },
  ],

  webServer: [
    {
      command: 'npm run api',
      url: `http://localhost:${API_PORT}/usuarios`,
      reuseExistingServer: true,
      timeout: 60_000,
    },
    {
      command: 'npx expo start --web --port 8081',
      url: BASE_URL,
      reuseExistingServer: true,
      timeout: 300_000, // o primeiro bundle do Metro pode demorar
      env: { CI: '1', BROWSER: 'none', EXPO_NO_TELEMETRY: '1' },
    },
  ],
});
