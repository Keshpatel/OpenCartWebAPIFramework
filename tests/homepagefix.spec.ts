import { test, expect } from '../src/fixtures/pagefixtures.js';

test.beforeEach(async ({loginPage}) => {   
    await loginPage.gotoLoginPage();
     await loginPage.doLogin(process.env.USERID!,process.env.PWD!); 
});

//common test for all pages 
test('verify logo and footer on product page test', async({basePage}) => {
expect(await basePage.isLogoVisible()).toBeTruthy();
});

test('verify all footers exist on the page test', async({basePage}) => {
expect(await basePage.checkFootersCounts()).toBe(16);
});

test('Home Page title test with fixtures', async({homePage}) => {
    const pageTitle = await homePage.getPageTitle();
    console.log('Home Page title : ' , pageTitle);
    expect(pageTitle).toBe('My Account');
});

test('log out link exist test with fixtures', async({homePage}) => {
    expect(await homePage.isLogoutLinkExist()).toBeTruthy();
});

test('Home Page Headers test with fixtures', async({homePage}) => {
let allHeaders = await homePage.getHomePageHeaders();
console.log('home page headers: ', allHeaders);
expect.soft(allHeaders).toHaveLength(4);
expect.soft(allHeaders).toEqual([
    'My Account', 'My Orders', 'My Affiliate Account', 'Newsletter'
])
});

