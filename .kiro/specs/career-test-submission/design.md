# Design Document

## Overview

This feature extends the existing career test functionality by adding a submission modal that captures user contact information and test results. When users complete all 50 questions and click "Submit", a modal will appear using the HeroUI Modal component, collecting name, email, phone number, and displaying their calculated test score. The data will be submitted to the existing `/api/leads` endpoint.

The design leverages existing patterns from the codebase, including the HeroUI component library, the existing Lead model structure, and form submission patterns similar to the EnquiryForm component.

## Architecture

### Component Structure

```
TestPage (existing)
├── Test Questions Display (existing)
├── Navigation Controls (existing)
└── TestSubmissionModal (new)
    ├── Modal Header with Score Display
    ├── Contact Form
    │   ├── Name Input
    │   ├── Email Input
    │   └── Phone Input
    ├── Submit Button with Loading State
    └── Success/Error Feedback
```

### Data Flow

1. User completes all test questions → answers stored in TestPage state
2. User clicks "Submit" on last page → trigger score calculation
3. Score calculated → modal opens with score displayed
4. User fills contact form → form validation
5. User submits form → POST to `/api/leads` with contact info + score
6. API response → show success/error message
7. Success → close modal after delay, optionally reset test or redirect

### State Management

The TestPage component will manage:

- `answers`: Record<number, string> (existing)
- `showSubmissionModal`: boolean (new)
- `testScore`: { total: number, percentage: number } | null (new)

The TestSubmissionModal component will manage:

- `formData`: { name: string, email: string, phone: string }
- `isSubmitting`: boolean
- `isSubmitted`: boolean
- `error`: string | null

## Components and Interfaces

### 1. TestSubmissionModal Component

**Location:** `src/components/test/test-submission-modal.tsx`

**Props Interface:**

```typescript
interface TestSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  testScore: {
    total: number;
    percentage: number;
    maxScore: number;
  };
  onSubmitSuccess?: () => void;
}
```

**Key Features:**

- Uses HeroUI Modal, ModalContent, ModalHeader, ModalBody, ModalFooter
- Form inputs using HeroUI Input component with icons
- Validation using HTML5 form validation + custom logic
- Loading states using HeroUI Button isLoading prop
- Success animation using framer-motion (similar to EnquiryForm)

### 2. Modified TestPage Component

**Location:** `src/components/test/test-page.tsx`

**New Functions:**

```typescript
// Calculate test score from answers
const calculateScore = (): {
  total: number;
  percentage: number;
  maxScore: number;
} => {
  const scoreMap = { Never: 0, Sometimes: 1, Always: 2 };
  const total = Object.values(answers).reduce(
    (sum, answer) => sum + (scoreMap[answer as keyof typeof scoreMap] || 0),
    0
  );
  const maxScore = questions.length * 2;
  const percentage = Math.round((total / maxScore) * 100);
  return { total, percentage, maxScore };
};

// Handle submit button click
const handleSubmit = () => {
  const score = calculateScore();
  setTestScore(score);
  setShowSubmissionModal(true);
};

// Handle successful submission
const handleSubmissionSuccess = () => {
  setShowSubmissionModal(false);
  // Optional: Reset test or redirect
  // setAnswers({});
  // setCurrentPage(1);
};
```

**Modified Submit Button Logic:**

- When on last page and all questions answered, clicking "Submit" calls `handleSubmit()`
- Opens modal instead of just moving to next page

### 3. API Integration

**Endpoint:** `POST /api/leads` (existing)

**Request Payload:**

```typescript
{
  name: string;
  email: string;
  phone: string;
  message: string; // Will contain test score info
  program: "Career Test"; // Identifier for lead source
}
```

**Example message field:**

```
"Career Test Score: 75/100 (75%)"
```

This approach uses existing Lead model fields without requiring schema changes.

## Data Models

### Test Score Calculation

**Scoring Logic:**

- Never = 0 points
- Sometimes = 1 point
- Always = 2 points
- Maximum possible score = 50 questions × 2 = 100 points
- Percentage = (total points / 100) × 100

**Score Display Format:**

```
Your Score: 75/100 (75%)
```

### Lead Data Structure (existing)

The existing Lead model will be used without modifications:

```typescript
{
  name: string;
  email: string;
  phone: string;
  program: "Career Test"; // To identify source
  message: "Career Test Score: X/100 (Y%)";
  status: "new"; // Default
}
```

## Error Handling

### Form Validation Errors

1. **Empty Fields:**

   - Display error message below each empty required field
   - Disable submit button until all fields are filled

2. **Invalid Email:**

   - Use HTML5 email validation
   - Display "Please enter a valid email address" error

3. **Phone Number:**
   - Accept any format (no strict validation)
   - Optional: Add +91 prefix if not present (following EnquiryForm pattern)

### API Submission Errors

1. **Network Error:**

   - Display: "Failed to submit. Please check your connection and try again."
   - Keep modal open, allow retry

2. **Server Error (500):**

   - Display: "Something went wrong. Please try again later."
   - Keep modal open, allow retry

3. **Validation Error (400):**
   - Display specific error message from API response
   - Keep modal open, allow correction

### Error Display Pattern

```typescript
{
  error && (
    <div className="text-danger text-sm flex items-center gap-2">
      <Icon icon="lucide:alert-circle" />
      <span>{error}</span>
    </div>
  );
}
```

## Testing Strategy

### Unit Tests

1. **Score Calculation:**

   - Test with all "Never" answers → 0%
   - Test with all "Always" answers → 100%
   - Test with mixed answers → correct percentage
   - Test with incomplete answers → handle gracefully

2. **Form Validation:**

   - Test empty field validation
   - Test email format validation
   - Test submit button disabled state

3. **Modal Behavior:**
   - Test modal opens when submit clicked
   - Test modal closes on success
   - Test modal stays open on error

### Integration Tests

1. **API Integration:**

   - Test successful submission creates lead in database
   - Test error handling for failed API calls
   - Test correct data format sent to API

2. **User Flow:**
   - Complete test → click submit → modal opens
   - Fill form → submit → success message → modal closes
   - Fill form → submit fails → error shown → retry works

### Manual Testing Checklist

1. Complete all 50 questions and submit
2. Verify score calculation is correct
3. Test form validation (empty fields, invalid email)
4. Test successful submission flow
5. Test error handling (disconnect network, test retry)
6. Test modal close behavior (X button, outside click, ESC key)
7. Test on mobile devices (responsive design)
8. Verify lead appears in database with correct data

## UI/UX Design

### Modal Layout

```
┌─────────────────────────────────────┐
│  Get Your Career Test Results    ✕ │
├─────────────────────────────────────┤
│                                     │
│  🎯 Your Score: 75/100 (75%)       │
│                                     │
│  Enter your details to receive     │
│  personalized career guidance      │
│                                     │
│  👤 Full Name                       │
│  [________________]                 │
│                                     │
│  ✉️  Email                          │
│  [________________]                 │
│                                     │
│  📞 Phone Number                    │
│  [________________]                 │
│                                     │
│  [    Submit & Get Results    ]    │
│                                     │
└─────────────────────────────────────┘
```

### Success State

```
┌─────────────────────────────────────┐
│                                     │
│         ✓                           │
│    Thank You!                       │
│                                     │
│  Your results have been submitted  │
│  successfully. Our career          │
│  counselors will contact you       │
│  within 24 hours.                  │
│                                     │
└─────────────────────────────────────┘
```

### Styling Guidelines

- Use HeroUI default theme colors
- Match existing test page styling
- Score display: Large, bold, primary color
- Form inputs: Consistent with EnquiryForm component
- Success state: Green checkmark icon, centered layout
- Animations: Smooth fade-in for modal, slide-up for success message

### Responsive Behavior

**Desktop (≥768px):**

- Modal width: 500px
- Centered on screen
- Padding: 24px

**Mobile (<768px):**

- Modal width: 95vw
- Padding: 16px
- Full-width inputs
- Larger touch targets (min 44px)

## Dependencies

### Existing Dependencies (no new installations needed)

- `@heroui/modal` - Modal component
- `@heroui/input` - Form inputs
- `@heroui/button` - Submit button
- `@iconify/react` - Icons
- `framer-motion` - Animations
- Next.js API routes - Backend integration

### Component Imports

```typescript
// TestSubmissionModal
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
```

## Implementation Notes

1. **Reuse Existing Patterns:**

   - Follow EnquiryForm component structure for form handling
   - Use same validation and error handling patterns
   - Match existing styling and animations

2. **Lead Source Identification:**

   - Set `program: "Career Test"` to identify lead source
   - Include score in `message` field for context

3. **Phone Number Handling:**

   - Follow EnquiryForm pattern: add +91 prefix if not present
   - Store as-is if already has country code

4. **Post-Submission Behavior:**

   - Show success message for 2-3 seconds
   - Close modal automatically
   - Optional: Reset test state or redirect to thank you page
   - Consider: Keep test results visible for user reference

5. **Accessibility:**
   - Modal should trap focus
   - ESC key closes modal
   - Proper ARIA labels on form inputs
   - Clear error messages for screen readers
