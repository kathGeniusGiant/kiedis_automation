  import { test, expect } from '@playwright/test';
  import { SigninPage } from '../../pages/signin.js';

  const TEST_EMAIL = 'qacompany@yopmail.com';
  const TEST_PASSWORD = 'Test@123';

  test.describe('Signin', () => {

    let signin;

  test.beforeEach(async ({ page }) => {
      // Runs before each test in this suite
      signin = new SigninPage(page);
        await page.setViewportSize({ width: 1370, height: 735 });
        await signin.gotoLandingPage();
    });

  test('Successfull login and log out', async ({ page }) => {
    await signin.signin(TEST_EMAIL, TEST_PASSWORD);
    await signin.signout();
  });

});