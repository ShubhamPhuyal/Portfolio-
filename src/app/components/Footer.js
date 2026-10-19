'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const FooterIcon = ({ children }) => (
  <svg
    aria-hidden="true"
    className="size-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {children}
  </svg>
)

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

  useEffect(() => () => {
    if (magneticFrameRef.current) {
      window.cancelAnimationFrame(magneticFrameRef.current)
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
      const ellipseDistance = Math.hypot(deltaX / maxX, deltaY / maxY)
      const scale = ellipseDistance > 1 ? 1 / ellipseDistance : 1

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
      if (element) element.style.transform = 'translate3d(0, 0, 0) scale(1)'
    })
  }

  return (
    <footer
      onPointerMove={followPointer}
      onPointerLeave={resetEyes}
      className="mx-6 mt-auto mb-6 flex min-h-[36rem] w-[calc(100%-3rem)] flex-col items-center overflow-hidden rounded-[24px] bg-[#ff5500] px-5 pt-8 pb-0 text-center text-[#f0ebe6] sm:px-10 sm:pt-10 lg:px-14"
      style={{ fontFamily: 'var(--font-epilogue), Arial, sans-serif' }}
    >
      <Link href="/" aria-label="Shubham's portfolio home" className="flex w-fit items-center justify-center gap-1.5">
        {[0, 1].map((eye, index) => (
          <span
            key={eye}
            className="relative flex h-10 w-7 items-center justify-center overflow-hidden rounded-[50%_50%_42%_42%] bg-[#f0ebe6]"
          >
            <span
              ref={(element) => { eyeRefs.current[index] = element }}
              className="size-2.5 rounded-full bg-[#151515] transition-transform duration-100"
            />
          </span>
        ))}
      </Link>

      <div className="mt-12 grid w-full grid-cols-1 justify-items-center gap-10 sm:grid-cols-2 sm:gap-12 lg:mt-16 lg:grid-cols-3 lg:gap-8">
        <section aria-labelledby="footer-contact" className="flex max-w-full flex-col items-center text-center">
          <FooterLabel>contact</FooterLabel>
          <h2
            id="footer-contact"
            className="text-[43px] leading-[51px] font-black tracking-[-0.43px] text-[#f0ebe6]"
            style={{ fontFamily: 'var(--font-epilogue), Arial, sans-serif' }}
          >
            Let&apos;s talk
          </h2>
          <a
            href="mailto:"
            className="mt-1 inline-block max-w-full break-words text-[43px] leading-[51px] font-black tracking-[-0.43px] text-[#f0ebe6] underline decoration-1 underline-offset-4 transition-opacity hover:opacity-75"
          >
            Send me an email ↗
          </a>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-[#f0ebe6]/85">
            Have a project in mind? I&apos;d love to hear from you.
          </p>
          <a
            href="https://www.linkedin.com/"
            aria-label="LinkedIn"
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex size-10 items-center justify-center rounded-md bg-[#f0ebe6] text-[#ff5500] transition-transform hover:scale-105"
          >
            <FooterIcon>
              <path d="M7 9v8M7 6.5v.01M11 17v-4.2a2.3 2.3 0 0 1 4.6 0V17M11 10v7" />
            </FooterIcon>
          </a>
        </section>

        <nav aria-label="Work navigation" className="flex max-w-full flex-col items-center text-center">
          <FooterLabel>explore</FooterLabel>
          <FooterLink href="#work">Work</FooterLink>
          <FooterLink href="#playground">Playground</FooterLink>
        </nav>

        <nav aria-label="About navigation" className="flex max-w-full flex-col items-center text-center">
          <FooterLabel>more</FooterLabel>
          <FooterLink href="#about">About</FooterLink>
          <FooterLink href="#cv">CV</FooterLink>
        </nav>
      </div>

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
              ref={(element) => { stickerRefs.current[index] = element }}
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
          {'Shubham Phuyal'.split('').map((character, index) => {
            return (
              <span
                key={`${character}-${index}`}
                ref={(element) => { letterRefs.current[index] = element }}
                aria-hidden="true"
                className="inline-block"
              >
                {character === ' ' ? '\u00a0' : character}
              </span>
            )
          })}
        </h2>

      </div>
    </footer>
  )
}

export default Footer
