import { test, expect } from '@playwright/test';

test('course_api', async ({ page }) => {
  await page.goto('http://127.0.0.1:5173/course_config/list');
  await page.goto('http://127.0.0.1:5173/course_config/list');
  await page.getByRole('button', { name: '新增学籍资源' }).click();
  await page.getByPlaceholder('请输入', { exact: true }).click();
  await page.getByPlaceholder('请输入', { exact: true }).fill('新增资源');
  await page.getByPlaceholder('请选择').click();
  await page.locator('li').filter({ hasText: '在线文档' }).click();
  await page.getByText('是', { exact: true }).click();
  await page.getByLabel('资源链接(url)：').click();
  await page.getByLabel('资源链接(url)：').fill('https://www.baidu.com');
  await page.getByText('暂不配置').click();
  await page.getByRole('button', { name: '提交并立即体验' }).click();
  const page1Promise = page.waitForEvent('popup');
  await page.getByRole('link', { name: '学习资源链接' }).click();
  const page1 = await page1Promise;
  await page.getByRole('banner').getByRole('img').click();
  await page.getByText('内容配置后台').click();
  await page.getByRole('menuitem', { name: '学习资源管理' }).click();
  await page.getByRole('button', { name: '编辑' }).nth(1).click();
  await page.getByPlaceholder('请选择').click();
  await page.locator('li').filter({ hasText: /^书籍$/ }).click();
  await page.getByRole('button', { name: '提交' }).click();
  await page.getByRole('button', { name: '删除' }).nth(1).click();
});