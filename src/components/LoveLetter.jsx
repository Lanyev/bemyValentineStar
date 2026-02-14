import { useMemo, useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { heroTexts, introTexts, closingTexts, letterBodies, photoSources } from '../lib/texts'
import { randomItem } from '../lib/random'

const FADE_IN_DURATION = 1
const TITLE_DELAY = 0.5
const LINE_STAGGER = 0.2

export default function LoveLetter() {
  const [photoOpen, setPhotoOpen] = useState(false)
  const [photoRect, setPhotoRect] = useState(null)
  const photoRef = useRef(null)

  const updatePhotoRect = () => {
    if (photoRef.current) {
      setPhotoRect(photoRef.current.getBoundingClientRect())
    }
  }

  useEffect(() => {
    const t = setTimeout(updatePhotoRect, 100)
    window.addEventListener('resize', updatePhotoRect)
    return () => {
      clearTimeout(t)
      window.removeEventListener('resize', updatePhotoRect)
    }
  }, [])

  useEffect(() => {
    if (!photoRect) return
    const observer = new ResizeObserver(updatePhotoRect)
    if (photoRef.current) observer.observe(photoRef.current)
    return () => observer.disconnect()
  }, [photoRect])

  const { hero, intro, entry, closing, photo } = useMemo(() => ({
    hero: randomItem(heroTexts, 'hero'),
    intro: randomItem(introTexts, 'intro'),
    entry: randomItem(letterBodies, 'letterBody'),
    closing: randomItem(closingTexts, 'closing'),
    photo: photoSources.length ? randomItem(photoSources, 'photo') : null,
  }), [])

  const creditLines = [entry.song, entry.artist, entry.album, entry.year != null ? String(entry.year) : null]
    .filter(Boolean)

  const bodyLines = entry.body.split('\n').filter(Boolean)
  const delayHero = TITLE_DELAY + FADE_IN_DURATION
  const delayIntro = delayHero + LINE_STAGGER
  const delayCredit = delayIntro + LINE_STAGGER + bodyLines.length * LINE_STAGGER
  const delayClosing = delayCredit + LINE_STAGGER
  const delayPhoto = delayClosing + LINE_STAGGER

  return (
    <article className='love-letter' role='article'>
      <div className='letter-inner letter-cinema'>
        <h1 className='letter-hero letter-reveal' style={{ '--reveal-delay': `${delayHero}s` }}>{hero}</h1>
        <p className='letter-intro letter-reveal' style={{ '--reveal-delay': `${delayIntro}s` }}>{intro}</p>
        <div className='letter-body'>
          {bodyLines.map((line, i) => (
            <p
              key={i}
              className='letter-line letter-reveal'
              style={{ '--reveal-delay': `${delayIntro + LINE_STAGGER + i * LINE_STAGGER}s` }}
            >
              {line}
            </p>
          ))}
          <p
            className='letter-credit letter-reveal'
            style={{ '--reveal-delay': `${delayCredit}s` }}
            aria-label={`Canción: ${entry.song}, ${entry.artist}`}
          >
            {creditLines.join('\n')}
          </p>
        </div>
        <p className='letter-closing letter-reveal' style={{ '--reveal-delay': `${delayClosing}s` }}>{closing}</p>
        <button
          ref={photoRef}
          type='button'
          className='letter-photo letter-photo-corner letter-reveal'
          style={{ '--reveal-delay': `${delayPhoto}s` }}
          onClick={() => setPhotoOpen(true)}
          aria-label='Ver foto en grande'
        >
          <span className='letter-photo-tape letter-photo-tape-tl' aria-hidden />
          <span className='letter-photo-tape letter-photo-tape-tr' aria-hidden />
          <span className='letter-photo-tape letter-photo-tape-bl' aria-hidden />
          <span className='letter-photo-tape letter-photo-tape-br' aria-hidden />
          {photo != null && photo !== '' ? (
            <img src={photo} alt='' className='letter-photo-img' />
          ) : (
            <div className='letter-photo-placeholder' aria-label='Placeholder de foto'>
              <span className='letter-photo-placeholder-icon'>🖼️</span>
              <span className='letter-photo-placeholder-text'>Foto</span>
            </div>
          )}
        </button>

        {photoRect != null &&
          createPortal(
            <button
              type='button'
              className='letter-photo-tap-overlay'
              aria-label='Ver foto en grande'
              style={{
                position: 'fixed',
                top: photoRect.top,
                left: photoRect.left,
                width: photoRect.width,
                height: photoRect.height,
              }}
              onClick={() => setPhotoOpen(true)}
            />,
            document.body
          )}

        {photoOpen &&
          createPortal(
            <div
              className='letter-photo-lightbox'
              role='dialog'
              aria-modal='true'
              aria-label='Foto ampliada'
              onClick={() => setPhotoOpen(false)}
            >
              <div className='letter-photo-lightbox-backdrop' aria-hidden />
              <div
                className='letter-photo-lightbox-content'
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type='button'
                  className='letter-photo-lightbox-close'
                  onClick={() => setPhotoOpen(false)}
                  aria-label='Cerrar'
                >
                  ×
                </button>
                {photo != null && photo !== '' ? (
                  <img src={photo} alt='' className='letter-photo-lightbox-img' />
                ) : (
                  <div className='letter-photo-placeholder letter-photo-lightbox-placeholder'>
                    <span className='letter-photo-placeholder-icon'>🖼️</span>
                    <span className='letter-photo-placeholder-text'>Foto</span>
                  </div>
                )}
              </div>
            </div>,
            document.body
          )}
      </div>
    </article>
  )
}
