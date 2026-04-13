# LIFE NETS – Frontend Resources

---

## 1. Design & Prototyping

### Figma Project

The official design reference for the project is available at:

👉 **Figma Link:**
[FIGMA]https://www.figma.com/design/sZge3lAbqiqSh3gecDGZPl/LIFE-NETS

All UI components, layouts, spacing, typography, and visual guidelines must follow the Figma design.

All the components have already been developed and implemented for the [FSR_WEBSITE]https://fsr.eui.eu site, so you just need to copy the html

---

## 2. CSS 

### FSR DESIGN


```html
<link href="https://fsr.eui.eu/wp-content/themes/fsr/assets/dist/css/style.css" rel="stylesheet">
```

---

### Custom Styles

A custom stylesheet could be included for project-specific overrides and design alignment with Figma.

```html
<link rel="stylesheet" href="/assets/dist/css/app.css">
```

#### Guidelines

* Do NOT modify Bootstrap core files
* Use custom classes or overrides in `main.css`
* Follow a consistent naming convention (e.g. BEM or similar)
* Keep styles modular and reusable

---

## 3. JavaScript Libraries

### Bootstrap JS

Required for UI components such as tabs or tooltip (if requested).

```html
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
```

---

### Slideshow / Carousel Library

The project uses **Swiper.js** for sliders and carousels.

**CDN (example):**

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />
<script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
```

#### Usage Guidelines

* Use Swiper for:

  * Blog posts carousel
  * publications carousel
  * events carousel
* Avoid mixing multiple slider libraries
* Keep configuration reusable via Angular components

---

## 4. Fonts

### Primary Font

👉 **Font Family:** [Avenir]

---

## 5. Icons

* Font Awesome (if required by design)

Include it with:

```html
<script defer crossorigin="anonymous" src="https://kit.fontawesome.com/52836ffa92.js" id="font-awesome-official-js"></script>
```

---

## 6. Assets Structure

Suggested structure to respect the css:

```
/assets
    /dist/
      /css
        style.css
        main.css
        /fonts
    /img
      /svg
      
      

```

---

## 7. Integration Guidelines

* All external libraries must be:

  * clearly documented
  * versioned
  * consistent across environments
* Prefer CDN for simplicity OR npm packages if integrated in Angular build

---

## 8. Performance Recommendations

* Avoid loading unused libraries
* Minimize CSS and JS in production builds
* Use lazy loading for heavy components (e.g. sliders)

---

## 9. Future-Proofing

The frontend should remain flexible to:

* Replace libraries if needed
* Extend UI with new components
* Integrate additional design systems

Avoid tight coupling between UI components and specific third-party libraries where possible.
