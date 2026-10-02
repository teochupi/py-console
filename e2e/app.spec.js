import {test,expect} from '@playwright/test';
test('Python input, autosave, toolbar, Stop and offline',async({page,context,browserName})=>{
 await page.goto('/');await expect(page.locator('#run')).toBeEnabled({timeout:60000});
 await expect(page.locator('.cm-content')).toHaveText('');await expect(page.locator('#output')).toHaveText('');
 const editor=page.locator('.cm-content');await editor.fill('name = input("Name: ")\nprint("Hello", name)');
 await page.locator('#run').click();await expect(page.locator('#input-form')).toBeVisible({timeout:60000});await page.locator('#input').fill('Иван');await page.locator('#input-form button').click();await expect(page.locator('#output')).toContainText('Hello Иван');await expect(page.locator('#run')).toBeEnabled();
 await page.reload();await expect(editor).toContainText('name = input');await expect(page.locator('#run')).toBeEnabled();
 await editor.fill('');await page.getByRole('button',{name:'()',exact:true}).click();await expect(editor).toHaveText('()');await page.keyboard.type('7');await expect(editor).toHaveText('(7)');
 await editor.fill('while True:\n    pass');await page.locator('#run').click();await page.locator('#stop').click();await expect(page.locator('#run')).toBeEnabled();
 if (browserName !== 'webkit') {
  await context.setOffline(true);await page.reload();await expect(page.locator('#run')).toBeEnabled();
 } else {
  // WebKit offline emulation rejects SW navigations even with literal responses.
  // https://github.com/microsoft/playwright/issues/42775
  test.info().annotations.push({type:'limitation',description:'Offline navigation requires a real iPhone check; Playwright WebKit issue #42775'});
 }await editor.fill('print(6 * 7)');await page.locator('#run').click();await expect(page.locator('#output')).toContainText('42',{timeout:60000});
 await page.setViewportSize({width:390,height:844});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await editor.click();
 expect(await editor.evaluate(node=>parseFloat(getComputedStyle(node).fontSize))).toBeGreaterThanOrEqual(16);
 expect(await page.locator('#input').evaluate(node=>parseFloat(getComputedStyle(node).fontSize))).toBeGreaterThanOrEqual(16);
 const gutter=await page.locator('.cm-gutters').boundingBox();
 expect(gutter.x).toBeGreaterThanOrEqual(0);
 expect(gutter.x+gutter.width).toBeLessThanOrEqual(390);
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
 await expect(page.locator('.console-input')).toHaveText('> Name: <img src=x>');
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



test('hello world and author link on phone browsers', async ({page,context}) => {
 await page.goto('/');
 await expect(page.locator('#run')).toBeEnabled({timeout:60000});
 await page.locator('.cm-content').fill("print('Hello, world')");
 await page.locator('#run').click();
 await expect(page.locator('#run')).toBeEnabled({timeout:60000});
 await expect(page.locator('#output')).toHaveText('Hello, world\n');
 await context.route('https://teodor-chupetlov.eu/**',route=>route.fulfill({status:200,contentType:'text/html',body:'<title>Author website</title>'}));
 const link = page.getByRole('link',{name:'teodor-chupetlov.eu'});
 await expect(link).toHaveAttribute('target','_blank');
 const popupPromise = page.waitForEvent('popup');
 await link.click();
 const popup = await popupPromise;
 await expect(popup).toHaveURL('https://teodor-chupetlov.eu/');
 await expect(page.locator('#run')).toBeEnabled();
});

test('failed interface bundle offers recovery without losing saved code', async ({page}) => {
 await page.addInitScript(() => localStorage.setItem('py-console.code','print(42)'));
 await page.route('**/assets/*.js', route => route.abort());
 await page.goto('/');
 await expect(page.getByRole('button',{name:'Обнови приложението'})).toBeVisible({timeout:25000});
 await page.unroute('**/assets/*.js');
 await page.getByRole('button',{name:'Обнови приложението'}).click();
 await expect(page.locator('#run')).toBeEnabled({timeout:60000});
 await expect(page.locator('.cm-content')).toHaveText('print(42)');
});

test('stalled preparation times out and can be retried', async ({page}) => {
 await page.addInitScript(() => {
  const container=navigator.serviceWorker;
  const register=container.register.bind(container);
  let first=true;
  container.register=(...args)=>{if(first){first=false;return new Promise(()=>{});}return register(...args);};
 });
 await page.clock.install();
 await page.goto('/');
 await expect(page.locator('.cm-content')).toBeVisible();
 await page.locator('.cm-content').fill('print(42)');
 await page.clock.fastForward(46000);
 await expect(page.locator('#retry')).toBeVisible();
 await page.clock.resume();
 await page.locator('#retry').click();
 await expect(page.locator('#run')).toBeEnabled({timeout:60000});
 await expect(page.locator('.cm-content')).toHaveText('print(42)');
});

test('unfinished input survives reload and is restored on Run',async({page})=>{
 await page.goto('/');await expect(page.locator('#run')).toBeEnabled({timeout:60000});
 await page.locator('.cm-content').fill('name = input("Name: ")\nprint("Hello", name)');
 await page.locator('#run').click();
 await expect(page.locator('#input-form')).toBeVisible({timeout:60000});
 await page.locator('#input').fill('Иван');
 await page.reload();
 await expect(page.locator('#run')).toBeEnabled({timeout:60000});
 await expect(page.locator('#output')).toContainText('Изпълнението беше прекъснато.');
 await page.locator('#run').click();
 await expect(page.locator('#input-form')).toBeVisible({timeout:60000});
 await expect(page.locator('#input')).toHaveValue('Иван');
 await page.locator('#input-form button').click();
 await expect(page.locator('#output')).toContainText('Hello Иван');
 await expect(page.locator('#run')).toBeEnabled();
 await expect.poll(()=>page.evaluate(()=>localStorage.getItem('py-console.input-draft'))).toBeNull();
});

test('Stop preserves an input draft but changing code does not reuse it',async({page})=>{
 await page.goto('/');await expect(page.locator('#run')).toBeEnabled({timeout:60000});
 await page.locator('.cm-content').fill('print(input())');
 await page.locator('#run').click();await expect(page.locator('#input-form')).toBeVisible({timeout:60000});
 await page.locator('#input').fill('draft');
 await page.locator('#stop').click();await expect(page.locator('#run')).toBeEnabled();
 await page.locator('#run').click();await expect(page.locator('#input-form')).toBeVisible({timeout:60000});
 await expect(page.locator('#input')).toHaveValue('draft');
 await page.locator('#stop').click();
 await page.locator('.cm-content').fill('value = input()\nprint(value)');
 await page.locator('#run').click();await expect(page.locator('#input-form')).toBeVisible({timeout:60000});
 await expect(page.locator('#input')).toHaveValue('');
 await page.locator('#stop').click();
 page.once('dialog',dialog=>dialog.accept());
 await page.locator('#new').click();
 expect(await page.evaluate(()=>localStorage.getItem('py-console.input-draft'))).toBeNull();
});

test('interrupted input bridge shows a restart message and preserves the answer',async({page})=>{
 await page.addInitScript(()=>{
  const NativeWorker=window.Worker;
  window.Worker=class extends NativeWorker{
   constructor(...args){super(...args);this.addEventListener('message',event=>{if(event.data.type==='input')window.testInputId=event.data.id;});}
  };
 });
 await page.goto('/');await expect(page.locator('#run')).toBeEnabled({timeout:60000});
 await page.locator('.cm-content').fill('print(input())');
 await page.locator('#run').click();await expect(page.locator('#input-form')).toBeVisible({timeout:60000});
 await page.locator('#input').fill('42');
 await page.evaluate(()=>navigator.serviceWorker.controller.postMessage({type:'cancel-input',id:window.testInputId}));
 await expect(page.locator('#run')).toBeEnabled();
 await expect(page.locator('#output')).toContainText('Изпълнението беше прекъснато.');
 expect(JSON.parse(await page.evaluate(()=>localStorage.getItem('py-console.input-draft')))[0].value).toBe('42');
});

test('a later input draft survives replaying earlier input',async({page})=>{
 await page.goto('/');await expect(page.locator('#run')).toBeEnabled({timeout:60000});
 await page.locator('.cm-content').fill('first = input()\nsecond = input()\nprint(first, second)');
 await page.locator('#run').click();await expect(page.locator('#input-form')).toBeVisible({timeout:60000});
 await page.locator('#input').fill('one');await page.locator('#input-form button').click();
 await expect(page.locator('#input-form')).toBeVisible();
 await page.locator('#input').fill('unfinished two');
 await page.reload();await expect(page.locator('#run')).toBeEnabled({timeout:60000});
 await page.locator('#run').click();await expect(page.locator('#input-form')).toBeVisible({timeout:60000});
 await expect(page.locator('#input')).toHaveValue('');
 await page.locator('#input').fill('new one');await page.locator('#input-form button').click();
 await expect(page.locator('#input-form')).toBeVisible();
 await expect(page.locator('#input')).toHaveValue('unfinished two');
 await page.locator('#input-form button').click();
 await expect(page.locator('#output')).toContainText('new one unfinished two');
 await expect(page.locator('#run')).toBeEnabled();
});
