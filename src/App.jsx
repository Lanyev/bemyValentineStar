import { useState, useEffect } from 'react'
import EnvelopeIntro from './components/EnvelopeIntro'
import LoveLetter from './components/LoveLetter'
import BackgroundSlideshow from './components/BackgroundSlideshow'
import HeartParticles from './components/HeartParticles'
import DecorativeLayer from './components/DecorativeLayer'
import './styles/global.css'

export default function App() {
  const [phase, setPhase] = useState('envelope')
  const [letterKey, setLetterKey] = useState(0)
  const [paletteIndex, setPaletteIndex] = useState(0)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', String(paletteIndex))
  }, [paletteIndex])

  const handleEnvelopeOpen = () => {
    setPhase('letter')
  }

  const handleRefreshLetter = () => {
    setLetterKey((k) => k + 1)
  }

  return (
    <>
      <BackgroundSlideshow />
      <DecorativeLayer />

      {phase === 'envelope' && (
        <EnvelopeIntro onOpen={handleEnvelopeOpen} />
      )}

      {phase === 'letter' && (
        <>
          <HeartParticles
            onRefreshLetter={handleRefreshLetter}
            paletteIndex={paletteIndex}
            onPaletteChange={setPaletteIndex}
          />
          <LoveLetter key={letterKey} />
        </>
      )}
    </>
  )
}
