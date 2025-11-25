import { expect } from '@playwright/test';

export class ProfilePage {
  constructor(page) {
    this.page = page;

    this.linkProfile = page.getByRole('link', { name: 'Profile', exact: true });

    // Sections
    this.aboutSection = page.getByRole('heading', { name: 'About' });
    this.skillsSection = page.getByRole('heading', { name: 'Skills' });
    this.languagesSection = page.getByRole('heading', { name: 'Languages' });
    this.workExperienceSection = page.getByRole('heading', { name: 'Work Experience' });
    this.educationSection = page.getByRole('heading', { name: 'Education' });
    this.HeadingEditbtn = page.getByRole('button', { name: 'Edit' }).first();

    //Overviwew tab
    this.overviewTab = page.getByRole('tab', { name: 'Overview' });
    this.aboutEditbtn = page.getByRole('button', { name: 'Edit' }).nth(1);
    this.languagesEditbtn = page.getByRole('button', { name: 'Edit' }).nth(2);
    this.workExpEditbtn = page.getByRole('button', { name: 'Edit' }).nth(3);
    this.educationEditbtn = page.getByRole('button', { name: 'Edit' }).nth(4);
    this.deleteWorkExpBtn = page.getByRole('button').nth(5);
    this.deleteEducationBtn = page.getByRole('button').filter({ hasText: /^$/ }).nth(1);
    this.addNewItemWorkExpBtn = page.getByRole('button', { name: 'Add new item' }).first();
    this.addNewItemEducationBtn = page.getByRole('button', { name: 'Add new item' }).nth(1);

    //URL
    this.profileUrl = 'https://test.kiedis.com/en/freelancer/profile/';

    //Edit Profile Modal
    this.xbuttonCloseModal = page.getByRole('button').filter({ hasText: /^$/ });
    this.nameInput = page.getByRole('textbox', { name: 'Enter your full name' });
    this.titleInput = page.getByRole('textbox', { name: 'e.g., Senior Software Engineer' });
    this.rateInput = page.getByPlaceholder('Enter your daily rate');
    this.saveChangesBtn = page.getByRole('button', { name: 'Save Changes' });
    this.cancelBtn = page.getByRole('button', { name: 'Cancel' });
    this.checkboxAvailableNow = page.getByRole('checkbox').first();
    this.checkboxAvailableForRemote = page.getByRole('checkbox').nth(1);
    this.cityInput = page.getByRole('textbox', { name: 'Enter your city' });
    this.countryInput = page.getByRole('textbox', { name: 'Enter your country' });
    this.phoneInput = page.getByRole('textbox', { name: 'Enter your phone number' });

    //Edit About Modal
    this.aboutTextbox = page.getByRole('textbox', { name: 'Tell us about yourself, your' });

    //Skills Section
    this.showMoreButton = page.getByRole('button', { name: '+ Show more' });
    this.showlessButton = page.getByRole('button', { name: '- Show less' });
    this.skillNameInput = page.getByRole('textbox', { name: 'Enter skill name' });
    this.profiencyLevelInput = page.getByRole('textbox', { name: 'Enter proficiency level (e.g' });
    this.addSkillBtn = this.page.getByRole('button', { name: 'Add new skill' });
    this.addBtn = this.page.getByRole('button', { name: 'Add', exact: true });
    this.saveBtn = this.page.getByRole('button', { name: 'Save' });
    this.deleteSkillBtn = page.getByRole('button', { name: 'Delete' });

    //Edit Languages Modal
    this.addLanguageBtn = page.getByRole('button', { name: 'Add Language' });
    this.deleteLanguageBtn = page.getByRole('button', { name: 'Delete' }).nth(1);

    //Add Work Experience Modal
    this.textBoxDescribeYourRole = page.getByRole('textbox', { name: 'Describe your role and' });
    this.textBoxPositionTitle = page.getByRole('textbox', { name: 'e.g., Senior Developer' });
    this.textBoxCompany = page.getByRole('textbox', { name: 'e.g., Tech Corp' });
    this.textBoxLocation = page.getByRole('textbox', { name: 'e.g., Berlin, Germany' });
    this.startDateDropdown = page.locator('input[type="date"]').nth(0)
    this.endDateDropdown = page.locator('input[type="date"]').nth(1);
    this.editNBtnNewlyAddedExp = page.getByRole('button', { name: 'Edit' }).nth(3);
    this.deleteNewlyAddedExpBtn = page.getByRole('button').filter({ hasText: /^$/ }).nth(1);
    this.confirmBtn = page.getByRole('button', { name: 'Confirm' });

    //Education Section locators
    this.inputDegree = page.getByRole('textbox', { name: 'e.g., Bachelor of Science' });
    this.inputFieldOfStudy = page.getByRole('textbox', { name: 'e.g., Computer Science' });
    this.inputInstitution = page.getByRole('textbox', { name: 'e.g., University of Technology' });
    this.editBtnNewlyAddedEduc = page.getByRole('button', { name: 'Edit' }).nth(4);
    this.deleteNewlyAddedEducBtn = page.getByRole('button').filter({ hasText: /^$/ }).nth(1);
  }

  async gotoProfilePage() {
    await this.linkProfile.click();
    await expect(this.page).toHaveURL(this.profileUrl);
  }

  // Assertions
  async assertHeader() {
    await expect(this.page.getByRole('heading', { name: 'QA Testers' })).toBeVisible();
    await expect(this.page.getByText('QA Engineer')).toBeVisible();
    await expect(this.page.locator('div').filter({ hasText: /^San Jose Street, Camarines Sur, Philippines$/ })).toBeVisible();
    await expect(this.page.locator('div').filter({ hasText: /^qaautomation@yopmail\.com$/ })).toBeVisible();
    await expect(this.page.locator('div').filter({ hasText: /^09963521485$/ })).toBeVisible();
    await expect(this.page.getByText('€250 / Day')).toBeVisible();
  }

  async assertOverviewtab() {
    // await this.overviewTab.click();
    await expect(this.aboutSection).toBeVisible();
    await expect(this.skillsSection).toBeVisible();
    await expect(this.showMoreButton).toBeVisible();
    await expect(this.languagesSection).toBeVisible();
    await expect(this.workExperienceSection).toBeVisible();
    await expect(this.educationSection).toBeVisible();
  }

  async uploadImage() {
  const filePath = 'C:/Users/LENOVO/Documents/pic.jpg';
  await this.page.setInputFiles('input[type="file"][accept="image/*"]', filePath);
  await expect(this.page.locator('div').filter({ hasText: 'Avatar updated successfully!×' }).nth(2)).toBeVisible();
  }

  async editProfileEmptyInput() {
   //Hover to show Edit button and click
   let card = this.page.locator('.group', { hasText: "QA Testers" });
      await card.hover();   // shows the Edit button
      await card.getByRole('button', { name: 'Edit' }).hover();
      await expect(this.HeadingEditbtn).toBeVisible();
      await this.HeadingEditbtn.click();

    // Assert Edit Profile modal elements
    await expect(this.page.getByRole('heading', { name: 'Edit Profile' })).toBeVisible();
    await expect(this.page.getByRole('heading', { name: 'Location' })).toBeVisible();

    // Close and reopen modal to reset any pre-filled data
    await this.xbuttonCloseModal.click();
    await this.HeadingEditbtn.click();

    // Clear all input fields
    await this.nameInput.fill('');
    await this.rateInput.fill('');//incorrect validation error appears
    await this.cityInput.fill('');
    await this.phoneInput.fill('');
    const nameError = this.page.locator('p.text-xs.text-error-500', { hasText: 'Name is required' });
    await expect(nameError).toBeVisible();
    const cityError = this.page.locator('p.text-xs.text-error-500', { hasText: 'City is required' });
    await expect(cityError).toBeVisible();
    const phoneError = this.page.locator('p.text-xs.text-error-500', { hasText: 'Phone Number is required' });
    await expect(phoneError).toBeVisible();


    //Input two letters on fullname field to save changes button if disabled
    await this.nameInput.fill('AB');
    await expect(this.saveChangesBtn).toBeDisabled();
  }
  async editDetails() {
    let card = this.page.locator('.group', { hasText: "QA Testers" });
      await card.hover();   // shows the Edit button
      await this.HeadingEditbtn.hover(); 
      await expect(this.HeadingEditbtn).toBeVisible();
      await this.HeadingEditbtn.click();

    //Edit details and verify changes
    await this.nameInput.fill('QA Testers Edit');
    await this.titleInput.fill('QA Engineer Edit');
    await this.rateInput.fill('350');
    await this.cityInput.fill('San Jose Street, Camarines Sur Edit');
    await this.countryInput.fill('Philippines Edit');
    await this.phoneInput.fill('09963521488');
    await expect(this.saveChangesBtn).toBeEnabled();
    await this.checkboxAvailableNow.check();
    await this.checkboxAvailableForRemote.check();
    await this.checkboxAvailableNow.check();
    await this.saveChangesBtn.click();

    // Verify updated details on profile header
    await expect(this.page.getByRole('heading', { name: 'QA Testers Edit' })).toBeVisible();
    await expect(this.page.getByText('QA Engineer Edit')).toBeVisible();
    await expect(this.page.locator('div').filter({ hasText: /^San Jose Street, Camarines Sur Edit, Philippines Edit$/ })).toBeVisible();
    await expect(this.page.locator('div').filter({ hasText: /^09963521488$/ })).toBeVisible();
    await expect(this.page.getByText('€350 / Day')).toBeVisible();
    await expect(this.page.getByText('Available for remote work')).toBeVisible();

    //Reset to original details
    await card.hover();   // shows the Edit button
    await this.HeadingEditbtn.hover(); 
    await this.HeadingEditbtn.click();
    await this.nameInput.fill('QA Testers');
    await this.titleInput.fill('QA Engineer');
    await this.rateInput.fill('250');
    await this.cityInput.fill('San Jose Street, Camarines Sur');
    await this.countryInput.fill('Philippines');
    await this.phoneInput.fill('09963521485');
    await this.checkboxAvailableForRemote.check();
    await this.saveChangesBtn.click();
  }

  async editAbout() {
    let card = this.page.locator('.relative.group', { hasText: "About" });
      await card.hover();  // show Edit button
      await this.aboutEditbtn.hover(); 
      await expect(this.aboutEditbtn).toBeVisible();
      await this.aboutEditbtn.click();

    // Assert Edit About modal elements
    await expect(this.page.getByRole('heading', { name: 'Edit About' })).toBeVisible();
    await expect(this.page.getByRole('button').filter({ hasText: /^$/ })).toBeVisible();
    await expect(this.aboutTextbox).toBeVisible();
    await expect(this.aboutTextbox).toBeEmpty();
    await expect(this.cancelBtn).toBeVisible();
    await expect(this.saveChangesBtn).toBeVisible();

    await this.xbuttonCloseModal.click();
    await card.hover();   // shows the Edit button
    await this.aboutEditbtn.hover(); 
    await this.aboutEditbtn.click();
    await this.cancelBtn.click();
    await card.hover();   // shows the Edit button
    await this.aboutEditbtn.hover(); 
    await this.aboutEditbtn.click();

    await expect(this.aboutTextbox).toBeEmpty();
    await expect(this.saveChangesBtn).toBeEnabled();
    
    await this.aboutTextbox.fill('QA Tester About Test');
    await this.saveChangesBtn.click();
    await expect(this.page.locator('div').filter({ hasText: 'About section updated successfully!' }).nth(2)).toBeVisible();

    await card.hover();   // shows the Edit button
    await this.aboutEditbtn.hover(); 
    await this.aboutEditbtn.click();
    await this.aboutTextbox.fill('');
    await this.saveChangesBtn.click();
  }

  async skillSection(skillName, proficiency){
    // Verify Show More and Show Less buttons
    await expect(this.showMoreButton).toBeVisible();
    await this.showMoreButton.click();
    await expect(this.showlessButton).toBeVisible();
    await this.showlessButton.click();

    // Verify Add New Skill button and its modal
    await this.addSkillBtn.click();
    
    this.closeButton = this.page.locator('button[data-headlessui-state] svg');
      await this.closeButton.click();

    await this.addSkillBtn.click();
    await this.cancelBtn.click();
    await this.addSkillBtn.click();
    await expect(this.page.getByRole('heading', { name: 'Add new skill' })).toBeVisible();
    await expect(this.addBtn).toBeDisabled();

     // Skill Name required indicator
    await expect(this.page.locator('label', { hasText: 'Skill Name' }).locator('span.text-error-500')).toBeVisible();

      // Proficiency Level required indicator
    await expect(this.page.locator('label', { hasText: 'Proficiency Level' }).locator('span.text-error-500')).toBeVisible();

    this.skillNameInput.fill(skillName);
    this.profiencyLevelInput.fill(proficiency);
    await expect(this.addBtn).toBeEnabled();
    await this.addBtn.click();
    await expect(this.page.locator('div').filter({ hasText: 'Saved successfully×' }).nth(2)).toBeVisible();
    await this.showMoreButton.click();
    await this.page.getByText('JavaScript').click();
    await this.closeButton.click();
    await this.page.getByText('JavaScript').click();
    await this.cancelBtn.click();
    await this.page.getByText('JavaScript').click();
    await expect(this.page.getByRole('heading', { name: 'Edit Skill' })).toBeVisible();
    await this.profiencyLevelInput.fill('Intermediate');
    await this.saveBtn.click();
    await this.page.getByText('JavaScript').click();
    await this.deleteSkillBtn.click();
    await expect(this.page.getByRole('heading', { name: 'Are you sure?' })).toBeVisible();
    await expect(this.page.getByText('This action cannot be undone.')).toBeVisible();
    await this.cancelBtn.click();
    await this.deleteSkillBtn.click();
    await this.confirmBtn.click();
    await expect(this.page.locator('div').filter({ hasText: 'Skill deleted successfully×' }).nth(2)).toBeVisible();
  }

  async addLanguage() {
    let card = this.page.locator('.relative.group', { hasText: "Languages" });
      await card.hover();  // show Edit button
      await this.languagesEditbtn.hover(); 
      await expect(this.languagesEditbtn).toBeVisible();
      await this.languagesEditbtn.click();

    await expect(this.page.getByRole('heading', { name: 'Edit Languages' })).toBeVisible();
    // Add Language
    await this.addLanguageBtn.click();

    // -------------------------------
    // VERIFY DROPDOWN OPTIONS (ADDED)
    // -------------------------------

    // Open the Proficiency Level dropdown
    const proficiencyDropdown = this.page.getByRole('combobox').nth(3);
    await proficiencyDropdown.click();

    const expectedOptions = [
      'Select proficiency level',
      'Beginner',
      'Elementary',
      'Intermediate',
      'Advanced',
      'Native'
    ];

    // Select Language
    await this.page.getByRole('combobox').nth(2).selectOption('ab');

    // Select Proficiency Level
    await proficiencyDropdown.selectOption('beginner');
    await expect(this.page.locator('div').filter({ hasText: 'Language skill added successfully!' }).nth(2)).toBeVisible();

    // Update Language
    await this.page.getByRole('combobox').nth(2).selectOption('elementary');
    // await this.page.getByLabel('Proficiency Level').nth(1).selectOption('elementary');
    await expect(this.page.locator('div').filter({ hasText: 'Language skill updated successfully!' }).nth(2)).toBeVisible();

    // Delete Language
    await this.deleteLanguageBtn.click();
    await expect(this.page.locator('div').filter({ hasText: 'Language skill deleted successfully!' }).nth(2)).toBeVisible();
    await this.xbuttonCloseModal.click();
  }

  async workExperienceEmptyInput(Position_Title, Company){
    //Verify add item modal
    await this.addNewItemWorkExpBtn.click();
    const closeButton = this.page.locator('button[data-headlessui-state] svg');
      await closeButton.click();

    await this.addNewItemWorkExpBtn.click();
    await this.cancelBtn.click();

    await this.addNewItemWorkExpBtn.click();
    await expect(this.page.getByRole('heading', { name: 'Add new item' })).toBeVisible();
    await expect(this.textBoxDescribeYourRole).toBeVisible();
    await expect(this.saveChangesBtn).toBeDisabled();

    await this.textBoxPositionTitle.fill(Position_Title);
    await this.textBoxCompany.fill(Company);
    await this.textBoxLocation.click();
    await this.textBoxPositionTitle.fill('');
    let errorMessage = this.page.locator('p.text-error-500', {hasText: 'Position Title is required'});
      await expect(errorMessage).toBeVisible();
    await this.textBoxCompany.fill('');
        errorMessage = this.page.locator('p.text-error-500', {hasText: 'Company is required'});
      await expect(errorMessage).toBeVisible();
  }

  async addedWorkExperienceSuccessfully(Position_Title, Company, Location, Start_Date, End_Date, Role_Description){
    //Add new work experience successfully
    await this.textBoxPositionTitle.fill(Position_Title);
    await this.textBoxCompany.fill(Company);
    await this.textBoxLocation.fill(Location);
    await this.startDateDropdown.fill(Start_Date);
    await this.endDateDropdown.fill(End_Date);
    await this.textBoxDescribeYourRole.fill(Role_Description);
    await this.saveChangesBtn.click();
    await expect(this.page.locator('div').filter({ hasText: 'Saved successfully×' }).nth(2)).toBeVisible();

    // Extract years
    const startYear = Start_Date.split('-')[0];
    const endYear = End_Date.split('-')[0];
    const yearRange = `${startYear} – ${endYear}`;

    // --- ACTIVE, CORRECT CONTAINER ---
    const container = this.page.locator("div.grid.grid-cols-3.gap-6.flex-1").filter({
        hasText: Position_Title, // QA Tester
        hasText: Company          // Automation Company
    });

    // --- Assertions inside this container ---
    await expect(container.getByText(Position_Title)).toBeVisible();
    await expect(container.getByText(Company)).toBeVisible();
    await expect(container.getByText(yearRange)).toBeVisible();
    await expect(container.getByText(Role_Description)).toBeVisible();
  }

  async editWorkExperience() {
    const qaTesterRow = this.page.locator("div.grid.grid-cols-3.gap-6.flex-1").filter({
      has: this.page.getByText("QA Tester"),
      }).filter({
      has: this.page.getByText("Automation Company")
    });

    // Make sure only 1 row matched
    await expect(qaTesterRow).toHaveCount(1);

    // Hover the QA Tester row
    await qaTesterRow.hover();
    await this.editNBtnNewlyAddedExp.click();

    // Edit details
    await this.textBoxPositionTitle.fill('QA Tester Edited');
    await this.textBoxCompany.fill('Automation Company Edited');
    await this.textBoxLocation.fill('Camarines Sur Edited, Philippines');
    await this.startDateDropdown.fill('2021-01-01');
    await this.endDateDropdown.fill('2022-01-01');
    await this.textBoxDescribeYourRole.fill('Testing automation for web applications. Edited');
    await this.saveChangesBtn.click();
    await expect(this.page.locator('div').filter({ hasText: 'Saved successfully×' }).nth(2)).toBeVisible();
}
 
  async deleteWorkExperience(Position_Title, Company) {
    const qaTesterRowEdited = this.page.locator("div.grid.grid-cols-3.gap-6.flex-1").filter({
      has: this.page.getByText("QA Tester Edited"),
      }).filter({
      has: this.page.getByText("Automation Company Edited")
    });

      // Make sure only 1 row matched
      await expect(qaTesterRowEdited).toHaveCount(1);

    // Hover the QA Tester row
    await qaTesterRowEdited.hover();
    await this.deleteNewlyAddedExpBtn.click();
    await expect(this.page.getByRole('heading', { name: 'Are you sure?' })).toBeVisible();
    await expect(this.page.getByText('This action cannot be undone.')).toBeVisible();
    await this.cancelBtn.click();
    await this.deleteNewlyAddedExpBtn.click();
    await this.confirmBtn.click();
    await expect(this.page.locator('div').filter({ hasText: 'profile.workExperienceDeleted×' }).nth(2)).toBeVisible(); //need to change this once the issue is fixed
  }

  async addNewEducationBlankFields(Degree, Field_of_Study, Institution){
    await this.addNewItemEducationBtn.click();
    const closeButton = this.page.locator('button[data-headlessui-state] svg');
    await this.page.waitForTimeout(2000);
    await closeButton.click();

    await this.addNewItemEducationBtn.click();
    await this.page.waitForTimeout(2000);
    await this.cancelBtn.click();

    await this.page.waitForTimeout(2000);
    await this.addNewItemEducationBtn.click();
    await expect(this.page.getByRole('heading', { name: 'Add new item' })).toBeVisible();
    await expect(this.saveChangesBtn).toBeDisabled();

    await this.inputDegree.fill(Degree);
    await this.inputFieldOfStudy.fill(Field_of_Study);
    await this.inputInstitution.fill(Institution);
    await this.textBoxLocation.click();
    await this.inputDegree.fill('');
    let errorMessage = this.page.locator('p.text-error-500', {hasText: 'Degree/Qualification is required'});
      await expect(errorMessage).toBeVisible();
    await this.inputFieldOfStudy.fill('');
        errorMessage = this.page.locator('p.text-error-500', {hasText: 'Field of Study is required'});
      await expect(errorMessage).toBeVisible();
      await this.inputInstitution.fill('');
        errorMessage = this.page.locator('p.text-error-500', {hasText: 'Institution is required'});
      await expect(errorMessage).toBeVisible();
  }

  async addedEducationSuccessfully(Degree, Field_of_Study, Institution, Location, Start_Date, End_Date){
    //Add new work experience successfully
    await this.inputDegree.fill(Degree);
    await this.inputFieldOfStudy.fill(Field_of_Study);
    await this.inputInstitution.fill(Institution);
    await this.textBoxLocation.fill(Location);
    await this.startDateDropdown.fill(Start_Date);
    await this.endDateDropdown.fill(End_Date);
    await this.saveChangesBtn.click();
    await expect(this.page.locator('div').filter({ hasText: 'Saved successfully×' }).nth(2)).toBeVisible();

    // Extract years
    const startYear = Start_Date.split('-')[0];
    const endYear = End_Date.split('-')[0];
    const yearRange = `${startYear} – ${endYear}`;

    // --- ACTIVE, CORRECT CONTAINER ---
    const container = this.page.locator('div.group.relative.flex.items-center')
      .filter({ has: this.page.getByText(Degree) })
      .filter({ has: this.page.getByText(Institution) });

    // --- Assertions inside this container ---
    await expect(container.getByText(Degree)).toBeVisible();
    await expect(container.getByText(Institution)).toBeVisible();
    await expect(container.getByText(yearRange)).toBeVisible();
  }

  async editEducation() {
    const container = this.page.locator('div.group.relative.flex.items-center')
      .filter({ has: this.page.getByText("Bachelor of Science") })
      .filter({ has: this.page.getByText("Tech University") });

    // Make sure only 1 row matched
    await expect(container).toHaveCount(1);

    // Hover the QA Tester row
    await container.hover();
    await this.editBtnNewlyAddedEduc.click();

    // Edit details
    await this.inputDegree.fill('Bachelor of Science Edited');
    await this.inputFieldOfStudy.fill('Computer Science Edited');
    await this.inputInstitution.fill('Tech University Edited');
    await this.textBoxLocation.fill('Camarines Sur Edited, Philippines');
    await this.startDateDropdown.fill('2021-01-01');
    await this.endDateDropdown.fill('2022-01-01');
    await this.saveChangesBtn.click();
    await expect(this.page.locator('div').filter({ hasText: 'Saved successfully×' }).nth(2)).toBeVisible();
  }

  async deleteEducation() {
    const container = this.page.locator('div.group.relative.flex.items-center')
      .filter({ has: this.page.getByText("Bachelor of Science Edited") })
      .filter({ has: this.page.getByText("Tech University Edited") });

    // Make sure only 1 row matched
    await expect(container).toHaveCount(1);

    // Hover the QA Tester row
    await container.hover();
    await this.deleteNewlyAddedEducBtn.click();
    // await this.page.waitForTimeout(2000);
    await expect(this.page.getByRole('heading', { name: 'Are you sure?' })).toBeVisible();
    await expect(this.page.getByText('This action cannot be undone.')).toBeVisible();
    await this.cancelBtn.click();
    await this.deleteNewlyAddedEducBtn.click();
    await this.confirmBtn.click();
    await expect(this.page.locator('div').filter({ hasText: 'profile.educationDeleted×' }).nth(2)).toBeVisible();  //need to change this once the issue is fixed
  }
}

