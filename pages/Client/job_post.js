import { expect } from '@playwright/test';
import links from '../../fixtures/links.json'

export class JobPostPage {
  constructor(page) {
    this.page = page;
    this.page.setDefaultTimeout(50000);

    // -------------------Header / Navigation---------------------
    this.linkDashboard = page.getByRole('link', { name: 'Dashboard' });
    this.linkNewJobDescription = page.getByRole('link', { name: 'New Job Description' });

    // -----------------Chat + Main Interaction--------------------
    this.chatInput = page.getByRole('textbox', { name: 'Chat input' });
    this.btnSend = page.getByRole('button', { name: 'Send' });

    // --------------Continue buttons (various steps)--------------
    this.btnContinue = page.getByRole('button', { name: 'Continue' }).first();

    // ----------------------Results / Matches---------------------
    this.textMatchesFound = page.getByText('matches found');
    this.btnX = page.getByRole('button').filter({ hasText: /^$/ });
    this.btnViewAllMatches = page.getByRole('button', { name: 'View all matches' });

    // ------------------------Page Sections------------------------
    this.btnContinueRecruiting = page.getByRole('button', { name: 'Continue Recruiting' }).first()
    this.createdMeeting = page.getByRole('button', { name: 'QA Call - 60mins 15 min' });

    this.btnSaveForMeeting = page.getByTestId('update-eventtype');
    this.btnCancel = page.getByRole('button', { name: 'Cancel' });
    this.LearnMore1link = this.page.getByRole('link', { name: 'Learn more' }).first();
  }

  // EDIT JOB DESCRIPTION
  async editJobDescription() {
    const jobDescription = 'A QA Automation Engineer is responsible for designing, developing, and executing automated tests. ' +
                           'They work closely with developers and QA teams to identify scenarios, build automation frameworks, and improve testing efficiency.';
    const btnHideDetails = this.page.getByRole('button', { name: 'Hide details' });
    const btnViewDeatils = this.page.getByRole('button', { name: 'View details' });
    const btnBackDashboard = this.page.getByRole('button', { name: '← Dashboard' });
    const heading = this.page.getByRole('heading', { name: 'QA Automation Engineer' });
    const jobStatus = this.page.getByText('Actively Recruiting');
    const sections = ['BUDGET', 'AVAILABILITY', 'JOB DESCRIPTION', 'MEETING TYPES', 'SKILLS', 'EXPERIENCE', 'REMOTE WORK'];
    const btnEditJD = this.page.getByRole('button', { name: 'Edit JD' });
    const btnDiscard = this.page.getByRole('button', { name: 'Discard' });
    const inputBudget = this.page.getByPlaceholder('Enter the maximum daily rate');
    const checkboxAvailableNow = this.page.getByRole('checkbox').first();
    const btnMore = this.page.getByRole('button', { name: 'more' });
    const inputSkills = this.page.getByRole('textbox', { name: 'Enter skills - Press Enter to' });
    const inputExperience = this.page.getByRole('textbox', { name: 'Enter relevant work experience' });
    const inputCity = this.page.getByRole('textbox', { name: 'Enter your city' });
    const inputCountry = this.page.getByRole('textbox', { name: 'Enter your country' });
    const inputLanguage = this.page.getByRole('textbox', { name: 'Enter language codes (e.g.,' });
    const checkboxRemoteWork = this.page.getByRole('checkbox').nth(1);
    const btnSaveChanges = this.page.getByRole('button', { name: 'Save Changes' });
    const successfulMessage = this.page.getByText('Job description saved successfully');

    await this.linkNewJobDescription.click();
    await this.chatInput.fill(jobDescription);
    await this.btnSend.click();
    await this.textMatchesFound.click();
    await this.btnViewAllMatches.click();

    await btnHideDetails.click();
    await btnViewDeatils.click();

    await btnBackDashboard.click();
    await this.btnContinueRecruiting.click();

    // Verify Job Page
    await expect(heading).toBeVisible();
    await expect(jobStatus).toBeVisible();

    for (const sec of sections) {
      await expect(this.page.getByRole('heading', { name: sec })).toBeVisible();
    }

    // Edit JD
    await btnEditJD.click();
    await btnDiscard.click();
    await btnEditJD.click();

    await inputBudget.fill('200');

    await checkboxAvailableNow.uncheck();
    await checkboxAvailableNow.check();

    // Skills
    await btnMore.click();
    await inputSkills.fill('API skills');
    await inputSkills.press('Enter');

    // Experience
    await inputExperience.fill('API Testing');
    await inputExperience.press('Enter');

    // Location
    await inputCity.fill('Naga City');
    await inputCity.press('Enter');

    await inputCountry.fill('PH');
    await inputCountry.press('Enter');

    // Language
    await inputLanguage.fill('EN');
    await inputLanguage.press('Enter');

    // Checkbox
    await checkboxRemoteWork.uncheck();
    await checkboxRemoteWork.check();

    await btnSaveChanges.click();
    await expect(successfulMessage).toBeVisible();
  }

  async interviewSlot() {
    // DEFINE LOCATORS
    const btnInterviewSlot = this.page.getByRole('button', { name: 'Interview slots' });
    const heading = this.page.getByRole('heading', { name: 'Set your interview availability' });
    const timezoneDropdown = this.page.getByTestId('timezone-select');
    const manilaOption = this.page.getByTestId('select-option-Asia/Manila');
    const timeZoneSelect = this.page.getByRole('combobox', { name: 'Timezone Select' });
    const title = this.page.getByTestId('availablity-title');
    const toggleFriday = this.page.getByTestId('Friday-switch');
    const toggleThurs = this.page.getByTestId('Thursday-switch');
    const monday = this.page.getByTestId('Monday');
    const mondayStartInput = monday.locator('input[id^="react-select"]').first();
    const firstOption = this.page.locator('[id^="react-select"][id$="-option-0"]');
    const mondayEndInput = monday.locator('input[id^="react-select"]').nth(1);
    const secondOption = this.page.locator('[id^="react-select"][id$="-option-1"]');
    const addTimeAvailabilityButton = monday.getByTestId('add-time-availability');
    const copyButton = monday.getByTestId('copy-button');
    // const btnCancel = this.page.getByRole('button', { name: 'Cancel' });
    const wednesdayTab = monday.getByText('Wednesday');
    const btnApply = this.page.getByRole('button', { name: 'Apply' });
    const toggleTitleSAD = this.page.getByText('Set as Default');
    const headingDateOverrides = this.page.getByRole('heading', { name: 'Date overrides' });
    const subTexts = this.page.getByText('Add dates when your availability changes from your daily hours.');
    const btnAddOverride = this.page.getByTestId('add-override');
    const btnClose = this.page.getByTestId('dialog-rejection');
    const btnToday = this.page.getByRole('button', { name: 'today' });
    const toggleMarkUnavailable = this.page.getByTestId('date-override-mark-unavailable');
    const plusAddNewTimeSlot = this.page.getByTestId('dialog-creation').getByTestId('add-time-availability');
    const btnSaveOverride = this.page.getByTestId('add-override-submit-btn');
    const btnEdit = this.page.locator('button[tooltip="Edit"]').nth(0);
    const btnDelte = this.page.getByTestId('delete-button').first();
    const btnSave = this.page.getByRole('button', { name: 'Save' });

    // Open interview slot modal
    await this.btnContinueRecruiting.click();
    await btnInterviewSlot.click();
    await expect(heading).toBeVisible();

    // --- TIMEZONE ---
    await timezoneDropdown.scrollIntoViewIfNeeded();
    await timezoneDropdown.waitFor({ state: 'visible' });
    await timezoneDropdown.click();

    // Pick your timezone
    await timeZoneSelect.fill('manila');
    await manilaOption.click();

    // Rename Availability Title
    await title.click();
    await title.press('ControlOrMeta+a');
    await title.fill('QA Availability');

    await expect(toggleTitleSAD).toBeVisible();

    // Disable Thursday & Friday
    await toggleFriday.click();
    await toggleThurs.click();

    // Monday Start Time
    await mondayStartInput.click();
    await firstOption.click();

    // Monday End Time
    await mondayEndInput.click();
    await secondOption.click();

    // Add additional availability row
    await addTimeAvailabilityButton.click();

    // Copy Monday schedule
    await copyButton.click();

    // Close copy dialog
    await this.btnCancel.click();

    // Copy again to Wednesday
    await copyButton.click();
    await wednesdayTab.click();

    // Apply copy
    await btnApply.click();

    // await this.page.getByRole('button').nth(4).click();
    await expect(headingDateOverrides).toBeVisible();
    await expect(subTexts).toBeVisible();
    await btnAddOverride.click();
    await btnClose.click();

    await btnAddOverride.click();
    await btnToday.click();
    await toggleMarkUnavailable.click();
    await toggleMarkUnavailable.click();
    await plusAddNewTimeSlot.click();
    await btnSaveOverride.click({timeout:30000});
    await btnClose.click();

    await btnEdit.click();
    await toggleMarkUnavailable.click();
    await btnSaveOverride.click();
    await btnDelte.click();
    await btnSave.click();
  }

  async meetingTypesBasic() {
    let validationMsg;
    const plusCreateNewMeetingType = this.page.getByRole('button', { name: 'Create new meeting type' });
    const btnX = this.page.getByRole('button').filter({ hasText: /^$/ }).nth(1);
    const heading = this.page.getByRole('heading', { name: 'Meeting settings' })
    const toggleHideFromProfile = this.page.getByRole('switch').first();
    const statusHiddenText = this.page.getByText('Hidden');
    const tabBasics = this.page.getByTestId('vertical-tab-basics');
    const inputTitle = this.page.getByTestId('event-title');
    const inputSlug = this.page.getByTestId('event-slug');
    const inputDuration = this.page.getByTestId('duration');
    const textBoxDescription = this.page.getByRole('textbox', { name: 'A quick video meeting.' });
    const createdBasicMeeting = this.page.getByRole('button', { name: 'QA Call - 60mins 60 min' });
    const textAllowMultipleDurations = this.page.getByText('Allow multiple durations');
    const toggleAllowMultipleDurations = this.page.locator('#event-type-form').getByRole('switch');
    const option15mins = this.page.getByText('15 mins', { exact: true });
    const plusAddaLocation = this.page.getByTestId('add-location');
    const dropdownPanel = this.page.locator('div[id^="react-select"][id$="-listbox"]');
    const expectedOptions = [
    "Cal Video (Default)",
    "In Person (Attendee Address)",
    "In Person (Organizer Address)",
    "Custom attendee location",
    "Link meeting",
    "Attendee Phone Number",
    "Organizer Phone Number"
    ];
    const optionCustomAttendeeLocation = dropdownPanel.getByText("Custom attendee location", { exact: false });

    await this.btnContinueRecruiting.first().click();
    await plusCreateNewMeetingType.click();
    await btnX.click();
    await plusCreateNewMeetingType.click();
    await expect(heading).toBeVisible();
    await toggleHideFromProfile.click();
    await expect(statusHiddenText).toBeVisible();
    await toggleHideFromProfile.click();
    await tabBasics.click();

    await inputTitle.fill('');
    await this.btnSaveForMeeting.click();
    validationMsg = await inputTitle.evaluate(el => el.validationMessage);
    expect(validationMsg).toContain('Please fill out this field');

    await inputTitle.fill('QA Call - 60mins');
    await inputSlug.fill('');
    await this.btnSaveForMeeting.click();
    validationMsg = await inputSlug.evaluate(el => el.validationMessage);
    expect(validationMsg).toContain('Please fill out this field');

    const randomSlug = Math.random().toString(36).substring(2, 10); // random a-z0-9
    const finalSlug = `slug-meeting-${randomSlug}`;
    await inputSlug.fill(finalSlug);
    await inputDuration.fill('');
    await this.btnSaveForMeeting.click();
    validationMsg = await inputDuration.evaluate(el => el.validationMessage);
    expect(validationMsg).toContain('Please fill out this field');
    await inputDuration.fill('60', { timeout: 5000 });

    // POSITIVE SCENARIO
    await textBoxDescription.fill('QA Call Description test');
    await this.btnSaveForMeeting.click();
    await createdBasicMeeting.click();

    // Allow multiple durations
    await expect(textAllowMultipleDurations).toBeVisible();
    await toggleAllowMultipleDurations.click();

    // Click the correct "Available durations" dropdown
    await this.page
      .locator('text=Available durations')   // find the section label
      .locator('..')                         // go to parent element
      .getByTestId('select-control')         // pick the dropdown inside it
      .click();

    // Select a duration option
    await option15mins.click();

    // Open the dropdown
    await plusAddaLocation.click();

    // Wait for React-Select listbox to appear
    await expect(dropdownPanel).toBeVisible();

    // All visible options
    // const options = dropdownPanel.locator('div.css-roynbj');
    // const optionCount = await options.count();
    // console.log(`Found ${optionCount} options:`);
    // for (let i = 0; i < optionCount; i++) {
    //   const txt = await options.nth(i).innerText();
    //   console.log(`Option ${i+1}: ${txt}`);
    // }

    // Validate
    for (const text of expectedOptions) {
      await expect(dropdownPanel.getByText(text, { exact: false })).toBeVisible();
    }

    // Select an option
    await optionCustomAttendeeLocation.click();
    await this.btnSaveForMeeting.click();
  }

  async meetingTypesAvailability(){
    const tabAvailability = this.page.getByTestId('vertical-tab-availability');
    const availabilityDropdown = this.page.getByTestId('select-control');
    const optionFromAvailability = this.page.locator('#react-select-6-option-0').getByText('QA Availability');
    const availability = this.page.getByText('Monday12:00 AM-12:30 AM12:30 AM-1:30 AMTuesday7:15 AM-3:15 PMWednesday12:00 AM-');
    const timezone = this.page.getByText('Asia/Manila');
    
    await this.btnContinueRecruiting.click();
    await this.createdMeeting.click();
    await tabAvailability.click();
    
    // Click dropdown and then the option
    await availabilityDropdown.click();
    await optionFromAvailability.click();
    await expect(availability).toBeVisible();
    await expect(timezone).toBeVisible();
  }

  async meetingTypesLimits2() {
   const tabLimits = this.page.getByTestId('vertical-tab-event_limit_tab_title');
    const beforeEventDropdown = this.page
        .getByText('Before event', { exact: true })
        .locator('..')
        .locator('[data-testid="select-control"]');
    const afterEventDropdown = this.page
        .getByText('After event', { exact: true })
        .locator('..')
        .locator('[data-testid="select-control"]');
    const option5miniutes = this.page.getByTestId('select-option-5');
    const minimumNoticeDropdown = this.page.locator('div').filter({ hasText: /^Hours$/ }).nth(2);
    const optionMinutes = this.page.getByTestId('select-option-minutes');
    const optionHours = this.page.getByTestId('select-option-hours');
    const optionDays = this.page.getByTestId('select-option-days');
    const timeSlotIntervalsDropdown = this.page.locator('div').filter({ hasText: /^Use event length \(default\)$/ }).nth(1);
    const option45minutes = this.page.getByTestId('select-option-45');
    const cardLimitBookingFrequency = this.page.locator('div').filter({ hasText: /^Limit booking frequencyLimit how many times this event can be booked\. Learn more$/ }).nth(1);
    // const LearnMore1link = this.page.getByRole('link', { name: 'Learn more' }).first();
    const toggleLimitBookingFrequency = this.page.getByRole('group').filter({ hasText: 'Limit booking frequencyLimit' }).getByRole('switch');
    const limitBookingFrequencyField = this.page.getByPlaceholder('1');
    const dropdownLimitBookingFrequency = this.page.locator('div').filter({ hasText: /^Per day$/ }).nth(2);
    const optionPerWeek = this.page.getByTestId('select-option-PER_WEEK');
    const optionPerMonth = this.page.getByTestId('select-option-PER_MONTH');
    const optionPeryear = this.page.getByTestId('select-option-PER_YEAR');
    const btnAddLimit = this.page.getByRole('button', { name: 'Add Limit' });
    const btnDeleteLBF = this.page.getByRole('button').filter({ hasText: /^$/ }).nth(3);
    const cardText = this.page.getByText('Only show the first slot of each day as available');
    const cardText2 = this.page.getByText('This will limit your availability for this event type to one slot per day, scheduled at the earliest available time.');
    const toggleOnlyShowTheFirstSlot = this.page.getByRole('group').filter({ hasText: 'Only show the first slot of' }).getByRole('switch');
    const cardText3 = this.page.getByText('Limit total booking duration');
    const cardText4 = this.page.getByText('Limit total amount of time that this event can be booked');
    const toggleLimitTotalBookingDuration = this.page.getByRole('group').filter({ hasText: 'Limit total booking' }).getByRole('switch');
    const minutesField = this.page.getByTestId('input-field');
    const dropdownLimitTotalBookingDuration = this.page.getByTestId('add-limit').getByText('Per day');
    const btnAddLimit2 = this.page.getByRole('button', { name: 'Add Limit' }).nth(1);
    const learnMore2 = this.page.getByRole('link', { name: 'Learn more' }).nth(1);
    const cardText5 = this.page.getByText('Limit number of upcoming bookings per booker');
    const cardText6 = this.page.getByText('Limit the number of active bookings a booker can make for this event type.');
    const toggleLimitNumberofUpcomingBookings = this.page.getByRole('group').filter({ hasText: 'Limit number of upcoming' }).getByRole('switch');
    const bookingLimitInput = this.page.getByTestId('booker-booking-limit-input');
    const checkBoxOfferToSchedule = this.page.getByRole('checkbox', { name: 'Offer to reschedule the last' });
    const daysDropdown = this.page.locator('div').filter({ hasText: /^business days$/ }).nth(1);
    const optionBusinessDays = this.page.getByTestId('select-option-0');
    const optionCalendarDays = this.page.getByTestId('select-option-1');
    const fieldPeriodDays = this.page.getByRole('spinbutton', { name: 'periodDays' });
    const toggleLimitFutureBooking = this.page.getByRole('group').filter({ hasText: 'Limit future bookingsLimit' }).getByRole('switch');
    const textIntoTheFuture = this.page.getByText('into the future');
    const cardText7 = this.page.getByText('Limit future bookings');
    const cardText8 = this.page.getByText('Limit how far in the future this event can be booked.');
    const learnMore3 = this.page.getByRole('link', { name: 'Learn more' }).nth(2);
    const checkBoxAlways30DaysAvail = this.page.getByText('Always 20 days available');
    const radioBtnDateRange = this.page.locator('#RANGE');

    // Open Limits tab
    await expect(this.btnContinueRecruiting).toBeVisible();
    await this.btnContinueRecruiting.click();

    await expect(this.createdMeeting).toBeVisible();
    await this.createdMeeting.click();

    await this.page.waitForLoadState('networkidle'); // important!
    await expect(tabLimits).toBeVisible();
    await tabLimits.click();


    // BEFORE EVENT → 5 minutes
    await beforeEventDropdown.click();
    await option5miniutes.click();

    // AFTER EVENT → 5 minutes
    await afterEventDropdown.click();
    await option5miniutes.click();

    await this.page.getByPlaceholder('0').fill('8');

    await minimumNoticeDropdown.click();
    await expect(optionMinutes).toBeVisible();
    await expect(optionHours).toBeVisible();
    await expect(optionDays).toBeVisible();
    await optionMinutes.click();

    await timeSlotIntervalsDropdown.click();
    await option45minutes.click();

    // LIMIT BOOKING FREQUENCY
    await expect(cardLimitBookingFrequency).toBeVisible();
    await this.LearnMore1link.click();
    const newTabPromise = this.page.context().waitForEvent('page');
    const calTab = await newTabPromise;
    // Assert URL
    await expect(calTab).toHaveURL(links.bookFrequencyURL);;
    // Close the new tab
    await calTab.close();
  
    await toggleLimitBookingFrequency.click();
    await limitBookingFrequencyField.fill('5');
    await dropdownLimitBookingFrequency.click();
    await expect(optionPerWeek).toBeVisible();
    await expect(optionPerMonth).toBeVisible();
    await expect(optionPeryear).toBeVisible();
    await optionPeryear.click();

    await btnAddLimit.click();
    await btnDeleteLBF.click();

    // ONLY SHOW THE FIRST SLOT OF EACH DAY AS AVAILABLE
    await expect(cardText).toBeVisible();
    await expect(cardText2).toBeVisible();
    await toggleOnlyShowTheFirstSlot.click();

    // LIMIT TOTAL BOOKING DURATION
    await expect(cardText3).toBeVisible();
    await expect(cardText4).toBeVisible();

    await toggleLimitTotalBookingDuration.click();
    await minutesField.fill('75');
    await dropdownLimitTotalBookingDuration.click();
    await optionPerMonth.click();
    await btnAddLimit2.click();
    await btnDeleteLBF.click();
    
    // LIMIT NUMBER OF UPCOMING BOOKINGS PER BOOKER
    await expect(cardText5).toBeVisible();
    await expect(cardText6).toBeVisible();
    await learnMore2.click();

    const newTabPromise2 = this.page.context().waitForEvent('page');
    const calTab2 = await newTabPromise2;
    // Assert URL
    await expect(calTab2).toHaveURL(links.BookingLimitURL);;
    // Close the new tab
    await calTab2.close();

    await toggleLimitNumberofUpcomingBookings.click();
    await bookingLimitInput.fill('10');
    await checkBoxOfferToSchedule.check();

    // LIMIT FUTURE BOOKINGS
    await expect(cardText7).toBeVisible();
    await expect(cardText8).toBeVisible();

    await learnMore3.click();
    const newTabPromise3 = this.page.context().waitForEvent('page');
    const calTab3 = await newTabPromise3;
    // Assert URL
    await expect(calTab3).toHaveURL(links.LimitFutureBookingURL);;
    // Close the new tab
    await calTab3.close();

    await toggleLimitFutureBooking.click();
    await fieldPeriodDays.fill('20');
    await expect(textIntoTheFuture).toBeVisible();
    await daysDropdown.click();
    await expect(optionBusinessDays).toBeVisible();
    await expect(optionCalendarDays).toBeVisible();
    await optionCalendarDays.click();

    await checkBoxAlways30DaysAvail.click();
    await radioBtnDateRange.click();

    await this.btnSaveForMeeting.scrollIntoViewIfNeeded();
    await this.btnSaveForMeeting.click();

    await this.createdMeeting.click();
    await tabLimits.click();
    await toggleLimitBookingFrequency.click();
    await toggleOnlyShowTheFirstSlot.click();
    await toggleLimitTotalBookingDuration.click();
    await toggleLimitNumberofUpcomingBookings.click();
    await toggleLimitFutureBooking.click();
    await this.btnSaveForMeeting.scrollIntoViewIfNeeded();
    await this.btnSaveForMeeting.click();
  }

  async meetingTypesAdvance() {
    const tabAdavance = this.page.getByTestId('vertical-tab-event_advanced_tab_title');
    const editbtn = this.page.getByRole('button', { name: 'edit custom name' });
    const heading = this.page.getByRole('heading', { name: 'Custom event name' })
    const subTitle = this.page.getByText('Create customised event names to display on calendar event');
    const eventNameInput = this.page.getByRole('textbox', { name: 'Calendar event name' });
    const textAvailableVAriables = this.page.getByText('Available variables');
    const expectedVariables = [
        '{Event type title}',
        '{Event duration}',
        '{Organiser}',
        '{Organiser first name}',
        '{Scheduler}',
        '{Scheduler first name}',
        '{Location}',
        'Booking question response variables',
        '{name}',
        '{email}',
        '{attendeePhoneNumber}',
        '{location}',
        '{title}',
        '{notes}',
        '{guests}',
        '{rescheduleReason}'
    ];
    const titlePreview = this.page.getByText('Preview');
    const card = this.page.locator('[data-testid="dialog-creation"]').locator('div').nth(1);
    const cardText = this.page.getByText('QA Call for Automation - between Automation Company and Scheduler', { exact: false });
    const btnCreate = this.page.getByRole('button', { name: 'Create' });
    const dropdownAddToCalendar = this.page.locator('.text-emphasis.css-n9qnu9');
    const firstOption = this.page.getByTestId('select-option--1');
    const displayText = this.page.getByText('We\'ll display this email address as the organizer, and send confirmation emails here.');
    const borderTitle = this.page.getByText('Booking questionsCustomize the questions asked on the booking page.');
    const editFieldButtons = this.page.getByTestId('edit-field-action');
    const titleConfirmation = this.page.getByText('Confirmation', { exact: true });
    const subTitles = this.page.getByText('What your booker should provide to receive confirmations');
    const toggleEmail = this.page.getByTestId('toggle-group-item-email');
    const titleQuestions = this.page.getByText('Questions', { exact: true });
    const subTitle2 = this.page.getByText('All the info your booker should provide before booking with you.');
    const listYourName = this.page.getByText('Your nameRequiredName');
    const arrowDown = this.page.getByTestId('field-name').getByRole('button').filter({ hasText: /^$/ });
    const arrowUp = this.page.getByRole('button').filter({ hasText: /^$/ }).nth(4);
    const heading2 = this.page.getByRole('heading', { name: 'Add a question' });
    const subTitle3 = this.page.getByText('Customize the questions asked on the booking page.');
    const inputTypeDropdown = modal.getByRole('combobox');
    const splitToggle = modal.getByRole('switch', { name: /Split "Full name" into "First name" and "Last name"/i });

    await this.btnContinueRecruiting.click();
    await this.createdMeeting.click();

    await tabAdavance.click();
    await editbtn.click();
    await this.btnCancel.click();
    await editbtn.click();

    await expect(heading).toBeVisible();
    await expect(subTitle).toBeVisible();

    await eventNameInput.fill('QA Call for Automation - between Automation Company and Scheduler');
    await expect(textAvailableVAriables).toBeVisible();

    // const expectedVariables = [
    //     '{Event type title}',
    //     '{Event duration}',
    //     '{Organiser}',
    //     '{Organiser first name}',
    //     '{Scheduler}',
    //     '{Scheduler first name}',
    //     '{Location}',
    // ];

    for (const variable of expectedVariables) {
        await expect(this.page.getByText(variable, { exact: true })).toBeVisible();
    }

    // Verify preview section
    await expect(titlePreview).toBeVisible();

    // Check that preview box is displayed (fallback selector)
    await expect(card).toBeVisible();

    // Optional: Verify sample preview text appears
    await expect(cardText).toBeVisible();
    await btnCreate.click();

    await dropdownAddToCalendar.click();
    await firstOption.click();
    await expect(displayText).toBeVisible();

    await expect(borderTitle).toBeVisible();
    await this.LearnMore1link.click();
    const newTabPromise = this.page.context().waitForEvent('page');
    const calTab = await newTabPromise;
    // Assert URL
    await expect(calTab).toHaveURL(links.bookingQuestionsURL);;
    // Close the new tab
    await calTab.close();


    await expect(titleConfirmation).toBeVisible();
    await expect(subTitles).toBeVisible();
    await toggleEmail.click();
    await expect(titleQuestions).toBeVisible();
    await expect(subTitle2).toBeVisible();
    await expect(listYourName).toBeVisible();
    await listYourName.hover();
    await arrowDown.click();
    await arrowUp.click();

    await editFieldButtons.nth(0).click(); // Your name
    await expect(heading2).toBeVisible();
    await expect(subTitle3).toBeVisible();

    // Input type dropdown
    await expect(inputTypeDropdown).toBeVisible();
    await expect(inputTypeDropdown).toHaveValue(/Name/i);
    await splitToggle.click();
  }
} 