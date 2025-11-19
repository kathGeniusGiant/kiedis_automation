import { expect } from '@playwright/test';

export class SignupPage {
  constructor(page) {
    this.page = page;

    // Define locators
    this.firstname = page.getByPlaceholder('Enter your first name');
    this.lastname = page.getByPlaceholder('Enter your last name');
    this.email = page.getByPlaceholder('Enter your email');
    this.jobTitle = page.getByPlaceholder('Enter your job title');
    this.newPassword = page.getByPlaceholder('New password');
    this.confirmPassword = page.getByPlaceholder('Confirm password');
    this.termsCheckbox = page.getByRole('checkbox', { name: 'I agree to the Terms and Conditions' });
    this.privacyCheckbox = page.getByRole('checkbox', { name: 'I agree to the Privacy Policy' });
    this.createButton = page.getByRole('button', {name: 'Create Freelancer Account'})
    this.uploadBtn = page.getByRole('button', { name: 'Upload' });
    this.signUpURLF = 'https://test.kiedis.com/en/accounts/signup/freelancer/';
    this.signUpURLC = 'https://test.kiedis.com/en/accounts/signup/client/';
    this.continueToOnboardingBtn = page.getByRole('button', { name: 'Continue to Onboarding' });
    this.skipStepBtn = page.getByRole('button', { name: 'Skip step →' });
    this.skipAllQuestionsBtn = page.getByRole('button', { name: 'Skip All Questions' });
    this.continueBtn = page.getByRole('button', { name: 'Continue' });
    this.backBtn = page.getByRole('button', { name: 'Back' });
    this.nextBtn = page.getByRole('button', { name: 'Next' });
    this.imAvailableRadio = page.getByRole('radio', { name: 'I\'m available to start working' });
    this.notAvailableRadio = page.getByRole('radio', { name: 'I\'m not currently available' });
  }

  async checkAllFields(firstname, lastname, wrongEmail, correctEmail, newPassword, mismatchPwd){
     let validationMsg;
      //for firstname
      await this.createButton.click();
      validationMsg = await this.firstname.evaluate(el => el.validationMessage);
      expect(validationMsg).toContain('Please fill out this field');
      await this.firstname.fill(firstname);

      //for lastname
      await this.createButton.click();
      validationMsg = await this.lastname.evaluate(el => el.validationMessage);
      expect(validationMsg).toContain('Please fill out this field');
      await this.lastname.fill(lastname);

      // EMAIL EMPTY
      await this.createButton.click();
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
      await this.createButton.click();

      //for new password
      await this.createButton.click();
      validationMsg = await this.newPassword.evaluate(el => el.validationMessage);
      expect(validationMsg).toContain('Please fill out this field');
      await this.newPassword.fill(newPassword);
     
      //for confirm password
      await this.createButton.click();
      validationMsg = await this.confirmPassword.evaluate(el => el.validationMessage);
      expect(validationMsg).toContain('Please fill out this field');
      await this.confirmPassword.fill(mismatchPwd);
      await this.termsCheckbox.click();
      await this.privacyCheckbox.click();
      await this.createButton.click();

      //password mismtach
      const errorBox = this.page.locator('.bg-error-100');
        await expect(errorBox).toBeVisible();
        // Validate header text
        await expect(errorBox.locator('h3')).toHaveText('Please correct the following errors:');
      // Validate list item(s)
      const errorItems = errorBox.locator('li');
        // There is only 1 error item in your screenshot
        await expect(errorItems.first()).toHaveText('You must type the same password each time.');
  }

  async gotoSignUpPage() {
    await this.page.goto(this.signUpURLF, { waitUntil: 'domcontentloaded' });
    await this.firstname.waitFor({ state: 'visible' });
  }

  async signup(firstname, lastname, email, jobTitle, newPassword, confirmPassword) {
    // console.log('Signing up with:', { firstname, lastname, email, jobTitle, newPassword, confirmPassword });
    await this.firstname.fill(firstname);
    await this.lastname.fill(lastname);
    await this.email.fill(email);
    await this.jobTitle.fill(jobTitle);
    await this.newPassword.fill(newPassword);
    await this.confirmPassword.fill(confirmPassword);
    await this.termsCheckbox.click();
    await this.privacyCheckbox.click();
    await this.createButton.click();

    //email confirmation
    await expect(this.page.getByText(`Confirmation email sent to ${email}.`)).toBeVisible();
    await expect(this.page.getByRole('heading', { name: 'Verification Email Sent' })).toBeVisible();
    await expect(this.page.locator('div').filter({ hasText: 'Email sent successfully! We' }).nth(2)).toBeVisible();
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

  async uploadFilePage() {
    // Headings
    await expect(this.page.getByText("Enhance Your Profile")).toBeVisible();
    await expect(this.page.getByText("Upload your CV to provide additional details for better AI optimization")).toBeVisible();

    // Why upload section
    await expect(this.page.getByText("Why upload your CV?")).toBeVisible();
    await expect(this.page.getByText("Include detailed project descriptions and achievements")).toBeVisible();
    await expect(this.page.getByText("Add technical skills and certifications not on LinkedIn")).toBeVisible();
    await expect(this.page.getByText("Improve AI matching accuracy by up to 40%")).toBeVisible();
    await this.uploadBtn.click();
    await expect(this.page.getByRole('heading', { name: 'Analyzing CV' })).toBeVisible();

    //Success upload CV
    await expect(this.page.getByRole('heading', { name: 'AI is Creating Your Profile' })).toBeVisible();
    await expect(this.page.getByText('Our system is analyzing your')).toBeVisible();
    await expect(this.page.locator('#status-container div').filter({ hasText: 'AI Analysis Complete!' })).toBeVisible();
    await expect(this.page.getByRole('heading', { name: 'CV Analysis Complete' })).toBeVisible();
    await expect(this.page.getByText('Found relevant projects and')).toBeVisible();
    await this.continueToOnboardingBtn.click();
    await this.page.waitForTimeout(18000);

    // Verify Onboarding page
    await expect(this.page.getByRole('heading', { name: 'Refine your details' })).toBeVisible();
    await expect(this.page.getByText('Help us match you with better opportunities by filling in any missing details. The more complete your profile, the more accurate our job recommendations will be. You can always come back to complete any skipped questions later.')).toBeVisible();
    await expect(this.skipStepBtn).toBeVisible();
    await expect(this.skipAllQuestionsBtn).toBeVisible();
    await expect(this.continueBtn).toBeVisible();

    //Check if buttons are working
    await this.skipStepBtn.click();
    await this.backBtn.click();
    await this.skipAllQuestionsBtn.click();
    await this.backBtn.click();
    await this.continueBtn.click();

    // Verify Daily Rate and Availability page
    await expect(this.page.getByRole('heading', { name: 'Set your daily rate and' })).toBeVisible();
    await this.page.getByText('Help us match you with the right opportunities by setting your preferred daily rate and current availability. You can always adjust these settings later in your profile.').isVisible();
    await expect(this.page.getByRole('heading', { name: 'Daily Rate', exact: true })).toBeVisible();
    await expect(this.page.getByText('Set the amount you typically')).toBeVisible();
    await this.page.getByPlaceholder('Enter your rate').fill('200');
    await expect(this.page.getByRole('heading', { name: 'Availability', exact: true })).toBeVisible();
    await expect(this.page.getByText('Let us know if you\'re')).toBeVisible();
    await this.imAvailableRadio.check();
    await this.notAvailableRadio.check();
    await this.imAvailableRadio.check();
    await this.nextBtn.click();
    // await page.getByRole('button', { name: 'Complete Profile →' }).click();
  }
}

