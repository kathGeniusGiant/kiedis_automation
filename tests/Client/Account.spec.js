import { test, expect } from '@playwright/test';
import { SigninPage } from '../../pages/signin.js';
import { AccountPage } from '../../pages/Client/account.js';

const TEST_EMAIL = 'qacompany@yopmail.com';
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

    // Login using reusable test account
    await signin.gotoLandingPage();
    await signin.signin(TEST_EMAIL, TEST_PASSWORD);

    // Navigate to Account Page
    await account.gotoAccountPage();
  });

  test('Verify Profile & Email Management page elements', async () => {
    await account.verifyBasicLayout();
    await account.verifyEmailBadges();

    // Validate action buttons are functional
    await expect(account.linkchangePassword).toBeEnabled();
    await expect(account.signOutBtn).toBeEnabled();
  });

  test('Add another email — validate empty, invalid, existing email, check validation when deleting primary email & success flow', async () => {
    await account.addAnotherEmailBlankFields();
  });

  test('Successfully add another email', async () => {
    await account.addAnotherEmail();
  });

  test('Change Password — empty fields, mismatched password, weak password validations', async () => {
    await account.blankFields(
      TEST_PASSWORD,
      NEW_PASSWORD,
      NEW_PASSWORD,
      MISMATCH_PASSWORD,
      WEAK_PASSWORD,
      WEAK_PASSWORD
    );
  });

  test('Change Password successfully and revert back', async () => {
    await account.changePasswordSuccessfully(TEST_PASSWORD, NEW_PASSWORD, NEW_PASSWORD);

    // Revert back to original password so regression tests remain repeatable
    await account.revertPassword(NEW_PASSWORD, TEST_PASSWORD, TEST_PASSWORD);
  });
});
