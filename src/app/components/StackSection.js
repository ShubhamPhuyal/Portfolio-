'use client'

import { useEffect, useRef } from 'react'
import TalkButton from './TalkButton'

const ABOUT_LABEL =
  'What started as a curiosity for UI/UX has grown into a career spanning 3 companies and 10+ projects over 2 years. Today, I work across product and graphic design, with a bigger ambition of building a design agency of my own.'

const TEXT_REVEAL_SCROLL_LENGTH = 1.1
// Number of characters in the gradient "wave" front
const WAVE_WIDTH = 18

// Weight is locked on the paragraph AND every letter so painted and
// newly-colored letters always render with the exact same glyph outlines.
const TEXT_WEIGHT = 800

// Chip rotation angles — adjust these values to change the tilt of each chip:
// Negative = tilted counter-clockwise (e.g. '-4deg')
// Positive = tilted clockwise (e.g. '3deg')
const CHIP_1_ROTATION = '-4deg' // "Professional overthinkers"
const CHIP_2_ROTATION = '6deg' // "Nerding out on design" (opposite angle: tilted clockwise)

// Shared text-rendering rules: stop faux bold, kerning/ligature recalculation
// and subpixel shifting, which cause letters to "wobble" while colors change.
const STABLE_TEXT_STYLE = {
  fontWeight: TEXT_WEIGHT,
  fontSynthesis: 'none',
  fontKerning: 'none',
  fontVariantLigatures: 'none',
  textRendering: 'geometricPrecision',
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
}

const StackSection = ({ heroRef, cardRef }) => {
  const sectionRef = useRef(null)
  const paragraphRef = useRef(null)
  const chip1Ref = useRef(null)
  const chip2Ref = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return undefined

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let sectionTop = section.getBoundingClientRect().top + window.scrollY
    let frameId = 0

    let line3Index = 0
    let line5Index = 0

    // Identify the end of line 3 and line 5 based on letter element vertical positions
    const updateLineIndices = () => {
      const letters = paragraphRef.current?.querySelectorAll('[data-reveal-letter]')
      if (!letters || letters.length === 0) return

      let currentTop = -1
      let lineCount = 0

      for (let i = 0; i < letters.length; i++) {
        const top = letters[i].offsetTop
        if (currentTop === -1) {
          currentTop = top
          lineCount = 1
        } else if (top > currentTop + 10) {
          currentTop = top
          lineCount++
        }
        if (lineCount === 3) {
          line3Index = i
        }
        if (lineCount === 5) {
          line5Index = i
        }
      }

      // Reliable fallbacks if layout wraps differently
      if (!line3Index) line3Index = Math.floor(letters.length * 0.45)
      if (!line5Index) line5Index = Math.floor(letters.length * 0.78)
    }

    updateLineIndices()
    Promise.resolve(document.fonts?.ready).then(updateLineIndices)

    // Letter index → total chars revealed progress
    const updateParallax = () => {
      frameId = 0
      const scrollProgress = Math.max(
        0,
        (window.scrollY - sectionTop) / window.innerHeight
      )
      const cardProgress = reducedMotion.matches
        ? 1
        : Math.min(1, scrollProgress)
      const textProgress = reducedMotion.matches
        ? 1
        : Math.min(1, Math.max(0, (scrollProgress - 1) / TEXT_REVEAL_SCROLL_LENGTH))

      section.style.setProperty('--card-y', `${(1 - cardProgress) * 100}svh`)
      heroRef.current?.style.setProperty('--hero-y', `${cardProgress * -28}svh`)

      // Only promote the card to its own compositing layer while it is moving.
      if (cardRef?.current) {
        const nextWillChange = cardProgress < 1 ? 'transform' : 'auto'
        if (cardRef.current._willChange !== nextWillChange) {
          cardRef.current._willChange = nextWillChange
          cardRef.current.style.willChange = nextWillChange
        }
      }

      const letters = paragraphRef.current?.querySelectorAll('[data-reveal-letter]')
      const totalLetters = letters?.length ?? 0
      // revealFront = the leading edge of the revealed wave (in letter-index units)
      const revealFront = textProgress * (totalLetters + WAVE_WIDTH)

      // Smooth popup chips once line 3 and line 5 have been read
      const isLine3Read = reducedMotion.matches || (revealFront >= line3Index + WAVE_WIDTH * 0.5)
      const isLine5Read = reducedMotion.matches || (revealFront >= line5Index + WAVE_WIDTH * 0.5)

      if (chip1Ref.current) {
        const nextOp = isLine3Read ? '1' : '0'
        if (chip1Ref.current._op !== nextOp) {
          chip1Ref.current._op = nextOp
          chip1Ref.current.style.opacity = nextOp
          chip1Ref.current.style.transform = isLine3Read
            ? `scale(1) rotate(${CHIP_1_ROTATION})`
            : `scale(0) rotate(${CHIP_1_ROTATION})`
        }
      }

      if (chip2Ref.current) {
        const nextOp = isLine5Read ? '1' : '0'
        if (chip2Ref.current._op !== nextOp) {
          chip2Ref.current._op = nextOp
          chip2Ref.current.style.opacity = nextOp
          chip2Ref.current.style.transform = isLine5Read
            ? `scale(1) rotate(${CHIP_2_ROTATION})`
            : `scale(0) rotate(${CHIP_2_ROTATION})`
        }
      }

      letters?.forEach((letter, index) => {
        if (reducedMotion.matches) {
          if (letter._color !== '#111111') {
            letter._color = '#111111'
            letter.style.color = '#111111'
          }
          return
        }

        const dist = revealFront - index // positive = ahead of wave front

        let color
        if (dist >= WAVE_WIDTH) {
          color = '#111111'
        } else if (dist > 0) {
          const t = dist / WAVE_WIDTH // 0 -> 1

          // Fast direct RGB interpolation matching rich two26 palette:
          // t=0 (#f5c0a0: 245, 192, 160) -> t=0.35 (#ff5500: 255, 85, 0)
          // -> t=0.70 (#c93b00: 201, 59, 0) -> t=1 (#111111: 17, 17, 17)
          if (t < 0.35) {
            const p = t / 0.35
            const r = Math.round(245 + p * 10)
            const g = Math.round(192 - p * 107)
            const b = Math.round(160 - p * 160)
            color = `rgb(${r},${g},${b})`
          } else if (t < 0.70) {
            const p = (t - 0.35) / 0.35
            const r = Math.round(255 - p * 54)
            const g = Math.round(85 - p * 26)
            color = `rgb(${r},${g},0)`
          } else {
            const p = (t - 0.70) / 0.30
            const r = Math.round(201 - p * 184)
            const g = Math.round(59 - p * 42)
            const b = Math.round(p * 17)
            color = `rgb(${r},${g},${b})`
          }
        } else {
          color = '#e8c5ae'
        }

        if (letter._color !== color) {
          letter._color = color
          letter.style.color = color
        }
      })
    }

    const requestUpdate = () => {
      if (!frameId) frameId = window.requestAnimationFrame(updateParallax)
    }

    section.style.setProperty('--card-y', '100svh')
    heroRef.current?.style.setProperty('--hero-y', '0svh')
    updateParallax()
    window.addEventListener('scroll', requestUpdate, { passive: true })
    const updateLayout = () => {
      sectionTop = section.getBoundingClientRect().top + window.scrollY
      updateLineIndices()
      requestUpdate()
    }
    window.addEventListener('resize', updateLayout)
    reducedMotion.addEventListener('change', requestUpdate)

    return () => {
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', updateLayout)
      reducedMotion.removeEventListener('change', requestUpdate)
      if (frameId) window.cancelAnimationFrame(frameId)
    }
  }, [heroRef, cardRef])

  // Split ABOUT_LABEL into per-character spans for the reveal wave
  const renderText = () =>
    Array.from(ABOUT_LABEL).map((character, index) =>
      /\s/.test(character) ? (
        <span key={index}>{character}</span>
      ) : (
        <span
          key={index}
          data-reveal-letter=""
          aria-hidden="true"
          style={{
            color: '#e8c5ae',
            fontWeight: TEXT_WEIGHT,
            fontSynthesis: 'none',
          }}
        >
          {character}
        </span>
      )
    )

  return (
    <section
      id="about"
      ref={sectionRef}
      aria-label="Selected work"
      className="relative z-20 -mt-[100svh] h-[312svh] sm:h-[362.5svh]"
    >
      <article
        ref={cardRef}
        className="sticky top-0 flex h-svh w-full items-center overflow-visible sm:overflow-hidden bg-[#f7eee7]"
        style={{
          clipPath: 'polygon(0 0, 100% 1.5%, 100% 100%, 0 100%)',
          transform: 'translate3d(0, var(--card-y, 100svh), 0)',
        }}
      >
        <div className="mx-auto w-full max-w-7xl px-4 py-2 text-center sm:px-10 sm:py-10 lg:px-14">
          <p className="mb-1 text-xs tracking-wider uppercase font-semibold text-zinc-600 sm:mb-10 sm:text-[19px] sm:tracking-[-1px] sm:font-medium sm:text-black">
            A BIT ABOUT ME
          </p>
          <p
            ref={paragraphRef}
            className="relative mx-auto max-w-6xl text-[34px] leading-[1.15] font-extrabold tracking-[-0.035em] sm:text-[38px] sm:leading-[1.08] sm:tracking-[-0.055em] lg:text-[57px] lg:leading-[1.05]"
            style={{
              fontFamily: '"Mdnichrometest Dark", Arial, sans-serif',
              ...STABLE_TEXT_STYLE,
            }}
            aria-label={ABOUT_LABEL}
          >
            {renderText()}

            {/* Chip 1: Professional overthinkers (pops up after reading 3rd line, placed in gap between line 1 & 2) */}
            <span
              ref={chip1Ref}
              aria-hidden="true"
              className="pointer-events-none absolute hidden sm:inline-flex select-none items-center rounded-full bg-[#ff5500] sm:right-[10%] sm:top-[14%] sm:px-3.5 sm:py-1 sm:text-[14px] md:right-[14%] md:top-[15%] md:text-[16px] lg:right-[17%] lg:top-[16%] lg:px-4 lg:py-1.5 lg:text-[16px] font-semibold tracking-normal text-white"
              style={{
                fontFamily: 'var(--font-geist-sans), Arial, sans-serif',
                fontWeight: 400,
                textRendering: 'auto',
                opacity: 0,
                transform: `scale(0) rotate(${CHIP_1_ROTATION})`,
                transformOrigin: 'center center',
                transition: 'transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 400ms ease-out',
                willChange: 'transform, opacity',
              }}
            >
              Certified Aura Farmer
            </span>

            {/* Chip 2: Nerding out on design (pops up after reading 5th line, placed in gap of lower text) */}
            <span
              ref={chip2Ref}
              aria-hidden="true"
              className="pointer-events-none absolute hidden sm:inline-flex select-none items-center rounded-full bg-[#ff5500] sm:bottom-[13%] sm:left-[4%] sm:px-3.5 sm:py-1 sm:text-[14px] md:bottom-[12%] md:left-[6%] md:text-[16px] lg:bottom-[11%] lg:left-[8%] lg:px-4 lg:py-1.5 lg:text-[16px] font-semibold tracking-normal text-white"
              style={{
                fontFamily: 'var(--font-geist-sans), Arial, sans-serif',
                fontWeight: 400,
                textRendering: 'auto',
                opacity: 0,
                transform: `scale(0) rotate(${CHIP_2_ROTATION})`,
                transformOrigin: 'center center',
                transition: 'transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 400ms ease-out',
                willChange: 'transform, opacity',
              }}
            >
              Nerding out on design
            </span>
          </p>
          <TalkButton buttonClassName="group relative isolate mt-3.5 sm:mt-8 inline-flex h-10 sm:h-12 items-center gap-2 sm:gap-3 overflow-hidden rounded-full bg-[#111111] py-1 pl-4 sm:pl-6 pr-1 text-xs sm:text-sm font-medium text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff5500]" />

        </div>
      </article>
    </section>
  )
}

export default StackSection