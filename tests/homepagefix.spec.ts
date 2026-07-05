import { test, expect } from '../src/fixtures/pagefixtures.js';

test.beforeEach(async ({homePage}) => {   
   await homePage.goToHomePage();
});

//common test for all pages 
test('verify logo and footer on home page test', async({basePage}) => {
    expect(await basePage.isLogoVisible()).toBeTruthy();
});

test('verify all footers exist on the page test', async({basePage}) => {
expect(await basePage.checkFootersCounts()).toBe(16);
});

test('@sanity Home Page title test with fixtures', async({homePage}) => {
    const pageTitle = await homePage.getPageTitle();
    console.log('Home Page title : ' , pageTitle);
    expect(pageTitle).toBe('Your Store');
});


