---
stepsCompleted: [1, 2, 3, 4]
inputDocuments:
  - "_bmad-output/planning-artifacts/briefs/brief-Liturgia de las Horas-2026-06-05/brief.md"
  - "_bmad-output/planning-artifacts/architecture.md"
  - "_bmad-output/planning-artifacts/ux-designs/ux-Liturgia de las Horas-2026-06-05/DESIGN.md"
  - "_bmad-output/planning-artifacts/ux-designs/ux-Liturgia de las Horas-2026-06-05/EXPERIENCE.md"
---

# Liturgia de las Horas - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for **Liturgia de las Horas**, decomposing the requirements from the Brief (PRD), Architecture, UX Design, and Experience specifications into implementable stories.

---

## Requirements Inventory

### Functional Requirements

**Core Liturgical Calculation & Content**

- FR1: Use romcal library to retrieve liturgical date components (Psaltery week 1-4, liturgical season, reading cycle A/B/C) for any given date
- FR2: Retrieve liturgical data from romcal library for correct celebration, saints, feast names
- FR3: Load and present complete prayer text for each of 7 canonical hours (Oficio de Lectura, Laudes, Tercia, Sexta, Nona, Vísperas, Completas)
- FR4: Resolve prayer content with priority: Feast-specific content > Seasonal content > Psalter content
- FR5: Display prayer content in sequential modular cards (Invitatorio, Himno, Salmodia, Lectura, Oraciones finales, etc.)
- FR6: Cache romcal calculations by year to avoid redundant computation

**User Navigation & Selection**

- FR7: Display HourSelector home screen with 7 canonical hour buttons in a 3-column grid layout on mobile
- FR8: Highlight the nearest canonical hour to current time with visual distinction (soft_brown background + white text)
- FR9: Allow user to select any canonical hour from HourSelector to navigate to prayer session
- FR10: Navigate to HourView when hour button is tapped, displaying prayer cards for selected hour
- FR11: Provide navigation back to HourSelector from HourView
- FR12: Display sequential navigation between prayer cards (Previous/Next buttons)
- FR13: Support deep-linked URLs by date (`/#/:date` routes to HourSelector for that date)
- FR14: Support deep-linked URLs by date and hour (`/#/:date/:hour` routes to HourView for that date and hour)
- FR15: Make deep-linked URLs shareable and bookmarkable

**Contextual Information Display**

- FR16: Display LiturgicalHeader at top of HourView showing: date, saint/feast name, Psaltery week, liturgical season, reading cycle
- FR17: Color LiturgicalHeader background based on current liturgical season (Advent→purple, Ordinary→green, Lent→dark purple, Eastertide→gold, Christmastide→white)
- FR18: Display info icons (ℹ️) on each prayer card section
- FR19: Show tooltips explaining each prayer section when info icon is tapped (e.g., "Invitatorio: Opening prayer that invites us to prayer")

**Audio Functionality**

- FR20: Provide audio playback via Web Speech API (browser text-to-speech synthesis)
- FR21: Allow user to toggle audio play/pause for current prayer card
- FR22: Provide audio speed controls with 5 options (0.75x, 1x, 1.25x, 1.5x, 2x)
- FR23: Remember selected audio speed during session
- FR24: Allow user to jump between cards while audio is playing (single global audio session, not per-card)
- FR25: Gracefully degrade when Web Speech API is unavailable (hide audio controls)

**Calendar & Date Browsing**

- FR26: Display monthly liturgical calendar grid (CalendarView)
- FR27: Show current month by default in calendar
- FR28: Provide navigation buttons to browse to previous/future months
- FR29: Highlight liturgically significant days (feasts) with accent color in calendar grid
- FR30: Highlight Sundays in calendar with visual distinction
- FR31: Display saint/feast names in calendar tooltips when day is tapped/hovered
- FR32: Allow user to select any day in calendar and navigate to HourSelector for that date

**User Preferences & Customization**

- FR33: Support adjustable font sizes (small, normal, large, xl)
- FR34: Apply font size selection via CSS variable scaling
- FR35: Store font size preference in browser localStorage
- FR36: Respect system dark mode preference (`prefers-color-scheme` media query)
- FR37: Provide dark mode and light mode with appropriate contrast

**Accessibility Features**

- FR38: Support full keyboard navigation (Tab between elements, Enter/Space to activate)
- FR39: Maintain logical tab order (left-to-right, top-to-bottom)
- FR40: Display visible focus indicator (gold ring #d4af37 per DESIGN tokens)
- FR41: Provide semantic HTML structure (`<button>`, `<nav>`, `<main>`, `<article>` for cards)
- FR42: Label all interactive elements with visible text or aria-label
- FR43: Associate form inputs with `<label>` elements
- FR44: Announce card changes to screen readers (aria-live="polite")
- FR45: Ensure all alt text or aria-hidden on decorative images

---

### Non-Functional Requirements

**Accuracy & Correctness**

- NFR1: Achieve 100% liturgical accuracy—texts match liturgiapapal.org for any date/hour combination
- NFR2: Verify prayer content against canonical liturgical sources before deployment
- NFR3: Correctly display liturgical colors for each season

**Performance & Speed**

- NFR4: Initial page load completes in <2 seconds on typical mobile connection
- NFR5: Prayer card navigation is instantaneous (no blocking operations)
- NFR6: Audio playback does not stutter or cause layout jank

**Accessibility Standards**

- NFR7: WCAG AA contrast ratio ≥4.5:1 for all text (light and dark modes)
- NFR8: All interactive elements ≥44px × 44px (touch target size)
- NFR9: No horizontal scroll on any breakpoint except maps
- NFR10: Support responsive text sizing (no fixed viewport constraints)
- NFR11: No autoplay animations; respect `prefers-reduced-motion`
- NFR12: No flashing content (no seizure risk)

**Browser & Device Compatibility**

- NFR13: Support Chrome 90+, Firefox 88+, Safari 14+, Edge 90+ (modern evergreen browsers)
- NFR14: Function correctly on iOS (Safari, Chrome) with safe area handling (notch, home indicator)
- NFR15: Function correctly on Android (Chrome) with full-width responsive layout
- NFR16: Support both portrait and landscape orientations on mobile
- NFR17: Support desktop (1024px+) with responsive card centering and optional sidebar
- NFR18: Support tablet (768px-1023px) with responsive layout
- NFR19: Graceful fallback when Web Speech API unavailable

**Architecture & Deployment**

- NFR20: Deploy as fully static site (no backend server required)
- NFR21: Host on GitHub Pages without 404 handling or server-side routing
- NFR22: Use HashRouter for URL routing (URLs with `#` for GitHub Pages compatibility)
- NFR23: Minimize external dependencies (React, Vite, romcal only)
- NFR24: Use CSS Modules for component encapsulation (no global style conflicts)
- NFR25: Use React Context for state management (no Redux or heavy state libraries)
- NFR26: Support automatic CI/CD deployment via GitHub Actions

**Data & State Management**

- NFR27: No server-side state; all state is ephemeral (localStorage for preferences only)
- NFR28: No user login or persistent history tracking
- NFR29: No external API calls except romcal library
- NFR30: Cache romcal output per year to avoid redundant computation

---

### Additional Requirements (Architecture)

**Frontend Stack & Build**

- AR1: Use React 18+ with Vite as bundler and dev server
- AR2: Configure Vite with base URL `/liturgia-de-las-horas/` for GitHub Pages
- AR3: Use React Router v6 with HashRouter for URL routing
- AR4: Implement npm scripts: `npm run dev`, `npm run build`, `npm run preview`

**State Management & Contexts**

- AR5: Create LiturgicalContext to store global liturgical data (selectedDate, liturgicalDay, selectedHour)
- AR6: Create PreferencesContext to store user preferences (fontSize, prefersDarkMode)
- AR7: Use React useReducer for state updates in LiturgicalContext
- AR8: Store fontSize preference in localStorage with keys: "small", "normal", "large", "xl"

**Component Architecture**

- AR9: Implement HourSelector component (grid of 7 hour buttons with nearest-hour highlighting)
- AR10: Implement HourView component (prayer card renderer with audio player)
- AR11: Implement LiturgicalHeader component (date, saint, Psaltery, season, cycle display)
- AR12: Implement PrayerCard component (individual prayer section with info icon and audio button)
- AR13: Implement AudioPlayer component (play/pause, speed controls)
- AR14: Implement CalendarView component (monthly grid with navigation and day selection)
- AR15: Use CSS Modules for component-scoped styling (`[Component].module.css`)

**Styling & Design Tokens**

- AR16: Implement CSS Custom Properties (variables) for colors, spacing, typography per DESIGN.md
- AR17: Use warm color palette (cream, soft neutrals) per DESIGN.md specification
- AR18: Map liturgical season to CSS variable `data-season` attribute on `<html>` root
- AR19: Update `data-season` dynamically when selected date changes
- AR20: Support dark mode via `@media (prefers-color-scheme: dark)` media query

**Hooks & Utilities**

- AR21: Implement useLiturgicalDay hook that calls romcal.generateCalendar(year) and caches by year
- AR22: Implement useAudio hook to wrap Web Speech API (play, pause, speed controls)
- AR23: Create contentResolver.js utility (resolveContent(hour, liturgicalDay) → cards[])
- AR24: Create liturgicalColors.js utility (seasonName → CSS token color)
- AR25: Create hourTimes.js utility (hour name → traditional clock time)

**Data Structure & Content**

- AR26: Define prayer card JSON schema with fields: type, title, content
- AR27: Create Psalter JSON structure (src/data/hours/[hour]/psalter/week-1.json through week-4.json)
- AR28: Create seasonal JSON structure (src/data/hours/[hour]/seasons/*.json for Advent, Lent, Eastertide, Christmastide)
- AR29: Create feast JSON structure (src/data/hours/[hour]/feasts/[romcal-key].json)
- AR30: Populate JSON files with complete prayer texts for all hours and liturgical variations

**Integration & Calculation**

- AR31: Pin romcal to exact version in package.json (currently v3.0.0-dev)
- AR32: Use romcal GeneralRoman_Es locale for Spanish language support
- AR33: Call romcal.generateCalendar(year) once per app session per year
- AR34: Extract liturgicalDay as first element of romcal output array (highest precedence)

**Deployment & CI/CD**

- AR35: Create GitHub Actions workflow (`.github/workflows/deploy.yml`)
- AR36: Workflow steps: checkout → install Node 20 → npm ci → npm run build → deploy dist/ to GitHub Pages
- AR37: Trigger deployment on push to main branch
- AR38: Deploy site to `https://netor82.github.io/liturgia-de-las-horas/`

---

### UX Design Requirements

**Color Palette & Theming**

- UX-DR1: Implement warm color palette as primary (cream #f5f1e8, white #fefdf9, warm grays)
- UX-DR2: Map liturgical seasons to accent colors: Advent #6a1b9a (purple), Ordinary Time #2e7d32 (green), Lent #5e35b1 (dark purple), Eastertide #d4af37 (gold), Christmastide #f0f0f0 (white)
- UX-DR3: Use gold #d4af37 for all focus rings and keyboard focus indicators
- UX-DR4: Use red #c62828 for error states
- UX-DR5: Use green #558b2f for success states
- UX-DR6: Implement dark mode color scheme: bg-primary #1a1815, text-primary #f5f1e8

**Typography**

- UX-DR7: Use serif font (Georgia, Garamond, serif fallback) for prayer content (18px, line-height 1.8)
- UX-DR8: Use sans-serif font (Inter, system sans-serif) for UI text (16px base, line-height 1.5)
- UX-DR9: Use semibold (600) weight for labels and buttons
- UX-DR10: Implement heading sizes: 32px (H1, page title), 24px (H2, section headers), 20px (H3, card titles)
- UX-DR11: Apply no bold styling within prayer text itself (preserve contemplative feel)

**Spacing & Layout**

- UX-DR12: Implement spacing scale: xs=4px, sm=8px, md=16px, lg=24px, xl=32px, 2xl=48px
- UX-DR13: Set card padding to 24px internal spacing
- UX-DR14: Set card vertical gaps to 16px on mobile, 24px on desktop
- UX-DR15: Set button height to 48px (≥44px touch target)
- UX-DR16: Apply safe area padding (16px horizontal on mobile) to avoid notch/keyboard overlap

**Mobile Layout (Primary)**

- UX-DR17: Display HourSelector grid in 3 columns on mobile
- UX-DR18: Display prayer cards in full-width stack with vertical scroll
- UX-DR19: Display LiturgicalHeader sticky on mobile (always visible during scroll)
- UX-DR20: Use full viewport width (100vw, safe area constrained)
- UX-DR21: Center content with safe padding; no fixed max-width constraint on mobile

**Desktop Layout (Secondary)**

- UX-DR22: Set max content width to 800px for reading comfort
- UX-DR23: Center content horizontally with 32px padding on each side
- UX-DR24: Display LiturgicalHeader sticky (visible always on scroll)
- UX-DR25: Support optional sidebar for future date picker/calendar (post-MVP)

**HourSelector Component**

- UX-DR26: Display 7 canonical hour buttons in 3-column grid on mobile
- UX-DR27: Highlight nearest hour with soft_brown background (#8b7d6b) + white text
- UX-DR28: Show button height ≥48px for touch target compliance
- UX-DR29: Display date above hour grid (current date or selected date)

**HourView Component**

- UX-DR30: Display LiturgicalHeader at top with full liturgical context hierarchy
- UX-DR31: Display each prayer card with clear spacing and readable typography
- UX-DR32: Show info icon (ℹ️) on each prayer section card
- UX-DR33: Display card progress indicator (e.g., "Himno — 1 of 5")
- UX-DR34: Provide Previous/Next buttons for card navigation (user-controlled, no auto-advance in MVP)

**PrayerCard Component**

- UX-DR35: Render prayer text in serif font (18px) with 1.8 line-height for breathing room
- UX-DR36: Apply consistent padding (24px) to card internal content
- UX-DR37: Display no animations (respect contemplative, static feel)
- UX-DR38: Make card content vertically scrollable if exceeds screen height

**AudioPlayer Component**

- UX-DR39: Display "Escuchar" button as primary interaction point
- UX-DR40: Provide Play/Pause toggle button with visual state change (icon swap)
- UX-DR41: Display speed dropdown menu with 5 options (0.75x, 1x, 1.25x, 1.5x, 2x)
- UX-DR42: Highlight current speed selection in dropdown
- UX-DR43: Maintain speed selection across card changes during session

**LiturgicalHeader Component**

- UX-DR44: Display hierarchy: date → saint/feast name → Psaltery week + season → reading cycle
- UX-DR45: Center-align header content
- UX-DR46: Apply season-driven background color per CSS data-season mapping
- UX-DR47: Make header text color adapt to background (white text on dark season colors)
- UX-DR48: Display with prominent visual styling (larger font, distinct from prayer cards)

**CalendarView Component**

- UX-DR49: Display monthly calendar grid (7 columns for days of week)
- UX-DR50: Show current month by default; provide previous/next month navigation buttons
- UX-DR51: Highlight Sundays and feasts with accent color (season-appropriate)
- UX-DR52: Show saint/feast name in tooltip when day is tapped/hovered
- UX-DR53: Allow tapping any day to navigate to HourSelector for that date
- UX-DR54: Apply responsive layout (full-width grid on mobile, centered on desktop)

**Microcopy & Voice/Tone**

- UX-DR55: Use reverent, clear language (no pressure, no jargon, no condescension)
- UX-DR56: Label HourSelector with "Selecciona tu Hora" (Select your Hour)
- UX-DR57: Use "Escuchar" for audio button (Listen)
- UX-DR58: Use "¿Qué día deseas rezar?" for date picker prompt (Which day would you like to pray?)
- UX-DR59: Display helpful info icon tooltips (e.g., "Invitatorio: Opening prayer that invites us to prayer")
- UX-DR60: Show encouragement, not urgency ("Your Laudes for today" not "Don't forget!")

**Accessibility Features**

- UX-DR61: Display keyboard focus ring with gold color (#d4af37) on all interactive elements
- UX-DR62: Ensure focus ring is at least 2px thick and visible against all backgrounds
- UX-DR63: Maintain logical tab order (left-to-right, top-to-bottom)
- UX-DR64: Prevent keyboard traps (Tab can exit any component)
- UX-DR65: Use semantic HTML structure throughout (not div soup)
- UX-DR66: Provide aria-live="polite" announcements when card index changes
- UX-DR67: Use aria-hidden="true" on decorative icons
- UX-DR68: Label buttons with visible text or aria-label

**Dark Mode**

- UX-DR69: Invert text colors in dark mode (light cream on dark bg)
- UX-DR70: Maintain ≥4.5:1 contrast ratio in dark mode
- UX-DR71: Keep warm tone even in dark mode (avoid pure black, use #1a1815)
- UX-DR72: Apply dark mode automatically per OS preference (no toggle in MVP)

---

## Epic List

### Epic 1: Project Initialization & Infrastructure
Infrastructure foundation enabling all features. Team sets up development environment, project structure, design token system, routing, state management, romcal integration, and GitHub Pages deployment pipeline.

**FRs covered:** AR1-37, NFR20-26

**User Outcome:** Development environment is ready; all infrastructure supports the prayer experience.

---

### Epic 2: Core Prayer Selection & Experience
User can select a canonical hour and pray through complete texts with correct liturgical context, date, and saint information. Implements core prayer interface with modular card-based navigation and accessible structure.

**FRs covered:** FR1-19, FR38-42, UX-DR25-48

**User Outcome:** User can select canonical hour and pray through complete texts with correct liturgical context.

---

### Epic 3: Audio Playback
User can listen to prayers at adjustable speeds while following along or with eyes-free usage. Integrates Web Speech API with intuitive speed controls and graceful fallback.

**FRs covered:** FR20-25, UX-DR39-43

**User Outcome:** User can listen to prayers at adjustable speeds (0.75x–2x).

**Depends on:** Epic 2

---

### Epic 4: Liturgical Calendar & Date Browsing
User can browse the liturgical calendar, see feast days and seasons, and navigate to prayer experience for any past or future date.

**FRs covered:** FR26-32, UX-DR49-54

**User Outcome:** User can browse liturgical calendar and explore prayers for any past or future date.

**Depends on:** Epic 2

---

### Epic 5: Personalization & Advanced Accessibility
User can customize font sizes and theme, navigate fully via keyboard, and use screen readers with complete semantic labeling and live region announcements. Achieves WCAG AA accessibility standards.

**FRs covered:** FR33-37, FR39-45, UX-DR69-72

**User Outcome:** User can customize fonts/theme and navigate fully via keyboard or screen reader.

**Depends on:** Epic 2

---

## Requirements Coverage Map

### Functional Requirements (FR) Coverage

**Epic 1: Initialization & Infrastructure**
- FR1: Use romcal library to retrieve liturgical date components (infrastructure integration)
- FR6: Cache romcal calculations by year (hooks + state management)

**Epic 2: Core Prayer Selection & Experience**
- FR2: Retrieve liturgical data from romcal library for correct celebration, saints, feast names
- FR3: Load and present complete prayer text for each of 7 canonical hours
- FR4: Resolve prayer content with priority: Feast > Season > Psalter
- FR5: Display prayer content in sequential modular cards
- FR7: Display HourSelector home screen with 7 canonical hour buttons
- FR8: Highlight the nearest canonical hour to current time
- FR9: Allow user to select any canonical hour from HourSelector
- FR10: Navigate to HourView when hour button is tapped
- FR11: Provide navigation back to HourSelector from HourView
- FR12: Display sequential navigation between prayer cards
- FR13: Support deep-linked URLs by date
- FR14: Support deep-linked URLs by date and hour
- FR15: Make deep-linked URLs shareable and bookmarkable
- FR16: Display LiturgicalHeader at top of HourView
- FR17: Color LiturgicalHeader background based on liturgical season
- FR18: Display info icons on each prayer card section
- FR19: Show tooltips explaining each prayer section
- FR38: Support full keyboard navigation
- FR39: Maintain logical tab order
- FR40: Display visible focus indicator
- FR41: Provide semantic HTML structure
- FR42: Label all interactive elements

**Epic 3: Audio Playback**
- FR20: Provide audio playback via Web Speech API
- FR21: Allow user to toggle audio play/pause
- FR22: Provide audio speed controls with 5 options
- FR23: Remember selected audio speed during session
- FR24: Allow user to jump between cards while audio playing
- FR25: Gracefully degrade when Web Speech API unavailable

**Epic 4: Liturgical Calendar & Date Browsing**
- FR26: Display monthly liturgical calendar grid
- FR27: Show current month by default in calendar
- FR28: Provide navigation buttons to browse months
- FR29: Highlight liturgically significant days with accent color
- FR30: Highlight Sundays in calendar
- FR31: Display saint/feast names in calendar tooltips
- FR32: Allow user to select any day and navigate to HourSelector

**Epic 5: Personalization & Advanced Accessibility**
- FR33: Support adjustable font sizes (small, normal, large, xl)
- FR34: Apply font size selection via CSS variable scaling
- FR35: Store font size preference in browser localStorage
- FR36: Respect system dark mode preference
- FR37: Provide dark mode and light mode with appropriate contrast
- FR43: Associate form inputs with label elements
- FR44: Announce card changes to screen readers
- FR45: Ensure all alt text or aria-hidden on decorative images

---

### Non-Functional Requirements (NFR) Coverage

**Epic 1: Initialization & Infrastructure**
- NFR20: Deploy as fully static site
- NFR21: Host on GitHub Pages without 404 handling
- NFR22: Use HashRouter for URL routing
- NFR23: Minimize external dependencies
- NFR24: Use CSS Modules for component encapsulation
- NFR25: Use React Context for state management
- NFR26: Support automatic CI/CD deployment via GitHub Actions

**Epic 2: Core Prayer Selection & Experience**
- NFR1: Achieve 100% liturgical accuracy
- NFR2: Verify prayer content against canonical liturgical sources
- NFR3: Correctly display liturgical colors for each season
- NFR4: Initial page load completes in <2 seconds
- NFR5: Prayer card navigation is instantaneous
- NFR13: Support Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- NFR14: Function correctly on iOS
- NFR15: Function correctly on Android
- NFR16: Support both portrait and landscape orientations
- NFR17: Support desktop responsive layout
- NFR18: Support tablet responsive layout

**Epic 3: Audio Playback**
- NFR6: Audio playback does not stutter or cause layout jank
- NFR19: Graceful fallback when Web Speech API unavailable

**Epic 4: Liturgical Calendar & Date Browsing**
- (Covered by Epic 2 browser support and performance requirements)

**Epic 5: Personalization & Advanced Accessibility**
- NFR7: WCAG AA contrast ratio ≥4.5:1 for all text
- NFR8: All interactive elements ≥44px × 44px
- NFR9: No horizontal scroll on any breakpoint except maps
- NFR10: Support responsive text sizing
- NFR11: No autoplay animations; respect prefers-reduced-motion
- NFR12: No flashing content

---

### Additional Requirements (AR) Coverage

**Epic 1: Initialization & Infrastructure**
- AR1-37: All technical stack, architecture, hooks, utilities, data structure, integration, deployment, and CI/CD requirements

**Epic 2: Core Prayer Selection & Experience**
- AR9-15: Component implementation (HourSelector, HourView, LiturgicalHeader, PrayerCard, contexts)
- AR27-29: Prayer content JSON structure (Psalter, seasons, feasts)

**Epic 3: Audio Playback**
- (Uses components/hooks from Epic 1)

**Epic 4: Liturgical Calendar & Date Browsing**
- (Uses components/hooks from Epic 1)

**Epic 5: Personalization & Advanced Accessibility**
- (Uses components/hooks from Epic 1)

---

### UX Design Requirements (UX-DR) Coverage

**Epic 1: Initialization & Infrastructure**
- UX-DR1-6: Color palette and theming system (CSS custom properties)
- UX-DR7-11: Typography implementation
- UX-DR12-25: Spacing, layout, and design tokens

**Epic 2: Core Prayer Selection & Experience**
- UX-DR26-48: HourSelector, HourView, PrayerCard, LiturgicalHeader component specifications
- UX-DR55-68: Microcopy, voice/tone, accessibility features

**Epic 3: Audio Playback**
- UX-DR39-43: AudioPlayer component specifications

**Epic 4: Liturgical Calendar & Date Browsing**
- UX-DR49-54: CalendarView component specifications

**Epic 5: Personalization & Advanced Accessibility**
- UX-DR69-72: Dark mode and advanced accessibility implementation

---

## Requirements Summary

| Requirement Type | Count | Epic 1 | Epic 2 | Epic 3 | Epic 4 | Epic 5 | Status |
|---|---|---|---|---|---|---|---|
| Functional Requirements (FR) | 45 | 2 | 22 | 6 | 7 | 8 | ✅ Mapped |
| Non-Functional Requirements (NFR) | 30 | 7 | 11 | 2 | — | 5 | ✅ Mapped |
| Additional Requirements (AR) | 38 | 37 | 8 | — | — | — | ✅ Mapped |
| UX Design Requirements (UX-DR) | 72 | 25 | 30 | 5 | 6 | 4 | ✅ Mapped |
| **TOTAL** | **185** | **71** | **71** | **13** | **13** | **17** | **✅ All Mapped** |

---

**Status:** Epics approved and requirements mapped. Stories created.

---

# Detailed Epic Stories

## Epic 1: Project Initialization & Infrastructure

Infrastructure foundation enabling all features. Team sets up development environment, project structure, design token system, routing, state management, romcal integration, and GitHub Pages deployment pipeline.

**FRs covered:** AR1-37, NFR20-26  
**User Outcome:** Development environment is ready; all infrastructure supports the prayer experience.

### Story 1.1: Initialize React + Vite Project with GitHub Pages Configuration

**As a** developer,  
**I want** to scaffold a React project with Vite and configure it for GitHub Pages,  
**So that** I have a working development environment with fast builds and proper deployment settings.

**Acceptance Criteria:**

**Given** a fresh project directory  
**When** I run the project setup script  
**Then** a React + Vite project is created with:
- `package.json` with React 18+ and Vite dependencies
- Vite configuration with base URL `/liturgia-de-las-horas/` for GitHub Pages
- Development server runs on `npm run dev` with hot module replacement
- Build output in `dist/` folder via `npm run build`

**And** I can build the project without errors  
**And** `npm run preview` shows the production build locally

---

### Story 1.2: Set Up React Router v6 with HashRouter for Client-Side Routing

**As a** developer,  
**I want** to implement client-side routing with HashRouter,  
**So that** deep-linked URLs work on GitHub Pages without server-side routing.

**Acceptance Criteria:**

**Given** the React + Vite project from Story 1.1  
**When** I implement React Router v6 with HashRouter  
**Then** the following routes are configured and functional:
- `/#/` → Home (HourSelector, default today's date)
- `/#/:date` → HourSelector for specific date (YYYY-MM-DD format)
- `/#/:date/:hour` → HourView for specific date and hour
- `/#/calendario` → CalendarView

**And** all URLs are deep-linkable (shareable and bookmarkable)  
**And** hard refresh on any route works without 404 errors  
**And** browser back/forward navigation works correctly

---

### Story 1.3: Implement LiturgicalContext and PreferencesContext Providers

**As a** developer,  
**I want** to create React Context providers for global state,  
**So that** components can access liturgical data and user preferences without prop drilling.

**Acceptance Criteria:**

**Given** the routed React project from Story 1.2  
**When** I implement context providers  
**Then** LiturgicalContext is created with state:
- `selectedDate` (YYYY-MM-DD format, defaults to today)
- `liturgicalDay` (romcal output data)
- `selectedHour` (hour key: "laudes", "visperas", etc.)

**And** PreferencesContext is created with state:
- `fontSize` ("small", "normal", "large", "xl")
- `prefersDarkMode` (boolean, derived from OS preference)

**And** both contexts are wrapped in App.jsx with proper provider hierarchy  
**And** localStorage hook persists fontSize preference across sessions  
**And** components can access context via `useContext(LiturgicalContext)` and `useContext(PreferencesContext)`

---

### Story 1.4: Implement Design Token System with CSS Custom Properties

**As a** developer,  
**I want** to establish a complete CSS custom properties system with design tokens,  
**So that** all components use consistent colors, typography, spacing, and theming.

**Acceptance Criteria:**

**Given** the context-enabled React project  
**When** I create the design token system in `src/index.css`  
**Then** CSS custom properties are defined for:

**Colors:**
- Base palette: `--cream`, `--white`, `--warm-gray-light`, `--warm-gray-mid`, `--warm-gray-dark`, `--soft-brown`
- Functional: `--text-primary`, `--text-secondary`, `--text-inverse`, `--focus-ring`, `--error`, `--success`
- Liturgical seasons: `--accent-color` (mapped to season-specific color)

**Typography:**
- `--serif-family`, `--serif-size-base` (18px), `--serif-line-height` (1.8)
- `--sans-family`, `--sans-size-base` (16px), `--sans-size-sm`, `--sans-size-lg`, `--sans-line-height` (1.5)
- `--heading-size-lg` (32px), `--heading-size-md` (24px), `--heading-size-sm` (20px)

**Spacing:**
- `--spacing-xs` (4px) through `--spacing-2xl` (48px)

**Components:**
- `--card-padding` (24px), `--button-height` (48px), `--touch-target-min` (44px)

**And** CSS custom properties are applied to `:root` for light mode  
**And** dark mode variants are defined via `@media (prefers-color-scheme: dark)`  
**And** font size scaling works via body classes (`.font-sm`, `.font-lg`, etc.) with `--base-font-size` variable  
**And** CSS Modules are configured for component-scoped styling with no global conflicts

---

### Story 1.5: Create CSS Modules Architecture and Global Styles

**As a** developer,  
**I want** to establish CSS Modules for component encapsulation,  
**So that** component styles don't conflict with each other and theming is consistent.

**Acceptance Criteria:**

**Given** design tokens defined from Story 1.4  
**When** I set up CSS Modules architecture  
**Then** each component has a paired `.module.css` file:
- `HourSelector.module.css`
- `HourView.module.css`
- `LiturgicalHeader.module.css`
- `PrayerCard.module.css`
- `AudioPlayer.module.css`
- `CalendarView.module.css`

**And** global styles in `src/index.css` include:
- CSS custom properties definitions
- `body`, `html` styling with base font and colors
- Dark mode media query
- Smooth scrolling and focus management
- Reset styles for button, input, link elements

**And** components import styles: `import styles from './ComponentName.module.css'`  
**And** CSS classes are applied via `className={styles.className}` notation  
**And** no global class name conflicts occur when multiple components are rendered together

---

### Story 1.6: Integrate romcal Library and Implement useLiturgicalDay Hook

**As a** developer,  
**I want** to integrate the romcal library and create a custom hook for calendar calculations,  
**So that** components can access accurate liturgical data for any date.

**Acceptance Criteria:**

**Given** the React project with contexts from Story 1.3  
**When** I integrate romcal and implement useLiturgicalDay hook  
**Then** romcal is installed: `npm install romcal@3.0.0-dev` (pinned version)

**And** useLiturgicalDay hook in `src/hooks/useLiturgicalDay.js` provides:
- Input: `dateStr` (YYYY-MM-DD format)
- Output: liturgical day object with saint, season, psaltery week, cycles, celebrations
- Caching: Results cached by year to avoid redundant computation
- Async handling: Hook properly handles async romcal.generateCalendar() calls

**And** hook is used in LiturgicalContext to fetch data when selectedDate changes  
**And** GeneralRoman_Es locale is configured for Spanish language support  
**And** hook returns appropriate fallback data if romcal computation fails (e.g., "Ordinary weekday, Week 1")

---

### Story 1.7: Implement CSS Variables for Liturgical Season Colors

**As a** developer,  
**I want** to map liturgical seasons to CSS variable color tokens,  
**So that** header and UI colors automatically reflect the current liturgical season.

**Acceptance Criteria:**

**Given** the design tokens and romcal integration from Stories 1.4 & 1.6  
**When** I implement season-to-color mapping  
**Then** in `src/utils/liturgicalColors.js`, a utility maps seasons to CSS tokens:
- ORDINARY_TIME → `#2e7d32` (green)
- ADVENT → `#6a1b9a` (purple)
- CHRISTMASTIDE → `#f0f0f0` (white)
- LENT → `#5e35b1` (dark purple)
- EASTERTIDE → `#d4af37` (gold)

**And** when LiturgicalContext updates selectedDate, `data-season` attribute on `<html>` root updates  
**And** CSS `:root[data-season="..."]` selector applies season color to `--accent-color` variable  
**And** LiturgicalHeader automatically reflects the correct color for the current season

---

### Story 1.8: Set Up GitHub Actions Deployment Pipeline

**As a** developer,  
**I want** to automate deployment to GitHub Pages via GitHub Actions,  
**So that** every push to main automatically builds and deploys the site.

**Acceptance Criteria:**

**Given** the complete Vite + React project  
**When** I create the GitHub Actions workflow at `.github/workflows/deploy.yml`  
**Then** the workflow includes:
- Trigger: on push to `main` branch
- Checkout code
- Install Node.js 20
- Run `npm ci` to install dependencies
- Run `npm run build` to create production build
- Upload `dist/` as GitHub Pages artifact
- Deploy to `https://netor82.github.io/liturgia-de-las-horas/`

**And** the workflow file has proper YAML syntax and runs without errors  
**And** on first deployment, the site is live at the GitHub Pages URL  
**And** subsequent pushes to main automatically trigger rebuild and redeploy

---

## Epic 2: Core Prayer Selection & Experience

User can select a canonical hour and pray through complete texts with correct liturgical context, date, and saint information. Implements core prayer interface with modular card-based navigation and accessible structure.

**FRs covered:** FR1-19, FR38-42  
**User Outcome:** User can select canonical hour and pray through complete texts with correct liturgical context.

### Story 2.1: Implement HourSelector Component with Hour Grid and Nearest Hour Highlight

**As a** praying user,  
**I want** to see the 7 canonical hours on the home screen and quickly identify which one I should pray now,  
**So that** I can select the correct hour without confusion.

**Acceptance Criteria:**

**Given** the user opens the app at `/` (HourSelector for today)  
**When** the HourSelector component renders  
**Then** a 3-column grid displays 7 canonical hour buttons:
- Oficio de Lectura, Laudes, Tercia, Sexta, Nona, Vísperas, Completas
- Button height ≥48px for touch target compliance
- Each button has clear, readable text

**And** the nearest canonical hour (based on current time) is highlighted with:
- soft_brown background (#8b7d6b)
- white text
- subtle visual distinction (no animation)

**And** above the grid, the current date is displayed (or selected date if not today)  
**And** when user taps an hour button, navigation to HourView occurs for that hour on the selected date  
**And** component respects responsive layout:
- Full width on mobile with safe area padding (16px)
- Centered with max-width 800px on desktop
- Works in both portrait and landscape orientations

---

### Story 2.2: Implement LiturgicalHeader Component with Season-Driven Theming

**As a** user during prayer,  
**I want** to see the liturgical context at the top (saint/feast, Psaltery week, season, cycle),  
**So that** I understand what I'm praying and why these texts are correct for today.

**Acceptance Criteria:**

**Given** HourView is displayed for a specific date and hour  
**When** LiturgicalHeader component renders at the top  
**Then** it displays in this hierarchy:
- Date (e.g., "Jueves, 5 de junio")
- Saint/Feast name (from romcal)
- Psaltery week + Liturgical season (e.g., "Semana 3 del Tiempo Ordinario")
- Reading cycle (e.g., "Año A")

**And** the header background color matches the liturgical season:
- Advent: purple (#6a1b9a)
- Ordinary Time: green (#2e7d32)
- Lent: dark purple (#5e35b1)
- Eastertide: gold (#d4af37)
- Christmastide: white (#f0f0f0)

**And** text color contrasts appropriately (white text on dark backgrounds, dark text on light)  
**And** header remains sticky/fixed at top of viewport on scroll  
**And** header uses larger typography (24px or heading-size-md) for prominence  
**And** centered alignment with generous spacing (24px padding)

---

### Story 2.3: Implement PrayerCard Component for Individual Prayer Sections

**As a** user praying,  
**I want** each prayer section (Invitatorio, Himno, Salmodia, etc.) displayed in its own readable card,  
**So that** I can focus on one section at a time without visual clutter.

**Acceptance Criteria:**

**Given** HourView displays a prayer session  
**When** PrayerCard component renders for each section  
**Then** each card displays:
- Section title (e.g., "Himno", "Salmodia")
- Prayer text in serif font (Georgia/Garamond, 18px, 1.8 line-height)
- Info icon (ℹ️) that opens a tooltip explaining the section
- Visual separation from adjacent cards (16px gap on mobile, 24px on desktop)

**And** card padding is 24px internal spacing  
**And** text is fully readable with high contrast (≥4.5:1 per WCAG AA)  
**And** no animations or unnecessary visual effects  
**And** card content scrolls vertically if it exceeds screen height  
**And** font size scales with user's fontSize preference (small, normal, large, xl)

**And** when user taps the info icon, a tooltip appears with explanation:
- Example: "Himno: Poetry sung to celebrate the hour"
- Tooltip is dismissible (tap away or ESC key)

---

### Story 2.4: Implement HourView Component with Card Navigation and Layout

**As a** user praying,  
**I want** to navigate through prayer cards sequentially with Previous/Next buttons,  
**So that** I can control my pace and move through the prayer session at my own speed.

**Acceptance Criteria:**

**Given** user has selected a canonical hour from HourSelector  
**When** HourView component renders for that hour  
**Then** it displays:
- LiturgicalHeader at top (from Story 2.2)
- Current prayer card (PrayerCard from Story 2.3)
- Previous/Next buttons at bottom for card navigation
- Back to Home button to return to HourSelector

**And** Previous button is disabled on the first card, enabled afterwards  
**And** Next button is disabled on the last card, enabled otherwise  
**And** clicking Next shows the next card and scrolls to top  
**And** clicking Previous shows the previous card and scrolls to top  
**And** current card index is tracked in component state

**And** HourView respects responsive layout:
- Full-width on mobile with safe area padding
- Centered (max 800px) on desktop
- LiturgicalHeader sticky on all screen sizes

**And** deep-linked URL `/#/:date/:hour` correctly initializes HourView for that date/hour  
**And** component preserves card position when navigating away and back (via URL state)

---

### Story 2.5: Create Prayer Content JSON Structure for All Canonical Hours

**As a** developer,  
**I want** to define the JSON schema and directory structure for prayer content,  
**So that** each canonical hour's prayers are organized and accessible.

**Acceptance Criteria:**

**Given** the React project structure  
**When** I create the prayer content directory structure  
**Then** folders are created for each of 7 canonical hours:
- `src/data/hours/oficio-de-lectura/`
- `src/data/hours/laudes/`
- `src/data/hours/tercia/`
- `src/data/hours/sexta/`
- `src/data/hours/nona/`
- `src/data/hours/visperas/`
- `src/data/hours/completas/`

**And** within each hour folder, subdirectories exist:
- `psalter/` with files: `week-1.json`, `week-2.json`, `week-3.json`, `week-4.json`
- `seasons/` with files: `advent.json`, `lent.json`, `eastertide.json`, `christmastide.json`
- `feasts/` with files named by romcal celebration keys (e.g., `sacred_heart_of_jesus.json`)

**And** JSON schema for each file is an array of prayer cards with fields: type, title, content

**And** at least one complete hour (Laudes) has complete prayer texts for all Psalter weeks and seasons (for MVP demonstration)  
**And** other hours have placeholder content (same structure, to be filled in parallel)

---

### Story 2.6: Implement Content Resolver Utility with Feast > Season > Psalter Priority

**As a** developer,  
**I want** to resolve prayer content with correct priority (Feast-specific > Seasonal > Psalter),  
**So that** each hour displays the theologically correct prayers for the date.

**Acceptance Criteria:**

**Given** a liturgicalDay object (from romcal) and an hour name  
**When** contentResolver.resolveContent(hour, liturgicalDay) is called  
**Then** it returns prayer cards in this priority order:
1. **Feast**: If the date has a celebration, load feast-specific content
2. **Season**: If feast not found, load from seasonal content
3. **Psalter**: If season not found, load from psalter using the Psaltery week from romcal

**And** the resolver handles missing files gracefully  
**And** the resolver is cached within a session to avoid redundant file loads  
**And** resolver is tested for a sample of dates (regular weekday, seasonal date, major feast)

---

### Story 2.7: Implement Keyboard Navigation and Semantic HTML Structure

**As a** user with keyboard-only access or screen reader,  
**I want** to navigate the entire prayer experience using only keyboard and audio cues,  
**So that** I can pray fully using assistive technology.

**Acceptance Criteria:**

**Given** the complete HourView component  
**When** I interact via keyboard only  
**Then** all interactive elements are reachable via Tab key in logical order  
**And** Enter/Space activates buttons when focused  
**And** Escape key closes tooltips/modals  
**And** visible focus indicator (gold ring #d4af37) appears on all focused elements  
**And** no keyboard traps exist (can Tab out of any component)

**And** semantic HTML is used throughout (`<button>`, `<nav>`, `<main>`, `<article>`, `<label>`)  
**And** ARIA labels are applied where needed  
**And** screen reader announces card changes (aria-live="polite")

---

### Story 2.8: Implement Info Icons and Section Tooltips

**As a** user new to the Liturgy of the Hours,  
**I want** to tap an info icon to learn what each prayer section means,  
**So that** I can understand the liturgical purpose and tradition behind each part.

**Acceptance Criteria:**

**Given** PrayerCard is rendered for a prayer section  
**When** user taps the info icon (ℹ️)  
**Then** a tooltip appears with:
- Clear, non-jargon explanation of that section
- Example explanations for each prayer type
- Tooltip positioned near the icon without obscuring text

**And** tooltip dismisses when user taps elsewhere or presses Escape  
**And** tooltip is accessible to screen readers  
**And** tooltip text uses reverent, encouraging language (not pressure or jargon)

---

### Story 2.9: Verify Liturgical Accuracy Against Canonical Sources

**As a** developer,  
**I want** to verify that prayer texts and liturgical calculations are 100% accurate,  
**So that** users can trust the app for their prayer life.

**Acceptance Criteria:**

**Given** the complete prayer content and romcal integration  
**When** I test against canonical liturgical sources  
**Then** I verify:
- Today's canonical hour texts match official sources exactly
- A future feast date displays correct feast-specific prayers
- A past date displays correct Psalter week based on liturgical calendar
- Liturgical colors are correct for current season
- Saint names and feast names match official names

**And** verification is documented with sample test dates and sources cited  
**And** at least 5 dates across different seasons are verified before deployment

---

## Epic 3: Audio Playback

User can listen to prayers at adjustable speeds while following along or with eyes-free usage. Integrates Web Speech API with intuitive speed controls and graceful fallback.

**FRs covered:** FR20-25  
**User Outcome:** User can listen to prayers at adjustable speeds (0.75x–2x).

### Story 3.1: Implement useAudio Hook for Web Speech API Integration

**As a** developer,  
**I want** to create a custom hook that wraps the Web Speech API,  
**So that** components can easily control audio playback without managing browser APIs directly.

**Acceptance Criteria:**

**Given** the React project with hooks directory established  
**When** I implement useAudio hook in `src/hooks/useAudio.js`  
**Then** the hook provides functions and state:
- `isPlaying`: boolean state
- `currentSpeed`: number state (0.75, 1, 1.25, 1.5, 2)
- `play(text)`: function to start speech synthesis
- `pause()`: function to pause playback
- `resume()`: function to resume paused playback
- `setSpeed(speed)`: function to set playback rate
- `stop()`: function to stop playback completely

**And** the hook uses `window.speechSynthesis` Web Speech API with Spanish language  
**And** hook handles edge cases (API unavailable, interruption, cleanup on unmount)  
**And** speed setting persists across play/pause/resume cycles during a session  
**And** hook is tested to ensure all functions work correctly

---

### Story 3.2: Implement AudioPlayer Component with Play/Pause Controls

**As a** user praying,  
**I want** to see a simple button to start and stop listening to the prayer text,  
**So that** I can control when audio plays and respects my pace.

**Acceptance Criteria:**

**Given** HourView displays a prayer card  
**When** AudioPlayer component renders below or within the card  
**Then** it displays:
- "Escuchar" (Listen) button as primary interaction point
- Button height ≥48px for touch target compliance
- Clear visual state (Idle: "Escuchar", Playing: "Pausar", Paused: "Reanudar")

**And** clicking "Escuchar" starts playback via Web Speech API  
**And** clicking "Pausar" pauses playback (position remembered)  
**And** clicking "Reanudar" resumes from where it paused  
**And** button state updates visually without animation  
**And** AudioPlayer uses useAudio hook from Story 3.1

---

### Story 3.3: Implement Audio Speed Controls with 5 Speed Options

**As a** busy user,  
**I want** to adjust playback speed from 0.75x to 2x so I can pray faster or slower based on my schedule,  
**So that** audio adapts to how much time I have available.

**Acceptance Criteria:**

**Given** AudioPlayer component is displayed  
**When** user interacts with speed controls  
**Then** a dropdown menu shows 5 speed options (0.75x, 1x, 1.25x, 1.5x, 2x)

**And** currently selected speed is highlighted visually  
**And** clicking a speed option updates the playback rate immediately if audio is playing  
**And** speed selection is saved and persists within session  
**And** speed menu is accessible via keyboard (arrow keys, Enter to select)

---

### Story 3.4: Wire Audio Player into HourView Card Navigation

**As a** user,  
**I want** audio to work smoothly with prayer card navigation—when I advance to the next card, the audio stops and is ready for the next card,  
**So that** I can navigate between cards and resume listening without confusion.

**Acceptance Criteria:**

**Given** HourView displays a prayer card with AudioPlayer  
**When** user is listening to a card  
**Then** the audio player plays the text of the current card only

**And** when user clicks Next button:
- Audio for current card stops
- Component advances to next card
- AudioPlayer displays "Escuchar" button (ready state)

**And** when user clicks Previous button:
- Audio for current card stops
- Component goes back to previous card
- AudioPlayer displays "Escuchar" button (ready state)

**And** speed selection persists across card changes  
**And** audio playback is a global session state (single session, not per-card storage)

---

### Story 3.5: Implement Graceful Fallback When Web Speech API is Unavailable

**As a** developer,  
**I want** the app to gracefully handle browsers that don't support Web Speech API,  
**So that** users without Web Speech API can still pray (just without audio).

**Acceptance Criteria:**

**Given** a browser that doesn't support Web Speech API  
**When** HourView loads  
**Then** the AudioPlayer component:
- Detects that Web Speech API is unavailable
- Hides the "Escuchar" button and speed controls gracefully
- Does not show error messages to user
- Allows prayer card text to display normally

**And** if user later visits from a browser WITH Web Speech API, audio controls reappear  
**And** the app remains fully functional without audio  
**And** console may log warning for developers, but no user-facing error occurs

---

### Story 3.6: Test Audio Accessibility and User Experience

**As a** QA tester,  
**I want** to verify that audio works correctly across devices and use cases,  
**So that** users have a reliable, accessible audio experience.

**Acceptance Criteria:**

**Given** the complete AudioPlayer implementation  
**When** I test audio functionality  
**Then** I verify:

**Core Functionality:**
- Play button starts audio playback
- Pause button stops audio (position remembered)
- Resume button continues from paused position
- Speed changes apply correctly (0.75x to 2x) and are audible
- Audio stops when advancing to next card

**Accessibility:**
- Audio button is keyboard accessible (Tab, Enter/Space)
- Audio button is announced by screen readers
- Speed dropdown is keyboard accessible
- Visual focus indicator visible on audio button when focused

**Devices & Browsers:**
- Audio works on Chrome (desktop, Android)
- Audio works on Firefox (desktop)
- Audio works on Safari (macOS, iOS)
- Audio works on Edge (desktop)
- Graceful fallback on browsers without Web Speech API

**Edge Cases:**
- Rapid clicking play/pause doesn't cause errors
- Changing speed while audio plays works smoothly
- Navigating away from HourView and back stops audio safely
- App remains responsive during audio playback

---

## Epic 4: Liturgical Calendar & Date Browsing

User can browse the liturgical calendar, see feast days and seasons, and navigate to prayer experience for any past or future date.

**FRs covered:** FR26-32  
**User Outcome:** User can browse liturgical calendar and explore prayers for any past or future date.

### Story 4.1: Implement CalendarView Component with Monthly Grid Display

**As a** user exploring the liturgical year,  
**I want** to see a calendar view of the current month with all days displayed in a grid,  
**So that** I can visually browse the liturgical calendar and find interesting dates.

**Acceptance Criteria:**

**Given** user navigates to `/#/calendario`  
**When** CalendarView component renders  
**Then** it displays:
- Current month and year as heading
- 7-column grid (Sunday through Saturday)
- Day numbers in each cell (1-31 depending on month)
- Days of week headers

**And** grid layout is responsive:
- Full-width on mobile with safe padding (16px)
- Centered with max-width 800px on desktop
- Touch targets (each day) are ≥44px × 44px

**And** day cells are styled consistently with design tokens  
**And** empty cells (days from previous/next months) are visible but de-emphasized  
**And** component properly handles months with varying lengths  
**And** component works in both portrait and landscape orientations

---

### Story 4.2: Implement Previous/Next Month Navigation

**As a** user,  
**I want** to navigate backward and forward through months to explore any date in the past or future,  
**So that** I can find specific feast days or browse the liturgical year.

**Acceptance Criteria:**

**Given** CalendarView is displayed  
**When** I interact with month navigation  
**Then** Previous/Next buttons are displayed:
- "‹ Anterior" (Previous) button on the left
- "Siguiente ›" (Next) button on the right
- Button height ≥48px for touch target compliance

**And** clicking Previous Month updates calendar to show previous month  
**And** clicking Next Month updates calendar to show next month  
**And** month/year heading updates accordingly  
**And** navigation works for any month in the past or future  
**And** buttons are always enabled (no arbitrary limits)  
**And** buttons are keyboard accessible (Tab to focus, Enter/Space to activate)

---

### Story 4.3: Highlight Sundays and Liturgically Significant Days (Feasts)

**As a** user,  
**I want** to visually distinguish Sundays and major feast days in the calendar,  
**So that** I can quickly spot important liturgical dates.

**Acceptance Criteria:**

**Given** CalendarView displays a month  
**When** calendar renders days  
**Then** Sundays are highlighted with:
- Subtle visual distinction (slightly different background or border)
- Not overwhelming (respects contemplative design)

**And** liturgically significant days (feasts, celebrations) are highlighted with:
- Accent color matching the current season (Advent purple, Ordinary green, Lent purple, Eastertide gold, Christmastide white)
- Clear visual prominence without clashing

**And** feast highlighting is determined by romcal data  
**And** highlighting works across all months and years  
**And** contrast is maintained (≥4.5:1) for accessibility

---

### Story 4.4: Display Saint/Feast Names in Day Tooltips

**As a** user,  
**I want** to see the name of the saint or feast when I tap/hover on a day,  
**So that** I know what liturgical celebration that day commemorates.

**Acceptance Criteria:**

**Given** CalendarView displays a day with a celebration  
**When** user taps or hovers on the day  
**Then** a tooltip appears showing:
- Saint or feast name (from romcal, in Spanish)
- Optional: Rank or type of celebration

**And** tooltip appears near the day without obscuring calendar  
**And** tooltip is styled consistently with design tokens  
**And** tooltip dismisses when user taps elsewhere, presses Escape, or navigates away  
**And** tooltip is accessible to screen readers  
**And** regular weekdays show "Weekday" or similar neutral label  
**And** tooltip works on mobile (tap), desktop (hover), and with keyboard navigation

---

### Story 4.5: Allow Day Selection and Navigation to HourSelector

**As a** user,  
**I want** to tap any day in the calendar and immediately see the hours for that day,  
**So that** I can explore the prayer texts available for any date.

**Acceptance Criteria:**

**Given** CalendarView is displayed  
**When** user taps/clicks on any day in the calendar  
**Then** the app navigates to `/#/:date` where `:date` is YYYY-MM-DD format for the selected day  
**And** HourSelector is displayed showing:
- The selected date (not today)
- All 7 canonical hours for that date
- Correct nearest-hour highlighting for that date

**And** when user taps an hour button, HourView is displayed for that date and hour  
**And** deep link works correctly: user can share or bookmark `/#/2026-06-24` and it navigates directly  
**And** navigation is smooth (no page reload, no lag)  
**And** browser back button returns to CalendarView with same month/year visible  
**And** keyboard navigation works: Tab to day, Enter/Space to select

---

### Story 4.6: Test Calendar Accuracy and Romcal Integration

**As a** QA tester,  
**I want** to verify that the calendar displays accurate liturgical data,  
**So that** users can trust the calendar to find liturgical feasts and celebrations.

**Acceptance Criteria:**

**Given** the complete CalendarView implementation  
**When** I test calendar accuracy  
**Then** I verify:

**Feast Highlighting:**
- Major feasts are highlighted correctly
- Moveable feasts are calculated correctly
- Regular weekdays are not highlighted
- Test at least 10 different feast days

**Saint/Feast Names:**
- Saint names match official liturgical sources
- Names are in Spanish (via romcal GeneralRoman_Es)

**Dates & Navigation:**
- Tapping a feast day navigates to correct HourSelector
- Deep link `/#/2026-06-24` shows correct date
- Previous/Next month buttons work across year boundaries
- Navigation works for past years and future years

**Responsive Layout:**
- Calendar grid displays correctly on mobile
- Calendar grid displays correctly on desktop
- Touch targets are ≥44px on mobile

**Accessibility:**
- Keyboard navigation works (Tab through days, Enter to select)
- Screen reader announces day names and feast names
- Focus indicator visible on day cells

---

### Story 4.7: Implement Responsive Calendar Layout for Desktop and Mobile

**As a** developer,  
**I want** to ensure the calendar displays beautifully and usably on all screen sizes,  
**So that** users can browse the calendar effectively on any device.

**Acceptance Criteria:**

**Given** CalendarView component  
**When** rendered on different screen sizes  
**Then** the layout adapts:

**Mobile (< 768px):**
- Full-width calendar with 16px safe area padding
- Day cells appropriately sized for touch (≥44px)
- No horizontal scroll
- Font sizes remain readable

**Tablet (768px - 1023px):**
- Calendar centered with comfortable padding
- Day cells appropriately sized

**Desktop (≥1024px):**
- Calendar centered with max-width 800px
- Generous padding and spacing
- Day cells have hover states

**And** all responsive changes are CSS-only  
**And** touch targets remain ≥44px on all breakpoints  
**And** text remains readable on all sizes

---

## Epic 5: Personalization & Advanced Accessibility

User can customize font sizes and theme, navigate fully via keyboard, and use screen readers with complete semantic labeling and live region announcements. Achieves WCAG AA accessibility standards.

**FRs covered:** FR33-37, FR39-45  
**User Outcome:** User can customize fonts/theme and navigate fully via keyboard or screen reader.

### Story 5.1: Implement Font Size Adjustment UI with localStorage Persistence

**As a** user with vision challenges or personal preference,  
**I want** to adjust the font size of prayer text to small, normal, large, or extra-large,  
**So that** I can read comfortably at my preferred size.

**Acceptance Criteria:**

**Given** the app is running and displaying prayer content  
**When** user accesses font size settings (e.g., header button or settings menu)  
**Then** a font size selector displays 4 options:
- Small (14px base)
- Normal (16px base, default)
- Large (18px base)
- Extra Large (20px base)

**And** when user selects a size:
- All prayer text immediately resizes via CSS variable `--base-font-size`
- UI text (buttons, labels) also scales proportionally
- Selection is visually indicated (current size highlighted)

**And** font size preference is persisted to localStorage with key `fontSize`  
**And** when user returns to the app, their selected font size is restored  
**And** font size adjustment works across all pages  
**And** font size selector is keyboard accessible and screen reader friendly

---

### Story 5.2: Implement Dark Mode Support with prefers-color-scheme

**As a** user,  
**I want** the app to automatically respect my system's dark mode preference,  
**So that** the app matches my device's theme and reduces eye strain at night.

**Acceptance Criteria:**

**Given** the user has set their OS to dark mode  
**When** they open the app  
**Then** the app automatically displays dark mode:
- Background: #1a1815 (dark warm color, not pure black)
- Text: #f5f1e8 (warm cream, not pure white)
- Accent colors adapted for dark backgrounds
- Contrast ≥4.5:1 (WCAG AA) maintained

**And** CSS media query `@media (prefers-color-scheme: dark)` is used  
**And** no toggle button in MVP (respects OS preference automatically)  
**And** all components adapt automatically via CSS  
**And** seasonal accent colors remain visible and readable in dark mode  
**And** user can switch OS theme and app responds immediately  
**And** both light and dark modes maintain WCAG AA contrast requirements

---

### Story 5.3: Implement Advanced ARIA Labels and Screen Reader Announcements

**As a** user with a screen reader,  
**I want** all interactive elements to have clear, descriptive labels,  
**So that** I understand what each button does before interacting with it.

**Acceptance Criteria:**

**Given** the app is accessed with a screen reader  
**When** I navigate using Tab key  
**Then** all buttons have clear labels announced:
- "Previous prayer section" for Previous button
- "Next prayer section" for Next button
- "Information about Invitatorio" for info icon
- "Escuchar" or "Pausar" for audio button
- "Select Laudes hour, 6:00 AM" for hour selector buttons
- "Select June 5" for calendar day buttons

**And** labels are provided via:
- Visible button text (preferred)
- `aria-label` attribute (for icon-only buttons)

**And** live regions announce dynamic changes:
- When card changes: "Himno, card 2 of 5"
- When audio starts: "Audio playing at 1x speed"
- When font size changes: "Font size changed to Large"

---

### Story 5.4: Implement Form Label Associations and Input Accessibility

**As a** user with a screen reader,  
**I want** form inputs to be properly associated with labels,  
**So that** I understand what each input is for before entering data.

**Acceptance Criteria:**

**Given** any form inputs in the app (date picker, font size selector, speed dropdown)  
**When** accessed with a screen reader  
**Then** proper associations are established:
- Each `<input>` has a corresponding `<label>` with matching `for` attribute
- Radio buttons and checkboxes use proper fieldset/legend structure

**And** screen reader announces:
- Input type
- Associated label text
- Current value or selected option
- Any validation errors

**And** all inputs are keyboard accessible:
- Tab to focus
- Enter/Space to activate
- Arrow keys to navigate (for dropdowns)
- Escape to close (for dropdowns/modals)

---

### Story 5.5: Implement Live Region Announcements for Dynamic Content

**As a** user with a screen reader,  
**I want** to be notified when content changes (e.g., card advances, audio starts),  
**So that** I understand what's happening without needing to manually re-read the page.

**Acceptance Criteria:**

**Given** the user is in HourView with a screen reader  
**When** they navigate between cards or interact with audio  
**Then** live region announcements occur:

**Card Navigation:**
- When user clicks Next: "Himno, card 2 of 5"
- When user clicks Previous: "Invitatorio, card 1 of 5"

**Audio Playback:**
- When user clicks "Escuchar": "Audio playing"
- When speed changes: "Speed changed to 1.5 times"
- When user pauses: "Audio paused"

**Other Changes:**
- Font size changes: "Font size changed to Large"

**And** live regions use `aria-live="polite"` attribute  
**And** announcements are concise and clear  
**And** announcements do not interfere with prayer experience

---

### Story 5.6: Implement Alt Text and aria-hidden for Images and Icons

**As a** user with a screen reader,  
**I want** images and icons to be properly labeled or hidden,  
**So that** I only hear what's relevant and don't get confused by decorative elements.

**Acceptance Criteria:**

**Given** the app displays images, icons, or decorative elements  
**When** accessed with a screen reader  
**Then** proper handling is applied:

**Meaningful Icons:**
- Info icon (ℹ️): `aria-label="Information about Invitatorio"`
- Play icon: `aria-label="Play"` (or part of button label)

**Decorative Elements:**
- Spacing/divider elements: `aria-hidden="true"`
- Separator lines: `aria-hidden="true"`

**And** all meaningful content has alternative text  
**And** decorative elements don't clutter screen reader output  
**And** users with screen readers get complete and clear information

---

### Story 5.7: Test WCAG AA Accessibility Compliance

**As a** QA tester,  
**I want** to verify that the app meets WCAG AA accessibility standards,  
**So that** users with disabilities can use the app fully and independently.

**Acceptance Criteria:**

**Given** the complete app with all stories from Epics 1-5  
**When** I test for WCAG AA compliance  
**Then** I verify:

**Contrast & Colors (WCAG AA):**
- Text contrast ≥4.5:1 for normal text
- Text contrast ≥3:1 for large text (18px+)
- Verified in both light and dark modes
- Test all components

**Keyboard Navigation (WCAG AA):**
- All interactive elements reachable via Tab
- Tab order is logical
- No keyboard traps
- Visible focus indicator on all elements (gold ring #d4af37)
- Focus indicator ≥2px and visible

**Screen Reader Support (WCAG AA):**
- Semantic HTML used throughout
- All buttons and links have descriptive text or aria-label
- Form inputs associated with labels
- Live regions announce dynamic changes
- Test with NVDA, JAWS, or VoiceOver

**Mobile & Touch Accessibility:**
- Touch targets ≥44px × 44px
- No horizontal scroll on any page
- Responsive layout works on all breakpoints

**Motion & Animation:**
- Respects `prefers-reduced-motion` setting
- No flashing content
- Audio is optional (not autoplaying)

**And** accessibility testing is documented with tools used and results

---

### Story 5.8: Implement Keyboard Navigation Enhancements and Accessibility Polish

**As a** user with keyboard-only access,  
**I want** smooth keyboard navigation throughout the app with clear focus indicators,  
**So that** I can use all features without a mouse or touch screen.

**Acceptance Criteria:**

**Given** the app is fully implemented from Epics 1-4  
**When** accessed with keyboard only (Tab, Enter/Space, Arrow keys, Escape)  
**Then** the following keyboard patterns work:

**Tab Navigation:**
- Tab through all interactive elements in logical order
- Shift+Tab moves backward
- No unexpected focus jumps or traps
- Focus wraps around

**Arrow Keys (where applicable):**
- HourSelector grid: arrow keys to navigate hour buttons
- CalendarView: arrow keys to navigate day cells
- Speed dropdown: arrow keys to select speed option

**Enter/Space:**
- Activates focused buttons
- Selects focused radio buttons or checkboxes

**Escape:**
- Closes open tooltips or dropdowns
- Closes info icon popups
- Returns focus to triggering element

**And** focus indicator is always visible:
- Gold ring (#d4af37) around focused element
- ≥2px thick
- Visible against all backgrounds

**And** focus order is logical and predictable  
**And** no keyboard traps exist

---

**Extraction, Epic Design & Story Creation Date:** 2026-06-05  
**Status:** ✅ ALL 38 STORIES CREATED AND DOCUMENTED
