# Implementation Plan

- [x] 1. Create TestSubmissionModal component with basic structure

  - Create new file `src/components/test/test-submission-modal.tsx`
  - Implement component with HeroUI Modal, ModalContent, ModalHeader, ModalBody, ModalFooter
  - Add props interface: isOpen, onClose, testScore, onSubmitSuccess
  - Add basic modal layout with score display section
  - _Requirements: 1.1, 1.3, 1.4, 1.5_

- [x] 2. Implement contact form inputs in TestSubmissionModal

  - Add form state management (formData, isSubmitting, isSubmitted, error)
  - Create Input fields for name, email, and phone with HeroUI Input component
  - Add appropriate icons using @iconify/react (lucide:user, lucide:mail, lucide:phone)
  - Add placeholder text and labels for each field
  - Mark all fields as required
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [x] 3. Add form validation logic to TestSubmissionModal

  - Implement HTML5 validation for required fields
  - Add email format validation
  - Create validation error state and display logic
  - Disable submit button when form is invalid or submitting
  - Display error messages below invalid fields
  - _Requirements: 2.5, 2.6, 2.7_

- [x] 4. Implement score display in modal header

  - Add score display section in ModalHeader with prominent styling
  - Format score as "Your Score: X/100 (Y%)"
  - Use primary color and large font for score
  - Add icon or visual indicator for score
  - _Requirements: 3.4_

- [x] 5. Implement API submission logic in TestSubmissionModal

  - Create handleSubmit function for form submission
  - Make POST request to `/api/leads` endpoint
  - Format payload with name, email, phone, program: "Career Test", and message with score
  - Add phone number formatting (prepend +91 if not present)
  - Handle loading state during submission
  - _Requirements: 4.1, 4.2, 4.3, 4.6_

- [x] 6. Add success and error handling to TestSubmissionModal

  - Implement success state display with checkmark icon and message
  - Add framer-motion animation for success state (fade-in, slide-up)
  - Display success message: "Your results have been submitted successfully"
  - Implement error handling for API failures
  - Display appropriate error messages for different error types
  - Keep modal open on error to allow retry
  - Call onSubmitSuccess callback and close modal after 2-3 seconds on success
  - _Requirements: 4.4, 4.5, 4.7, 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 7. Add score calculation logic to TestPage component

  - Create calculateScore function in TestPage component
  - Implement scoring logic: Never=0, Sometimes=1, Always=2
  - Calculate total points and percentage
  - Return score object with total, percentage, and maxScore
  - Write unit tests for score calculation with different answer combinations
  - _Requirements: 3.1, 3.2, 3.3_

- [x] 8. Integrate TestSubmissionModal into TestPage component

  - Add state for showSubmissionModal and testScore in TestPage
  - Import TestSubmissionModal component
  - Modify submit button click handler to calculate score and open modal
  - Pass testScore prop to TestSubmissionModal
  - Implement handleSubmissionSuccess callback
  - Render TestSubmissionModal with appropriate props
  - _Requirements: 1.1, 3.5_

- [x] 9. Update submit button behavior on last page

  - Modify the "Submit" button logic to call handleSubmit instead of handleNext
  - Ensure button is only enabled when all questions on last page are answered
  - Keep existing button styling and icon
  - _Requirements: 1.1_

- [ ] 10. Add modal close handlers and accessibility features

  - Implement onClose handler to close modal
  - Ensure modal closes on ESC key press (HeroUI default)
  - Ensure modal closes when clicking outside (HeroUI default)
  - Add close button (X) in modal header
  - Verify focus trapping works correctly
  - _Requirements: 1.4, 1.5_

- [x] 11. Implement responsive styling for mobile devices

  - Add responsive modal sizing (500px desktop, 95vw mobile)
  - Ensure form inputs are full-width on mobile
  - Add appropriate padding for different screen sizes
  - Verify touch targets are minimum 44px on mobile
  - Test keyboard behavior on mobile (input field stays visible)
  - Add scrollable content if modal exceeds viewport height
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 12. Display the leads in the admin dashboard

  -display the leads in the admin dashboard lead management page

  - _Requirements: 4.1, 4.2, 4.3_

- [ ] 13. Write integration tests for submission flow

  - Create test file for TestSubmissionModal component
  - Test modal opens when submit is clicked on last page
  - Test form validation prevents submission with invalid data
  - Test successful API submission shows success message
  - Test failed API submission shows error message and allows retry
  - Test modal closes after successful submission
  - _Requirements: All_

- [ ] 14. Test end-to-end user flow

  - Write automated test for complete user journey
  - Test: answer all questions → click submit → modal opens with correct score
  - Test: fill form with valid data → submit → success message → modal closes
  - Test: fill form with invalid data → validation errors shown
  - Test: simulate API error → error message shown → retry works
  - Test: close modal with X button, ESC key, and outside click
  - _Requirements: All_

- [ ] 15. Verify lead data is correctly stored in database
  - Write test to verify POST to /api/leads creates lead record
  - Verify lead contains correct name, email, phone
  - Verify lead has program set to "Career Test"
  - Verify lead message contains score information
  - Verify lead status defaults to "new"
  - _Requirements: 4.1, 4.2, 4.3_
