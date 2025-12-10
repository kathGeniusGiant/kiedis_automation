import { test, expect } from '@playwright/test';
import { SigninPage } from '../pages/signin.js';
import { FooterAndHeader } from '../pages/header_footer.js';
import fs from 'fs';
import path from 'path';

// Load test data from JSON
const dataPath = path.join(__dirname, '../fixtures/signinData.json');
const testData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

test.describe('Footer and Header for Client', () => {
   let signin,footer;

  test.beforeEach(async ({ page }) => {
    signin = new SigninPage(page, testData);
    footer = new FooterAndHeader(page);

    await page.setViewportSize({ width: 1370, height: 735 });

    // Navigate and sign in
    await signin.gotoLandingPage();
    await signin.signin(testData.companyEmail, testData.testPassword);

    // Go to Dashboard for footer validation
    await footer.gotoClientDashboardPage();
  });

  test('Verify clients header', async () => {
    await footer.clientsHeader();
  });

  test('Verify footer copyright and version', async () => {
    await footer.verifyFootersCopyrightandVersion();
  });

  test('Verify footer hyperlinks redirect correctly', async () => {
    await footer.footersHyperlinks();
  });

  test('Verify language selection updates page text', async () => {
    await footer.languageClient();
  });
});

test.describe('Footer and Header for Freelancer', () => {
  let signin,footer;

  test.beforeEach(async ({ page }) => {
    signin = new SigninPage(page, testData);
    footer = new FooterAndHeader(page);

    await page.setViewportSize({ width: 1370, height: 735 });

    // Navigate and sign in
    await signin.gotoLandingPage();
    await signin.signin(testData.freelancerEmail, testData.testPassword);

    // Go to Dashboard for footer validation
    await footer.gotoFreelancerDashboardPage1();
  });

  test('Verify freelancer header', async () => {
    await footer.freelancerHeader();
  });

  test('Verify footer copyright and version.', async () => {
    await footer.verifyFootersCopyrightandVersion();
  });

  test('Verify footer hyperlinks redirect correctly.', async () => {
    await footer.footersHyperlinks();
  });

  test('Verify language selection updates page text.', async () => {
    await footer.languageFreelancer();
  });
});
