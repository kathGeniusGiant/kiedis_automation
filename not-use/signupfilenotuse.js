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
    this.yopmailURL = 'https://yopmail.com/';
  }

  async checkAllFields(firstname, lastname, wrongEmail, correctEmail, newPassword, mismatchPwd){
     let validationMsg;
    //for firstname
    await this.createButton.click();
    validationMsg = await this.page.$eval(
        'input[placeholder="Enter your first name"]', 
        el => el.validationMessage
    );
    expect(validationMsg).toContain('Please fill out this field');
     await this.firstname.fill(firstname);

      //for lastname
    await this.createButton.click();
    validationMsg = await this.page.$eval(
        'input[placeholder="Enter your last name"]',
        el => el.validationMessage
    );
    expect(validationMsg).toContain('Please fill out this field');
    await this.lastname.fill(lastname);

    // EMAIL EMPTY
    await this.createButton.click();
    validationMsg = await this.page.$eval(
        'input[placeholder="Enter your email"]',
        el => el.validationMessage
    );
    expect(validationMsg).toContain('Please fill out this field');
     await this.page.waitForTimeout(2000);

    // EMAIL INVALID FORMAT
    await this.email.fill(wrongEmail);
    await this.createButton.click();
    validationMsg = await this.page.$eval(
        'input[placeholder="Enter your email"]',
        el => el.validationMessage
    );
    expect(validationMsg).toContain("Please include an '@' in the email address");

    // EMAIL CORRECT FORMAT
    await this.email.fill(correctEmail);
    await this.createButton.click();
    validationMsg = await this.page.$eval(
        'input[placeholder="Enter your email"]',
        el => el.validationMessage
    );
    expect(validationMsg).toBe('');
    await this.createButton.click();

    //for new password
    await this.createButton.click();

  validationMsg = await this.page.$eval(
  'input[placeholder="New password"]',
  el => el.validationMessage  // <-- correct property
);

expect(validationMsg).toContain('Please fill out this field');

await this.newPassword.fill(newPassword);
     
     //for confirm password
    await this.createButton.click();
    validationMsg = await this.page.$eval(
        'input[placeholder="Confirm password"]', 
        el => el.validationMessage
    );
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
    await this.page.goto('https://test.kiedis.com/accounts/signup/freelancer/', { waitUntil: 'domcontentloaded' });
    // await expect(this.page).toHaveTitle(/KIEDIS/);
    await this.page.waitForSelector('input[placeholder="Enter your first name"]', { state: 'visible', timeout: 10000 });
  }

  async signup(firstname, lastname, email, jobTitle, newPassword, confirmPassword) {
    console.log('Signing up with:', { firstname, lastname, email, jobTitle, newPassword, confirmPassword });
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
    await expect(this.page.getByText('Confirmation email sent to')).toBeVisible();
    await expect(this.page.getByRole('heading', { name: 'Verification Email Sent' })).toBeVisible();
    await expect(
      this.page.locator('div').filter({ hasText: 'Email sent successfully! We' }).nth(2)).toBeVisible();
    await expect(this.page.getByText("Didn't receive the email?")).toBeVisible();
    await expect(this.page.getByRole('link', { name: 'Continue to Home' })).toBeVisible();

    // Open a new tab
// const newTab = await this.page.context().newPage();
// await newTab.goto(this.yopmailURL);

// Focus new tab
// await newTab.bringToFront();

// Type email and open inbox
// await newTab.getByRole('textbox', { name: 'Login' }).fill(email);
// await newTab.getByRole('textbox', { name: 'Login' }).press('Enter');

// Wait for the inbox iframe IN THE NEW TAB
// await newTab.waitForSelector('iframe[name="ifinbox"]');

// Switch into the iframe
// const frame = newTab.frame({ name: 'ifinbox' });

// Click sender email
// await frame.locator('span.lmf:has-text("no-reply@kiedis.com")').click();

// --- Extract the confirmation link from email body ---
// await newTab.waitForSelector('iframe[name="ifmail"]');
// const mailFrame = newTab.frame({ name: "ifmail" });

// // Get email text content
// const emailText = await mailFrame.locator("body").innerText();

// // Extract URL from email using regex
// const urlRegex = /(https?:\/\/[^\s]+)/g;
// await this.page.waitForTimeout(2000);
// const [confirmationLink] = emailText.match(urlRegex);

// // --- Open confirmation link in a new tab ---
// const confirmTab = await this.page.context().newPage();
// await this.page.waitForTimeout(2000);
// await confirmTab.goto(confirmationLink);
// await confirmTab.bringToFront();

// --- ASSERTIONS: confirm success messages are visible ---
// await confirmTab.getByText(`You have confirmed ${email}.`).waitFor();
// await confirmTab.getByText(`Successfully signed in as ${email}.`).waitFor();
  }
  
  async gotoConfirmationLink(link) {
    const confirmTab = await this.page.context().newPage();
    await confirmTab.goto(link);
    await confirmTab.bringToFront();
  }
}

