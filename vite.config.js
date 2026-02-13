import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Si despliegas en GitHub Pages, el sitio se sirve en https://usuario.github.io/bemyValentineStar/
// Si cambias el nombre del repo en GitHub, actualiza también "base" aquí.
export default defineConfig({
  base: '/bemyValentineStar/',
  plugins: [react()],
})
