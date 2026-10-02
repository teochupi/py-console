import {defineConfig, devices} from '@playwright/test';
export default defineConfig({
 testDir:'./e2e',timeout:120000,workers:1,
 use:{baseURL:'http://localhost:4173'},
 projects:[
  {name:'chromium',use:{browserName:'chromium',channel:process.platform==='win32'?'msedge':undefined}},
  {name:'webkit-iphone',use:{...devices['iPhone 13'],browserName:'webkit'}},
 ],
 webServer:{command:process.platform==='win32'?'npm.cmd run preview':'npm run preview',url:'http://localhost:4173',reuseExistingServer:true},
});
