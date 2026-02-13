import { useState } from 'react'
import LoadingScreen from './components/LoadingScreen'
import EnvelopeIntro from './components/EnvelopeIntro'
import LoveLetter from './components/LoveLetter'
import BackgroundSlideshow from './components/BackgroundSlideshow'
import HeartParticles from './components/HeartParticles'
import DecorativeLayer from './components/DecorativeLayer'
import './styles/global.css'

export default function App() {
  const [phase, setPhase] = useState('loading')

  const handleLoadingComplete = () => {
    setPhase('envelope')
  }

  const handleEnvelopeOpen = () => {
    setPhase('letter')
  }

  return (
    <>
      <BackgroundSlideshow />
      <DecorativeLayer />

      {phase === 'loading' && (
        <LoadingScreen onComplete={handleLoadingComplete} />
      )}

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
