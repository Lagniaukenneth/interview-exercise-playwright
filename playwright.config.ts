import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL: 'https://www.bol.com',
    // headless: true,
    channel: 'chromium'
  },
});
