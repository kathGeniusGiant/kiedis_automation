import { test } from '@playwright/test';
import { SigninPage } from '../pages/signin.js';
import { ProfilePage } from '../pages/profile.js';

const TEST_EMAIL = 'qaautomation@yopmail.com';
const TEST_PASSWORD = 'Test@123';
const Position_Title = 'QA Tester';
const Company = 'Automation Company';
const Location = 'Camarines Sur, Philippines';
const Start_Date = '2022-01-01';
const End_Date = '2023-01-01';
const Role_Description = 'Testing automation for web applications.';
const Degree = 'Bachelor of Science';
const Field_of_Study = 'Computer Science';
const Institution = 'Tech University';
const skillName = 'JavaScript';
const proficiency = 'Expert';

test.describe('Profile page', () => {

  let signin;
	let profile;

  test.beforeEach(async ({ page }) => {
      signin = new SigninPage(page);
      profile = new ProfilePage(page);
      await page.setViewportSize({ width: 1370, height: 735 });
      await signin.gotoLandingPage();
      // Sign in with a reusable test account
      await signin.signin(TEST_EMAIL, TEST_PASSWORD);
      await profile.gotoProfilePage();
  });

  test('Validate profile page sections', async ({ page }) => {
    // Validate header
    await profile.assertHeader();
    // Validate Overview tab section
    await profile.assertOverviewtab();
  });

  test('Edit Profile - upload image profile and empty input validations', async ({ page }) => {
    await profile.uploadImage();
    await profile.editProfileEmptyInput();
  });

  test('Edit Profile details successfully', async ({ page }) => {
    await profile.editDetails();
  });

  test('About Section - edit about', async ({ page }) => {
    await profile.editAbout();
  });

  test('Skill Section - add, edit, and delete skill', async ({ page }) => {
    await profile.skillSection(skillName, proficiency);
  });

  test('Language Section - add and delete language', async ({ page }) => {
    await profile.addLanguage();
  });

  test('Work Experience Section - empty input, add, edit, and delete work experience', async ({ page }) => {
    await profile.workExperienceEmptyInput(Position_Title, Company);
    await profile.addedWorkExperienceSuccessfully(Position_Title, Company, Location, Start_Date, End_Date, Role_Description);
    await profile.editWorkExperience();
    await profile.deleteWorkExperience();
  });

  test('Education Section - empty input, add, edit, and delete education', async ({ page }) => {
    await profile.addNewEducationBlankFields(Degree, Field_of_Study, Institution);
    await profile.addedEducationSuccessfully(Degree, Field_of_Study, Institution, Location, Start_Date, End_Date);
    await profile.editEducation();
    await profile.deleteEducation();
  });

});