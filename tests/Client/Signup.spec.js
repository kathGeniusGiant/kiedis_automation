import { test, expect } from '@playwright/test';
import { clientSignupPage } from '../../pages/Client/signup.js';
import MailSlurp from "mailslurp-client";
import { getEmail, getConfirmationLink, createInbox } from '../../pages/storeEmail.js';

const password = 'QaPassword1!';
const firstname = 'QA';
const lastname = 'Tester';
const companyName = 'Automation Company';

const wrongEmail = 'wrongemailfromatyopmail.com';
const correctEmail = 'qatester@yopmail.com';
const mismatchPwd = 'mismatchpass';

test.describe('Signup and Profile Page', () => {
  let clientSignup;
  let emailAddress = '';

  test.beforeEach(async ({ page }) => {
    clientSignup = new clientSignupPage(page);

    await page.setViewportSize({ width: 1370, height: 735 });
    await clientSignup.gotoSignUpPage();
  });

  test('Verify elements in Signup page', async () => {
    await clientSignup.verifyElements();
  });

  test('Check validation errors (empty input, wrong email, mismatch password)', async () => {
    await clientSignup.checkAllFields(
      firstname,
      lastname,
      wrongEmail,
      correctEmail,
      password,
      mismatchPwd
    );
  });

  test('Successful signup and email confirmation', async () => {
    // Generate disposable inbox
    emailAddress = await createInbox();

    // Perform signup
    await clientSignup.signup(
      firstname,
      lastname,
      companyName,
      emailAddress,
      password,
      password
    );

    // Wait & fetch confirmation link
    const confirmationLink = await getConfirmationLink();

    // Navigate to confirmation
    await clientSignup.gotoConfirmationLink(confirmationLink, emailAddress);
  });
});
