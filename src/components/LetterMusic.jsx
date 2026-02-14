import { useState, useRef, useEffect } from 'react'

const FADE_DURATION_MS = 1800

/**
 * Reproduce la pista de audio asociada al cuerpo de carta mostrado (entry.audioUrl).
 * Si autoPlay es true (p. ej. al abrir el sobre), intenta reproducir al montar.
 * Fade-in de volumen al iniciar para que no entre tan fuerte.
 * buttonOnly: solo botón play/pause en forma de corazón, sin texto ni crédito (para barra de controles).
 * @param {{ entry: { audioUrl?: string, song?: string, artist?: string }, autoPlay?: boolean, buttonOnly?: boolean }} props
 */
export default function LetterMusic({ entry, autoPlay = false, buttonOnly = false }) {
  const [playing, setPlaying] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)
  const audioRef = useRef(null)
  const fadeRef = useRef(null)

  const src = entry?.audioUrl

  const startFadeIn = (el) => {
    if (!el) return
    el.volume = 0
    const start = performance.now()
    const tick = () => {
      fadeRef.current = requestAnimationFrame(() => {
        const t = Math.min((performance.now() - start) / FADE_DURATION_MS, 1)
        el.volume = t * t
        if (t < 1) tick()
      })
    }
    tick()
  }

  useEffect(() => {
    if (!src) return
    setLoaded(false)
    setError(false)
    setPlaying(false)
  }, [src])

  useEffect(() => {
    return () => {
      if (fadeRef.current) cancelAnimationFrame(fadeRef.current)
    }
  }, [])

  // Al abrir el sobre, el clic del usuario permite reproducir sin que el navegador bloquee
  useEffect(() => {
    if (!autoPlay || !src) return
    const el = audioRef.current
    if (!el) return
    el.volume = 0
    el.play()
      .then(() => {
        setPlaying(true)
        startFadeIn(el)
      })
      .catch(() => setError(true))
  }, [autoPlay, src])

  useEffect(() => {
    const el = audioRef.current
    if (!el) return
    const onEnded = () => setPlaying(false)
    const onCanPlay = () => setLoaded(true)
    const onError = () => {
      setError(true)
      setPlaying(false)
    }
    el.addEventListener('ended', onEnded)
    el.addEventListener('canplay', onCanPlay)
    el.addEventListener('error', onError)
    return () => {
      el.removeEventListener('ended', onEnded)
      el.removeEventListener('canplay', onCanPlay)
      el.removeEventListener('error', onError)
    }
  }, [src])

  const togglePlay = () => {
    const el = audioRef.current
    if (!el) return
    if (playing) {
      el.pause()
      setPlaying(false)
    } else {
      el.volume = 0
      el.play()
        .then(() => {
          setPlaying(true)
          startFadeIn(el)
        })
        .catch(() => setError(true))
    }
  }

  if (!src) return null

  return (
    <div className={`letter-music ${buttonOnly ? 'letter-music-button-only' : ''}`} aria-label={`Música: ${entry.song || ''} - ${entry.artist || ''}`}>
      <audio ref={audioRef} src={src} preload="metadata" />
      <button
        type="button"
        className="letter-music-btn letter-music-btn-heart"
        onClick={togglePlay}
        disabled={error}
        aria-label={playing ? 'Pausar música' : 'Reproducir música'}
        title={error ? 'No se pudo cargar' : playing ? 'Pausar' : 'Reproducir música'}
      >
        <span className="letter-music-icon letter-music-icon-white" aria-hidden>
          {playing ? '⏸' : '▶'}
        </span>
      </button>
      {!buttonOnly && (
        <>
          <span className="letter-music-label">
            {error ? 'No se pudo cargar' : playing ? 'Pausar' : 'Reproducir música'}
          </span>
          {entry.song && (
            <span className="letter-music-credit">
              {entry.song}{entry.artist ? ` — ${entry.artist}` : ''}
            </span>
          )}
        </>
      )}
    </div>
  )
}
