# LifeNets Components

## Purpose

This document catalogs all Angular components in the LifeNets application, their responsibilities, interfaces, and usage patterns.

## Current Implementation

All components are **standalone Angular components** (Angular 19+ API) with explicit imports. No shared NgModule is used.

---

## Page Components

### PageContainerComponent

**Location**: `src/app/components/pages/page-container/`

**Purpose**: Application shell providing consistent header/footer layout across all routes.

**Interface**:
```typescript
@Component({
  selector: 'app-page-container',
  imports: [RouterOutlet, FooterComponent, HeaderComponent],
  template: `
    <app-header></app-header>
    <router-outlet></router-outlet>
    <app-footer></app-footer>
  `
})
```

**Responsibilities**:
- Layout wrapper for all pages
- Initializes data loading: `repository.load()` on `ngOnInit`
- No visual content or styling

**Dependencies**: `ItemsRepositoryService`, `RouterOutlet`, `HeaderComponent`, `FooterComponent`

---

### PageViewComponent

**Location**: `src/app/components/pages/page-view/`

**Purpose**: Landing page displaying all content types in carousel sections.

**Interface**:
```typescript
@Component({
  selector: 'app-page-view',
  imports: [CommonModule, SlideShowComponent, CallToActionComponent],
  template: `...` // Multiple slideshow and CTA sections
})
export class PageViewComponent implements OnInit {
  config = inject(APP_EXTERNAL_CONFIG);
  scrollThreshold = 100;

  constructor(private route: ActivatedRoute, public repository: ItemsRepositoryService) {}

  ngOnInit() {
    this.repository.goToPage("Landing");
    // Fragment navigation setup
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    // Add/remove 'going-down' class to body
  }
}
```

**Responsibilities**:
- Renders landing page content sections
- Handles fragment-based navigation (`/#Events`, `/#Posts`, `/#Publications`)
- Manages scroll-based CSS class for header effects
- Sets page context for header rendering

**Dependencies**: `ItemsRepositoryService`, `APP_EXTERNAL_CONFIG`, `ActivatedRoute`, `SlideShowComponent`, `CallToActionComponent`

---

### PageAboutComponent

**Location**: `src/app/components/pages/page-about/`

**Purpose**: About page with introduction text and tabbed content sections.

**Interface**:
```typescript
@Component({
  selector: 'app-page-about',
  imports: [TwoColumnsComponent],
  template: `
    <div class="container-fluid">
      <p [innerHTML]="repository.getAbout().content"></p>
    </div>
    <app-two-columns [items]="repository.getAbout().tabs"></app-two-columns>
  `
})
export class PageAboutComponent implements OnInit {
  constructor(public repository: ItemsRepositoryService) {}

  ngOnInit() {
    this.repository.goToPage("About");
  }
}
```

**Responsibilities**:
- Displays about page content from WordPress
- Renders tabbed content via `TwoColumnsComponent`
- Sets page context for simplified header

**Dependencies**: `ItemsRepositoryService`, `TwoColumnsComponent`

---

## Widget Components

### HeaderComponent

**Location**: `src/app/components/widgets/header/`

**Purpose**: Navigation header with logo, menu, and hero section.

**Interface**:
```typescript
@Component({
  selector: 'app-header',
  imports: [RouterModule],
  template: `...` // Navigation + hero section
})
export class HeaderComponent {
  constructor(private router: Router, public repository: ItemsRepositoryService) {}

  goToSection(event: Event, targetId: string): void {
    event.preventDefault();
    this.router.navigate(['/'], { fragment: targetId });
  }
}
```

**Template Structure**:
```html
<header class="header">
  <!-- Navigation menu -->
  <nav>
    <a routerLink="/about">About</a>
    <a href="/#Events" (click)="goToSection($event, 'Events')">Events</a>
    <!-- ... more nav items -->
  </nav>
</header>

<div class="Hero">
  <div class="Hero__image" [style.backgroundImage]="'url('+repository.getHeader().image+')'">
    <div class="Hero__texts">
      <h1 [textContent]="repository.getHeader().title"></h1>
      <p [textContent]="repository.getHeader().description"></p>
    </div>
  </div>
</div>
```

**Responsibilities**:
- Logo and navigation menu
- Hero section with dynamic background image and text
- Fragment navigation handling
- Context-aware content via `repository.getHeader()`

**Dependencies**: `ItemsRepositoryService`, `Router`, `RouterModule`

---

### FooterComponent

**Location**: `src/app/components/widgets/footer/`

**Purpose**: Site footer with static content.

**Interface**:
```typescript
@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  // No logic - static content only
}
```

**Responsibilities**:
- Static footer content
- No dynamic behavior or data dependencies

---

### SlideShowComponent

**Location**: `src/app/components/widgets/slide-show/`

**Purpose**: Swiper-based carousel for displaying content cards.

**Interface**:
```typescript
@Component({
  selector: 'app-slide-show',
  imports: [CommonModule, DisplayItemComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // For swiper-container
  template: `...`
})
export class SlideShowComponent implements AfterViewInit, OnChanges {
  @Input() items: CardModel[] = [];
  @Input() sliderName: string = "";
  @Input() buttonText: string = "";
  @Input() buttonLink: string = "";

  @ViewChild('swiperEl') swiperEl!: ElementRef;

  itemsPerpage = 3;
  isBeginning = true;
  isEnd = false;

  ngAfterViewInit() {
    // Initialize swiper navigation state
  }

  ngOnChanges() {
    // Update navigation when items change
  }

  next(): void { /* slide next */ }
  prev(): void { /* slide prev */ }

  getSlidesPerView(): number {
    return window.innerWidth < 768 ? 1.3 : 3;
  }
}
```

**Template Structure**:
```html
<section class="slider-container">
  <div class="slider-header">
    <h2>{{sliderName}}</h2>
    <a [href]="buttonLink" class="btn">{{buttonText}}</a>
  </div>

  <swiper-container [slidesPerView]="getSlidesPerView()">
    <swiper-slide *ngFor="let item of items">
      <app-display-item [item]="item"></app-display-item>
    </swiper-slide>
  </swiper-container>

  <div class="slider-nav">
    <button (click)="prev()" [disabled]="isBeginning">←</button>
    <button (click)="next()" [disabled]="isEnd">→</button>
  </div>
</section>
```

**Responsibilities**:
- Carousel display with navigation controls
- Responsive slides per view (1.3 mobile, 3 desktop)
- Header with section title and "View All" link
- Delegates item rendering to `DisplayItemComponent`

**Dependencies**: `CardModel[]`, `DisplayItemComponent`, Swiper library

---

### CallToActionComponent

**Location**: `src/app/components/widgets/call-to-action/`

**Purpose**: Call-to-action banner with image, text, and link.

**Interface**:
```typescript
@Component({
  selector: 'app-call-to-action',
  imports: [],
  template: `...`
})
export class CallToActionComponent {
  @Input() advertising!: Advertising;
}
```

**Template Structure**:
```html
<div class="Cta">
  <div class="Cta__img">
    <img [src]="advertising.image" alt="Call to action">
  </div>
  <div class="Cta__meta">
    <h3 [textContent]="advertising.title"></h3>
    <p [textContent]="advertising.description"></p>
  </div>
  <div class="Cta__link">
    <a [href]="advertising.link">{{advertising.label}}</a>
  </div>
</div>
```

**Responsibilities**:
- Displays advertising content in banner format
- Three-column layout: image, text, call-to-action button

**Dependencies**: `Advertising` model

---

### TwoColumnsComponent

**Location**: `src/app/components/widgets/two-columns/`

**Purpose**: Bootstrap tabbed interface with left navigation and right content.

**Interface**:
```typescript
@Component({
  selector: 'app-two-columns',
  imports: [CommonModule],
  template: `...`
})
export class TwoColumnsComponent {
  @Input() items: AboutTabModel[] = [];

  trackById(_: number, item: AboutTabModel) {
    return item.id;
  }
}
```

**Template Structure**:
```html
<div class="Tabs">
  <div class="row">
    <!-- Left column: Navigation -->
    <div class="col-lg-3 nav">
      <a *ngFor="let item of items; trackBy: trackById"
         class="Tabs__link"
         [class.active]="first"
         [attr.data-bs-target]="'#' + item.id">
        {{ item.label }}
      </a>
    </div>

    <!-- Right column: Content -->
    <div class="col-lg-9 tab-content">
      <div *ngFor="let item of items; trackBy: trackById"
           class="tab-pane"
           [id]="item.id"
           [class.active]="first">
        <h3>{{ item.label }}</h3>
        <div [innerHTML]="item.content"></div>
      </div>
    </div>
  </div>
</div>
```

**Responsibilities**:
- Bootstrap-powered tabbed interface
- Left navigation, right content layout
- First tab active by default
- HTML content rendering via `[innerHTML]`

**Dependencies**: `AboutTabModel[]`

---

### DisplayItemComponent

**Location**: `src/app/components/widgets/display-item/`

**Purpose**: Router component that delegates rendering to type-specific display components.

**Interface**:
```typescript
@Component({
  selector: 'app-display-item',
  imports: [
    CommonModule,
    DisplayEventComponent,
    DisplayPublicationComponent,
    DisplayPostComponent
  ],
  template: `...`
})
export class DisplayItemComponent {
  @Input() item!: CardModel;

  isEvent(item: CardModel): item is Event {
    return item instanceof Event;
  }

  isPublication(item: CardModel): item is Publication {
    return item instanceof Publication;
  }

  isPost(item: CardModel): item is Post {
    return item instanceof Post;
  }
}
```

**Template Structure**:
```html
<app-display-event *ngIf="isEvent(item)" [event]="item"></app-display-event>
<app-display-publication *ngIf="isPublication(item)" [publication]="item"></app-display-publication>
<app-display-post *ngIf="isPost(item)" [post]="item"></app-display-post>
```

**Responsibilities**:
- Type guards to determine content type
- Conditional rendering of appropriate display component
- Maintains consistent interface for `SlideShowComponent`

**Dependencies**: All display components and model classes

---

### DisplayEventComponent

**Location**: `src/app/components/widgets/display-event/`

**Purpose**: Card display for event content.

**Interface**:
```typescript
@Component({
  selector: 'app-display-event',
  imports: [CommonModule],
  template: `./display-event.component.html`
})
export class DisplayEventComponent {
  config = inject(APP_EXTERNAL_CONFIG);
  @Input() event!: Event;
}
```

**Responsibilities**:
- Event-specific card layout and styling
- Access to external configuration for links

**Dependencies**: `Event` model, `APP_EXTERNAL_CONFIG`

---

### DisplayPublicationComponent

**Location**: `src/app/components/widgets/display-publication/`

**Purpose**: Card display for publication content.

**Interface**:
```typescript
@Component({
  selector: 'app-display-publication',
  imports: [CommonModule],
  template: `./display-publication.component.html`
})
export class DisplayPublicationComponent {
  @Input() publication!: Publication;
}
```

**Responsibilities**:
- Publication-specific card layout and styling
- May include author information display

**Dependencies**: `Publication` model

---

### DisplayPostComponent

**Location**: `src/app/components/widgets/display-post/`

**Purpose**: Card display for blog post content.

**Interface**:
```typescript
@Component({
  selector: 'app-display-post',
  imports: [CommonModule],
  template: `./display-post.component.html`
})
export class DisplayPostComponent {
  config = inject(APP_EXTERNAL_CONFIG);
  @Input() post!: Post;
}
```

**Responsibilities**:
- Post-specific card layout and styling
- Access to external configuration for links

**Dependencies**: `Post` model, `APP_EXTERNAL_CONFIG`

---

## Component Patterns

### Standalone Components

All components use Angular 19+ standalone API:
```typescript
@Component({
  selector: 'app-example',
  imports: [CommonModule, OtherComponent], // Explicit imports
  template: `...`,
  styles: [`...`] // or styleUrl
})
```

**Benefits**:
- Tree-shakable bundles
- Explicit dependencies
- No NgModule boilerplate

### Input/Output Pattern

**Data Flow**: Parent → Child via `@Input()`
```typescript
// Parent
<app-slide-show [items]="repository.getEvents()"></app-slide-show>

// Child
@Input() items: CardModel[] = [];
```

**Events**: Child → Parent via `@Output()` (not currently used)

### Service Injection

**Repository Access**: Components inject `ItemsRepositoryService` for data
```typescript
constructor(public repository: ItemsRepositoryService) {}
```

**Configuration Access**: Components inject `APP_EXTERNAL_CONFIG` for settings
```typescript
config = inject(APP_EXTERNAL_CONFIG);
```

### Template Patterns

**Conditional Rendering**:
```html
<app-component *ngIf="repository.getData()?.length > 0"></app-component>
```

**Property Binding**:
```html
<img [src]="item.image" [alt]="item.title">
<h3 [textContent]="item.title"></h3>
<div [innerHTML]="item.content"></div>
```

**Style Binding**:
```html
<div [style.backgroundImage]="'url('+imageUrl+')'"></div>
```

---

## Component Communication

### Parent-Child Communication

- **Data Down**: Parent passes data via `@Input()` properties
- **Events Up**: Child emits events via `@Output()` (not currently implemented)

### Service-Based Communication

- **Shared State**: `ItemsRepositoryService` provides centralized data access
- **No Direct Sibling Communication**: All data flows through the repository

### Route-Based Communication

- **Fragment Navigation**: URL fragments for section scrolling
- **Route Context**: `goToPage()` updates header content based on current route

---

## Future Maintenance Notes

### Adding New Content Types

1. Create `DisplayXxxComponent` following existing pattern
2. Add type guard method to `DisplayItemComponent`
3. Add conditional rendering in `DisplayItemComponent` template
4. Update `CardModel` inheritance if needed

### Adding New Widget Components

1. Create standalone component with explicit imports
2. Define clear `@Input()` interface
3. Add to parent component's imports array
4. Use in appropriate page template

### Component Refactoring

- Consider extracting common card logic into base component
- Implement OnPush change detection for performance
- Add loading states and error boundaries
- Standardize naming conventions (currently mixed kebab-case selectors, camelCase properties)</content>
<parameter name="filePath">/Users/apistill/Projects/LifeNets/LifeNets/docs/04-frontend/components.md
