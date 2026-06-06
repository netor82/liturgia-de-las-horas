---
name: "Liturgia de las Horas Visual Identity"
status: final
created: 2026-06-05
updated: 2026-06-05

# Design Tokens (YAML frontmatter per Google Labs spec)

colors:
  # Neutral base (warm & traditional)
  cream: "#f5f1e8"
  white: "#fefdf9"
  warm_gray_light: "#e8e4db"
  warm_gray_mid: "#9d9996"
  warm_gray_dark: "#4a4a46"
  soft_brown: "#8b7d6b"
  
  # Liturgical season accents (per romcal data-season attribute)
  advent_purple: "#6a1b9a"
  christmastide_white: "#f0f0f0"
  ordinary_time_green: "#2e7d32"
  lent_purple_dark: "#5e35b1"
  eastertide_gold: "#d4af37"
  
  # Functional
  text_primary: "#4a4a46"
  text_secondary: "#9d9996"
  text_inverse: "#fefdf9"
  
  # Semantic
  focus_ring: "#d4af37"  # Gold for keyboard focus
  error: "#c62828"
  success: "#558b2f"

typography:
  # Prayer text (serif, traditional)
  serif_family: "'Georgia', 'Garamond', serif"
  serif_size_base: "18px"
  serif_line_height: "1.8"
  
  # UI text (clean sans-serif)
  sans_family: "'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', sans-serif"
  sans_size_base: "16px"
  sans_size_sm: "14px"
  sans_size_lg: "18px"
  sans_line_height: "1.5"
  
  # Headings
  heading_size_lg: "32px"
  heading_size_md: "24px"
  heading_size_sm: "20px"

spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "48px"

rounded:
  none: "0"
  sm: "4px"
  md: "8px"

components:
  card_padding: "24px"
  button_height: "48px"
  touch_target_min: "44px"
---

# Visual Identity — Liturgia de las Horas

## Brand & Style

**Liturgia de las Horas** is a digital prayer companion. The visual design honors the quiet reverence of traditional liturgical books while embracing mobile-first clarity. The aesthetic is warm, uncluttered, and contemplative—every element serves the prayer experience.

**Design philosophy:**
- **Warmth:** Cream and soft neutrals evoke candlelight and aged paper.
- **Reverence:** Generous spacing and readable typography echo prayer-book tradition.
- **Accessibility:** High contrast, large touch targets, semantic HTML structure.
- **Mobile-first:** Optimized for prayer on the go; desktop scales gracefully.

---

## Colors

### Base Palette

| Token | Value | Use |
|-------|-------|-----|
| `cream` | #f5f1e8 | Primary background; page and card fills |
| `white` | #fefdf9 | Elevated surfaces; light mode contrast |
| `warm_gray_light` | #e8e4db | Dividers, subtle backgrounds |
| `warm_gray_mid` | #9d9996 | Secondary text, placeholders |
| `warm_gray_dark` | #4a4a46 | Primary text, headers |
| `soft_brown` | #8b7d6b | Accent for UI sections, subtle emphasis |

### Liturgical Season Accents

Each liturgical season carries its traditional Church color. CSS `data-day-color` attribute on `<html>` root drives the current season's accent:

| Season | Color | Usage |
|--------|-------|-------|
| Advent | `#6a1b9a` (purple) | Header background, accent borders |
| Christmastide | `#f0f0f0` (white) | Header + warm cream base |
| Ordinary Time | `#2e7d32` (green) | Header background, accents |
| Lent | `#5e35b1` (purple-dark) | Header background, somber accents |
| Eastertide | `#d4af37` (gold) | Header highlights, joy accents |

**Implementation:**
```css
:root[data-day-color="GREEN"] {
  --accent-color: #2e7d32;
}
:root[data-day-color="PURPLE"] {
  --accent-color: #6a1b9a;
}
/* etc. */
```

### Functional Colors

- **Focus ring:** `#d4af37` (warm gold) for keyboard navigation visibility.
- **Error:** `#c62828` (red) for form validation or alerts.
- **Success:** `#558b2f` (green) for confirmations.

### Dark Mode

Respects native `prefers-color-scheme: dark`. Invert contrast:
```css
@media (prefers-color-scheme: dark) {
  :root {
    --bg-primary: #1a1815;
    --text-primary: #f5f1e8;
    --text-secondary: #9d9996;
  }
}
```

---

## Typography

### Prayer Text (Serif)

- **Family:** Georgia, Garamond, serif (traditional, contemplative)
- **Size:** `18px` base (large, readable on mobile)
- **Line height:** `1.8` (spacious, breathing room for prayer)
- **Weight:** Regular (400) for body; no bold within prayers

**Usage:** All prayer content (Invitatorio, Himno, Salmodia, Lectura, Oraciones).

### UI Text (Sans-serif)

- **Family:** Inter, system sans-serif (clean, modern)
- **Size:** `16px` base UI labels, `14px` for secondary info, `18px` for prominent buttons
- **Line height:** `1.5` (compact, efficient)
- **Weight:** Regular (400) for body; Semibold (600) for labels and buttons

**Usage:** Headers, labels, buttons, navigation, metadata.

### Headings

- **Large (32px):** Page title (e.g., "Laudes — Jueves 5 de Junio")
- **Medium (24px):** Section headers (e.g., "Liturgical Context")
- **Small (20px):** Card titles (e.g., "Himno", "Salmodia")

---

## Layout & Spacing

### Mobile Layout (Primary)

- **Safe area padding:** `16px` (horizontal) to avoid notch/keyboard
- **Card spacing:** `16px` vertical gap between prayer cards
- **Card padding:** `24px` (internal padding within each card)
- **Button height:** `48px` (44px+ touch target)
- **Column width:** Full width (100vw safe area), no fixed max-width on mobile

### Desktop Layout (Secondary)

- **Max content width:** `800px` (reading comfort, prayer-centric)
- **Sidebar (optional):** `200px` for date picker / hour nav (if added post-MVP)
- **Horizontal padding:** `32px` on either side
- **Card spacing:** `24px` vertical gap (more breathing room)

### Spacing Scale

```
xs: 4px   (micro-spacing, focus rings)
sm: 8px   (small gaps, icon padding)
md: 16px  (primary spacing, safe area padding)
lg: 24px  (card padding, larger gaps)
xl: 32px  (section spacing, desktop padding)
2xl: 48px (full-screen spacing, large sections)
```

---

## Elevation & Depth

**Approach:** Minimal shadows; emphasis via spacing and color.

- **No drop shadows by default** — Follows accessibility best practice (less visual clutter).
- **Subtle underlines/borders** — Dividing lines use `warm_gray_light` (subtle, not harsh).
- **Card separation:** Vertical spacing (gap) + soft background color (`white`) vs. page (`cream`).

**Card elevation (optional, post-MVP):**
```css
.prayer-card {
  background-color: #fefdf9;
  border: 1px solid #e8e4db;
  /* OR: box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05); */
}
```

---

## Shapes

- **Border radius:** 
  - `sm: 4px` for small UI elements (buttons, inputs, focus rings)
  - `md: 8px` for card corners (prayer cards, larger components)
  - `none: 0` for full-bleed elements
- **Cards:** Slight rounding (`8px`) softens edges without cuteness.

---

## Components

### LiturgicalHeader

**Responsibility:** Display liturgical context (saint name, psaltery week, season, cycle).

**Mobile layout:**
```
┌─────────────────────────────┐
│ [Accent color bar]          │  ← data-season accent (20px tall)
│ Jueves 5 de Junio, 2026     │  ← Date (14px secondary text)
│ S. Bonifacio, Mártir        │  ← Saint/Feast name (20px, bold sans)
│ Semana 1 | Tiempo Ordinario │  ← Psaltery + season (14px secondary)
│ Ciclo A                     │  ← Lectionary cycle (14px secondary)
└─────────────────────────────┘
```

**Colors & spacing:**
- Background: `white` with top accent bar (4px) in season color
- Padding: `lg` (24px)
- Text hierarchy: heading (20px sans bold) + secondary labels (14px)

---

### PrayerCard

**Responsibility:** Display one prayer section (Invitatorio, Himno, Salmodia, Lectura, Oraciones finales).

**Structure:**
```
┌──────────────────────────────┐
│ [Icono ℹ️] Himno             │  ← Card title (20px sans bold) + help icon
├──────────────────────────────┤
│                              │
│ Oh Gloriosa Domina           │  ← Prayer text (18px serif, 1.8 line height)
│ Tu, que sola meruisti...     │
│                              │
│ [Escuchar] [Siguiente]       │  ← Audio button + card nav (optional, post-MVP)
└──────────────────────────────┘
```

**Colors & spacing:**
- Background: `white`
- Border: 1px `warm_gray_light` or none (see Elevation)
- Padding: `lg` (24px)
- Card spacing: `md` (16px) gap between cards
- Text: `warm_gray_dark` (primary color)
- Icons: `soft_brown` (soft visual accent)

**Info Icon Tooltip:**
- On ℹ️ click → short explanation (e.g., "The Invitatory opens the prayer with a call to prayer").
- Tooltip styling: [ASSUMPTION] Small dark overlay with white text, positioned below/above icon, dismissible.

---

### HourSelector (Home Grid)

**Responsibility:** Show 7 canonical hours; highlight nearest hour to current time.

**Mobile layout (7 buttons in grid):**
```
┌──────────────────────────────┐
│ Selecciona tu Hora          │  ← Heading (24px)
├──────────────────────────────┤
│  [Oficio] [Laudes]  [Tercia]  │  ← 3 buttons per row
│  [Sexta]  [Nona]    [Vísperas]│
│           [Completas]         │  ← 1 button per row (7th)
└──────────────────────────────┘
```

**Button styling:**
- Size: `48px` min height (touch target)
- Width: calc(33.33% - gap) for 3-column layout on mobile
- Background: `white` (default) → `soft_brown` (highlighted/nearest)
- Text: `warm_gray_dark` (default) → `white` (highlighted)
- Border: none (or `warm_gray_light` subtle outline)

**Nearest hour highlight logic:**
- Calculate current time; find closest canonical hour (per architecture).
- Highlight with `soft_brown` background + white text for visual emphasis.

---

### AudioPlayer

**Responsibility:** Control audio playback (play, pause, speed).

**Compact mobile layout:**
```
┌──────────────────────────────┐
│ [⏯ Play/Pause]   [Speed ▼]   │  ← Control buttons
│ Speed: 1.0x                  │  ← Current speed indicator
└──────────────────────────────┘
```

**Button styling:**
- Icon buttons: `44px` × `44px` (touch target)
- Speed dropdown: Dropdown menu with 0.75x, 1x, 1.25x, 1.5x, 2x
- Color: `soft_brown` icons on `white` background

---

### CalendarView (Month/Year Grid)

**Responsibility:** Show liturgical calendar; allow browsing past/future dates.

**Mobile layout:**
```
┌──────────────────────────────┐
│ [◄] Junio 2026 [►]           │  ← Month/year nav
├──────────────────────────────┤
│ Dom Lun Mar Mié Jue Vie Sáb  │  ← Weekday headers
│  26  27  28  29  30  31   1  │
│   2   3   4   5   6   7   8  │
│       ...                     │
└──────────────────────────────┘
```

**Day styling:**
- Background: `cream` (default) → season accent color (liturgical days)
- Text: `warm_gray_dark` (default) → `white` (featured days)
- Tooltip on tap: Saint name / feast name

---

## Do's and Don'ts

### Do's

- ✅ Use serif font for all prayer text (reverent, traditional).
- ✅ Maximize whitespace and vertical spacing (breathing room for prayer).
- ✅ Maintain high contrast (WCAG AA minimum) between text and background.
- ✅ Use the liturgical season accent color in headers (visual cue of the liturgical moment).
- ✅ Test on real mobile devices (primary form factor).
- ✅ Size buttons and touch targets to ≥44px height/width.
- ✅ Respect dark mode preference; test both light and dark.

### Don'ts

- ❌ Don't use serif font for UI labels (confusing, hard to scan).
- ❌ Don't add heavy shadows or gradients (noisy, distracting from prayer).
- ❌ Don't squeeze text (prayer text must be readable and spacious).
- ❌ Don't hide navigation or controls (accessibility first).
- ❌ Don't add animations or transitions (unnecessary movement, can distract).
- ❌ Don't use low-contrast text (accessibility requirement).
- ❌ Don't add notifications or ads (prayer space is sacred).

---

**Status:** Final (ready for implementation)  
*Design Spine — Neto | Liturgia de las Horas | 2026-06-05*
