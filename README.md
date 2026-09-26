# Elm Aperture

Work in progress. This repository contains the current rebuild of the Elm Aperture photography and video business website.

**Beta:** https://beta.elmapt.com  
**Production:** https://elmapt.com

Elm Aperture is my photography and video business. The production site is an earlier React/TypeScript implementation; this repository is a new monorepo-based rebuild.

## Stack

- React
- TypeScript / TSX
- Vite
- pnpm
- Cloudflare Pages

## Architecture

This repository is organized as a pnpm monorepo for Elm Aperture web projects.

Current structure:

- `apps/elmapt` — main Elm Aperture website
- `packages/theme` — shared theme package
- `media` — shared media assets

## Deployment

Production:

`elm-aperture` → Vite → Netlify → elmapt.com

Current rebuild:

`elmapt` → Vite → Cloudflare Pages → beta.elmapt.com

The rebuild is deployed directly through Cloudflare Pages.

## Status

The rebuild is under active development and is not yet the production Elm Aperture website.

The monorepo is intended to support additional Elm Aperture web projects over time.

## AI assistance

Claude was used for visual implementation and UI styling.
