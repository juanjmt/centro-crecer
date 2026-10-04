# Plan – Sitio web Centro Crecer

## Estado actual

Sitio estático de una sola página, sin build ni dependencias: se abre con `index.html`.

```
index.html          estructura y contenido
css/styles.css      estilos (tokens de color y tipografía al inicio)
js/main.js          menús desplegables, menú móvil, validación del formulario, modal de eventos
assets/img/         logos, favicon, fotos reales ya procesadas (carrusel, Proyectos, Eventos)
material/           insumos originales (esquema, captura, Word, logo .ai)
Imagenes/           fotos reales en tamaño original, tal como las va sumando Crecer
```

Aparte, en `diseno-sitio-web-centro-crecer/` hay un rediseño hecho con v0.app (Next.js/React) con las mismas
secciones pero interactivo (fotos reales, modales, carrusel de eventos). Se decidió no migrar a ese proyecto:
en cambio se le trajo al sitio estático la idea del modal de evento con galería y, después, su **estilo visual
completo** (colores, portada, tarjetas, footer — ver "Hecho" más abajo). El proyecto de v0 queda sin usar en la
carpeta; ojo que trae datos inventados sin marcar (mail, Instagram, dirección, "9 años", datos bancarios) que
no hay que confundir con contenido real si se lo vuelve a mirar.

**Hecho**
- Estructura: encabezado con 5 menús (Institucional y Proyectos con submenú, Eventos, Sumate con submenú, Contacto), secciones Institucional, Proyectos (5 áreas), Eventos, Sumate (fusiona Voluntariado + Cómo Ayudar + una mención chica a Alianzas Sociales — ver más abajo), Contacto + FAQ y pie de página.
- **Reestructuración de Voluntariado + Cómo Ayudar + Alianzas Sociales**, a partir del diagnóstico de UX pedido: ahora es una sola sección "Sumate" (`id="sumate"`) con 3 tarjetas lado a lado — "Como voluntario" (`#voluntariado`), "Donando dinero" (`#donar`, con el mismo acordeón de datos bancarios) y "Donando materiales" (`#materiales`, fusiona los 3 ítems que antes eran tarjetas sueltas: útiles escolares, materiales para talleres, producción de herramientas). Bajé la cuarta tarjeta vieja de "Cómo ayudar" (que ya decía lo mismo que el texto de "Donando dinero") y saqué el grid de fotos placeholder de Voluntariado (no tenía contenido real todavía). Alianzas Sociales ya no es sección ni ítem de menú propio: quedó como una sola línea al pie de "Sumate" ("¿Sos una empresa...? Escribinos") que lleva al formulario de contacto. Esto bajó el menú principal de 7 a 5 ítems.
- Estilo visual adoptado del rediseño de v0: portada con fondo degradado navy→violeta y foto con marco redondeado, encabezados de sección centrados, tarjetas con acento de color lateral (antes era una barra superior), footer con el mismo degradado en vez de negro liso. **Ojo:** esta paleta (violeta #5630a8, navy #17245a, etc.) es la que trajo v0, no necesariamente la de la marca real — los colores originales, sacados de la captura de la web actual y del logo, eran distintos (violeta #55007a más oscuro, rojo/naranja en vez de rosa). Si el logo o el manual de marca de Crecer dicen otra cosa, hay que ajustar los tokens en `css/styles.css`.
- Responsive (probado en escritorio y celular), accesible por teclado, con enlace "ir al contenido".
- Textos de Historia, Visión, Misión, proyectos y voluntariado tomados de los Word.
- Contacto separado en dos canales: la banda violeta con teléfono y WhatsApp (respuesta inmediata) y el formulario de "Escribinos" aparte, pensado para mail. El formulario valida los campos pero **todavía no envía a ningún lado** (queda un TODO en el código): falta conectarlo a un backend que mande el mail a la casilla del Centro.
- Cada tarjeta de Eventos se puede abrir (con click o teclado) en una ventana con fecha, texto completo y galería de fotos con miniaturas — inspirado en el rediseño de v0. Hoy muestra recuadros placeholder; cuando se reemplacen los `<span>` de `.gallery` por `<img>` reales en el HTML, la ventana los usa automáticamente.
- La sección de Eventos es un carrusel horizontal (2 tarjetas visibles en escritorio, con "peek" de la siguiente en celular) con flechas para desplazarse; el click para abrir el detalle de cada evento sigue funcionando igual.
- Portada con carrusel de 3 fotos reales (clase de batería, robótica, fútbol en el gimnasio) que cambia sola cada 5 segundos o con los puntos, con el mismo texto y estilo que traía el diseño de v0. Dos de las tres fotos las bajé de las URLs de Vercel Blob que usaba ese proyecto (`hebbkx1anhila5yf.public.blob.vercel-storage.com`, ligadas a esa sesión de v0 y no confiables a largo plazo) y quedaron guardadas acá como archivos propios; la tercera (`clase-musica`) ya estaba en `Imagenes/`. Respeta "reducir movimiento" del sistema operativo. La vieja foto recortada de la captura (`assets/img/hero-nino.jpg`) quedó sin usar; se puede borrar.
- El timeline de Historia se corrió a la derecha: ahora Visión, Misión e Historia comparten una columna izquierda y el timeline es la columna derecha, con el tope alineado a la línea superior de las tarjetas Visión/Misión.
- Se sacaron del sitio "Familias alcanzadas" y "Testimonios" (Institucional) y el enlace a la Ley Nacional de Voluntariado Social (Voluntariado).
- Cada tarjeta de Proyectos abre, al hacer click o con teclado, una ventana de detalle con foto grande, la misma descripción de la tarjeta y dos acciones ("Ir al formulario de inscripción" y "Volver a áreas") — igual que en el diseño de v0. Reutiliza las 3 fotos reales del carrusel de portada para las áreas Deportivo-recreativa, Cultural y Formación y Capacitación (temáticamente coinciden: fútbol, música y robótica); Educativa y Social todavía muestran un recuadro placeholder por no tener foto propia.
- Área Social ahora ocupa el ancho completo de las otras dos tarjetas de su fila, con el texto y el checklist en dos columnas.
- Las 4 tarjetas de "Cómo ayudar" quedaron con la misma altura (antes la de "Dinero para proyectos" era más alta por el desplegable de datos bancarios).
- Las estadísticas de la portada ya no dicen "3 años": el número real confirmado es **9 años**. Los otros dos (17+ proyectos, 92+ voluntarios) siguen sin confirmar.
- Dirección real cargada: **Estados Unidos 1273, C1100 Cdad. Autónoma de Buenos Aires**, en el footer y en la respuesta de la FAQ "¿Dónde queda el Centro?". En los dos lugares es un link a Google Maps.
- **Jerarquía de los títulos de sección, invertida.** Antes cada sección tenía una etiqueta chica arriba (ej. "SUMATE") y el título grande abajo era la frase descriptiva (ej. "Tu contribución es enorme..."), y eso se sentía como un salto muy brusco entre un texto chiquito y uno enorme. Se probó primero agrandar la etiqueta como un cartelito con fondo (revertido), y después, a pedido, se invirtió la jerarquía: ahora el nombre corto de la sección (Institucional, Proyectos, Eventos, Sumate, Contacto) es el `<h2>` grande y protagonista, y la frase descriptiva bajó de tamaño como subtítulo (clase nueva `.section-lead`). Aplica a las 5 secciones principales. El modal de detalle de Proyecto quedó **sin tocar**: ahí la etiqueta chica ("Área de crecimiento") es un rótulo genérico y el título grande es el nombre específico del área — invertir esa jerarquía hubiera hecho que lo genérico se vea más grande que lo específico, que es justo lo que no se quiere en ese contexto.
- Esos 5 títulos grandes (`.section-title`) pasaron de navy a violeta (`var(--purple)`), para que no se lean como texto negro/neutro y tengan más presencia de marca. El resto de los títulos (h3 de tarjetas, nombres de proyectos, etc.) siguen en navy a propósito, para no saturar la página de violeta y que los botones/links sigan destacando como lo único "clickeable" de ese color.
- Todos los párrafos del sitio quedaron justificados (`text-align: justify`), con guionado automático en español (`hyphens: auto`, aprovechando el `lang="es"` que ya tenía la página) para evitar los espacios feos que deja el justificado sin guionado. Los textos cortos y centrados (subtítulos, la bajada de la banda violeta de contacto) se dejaron explícitamente centrados para que el justificado no les cambie la alineación.
- Se sacó la mención "A completar: horarios" de la respuesta de la FAQ "¿Dónde queda el Centro?" (a pedido).
- La banda violeta de contacto ("¿Querés comunicarte con nosotros ya mismo?") pasó de ser una oración con dos links subrayados a dos botones tipo pastilla con ícono (teléfono y WhatsApp), igual que el resto de los CTA del sitio. El ícono de WhatsApp se dejó en blanco/monocromo (no en el verde de marca) para no romper el estilo de íconos en línea que usa todo el sitio.
- **Distribución de Institucional en pantallas grandes, revisada.** Las tarjetas de Visión y Misión quedaban angostas (~280px cada una en escritorio) por la proporción `1.3fr 1fr` de `.historia`, con mucho guionado y líneas de 6-8 palabras. Se cambió a `1.6fr 1fr` (gap de 56px a 48px): las tarjetas ganan ~30px cada una y las líneas pasan a 9-10 palabras, bastante más cómodo de leer. Confirmado que a 1920px el contenido es pixel-idéntico a 1440px (el `.container` sigue topeado en `--maxw: 1140px`, como corresponde) y que en mobile no cambia nada, porque ahí `.historia` ya colapsa a una sola columna sin importar el valor de escritorio.
- **Dos arreglos de mobile:**
  1. El degradado de la portada se veía partido en dos mitades (azul / violeta) en celular. No era el degradado lineal en sí — era el resplandor rosado (`.hero::after`), que en escritorio es una mancha chica (`height:100%` de una caja baja y ancha) pero en el hero de mobile (mucho más alto, porque el contenido se apila) esa misma regla lo estiraba en una franja de arriba a abajo. Se agregó una versión mobile de `.hero::after` con alto fijo (480px) para que quede como una mancha chica también ahí.
  2. Las tarjetas del carrusel de Eventos se veían cortadas por la flecha "siguiente" en mobile. La regla base `.event-card` tiene `min-width: 280px`, y en la franja angosta de mobile (con las flechas + gaps restando espacio) el carril disponible era más chico que eso, así que la tarjeta se forzaba más ancha que su contenedor. Se agregó `min-width: 0` a la versión mobile de `.event-card` para que el ancho se respete de verdad. Después, a pedido, la tarjeta pasó de ocupar el 88% del carril a ocupar el 100%: en mobile ya no se asoma un pedacito de la siguiente tarjeta, solo quedan visibles las flechas a los costados.
- **Fotos reales cargadas en Proyectos y en el primer evento**, a partir de las que Crecer sumó en `Imagenes/`:
  - **Área Educativa**: 3/3 fotos (galería completa) + foto del modal — antes no tenía ninguna.
  - **Área Cultural**: 3/3 fotos (galería completa) — antes no tenía ninguna (el modal ya tenía la foto de la clase de batería, sin cambios).
  - **Área Social**: 3/3 fotos (galería completa) + foto del modal — antes no tenía ninguna.
  - **Formación y Capacitación**: 3/3 fotos (galería completa) — robótica (ya estaba) + diseño 3D y maestro pizzero (sumadas después, coinciden con dos ítems del checklist).
  - **Eventos**: Crecer completó directamente en el HTML el nombre, la fecha y el texto reales de las primeras dos tarjetas — "Entrega de Diplomas" (30/08/2026) y "Curso de GenIA con Kiro" (04/08/2026). La tercera tarjeta sigue siendo 100% de ejemplo (nombre, fecha y texto inventados).
- **Recuadros vacíos restantes, completados con fotos ya subidas** (a pedido, "para que no se vea vacío"), sin tocar la tercera tarjeta de Eventos por ser 100% de ejemplo — meterle una foto real ahí daría la impresión de un evento real que no existe:
  - **Área Deportivo-recreativa**: los 2 recuadros que quedaban se completaron repitiendo la única foto real que hay de esta área (no hay otra foto de deporte todavía) — la galería queda con la misma foto 3 veces. Es repetitivo, pero preferible a mezclar una foto de otra categoría (bailes, certificados) dentro de "Deportivo-recreativa".
  - **"Entrega de Diplomas"** y **"Curso de GenIA con Kiro"**: a cada una le quedaba 1 recuadro vacío. Como ambas son ceremonias de entrega de certificados, les crucé una foto de la otra tarjeta — quedaron 3 fotos distintas en cada una, sin repetir ninguna.
  - Encontré y recorté 4 fotos que traían una flechita de navegación de Instagram incrustada en la imagen (eran capturas de un carrusel de posteos): la de peluquería y dos de Área Cultural y una de Área Educativa. Las volví a procesar recortando esa esquina antes de subirlas.
  - Agregué `.gallery img { aspect-ratio: 4/3; object-fit: cover; }` al CSS — faltaba esa regla para las fotos reales (solo existía para los recuadros placeholder `<span>`), así que la primera foto subida se veía más alta que las demás en vez de recortada parejo.
- **Modal de Proyecto, altura pareja.** A pedido, revisé por qué las fotos de los modales se veían de tamaños distintos entre un área y otra: el modal no tenía una altura fija, así que crecía o se achicaba según cuánto texto tuviera esa área (medido: de 375px a 497px de alto según el proyecto), y la foto se estiraba junto con él. Le agregué `min-height: 500px` a `.project-modal`; ahora la foto mide exactamente lo mismo (369×500px) en las 5 áreas, sin importar el largo del texto.

## Pendiente de contenido (lo marca el esquema y no está en los documentos)

| Qué | Dónde en el sitio | Quién lo aporta |
|---|---|---|
| Nombre, fecha, texto y fotos reales de la tercera tarjeta de Eventos (hoy 100% de ejemplo) | Eventos | Crecer |
| Alguna foto de deporte distinta (hoy "Área Deportivo-recreativa" repite la misma foto 3 veces por no tener otra) | Galería de Proyectos | Crecer |
| Datos bancarios (titular, banco, CBU, alias) | Sumate → Donando dinero | Crecer |
| Mail, Instagram | Footer | Crecer |
| Respuesta real de FAQ (gratuidad de los talleres) | Contacto | Crecer |
| Casilla de mail donde debe llegar el formulario de contacto | Contacto | Crecer |

## Decisiones abiertas

1. ~~Cifras de la portada.~~ Parcialmente resuelto: "9 años" está confirmado. Faltan confirmar "17+ proyectos" y "92+ voluntarios" (esos dos seguían siendo los de la captura vieja de la web, nunca confirmados).
2. **Textos de portada.** El título y la bajada de la portada son redacción mía, basada en Visión y Misión. Falta la aprobación de Crecer.
3. ~~Foto de portada.~~ Resuelto: ahora es un carrusel con 3 fotos reales de actividades del Centro.
4. **Dónde se publica y qué dominio usar.** ¿Hay dominio y hosting actual del sitio?
5. **Una sola página o varias.** Hoy es una página con anclas. Si el contenido crece (eventos, galerías) conviene separarla.

## Próximas etapas

**Etapa 1 – Completar y revisar contenido**
- Reunir lo de la tabla de arriba y resolver las decisiones 1 a 3.
- Terminar de reemplazar los recuadros que quedan (Deportivo-recreativa, Formación y Capacitación, 2 de los 3 eventos) por fotos reales. Si se suma mucho volumen de fotos a futuro, evaluar pasar a WebP; por ahora JPEG optimizado (~1200px de ancho máximo) alcanza.
- Exportar el logo en SVG desde Illustrator para tener la versión vectorial.

**Etapa 2 – Publicación**
- Elegir hosting (para un sitio estático alcanza cualquier opción gratuita: Vercel, Netlify, GitHub Pages) y conectar el dominio.
- Agregar metadatos para redes (Open Graph con el logo) y `sitemap.xml` / `robots.txt`.
- Medir con Lighthouse (rendimiento, accesibilidad, SEO) y corregir lo que aparezca.

**Etapa 3 – Formulario real**
- Conectar el formulario de contacto (hoy no envía a ningún lado) a un envío de mail a la casilla del Centro, con servicio de formularios o función serverless y protección anti-spam.
- Formulario de voluntariado separado con los campos del "formulario de intención" (datos, área de interés, disponibilidad).

**Etapa 4 – Crecimiento**
- Separar en páginas: una por área de proyecto, con galería y descripción por ítem (como pide el esquema).
- Que Crecer pueda actualizar textos y fotos sin tocar código (un CMS liviano si hace falta).
- Analítica básica para ver qué secciones se visitan y cuántas consultas llegan.
- Si en algún momento hay convenios y empresas aliadas reales para mostrar, evaluar devolverle a Alianzas Sociales una sección propia (hoy es una sola línea al pie de "Sumate").

## Orden sugerido

1. Resolver decisiones 1–3 y juntar fotos y datos de contacto (bloquea todo lo demás).
2. Publicar una primera versión aunque falten secciones (Etapa 2), marcando lo pendiente como "Próximamente".
3. Formulario real (Etapa 3).
4. Etapa 4 según los recursos de Crecer.
