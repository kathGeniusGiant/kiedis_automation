// async positionTitle() {
//   await this.linkNewJobDescription.click();
//   await this.btnpositionTitle.click();

//   await expect(this.page.getByText('What is the position title')).toBeVisible();
//   await expect(this.headingJobDescription).toBeVisible();
//   await expect(this.refineCriteria).toBeVisible();

//   await this.chatInput.fill('Qa Automation Engineer');
//   await this.btnSend.click();

//   // --- Purpose question (wording may vary)
//   await expect(
//     this.page.getByText(/purpose|role|describe/i)
//   ).toBeVisible({ timeout: 30000 });

//   await this.page.getByRole('textbox').first().fill(
//     'A QA Automation Engineer ensures software quality by designing, building, and maintaining automated tests. They help reduce manual effort, increase reliability, and prevent production defects.'
//   );
//   await this.btnContinue.click();

//   // --- WAIT FOR ONE OF THE 3 RANDOM QUESTIONS
//   const question = await Promise.race([
//     this.page.getByText(/required qualifications/i)
//       .waitFor({ timeout: 40000 })
//       .then(() => "qualifications")
//       .catch(() => null),

//     this.page.getByText(/key responsibilities/i)
//       .waitFor({ timeout: 40000 })
//       .then(() => "responsibilities")
//       .catch(() => null),

//     this.page.getByText(/working conditions/i)
//       .waitFor({ timeout: 40000 })
//       .then(() => "working")
//       .catch(() => null),
//   ]);

//   if (!question) {
//     throw new Error("No recognized AI question appeared.");
//   }

//   // ------------------------------------------------------------
//   // ---------------------- QUALIFICATIONS -----------------------
//   // ------------------------------------------------------------
//   if (question === "qualifications") {
//     const qualInput = this.page
//   .getByText("List the required qualifications")
//   .locator('xpath=following::input[1]');
    

//     await qualInput.fill('Bachelor of Science in Information Technology');
//     await qualInput.press('Enter');

//     await expect(this.btnContinue2).toBeEnabled({ timeout: 30000 });
//     await this.btnContinue2.click();

//     await expect(
//       this.page
//         .getByRole('paragraph')
//         .filter({ hasText: 'Bachelor of Science in Information Technology' })
//     ).toBeVisible();
//   }

//   // ------------------------------------------------------------
//   // --------------------- RESPONSIBILITIES ----------------------
//   // ------------------------------------------------------------
//   if (question === "responsibilities") {
//     const responsibilitiesInput = this.page.locator('h3:has-text("List 4–7 key responsibilities")')
//   .locator('xpath=following::input[1]');

//     await responsibilitiesInput.waitFor({
//       state: 'visible',
//       timeout: 45000,
//     });

//     await responsibilitiesInput.fill(
//       'Develop and maintain automated test scripts for web, mobile, and API applications.'
//     );
//     await responsibilitiesInput.press('Enter');

//     await responsibilitiesInput.fill(
//       'Build and enhance automation frameworks and integrate them into CI/CD pipelines.'
//     );
//     await responsibilitiesInput.press('Enter');

//     await responsibilitiesInput.fill(
//       'Execute automated regression, smoke, and integration tests.'
//     );
//     await responsibilitiesInput.press('Enter');

//     await responsibilitiesInput.fill(
//       'Identify, document, and report defects with clear reproducible steps.'
//     );
//     await responsibilitiesInput.press('Enter');

//     await this.btnContinue2.click();

//     await expect(
//       this.page.getByText(
//         /Develop and maintain automated test scripts for web/i
//       )
//     ).toBeVisible();
//   }

//   // ------------------------------------------------------------
//   // ---------------------- WORKING CONDITIONS -------------------
//   // ------------------------------------------------------------
//   if (question === "working") {
//     const wcInput = this.page
//   .getByText(/List the working conditions/i)
//   .locator('xpath=following::input[1]');

//     await wcInput.fill('Remote or hybrid work environment.');
//     await wcInput.press('Enter');

//     await wcInput.fill(
//       'Standard office hours with occasional overtime during release periods.'
//     );
//     await wcInput.press('Enter');

//     await wcInput.fill(
//       'Minimal physical demands; mainly computer-based tasks.'
//     );
//     await wcInput.press('Enter');

//     await this.btnContinue2.click();

//     await expect(
//       this.page.getByText("Remote or hybrid work environment., Standard office hours with occasional overtime during release periods., Minimal physical demands; mainly computer-based tasks.")
//     ).toBeVisible();
//   }

//   // ------------------------------------------------------------
//   // --------------------- REMAINING STEPS -----------------------
//   // ------------------------------------------------------------
//   await this.textMatchesFound.click();

//   await expect(
//     this.page.locator('h3.text-xl.font-semibold.text-blue-700')
//   ).toHaveText(/Top\s+\d+\s+Candidates/);

//   await this.btnX.click();
//   await this.textMatchesFound.click();

//   await expect(this.btnViewAllMatches).toBeVisible();
//   await this.btnContinueRefining.click();
//   await this.btnfindMatches.click();
// }