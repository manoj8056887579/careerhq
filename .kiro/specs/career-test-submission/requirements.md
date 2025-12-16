# Requirements Document

## Introduction

This feature adds a submission flow to the existing career test functionality. When a user completes all 50 questions in the career profiling test and clicks the "Submit" button, a modal will appear to collect their contact information (name, email, phone number) along with their test results. This data will be sent to the existing leads API endpoint to capture potential student leads for follow-up.

The feature integrates with the existing test infrastructure and leads API, providing a seamless way to convert test-takers into qualified leads while giving them their test results.

## Requirements

### Requirement 1: Modal Display on Test Completion

**User Story:** As a user who has completed the career test, I want to see a modal form when I click submit, so that I can provide my contact information to receive my results.

#### Acceptance Criteria

1. WHEN the user is on the last page of the test (page 10 of 10) AND all questions on that page are answered AND the user clicks the "Submit" button THEN the system SHALL display a modal overlay with a contact information form
2. WHEN the modal is displayed THEN the system SHALL prevent interaction with the underlying test page content
3. WHEN the modal is displayed THEN the system SHALL show a clear heading indicating the purpose (e.g., "Get Your Career Test Results")
4. WHEN the modal is displayed THEN the system SHALL include a close button or dismiss option
5. IF the user clicks outside the modal or presses the escape key THEN the system SHALL close the modal without submitting data

### Requirement 2: Contact Information Form Fields

**User Story:** As a user submitting my test results, I want to enter my name, email, and phone number in a clear form, so that I can receive my career test results and be contacted for guidance.

#### Acceptance Criteria

1. WHEN the submission modal is displayed THEN the system SHALL show an input field for "Full Name" with appropriate placeholder text
2. WHEN the submission modal is displayed THEN the system SHALL show an input field for "Email" with email validation
3. WHEN the submission modal is displayed THEN the system SHALL show an input field for "Phone Number" with appropriate formatting
4. WHEN the submission modal is displayed THEN the system SHALL mark all three fields (name, email, phone) as required
5. IF the user attempts to submit with empty required fields THEN the system SHALL display validation error messages for each missing field
6. IF the user enters an invalid email format THEN the system SHALL display an error message indicating the email format is invalid
7. WHEN all required fields are filled with valid data THEN the system SHALL enable the submit button

### Requirement 3: Test Score Calculation and Display

**User Story:** As a user completing the career test, I want to see my test score included in the submission, so that I understand my performance and the counselors have context for follow-up.

#### Acceptance Criteria

1. WHEN the user completes all test questions THEN the system SHALL calculate a test score based on the answers provided
2. WHEN calculating the score THEN the system SHALL assign point values: "Never" = 0 points, "Sometimes" = 1 point, "Always" = 2 points
3. WHEN calculating the score THEN the system SHALL sum all points and calculate a percentage (total points / maximum possible points \* 100)
4. WHEN the submission modal is displayed THEN the system SHALL show the calculated test score prominently in the modal
5. WHEN the form is submitted THEN the system SHALL include the test score in the data sent to the leads API

### Requirement 4: Data Submission to Leads API

**User Story:** As a system administrator, I want test submissions to be sent to the existing leads API, so that our sales team can follow up with potential students who have completed the career test.

#### Acceptance Criteria

1. WHEN the user clicks the submit button in the modal with valid form data THEN the system SHALL send a POST request to the `/api/leads` endpoint
2. WHEN submitting to the leads API THEN the system SHALL include the following fields: name, email, phone, and test score
3. WHEN submitting to the leads API THEN the system SHALL include a source identifier indicating "career-test" or similar
4. IF the API request is successful (200/201 response) THEN the system SHALL display a success message to the user
5. IF the API request fails (4xx/5xx response) THEN the system SHALL display an error message indicating the submission failed
6. WHEN the API request is in progress THEN the system SHALL disable the submit button and show a loading indicator
7. WHEN a successful submission occurs THEN the system SHALL close the modal after showing the success message

### Requirement 5: User Experience and Feedback

**User Story:** As a user submitting my career test, I want clear feedback about the submission process, so that I know whether my information was successfully submitted.

#### Acceptance Criteria

1. WHEN the user clicks submit with valid data THEN the system SHALL show a loading state on the submit button
2. WHEN the submission is successful THEN the system SHALL display a success message for at least 2 seconds before closing the modal
3. WHEN the submission is successful THEN the system SHALL show a confirmation message indicating "Your results have been submitted successfully"
4. IF the submission fails THEN the system SHALL keep the modal open and display an error message
5. IF the submission fails THEN the system SHALL allow the user to retry submission without re-entering their information
6. WHEN the modal is closed after successful submission THEN the system SHALL reset the test state or redirect to a thank you page

### Requirement 6: Mobile Responsiveness

**User Story:** As a mobile user taking the career test, I want the submission modal to work properly on my device, so that I can complete the test and submit my information easily.

#### Acceptance Criteria

1. WHEN the modal is displayed on mobile devices (screen width < 768px) THEN the system SHALL render the modal at full width with appropriate padding
2. WHEN the modal is displayed on mobile devices THEN the system SHALL ensure all form fields are easily tappable (minimum 44px touch target)
3. WHEN the user opens the keyboard on mobile THEN the system SHALL ensure the active input field remains visible
4. WHEN the modal is displayed on any screen size THEN the system SHALL ensure the content is scrollable if it exceeds viewport height
5. WHEN the modal is displayed THEN the system SHALL maintain consistent styling with the existing test page design
