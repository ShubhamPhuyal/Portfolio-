'use client'

import { useEffect, useRef } from 'react'

const TalkButton = ({
  label = "Let's Talk",
  href = 'mailto:',
  buttonClassName,
  fillClassName = 'bg-[#ff5500]',
  labelClassName = '',
  arrowClassName = '',
}) => {
  const buttonRef = useRef(null)
  const fillRef = useRef(null)
  const textRef = useRef(null)
  const arrowRef = useRef(null)
  const frameRef = useRef(0)
  const pointerRef = useRef(null)
  const magneticRef = useRef({ x: 0, y: 0 })
  const arrowAnimationRef = useRef(null)
  const pointerActiveRef = useRef(false)
  const animateRevealRef = useRef(null)
  const followPointerRef = useRef(null)

  useEffect(() => {
    const handleWindowPointerMove = (event) => {
      if (!pointerActiveRef.current) return

      const button = buttonRef.current
      if (!button) return

      const bounds = button.getBoundingClientRect()
      const originLeft = bounds.left - magneticRef.current.x
      const originTop = bounds.top - magneticRef.current.y
      const distanceX = Math.max(originLeft - event.clientX, 0, event.clientX - originLeft - bounds.width)
      const distanceY = Math.max(originTop - event.clientY, 0, event.clientY - originTop - bounds.height)

      if (Math.hypot(distanceX, distanceY) > 72) {
        pointerActiveRef.current = false
        window.removeEventListener('pointermove', handleWindowPointerMove)
        animateRevealRef.current?.(event, false)
        return
      }

      followPointerRef.current?.(event)
    }

    const handlePointerOut = (event) => {
      if (event.relatedTarget !== null || !pointerActiveRef.current) return

      pointerActiveRef.current = false
      window.removeEventListener('pointermove', handleWindowPointerMove)
      animateRevealRef.current?.(event, false)
    }

    window.addEventListener('pointermove', handleWindowPointerMove)
    window.addEventListener('pointerout', handlePointerOut)

    return () => {
      window.removeEventListener('pointermove', handleWindowPointerMove)
      window.removeEventListener('pointerout', handlePointerOut)
      if (frameRef.current) window.cancelAnimationFrame(frameRef.current)
      arrowAnimationRef.current?.cancel()
    }
  }, [])

  const animateReveal = (event, entering) => {
    const fill = fillRef.current
    const button = buttonRef.current
    if (!fill || !button) return

    const bounds = button.getBoundingClientRect()
    const x = Number.isFinite(event.clientX)
      ? event.clientX - bounds.left
      : bounds.width / 2
    const y = Number.isFinite(event.clientY)
      ? event.clientY - bounds.top
      : bounds.height / 2
    const radius = Math.ceil(Math.max(
      Math.hypot(x, y),
      Math.hypot(bounds.width - x, y),
      Math.hypot(x, bounds.height - y),
      Math.hypot(bounds.width - x, bounds.height - y)
    ))
    const origin = `at ${x}px ${y}px`
    const expandedClip = `circle(${radius}px ${origin})`
    const collapsedClip = `circle(0px ${origin})`

    if (frameRef.current) {
      window.cancelAnimationFrame(frameRef.current)
      frameRef.current = 0
    }

    if (!entering) {
      pointerActiveRef.current = false
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      fill.style.transition = 'none'
      fill.style.clipPath = expandedClip
      if (!reduceMotion) fill.getBoundingClientRect()
      fill.style.transition = reduceMotion ? 'none' : 'clip-path 240ms cubic-bezier(0.4, 0, 0.2, 1)'
      fill.style.clipPath = collapsedClip
      button.style.transition = reduceMotion ? 'none' : 'transform 240ms cubic-bezier(0.4, 0, 0.2, 1)'
      button.style.transform = 'translate3d(0, 0, 0)'
      textRef.current?.style.setProperty('transition', reduceMotion ? 'none' : 'transform 200ms cubic-bezier(0.4, 0, 0.2, 1)')
      textRef.current?.style.setProperty('transform', 'translate3d(0, 0, 0)')
      arrowAnimationRef.current?.cancel()
      arrowAnimationRef.current = null
      arrowRef.current?.style.setProperty('transition', reduceMotion ? 'none' : 'transform 200ms cubic-bezier(0.4, 0, 0.2, 1)')
      arrowRef.current?.style.setProperty('transform', 'translate3d(0, 0, 0)')
      magneticRef.current = { x: 0, y: 0 }
      return
    }

    fill.style.transition = 'none'
    fill.style.clipPath = collapsedClip

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      fill.style.clipPath = expandedClip
      return
    }

    fill.getBoundingClientRect()
    frameRef.current = window.requestAnimationFrame(() => {
      fill.style.transition = 'clip-path 520ms cubic-bezier(0.22, 1, 0.36, 1)'
      fill.style.clipPath = expandedClip
      frameRef.current = 0
    })

    arrowAnimationRef.current?.cancel()
    arrowAnimationRef.current = arrowRef.current?.animate(
      [
        { transform: 'translate3d(var(--arrow-x, 0), var(--arrow-y, 0), 0) rotate(0deg)' },
        { transform: 'translate3d(var(--arrow-x, 0), var(--arrow-y, 0), 0) rotate(-25deg)', offset: 0.35 },
        { transform: 'translate3d(var(--arrow-x, 0), var(--arrow-y, 0), 0) rotate(0deg)' },
      ],
      { duration: 620, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', iterations: Infinity, direction: 'alternate' }
    ) ?? null
  }

  const followPointer = (event) => {
    const button = buttonRef.current
    if (!button || event.pointerType !== 'mouse') return

    pointerRef.current = { x: event.clientX, y: event.clientY }
    if (frameRef.current) return

    frameRef.current = window.requestAnimationFrame(() => {
      frameRef.current = 0
      const pointer = pointerRef.current
      const bounds = button.getBoundingClientRect()
      const current = magneticRef.current
      const centerX = bounds.left - current.x + bounds.width / 2
      const centerY = bounds.top - current.y + bounds.height / 2
      const targetX = Math.max(-14, Math.min(14, (pointer.x - centerX) * 0.3))
      const targetY = Math.max(-9, Math.min(9, (pointer.y - centerY) * 0.3))
      const innerX = targetX * 0.35
      const innerY = targetY * 0.35

      magneticRef.current = { x: targetX, y: targetY }
      button.style.transition = 'transform 300ms cubic-bezier(0.22, 1, 0.36, 1)'
      button.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`

      if (textRef.current) {
        textRef.current.style.transition = 'transform 300ms cubic-bezier(0.22, 1, 0.36, 1)'
        textRef.current.style.transform = `translate3d(${innerX}px, ${innerY}px, 0)`
      }

      if (arrowRef.current) {
        arrowRef.current.style.setProperty('--arrow-x', `${innerX}px`)
        arrowRef.current.style.setProperty('--arrow-y', `${innerY}px`)
        if (!arrowAnimationRef.current) {
          arrowRef.current.style.transition = 'transform 300ms cubic-bezier(0.22, 1, 0.36, 1)'
          arrowRef.current.style.transform = `translate3d(${innerX}px, ${innerY}px, 0)`
        }
      }
    })
  }

  return (
    <a
      ref={buttonRef}
      href={href}
      aria-label={label}
      onPointerEnter={(event) => {
        if (event.pointerType !== 'mouse') return
        animateRevealRef.current = animateReveal
        followPointerRef.current = followPointer
        pointerActiveRef.current = true
        animateReveal(event, true)
        followPointer(event)
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === 'mouse') animateReveal(event, false)
      }}
      onFocus={(event) => animateReveal(event, true)}
      onBlur={(event) => animateReveal(event, false)}
      onPointerMove={followPointer}
      className={buttonClassName ?? "group relative isolate mt-6 sm:mt-8 inline-flex h-11 sm:h-12 items-center gap-2.5 sm:gap-3 overflow-hidden rounded-full bg-[#111111] py-1 pl-5 sm:pl-6 pr-1 text-xs sm:text-sm font-medium text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff5500]"}
    >
      <span
        ref={fillRef}
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 z-0 rounded-full ${fillClassName}`}
        style={{ clipPath: 'circle(0px at 50% 50%)' }}
      />
      <span ref={textRef} className={`relative z-10 ${labelClassName}`}>{label}</span>
      <span
        ref={arrowRef}
        aria-hidden="true"
        className={`relative z-10 flex size-9 sm:size-10 items-center justify-center rounded-full bg-[#ff5500] text-white ${arrowClassName}`}
      >
        <svg
          aria-hidden="true"
          className="size-4 sm:size-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M7 17 17 7M7 7h10v10" />
        </svg>
      </span>
    </a>
  )
}

export default TalkButton
