import { useState, useRef, useEffect } from 'react'

/**
 * Reproduce la pista de audio asociada al cuerpo de carta mostrado (entry.audioUrl).
 * Muestra un botón "Reproducir música" para cumplir políticas de autoplay del navegador.
 * @param {{ entry: { audioUrl?: string, song?: string, artist?: string } }} props
 */
export default function LetterMusic({ entry }) {
  const [playing, setPlaying] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)
  const audioRef = useRef(null)

  const src = entry?.audioUrl

  useEffect(() => {
    if (!src) return
    setLoaded(false)
    setError(false)
    setPlaying(false)
  }, [src])

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
    } else {
      el.play().catch(() => setError(true))
    }
    setPlaying(!playing)
  }

  if (!src) return null

  return (
    <div className="letter-music" aria-label={`Música: ${entry.song || ''} - ${entry.artist || ''}`}>
      <audio ref={audioRef} src={src} preload="metadata" />
      <button
        type="button"
        className="letter-music-btn"
        onClick={togglePlay}
        disabled={error}
        aria-label={playing ? 'Pausar música' : 'Reproducir música'}
      >
        <span className="letter-music-icon" aria-hidden>
          {playing ? '⏸' : '▶'}
        </span>
        <span className="letter-music-label">
          {error ? 'No se pudo cargar' : playing ? 'Pausar' : 'Reproducir música'}
        </span>
      </button>
      {entry.song && (
        <span className="letter-music-credit">
          {entry.song}{entry.artist ? ` — ${entry.artist}` : ''}
        </span>
      )}
    </div>
  )
}
