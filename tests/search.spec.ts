import { test, expect } from '../src/fixtures/pagefixtures.js';
import { CsvHelper } from '../src/utils/CsvHelper.js';

test.beforeEach(async ({loginPage}) => {   
    await loginPage.gotoLoginPage();
    //await loginPage.doLogin('tom_smith@3dTechnode.ca','!Spring123');
    await loginPage.doLogin(process.env.APP_USERNAME!, process.env.APP_PASSWORD!);
});


// Data Provider
const productData = CsvHelper.readCsv('src/data/product.csv');
for (const row of productData) {
    test(`verify searchResults count - ${row.searchkey!} - ${row.productname!}`, async ({ homePage, searchResultsPage }) => {
        await homePage.doSearch(row.searchkey!);
        expect(
            await searchResultsPage.getProductSearchResultCount()
        ).toBe(Number(row.resultcount));
    });
}

for (const row of productData) {
    test(`verify user navigate to product page - ${row.searchkey!} - ${row.productname!}`, async ({ homePage, searchResultsPage, page }) => {
        await homePage.doSearch(row.searchkey!);
        await searchResultsPage.selectProduct(row.productname!);
        expect(await page.title()).toBe(row.productname!);
    });
}

//common test for all pages 
test('verify logo and footer on product page test', async({basePage}) => {
expect(await basePage.isLogoVisible()).toBeTruthy();
});

test('verify all footers exist on the page test', async({basePage}) => {
expect(await basePage.checkFootersCounts()).toBe(16);
});

