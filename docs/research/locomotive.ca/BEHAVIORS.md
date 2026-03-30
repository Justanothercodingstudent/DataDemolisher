# Locomotive.ca behavior notes (limited extraction)

## Extraction status
- Direct browser automation unavailable in this environment.
- Direct HTML fetch to `https://locomotive.ca/en` is blocked by anti-bot verification page.
- This document captures the clone assumptions used for the rebuild.

## Assumed interaction model
- Smooth-scroll, cinematic transitions between sections.
- Subtle hover-lift on project cards and nav links.
- Sticky top nav and large typographic hero.
- Scroll reveal for section blocks.

## Responsive assumptions
- Desktop: 2-column + large headline treatment.
- Tablet: reduced spacing and typography.
- Mobile: single-column stack, compact nav and cards.
