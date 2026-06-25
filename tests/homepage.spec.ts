import {test, expect } from '@playwright/test';
import { LoginPage } from '../src/pages/LoginPage.js';
import { HomePage } from '../src/pages/HomePage.js';

let loginPage: LoginPage;
let homePage: HomePage;

test.beforeEach(async ({page}) => {
    loginPage = new LoginPage(page);
    await loginPage.gotoLoginPage();
    await loginPage.doLogin(process.env.APP_USERNAME!,process.env.APP_PASSWORD!);    
    homePage = new HomePage(page);
});

test('Home Page title test', async() => {
    const pageTitle = await homePage.getPageTitle();
    console.log('Home Page title : ' , pageTitle);
    expect(pageTitle).toBe('My Account');
});

test('log out link exist test ', async() => {
    expect(await homePage.isLogoutLinkExist()).toBeTruthy();
});

test('Home Page Headers test', async() => {
let allHeaders = await homePage.getHomePageHeaders();
console.log('home page headers: ', allHeaders);
expect.soft(allHeaders).toHaveLength(4);
expect.soft(allHeaders).toEqual([
    'My Account', 'My Orders', 'My Affiliate Account', 'Newsletter'
])
});

