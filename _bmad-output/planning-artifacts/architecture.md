---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
inputDocuments:
  - "_bmad-output/planning-artifacts/briefs/brief-Liturgia de las Horas-2026-06-05/brief.md"
  - "C:\\Users\\neto\\.claude\\plans\\composed-coalescing-map.md"
workflowType: 'architecture'
project_name: 'Liturgia de las Horas'
user_name: 'Neto'
date: '2026-06-05'
status: 'ready-for-implementation'
---

# Documento de Arquitectura: Liturgia de las Horas

## Resumen Ejecutivo

**Liturgia de las Horas** es una herramienta web estática para católicos hispanohablantes que desean rezar la Liturgia de las Horas diaria. La aplicación calcula automáticamente la fecha litúrgica, presenta textos correctos para cada hora canónica en tarjetas modulares, e incluye audio integrado con controles de accesibilidad. Se despliega como sitio estático en GitHub Pages y usa romcal (biblioteca JavaScript de calendario litúrgico) para cálculos en tiempo de ejecución.

**Timeline:** MVP en junio de 2026 (fin de mes, ASAP)  
**Usuarios primarios:** Practicantes experimentados de la Liturgia de las Horas  
**Criterios de éxito:** Exactitud litúrgica 100%, acceso en <3 clics, navegación por teclado completa, compatibilidad multiplataforma

---

## 1. Decisiones de Stack Tecnológico

### 1.1 Framework Frontend: React + Vite

**Decisión:** React con Vite como bundler/dev server.

**Rationale:**
- **Vite:** Build rápido (ESM nativo), output pequeño, ideal para GitHub Pages con tiempo limitado
- **React:** Ecosistema maduro, componentes reutilizables para tarjetas y vistas modulares
- **Zero extra deps:** Apenas se añaden dependencias; se usan Context + useReducer para estado

**Trade-off:** Vite + React requieren Node.js en build time, pero no hay servidor en tiempo de ejecución — todo es estático.

### 1.2 Enrutamiento: React Router v6 + HashRouter

**Decisión:** HashRouter en lugar de BrowserRouter.

**Rationale:**
- GitHub Pages es hosting estático — no puede manejar rutas SPA sin configuración especial
- HashRouter (URLs con `#`) evita errores 404 en hard reload sin necesidad de `404.html`
- Patrones de ruta:
  - `/#/` — HourSelector (fecha por defecto: hoy)
  - `/#/:date` — HourSelector para una fecha específica (YYYY-MM-DD)
  - `/#/:date/:hour` — HourView para una hora canónica específica
  - `/#/calendario` — CalendarView

**Trade-off:** URLs menos "limpias" (con `#`), pero cero fricción en GitHub Pages.

### 1.3 Gestión de Estado: React Context + useReducer

**Decisión:** Context para estado global (datos litúrgicos y preferencias), no Redux.

**Rationale:**
- **Scope pequeño:** MVP tiene pocas vistas y flows de datos. Redux sería excesivo.
- **Contextos:**
  - `LiturgicalContext` — Datos romcal para la fecha seleccionada (temporada, Psalterio, celebración, colores litúrgicos)
  - `PreferencesContext` — Tamaño de fuente, tema oscuro/claro

**Trade-off:** Menos tooling de debugging que Redux, pero más sencillo de mantener en un MVP.

### 1.4 Estilos: CSS Modules + CSS Custom Properties

**Decisión:** CSS nativo puro, sin Tailwind ni styled-components. Design tokens per DESIGN.md UX spec.

**Rationale:**
- **Zero dependencies:** Reduce bundle size y tiempo de instalación en timeline ajustado
- **CSS Custom Properties (`--var`):** Facilita cambio de temas litúrgicos (colores por temporada) y modo oscuro/claro
- **CSS Modules:** Evita colisiones de nombres de clases, encapsulación por componente
- **Design tokens:** Use UX spec's token naming and warm color palette

**Ejemplo de theming (per DESIGN.md):**
```css
:root[data-season="ORDINARY_TIME"]   { --accent-color: #2e7d32; }
:root[data-season="ADVENT"]          { --accent-color: #6a1b9a; }
:root[data-season="LENT"]            { --accent-color: #5e35b1; }
:root[data-season="EASTERTIDE"]      { --accent-color: #d4af37; }
:root[data-season="CHRISTMASTIDE"]   { --accent-color: #f0f0f0; }

:root {
  --cream: #f5f1e8;
  --white: #fefdf9;
  --warm-gray-light: #e8e4db;
  --warm-gray-mid: #9d9996;
  --warm-gray-dark: #4a4a46;
  --soft-brown: #8b7d6b;
  --focus-ring: #d4af37;
  --text-primary: #4a4a46;
  --text-secondary: #9d9996;
  --bg-primary: #f5f1e8;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg-primary: #1a1815;
    --text-primary: #f5f1e8;
    --text-secondary: #9d9996;
  }
}
```

**Trade-off:** Más CSS manual que Tailwind, pero control total sobre theming litúrgico y alineación con UX design system.

### 1.5 Calendario Litúrgico: romcal@dev

**Decisión:** romcal v3 (beta) con plugin `@romcal/calendar.general-roman@dev`.

**Rationale:**
- **API especializada:** romcal proporciona directamente Psalterio (semanas 1–4), temporada litúrgica, ciclos de lecturas (A/B/C), celebraciones por fecha
- **Localización española:** GeneralRoman_Es devuelve nombres de santos y temporadas en español
- **Cálculo en tiempo de ejecución:** No requiere datos pre-generados; genera el calendario por año bajo demanda

**Implementación:**
```javascript
// hooks/useLiturgicalDay.js
const romcalInstance = new Romcal({ localizedCalendar: GeneralRoman_Es });
const calendarCache = {}; // Cache por año

export function useLiturgicalDay(dateStr) {
  const [day, setDay] = useState(null);
  useEffect(() => {
    const year = new Date(dateStr).getFullYear();
    (async () => {
      if (!calendarCache[year]) {
        calendarCache[year] = await romcalInstance.generateCalendar(year);
      }
      setDay(calendarCache[year][dateStr]?.[0] ?? null);
    })();
  }, [dateStr]);
  return day;
}
```

**Trade-off:** romcal sigue en beta (v3.0.0-dev) — posibles cambios hasta v1.0 estable. Solución: pin a versión exacta en production.

### 1.6 Audio: Web Speech API (TTS)

**Decisión:** `window.speechSynthesis` nativa del navegador para síntesis de voz.

**Rationale:**
- **Cero backend:** El navegador genera audio in-situ, sin servidor
- **Accesibilidad de primera clase:** Audio es opción principal, no accesorio
- **Controles:** Play/Pause, velocidad (0.75x a 2x)
- **Flujo MVP:** Usuario controla manualmente cuándo avanzar a siguiente tarjeta (no auto-advance)

**Fallback:** Si el navegador no soporta TTS, se muestra texto solamente sin errores.

**Trade-off:** Voces sintetizadas (no profesionales), pero sin dependencias externas ni servidor. Pauses litúrgicas diferidas a post-MVP.

---

## 2. Estructura de Proyecto

### 2.1 Árbol de Directorios

```
src/
├── components/
│   ├── HourSelector/           # Home: grid de 7 horas canónicas
│   │   ├── HourSelector.jsx
│   │   └── HourSelector.module.css
│   ├── HourView/               # Sesión de oración: tarjetas ordenadas
│   │   ├── HourView.jsx
│   │   └── HourView.module.css
│   ├── LiturgicalHeader/        # Encabezado: Santo, Psalterio, temporada, ciclo
│   │   ├── LiturgicalHeader.jsx
│   │   └── LiturgicalHeader.module.css
│   ├── PrayerCard/             # Tarjeta individual de sección de oración
│   │   ├── PrayerCard.jsx
│   │   └── PrayerCard.module.css
│   ├── AudioPlayer/            # Controles de audio
│   │   ├── AudioPlayer.jsx
│   │   └── AudioPlayer.module.css
│   └── CalendarView/           # Vista mensual de calendario litúrgico
│       ├── CalendarView.jsx
│       └── CalendarView.module.css
├── contexts/
│   ├── LiturgicalContext.jsx   # Datos romcal para fecha seleccionada
│   └── PreferencesContext.jsx  # Tamaño fuente, tema oscuro/claro
├── hooks/
│   ├── useLiturgicalDay.js     # Envuelve romcal.generateCalendar(), cache por año
│   └── useAudio.js             # Web Speech API TTS controls
├── data/
│   └── hours/
│       ├── oficio-de-lectura/  # 1 hora canónica = subdirectorio
│       │   ├── psalter/
│       │   │   ├── week-1.json
│       │   │   ├── week-2.json
│       │   │   ├── week-3.json
│       │   │   └── week-4.json
│       │   ├── seasons/
│       │   │   ├── advent.json
│       │   │   ├── lent.json
│       │   │   ├── eastertide.json
│       │   │   └── christmastide.json
│       │   └── feasts/
│       │       └── {romcal-key}.json  (p.ej. sacred_heart_of_jesus.json)
│       ├── laudes/             (misma estructura)
│       ├── tercia/             (misma estructura)
│       ├── sexta/              (misma estructura)
│       ├── nona/               (misma estructura)
│       ├── visperas/           (misma estructura)
│       └── completas/          (misma estructura)
├── utils/
│   ├── contentResolver.js      # resolveContent(hour, liturgicalDay) → cards[]
│   ├── liturgicalColors.js     # temporada → token CSS de color
│   └── hourTimes.js            # hora canónica → hora tradicional
├── App.jsx
├── App.module.css
├── main.jsx
└── index.css                   # CSS global, custom properties
```

### 2.2 Esquema de Tarjeta (JSON)

Cada archivo JSON (Psalterio, temporada, fiesta) contiene un array de tarjetas:

```json
[
  {
    "type": "invitatorio",
    "title": "Invitatorio",
    "content": "Señor, abre mis labios..."
  },
  {
    "type": "hymn",
    "title": "Himno",
    "content": "Oh Gloriosa Domina..."
  },
  {
    "type": "psalm",
    "title": "Salmo 92",
    "content": "El Señor reina, se vistió de majestad..."
  },
  {
    "type": "reading",
    "title": "Lectura Breve",
    "content": "De la Carta de San Pablo a los Romanos..."
  }
]
```

**Nota:** `pauseAfter` y `pauseDuration` diferidos a post-MVP para mecanismo litúrgico de pauses automáticas. MVP: usuario avanza manualmente.

---

## 3. Flujo de Datos

### 3.1 Ciclo Litúrgico (romcal)

1. **Inicialización:** App carga con fecha por defecto (hoy)
2. **Hook `useLiturgicalDay(dateStr)`:**
   - Extrae año de `dateStr`
   - Si el año no está en cache, llama a `romcal.generateCalendar(year)` (async)
   - Retorna `LiturgicalDay` para esa fecha (el primer elemento del array, precedencia más alta)
3. **LiturgicalContext:**
   - Almacena `LiturgicalDay` global
   - Expone a `LiturgicalHeader`, `HourView`, `CalendarView`
4. **Datos disponibles:**
   ```javascript
   {
     key: "ordinary_tuesday_week_3",
     name: "Martes de la semana 3 del Tiempo Ordinario",
     rank: "WEEKDAY",
     seasons: ["ORDINARY_TIME"],
     seasonNames: ["Tiempo Ordinario"],
     cycles: {
       psalterWeek: "WEEK_3",
       sundayCycle: "YEAR_A",
       weekdayCycle: "YEAR_1"
     },
     celebrations: [ /* celebraciones si las hay */ ],
     liturgicalColors: ["GREEN"]
   }
   ```

### 3.2 Resolución de Contenido de Oración (JSON)

**Prioridad de resolución:** Fiesta > Temporada > Psalterio

```javascript
// utils/contentResolver.js
function resolveContent(hour, liturgicalDay) {
  const { cycles, seasons, celebrations } = liturgicalDay;
  
  // 1. Buscar fiesta propia
  for (const cel of celebrations) {
    const feast = loadFeast(hour, cel.key);
    if (feast) return feast;
  }
  
  // 2. Buscar temporada
  const season = loadSeason(hour, seasons[0]);
  if (season) return season;
  
  // 3. Caer al Psalterio
  return loadPsalter(hour, cycles.psalterWeek); // "WEEK_3" → week-3.json
}
```

### 3.3 Preferencias de Usuario (PreferencesContext)

- **Tamaño de fuente:** `small`, `normal`, `large`, `xl`
  - Se aplica con clase CSS en `<body>` → CSS escalable por `var(--base-font-size)`
- **Tema:** Respeta `prefers-color-scheme` nativa (no requiere toggle en MVP)

---

## 4. Decisiones de Presentación UI

### 4.1 Componente: HourSelector (Home)

**Responsabilidad:** Mostrar 7 botones de horas canónicas, destacar la más cercana a la hora actual, permitir seleccionar una hora.

**Lógica de "hora más cercana":**
```javascript
const HOUR_TIMES = {
  "oficio-de-lectura": [0, 12],      // cualquier momento
  "laudes": [6],
  "tercia": [9],
  "sexta": [12],
  "nona": [15],
  "visperas": [18],
  "completas": [21]
};

function getNearestHour(now = new Date()) {
  const hour = now.getHours();
  // Encontrar la hora más cercana a la actual
  // Si hora > 18, destacar Vísperas
  // Si 9 < hora <= 12, destacar Sexta, etc.
}
```

### 4.2 Componente: HourView (Sesión de Oración)

**Responsabilidad:** Renderizar tarjetas de oración en orden, controles de audio, navegación siguiente/anterior.

**Navegación:** 
- Botones "Anterior" / "Siguiente" entre tarjetas (usuario controla progresión)
- Audio controls (play/pause, speed) en cada tarjeta o en footer compartido
- Back button para retornar a HourSelector

**Nota:** Barra de progreso y auto-advance diferidos a post-MVP (deferred for post-MVP based on user feedback).

### 4.3 Componente: LiturgicalHeader

**Responsabilidad:** Mostrar contexto litúrgico prominentemente.

**Contenido:**
- Santo/Festividad del día
- Semana del Psalterio (1–4)
- Temporada litúrgica (Adviento, Ordinario, Cuaresma, Pascua, Navidad)
- Ciclo de lecturas (A, B, C)

**Theming:** Color de fondo/borde cambia según temporada litúrgica (p.ej. morado para Adviento).

### 4.4 Componente: PrayerCard

**Responsabilidad:** Renderizar una sección de oración (tarjeta) con texto y meta litúrgica.

**Características:**
- Icono de información (ℹ️) → tooltip que explica la sección
- Texto limpio sin metadata visual
- Botón "Escuchar" → dispara Web Speech API

### 4.5 Componente: AudioPlayer

**Responsabilidad:** Controles de audio (play, pause, velocidad).

**Controles:**
- Play/Pause
- Velocidad: botones para 0.75x, 1x, 1.25x, 1.5x, 2x
- Indicador de velocidad actual

---

## 5. Decisiones de Implementación de Características MVP

### 5.1 Navegación por Teclado y Screen Reader

**Implementación:**
- Semántica HTML5 (`<button>`, `<nav>`, `<main>`)
- ARIA labels en tarjetas
- `tabIndex` en elementos interactivos
- Orden TAB lógico

### 5.2 Modo Oscuro/Claro

**Implementación:**
- CSS `prefers-color-scheme` media query nativa
- No hay toggle en MVP (respetar OS preference)
- Contraste alto en ambos modos

### 5.3 Tamaño de Fuente Ajustable

**Implementación:**
```css
/* index.css */
body { --base-font-size: 16px; }
body.font-sm { --base-font-size: 14px; }
body.font-lg { --base-font-size: 18px; }
body.font-xl { --base-font-size: 20px; }

/* En componentes */
p { font-size: var(--base-font-size); }
```

**UI:** Buttons en header para cambiar tamaño, persistencia vía localStorage.

### 5.4 Enlaces Profundos por Fecha

**Rutas:**
- `/#/2026-06-05` → Abre HourSelector para esa fecha
- `/#/2026-06-05/laudes` → Abre HourView para Laudes ese día
- Compartibles y bookmarkables

### 5.5 Vista de Calendario

**Implementación:**
- Itera romcal output para mes/año seleccionado
- Grid de días con colores litúrgicos
- Click en día → navega a `/#/:date`
- Muestra nombre de santo/festividad

---

## 6. Estrategia de Despliegue

### 6.1 GitHub Pages + GitHub Actions

**Configuración:**
```javascript
// vite.config.js
export default {
  base: '/liturgia-de-las-horas/',  // Repo name
}
```

**Workflow (`.github/workflows/deploy.yml`):**
1. Push a `main`
2. Checkout code
3. Install Node 20, `npm ci`
4. `npm run build` → output en `dist/`
5. Upload `dist/` como Pages artifact
6. Deploy a GitHub Pages

**Resultado:** Sitio en `https://netor82.github.io/liturgia-de-las-horas/`

### 6.2 Build Commands

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

---

## 7. Hoja de Ruta de Implementación (Orden Ejecutivo)

Dado el timeline ajustado (fin de junio 2026), orden es crítico:

### Fase 1: Scaffolding & Core (1–2 días)
1. **Scaffold:** Vite + React + Router + GitHub Actions
2. **romcal integration:** Hook `useLiturgicalDay`, `LiturgicalContext`, `LiturgicalHeader`
3. **JSON data:** Definir esquema de tarjeta; crear Psalterio (week-1 a week-4) para Laudes, Vísperas, Completas

### Fase 2: UI Core (2–3 días)
4. **HourSelector:** Grid de 7 horas, highlighting de hora más cercana
5. **HourView + PrayerCard:** Renderizado de tarjetas, barra de progreso, info icons
6. **Theming:** CSS tokens, colores litúrgicos, modo oscuro/claro, tamaño fuente

### Fase 3: Audio & Polish (1–2 días)
7. **Audio:** `useAudio` hook, `AudioPlayer` controls, pauses litúrgicas
8. **CalendarView:** Grid mensual con romcal
9. **Deep links & keyboard nav:** Polish routing, ARIA, tab order

### Fase 4: Deploy & Test (1 día)
10. **Deploy:** GitHub Actions, GitHub Pages, smoke test

**Estimación realista:** 7–10 días de desarrollo activo en timeline ajustado.

---

## 8. Criterios de Verificación

### Pre-Launch Checklist

**Exactitud litúrgica:**
- [ ] Fecha de hoy muestra datos correctos (verificar contra liturgiapapal.org)
- [ ] Navegar a fecha futura (p.ej. 2026-12-25) muestra contenido correcto
- [ ] Colores litúrgicos cambian con temporada

**Accesibilidad:**
- [ ] Navegación por teclado completa (TAB, ENTER, ARROW keys)
- [ ] Screen reader (NVDA/JAWS) lee todas las secciones
- [ ] Contraste WCAG AA en modo oscuro y claro
- [ ] Botones ≥ 44px × 44px (touch-friendly)

**Performance:**
- [ ] Página inicial carga en <2s (localhost)
- [ ] No hay bloqueos en cambio de tarjeta
- [ ] Audio no causa stuttering en navegación

**Multiplataforma:**
- [ ] Chrome + Firefox en desktop
- [ ] Safari en iOS
- [ ] Chrome en Android

**Despliegue:**
- [ ] GitHub Actions builds sin errores
- [ ] Sitio activo en GitHub Pages URL
- [ ] Rutas deep-link funcionan en hard refresh

---

## 9. Decisiones Diferidas (V2+)

**Explícitamente NO en MVP:**
- Barra de progreso (palabra-count o card-count)
- Auto-advance de tarjetas al terminar audio
- Pauses litúrgicas automáticas (pauseAfter/pauseDuration JSON metadata)
- Notificaciones / recordatorios
- Login de usuario e historial
- Búsqueda de santos/fiestas
- Soporte de múltiples idiomas
- Modo offline (service workers)
- API para desarrolladores
- Swipe gestures (keyboard TAB + buttons primary en MVP)

Estas se evalúan después del lanzamiento basándose en feedback de usuarios.

---

## 10. Matriz de Decisiones Clave

| Decisión | Opción Elegida | Alternativa Considerada | Por Qué |
|----------|---|---|---|
| Framework | React + Vite | Vue + Nuxt | Ecosistema más grande, build más rápido con Vite |
| Routing | HashRouter | BrowserRouter | GitHub Pages sin servidor requiere `#` |
| Estado | Context + useReducer | Redux | MVP scope pequeño, Redux excesivo |
| Estilos | CSS puro | Tailwind | Cero deps, control sobre theming litúrgico |
| Calendario | romcal (JS) | API externa | API requeriría backend; romcal es autónomo |
| Audio | Web Speech API | biblioteca TTS | Cero deps, acceso nativo del navegador |

---

## 11. Notas para Desarrolladores

- **romcal versioning:** Pinear exacto en `package.json` (v3.0.0-dev es beta)
- **Cache de romcal:** Cachear por año para evitar re-generación en misma app session
- **Contenido JSON:** Prioridad fiesta > temporada > Psalterio — resolver en ese orden
- **Colores CSS:** Usar tokens de UX spec (--cream, --accent-color, --text-primary, etc.); actualizar `data-season` en root al cambiar fecha
- **Audio MVP:** Solo play/pause y control de velocidad. Usuario avanza manualmente entre tarjetas (no auto-advance).
- **Pauses & Progress:** Diferidos a post-MVP. JSON schema simplificado (sin pauseAfter/pauseDuration en MVP).
- **Deployment:** Base URL es `/liturgia-de-las-horas/` — crítico para assets

---

**Estado del documento:** ✅ **LISTO PARA IMPLEMENTACIÓN** (Actualizado 2026-06-05 — Alineado con UX specs, MVP scope clarificado)

**Cambios en esta revisión:**
- ✅ CSS Custom Properties alineadas con UX design tokens (warm palette, naming conventions)
- ✅ Audio MVP: manual advance confirmado (no auto-advance)
- ✅ Progress indicator & pauses litúrgicas diferidas a post-MVP
- ✅ JSON schema simplificado (sin pauseAfter/pauseDuration en MVP)

**Próximos pasos:** Scaffold de proyecto Vite + inicialización de repositorio.

---

*Documento de Arquitectura — Neto | Liturgia de las Horas | 2026-06-05 (Revisión UX Alignment)*
