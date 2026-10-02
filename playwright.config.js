import {defineConfig} from '@playwright/test';
export default defineConfig({testDir:'./e2e',timeout:120000,use:{baseURL:'http://localhost:4173',channel:'msedge'},webServer:{command:'npm.cmd run preview',url:'http://localhost:4173',reuseExistingServer:true},workers:1});

