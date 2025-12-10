import { test, expect } from '@playwright/test';
import { SigninPage } from '../../pages/signin.js';
import { CreateJobPage } from '../../pages/Client/createJob.js';
import { FooterAndHeader } from '../../pages/header_footer.js';
import fs from 'fs';
import path from 'path';

// Load test data from JSON
const dataPath = path.join(__dirname, '../../fixtures/signinData.json');
const testData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

test.describe('Create Job Description', () => {
  test.describe.configure({ timeout: 60000 });
  let signin, createJob, headerfooter;

  test.beforeEach(async ({ page }) => {
    signin = new SigninPage(page, testData);
    createJob = new CreateJobPage(page);
    headerfooter = new FooterAndHeader(page);

    await page.setViewportSize({ width: 1370, height: 735 });
    await signin.gotoLandingPage();
    await signin.signin(testData.companyEmail, testData.testPassword);
    await headerfooter.gotoClientDashboardPage();
  });

  test('Verify elements on Create Job Description page', async ({ page }) => {
    test.setTimeout(60000);
    await createJob.verifyNewJobDescriptionPage();
  });

  test('Create Job – Upload Job Description', async ({ page }) => {
    test.setTimeout(60000);
    await createJob.uploadJobDescription();
  });

  test('Create Job – Position Title', async ({ page }) => {
    test.setTimeout(60000);
    await createJob.positionTitle();
  });
});
