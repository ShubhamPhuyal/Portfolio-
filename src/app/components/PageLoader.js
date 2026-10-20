'use client'

import { useEffect, useState, useRef, useCallback } from 'react'

const LOAD_DURATION = 3000
// Pixel grid config
const PIXEL_SIZE = 120 // px per pixel block
const WAVE_DURATION = 800 // total wave sweep time (ms)
const PIXEL_ANIM_DURATION = 400 // each pixel's own fade-out (ms)
const WAVE_CLEANUP_BUFFER = 200 // extra ms before unmounting

// Same header images used in HeroSection
const HEADER_IMAGES = [
  '/header/Frame%206.png',
  '/header/Frame%205.png',
  '/header/Frame%204.png',
  '/header/Frame%207.png',
  '/header/Frame%208.png',
]
const HEADER_INTERVAL_MS = 300

const PageLoader = () => {
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState('loading') // loading | waving | done
  const [showFlipAnimation, setShowFlipAnimation] = useState(true)
  const [activeHeaderIndex, setActiveHeaderIndex] = useState(0)
  const pixelGridRef = useRef(null)

  // Header image flipbook loop
  useEffect(() => {
    if (phase === 'done' || !showFlipAnimation) return
    const imageInterval = window.setInterval(() => {
      setActiveHeaderIndex((index) => (index + 1) % HEADER_IMAGES.length)
    }, HEADER_INTERVAL_MS)

    return () => window.clearInterval(imageInterval)
  }, [phase, showFlipAnimation])

  // Loading progress
  useEffect(() => {
    let animationFrame
    let pageReady = document.readyState === 'complete'
    const startedAt = performance.now()
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

    const markPageReady = () => {
      Promise.resolve(document.fonts?.ready).then(() => {
        pageReady = true
      })
    }

    if (!pageReady) {
      window.addEventListener('load', markPageReady, { once: true })
    } else {
      markPageReady()
    }

    const updateProgress = (now) => {
      const elapsed = now - startedAt
      const loadingProgress = Math.min(90, (elapsed / LOAD_DURATION) * 90)
      setProgress(Math.floor(loadingProgress))

      if (pageReady && elapsed >= LOAD_DURATION) {
        setProgress(100)

        if (reducedMotion.matches) {
          setPhase('done')
          return
        }

        // Kick off pixelated wave
        setPhase('waving')
        return
      }

      animationFrame = window.requestAnimationFrame(updateProgress)
    }

    animationFrame = window.requestAnimationFrame(updateProgress)

    return () => {
      window.cancelAnimationFrame(animationFrame)
      window.removeEventListener('load', markPageReady)
    }
  }, [])

  // Instantly remove flip animation after hero section 50% is shown by the wave
  useEffect(() => {
    if (phase !== 'waving') return
    const hero50Timer = window.setTimeout(() => {
      setShowFlipAnimation(false)
    }, Math.round(WAVE_DURATION * 0.55))

    return () => window.clearTimeout(hero50Timer)
  }, [phase])

  // Build and animate the pixel grid when waving starts
  const buildPixelGrid = useCallback((container) => {
    if (!container || phase !== 'waving') return
    pixelGridRef.current = container

    const vw = window.innerWidth
    const vh = window.innerHeight
    const cols = Math.ceil(vw / PIXEL_SIZE)
    const rows = Math.ceil(vh / PIXEL_SIZE)

    // Create a document fragment for performance
    const fragment = document.createDocumentFragment()

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const pixel = document.createElement('div')
        pixel.style.cssText = `
          position: absolute;
          left: ${col * PIXEL_SIZE}px;
          top: ${row * PIXEL_SIZE}px;
          width: ${PIXEL_SIZE}px;
          height: ${PIXEL_SIZE}px;
          background: #ff5500;
          will-change: transform, opacity;
        `

        // Wave delay: bottom rows first, with a column wave offset
        const rowDelay = ((rows - 1 - row) / rows) * WAVE_DURATION
        const colCenter = Math.abs(col - cols / 2) / (cols / 2)
        const colDelay = colCenter * (WAVE_DURATION * 0.3)
        const totalDelay = rowDelay + colDelay

        pixel.style.transition = `transform ${PIXEL_ANIM_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1) ${totalDelay}ms, opacity ${PIXEL_ANIM_DURATION}ms ease-out ${totalDelay}ms`

        fragment.appendChild(pixel)
      }
    }

    container.appendChild(fragment)

    // Trigger the animation on next frame
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const pixels = container.children
        for (let i = 0; i < pixels.length; i++) {
          pixels[i].style.transform = 'scale(0)'
          pixels[i].style.opacity = '0'
        }
      })
    })

    // Cleanup after all animations complete
    const maxDelay = WAVE_DURATION + WAVE_DURATION * 0.3
    const cleanupTimer = window.setTimeout(() => {
      setPhase('done')
    }, maxDelay + PIXEL_ANIM_DURATION + WAVE_CLEANUP_BUFFER)

    return () => window.clearTimeout(cleanupTimer)
  }, [phase])

  if (phase === 'done') return null

  const isWaving = phase === 'waving'

  return (
    <>
      {/* Layer 1: Pixelated orange background (bottom layer) —
          During loading: solid orange bg. During waving: pixel grid dissolves bottom-to-top. */}
      {isWaving ? (
        <div
          ref={buildPixelGrid}
          className="fixed inset-0 z-[100] pointer-events-none"
          aria-hidden="true"
          style={{ overflow: 'hidden' }}
        />
      ) : (
        <div className="fixed inset-0 z-[100] bg-[#ff5500]" />
      )}

      {/* Layer 2: Content on top (images + counter) —
          Mirrors HeroSection position precisely for seamless visual continuity.
          The flip animation is instantly removed once 50% of hero section is shown,
          leaving the HeroSection flipbook to seamlessly take over. */}
      <div
        aria-label="Loading page"
        aria-live="polite"
        role="status"
        className="fixed inset-0 z-[101] flex flex-col pointer-events-none"
      >
        {/* Spacer matching layout Header height */}
        <div aria-hidden="true" className="h-20 shrink-0 sm:h-24" />

        <div className="relative flex min-h-0 flex-1 flex-col items-center px-4 pt-8 sm:pt-10">
          <div className="relative z-10 flex flex-col items-center text-center w-full">
            {/* Invisible placeholder matching the "Hello I'm" text height for exact image alignment */}
            <p aria-hidden="true" className="flex items-center gap-2 text-base opacity-0 select-none pointer-events-none">
              Hello I&apos;m
            </p>

            {/* Flipbook header images — instantly removed once hero section is 50% shown */}
            {showFlipAnimation && (
              <div
                role="img"
                aria-label="Loading header animation"
                className="mt-4 grid w-full max-w-5xl place-items-center sm:mt-5"
              >
                {HEADER_IMAGES.map((src, index) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={src}
                    src={src}
                    alt=""
                    draggable={false}
                    loading="eager"
                    className={`col-start-1 row-start-1 h-auto max-h-[200px] w-full select-none object-contain sm:max-h-[320px] ${index === activeHeaderIndex ? 'opacity-100' : 'opacity-0'
                      }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Progress counter */}
        {!isWaving && (
          <span className="fixed right-6 bottom-6 text-[64px] leading-none font-semibold text-white">
            {progress}%
          </span>
        )}
      </div>
    </>
  )
}

export default PageLoader