# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: homepagefix.spec.ts >> verify logo and footer on home page test
- Location: tests/homepagefix.spec.ts:8:1

# Error details

```
Test timeout of 30000ms exceeded while running "beforeEach" hook.
```

```
Error: page.goto: net::ERR_ABORTED; maybe frame was detached?
Call log:
  - navigating to "https://naveenautomationlabs.com/opencart/index.php?route=common/home", waiting until "load"

```

# Test source

```ts
  1  | 
  2  | import { Locator, Page } from "@playwright/test";
  3  | import { BasePage } from "./BasePage.js";
  4  | 
  5  | export class HomePage extends BasePage {
  6  |     //Private Locators:
  7  |     private readonly logoutLink: Locator;
  8  |   
  9  | 
  10 |     //Constructor of the class and initialize the locators .
  11 | constructor(page: Page) {
  12 |     super(page)
  13 |     this.logoutLink = page.getByRole('link', {name : 'Logout'});
  14 |     
  15 |     };
  16 |     
  17 |     //public page actions (methods) / behavior  
  18 |    
  19 |     async goToHomePage():Promise<void> {
> 20 |         await this.page.goto('/opencart/index.php?route=common/home');
     |                         ^ Error: page.goto: net::ERR_ABORTED; maybe frame was detached?
  21 |     }
  22 |     
  23 |     async isLogoutLinkExist(): Promise<boolean> {
  24 |         return await this.logoutLink.isVisible();
  25 |     }
  26 |    
  27 |     async doSearch(searchKey: string): Promise<void> {
  28 |         console.log(`Search Key is ${searchKey}`);
  29 |         await this.searchTextBox.fill(searchKey);
  30 |         await this.searchIcon.click();
  31 |     }
  32 | }
```