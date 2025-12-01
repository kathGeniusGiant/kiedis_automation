import fs from 'fs';
import path from 'path';
import { expect } from '@playwright/test';

export class Footer {
  constructor(page) {
    this.page = page;

    // Locators
    this.footer = page.locator('footer p.text-gray-500.text-sm');
    this.linkDashboard = page.getByRole('link', { name: 'Dashboard' });
    this.ImpressumLink = page.getByRole('link', { name: 'Impressum' });
    this.PrivacyPolicyLink = page.getByRole('link', { name: 'Privacy Policy' });
    this.TermsOfServiceLink = page.getByRole('link', { name: 'Terms of Service' });
    this.ContactLink = page.getByRole('link', { name: 'Contact' });
    this.languageSelect = page.locator('#language');

    // URLs
    this.dashboardURL = 'https://test.kiedis.com/en/freelancer/dashboard/';
    this.ImpressumURL = 'https://test.kiedis.com/en/impressum';
    this.PrivacyPolicyURL = 'https://test.kiedis.com/en/privacy-policy';
    this.TermsOfServiceURL = 'https://test.kiedis.com/en/terms-of-service';
    this.ContactURL = 'https://test.kiedis.com/en/contact';

    // Version file location
    this.versionFile = path.resolve('fixtures/version.json');
  }

  // -----------------------------
  // Navigation
  // -----------------------------
  async gotoDashboardPage() {
    await this.linkDashboard.click();
    await expect(this.page).toHaveURL(this.dashboardURL);
  }

  // -----------------------------
  // Footer Verification
  // -----------------------------
  async verifyFootersCopyrightandVersion() {
    const footerText = await this.footer.innerText();

    // Year verification
    const currentYear = new Date().getFullYear().toString();
    const expectedCopyright = `©${currentYear} KIEDIS. All rights reserved.`;
    expect(footerText).toContain(expectedCopyright);

    console.log(`Footer copyright text: "${expectedCopyright}"`);

    // Version extraction
    const versionMatch = footerText.match(/v\d+(?:\.\d+)*(?:[-\w\.]+)?/);
    if (!versionMatch) {
      throw new Error(`Version not found in footer: "${footerText}"`);
    }

    const currentVersion = versionMatch[0];

    // Read stored version
    let data = { lastBuild: '' };

    if (fs.existsSync(this.versionFile)) {
      try {
        data = JSON.parse(fs.readFileSync(this.versionFile, 'utf8'));
      } catch {
        console.warn("Failed to parse version.json, resetting data.");
      }
    }

    const oldVersion = data.lastBuild;

    console.log(`Old version: ${oldVersion}`);
    console.log(`Current version: ${currentVersion}`);

    // Save updated version
    data.lastBuild = currentVersion;
    fs.writeFileSync(this.versionFile, JSON.stringify(data, null, 2));
  }

  // -----------------------------
  // Footer Hyperlinks
  // -----------------------------
  async footersHyperlinks() {
    await this.ImpressumLink.click();
    await expect(this.page).toHaveURL(this.ImpressumURL);

    await this.TermsOfServiceLink.click();
    await expect(this.page).toHaveURL(this.TermsOfServiceURL);

    await this.ContactLink.click();
    await expect(this.page).toHaveURL(this.ContactURL);
  }

  // -----------------------------
  // Language Switcher
  // -----------------------------
  async language() {
    await expect(this.languageSelect).toBeVisible();

    const expectedOptions = ['English', 'Español', 'Deutsch'];
    const optionTexts = await this.languageSelect.locator('option').allTextContents();
    expect(optionTexts).toEqual(expectedOptions);

    // -----------------------------
    // Español
    // -----------------------------
    await this.languageSelect.selectOption('es');
    await expect(this.languageSelect).toHaveValue('es');
    await expect(this.page).toHaveURL(/\/es\//);

    await expect(this.page.getByText('Panel de control')).toHaveText('Panel de control');
    await expect(this.page.getByText('Perfil', { exact: true })).toHaveText('Perfil');
    await expect(this.page.getByText('Cuenta')).toHaveText('Cuenta');
    await expect(this.page.getByText('Cerrar sesión')).toHaveText('Cerrar sesión');
    await expect(this.page.getByText('Bienvenido de vuelta, QA')).toHaveText('Bienvenido de vuelta, QA');

    // -----------------------------
    // Deutsch
    // -----------------------------
    await this.languageSelect.selectOption('de');
    await expect(this.languageSelect).toHaveValue('de');
    await expect(this.page).toHaveURL(/\/de\//);

    await expect(this.page.getByText('Dashboard')).toHaveText('Dashboard');
    await expect(this.page.getByText('Profil', { exact: true })).toHaveText('Profil');
    await expect(this.page.getByText('Konto')).toHaveText('Konto');
    await expect(this.page.getByText('Abmelden')).toHaveText('Abmelden');
    await expect(this.page.getByText('Willkommen zurück, QA')).toHaveText('Willkommen zurück, QA');

    // -----------------------------
    // English
    // -----------------------------
    await this.languageSelect.selectOption('en');
    await expect(this.languageSelect).toHaveValue('en');
    await expect(this.page).toHaveURL(/\/en\//);
  }

  async clientsHeader() {
   await expect(this.page.getByRole('link', { name: 'Kiedis Logo' })).toBeVisible();
   await expect(this.page.getByRole('link', { name: 'Dashboard' })).toBeVisible();
   await expect(this.page.getByRole('link', { name: 'Account' })).toBeVisible();
   await expect(this.page.getByRole('link', { name: 'Sign Out' })).toBeVisible();
  }

  async freelancerHeader() {
   await expect(this.page.getByRole('link', { name: 'Kiedis Logo' })).toBeVisible();
   await expect(this.page.getByRole('link', { name: 'Dashboard' })).toBeVisible();
   await expect(this.page.getByRole('link', { name: 'Profile', exact: true })).toBeVisible();
   await expect(this.page.getByRole('link', { name: 'Account' })).toBeVisible();
   await expect(this.page.getByRole('link', { name: 'Sign Out' })).toBeVisible();
  }
}
