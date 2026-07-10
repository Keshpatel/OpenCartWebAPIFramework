# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: registration.spec.ts >> verify logo and footer on product page test
- Location: tests/registration.spec.ts:9:1

# Error details

```
Test timeout of 30000ms exceeded while running "beforeEach" hook.
```

```
Error: page.goto: net::ERR_ABORTED; maybe frame was detached?
Call log:
  - navigating to "https://naveenautomationlabs.com/opencart/index.php?route=account/register", waiting until "load"

```

# Test source

```ts
  1  | import { Locator, Page } from '@playwright/test'
  2  | import { BasePage } from './BasePage.js';
  3  | import { RandomDataUtil } from '../utils/RandomDataUtil.js';
  4  | 
  5  | export class RegistrationPage extends BasePage {
  6  |     // Private Locators
  7  |     private readonly firstName: Locator;
  8  |     private readonly lastName: Locator;
  9  |     private readonly email: Locator;
  10 |     private readonly phone: Locator;
  11 |     private readonly password: Locator;
  12 |     private readonly confirmPassword: Locator;
  13 |     private readonly newsLetter: Locator;
  14 |     private readonly agreeCheckBox: Locator;
  15 |     private readonly continueButton: Locator;
  16 |     private readonly registrationSuccessMessage: Locator;   
  17 | 
  18 | 
  19 |     constructor(page: Page) {
  20 |         super(page);
  21 |         this.firstName = page.getByPlaceholder('First Name');
  22 |         this.lastName = page.getByPlaceholder('Last Name');
  23 |         this.email = page.getByPlaceholder('E-Mail');
  24 |         this.phone = page.getByPlaceholder('Telephone');
  25 |         this.password = page.getByRole('textbox', { name: '* Password', exact: true });
  26 |         this.confirmPassword = page.getByRole('textbox', { name: '* Password Confirm', exact: true});
  27 |         this.newsLetter = page.getByLabel('Yes');
  28 |         this.agreeCheckBox = page.locator('[name="agree"]');
  29 |         this.continueButton = page.getByRole('button', { name: 'Continue' });
  30 |         this.registrationSuccessMessage = page.locator('#content h1');
  31 |     };
  32 | 
  33 | async gotoRegistrationPage(): Promise<void> {
> 34 |     await this.page.goto('https://naveenautomationlabs.com/opencart/index.php?route=account/register');
     |                     ^ Error: page.goto: net::ERR_ABORTED; maybe frame was detached?
  35 | }
  36 | 
  37 | async getRegistrationPageTitle(): Promise<string> {
  38 |     return await this.page.title();
  39 | }
  40 | 
  41 | async enterUserInformation(firstname:string , lastname:string, password:string): Promise<void> {
  42 |     const email = RandomDataUtil.generateEmail(firstname);
  43 |     const phone = RandomDataUtil.generatePhone();
  44 |     console.log('Entering New User Information to registration');  
  45 |     
  46 |     await this.firstName.fill(firstname);
  47 |     await this.lastName.fill(lastname);   
  48 |     await this.email.fill(email);
  49 |     await this.phone.fill(phone);   
  50 |     await this.password.fill(password);
  51 |     await this.confirmPassword.fill(password);   
  52 |     await this.newsLetter.click();  
  53 |     await this.agreeCheckBox.check(); 
  54 |     // Prints the Username and Pwds for review the registerd users login info.
  55 |     await this.continueButton.click();
  56 |     
  57 | }
  58 | async verifyRegistrationSuccess(): Promise<string> {
  59 |   return await this.registrationSuccessMessage.innerText();
  60 | }
  61 | }
```