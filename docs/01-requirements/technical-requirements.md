# LIFE NETS – Technical Requirements

---

## 1. Technology Stack

* **Frontend:** Angular
* **Backend (initial):** WordPress REST API (`fsr.eui.eu`)
* **Authentication:** JWT (JSON Web Token)
* **Architecture approach:** API-driven (headless CMS)

---

## 2. Environment Configuration

The application must be fully **configuration-driven**.

```ts
export const environment = {
  production: false,
  apiBaseUrl: 'https://fsr.eui.eu/wp-json/wp/v2',
  authUrl: 'https://fsr.eui.eu/wp-json/jwt-auth/v1/token',
  projectTagId: 1409 // TEST: 1409 | PROD: 2317
};
```

### Tag Strategy

* **Production:** LifeNets (ID 2317)
* **Test:** LifeCoase (ID 1409)

⚠️ Tag ID must NOT be hardcoded inside services or components.

---

## 3. Authentication (JWT)

The application uses the official WordPress plugin:

👉 https://it.wordpress.org/plugins/jwt-authentication-for-wp-rest-api/

This reference must be used to understand available endpoints and request examples.

---

### 3.1 Login

```http
POST /wp-json/jwt-auth/v1/token
```

**Payload**

```json
{
  "username": "...",
  "password": "..."
}
```

**Response**

```json
{
  "token": "...",
  "user_email": "...",
  "user_display_name": "..."
}
```

---

### 3.2 Token Usage

All authenticated requests must include:

```
Authorization: Bearer {JWT_TOKEN}
```

---

### 3.3 Token Validation

```http
POST /wp-json/jwt-auth/v1/token/validate
```

---

### 3.4 Token Management

* Default expiration: **7 days**
* Store token securely (localStorage or memory)
* Validate token at application startup

---

## 4. API Usage Rule

All content requests must include:

```
?tags={projectTagId}
```

---

## 5. Publications

### Endpoint

```
GET /publication?tags={tagId}
```

### Fields Mapping

| Field       | Source                                     |
| ----------- | ------------------------------------------ |
| link        | `link`                                     |
| title       | `title.rendered`                           |
| description | `content.rendered` (truncate to 150 chars) |
| tags        | `tags[]`                                   |
| categories  | `categories[]`                             |
| type        | `acf.pub-type`                             |
| date        | `acf.date_accessioned`                     |
| authors     | `acf.authors_relationship[]`               |
| editors     | `acf.editors_relationship[]`               |

---

### Additional Data Fetching

**Tags**

```
GET /tags?include=id1,id2,id3
```

**Categories**

```
GET /categories?include=id1,id2,id3
```

**People**

```
GET /people/{id}
```

**Media**

```
GET /media/{id}
```

Image fallback:

```
thumbnail → source_url
```

---

## 6. Events

### Endpoint

```
GET /event?tags={tagId}
```

### Fields Mapping

| Field       | Source                        |
| ----------- | ----------------------------- |
| link        | `link`                        |
| title       | `title.rendered`              |
| description | `content.rendered` (truncate) |
| type        | `event_type[]`                |
| date        | `acf.MainStart`               |
| location    | `acf.location`                |
| image       | `featured_media`              |

---

### Event Type

```
GET /event_type/{id}
```

---

## 7. Posts

### Endpoint

```
GET /posts?tags={tagId}
```

### Fields Mapping

| Field       | Source                                               |
| ----------- | ---------------------------------------------------- |
| link        | `link`                                               |
| title       | `title.rendered`                                     |
| description | `excerpt.rendered` OR fallback to `content.rendered` |
| tags        | `tags[]`                                             |
| categories  | `categories[]`                                       |
| type        | `typepost[]`                                         |
| image       | `featured_media`                                     |

---

## 8. Advertising (CTA)

### Endpoint

```
GET /advertising?tags={tagId}
```

### Fields Mapping

| Field       | Source            |
| ----------- | ----------------- |
| date        | `date`            |
| image       | `featured_media`  |
| title       | `acf.title`       |
| description | `acf.description` |
| cta_label   | `acf.cta_label`   |
| cta_link    | `acf.cta_link`    |

---

## 9. Media Handling

### Endpoint

```
GET /media/{id}
```

### Priority Logic

1. `media_details.sizes.thumbnail`
2. fallback → `source_url`

---

## 10. Page Content (Hero & Static Sections)

### Endpoint

```
GET /pages/49631
```

---

### Purpose

This endpoint provides the **main static content of the landing page**, including:

- Hero section content
- About section content
- Additional structured content (tabs, texts, etc.)

---

### Fields Mapping

| Field | Source |
|------|--------|
| hero_title | `acf.hero.title` |
| hero_description | `acf.hero.description` |
| hero_cta_text | `acf.hero.button_link_text` |
| hero_cta_link | `acf.hero.button_link` |
| about_left_text | `acf.about_page.left_text` |
| about_right_text | `acf.about_page.right_text` |
| about_content | `acf.about_page.content` |
| about_tabs | `acf.about_page.tabs` |
| hero_background | `featured_media` |

---

### Media Handling

To retrieve the hero background image (use the fullsize resolution):

```
GET /media/{featured_media}
```

---

## 11. Data Normalization (MANDATORY)

WordPress responses must NOT be used directly in UI components.

Define a unified model:

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

All content types must be mapped into this structure.

---

## 12. API Architecture (CRITICAL)

### Required Services

* AuthService
* PublicationService
* EventService
* PostService
* AdvertisingService
* MediaService
* TaxonomyService

---

### Rule

❌ No API calls inside components
✔ All API calls must go through services

---

## 13. Backend Abstraction (SCALABILITY)

The application must support future backend replacement.

### Adapter Pattern

```ts
interface ContentAdapter {
  getPublications();
  getEvents();
  getPosts();
  getAdvertising();
}
```

Example:

```ts
class WordpressAdapter implements ContentAdapter {}
```

---

## 14. Performance and Caching Guidelines

### General Rules

* Batch taxonomy calls:

  ```
  /tags?include=id1,id2,id3
  /categories?include=id1,id2,id3
  ```
* Avoid duplicate API calls
* Use lazy loading for sections
* Implement caching at service or adapter level (NOT in components)

---

### Recommended Caching Policy

#### Cache Duration

**2–3 hours (low volatility data):**

* tags
* categories
* event types
* post types
* media
* people

**15–60 minutes (dynamic content):**

* publications
* posts
* events
* advertising

---

### Caching Rules

* Cache must be configurable (TTL-based)
* Cache should be enabled at least in production
* Token must NOT be cached as content
* Cache must be invalidated when:

  * TTL expires
  * user logs out
  * authentication fails

---

### Recommended Implementation

* Use a caching layer inside services or adapter
* Use in-memory cache or localStorage (depending on needs)
* Centralize caching logic (avoid duplication across services)

---

## 15. UI Behaviour Requirements

Cards must:

* Display max 150 characters
* Always include link to original content
* Use thumbnail images with fallback

Main sections:

* Publications
* Events
* Posts
* CTA

---

## 16. Error Handling

The application must handle:

* Missing images → fallback
* Missing excerpt → fallback to content
* API errors → graceful UI (no crash)
* Authentication errors → redirect to login

---

## 17. Future-Proof Requirements

The system must support:

* Multiple projects (config-based)
* Multiple APIs (not only WordPress)
* Filters and search
* Rich components (dashboards, charts)

---

## 18. Development Principles

The implementation must ensure:

* Clean architecture
* Reusable components
* Clear separation between:

  * UI
  * API layer
  * business logic
* Minimal coupling with WordPress schema

---

## 19. Key Architectural Constraint

The frontend must be designed as a **content aggregation layer**, not as a WordPress-dependent frontend.

This means:

* WordPress is only a data source
* Business logic must remain independent
* UI must rely on normalized models, not raw API responses

```
