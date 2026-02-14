import { PALETTES } from '../lib/heartParticles'

/**
 * Post-its al lado de la carta para cambiar la paleta de colores de los corazones.
 * Colores tipo nota adhesiva: coral, azul cielo, verde menta, amarillo, melocotón.
 */
const POSTIT_COLORS = [
  '#f4a896', // coral / salmón
  '#87ceeb', // azul cielo
  '#98d8aa', // verde menta
  '#fdfd96', // amarillo pastel
  '#e8c4a0', // melocotón / beige
  '#2d2d35', // dark
]

const PALETTE_LABELS = ['rosa', 'azul', 'verde', 'amarillo', 'melocotón', 'oscuro']

export default function PalettePostIts({ paletteIndex = 0, onSelect, ariaLabel = 'Elegir tema de color' }) {
  const count = Math.min(PALETTES.length, POSTIT_COLORS.length)

  return (
    <div
      className="palette-postits"
      role="group"
      aria-label={ariaLabel}
    >
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          type="button"
          className={`palette-postit ${paletteIndex === i ? 'palette-postit--active' : ''}`}
          style={{ '--postit-color': POSTIT_COLORS[i] }}
          onClick={() => onSelect(i)}
          aria-pressed={paletteIndex === i}
          aria-label={`Tema ${PALETTE_LABELS[i]}`}
          title={`Tema ${PALETTE_LABELS[i]}`}
        />
      ))}
    </div>
  )
}
