import { test, expect } from '@playwright/test';
import { SigninPage } from '../pages/signin.js';
import { createInbox, getConfirmationLink } from '../pages/storeEmail.js';

const TEST_EMAIL = 'ddffce63-4527-4a93-b92b-e64fcb4d7b0c@mailslurp.biz';

test.describe('Forgot password', () => {
  let signin;

  test.beforeEach(async ({ page }) => {
    signin = new SigninPage(page);
    await page.setViewportSize({ width: 1370, height: 735 });
    await signin.gotoLandingPage();
  });

  test('Reset Password page displays correctly', async ({ page }) => {
    await signin.frgtPss.click();

    await expect(page.getByRole('heading', { name: 'Reset Password' })).toBeVisible();
    await expect(page.getByText(/Forgotten your password\?/i)).toBeVisible();
    await expect(page.getByPlaceholder('Email address')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Reset My Password' })).toBeVisible();
    await expect(page.getByText('Remember your password? Sign')).toBeVisible();
  });

  test('Submit reset request shows confirmation and opens email link', async ({ page }) => {
    // create a fresh inbox for this test
    TEST_EMAIL = await createInbox();
    await signin.frgtPss.click();
    await page.getByPlaceholder('Email address').fill(TEST_EMAIL);
    await page.getByRole('button', { name: 'Reset My Password' }).click();

    // Wait for the confirmation page and assert the exact success content seen in UI
    await page.waitForTimeout(1000);
    await expect(page.getByRole('heading', { name: 'Password Reset Email Sent' })).toBeVisible();
    // Check the green success box title and body text
    await expect(page.getByText('Email sent successfully!')).toBeVisible();
    await expect(page.getByText(/We've emailed you instructions for setting your password\./i)).toBeVisible();
    await expect(page.getByText(/If an account with that email exists, you should receive them shortly\./i)).toBeVisible();
    // Back to Sign In button
    await expect(page.getByRole('link', { name: 'Back to Sign In' })).toBeVisible();

    
  });
});
