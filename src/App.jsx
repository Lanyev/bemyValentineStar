import { useState, useEffect } from 'react'
import EnvelopeIntro from './components/EnvelopeIntro'
import LoveLetter from './components/LoveLetter'
import BackgroundSlideshow from './components/BackgroundSlideshow'
import HeartParticles from './components/HeartParticles'
import DecorativeLayer from './components/DecorativeLayer'
import PalettePostIts from './components/PalettePostIts'
import './styles/global.css'

export default function App() {
  const [phase, setPhase] = useState('envelope')
  const [letterKey, setLetterKey] = useState(0)
  const [paletteIndex, setPaletteIndex] = useState(0)
  const [envelopeOpening, setEnvelopeOpening] = useState(false)
  const [letterRevealComplete, setLetterRevealComplete] = useState(false)

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

      {phase === 'letter' && (
        <>
          <HeartParticles
            onRefreshLetter={handleRefreshLetter}
            onBackToEnvelope={handleBackToEnvelope}
            paletteIndex={paletteIndex}
            onPaletteChange={setPaletteIndex}
            showControls={letterRevealComplete}
          />
          <LoveLetter key={letterKey} onRevealComplete={() => setLetterRevealComplete(true)} />
        </>
      )}
    </>
  )
}
