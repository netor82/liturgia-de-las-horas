# Liturgia de las Horas

A contemplative web application for praying the Liturgy of the Hours in Spanish, with support for liturgical calendar navigation, audio playback, and accessibility features.

## Project Setup

### Development

```bash
npm install
npm run dev
```

The app will start at `http://localhost:5173/liturgia-de-las-horas/`

### Building for Production

```bash
npm run build
npm run preview
```

Output is in `dist/` folder.

## Technologies

- **React 18+** — UI framework
- **Vite** — Fast build tool and dev server
- **React Router v6** — Client-side routing with HashRouter (GitHub Pages compatible)
- **romcal** — Liturgical calculations
- **CSS Modules** — Component scoped styling
- **React Context** — State management

## Architecture

### Directory Structure

```
src/
  components/        # React components
  hooks/             # Custom React hooks
  contexts/          # React Context providers
  utils/             # Utility functions
  data/              # Prayer content JSON
  styles/            # Global styles
index.html           # Entry point
main.jsx            # React root
```

### Key Features

1. **Core Prayer Experience** — Select canonical hour and pray through modular prayer cards
2. **Liturgical Calendar** — Browse calendar and explore prayers for any date
3. **Audio Playback** — Listen to prayers at adjustable speeds (0.75x - 2x)
4. **Personalization** — Font size adjustment and dark mode
5. **Accessibility** — Full keyboard navigation, screen reader support, WCAG AA compliance

## Deployment

Deployed to GitHub Pages at: https://netor82.github.io/liturgia-de-las-horas/

Automatic deployment via GitHub Actions on push to `main` branch.

## Epics & Stories

See `_bmad-output/planning-artifacts/epics.md` for complete requirements breakdown:

- **Epic 1** — Project Initialization & Infrastructure (8 stories)
- **Epic 2** — Core Prayer Selection & Experience (9 stories)
- **Epic 3** — Audio Playback (6 stories)
- **Epic 4** — Liturgical Calendar & Date Browsing (7 stories)
- **Epic 5** — Personalization & Advanced Accessibility (8 stories)

Sprint tracking: `_bmad-output/implementation-artifacts/sprint-status.yaml`

## Development

This project follows structured development using BMad patterns. Each story includes detailed acceptance criteria and user outcomes.
