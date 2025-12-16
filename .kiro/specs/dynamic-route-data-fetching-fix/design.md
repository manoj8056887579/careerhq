# Design Document

## Overview

This design addresses the inefficient data fetching in dynamic route pages by implementing targeted API calls that fetch only the specific data needed for each route parameter. The solution focuses on optimizing the existing API endpoints and updating the page components to use more efficient data fetching strategies.

## Architecture

### Current Architecture Issues

- Pages fetch all data and filter client-side when direct ID lookup fails
- Fallback logic causes unnecessary network overhead
- No proper error handling for different failure scenarios
- Inconsistent lookup strategies across different route levels

### Proposed Architecture

- Direct API calls with specific parameters for each route level
- Proper error handling with appropriate HTTP status codes
- Consistent slug-based and ID-based lookup patterns
- Elimination of client-side filtering of large datasets

## Components and Interfaces

### 1. API Endpoint Modifications

#### Countries API (`/api/countries`)

**Current Behavior:** Returns all countries, pages filter client-side
**New Behavior:**

- Support direct lookup: `/api/countries/[id-or-slug]`
- Return single country object or 404
- Maintain backward compatibility with existing `/api/countries` endpoint

#### Universities API (`/api/universities`)

**Current Behavior:** Returns all universities with optional filtering
**New Behavior:**

- Support direct lookup: `/api/universities/[id-or-slug]`
- Support country-specific filtering: `/api/universities?countryId=[id]`
- Return appropriate 404 responses for non-existent resources

#### Courses API (`/api/courses`)

**Current Behavior:** Returns all courses with optional filtering
**New Behavior:**

- Support direct lookup: `/api/courses/[id-or-slug]`
- Support university-specific filtering: `/api/courses?universityId=[id]`
- Maintain population of related data (university, country)

### 2. Page Component Updates

#### Country Page (`/study-abroad/[countryId]/page.tsx`)

```typescript
// Replace current getCountryData function
async function getCountryData(countrySlug: string) {
  // Try direct API call first
  const response = await fetch(`/api/countries/${countrySlug}`);
  if (response.ok) {
    return await response.json();
  }
  if (response.status === 404) {
    return null;
  }
  throw new Error(`API Error: ${response.status}`);
}
```

#### University Page (`/study-abroad/[countryId]/[universityId]/page.tsx`)

```typescript
// Replace current getUniversityData function
async function getUniversityData(universitySlug: string) {
  const response = await fetch(
    `/api/universities/${universitySlug}?populate=true`
  );
  if (response.ok) {
    return await response.json();
  }
  if (response.status === 404) {
    return null;
  }
  throw new Error(`API Error: ${response.status}`);
}
```

#### Course Page (`/study-abroad/[countryId]/[universityId]/[courseId]/page.tsx`)

```typescript
// Update getCourseDataForServer in courseUtils.ts
async function getCourseDataForServer(countrySlug: string, courseSlug: string) {
  const response = await fetch(`/api/courses/${courseSlug}?populate=true`);
  if (response.ok) {
    const data = await response.json();
    return transformCourseData(data.course);
  }
  if (response.status === 404) {
    return null;
  }
  throw new Error(`API Error: ${response.status}`);
}
```

### 3. Error Handling Strategy

#### HTTP Status Code Mapping

- **200**: Successful data retrieval
- **404**: Resource not found (trigger Next.js notFound())
- **500**: Server error (log and show generic error)
- **Network errors**: Log and show connection error message

#### Logging Strategy

```typescript
const logError = (
  context: string,
  error: Error,
  params?: Record<string, any>
) => {
  console.error(`[${context}] Error:`, {
    message: error.message,
    params,
    timestamp: new Date().toISOString(),
  });
};
```

## Data Models

### API Response Interfaces

#### Single Country Response

```typescript
interface CountryApiResponse {
  country: {
    id: string;
    name: string;
    code?: string;
    slug: string;
    imageId?: string;
    description?: string;
    costOfLiving?: string;
    visaRequirements?: string;
    scholarshipsAvailable?: string;
  };
}
```

#### Single University Response

```typescript
interface UniversityApiResponse {
  university: {
    id: string;
    name: string;
    slug: string;
    country: {
      id: string;
      name: string;
    };
    imageId?: string;
    description?: string;
    location?: string;
    // ... other university fields
  };
}
```

#### Single Course Response

```typescript
interface CourseApiResponse {
  course: {
    id: string;
    programName: string;
    slug: string;
    university: {
      id: string;
      name: string;
    };
    country: {
      id: string;
      name: string;
    };
    // ... other course fields
  };
}
```

## Error Handling

### Client-Side Error Boundaries

- Implement proper error boundaries for each page component
- Provide fallback UI for different error scenarios
- Log errors with appropriate context for debugging

### Server-Side Error Handling

- Validate route parameters before API calls
- Handle network timeouts gracefully
- Provide meaningful error messages for different failure modes

### Fallback Strategies

- For slug-based lookups, maintain current fallback to ID-based lookup
- Remove fallback to "fetch all and filter" pattern
- Implement proper 404 handling when no fallbacks succeed

## Testing Strategy

### Unit Tests

- Test individual data fetching functions with mocked API responses
- Test error handling scenarios (404, 500, network errors)
- Test slug generation and matching logic

### Integration Tests

- Test complete page rendering with real API data
- Test navigation between different route levels
- Test error page rendering for invalid routes

### Performance Tests

- Measure API response times for direct lookups vs. current approach
- Test page load times with optimized data fetching
- Monitor database query performance for slug-based lookups

### Test Scenarios

1. **Valid Route Parameters**: Verify correct data is fetched and displayed
2. **Invalid Route Parameters**: Verify 404 pages are shown appropriately
3. **API Failures**: Verify error handling and user feedback
4. **Slug vs ID Lookups**: Verify both lookup methods work correctly
5. **Nested Route Navigation**: Verify data consistency across route levels

## Implementation Phases

### Phase 1: API Endpoint Updates

- Add single-resource endpoints for countries, universities, and courses
- Implement proper error responses and status codes
- Add database indexes for slug-based lookups

### Phase 2: Page Component Updates

- Update data fetching functions in each page component
- Remove client-side filtering logic
- Implement proper error handling

### Phase 3: Testing and Optimization

- Add comprehensive test coverage
- Performance testing and optimization
- Monitor and fix any edge cases

## Performance Considerations

### Database Optimization

- Add indexes on slug fields for faster lookups
- Optimize population queries for related data
- Consider caching strategies for frequently accessed data

### Network Optimization

- Reduce payload sizes by fetching only required data
- Implement proper HTTP caching headers
- Consider implementing request deduplication

### Client-Side Optimization

- Eliminate unnecessary data processing on the client
- Reduce JavaScript bundle size by removing unused filtering logic
- Improve Time to First Contentful Paint (TFCP) with faster data loading
