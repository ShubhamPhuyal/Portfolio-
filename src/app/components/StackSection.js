'use client'

import { useEffect, useRef } from 'react'
import TalkButton from './TalkButton'

const ABOUT_LABEL =
  'What started as a curiosity for UI/UX has grown into a career spanning 3 companies and 10+ projects over 2 years. Today, I work across product and graphic design, with a bigger ambition of building a design agency of my own someday.'
const TEXT_REVEAL_SCROLL_LENGTH = 1.25
const TEXT_REVEAL_GRADIENT_LENGTH = 18

const StackSection = ({ heroRef, cardRef }) => {
  const sectionRef = useRef(null)
  const paragraphRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return undefined

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let sectionTop = section.getBoundingClientRect().top + window.scrollY
    let frameId = 0

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

      const letters = paragraphRef.current?.querySelectorAll('[data-reveal-letter]')
      const revealPosition = textProgress * ((letters?.length ?? 0) + TEXT_REVEAL_GRADIENT_LENGTH)
      letters?.forEach((letter, index) => {
        if (reducedMotion.matches) {
          letter.style.color = '#000000'
          return
        }
        const letterProgress = revealPosition - index
        if (letterProgress >= TEXT_REVEAL_GRADIENT_LENGTH) {
          letter.style.color = '#000000'
        } else if (letterProgress > 0) {
          const gradientProgress = letterProgress / TEXT_REVEAL_GRADIENT_LENGTH
          letter.style.color = gradientProgress < 0.5
            ? `color-mix(in srgb, #ff5500 ${gradientProgress * 200}%, #f8a77e)`
            : `color-mix(in srgb, #9e3100 ${(gradientProgress - 0.5) * 200}%, #ff5500)`
        } else {
          letter.style.color = '#f8a77e'
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
  }, [heroRef])

  return (
    <section
      ref={sectionRef}
      aria-label="Selected work"
      className="relative z-20 -mt-[100svh] h-[362.5svh]"
    >
      <article
        ref={cardRef}
        className="sticky top-0 flex h-svh w-full items-center overflow-hidden bg-[#f7eee7]"
        style={{
          clipPath: 'polygon(0 0, 100% 1.5%, 100% 100%, 0 100%)',
          transform: 'translate3d(0, var(--card-y, 100svh), 0)',
          willChange: 'transform',
        }}
      >
        <div className="mx-auto w-full max-w-7xl px-4 py-8 text-center sm:px-10 sm:py-10 lg:px-14">
          <p className="mb-5 text-base font-medium tracking-[-0.04em] text-black sm:mb-10 sm:text-[19px] sm:tracking-[-1px]">
            A BIT ABOUT ME
          </p>
          <p
            ref={paragraphRef}
            className="mx-auto max-w-6xl text-[24px] leading-[1.1] font-bold tracking-[-0.045em] sm:text-[36px] sm:leading-[1.05] sm:tracking-[-0.055em] lg:text-[54px]"
            style={{ fontFamily: '"Mdnichrometest Dark", Arial, sans-serif' }}
            aria-label={ABOUT_LABEL}
          >
            {Array.from(ABOUT_LABEL).map((character, index) => /\s/.test(character)
              ? character
              : <span key={index} className="transition-colors duration-100 ease-out" data-reveal-letter="" aria-hidden="true">{character}</span>)}
          </p>
          <TalkButton />
        </div>
      </article>
    </section>
  )
}

export default StackSection
