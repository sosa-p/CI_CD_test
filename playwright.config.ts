import { defineConfig, devices } from '@playwright/test';

// CI 환경 여부 (GitHub Actions는 자동으로 CI=true 를 설정함)
const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: isCI,              // CI에서 test.only 가 남아 있으면 실패 처리
  retries: isCI ? 2 : 0,         // CI에서만 실패 시 2번 재시도 (flaky 대응)
  workers: isCI ? 1 : undefined,
  reporter: isCI ? [['html', { open: 'never' }], ['github']] : 'html',

  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',     // 재시도할 때 trace 기록 → 실패 원인 분석용
    screenshot: 'only-on-failure',
  },

  // 테스트 시작 전에 서버를 자동으로 띄움
  webServer: {
    command: 'node server.js',
    url: 'http://localhost:3000',
    reuseExistingServer: !isCI,
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
  ],
});
