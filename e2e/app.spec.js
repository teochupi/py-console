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
test('console distinguishes input, output and errors in execution order', async ({page}) => {
 await page.goto('/');
 await expect(page.locator('#run')).toBeEnabled({timeout:60000});
 const editor = page.locator('.cm-content');
 await editor.fill('print("Before", end="")\nname = input("Name: ")\nprint("Hello", name)\nimport sys\nprint("Warning", file=sys.stderr)\nraise ValueError("Example")');
 await page.locator('#run').click();
 await expect(page.locator('#input-form')).toBeVisible({timeout:60000});
 // A print without a newline must appear before the response is entered.
 await expect(page.locator('.console-stdout')).toContainText('Before');
 await page.locator('#input').fill('<img src=x>');
 await page.locator('#input-form button').click();
 await expect(page.locator('#run')).toBeEnabled({timeout:60000});
 await expect(page.locator('.console-input')).toHaveText('› Name: <img src=x>');
 await expect(page.locator('.console-input img')).toHaveCount(0);
 await expect(page.locator('.console-stderr').first()).toContainText('Warning');
 await expect(page.locator('.console-stderr').last()).toContainText('ValueError');
 const entries = await page.locator('.console-entry').evaluateAll(nodes => nodes.map(node => ({kind:node.className,text:node.textContent})));
 expect(entries[0].text).toContain('Before');
 expect(entries[1].kind).toContain('console-input');
 expect(entries[2].text).toContain('Hello');
 await page.locator('#theme').click();
 await expect(page.locator('html')).toHaveAttribute('data-theme','light');
 await page.locator('#clear').click();
 await expect(page.locator('#output')).toBeEmpty();
});


