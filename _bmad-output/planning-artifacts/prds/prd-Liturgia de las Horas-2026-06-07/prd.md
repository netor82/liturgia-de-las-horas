---
title: "Liturgia de las Horas - PRD"
status: final
created: 2026-06-07
updated: 2026-06-08
audience: "Equipo de Desarrollo"
project_name: "Liturgia de las Horas"
user_name: "Neto"
date: 2026-06-07
---

# PRD: Liturgia de las Horas

## 1. Resumen Ejecutivo

**Liturgia de las Horas** es una aplicación web estática que permite a practicantes de la fe católica hispanohablante rezar la Liturgia de las Horas diaria. La aplicación calcula automáticamente la fecha litúrgica, presenta los textos correctos para cada hora canónica en tarjetas modulares, e incluye controles de audio nativos del navegador. Se despliega como sitio estático en GitHub Pages sin backend requerido.

**Timeline MVP:** Fin de junio 2026  
**Usuarios primarios:** Practicantes de la Liturgia de las Horas  
**Criterios de éxito:** 100% exactitud litúrgica, acceso en <3 clics, navegación completa por teclado, compatibilidad multiplataforma (desktop, tablet, móvil)

---

## 2. Visión & Propósito del Producto

### 2.1 Necesidad del Usuario

Los practicantes de la Liturgia de las Horas enfrentan fricciones con herramientas existentes:
- Aplicaciones pesadas que requieren instalación
- Navegación compleja para encontrar la hora correcta y el contenido actual
- Falta de accesibilidad (contraste, tamaños de fuente, navegación por teclado)

### 2.2 Propuesta de Valor

- **Sencillez:** Home con 7 botones, uno destaca automáticamente según hora actual
- **Exactitud:** Cálculo litúrgico en tiempo de ejecución usando romcal (v3 beta)
- **Accesibilidad:** Diseño para lectura pantalla, navegación por teclado, modo oscuro nativo
- **Sin fricción:** Web estática, sin login, sin instalación

---

## 3. Requisitos Funcionales

### 3.1 Núcleo: Selección & Visualización de Hora (HourSelector + HourView)

**FR-01: Home — Selector de Hora Canónica**

- User story: Como usuario, veo 7 botones (Oficio de Lectura, Laudes, Tercia, Sexta, Nona, Vísperas, Completas) y la más cercana a mi hora actual está destacada automáticamente.
- Responsabilidad: Componente `HourSelector`
- Comportamiento:
  - Grid 3 columnas en móvil (excepto Completas que ocupa 1 fila)
  - Al cargar, calcula hora actual y destaca la más cercana según `HOUR_TIMES` (Laudes ~6h, Sexta ~12h, etc.)
  - Click en botón navega a `/#/:date/:hour`
  - Respeta `data-day-color` del root (season color) para acepto visual
- Accesibilidad: Botones ≥44px height, ARIA labels, orden TAB lógico

**FR-02: Vista de Hora — Tarjetas de Oración**

- User story: Como usuario rezando una hora, veo tarjetas de oración en orden (Invitatorio, Himno, Salmos, Lectura, Oraciones finales) con contenido correcto para hoy, puedo avanzar entre tarjetas, y controlar audio.
- Responsabilidad: Componentes `HourView`, `PrayerCard`, `AudioPlayer`
- Comportamiento:
  - Carga contenido según: Fiesta (si aplica) > Temporada > Psalterio
  - Cada tarjeta muestra: Título + contenido + icono ℹ️
  - Icono ℹ️ abre popover/modal con breve descripción de la sección (p.ej., "El Invitatorio abre la oración con una llamada a la alabanza")
  - Botones Anterior/Siguiente para navegar entre tarjetas
  - Botón "Escuchar" dispara síntesis de voz (Web Speech API)
- AudioPlayer controla: play/pause, velocidad (0.75x, 1x, 1.25x, 1.5x, 2x)
- Accesibilidad: Semántica HTML5, ARIA live regions para anuncios de tarjeta, contraste ≥AA, touch targets ≥44px

**FR-03: Encabezado Litúrgico (LiturgicalHeader)**

- User story: Como usuario, veo claramente qué festividad es hoy, en qué semana del Psalterio estoy, la temporada litúrgica y el ciclo de lecturas.
- Responsabilidad: Componente `LiturgicalHeader`
- Comportamiento:
  - Barra superior con barra de color (4px) en color de temporada
  - Contenido: Fecha + Santo/Festividad + Semana Psalterio + Temporada + Ciclo (A/B/C)
  - Color de barra cambia dinámicamente según `data-day-color` del root (Adviento=púrpura, Ordinario=verde, Pascua=oro, etc.)
- Accesibilidad: High contrast entre barra de color y texto

---

### 3.2 Navegación & Rutas

**FR-04: Sistema de Rutas (HashRouter)**

- Rutas implementadas:
  - `/#/` — HourSelector con fecha por defecto (hoy)
  - `/#/:date` (YYYY-MM-DD) — HourSelector para fecha específica
  - `/#/:date/:hour` — HourView para hora canónica específica
  - `/#/calendario` — CalendarView (grid mensual)
  - `/#/ano` — YearView (lista compacta de todos los días del año)
- Deep links shareable y bookmarkable
- Hard refresh funciona en GitHub Pages (sin 404s)

**FR-05: Calendario Litúrgico (CalendarView)**

- User story: Como usuario, puedo navegar meses y años, y ver qué festividades hay cada día.
- Responsabilidad: Componente `CalendarView`
- Comportamiento:
  - Grid mensual (Dom-Sáb)
  - Navegar mes anterior/siguiente con botones
  - Días con festividades destacadas con color de temporada (romcal data)
  - Click en día navega a `/#/:date`
  - Tooltip (hover en desktop, tap en móvil) muestra nombre de santo/festividad
- Accesibilidad: Botones navegación accesibles, grid semántico

**FR-09: Año Litúrgico Compacto (YearView)**

- User story: Como usuario, puedo ver un resumen compacto de todos los días litúrgicos del año, con selector de año (±4 años alrededor del actual).
- Responsabilidad: Componente `YearView`
- Comportamiento:
  - Lista compacta de 365/366 días: una fila por día
  - 4 columnas: indicador de color litúrgico (●), fecha (DD MM), temporada, nombre del día
  - Selector de año: dropdown con años [actual-4 ... actual+4], año actual por defecto
  - Procesamiento en runtime: iterar romcal output para año seleccionado
  - Click en día navega a `/#/:date`
- Accesibilidad: Tabla semántica, selector accesible, orden lógico
- **Status:** Nuevo en sprinte actual; integración con romcal confirma disponibilidad de datos completos

---

### 3.3 Estado & Contexto Litúrgico

**FR-06: Context — Datos Litúrgicos (LiturgicalContext)**

- Responsabilidad: Guardar & exponer datos romcal globales
- Datos disponibles:
  - `LiturgicalDay` (clave, nombre, rank, temporada, ciclos, celebraciones, colores litúrgicos)
  - `selectedDate` (fecha actual o seleccionada)
  - `dayColor` para CSS (GREEN, PURPLE, GOLDEN, WHITE, etc.)
- Actualiza cuando cambia fecha (ruta)
- Cachea resultado romcal por año

**FR-07: Context — Preferencias de Usuario (PreferencesContext)**

- Responsabilidad: Guardar preferencias persistentes
- Datos:
  - `fontSizeLevel` (small, normal, large, xl) → persiste en localStorage
  - `colorScheme` respeta `prefers-color-scheme` nativa (sin toggle en MVP)
- Aplica clase CSS en `<body>` para escalar fuentes

---

### 3.4 Contenido de Datos (Deferred)

**FR-08: JSON Schema para Tarjetas**

- Cada hora canónica contiene carpeta con estructura:
  ```
  data/hours/{hora}/
  ├── psalter/
  │   ├── week-1.json
  │   ├── week-2.json
  │   ├── week-3.json
  │   └── week-4.json
  ├── seasons/
  │   ├── advent.json
  │   ├── lent.json
  │   ├── eastertide.json
  │   └── christmastide.json
  └── feasts/
      └── {romcal-key}.json
  ```
- Esquema de tarjeta:
  ```json
  [
    {
      "type": "invitatorio|hymn|psalm|reading|prayer",
      "title": "Invitatorio",
      "content": "Señor, abre mis labios..."
    }
  ]
  ```
- Resolución: Fiesta (si existe) > Temporada > Psalterio (fallback)
- **Status:** Esquema definido, población de JSONs deferred post-MVP-scaffold
- [ASSUMPTION] Se escribirán 2–3 ejemplos durante scaffold (Laudes, Vísperas, Completas semana 1) para validar flujo; otras semanas & fiestas pobladas en sprint 2

---

## 4. Requisitos No-Funcionales

### 4.1 Rendimiento

- Página inicial carga en <2s (localhost medido)
- Sin bloqueos al cambiar tarjeta o navegar fechas
- Audio (Web Speech API) no causa lag o stuttering
- Build output <500 KB (incluye React + Vite runtime)

### 4.2 Accesibilidad (WCAG 2.1 AA)

- Navegación completa por teclado: TAB, SHIFT+TAB, ENTER, ARROW keys
- Screen reader compatible: NVDA, JAWS, VoiceOver
- Contraste mínimo 4.5:1 en modo claro y oscuro
- Touch targets ≥44×44px
- Orden de tabulación lógico y predecible

### 4.3 Compatibilidad Multiplataforma

- Chrome/Chromium (desktop, Android)
- Firefox (desktop)
- Safari (desktop, iOS)
- Responsive: móvil (375px+), tablet (768px+), desktop (1024px+)

### 4.4 Compatibilidad de Navegador

- Web Speech API (síntesis de voz): soporte en Chrome, Edge, Safari 14.1+; fallback graceful en navegadores sin soporte
- CSS Custom Properties: todos los navegadores modernos
- ES2020: transpilado por Vite/esbuild

### 4.5 Seguridad & Privacidad

- Sitio estático (cero backend, cero base de datos)
- Cero tracking, cero analytics por defecto
- Contenido público (textos litúrgicos españoles de dominio público o bajo licencia abierta)
- localStorage solo para preferencias de usuario (tamaño fuente)

---

## 5. Decisiones Técnicas Clave & Alineación Diseño-Arquitectura

### 5.1 Stack Frontend

| Componente | Decisión | Rationale | Alineación |
|---|---|---|---|
| **Framework** | React 18 + Vite | Build rápido (ESM), cero servidor, salida pequeña | Proporciona arquitectura modular (componentes) |
| **Bundler** | Vite | <2s dev build, preview rápido | Soporta CSS Modules nativo |
| **Routing** | React Router v6 + HashRouter | GitHub Pages es estático; `#` evita 404s | Habilita deep links por fecha/hora |
| **Estado** | Context + useReducer | MVP scope pequeño; cero Redux overhead | Contextos alineados con componentes (Liturgical + Preferences) |
| **Estilos** | CSS Modules + CSS Custom Properties | Cero deps, control total sobre tokens | **Alineado directamente con design tokens** (DESIGN.md) |
| **Calendario** | romcal v3.0.0-dev + @romcal/calendar.general-roman | API especializada en español, cálculo en runtime | Proporciona datos de entrada a LiturgicalContext |
| **Audio** | Web Speech API nativa | Cero deps, síntesis nativa del navegador | **Nota:** Fallback graceful si no soportado |

### 5.2 CSS Custom Properties ← Design Tokens (DESIGN.md)

La arquitectura usa CSS Custom Properties mapeadas directamente desde design tokens:

```css
/* Paleta base (warm & traditional) */
--cream: #f5f1e8;
--white: #fefdf9;
--warm-gray-light: #e8e4db;
--warm-gray-mid: #9d9996;
--warm-gray-dark: #4a4a46;
--soft-brown: #8b7d6b;

/* Accents litúrgicos (por temporada) */
--accent-advent: #6a1b9a;
--accent-christmastide: #f0f0f0;
--accent-ordinary: #2e7d32;
--accent-lent: #5e35b1;
--accent-easter: #d4af37;

/* Dinámico según romcal */
:root[data-day-color="PURPLE"] { --accent-color: var(--accent-advent); }
:root[data-day-color="GREEN"] { --accent-color: var(--accent-ordinary); }
/* etc. */

/* Tipografía (design.md) */
--serif-family: 'Georgia', 'Garamond', serif;
--serif-size: 18px;
--serif-line-height: 1.8;

--sans-family: 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', sans-serif;
--sans-size: 16px;
--sans-line-height: 1.5;

/* Espaciado (design.md) */
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 16px;
--spacing-lg: 24px;
--spacing-xl: 32px;
--spacing-2xl: 48px;
```

**Alineación:** Cada componente (PrayerCard, LiturgicalHeader, HourSelector) usa estos tokens vía CSS Modules. No hay "diseño por defecto" en la arquitectura — los tokens manejan color, fuente, espaciado.

### 5.3 Correcciones & Decisiones Capturadas

#### Decisión: Info Button en Cards (no Tooltips)

- **Documento anterior (DESIGN.md):** Mencionaba tooltips en cards
- **Decisión actualizada:** Cards usan botón ℹ️ que abre un popover/modal pequeño con descripción de la sección
- **Rationale:** Popover es más accesible (teclado + screen reader) que tooltips CSS hover
- **Implementación:** Botón dentro de PrayerCard header; popover desplegable sin cambiar layout

### 5.4 Restricciones & Trade-offs

| Restricción | Impacto | Mitigación |
|---|---|---|
| **romcal v3 beta** | Posibles cambios API pre-v1.0 | Pin versión exacta en package.json; pruebas integración |
| **GitHub Pages estática** | Rutas con `#`, no 404.html | Aceptado; deep links siguen siendo shareable |
| **Web Speech API** | Voces sintetizadas, no profesionales | Calidad aceptable para MVP; post-MVP evaluar TTS externo |
| **Sin backend** | Cero persistencia de usuario | Aceptado para MVP; historial/sync diferido |
| **Contenido JSON manual** | Escalado limitado a ~350 días/año | Aceptado; estructura en JSON permite scripting post-MVP |

---

## 6. Especificación de Componentes

### 6.1 HourSelector (Home)

| Aspecto | Especificación |
|---|---|
| **Prop Input** | `date: string (YYYY-MM-DD)` (default: today) |
| **Render** | Grid 3 cols × 3 rows (7 botones) |
| **Lógica** | Calcula hora actual, destaca botón más cercano |
| **Interacción** | Click → navega a `/#/:date/:hour` |
| **Estilos** | `HourSelector.module.css` con tokens design |
| **Accesibilidad** | ARIA labels, tabIndex, focus management |

### 6.2 PrayerCard

| Aspecto | Especificación |
|---|---|
| **Props** | `{ type, title, content, description }` |
| **Render** | Tarjeta con header (title + info icon) + content |
| **Info Button** | Click abre popover con `description` |
| **Audio** | Botón "Escuchar" dispara `useAudio` hook |
| **Estilos** | Serif 18px para content, sans bold para title |
| **Layout** | Padding 24px (design token `--spacing-lg`) |

### 6.3 HourView

| Aspecto | Especificación |
|---|---|
| **Responsabilidad** | Renderizar tarjetas de una hora; navegación Anterior/Siguiente |
| **Props** | `{ date, hour }` (de ruta) |
| **Contenido** | Obtiene de `resolveContent(hour, liturgicalDay)` |
| **Navegación** | Botones card-to-card + back to HourSelector |
| **Audio Controls** | AudioPlayer compartido o por card (TBD) |

### 6.4 LiturgicalHeader

| Aspecto | Especificación |
|---|---|
| **Responsabilidad** | Mostrar contexto litúrgico |
| **Props** | Consume de `LiturgicalContext` |
| **Render** | Barra con color de temporada + texto jerarquizado |
| **Color dinámico** | Responde a `data-day-color` del root |
| **Accesibilidad** | Contraste ≥4.5:1 |

### 6.5 AudioPlayer

| Aspecto | Especificación |
|---|---|
| **Responsabilidad** | Controles de síntesis de voz |
| **Controles** | Play/Pause, velocidad (0.75x–2x) |
| **Hook** | `useAudio(text)` maneja Web Speech API |
| **Fallback** | Si no soportado, mostrar toggle deshabilitado + mensaje |

### 6.6 CalendarView

| Aspecto | Especificación |
|---|---|
| **Responsabilidad** | Grid mensual litúrgico |
| **Props** | `{ month, year }` (navegables) |
| **Fuente de datos** | Itera romcal output |
| **Click en día** | Navega a `/#/:date` |
| **Colores** | Días con festividades llevan color de temporada |

### 6.7 YearView

| Aspecto | Especificación |
|---|---|
| **Responsabilidad** | Lista compacta de todos los días del año |
| **Props** | `{ year }` (seleccionable) |
| **Render** | Tabla semántica: 4 columnas (color ●, DD MM, temporada, nombre) × 365/366 filas |
| **Selector de año** | Dropdown: [year-4 ... year+4], default=currentYear |
| **Fuente de datos** | `romcal.calendarForYear(year)` → itera todos los días |
| **Interacción** | Click en fila navega a `/#/:date` |
| **Estilos** | Diseño denso; texto pequeño (sans 14px); color ● según `dayColor` |
| **Accesibilidad** | Tabla con headers semánticos, selector con label, filas focusables |

---

## 7. Criterios de Éxito & Verificación

### 7.1 Exactitud Litúrgica

- ✅ Hoy: datos romcal coinciden con liturgiapapal.org
- ✅ Futuro (p.ej. 2026-12-25): contenido correcto
- ✅ Colores litúrgicos cambian con temporada
- ✅ Semana Psalterio correcta según ciclo

### 7.2 Accesibilidad

- ✅ Navegación por teclado completa (TAB, ENTER, ARROW)
- ✅ Screen reader: todas las secciones anunciadas
- ✅ Contraste WCAG AA (4.5:1 en claro y oscuro)
- ✅ Touch targets ≥44px en móvil
- ✅ Info popover funciona con teclado & screen reader

### 7.3 Performance & Carga

- ✅ Initial load <2s
- ✅ Sin bloqueos en navegación tarjeta/fecha
- ✅ Audio no causa lag
- ✅ Build <500 KB

### 7.4 Multiplataforma

- ✅ Chrome (desktop, Android)
- ✅ Firefox (desktop)
- ✅ Safari (desktop, iOS)
- ✅ Responsive 375px–1920px

### 7.5 Deployment

- ✅ GitHub Actions builds sin errores
- ✅ Sitio en https://netor82.github.io/liturgia-de-las-horas/
- ✅ Deep links funcionan en hard refresh

---

## 8. Hoja de Ruta de Implementación

### Fase 1: Scaffolding & Core (1–2 días)

1. Scaffold Vite + React + Router + GitHub Actions
2. Integración romcal: hook `useLiturgicalDay`, `LiturgicalContext`
3. CSS Custom Properties: tokens del design system
4. Componente `LiturgicalHeader` + `HourSelector` básicos

### Fase 2: UI Core (2–3 días)

5. `PrayerCard` con info button (popover)
6. `HourView` con navegación Anterior/Siguiente
7. Audio: `useAudio` hook + `AudioPlayer` controles
8. CalendarView básico
9. YearView con selector de año

### Fase 3: Polish & Validation (1–2 días)

9. Accesibilidad: keyboard nav, ARIA, screen reader testing
10. Responsive design: móvil, tablet, desktop
11. Modo oscuro/claro: prefers-color-scheme
12. Tamaño fuente ajustable: ui en header

### Fase 4: Deploy & Test (1 día)

13. GitHub Pages deploy
14. Smoke test: rutas, deep links, litúrgica accuracy
15. Cross-browser testing

**Estimación realista:** 7–10 días de desarrollo

---

## 9. Scope Explícitamente Deferred (Post-MVP)

- ❌ Barra de progreso (word count / card count)
- ❌ Auto-advance de tarjeta al terminar audio
- ❌ Pauses litúrgicas automáticas (pauseAfter/pauseDuration)
- ❌ Notificaciones / recordatorios
- ❌ Login de usuario e historial
- ❌ Búsqueda de santos
- ❌ Múltiples idiomas
- ❌ Service workers / offline
- ❌ API para desarrolladores
- ❌ Swipe gestures (keyboard + buttons primary)
- ❌ Población de JSONs completos (solo ejemplos para MVP)

---

## 10. Notas de Implementación

1. **romcal pinning:** Usar versión exacta (3.0.0-dev) en package.json; marcar como beta en docs
2. **Cache romcal:** Cachear por año en hook para evitar regeneración innecesaria
3. **Content resolver:** Implementar prioridad Fiesta > Temporada > Psalterio; fallback graceful
4. **CSS Custom Properties:** Definir en `:root`; actualizar `data-day-color` al cambiar fecha
5. **Audio MVP:** Solo play/pause + velocidad. No auto-advance; usuario controla tarjeta siguiente.
6. **Contenido JSON:** Esquema definido; ejemplos en scaffold; población completa post-sprint-1
7. **Base URL:** `/liturgia-de-las-horas/` crítico en vite.config.js y rutas relativas de assets

---

**Estado:** Draft (alineación técnica, listo para revisión de equipo)  
**Próximos pasos:** Review & feedback del equipo → Finalize → Scaffold

---

*PRD — Neto | Liturgia de las Horas | 2026-06-07*
