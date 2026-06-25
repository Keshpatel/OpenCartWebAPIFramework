import { test, expect } from '../src/fixtures/pagefixtures.js'
import { CsvHelper } from '../src/utils/CsvHelper.js';


test.beforeEach(async({ loginPage }) => {
   await loginPage.gotoLoginPage();
   await loginPage.doLogin(process.env.APP_USERNAME!, process.env.APP_PASSWORD!);
});

//common test for all pages 
test('verify logo and footer on product page test', async({basePage}) => {
   expect(await basePage.isLogoVisible()).toBeTruthy();
});
test('verify all footers exist on the page test', async({basePage}) => {
   expect(await basePage.checkFootersCounts()).toBe(16);
});

test('verify searched product images count test ', async ({ homePage, searchResultsPage, productDetailsPage }) => {
   await homePage.doSearch('macbook');
   await searchResultsPage.selectProduct('MacBook Pro');
   let imgCount = await productDetailsPage.getProductImages();
   console.log('total images: ', imgCount);
   expect(imgCount).toBe(4);
});

//without CSV 
test("Generate Product information and full details,", async ({homePage, searchResultsPage, productDetailsPage }) => {
   await homePage.doSearch('imac');
   await searchResultsPage.selectProduct('iMac');
   let productFullDetails = await productDetailsPage.getProductInfo();
   console.log('Product Details Are :', productFullDetails);    
   expect.soft(productFullDetails.get('Product Header')).toBe('iMac');
   expect.soft(productFullDetails.get('Brand')).toBe('Apple');
   expect.soft(productFullDetails.get('Product Code')).toBe('Product 14');
   expect.soft(productFullDetails.get('Product Price')).toBe('$122.00');
   expect.soft(productFullDetails.get('External Text Price')).toBe('$100.00'); 
});

//with CSV 
let productCsvData = CsvHelper.readCsv('src/data/MultipleProducts.csv');
// console.log(productCsvData);
for (let row of productCsvData) {
   test(`verify each product details test for -${row.ProductName}`, async({ homePage, searchResultsPage, productDetailsPage })=>{
      await homePage.doSearch(row['SearchKey']!);
      await searchResultsPage.selectProduct(row['ProductName']!);      
      let productDetails = await productDetailsPage.getProductInfo(); 
      // console.log('Product Details Are :', productDetails);       // console.log([...productDetails.keys()]);  
      expect.soft(productDetails.get('Product Header')).toBe(row['ProductHeader']);
      expect.soft(productDetails.get('Brand')).toBe(row['Brand']);
      expect.soft(String(productDetails.get('Product Code')).toLowerCase()).toBe(String(row['ProductCode']?.toLowerCase()));
      expect.soft(productDetails.get('Product Price')).toBe(row['Price']);
      expect.soft(productDetails.get('External Text Price')).toBe(row['ExTaxPrice']); 
   })
}

for(let row of productCsvData) 
{
   test(`Add Product to cart test -${row.ProductName}`, async({ homePage, searchResultsPage, productDetailsPage  }) => {
         await homePage.doSearch(row['SearchKey']!);
         await searchResultsPage.selectProduct(row['ProductName']!);     
         await productDetailsPage.addToCart();         
   })
}

















