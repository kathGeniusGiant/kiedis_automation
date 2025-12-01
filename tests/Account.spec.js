import { test, expect } from '@playwright/test';
import { SigninPage } from '../pages/signin.js';
import { AccountPage } from '../pages/account.js';
import { getEmail, getConfirmationLink, createInbox } from '../pages/storeEmail.js';

const TEST_EMAIL = 'qaautomation@yopmail.com';
const TEST_PASSWORD = 'Test@123';
const NEW_PASSWORD = 'NewTest@123';
const WEAK_PASSWORD = 'WeakPwd';
const MISMATCH_PASSWORD = 'Mismatch@123';

test.describe('Account - Profile & Email Management', () => {
  let signin;
  let account;

  test.beforeEach(async ({ page }) => {
    signin = new SigninPage(page);
    account = new AccountPage(page);
    await page.setViewportSize({ width: 1370, height: 735 });
    await signin.gotoLandingPage();
    // Sign in with a reusable test account
    await signin.signin(TEST_EMAIL, TEST_PASSWORD);
    await account.gotoAccountPage();
  });

  test('Verify Profile & Email Management page elements', async ({ page }) => {
    await account.verifyBasicLayout();
    await account.verifyEmailBadges();
    // Confirm action buttons are usable
    await expect(account.linkchangePassword).toBeEnabled();
    await expect(account.signOutBtn).toBeEnabled();
  });

  test('Add another email - validations and existing email check', async ({ page }) => {
    await account.addAnotherEmailBlankFields();
  });

  test('Successfully add another email', async ({ page }) => {
    await account.addAnotherEmail();
  });

  test('Change Password - validation errors for empty, mismatch, and weak password', async ({ page }) => {
    await account.blankFields(
      TEST_PASSWORD, 
      NEW_PASSWORD, 
      NEW_PASSWORD, 
      MISMATCH_PASSWORD, 
      WEAK_PASSWORD, 
      WEAK_PASSWORD
    );
  });

  test('Change Password successfully and revert back', async ({ page }) => {
    await account.changePasswordSuccessfully(TEST_PASSWORD, NEW_PASSWORD, NEW_PASSWORD);
    // Revert back to original password for future test runs
    await account.revertPassword(NEW_PASSWORD, TEST_PASSWORD, TEST_PASSWORD);
  });
});
