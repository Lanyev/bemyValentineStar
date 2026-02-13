import { useState } from 'react'
import EnvelopeIntro from './components/EnvelopeIntro'
import LoveLetter from './components/LoveLetter'
import BackgroundSlideshow from './components/BackgroundSlideshow'
import HeartParticles from './components/HeartParticles'
import DecorativeLayer from './components/DecorativeLayer'
import './styles/global.css'

export default function App() {
  const [phase, setPhase] = useState('envelope')

  const handleEnvelopeOpen = () => {
    setPhase('letter')
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
          <HeartParticles />
          <LoveLetter />
        </>
      )}
    </>
  )
}
