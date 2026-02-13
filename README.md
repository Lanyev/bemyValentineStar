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
