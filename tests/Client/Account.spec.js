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

	test('Add another email - this includes: Empty field and Invalid email format validation, adding an existing email and Verify error message for existing email and successfully added a new email', async ({ page }) => {
		await account.addAnotherEmailBlankFields();
	});	

	test('Successfully add another email ', async ({ page }) => {
		await account.addAnotherEmail();
	});	

	test('Change Password under Accounts page - Check validation error for empty input, mismatch password and password criteria', async ({ page }) => {
		await account.blankFields(TEST_PASSWORD, NEW_PASSWORD, NEW_PASSWORD, MISMATCH_PASSWORD, WEAK_PASSWORD, WEAK_PASSWORD);
	});

	test('Change Password successfully under Accounts page', async ({ page }) => {
		await account.changePasswordSuccessfully(TEST_PASSWORD, NEW_PASSWORD, NEW_PASSWORD);
		// Revert back to original password for future test runs
		await account.revertPassword(NEW_PASSWORD, TEST_PASSWORD, TEST_PASSWORD);
	});	
});
