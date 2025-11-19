  import { test, expect } from '@playwright/test';
  import { SignupPage } from '../pages/signup.js';
  import { Signin, SigninPage } from '../pages/signin.js';
  import MailSlurp from "mailslurp-client";
  import { text } from 'stream/consumers';
  import { getEmail, getConfirmationLink, createInbox } from '../pages/storeEmail.js';

  // const baseEmail = 'qatester@yopmail.com';
  // const random = Math.floor(Math.random() * 10000);
  // const [name, domain] = baseEmail.split('@');
  // const newEmail = `${name}${random}@${domain}`;
  const password = 'QaPassword1!'
  const firstname = 'QA';
  const lastname = 'Tester';
  const role = 'QA Engineer';
  const wrongEmail = 'wrongemailfromatyopmail.com';
  const correctEmail = 'qatester@yopmail.com';
  const mismatchPwd = 'mismatchpass';
  const fileInput = 'input[type="file"]';
  const resumeFilePath = 'C:/Users/LENOVO/Documents/auto_resume.pdf';

  test.describe('Signup and Profile page', () => {

    let signup;
    let signin;
    let emailAddress = ''
    test.beforeEach(async ({ page }) => {
      // Runs before each test in this suite
      signup = new SignupPage(page);
      signin = new SigninPage(page);
      
      // signin = new SigninPage(page);
      await page.setViewportSize({ width: 1370, height: 735 });
      await signup.gotoSignUpPage();
    });

    test('Check validation error for empty input, wrong email and password mismatch', async ({ page }) => {
      await signup.checkAllFields(firstname, lastname, wrongEmail, correctEmail, password, mismatchPwd);
    });

    test('Successfull signup and email confirmation', async ({ page }) => {
      emailAddress = await createInbox();
      await signup.signup(firstname, lastname, emailAddress, role, password, password);
      const confirmationLink = await getConfirmationLink();
        await signup.gotoConfirmationLink(confirmationLink, emailAddress)
    })

    test('Login with email from signup and upload cv', async ({ page }) => {
      test.setTimeout(80000);
      await signin.gotoLandingPage();
      await signin.signin(emailAddress, password);

      await page.setInputFiles(fileInput, resumeFilePath);
      await expect(page.locator('text=auto_resume.pdf')).toBeVisible();
      await signup.uploadFilePage();
      // await signup.uploadBtn.click();
    });

  });