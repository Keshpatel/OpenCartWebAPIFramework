import { Locator, Page } from '@playwright/test'
import { BasePage } from './BasePage.js';
import { RandomDataUtil } from '../utils/RandomDataUtil.js';

export class RegistrationPage extends BasePage {
    // Private Locators
    private readonly firstName: Locator;
    private readonly lastName: Locator;
    private readonly email: Locator;
    private readonly phone: Locator;
    private readonly password: Locator;
    private readonly confirmPassword: Locator;
    private readonly newsLetter: Locator;
    private readonly agreeCheckBox: Locator;
    private readonly continueButton: Locator;
    private readonly registrationSuccessMessage: Locator;   


    constructor(page: Page) {
        super(page);
        this.firstName = page.getByPlaceholder('First Name');
        this.lastName = page.getByPlaceholder('Last Name');
        this.email = page.getByPlaceholder('E-Mail');
        this.phone = page.getByPlaceholder('Telephone');
        this.password = page.getByRole('textbox', { name: '* Password', exact: true });
        this.confirmPassword = page.getByRole('textbox', { name: '* Password Confirm', exact: true});
        this.newsLetter = page.getByLabel('Yes');
        this.agreeCheckBox = page.locator('[name="agree"]');
        this.continueButton = page.getByRole('button', { name: 'Continue' });
        this.registrationSuccessMessage = page.locator('#content h1');
    };

async gotoRegistrationPage(): Promise<void> {
    await this.page.goto('https://naveenautomationlabs.com/opencart/index.php?route=account/register');
}

async getRegistrationPageTitle(): Promise<string> {
    return await this.page.title();
}

async enterUserInformation(firstname:string , lastname:string, password:string): Promise<void> {
    const email = RandomDataUtil.generateEmail(firstname);
    const phone = RandomDataUtil.generatePhone();
    console.log('Entering New User Information to registration');  
    
    await this.firstName.fill(firstname);
    await this.lastName.fill(lastname);   
    await this.email.fill(email);
    await this.phone.fill(phone);   
    await this.password.fill(password);
    await this.confirmPassword.fill(password);   
    await this.newsLetter.click();  
    await this.agreeCheckBox.check();    
    await this.continueButton.click();
    console.log("New Email Registed : ",);
    console.log("New Email Registed : ",);
}
async verifyRegistrationSuccess(): Promise<string> {
  return await this.registrationSuccessMessage.innerText();
}
}