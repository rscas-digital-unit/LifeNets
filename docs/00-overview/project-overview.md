# LIFE NETS – Project Overview

## Project Summary

**LIFE NETS** is a European project designed to support ambitious climate action by improving the understanding, transparency, and public credibility of emissions trading systems (ETSs).

As carbon pricing mechanisms expand to additional sectors such as transport and buildings, the **EU Emissions Trading System (EU ETS)** is becoming increasingly relevant to everyday life across Europe. This evolution creates growing demand for accessible evidence, transparent communication, and trustworthy public-facing information.

The purpose of this project is to develop a **dedicated frontend landing page application** that aggregates and presents all content related to LIFE NETS from the FSR WordPress platform (`fsr.eui.eu`), making project materials easier to discover, understand, and navigate.

## LIFE NETS Description

LIFE NETS supports ambitious climate action by strengthening the understanding of emissions trading systems (ETSs). As carbon pricing expands to sectors like transport and buildings, the EU Emissions Trading System (EU ETS) is increasingly shaping everyday life across Europe.

Rising carbon prices also raise questions about transparency, fairness, and public acceptance. LIFE NETS addresses these challenges by generating and sharing accessible evidence to improve the design, assessment, and credibility of ETSs.

The project objectives are to:

- Develop an innovative **EU ETS Data Tracker**
- Investigate public perceptions of carbon pricing through a **social experiment**
- Deliver targeted **training** for policymakers and stakeholders worldwide
- Foster **knowledge exchange** through academic and policy dialogues

## Scientific Coordination

- **Scientific Organizer:** Simone Borghesi 

## Platform Goal

The goal of the application is to provide a single, clear, and user-friendly access point for all project-related content published on the FSR website.

The landing page should:

- Aggregate all relevant LIFE NETS content from the WordPress backend
- Present different content types in a coherent and visually consistent way
- Improve discoverability of project resources
- Support both technical and non-technical audiences
- Serve as a reusable frontend foundation for future projects of a similar nature

## Content Scope

The application will aggregate and display content related to LIFE NETS from multiple WordPress endpoints, including:

- Publications
- Events
- News / posts
- Advertising / CTA content

Content relevance will be determined primarily through a project-specific WordPress tag.

## Environment Tags

Two different tags will be used depending on the environment:

- **Production tag:** `LifeNets` – ID `2317`
- **Test tag:** `LifeCoase` – ID `1409`

Until production content is fully available, the application should use the **test tag** to enable development and validation.

This tag-based approach should be treated as a configurable project parameter, not as hardcoded business logic.

## Authentication Context

Access to the WordPress REST API will require user authentication via **JWT (JSON Web Token)**. Users will log in with dedicated credentials already created for the application. Authentication should therefore be considered part of the standard application flow, not an optional developer-only feature.

The commonly used WordPress plugin **JWT Authentication for WP REST API** exposes filters for token timing and documents a default expiration of `time() + (DAY_IN_SECONDS * 7)`, i.e. 7 days. :contentReference[oaicite:0]{index=0}

The frontend application must therefore be designed to:

- Authenticate users before protected API consumption
- Store and reuse the token securely during its validity period
- Detect expired or invalid tokens
- Gracefully redirect users back to the login flow when needed

## Main Functional Behaviour

From a user perspective, the application should behave as a curated project landing page rather than as a raw feed of WordPress content.

This means the interface should:

- Retrieve content from multiple API endpoints
- Normalize heterogeneous content structures into consistent frontend cards and sections
- Display concise previews with links to the original FSR content
- Support future enrichment with filters, richer metadata, featured sections, and more advanced interactive components

## Product Vision

Although the immediate goal is to deliver a dedicated landing page for LIFE NETS, the application should be designed with a broader long-term vision.

The solution should be:

- **Reusable** across other project landing pages
- **Configurable** for different tags, content mappings, and backend sources
- **Extensible** to richer UI modules such as data widgets, dashboards, featured content blocks, and advanced search/filtering
- **Backend-agnostic by design**, even if WordPress is the first source currently in use

The project should therefore not be approached as a one-off frontend implementation, but as the first iteration of a more scalable and reusable content aggregation framework.

## Key Design Principles

### 1. Scalability
The codebase should be able to support additional projects, content types, sections, and external data sources without major restructuring.

### 2. Separation of Concerns
Business logic, API integration, authentication, content mapping, and UI rendering should remain clearly separated.

### 3. Backend Abstraction
Even though the current backend is WordPress, the frontend should avoid tightly coupling page components directly to WordPress response structures wherever possible.

### 4. Reusability
Cards, lists, hero sections, CTA blocks, and metadata components should be designed as reusable building blocks.

### 5. Maintainability
The project should be understandable and maintainable by different developers over time, with a clear internal structure and documentation.

### 6. Progressive Enrichment
The initial landing page may be relatively simple, but the architecture should allow the product to grow into a richer platform over time.

## Recommended Delivery Mindset

The developer should treat this project as:

- a **frontend application**, not just a page
- a **content integration layer**, not just a visual wrapper
- a **reusable project framework**, not just a single-use implementation

This mindset is important to ensure that future iterations can support larger projects, richer components, alternative APIs, and more structured editorial experiences without requiring a full rebuild.