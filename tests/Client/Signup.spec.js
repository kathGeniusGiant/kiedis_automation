  import { test, expect } from '@playwright/test';
  import { clientSignupPage } from '../../pages/Client/signup.js';
//   import { SignupPage } from '../../pages/signup.js';
//   import { Signin, SigninPage } from '../..signin.js';
  import MailSlurp from "mailslurp-client";
  import { text } from 'stream/consumers';
  import { getEmail, getConfirmationLink, createInbox } from '../../pages/storeEmail.js';

  const password = 'QaPassword1!'
  const firstname = 'QA';
  const lastname = 'Tester';
  const companyName = 'Automation Company';
  const wrongEmail = 'wrongemailfromatyopmail.com';
  const correctEmail = 'qatester@yopmail.com';
  const mismatchPwd = 'mismatchpass';

  test.describe('Signup and Profile page', () => {
    // let signup;
    let clientSignup;
    //   let signin;
      let emailAddress = ''
    test.beforeEach(async ({ page }) => {
        // Runs before each test in this suite
        // signup = new SignupPage(page);
        clientSignup = new clientSignupPage(page);
        // signin = new SigninPage(page);
        // signin = new SigninPage(page);
        await page.setViewportSize({ width: 1370, height: 735 });
        await clientSignup.gotoSignUpPage();
    });

    test('Verify elements in Signup page', async ({ page }) => {
      await clientSignup.verifyElements();
    });

    test('Check validation error for empty input, wrong email and password mismatch', async ({ page }) => {
        await clientSignup.checkAllFields(firstname, lastname, wrongEmail, correctEmail, password, mismatchPwd);
    });

    test('Successfull signup and email confirmation', async ({ page }) => {
          emailAddress = await createInbox();
          await clientSignup.signup(firstname, lastname, companyName, emailAddress, password, password);
          const confirmationLink = await getConfirmationLink();
            await clientSignup.gotoConfirmationLink(confirmationLink, emailAddress)
    });
  });