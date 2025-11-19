  import { test, expect } from '@playwright/test';
  import { SigninPage } from '../pages/signin.js';

  const TEST_EMAIL = 'qaautomation@yopmail.com';
  const TEST_WRONGEMAILFORMAT = 'wrongemailformatyopmail.com';
  const TEST_PASSWORD = 'Test@123';
  const TEST_WRONGPASSWORD = 'Test@098';

  test.describe('Signin', () => {

    let signin;

  test.beforeEach(async ({ page }) => {
      // Runs before each test in this suite
      signin = new SigninPage(page);
        await page.setViewportSize({ width: 1370, height: 735 });
        await signin.gotoLandingPage();
    });

  test('Verify if page title and correct heading are visible', async ({ page }) => {
   await signin.verifyTitlesinPages();
  })

  test('Email/Username and Password fields are blank', async ({ page }) => {
   await expect(signin.emailOrUN).toHaveValue('');
   await expect(signin.pwd).toHaveValue('');
   await signin.emailAndPassFieldBlank();
  })

  test('Incorrect email format and Incorrect credentials', async ({ page }) => {
   await signin.emailOrUN.fill(TEST_WRONGEMAILFORMAT);
   await signin.pwd.fill(TEST_PASSWORD);
   await signin.wrongEmailFormat();
   await signin.emailOrUN.fill(TEST_EMAIL);
   await signin.pwd.fill(TEST_WRONGPASSWORD);
   await signin.incorrectCredentials();
  })

  test('Successfull login and log out', async ({ page }) => {
    await signin.signin(TEST_EMAIL, TEST_PASSWORD);
    await signin.signout();
  })

});