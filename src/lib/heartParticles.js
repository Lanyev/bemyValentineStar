/**
 * Motor de partículas: corazones con física (Matter.js).
 * Rebotes en bordes de pantalla y entre partículas. Canvas 2D para dibujar.
 */

import Matter from 'matter-js'

const { Engine, World, Bodies, Body } = Matter

// --- CONFIGURACIÓN CENTRAL ---
const SETTINGS = {
  density: 0.6,
  speed: 0.35,
  glowIntensity: 0.85,
  silhouetteRatio: 0.25,
  breakpoints: {
    mobile: { density: 0.55, maxParticles: 380 },
    tablet: { density: 0.6, maxParticles: 480 },
    desktop: { density: 0.7, maxParticles: 580 },
  },
  windTouchRadius: 120,
  windTouchStrength: 0.012,
  windDecay: 0.92,
  wallThickness: 40,
  restitution: 0.65,
  friction: 0.01,
  frictionAir: 0.001,
  driftForce: 0.00018,
}

const LAYER_NEAR = 0
const LAYER_MID = 1
const LAYER_FAR = 2

const LAYER_CONFIG = [
  { scale: 1.8, speedMul: 1.4, blur: 4, silhouetteChance: 0.5 },
  { scale: 1, speedMul: 1, blur: 0, silhouetteChance: 0.1 },
  { scale: 0.5, speedMul: 0.6, blur: 0, silhouetteChance: 0 },
]

// Path2D del corazón (normalizado -1..1)
function createHeartPath() {
  const p = new Path2D()
  p.moveTo(0, 1)
  p.bezierCurveTo(-0.6, 1, -1, 0.2, -1, -0.4)
  p.bezierCurveTo(-1, -0.8, -0.5, -1, 0, -0.6)
  p.bezierCurveTo(0.5, -1, 1, -0.8, 1, -0.4)
  p.bezierCurveTo(1, 0.2, 0.6, 1, 0, 1)
  p.closePath()
  return p
}

let heartPath = null
function getHeartPath() {
  if (!heartPath) heartPath = createHeartPath()
  return heartPath
}

function getBreakpoint(width) {
  if (width < 600) return SETTINGS.breakpoints.mobile
  if (width < 900) return SETTINGS.breakpoints.tablet
  return SETTINGS.breakpoints.desktop
}

function getParticleCount(w, h) {
  const bp = getBreakpoint(w)
  const minCount = w < 600 ? 45 : 20
  const byArea = Math.floor((w * h / 10000) * bp.density)
  return Math.min(bp.maxParticles, Math.max(minCount, byArea))
}

// Paredes estáticas para que los corazones reboten
function createWalls(w, h) {
  const t = SETTINGS.wallThickness
  const half = t / 2
  return [
    Bodies.rectangle(-half, h / 2, t, h + t * 2, { isStatic: true, label: 'wall' }),
    Bodies.rectangle(w + half, h / 2, t, h + t * 2, { isStatic: true, label: 'wall' }),
    Bodies.rectangle(w / 2, -half, w + t * 2, t, { isStatic: true, label: 'wall' }),
    Bodies.rectangle(w / 2, h + half, w + t * 2, t, { isStatic: true, label: 'wall' }),
  ]
}

// Cuerpos circulares para física; guardamos en body.heartConfig los datos de dibujo
function createHeartBodies(w, h, count, reducedMotion, fillScreen) {
  const near = Math.floor(count * 0.25)
  const mid = Math.floor(count * 0.45)
  const speed = SETTINGS.speed
  const bodies = []
  for (let i = 0; i < count; i++) {
    const layer = i < near ? LAYER_NEAR : i < near + mid ? LAYER_MID : LAYER_FAR
    const cfg = LAYER_CONFIG[layer]
    const isSilhouette = Math.random() < cfg.silhouetteChance
    const baseSize = (8 + Math.random() * 14) * cfg.scale
    const radius = Math.max(4, baseSize * 0.6)
    let x = Math.random() * (w - 40) + 20
    let y = fillScreen ? Math.random() * (h + 80) - 40 : h + 30 + Math.random() * 60
    const v = (reducedMotion ? 25 : 65) * cfg.speedMul * (0.8 + Math.random() * 0.4)
    const angle = Math.random() * Math.PI * 2
    const vx = Math.cos(angle) * (20 + Math.random() * 30)
    const vy = -v + (Math.random() - 0.5) * 40
    const body = Bodies.circle(x, y, radius, {
      restitution: SETTINGS.restitution,
      friction: SETTINGS.friction,
      frictionAir: SETTINGS.frictionAir,
      density: 0.002,
      label: 'heart',
      velocity: { x: vx, y: vy },
    })
    body.heartConfig = {
      layer,
      type: isSilhouette ? 'silhouette' : 'bright',
      baseSize,
      baseOpacity: isSilhouette ? 0.5 + Math.random() * 0.3 : 0.4 + Math.random() * 0.5,
      blur: cfg.blur,
      phase: Math.random() * Math.PI * 2,
      phaseSpeed: 0.02 + Math.random() * 0.03,
      driftAngle: Math.random() * Math.PI * 2,
    }
    bodies.push(body)
  }
  return bodies
}

let rafId = null
let windX = 0
let windY = 0
let pointerX = -1e4
let pointerY = -1e4
let lastPointerX = -1e4
let lastPointerY = -1e4
let visibilityHidden = false
let reducedMotion = false
let enabled = true

function init(canvas, options = {}) {
  if (!canvas || !canvas.getContext) return

  reducedMotion = options.reducedMotion ?? (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  enabled = options.enabled !== false
  const frontCanvas = options.frontCanvas || null

  const ctx = canvas.getContext('2d', { alpha: true })
  const ctxFront = frontCanvas ? frontCanvas.getContext('2d', { alpha: true }) : null
  const dpr = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, 2)

  let width = 0
  let height = 0
  let engine = null
  let heartBodies = []
  let lastTime = 0

  function resize() {
    const w = canvas.clientWidth || 300
    const h = canvas.clientHeight || 300
    if (w === width && h === height) return
    width = w
    height = h
    canvas.width = Math.floor(w * dpr)
    canvas.height = Math.floor(h * dpr)
    if (frontCanvas) {
      frontCanvas.width = Math.floor(w * dpr)
      frontCanvas.height = Math.floor(h * dpr)
    }

    if (engine) {
      World.clear(engine.world)
    } else {
      engine = Engine.create()
      engine.gravity.y = 0
      engine.gravity.x = 0
    }

    const walls = createWalls(w, h)
    World.add(engine.world, walls)

    const count = getParticleCount(w, h)
    heartBodies = createHeartBodies(w, h, count, reducedMotion, true)
    World.add(engine.world, heartBodies)
  }

  function drawHeart(ctxDraw, body, path) {
    const c = body.heartConfig
    if (!c) return
    c.phase += c.phaseSpeed
    const size = c.baseSize * (0.9 + Math.sin(c.phase * 0.5) * 0.1)
    const opacity = Math.max(0.1, c.baseOpacity * (0.85 + Math.sin(c.phase * 0.3) * 0.15))

    ctxDraw.save()
    ctxDraw.translate(body.position.x, body.position.y)
    ctxDraw.rotate(body.angle)
    ctxDraw.scale(size, size)
    if (c.blur > 0) ctxDraw.filter = `blur(${c.blur}px)`
    if (c.type === 'silhouette') {
      ctxDraw.fillStyle = `rgba(20, 25, 50, ${opacity * 0.9})`
      ctxDraw.fill(path)
    } else {
      ctxDraw.globalAlpha = opacity
      ctxDraw.fillStyle = 'rgba(255, 255, 255, 0.95)'
      ctxDraw.fill(path)
      ctxDraw.shadowColor = 'rgba(180, 220, 255, 0.9)'
      ctxDraw.shadowBlur = 12 * SETTINGS.glowIntensity
      ctxDraw.fill(path)
      ctxDraw.shadowBlur = 0
      ctxDraw.globalAlpha = 1
    }
    ctxDraw.restore()
  }

  function tick(timestamp = 0) {
    rafId = requestAnimationFrame(tick)
    if (!enabled || visibilityHidden || !engine) return

    const w = width || canvas.clientWidth
    const h = height || canvas.clientHeight
    const delta = Math.min(20, lastTime ? timestamp - lastTime : 16)
    lastTime = timestamp

    Engine.update(engine, delta)

    const path = getHeartPath()
    const drift = SETTINGS.driftForce
    const isMobile = (typeof window !== 'undefined' && window.innerWidth < 600)
    const floatUp = isMobile ? 1.4 : 1

    for (let i = 0; i < heartBodies.length; i++) {
      const body = heartBodies[i]
      if (!body.heartConfig) continue

      const c = body.heartConfig
      c.driftAngle += 0.002 + (i % 3) * 0.001
      const dx = Math.cos(c.driftAngle) * 0.3
      const dy = -0.8 * floatUp
      Body.applyForce(body, body.position, {
        x: dx * drift * (c.layer + 1),
        y: dy * drift * (c.layer + 1),
      })

      const distToPointerX = body.position.x - pointerX
      const distToPointerY = body.position.y - pointerY
      const distSq = distToPointerX * distToPointerX + distToPointerY * distToPointerY
      const radiusSq = SETTINGS.windTouchRadius * SETTINGS.windTouchRadius
      if (distSq < radiusSq && distSq > 0) {
        const dist = Math.sqrt(distSq)
        const force = (1 - dist / SETTINGS.windTouchRadius) * SETTINGS.windTouchStrength
        Body.applyForce(body, body.position, {
          x: (windX * force) / (body.heartConfig.layer + 1),
          y: (windY * force) / (body.heartConfig.layer + 1),
        })
      }
    }
    windX *= SETTINGS.windDecay
    windY *= SETTINGS.windDecay

    if (ctxFront && frontCanvas) {
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.scale(dpr, dpr)
      for (let i = 0; i < heartBodies.length; i++) {
        const b = heartBodies[i]
        if (b.heartConfig && (b.heartConfig.layer === LAYER_MID || b.heartConfig.layer === LAYER_FAR)) {
          drawHeart(ctx, b, path)
        }
      }
      ctxFront.setTransform(1, 0, 0, 1, 0, 0)
      ctxFront.clearRect(0, 0, frontCanvas.width, frontCanvas.height)
      ctxFront.scale(dpr, dpr)
      for (let i = 0; i < heartBodies.length; i++) {
        const b = heartBodies[i]
        if (b.heartConfig && b.heartConfig.layer === LAYER_NEAR) drawHeart(ctxFront, b, path)
      }
    } else {
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.scale(dpr, dpr)
      for (let i = 0; i < heartBodies.length; i++) {
        if (heartBodies[i].heartConfig) drawHeart(ctx, heartBodies[i], path)
      }
    }
  }

  resize()
  if (typeof window !== 'undefined') {
    if (window.innerWidth < 600) {
      setTimeout(resize, 100)
      setTimeout(resize, 400)
    }
    window.addEventListener('resize', resize, { passive: true })
    visibilityHidden = document.visibilityState === 'hidden'
    document.addEventListener('visibilitychange', () => {
      visibilityHidden = document.visibilityState === 'hidden'
    }, { passive: true })
  }

  function onPointerMove(e) {
    const x = e.touches ? e.touches[0].clientX : e.clientX
    const y = e.touches ? e.touches[0].clientY : e.clientY
    if (lastPointerX > -1e3) {
      windX = (x - lastPointerX) * 0.2
      windY = (y - lastPointerY) * 0.2
    }
    lastPointerX = x
    lastPointerY = y
    pointerX = x
    pointerY = y
  }
  function onPointerLeave() {
    pointerX = -1e4
    pointerY = -1e4
  }
  function onTouchStart(e) {
    if (e.touches[0]) {
      lastPointerX = e.touches[0].clientX
      lastPointerY = e.touches[0].clientY
      pointerX = lastPointerX
      pointerY = lastPointerY
    }
  }

  document.addEventListener('touchmove', onPointerMove, { passive: true })
  document.addEventListener('mousemove', onPointerMove, { passive: true })
  document.addEventListener('touchstart', onTouchStart, { passive: true })
  document.addEventListener('mouseleave', onPointerLeave, { passive: true })

  tick(0)

  return {
    destroy() {
      if (rafId != null) cancelAnimationFrame(rafId)
      document.removeEventListener('touchmove', onPointerMove)
      document.removeEventListener('mousemove', onPointerMove)
      document.removeEventListener('touchstart', onTouchStart)
      document.removeEventListener('mouseleave', onPointerLeave)
      if (typeof window !== 'undefined') window.removeEventListener('resize', resize)
      if (engine) {
        World.clear(engine.world)
        engine = null
      }
      heartBodies = []
    },
    setEnabled(value) {
      enabled = !!value
    },
    setReducedMotion(value) {
      reducedMotion = !!value
    },
  }
}

export { init, SETTINGS }
