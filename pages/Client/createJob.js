import { expect } from '@playwright/test';

export class CreateJobPage {
  constructor(page) {
    this.page = page;

    this.page.setDefaultTimeout(50000);

    // --------------------------
    // URLs
    // --------------------------
    this.dashboardURL = 'https://test.kiedis.com/en/client/dashboard/';
    this.createJobDescriptionLink = 'https://test.kiedis.com/en/client/create-job-description/';

    // --------------------------
    // Header / Navigation
    // --------------------------
    this.linkDashboard = page.getByRole('link', { name: 'Dashboard' });
    this.linkNewJobDescription = page.getByRole('link', { name: 'New Job Description' });

    // --------------------------
    // Chat + Main Interaction
    // --------------------------
    this.chatInput = page.getByRole('textbox', { name: 'Chat input' });
    this.btnSend = page.getByRole('button', { name: 'Send' });

    // --------------------------
    // Start Options
    // --------------------------
    this.btnUploadJobDescription = page.getByRole('button', { name: 'Upload Job Description' });
    this.btnpositionTitle = page.getByRole('button', { name: 'Position Title' });

    // --------------------------
    // Continue buttons (various steps)
    // --------------------------
    this.btnContinue = page.getByRole('button', { name: 'Continue' }).first();
    this.btnContinue2 = page.getByRole('button', { name: 'Continue' }).nth(1);
    this.btnContinue3 = page.getByRole('button', { name: 'Continue' }).nth(2);
    this.btnContinue4 = page.getByRole('button', { name: 'Continue' });
    this.btnContinue5 = page.getByRole('button', { name: 'Continue' }).nth(1);

    // --------------------------
    // Results / Matches
    // --------------------------
    this.textMatchesFound = page.getByText('matches found');
    this.btnX = page.getByRole('button').filter({ hasText: /^$/ });
    this.btnViewAllMatches = page.getByRole('button', { name: 'View all matches' });
    this.btnContinueRefining = page.getByRole('button', { name: 'Continue refining' });
    this.btnfindMatches = page.getByRole('button', { name: 'Find Matches' });

    // --------------------------
    // Page Sections
    // --------------------------
    this.headingJobDescription = page.getByRole('heading', { name: 'Job Description' });
    this.refineCriteria = page.getByText('Hint: Refine criteria to find');
  }

  // ========================================================================
  // NAVIGATION
  // ========================================================================
  async gotoDashboardPage() {
    await this.linkDashboard.click();
    await expect(this.page).toHaveURL(this.dashboardURL);
  }

  // ========================================================================
  // VERIFY NEW JOB DESCRIPTION PAGE
  // ========================================================================
  async verifyNewJobDescriptionPage() {
    await this.linkNewJobDescription.click();
    await expect(this.page).toHaveURL(this.createJobDescriptionLink);

    await expect(this.page.getByRole('heading', { name: 'Welcome to Kiedis' })).toBeVisible();
    await expect(
      this.page.getByText("We're here to help you find the perfect professional for your project needs")
    ).toBeVisible();
    await expect(this.page.getByRole('heading', { name: 'How would you like to begin?' })).toBeVisible();

    await expect(this.chatInput).toBeVisible();
    await expect(this.btnUploadJobDescription).toBeVisible();
    await expect(this.btnpositionTitle).toBeVisible();
    await expect(this.btnSend).toBeDisabled();
  }

  // ========================================================================
  // UPLOAD JOB DESCRIPTION FLOW
  // ========================================================================
  async uploadJobDescription() {
  await this.linkNewJobDescription.click();
  await this.btnUploadJobDescription.click();

  await expect(this.page.getByText('Upload Job Description').first()).toBeVisible();
  await expect(this.page.getByText('You can upload your job')).toBeVisible();
  await expect(this.btnUploadJobDescription).toBeVisible();
  await expect(this.chatInput).toBeVisible();
  await expect(this.headingJobDescription).toBeVisible();
  await expect(this.refineCriteria).toBeVisible();

  // Upload PDF
  const fileInput = this.page.locator('input[type="file"][accept="application/pdf,.pdf"]');
  await fileInput.setInputFiles('C:/Users/LENOVO/Documents/Job_description.pdf');

  await expect(
    this.page.getByText('Uploaded successfully.').nth(1)
  ).toBeVisible({ timeout: 15000 });

  // Dynamic Continue Button (like in positionTitle)
  const btnContinueDynamic = this.page.getByRole('button', { name: 'Continue' }).last();

  // --------------------------
  // Handle Dynamic AI Questions
  // --------------------------
  const pendingQuestions = new Set(['responsibilities', 'qualifications', 'working']);

  while (pendingQuestions.size > 0) {
    let questionType = null;

    const detectors = [];

    // RESPONSIBILITIES
    if (pendingQuestions.has('responsibilities')) {
      detectors.push(
        this.page.getByText(/key responsibilities|4–7 key responsibilities/i)
          .waitFor({ timeout: 5000 })
          .then(() => 'responsibilities')
          .catch(() => null)
      );
    }

    // QUALIFICATIONS
    if (pendingQuestions.has('qualifications')) {
      detectors.push(
        this.page.getByText(/required qualifications|list the required qualifications/i)
          .waitFor({ timeout: 5000 })
          .then(() => 'qualifications')
          .catch(() => null)
      );
    }

    // WORKING CONDITIONS
    if (pendingQuestions.has('working')) {
      detectors.push(
        this.page.getByText(/working conditions/i)
          .waitFor({ timeout: 5000 })
          .then(() => 'working')
          .catch(() => null)
      );
    }

    questionType = await Promise.race(detectors);
    if (!questionType) break;

    // --------------------------
    // RESPONSIBILITIES HANDLING
    // --------------------------
    if (questionType === 'responsibilities') {
      const input = this.page.locator('input[placeholder*="Design test"]');

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

      await btnContinueDynamic.click();
      pendingQuestions.delete('responsibilities');
    }

    // --------------------------
    // QUALIFICATIONS HANDLING
    // --------------------------
    if (questionType === 'qualifications') {
      const qualInput = this.page.getByRole('textbox', {
        name: /bachelor/i,
      });

      await qualInput.fill('Bachelor of Science in Information Technology');
      await qualInput.press('Enter');

      await btnContinueDynamic.click();
      pendingQuestions.delete('qualifications');
    }

    // --------------------------
    // WORKING CONDITIONS HANDLING
    // --------------------------
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

  // --------------------------
  // FINAL MATCHES SECTION
  // --------------------------
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

  // ========================================================================
  // POSITION TITLE FLOW (DYNAMIC QUESTIONS)
  // ========================================================================
  async positionTitle() {
    await this.linkNewJobDescription.click();
    await this.btnpositionTitle.click();

    await expect(this.page.getByText('What is the position title')).toBeVisible();
    await expect(this.headingJobDescription).toBeVisible();
    await expect(this.refineCriteria).toBeVisible();

    await this.chatInput.fill('QA Automation Engineer');
    await this.btnSend.click();

    // Wait for Purpose Question
    await expect(this.page.getByText(/purpose|role|describe/i)).toBeVisible({ timeout: 30000 });

    await this.page.getByRole('textbox').first().fill(
      'A QA Automation Engineer ensures software quality by designing, building, and maintaining automated tests.'
    );

    const btnContinueDynamic = this.page.getByRole('button', { name: 'Continue' }).last();
    await btnContinueDynamic.click();

    // --------------------------
    // Handle Random AI Questions
    // --------------------------
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

        await btnContinueDynamic.click();
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

        await btnContinueDynamic.click();
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

        await btnContinueDynamic.click();
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

  // ========================================================================
  // EDIT JOB DESCRIPTION
  // ========================================================================
  async editJobDescription() {
    await this.linkNewJobDescription.click();

    await this.chatInput.fill(
      'A QA Automation Engineer is responsible for designing, developing, and executing automated tests.'
      + ' They work closely with developers and QA teams to identify scenarios, build automation frameworks, and improve testing efficiency.'
    );

    await this.btnSend.click();
    await this.textMatchesFound.click();
    await this.btnViewAllMatches.click();

    await this.page.getByRole('button', { name: 'Hide details' }).click();
    await this.page.getByRole('button', { name: 'View details' }).click();

    await this.page.getByRole('button', { name: '← Dashboard' }).click();
    await this.page.getByRole('button', { name: 'Continue Recruiting' }).first().click();

    // Verify Job Page
    await expect(this.page.getByRole('heading', { name: 'QA Automation Engineer' })).toBeVisible();
    await expect(this.page.getByText('Actively Recruiting')).toBeVisible();

    const sections = ['BUDGET', 'AVAILABILITY', 'JOB DESCRIPTION', 'MEETING TYPES', 'SKILLS', 'EXPERIENCE', 'REMOTE WORK'];

    for (const sec of sections) {
      await expect(this.page.getByRole('heading', { name: sec })).toBeVisible();
    }

    // Edit JD
    await this.page.getByRole('button', { name: 'Edit JD' }).click();
    await this.page.getByRole('button', { name: 'Discard' }).click();
    await this.page.getByRole('button', { name: 'Edit JD' }).click();

    await this.page.getByPlaceholder('Enter the maximum daily rate').fill('200');

    await this.page.getByRole('checkbox').first().uncheck();
    await this.page.getByRole('checkbox').first().check();

    // Skills
    await this.page.getByRole('button', { name: 'more' }).click();
    await this.page.getByRole('textbox', { name: 'Enter skills - Press Enter to' }).fill('API skills');
    await this.page.getByRole('textbox', { name: 'Enter skills - Press Enter to' }).press('Enter');

    // Experience
    await this.page.getByRole('textbox', { name: 'Enter relevant work experience' }).fill('API Testing');
    await this.page.getByRole('textbox', { name: 'Enter relevant work experience' }).press('Enter');

    // Location
    await this.page.getByRole('textbox', { name: 'Enter your city' }).fill('Naga City');
    await this.page.getByRole('textbox', { name: 'Enter your city' }).press('Enter');

    await this.page.getByRole('textbox', { name: 'Enter your country' }).fill('PH');
    await this.page.getByRole('textbox', { name: 'Enter your country' }).press('Enter');

    // Language
    await this.page.getByRole('textbox', { name: 'Enter language codes (e.g.,' }).fill('EN');
    await this.page.getByRole('textbox', { name: 'Enter language codes (e.g.,' }).press('Enter');

    // Checkbox
    await this.page.getByRole('checkbox').nth(1).uncheck();
    await this.page.getByRole('checkbox').nth(1).check();

    await this.page.getByRole('button', { name: 'Save Changes' }).click();
    await expect(this.page.getByText('Job description saved successfully')).toBeVisible();
  }

  async interviewSlot() {
    await this.page.getByRole('button', { name: 'Continue Recruiting' }).first().click();
    await this.page.getByRole('button', { name: 'Interview slots' }).click();
    await this.page.getByRole('button').first().click();
    await this.page.getByRole('button', { name: 'Interview slots' }).click();
    await expect(this.page.getByRole('heading', { name: 'Set your interview' })).toBeVisible();

    await this.page.getByTestId('availablity-title').click();
    await this.page.getByTestId('availablity-title').press('ControlOrMeta+a');
    await this.page.getByTestId('availablity-title').fill('QA Availability');
    
    await expect(this.page.getByText('Set as Default')).toBeVisible();
    await this.page.getByTestId('Friday-switch').click();
    await this.page.getByTestId('Thursday-switch').click();

    // Open the Monday time selector
    await this.page.getByTestId('Monday').getByText(':00am').click();

    // 🔥 Select a time from the dropdown (React Select)
    // This clicks the "input" of react-select inside that Monday container
    const mondayTimeInput = this.page.getByTestId('Monday').locator('input[id^="react-select"]');
    await mondayTimeInput.click();

    // Now choose the time (example: 9:00am)
    await this.page.locator('div[class*="react-select"]').getByText('9:00am', { exact: true }).click();
}

}
