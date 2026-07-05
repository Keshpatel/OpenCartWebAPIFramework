import {test, expect } from '@playwright/test';
import { HomePage } from '../src/pages/HomePage.js';

let homePage: HomePage;
test.beforeEach(async ({page}) => {
    homePage = new HomePage(page);
    await homePage.goToHomePage();
});


test('Home Page title test', async() => {
    const pageTitle = await homePage.getPageTitle();
    console.log('Home Page title : ' , pageTitle);
    expect(pageTitle).toBe('Your Store');
});
