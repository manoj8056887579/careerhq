# Design Document

## Overview

This design addresses comprehensive responsive issues across multiple pages of the CareerIQ website by implementing mobile-first responsive design patterns. The solution focuses on fixing layout problems in the about page "Our Journey" timeline, study abroad dropdown navigation, university page tabs, and home page blog cards to ensure optimal user experience across all device sizes.

## Architecture

The responsive fixes will be implemented through:

1. **Component-level responsive design**: Modifying individual components to handle different screen sizes
2. **CSS utility classes**: Using Tailwind CSS responsive utilities for consistent breakpoint management
3. **Dynamic behavior**: Implementing JavaScript logic to adapt component behavior based on screen size
4. **Progressive enhancement**: Ensuring mobile experience is optimized first, then enhanced for larger screens

## Components and Interfaces

### About Page "Our Journey" Timeline

**Current Issues:**

- Timeline layout doesn't stack properly on mobile devices
- Content overflows horizontally on small screens
- Timeline line positioning is problematic on mobile
- Text and spacing not optimized for mobile viewing

**Design Solution:**

- Implement mobile-first timeline layout that stacks vertically
- Adjust timeline line positioning for mobile devices
- Optimize typography and spacing for different breakpoints
- Improve touch interaction areas

**Key Changes:**

```typescript
// Mobile-first timeline container
className = "relative max-w-4xl mx-auto px-4";

// Responsive timeline line positioning
className =
  "absolute left-4 md:left-1/2 transform md:-translate-x-1/2 h-full w-0.5 bg-primary-200";

// Mobile-optimized timeline items
className =
  "flex flex-col md:flex-row items-start md:items-center mb-8 md:mb-12";

// Responsive content positioning
className = "ml-8 md:ml-0 md:w-1/2 md:pr-8";

// Mobile-friendly milestone indicators
className =
  "absolute left-2 md:left-1/2 md:transform md:-translate-x-1/2 w-6 h-6 md:w-10 md:h-10 rounded-full bg-primary flex items-center justify-center z-10";
```

### Study Abroad Dropdown Navigation

**Current Issues:**

- Dropdown menu not displaying properly on mobile and tablet devices
- Menu items cut off or positioned incorrectly
- Touch targets too small for mobile interaction
- Dropdown positioning issues on smaller screens

**Design Solution:**

- Implement responsive dropdown positioning
- Add mobile-specific dropdown behavior
- Improve touch target sizes
- Add proper viewport-aware positioning

**Key Changes:**

```typescript
// Mobile-optimized dropdown container
className =
  "absolute top-full left-0 mt-2 w-screen max-w-xs sm:max-w-sm md:w-56 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-neutral-900 z-50";

// Responsive dropdown positioning
style = {
  left: typeof window !== "undefined" && window.innerWidth < 768 ? "50%" : "0",
  transform:
    typeof window !== "undefined" && window.innerWidth < 768
      ? "translateX(-50%)"
      : "none",
};

// Mobile-friendly dropdown items
className =
  "block px-4 py-3 sm:py-2 text-base sm:text-sm transition-colors duration-200";

// Touch-optimized mobile navigation
const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
const dropdownProps = {
  className: isMobile
    ? "fixed inset-x-4 top-16 rounded-lg shadow-xl"
    : "absolute top-full left-0 mt-0 w-56 rounded-md shadow-lg",
};
```

### University Page Tabs

**Current Issues:**

- Tabs don't wrap or scroll properly on mobile devices
- Tab content overflows horizontally
- Touch targets too small for mobile interaction
- No horizontal scrolling for tab overflow

**Design Solution:**

- Implement horizontally scrollable tabs for mobile
- Add proper touch interaction support
- Optimize tab sizing for different screen sizes
- Add scroll indicators for mobile

**Key Changes:**

```typescript
// Mobile-scrollable tabs container
className = "overflow-x-auto scrollbar-hide";

// Responsive tab wrapper
className = "flex gap-1 sm:gap-2 min-w-max sm:min-w-0 sm:flex-wrap";

// Mobile-optimized tab sizing
className = "flex-shrink-0 px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base whitespace-nowrap";

// Scroll indicator for mobile
const TabScrollIndicator = () => (
  <div className="flex sm:hidden justify-center mt-2">
    <div className="flex gap-1">
      {tabs.map((_, index) => (
        <div
          key={index}
          className={`w-2 h-2 rounded-full ${
            index === activeTab ? 'bg-primary' : 'bg-gray-300'
          }`}
        />
      ))}
    </div>
  </div>
);

// Enhanced tabs component with mobile support
<Tabs
  selectedKey={selected}
  onSelectionChange={(key) => setSelected(String(key))}
  variant="light"
  color="primary"
  radius="full"
  className="mt-4 md:mt-0"
  classNames={{
    base: "w-full",
    tabList: "flex-nowrap sm:flex-wrap overflow-x-auto scrollbar-hide gap-1 sm:gap-2",
    tab: "flex-shrink-0 px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base whitespace-nowrap min-w-max",
    cursor: "w-full",
    panel: "pt-4"
  }}
>
```

### Home Page Blog Cards

**Current Issues:**

- Blog cards don't stack properly on mobile devices
- Grid layout causes horizontal overflow on small screens
- Card content not optimized for mobile viewing
- Inconsistent spacing across breakpoints

**Design Solution:**

- Implement responsive grid system
- Optimize card content for mobile viewing
- Add proper spacing and padding for all screen sizes
- Ensure images scale appropriately

**Key Changes:**

```typescript
// Responsive blog grid
className = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6";

// Mobile-optimized blog card
className =
  "bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300";

// Responsive card image
className = "w-full h-48 sm:h-56 object-cover";

// Mobile-friendly card content
className = "p-4 sm:p-6";

// Responsive typography
className = "text-lg sm:text-xl font-semibold mb-2 line-clamp-2";

// Mobile-optimized card actions
className = "flex flex-col sm:flex-row gap-2 sm:gap-4 mt-4";
```

## Data Models

No new data models are required. The existing component props and state management will be maintained. However, we'll add responsive state management:

```typescript
interface ResponsiveState {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  screenWidth: number;
}

// Custom hook for responsive behavior
const useResponsive = () => {
  const [state, setState] = useState<ResponsiveState>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    screenWidth: 1024,
  });

  useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth;
      setState({
        isMobile: width < 640,
        isTablet: width >= 640 && width < 1024,
        isDesktop: width >= 1024,
        screenWidth: width,
      });
    };

    updateScreenSize();
    window.addEventListener("resize", updateScreenSize);
    return () => window.removeEventListener("resize", updateScreenSize);
  }, []);

  return state;
};
```

## Error Handling

**Responsive Breakpoint Detection:**

- Implement window resize listeners with debouncing to prevent performance issues
- Handle server-side rendering scenarios where window is undefined
- Provide fallback values for responsive calculations

**Touch Interaction:**

- Add proper touch event handling for mobile devices
- Implement touch-friendly interaction zones with adequate spacing
- Handle edge cases for very small screen devices

**Dropdown Positioning:**

- Implement viewport-aware positioning to prevent dropdowns from being cut off
- Add fallback positioning when preferred position is not available
- Handle orientation changes on mobile devices

## Testing Strategy

### Responsive Testing Approach

1. **Breakpoint Testing:**

   - Test at standard breakpoints: 320px, 375px, 640px, 768px, 1024px, 1280px
   - Verify component behavior at breakpoint boundaries
   - Test orientation changes on mobile and tablet devices

2. **Component Testing:**

   - Unit tests for responsive utility functions and hooks
   - Integration tests for component behavior at different screen sizes
   - Visual regression testing for layout consistency

3. **User Experience Testing:**
   - Touch interaction testing on actual mobile devices
   - Accessibility testing with screen readers on mobile
   - Performance testing for responsive interactions

### Test Cases

**About Page Timeline:**

- Timeline displays correctly in single column on mobile
- Timeline line positions properly across all breakpoints
- Content remains readable without horizontal scrolling
- Touch interactions work for timeline navigation

**Study Abroad Dropdown:**

- Dropdown displays fully visible on all screen sizes
- Menu items are easily tappable on mobile devices
- Dropdown positioning adapts to viewport constraints
- Navigation works smoothly across all devices

**University Page Tabs:**

- Tabs scroll horizontally on mobile when content overflows
- Active tab remains visible and properly indicated
- Tab content updates correctly on all devices
- Touch interactions are responsive and accurate

**Home Page Blog Cards:**

- Cards display in appropriate grid layout for each breakpoint
- Images and content scale properly without distortion
- No horizontal overflow occurs on any screen size
- Card interactions work smoothly on touch devices

## Implementation Notes

### Tailwind CSS Breakpoints

- `sm`: 640px and up (large phones in landscape, small tablets)
- `md`: 768px and up (tablets in portrait)
- `lg`: 1024px and up (tablets in landscape, laptops)
- `xl`: 1280px and up (desktops)
- `2xl`: 1536px and up (large desktops)

### Mobile-First Approach

All responsive classes will be implemented mobile-first:

- Base styles target mobile devices (320px+)
- Responsive prefixes add styles for larger screens
- Progressive enhancement ensures optimal mobile performance

### Performance Considerations

- Use CSS transforms for animations instead of layout-changing properties
- Implement efficient resize event handling with debouncing
- Optimize touch event handling to prevent scroll interference
- Use CSS containment where appropriate to improve rendering performance
- Lazy load non-critical responsive images

### Accessibility Considerations

- Ensure all interactive elements meet minimum touch target sizes (44px)
- Maintain proper focus management for keyboard navigation
- Provide appropriate ARIA labels for responsive navigation elements
- Ensure color contrast meets WCAG guidelines across all screen sizes

### Browser Compatibility

- Support modern browsers with CSS Grid and Flexbox
- Provide fallbacks for older browsers where necessary
- Test across different mobile browsers (Safari, Chrome, Firefox)
- Ensure consistent behavior across iOS and Android devices
