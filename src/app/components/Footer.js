
'use client'

import { useRef } from 'react'

const FooterIcon = ({ children }) => (
  <svg
    aria-hidden="true"
    className="size-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {children}
  </svg>
)

const Footer = () => {
  const eyeRefs = useRef([])

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

  return (
    <footer
      onPointerMove={followPointer}
      onPointerLeave={resetEyes}
      className="mt-auto flex min-h-105 flex-col rounded-t-3xl rounded-b-none bg-[#08080A] px-7 py-8 text-white sm:px-10"
    >
      <div className="mx-auto flex w-full max-w-360 flex-1 flex-col">
        <div className="flex items-center justify-between">
          <a href="/" aria-label="Shubham's portfolio home" className="flex items-center gap-1.5">
            {[0, 1].map((eye, index) => (
              <span
                key={eye}
                className="relative flex h-10 w-7 items-center justify-center overflow-hidden rounded-[50%_50%_42%_42%] bg-white"
              >
                <span
                  ref={(element) => { eyeRefs.current[index] = element }}
                  className="size-2.5 rounded-full bg-[#08080A]"
                />
              </span>
            ))}
          </a>

          <nav aria-label="Social links" className="flex items-center gap-1.5">
            <a
              href="mailto:"
              aria-label="Send an email"
              className="flex size-13 items-center justify-center rounded-full bg-white/[0.07] text-white/75 transition-colors hover:bg-white/[0.14] hover:text-white"
            >
              <FooterIcon>
                <rect x="4" y="6" width="16" height="12" rx="2" />
                <path d="m5 8 7 5 7-5" />
              </FooterIcon>
            </a>
            <a
              href="#cv"
              aria-label="View CV"
              className="flex size-13 items-center justify-center rounded-full bg-white/[0.07] text-white/75 transition-colors hover:bg-white/[0.14] hover:text-white"
            >
              <FooterIcon>
                <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                <path d="M14 3v6h6M8 13h8M8 17h6" />
              </FooterIcon>
            </a>
            <a
              href="https://www.linkedin.com/"
              aria-label="LinkedIn"
              target="_blank"
              rel="noreferrer"
              className="flex size-13 items-center justify-center rounded-full bg-white/[0.07] text-white/75 transition-colors hover:bg-white/[0.14] hover:text-white"
            >
              <FooterIcon>
                <path d="M7 9v8M7 6.5v.01M11 17v-4.2a2.3 2.3 0 0 1 4.6 0V17M11 10v7" />
              </FooterIcon>
            </a>
          </nav>
        </div>

        <p className="mt-9 text-base leading-relaxed text-white/85">
          Let&apos;s connect.
          <br />
          I&apos;m always down for a chat.
        </p>

        <h2
          className="my-auto w-full whitespace-nowrap py-12 text-center text-[146px] leading-none font-black text-white"
          style={{ fontFamily: '"Amsi Pro Condensed", Arial, sans-serif' }}
        >
          Shubham Phuyal
        </h2>

        <div className="mt-auto flex items-center justify-between pt-16 text-sm text-white/55">
          <span>© 2026 Shubham Phuyal</span>
          <span>Built with love</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer