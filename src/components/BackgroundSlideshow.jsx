import { useState, useEffect } from 'react'

const PHOTOS = [
  '/photos/bg-01.webp',
  '/photos/bg-02.webp',
  '/photos/bg-03.webp',
  '/photos/bg-04.webp',
  '/photos/bg-05.webp',
  '/photos/bg-06.webp',
]

const FALLBACK_GRADIENT = 'linear-gradient(135deg, #ffb6c1 0%, #ffc0cb 50%, #ffe4e1 100%)'

export default function BackgroundSlideshow() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [availablePhotos, setAvailablePhotos] = useState([])

  useEffect(() => {
    let mounted = true
    const verified = []
    let checked = 0

    const tryPhoto = (src) => {
      const img = new Image()
      img.onload = () => {
        if (mounted) verified.push(src)
        checked++
        if (checked === PHOTOS.length) setAvailablePhotos([...verified])
      }
      img.onerror = () => {
        checked++
        if (checked === PHOTOS.length) setAvailablePhotos([...verified])
      }
      img.src = src
    }

    PHOTOS.forEach(tryPhoto)
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    if (availablePhotos.length <= 1) return
    const id = setInterval(() => {
      setCurrentIndex((i) => (i + 1) % availablePhotos.length)
    }, 4000)
    return () => clearInterval(id)
  }, [availablePhotos.length])

  if (availablePhotos.length === 0) {
    return (
      <div
        className="background-slideshow background-fallback"
        style={{ background: FALLBACK_GRADIENT }}
        aria-hidden="true"
      />
    )
  }

  return (
    <div className="background-slideshow" aria-hidden="true">
      {availablePhotos.map((src, i) => (
        <div
          key={src}
          className={`background-slide ${i === currentIndex ? 'active' : ''}`}
          style={{
            backgroundImage: `url(${src})`,
          }}
        />
      ))}
    </div>
  )
}
