
import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage.js";

export class ProductInfoPage extends BasePage {
    //Private Locators:
    private readonly header : Locator;   
    private readonly productImages : Locator;   
    private readonly productMetaData : Locator;   
    private readonly productPricing : Locator;  
    private readonly quantityTextBox : Locator;
    private readonly addToCartButton: Locator;
    private readonly shoppingCart: Locator;
    private map: Map<string, string|number>;



    //Constructor of the class and initialize the locators .
constructor(page: Page) {
    super(page)
        this.header = page.getByRole('heading', { level: 1 });    //page.locator('h1');
        this.productImages = page.locator('div#content li img');
        this.productMetaData = page.locator('div#content ul.list-unstyled:nth-of-type(1) li');
        this.productPricing = page.locator('div#content ul.list-unstyled:nth-of-type(2) li');
        this.quantityTextBox = page.getByRole('textbox', { name: 'Qty' });
        this.addToCartButton = page.locator('#product').getByRole('button', { name: 'Add to Cart' });
        this.shoppingCart = page.getByRole('link', { name: 'shopping cart' , exact: true }).last();

        this.map = new Map<string, string|number>();  // initializing map

};

    //Actions (methods) / behavior      
    /***
     * getProductInfo(): @returns => Product Information 
     * Header , Images , MetaData , Pricing Data 
     * */
    async getProductInfo(): Promise<Map<string, string|number>> {
        this.map.set('Product Header', await this.getProductHeader());
        this.map.set('Product Images', await this.getProductImages());
        await this.getProductMetaData();
        await this.getProductPricing();
        return this.map;
    }

    async getProductHeader(): Promise<string> {
        return await this.header.innerText();
    }    
    async getProductImages(): Promise<number> {
        //await this.page.waitForTimeout(4000);
        await this.productImages.first().waitFor({state: 'visible'});
        return await this.productImages.count();
    }
    private async getProductMetaData(): Promise<void> {
        let metaDataInfo = await this.productMetaData.allInnerTexts();
        for (let info of metaDataInfo) {
            let meta = info.split(':');
            if (meta.length >= 2) {
                let metaKey = meta[0]?.trim() ?? '';
                let metaVal = meta[1]?.trim() ?? '';
                this.map.set(metaKey, metaVal);
            }
        }
    }

    private async getProductPricing(): Promise<void> {
        let productPriceList = await this.productPricing.allInnerTexts();
        let productPrice = productPriceList[0]?.trim();
        let externalTextPrice = productPriceList[1]?.split(":")[1]?.trim();
        this.map.set('Product Price', productPrice!);
        this.map.set('External Text Price', externalTextPrice!);

    }

    async addToCart(): Promise<void> {
        await this.quantityTextBox.fill('1');
        await this.addToCartButton.click();
        await this.shoppingCart.click();
    }      
    
}
