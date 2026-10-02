import {test,expect} from '@playwright/test';
test('published app loads and executes Python', async ({page}) => {
 test.skip(!process.env.PUBLISHED_URL,'Production smoke only after deployment');
 page.on('pageerror',error=>console.log('PAGE ERROR:',error.message));
 page.on('requestfailed',request=>console.log('REQUEST FAILED:',request.url(),request.failure()?.errorText));
 page.on('response',response=>{if(response.status()>=400)console.log('HTTP ERROR:',response.status(),response.url());});
 await page.goto(process.env.PUBLISHED_URL,{waitUntil:'domcontentloaded'});
 await expect(page.locator('#run')).toBeEnabled({timeout:60000});
 await page.locator('.cm-content').fill('print(42)');
 await page.locator('#run').click();
 await expect(page.locator('#output')).toHaveText('42\n',{timeout:60000});
});
