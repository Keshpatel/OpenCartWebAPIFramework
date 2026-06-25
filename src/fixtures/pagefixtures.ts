import { test as baseTest } from '@playwright/test'
import { LoginPage } from '../pages/LoginPage.js'
import { HomePage } from '../pages/HomePage.js';
import { CsvHelper } from '../utils/CsvHelper.js';
import { SearchResultsPage } from '../pages/SearchResultsPage.js';
import { RegistrationPage } from '../pages/RegistrationPage.js';
import { ProductInfoPage } from '../pages/ProductInfoPage.js';
import { BasePage } from '../pages/BasePage.js';
import { CartPage } from '../pages/CartPage.js';


//create / define type for page fixtures: // type alias  concept of TS concept 
type myFixtures = {
    basePage: BasePage;
    registrationPage: RegistrationPage;
    loginPage: LoginPage;
    homePage: HomePage;
    searchResultsPage: SearchResultsPage;
    productDetailsPage: ProductInfoPage;
    cartPage: CartPage;
    testData: Record<string, string>[];
    loginTestData: Record<string, string>[];
};
//extend Playwright base test:
export let test = baseTest.extend<myFixtures> ({    

    loginPage: async({page}, use) => {
        let loginPage = new LoginPage(page);
        await use(loginPage);
    },

    registrationPage: async({page}, use) => {
        let registrationPage = new RegistrationPage(page);
        await use(registrationPage);
    },

    basePage : async({page}, use) => {
        let basePage = new BasePage(page);
        await use(basePage);
    },

    homePage: async({page}, use) => {
        let homePage = new HomePage(page);
        await use(homePage);
    },

    searchResultsPage: async({page}, use) => {
        let searchResultsPage = new SearchResultsPage(page);
        await use(searchResultsPage);
    },

    productDetailsPage: async({page}, use) => {
        let productDetailsPage = new ProductInfoPage(page);
        await use(productDetailsPage);
    },

    testData: async({}, use)  => {
        let testData = CsvHelper.readCsv('src/data/product.csv');
        await use(testData);
    },

    loginTestData: async({}, use) => {
        let LoginTestData = CsvHelper.readCsv('src/data/loginData.csv');
        await use(LoginTestData);
    },

    cartPage: async({page}, use) => {
        let cartPage = new CartPage(page);
        await use(cartPage);
    },

    
});

export { expect } from '@playwright/test';

