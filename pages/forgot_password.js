import { expect } from '@playwright/test';
import MailSlurp from "mailslurp-client";
import { inboxId, testEmail, getConfirmationLink } from '../pages/storeEmailForgotPass.js';
import dotenv from 'dotenv';
dotenv.config();

export class forgotPasswordPage {
  constructor(page) {
    this.page = page;

    // Test data
    this.icorrectEmailFormat = 'incorrectEmailformatyopmail.com';
    this.resetPasswordURL = 'https://test.kiedis.com/en/accounts/password/reset/';

    // Locators
    this.linkForgotYourPassword = page.getByRole('link', { name: 'Forgot your password?' });
    this.emailAddressInput = page.getByPlaceholder("Email address");
    this.btnResetMyPassword = page.getByRole('button', { name: 'Reset My Password' });
    this.newPasswordInput = page.getByRole('textbox', { name: 'New Password', exact: true });
    this.confirmPasswordInput = page.getByRole('textbox', { name: 'New Password (again)' });
    this.btnChangePassword = page.getByRole('button', { name: 'Change Password' });
  }

  async gotoForgotPasswordPage() {
    await this.page.goto('https://test.kiedis.com/en/accounts/login/');
    await this.linkForgotYourPassword.click();
    await expect(this.page).toHaveURL(this.resetPasswordURL);
  }

  async VerifyResetPassPage() {
    let validationMsg;
    await expect(this.page.getByRole('heading', { name: 'Reset Password' })).toBeVisible();
    await expect(this.page.getByText(
      "Forgotten your password? Enter your email address below, and we'll send you an email allowing you to reset it."
    )).toBeVisible();

    // Empty field validation
    await this.emailAddressInput.fill('');
    await this.btnResetMyPassword.click();
    validationMsg = await this.emailAddressInput.evaluate(el => el.validationMessage);
    expect(validationMsg).toContain('Please fill out this field');

    // Invalid email format validation
    await this.emailAddressInput.fill(this.icorrectEmailFormat);
    await this.btnResetMyPassword.click();
    validationMsg = await this.emailAddressInput.evaluate(el => el.validationMessage);
    expect(validationMsg).toContain("Please include an '@' in the email address");
  }

  async verifyChangePasswordPage(testEmail, context) {
    let validationMsg;

    // Fill email and request password reset
    await this.emailAddressInput.fill(testEmail);
    await this.btnResetMyPassword.click();

    // Get reset-password link from MailSlurp
    const resetLink = await getConfirmationLink({ timeout: 30000 });

    // Open reset link
    await this.page.goto(resetLink);

    // Verify Change Password page
    await expect(this.page.getByRole("heading", { name: "Change Password" })).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Cancel' })).toBeVisible();

    // Empty password validation
    await this.newPasswordInput.fill('');
    await this.btnChangePassword.click();
    validationMsg = await this.newPasswordInput.evaluate(el => el.validationMessage);
    expect(validationMsg).toContain('Please fill out this field');

    // Fill short password and check confirm field
    await this.newPasswordInput.fill('abc');
    await this.btnChangePassword.click();
    validationMsg = await this.confirmPasswordInput.evaluate(el => el.validationMessage);
    expect(validationMsg).toContain('Please fill out this field');

    await this.confirmPasswordInput.fill('abc');
    await this.btnChangePassword.click();

    // Validate errors for weak password
    const errorBox = this.page.locator('.bg-error-100');
    await expect(errorBox).toBeVisible();
    await expect(errorBox.locator('h3')).toHaveText('Please correct the following errors:');
    const errorItems = errorBox.locator('li');
    await expect(errorItems.nth(0)).toHaveText('This password is too short. It must contain at least 8 characters.');
    await expect(errorItems.nth(1)).toHaveText('This password is too common.');

    // Password mismatch validation
    await this.newPasswordInput.fill('Test@123');
    await this.confirmPasswordInput.fill('Test@1234');
    await this.btnChangePassword.click();

    const errorBox1 = this.page.locator('.bg-error-100');
    await expect(errorBox1).toBeVisible();
    await expect(errorBox1.locator('h3')).toHaveText('Please correct the following errors:');
    const errorItems1 = errorBox1.locator('li');
    await expect(errorItems1.first()).toHaveText('You must type the same password each time.');
  }

  async resetPasswordSuccessfully(testEmail, context) {
    // Request password reset
    await this.emailAddressInput.fill(testEmail);
    await this.btnResetMyPassword.click();

    // Verify reset request page
    await expect(this.page).toHaveURL('https://test.kiedis.com/en/accounts/password/reset/done/');
    await expect(this.page.getByRole('heading', { name: 'Password Reset Email Sent' })).toBeVisible();
    await expect(this.page.locator('div').filter({
      hasText: "Email sent successfully! We've emailed you instructions for setting your password. If an account with that email exists, you should receive them shortly."
    }).nth(2)).toBeVisible();
    await expect(this.page.getByText('If you don\'t receive an email')).toBeVisible();
    await expect(this.page.getByRole('link', { name: 'Back to Sign In' })).toBeVisible();

    // Get reset-password link from MailSlurp
    const resetLink = await getConfirmationLink({ timeout: 30000 });
    await this.page.goto(resetLink);

    // Fill new passwords and submit
    await this.newPasswordInput.fill("NewPassword123!");
    await this.confirmPasswordInput.fill("NewPassword123!");
    await this.btnChangePassword.click();

    // Verify success messages
    await expect(this.page.getByText('Password successfully changed.')).toBeVisible();
    await expect(this.page.getByRole('heading', { name: 'Password Changed Successfully' })).toBeVisible();
    await expect(this.page.locator('div').filter({ hasText: "Success! Your password has been successfully changed." }).nth(2)).toBeVisible();
    await expect(this.page.getByText('You can now sign in with your')).toBeVisible();

    // Navigate back to sign in
    await this.page.getByRole('main').getByRole('link', { name: 'Sign In' }).click();
  }
}
