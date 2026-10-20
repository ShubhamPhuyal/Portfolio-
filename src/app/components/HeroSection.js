'use client'

import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'
import Matter from 'matter-js'

const TAGS = [
  { label: 'MOVING RECTANGLES', color: '#A6DFFF', icon: 'move' },
  { label: 'IMPROVING UX', color: '#FFD21A', icon: 'smile' },
  { label: 'REFRAMING PROBLEMS', color: '#59D9A7', icon: 'spark' },
  { label: 'MAKING IT POP', color: '#FF8952', icon: 'pop' },
  { label: 'THINKING SYSTEMS', color: '#F4CBE6', icon: 'nodes' },
  { label: 'PROTOTYPING', color: '#E6E6E8', icon: 'prototype' },
  { label: 'TESTING', color: '#D5C4FF', icon: 'check' },
  { label: 'ROUNDING CORNERS', color: '#D6F89D', icon: 'corners' },
  { label: 'DESIGN SYSTEMS', color: '#A6DFFF', icon: 'grid' },
  { label: 'USER FLOWS', color: '#FFD21A', icon: 'flow' },
]

// Header images from /public/header/ (spaces in filenames are URL-encoded)
const HEADER_IMAGES = [
  '/header/Frame%204.png',
  '/header/Frame%205.png',
  '/header/Frame%206.png',
  '/header/Frame%207.png',
  '/header/Frame%208.png',
]
// Time each frame is shown (ms). Lower = faster flipbook.
const HEADER_INTERVAL_MS = 300

const subscribeToClient = (callback) => {
  const frameId = window.requestAnimationFrame(callback)
  return () => window.cancelAnimationFrame(frameId)
}
const getClientSnapshot = () => true
const getServerSnapshot = () => false

const TAG_ICONS = {
  move: (
    <>
      <path d="M8 2v12M2 8h12M8 2 6 4m2-2 2 2M14 8l-2-2m2 2-2 2M8 14l-2-2m2 2 2-2M2 8l2-2m-2 2 2 2" />
    </>
  ),
  smile: (
    <>
      <circle cx="8" cy="8" r="6" />
      <path d="M5.5 9.5s.8 1.5 2.5 1.5 2.5-1.5 2.5-1.5M5.5 6.5h.01M10.5 6.5h.01" />
    </>
  ),
  spark: (
    <>
      <path d="M8 1.5 9.6 6.4 14.5 8l-4.9 1.6L8 14.5l-1.6-4.9L1.5 8l4.9-1.6L8 1.5Z" />
      <path d="m13 1 .5 1.5L15 3l-1.5.5L13 5l-.5-1.5L11 3l1.5-.5L13 1Z" />
    </>
  ),
  pop: (
    <>
      <path d="M3 12 12 3M5 3h7v7" />
      <path d="M3 7v7h7" />
    </>
  ),
  nodes: (
    <>
      <circle cx="8" cy="3" r="1.5" />
      <circle cx="3" cy="12.5" r="1.5" />
      <circle cx="13" cy="12.5" r="1.5" />
      <path d="m7.2 4.4-3.4 6.7m5 0 3.4-6.7M4.5 12.5h7" />
    </>
  ),
  prototype: (
    <>
      <path d="m3 2 9 8-4 .7L6 14 3 2Z" />
      <path d="m10 11 3 3" />
    </>
  ),
  check: (
    <>
      <circle cx="8" cy="8" r="6" />
      <path d="m5 8 2 2 4-4" />
    </>
  ),
  corners: (
    <>
      <path d="M3 13V7a4 4 0 0 1 4-4h6" />
      <path d="M5 13h8V5" />
    </>
  ),
  grid: (
    <>
      <rect x="2" y="2" width="5" height="5" rx="1" />
      <rect x="9" y="2" width="5" height="5" rx="1" />
      <rect x="2" y="9" width="5" height="5" rx="1" />
      <rect x="9" y="9" width="5" height="5" rx="1" />
    </>
  ),
  flow: (
    <>
      <circle cx="3" cy="8" r="1.5" />
      <circle cx="13" cy="3" r="1.5" />
      <circle cx="13" cy="13" r="1.5" />
      <path d="M4.5 8H8a3 3 0 0 0 3-3V3m-3 5a3 3 0 0 1 3 3v2" />
    </>
  ),
}

const TagIcon = ({ name }) => (
  <svg
    aria-hidden="true"
    className="size-5 shrink-0"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.35"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {TAG_ICONS[name]}
  </svg>
)

const HeroSection = ({ motionRef, cardRef }) => {
  // --- Old rotating word (commented out along with the h1) ---
  // const [featuredWord, setFeaturedWord] = useState('Meaningful')
  // const [isFeaturedWordVisible, setIsFeaturedWordVisible] = useState(true)

  const [activeHeaderIndex, setActiveHeaderIndex] = useState(0)
  const isStageMounted = useSyncExternalStore(
    subscribeToClient,
    getClientSnapshot,
    getServerSnapshot
  )
  const portalRoot = isStageMounted ? document.body : null
  const stageRef = useRef(null)
  const stageAnchorRef = useRef(null)
  const tagRefs = useRef([])
  const physicsTagsRef = useRef([])

  // --- Old rotating word effect (commented out along with the h1) ---
  // useEffect(() => {
  //   let transitionTimeout
  //   const wordInterval = window.setInterval(() => {
  //     setIsFeaturedWordVisible(false)
  //     transitionTimeout = window.setTimeout(() => {
  //       setFeaturedWord((word) => word === 'Meaningful' ? 'Memorable' : 'Meaningful')
  //       setIsFeaturedWordVisible(true)
  //     }, 300)
  //   }, 4000)
  //
  //   return () => {
  //     window.clearInterval(wordInterval)
  //     window.clearTimeout(transitionTimeout)
  //   }
  // }, [])

  // Header image loop (instant frame switching)
  useEffect(() => {
    const imageInterval = window.setInterval(() => {
      setActiveHeaderIndex((index) => (index + 1) % HEADER_IMAGES.length)
    }, HEADER_INTERVAL_MS)

    return () => window.clearInterval(imageInterval)
  }, [])

  useEffect(() => {
    const stage = stageRef.current
    const stageAnchor = stageAnchorRef.current
    if (!isStageMounted || !stage || !stageAnchor) return undefined

    const { Engine, World, Bodies, Body, Mouse, MouseConstraint, Events } = Matter
    const engine = Engine.create()
    engine.gravity.y = 1

    let boundaries = []
    let frameId
    let lastTime = performance.now()
    let physicsAccumulator = 0
    const physicsStep = 1000 / 60
    const maxPhysicsSteps = 6
    const physicsTags = TAGS.map((tag, index) => {
      const element = tagRefs.current[index]
      if (!element) return null

      const { width, height } = element.getBoundingClientRect()
      const stageWidth = stageAnchor.clientWidth
      const centerX = stageWidth <= width
        ? stageWidth / 2
        : Math.min(stageWidth - width / 2 - 2, Math.max(width / 2 + 2, stageWidth * (index + 0.5) / TAGS.length))
      const body = Bodies.rectangle(centerX, 108 + (index % 4) * 14, width, height, {
        restitution: 0.04,
        friction: 0.16,
        frictionAir: 0.025,
      })

      const initialAngle = [-0.12, 0.1, -0.06, 0.08, -0.1, 0.12, -0.07, 0.09][index % 8]
      const initialPosition = { x: centerX, y: 108 + (index % 4) * 14 }
      Body.setPosition(body, initialPosition)
      Body.setAngle(body, initialAngle)
      World.add(engine.world, body)

      return { body, element, width, height, initialPosition, initialAngle }
    }).filter(Boolean)

    physicsTagsRef.current = physicsTags

    const updateBoundaries = () => {
      if (boundaries.length) World.remove(engine.world, boundaries)

      const width = stageAnchor.clientWidth
      const height = stageAnchor.clientHeight
      boundaries = [
        Bodies.rectangle(width / 2, -32, width + 160, 64, { isStatic: true, restitution: 0.04 }),
        Bodies.rectangle(width / 2, height + 32, width + 160, 64, { isStatic: true }),
        Bodies.rectangle(-32, height / 2, 64, height + 160, { isStatic: true }),
        Bodies.rectangle(width + 32, height / 2, 64, height + 160, { isStatic: true }),
      ]
      World.add(engine.world, boundaries)

      physicsTags.forEach(({ body, width: tagWidth }) => {
        const safeX = width <= tagWidth
          ? width / 2
          : Math.min(width - tagWidth / 2, Math.max(tagWidth / 2, body.position.x))
        if (safeX !== body.position.x) Body.setPosition(body, { x: safeX, y: body.position.y })
      })
    }

    const surfaceDepth = 32
    let surfaceAngle = 0
    const stackSurface = Bodies.rectangle(0, 0, stageAnchor.clientWidth + 240, surfaceDepth, {
      isStatic: true,
      restitution: 0.05,
      friction: 0.16,
    })
    let surfaceWidth = stageAnchor.clientWidth + 240
    let stackSurfaceDeltaY = 0
    let frameDelta = 1000 / 60
    const maxScrollSurfaceVelocity = 8
    const touchOptions = { passive: false }
    const handleTouchMove = (event) => {
      if (mouse.button === 0) mouse.mousemove(event)
    }
    const handleTouchEnd = (event) => {
      if (mouse.button === 0) mouse.mouseup(event)
    }

    const updateStageAndSurface = () => {
      const anchorRect = stageAnchor.getBoundingClientRect()
      const cardRect = cardRef.current?.getBoundingClientRect()
      stage.style.top = `${anchorRect.top}px`
      stage.style.width = `${anchorRect.width}px`
      stage.style.height = `${anchorRect.height}px`

      if (!cardRect) return

      surfaceAngle = Math.atan2(cardRect.height * 0.015, cardRect.width)
      const surfaceTop = cardRect.top + (cardRect.height * 0.015) / 2 - anchorRect.top
      const surfaceY = surfaceTop + (surfaceDepth * Math.cos(surfaceAngle)) / 2
      stackSurfaceDeltaY = surfaceY - stackSurface.position.y
      Body.setPosition(stackSurface, {
        x: anchorRect.width / 2,
        y: surfaceY,
      })
      Body.setAngle(stackSurface, surfaceAngle)
    }

    const keepTagsAboveStack = () => {
      if (stackSurfaceDeltaY >= 0) return

      const slope = Math.tan(surfaceAngle)
      const surfaceVelocity = Math.max(
        -maxScrollSurfaceVelocity,
        stackSurfaceDeltaY * (1000 / 60) / frameDelta
      )

      physicsTags.forEach(({ body, width, height }) => {
        if (mouseConstraint.body === body) return

        const surfaceAtTag = stackSurface.position.y
          + slope * (body.position.x - stackSurface.position.x)
        const halfHeight = (
          Math.abs(Math.sin(body.angle)) * width
          + Math.abs(Math.cos(body.angle)) * height
        ) / 2
        const halfWidth = (
          Math.abs(Math.cos(body.angle)) * width
          + Math.abs(Math.sin(body.angle)) * height
        ) / 2
        const surfaceClearance = halfHeight + Math.abs(slope) * halfWidth + 2
        const maxTagY = surfaceAtTag - surfaceClearance
        const isTouchingSurface = body.position.y + halfHeight
          > surfaceAtTag - Math.abs(slope) * halfWidth

        if (isTouchingSurface) {
          Body.setPosition(body, { x: body.position.x, y: maxTagY })
          Body.setVelocity(body, {
            x: body.velocity.x,
            y: surfaceVelocity,
          })
          Body.setAngularVelocity(body, body.angularVelocity * 0.5)
        }
      })
    }

    const syncTags = () => {
      physicsTags.forEach(({ body, element, width, height }) => {
        element.style.opacity = '1'
        element.style.transform = `translate3d(${body.position.x - width / 2}px, ${body.position.y - height / 2}px, 0) rotate(${body.angle}rad)`
      })
    }

    updateBoundaries()
    World.add(engine.world, stackSurface)

    const mouse = Mouse.create(stage)
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse,
      constraint: {
        stiffness: 0.35,
        angularStiffness: 0.85,
        render: { visible: false },
      },
    })
    World.add(engine.world, mouseConstraint)

    stage.removeEventListener('mousemove', mouse.mousemove)
    stage.removeEventListener('mouseup', mouse.mouseup)
    stage.removeEventListener('wheel', mouse.mousewheel)
    stage.removeEventListener('touchmove', mouse.mousemove)
    stage.removeEventListener('touchend', mouse.mouseup)
    window.addEventListener('mousemove', mouse.mousemove)
    window.addEventListener('mouseup', mouse.mouseup)
    window.addEventListener('touchmove', handleTouchMove, touchOptions)
    window.addEventListener('touchend', handleTouchEnd, touchOptions)
    window.addEventListener('touchcancel', handleTouchEnd, touchOptions)

    const tick = (time) => {
      const delta = Math.min(time - lastTime, physicsStep * maxPhysicsSteps)
      lastTime = time
      frameDelta = delta

      const anchorRect = stageAnchor.getBoundingClientRect()
      if (anchorRect.bottom < 0 || anchorRect.top > window.innerHeight) {
        stage.style.top = `${anchorRect.top}px`
        stackSurfaceDeltaY = 0
        physicsAccumulator = 0
        frameId = requestAnimationFrame(tick)
        return
      }

      physicsAccumulator = Math.min(
        physicsAccumulator + delta,
        physicsStep * maxPhysicsSteps
      )
      engine.gravity.y = 1
      updateStageAndSurface()
      keepTagsAboveStack()
      while (physicsAccumulator >= physicsStep) {
        Engine.update(engine, physicsStep)
        physicsAccumulator -= physicsStep
      }
      syncTags()
      frameId = requestAnimationFrame(tick)
    }

    frameId = requestAnimationFrame(tick)
    const handleResize = () => {
      updateBoundaries()
      const nextSurfaceWidth = stageAnchor.clientWidth + 240
      Body.scale(stackSurface, nextSurfaceWidth / surfaceWidth, 1)
      surfaceWidth = nextSurfaceWidth
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', mouse.mousemove)
      window.removeEventListener('mouseup', mouse.mouseup)
      window.removeEventListener('touchmove', handleTouchMove, touchOptions)
      window.removeEventListener('touchend', handleTouchEnd, touchOptions)
      window.removeEventListener('touchcancel', handleTouchEnd, touchOptions)
      stage.removeEventListener('wheel', mouse.mousewheel)
      Mouse.clearSourceEvents(mouse)
      World.clear(engine.world, false)
      Engine.clear(engine)
      physicsTagsRef.current = []
    }
  }, [cardRef, isStageMounted])

  const moveTagWithKeyboard = (event, index) => {
    const directions = {
      ArrowLeft: [-4, 0],
      ArrowRight: [4, 0],
      ArrowUp: [0, -4],
      ArrowDown: [0, 4],
    }
    const direction = directions[event.key]
    const physicsTag = physicsTagsRef.current[index]
    if (!direction || !physicsTag) return

    event.preventDefault()
    const { Body } = Matter
    Body.setVelocity(physicsTag.body, {
      x: physicsTag.body.velocity.x + direction[0],
      y: physicsTag.body.velocity.y + direction[1],
    })
  }

  return (
    <>
      <main
        ref={motionRef}
        className="relative flex min-h-0 flex-1 flex-col items-center px-4 pt-8 sm:pt-10"
        style={{ transform: 'translate3d(0, var(--hero-y, 0), 0)', willChange: 'transform' }}
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 -top-20 bottom-0 z-0 overflow-hidden sm:-top-24">
          <div
            className="absolute inset-x-0 bottom-0 top-10"
            style={{
              backgroundImage: 'linear-gradient(rgba(23,23,23,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(23,23,23,0.05) 1px, transparent 1px)',
              backgroundSize: '80px 80px',
            }}
          />
        </div>
        <div className="relative z-10 flex flex-col items-center text-center">
          <p className="flex items-center gap-2 text-base text-zinc-500">
            Hello

            I&apos;m
          </p>

          {/*
          <h1
            className="mt-4 max-w-5xl text-[32px] leading-[1.05] font-semibold tracking-[-0.04em] text-[#111111] sm:mt-5 sm:text-[80px] sm:leading-[1] sm:tracking-[-1px]"
            style={{ fontFamily: '"Mdnichrometest", Arial, sans-serif' }}
          >
            I&apos;m a Product &amp; Visual
            <br />
            designer crafting <span
              className={`inline-block text-[#ff5500] transition-[opacity,transform] duration-300 ease-in-out motion-reduce:transition-none ${isFeaturedWordVisible ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0'}`}
              style={{ fontFamily: '"Flux Variable", sans-serif' }}
            >{featuredWord}</span> experiences.
          </h1>
          */}

          {/* Looping image header: all frames stacked in one grid cell, instantly swapped (no transition) */}
          <div
            role="img"
            aria-label="Shubham, Product and Visual designer"
            className="mt-4 grid w-full max-w-5xl place-items-center sm:mt-5"
          >
            {HEADER_IMAGES.map((src, index) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={src}
                src={src}
                alt=""
                draggable={false}
                loading="eager"
                className={`col-start-1 row-start-1 h-auto max-h-[200px] w-full select-none object-contain sm:max-h-[320px] ${index === activeHeaderIndex ? 'opacity-100' : 'opacity-0'
                  }`}
              />
            ))}
          </div>

          {<p className="mt-2 max-w-md text-base leading-[1.55] text-zinc-500">
            Currently designing <strong className="font-semibold text-zinc-700">complex B2B workflows</strong>
            <br className="hidden sm:block" /> and a <strong className="font-semibold text-zinc-700">multi-brand design system</strong>
          </p>}
        </div>

        <div
          ref={stageAnchorRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-20 bottom-0 w-full sm:-top-24"
        />
      </main>
      {portalRoot && createPortal(
        <div
          ref={stageRef}
          aria-label="Interactive design principles. Drag a label or focus it and use the arrow keys."
          className="pointer-events-none fixed left-0 top-0 z-30 w-full touch-none overflow-visible"
        >
          {TAGS.map((tag, index) => (
            <button
              key={tag.label}
              ref={(element) => { tagRefs.current[index] = element }}
              type="button"
              aria-label={`${tag.label}. Use the arrow keys to move.`}
              onKeyDown={(event) => moveTagWithKeyboard(event, index)}
              className="pointer-events-auto absolute left-0 top-0 flex h-13.5 touch-none select-none items-center gap-3 whitespace-nowrap rounded-full px-5 font-mono text-base font-medium text-[#151515] opacity-0 shadow-[0_1px_2px_rgba(0,0,0,0.04)] outline-none focus-visible:ring-2 focus-visible:ring-black/60"
              style={{ backgroundColor: tag.color, cursor: 'grab', willChange: 'transform' }}
            >
              <span>{tag.label}</span>
              <TagIcon name={tag.icon} />
            </button>
          ))}
        </div>,
        portalRoot
      )}
    </>
  )
}

export default HeroSection