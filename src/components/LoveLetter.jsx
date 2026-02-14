import { useMemo } from 'react'
import { heroTexts, introTexts, closingTexts, letterBodies } from '../lib/texts'
import { randomItem } from '../lib/random'

const FADE_IN_DURATION = 1
const TITLE_DELAY = 0.5
const LINE_STAGGER = 0.2

export default function LoveLetter() {
  const { hero, intro, entry, closing } = useMemo(() => ({
    hero: randomItem(heroTexts, 'hero'),
    intro: randomItem(introTexts, 'intro'),
    entry: randomItem(letterBodies, 'letterBody'),
    closing: randomItem(closingTexts, 'closing'),
  }), [])

  const creditLines = [entry.song, entry.artist, entry.album, entry.year != null ? String(entry.year) : null]
    .filter(Boolean)

  const bodyLines = entry.body.split('\n').filter(Boolean)
  const delayHero = TITLE_DELAY + FADE_IN_DURATION
  const delayIntro = delayHero + LINE_STAGGER
  const delayCredit = delayIntro + LINE_STAGGER + bodyLines.length * LINE_STAGGER
  const delayClosing = delayCredit + LINE_STAGGER

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
      </div>
    </article>
  )
}
