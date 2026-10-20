'use client'

import { useEffect, useState } from 'react'

const DOODLE_TEXT =
  'BRANDING  •  GRAPHICS DESIGN  •  VISUAL DESIGN  •  USER EXPERIENCE DESIGN  •  '

// Vibrant Gemini-style palette tuned for a black background: electric blue →
// violet → hot pink → warm orange, looping back to blue so the
// repeating gradient has no visible seam.
const GEMINI_STOPS = [
  { offset: '0%', color: '#2f8cff' },
  { offset: '25%', color: '#a46bff' },
  { offset: '50%', color: '#ff4d9d' },
  { offset: '75%', color: '#ffb02e' },
  { offset: '100%', color: '#2f8cff' },
]

// Width of one full gradient cycle in SVG user units. The shimmer is
// translated by exactly this distance per loop, so it repeats seamlessly.
const GRADIENT_CYCLE = 800

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
      className="relative z-30 -mt-16 sm:-mt-12 isolate flex h-[clamp(240px,28vw,340px)] sm:h-[clamp(314px,28vw,560px)] w-full items-center overflow-hidden"
      style={{ backgroundColor: '#0d0d0d' }}
    >
      <svg
        aria-hidden="true"
        className="absolute left-1/2 h-auto w-[max(800px,100vw)] sm:w-[max(1000px,100vw)] max-w-none top-[18%] sm:top-[40%]"
        style={{
          transform: 'translate(-50%, -50%)',
        }}
        viewBox="0 0 1600 400"
        xmlns="http://www.w3.org/2000/svg"
        overflow="visible"
      >
        <defs>
          <path
            id="doodle-curve"
            d="M -100 100 C 300 100 380 324 800 324 C 1220 324 1300 100 1700 100"
          />

          {/* Gemini gradient. userSpaceOnUse keeps it fixed in the SVG while the
              text slides along the curve, so colors flow through the letters. */}
          <linearGradient
            id="gemini-gradient"
            gradientUnits="userSpaceOnUse"
            x1="0"
            y1="0"
            x2={GRADIENT_CYCLE}
            y2="0"
            spreadMethod="repeat"
          >
            {GEMINI_STOPS.map((stop) => (
              <stop key={stop.offset} offset={stop.offset} stopColor={stop.color} />
            ))}
            {shouldAnimate && (
              <animateTransform
                attributeName="gradientTransform"
                type="translate"
                from="0 0"
                to={`${GRADIENT_CYCLE} 0`}
                dur="6s"
                repeatCount="indefinite"
              />
            )}
          </linearGradient>
        </defs>

        {/* Filled peach area above the wave curve — connects seamlessly to About section */}
        <path
          d="M -200 -400 L -200 100 C 300 100 380 324 800 324 C 1220 324 1300 100 1800 100 L 1800 -400 Z"
          fill="#f7eee7"
        />

        {/* Filled black area below the wave curve — connects directly into Works */}
        <path
          d="M -200 1200 L -200 100 C 300 100 380 324 800 324 C 1220 324 1300 100 1800 100 L 1800 1200 Z"
          fill="#0d0d0d"
        />

        {/* Wave ribbon */}
        <use
          href="#doodle-curve"
          fill="none"
          stroke="#0d0d0d"
          strokeWidth="144"
        />

        <text
          fill="url(#gemini-gradient)"
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