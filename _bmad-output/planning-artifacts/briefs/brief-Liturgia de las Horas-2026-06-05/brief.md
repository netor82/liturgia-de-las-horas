---
title: "Liturgia de las Horas: Herramienta Web de Oración Diaria"
status: draft
created: 2026-06-05
updated: 2026-06-05
---

# Liturgia de las Horas: Herramienta Web de Oración Diaria

## Resumen Ejecutivo

**Liturgia de las Horas** es una herramienta web autónoma que pone a disposición de los católicos hispanohablantes los textos completos de la Liturgia de las Horas para cada día, con inteligencia sobre el calendario litúrgico. El usuario abre la herramienta, selecciona (o acepta por defecto) el día de hoy, elige la hora canónica que desea rezar, y obtiene instantáneamente los textos correctos: salmos, himno, lectura y oraciones, listos para orar sin fricción.

Es una solución simple, accesible y fundamentada en la liturgia católica que sirve a los católicos practicantes que desean rezar la Liturgia de las Horas de forma regular, sin necesidad de aplicaciones complejas, suscripciones o cálculos manuales del calendario litúrgico.

## El Problema

Los católicos que desean rezar la Liturgia de las Horas en español enfrentan una realidad frustrante: no existe una solución automatizada que les proporcione los textos correctos para cada día. Las opciones existentes son:

- **Libros impresos:** Precisos pero voluminosos, difíciles de portar, costosos de mantener actualizados.
- **Sitios web manuales o desactualizados:** Inconsistentes, con errores en los cálculos del calendario litúrgico.
- **Soluciones para otros idiomas:** Excelentes herramientas existen en inglés, francés y otras lenguas, pero nada confiable para hispanohablantes en el contexto de su país.

**El usuario necesita:** acceso rápido, confiable y accesible a los textos completos correctos para la hora canónica que quiere rezar en ese momento, sin fricciones.

## La Solución

Una herramienta web ligera y autónoma que:

1. **Calcula automáticamente** la fecha litúrgica (semana del Salterio, tiempo litúrgico, ciclo A/B/C) para cualquier fecha.
2. **Presenta los textos completos** de cada hora canónica en tarjetas modulares (Invitatorio → Himno → Salmodia → Lectura → etc.), en orden litúrgico.
3. **Ofrece audio integrado** con texto sincronizado, permitiendo escuchar mientras se lee, con control de velocidad (0.75x a 2x).
4. **Personaliza la experiencia** con tamaño de fuente ajustable, modo oscuro/claro, y navegación por teclado completa.
5. **Proporciona contexto litúrgico** en un encabezado claro: Santo/Festividad del día, semana del Salterio, tiempo litúrgico, ciclo de lecturas.
6. **Incluye una vista de calendario** que muestra las festividades del mes o año, permitiendo explorar la Liturgia de cualquier día pasado o futuro.

El diseño es minimalista: pocos colores, alta contraste, botones grandes y accesibles. Funciona igual en desktop, tablet y móvil. No requiere login, no tiene notificaciones, no almacena historial del usuario—es una herramienta simple y rápida.

## Por Qué Es Diferente

**Automatización confiable del calendario litúrgico.**
Usa una biblioteca externa especializada para calcular el Salterio, ciclo de lecturas y festividades. El usuario nunca tiene que pensar en ello; simplemente selecciona la fecha y obtiene los textos correctos.

**Audio como característica de primera clase, no accesorio.**
El audio no es una adición tardía para usuarios con discapacidad visual. Es una opción central desde el primer uso, con texto sincronizado y controles de velocidad, que beneficia a usuarios ocupados, en transporte, o que prefieren escuchar.

**Diseño inclusivo sin compromiso.**
Una sola interfaz sirve al practicante experimentado (acceso rápido, sin fricción), al principiante (iconos de ayuda que explican cada sección), a personas con discapacidad visual (audio completo + navegación por teclado), y a usuarios ancianos (interfaz simple, botones grandes, pocos colores, alta contraste).

**Enfoque español.**
Construida específicamente para hispanohablantes, en español, por alguien que entiende la práctica de la Liturgia de las Horas en el contexto cultural y religioso hispanohablante.

## A Quién Sirve

**Usuario primario: El Practicante Experimentado**

Persona que reza la Liturgia de las Horas regularmente—al menos varias veces por semana, frecuentemente a Laudes (6am), Vísperas (6pm) o Completas (antes de dormir). Entiende la estructura (Invitatorio, Himno, Salmodia, Lectura, Oraciones finales). Necesita acceso rápido, sin sorpresas, sin distracciones. Espera que los textos sean correctos para ese día específico, automáticamente.

**Usuarios secundarios:**
- **Principiantes:** Curiosos por la Liturgia, necesitan orientación y explicación.
- **Personas con discapacidad visual:** Requieren audio de calidad y navegación completa por teclado.
- **Usuarios ancianos:** Necesitan simplicidad, alto contraste, botones grandes, interfaz predecible.

Todos estos grupos usan la *misma herramienta* sin compromisos.

## Criterios de Éxito

- **Exactitud litúrgica:** Los textos presentados son 100% correctos para la fecha, hora canónica y ciclo litúrgico seleccionado.
- **Velocidad de acceso:** El usuario abre la herramienta y accede a los textos de la hora deseada en menos de 3 clics.
- **Accesibilidad:** La herramienta es completamente navegable con teclado y compatible con lectores de pantalla.
- **Confiabilidad:** Funciona consistentemente en dispositivos desktop, tablet y móvil.

## Alcance

### En la Primera Versión (MVP)

- Estructura modular de tarjetas con textos completos
- Audio opcional con texto sincronizado y control de velocidad
- Encabezado de contexto litúrgico (Santo, Salterio, tiempo, ciclo)
- Selección de hora canónica desde página de inicio
- Tamaño de fuente ajustable, modo oscuro/claro
- Diseño responsivo (desktop, tablet, móvil)
- Compatibilidad de navegación por teclado
- Iconos de ayuda en tarjetas (info progresivo)
- Vista separada de calendario litúrgico con búsqueda por fecha
- Enlaces profundos por fecha

### Explícitamente Fuera del Alcance (V2+)

- Notificaciones y recordatorios
- Login de usuario e historial
- Búsqueda general de santos/festividades
- Soporte para múltiples idiomas
- Modo offline (service workers)
- API para desarrolladores
- Modos de presentación alternativos (todo a la vez vs. tarjetas)

## Visión

Si tiene éxito, **Liturgia de las Horas** se convierte en la herramienta estándar para los católicos hispanohablantes que rezan la Liturgia diariamente. En 2-3 años, podría evolucionar para incluir:

- Soporte para múltiples idiomas (latín y español simultáneamente, por ejemplo).
- Una comunidad de usuarios que compartan reflexiones sobre las lecturas del día.
- Integración con calendarios personales.
- Aplicación móvil nativa con capacidad offline.
- Una API abierta para desarrolladores que construyan sobre ella.

Pero todo eso es futuro. Ahora, el enfoque es perfeccionar una herramienta simple, confiable y accesible que responda a una necesidad clara: *dar a los católicos hispanohablantes los textos correctos para rezar la Liturgia de las Horas hoy.*
