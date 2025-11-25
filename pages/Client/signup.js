import { expect } from '@playwright/test';

export class clientSignupPage {
  constructor(page) {
    this.page = page;

    // Define locators
    this.firstname = page.getByPlaceholder('Enter your first name');
    this.lastname = page.getByPlaceholder('Enter your last name');
    this.email = page.getByRole('textbox', { name: 'Email *' });
    this.companyName = page.getByPlaceholder('Enter your company name');
    this.newPassword = page.getByPlaceholder('New password');
    this.confirmPassword = page.getByPlaceholder('Confirm password');
    this.termsCheckbox = page.getByRole('checkbox', { name: 'I agree to the Terms and Conditions' });
    this.privacyCheckbox = page.getByRole('checkbox', { name: 'I agree to the Privacy Policy' });
    this.SignUpBtn = page.getByRole('button', { name: 'Sign up', exact: true });
    this.signUpURLC = 'https://test.kiedis.com/en/accounts/signup/client/';


    this.uploadBtn = page.getByRole('button', { name: 'Upload' });
    this.continueToOnboardingBtn = page.getByRole('button', { name: 'Continue to Onboarding' });
    this.skipStepBtn = page.getByRole('button', { name: 'Skip step →' });
    this.skipAllQuestionsBtn = page.getByRole('button', { name: 'Skip All Questions' });
    this.continueBtn = page.getByRole('button', { name: 'Continue' });
    this.backBtn = page.getByRole('button', { name: 'Back' });
    this.nextBtn = page.getByRole('button', { name: 'Next' });
    this.imAvailableRadio = page.getByRole('radio', { name: 'I\'m available to start working' });
    this.notAvailableRadio = page.getByRole('radio', { name: 'I\'m not currently available' });
    this.completeProfileBtn = page.getByRole('button', { name: 'Complete Profile →' });
  }

  async gotoSignUpPage() {
    await this.page.goto(this.signUpURLC, { waitUntil: 'domcontentloaded' });
    await this.firstname.waitFor({ state: 'visible' });
  }

  async verifyElements() {
    await expect(this.page.getByRole('heading', { name: 'Sign up to Kiedis to continue recruiting these experts' })).toBeVisible();
    await expect(this.page.getByRole('heading', { name: 'Enter your details' })).toBeVisible();
    await expect(this.firstname).toBeVisible();
    await expect(this.lastname).toBeVisible();
    await expect(this.email).toBeVisible();
    await expect(this.companyName).toBeVisible();
    await expect(this.newPassword).toBeVisible();
    await expect(this.confirmPassword).toBeVisible();
    await expect(this.termsCheckbox).toBeVisible();
    await expect(this.privacyCheckbox).toBeVisible();
    await expect(this.SignUpBtn).toBeVisible();
    await expect(this.page.getByText('Want to create a freelancer account instead?')).toBeVisible();
    await expect(this.page.getByText('Already have an account?')).toBeVisible();
    await expect(this.page.getByRole('link', { name: 'Sign up as Freelancer' })).toBeVisible();
    await expect(this.page.getByRole('link', { name: 'Sign in here' })).toBeVisible();
    await this.page.getByRole('link', { name: 'Sign up as Freelancer' }).click();
    await this.page.getByRole('button', { name: 'Sign Up', exact: true }).hover();
    await this.page.getByRole('link', { name: 'Sign Up as Freelancer', exact: true }).click();
    await this.page.getByRole('link', { name: 'Sign in here' }).click();
  }

  async checkAllFields(firstname, lastname, wrongEmail, correctEmail, newPassword, mismatchPwd){
     let validationMsg;
      //for firstname
      await this.SignUpBtn.click();
      validationMsg = await this.firstname.evaluate(el => el.validationMessage);
      expect(validationMsg).toContain('Please fill out this field');
      await this.firstname.fill(firstname);

      //for lastname
      await this.SignUpBtn.click();
      validationMsg = await this.lastname.evaluate(el => el.validationMessage);
      expect(validationMsg).toContain('Please fill out this field');
      await this.lastname.fill(lastname);

      //Company Name EMPTY - 'This field is required.' appears only after filling out all fields and click Sign Up button
      await this.companyName.fill('');

      // EMAIL EMPTY
      await this.SignUpBtn.click();
      validationMsg = await this.email.evaluate(el => el.validationMessage);
      expect(validationMsg).toContain('Please fill out this field');
      await this.page.waitForTimeout(2000);

      // EMAIL INVALID FORMAT
      await this.email.fill(wrongEmail);
      validationMsg = await this.email.evaluate(el => el.validationMessage);
      expect(validationMsg).toContain("Please include an '@' in the email address");

      // EMAIL CORRECT FORMAT
      await this.email.fill(correctEmail);
      validationMsg = await this.email.evaluate(el => el.validationMessage);
      expect(validationMsg).toBe('');
      await this.SignUpBtn.click();

      //for new password
      await this.SignUpBtn.click();
      validationMsg = await this.newPassword.evaluate(el => el.validationMessage);
      expect(validationMsg).toContain('Please fill out this field');
      await this.newPassword.fill(newPassword);
     
      //for confirm password
      await this.SignUpBtn.click();
      validationMsg = await this.confirmPassword.evaluate(el => el.validationMessage);
      expect(validationMsg).toContain('Please fill out this field');
      await this.confirmPassword.fill(mismatchPwd);
      await this.termsCheckbox.click();
      await this.privacyCheckbox.click();
      await this.SignUpBtn.click();

      //password mismtach
      const errorBox = this.page.locator('.bg-error-100');
        await expect(errorBox).toBeVisible();
        // Validate header text
        await expect(errorBox.locator('h3')).toHaveText('Please correct the following errors:');
      // Validate list item(s)
      const errorItems = errorBox.locator('li');
        // There is only 1 error item in your screenshot
        await expect(errorItems.first()).toHaveText('This field is required.');
        await expect(errorItems.nth(1)).toHaveText('You must type the same password each time.');
  }

  async signup(firstname, lastname, companyName, email, newPassword, confirmPassword) {
    // console.log('Signing up with:', { firstname, lastname, email, jobTitle, newPassword, confirmPassword });
    await this.firstname.fill(firstname);
    await this.lastname.fill(lastname);
    await this.companyName.fill(companyName);
    await this.email.fill(email);
    await this.newPassword.fill(newPassword);
    await this.confirmPassword.fill(confirmPassword);
    await this.termsCheckbox.click();
    await this.privacyCheckbox.click();
    await this.SignUpBtn.click();

    //email confirmation
    await expect(this.page.getByText(`Confirmation email sent to ${email}.`)).toBeVisible();
    await expect(this.page.getByText('Calendar integration has been set up successfully.')).toBeVisible();
    await expect(this.page.getByRole('heading', { name: 'Verification Email Sent' })).toBeVisible();
    await expect(this.page.locator('div').filter({ hasText: 'Email sent successfully! We have sent an email verification link to your email address. Please check your email and click the link to verify your account.' }).nth(2)).toBeVisible();
    await expect(this.page.getByText("Didn't receive the email?")).toBeVisible();
    await expect(this.page.getByRole('link', { name: 'Continue to Home' })).toBeVisible();
  }

  async gotoConfirmationLink(link, email) {
    const confirmTab = await this.page.context().newPage();
      await confirmTab.goto(link);
      await confirmTab.bringToFront();
      // Verify first success message
      await expect(confirmTab.getByText(`You have confirmed ${email}.`)).toBeVisible();
    
      // Verify second success message
      await expect(confirmTab.getByText(`Successfully signed in as ${email}.`)).toBeVisible();
  }
}