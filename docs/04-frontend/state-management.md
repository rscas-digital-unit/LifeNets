# LifeNets State Management

## Purpose

This document describes how application state is managed in the LifeNets frontend, including data flow patterns, state ownership, and synchronization strategies.

## Current Implementation

The application uses a **service-based state management** approach with centralized data coordination. No external state management libraries (Redux, NgRx, etc.) are used.

---

## State Architecture

### Repository Pattern

**Central State Manager**: `ItemsRepositoryService` acts as the single source of truth for all application data.

**State Collections**:
```typescript
export class ItemsRepositoryService {
  // Private state - not directly accessible
  private events: Event[] = [];
  private publications: Publication[] = [];
  private posts: Post[] = [];
  private advertisings: Advertising[] = [];
  private about: AboutModel;
  private hero: HeroModel;
  private currentPage: string = "Landing";

  // Public getters - controlled access
  getEvents(): Event[] { return this.events; }
  getPublications(): Publication[] { return this.publications; }
  getPosts(): Post[] { return this.posts; }
  getAdvertisings(): Advertising[] { return this.advertisings; }
  getAbout(): AboutModel { return this.about; }
  getHero(): HeroModel { return this.hero; }
  getHeader(): HeaderModel { /* context-aware */ }
}
```

**Benefits**:
- **Single Source of Truth**: All components read from the same state
- **Controlled Access**: Private state, public getters
- **Type Safety**: Strongly typed collections
- **Centralized Logic**: State mutations happen in one place

---

## Data Flow Patterns

### Initialization Flow

```
App Startup
    ↓
PageContainerComponent.ngOnInit()
    ↓
ItemsRepositoryService.load()
    ↓
Parallel Load Operations:
├── loadPages() → Hero + About data
├── loadEvents() → Events collection
├── loadPublications() → Publications collection
├── loadPosts() → Posts collection
└── loadAdvertisings() → Advertising collection
    ↓
Components render when data available
```

### Component Data Access

**Pattern**: Components inject repository and access data via getters

```typescript
@Component({...})
export class PageViewComponent {
  constructor(public repository: ItemsRepositoryService) {}

  // Template accesses via repository.getXxx()
  // <app-slide-show [items]="repository.getEvents()"></app-slide-show>
}
```

**Lazy Rendering**: Components conditionally render when data is available
```html
<app-slide-show *ngIf="repository.getEvents()?.length > 0" ...>
```

---

## State Mutation Patterns

### Load Methods

Each content type has a dedicated load method following the same pattern:

```typescript
loadPublications(): void {
  this.api.getPubblications().pipe(
    // Stage 1: Fetch main DTOs + extract relationship IDs
    switchMap(dtos => {
      const ids = this.decoderService.extractUniqueAsString(dtos, ...);
      return forkJoin({
        dtos: of(dtos),
        related: this.api.getList('tags', ids)
      });
    }),

    // Stage 2: Fetch additional relationships if needed
    switchMap(({ dtos, related }) => {
      // More parallel fetches...
    }),

    // Stage 3: Transform and store
    tap(({ dtos, ...allData }) => {
      this.publications = this.mapperService.fromPublicationDtoList(dtos, ...allData);
    })
  ).subscribe({
    error: error => console.error('Error loading publications', error);
  });
}
```

**Key Characteristics**:
- **RxJS Pipeline**: `switchMap` + `forkJoin` + `tap`
- **Parallel Fetching**: All related data fetched simultaneously
- **Single Mutation**: State updated once when all data ready
- **Error Handling**: Console logging (no user-facing errors)

### Page Context Management

**Current Page Tracking**:
```typescript
goToPage(pageName: string): void {
  this.currentPage = pageName;
}

getHeader(): HeaderModel {
  if (this.currentPage === "Landing") {
    return new HeaderModel(this.hero.title, this.hero.description, this.hero.image);
  } else if (this.currentPage === "About") {
    return new HeaderModel("About", "", this.hero.image);
  }
  return new HeaderModel("LIFE NETS", "", this.hero.image);
}
```

**Usage**: Page components call `goToPage()` on initialization to set context for header rendering.

---

## State Synchronization

### Conditional Loading

**Duplicate Prevention**: `load()` method checks if data already exists:

```typescript
load(): void {
  if (this.events.length > 0 && this.posts.length > 0 && this.publications.length > 0) {
    return; // Already loaded
  }
  // ... load all data
}
```

**Benefits**:
- Prevents redundant API calls on route changes
- Maintains state across navigation
- Single initialization point

### Cache Integration

**HTTP Caching**: All API calls automatically cached via `cachingInterceptor`

**Cache Strategy**:
- **Key**: Full URL with query parameters
- **TTL**: Configurable via `config.json` (`cacheTTLminutes`)
- **Storage**: `localStorage` with expiry timestamps
- **Automatic**: Transparent to repository methods

**State Persistence**: Repository state lives in memory only — survives navigation but not page refresh.

---

## Data Transformation Pipeline

### DTO → Domain Model Flow

```
WordPress API Response (DTO)
    ↓
ApiService.getXxx() → Observable<XxxDto[]>
    ↓
ItemsRepositoryService.loadXxx()
    ↓
MapperService.fromXxxDtoList(dtos, relatedData)
    ↓
Domain Models (Event[], Publication[], etc.)
    ↓
Stored in Repository State
    ↓
Accessed via Repository Getters
    ↓
Consumed by Components
```

### Transformation Responsibilities

**ApiService**: Raw HTTP calls, returns DTO observables

**MapperService**: 
- Flattens nested relationships
- Resolves IDs to objects
- Formats text (HTML decoding, truncation)
- Creates domain model instances

**DecoderService**: 
- Extracts relationship IDs from DTOs
- Formats dates and text
- Provides utility functions for transformations

---

## Component State vs. Global State

### Component-Local State

**Scroll Detection** (`PageViewComponent`):
```typescript
scrollThreshold = 100;

@HostListener('window:scroll')
onWindowScroll() {
  if (window.scrollY > this.scrollThreshold) {
    document.body.classList.add('going-down');
  } else {
    document.body.classList.remove('going-down');
  }
}
```

**Carousel Navigation** (`SlideShowComponent`):
```typescript
isBeginning = true;
isEnd = false;
// Updated based on swiper state
```

### Global State (Repository)

**Content Collections**: Events, publications, posts, etc.

**Page Context**: Current page for header rendering

**Static Content**: Hero, about data

---

## State Update Triggers

### Automatic Updates

- **App Initialization**: `PageContainerComponent.ngOnInit()` triggers `repository.load()`
- **Route Changes**: Page components call `goToPage()` to update context
- **Cache Expiry**: Automatic via HTTP interceptor TTL

### Manual Updates

**Currently None**: No refresh/reload mechanisms implemented

**TODO**: Add pull-to-refresh, manual reload buttons, or periodic updates

---

## Error Handling

### Current Strategy

**Repository Level**:
```typescript
.subscribe({
  error: error => {
    console.error('Errore caricamento eventi', error);
  }
});
```

**Characteristics**:
- Errors logged to console
- No user-facing error messages
- No retry logic
- Components render with empty/undefined data

### Missing Data Handling

**Graceful Degradation**:
- Conditional rendering: `*ngIf="data?.length > 0"`
- Default images: Fallback to `config.defaultImage`
- Empty states: Sections don't render when no data

---

## Performance Considerations

### Memory Management

**State Size**: All content loaded into memory at startup
- **Pros**: Fast subsequent access, offline-capable via cache
- **Cons**: Memory usage scales with content volume

**No Cleanup**: State persists for app lifetime
- **Pros**: No reloading on navigation
- **Cons**: Memory leaks if content grows significantly

### Change Detection

**Strategy**: Angular default change detection (not OnPush)

**Implications**:
- Every component re-renders when any state changes
- Simple but potentially inefficient for large component trees
- No manual change detection optimization

### Data Fetching

**Parallel Loading**: All content types loaded simultaneously
- **Pros**: Faster overall load time
- **Cons**: Network congestion if many requests

**Batch API Calls**: Related data fetched in single requests
```typescript
this.api.getList('tags', '1,2,3,4,5') // One request for multiple tags
```

---

## Future State Management Improvements

### Potential Enhancements

**OnPush Change Detection**:
```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
```

**Signal-Based State** (Angular 17+):
```typescript
events = signal<Event[]>([]);
publications = signal<Publication[]>([]);
```

**Error Boundaries**: Component-level error handling

**Loading States**: Add loading indicators and skeleton screens

**Optimistic Updates**: Immediate UI updates with rollback on errors

### Scalability Considerations

**Pagination**: For large datasets, implement pagination in API calls

**Incremental Loading**: Load content sections on demand rather than all at once

**State Persistence**: Persist repository state to localStorage for true offline capability

---

## Testing State Management

### Current Test Coverage

**Service Tests**:
- `items-repository.service.spec.ts` — State management logic
- `api.service.spec.ts` — HTTP operations
- `mapper-service.spec.ts` — Data transformations
- `decoder-service.spec.ts` — Utility functions
- `cache-service.spec.ts` — Cache behavior

### Test Patterns

**Mock HTTP Responses**: Use Angular `HttpClientTestingModule`

**State Verification**: Test repository getters return expected data

**Transformation Testing**: Verify DTO → domain model conversions

---

## Maintenance Notes

### Adding New State

1. Add private property to `ItemsRepositoryService`
2. Create `loadXxx()` method following existing pattern
3. Add public getter method
4. Call `loadXxx()` from main `load()` method
5. Update conditional loading check

### Modifying State Updates

- **Single Responsibility**: Each load method handles one content type
- **Consistent Pattern**: Follow switchMap → forkJoin → tap structure
- **Type Safety**: Maintain strong typing throughout pipeline

### Debugging State Issues

- **Console Logging**: Add `tap(res => console.log(...))` in RxJS pipelines
- **Network Tab**: Verify API calls and cache hits
- **LocalStorage**: Inspect cached responses and TTL timestamps
- **Component Binding**: Check template bindings and conditional rendering</content>
<parameter name="filePath">/Users/apistill/Projects/LifeNets/LifeNets/docs/04-frontend/state-management.md
