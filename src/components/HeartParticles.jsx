import { useRef, useEffect, useState } from 'react'
import { init } from '../lib/heartParticles'
import PalettePostIts from './PalettePostIts'

/**
 * Overlay de partículas: corazones luminosos (tipo mariposas Hollow Knight).
 * Canvas fullscreen detrás del UI, pointer-events: none.
 * Por defecto ON; si prefers-reduced-motion, OFF.
 * Botón opcional para refrescar la carta; post-its para cambiar paleta de corazones.
 */
export default function HeartParticles({ onRefreshLetter, paletteIndex = 0, onPaletteChange }) {
  const backCanvasRef = useRef(null)
  const frontCanvasRef = useRef(null)
  const instanceRef = useRef(null)
  const [enabled, setEnabledState] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches ? false : true
  )
  const [reducedMotion, setReducedMotion] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )

  useEffect(() => {
    const mm = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mm.matches)
    const handler = () => {
      setReducedMotion(mm.matches)
      if (mm.matches) setEnabledState(false)
    }
    mm.addEventListener('change', handler)
    if (mm.matches) setEnabledState(false)
    return () => mm.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    const back = backCanvasRef.current
    const front = frontCanvasRef.current
    if (!back) return
    instanceRef.current = init(back, {
      frontCanvas: front,
      reducedMotion,
      enabled: reducedMotion ? false : enabled,
      paletteIndex,
    })
    return () => {
      instanceRef.current?.destroy()
      instanceRef.current = null
    }
  }, [reducedMotion])

  useEffect(() => {
    if (instanceRef.current) instanceRef.current.setPaletteIndex(paletteIndex)
  }, [paletteIndex])

  useEffect(() => {
    if (instanceRef.current) instanceRef.current.setEnabled(enabled)
  }, [enabled])

  return (
    <>
      <canvas
        ref={backCanvasRef}
        id="heartParticles"
        className="heart-particles-canvas"
        aria-hidden="true"
      />
      <canvas
        ref={frontCanvasRef}
        id="heartParticlesFront"
        className="heart-particles-canvas heart-particles-canvas-front"
        aria-hidden="true"
      />
      {(onRefreshLetter || onPaletteChange) && (
        <div className="letter-controls">
          {onRefreshLetter && (
            <button
              type="button"
              className="letter-refresh-btn"
              onClick={onRefreshLetter}
              title="Otra carta"
              aria-label="Ver otra carta (nueva combinación de textos)"
            >
              Otra carta
            </button>
          )}
          {onPaletteChange && (
            <PalettePostIts
              paletteIndex={paletteIndex}
              onSelect={onPaletteChange}
            />
          )}
        </div>
      )}
    </>
  )
}
