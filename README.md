# bemyValentineStar

Proyecto React + Vite para una experiencia de San Valentín interactiva.

## Requisitos

- Node.js (recomendado v18+)
- npm

## Instalación y desarrollo

```bash
npm install
npm run dev
```

## Build para producción

```bash
npm run build
```

Los archivos se generan en `dist/`.

## GitHub Pages (recomendado: GitHub Actions)

El proyecto incluye un workflow que **construye y publica la web en GitHub Pages** cada vez que haces push a `main`. Así no necesitas ejecutar `npm run deploy` en tu PC (y se evita el error en Windows).

1. **Crea el repositorio en GitHub** con el nombre `bemyValentineStar`. Si usas otro nombre, edita `base` en `vite.config.js` (por ejemplo `base: '/mi-repo/'`).

2. **Sube el código**:
   ```bash
   git remote add origin https://github.com/TU_USUARIO/bemyValentineStar.git
   git push -u origin main
   ```

3. **Activa GitHub Pages** en el repo:
   - **Settings** → **Pages**.
   - En **Build and deployment** → **Source** elige **GitHub Actions**.

4. El primer push (o el siguiente) dispara el workflow **Deploy to GitHub Pages**. Cuando termine (pestaña **Actions**), la web estará en:
   - **https://TU_USUARIO.github.io/bemyValentineStar/**

Para actualizar el sitio: solo haz `git push origin main`; el workflow vuelve a construir y publicar.

---

*Alternativa (sin Actions):* puedes publicar desde tu PC con `npm run deploy`. En Windows a veces falla por límites de longitud de ruta; en ese caso usar GitHub Actions es la opción recomendada.

## Subir a Git

El repositorio ya incluye `.gitignore` y `.gitattributes`. **Si en algún momento se añadieron `node_modules` al índice**, ejecuta una sola vez:

1. Cierra el editor de mensaje de commit de Git si lo tienes abierto (para liberar `.git/index.lock`).
2. En la raíz del proyecto:

```bash
git rm -r --cached node_modules
git add .gitignore .gitattributes
git commit -m "chore: add gitignore, remove node_modules from tracking"
```

A partir de ahí, `node_modules` y `dist/` quedarán ignorados y el repo estará listo para subir (por ejemplo a GitHub).
