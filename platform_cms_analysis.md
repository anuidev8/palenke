# Platform Analysis & CMS Strategy Document

## 1. Executive Summary
This document provides a comprehensive analysis of all content, pages, sections, and components across the platform. It categorizes each element and outlines a detailed strategy for transitioning hardcoded or static structures into dynamic, manageable entities via a Content Management System (CMS). The goal is to empower administrators to easily create, edit, and deliver content through an intuitive admin interface, ensuring the platform remains scalable and up-to-date.

## 2. Architecture & Directory Overview
The application follows a modern frontend architecture (Next.js App Router), cleanly separated into:
*   **Routing (`src/app/`):** Contains all pages, layouts, and API endpoints.
*   **UI Components (`src/components/`):** Reusable interfaces, split into global elements, domain-specific modules (`home/`, `palenke/`), and foundational UI wrappers (`mock/`).
*   **Core Logic (`src/lib/`):** Utilities, data fetching logic, AI search capabilities, and type definitions.

## 3. Detailed List of Pages

### Public & Thematic Pillars
*   **`/` (Home):** Main landing page of the platform.
*   **`/biblioteca`:** Library landing page for "Memoria Afroterritorial" and normative documents.
*   **`/biblioteca/[slug]`:** Detail view for a specific document or publication.
*   **`/gobierno-propio`:** Landing page for Own Governance, focusing on territorial protection and litigation.
*   **`/gobierno-propio/[instrumento]`:** Detail view for a specific governance instrument or legal framework.
*   **`/incidencia`:** Landing page for Political Incidence and Exigibility.
*   **`/incidencia/[slug]`:** Detail view for specific incidence actions.
*   **`/mujeres-juventudes-ninez`:** Landing page for the Women, Youth, and Childhood (MJN) thematic area.
*   **`/mujeres-juventudes-ninez/campanas/[slug]`:** Detail view for MJN campaigns.
*   **`/memoria-afroterritorial`:** Afro-territorial memory and biocultural conservation overview.

### Systems & Dashboards
*   **`/scita`:** Landing page for the Afrodescendant Geographic Information System (SCITA).
*   **`/scita/formulario`:** Data collection/submission form for territories.
*   **`/geoportal`:** Interactive map viewer (SIG-A).
*   **`/estadisticas`:** Index of data and statistics dashboards.
*   **`/estadisticas/[slug]`:** Individual statistical dashboard view.

### News & Content
*   **`/noticias`:** Newsroom and press releases index.
*   **`/noticias/[slug]`:** Individual news article.

### Utility, Auth & Legal
*   **`/accesibilidad`:** Accessibility standards statement.
*   **`/politica-de-datos`:** Data privacy and usage policy.
*   **`/acceso-restringido`:** Fallback page for denied access/insufficient permissions.
*   **`/login`:** User authentication portal.
*   **`/recuperar-contrasena`:** Password recovery flow.

### Administrative Panel (`/admin`)
*   **`/admin`:** Admin dashboard overview.
*   **`/admin/accs/...`:** CRUD pages for Community Conservation Areas (ACCs).
*   **`/admin/campanas/...`:** CRUD pages for Campaigns.
*   **`/admin/contenido-visual/...`:** Management of AI-generated visual content.
*   **`/admin/dashboards/...`:** Management of statistical dashboards.
*   **`/admin/documentos/...`:** CRUD pages for the Library documents.
*   **`/admin/usuarios/...`:** User and role management.

---

## 4. Structural Sections and Components

### Global Layout & Navigation
*   **`Navbar` & `SiteHeader`:** Top navigation bar containing the logo, main structural links, role-based user menu, and global search trigger.
*   **`Footer`:** Page footer with external links, legal policies, and organizational contact info.
*   **`ui` (Mock UI):** Foundational layout elements like `Callout`, `PageBanner`, `SiteLayout`, and `EmptyState`.

### Home Components (`src/components/home/`)
*   **`HeroCards`:** Interactive navigation cards on the hero section pointing to the main thematic modules.
*   **`ExpandableVideo`:** A video player that expands into a full-screen or larger lightbox view.
*   **`HomeVideoGallery`:** A grid displaying highlighted videos and organizational footage.
*   **`HomeInfoAccordions`:** Expandable accordion lists for text sections like "Who We Are".

### Domain-Specific Components (`src/components/palenke/`)
*   **Grids & Lists:**
    *   `BibliotecaDocGrid`: Dense grid layout for normative and textual documents.
    *   `BibliotecaMemoriaGrid`: Media-rich grid for memory and cultural archive items.
    *   `InstrumentCardGrid` & `InstrumentDashboardGrid`: Layouts for displaying governance instruments and legal routes.
    *   `GobiernoSubmodulesGrid`: Cards for navigating sub-categories within Own Governance.
    *   `MjnStoryLibrary`: Gallery mapping out MJN stories and campaigns.
    *   `GovernmentFunctionsList`: Structured list detailing roles and functions within community governance.
*   **Elements & Cards:**
    *   `DocumentCard`: Card displaying a document's cover, title, metadata (year, tags), and download/view actions.
    *   `BookPreviewLightbox`: A modal allowing users to preview document contents before downloading.
    *   `VideoThumbnail`: A reusable thumbnail component with a hover play-button overlay.
    *   `SubmoduleOptionsColumn`: Vertical sidebar for filtering and secondary navigation.
*   **Interactive Search & Tools:**
    *   `BibliotecaAiSearchPanel`: An advanced floating search dock utilizing AI to filter documents, show summaries, and highlight tokens.
    *   `GlobalBibliotecaSearchDock`: A persistent search bar available across library views.
    *   `BibliotecaCategoryNav`: Horizontal pill/tab navigation for switching between library categories.
    *   `ScitaLayerToggles`: Checkbox list for turning map layers on and off in the geoportal.
    *   `ExpandableDocTable`: A data table for documents where rows can be expanded to reveal abstracts and metadata.

---

## 5. CMS & Dynamic Content Strategy Recommendations

To ensure the platform is easily manageable, the following sections should be converted into dynamic entities controlled via the CMS interface:

### 1. Home Page & Global Settings (Singletons)
*   **Hero Section:** Admins should be able to upload/swap the background video or image, update the main headline, and configure the primary Call-To-Action (CTA) link.
*   **Alert Banners:** A feature flag to enable a site-wide `PageBanner` for urgent communiques, maintenance, or security alerts.
*   **Highlighted News/Content:** Ability to pin 2 to 4 specific news articles, campaigns, or library documents to the homepage dynamically.

### 2. Library / Memoria Afroterritorial (Collection)
*   **Document Management (CRUD):** 
    *   Fields: Title, author, publication year, abstract/description.
    *   Media: File uploads (PDFs, media files) and cover images.
    *   **Taxonomies:** Tags/Categories for "Territory", "Type" (Normativa, Memoria Viva), and "Format" (Video, Audio, Text).
    *   **Access Control:** Strict toggles to mark a document as "Public", "Internal Use Only", or "Admin Restricted".

### 3. Community Conservation Areas / ACCs (Collection)
*   **Territorial Profiles:** Dynamic pages requiring rich-text descriptions, associated geographic coordinates (or GeoJSON file uploads), image galleries, and relational links to specific documents in the library that pertain to that territory.

### 4. Own Governance / Gobierno Propio (Collection)
*   **Legal Instruments:** Directory of laws, decrees, and community agreements managed via CRUD.
*   **Strategic Litigation Routes:** A repeater/list field allowing admins to build step-by-step guides (e.g., "Step 1: Present tutelage", "Step 2: Await ruling") with attached downloadable templates or forms.

### 5. MJN Campaigns (Collection)
*   **Campaign Toolkits:** Admins need to create campaign landing pages featuring rich-text bodies, embedded YouTube/Vimeo links, and a specific section for "Piezas Autorizadas" (downloadable ZIP files containing graphics, posters, and audio spots for community distribution).

### 6. SCITA / Geoportal & Statistics (Integration Collections)
*   **Dashboards:** Instead of hardcoding statistical views, admins should be able to create a new dashboard entry by providing a title, description, and an iframe URL (from tools like PowerBI, Superset, etc.).
*   **Map Layers:** A collection where admins can add new WMS/WFS endpoints or upload GeoJSON files, categorize them, and set default visibility states for the `ScitaLayerToggles` component in the geoportal.

### 7. News & Incidence (Collection)
*   **Press Room:** Standard blogging capabilities with a rich-text editor, scheduled publishing dates, author attribution, and featured header images.
