import { expect } from '@playwright/test';
import links from '../../fixtures/links.json';

export class CreateJobPage {
  constructor(page) {
    this.page = page;

    this.page.setDefaultTimeout(50000);

    // ---------------------------URLs----------------------------
    this.dashboardURLClient = links.dashboardURLClient;
    this.createJobDescriptionLink = links.createJobDescriptionLink;

    // -------------------Header / Navigation---------------------
    this.linkDashboard = page.getByRole('link', { name: 'Dashboard' });
    this.linkNewJobDescription = page.getByRole('link', { name: 'New Job Description' });

    // -----------------Chat + Main Interaction--------------------
    this.chatInput = page.getByRole('textbox', { name: 'Chat input' });
    this.btnSend = page.getByRole('button', { name: 'Send' });

    // -----------------------Start Options------------------------
    this.btnUploadJobDescription = page.getByRole('button', { name: 'Upload Job Description' });
    this.btnpositionTitle = page.getByRole('button', { name: 'Position Title' });

    // --------------Continue buttons (various steps)--------------
    // this.btnContinue = page.getByRole('button', { name: 'Continue' }).first();
    this.btnContinueDynamic = this.page.getByRole('button', { name: 'Continue' }).last();

    // ----------------------Results / Matches---------------------
    this.textMatchesFound = page.getByText('matches found');
    this.btnX = page.getByRole('button').filter({ hasText: /^$/ });
    this.btnViewAllMatches = page.getByRole('button', { name: 'View all matches' });
    this.btnContinueRefining = page.getByRole('button', { name: 'Continue refining' });
    this.btnfindMatches = page.getByRole('button', { name: 'Find Matches' });

    // ------------------------Page Sections------------------------
    this.headingJobDescription = page.getByRole('heading', { name: 'Job Description' });
    this.refineCriteria = page.getByText('Hint: Refine criteria to find');
  }

  // NAVIGATION
  async gotoDashboardPage() {
    await this.linkDashboard.click();
    await expect(this.page).toHaveURL(this.dashboardURLClient);
  }

  // VERIFY NEW JOB DESCRIPTION PAGE
  async verifyNewJobDescriptionPage() {
    const heading1 = this.page.getByRole('heading', { name: 'Welcome to Kiedis' });
    const helpText = this.page.getByText("We're here to help you find the perfect professional for your project needs");
    const heading2 = this.page.getByRole('heading', { name: 'How would you like to begin?' });

    await this.linkNewJobDescription.click();
    await expect(this.page).toHaveURL(this.createJobDescriptionLink);
    await expect(heading1).toBeVisible();
    await expect(helpText).toBeVisible();
    await expect(heading2).toBeVisible();

    await expect(this.chatInput).toBeVisible();
    await expect(this.btnUploadJobDescription).toBeVisible();
    await expect(this.btnpositionTitle).toBeVisible();
    await expect(this.btnSend).toBeDisabled();
  }

  // UPLOAD JOB DESCRIPTION FLOW
  async uploadJobDescription() {
    const uploadText = this.page.getByText('Upload Job Description').first();
    const instructionText = this.page.getByText('Click the button below to select a file or drag and drop your job description PDF.');
    const fileInput = this.page.locator('input[type="file"][accept="application/pdf,.pdf"]');
    const filePath = 'C:/Users/LENOVO/Documents/Job_description.pdf';
    const successMessage = this.page.getByText('Uploaded successfully.').nth(1);
    const pendingQuestions = new Set(['responsibilities', 'qualifications', 'working']);

    await this.linkNewJobDescription.click();
    await this.btnUploadJobDescription.click();

    await expect(uploadText).toBeVisible();
    await expect(instructionText).toBeVisible();
    await expect(this.btnUploadJobDescription).toBeVisible();
    await expect(this.chatInput).toBeVisible();
    await expect(this.headingJobDescription).toBeVisible();
    await expect(this.refineCriteria).toBeVisible();

    // Upload PDF
    await fileInput.setInputFiles(filePath);
    await expect(successMessage).toBeVisible({ timeout: 15000 });

    // Handle Dynamic AI Questions
    while (pendingQuestions.size > 0) {
      let questionType = null;
      const detectors = [];

      // RESPONSIBILITIES
      if (pendingQuestions.has('responsibilities')) {
        detectors.push(
          this.page
            .getByText(/key responsibilities|4–7 key responsibilities/i)
            .waitFor({ timeout: 5000 })
            .then(() => 'responsibilities')
            .catch(() => null)
        );
      }

      // QUALIFICATIONS
      if (pendingQuestions.has('qualifications')) {
        detectors.push(
          this.page
            .getByText(/required qualifications|list the required qualifications/i)
            .waitFor({ timeout: 5000 })
            .then(() => 'qualifications')
            .catch(() => null)
        );
      }

      // WORKING CONDITIONS
      if (pendingQuestions.has('working')) {
        detectors.push(
          this.page
            .getByText(/working conditions/i)
            .waitFor({ timeout: 5000 })
            .then(() => 'working')
            .catch(() => null)
        );
      }

      questionType = await Promise.race(detectors);
      if (!questionType) break;

      // RESPONSIBILITIES HANDLING
      if (questionType === 'responsibilities') {
        const input = this.page.locator('input[placeholder*="e.g., Design"]');

        const items = [
          'Develop and maintain automated test scripts for web, mobile, and API applications.',
          'Build and enhance automation frameworks and integrate them into CI/CD pipelines.',
          'Execute automated regression, smoke, and integration tests.',
          'Identify, document, and report defects with clear reproducible steps.',
        ];

        for (const item of items) {
          await input.fill(item);
          await input.press('Enter');
        }

        await this.btnContinueDynamic.click();
        pendingQuestions.delete('responsibilities');
      }

      // QUALIFICATIONS HANDLING
      if (questionType === 'qualifications') {
        const qualInput = this.page.getByRole('textbox', {
          name: /bachelor/i,
        });

        await qualInput.fill('Bachelor of Science in Information Technology');
        await qualInput.press('Enter');

        await this.btnContinueDynamic.click();
        pendingQuestions.delete('qualifications');
      }

      // WORKING CONDITIONS HANDLING
      if (questionType === 'working') {
        const input = this.page.getByText(/working conditions/i)
          .locator('xpath=following::input[1]');

        const items = [
          'Remote or hybrid work setup',
          'Standard office hours with occasional overtime',
          'Low physical demands (mostly computer-based work)',
        ];

        for (const item of items) {
          await input.fill(item);
          await input.press('Enter');
        }

        await btnContinueDynamic.click();
        pendingQuestions.delete('working');
      }
    }

    // FINAL MATCHES SECTION
    await this.textMatchesFound.click();

    await expect(
      this.page.locator('h3.text-xl.font-semibold.text-blue-700')
    ).toHaveText(/Top\s+\d+\s+Candidates/);

    await this.btnX.click();
    await this.textMatchesFound.click();

    await expect(this.btnViewAllMatches).toBeVisible();
    await this.btnContinueRefining.click();
    await this.btnfindMatches.click();
  }

  // POSITION TITLE FLOW (DYNAMIC QUESTIONS)
  async positionTitle() {
    const question = this.page.getByText('What is the position title you are looking for?');
    const inputRole = "A QA Automation Engineer ensures software quality by designing, building, and maintaining automated tests.";
    const textChatBox = this.page.getByRole('textbox').first();
    
    await this.linkNewJobDescription.click();
    await this.btnpositionTitle.click();

    await expect(question).toBeVisible();
    await expect(this.headingJobDescription).toBeVisible();
    await expect(this.refineCriteria).toBeVisible();

    await this.chatInput.fill('QA Automation Engineer');
    await this.btnSend.click();

    // Wait for Purpose Question
    await expect(this.page.getByText(/purpose|role|describe/i)).toBeVisible({ timeout: 30000 });
    await textChatBox.fill(inputRole);
    await this.btnContinueDynamic.click();

    // Handle Random AI Questions
    const pendingQuestions = new Set(['qualifications', 'responsibilities', 'working']);

    while (pendingQuestions.size > 0) {
      let questionType = null;
      const checkers = [];

      if (pendingQuestions.has('qualifications')) {
        checkers.push(
          this.page
            .getByText(/required qualifications/i)
            .waitFor({ timeout: 5000 })
            .then(() => 'qualifications')
            .catch(() => null)
        );
      }

      if (pendingQuestions.has('responsibilities')) {
        checkers.push(
          this.page
            .getByText(/key responsibilities/i)
            .waitFor({ timeout: 5000 })
            .then(() => 'responsibilities')
            .catch(() => null)
        );
      }

      if (pendingQuestions.has('working')) {
        checkers.push(
          this.page
            .getByText(/working conditions/i)
            .waitFor({ timeout: 5000 })
            .then(() => 'working')
            .catch(() => null)
        );
      }

      questionType = await Promise.race(checkers);
      if (!questionType) break;

      // QUALIFICATIONS
      if (questionType === 'qualifications') {
        const input = this.page.getByText(/required qualifications/i).locator('xpath=following::input[1]');
        await input.fill('Bachelor’s degree in Information Technology');
        await input.press('Enter');
        await this.btnContinueDynamic.click();
        pendingQuestions.delete('qualifications');
      }

      // RESPONSIBILITIES
      if (questionType === 'responsibilities') {
        const input = this.page
          .getByText(/key responsibilities/i)
          .locator('xpath=following::input[@type="text"][1]');

        await input.waitFor({ state: 'visible' });

        const items = [
          'Develop and maintain automated test scripts',
          'Execute automated functional and regression tests',
          'Enhance QA automation frameworks',
          'Report and track defects using bug tracking tools',
        ];

        for (const item of items) {
          await input.fill(item);
          await input.press('Enter');
        }
        await this.btnContinueDynamic.click();
        pendingQuestions.delete('responsibilities');
      }

      // WORKING CONDITIONS
      if (questionType === 'working') {
        const input = this.page.getByText(/working conditions/i).locator('xpath=following::input[1]');

        const items = [
          'Remote or hybrid work setup',
          'Office hours with occasional overtime',
          'Low physical demands (primarily computer-based work)',
        ];

        for (const item of items) {
          await input.fill(item);
          await input.press('Enter');
        }
        await this.btnContinueDynamic.click();
        pendingQuestions.delete('working');
      }
    }

    // Final steps
    await this.textMatchesFound.click();

    await expect(
      this.page.locator('h3.text-xl.font-semibold.text-blue-700')
    ).toHaveText(/Top\s+\d+\s+Candidates/);

    await this.btnX.click();
    await this.textMatchesFound.click();
    await expect(this.btnViewAllMatches).toBeVisible();
    await this.btnContinueRefining.click();
    await this.btnfindMatches.click();
  }
}
