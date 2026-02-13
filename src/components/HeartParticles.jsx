import { useRef, useEffect, useState } from 'react'
import { init } from '../lib/heartParticles'

/**
 * Overlay de partículas: corazones luminosos (tipo mariposas Hollow Knight).
 * Canvas fullscreen detrás del UI, pointer-events: none.
 * Por defecto ON; si prefers-reduced-motion, OFF. Botón FX opcional para togglear.
 */
export default function HeartParticles() {
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
    })
    return () => {
      instanceRef.current?.destroy()
      instanceRef.current = null
    }
  }, [reducedMotion])

  useEffect(() => {
    if (instanceRef.current) instanceRef.current.setEnabled(enabled)
  }, [enabled])

  const toggleFx = () => setEnabledState((e) => !e)

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
      <button
        type="button"
        className="heart-particles-fx-btn"
        onClick={toggleFx}
        title={enabled ? 'Desactivar partículas' : 'Activar partículas'}
        aria-label={enabled ? 'Desactivar efecto de partículas' : 'Activar efecto de partículas'}
      >
        FX
      </button>
    </>
  )
}
