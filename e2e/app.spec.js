import {test,expect} from '@playwright/test';
test('Python input, autosave, toolbar, Stop and offline',async({page,context})=>{
 await page.goto('/');await expect(page.locator('#run')).toBeEnabled({timeout:60000});
 await expect(page.locator('.cm-content')).toHaveText('');await expect(page.locator('#output')).toHaveText('');
 const editor=page.locator('.cm-content');await editor.fill('name = input("Name: ")\nprint("Hello", name)');
 await page.locator('#run').click();await expect(page.locator('#input-form')).toBeVisible({timeout:60000});await page.locator('#input').fill('Иван');await page.locator('#input-form button').click();await expect(page.locator('#output')).toContainText('Hello Иван');await expect(page.locator('#run')).toBeEnabled();
 await page.reload();await expect(editor).toContainText('name = input');await expect(page.locator('#run')).toBeEnabled();
 await editor.fill('');await page.getByRole('button',{name:'()',exact:true}).click();await expect(editor).toHaveText('()');await page.keyboard.type('7');await expect(editor).toHaveText('(7)');
 await editor.fill('while True:\n    pass');await page.locator('#run').click();await page.locator('#stop').click();await expect(page.locator('#run')).toBeEnabled();
 await context.setOffline(true);await page.reload();await expect(page.locator('#run')).toBeEnabled();await editor.fill('print(6 * 7)');await page.locator('#run').click();await expect(page.locator('#output')).toContainText('42',{timeout:60000});
 await page.setViewportSize({width:390,height:844});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});

