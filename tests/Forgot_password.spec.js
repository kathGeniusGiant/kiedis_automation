import { test, expect } from '@playwright/test';
import { forgotPasswordPage } from '../pages/forgot_password.js';
import { testEmail } from '../pages/storeEmailForgotPass.js';

test.describe('Forgot Password', () => {
  let forgotPassword;

  test.beforeEach(async ({ page }) => {
    forgotPassword = new forgotPasswordPage(page);
    await page.setViewportSize({ width: 1370, height: 735 });
    await forgotPassword.gotoForgotPasswordPage();
  });

  test('Verify Reset Password page: empty input & incorrect email format', async ({ page }) => {
    await forgotPassword.VerifyResetPassPage();
  });

  test('Verify Change Password page: empty input, password criteria & mismatch', async ({ page }) => {
    await forgotPassword.verifyChangePasswordPage(testEmail, page.context());
  });

  test('Reset Password successfully', async ({ page }) => {
    await forgotPassword.resetPasswordSuccessfully(testEmail, page.context());
  });
});
