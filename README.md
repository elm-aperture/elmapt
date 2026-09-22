# Elm Aperture

> **Work in progress.** This rebuild is under active development and is not yet the production Elm Aperture website.

**Current rebuild:** https://beta.elmapt.com  
**Stable site:** https://elmapt.com

Elm Aperture is my photography and video business. The existing stable site is a React/TypeScript site I built myself and is maintained in the older `elm-aperture` repository.

This repository began as a copy of that codebase after I decided to let Claude take over the visual implementation and see what it could do with the existing site and content.

This is because i am garbage at css.

The rebuild is currently available at beta.elmapt.com while I work on it. The existing site remains the production site at elmapt.com.

## Stack

- React
- TypeScript / TSX
- Vite
- pnpm
- Cloudflare Pages

This repository is being organized as a monorepo for Elm Aperture's web projects. I'm using pnpm as the package manager, partly to get more experience with both pnpm and monorepo organization.

## Current deployment

Production:

`elm-aperture` → Vite → Netlify → elmapt.com

Rebuild:

`elmapt` → Vite → Cloudflare Pages → beta.elmapt.com

The rebuild is deployed directly through Cloudflare Pages.

## Status

The rebuild is still in development and is not yet the production Elm Aperture website.

If it reaches the point where I'm happy replacing the existing site, it will eventually take over as the main Elm Aperture website.

The monorepo is also intended to become the home for additional Elm Aperture sites over time rather than maintaining each one as an unrelated repository.

## Why rebuild it?

The existing site works, but I wasn't happy with its visual design.

Rather than spending the project primarily working on a part of frontend development I don't specialize in, I copied the existing codebase and gave Claude direction to redesign it. Architecture follows my established pattern.

## AI assistance

Claude does the UI styling because i don't want to.
ChatGPT wrote this readme (save for this note) so i could have some explainer up in the repo while i work.
