import { test, expect } from '../src/fixtures/pagefixtures.js';
import { CsvHelper } from '../src/utils/CsvHelper.js';

test.beforeEach(async ({registrationPage}) => {
   await registrationPage.gotoRegistrationPage();
});

//common test for all pages 
test('verify logo and footer on product page test', async({basePage}) => {
expect(await basePage.isLogoVisible()).toBeTruthy();
});

test('verify all footers exist on the page test', async({basePage}) => {
expect(await basePage.checkFootersCounts()).toBe(16);
});
test('Verify registration page title test', async({registrationPage}) => {
    const pageTitle = await registrationPage.getRegistrationPageTitle();
    console.log('Page title is ', pageTitle);
});

let userData = CsvHelper.readCsv("src/data/registerData.csv");
for(let row of userData) {
test(`Enter New User Info test Entering for - ${row.firstname} - ${row.lastname}` ,async({ registrationPage }) => {
   await registrationPage.enterUserInformation(row.firstname!, row.lastname!, row.password!);
   const successMessage = await registrationPage.verifyRegistrationSuccess();
   expect(successMessage).toBe('Your Account Has Been Created!');   
});
}
