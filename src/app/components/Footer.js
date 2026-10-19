
'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const SocialIcon = ({ label }) => {
  if (label === 'Instagram') {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="size-[19px]" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.75" fill="currentColor" stroke="none" />
      </svg>
    )
  }

  if (label === 'LinkedIn') {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="size-[19px]" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 9v9M6 6h.01M10 18v-5a4 4 0 0 1 8 0v5M10 9v9" />
      </svg>
    )
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="size-[19px]" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
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

const FooterLink = ({ href, children }) => (
  <a
    href={href}
    className="block max-w-full text-center text-[43px] leading-[51px] font-black tracking-[-0.43px] text-[#f0ebe6] transition-opacity hover:opacity-75"
  >
    {children}
  </a>
)

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
      const deltaX = event.clientX - (bounds.left + bounds.width / 2)
      const deltaY = event.clientY - (bounds.top + bounds.height / 2)
      const maxX = Math.max((bounds.width - pupil.offsetWidth) / 2 - 1, 0)
      const maxY = Math.max((bounds.height - pupil.offsetHeight) / 2 - 1, 0)
      const safeX = maxX || 1
      const safeY = maxY || 1
      const distance = Math.hypot(deltaX / safeX, deltaY / safeY)
      const scale = distance > 1 ? 1 / distance : 1

      pupil.style.transform = `translate(${deltaX * scale}px, ${deltaY * scale}px)`
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
        const deltaX = pointerX - (bounds.left + bounds.width / 2)
        const deltaY = pointerY - (bounds.top + bounds.height / 2)
        const distance = Math.hypot(deltaX, deltaY)
        const strength = Math.max(0, 1 - distance / 150)
        const offsetX = deltaX * strength * 0.18
        const offsetY = deltaY * strength * 0.18

        element.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0) scale(${1 + strength * 0.2})`
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
      href: 'https://www.linkedin.com/',
    },
    {
      label: 'Instagram',
      href: 'https://www.instagram.com/',
    },
    {
      label: 'YouTube',
      href: 'https://www.youtube.com/',
    },
  ]

  return (
    <footer
      onPointerMove={followPointer}
      onPointerLeave={resetEyes}
      className="mx-6 mt-auto mb-6 flex min-h-[36rem] w-[calc(100%-3rem)] flex-col items-center overflow-hidden rounded-[24px] bg-[#ff5500] px-5 pt-8 pb-0 text-center text-[#f0ebe6] sm:px-10 sm:pt-10 lg:px-14"
      style={{ fontFamily: 'var(--font-epilogue), Arial, sans-serif' }}
    >
      {/* Top header */}
      <div className="flex w-full items-center justify-between">
        {/* Eye logo on the left */}
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

        {/* Social icons on the right */}
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
      <div className="mt-12 grid w-full grid-cols-1 justify-items-center gap-10 sm:grid-cols-2 sm:gap-12 lg:mt-16 lg:grid-cols-3 lg:gap-8">
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
            Let's talk
          </h2>

          <a
            href="mailto:"
            className="mt-1 inline-block max-w-full break-words text-[43px] leading-[51px] font-black tracking-[-0.43px] text-[#f0ebe6] underline decoration-1 underline-offset-4 transition-opacity hover:opacity-75"
          >
            Send me an email ↗
          </a>

          <p className="mt-4 max-w-sm text-sm leading-relaxed text-[#f0ebe6]/85">
            Have a project in mind? I'd love to hear from you.
          </p>
        </section>

        {/* Work navigation */}
        <nav
          aria-label="Work navigation"
          className="flex max-w-full flex-col items-center text-center"
        >
          <FooterLabel>explore</FooterLabel>
          <FooterLink href="#work">Work</FooterLink>
          <FooterLink href="#playground">Playground</FooterLink>
        </nav>

        {/* About navigation */}
        <nav
          aria-label="About navigation"
          className="flex max-w-full flex-col items-center text-center"
        >
          <FooterLabel>more</FooterLabel>
          <FooterLink href="#about">About</FooterLink>
          <FooterLink href="#cv">CV</FooterLink>
        </nav>
      </div>

      {/* Animated name and stickers */}
      <div
        className="relative mt-auto h-[clamp(2.7rem,13.5vw,279px)] w-full overflow-hidden"
        onPointerMove={followNamePointer}
        onPointerLeave={resetName}
      >
        {[
          { src: '/stickers/Frame%201.png', width: 332, height: 424, left: 10.7 },
          { src: '/stickers/Frame%202.png', width: 415, height: 384, left: 43 },
          { src: '/stickers/Frame%203.png', width: 354, height: 430, left: 85 },
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
