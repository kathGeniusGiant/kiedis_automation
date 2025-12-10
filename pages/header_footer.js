import { expect } from '@playwright/test';
import links from '../fixtures/links.json';
import fs from 'fs';
import path from 'path';

export class FooterAndHeader {
  constructor(page) {
    this.page = page;

    // URLs 
    this.dashboardURLClient = links.dashboardURLClient;
    this.dashboardURLFreelancer = links.dashboardURLFreelancer;
    this.ImpressumURL = links.ImpressumURL;
    this.PrivacyPolicyURL = links.PrivacyPolicyURL;
    this.TermsOfServiceURL = links.TermsOfServiceURL;
    this.ContactURL = links.ContactURL;

    // Locators
    this.footer = page.locator('footer p.text-gray-500.text-sm');
    this.linkDashboard = page.getByRole('link', { name: 'Dashboard' });
    this.ImpressumLink = page.getByRole('link', { name: 'Impressum' });
    this.PrivacyPolicyLink = page.getByRole('link', { name: 'Privacy Policy' });
    this.TermsOfServiceLink = page.getByRole('link', { name: 'Terms of Service' });
    this.ContactLink = page.getByRole('link', { name: 'Contact' });
    this.languageSelect = page.locator('#language');
    this.kiediesLogo = this.page.getByRole('link', { name: 'Kiedis Logo' });
    this.btnSignout = this.page.getByRole('link', { name: 'Sign Out' });

    // Version file location
    this.versionFile = path.resolve('fixtures/version.json');
  }

  // Navigation
  async gotoClientDashboardPage() {
    await this.linkDashboard.click();
    await expect(this.page).toHaveURL(this.dashboardURLClient);
  }

  async gotoFreelancerDashboardPage1() {
    await this.linkDashboard.click();
    await expect(this.page).toHaveURL(this.dashboardURLFreelancer);
  }

  // Footer Verification
  async verifyFootersCopyrightandVersion() {
    const footerText = await this.footer.innerText();
    const currentYear = new Date().getFullYear().toString();
    const expectedCopyright = `©${currentYear} KIEDIS. All rights reserved.`;

    // Year verification
    expect(footerText).toContain(expectedCopyright);

    // console.log(`Footer copyright text: "${expectedCopyright}"`);

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

    // console.log(`Old version: ${oldVersion}`);
    // console.log(`Current version: ${currentVersion}`);

    // Save updated version
    data.lastBuild = currentVersion;
    fs.writeFileSync(this.versionFile, JSON.stringify(data, null, 2));
  }

  // Footer Hyperlinks
  async footersHyperlinks() {
    await this.ImpressumLink.click();
    await expect(this.page).toHaveURL(this.ImpressumURL);

    await this.TermsOfServiceLink.click();
    await expect(this.page).toHaveURL(this.TermsOfServiceURL);

    await this.ContactLink.click();
    await expect(this.page).toHaveURL(this.ContactURL);
  }

  // Language Switcher
  async languageClient() {
    const expectedOptions = ['English', 'Español', 'Deutsch'];
    const optionTexts = await this.languageSelect.locator('option').allTextContents();
    const panelControl = this.page.getByText('Panel de control');
    const cuenta = this.page.getByText('Cuenta');
    const cerrarSesion = this.page.getByText('Cerrar sesión');
    const bienvenido = this.page.getByText('Bienvenido de vuelta, Qa');
    const dashboard = this.page.getByText('Dashboard');
    const konto = this.page.getByText('Konto');
    const abmelden = this.page.getByText('Abmelden');
    const willkommen = this.page.getByText('Willkommen zurück, Qa');

    await expect(this.languageSelect).toBeVisible();
    expect(optionTexts).toEqual(expectedOptions);

    // Español
    await this.languageSelect.selectOption('es');
    await expect(this.languageSelect).toHaveValue('es');
    await expect(this.page).toHaveURL(/\/es\//);

    await expect(panelControl).toHaveText('Panel de control');
    await expect(cuenta).toHaveText('Cuenta');
    await expect(cerrarSesion).toHaveText('Cerrar sesión');
    await expect(bienvenido).toHaveText('Bienvenido de vuelta, Qa');

    // Deutsch
    await this.languageSelect.selectOption('de');
    await expect(this.languageSelect).toHaveValue('de');
    await expect(this.page).toHaveURL(/\/de\//);

    await expect(dashboard).toHaveText('Dashboard');
    await expect(konto).toHaveText('Konto');
    await expect(abmelden).toHaveText('Abmelden');
    await expect(willkommen).toHaveText('Willkommen zurück, Qa');

    // English
    await this.languageSelect.selectOption('en');
    await expect(this.languageSelect).toHaveValue('en');
    await expect(this.page).toHaveURL(/\/en\//);
  }

  
  // Language Switcher
  async languageFreelancer() {
    const expectedOptions = ['English', 'Español', 'Deutsch'];
    const optionTexts = await this.languageSelect.locator('option').allTextContents();
    const panelControl = this.page.getByText('Panel de control');
    const perfil = this.page.getByText('Perfil', { exact: true });
    const cuenta = this.page.getByText('Cuenta');
    const cerrarSesion = this.page.getByText('Cerrar sesión');
    const bienvenido = this.page.getByText('Bienvenido de vuelta, QA');
    const dashboard = this.page.getByText('Dashboard');
    const profile = this.page.getByText('Profil', { exact: true });
    const konto = this.page.getByText('Konto');
    const abmelden = this.page.getByText('Abmelden');
    const willkommen = this.page.getByText('Willkommen zurück, QA');

    await expect(this.languageSelect).toBeVisible();
    expect(optionTexts).toEqual(expectedOptions);

    // Español
    await this.languageSelect.selectOption('es');
    await expect(this.languageSelect).toHaveValue('es');
    await expect(this.page).toHaveURL(/\/es\//);

    await expect(panelControl).toHaveText('Panel de control');
    await expect(perfil).toHaveText('Perfil');
    await expect(cuenta).toHaveText('Cuenta');
    await expect(cerrarSesion).toHaveText('Cerrar sesión');
    await expect(bienvenido).toHaveText('Bienvenido de vuelta, QA');

    // Deutsch
    await this.languageSelect.selectOption('de');
    await expect(this.languageSelect).toHaveValue('de');
    await expect(this.page).toHaveURL(/\/de\//);

    await expect(dashboard).toHaveText('Dashboard');
    await expect(profile).toHaveText('Profil');
    await expect(konto).toHaveText('Konto');
    await expect(abmelden).toHaveText('Abmelden');
    await expect(willkommen).toHaveText('Willkommen zurück, QA');

    // English
    await this.languageSelect.selectOption('en');
    await expect(this.languageSelect).toHaveValue('en');
    await expect(this.page).toHaveURL(/\/en\//);
  }

  async clientsHeader() {
    const dashboard = this.page.getByRole('link', { name: 'Dashboard' });
    const account = this.page.getByRole('link', { name: 'Account' });

    await expect(this.kiediesLogo).toBeVisible();
    await expect(dashboard).toBeVisible();
    await expect(account).toBeVisible();
    await expect(this.btnSignout).toBeVisible();
  }

  async freelancerHeader() {
    const dashboard = this.page.getByRole('link', { name: 'Dashboard' });
    const account = this.page.getByRole('link', { name: 'Account' });
    const profile = this.page.getByRole('link', { name: 'Profile', exact: true });

    await expect(this.kiediesLogo).toBeVisible();
    await expect(dashboard).toBeVisible();
    await expect(profile).toBeVisible();
    await expect(account).toBeVisible();
    await expect(this.btnSignout).toBeVisible();
  }
}
