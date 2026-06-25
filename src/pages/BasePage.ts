import { Locator, Page } from "@playwright/test";

export class BasePage {
    protected readonly page: Page;

   //common locators across  all pages 
   protected readonly logo: Locator;
   protected readonly mainMenu: Locator;
   protected readonly subMenus: Locator;
   protected readonly searchTextBox: Locator;
   protected readonly searchIcon: Locator;
   protected readonly footerLinks: Locator;
   protected readonly cartButton: Locator;
   protected readonly currencyDropdown: Locator;

    constructor( page : Page ) {
        this.page = page;
        this.logo = page.getByRole('img', { name: 'naveenopencart' });
        this.mainMenu = page.locator('#nemu');
        this.subMenus = page.locator('#menu ul.nav.navbar-nav > li');
        this.searchTextBox = page.locator('#search input');
        this.searchIcon = page.locator('#search button');
        this.footerLinks = page.locator('footer a');
        this.cartButton = page.locator('#cart button');
        this.currencyDropdown = page.getByText('Currency', { exact: true });
    }

    async isLogoVisible(): Promise<boolean> {
        return await this.logo.isVisible();
    }

    async isLogoAccessible(): Promise<void> {
        await this.logo.waitFor();
        await this.logo.click();
    }

    async isMainMenuVisible(): Promise<boolean> {
        return await this.mainMenu.isVisible();
    }
    
    async getSubMenuCount(): Promise<number> {
        return await this.subMenus.count();
    }

    async verifySearchBoxVisible(): Promise<boolean> {
        return await this.searchTextBox.isVisible();
    }

    async verifySearchIconVisible(): Promise<boolean> {
        return await this.searchIcon.isVisible();
    }

    async checkFootersCounts(): Promise<number> {
        return await this.footerLinks.count();
    }

    async countAllFooters(): Promise<string[]> {
        return await this.footerLinks.allInnerTexts();
    }

    async isCurrencyDopDownVisible(): Promise<boolean> {
        return await this.currencyDropdown.isVisible();
    }

    async isCartButtonVisible(): Promise<boolean> {
        return await this.cartButton.isVisible();
    }

    //Page Level generic Methods 
    async getPageTitle(): Promise<string> {
        return this.page.title();
    }

    getPageUrl(): string {
        return this.page.url();
    }

    async waitForPageLoad() {
        await this.page.waitForLoadState('load');
    }

    async screenCapture(name: string) {
        return this.page.screenshot({
            fullPage: true,
            path: `report/screenshot/${name}.png`
        });
    }
    
    
    
}