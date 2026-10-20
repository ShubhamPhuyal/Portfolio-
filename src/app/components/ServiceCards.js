'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Must match Tailwind's `xl` breakpoint so the JS layout and CSS layout switch together.
const DESKTOP_BREAKPOINT = 1280

// Height of the desktop card stage. Tallest card (~357px) + hover lift (50px)
// + sticker overhang (36px) ≈ 443px, plus a little breathing room.
const DESKTOP_STAGE_HEIGHT = 470

// Cards stacked left-to-right cascade like in the reference image.
// Each card is offset to the right and slightly vertical, overlapping the previous.
// x positions fan from far-left to far-right across the container center (0).
// The 5 cards at 290px wide each with ~160px visible step = total ~900px span.
const CARDS_DATA = [
  {
    id: 'research',
    title: 'Research',
    bg: '#8ee6b8', // Vibrant fresh mint green
    text: '#0b2e1b',
    bulletColor: '#166534',
    resting: { x: -310, y: 40, rotate: -8 },
    zBase: 10,
    items: [
      'User Interviews',
      'Competitive Analysis',
      'Usability Audits',
      'Empathy Mapping',
      'Analytics Review',
      'Problem Framing',
    ],
    sticker: 'research',
  },
  {
    id: 'userflow',
    title: 'Userflow',
    bg: '#9ac5fe', // Vibrant sky blue
    text: '#091b3e',
    bulletColor: '#1d4ed8',
    resting: { x: -155, y: 55, rotate: -3 },
    zBase: 20,
    items: [
      'Info Architecture',
      'Journey Mapping',
      'Task Flows',
      'Site Structuring',
      'Nav System Design',
      'Edge-Case Mapping',
    ],
    sticker: 'userflow',
  },
  {
    id: 'wireframing',
    title: 'Wireframing',
    bg: '#fed156', // Warm rich sunshine amber
    text: '#2b1d03',
    bulletColor: '#b45309',
    resting: { x: 0, y: 10, rotate: 2 },
    zBase: 30,
    items: [
      'Lo-Fi Sketches',
      'Page Layouts',
      'Content Hierarchy',
      'Clickable Lo-Fi',
      'Rapid Iterations',
      'Concept Validation',
    ],
    sticker: 'wireframing',
  },
  {
    id: 'designing',
    title: 'Designing',
    bg: '#ffa3c7', // Vibrant coral rose
    text: '#330a1c',
    bulletColor: '#be185d',
    resting: { x: 155, y: 60, rotate: -4 },
    zBase: 40,
    items: [
      'Hi-Fi UI Screens',
      'Design Systems',
      'Type & Color Scale',
      'Motion & Micro-UX',
      'Prototypes',
      'Component Library',
    ],
    sticker: 'designing',
  },
  {
    id: 'testing',
    title: 'Testing',
    bg: '#cbb0ff', // Vibrant lavender orchid
    text: '#20083b',
    bulletColor: '#6d28d9',
    resting: { x: 310, y: 75, rotate: 6 },
    zBase: 50,
    items: [
      'Usability Testing',
      'A/B Experiments',
      'WCAG Audits',
      'Task Analysis',
      'User Validation',
      'Design Iteration',
    ],
    sticker: 'testing',
  },
]

// Hand-crafted die-cut doodle stickers relevant to each Design Process stage
function StickerIcon({ type }) {
  // 1. Research: Magnifying glass with discovery sparkles
  if (type === 'research') {
    return (
      <div className="relative w-[72px] h-[72px] transition-transform duration-300 hover:rotate-6 hover:scale-110">
        <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
          <path
            d="M42 10 C24 10 10 24 10 42 C10 60 24 74 42 74 C50 74 57 71 63 66 L82 85 C86 89 92 89 96 85 C100 81 100 75 96 71 L77 52 C82 46 84 39 84 42 C84 24 70 10 52 10 Z"
            fill="#ffffff"
            stroke="#111111"
            strokeWidth="5"
            strokeLinejoin="round"
          />
          <circle cx="42" cy="42" r="28" fill="#ecfdf5" stroke="#111111" strokeWidth="4" />
          <circle cx="42" cy="42" r="22" fill="#a7f3d0" />
          <path d="M28 32 C32 24 44 22 52 25" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
          <path d="M64 64 L86 86" stroke="#111111" strokeWidth="9" strokeLinecap="round" />
          <path d="M64 64 L86 86" stroke="#fbbf24" strokeWidth="4" strokeLinecap="round" />
          <path d="M78 24 Q78 30 72 30 Q78 30 78 36 Q78 30 84 30 Q78 30 78 24 Z" fill="#facc15" stroke="#111111" strokeWidth="1.5" />
          <path d="M20 74 Q20 78 16 78 Q20 78 20 82 Q20 78 24 78 Q20 78 20 74 Z" fill="#facc15" stroke="#111111" strokeWidth="1.5" />
        </svg>
      </div>
    )
  }

  // 2. Userflow: Connected flow nodes & directional route arrows
  if (type === 'userflow') {
    return (
      <div className="relative w-[68px] h-[68px] transition-transform duration-300 hover:-rotate-6 hover:scale-110">
        <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
          <path
            d="M16 20 C16 12 24 8 32 8 L68 8 C76 8 84 12 84 20 L84 76 C84 84 76 90 68 90 L32 90 C24 90 16 84 16 76 Z"
            fill="#ffffff"
            stroke="#111111"
            strokeWidth="5"
            strokeLinejoin="round"
          />
          <rect x="22" y="14" width="56" height="70" rx="8" fill="#dbeafe" />
          <circle cx="36" cy="30" r="8" fill="#3b82f6" stroke="#111111" strokeWidth="2.5" />
          <circle cx="64" cy="50" r="8" fill="#facc15" stroke="#111111" strokeWidth="2.5" />
          <circle cx="36" cy="70" r="8" fill="#10b981" stroke="#111111" strokeWidth="2.5" />
          <path d="M36 38 C36 50 64 38 64 50 C64 62 36 58 36 70" stroke="#111111" strokeWidth="3.5" strokeDasharray="4 3" fill="none" />
          <polygon points="64,42 70,50 64,58" fill="#111111" />
        </svg>
      </div>
    )
  }

  // 3. Wireframing: Blueprint layout grid with ruler & pencil
  if (type === 'wireframing') {
    return (
      <div className="relative w-[72px] h-[72px] transition-transform duration-300 hover:rotate-12 hover:scale-110">
        <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
          <path
            d="M14 16 L82 12 C88 12 92 16 92 22 L88 80 C88 86 84 90 78 90 L14 86 C8 86 6 80 6 74 L8 22 C8 16 12 16 14 16 Z"
            fill="#ffffff"
            stroke="#111111"
            strokeWidth="5"
            strokeLinejoin="round"
          />
          <polygon points="12,20 86,16 82,82 10,80" fill="#fed7aa" />
          <rect x="20" y="28" width="40" height="8" rx="2" fill="#ea580c" />
          <rect x="20" y="42" width="22" height="26" rx="2" fill="#ffffff" stroke="#ea580c" strokeWidth="2" />
          <path d="M48 44 L74 44 M48 52 L74 52 M48 60 L68 60" stroke="#ea580c" strokeWidth="2.5" strokeLinecap="round" />
          <g transform="rotate(35 68 70)">
            <rect x="62" y="30" width="10" height="38" rx="2" fill="#facc15" stroke="#111111" strokeWidth="2" />
            <polygon points="62,68 72,68 67,78" fill="#111111" />
            <rect x="62" y="24" width="10" height="6" rx="1" fill="#f43f5e" stroke="#111111" strokeWidth="2" />
          </g>
        </svg>
      </div>
    )
  }

  // 4. Designing: Vector pen tool with bezier curve & palette
  if (type === 'designing') {
    return (
      <div className="relative w-[72px] h-[72px] transition-transform duration-300 hover:rotate-12 hover:scale-110">
        <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
          <path
            d="M18 16 C18 10 24 8 32 8 L72 8 C80 8 86 12 86 20 L86 78 C86 86 80 92 72 92 L28 92 C20 92 16 86 16 78 Z"
            fill="#ffffff"
            stroke="#111111"
            strokeWidth="5"
            strokeLinejoin="round"
          />
          <rect x="22" y="14" width="58" height="72" rx="8" fill="#fdf2f8" stroke="#111111" strokeWidth="2.5" />
          <circle cx="34" cy="26" r="4.5" fill="#ec4899" stroke="#111111" strokeWidth="1.5" />
          <circle cx="46" cy="26" r="4.5" fill="#8b5cf6" stroke="#111111" strokeWidth="1.5" />
          <circle cx="58" cy="26" r="4.5" fill="#06b6d4" stroke="#111111" strokeWidth="1.5" />
          <path d="M30 66 Q48 38 72 58" stroke="#ec4899" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          <circle cx="30" cy="66" r="3.5" fill="#ffffff" stroke="#111111" strokeWidth="2" />
          <circle cx="72" cy="58" r="3.5" fill="#ffffff" stroke="#111111" strokeWidth="2" />
          <g transform="translate(42, 38) rotate(-40)">
            <path d="M0 0 L14 6 L12 28 L-2 28 L-4 6 Z" fill="#111111" />
            <path d="M3 28 L3 42 L7 42 L7 28 Z" fill="#e2e8f0" stroke="#111111" strokeWidth="1.5" />
            <polygon points="5,48 2,42 8,42" fill="#111111" />
            <circle cx="5" cy="18" r="2" fill="#ffffff" />
          </g>
          <path d="M76 22 Q76 28 70 28 Q76 28 76 34 Q76 28 82 28 Q76 28 76 22 Z" fill="#facc15" stroke="#111111" strokeWidth="1.5" />
        </svg>
      </div>
    )
  }

  // 5. Testing: Usability checklist clipboard with green verified checkmark
  return (
    <div className="relative w-[70px] h-[70px] transition-transform duration-300 hover:-rotate-6 hover:scale-110">
      <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
        <path
          d="M20 18 C20 10 26 8 34 8 L66 8 C74 8 80 10 80 18 L80 78 C80 86 74 92 66 92 L34 92 C26 92 20 86 20 78 Z"
          fill="#ffffff"
          stroke="#111111"
          strokeWidth="5"
          strokeLinejoin="round"
        />
        <rect x="25" y="14" width="50" height="72" rx="7" fill="#fef3c7" stroke="#111111" strokeWidth="2.5" />
        <rect x="40" y="10" width="20" height="9" rx="3" fill="#111111" />
        <rect x="43" y="12" width="14" height="4" rx="1.5" fill="#ffffff" />
        <line x1="33" y1="30" x2="43" y2="30" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
        <line x1="48" y1="30" x2="67" y2="30" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="33" y1="40" x2="43" y2="40" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
        <line x1="48" y1="40" x2="67" y2="40" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="50" cy="64" r="16" fill="#10b981" stroke="#111111" strokeWidth="3" />
        <path d="M42 64 L48 70 L58 58" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M78 24 Q78 30 72 30 Q78 30 78 36 Q78 30 84 30 Q78 30 78 24 Z" fill="#facc15" stroke="#111111" strokeWidth="1.5" />
        <path d="M16 68 Q16 72 12 72 Q16 72 16 76 Q16 72 20 72 Q16 72 16 68 Z" fill="#facc15" stroke="#111111" strokeWidth="1.5" />
      </svg>
    </div>
  )
}

export default function ServiceCards() {
  const containerRef = useRef(null)
  const cardsRef = useRef([])
  const mobilePinStageRef = useRef(null)
  const mobileCardsRef = useRef([])
  const mobileCardBodiesRef = useRef([])
  const [hoveredIdx, setHoveredIdx] = useState(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < DESKTOP_BREAKPOINT)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const cards = cardsRef.current.filter(Boolean)
    if (!cards.length) return

    if (isMobile) {
      cards.forEach((card) => {
        gsap.to(card, { x: 0, y: 0, rotate: 0, scale: 1, duration: 0.5, ease: 'power2.out' })
      })
      return
    }

    // Gap geometry: card 290px wide, scale 1.04 half = 150.8, scale 0.96 half = 139.2 → gap border = 150.8+139.2+15 = 305
    const CLEAR_DISTANCE = 305
    const RESTING_STEP = 160 // how far outer siblings sit from each other

    cards.forEach((card, i) => {
      const data = CARDS_DATA[i]

      if (hoveredIdx === null) {
        gsap.to(card, {
          x: data.resting.x,
          y: data.resting.y,
          rotate: data.resting.rotate,
          scale: 1,
          zIndex: data.zBase,
          duration: 0.65,
          ease: 'elastic.out(1, 0.55)',
          overwrite: 'auto',
        })
      } else if (hoveredIdx === i) {
        gsap.to(card, {
          x: data.resting.x,
          y: data.resting.y - 50,
          rotate: 0,
          scale: 1.04,
          zIndex: 100,
          duration: 0.45,
          ease: 'back.out(2)',
          overwrite: 'auto',
        })
      } else if (i < hoveredIdx) {
        const stepsLeft = (hoveredIdx - 1) - i
        const activeX = CARDS_DATA[hoveredIdx].resting.x
        const targetX = (activeX - CLEAR_DISTANCE) - (stepsLeft * RESTING_STEP)
        gsap.to(card, {
          x: targetX,
          y: data.resting.y + 8,
          rotate: data.resting.rotate * 1.1,
          scale: 0.96,
          zIndex: data.zBase,
          duration: 0.5,
          ease: 'power2.out',
          overwrite: 'auto',
        })
      } else {
        const stepsRight = i - (hoveredIdx + 1)
        const activeX = CARDS_DATA[hoveredIdx].resting.x
        const targetX = (activeX + CLEAR_DISTANCE) + (stepsRight * RESTING_STEP)
        gsap.to(card, {
          x: targetX,
          y: data.resting.y + 8,
          rotate: data.resting.rotate * 1.1,
          scale: 0.96,
          zIndex: data.zBase,
          duration: 0.5,
          ease: 'power2.out',
          overwrite: 'auto',
        })
      }
    })
  }, [hoveredIdx, isMobile])

  // Mobile/Tablet pinned scroll-stacking animation
  useEffect(() => {
    const mm = gsap.matchMedia()

    mm.add(`(max-width: ${DESKTOP_BREAKPOINT - 1}px)`, () => {
      const cards = mobileCardsRef.current.filter(Boolean)
      const cardBodies = mobileCardBodiesRef.current.filter(Boolean)
      const stage = mobilePinStageRef.current

      if (!stage || cards.length < 2) return

      // Initial state: Card 0 is resting at y: 0. Cards 1..4 start offscreen below.
      gsap.set(cards[0], { y: 0, scale: 1, autoAlpha: 1 })
      for (let i = 1; i < cards.length; i++) {
        gsap.set(cards[i], { y: window.innerHeight || 800, scale: 1, autoAlpha: 1 })
      }

      // Pin the mobile stage right where the first card sits (top 75px)
      // and do not scroll until all cards have stacked up smoothly.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: stage,
          start: 'top 75px',
          end: () => `+=${(cards.length - 1) * (window.innerHeight * 0.7)}`,
          pin: true,
          pinSpacing: true,
          scrub: 0.6,
          anticipatePin: 1,
        },
      })

      for (let i = 1; i < cards.length; i++) {
        const targetY = i * 16

        tl.to(cards[i], {
          y: targetY,
          ease: 'power1.out',
          duration: 1,
        })

        if (cardBodies[i - 1]) {
          tl.to(
            cardBodies[i - 1],
            {
              scale: 0.96,
              ease: 'power1.out',
              duration: 1,
            },
            '<'
          )
        }
      }

      return () => {
        tl.kill()
        cards.forEach((c) => gsap.set(c, { clearProps: 'all' }))
        cardBodies.forEach((b) => gsap.set(b, { clearProps: 'all' }))
      }
    })

    return () => mm.revert()
  }, [])

  const handlePointerMove = (e, index) => {
    if (isMobile) return
    const card = cardsRef.current[index]
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -6
    const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 6
    gsap.to(card, { rotateX, rotateY, transformPerspective: 1000, duration: 0.25, ease: 'power1.out' })
  }

  const handlePointerLeave = (index) => {
    if (isMobile) return
    const card = cardsRef.current[index]
    if (!card) return
    gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.5, ease: 'power2.out' })
  }

  return (
    <section
      id="design-process"
      ref={containerRef}
      className="relative w-full overflow-visible xl:overflow-hidden select-none"
    >
      <div className="mx-auto max-w-7xl flex flex-col items-center px-4 sm:px-6 md:px-10 pt-12 sm:pt-20 lg:pt-28 pb-14 sm:pb-[110px] lg:pb-[142px]">

        {/* Section heading — same spacing & style as Pricing / Works sections */}
        <div className="w-full text-center">
          <h2
            className="text-3xl sm:text-6xl md:text-7xl font-semibold tracking-[-0.06em]"
            style={{ fontFamily: '"Mdnichrometest Dark", Arial, sans-serif', color: '#111111' }}
          >
            Design Process
          </h2>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* DESKTOP: Stacked cascade of 5 cards, left-to-right with hover lift  */}
        {/* ------------------------------------------------------------------ */}
        <div
          className="relative hidden xl:flex items-end justify-center w-full mt-6"
          style={{ height: `${DESKTOP_STAGE_HEIGHT}px` }}
          onPointerLeave={() => setHoveredIdx(null)}
        >
          {CARDS_DATA.map((card, index) => (
            <div
              key={card.id}
              ref={(el) => { cardsRef.current[index] = el }}
              onPointerEnter={() => setHoveredIdx(index)}
              onPointerMove={(e) => handlePointerMove(e, index)}
              onPointerLeave={() => handlePointerLeave(index)}
              className="absolute bottom-0 will-change-transform cursor-pointer"
              style={{
                width: '290px',
                // Start each card at its resting x so GSAP can animate it from correct position
                transform: `translateX(${card.resting.x}px) translateY(${card.resting.y}px) rotate(${card.resting.rotate}deg)`,
                transformOrigin: '50% 100%',
                zIndex: card.zBase,
              }}
            >
              {/* Card body — sticker is INSIDE the card at the top so 24px gap is achievable */}
              <div
                className="relative flex flex-col rounded-[18px]"
                style={{
                  backgroundColor: card.bg,
                  color: card.text,
                  padding: '34px 28px',
                }}
              >
                {/* Sticker sits at top-right INSIDE the card, anchored absolutely */}
                <div
                  className="absolute pointer-events-none"
                  style={{ top: '-36px', right: '12px', zIndex: 30 }}
                >
                  <StickerIcon type={card.sticker} />
                </div>

                {/* 24px gap between sticker bottom and title — achieved with padding-top offset */}
                {/* The sticker overhangs -36px above the card; title starts at natural top */}
                <h3
                  className="leading-[1.1] tracking-tight"
                  style={{
                    fontFamily: 'var(--font-epilogue), sans-serif',
                    fontSize: '32px',
                    lineHeight: '36px',
                    fontWeight: 700,
                    marginTop: '24px', // 24px gap from sticker base to title
                  }}
                >
                  {card.title}
                </h3>

                {/* Divider */}
                <div
                  className="w-full"
                  style={{
                    height: '1.5px',
                    margin: '16px 0',
                    backgroundColor: 'rgba(0,0,0,0.14)',
                  }}
                />

                {/* Bullet points */}
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {card.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-[10px] whitespace-nowrap"
                      style={{
                        color: card.text,
                        fontSize: '20px',
                        lineHeight: '26px',
                        fontWeight: 500,
                      }}
                    >
                      <span style={{ color: card.bulletColor, fontSize: '14px', flexShrink: 0, marginTop: '4px' }}>✦</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                {/* Inner highlight ring */}
                <div className="pointer-events-none absolute inset-0 rounded-[18px] ring-1 ring-inset ring-white/15" />
              </div>
            </div>
          ))}
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* MOBILE / TABLET: Pinned stacking card deck                          */}
        {/* ------------------------------------------------------------------ */}
        <div
          ref={mobilePinStageRef}
          className="flex xl:hidden flex-col items-center w-full max-w-[340px] mx-auto relative mt-4 min-h-[460px]"
        >
          {CARDS_DATA.map((card, index) => {
            return (
              <div
                key={card.id}
                ref={(el) => { mobileCardsRef.current[index] = el }}
                className="absolute inset-x-0 top-0 will-change-transform"
                style={{
                  zIndex: index + 10,
                  transformOrigin: 'top center',
                }}
              >
                {/* Sticker overhangs top */}
                <div className="absolute pointer-events-none -top-7 sm:-top-9 right-3 z-30 scale-90 sm:scale-100 origin-top-right">
                  <StickerIcon type={card.sticker} />
                </div>

                <div
                  ref={(el) => { mobileCardBodiesRef.current[index] = el }}
                  className="relative flex flex-col rounded-[20px] p-6 sm:p-7 md:p-8 shadow-none border-0"
                  style={{
                    backgroundColor: card.bg,
                    color: card.text,
                    transformOrigin: 'top center',
                  }}
                >
                  <h3
                    className="leading-[1.1] tracking-tight mt-4 sm:mt-6 text-2xl sm:text-3xl font-bold"
                    style={{
                      fontFamily: 'var(--font-epilogue), sans-serif',
                    }}
                  >
                    {card.title}
                  </h3>

                  <div
                    className="w-full my-3 sm:my-4 h-[1.5px] bg-black/15"
                  />

                  <ul className="flex flex-col gap-2 sm:gap-2.5">
                    {card.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 sm:gap-2.5 text-base sm:text-lg font-medium leading-snug"
                        style={{
                          color: card.text,
                        }}
                      >
                        <span style={{ color: card.bulletColor, fontSize: '14px', flexShrink: 0, marginTop: '2px' }}>✦</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="pointer-events-none absolute inset-0 rounded-[20px] ring-1 ring-inset ring-white/15" />
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}