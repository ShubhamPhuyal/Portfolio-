'use client'

import { useEffect, useState } from 'react'

const DOODLE_TEXT =
  'BRANDING  •  GRAPHICS DESIGN  •  VISUAL DESIGN  •  USER EXPERIENCE DESIGN  •  '

const Doodle = () => {
  const [shouldAnimate, setShouldAnimate] = useState(false)

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updateMotionPreference = () => setShouldAnimate(!reducedMotion.matches)

    updateMotionPreference()
    reducedMotion.addEventListener('change', updateMotionPreference)

    return () => reducedMotion.removeEventListener('change', updateMotionPreference)
  }, [])

  return (
    <section
      aria-label="Design philosophy"
      className="relative z-30 -mt-12 isolate flex h-[clamp(314px,28vw,560px)] w-full items-center overflow-hidden bg-[#f7eee7]"
    >
      <svg
        aria-hidden="true"
        className="absolute left-1/2 h-auto w-[max(1000px,100vw)] max-w-none"
        style={{
          top: '40%',
          transform: 'translate(-50%, -50%)',
        }}
        viewBox="0 0 1600 400"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <path
            id="doodle-curve"
            d="M -100 100 C 300 100 380 324 800 324 C 1220 324 1300 100 1700 100"
          />
        </defs>
        <use
          href="#doodle-curve"
          fill="none"
          stroke="#ff5500"
          strokeWidth="144"
        />
        <text
          fill="#ffffff"
          fontFamily="var(--font-bricolage), sans-serif"
          fontSize="56"
          fontWeight="800"
          letterSpacing="-2"
          style={{ transform: 'translateY(14px)' }}
        >
          <textPath href="#doodle-curve" startOffset="0%">
            {DOODLE_TEXT.repeat(5)}
            {shouldAnimate && (
              <animate
                attributeName="startOffset"
                from="0%"
                to="-100%"
                dur="28s"
                repeatCount="indefinite"
              />
            )}
          </textPath>
        </text>
      </svg>
    </section>
  )
}

export default Doodle