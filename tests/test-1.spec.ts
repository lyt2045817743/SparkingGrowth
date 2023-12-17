import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://127.0.0.1:5173/');
  await page.getByText('内容配置后台').click();
  await page.getByRole('menuitem', { name: '待办管理' }).click();
  await page.getByRole('menuitem', { name: '学习资源管理' }).click();
  await page.getByRole('button', { name: '编辑' }).click();
  await page.goto('http://127.0.0.1:5173/course_config/edit?id=0&pageType=edit');
  await page.getByRole('button', { name: '取消' }).click();
  await expect(page.locator('tbody')).toContainText('在线文档');

});
