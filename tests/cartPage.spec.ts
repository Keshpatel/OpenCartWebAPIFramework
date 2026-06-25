import { test, expect } from '../src/fixtures/pagefixtures.js';

const searchKeys = ['macbook', 'ipod', 'imac', 'iphone'];
const productNames = ['MacBook Pro','iPod Classic','iMac','iPhone'];

test.beforeEach(async({ loginPage, cartPage }) => {
   await loginPage.gotoLoginPage();
   await loginPage.doLogin(process.env.APP_USERNAME!, process.env.APP_PASSWORD!);
   await cartPage.clearCart();
});

test('Verify shopping cart product information test ', async ({ homePage, searchResultsPage, productDetailsPage,cartPage }) => {
      for (let i = 0; i < searchKeys.length; i++) 
         {
            await homePage.goToHomePage();
            await homePage.doSearch(searchKeys[i]!);
            await searchResultsPage.selectProduct(productNames[i]!);
            await productDetailsPage.addToCart();
            const actualHeaders = await cartPage.getShoppingCartHeaders();
            expect.soft(actualHeaders).toEqual(['Image','Product Name','Model','Quantity','Unit Price','Total']);
            const actualProductName = await cartPage.getShoppingCartProductInfo();
            expect.soft(actualProductName).toBe(productNames[i]);

            let couponMessage = await cartPage.applyCoupon(); 
            couponMessage = couponMessage.replace('×', '').trim();
            console.log(couponMessage); 
            expect.soft(couponMessage.trim()).toContain('Warning: Coupon is either invalid, expired or reached its usage limit!'); 

            await cartPage.shippingPanel();
            const shippingInfo = await cartPage.getShippingInfo();
            expect.soft(shippingInfo.country).toBe('Canada');
            expect.soft(shippingInfo.province).toBe('Alberta');
            expect.soft(shippingInfo.postCode).toBe('T2P1J9');
            await cartPage.getQuotesVerification();    
            
            let actualMessage = await cartPage.applyGiftCertificate('1234');
            expect.soft(actualMessage).toContain('Gift Certificate is either invalid');       
            await cartPage.removeProductFromCart();
            await cartPage.isLogoAccessible();
      }
});
