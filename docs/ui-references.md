# LIFE NETS – UI References

This document provides guidance on which UI components to reuse from the FSR website (`fsr.eui.eu`) and how to adapt them for the LIFE NETS landing page.

The goal is to **reuse existing, consistent UI patterns**, while simplifying them for a focused landing experience.

---

## 1. General Approach

* Reuse HTML structure from the FSR website where possible
* Simplify components to remove unnecessary complexity
* Avoid copying JavaScript logic directly (reimplement in Angular)
* Ensure components are modular and reusable

---

## 2. Header / Navigation

### Source

FSR Website (global header)

### HTML Reference

```html
<header class="header header__desktop"></header>
```

---

### Required Adjustments

* ❌ Remove:

  * `.header__top` (top utility bar)
  * Mega menu (hover-based navigation)

* ✔ Keep:

  * Logo
  * Main navigation items
  * Clean simplified layout

---

### Notes

* Navigation should be simplified for a landing page
* No complex hover interactions required
* Make it responsive and Angular-friendly

---

## 3. Hero Section

### Source Page

👉 https://fsr.eui.eu/research/

### HTML Reference

```html
<div class="Hero"></div>
```

### Guidelines

* Use static hero (NO slideshow)
* Background image with overlay gradient
* Include:

  * Title
  * Short descriptive text

---

### Notes

* Keep layout simple and readable
* Ensure strong contrast between text and background
* Content should be dynamic/configurable

---

## 4. Spotlight Slider

### Source

Homepage – Spotlight section

### HTML Reference

```html
<section class="slider-container my-5"></section>
```

---


### Implementation

* Use **Swiper.js**
* Do NOT copy original JS
* Implement slider using Angular components

👉 Reference:
https://swiperjs.com/get-started

---

### Guidelines

* Each slide = content card
* Cards must support:

  * image
  * category/tag
  * title
  * short description
* Slider must be reusable for:

  * publications
  * posts
  * events

---

## 5. CTA / Highlight Banners

### Source

Homepage CTA sections

### HTML Reference

```html
<section class="cta"></section>
```

---


### Guidelines

* Large visual banner
* Image (left or background)
* Text content:

  * title
  * description
* CTA button:

  * label
  * link

---

### Notes

* This component is critical for highlighting:

  * reports
  * key outputs
  * featured content
* Must be reusable and configurable

---

## 6. Footer

### Source

FSR Website (global footer)

---

### Guidelines

* Reuse structure and styling
* Simplify if necessary
* Ensure:

  * links work correctly
  * layout is responsive

---

## 7. UI Simplification Rules

The landing page is NOT the full FSR website.

### Remove

* Complex navigation
* Mega menus
* Unnecessary interactions
* Secondary UI elements

---

### Keep

* Clean layout
* Visual consistency with FSR
* Strong hierarchy:

  * Hero
  * Content sections
  * CTA
  * Footer

---

## 8. Angular Implementation Notes

* Each section must be a separate component:

  * `HeroComponent`
  * `CardComponent`
  * `SliderComponent`
  * `CtaComponent`
  * `HeaderComponent`
  * `FooterComponent`

* Avoid direct DOM manipulation

* Use Angular bindings and inputs for dynamic data

---

## 9. Final Goal

The UI should:

* Feel consistent with FSR branding
* Be lighter and more focused
* Be modular and reusable
* Support future extensions without redesign

The landing page is a **curated experience**, not a full content portal.
