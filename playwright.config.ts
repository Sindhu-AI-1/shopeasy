import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 60000,
  retries: 1,
  workers: 1,            // ← run one at a time, saves memory

  use: {
    baseURL: 'http://localhost:5173',
    headless: true, 
    launchOptions: {
    slowMo: 1000,       // ← slows down the recorded test playback
  },     // ← headless uses less memory than headed
    screenshot: 'only-on-failure',
    video:      'retain-on-failure',
    trace:      'retain-on-failure',
  },

  projects: [
    {
      name: 'Chrome',
      use: { ...devices['Desktop Chrome'] },
    },
    // Firefox and Safari commented out to save memory
    // Uncomment when needed:
    // { name: 'Firefox', use: { ...devices['Desktop Firefox'] } },
    // { name: 'Safari',  use: { ...devices['Desktop Safari']  } },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: true,
  },
});