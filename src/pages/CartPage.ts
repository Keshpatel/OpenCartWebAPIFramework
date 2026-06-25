import {Locator, Page} from '@playwright/test'
import { BasePage } from './BasePage.js';

export class CartPage extends BasePage {

    private readonly headers: Locator;
    private readonly shoppingCart: Locator;
    private readonly productImage: Locator;
    private readonly productName: Locator;

    private readonly couponPanel: Locator;
    private readonly couponTextBox: Locator;
    private readonly applyCouponBtn: Locator; 
    private readonly alertMessage: Locator;   

    private readonly shippingAndTaxPanel: Locator;
    private readonly country: Locator;
    private readonly province: Locator;
    private readonly postCode: Locator;
    private readonly getQuotesBtn: Locator;
    private readonly shippingModel: Locator;
    private readonly shippingModelTitle: Locator;
    private readonly shippingRateRadio: Locator;
    private readonly applyShippingBtn: Locator;
    private readonly shippingAddedSuccessMsg: Locator;

    private readonly giftCertificatePanel: Locator; 
    private readonly giftVoucherInput: Locator;
    private readonly applyGiftCert: Locator;
    private readonly totalPriceModel: Locator;
    private readonly removeProductFromCartBtn: Locator;



    constructor(page: Page ) {
    super(page)
    this.shoppingCart = page.locator(`#checkout-cart ul`).filter({hasText: `Shopping cart`});
    this.headers = page.locator('table.table-bordered thead tr td');
    this.productImage = page.locator('#content tbody a ').first();
    this.productName = page.locator('#content table tbody tr td:nth-child(2) a').first();
    this.couponPanel = page.getByRole('link', { name: 'Use Coupon Code' });
    this.couponTextBox = page.locator('#input-coupon');
    this.applyCouponBtn = page.getByRole('button', { name: 'Apply Coupon' });  
    this.shippingAndTaxPanel = page.getByRole('link', { name: 'Estimate Shipping & Taxes' });
    this.country = page.getByRole('combobox', { name: 'Country' });
    this.province = page.getByRole('combobox', { name: 'Region / State' });
    this.postCode = page.getByRole('textbox', { name: 'Post Code' });
    this.getQuotesBtn = page.getByRole('button', { name: 'Get Quotes' });
    this.shippingModel = page.locator('.modal-content');
    this.shippingModelTitle = page.getByRole('heading', { name: 'Please select the preferred shipping method to use on this order.', level: 4 });
    this.shippingRateRadio = page.locator('label').filter({hasText: 'Shipping Rate'});
    this.applyShippingBtn = page.getByRole('button', { name: 'Apply Shipping' });
    this.shippingAddedSuccessMsg = page.getByText('Success: Your shipping estimate has been applied!', { exact: true });
    this.giftCertificatePanel  = page.getByRole('link', { name: 'Use Gift Certificate' });
    this.giftVoucherInput = page.locator('#input-voucher');
    this.applyGiftCert = page.getByRole('button', { name: 'Apply Gift Certificate' });
    this.alertMessage = page.locator('#checkout-cart .alert');
    this.totalPriceModel = page.locator('.table.table-bordered').last();
    this.removeProductFromCartBtn = page.locator('.btn-danger');
    };

    async clearCart(): Promise<void> {
        await this.page.goto('https://naveenautomationlabs.com/opencart/index.php?route=checkout/cart');
        while (await this.page.locator('.btn-danger').count() > 0) {
            await this.removeProductFromCartBtn.last().click();
        }
    }

    async getShoppingCartHeaders(): Promise<string[]> {
        await this.shoppingCart.waitFor();
        await this.headers.first().waitFor();
        let capturedHeaders = await this.headers.allTextContents();
        console.log("Headers are : ", capturedHeaders);
        return capturedHeaders.map((header: string) => header.trim());
    }

    async getShoppingCartProductInfo(): Promise<string> {
        await this.productImage.waitFor();
        await this.productName.first().innerText();
        return await this.productName.first().innerText(); 

    }

    async removeProductFromCart(): Promise<void> {
        await this.removeProductFromCartBtn.last().click();
    }    

    //After clicking Apply Coupon, Playwright immediately reads the alert before the DOM updates.
    async applyCoupon(): Promise<string> {
        await this.couponPanel.click();  
        await this.couponTextBox.fill('20');
        await this.applyCouponBtn.click();  
        const couponAlert = this.page.locator('#checkout-cart .alert').filter({ hasText: 'Coupon' });
        await couponAlert.waitFor();
        return (await couponAlert.textContent())?.trim() ?? '';  
    }

    async applyGiftCertificate(voucherCode: string): Promise<string> {
        await this.giftCertificatePanel.click();
        await this.giftVoucherInput.fill(voucherCode);
        await this.applyGiftCert.click();
        const giftAlert = this.page.locator('#checkout-cart .alert').filter({ hasText: 'Gift Certificate' });
        await giftAlert.waitFor();
        return (await giftAlert.textContent())?.trim() ?? '';
    }

    async shippingPanel(): Promise<void> { 
        await this.shippingAndTaxPanel.click();
        await this.country.selectOption({ label: 'Canada' });
        await this.province.selectOption({ label: 'Alberta' });
        await this.postCode.fill('T2P1J9');    
    }
    
    async getShippingInfo(): Promise<{ country: string | null; province: string | null; postCode: string;}> {
        return {
            country: await this.country.locator('option:checked').textContent(),
            province: await this.province.locator('option:checked').textContent(),
            postCode: await this.postCode.inputValue()
        };
    }

    async getQuotesVerification(): Promise<void> {
        await this.getQuotesBtn.click();
        await this.shippingModel.isVisible();
        await this.shippingModelTitle.isVisible();
        await this.shippingRateRadio.click();
        await this.applyShippingBtn.click();
        await this.shippingAddedSuccessMsg.isVisible();
    }


    async totalPricingModel() : Promise<void> {
        await this.totalPriceModel.waitFor();
    }
}
