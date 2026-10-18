'use client'

import { useEffect, useState } from 'react'

const LOAD_DURATION = 1400
const FADE_DURATION = 500

const PageLoader = () => {
  const [progress, setProgress] = useState(0)
  const [isFading, setIsFading] = useState(false)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    let animationFrame
    let finishTimer
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
        setIsFading(true)
        if (reducedMotion.matches) {
          setIsVisible(false)
          return
        }
        finishTimer = window.setTimeout(() => setIsVisible(false), FADE_DURATION)
        return
      }

      animationFrame = window.requestAnimationFrame(updateProgress)
    }

    animationFrame = window.requestAnimationFrame(updateProgress)

    return () => {
      window.cancelAnimationFrame(animationFrame)
      window.clearTimeout(finishTimer)
      window.removeEventListener('load', markPageReady)
    }
  }, [])

  if (!isVisible) return null

  return (
    <div
      aria-label="Loading page"
      aria-live="polite"
      className={`fixed inset-0 z-[100] bg-[#ff5500] transition-opacity duration-500 ease-out motion-reduce:transition-none ${
        isFading ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
      role="status"
    >
      <span
        className="fixed right-6 bottom-6 text-[64px] leading-none font-semibold text-white"
      >
        {progress}%
      </span>
    </div>
  )
}

export default PageLoader