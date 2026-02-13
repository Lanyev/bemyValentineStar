import { useState, useEffect } from 'react'

const DECOR_CONFIG = [
  { src: '/decor/sticker-heart.png', position: 'top-right', animation: 'float' },
  { src: '/decor/sticker-bow.png', position: 'bottom-left', animation: 'pulse' },
  { src: '/decor/frame.png', position: 'center-overlay', animation: 'fade' },
  { src: '/decor/hk-01.png', position: 'top-left', animation: 'float' },
  { src: '/decor/hk-02.png', position: 'bottom-right', animation: 'pulse' },
]

export default function DecorativeLayer() {
  const [loadedImages, setLoadedImages] = useState([])

  useEffect(() => {
    let mounted = true
    const verified = []
    let checked = 0

    const tryImage = (item) => {
      const img = new Image()
      img.onload = () => {
        if (mounted) verified.push(item)
        checked++
        if (checked === DECOR_CONFIG.length) setLoadedImages([...verified])
      }
      img.onerror = () => {
        checked++
        if (checked === DECOR_CONFIG.length) setLoadedImages([...verified])
      }
      img.src = item.src
    }

    DECOR_CONFIG.forEach(tryImage)
    return () => { mounted = false }
  }, [])

  if (loadedImages.length === 0) return null

  return (
    <div className="decorative-layer" aria-hidden="true">
      {loadedImages.map((item, i) => (
        <div
          key={item.src}
          className={`decor-item decor-${item.position} decor-${item.animation}`}
          style={{ zIndex: 1 + i }}
        >
          <img
            src={item.src}
            alt=""
            loading="lazy"
            decoding="async"
          />
        </div>
      ))}
    </div>
  )
}
