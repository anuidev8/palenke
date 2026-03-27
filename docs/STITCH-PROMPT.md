# Palenke — Stitch Prompt Description

Use the prompts below in order. Start with the **Initial Prompt**, then apply the **Refinement Prompts** one at a time.

---

## Initial Prompt (paste this first)

> A dignified and grounded community data sovereignty platform for Afro-Colombian territorial communities. The visual tone is warm, institutional, and earthy — rooted in the natural landscape: deep forest greens, warm sand tones, and burnished gold accents. No bright colors, no playful or decorative "tropical" aesthetics. The platform is called **Palenke** with the short logo mark **PK**.
>
> Design the **homepage** with the following layout:
>
> - A full-height **hero section** with a dark forest-green background (`#0d1f0a`), a large serif display font heading in off-white, a short subtitle in a light sans-serif, and two call-to-action buttons — one primary (gold, fully rounded pill shape) and one secondary (outlined, transparent).
> - Below the hero, a **horizontal quick-access card row** with 4 icon cards: Biblioteca, Estadísticas, Geoportal, and Mujeres, Juventudes y Niñez. Cards use a warm cream background (`#fff9ec`) with rounded corners (32px radius).
> - A **two-column content section** on a warm sand background (`#f5edd6`): left side has an institutional text block with a small all-caps gold eyebrow label above the heading; right side has a quote card in deep forest green with white text.
> - A **sticky navigation bar** at the top with the PK logo on the left, navigation links centered, and a login button on the right — transparent on scroll, solid dark forest on scroll-down.
> - A **footer** in deep forest green (`#0d1f0a`) with the platform name, a short description, and copyright.
>
> Typography: use a **variable serif font** (similar to Fraunces or Playfair Display) for all headings and a **clean sans-serif** (similar to Public Sans or Inter) for all body text and UI labels. All buttons are fully rounded pill shape. Card corners are organically rounded (28–32px radius).

---

## Refinement Prompts (apply one at a time after the initial design)

### Theme & Colors
> Update the primary color to deep forest green `#0d1f0a` and the accent color to burnished gold `#c8943a`. The page background should be warm sand `#f5edd6`. Card surfaces should be light cream `#fff9ec`. All interactive elements — buttons, links, active states — should use the gold accent.

### Typography
> Use a variable serif font for all headings (H1–H3) with slightly optical sizing — large and authoritative. Use a neutral sans-serif for all body copy, labels, and navigation. Add a small all-caps eyebrow label style with wide letter-spacing (0.28em) in dark gold color above each section heading.

### Navigation Bar
> Make the sticky navigation bar transparent with white text when the hero is in view, and transition to a solid deep forest green (`#0d1f0a`) background with white text when the user scrolls down. Include the PK logo mark on the left, navigation links in the center, and a fully rounded gold pill login button on the right.

### Hero Section
> On the hero section, add an eyebrow label in small all-caps gold text above the main heading that reads "Consejo Comunitario — PCN". Make the main heading large serif text, two lines maximum. Add a subtle texture overlay or gradient from dark forest green to a slightly lighter forest tone. Include a scroll indicator arrow that bounces gently at the bottom center.

### Quick Access Cards
> On the four quick-access cards below the hero, each card should have: a small lucide-style icon at the top, a short title in serif font, a one-line description in small sans-serif, and a small gold arrow on the bottom right. Cards should have a soft drop shadow and lift slightly on hover. Use a cream white background with a subtle warm border.

### Visibility Badges
> Add a visibility badge system used throughout cards and document listings. Three variants: "Público" in soft green background with dark green text, "Interno" in light gold background with dark gold text, and "Sensible" in soft red background with dark red text. Badges are small, all-caps, rounded-full pill shape.

### Document Library Card
> Design a document card component: rounded 32px card on cream background, with a visibility badge top-right, document type label in small all-caps gold eyebrow style, a serif title (2 lines max), a row of keyword chips at the bottom (small bordered tags), and a "Ver documento" text link with an arrow. Card has a soft shadow and subtle warm border.

### Admin Panel Layout
> Design the admin panel layout: a fixed 240px left sidebar in deep forest green with white navigation links — each item has a small icon and label. The main content area is on a warm sand background. The top of the content area has a page title in large serif font, a subtitle in muted sans-serif, and a gold primary action button on the right. Below is a filter toolbar with a search input and select dropdowns, then a responsive data table with alternating row shading.

### Mobile Responsive
> Make all screens fully responsive for mobile (375px viewport). On mobile: the navigation collapses into a hamburger menu icon; the hero heading reduces to a smaller size; the four quick-access cards stack in a 2×2 grid; the two-column sections stack vertically; the footer links stack in a single column.

---

## Key Visual Rules (reference for all prompts)

| Element | Value |
|---|---|
| Page background | Warm sand `#f5edd6` |
| Card background | Cream `#fff9ec` |
| Primary brand color | Deep forest green `#0d1f0a` |
| Primary accent | Gold `#c8943a` |
| Eyebrow / badge accent | Dark gold `#9f6f24` |
| Heading font | Variable serif (Fraunces / Playfair style) |
| Body font | Clean sans-serif (Public Sans / Inter style) |
| Button shape | Fully rounded pill |
| Card border radius | 28–32px |
| Input border radius | 20px |
| Tone | Warm, institutional, grounded — not playful, not tropical |
| Dark mode | None — intentional decision |
