# @elmapt/theme

The shared CSS design system for Elm Aperture. Hand-authored, no build step,
no preprocessor — plain CSS custom properties and a small set of patterns.

Every app in this domain consumes it so that type, spacing, colour, radius and
easing stay the same across `elmapt.com` and anything that hangs off it. Apps
are expected to deviate on purpose, by overriding a token or writing app-local
CSS in terms of these tokens. Apps should not restate raw values; that is how a
family of sites drifts apart one hex code at a time.

## Use

```ts
// main.tsx, before any app CSS
import "@elmapt/theme/index.css";
import "./styles/app.css";
```

Add the workspace dependency:

```jsonc
// apps/<app>/package.json
"dependencies": { "@elmapt/theme": "workspace:*" }
```

Subpaths are exported individually (`@elmapt/theme/tokens.css`,
`.../motion.css`, …) for the rare case an app wants the vocabulary without the
patterns.

## What is in it

| File | Contents |
| --- | --- |
| `tokens.css` | Every value the system knows: ink, ambient field, glass, spacing, rhythm, radius, elevation, motion, type. |
| `reset.css` | Only the normalisation the patterns depend on, plus the shared focus ring. |
| `typography.css` | `.elm-display`, `.elm-wordmark`, `.elm-eyebrow`, `.elm-label`, `.elm-lede`, `.elm-body`, `.elm-caption`. |
| `ambient.css` | `.elm-ambient` — the fixed radial field the family sits on. Drift its `--elm-p*` custom properties to animate it. |
| `surface.css` | `.elm-surface` — the acrylic pane — plus `.elm-rule`. |
| `controls.css` | `.elm-btn` (+ `--ghost`, `--wide`) and `.elm-navlink`. |
| `layout.css` | `.elm-page`, `.elm-container`, `.elm-section`, `.elm-sectionhead`, `.elm-bleed`, helpers. |
| `motion.css` | `.elm-reveal`, `.elm-fade-in`, `.elm-skeleton`, and the reduced-motion damper. |
| `tile.css` | `.elm-mosaic-frame` / `.elm-mosaic` — the ratio-derived photo grid — and `.elm-tile` with its plate and deferred-render variant. |
| `lightbox.css` | `.elm-lightbox` — scrim, figure, caption pill, controls, frame counter. |

## Conventions

- Custom properties are `--elm-*`; classes are `.elm-*`.
- One easing curve, `--elm-ease`, is reused for all motion. Using a different
  curve should be a decision, not a default.
- Colours are stored as space-separated rgb triplets (`--elm-accent`) wherever
  alpha needs to vary: `rgba(var(--elm-accent) / 0.3)`.
- Fonts are tokens (`--elm-font-display`, `--elm-font-sans`), so swapping the
  family is one line rather than a search-and-replace. Loading the webfont is
  the app's job — the package never fetches anything.
- The acrylic language is for chrome. It does not go on photographs.
