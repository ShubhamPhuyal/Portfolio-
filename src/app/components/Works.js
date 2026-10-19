'use client'

/**
 * Featured works: pinned, scroll-driven carousel.
 *
 * npm i gsap
 *
 * - GSAP ScrollTrigger pins the panel and maps vertical scroll to the track's x.
 * - Cards are depth-styled (scale / opacity / rotateY / z) from the track's real progress.
 * - The active card gets: magnetic pull, spring-smoothed 3D tilt, parallax labels,
 *   a WebGL liquid displacement (one shared canvas, moved onto the active card),
 *   and a "View project" cursor.
 * - All pointer motion runs in one rAF loop that writes straight to the DOM:
 *   no React state, no re-renders on pointermove.
 * - Reduced motion: no pin, no effects, a plain scroll-snap row.
 * - Touch / coarse pointer: scroll-driven carousel only, no pointer effects.
 */

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import NextImage from 'next/image'

const WORKS = [
  { name: 'PROJECT ONE', category: 'PRODUCT DESIGN', mark: '1', markColor: '#f6d6e7', image: '/nestsms.png', href: '#' },
  { name: 'PROJECT TWO', category: 'BRAND IDENTITY', mark: '2', markColor: '#315eea', image: '/nestsms.png', href: '#' },
  { name: 'PROJECT THREE', category: 'DIGITAL EXPERIENCE', mark: '3', markColor: '#ff6a3d', image: '/nestsms.png', href: '#' },
  { name: 'PROJECT FOUR', category: 'PRODUCT DESIGN', mark: '4', markColor: '#6941c6', image: '/nestsms.png', href: '#' },
  { name: 'PROJECT FIVE', category: 'BRAND IDENTITY', mark: '5', markColor: '#197b5b', image: '/nestsms.png', href: '#' },
  { name: 'PROJECT SIX', category: 'DIGITAL EXPERIENCE', mark: '6', markColor: '#d73d2e', image: '/nestsms.png', href: '#' },
]

const clamp = (v, a, b) => Math.min(b, Math.max(a, v))
const PREVIEW_ASPECT_RATIO = 1902 / 864

/* ------------------------------------------------------------------ */
/* Textures                                                            */
/* ------------------------------------------------------------------ */

const loadSource = (work) =>
  new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = work.image
  })

/* ------------------------------------------------------------------ */
/* WebGL liquid renderer (single context, no dependencies)             */
/* ------------------------------------------------------------------ */

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main(){
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`

const FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
varying vec2 vUv;
uniform sampler2D uTex;
uniform vec2 uMouse;   // 0..1, y up
uniform vec2 uVel;     // smoothed pointer velocity, uv units
uniform float uHover;  // 0..1
uniform float uTime;
uniform vec2 uScale;   // object-fit: cover
uniform float uAspect; // canvas width / height

void main(){
  vec2 uv = vUv;
  vec2 d = uv - uMouse;
  d.x *= uAspect;
  float dist = length(d);
  float falloff = 1.0 - smoothstep(0.0, 0.55, dist);
  falloff *= falloff;
  float speed = length(uVel);

  // image is dragged along the direction of travel
  vec2 drag = uVel * falloff;

  // soft radial swell under the cursor, grows with speed
  vec2 dir = d / (dist + 0.0001);
  vec2 swell = dir * falloff * (0.008 + speed * 0.5);
  swell.x /= uAspect;

  // slow liquid ripple, only near the cursor
  vec2 wob = vec2(
    sin(uv.y * 14.0 + uTime * 1.8),
    cos(uv.x * 12.0 - uTime * 1.5)
  ) * 0.0035 * falloff * (0.4 + speed * 10.0);

  vec2 off = (drag + swell + wob) * uHover;
  vec2 st = (uv - off - 0.5) * uScale + 0.5;

  // tiny chromatic split on fast movement
  float ca = speed * falloff * uHover * 0.25;
  vec3 col;
  col.r = texture2D(uTex, st + vec2(ca, 0.0)).r;
  col.g = texture2D(uTex, st).g;
  col.b = texture2D(uTex, st - vec2(ca, 0.0)).b;
  gl_FragColor = vec4(col, 1.0);
}`

function createLiquid(canvas) {
  const gl = canvas.getContext('webgl', {
    alpha: false,
    antialias: false,
    powerPreference: 'low-power',
  })
  if (!gl) return null

  const compile = (type, src) => {
    const s = gl.createShader(type)
    if (!s) return null

    gl.shaderSource(s, src)
    gl.compileShader(s)
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.warn(gl.getShaderInfoLog(s))
      gl.deleteShader(s)
      return null
    }
    return s
  }
  const vs = compile(gl.VERTEX_SHADER, VERT)
  const fs = compile(gl.FRAGMENT_SHADER, FRAG)
  if (!vs || !fs) {
    if (vs) gl.deleteShader(vs)
    if (fs) gl.deleteShader(fs)
    return null
  }

  const prog = gl.createProgram()
  if (!prog) {
    gl.deleteShader(vs)
    gl.deleteShader(fs)
    return null
  }
  gl.attachShader(prog, vs)
  gl.attachShader(prog, fs)
  gl.linkProgram(prog)
  gl.deleteShader(vs)
  gl.deleteShader(fs)
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.warn(gl.getProgramInfoLog(prog))
    gl.deleteProgram(prog)
    return null
  }
  gl.useProgram(prog)

  const buffer = gl.createBuffer()
  if (!buffer) {
    gl.deleteProgram(prog)
    return null
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
  const loc = gl.getAttribLocation(prog, 'aPos')
  if (loc < 0) {
    gl.deleteBuffer(buffer)
    gl.deleteProgram(prog)
    return null
  }
  gl.enableVertexAttribArray(loc)
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

  const U = {}
  ;['uTex', 'uMouse', 'uVel', 'uHover', 'uTime', 'uScale', 'uAspect'].forEach((n) => {
    U[n] = gl.getUniformLocation(prog, n)
  })
  gl.uniform1i(U.uTex, 0)

  return {
    makeTexture(source) {
      const tex = gl.createTexture()
      gl.bindTexture(gl.TEXTURE_2D, tex)
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
      const w = source.naturalWidth || source.width
      const h = source.naturalHeight || source.height
      return { tex, ratio: w / h }
    },
    draw(t, s) {
      const aspect = canvas.width / canvas.height
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.bindTexture(gl.TEXTURE_2D, t.tex)
      gl.uniform2f(U.uMouse, s.mx, s.my)
      gl.uniform2f(U.uVel, s.vx, s.vy)
      gl.uniform1f(U.uHover, s.hover)
      gl.uniform1f(U.uTime, s.time)
      gl.uniform1f(U.uAspect, aspect)
      if (aspect > t.ratio) gl.uniform2f(U.uScale, 1, t.ratio / aspect)
      else gl.uniform2f(U.uScale, aspect / t.ratio, 1)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    },
    dispose() {
      gl.deleteBuffer(buffer)
      gl.deleteProgram(prog)
    },
  }
}

/* ------------------------------------------------------------------ */
/* Small damped-spring helper                                          */
/* ------------------------------------------------------------------ */

const makeSpring = () => ({ v: 0, vel: 0 })
const step = (s, target, dt, k = 140, c = 15) => {
  s.vel += ((target - s.v) * k - s.vel * c) * dt
  s.v += s.vel * dt
}

/* ------------------------------------------------------------------ */

const ArrowIcon = () => (
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
    <path d="M7 17 17 7M7 7h10v10" />
  </svg>
)

const Works = () => {
  const sectionRef = useRef(null)
  const panelRef = useRef(null)
  const viewportRef = useRef(null)
  const trackRef = useRef(null)
  const cardRefs = useRef([])

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const panel = panelRef.current
    const viewport = viewportRef.current
    const track = trackRef.current
    const cards = cardRefs.current.filter(Boolean)
    const n = cards.length
    if (!panel || !viewport || !track || n < 2) return

    const parts = cards.map((card) => ({
      card,
      tilt: card.querySelector('[data-tilt]'),
      media: card.querySelector('[data-media]'),
    }))

    const mm = gsap.matchMedia()

    mm.add(
      {
        motion: '(prefers-reduced-motion: no-preference)',
        fine: '(hover: hover) and (pointer: fine)',
      },
      (ctx) => {
        const { motion, fine } = ctx.conditions

        // Reduced motion: leave the native scroll-snap row alone.
        if (!motion) {
          viewport.dataset.mode = 'native'
          return
        }
        viewport.dataset.mode = 'pinned'

        /* ---------------- scroll-driven carousel ---------------- */

        let active = -1
        let cur = null // parts[active]

        const xFor = (i) =>
          viewport.clientWidth / 2 - (cards[i].offsetLeft + cards[i].offsetWidth / 2)

        let scrollJiggle = 0
        const applyDepth = (p, impulse = 0) => {
          cards.forEach((card, i) => {
            const d = i - p
            const a = Math.min(Math.abs(d), 1.6)
            const scale = 1 - a * 0.14
            const rotY = clamp(-d * 14, -22, 22)
            const phase = p * 10 + i * 2.1
            const wobble = Math.sin(phase) * impulse
            card.style.transform = `perspective(1400px) translate3d(0,${wobble * 2}px,${-a * 80}px) rotateY(${rotY}deg) rotateZ(${wobble * 0.8}deg) scale(${scale})`
            card.style.opacity = String(1 - Math.min(a, 1.5) * 0.38)
            card.style.filter = `blur(${a * 0.65}px)`
            card.style.zIndex = String(Math.round(10 - a * 4))
          })
          setActive(clamp(Math.round(p), 0, n - 1))
        }

        const progress = { value: 0 }
        let st = null
        let previousProgress = 0
        const updateCarousel = () => {
          const position = progress.value * (n - 1)
          const delta = progress.value - previousProgress
          previousProgress = progress.value
          scrollJiggle = Math.max(scrollJiggle, clamp(Math.abs(delta) * 140, 0, 1))
          const x = gsap.utils.interpolate(xFor(0), xFor(n - 1), progress.value)
          track.style.transform = `translate3d(${x}px, 0, 0)`
          applyDepth(position, scrollJiggle)
          if (fine) wake()
        }

        const goTo = (i) => {
          if (!st) return
          const idx = clamp(i, 0, n - 1)
          const y = st.start + (st.end - st.start) * (idx / (n - 1))
          window.scrollTo({ top: y, behavior: 'smooth' })
        }

        // Click a neighbour to bring it to the centre; click the centre card to follow its link.
        const onTrackClick = (e) => {
          const card = e.target.closest('[data-card]')
          if (!card) return
          const i = cards.indexOf(card)
          if (i !== active) {
            e.preventDefault()
            goTo(i)
          }
        }
        track.addEventListener('click', onTrackClick)

        // Keyboard: focusing a card centres it; arrows step while pinned.
        const onFocusIn = (e) => {
          const card = e.target.closest('[data-card]')
          if (!card) return
          const i = cards.indexOf(card)
          if (i !== active) goTo(i)
        }
        track.addEventListener('focusin', onFocusIn)

        const onKey = (e) => {
          if (!st?.isActive) return
          const t = e.target
          if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return
          if (e.key === 'ArrowRight') {
            e.preventDefault()
            goTo(active + 1)
          } else if (e.key === 'ArrowLeft') {
            e.preventDefault()
            goTo(active - 1)
          }
        }
        window.addEventListener('keydown', onKey)

        // Re-measure when fonts / images change the track width.
        let roTimer
        const ro = new ResizeObserver(() => {
          clearTimeout(roTimer)
          roTimer = setTimeout(() => ScrollTrigger.refresh(), 120)
        })
        ro.observe(track)

        /* ---------------- pointer-driven effects (fine pointers only) ---------------- */

        let canvas = null
        let liquid = null
        let cursor = null
        let raf = 0
        let last = 0
        let tex = null
        const texCache = []

        const rotX = makeSpring()
        const rotY = makeSpring()
        const magX = makeSpring()
        const magY = makeSpring()
        const mx = makeSpring()
        const my = makeSpring()
        const cx = makeSpring()
        const cy = makeSpring()
        const cs = makeSpring()
        const springs = [rotX, rotY, magX, magY, mx, my, cx, cy, cs]
        let hover = 0
        let vx = 0
        let vy = 0
        const ptr = { inside: false, down: false, nx: 0, ny: 0, u: 0.5, v: 0.5, x: 0, y: 0 }

        const clearPaint = () => {
          if (!cur) return
          cur.tilt.style.transform = ''
          cur.media.style.removeProperty('--sx')
          cur.media.style.removeProperty('--sy')
          cur.media.style.removeProperty('--shine')
          if (canvas) canvas.style.opacity = '0'
          if (cursor) {
            cursor.style.opacity = '0'
            cursor.style.transform = 'translate3d(0,0,0) scale(0)'
          }
        }

        const resizeCanvas = () => {
          if (!canvas || !cur) return
          const dpr = Math.min(window.devicePixelRatio || 1, 2)
          canvas.width = Math.max(2, Math.round(cur.media.clientWidth * dpr))
          canvas.height = Math.max(2, Math.round(cur.media.clientHeight * dpr))
        }

        const getTex = (i) => {
          if (!liquid) return Promise.resolve(null)
          texCache[i] ??= loadSource(WORKS[i])
            .then((src) => liquid.makeTexture(src))
            .catch(() => null)
          return texCache[i]
        }

        const paint = (now, dt) => {
          const inside = ptr.inside
          scrollJiggle *= Math.exp(-dt * 4)
          const targetHover = inside ? 1 : scrollJiggle

          step(rotY, inside ? ptr.nx * 7 : 0, dt)
          step(rotX, inside ? -ptr.ny * 7 : 0, dt)
          step(magX, inside ? ptr.nx * 12 : 0, dt, 120, 14)
          step(magY, inside ? ptr.ny * 9 : 0, dt, 120, 14)
          hover += (targetHover - hover) * Math.min(1, dt * (inside ? 6 : 4))

          step(mx, inside ? ptr.u : 0.5, dt, 90, 11)
          step(my, inside ? ptr.v : 0.5, dt, 90, 11)
          let tx = mx.vel * 0.03
          let ty = my.vel * 0.03
          const len = Math.hypot(tx, ty)
          if (len > 0.07) {
            tx *= 0.07 / len
            ty *= 0.07 / len
          }
          const k = Math.min(1, dt * 12)
          vx += (tx - vx) * k
          vy += (ty - vy) * k

          const { tilt, media } = cur
          tilt.style.transform = `translate3d(${magX.v}px, ${magY.v}px, 0) perspective(900px) rotateX(${rotX.v}deg) rotateY(${rotY.v}deg)`
          media.style.setProperty('--sx', `${(mx.v * 100).toFixed(1)}%`)
          media.style.setProperty('--sy', `${((1 - my.v) * 100).toFixed(1)}%`)
          media.style.setProperty('--shine', hover.toFixed(3))

          if (canvas && liquid && tex) {
            if (hover > 0.002) {
              liquid.draw(tex, { mx: mx.v, my: my.v, vx, vy, hover, time: (now / 1000) % 1000 })
              canvas.style.opacity = '1'
            } else {
              canvas.style.opacity = '0'
            }
          }

          if (cursor) {
            step(cx, ptr.x, dt, 300, 28)
            step(cy, ptr.y, dt, 300, 28)
            step(cs, inside ? (ptr.down ? 0.88 : 1) : 0, dt, 220, 22)
            const s = Math.max(0, cs.v)
            cursor.style.transform = `translate3d(${cx.v}px, ${cy.v}px, 0) scale(${s})`
            cursor.style.opacity = String(Math.min(1, s * 1.4))
          }
        }

        const tick = (now) => {
          const dt = Math.min((now - last) / 1000, 1 / 30) || 1 / 60
          last = now
          if (!cur) {
            raf = 0
            return
          }
          paint(now, dt)

          const energy = springs.reduce((a, s) => a + Math.abs(s.vel) * 0.01 + Math.abs(s.v) * 0, 0)
          const offsets = Math.abs(rotX.v) + Math.abs(rotY.v) + Math.abs(magX.v) + Math.abs(magY.v)
          const settled =
            !ptr.inside && scrollJiggle < 0.003 && hover < 0.003 && energy < 0.02 && offsets < 0.02 && cs.v < 0.003
          if (settled) {
            springs.forEach((s) => {
              s.vel = 0
            })
            hover = 0
            clearPaint()
            raf = 0
            return
          }
          raf = requestAnimationFrame(tick)
        }

        const wake = () => {
          if (raf) return
          last = performance.now()
          raf = requestAnimationFrame(tick)
        }

        const bind = (i) => {
          if (cur) {
            cancelAnimationFrame(raf)
            raf = 0
            cur.card.style.cursor = ''
            clearPaint()
          }
          cur = parts[i]
          tex = null
          ptr.inside = false
          hover = 0
          vx = 0
          vy = 0
          springs.forEach((s) => {
            s.v = 0
            s.vel = 0
          })
          if (!fine) return
          cur.card.style.cursor = 'none'
          if (canvas) {
            cur.media.appendChild(canvas)
            resizeCanvas()
          }
          getTex(i).then((t) => {
            if (cur === parts[i]) tex = t
          })
        }

        function setActive(i) {
          if (i === active) return
          active = i
          cards.forEach((card, k) => {
            card.dataset.active = k === i ? 'true' : 'false'
            if (k === i) card.setAttribute('aria-current', 'true')
            else card.removeAttribute('aria-current')
          })
          bind(i)
        }

        let cleanupPointer = () => {}

        if (fine) {
          canvas = document.createElement('canvas')
          canvas.setAttribute('aria-hidden', 'true')
          Object.assign(canvas.style, {
            position: 'absolute',
            inset: '0',
            width: '100%',
            height: '100%',
            zIndex: '1',
            pointerEvents: 'none',
            opacity: '0',
          })
          liquid = createLiquid(canvas)

          cursor = document.createElement('div')
          cursor.setAttribute('aria-hidden', 'true')
          cursor.textContent = 'View project'
          Object.assign(cursor.style, {
            position: 'fixed',
            left: '0',
            top: '0',
            width: '96px',
            height: '96px',
            marginLeft: '-48px',
            marginTop: '-48px',
            borderRadius: '9999px',
            background: '#ff5500',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            fontSize: '12px',
            fontWeight: '700',
            lineHeight: '1.15',
            letterSpacing: '-0.01em',
            padding: '0 14px',
            pointerEvents: 'none',
            userSelect: 'none',
            zIndex: '60',
            opacity: '0',
            transform: 'translate3d(0,0,0) scale(0)',
            willChange: 'transform, opacity',
          })
          document.body.appendChild(cursor)

          const onMove = (e) => {
            if (e.pointerType === 'touch') return
            const hoveredCard = e.target.closest('[data-card]')
            const hoveredIndex = cards.indexOf(hoveredCard)
            if (hoveredIndex >= 0 && cur !== parts[hoveredIndex]) bind(hoveredIndex)
            if (!cur) return

            const r = cur.card.getBoundingClientRect()
            const inside =
              e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom
            ptr.x = e.clientX
            ptr.y = e.clientY
            if (inside) {
              ptr.nx = ((e.clientX - r.left) / r.width) * 2 - 1
              ptr.ny = ((e.clientY - r.top) / r.height) * 2 - 1
              const mediaBounds = cur.media.getBoundingClientRect()
              ptr.u = clamp((e.clientX - mediaBounds.left) / mediaBounds.width, 0, 1)
              ptr.v = 1 - clamp((e.clientY - mediaBounds.top) / mediaBounds.height, 0, 1)
              if (!ptr.inside) {
                // Start the springs at the entry point so nothing launches from a stale spot.
                if (hover < 0.05) {
                  mx.v = ptr.u
                  my.v = ptr.v
                  mx.vel = 0
                  my.vel = 0
                  vx = 0
                  vy = 0
                }
                if (cs.v < 0.05) {
                  cx.v = e.clientX
                  cy.v = e.clientY
                  cx.vel = 0
                  cy.vel = 0
                }
              }
            }
            ptr.inside = inside
            wake()
          }
          const onLeave = () => {
            ptr.inside = false
            wake()
          }
          const onDown = () => {
            ptr.down = true
            wake()
          }
          const onUp = () => {
            ptr.down = false
            wake()
          }
          const rc = new ResizeObserver(resizeCanvas)
          rc.observe(viewport)

          viewport.addEventListener('pointermove', onMove)
          viewport.addEventListener('pointerleave', onLeave)
          viewport.addEventListener('pointerdown', onDown)
          window.addEventListener('pointerup', onUp)

          cleanupPointer = () => {
            viewport.removeEventListener('pointermove', onMove)
            viewport.removeEventListener('pointerleave', onLeave)
            viewport.removeEventListener('pointerdown', onDown)
            window.removeEventListener('pointerup', onUp)
            rc.disconnect()
            canvas.remove()
            cursor.remove()
            liquid?.dispose()
          }
        }

        const tween = gsap.fromTo(
          progress,
          { value: 0 },
          {
            value: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: panel,
              pin: true,
              start: 'top top',
              end: () => `+=${(n - 1) * window.innerHeight * 0.85}`,
              scrub: 0.6,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              snap: {
                snapTo: 1 / (n - 1),
                duration: { min: 0.25, max: 0.7 },
                delay: 0.12,
                ease: 'power2.inOut',
              },
            },
            onUpdate: updateCarousel,
          },
        )
        st = tween.scrollTrigger
        updateCarousel()

        return () => {
          cancelAnimationFrame(raf)
          cleanupPointer()
          clearTimeout(roTimer)
          ro.disconnect()
          track.removeEventListener('click', onTrackClick)
          track.removeEventListener('focusin', onFocusIn)
          window.removeEventListener('keydown', onKey)
          if (cur) {
            cur.card.style.cursor = ''
            clearPaint()
          }
          cards.forEach((card) => {
            card.style.transform = ''
            card.style.opacity = ''
            card.style.filter = ''
            card.style.zIndex = ''
            card.removeAttribute('data-active')
            card.removeAttribute('aria-current')
          })
          track.style.transform = ''
          viewport.dataset.mode = 'native'
        }
      },
    )

    return () => mm.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="work"
      aria-labelledby="works-heading"
      className="bg-[#f7eee7]"
    >
      <div
        ref={panelRef}
        className="flex h-svh flex-col justify-center overflow-hidden bg-[#f7eee7] pt-24 pb-8 sm:pt-28"
      >
        <div className="mx-auto mb-2 flex w-full max-w-360 justify-center px-4 text-center sm:px-6 lg:px-8">
          <h2
            id="works-heading"
            className="text-4xl font-semibold tracking-[-0.06em] text-[#111111] sm:text-6xl"
            style={{ fontFamily: '"Mdnichrometest Dark", Arial, sans-serif' }}
          >
            Featured works
          </h2>
        </div>

        <div
          ref={viewportRef}
          data-mode="native"
          className="w-full snap-x snap-mandatory overflow-x-auto py-8 data-[mode=pinned]:snap-none data-[mode=pinned]:overflow-hidden"
        >
          <div
            ref={trackRef}
            className="relative flex w-max items-start gap-[90px] px-4 will-change-transform sm:px-6 lg:px-8"
          >
            {WORKS.map((work, index) => (
              <article
                key={work.name}
                data-card
                data-active={index === 0 ? 'true' : 'false'}
                ref={(element) => {
                  cardRefs.current[index] = element
                }}
                className="group/card shrink-0 snap-center [container-type:inline-size] [--card-vw:78vw] sm:[--card-vw:56vw] lg:[--card-vw:46vw]"
                style={{
                  width: `calc(max(240px, min(var(--card-vw), calc((100svh - 19rem) * ${PREVIEW_ASPECT_RATIO} - 20px), 860px)) + 20px)`,
                }}
              >
                <a
                  href={work.href}
                  aria-label={`${work.name}, ${work.category}`}
                  className="block outline-offset-8 focus-visible:outline-2 focus-visible:outline-[#ff5500]"
                >
                  <div data-tilt className="will-change-transform">
                    <div
                      data-media
                      className="relative w-full overflow-hidden [container-type:inline-size]"
                      style={{
                        aspectRatio: PREVIEW_ASPECT_RATIO,
                        backgroundColor: work.markColor,
                      }}
                    >
                        <div aria-hidden="true" className="absolute inset-0 z-0">
                          <NextImage
                            src={work.image}
                            alt=""
                            fill
                            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 60vw, 50vw"
                            draggable={false}
                            className="size-full object-contain"
                          />
                        </div>

                        {/* light that follows the pointer */}
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-0 z-[2] bg-[radial-gradient(circle_at_var(--sx,50%)_var(--sy,50%),rgba(255,255,255,0.22),transparent_55%)]"
                          style={{ opacity: 'var(--shine, 0)' }}
                        />
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-3 sm:mt-5">
                    <span
                      aria-hidden="true"
                      className="flex size-10 shrink-0 items-center justify-center overflow-visible rounded-full text-base font-bold leading-none text-white sm:size-12 sm:text-lg"
                      style={{ backgroundColor: work.markColor }}
                    >
                      {work.mark}
                    </span>
                    <div className="min-w-0">
                      <h3 className="truncate text-base font-bold tracking-[-0.04em] text-[#111111] sm:text-lg">
                        {work.name}
                      </h3>
                      <p className="mt-0.5 text-xs font-semibold text-[#ff5500] sm:text-sm">
                        {work.category}
                      </p>
                    </div>
                    <span
                      aria-hidden="true"
                      className="ml-auto flex size-9 shrink-0 items-center justify-center rounded-full bg-[#ff5500] text-white sm:size-10"
                    >
                      <ArrowIcon />
                    </span>
                  </div>
                </a>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Works