import {test, expect } from '@playwright/test';
import { LoginPage } from '../src/pages/LoginPage.js';
import { HomePage } from '../src/pages/HomePage.js';

let loginPage: LoginPage;
let homePage: HomePage;

test.beforeEach(async ({page}) => {
    loginPage = new LoginPage(page);
    await loginPage.gotoLoginPage();
    homePage = new HomePage(page);
});

test('Login Page title test', async() => {
    const pageTitle = await loginPage.getLoginPageTitle();
    console.log('Login Page title : ' , pageTitle);
    expect(pageTitle).toBe('Account Login');   // Login Page title 
});

test('verify Forgot Password link test', async() => {
    let flag = await loginPage.isForgotPwdLinkExist();
    console.log(flag);
    expect(flag).toBeTruthy();
});

test('verify User able to logIn Successfully  test', async() => {
await loginPage.doLogin('tom_smith@3dTechnode.ca','!Spring123');
expect.soft(await homePage.isLogoutLinkExist()).toBeTruthy();
expect.soft(await homePage.getPageTitle()).toBe('My Account');   // Home Page title 

});