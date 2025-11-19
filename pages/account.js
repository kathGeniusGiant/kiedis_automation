import { expect } from '@playwright/test';
// import { MailSlurp } from "mailslurp-client";

export class AccountPage {
  constructor(page) {
    this.page = page;
    this.newEmail = 'anotheremail@yopmail.com';
    this.existingEmail = 'qaautomation@yopmail.com';
    this.invalidEmail = 'invalidemailformat';

    this.linkAccount = page.getByRole('link', { name: 'Account' });
    this.accountURL = 'https://test.kiedis.com/en/accounts/email/';
    this.changePasswordURL = 'https://test.kiedis.com/en/accounts/password/change/';

    // Headings
    this.heading = page.getByRole('heading', { name: 'Profile & Email Management' });
    this.accountInfoHeading = page.getByText('Account Information');
    this.emailAddressesHeading = page.getByText('Email Addresses');
    this.accountActionsHeading = page.getByText('Account Actions');

    // Account info values (we check for presence of labels and the values may vary)
    this.firstNameLabel = page.getByText('First Name: QA');
    this.lastNameLabel = page.getByText('Last Name: Automation');
    this.dateJoinedLabel = page.getByText('Date Joined');

    // Email row badges and input
    this.verifiedBadge = page.getByText('Verified');
    this.primaryBadge = page.getByText('Primary');
    this.addEmailInput = page.getByPlaceholder('Email address');
    this.addEmailBtn = page.getByRole('button', { name: 'Add Email' });

    // Account actions
    this.linkchangePassword = page.getByRole('link', { name: 'Change Password' });
    this.signOutBtn = page.getByRole('main').getByRole('link', { name: 'Sign Out' });

    //Change Password Page Elements
    this.headingChangePassword = page.getByRole('heading', { name: 'Change Password' });
    this.currentPasswordInput = page.getByRole('textbox', { name: 'Current Password' });
    this.newPasswordInput = page.getByRole('textbox', { name: 'New Password', exact: true });
    this.confirmNewPasswordInput = page.getByRole('textbox', { name: 'New Password (again)' });
    this.submitChangePasswordBtn = page.getByRole('button', { name: 'Change Password' });
    this.backToAccountLink = page.getByRole('link', { name: 'Back to Profile' });

    //Add Email Page Elements
    this.newEmailInput = page.getByPlaceholder('Email address');
    this.addNewEmailBtn = page.getByRole('button', { name: 'Add Email' });
    this.textConfirmationEmailSent = page.getByText(`Confirmation email sent to ${this.newEmail}`);
    this.resendVerificationBtn = page.getByRole('button', { name: 'Resend Verification' });
    this.removeEmailBtn = page.getByRole('button', { name: 'Remove' }).first();
    this.textVerified = page.getByText('Unverified');
    this.removeConfirmation = page.getByText(`Removed email address ${this.newEmail}.`);
  }

  async gotoAccountPage() {
    await this.linkAccount.click();
    await expect(this.page).toHaveURL(this.accountURL);
  }

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

  async addAnotherEmail() {
    // const mailslurp = new MailSlurp({ apiKey: process.env.MAILSLURP_API_KEY });
    //Empty field validation
    await this.addNewEmailBtn.click();
    let validationMsg = await this.newEmailInput.evaluate(el => el.validationMessage);
    expect(validationMsg).toContain('Please fill out this field');

    //Invalid email format validation
    await this.newEmailInput.fill(this.invalidEmail);
    await this.addNewEmailBtn.click();
    validationMsg = await this.newEmailInput.evaluate(el => el.validationMessage);
    expect(validationMsg).toContain("Please include an '@' in the email address. 'invalidemailformat' is missing an '@'.");

    // Try to add an existing email first
    await this.newEmailInput.fill(this.existingEmail);  
    await this.addNewEmailBtn.click();
    // Verify error message for existing email
    const errorBox = this.page.locator('.bg-error-100');
    await expect(errorBox).toBeVisible();
    await expect(errorBox.locator('h3')).toHaveText('Please correct the following errors:');
    const errorItems = errorBox.locator('li');
    await expect(errorItems.first()).toHaveText('This email address is already associated with this account.');

    // Add new email
    await this.newEmailInput.fill(this.newEmail);
    await this.addNewEmailBtn.click();

    await expect(this.textConfirmationEmailSent).toBeVisible();
    await expect(this.textVerified).toBeVisible();
    await expect(this.resendVerificationBtn).toBeVisible();
    await expect(this.removeEmailBtn).toBeVisible();

    // Accept the native confirm dialog
    this.page.once('dialog', dialog => dialog.accept());

    // Click the Remove button
    await this.removeEmailBtn.click();

    // Verify success message or updated UI
    await expect(this.removeConfirmation).toBeVisible();

    // // --- 4. Create a new temporary MailSlurp email ---
    // const inbox = await mailslurp.createInbox();
    // const tempEmail = inbox.emailAddress;

    // // Fill the new email in your app
    // await this.newEmailInput.fill(tempEmail);
    // await this.addNewEmailBtn.click();

    // // Wait for confirmation email
    // const email = await mailslurp.waitForLatestEmail(inbox.id, 30000); // wait up to 30s
    // const verificationLinkMatch = email.body.match(/https?:\/\/[^\s]+/);
    // if (!verificationLinkMatch) throw new Error("Verification link not found in email.");
    // const verificationLink = verificationLinkMatch[0];

    // // Open the verification link in a new tab
    // const newTab = await this.page.context().newPage();
    // await newTab.goto(verificationLink);

    // // Verify that the email verification page loaded
    // await expect(newTab.locator('text=Email Verified')).toBeVisible();
    // await newTab.close();
  }

  async blankFields(currentPasswordInput, newPasswordInput, confirmNewPasswordInput, mismatchPwd, weakPwd1, weakPwd2) {
    let validationMsg;
      await this.linkchangePassword.click();
      await expect(this.page).toHaveURL(this.changePasswordURL);
      await expect(this.headingChangePassword).toBeVisible();
      await this.backToAccountLink.click();
      await expect(this.page).toHaveURL(this.accountURL);
      await this.linkchangePassword.click();

      //CURRENT PASSWORD EMPTY
      await this.submitChangePasswordBtn.click();
      validationMsg = await this.currentPasswordInput.evaluate(el => el.validationMessage);
      expect(validationMsg).toContain('Please fill out this field');
      await this.currentPasswordInput.fill(currentPasswordInput);
     
      //NEW PASSWORD EMPTY
      await this.submitChangePasswordBtn.click();
      validationMsg = await this.newPasswordInput.evaluate(el => el.validationMessage);
      expect(validationMsg).toContain('Please fill out this field');
      await this.newPasswordInput.fill(newPasswordInput);

      //CONFIRM PASSWORD EMPTY
      await this.submitChangePasswordBtn.click();
      validationMsg = await this.confirmNewPasswordInput.evaluate(el => el.validationMessage);
      expect(validationMsg).toContain('Please fill out this field');
      await this.confirmNewPasswordInput.fill(mismatchPwd);

     //password mismtach
     await this.submitChangePasswordBtn.click();
      const errorBox = this.page.locator('.bg-error-100');
        await expect(errorBox).toBeVisible();
        // Validate header text
        await expect(errorBox.locator('h3')).toHaveText('Please correct the following errors:');
        // Validate list item(s)
      const errorItems = errorBox.locator('li');
        // There is only 1 error item in your screenshot
        await expect(errorItems.first()).toHaveText('You must type the same password each time.');

      //weak password
      await this.currentPasswordInput.fill(currentPasswordInput);
      await this.newPasswordInput.fill(weakPwd1);
      await this.confirmNewPasswordInput.fill(weakPwd2);
      await this.submitChangePasswordBtn.click();
      const weakErrorBox = this.page.locator('.bg-error-100');
        await expect(weakErrorBox).toBeVisible();
        // Validate header text
        await expect(errorBox.locator('h3')).toHaveText('Please correct the following errors:');
        // Validate list item(s)
        const errorItems2 = errorBox.locator('li');
        // There is only 1 error item in your screenshot
        await expect(errorItems2.first()).toHaveText('This password is too short. It must contain at least 8 characters.');
  }

  async changePasswordSuccessfully(currentPasswordInput, newPasswordInput, confirmNewPasswordInput) {
    await this.linkchangePassword.click();
    await expect(this.page).toHaveURL(this.changePasswordURL);
    await this.currentPasswordInput.fill(currentPasswordInput);
    await this.newPasswordInput.fill(newPasswordInput);
    await this.confirmNewPasswordInput.fill(confirmNewPasswordInput);
    await this.submitChangePasswordBtn.click();
    await expect(this.page.getByText('Password successfully changed.')).toBeVisible();
  }

  async revertPassword(currentPasswordInput, newPasswordInput, confirmNewPasswordInput) {
    await expect(this.page).toHaveURL(this.changePasswordURL);
    await this.currentPasswordInput.fill(currentPasswordInput);
    await this.newPasswordInput.fill(newPasswordInput);
    await this.confirmNewPasswordInput.fill(confirmNewPasswordInput);
    await this.submitChangePasswordBtn.click();
    await expect(this.page.getByText('Password successfully changed.')).toBeVisible();
  }
}

