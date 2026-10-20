
'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const SocialIcon = ({ label }) => {
  if (label === 'Instagram') {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        className="size-[19px]"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle
          cx="17.5"
          cy="6.5"
          r="0.75"
          fill="currentColor"
          stroke="none"
        />
      </svg>
    )
  }

  if (label === 'LinkedIn') {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        className="size-[19px]"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 9v9M6 6h.01M10 18v-5a4 4 0 0 1 8 0v5M10 9v9" />
      </svg>
    )
  }

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className="size-[19px]"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4a2.5 2.5 0 0 0-1.8 1.8A26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8Z" />
      <path d="m10 15 5-3-5-3v6Z" />
    </svg>
  )
}

const FooterLabel = ({ children }) => (
  <p className="mb-5 w-fit rounded-full bg-[#f0ebe6] px-3 py-1 font-sans text-sm font-medium text-[#151515]">
    {children}
  </p>
)

const smoothScrollTo = (href) => {
  const id = href.replace('#', '')
  const target = document.getElementById(id)
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

/* Organic wave navigation link */
const FooterLink = ({ href, children, openInNewTab }) => {
  const waveRef = useRef(null)
  const isAnimating = useRef(false)
  const timeoutRef = useRef(null)

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const handleLetterEnter = (index) => {
    const wave = waveRef.current

    if (!wave || isAnimating.current) return

    isAnimating.current = true

    wave.style.setProperty('--h', index)
    wave.classList.add('is-animating')

    const maxDist = Math.max(
      index,
      wave.children.length - 1 - index
    )

    const totalTime = (0.8 + maxDist * 0.04) * 1000

    timeoutRef.current = setTimeout(() => {
      wave.classList.remove('is-animating')
      isAnimating.current = false
      timeoutRef.current = null
    }, totalTime + 50)
  }

  const isAnchor = href.startsWith('#')

  if (isAnchor) {
    return (
      <button
        type="button"
        ref={waveRef}
        onClick={() => smoothScrollTo(href)}
        className="organic-wave max-w-full text-center text-[43px] leading-[51px] font-black tracking-[-0.43px] text-[#f0ebe6] cursor-pointer bg-transparent border-none p-0"
      >
        {String(children).split('').map((character, index) => (
          <span
            key={`${character}-${index}`}
            style={{ '--i': index }}
            onMouseEnter={() => handleLetterEnter(index)}
          >
            {character === ' ' ? '\u00a0' : character}
          </span>
        ))}
      </button>
    )
  }

  return (
    <a
      href={href}
      ref={waveRef}
      target={openInNewTab ? '_blank' : undefined}
      rel={openInNewTab ? 'noopener noreferrer' : undefined}
      className="organic-wave max-w-full text-center text-[43px] leading-[51px] font-black tracking-[-0.43px] text-[#f0ebe6]"
    >
      {String(children).split('').map((character, index) => (
        <span
          key={`${character}-${index}`}
          style={{ '--i': index }}
          onMouseEnter={() => handleLetterEnter(index)}
        >
          {character === ' ' ? '\u00a0' : character}
        </span>
      ))}
    </a>
  )
}

const Footer = () => {
  const eyeRefs = useRef([])
  const letterRefs = useRef([])
  const stickerRefs = useRef([])
  const magneticFrameRef = useRef(0)

  useEffect(() => {
    return () => {
      if (magneticFrameRef.current) {
        window.cancelAnimationFrame(magneticFrameRef.current)
      }
    }
  }, [])

  const followPointer = (event) => {
    eyeRefs.current.forEach((pupil) => {
      const eye = pupil?.parentElement
      if (!eye) return

      const bounds = eye.getBoundingClientRect()
      const deltaX =
        event.clientX - (bounds.left + bounds.width / 2)
      const deltaY =
        event.clientY - (bounds.top + bounds.height / 2)

      const maxX = Math.max(
        (bounds.width - pupil.offsetWidth) / 2 - 1,
        0
      )
      const maxY = Math.max(
        (bounds.height - pupil.offsetHeight) / 2 - 1,
        0
      )

      const safeX = maxX || 1
      const safeY = maxY || 1

      const distance = Math.hypot(
        deltaX / safeX,
        deltaY / safeY
      )

      const scale = distance > 1 ? 1 / distance : 1

      pupil.style.transform =
        `translate(${deltaX * scale}px, ${deltaY * scale}px)`
    })
  }

  const resetEyes = () => {
    eyeRefs.current.forEach((pupil) => {
      if (pupil) pupil.style.transform = 'translate(0, 0)'
    })
  }

  const followNamePointer = (event) => {
    if (event.pointerType !== 'mouse') return
    if (magneticFrameRef.current) return

    const pointerX = event.clientX
    const pointerY = event.clientY

    magneticFrameRef.current = window.requestAnimationFrame(() => {
      magneticFrameRef.current = 0

      letterRefs.current.concat(stickerRefs.current).forEach((element) => {
        if (!element) return

        const bounds = element.getBoundingClientRect()

        const deltaX =
          pointerX - (bounds.left + bounds.width / 2)
        const deltaY =
          pointerY - (bounds.top + bounds.height / 2)

        const distance = Math.hypot(deltaX, deltaY)
        const strength = Math.max(0, 1 - distance / 150)

        const offsetX = deltaX * strength * 0.18
        const offsetY = deltaY * strength * 0.18

        element.style.transform =
          `translate3d(${offsetX}px, ${offsetY}px, 0) scale(${1 + strength * 0.2})`
      })
    })
  }

  const resetName = () => {
    if (magneticFrameRef.current) {
      window.cancelAnimationFrame(magneticFrameRef.current)
      magneticFrameRef.current = 0
    }

    letterRefs.current.concat(stickerRefs.current).forEach((element) => {
      if (element) {
        element.style.transform = 'translate3d(0, 0, 0) scale(1)'
      }
    })
  }

  const socialLinks = [
    {
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/shubham-phuyal-10957b288/',
    },
    {
      label: 'Instagram',
      href: 'https://www.instagram.com/ph.shubham/',
    },
    {
      label: 'YouTube',
      href: 'https://www.youtube.com/@luckygamer8692',
    },
  ]

  return (
    <footer
      onPointerMove={followPointer}
      onPointerLeave={resetEyes}
      className="relative mx-6 mt-auto mb-6 flex min-h-[36rem] w-[calc(100%-3rem)] flex-col items-center overflow-hidden rounded-[24px] bg-[#ff5500] px-5 pt-8 pb-0 text-center text-[#f0ebe6] sm:px-10 sm:pt-10 lg:px-14"
      style={{ fontFamily: 'var(--font-epilogue), Arial, sans-serif' }}
    >
      {/* Background doodle */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none opacity-75"
      >
        <img
          src="/doodle.svg"
          alt=""
          draggable={false}
          className="h-full w-full object-cover object-center"
        />
      </div>

      {/* Top header */}
      <div className="relative z-10 flex w-full items-center justify-between">
        {/* Eye logo */}
        <Link
          href="/"
          aria-label="Shubham's portfolio home"
          className="flex w-fit items-center justify-center gap-1.5"
        >
          {[0, 1].map((eye, index) => (
            <span
              key={eye}
              className="relative flex h-10 w-7 items-center justify-center overflow-hidden rounded-[50%_50%_42%_42%] bg-[#f0ebe6]"
            >
              <span
                ref={(element) => {
                  eyeRefs.current[index] = element
                }}
                className="size-2.5 rounded-full bg-[#151515] transition-transform duration-100"
              />
            </span>
          ))}
        </Link>

        {/* Social icons */}
        <div className="flex items-center gap-2">
          {socialLinks.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              target="_blank"
              rel="noopener noreferrer"
              className="flex size-10 items-center justify-center rounded-full bg-white text-[#ff5500] transition-all duration-300 hover:-translate-y-1 hover:bg-[#151515] hover:text-white"
            >
              <SocialIcon label={label} />
            </a>
          ))}
        </div>
      </div>

      {/* Main footer content */}
      <div className="relative z-10 mt-12 grid w-full grid-cols-1 justify-items-center gap-10 sm:grid-cols-2 sm:gap-12 lg:mt-16 lg:grid-cols-3 lg:gap-8">
        {/* Contact */}
        <section
          aria-labelledby="footer-contact"
          className="flex max-w-full flex-col items-center text-center"
        >
          <FooterLabel>contact</FooterLabel>

          <h2
            id="footer-contact"
            className="text-[43px] leading-[51px] font-black tracking-[-0.43px] text-[#f0ebe6]"
          >
            Let&apos;s talk
          </h2>

          <FooterLink href="mailto:your-shubhamphuyal1234@gmail.com">
            Send me an email ↗
          </FooterLink>

          <p className="mt-4 max-w-sm text-sm leading-relaxed text-[#f0ebe6]/85">
            Have a project in mind? I&apos;d love to hear from you.
          </p>
        </section>

        {/* Work navigation */}
        <nav
          aria-label="Work navigation"
          className="flex max-w-full flex-col items-center text-center"
        >
          <FooterLabel>explore</FooterLabel>
          <FooterLink href="#work">Work</FooterLink>
          <FooterLink href="#design-process">Design Process</FooterLink>
        </nav>

        {/* About navigation */}
        <nav
          aria-label="About navigation"
          className="flex max-w-full flex-col items-center text-center"
        >
          <FooterLabel>more</FooterLabel>
          <FooterLink href="#about">About</FooterLink>
          <FooterLink href="/Shubham Phuyal_CV.pdf" openInNewTab>CV</FooterLink>
        </nav>
      </div>

      {/* Animated name and stickers */}
      <div
        className="relative z-10 mt-auto h-[clamp(2.7rem,13.5vw,279px)] w-full overflow-hidden"
        onPointerMove={followNamePointer}
        onPointerLeave={resetName}
      >
        {[
          {
            src: '/stickers/Frame%201.png',
            width: 332,
            height: 424,
            left: 10.7,
          },
          {
            src: '/stickers/Frame%202.png',
            width: 415,
            height: 384,
            left: 43,
          },
          {
            src: '/stickers/Frame%203.png',
            width: 354,
            height: 430,
            left: 85,
          },
        ].map(({ src, width, height, left }, index) => (
          <span
            key={index}
            aria-hidden="true"
            className="footer-sticker pointer-events-none absolute top-[35%] z-10"
            style={{
              left: `${left}%`,
              animationDelay: `${index * -0.8}s`,
            }}
          >
            <Image
              ref={(element) => {
                stickerRefs.current[index] = element
              }}
              src={src}
              alt=""
              width={width}
              height={height}
              className="h-[130px] w-auto max-w-none object-contain"
            />
          </span>
        ))}

        <h2
          className="flex w-full cursor-default justify-center whitespace-nowrap text-center text-[clamp(3rem,15vw,180px)] leading-[1.5] font-black tracking-[-0.09em] text-[#f0ebe6]"
          style={{ fontFamily: 'var(--font-epilogue), Arial, sans-serif' }}
        >
          {'Shubham Phuyal'.split('').map((character, index) => (
            <span
              key={`${character}-${index}`}
              ref={(element) => {
                letterRefs.current[index] = element
              }}
              aria-hidden="true"
              className="inline-block"
            >
              {character === ' ' ? '\u00a0' : character}
            </span>
          ))}
        </h2>
      </div>
    </footer>
  )
}

export default Footer
