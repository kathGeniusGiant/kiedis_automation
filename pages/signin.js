import { expect } from '@playwright/test';

export class SigninPage {
  constructor(page, data) {
    this.page = page;

    // Data from JSON
    this.landingURL = data?.landingURL || 'https://test.kiedis.com/en/landing/';
    this.signInURL = data?.signInURL || 'https://test.kiedis.com/en/accounts/login/';

    // Define locators
    this.emailOrUN = page.getByPlaceholder('Enter your email or username');
    this.pwd = page.getByPlaceholder('Enter your password');
    this.btnShow = page.getByRole('button', { name: 'Show' });
    this.btnHide = page.getByRole('button', { name: 'Hide' });
    this.CheckRememberMe = page.getByRole('checkbox', { name: 'Remember Me' });
    this.btnSignIn = page.getByRole('button', { name: 'Sign In' });
    this.btnSignUp = page.getByRole('button', { name: 'Sign Up' });
    this.linkSignIn = page.getByRole('link', { name: 'Sign In', exact: true });
    this.btnSignInwLinkIn = page.getByText('Sign In with LinkedIn');
    this.Signuphere = page.getByRole('link', { name: 'Sign up here' });
    this.frgtPss = page.getByRole('link', { name: 'Forgot your password?' });
    this.linkSignout = page.getByRole('link', { name: 'Sign Out' });
  }

  async gotoLandingPage() {
    await this.page.goto(this.landingURL, { waitUntil: 'domcontentloaded' });
    await this.linkSignIn.click();
  }

  async verifyTitlesinPages() {
      await expect(this.page).toHaveURL(this.signInURL);
      await expect(this.page).toHaveTitle(/KIEDIS/);
      await expect(this.page.locator('h1')).toHaveText('Welcome back to Kiedis');
      await expect(this.page.locator('h2')).toHaveText('Sign in to your account');
      await expect(this.page.getByText('Sign in to continue connecting with top talent')).toBeVisible();
      await expect(this.page.getByRole('link', { name: 'Sign In with LinkedIn' })).toBeVisible();
      await this.Signuphere.click();
      await this.linkSignIn.click();
      await this.frgtPss.click();
      await this.linkSignIn.click();
  }

  async emailAndPassFieldBlank() {
    await this.linkSignIn.click();
    await this.page.getByRole('button', { name: 'Sign In' }).click();
    // Submit the form without entering anything
    await this.page.click('button[type="submit"]');
    // Main error container
    const errorBox = this.page.locator('.bg-error-100');
    await expect(errorBox).toBeVisible();
      // List items inside the error box
    const errorItems = errorBox.locator('li');
    await expect(errorItems.nth(0)).toHaveText('This field is required.');
    await expect(errorItems.nth(1)).toHaveText('This field is required.');
  }

  async wrongEmailFormat() {
    await this.btnSignIn.click();
    const errorBox = this.page.locator('.bg-error-100');
    await expect(errorBox).toBeVisible();
    // Validate header text
    await expect(errorBox.locator('h3')).toHaveText('Please correct the following errors:');
    // Validate list item(s)
    const errorItems = errorBox.locator('li');
    // There is only 1 error item in your screenshot
    await expect(errorItems.first()).toHaveText('Enter a valid email address.');
  }

  async incorrectCredentials() {
    await this.btnSignIn.click();
    const errorBox = this.page.locator('.bg-error-100');
    await expect(errorBox).toBeVisible();
    // Validate header text
    await expect(errorBox.locator('h3')).toHaveText('Please correct the following errors:');
    // Validate list item(s)
    const errorItems = errorBox.locator('li');
    // There is only 1 error item in your screenshot
    await expect(errorItems.first()).toHaveText('The email address and/or password you specified are not correct.');
  }

  async signin(emailOrUN, pwd) {
    await this.emailOrUN.fill(emailOrUN);
    await this.pwd.fill(pwd);
    await this.btnShow.click();
    await this.btnHide.click();
    await this.CheckRememberMe.click();
    await this.btnSignIn.click();
    await this.page.waitForTimeout(2000);
    // Verify generic success message and the email used to sign in
    await expect(this.page.getByText(/Successfully signed in as/i)).toBeVisible();
    await expect(this.page.getByText(emailOrUN)).toBeVisible();
  }

  async signout() {
    await this.linkSignout.click();
    await this.page.waitForTimeout(2000);
    await expect(this.page.getByText(/You have signed out\.?/i)).toBeVisible();
    await expect(this.page).toHaveURL(this.landingURL);
  }
}