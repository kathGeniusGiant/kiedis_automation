import { test, expect } from '@playwright/test';
import { SigninPage } from '../../pages/signin.js';
import fs from 'fs';
import path from 'path';

// Load test data from JSON
const dataPath = path.join(__dirname, '../../fixtures/signinData.json');
const testData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

test.describe('Signin', () => {
  let signin;

  test.beforeEach(async ({ page }) => {
    // Pass JSON data to SigninPage
    signin = new SigninPage(page, testData);
    await page.setViewportSize({ width: 1370, height: 735 });
    await signin.gotoLandingPage();
  });

  test('Successful login and logout', async () => {
    await signin.signin(testData.companyEmail, testData.testPassword);
    await signin.signout();
  });
});
