import { test } from '@playwright/test';
import { SigninPage } from '../pages/signin.js';
import { ProfilePage } from '../pages/profile.js';

const TEST_EMAIL = 'qaautomation@yopmail.com';
const TEST_PASSWORD = 'Test@123';

test.describe('Account - Profile & Email Management', () => {

    let signin;
	let profile;

    test.beforeEach(async ({ page }) => {
            signin = new SigninPage(page);
            profile = new ProfilePage(page);
            await page.setViewportSize({ width: 1370, height: 735 });
            await signin.gotoLandingPage();
            // Sign in with a reusable test account
            await signin.signin(TEST_EMAIL, TEST_PASSWORD);
            await profile.gotoProfilePage();
        });

test('Validate profile page sections and data', async ({ page }) => {
  await profile.goto();

  // Validate header
  await profile.assertHeader();

  // Validate Skills section
  await profile.assertSkills();

  // Validate Work Experience
  await profile.assertWorkExperience();

  // Validate Education
  await profile.assertEducation();
});

});