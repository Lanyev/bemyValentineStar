import { useMemo } from 'react'
import { heroTexts, introTexts, closingTexts, letterBodies } from '../lib/texts'
import { randomItem } from '../lib/random'

export default function LoveLetter() {
  const { hero, intro, entry, closing } = useMemo(() => ({
    hero: randomItem(heroTexts, 'hero'),
    intro: randomItem(introTexts, 'intro'),
    entry: randomItem(letterBodies, 'letterBody'),
    closing: randomItem(closingTexts, 'closing'),
  }), [])

  const creditLines = [entry.song, entry.artist, entry.album, entry.year != null ? String(entry.year) : null]
    .filter(Boolean)

  return (
    <article className='love-letter' role='article'>
      <div className='letter-inner'>
        <h1 className='letter-hero'>{hero}</h1>
        <p className='letter-intro'>{intro}</p>
        <div className='letter-body'>
          <p style={{ whiteSpace: 'pre-line' }}>{entry.body}</p>
          <p className='letter-credit' aria-label={`Canción: ${entry.song}, ${entry.artist}`}>
            {creditLines.join('\n')}
          </p>
        </div>
        <p className='letter-closing'>{closing}</p>
      </div>
    </article>
  );
}
