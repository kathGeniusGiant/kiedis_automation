import { createInbox, setEmail } from '../pages/storeEmail.js';
import { SigninPage } from '../pages/signin.js';
import { test, expect } from '@playwright/test';

let signin;
const password = 'QaPassword1!';
let email = '';

test.beforeAll(async () => {
  email = await createInbox();   // create and get the email before tests run
  setEmail(email);               // optional: store globally if other modules read it
  console.log('generated email', email);
});

test.beforeEach(async ({ page }) => {
  signin = new SigninPage(page);
  await page.setViewportSize({ width: 1370, height: 735 });
  await signin.gotoLandingPage();
});

test('Login with email from signup', async ({ page }) => {
    
  await signin.signin(email, password);
});

