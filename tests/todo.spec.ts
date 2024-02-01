import { test, expect } from '@playwright/test';

test('add_todo', async ({ page }) => {
  await page.goto('http://127.0.0.1:5173/course_config/todo');
  await page.goto('http://127.0.0.1:5173/course_config/todo');
  await page.getByRole('button', { name: '新增待办' }).click();
  await page.getByText('完整配置').click();
  await page.getByLabel('待办内容：').click();
  await page.getByLabel('待办内容：').fill('待办1');
  await page.getByLabel('关联活动/资源：').click();
  await page.getByText('学习', { exact: true }).click();
  await page.getByRole('menuitem', { name: '书籍学习' }).locator('span').nth(1).click();
  await page.getByLabel('待办详情：').click();
  await page.getByLabel('待办详情：').fill('1. 详情');
  await page.getByPlaceholder('截止日期').click();
  await page.getByText('1', { exact: true }).first().click();
  await page.getByPlaceholder('具体时间').click();
  await page.getByPlaceholder('具体时间').fill('23');
  await page.locator('li').filter({ hasText: '23:30' }).click();
  await page.getByRole('button', { name: '提交' }).click();
});

test('completed_todo', async ({ page }) => {
  await page.goto('http://127.0.0.1:5173/course_config/todo');
  await page.goto('http://127.0.0.1:5173/course_config/todo');
  await page.getByRole('button', { name: '新增待办' }).click();
  await page.getByText('完整配置').click();
  await page.getByLabel('待办内容：').click();
  await page.getByLabel('待办内容：').fill('待办1');
  await page.getByLabel('关联活动/资源：').click();
  await page.getByText('学习', { exact: true }).click();
  await page.getByRole('menuitem', { name: '书籍学习' }).locator('span').nth(1).click();
  await page.getByLabel('待办详情：').click();
  await page.getByLabel('待办详情：').fill('1. 详情');
  await page.getByPlaceholder('截止日期').click();
  await page.getByText('1', { exact: true }).first().click();
  await page.getByPlaceholder('具体时间').click();
  await page.getByPlaceholder('具体时间').fill('23');
  await page.locator('li').filter({ hasText: '23:30' }).click();
  await page.getByRole('button', { name: '提交' }).click();
  await page.getByRole('button', { name: '完成' }).click();
});

test('todo_api', async ({ page }) => {
  await page.goto('http://127.0.0.1:5173/course_config/todo');
  await page.goto('http://127.0.0.1:5173/course_config/todo');
  await page.getByRole('button', { name: '新增待办' }).click();
  await page.getByPlaceholder('请输入').click();
  await page.getByText('完整配置').click();
  await page.getByLabel('待办内容：').click();
  await page.getByLabel('待办内容：').fill('待办');
  await page.getByLabel('关联活动/资源：').click();
  await page.getByRole('menuitem', { name: '简单分类' }).locator('span').nth(1).click();
  await page.getByText('待办详情：截止时间：-关联子待办：').click();
  await page.getByPlaceholder('截止日期').click();
  await page.getByText('1', { exact: true }).first().click();
  await page.getByPlaceholder('具体时间').click();
  await page.getByPlaceholder('具体时间').fill('23');
  await page.locator('li').filter({ hasText: '23:30' }).click();
  await page.getByRole('button', { name: '提交' }).click();
  // 编辑
  await page.getByRole('button', { name: '编辑' }).click();
  await page.getByLabel('待办详情：').click();
  await page.getByLabel('待办详情：').fill('编辑');
  await page.getByRole('button', { name: '提交' }).click();
});