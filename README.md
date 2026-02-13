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

## GitHub Pages

1. **Crea el repositorio en GitHub** con el nombre `bemyValentineStar` (o el que prefieras). Si usas otro nombre, edita `base` en `vite.config.js` para que coincida (por ejemplo `base: '/mi-repo/'`).

2. **Sube el código** y enlaza el remoto si aún no lo has hecho:
   ```bash
   git remote add origin https://github.com/TU_USUARIO/bemyValentineStar.git
   git push -u origin main
   ```

3. **Publica el sitio** con:
   ```bash
   npm run deploy
   ```
   Esto hace `vite build` y sube la carpeta `dist` a la rama `gh-pages`.

4. **Activa GitHub Pages** en el repo:
   - Ve a **Settings** → **Pages**.
   - En **Source** elige **Deploy from a branch**.
   - Branch: `gh-pages`, carpeta **/ (root)**.
   - Guarda. En unos minutos la web estará en:
   - `https://TU_USUARIO.github.io/bemyValentineStar/`

Para actualizar el sitio después de cambios: `npm run deploy` y vuelve a hacer push si hace falta (gh-pages suele hacer push automático de la rama `gh-pages`).

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
