
import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage.js";

export class SearchResultsPage extends BasePage {
    //Private Locators:
    private readonly searchResults : Locator;   

    //Constructor of the class and initialize the locators .
constructor(page: Page) {
    super(page)
    this.searchResults = page.locator('div.product-layout');
    };
    
    //Actions (methods) / behavior  
    async getProductSearchResultCount(): Promise<number> {
        return await this.searchResults.count();
    }

    async selectProduct(productName: string) : Promise<void> {
        await this.page.getByRole('link', { name: productName, exact : true }).first().click();
    }
}