import { test, expect } from '@playwright/test';
import { SigninPage } from '../pages/signin.js';
import fs from 'fs';
import path from 'path';

// Load test data
const dataPath = path.join(__dirname, '../fixtures/signinData.json');
const testData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

test.describe('Signin', () => {
  let signin;

  test.beforeEach(async ({ page }) => {
    signin = new SigninPage(page, testData);
    await page.setViewportSize({ width: 1370, height: 735 });
    await signin.gotoLandingPage();
  });

  test('Verify if page title and correct heading are visible', async () => {
    await signin.verifyTitlesinPages();
  });

  test('Email/Username and Password fields are blank', async () => {
    await expect(signin.emailOrUN).toHaveValue('');
    await expect(signin.pwd).toHaveValue('');
    await signin.emailAndPassFieldBlank();
  });

  test('Incorrect email format and Incorrect credentials', async () => {
    await signin.emailOrUN.fill(testData.testWrongEmailFormat);
    await signin.pwd.fill(testData.testPassword);
    await signin.wrongEmailFormat();

    await signin.emailOrUN.fill(testData.freelancerEmail);
    await signin.pwd.fill(testData.testWrongPassword);
    await signin.incorrectCredentials();
  });

  test('Successful login and log out', async () => {
    await signin.signin(testData.freelancerEmail, testData.testPassword);
    await signin.signout();
  });
});
