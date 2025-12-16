# Implementation Plan

- [x] 1. Create API endpoint for single country lookup

  - Create `/api/countries/[id]/route.ts` endpoint that handles both ID and slug-based lookups
  - Implement proper error handling with 404 responses for non-existent countries
  - Add validation for route parameters and return appropriate error messages
  - _Requirements: 1.1, 1.2, 1.3, 4.1, 4.2, 5.1, 5.2, 5.4_

- [x] 2. Create API endpoint for single university lookup

  - Create `/api/universities/[id]/route.ts` endpoint that handles both ID and slug-based lookups
  - Implement population of related country data in the response
  - Add proper error handling with 404 responses for non-existent universities
  - _Requirements: 2.1, 2.3, 4.1, 4.2, 5.1, 5.2, 5.4_

-

- [x] 3. Create API endpoint for single course lookup

  - Create `/api/courses/[id]/route.ts` endpoint that handles both ID and slug-based lookups
  - Implement population of related university and country data in the response
  - Add proper error handling with 404 responses for non-existent courses
  - _Requirements: 3.1, 3.2, 3.4, 4.1, 4.2, 5.1, 5.2, 5.4_

- [x] 4. Update country page data fetching logic

  - Modify `getCountryData` function in `/study-abroad/[countryId]/page.tsx` to use direct API call
  - Remove client-side filtering logic that fetches all countries
  - Implement proper error handling that triggers Next.js notFound() for 404 responses
  - Add error logging with appropriate context for debugging
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 4.1, 4.2, 4.3_

- [x] 5. Update university page data fetching logic

  - Modify `getUniversityData` function in `/study-abroad/[countryId]/[universityId]/page.tsx` to use direct API call
  - Remove client-side filtering logic that fetches all universities
  - Update `getCoursesForUniversity` function to use the university-specific courses endpoint
  - Implement proper error handling and logging for both university and courses data
  - _Requirements: 2.1, 2.2, 2.3, 2.5, 4.1, 4.2, 4.3_

- [x] 6. Update course page data fetching logic

  - Modify `getCourseDataForServer` function in `src/utils/courseUtils.ts` to use direct API call
  - Remove client-side filtering logic that fetches all courses
  - Ensure the function properly handles populated university and country data
  - Implement proper error handling and logging
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 4.1, 4.2, 4.3_

- [x] 7. Add error logging utility function

  - Create a centralized error logging utility in `src/utils/errorUtils.ts`
  - Implement structured logging with context, parameters, and timestamps
  - Add different log levels for different types of errors (404, 5xx, network)
  - Update all data fetching functions to use the centralized logging
  - _Requirements: 4.1, 4.3_

- [ ] 8. Update universities API to support country filtering

  - Modify existing `/api/universities/route.ts` to efficiently filter by countryId parameter
  - Ensure the filtering is done at the database level, not in memory
  - Add proper validation for the countryId parameter
  - _Requirements: 2.2, 5.3_

- [ ] 9. Update courses API to support university filtering

  - Modify existing `/api/courses/route.ts` to efficiently filter by universityId parameter
  - Ensure the filtering is done at the database level, not in memory
  - Add proper validation for the universityId parameter
  - Maintain population of related university and country data
  - _Requirements: 2.2, 5.3_

- [ ] 10. Add comprehensive error handling tests

  - Write unit tests for all new API endpoints testing 200, 404, and 500 responses
  - Write unit tests for updated data fetching functions with mocked API responses
  - Write integration tests for complete page rendering with various data scenarios
  - Test error boundary behavior and 404 page rendering
  - _Requirements: 4.1, 4.2, 4.3_

- [ ] 11. Performance optimization and monitoring
  - Add performance logging to measure API response times before and after changes
  - Implement request timing measurements in data fetching functions
  - Add database query performance monitoring for slug-based lookups
  - Create performance comparison tests between old and new approaches
  - _Requirements: 5.5_
