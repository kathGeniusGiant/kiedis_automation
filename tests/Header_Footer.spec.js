import { test, expect } from '@playwright/test';
import { SigninPage } from '../pages/signin.js';
import { Footer } from '../pages/header_footer.js';

const TEST_EMAIL = 'qaautomation@yopmail.com';
const TEST_PASSWORD = 'Test@123';

test.describe('Footer', () => {
  let signin;
  let footer;

  test.beforeEach(async ({ page }) => {
    signin = new SigninPage(page);
    footer = new Footer(page);

    await page.setViewportSize({ width: 1370, height: 735 });

    // Navigate and sign in
    await signin.gotoLandingPage();
    await signin.signin(TEST_EMAIL, TEST_PASSWORD);

    // Go to Dashboard for footer validation
    await footer.gotoDashboardPage();
  });

  test('Verify clients header', async () => {
    await footer.clientsHeader();
  });

  test('Verify freelancer header', async () => {
    await footer.freelancerHeader();
  });

  test('Verify footer copyright and version', async () => {
    await footer.verifyFootersCopyrightandVersion();
  });

  test('Verify footer hyperlinks redirect correctly', async () => {
    await footer.footersHyperlinks();
  });

  test('Verify language selection updates page text', async () => {
    await footer.language();
  });
});
