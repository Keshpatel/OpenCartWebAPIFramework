
import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage.js";

export class HomePage extends BasePage {
    //Private Locators:
    private readonly logoutLink: Locator;
  

    //Constructor of the class and initialize the locators .
constructor(page: Page) {
    super(page)
    this.logoutLink = page.getByRole('link', {name : 'Logout'});
    
    };
    
    //public page actions (methods) / behavior  
   
    async goToHomePage():Promise<void> {
        await this.page.goto('/opencart/index.php?route=common/home');
    }
    
    async isLogoutLinkExist(): Promise<boolean> {
        return await this.logoutLink.isVisible();
    }
   
    async doSearch(searchKey: string): Promise<void> {
        console.log(`Search Key is ${searchKey}`);
        await this.searchTextBox.fill(searchKey);
        await this.searchIcon.click();
    }
}