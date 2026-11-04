# Wireframe Kit

A visual page builder for the people who shape a page before a designer gets to it: copywriters, product managers, founders. Copy written in a doc hides its structure. You don't see that the headline wraps to four lines, that the pricing needs a third plan, or that the FAQ belongs above the testimonials. This kit lets you put your words and your page order into real, responsive sections in minutes, try several versions, and hand the designer a clear starting point.

It doesn't replace design. Wireframing and design still happen; they just start from a page whose story has already been tested, instead of from lorem ipsum.

**Who it's for:** copywriters testing message order and length, PMs sketching a launch page or feature page, founders explaining what they want, and designers who want a faster first pass with their copywriter.

The placeholder copy in every section is a brief, not filler: each line says what belongs there ("Headline that names the outcome your customer wants").

**Try it:** [ogrigore.design/lab/wireframe-kit](https://ogrigore.design/lab/wireframe-kit)

## What's in it

- **66 section layouts as Astro components**, across 12 section types: navbar, hero, logo cloud, features, feature split, stats, case studies, testimonials, pricing, FAQ, call to action and footer. Each component takes a `variant` and a `tone` prop.
- **A browser editor** to build a page from those components, with a visual layout picker, move up and down controls, duplicate and per-section tone.
- **Theme controls** for colors, radius, border width, button shape, shadows, spacing, max width, gutters, card padding, fonts, type scale, weights, tracking and placeholder images, plus six presets.
- **Responsive preview** at desktop, tablet (834px) and mobile (390px). Sections use container queries, so they respond to the preview width.
- **Accessibility check** against WCAG 2.2 AA on every change: 8 theme color pairs with a Fix button, plus a scan of every visible text element against its real background.
- **Exports:** design tokens as CSS variables with shadcn/ui names (plus a Tailwind v4 `@theme` block), a standalone HTML page, or an Astro page that imports the components.

## Use the components in your own Astro project

Copy `src/components/sections/`, `src/styles/wireframe.css` and `src/styles/tokens.css` into your project, then:

```astro
---
import { Navbar, Hero, Features, Pricing, Footer } from '../components/sections';
import '../styles/wireframe.css';
import '../styles/tokens.css';
---
<div class="wf img-hatch">
  <Navbar variant="split" />
  <Hero variant="image-below" />
  <Features variant="bento" tone="muted" />
  <Pricing variant="table" />
  <Footer variant="columns" />
</div>
```

Every layout and its name is listed in the comment at the top of each component, and in `src/data/catalog.json`. See `src/pages/example.astro` for a full page.

## Run it locally

```bash
npm install
npm run dev
```

Then open the URL Astro prints. The site runs under `/lab/wireframe-kit` (set in `astro.config.mjs`), and `npm run build` nests the output in `dist/lab/wireframe-kit` so the files sit at the path they are served from.

## How it's built

The editor page renders every section variant at build time from the Astro components into `<template>` elements. The editor script clones those templates, so the components are the single source of truth for the editor, the exports and your own pages. No framework runs in the browser; the editor is plain JavaScript. Settings and the page you build are saved in your browser's local storage.

## House rules built in

The defaults follow common marketing-site conventions: 1280px content width, 32px side padding on desktop and 16px on mobile, no lines between sections, dividers only inside stat rows, 16:9 case study images, no left-border quotes, and secondary buttons that stay secondary on hover.

---

Built by [Oana Grigore](https://ogrigore.design), Lead Product Designer. Originally made as an internal tool at Parsnip Studio. MIT license.
