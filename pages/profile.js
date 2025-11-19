import { expect } from '@playwright/test';

export class ProfilePage {
  constructor(page) {
    this.page = page;

    // Header
    this.profileName = page.getByRole('heading', { name: 'QA Tester' });
    this.dailyRate = page.getByText(/€200/);
    this.jobRole = page.getByText('QA Engineer');
    this.address = page.locator('div').filter({ hasText: /^San Jose Street, Camarines Sur$/ });

    // Sections
    this.aboutSection = page.getByRole('heading', { name: 'About' });
    this.skillsSection = page.getByRole('heading', { name: 'Skills' });
    this.languagesSection = page.getByRole('heading', { name: 'Languages' });
    this.workExperienceSection = page.getByRole('heading', { name: 'Work Experience' });
    this.educationSection = page.getByRole('heading', { name: 'Education' });

    // Skills tags
    this.skillCms = page.getByText('CMS Testing');
    this.skillApi = page.getByText('API Testing');
    this.skillMobile = page.getByText('Mobile Testing');
    this.skillWebAutomation = page.getByText('Web Automation');

    // Work experience
    this.jobTitle = page.getByText(/Quality Assurance Analyst\/Automator/i);
    this.jobCompany = page.getByText(/GenziGiant/i);
    this.jobYears = page.getByText(/2022 – Present/);

    // Education
    this.eduTitle = page.getByText('Information Technology');
    this.eduSchool = page.getByText('Naga College School');
    this.eduYears = page.getByText('2015 – 2019');

    //URL
    this.profileUrl = 'https://test.kiedis.com/en/freelancer/profile/';
  }

  async gotoProfilePage() {
    await this.profileUrl.click();
    await expect(this.page).toHaveURL(this.profileUrl);
  }

  // Assertions
  async assertHeader() {
    await expect(this.profileName).toBeVisible();
    await expect(this.dailyRate).toBeVisible();
    await expect(this.jobRole).toBeVisible();
    await expect(this.address).toBeVisible();
  }

  async assertSkills() {
    await expect(this.skillCms).toBeVisible();
    await expect(this.skillApi).toBeVisible();
    await expect(this.skillMobile).toBeVisible();
    await expect(this.skillWebAutomation).toBeVisible();
  }

  async assertWorkExperience() {
    await expect(this.jobTitle).toBeVisible();
    await expect(this.jobCompany).toBeVisible();
    await expect(this.jobYears).toBeVisible();
  }

  async assertEducation() {
    await expect(this.eduTitle).toBeVisible();
    await expect(this.eduSchool).toBeVisible();
    await expect(this.eduYears).toBeVisible();
  }
}