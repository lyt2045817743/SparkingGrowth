import { test, expect } from '@playwright/test';

test('pass_undo_event', async ({ page }) => {
  await page.goto('http://127.0.0.1:5173/my_calendar/home');
  const page1Promise = page.waitForEvent('popup');
  await page.getByLabel('17日', { exact: true }).locator('div').first().click();
  const page1 = await page1Promise;
  await page1.getByLabel('待办内容：').click();
  await page1.getByLabel('待办内容：').fill('测试已过去时间的事件样式');
  await page1.getByRole('button', { name: '提交' }).click();
  await page1.getByText('婷的空间').click();
  await page1.getByText('我的日历').click();
  await page1.getByText('婷的空间').click();
  await page1.getByText('内容配置后台').click();
  await page1.getByRole('button', { name: '编辑' }).click();
  await page1.getByPlaceholder('截止日期').click();
  await page1.getByText('16', { exact: true }).click();
  await page1.getByRole('button', { name: '提交' }).click();
  await page1.getByText('婷的空间').click();
  await page1.getByText('我的日历').click();
});