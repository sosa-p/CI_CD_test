import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('페이지 제목이 표시된다', async ({ page }) => {
  await expect(page).toHaveTitle(/할 일 목록/);
  await expect(page.getByRole('heading', { name: '할 일 목록' })).toBeVisible();
});

test('할 일을 추가하면 목록에 나타난다', async ({ page }) => {
  const input = page.getByLabel('할 일 입력');
  await input.fill('Playwright 공부하기');
  await page.getByRole('button', { name: '추가' }).click();

  await expect(page.getByRole('listitem')).toHaveText(['Playwright 공부하기']);
  await expect(page.locator('#count')).toHaveText('남은 할 일: 1개');
  await expect(input).toBeEmpty();
});

test('빈 값으로 추가하면 에러 메시지가 보인다', async ({ page }) => {
  await page.getByRole('button', { name: '추가' }).click();

  await expect(page.getByRole('alert')).toHaveText('내용을 입력해주세요.');
  await expect(page.getByRole('listitem')).toHaveCount(0);
});

test('완료 체크하면 남은 개수가 줄어든다', async ({ page }) => {
  const input = page.getByLabel('할 일 입력');
  for (const item of ['CI 설정', '테스트 작성']) {
    await input.fill(item);
    await input.press('Enter');
  }
  await expect(page.locator('#count')).toHaveText('남은 할 일: 2개');

  await page.getByLabel('CI 설정 완료').check();
  await expect(page.locator('#count')).toHaveText('남은 할 일: 1개');
});
