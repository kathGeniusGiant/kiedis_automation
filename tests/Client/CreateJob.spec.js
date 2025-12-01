import { test, expect } from '@playwright/test';
import { SigninPage } from '../../pages/signin.js';
import { CreateJobPage } from '../../pages/Client/createJob.js';

const TEST_EMAIL = 'qacompany@yopmail.com';
const TEST_PASSWORD = 'Test@123';

test.describe('Create Job Description', () => {
  test.describe.configure({ timeout: 60000 });

  let signin;
  let createJob;

  test.beforeEach(async ({ page }) => {
    signin = new SigninPage(page);
    createJob = new CreateJobPage(page);

    await page.setViewportSize({ width: 1370, height: 735 });
    await signin.gotoLandingPage();
    await signin.signin(TEST_EMAIL, TEST_PASSWORD);
    await createJob.gotoDashboardPage();
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

  test('Edit Job Description', async ({ page }) => {
    test.setTimeout(60000);
    await createJob.editJobDescription();
  });

  test('Interview slot', async ({ page }) => {
    test.setTimeout(60000);
    await createJob.interviewSlot();
  });
});
