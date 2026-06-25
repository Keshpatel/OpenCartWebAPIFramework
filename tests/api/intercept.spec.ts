// for any Web App in the background you you need to intercept network call and log the item...
// ** Start wild cart pattern = wildcart -- matched all url 

import { test , expect } from '@playwright/test'

//intercept the network calls...
test('Intercept and log requests ', async ({ page }) =>{
    await page.route('**/*', async(route)=>{
        console.log(route.request().method(), route.request().url());
        await route.continue();   //url1 -- capture and continue , url1 -- capture and continue ....
    });

    await page.goto('https://www.google.com/');
    await page.goto('https://naveenautomationlabs.com/opencart/index.php?route=common/home');
});

//intercept with mocking:
//mocking : fake data / response 


test('Mock the search data API ', async({page}) => {
   let fakeProducts = [
    {name : 'Fake macbook Pro ',price:'$1000'},
    {name : 'Fake iphone 20', price: "$500"}
   ];

   await page.route('**/index.php?route=product/search&search=macbook',(route)=>{
        route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify(fakeProducts)
       });
    });

     // URL can be any thing
    await page.goto('https://abc1234.com/opencart/index.php?route=product/search&search=macbook');
    await page.pause();

    let fakeJson = await page.evaluate(async () => {
        let fakeRes = await fetch('https://abc1234.com/opencart/index.php?route=product/search&search=macbook');
        return await fakeRes.json();
    });
    console.log("Fake Jason Response : ", fakeJson);
    
});