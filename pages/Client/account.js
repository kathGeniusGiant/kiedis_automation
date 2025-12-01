import { expect } from '@playwright/test';
import { MailSlurp } from "mailslurp-client";
import dotenv from 'dotenv';

dotenv.config();

export class AccountPage {
  constructor(page) {
    this.page = page;

    // Test Data
    this.newEmail = 'anotheremail@yopmail.com';
    this.existingEmail = 'qacompany@yopmail.com';
    this.invalidEmail = 'invalidemailformat';

    // Navigation links
    this.linkAccount = page.getByRole('link', { name: 'Account' });
    this.accountURL = 'https://test.kiedis.com/en/accounts/email/';
    this.changePasswordURL = 'https://test.kiedis.com/en/accounts/password/change/';

    // Headings
    this.heading = page.getByRole('heading', { name: 'Profile & Email Management' });
    this.accountInfoHeading = page.getByText('Account Information');
    this.emailAddressesHeading = page.getByText('Email Addresses');
    this.accountActionsHeading = page.getByText('Account Actions');

    // Account Info
    this.firstNameLabel = page.getByText('First Name: Qa');
    this.lastNameLabel = page.getByText('Last Name: Company');
    this.dateJoinedLabel = page.getByText('Date Joined');

    // Email section
    this.verifiedBadge = page.getByText('Verified');
    this.primaryBadge = page.getByText('Primary');
    this.addEmailInput = page.getByPlaceholder('Email address');
    this.addEmailBtn = page.getByRole('button', { name: 'Add Email' });

    // Account Actions
    this.linkchangePassword = page.getByRole('link', { name: 'Change Password' });
    this.signOutBtn = page.getByRole('main').getByRole('link', { name: 'Sign Out' });

    // Change Password Page
    this.headingChangePassword = page.getByRole('heading', { name: 'Change Password' });
    this.currentPasswordInput = page.getByRole('textbox', { name: 'Current Password' });
    this.newPasswordInput = page.getByRole('textbox', { name: 'New Password', exact: true });
    this.confirmNewPasswordInput = page.getByRole('textbox', { name: 'New Password (again)' });
    this.submitChangePasswordBtn = page.getByRole('button', { name: 'Change Password' });
    this.backToAccountLink = page.getByRole('link', { name: 'Back to Profile' });

    // Add Email Page
    this.newEmailInput = page.getByPlaceholder('Email address');
    this.addNewEmailBtn = page.getByRole('button', { name: 'Add Email' });
    this.textConfirmationEmailSent = page.getByText(`Confirmation email sent to ${this.newEmail}`);
    this.resendVerificationBtn = page.getByRole('button', { name: 'Resend Verification' });
    this.removeEmailBtn = page.getByRole('button', { name: 'Remove' }).first();
    this.textVerified = page.getByText('Unverified');
    this.removeConfirmation = page.getByText(`Removed email address ${this.newEmail}.`);
  }

  /* --------------------------------------------
   * Navigation
   * -------------------------------------------- */
  async gotoAccountPage() {
    await this.linkAccount.click();
    await expect(this.page).toHaveURL(this.accountURL);
  }

  /* --------------------------------------------
   * Layout Verification
   * -------------------------------------------- */
  async verifyBasicLayout() {
    await expect(this.heading).toBeVisible();
    await expect(this.accountInfoHeading).toBeVisible();
    await expect(this.emailAddressesHeading).toBeVisible();
    await expect(this.accountActionsHeading).toBeVisible();
    await expect(this.firstNameLabel).toBeVisible();
    await expect(this.lastNameLabel).toBeVisible();
    await expect(this.dateJoinedLabel).toBeVisible();
    await expect(this.addEmailInput).toBeVisible();
    await expect(this.addEmailBtn).toBeVisible();
    await expect(this.linkchangePassword).toBeVisible();
    await expect(this.signOutBtn).toBeVisible();
  }

  async verifyEmailBadges() {
    await expect(this.verifiedBadge).toBeVisible();
    await expect(this.primaryBadge).toBeVisible();
  }

  /* --------------------------------------------
   * Add Email – Blank Fields & Validation
   * -------------------------------------------- */
  async addAnotherEmailBlankFields() {
    // Empty field
    await this.addNewEmailBtn.click();
    let validationMsg = await this.newEmailInput.evaluate(el => el.validationMessage);
    expect(validationMsg).toContain('Please fill out this field');

    // Invalid format
    await this.newEmailInput.fill(this.invalidEmail);
    await this.addNewEmailBtn.click();
    validationMsg = await this.newEmailInput.evaluate(el => el.validationMessage);
    expect(validationMsg).toContain("Please include an '@' in the email address.");

    // Existing email
    await this.newEmailInput.fill(this.existingEmail);
    await this.addNewEmailBtn.click();

    const errorBox = this.page.locator('.bg-error-100');
    await expect(errorBox).toBeVisible();
    await expect(errorBox.locator('h3')).toHaveText('Please correct the following errors:');
    await expect(errorBox.locator('li').first()).toHaveText(
      'This email address is already associated with this account.'
    );

    // Add new email
    await this.newEmailInput.fill(this.newEmail);
    await this.addNewEmailBtn.click();

    await expect(this.textConfirmationEmailSent).toBeVisible();
    await expect(this.textVerified).toBeVisible();
    await expect(this.resendVerificationBtn).toBeVisible();
    await expect(this.removeEmailBtn).toBeVisible();

    // Accept dialog
    this.page.once('dialog', dialog => dialog.accept());
    await this.removeEmailBtn.click();
    await expect(this.removeConfirmation).toBeVisible();
  }

  /* --------------------------------------------
   * Add Email – Using MailSlurp
   * -------------------------------------------- */
  async addAnotherEmail() {
    const mailslurp = new MailSlurp({ apiKey: process.env.MAILSLURP_API_KEY });

    const inbox = await mailslurp.createInbox();
    const tempEmail = inbox.emailAddress;

    // Add email
    await this.newEmailInput.fill(tempEmail);
    await this.addNewEmailBtn.click();

    // Wait for email
    const email = await mailslurp.waitForLatestEmail(inbox.id, 30000);
    const verificationLinkMatch = email.body.match(/https?:\/\/[^\s]+/);

    if (!verificationLinkMatch) throw new Error("Verification link not found in email.");

    const verificationLink = verificationLinkMatch[0];

    // Open verification URL
    await this.page.goto(verificationLink);
    await expect(this.page.getByText(`You have confirmed ${tempEmail}`)).toBeVisible();

    // Return to account page
    await this.linkAccount.click();

    // Verify badges
    await expect(this.page.getByText('Verified').first()).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Make Primary' })).toBeVisible();

    // Make primary
    await this.page.getByRole('button', { name: 'Make Primary' }).click();
    await expect(this.page.getByText('Primary email address set.')).toBeVisible();
    await expect(this.page.getByText('Primary', { exact: true })).toBeVisible();

    // Remove email (confirm)
    this.page.once('dialog', dialog => dialog.accept());
    await this.removeEmailBtn.click();
    await expect(
    this.page.getByText(new RegExp(`You cannot remove your primary email address.*${tempEmail}`, "i"))
    ).toBeVisible();

    await this.page.getByRole('button', { name: 'Make Primary' }).click();
    this.page.once('dialog', dialog => dialog.accept());
    await this.removeEmailBtn.click();
    await expect(this.page.getByText(`Removed email address ${tempEmail}`)).toBeVisible();
  }

  /* --------------------------------------------
   * Change Password – Field Validations
   * -------------------------------------------- */
  async blankFields(currentPasswordInput, newPasswordInput, confirmNewPasswordInput, mismatchPwd, weakPwd1, weakPwd2) {
    let validationMsg;

    await this.linkchangePassword.click();
    await expect(this.page).toHaveURL(this.changePasswordURL);

    // Navigate back to ensure heading exists
    await expect(this.headingChangePassword).toBeVisible();
    await this.backToAccountLink.click();
    await expect(this.page).toHaveURL(this.accountURL);
    await this.linkchangePassword.click();

    // Empty CURRENT PASSWORD
    await this.submitChangePasswordBtn.click();
    validationMsg = await this.currentPasswordInput.evaluate(el => el.validationMessage);
    expect(validationMsg).toContain('Please fill out this field');
    await this.currentPasswordInput.fill(currentPasswordInput);

    // Empty NEW PASSWORD
    await this.submitChangePasswordBtn.click();
    validationMsg = await this.newPasswordInput.evaluate(el => el.validationMessage);
    expect(validationMsg).toContain('Please fill out this field');
    await this.newPasswordInput.fill(newPasswordInput);

    // Empty CONFIRM PASSWORD
    await this.submitChangePasswordBtn.click();
    validationMsg = await this.confirmNewPasswordInput.evaluate(el => el.validationMessage);
    expect(validationMsg).toContain('Please fill out this field');
    await this.confirmNewPasswordInput.fill(mismatchPwd);

    // Mismatch
    await this.submitChangePasswordBtn.click();
    const errorBox = this.page.locator('.bg-error-100');
    await expect(errorBox).toBeVisible();
    await expect(errorBox.locator('h3')).toHaveText('Please correct the following errors:');
    await expect(errorBox.locator('li').first()).toHaveText('You must type the same password each time.');

    // Weak password
    await this.currentPasswordInput.fill(currentPasswordInput);
    await this.newPasswordInput.fill(weakPwd1);
    await this.confirmNewPasswordInput.fill(weakPwd2);
    await this.submitChangePasswordBtn.click();

    await expect(errorBox).toBeVisible();
    await expect(errorBox.locator('li').first()).toHaveText(
      'This password is too short. It must contain at least 8 characters.'
    );
  }

  /* --------------------------------------------
   * Change Password – Success
   * -------------------------------------------- */
  async changePasswordSuccessfully(currentPasswordInput, newPasswordInput, confirmNewPasswordInput) {
    await this.linkchangePassword.click();
    await expect(this.page).toHaveURL(this.changePasswordURL);

    await this.currentPasswordInput.fill(currentPasswordInput);
    await this.newPasswordInput.fill(newPasswordInput);
    await this.confirmNewPasswordInput.fill(confirmNewPasswordInput);
    await this.submitChangePasswordBtn.click();

    await expect(this.page.getByText('Password successfully changed.')).toBeVisible();
  }

  /* --------------------------------------------
   * Revert Password
   * -------------------------------------------- */
  async revertPassword(currentPasswordInput, newPasswordInput, confirmNewPasswordInput) {
    await expect(this.page).toHaveURL(this.changePasswordURL);

    await this.currentPasswordInput.fill(currentPasswordInput);
    await this.newPasswordInput.fill(newPasswordInput);
    await this.confirmNewPasswordInput.fill(confirmNewPasswordInput);
    await this.submitChangePasswordBtn.click();

    await expect(this.page.getByText('Password successfully changed.')).toBeVisible();
  }
}
