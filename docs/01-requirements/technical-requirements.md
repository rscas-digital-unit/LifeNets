# LIFE NETS – Technical Requirements

---

## 1. Technology Stack

* **Frontend:** Angular 19+
* **Backend (current):** WordPress REST API (`fsr.eui.eu`)
* **Frontend Router:** Angular Router for client-side navigation
* **HTTP Client:** Angular's `HttpClient` with interceptor-based caching
* **State Management:** Service-based (no external state library)
* **CSS Framework:** Bootstrap 5.3
* **UI Components:** Swiper (carousels), Angular standalone components
* **Architecture approach:** API-driven headless CMS (configuration-based)

---

## 2. Environment Configuration

The application must be fully **configuration-driven**.

```ts
export const environment = {
  production: false,
  apiBaseUrl: 'https://fsr.eui.eu/wp-json/wp/v2',
  projectTagId: 1409 // TEST: 1409 | PROD: 2317
};
```

### Tag Strategy

* **Production:** LifeNets (ID 2317)
* **Test:** LifeCoase (ID 1409)

⚠️ Tag ID must NOT be hardcoded inside services or components.

---

## 3. API Usage Rule

All content requests must include:

```
?tags={projectTagId}
```

---

## 4. Publications

### Endpoint

```
GET /publication?tags={tagId}
```

### Response

All content requests return a paginated array of publication objects with the following fields available for mapping:

| Field       | Source                                     | Notes                          |
| ----------- | ------------------------------------------ | ------------------------------ |
| link        | `link`                                     | URL to original publication    |
| title       | `title.rendered`                           | Publication title              |
| description | `content.rendered`                         | Full content (truncate to 150 chars in UI) |
| tags        | `tags[]`                                   | Tag IDs (fetch full objects separately) |
| categories  | `categories[]`                             | Category IDs (fetch separately) |
| type        | `acf.pub-type`                             | Publication type from ACF      |
| date        | `acf.date_accessioned`                     | Publication date               |
| authors     | `acf.authors_relationship[]`               | Author IDs (fetch via people endpoint) |
| editors     | `acf.editors_relationship[]`               | Editor IDs (fetch via people endpoint) |
| image       | `featured_media`                           | Media ID (fetch via media endpoint) |

### Related Data Fetching

The following endpoints must be called to resolve relationships:

**Tags**

```
GET /tags?include=id1,id2,id3
```

Fetch using comma-separated tag IDs from publication responses.

**Categories**

```
GET /categories?include=id1,id2,id3
```

**People**

```
GET /people?include=id1,id2,id3
```

Fetch using author and editor relationship IDs. Each person object includes `featured_media` for their profile image.

**Media**

```
GET /media?include=id1,id2,id3
```

Fetch using featured_media IDs from publications and people. 

**Image Priority Logic:**
1. Check `media_details.sizes.thumbnail.source_url`
2. Fallback to `source_url`

---

## 5. Events

### Endpoint

```
GET /event?tags={tagId}
```

### Response

| Field       | Source                        | Notes |
| ----------- | ----------------------------- | ----- |
| link        | `link`                        | URL to original event |
| title       | `title.rendered`              | Event title |
| description | `content.rendered`            | Full content (truncate to 150 chars in UI) |
| type        | `event_type[]`                | Event type IDs (fetch full objects separately) |
| date        | `acf.MainStart`               | Event start date |
| location    | `acf.location`                | Event location text |
| image       | `featured_media`              | Media ID (fetch via media endpoint) |

### Related Data Fetching

**Event Types**

```
GET /event_type?include=id1,id2,id3
```

Fetch using comma-separated event_type IDs from event responses.

**Media**

```
GET /media?include=id1,id2,id3
```

Fetch using featured_media IDs from events.

---

## 6. Posts

### Endpoint

```
GET /posts?tags={tagId}
```

### Response

| Field       | Source                                               | Notes |
| ----------- | ---------------------------------------------------- | ----- |
| link        | `link`                                               | URL to original post |
| title       | `title.rendered`                                     | Post title |
| description | `excerpt.rendered` OR fallback to `content.rendered` | Post excerpt or content (truncate to 150 chars in UI) |
| tags        | `tags[]`                                             | Tag IDs (fetch full objects separately) |
| categories  | `categories[]`                                       | Category IDs (fetch separately) |
| type        | `typepost[]`                                         | Post type IDs (fetch full objects separately) |
| image       | `featured_media`                                     | Media ID (fetch via media endpoint) |

### Related Data Fetching

**Tags**

```
GET /tags?include=id1,id2,id3
```

**Categories**

```
GET /categories?include=id1,id2,id3
```

**Post Types (typepost)**

```
GET /typepost?include=id1,id2,id3
```

**Media**

```
GET /media?include=id1,id2,id3
```

---

## 7. Advertising (CTA)

### Endpoint

```
GET /advertising?tags={tagId}
```

### Response

| Field       | Source            | Notes |
| ----------- | ----------------- | ----- |
| date        | `date`            | Publication date |
| image       | `featured_media`  | Media ID (fetch via media endpoint) |
| title       | `acf.title`       | Advertising title from ACF |
| description | `acf.description` | Advertising description from ACF |
| cta_label   | `acf.cta_label`   | Call-to-action button label |
| cta_link    | `acf.cta_link`    | Call-to-action URL |

### Related Data Fetching

**Media**

```
GET /media?include=id1,id2,id3
```

Fetch using featured_media IDs from advertising objects.

---

## 8. Media Handling

### Endpoint

```
GET /media?include=id1,id2,id3
```

### Image Resolution Priority

When retrieving images, use the following priority:

1. **Thumbnail**: `media_details.sizes.thumbnail.source_url` (if available)
2. **Fallback**: `source_url` (full resolution)

---

## 9. Page Content (Hero & Static Sections)

### Endpoint

```
GET /pages/49631?tags={tagId}
```

### Purpose

This endpoint provides the **main static content of the landing page**, including:

- Hero section content and background image
- About section content, tabs, and text blocks
- Other structured content for the landing page

### Response Fields

| Field | Source | Notes |
|------|--------|-------|
| hero_title | `acf.hero.title` | Main hero title |
| hero_description | `acf.hero.description` | Hero subtitle/description |
| hero_cta_text | `acf.hero.button_link_text` | Call-to-action button label |
| hero_cta_link | `acf.hero.button_link` | Call-to-action button URL |
| hero_background | `featured_media` | Media ID for hero background image |
| about_left_text | `acf.about_page.left_text` | About section left column text |
| about_right_text | `acf.about_page.right_text` | About section right column text |
| about_content | `acf.about_page.content` | About section main content |
| about_tabs | `acf.about_page.tabs` | Array of tab objects with `label` and `text` fields |

### Related Data Fetching

**Media**

```
GET /media?include={featured_media_id}
```

Fetch the hero background image using the `featured_media` ID from the page response. Use full-size resolution for banner images.

---

## 10. Data Normalization (MANDATORY)

WordPress REST API responses must NOT be used directly in UI components.

### Requirement

All API responses must be mapped to **domain-specific models** before being consumed by components. Raw DTO objects stay within the service layer.

### Example Domain Model

```ts
interface CardModel {
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

### Mapping Responsibility

Each content type (Publications, Events, Posts, Advertising) must be transformed from its DTO form to a normalized model:

- **DTO** (in `models/api/`): Raw WordPress response structure with nested relationships and ACF fields
- **Domain Model** (in `models/`): Flattened, UI-ready structure with resolved relationships

The `MapperService` handles this transformation using fully resolved data (media, people, taxonomies).

---

## 11. Architecture Pattern (CRITICAL)

### Service Layer Organization

The application implements a three-layer architecture for API data handling:

1. **API Service** (`ApiService`): Raw HTTP calls to WordPress REST API
2. **Mapper Service** (`MapperService`): Transforms DTOs to domain models
3. **Repository Service** (`ItemsRepositoryService`): Orchestrates multi-stage data loading and state management

### Key Rules

- ❌ **No direct API calls in components** — All HTTP requests go through services
- ✔ **Unidirectional data flow** — Components consume data through repository getters
- ✔ **Lazy relationship resolution** — Related data (media, people, taxonomies) fetched in parallel via `forkJoin`

### Multi-Stage Loading Pattern

For complex entities with relationships (publications, events), use this pattern:

```
Stage 1: Fetch main DTOs + extract relationship IDs
          ↓
Stage 2: Fetch all related data in parallel (media, taxonomies, people)
          ↓
Stage 3: Map and store normalized models
```

This minimizes N+1 queries by batching relationship fetches.

---

## 12. Backend Abstraction (SCALABILITY)

The application must support **future backend replacement** without rewriting UI logic.

### Adapter Pattern

Define a content interface independent of WordPress:

```ts
interface ContentAdapter {
  getPublications(): Observable<Publication[]>;
  getEvents(): Observable<Event[]>;
  getPosts(): Observable<Post[]>;
  getAdvertising(): Observable<Advertising[]>;
  getPages(): Observable<PageContent>;
}
```

**Current Implementation**: `WordpressAdapter` (encapsulated in `ApiService` and `MapperService`)

**Future Support**: Implement new adapters (e.g., `RestfulCmsAdapter`, `GraphQLAdapter`) without changing component code.

---

## 13. Performance and Caching

### Strategy

* **Batch API calls** for related data using comma-separated ID parameters
  ```
  /tags?include=id1,id2,id3
  /media?include=id1,id2,id3
  /people?include=id1,id2,id3
  ```
* **Parallel fetching** using RxJS `forkJoin` to prevent waterfall requests
* **Automatic HTTP caching** via interceptor on all GET requests
* **TTL-based cache invalidation** configurable per environment

### Recommended Caching Policy

#### Short TTL (15–60 minutes for dynamic content)
* Publications
* Posts
* Events
* Advertising

#### Long TTL (2–3 hours for static data)
* Tags
* Categories
* Event types
* Post types
* Media
* People
* Pages (hero, about content)

### Cache Implementation

- **Mechanism**: HTTP interceptor caches GET responses in `localStorage` with TTL timestamps
- **Configuration**: Set `cacheTTLminutes` in `config.json` (default: 240 minutes)
- **Automatic Storage**: All GET responses cached immediately upon successful fetch
- **Automatic Retrieval**: Cache checked before network request; returned if TTL valid
- **Expiration**: Stale cache entries removed on next access attempt

### Cache Invalidation

Cache is automatically invalidated when:
* TTL expires
* Application reloads (stale entries removed on access)
* Explicit localStorage clearing (developer action)

---

## 14. UI Behavior Requirements

### Content Display

* Truncate descriptions to max **150 characters** in list views
* Always include **link to original content**
* Use **thumbnail images with fallback** to default image when unavailable

### Main Sections

The landing page includes the following primary sections:

1. **Hero Section** — Title, description, CTA (from page endpoint)
2. **Publications** — Publication cards with metadata
3. **Events** — Event cards with date and location
4. **Posts** — Blog post cards
5. **Call-to-Action (Advertising)** — Featured promotional content
6. **About Section** — Static content with tabbed interface (from page endpoint)

---

## 15. Error Handling

The application must gracefully handle:

* **Missing images** → Use fallback/default image
* **Missing excerpt or description** → Fallback to content body or placeholder
* **API errors** → Log error, display graceful message, prevent crash
* **Malformed responses** → Use safe property access, provide defaults
* **Network timeouts** → Show cached data if available, user-friendly error message

---

## 16. Future-Proof Requirements

The system must be designed to support:

* **Multiple projects** — Configuration-based project switching without code changes
* **Multiple backends** — Adapter pattern allows different CMS/API sources
* **Content filtering and search** — Repository layer can support query parameters
* **Rich UI components** — Dashboards, charts, advanced analytics
* **Pagination** — WordPress API supports `page` and `per_page` parameters
* **Sorting and ordering** — API supports `orderby` and `order` parameters

---

## 17. Development Principles

Implementation must ensure:

* **Clean Architecture** — Clear separation of concerns across layers
* **Reusable Components** — UI components accept data via `@Input()`, emit events via `@Output()`
* **Explicit Separation**: 
  * **UI Layer** — Standalone Angular components in `src/app/components/`
  * **API Layer** — `ApiService` handles HTTP and DTO responses
  * **Business Logic Layer** — `ItemsRepositoryService` orchestrates data loading and caching
  * **Mapping Layer** — `MapperService` transforms DTOs to domain models
* **Minimal WordPress Coupling** — Business logic independent of REST API structure; adapter pattern enables backend switching

---

## 18. Key Architectural Constraint

The frontend is designed as a **content aggregation and presentation layer**, not as a WordPress-dependent frontend.

### Implications

* **WordPress is only a data source** — Not the application framework
* **Business logic remains independent** — Portable to other backends
* **UI relies on normalized models** — Never directly uses raw API responses
* **Service layer is extensible** — Adapter pattern enables multi-backend support

### Validation

- ✔ Components **never import or use DTOs directly**
- ✔ All data transformations happen in `MapperService`
- ✔ Repository layer exposes only domain models via getter methods
- ✔ If backend changes, only `ApiService` and `MapperService` need modification
