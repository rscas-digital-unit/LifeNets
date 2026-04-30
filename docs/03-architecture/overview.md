# LifeNets Architecture Overview

## Purpose

This document describes the high-level architecture of the LifeNets frontend application, which is a **content aggregation and presentation layer** for academic research content from a WordPress REST API. The architecture emphasizes:

- **Clean separation of concerns** — UI, data fetching, transformations, and state management are isolated
- **Backend independence** — Business logic is portable to alternative data sources via adapter pattern
- **Performance optimization** — Parallel data fetching and TTL-based HTTP caching minimize API calls
- **Maintainability** — Declarative RxJS pipelines and explicit data transformation layers

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Angular UI Components                     │
│  (Pages: Landing, About | Widgets: Cards, Header, Footer)   │
└────────────────────┬────────────────────────────────────────┘
                     │ (injects + subscribes)
                     ↓
┌─────────────────────────────────────────────────────────────┐
│            ItemsRepositoryService (State Manager)            │
│   • Holds collections (publications, events, posts, etc.)   │
│   • Orchestrates multi-stage data loading                   │
│   • Exposes getters: getPosts(), getEvents(), etc.         │
└───┬────────────────────┬────────────────────────────────────┘
    │                    │
    ↓ (calls)           ↓ (calls)
┌──────────────┐   ┌──────────────────┐
│ ApiService   │   │ MapperService    │
│              │   │                  │
│ Raw HTTP GET │   │ DTO → Domain     │
│ operations   │   │ model transforms │
│ to WordPress │   │ & relationship   │
│ REST API     │   │ flattening       │
└──────────────┘   └──────────────────┘
    ↓                    │
┌──────────────┐         ↓
│ Cache        │   ┌──────────────────┐
│ Interceptor  │   │ DecoderService   │
│              │   │                  │
│ HTTP get     │   │ ID extraction &  │
│ caching via  │   │ name resolution  │
│ localStorage │   └──────────────────┘
└──────────────┘
    ↓
┌──────────────┐
│ WordPress    │
│ REST API     │
│ (fsr.eui.eu) │
└──────────────┘
```

---

## Core Layers

### 1. UI Layer (Components)

**Location**: `src/app/components/`

**Responsibility**: Display content, handle user interactions, delegate data fetching to services.

**Key Files**:
- `pages/page-container/` — Root container; initializes data loading
- `pages/page-view/` — Landing page with publications, events, posts, CTA sections
- `pages/page-about/` — About page with tabbed content
- `widgets/header/`, `widgets/footer/` — Shared layout components
- `widgets/display-*/` — Generic card display components

**Pattern**: All components are **standalone** (Angular 19+ API). No shared NgModule. Components receive data via `@Input()` and emit events via `@Output()`.

**Data Access**: Components inject `ItemsRepositoryService` and consume data via public getters:

```typescript
constructor(public repository: ItemsRepositoryService) {}

ngOnInit() {
  this.repository.load();  // Trigger data loading
  this.posts = this.repository.getPosts();  // Get current state
}
```

---

### 2. Repository Service (Orchestrator & State Manager)

**Location**: `src/app/services/items-repository.service.ts`

**Responsibility**: 
- Hold application state (collections, hero, about content)
- Orchestrate multi-stage data loading using RxJS
- Provide public getters for component consumption
- Implement conditional loading (avoid redundant fetches)

**Key Methods**:
- `load()` — Initiates all data loading sequences (called once per app run)
- `loadPublications()`, `loadEvents()`, `loadPosts()`, `loadAdvertisings()`, `loadPages()` — Each follows multi-stage pattern
- `getPosts()`, `getEvents()`, `getPublications()`, `getAdvertisings()` — State accessors
- `goToPage(pageName)` — Updates current page context for header rendering

**State Held**:
```typescript
private events: Event[] = [];
private publications: Publication[] = [];
private posts: Post[] = [];
private advertisings: Advertising[] = [];
private about: AboutModel;
private hero: HeroModel;
private currentPage: string = "Landing";
```

**Multi-Stage Loading Pattern** (Example: `loadPublications()`):

```
Stage 1: Fetch main DTOs + extract relationship IDs
         ↓ switchMap
Stage 2: Fetch all related data in parallel (forkJoin)
         - media: featured_media IDs
         - tags: tag IDs
         - categories: category IDs
         - people: author/editor IDs
         ↓ switchMap
Stage 3: Optionally fetch nested relationships
         - peopleMedia: profile images for authors/editors
         ↓ tap
Stage 4: Map DTOs to domain models and store in state
         this.publications = this.mapperService.fromPublicationDtoList(...)
```

**Why This Pattern?**
- Eliminates **N+1 queries** by batching relationship fetches
- WordPress API requires `include` param with comma-separated IDs
- All parallel requests use `forkJoin` for performance
- Data transformations happen only in final `tap` stage

**Error Handling**: Each `load()` method subscribes with error handler that logs to console. No retry logic currently implemented.

---

### 3. API Service (HTTP Interface)

**Location**: `src/app/services/api.service.ts`

**Responsibility**: Raw HTTP GET calls to WordPress REST API endpoints. Returns observables of DTOs.

**Key Methods**:
- `getPubblications()` — GET `/publication?tags={projectTagId}`
- `getEvents()` — GET `/event?tags={projectTagId}`
- `getPosts()` — GET `/posts?tags={projectTagId}`
- `getAdvertisings()` — GET `/advertising?tags={projectTagId}`
- `getPages()` — GET `/pages/49631` (hardcoded page ID)
- `getList(listName, include)` — GET `/{listName}?include={ids}` (generic for tags, categories, types)
- `getPeopleList(include)` — GET `/people?include={ids}` (special handling)

**Configuration Injection**: All methods read `apiBaseUrl` and `projectTagId` from `APP_EXTERNAL_CONFIG` token.

**Caching**: All GET responses are automatically cached by `cachingInterceptor` (see Caching section below).

---

### 4. Mapper Service (Data Transformation)

**Location**: `src/app/services/mappers/mapper-service.ts`

**Responsibility**: Transform raw WordPress DTOs into UI-ready domain models by flattening nested relationships.

**Key Methods**:
- `fromEventDtoList(dtos, types, media)` → `Event[]`
- `fromPublicationDtoList(dtos, media, tags, categories, people, peopleMedia)` → `Publication[]`
- `fromPostDtoList(dtos, media, categories, typepost)` → `Post[]`
- `fromAdvertisingDtoList(dtos, media)` → `Advertising[]`
- `fromPagesDtoToHero(dto, media)` → `HeroModel`
- `fromPagesDtoToAbout(dto)` → `AboutModel`

**Transformation Example** (simplified):

```typescript
fromPublicationDtoList(
  dtos: PublicationDto[],
  media: TaxonomyDto[],
  tags: TaxonomyDto[],
  categories: TaxonomyDto[],
  people: PeopleDto[],
  peopleMedia: TaxonomyDto[]
): Publication[] {
  return dtos.map(dto => new Publication(
    dto.id,
    this.decoderService.decodeHtmlEntities(dto.title.rendered),
    this.decoderService.extractPlainTextPreview(dto.content.rendered),
    dto.link,
    this.resolveMediaUrl(dto.featured_media, media),
    this.decoderService.decodeIdsToNames(dto.tags, tags),
    this.decoderService.decodeIdsToNames(dto.categories, categories),
    dto.acf['pub-type'],
    this.resolvePeople(dto.acf.authors_relationship, people, peopleMedia)
  ));
}
```

**Key Responsibilities**:
- Decode HTML entities in titles
- Extract plain text from HTML content (150 char truncation)
- Resolve media IDs to full URLs
- Resolve people IDs to full Person objects with images
- Resolve taxonomy IDs to names and links

---

### 5. Decoder Service (Utility Functions)

**Location**: `src/app/services/mappers/decoder-service.ts`

**Responsibility**: Provide utility functions for data transformation and formatting.

**Key Methods**:
- `extractUniqueAsString<T>(items, selector)` — Generic ID extractor; returns comma-separated CSV of unique values
- `extractPeopleFeaturedMediaAsString(people)` — Special case for extracting people profile image IDs
- `decodeIdsToNames(ids[], taxonomy[])` — Map ID array to name array
- `decodeIdToName(id, taxonomy)` — Map single ID to name
- `extractPlainTextPreview(html, maxLength)` — Strip HTML, limit length, add ellipsis
- `formatDateShort(dateIso)` — Format ISO date to "DD Mmm YYYY"
- `decodeHtmlEntities(text)` — Decode HTML entities like `&nbsp;` to spaces

**Critical for Relationship Resolution**: `extractUniqueAsString()` is used in every multi-stage load method to build the `include` parameter for batch fetches.

Example from `loadPublications()`:
```typescript
const peopleIdsString = this.decoderService.extractUniqueAsString(
  dtos,
  dto => [
    ...(dto.acf.authors_relationship ?? []),
    ...(dto.acf.editors_relationship ?? [])
  ]
);
return forkJoin({
  dtos: of(dtos),
  people: this.api.getPeopleList(peopleIdsString)  // Fetch all people in one call
});
```

---

## Data Models

### Domain Models vs. DTOs

**DTOs** (in `src/app/models/api/`): Raw WordPress REST response structure with nested relationships and ACF fields.

Example: `PublicationDto` contains:
- `title.rendered` (nested)
- `content.rendered` (nested)
- `acf.authors_relationship[]` (array of IDs, not resolved)
- `featured_media` (ID only, not resolved)

**Domain Models** (in `src/app/models/`): UI-ready, flattened structure with resolved relationships.

Example: `Publication` extends `CardModel` and adds:
- `pubType?: string` (resolved from `acf['pub-type']`)
- `people?: People[]` (fully resolved Person objects, not just IDs)

**Base Model**: `CardModel` (abstract) provides common fields for all content types:
```typescript
abstract class CardModel {
  id: number;
  title: string;
  description: string;
  link: string;
  image?: string;
  tags?: string[];
  categories?: string[];
  date?: string;
  meta?: any;
}
```

**Concrete Models**: `Publication`, `Event`, `Post`, `Advertising` all extend `CardModel`.

---

## Configuration Management

**Location**: `src/app/app.config.token.ts` (interface), `src/assets/config.json` (runtime values)

**Injection Token**: `APP_EXTERNAL_CONFIG` — Dependency injection approach for configuration.

**Bootstrap Flow** (`src/main.ts`):
1. Fetch `config.json` asynchronously
2. Parse JSON configuration
3. Bootstrap Angular app with config as provider
4. Fallback to default bootstrap if config load fails

**Config Properties**:
```typescript
export interface ExternalConfig {
  Version: string;                    // App version identifier
  apiBaseUrl: string;                 // WordPress API base URL
  projectTagId: number;               // Tag ID for filtering (2317=prod, 1409=test)
  cacheTTLminutes: number;            // Cache validation window (default: 240 min)
  defaultImage: string;               // Fallback image URL
  eventsLink: string;                 // External link to events page
  publicationsLink: string;           // External link to publications page
  postsLink: string;                  // External link to posts page
  authUrl: string;                    // TODO: Remove (legacy, no longer used)
  username: string;                   // TODO: Remove (legacy, no longer used)
  password: string;                   // TODO: Remove (legacy, no longer used)
}
```

**Usage in Services**:
```typescript
constructor(private api: ApiService) {
  this.config = inject(APP_EXTERNAL_CONFIG);
}

// Used to construct API URLs
this.http.get<PublicationDto[]>(
  this.config.apiBaseUrl + 'wp-json/wp/v2/publication'
);
```

---

## Caching Strategy

### Mechanism: HTTP Interceptor

**Location**: `src/app/interceptors/caching-interceptor.ts`

**Responsibility**: Transparently cache GET responses with TTL validation.

**Flow**:
1. **GET request initiated** → Interceptor intercepts before network
2. **Cache check** → Look up URL in localStorage
3. **If cached AND valid TTL** → Return cached response immediately (no network call)
4. **If expired or not cached** → Proceed to network request
5. **On successful response** → Store in cache with expiry timestamp
6. **Return response** — To requesting service

**Cache Storage** (`src/app/services/cache-service.ts`):

```typescript
put(key: string, body: any): void {
  const data = {
    body,
    expiry: Date.now() + this.config.cacheTTLminutes * 60 * 1000
  };
  localStorage.setItem(key, JSON.stringify(data));
}

get(key: string): any | null {
  const raw = localStorage.getItem(key);
  if (!raw) return null;
  const data = JSON.parse(raw);
  if (Date.now() > data.expiry) {
    localStorage.removeItem(key);
    return null;  // Expired
  }
  return data;  // Still valid
}
```

**Cache Key**: Full URL with query parameters (e.g., `/publication?tags=2317`)

**TTL Configuration**: Controlled via `config.json` (`cacheTTLminutes`).
- Default: 240 minutes (4 hours)
- Can be adjusted per environment without code changes

**Benefits**:
- No explicit cache management in data services
- Automatic deduplication of redundant requests
- Browser storage survives page reloads
- Transparent to components and services

---

## RxJS Patterns

### Operators Used

**`switchMap`** — Load sequentially; abandon previous request if new one arrives
```typescript
switchMap(dtos => {
  // Extract IDs from dtos, then fetch related data
  const ids = this.decoderService.extractUniqueAsString(dtos, ...);
  return forkJoin({ dtos: of(dtos), related: this.api.getList(...) });
})
```

**`forkJoin`** — Wait for all parallel requests to complete
```typescript
forkJoin({
  media: this.api.getList('media', mediaIds),
  tags: this.api.getList('tags', tagIds),
  categories: this.api.getList('categories', catIds)
})
```

**`of`** — Wrap existing data as Observable (useful when combining immediate + async data)
```typescript
forkJoin({
  dtos: of(dtos),  // Already have data; wrap it
  media: this.api.getList(...)  // Async request
})
```

**`tap`** — Side effect (update component state); doesn't transform data
```typescript
tap(({ dtos, media, tags }) => {
  this.publications = this.mapperService.fromPublicationDtoList(dtos, media, tags);
})
```

### Error Handling

Currently minimal; each load method has basic error subscriber:
```typescript
.subscribe({
  error: error => {
    console.error('Errore caricamento publications', error);
  }
});
```

**TODO**: Implement retry logic, fallback values, and user-facing error messages.

---

## Routing & Page Context

**Location**: `src/app/app.routes.ts`

**Routes**:
- `/` → `PageViewComponent` (Landing page)
- `/about` → `PageAboutComponent` (About page)

**Fragment Navigation**: URL fragments for scroll-to-section behavior
- Example: `/#publications` scrolls to publications section
- Implemented in `PageViewComponent` using `ActivatedRoute.fragment`

**Page Context Tracking**:
- `ItemsRepositoryService.currentPage` tracks which page is active
- Used by `getHeader()` to return context-aware header data
- Landing: Full hero title/description
- About: Simple "About" header

---

## File Structure

```
src/app/
├── app.component.ts                        # Root component
├── app.routes.ts                           # Route definitions
├── app.config.ts                           # Angular config (providers)
├── app.config.token.ts                     # Injection token & interface
│
├── services/
│   ├── api.service.ts                      # HTTP calls to WordPress
│   ├── items-repository.service.ts         # State orchestration
│   ├── cache-service.ts                    # localStorage cache ops
│   │
│   └── mappers/
│       ├── mapper-service.ts               # DTO → domain model
│       └── decoder-service.ts              # Utility transformations
│
├── interceptors/
│   └── caching-interceptor.ts              # HTTP cache interceptor
│
├── models/
│   ├── card.model.ts                       # Base model (abstract)
│   ├── publication.model.ts                # Domain: Publication
│   ├── event.model.ts                      # Domain: Event
│   ├── post.model.ts                       # Domain: Post
│   ├── advertising.model.ts                # Domain: Advertising
│   ├── hero.model.ts                       # Domain: Hero section
│   ├── about.model.ts                      # Domain: About section
│   ├── people.model.ts                     # Domain: Person (author/editor)
│   │
│   └── api/
│       ├── event-dto.model.ts              # DTO: Event (WordPress response)
│       ├── pubblication-dto.model.ts       # DTO: Publication (WordPress response)
│       ├── post-dto.model.ts               # DTO: Post (WordPress response)
│       ├── advertising-dto.ts              # DTO: Advertising (WordPress response)
│       ├── pages-dto.model.ts              # DTO: Page (WordPress response)
│       ├── people-dto.model.ts             # DTO: Person (WordPress response)
│       └── taxonomy-dto.model.ts           # DTO: Generic taxonomy (tags, categories, etc.)
│
└── components/
    ├── pages/
    │   ├── page-container/                 # Root container (header/footer)
    │   ├── page-view/                      # Landing page
    │   └── page-about/                     # About page
    │
    └── widgets/
        ├── header/                         # Header widget
        ├── footer/                         # Footer widget
        ├── display-event/                  # Event card display
        ├── display-post/                   # Post card display
        ├── display-publication/            # Publication card display
        ├── display-item/                   # Generic card display
        ├── call-to-action/                 # CTA/Advertising widget
        ├── slide-show/                     # Carousel (Swiper)
        └── two-columns/                    # Layout widget
```

---

## Performance Considerations

### API Call Optimization

**Batch Fetching**: Relationship data fetched in a single call per type
```
❌ Bad:
forEach(tag => api.getTag(tag))  // N API calls

✔ Good:
api.getList('tags', '1,2,3,4,5')  // 1 API call
```

**Parallel Requests**: Related data fetched simultaneously
```typescript
forkJoin({
  media: api.getList('media', ids),    // All parallel
  tags: api.getList('tags', ids),
  categories: api.getList('categories', ids)
})
```

**Conditional Loading**: App startup skips loading if data already exists
```typescript
load() {
  if (this.events.length > 0 && this.posts.length > 0 && ...) {
    return;  // Already loaded
  }
  this.loadPages();
  // ... etc
}
```

### Caching Strategy

- **HTTP Interceptor**: Automatically caches all GET responses
- **TTL-based validation**: Configurable via `config.json`
- **localStorage persistence**: Survives page reloads
- **No manual cache invalidation**: TTL handles expiration

---

## Extension Points

### Adding a New Content Type

1. **Create API endpoint** in `ApiService.getXxx(): Observable<XxxDto[]>`
2. **Define DTO interface** in `models/api/xxx-dto.ts`
3. **Define domain model** in `models/xxx.model.ts` (extends `CardModel`)
4. **Create mapper** in `MapperService.fromXxxDtoList(dtos, ...): Xxx[]`
5. **Add load method** in `ItemsRepositoryService.loadXxx()` following multi-stage pattern
6. **Add state storage** in `ItemsRepositoryService` (private array)
7. **Add getter** `getXxx(): Xxx[]` in `ItemsRepositoryService`
8. **Call in load()** — Add `this.loadXxx()` to main `load()` method

### Switching Backend Implementation

The adapter pattern enables backend replacement:

1. Create new `ThirdPartyAdapter` implementing same interface as `ApiService`
2. Create mapping layer for transformer: `ThirdPartyMapper` → domain models
3. Inject new adapter in `ItemsRepositoryService` (via constructor DI)
4. No component code needs to change

---

## Known Limitations & TODOs

- **No explicit error recovery** — Failed API calls not retried
- **Single instance loading** — No reload/refresh mechanism
- **Configuration cleanup** — Legacy `authUrl`, `username`, `password` fields unused (should be removed)
- **No pagination** — All content loaded at once
- **No search/filter** — Client-side filtering would require filtering in components
- **Limited accessibility** — ARIA labels not comprehensive

---

## Testing

**Test Files Location**: `**/*.spec.ts`

**Current Test Coverage**:
- `api.service.spec.ts` — HTTP service tests
- `cache-service.spec.ts` — Cache behavior tests
- `decoder-service.spec.ts` — Utility function tests
- `mapper-service.spec.ts` — Data transformation tests
- `items-repository.service.spec.ts` — State management tests
- Component spec files colocated with source

**Testing Strategy**: Isolated unit tests; mock HTTP responses and cache layer.

---

## Related Documentation

- **Requirements**: See `/docs/01-requirements/technical-requirements.md`
- **Development Guidelines**: See `/docs/02-guidelines/resources.md`
- **AI Coding Guide**: See `/AGENTS.md` (at project root)


