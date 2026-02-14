import { useState } from 'react'
import '../styles/envelope.css'

export default function EnvelopeIntro({ onOpen, onOpening }) {
  const [open, setOpen] = useState(false)
  const [showLetter, setShowLetter] = useState(false)

  const handleSealClick = () => {
    if (open) return
    onOpening?.()
    setOpen(true)

    setTimeout(() => {
      setShowLetter(true)
      onOpen?.()
    }, 800)
  }

  if (showLetter) return null

  return (
    <div className={`envelope-container ${open ? 'envelope-open' : ''}`}>
      <div className="envelope">
        <div className="envelope-base" />
        <div className="envelope-front" />
        <div className="envelope-flap" />
        <button
          type="button"
          className={`envelope-seal ${open ? 'seal-bounce' : ''}`}
          onClick={handleSealClick}
          aria-label="Toca el sello para abrir el sobre y ver la carta"
          disabled={open}
        >
          <span className="seal-inner" aria-hidden>❤️</span>
        </button>
      </div>
    </div>
  )
}
