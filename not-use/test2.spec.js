import { test } from '@playwright/test';
import { SignupPage } from '../pages/signup.js';
import { SigninPage } from '../pages/signin.js';

test('Successful signup', async ({ page }) => {
  const signup = new SignupPage(page);

  const baseEmail = 'qatester@yopmail.com';
  const random = Math.floor(Math.random() * 10000);
  const [name, domain] = baseEmail.split('@');
  const newEmail = `${name}${random}@${domain}`;

  // Perform signup and get confirmation tab
  await signup.signup('QA', 'Tester', newEmail, 'QA Engineer', 'QaPassword1!', 'QaPassword1!');

  // Initialize SigninPage with the correct tab
  const signin = new SigninPage(confirmTab);

  // Sign out
  await signin.signout();
});
