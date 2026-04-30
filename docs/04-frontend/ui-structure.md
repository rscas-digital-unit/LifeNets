# LifeNets UI Structure

## Purpose

This document describes the overall user interface architecture of the LifeNets application, including page layouts, component hierarchy, and visual organization patterns.

## Current Implementation

The application uses a **single-page application (SPA)** architecture with client-side routing, built with Angular 19+ standalone components and Bootstrap 5.3 for responsive design.

---

## Application Layout Hierarchy

```
AppComponent (Root)
├── PageContainerComponent (Layout Wrapper)
│   ├── HeaderComponent (Navigation + Hero)
│   ├── RouterOutlet (Dynamic Content)
│   │   ├── PageViewComponent (Landing Page)
│   │   │   ├── SlideShowComponent (Events)
│   │   │   ├── SlideShowComponent (Posts)
│   │   │   ├── CallToActionComponent (CTA 1)
│   │   │   ├── SlideShowComponent (Publications)
│   │   │   └── CallToActionComponent (CTA 2)
│   │   │
│   │   └── PageAboutComponent (About Page)
│   │       └── TwoColumnsComponent (Tabbed Content)
│   │
│   └── FooterComponent (Site Footer)
```

---

## Page Structure

### Root Layout (PageContainerComponent)

**Location**: `src/app/components/pages/page-container/`

**Purpose**: Provides the application shell with consistent header/footer across all pages.

**Template Structure**:
```html
<app-header></app-header>
<router-outlet></router-outlet>
<app-footer></app-footer>
```

**Responsibilities**:
- Initializes data loading via `ItemsRepositoryService.load()` on app startup
- Provides consistent layout wrapper for all routes
- No visual content of its own

---

### Landing Page (PageViewComponent)

**Location**: `src/app/components/pages/page-view/`

**Purpose**: Main landing page displaying all content types in carousel format.

**Template Structure**:
```html
<div id="Events">
  <app-slide-show [items]="repository.getEvents()" ...></app-slide-show>
</div>
<app-slide-show id="Posts" [items]="repository.getPosts()" ...></app-slide-show>
<app-call-to-action [advertising]="repository.getAdvertisings()[0]"></app-call-to-action>
<app-slide-show id="Publications" [items]="repository.getPublications()" ...></app-slide-show>
<app-call-to-action [advertising]="repository.getAdvertisings()[1]"></app-call-to-action>
```

**Content Sections** (in display order):
1. **Events** — Event carousel with navigation
2. **Posts** — Blog post carousel
3. **CTA 1** — First call-to-action banner
4. **Publications** — Publication carousel
5. **CTA 2** — Second call-to-action banner

**Features**:
- **Fragment Navigation**: URL fragments (`#Events`, `#Posts`, `#Publications`) enable direct linking to sections
- **Scroll Detection**: Adds `going-down` CSS class to body when scrolled > 100px (used for sticky header effects)
- **Responsive Design**: Carousels adapt to screen size

---

### About Page (PageAboutComponent)

**Location**: `src/app/components/pages/page-about/`

**Purpose**: Static content page with introduction text and tabbed information sections.

**Template Structure**:
```html
<div class="container-fluid">
  <p [innerHTML]="repository.getAbout().content"></p>
</div>
<app-two-columns [items]="repository.getAbout().tabs"></app-two-columns>
```

**Content Sections**:
1. **Introduction Text** — Main about content from WordPress page
2. **Tabbed Content** — Bootstrap tabs with left navigation and right content panels

---

## Component Categories

### Page Components

**Location**: `src/app/components/pages/`

**Characteristics**:
- Route-specific components that implement page layouts
- Handle page-level logic (fragment navigation, scroll detection)
- Inject `ItemsRepositoryService` for data access
- Call `repository.goToPage()` to set page context for header rendering

**Current Pages**:
- `PageContainerComponent` — Layout wrapper
- `PageViewComponent` — Landing page
- `PageAboutComponent` — About page

---

### Widget Components

**Location**: `src/app/components/widgets/`

**Characteristics**:
- Reusable UI components for specific functionality
- Accept data via `@Input()` properties
- Emit events via `@Output()` when needed
- Handle their own styling and interactions

**Current Widgets**:
- `HeaderComponent` — Navigation and hero section
- `FooterComponent` — Site footer
- `SlideShowComponent` — Swiper-based carousel
- `CallToActionComponent` — CTA banner
- `TwoColumnsComponent` — Bootstrap tabs layout
- `DisplayItemComponent` — Content type router
- `DisplayEventComponent` — Event card
- `DisplayPublicationComponent` — Publication card
- `DisplayPostComponent` — Post card

---

## Visual Design System

### CSS Framework

**Bootstrap 5.3** is used for:
- Responsive grid system (`container-fluid`, `row`, `col-lg-*`)
- Component classes (`btn`, `nav`, `tab-content`)
- Utility classes (`d-flex`, `justify-content-between`, `align-items-center`)

### Custom CSS Classes

**Component-specific styling**:
- `.Hero` — Hero section with background image
- `.slider-container` — Carousel wrapper
- `.Cta` — Call-to-action banner
- `.Tabs` — Tabbed content layout

**Responsive breakpoints**:
- Mobile-first approach with `*-lg-*` classes for desktop overrides
- Carousel adapts: 1.3 slides on mobile, 3 slides on desktop

### Image Handling

**Background Images**: Hero section uses CSS `background-image` property
```html
<div class="Hero__image" [style.backgroundImage]="'url('+imageUrl+')'">
```

**Content Images**: Standard `<img>` tags with `src` binding
```html
<img [src]="advertising.image" alt="Call to action">
```

**Fallback Strategy**: Default image from config when content images unavailable

---

## Navigation Patterns

### Header Navigation

**Structure**: Logo + horizontal navigation menu

**Navigation Items**:
- **About** — RouterLink to `/about`
- **Events** — Fragment link to `/#Events`
- **Posts** — Fragment link to `/#Posts`
- **Publications** — Fragment link to `/#Publications`

**Implementation**: `goToSection()` method handles fragment navigation with Angular Router

### Fragment Scrolling

**URL Pattern**: `/#sectionId`

**Implementation**:
```typescript
private executeScrollLogic(targetId: string): void {
  const element = document.getElementById(targetId);
  const y = element.getBoundingClientRect().top + window.pageYOffset - offset;
  window.scrollTo({ top: y, behavior: 'smooth' });
}
```

**Offset**: 100px to account for fixed header

---

## Responsive Behavior

### Breakpoints

- **Mobile (< 768px)**: Single slide per view in carousels
- **Desktop (≥ 768px)**: 3 slides per view in carousels

### Adaptive Components

**SlideShowComponent**:
```typescript
getSlidesPerView(): number {
  return window.innerWidth < 768 ? 1.3 : 3;
}
```

**HeaderComponent**: Navigation collapses appropriately via Bootstrap classes

---

## Content Flow

### Data-Driven Rendering

All content sections use conditional rendering based on data availability:

```html
<app-slide-show *ngIf="repository.getEvents()?.length > 0" ...>
```

```html
<app-call-to-action *ngIf="ads.length >= 2" [advertising]="ads[1]">
```

### Loading States

**Current State**: No explicit loading indicators — components render when data is available.

**TODO**: Add loading spinners and skeleton screens for better UX.

---

## Accessibility Considerations

### Current Implementation

- **Semantic HTML**: Proper heading hierarchy (`<h1>`, `<h2>`, `<h3>`)
- **ARIA Attributes**: Bootstrap tabs include `role`, `aria-*` attributes
- **Alt Text**: Images include descriptive alt attributes
- **Keyboard Navigation**: Bootstrap components provide keyboard support

### Areas for Improvement

- **Focus Management**: Fragment navigation should move focus to target sections
- **Screen Reader Support**: Add `aria-label` for icon-only buttons
- **Color Contrast**: Verify Bootstrap theme meets WCAG guidelines

---

## Performance Considerations

### Rendering Strategy

- **Lazy Loading**: No explicit lazy loading — all data loaded on app initialization
- **Change Detection**: Angular default change detection (no OnPush optimization)
- **DOM Updates**: Direct property binding for dynamic content

### Bundle Size

- **Standalone Components**: Tree-shakable imports reduce bundle size
- **Third-party Libraries**: Swiper for carousels, Bootstrap for UI components

---

## Future Maintenance Notes

### Adding New Content Sections

1. Add section to `PageViewComponent` template
2. Use appropriate widget component (`SlideShowComponent`, `CallToActionComponent`)
3. Add navigation link to `HeaderComponent` if needed
4. Update fragment scrolling logic if new section IDs added

### Adding New Pages

1. Create new page component in `src/app/components/pages/`
2. Add route to `src/app/app.routes.ts`
3. Add navigation link to `HeaderComponent`
4. Implement page-specific layout and data access

### Responsive Improvements

- Consider mobile-specific navigation patterns
- Add touch gesture support for carousels
- Implement progressive enhancement for older browsers</content>
<parameter name="filePath">/Users/apistill/Projects/LifeNets/LifeNets/docs/04-frontend/ui-structure.md
