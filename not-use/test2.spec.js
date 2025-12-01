// async positionTitle() {
//     await this.linkNewJobDescription.click();
//     await this.btnpositionTitle.click();

//     await expect(this.page.getByText('What is the position title')).toBeVisible();
//     await expect(this.headingJobDescription).toBeVisible();
//     await expect(this.refineCriteria).toBeVisible();
//     await this.chatInput.fill('Qa Automation Engineer');
//     await this.btnSend.click();

//     await expect(this.page.getByText('What is the purpose of the QA')).toBeVisible();
//     await this.page.getByRole('textbox').first().fill('A QA Automation Engineer (Quality Assurance Automation Engineer) ensures software quality by designing, building, and maintaining automated tests that verify an application works correctly, reliably, and consistently. Their role is critical in speeding up testing, reducing manual effort, and preventing bugs from reaching production.');
//     await this.btnContinue.click();

//     await expect(this.page.getByText('List the required qualifications for this role')).toBeVisible({timeout: 40000});
//     await this.page.getByRole('textbox', { name: "e.g., Bachelor's degree in" }).fill('Bachelor of Science in Information technology');
//     await this.page.getByRole('textbox', { name: "e.g., Bachelor's degree in" }).press('Enter');
//     // Wait until NOT disabled
//     await expect(this.btnContinue2).toBeEnabled({ timeout: 30000 });
//     await this.btnContinue2.click();
//     await expect(this.page.getByRole('paragraph').filter({ hasText: 'Bachelor of Science in Information technology' })).toBeVisible();

//     await expect(this.page.getByText("List 4–7 key responsibilities")).toBeVisible({timeout: 40000});
//     const responsibilitiesInput = this.page.getByPlaceholder(/Design test/i, { timeout: 45000 });
//     await responsibilitiesInput.waitFor({ state: 'visible', timeout: 45000 });
//     await responsibilitiesInput.fill('Develop and maintain automated test scripts for web, mobile, and API applications.');
//     await responsibilitiesInput.press('Enter');
//     await responsibilitiesInput.fill('Build and enhance automation frameworks and integrate them into CI/CD pipelines.');
//     await responsibilitiesInput.press('Enter');
//     await responsibilitiesInput.fill('Execute automated regression, smoke, and integration tests.');
//     await responsibilitiesInput.press('Enter');
//     await responsibilitiesInput.fill('Identify, document, and report defects with clear reproducible steps.');
//     await responsibilitiesInput.press('Enter');
//     await this.btnContinue2.click();
//     //await this.btnContinue.click({timeout: 40000});
//     await expect(this.page.getByText('Develop and maintain automated test scripts for web, mobile, and API')).toBeVisible();
  
//     await this.textMatchesFound.click();
//     await expect(this.page.locator('h3.text-xl.font-semibold.text-blue-700')).toHaveText(/Top\s+\d+\s+Candidates/);
//     await this.btnX.click();
//     await this.textMatchesFound.click();
//     await expect(this.btnViewAllMatches).toBeVisible();
//     await this.btnContinueRefining.click();
//     await this.btnfindMatches.click();
//   }