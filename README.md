# bemyValentineStar 💕

Página web de San Valentín interactiva: pantalla de carga, sobre animado que se abre y carta romántica con fondo de fotos. Pensada para compartir en móvil o escritorio.

**Título de la página:** *Feliz San Valentín, Estrella 💕*

## Stack

- **React 18** + **Vite 5**
- **Matter.js** (física opcional, partículas)
- CSS puro, mobile-first, sin Tailwind
- SEO: meta description y Open Graph para vista previa al compartir el enlace

## Requisitos

- Node.js (recomendado v18+)
- npm

## Instalación y desarrollo

```bash
npm install
npm run dev
```

Abre la URL que muestre Vite (normalmente `http://localhost:5173`).

## Build para producción

```bash
npm run build
```

Los archivos se generan en `dist/`.

## Vista previa del build

```bash
npm run preview
```

## Despliegue en GitHub Pages (recomendado: GitHub Actions)

El proyecto incluye un workflow que **construye y publica la web en GitHub Pages** en cada push a `main`. No hace falta ejecutar `npm run deploy` en tu PC (y se evitan problemas de rutas largas en Windows).

1. **Crea el repositorio en GitHub** con el nombre `bemyValentineStar`. Si usas otro nombre, edita `base` en `vite.config.js` (por ejemplo `base: '/mi-repo/'`).

2. **Sube el código**:
   ```bash
   git remote add origin https://github.com/TU_USUARIO/bemyValentineStar.git
   git push -u origin main
   ```

3. **Activa GitHub Pages** en el repo:
   - **Settings** → **Pages**
   - En **Build and deployment** → **Source** elige **GitHub Actions**

4. Tras el primer push (o el siguiente), el workflow **Deploy to GitHub Pages** se ejecutará. Cuando termine (pestaña **Actions**), la web estará en:
   - **https://TU_USUARIO.github.io/bemyValentineStar/**

Para actualizar el sitio: solo haz `git push origin main`; el workflow vuelve a construir y publicar.

---

*Alternativa (sin Actions):* puedes publicar desde tu PC con `npm run deploy`. En Windows a veces falla por límites de longitud de ruta; en ese caso usar GitHub Actions es la opción recomendada.

## Estructura del proyecto

```
src/
  App.jsx
  components/
    LoadingScreen.jsx
    EnvelopeIntro.jsx
    LoveLetter.jsx
    BackgroundSlideshow.jsx
    DecorativeLayer.jsx
    ...
  lib/
    texts.js
    random.js
  styles/
    global.css
    ...
public/
  photos/     # Fotos de fondo (slideshow)
  ui/         # Loader, etc.
  decor/      # Stickers y marcos (opcionales)
```

## Subir a Git

El repositorio incluye `.gitignore` y `.gitattributes`. Si en algún momento se añadieron `node_modules` al índice, ejecuta una sola vez:

1. Cierra el editor de mensaje de commit de Git si lo tienes abierto (para liberar `.git/index.lock`).
2. En la raíz del proyecto:

```bash
git rm -r --cached node_modules
git add .gitignore .gitattributes
git commit -m "chore: add gitignore, remove node_modules from tracking"
```

A partir de ahí, `node_modules` y `dist/` quedarán ignorados y el repo estará listo para subir (por ejemplo a GitHub).
