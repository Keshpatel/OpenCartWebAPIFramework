import {test , expect } from '../src/fixtures/pagefixtures.js';
import { CsvHelper } from '../src/utils/CsvHelper.js';
import { ExcelHelper } from '../src/utils/ExcelHelper.js';
import { JsonHelper } from '../src/utils/JsonHelper.js';

test.beforeEach(async ({loginPage }) => {    
    await loginPage.gotoLoginPage();    
});

//common test for all pages 
test('@sanity verify logo and footer on product page test', async({basePage}) => {
    expect(await basePage.isLogoVisible()).toBeTruthy();
});

test('@sanityverify all footers exist on the page test', async({basePage}) => {
    expect(await basePage.checkFootersCounts()).toBe(16);
});

test('@sanity Login Page with fixture test', async({loginPage}) => {
    const pageTitle = await loginPage.getPageTitle();
    console.log('Login Page title : ' , pageTitle);
    expect(pageTitle).toBe('Account Login');
});
test('@regression verify Forgot Password link with fixture test', async({loginPage}) => {
    let flag = await loginPage.isForgotPwdLinkExist();
    console.log(flag);
    expect(flag).toBeTruthy();
});
test('verify User able to logIn Successfully with fixture test', async({loginPage, homePage}) => {
    // console.log("Spec USERNAME =", process.env.USERNAME);
    // console.log("Spec PASSWORD =", process.env.PASSWORD);
    await loginPage.doLogin(process.env.APP_USERNAME!, process.env.APP_PASSWORD!);
    expect.soft(await homePage.isLogoutLinkExist()).toBeTruthy();
    expect.soft(await homePage.getPageTitle()).toBe('My Account');
});

// 1.  Test data using fixture 
// sequence. mode -- only single test running test data one by one 
test('Login using invalid credentials with data driven with fixture test', async({loginPage, loginTestData}) => {

    for(let row of loginTestData) {
        await loginPage.doLogin(row.username!, row.password!);
        expect(await loginPage.idInvalidLoginErrorDisplayed()).toBeTruthy();
    }
});

//2 . Without fixtures , parallel mode .
//  read csv data directly and loop the test method( test() ) ,
//  inside for loop .
let testData = CsvHelper.readCsv('src/data/loginData.csv');
for(let row of testData) {
    test(`@sanity invalid login test with -${row.username} - ${row.password}`, async ({ loginPage }) => {
        await loginPage.doLogin(row.username!, row.password!);
        expect(await loginPage.idInvalidLoginErrorDisplayed()).toBeTruthy();
    });
}

//3 Ms excel  - office latest 
//xlsx format only 
// Required High maintenance ( so always csv preferable )
let loginTestData = ExcelHelper.readExcel('src/data/openCartTestdata.xlsx', 'login');
for(let row of loginTestData) {
    test(`invalid login test with excel data  -${row.username} - ${row.password}`, async ({ loginPage }) => {
        await loginPage.doLogin(row.username!, row.password!);
        expect(await loginPage.idInvalidLoginErrorDisplayed()).toBeTruthy();
    });
}


let loginJsonTestData = JsonHelper.readJson('src/data/loginData.json');
for(let row of loginJsonTestData) {
    test(`invalid login test with json data  -${row.username} - ${row.password}`, async ({ loginPage }) => {
        await loginPage.doLogin(row.username!, row.password!);
        expect(await loginPage.idInvalidLoginErrorDisplayed()).toBeTruthy();
    });
}