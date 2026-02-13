import { useEffect, useState } from 'react'

const LOADER_IMAGE = '/ui/loader.png'
const DURATION = 2100

export default function LoadingScreen({ onComplete }) {
  const [hasLoaderImage, setHasLoaderImage] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const img = new Image()
    img.onload = () => setHasLoaderImage(true)
    img.onerror = () => setHasLoaderImage(false)
    img.src = LOADER_IMAGE
  }, [])

  useEffect(() => {
    const id = setTimeout(() => {
      setLoaded(true)
      onComplete?.()
    }, DURATION)
    return () => clearTimeout(id)
  }, [onComplete])

  if (loaded) return null

  return (
    <div
      className="loading-screen"
      role="status"
      aria-live="polite"
      aria-label="Cargando sorpresa de San Valentín"
    >
      <div className="loading-content">
        {hasLoaderImage ? (
          <img
            src={LOADER_IMAGE}
            alt=""
            className="loading-image"
            loading="eager"
          />
        ) : (
          <div className="loading-heart" aria-hidden="true" />
        )}
        <span className="loading-text">Preparando sorpresa...</span>
      </div>
    </div>
  )
}
