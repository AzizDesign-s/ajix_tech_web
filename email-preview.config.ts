import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: './email-preview',
  reporter: [['list']],
  projects: [{ name: 'desktop', use: { ...devices['Desktop Chrome'], channel: 'chrome' } }],
});
