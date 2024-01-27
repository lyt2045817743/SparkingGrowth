import { test, expect } from '@playwright/test';

test('completed_todo', async ({ page }) => {
  await page.goto('http://127.0.0.1:5173/course_config/todo');
  await page.goto('http://127.0.0.1:5173/course_config/todo');
  await page.locator('html').click();
  await page.getByRole('button', { name: '新增待办' }).click();
  await page.getByText('完整配置').click();
  await page.getByLabel('待办内容：').click();
  await page.getByLabel('待办内容：').fill('测试完成待办逻辑');
  await page.getByLabel('待办类型：').click();
  await page.getByRole('menuitem', { name: '简单分类' }).locator('span').nth(2).click();
  await page.getByRole('menuitem', { name: '简单分类' }).locator('span').nth(2).click();
  await page.getByText('学习成长').click();
  await page.getByRole('menuitem', { name: '记笔记' }).locator('span').nth(2).click();
  await page.getByText('代码世界').click();
  await page.getByRole('menuitem', { name: 'Coding' }).locator('span').nth(2).click();
  await page.locator('div').filter({ hasText: /^记笔记\+ 1$/ }).first().click();
  await page.getByPlaceholder('截止日期').click();
  await page.getByText('19', { exact: true }).click();
  await page.getByPlaceholder('具体时间').click();
  await page.locator('li').filter({ hasText: '00:00' }).click();
  await page.getByRole('button', { name: '提交' }).click();
  await page.getByRole('button', { name: '完成' }).click();
  await page.getByRole('menuitem', { name: '待办管理' }).click();
  await page.getByRole('button', { name: '新增待办' }).click();
  await page.getByText('完整配置').click();
  await page.getByLabel('待办内容：').click();
  await page.getByLabel('待办内容：').fill('测试过期完成的待办积分');
  await page.getByLabel('待办类型：').click();
  await page.getByText('学习成长').click();
  await page.getByRole('menuitem', { name: '记笔记' }).locator('span').nth(2).click();
  await page.getByRole('menuitem', { name: '视频学习' }).locator('span').nth(2).click();
  await page.getByRole('menuitem', { name: '书籍学习' }).locator('span').nth(2).click();
  await page.locator('div').filter({ hasText: /^记笔记\+ 2$/ }).first().click();
  await page.getByPlaceholder('截止日期').click();
  await page.getByText('17', { exact: true }).click();
  await page.getByPlaceholder('具体时间').click();
  await page.locator('li').filter({ hasText: '01:00' }).click();
  await page.getByRole('button', { name: '提交' }).click();
  await page.getByRole('button', { name: '完成' }).click();
});

test('todo_api', async ({ page }) => {
  await page.goto('http://127.0.0.1:5173/course_config/todo');
  await page.locator('html').click();
  // 新增待办
  await expect(page.getByRole('button', { name: '新增待办' })).toBeVisible();
  await page.getByRole('button', { name: '新增待办' }).click();
  await page.getByText('完整配置').click();
  await page.getByLabel('待办内容：').click();
  await page.getByLabel('待办内容：').fill('新增1');
  await page.getByLabel('待办类型：').click();
  await page.getByText('代码世界').click();
  await page.getByRole('menuitem', { name: '新功能研发' }).locator('span').nth(2).click();
  await page.locator('div').filter({ hasText: /^新功能研发$/ }).first().click();
  await page.getByLabel('待办详情：').click();
  await page.getByLabel('待办详情：').fill('哈哈哈');
  await page.getByPlaceholder('截止日期').click();
  await page.getByRole('gridcell', { name: '28' }).locator('div').click();
  await page.getByPlaceholder('具体时间').click();
  await page.locator('li').filter({ hasText: '02:00' }).click();
  await page.getByPlaceholder('请选择').click();
  await page.locator('div:nth-child(5) > div:nth-child(3) > .el-form-item__content').click();
  await page.getByRole('button', { name: '提交' }).click();
  // 新增子待办
  await page.getByRole('button', { name: '新增子待办' }).click();
  await page.getByLabel('待办内容：').click();
  await page.getByLabel('待办内容：').fill('添加子待办');
  await page.getByPlaceholder('请选择').click();
  await page.getByText('代码世界').click();
  await page.getByText('Bug修复').click();
  await page.getByPlaceholder('截止日期').click();
  await page.getByText('29').click();
  await page.getByRole('button', { name: '提交' }).click();
  // 编辑
  await page.getByRole('cell', { name: '新增1' }).getByRole('img').click();
  await page.getByRole('button', { name: '编辑' }).nth(1).click();
  await page.getByLabel('积分调整：').click();
  await page.getByLabel('积分调整：').fill('2');
  await page.getByRole('button', { name: '提交' }).click();
  await page.getByRole('button', { name: '编辑' }).click();
  await page.getByRole('button', { name: '返回' }).click();
  // 删除
  await page.getByRole('cell', { name: '新增1' }).getByRole('img').click();
  await page.getByRole('button', { name: '删除' }).first().click();
  await page.getByRole('button', { name: 'Yes' }).click();
  // 完成待办
  await page.getByRole('button', { name: '新增待办' }).click();
  await page.getByPlaceholder('请输入').click();
  await page.getByPlaceholder('请输入').fill('测试完成');
  await page.getByRole('button', { name: '提交' }).click();
  await page.getByRole('button', { name: '完成' }).click();  
  // 完成待办积分增加
  // 关联子待办
});