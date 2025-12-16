# Design Document

## Overview

This design addresses responsive issues in the home page by implementing mobile-first responsive design patterns for the HeroVideoDialog and BlogSlider components. The solution focuses on creating adaptive layouts that work seamlessly across all device sizes while maintaining the existing desktop functionality.

## Architecture

The responsive fixes will be implemented through:

1. **Component-level responsive design**: Modifying individual components to handle different screen sizes
2. **CSS utility classes**: Using Tailwind CSS responsive utilities for consistent breakpoint management
3. **Dynamic behavior**: Implementing JavaScript logic to adapt component behavior based on screen size
4. **Progressive enhancement**: Ensuring mobile experience is optimized first, then enhanced for larger screens

## Components and Interfaces

### HeroVideoDialog Component

**Current Issues:**

- Video modal doesn't scale properly on mobile devices
- Close button positioning is problematic on small screens
- Aspect ratio maintenance issues on tablets

**Design Solution:**

- Implement responsive sizing using viewport-based calculations
- Add mobile-specific modal positioning and sizing
- Improve touch target sizes for mobile interaction
- Add responsive padding and margins

**Key Changes:**

```typescript
// Responsive modal sizing
className =
  "relative mx-2 sm:mx-4 md:mx-8 aspect-video w-full max-w-xs sm:max-w-2xl md:max-w-4xl";

// Mobile-optimized close button
className =
  "absolute -top-12 sm:-top-16 right-2 sm:right-0 p-2 sm:p-3 text-lg sm:text-xl";

// Responsive iframe container
className =
  "relative isolate z-[1] size-full overflow-hidden rounded-lg sm:rounded-2xl border border-white sm:border-2";
```

### BlogSlider Component

**Current Issues:**

- Shows 3 items on mobile causing overflow
- Navigation buttons too small for touch interaction
- No responsive item count adjustment

**Design Solution:**

- Implement dynamic items-to-show based on screen size
- Increase touch target sizes for mobile
- Add responsive gap spacing
- Improve mobile navigation experience

**Key Changes:**

```typescript
// Responsive items count
const getItemsToShow = () => {
  if (typeof window !== "undefined") {
    if (window.innerWidth < 640) return 1; // mobile
    if (window.innerWidth < 1024) return 2; // tablet
    return 3; // desktop
  }
  return 3;
};

// Mobile-optimized navigation buttons
className =
  "flex-shrink-0 p-2 sm:p-3 rounded-full bg-white/30 hover:bg-white/40 text-white transition-all duration-300 transform hover:scale-105 mr-3 sm:mr-6";

// Responsive gap spacing
className = "flex gap-2 sm:gap-4 md:gap-8";
```

### Hero Section Layout

**Current Issues:**

- Grid layout doesn't stack properly on mobile
- Text sizes not optimized for small screens
- Stats section wrapping issues

**Design Solution:**

- Implement proper grid stacking for mobile
- Add responsive typography scaling
- Improve button and stats layout for mobile
- Optimize spacing and padding

**Key Changes:**

```typescript
// Responsive grid layout
className = "grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center";

// Responsive typography
className =
  "text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6";

// Mobile-optimized stats layout
className = "flex flex-col sm:flex-row sm:flex-wrap gap-4 sm:gap-6";
```

## Data Models

No new data models are required. The existing component props and state management will be maintained.

## Error Handling

**Responsive Breakpoint Detection:**

- Implement window resize listeners with debouncing
- Handle server-side rendering scenarios where window is undefined
- Provide fallback values for responsive calculations

**Touch Interaction:**

- Add proper touch event handling for mobile devices
- Implement touch-friendly interaction zones
- Handle edge cases for small screen devices

## Testing Strategy

### Responsive Testing Approach

1. **Breakpoint Testing:**

   - Test at standard breakpoints: 320px, 375px, 768px, 1024px, 1280px
   - Verify component behavior at breakpoint boundaries
   - Test orientation changes on mobile devices

2. **Component Testing:**

   - Unit tests for responsive utility functions
   - Integration tests for component behavior at different screen sizes
   - Visual regression testing for layout consistency

3. **User Experience Testing:**
   - Touch interaction testing on mobile devices
   - Accessibility testing with screen readers
   - Performance testing for responsive image loading

### Test Cases

**HeroVideoDialog:**

- Modal opens correctly on mobile devices
- Video aspect ratio maintained across screen sizes
- Close button accessible on all devices
- Touch interactions work properly

**BlogSlider:**

- Correct number of items displayed per screen size
- Navigation buttons properly sized for touch
- Smooth sliding animation on all devices
- Proper handling of edge cases (fewer items than display count)

**Hero Section:**

- Layout stacks properly on mobile
- Text remains readable at all sizes
- Buttons and stats wrap appropriately
- No horizontal overflow on any screen size

## Implementation Notes

### Tailwind CSS Breakpoints

- `sm`: 640px and up (small tablets and large phones in landscape)
- `md`: 768px and up (tablets)
- `lg`: 1024px and up (laptops and desktops)
- `xl`: 1280px and up (large desktops)

### Mobile-First Approach

All responsive classes will be implemented mobile-first, meaning:

- Base styles target mobile devices
- Responsive prefixes add styles for larger screens
- Progressive enhancement ensures mobile performance

### Performance Considerations

- Use CSS transforms for animations instead of changing layout properties
- Implement lazy loading for video thumbnails
- Optimize touch event handling to prevent performance issues
- Use CSS containment where appropriate to improve rendering performance
