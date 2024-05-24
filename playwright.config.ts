import type { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  webServer: {
    command: 'npm run build && npm run preview',
    ignoreHTTPSErrors: true,
    url: 'https://localhost:4173',
  },
  use: {
    browserName: 'chromium',
    launchOptions: {
      args: ['--ignore-certificate-errors'],
    },
    baseURL: 'https://localhost:4173',
  },
  testDir: 'tests',
  testMatch: /(.+\.)?(test|spec)\.[jt]s/,
};

export default config;
