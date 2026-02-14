# San Valentín — Página Sorpresa — Instrucciones para Cursor Agent

## Objetivo
Crear una página web romántica, mobile-first, rápida y ligera con el siguiente flujo:

1) Loading screen (~2s)
2) Pantalla del sobre (100% CSS)
3) Apertura animada del sobre
4) Aparición de carta romántica
5) Fondo con fotos desenfocadas
6) Posibilidad de agregar imágenes decorativas (stickers, marcos, íconos)

IMPORTANTE:
Las imágenes decorativas deben ser opcionales y no romper el diseño si no existen.

---

# STACK

- Vite + React
- CSS + Tailwind (opcional)
- Sin librerías pesadas innecesarias
- Performance optimizada
- Mobile-first

---

# ESTRUCTURA DEL PROYECTO

src/
  App.jsx
  components/
    LoadingScreen.jsx
    EnvelopeIntro.jsx
    LoveLetter.jsx
    BackgroundSlideshow.jsx
    DecorativeLayer.jsx
  lib/
    texts.js
    random.js
  styles/
    envelope.css
    global.css

public/
  photos/
    bg-01.webp
    bg-02.webp
    ...
  ui/
    loader.png (opcional)
  decor/
    hk-01.png
    hk-02.png
    hk-03.png
    ...
    frame.png
    sticker-heart.png
    sticker-bow.png

---

# FLUJO

LoadingScreen
↓
EnvelopeIntro
↓
LoveLetter

---

# 1️⃣ LoadingScreen

- Duración: 1800–2500ms
- Animación:
  - CSS heart spinner (default)
  - Si existe public/ui/loader.png usar esa imagen rotando
- Debe respetar prefers-reduced-motion

---

# 2️⃣ EnvelopeIntro (100% CSS)

Debe incluir:

- Base del sobre
- Frente triangular
- Solapa animable
- Sello clickable

Animación:

1) Tap en sello
2) Bounce del sello
3) rotateX(-135deg) en solapa
4) Fade out sobre
5) Mostrar carta

---

# 3️⃣ LoveLetter

Debe incluir:

- Hero (aleatorio)
- Intro (aleatorio)
- Body (placeholder por ahora)
- Cierre (aleatorio)

Datos clave:

Nombre: Estrella
Apodos:
Estrellita, amor, reyna, hermosa, preciosa, chula, mija, corazon, mi niña, princesa

Tono: dulce y tierno
Frase clave: Feliz primer San Valentín

---

# 4️⃣ SISTEMA DE TEXTOS ROTATIVOS

Crear en src/lib/texts.js:

export const heroTexts = []
export const introTexts = []
export const closingTexts = []

En random.js:

- Función randomItem(array)
- Evitar repetición inmediata usando localStorage

Guardar:
- lastHeroIndex
- lastIntroIndex
- lastClosingIndex

---

# 5️⃣ BackgroundSlideshow

- Usar imágenes de public/photos
- Si no existen, usar gradient fallback
- Aplicar:
  filter: blur(10px)
  opacity: 0.25
- Transición suave fade entre imágenes
- No usar librerías pesadas

---

# 6️⃣ DecorativeLayer (IMPORTANTE NUEVO)

Este componente debe permitir agregar imágenes decorativas opcionales.

Reglas:

- Cargar imágenes desde public/decor/
- Renderizar solo si existen
- Posición absoluta (no afectar layout)
- pointer-events: none
- z-index controlado

Ejemplos:

- Sticker esquina superior derecha
- Moño en esquina de carta
- Marco decorativo overlay
- Corazones flotando (imagen PNG)

Debe soportar:

- position presets:
  top-left
  top-right
  bottom-left
  bottom-right
  center-overlay

Debe permitir animaciones suaves:
- float
- pulse
- fade

Pero todo opcional.

---

# 7️⃣ Estética Visual

Paleta:
- Rosa pastel
- Blanco
- Sombras suaves
- Bordes redondeados
- Cute minimal

Evitar:
- Logos oficiales de terceros

Se permite:
- Stickers estilo kawaii
- Cabezas tipo gatito (si el usuario las agrega)
- Moños
- Corazones
- Estrellitas

---

# 8️⃣ Performance

- Lazy load imágenes grandes
- No usar más de 6 fotos de fondo
- Optimizar imágenes WebP
- Evitar animaciones pesadas
- Mantener CSS ligero

---

# 9️⃣ Accesibilidad

- aria-label en botón de sello
- Respetar prefers-reduced-motion
- Tamaño táctil mínimo 44px

---

# 10️⃣ Definición de Terminado

El proyecto debe:

- Correr con npm install + npm run dev
- Mostrar loading
- Abrir sobre con animación
- Mostrar carta
- Textos rotativos funcionando
- Fondo funcionando con fallback
- Soporte para imágenes decorativas opcionales

---

# OPCIONAL (BONUS)

- Botón replay animación
- Micro partículas suaves
- Sonido click (ligero y opcional)
