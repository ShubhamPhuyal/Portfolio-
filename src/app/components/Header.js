'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

const NavIcon = ({ children, className = 'size-4 shrink-0' }) => (
  <svg
    aria-hidden="true"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {children}
  </svg>
)

const NAV_ITEMS = [
  {
    label: 'Work',
    href: '#work',
    icon: (
      <>
        <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <path d="M3 10h18" />
      </>
    ),
  },
  {
    label: 'Design Process',
    href: '#design-process',
    icon: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="m21 15-5-5L5 21" />
      </>
    ),
  },
  {
    label: 'About',
    href: '#about',
    icon: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="M8 14s1.5 2 4 2 4-2 4-2" />
        <path d="M9 9h.01M15 9h.01" />
      </>
    ),
  },
  {
    label: 'CV',
    href: '/Shubham Phuyal_CV.pdf',
    icon: (
      <>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6M8 13h8M8 17h8" />
      </>
    ),
  },
]

const handleNavClick = (href) => {
  if (href.startsWith('#')) {
    const id = href.replace('#', '')
    const target = document.getElementById(id)
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  } else {
    window.open(href, '_blank', 'noopener,noreferrer')
  }
}

const Header = () => {
  const [isAtTop, setIsAtTop] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)

  const buttonRef = useRef(null)
  const fillRef = useRef(null)
  const iconRef = useRef(null)
  const frameRef = useRef(0)
  const pointerRef = useRef(null)
  const magneticRef = useRef({ x: 0, y: 0 })
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

      if (Math.hypot(distanceX, distanceY) > 64) {
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
    }
  }, [])

  useEffect(() => {
    animateRevealRef.current?.(null, false)
  }, [isAtTop, menuOpen])

  const animateReveal = (event, entering) => {
    const fill = fillRef.current
    const button = buttonRef.current
    if (!button) return

    const bounds = button.getBoundingClientRect()
    const x = Number.isFinite(event?.clientX)
      ? event.clientX - bounds.left
      : bounds.width / 2
    const y = Number.isFinite(event?.clientY)
      ? event.clientY - bounds.top
      : bounds.height / 2
    const radius = Math.ceil(
      Math.max(
        Math.hypot(x, y),
        Math.hypot(bounds.width - x, y),
        Math.hypot(x, bounds.height - y),
        Math.hypot(bounds.width - x, bounds.height - y)
      )
    )
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
      if (fill) {
        fill.style.transition = 'none'
        fill.style.clipPath = expandedClip
        if (!reduceMotion) fill.getBoundingClientRect()
        fill.style.transition = reduceMotion ? 'none' : 'clip-path 240ms cubic-bezier(0.4, 0, 0.2, 1)'
        fill.style.clipPath = collapsedClip
      }
      button.style.transition = reduceMotion ? 'none' : 'transform 240ms cubic-bezier(0.4, 0, 0.2, 1)'
      button.style.transform = 'translate3d(0, 0, 0)'
      if (iconRef.current) {
        iconRef.current.style.transition = reduceMotion ? 'none' : 'transform 200ms cubic-bezier(0.4, 0, 0.2, 1)'
        iconRef.current.style.transform = 'translate3d(0, 0, 0)'
      }
      magneticRef.current = { x: 0, y: 0 }
      return
    }

    if (fill) {
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
    }
  }

  const followPointer = (event) => {
    const button = buttonRef.current
    if (!button || event.pointerType !== 'mouse') return

    pointerRef.current = { x: event.clientX, y: event.clientY }
    if (frameRef.current) return

    frameRef.current = window.requestAnimationFrame(() => {
      frameRef.current = 0
      const pointer = pointerRef.current
      if (!pointer) return
      const bounds = button.getBoundingClientRect()
      const current = magneticRef.current
      const centerX = bounds.left - current.x + bounds.width / 2
      const centerY = bounds.top - current.y + bounds.height / 2
      const targetX = Math.max(-12, Math.min(12, (pointer.x - centerX) * 0.35))
      const targetY = Math.max(-12, Math.min(12, (pointer.y - centerY) * 0.35))
      const innerX = targetX * 0.35
      const innerY = targetY * 0.35

      magneticRef.current = { x: targetX, y: targetY }
      button.style.transition = 'transform 300ms cubic-bezier(0.22, 1, 0.36, 1)'
      button.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`

      if (iconRef.current) {
        iconRef.current.style.transition = 'transform 300ms cubic-bezier(0.22, 1, 0.36, 1)'
        iconRef.current.style.transform = `translate3d(${innerX}px, ${innerY}px, 0)`
      }
    })
  }

  useEffect(() => {
    const updateHeader = () => {
      const atTop = window.scrollY < 20
      setIsAtTop(atTop)
      if (atTop) {
        setMenuOpen(false)
      }
    }

    updateHeader()
    window.addEventListener('scroll', updateHeader, { passive: true })

    return () => {
      window.removeEventListener('scroll', updateHeader)
    }
  }, [])

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const closeMenu = () => setMenuOpen(false)

  return (
    <header className="fixed inset-x-0 top-0 z-50 w-full pointer-events-none">
      {/* Morphing Nav Shell — seamlessly collapses from center full bar to right-side menu button */}
      <div
        className={`pointer-events-auto absolute top-5 left-1/2 flex items-center transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
          isAtTop ? 'nav-top-pos' : 'nav-scrolled-pos'
        }`}
      >
        <div className="relative flex items-center">
          {/* SP Avatar Badge */}
          <Link
            href="/"
            aria-label="Home"
            tabIndex={isAtTop ? 0 : -1}
            className={`flex size-10 shrink-0 items-center justify-center rounded-full border border-[#AFAFB1] bg-[#F4F4F5] text-sm font-semibold text-zinc-900 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none sm:size-14 ${
              isAtTop
                ? 'scale-100 opacity-100 max-w-[56px] mr-2'
                : 'scale-50 opacity-0 max-w-0 mr-0 p-0 border-0 pointer-events-none overflow-hidden'
            }`}
          >
            SP
          </Link>

          {/* Navigation Links Pill */}
          <nav
            aria-label="Main navigation"
            aria-hidden={!isAtTop}
            className={`flex items-center gap-0.5 rounded-full border border-[#AFAFB1] bg-[#F4F4F5] p-1 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none sm:gap-1.5 sm:p-1.5 overflow-hidden ${
              isAtTop
                ? 'scale-100 opacity-100 max-w-[600px] mr-2'
                : 'scale-90 opacity-0 max-w-0 mr-0 p-0 border-0 pointer-events-none'
            }`}
          >
            {NAV_ITEMS.map((item) => (
              <button
                key={item.label}
                type="button"
                tabIndex={isAtTop ? 0 : -1}
                onClick={() => handleNavClick(item.href)}
                className="flex items-center gap-1 whitespace-nowrap rounded-full px-1.5 py-2 text-xs text-zinc-800 transition-colors hover:bg-white/80 sm:gap-2 sm:px-3 sm:py-2.5 sm:text-sm"
              >
                <NavIcon>{item.icon}</NavIcon>
                {item.label}
              </button>
            ))}
          </nav>

          {/* Single Collapsing Button: Email icon at top -> Menu hamburger icon when scrolled */}
          <button
            ref={buttonRef}
            type="button"
            aria-label={
              isAtTop
                ? 'Send email'
                : menuOpen
                ? 'Close navigation menu'
                : 'Open navigation menu'
            }
            aria-expanded={isAtTop ? undefined : menuOpen}
            aria-controls={isAtTop ? undefined : 'compact-navigation'}
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
            onClick={() => {
              if (isAtTop) {
                window.location.href = 'mailto:'
              } else {
                setMenuOpen((open) => !open)
              }
            }}
            className={`relative flex size-[44px] shrink-0 items-center justify-center overflow-hidden rounded-full border text-white transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-95 sm:size-[60px] ${
              isAtTop
                ? 'border-[#AFAFB1] bg-[#ff5500] shadow-sm'
                : 'border-[#ff5500] bg-[#ff5500] shadow-lg'
            }`}
          >
            {/* Expanding radial ripple fill from pointer */}
            <span
              ref={fillRef}
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-0 rounded-full bg-[#e64d00]"
              style={{ clipPath: 'circle(0px at 50% 50%)' }}
            />

            {/* Inner icon wrapper with parallax magnetic shift */}
            <span
              ref={iconRef}
              className="pointer-events-none relative z-10 flex size-full items-center justify-center"
            >
              {/* Email Icon (visible at top) */}
              <span
                aria-hidden={!isAtTop}
                className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
                  isAtTop
                    ? 'scale-100 opacity-100 rotate-0'
                    : 'scale-50 opacity-0 -rotate-45 pointer-events-none'
                }`}
              >
                <NavIcon>
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="m3 7 9 6 9-6" />
                </NavIcon>
              </span>

              {/* Hamburger / Close Icon (visible when scrolled) */}
              <span
                aria-hidden={isAtTop}
                className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
                  !isAtTop
                    ? 'scale-100 opacity-100 rotate-0'
                    : 'scale-50 opacity-0 rotate-45 pointer-events-none'
                }`}
              >
                <span className="relative flex size-6 items-center justify-center">
                  <span
                    className={`absolute h-0.5 w-5 rounded-full bg-white transition-transform duration-300 ${
                      menuOpen ? 'translate-y-0 rotate-45' : '-translate-y-[5px]'
                    }`}
                  />
                  <span
                    className={`absolute h-0.5 w-5 rounded-full bg-white transition-all duration-200 ${
                      menuOpen ? 'scale-x-0 opacity-0' : 'scale-x-100 opacity-100'
                    }`}
                  />
                  <span
                    className={`absolute h-0.5 w-5 rounded-full bg-white transition-transform duration-300 ${
                      menuOpen ? 'translate-y-0 -rotate-45' : 'translate-y-[5px]'
                    }`}
                  />
                </span>
              </span>
            </span>
          </button>

          {/* Compact Dropdown Menu Panel (anchored right below the collapsed button) */}
          <div
            id="compact-navigation"
            aria-hidden={!menuOpen || isAtTop}
            inert={!menuOpen || isAtTop}
            className={`absolute right-0 top-[calc(100%+12px)] w-[min(280px,calc(100vw-24px))] origin-top-right rounded-3xl border border-white/15 bg-[#171717]/95 p-3 text-white shadow-2xl backdrop-blur-xl transition-all duration-300 ease-out motion-reduce:transition-none ${
              menuOpen && !isAtTop
                ? 'translate-y-0 scale-100 opacity-100'
                : 'pointer-events-none -translate-y-3 scale-95 opacity-0'
            }`}
          >
            <nav aria-label="Compact navigation">
              <div className="mb-2 px-3 pt-2 text-xs font-medium uppercase tracking-[0.2em] text-white/40">
                Navigation
              </div>

              {NAV_ITEMS.map((item, index) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => { handleNavClick(item.href); closeMenu() }}
                  style={{ transitionDelay: menuOpen ? `${index * 45}ms` : '0ms' }}
                  className="flex w-full items-center gap-3 rounded-2xl px-3 py-3.5 text-sm text-white/80 transition-all duration-200 hover:bg-white/10 hover:text-white"
                >
                  <span className="text-[#ff5500]">
                    <NavIcon>{item.icon}</NavIcon>
                  </span>
                  <span>{item.label}</span>
                  <span className="ml-auto text-white/30">↗</span>
                </button>
              ))}

              <div className="my-2 border-t border-white/10" />

              <a
                href="mailto:"
                onClick={closeMenu}
                className="flex items-center justify-center gap-2 rounded-2xl bg-[#ff5500] px-4 py-3.5 text-sm font-medium text-white transition-colors hover:bg-[#e64d00]"
              >
                <NavIcon>
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="m3 7 9 6 9-6" />
                </NavIcon>
                Get in touch
              </a>
            </nav>
          </div>
        </div>
      </div>

      {/* Close menu when clicking outside the panel */}
      {menuOpen && !isAtTop && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={closeMenu}
          className="fixed inset-0 z-40 cursor-default"
        />
      )}
    </header>
  )
}

export default Header