import {defineConfig} from '@playwright/test';
export default defineConfig({testDir:'./e2e',timeout:120000,use:{baseURL:'http://localhost:4173',channel:process.platform==='win32'?'msedge':undefined},webServer:{command:process.platform==='win32'?'npm.cmd run preview':'npm run preview',url:'http://localhost:4173',reuseExistingServer:true},workers:1});

