# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: loginpagefixture.spec.ts >> @sanity invalid login test with -invalid@open.com - wrongPassword123
- Location: tests/loginpagefixture.spec.ts:52:5

# Error details

```
Test timeout of 30000ms exceeded while running "beforeEach" hook.
```

```
Error: page.goto: net::ERR_ABORTED; maybe frame was detached?
Call log:
  - navigating to "https://naveenautomationlabs.com/opencart/index.php?route=account/login", waiting until "load"

```

# Test source

```ts
  1  | import { Locator, Page } from "@playwright/test";
  2  | import { BasePage } from "./BasePage.js";
  3  | 
  4  | export class LoginPage extends BasePage {
  5  |     //Private Locators:
  6  |     private readonly emailId: Locator;
  7  |     private readonly password: Locator;
  8  |     private readonly loginBtn: Locator;
  9  |     private readonly forgottenPasswordLink: Locator;
  10 |    // private readonly logo: Locator;
  11 |     private readonly loginErrorMessage : Locator;
  12 | 
  13 |     //Constructor of the class and initialize the locators .
  14 | constructor(page: Page) {
  15 |     super(page)
  16 |     this.emailId = page.getByRole('textbox', {name : 'E-Mail Address'});
  17 |     this.password = page.getByRole('textbox', {name : 'Password'});
  18 |     this.loginBtn = page.getByRole('button', {name : 'Login'});
  19 |     this.forgottenPasswordLink = page.getByRole('link', {name: 'Forgotten Password'}).first();
  20 |     //this.logo = page.getByAltText('naveenopencart');
  21 |     this.loginErrorMessage = page.locator(".alert.alert-danger.alert-dismissible");
  22 |     };
  23 |     
  24 |     //public page actions (methods) / behavior
  25 |     async gotoLoginPage(): Promise<void> {
  26 |         console.log("==================================");
  27 |         console.log("ENV =", process.env.ENV);
  28 |         console.log("BASE_URL =", process.env.BASE_URL);
  29 |         console.log("==================================");
> 30 |         await this.page.goto(`https://naveenautomationlabs.com/opencart/index.php?route=account/login`);                                    
     |                         ^ Error: page.goto: net::ERR_ABORTED; maybe frame was detached?
  31 |     }
  32 |       
  33 |     async getLoginPageTitle(): Promise<string> {
  34 |         return await this.page.title();
  35 |     }
  36 |     async isForgotPwdLinkExist(): Promise<boolean> {
  37 |         return await this.forgottenPasswordLink.isVisible();
  38 |     }
  39 |     async doLogin(username:string , password:string): Promise<void> { 
  40 |         console.log(`user login info: ${username} : ${password}`);
  41 |         await this.emailId.fill(username);
  42 |         await this.password.fill(password);
  43 |         await this.loginBtn.click();
  44 |     }
  45 |     async idInvalidLoginErrorDisplayed() : Promise<boolean> {
  46 |         return await this.loginErrorMessage.isVisible();
  47 |     }
  48 |     
  49 | }
```