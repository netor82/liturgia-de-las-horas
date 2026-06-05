---
name: "Liturgia de las Horas Experience Architecture"
status: final
created: 2026-06-05
updated: 2026-06-05
---

# Experience Architecture — Liturgia de las Horas

## Foundation

**Form factor:** Mobile-first (iOS, Android Chrome), responsive to desktop  
**UI system:** None (custom semantic HTML, CSS modules per DESIGN.md tokens)  
**Design reference:** See {planning-artifacts}/ux-designs/ux-Liturgia de las Horas-2026-06-05/DESIGN.md

**Surface closure:** Prayer flow lives on mobile; calendar browse and optional date picker scale desktop. Confirmed.

---

## Information Architecture

### Core Model

**Liturgia de las Horas** has two primary surfaces and one secondary surface:

1. **HourSelector** (`/#/` or `/#/:date`)
   - Entry point; shows 7 canonical hours as grid.
   - Date input/display (defaulted to today).
   - Tap hour → navigate to HourView.

2. **HourView** (`/#/:date/:hour`)
   - Prayer session; sequential prayer cards (Invitatorio → Himno → Salmodia → etc.).
   - Audio player + progress bar.
   - Navigate between cards; return to HourSelector.

3. **CalendarView** (`/#/calendar`)
   - Monthly liturgical calendar grid.
   - Browse past/future dates.
   - Tap day → navigate to HourSelector for that date.
   - [ASSUMPTION] Secondary entry point (not a primary user flow per architecture brief).

### Navigation Model

**Deep-linkable routes** (HashRouter, GitHub Pages compatible):
```
/#/                        → HourSelector (today)
/#/2026-06-05              → HourSelector (specific date)
/#/2026-06-05/laudes       → HourView (specific date + hour)
/#/calendario              → CalendarView
```

**Primary navigation:**
- HourSelector → HourView (tap hour button)
- HourView → HourSelector (header "back" or swipe right [post-MVP])
- HourSelector ↔ CalendarView (nav tabs or menu [post-MVP])

**No drawer, no modal.** Everything full-screen on mobile; desktop adds optional sidebar.

---

## Voice and Tone

**Microcopy philosophy:**
- **Reverent, not preachy.** Speak to practicing Catholics without condescension to beginners.
- **Clear, not jargon-heavy.** Explain liturgical terms simply (e.g., "Invitatorio: Opening prayer that calls us to prayer").
- **Encouragement, not urgency.** No pressure language ("Don't forget!", "Pray now!"); instead: "Your Laudes for today".

**Sample microcopy:**

| Context | Copy |
|---------|------|
| Hour selector heading | "Selecciona tu Hora" (Select your Hour) |
| Nearest hour highlight | (no label; highlighted with color + slight glow) |
| Info icon tooltip | "Invitatorio: Opening prayer that invites us to prayer." |
| Audio button | "Escuchar" (Listen) |
| Card progress | "Himno — 1 of 5" (simple counter) |
| Date picker prompt | "¿Qué día deseas rezar?" (Which day would you like to pray?) |
| Empty state | [ASSUMPTION] Not applicable (romcal always provides data). |
| Error state | [ASSUMPTION] "Disculpa, hubo un problema. Por favor, recarga la página." (Sorry, there was an issue. Please reload the page.) |

---

## Component Patterns

### LiturgicalHeader

**When:** Always visible at top of HourView; summarizes liturgical context.

**Behavior:**
- **Display:** Centered, hierarchy (date → saint/feast → psaltery + season → cycle)
- **Color:** Season-driven (purple for Advent, green for Ordinary Time, etc.)
- **Tap behavior:** [ASSUMPTION] Tap date → open date picker (post-MVP); today is home
- **Scroll behavior:** [ASSUMPTION] Sticky on desktop; fixed on mobile (visible always)

**States:**
- **Default:** Shows current date's data (saint, psaltery, etc.)
- **Loading:** [ASSUMPTION] Show skeleton placeholders while romcal computes
- **Data unavailable:** [ASSUMPTION] Unlikely (romcal covers past/future); show fallback (e.g., "Ordinary weekday, Week 1")

---

### HourSelector Grid

**When:** Primary entry point; shows user's 7 canonical hour options.

**Behavior:**
- **Grid layout:** 3 columns on mobile (7 buttons: 3 rows of 3, 1 row of 1)
- **Highlight:** Button for "nearest hour" to current time is highlighted with `soft_brown` background + white text
- **Tap behavior:** Select hour → navigate to HourView for that hour + today's date
- **Date input:** Tap date display → [ASSUMPTION] Inline date picker or modal (post-MVP)

**States:**
- **Default:** Shows all 7 hours; nearest is highlighted
- **Selected (after navigation):** [ASSUMPTION] Current hour button shows a subtle indicator (e.g., checkmark icon)
- **Other date:** When date is not today, header shows that date; hours are for that date

---

### PrayerCard

**When:** Core repeating component; each prayer section is a card.

**Behavior:**
- **Scroll:** Vertical scroll within card; tap navigation buttons to advance between cards (swipe post-MVP)
- **Info icon:** Tap ℹ️ → show tooltip explaining the section (e.g., "Hymn: Poetry sung to celebrate the hour")
- **Audio button:** Tap "Escuchar" → start Web Speech API playback for this card
- **Visual feedback:** Card displayed clearly; no unnecessary animations for MVP

**States:**
- **Default:** Card displayed, text readable, info icon visible
- **With audio playing:** Play state visible in AudioPlayer below; card text still readable
- **With audio paused:** Pause state visible in AudioPlayer below
- **Completed:** No special indicator for MVP (stateless design)

---

### AudioPlayer

**When:** Present below prayer cards in HourView (or within card [ASSUMPTION]).

**Behavior:**
- **Play/Pause:** Toggle Web Speech API playback for current card
- **Speed controls:** Dropdown menu (0.75x, 1x, 1.25x, 1.5x, 2x); default 1x
- **Auto-advance:** When card finishes playing, user manually advances to next card (respects user control)
- **Global playback:** Single global audio session (not per-card); user can jump between cards mid-audio

**States:**
- **Idle:** "Escuchar" button visible; speed shows current selection
- **Playing:** Play icon → Pause icon; status clear visually
- **Paused:** Pause icon → Play icon; playback position remembered
- **Speed menu open:** Dropdown shows 5 speed options; current is highlighted

---

### CalendarView

**When:** Secondary surface (`/#/calendario`); not primary MVP flow.

**Behavior:**
- **Month grid:** Display current month by default; buttons to navigate past/future months
- **Day tap:** Tap any day → navigate to HourSelector for that date
- **Day highlighting:** Liturgically significant days (feasts) shown with accent color; Sundays highlighted
- **Day tooltip:** Tap or hover → show saint name / feast name

**States:**
- **Default month:** Current month visible
- **Loading:** Skeleton calendar while romcal generates
- **Past/future dates:** All selectable; romcal handles computation

---

## State Patterns

### Global State (Context)

**LiturgicalContext:**
- `selectedDate` (YYYY-MM-DD) — current date user is viewing
- `liturgicalDay` (romcal output) — saint, psaltery, season, cycles, celebrations
- `selectedHour` (hour key: "laudes", "visperas", etc.) — user's active hour

**PreferencesContext:**
- `fontSize` ("small", "normal", "large", "xl") — stored in localStorage
- `prefersDarkMode` (boolean) — derived from OS preference (no toggle in MVP)

### Local State (Component)

**HourView:**
- `currentCardIndex` (0 to N-1) — which prayer card is in view
- `audioPlaying` (boolean) — is Web Speech API active?
- `audioSpeed` (0.75, 1, 1.25, 1.5, 2) — speech synthesis rate

**AudioPlayer:**
- `isPlaying` (boolean) — mirrored from HourView; controls button state
- `currentSpeed` (number) — selected playback rate

---

## Interaction Primitives

### Tap / Click

- Hour button (HourSelector) → Navigate to HourView
- Date display (HourView header) → Open date picker [post-MVP]
- Info icon (PrayerCard) → Show tooltip
- Audio button (PrayerCard or AudioPlayer) → Start/stop speech synthesis
- Calendar day (CalendarView) → Navigate to HourSelector for that date

### Keyboard Navigation

- **Tab:** Move focus between interactive elements (buttons, inputs, links)
- **Enter / Space:** Activate focused button
- **Arrow keys:** Navigate between cards (up/down) [ASSUMPTION: post-MVP], or day in calendar (arrows)
- **Escape:** Close dropdowns (speed menu, date picker) [ASSUMPTION]

### Screen Reader

- **Semantic HTML:** `<button>`, `<nav>`, `<main>`, `<article>` used correctly
- **ARIA labels:** Buttons have clear text (e.g., "Laudes, 6:00 AM") or aria-label
- **Live regions:** [ASSUMPTION] When card advances, announce "Himno, card 2 of 5"
- **Form labels:** Date input has associated `<label>` for screen reader clarity

### Swipe (Post-MVP)

- **Swipe left:** Advance to next prayer card in HourView
- **Swipe right:** Return to HourSelector
- **Swipe left/right:** Navigate months in CalendarView

---

## Accessibility Floor

### Keyboard Navigation (WCAG AA)

- ✅ All interactive elements reachable via Tab key
- ✅ Tab order follows logical reading order (left-to-right, top-to-bottom)
- ✅ Focus visible (outline or highlight per DESIGN.md gold accent)
- ✅ No keyboard traps (user can Tab out of any component)

### Screen Reader (WCAG AA)

- ✅ Semantic HTML structure (`<button>`, `<nav>`, `<main>`, `<article>` for prayer cards)
- ✅ All buttons labeled (visible text or aria-label)
- ✅ Form inputs have associated `<label>` elements
- ✅ Live region announcements when card changes (aria-live="polite")
- ✅ Images/icons have alt text or aria-hidden if decorative

### Visual Accessibility (WCAG AA)

- ✅ Contrast ratio ≥4.5:1 for text (per DESIGN.md palette)
- ✅ Button size ≥44px × 44px (touch target)
- ✅ No color-only indicators (e.g., nearest hour uses color + white text + outline)
- ✅ Flexible text (responsive font sizing, no horizontal scroll except maps)

### Motion Accessibility

- ❌ No autoplay animations (respects `prefers-reduced-motion`)
- ✅ No flashing content (no seizure risk)
- ✅ Audio is optional (not auto-playing)

---

## Key Flows

### Flow 1: "Pray Laudes This Morning" (Experienced User)

**Protagonist:** María, daily practitioner, opens app at 6 AM on her phone.

1. **Opens app** → Lands on HourSelector, today's date shown
2. **Recognizes Laudes** → Taps "Laudes" button (highlighted as nearest hour)
3. **Enters prayer session** → HourView shows Invitatorio card
4. **Reads + optionally listens** → Scrolls through cards (Himno, Salmodia, Lectura, etc.)
5. **Finishes prayer** → Taps "Back to Home" or swipes right [post-MVP]
6. **Next day** → Repeats (or bookmarks deep link `/#/2026-06-06/laudes` for quick access)

**Climax:** María prays Laudes without friction; correct texts appear instantly.

---

### Flow 2: "Explore Liturgy on a Specific Date" (Curious Beginner)

**Protagonist:** Juan, new to Liturgy of the Hours, wants to see what's available on June 24 (Feast of John the Baptist).

1. **Opens app** → Lands on HourSelector (today)
2. **Navigates to calendar** → Taps "Calendario" tab [post-MVP] or uses date picker
3. **Browses to June** → Swipes through months; sees "June 24" highlighted in accent color
4. **Taps June 24** → Calendar closes; HourSelector now shows June 24 with all 7 hours
5. **Curious, taps Laudes** → Enters HourView for June 24's Laudes
6. **Reads explanatory info** → Taps ℹ️ icons to understand each section
7. **Listens to audio** → Taps "Escuchar"; hears prayer at 1x speed
8. **Browses back** → Returns to HourSelector to explore other hours that day

**Climax:** Juan discovers the beauty of a feast day's liturgy and feels invited to explore further.

---

### Flow 3: "Listen to Vespers While Commuting" (Busy Professional)

**Protagonist:** Carlos, commutes via train, wants to pray Vespers but with audio only (eyes on the road).

1. **Opens app** → Lands on HourSelector
2. **Taps Vísperas** → Enters HourView (Invitatorio card visible)
3. **Skips to audio** → Taps "Escuchar" in AudioPlayer
4. **Selects 1.5x speed** → Sets playback speed for faster consumption
5. **Listens hands-free** → Phone in pocket; hears prayer through speaker
6. **Audio auto-advances** → Each card plays, pauses between sections [ASSUMPTION]
7. **Arrives at destination** → Closes app; progress not saved (stateless, no login)

**Climax:** Carlos prays Vespers entirely via audio; speed control allows efficient prayer during commute.

---

## Responsive & Platform

### Mobile (Primary, iOS + Android)

- **Viewport:** Full width, respects safe areas (notch, home indicator)
- **Touch targets:** All ≥44px
- **Card stack:** Vertical scroll, one card per screen height
- **Date input:** Inline mobile date picker (native `<input type="date">`)
- **Orientation:** Portrait primary; landscape supported (wider cards on side, sidebar visible)

### Desktop (Secondary)

- **Max content width:** 800px (reading comfort)
- **Card width:** Fixed, centered with padding
- **Sidebar:** Optional date picker / calendar (post-MVP for desktop optimization)
- **Keyboard navigation:** Tab + Enter primary; arrow keys for card nav post-MVP
- **Hover states:** Buttons show subtle background on hover

### Browser Support

- Modern evergreen browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- Fallback: If Web Speech API unavailable, hide audio controls gracefully
- Testing: Chrome, Firefox, Safari (iOS), Chrome (Android)

---

**Status:** Final (ready for implementation against architecture)  
*Experience Spine — Neto | Liturgia de las Horas | 2026-06-05*
