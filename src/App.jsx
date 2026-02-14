import { useState, useEffect, useMemo } from 'react'
import EnvelopeIntro from './components/EnvelopeIntro'
import LoveLetter from './components/LoveLetter'
import BackgroundSlideshow from './components/BackgroundSlideshow'
import HeartParticles from './components/HeartParticles'
import DecorativeLayer from './components/DecorativeLayer'
import PalettePostIts from './components/PalettePostIts'
import { heroTexts, introTexts, closingTexts, letterBodies, photoSources } from './lib/texts'
import { randomItem } from './lib/random'
import './styles/global.css'

export default function App() {
  const [phase, setPhase] = useState('envelope')
  const [letterKey, setLetterKey] = useState(0)
  const [paletteIndex, setPaletteIndex] = useState(0)
  const [envelopeOpening, setEnvelopeOpening] = useState(false)
  const [letterRevealComplete, setLetterRevealComplete] = useState(false)

  const letterContent = useMemo(
    () =>
      phase === 'letter'
        ? {
            hero: randomItem(heroTexts, 'hero'),
            intro: randomItem(introTexts, 'intro'),
            entry: randomItem(letterBodies, 'letterBody'),
            closing: randomItem(closingTexts, 'closing'),
            photo: photoSources.length ? randomItem(photoSources, 'photo') : null,
          }
        : null,
    [phase, letterKey]
  )

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', String(paletteIndex))
  }, [paletteIndex])

  const handleEnvelopeOpen = () => {
    setPhase('letter')
  }

  const handleRefreshLetter = () => {
    setLetterRevealComplete(false)
    setLetterKey((k) => k + 1)
  }

  const handleBackToEnvelope = () => {
    setPhase('envelope')
    setEnvelopeOpening(false)
  }

  return (
    <>
      <BackgroundSlideshow />
      <DecorativeLayer />

      {phase === 'envelope' && (
        <>
          <EnvelopeIntro onOpen={handleEnvelopeOpen} onOpening={() => setEnvelopeOpening(true)} />
          <div className={`palette-envelope-wrap ${envelopeOpening ? 'palette-fade-out' : ''}`}>
            <PalettePostIts
              paletteIndex={paletteIndex}
              onSelect={setPaletteIndex}
            />
          </div>
        </>
      )}

      {phase === 'letter' && letterContent && (
        <>
          <HeartParticles
            onRefreshLetter={handleRefreshLetter}
            onBackToEnvelope={handleBackToEnvelope}
            paletteIndex={paletteIndex}
            onPaletteChange={setPaletteIndex}
            showControls={letterRevealComplete}
            musicEntry={letterContent.entry}
            autoPlayMusic
          />
          <LoveLetter
            key={letterKey}
            letterContent={letterContent}
            onRevealComplete={() => setLetterRevealComplete(true)}
          />
        </>
      )}
    </>
  )
}
