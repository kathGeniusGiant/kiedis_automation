import { test, expect } from '@playwright/test';
import { SigninPage } from '../../pages/signin.js';
import { JobPostPage } from '../../pages/Client/job_post.js';
import { FooterAndHeader } from '../../pages/header_footer.js';
import fs from 'fs';
import path from 'path';

// Load test data from JSON
const dataPath = path.join(__dirname, '../../fixtures/signinData.json');
const testData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

test.describe('Job Post Page', () => {
  test.describe.configure({ timeout: 60000 });
  let signin, jobPost, headerfooter;

  test.beforeEach(async ({ page }) => {
    signin = new SigninPage(page, testData);
    jobPost = new JobPostPage(page);
    headerfooter = new FooterAndHeader(page);

    await page.setViewportSize({ width: 1370, height: 735 });
    await signin.gotoLandingPage();
    await signin.signin(testData.companyEmail, testData.testPassword);
    await headerfooter.gotoClientDashboardPage();
  });  

  //Job Post
  test('Edit Job Description', async ({ page }) => {
    test.setTimeout(60000);
    await jobPost.editJobDescription();
  });

  test('Interview slot', async ({ page }) => {
    test.setTimeout(60000);
    await jobPost.interviewSlot();
  });

  test('Meeting Types: Basics navigation - check validation for empty fields and successfully created meeting types', async ({ page }) => {
    test.setTimeout(60000);
    await jobPost.meetingTypesBasic();
  });

  test('Meeting Types: Availability navigation - verify the availability page', async ({ page }) => {
    test.setTimeout(60000);
    await jobPost.meetingTypesAvailability();
  });

  test('Meeting Types: Limits navigation - Validate Limits Settings Page', async ({ page }) => {
    test.setTimeout(60000);
    await jobPost.meetingTypesLimits2();
  });

  test('Meeting Types: Advance navigation - Validate Advance Settings Page', async ({ page }) => {
    test.setTimeout(60000);
    await jobPost.meetingTypesAdvance();
  });
});