import { test, expect } from '@playwright/test';

test('book_api', async ({ page }) => {
  await page.goto('http://127.0.0.1:5173/course_config/book');
  await page.locator('html').click();
  await page.getByRole('button', { name: '新增书籍' }).click();
  await page.getByLabel('书籍名称：').click();
  await page.getByLabel('书籍名称：').fill('新增书籍');
  await page.getByLabel('作者：').click();
  await page.getByLabel('作者：').press('CapsLock');
  await page.getByLabel('作者：').fill('XX');
  await page.getByLabel('类型：').click();
  await page.locator('li').filter({ hasText: '计算机' }).click();
  await page.getByLabel('页数：').click();
  await page.getByLabel('页数：').fill('200');
  await page.getByRole('button', { name: '提交' }).click();
  await page.getByRole('button', { name: '编辑' }).click();
  await page.getByLabel('书籍状态：').click();
  await page.locator('li').filter({ hasText: '阅读中' }).click();
  await page.getByRole('button', { name: '提交' }).click();
  await page.getByRole('button', { name: '更新进度' }).click();
  await page.getByLabel('已读页数：').click();
  await page.getByLabel('已读页数：').fill('100');
  await page.getByRole('button', { name: '确定' }).click();
});