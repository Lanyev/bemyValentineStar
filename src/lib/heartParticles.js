/**
 * Motor de partículas: corazones que nacen abajo, suben y desaparecen arriba.
 * Física Matter.js; colores de la paleta del proyecto.
 */

import Matter from 'matter-js'

const { Engine, World, Bodies, Body } = Matter

// Paleta del proyecto (rosa pastel / San Valentín)
const PALETTE = [
  { r: 255, g: 245, b: 248 }, // pink-light
  { r: 255, g: 182, b: 193 }, // pink-pastel
  { r: 255, g: 192, b: 203 }, // pink-soft
  { r: 255, g: 209, b: 220 }, // pink-muted
  { r: 255, g: 255, b: 255 }, // white
  { r: 194, g: 90, b: 122 },  // rose
]

const PHYSICS_STEP_MS = 1000 / 60
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
  restitution: 0.3,
  friction: 0.01,
  frictionAir: 0.002,
  driftForce: 0.00011,
  spawnHeight: 120,
  despawnMargin: 80,
  maxVelocity: 28,
}

const LAYER_NEAR = 0
const LAYER_MID = 1
const LAYER_FAR = 2

const LAYER_CONFIG = [
  { scale: 1.8, speedMul: 1, blur: 4, silhouetteChance: 0.5 },
  { scale: 1, speedMul: 1, blur: 0, silhouetteChance: 0.1 },
  { scale: 0.5, speedMul: 0.7, blur: 0, silhouetteChance: 0 },
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

// Categorías de colisión: solo corazón-pared, no corazón-corazón (menos CPU)
const COLLISION_WALL = 0x0001
const COLLISION_HEART = 0x0002

// Solo paredes laterales; arriba y abajo libres para nacer abajo y desaparecer arriba
function createWalls(w, h) {
  const t = SETTINGS.wallThickness
  const half = t / 2
  const wallOpts = {
    isStatic: true,
    label: 'wall',
    collisionFilter: { group: 0, category: COLLISION_WALL, mask: COLLISION_HEART },
  }
  return [
    Bodies.rectangle(-half, h / 2, t, h + t * 4, wallOpts),
    Bodies.rectangle(w + half, h / 2, t, h + t * 4, wallOpts),
  ]
}

function pickRandomColor() {
  const c = PALETTE[Math.floor(Math.random() * PALETTE.length)]
  return { r: c.r, g: c.g, b: c.b }
}

// Crea un solo corazón en la zona de spawn (abajo); para reciclaje
function createOneHeart(w, h, layer, reducedMotion) {
  const cfg = LAYER_CONFIG[layer]
  const isSilhouette = Math.random() < cfg.silhouetteChance
  const baseSize = (8 + Math.random() * 14) * cfg.scale
  const radius = Math.max(4, baseSize * 0.6)
  const x = Math.random() * (w - 40) + 20
  const y = h + 20 + Math.random() * SETTINGS.spawnHeight
  const speed = (reducedMotion ? 12 : 27) * cfg.speedMul * (0.7 + Math.random() * 0.5)
  const vx = (Math.random() - 0.5) * 6
  const vy = -speed
  const body = Bodies.circle(x, y, radius, {
    restitution: SETTINGS.restitution,
    friction: SETTINGS.friction,
    frictionAir: SETTINGS.frictionAir,
    density: 0.002,
    label: 'heart',
    velocity: { x: vx, y: vy },
    collisionFilter: { group: 0, category: COLLISION_HEART, mask: COLLISION_WALL },
  })
  body.heartConfig = {
    layer,
    type: isSilhouette ? 'silhouette' : 'bright',
    baseSize,
    baseOpacity: isSilhouette ? 0.5 + Math.random() * 0.3 : 0.5 + Math.random() * 0.45,
    blur: cfg.blur,
    phase: Math.random() * Math.PI * 2,
    phaseSpeed: 0.02 + Math.random() * 0.03,
    driftAngle: Math.random() * Math.PI * 2,
    color: pickRandomColor(),
  }
  return body
}

function createHeartBodies(w, h, count, reducedMotion) {
  const near = Math.floor(count * 0.25)
  const mid = Math.floor(count * 0.45)
  const bodies = []
  for (let i = 0; i < count; i++) {
    const layer = i < near ? LAYER_NEAR : i < near + mid ? LAYER_MID : LAYER_FAR
    const body = createOneHeart(w, h, layer, reducedMotion)
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
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 600
  const dpr = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, isMobile ? 1 : 2)

  let width = 0
  let height = 0
  let engine = null
  let heartBodies = []
  let lastTime = 0
  let physicsAccumulator = 0

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

    physicsAccumulator = 0
    if (engine) {
      World.clear(engine.world)
    } else {
      engine = Engine.create()
      engine.gravity.y = 0
      engine.gravity.x = 0
      engine.timing.iterations = 4
    }

    const walls = createWalls(w, h)
    World.add(engine.world, walls)

    const count = getParticleCount(w, h)
    heartBodies = createHeartBodies(w, h, count, reducedMotion)
    World.add(engine.world, heartBodies)
  }

  function drawHeart(ctxDraw, body, path, stateRef, viewHeight) {
    const c = body.heartConfig
    if (!c) return
    c.phase += c.phaseSpeed
    const size = c.baseSize * (0.9 + Math.sin(c.phase * 0.5) * 0.1)
    const pulse = 0.85 + Math.sin(c.phase * 0.3) * 0.15
    const y = body.position.y
    let lifeOpacity = 1
    if (y >= viewHeight - 100) lifeOpacity = Math.max(0, (viewHeight - y) / 100)
    else if (y <= 80) lifeOpacity = Math.max(0, y / 80)
    const opacity = Math.max(0.02, c.baseOpacity * pulse * lifeOpacity)

    ctxDraw.save()
    ctxDraw.translate(body.position.x, body.position.y)
    ctxDraw.rotate(body.angle)
    ctxDraw.scale(size, size)
    if (stateRef && stateRef.currentBlur !== c.blur) {
      stateRef.currentBlur = c.blur
      ctxDraw.filter = c.blur > 0 ? `blur(${c.blur}px)` : 'none'
    } else if (!stateRef && c.blur > 0) ctxDraw.filter = `blur(${c.blur}px)`
    const col = c.color || { r: 255, g: 182, b: 193 }
    if (c.type === 'silhouette') {
      ctxDraw.fillStyle = `rgba(${Math.round(col.r * 0.4)}, ${Math.round(col.g * 0.35)}, ${Math.round(col.b * 0.45)}, ${opacity * 0.9})`
      ctxDraw.fill(path)
    } else {
      ctxDraw.globalAlpha = opacity
      ctxDraw.fillStyle = `rgba(${col.r}, ${col.g}, ${col.b}, 0.95)`
      ctxDraw.fill(path)
      ctxDraw.shadowColor = `rgba(${col.r}, ${col.g}, ${Math.min(255, col.b + 40)}, 0.85)`
      ctxDraw.shadowBlur = 10 * SETTINGS.glowIntensity
      ctxDraw.fill(path)
      ctxDraw.shadowBlur = 0
      ctxDraw.globalAlpha = 1
    }
    ctxDraw.restore()
  }

  const drawStateBack = { currentBlur: -1 }
  const drawStateFront = { currentBlur: -1 }

  function tick(timestamp = 0) {
    rafId = requestAnimationFrame(tick)
    if (!enabled || visibilityHidden || !engine) return

    const w = width || canvas.clientWidth
    const h = height || canvas.clientHeight
    const delta = Math.min(50, lastTime ? timestamp - lastTime : 16)
    lastTime = timestamp

    const path = getHeartPath()
    const drift = SETTINGS.driftForce
    const isMobileFloat = (typeof window !== 'undefined' && window.innerWidth < 600)
    const floatUp = isMobileFloat ? 1.4 : 1

    for (let i = 0; i < heartBodies.length; i++) {
      const body = heartBodies[i]
      if (!body.heartConfig) continue
      const c = body.heartConfig
      c.driftAngle += 0.002 + (i % 3) * 0.001
      const dx = Math.cos(c.driftAngle) * 0.3
      const dy = -0.8 * floatUp
      const driftMul = 1.2 - c.layer * 0.3
      Body.applyForce(body, body.position, {
        x: dx * drift * driftMul,
        y: dy * drift * driftMul,
      })
      const distToPointerX = body.position.x - pointerX
      const distToPointerY = body.position.y - pointerY
      const distSq = distToPointerX * distToPointerX + distToPointerY * distToPointerY
      const radiusSq = SETTINGS.windTouchRadius * SETTINGS.windTouchRadius
      if (distSq < radiusSq && distSq > 0) {
        const dist = Math.sqrt(distSq)
        const force = (1 - dist / SETTINGS.windTouchRadius) * SETTINGS.windTouchStrength
        Body.applyForce(body, body.position, {
          x: (windX * force) / (c.layer + 1),
          y: (windY * force) / (c.layer + 1),
        })
      }
    }
    windX *= SETTINGS.windDecay
    windY *= SETTINGS.windDecay

    physicsAccumulator += delta
    while (physicsAccumulator >= PHYSICS_STEP_MS) {
      Engine.update(engine, PHYSICS_STEP_MS)
      physicsAccumulator -= PHYSICS_STEP_MS
    }

    const maxVel = SETTINGS.maxVelocity
    for (let i = 0; i < heartBodies.length; i++) {
      const b = heartBodies[i]
      const vx = b.velocity.x
      const vy = b.velocity.y
      const speed = Math.sqrt(vx * vx + vy * vy)
      if (speed > maxVel && speed > 0) {
        const s = maxVel / speed
        Body.setVelocity(b, { x: vx * s, y: vy * s })
      }
    }

    for (let i = 0; i < heartBodies.length; i++) {
      const b = heartBodies[i]
      if (b.position.y < -SETTINGS.despawnMargin) {
        const layer = b.heartConfig?.layer ?? LAYER_MID
        World.remove(engine.world, b)
        const replacement = createOneHeart(w, h, layer, reducedMotion)
        heartBodies[i] = replacement
        World.add(engine.world, replacement)
      }
    }

    drawStateBack.currentBlur = -1
    drawStateFront.currentBlur = -1
    if (ctxFront && frontCanvas) {
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.scale(dpr, dpr)
      for (let i = 0; i < heartBodies.length; i++) {
        const b = heartBodies[i]
        if (b.heartConfig && (b.heartConfig.layer === LAYER_MID || b.heartConfig.layer === LAYER_FAR)) {
          drawHeart(ctx, b, path, drawStateBack, h)
        }
      }
      ctxFront.setTransform(1, 0, 0, 1, 0, 0)
      ctxFront.clearRect(0, 0, frontCanvas.width, frontCanvas.height)
      ctxFront.scale(dpr, dpr)
      for (let i = 0; i < heartBodies.length; i++) {
        const b = heartBodies[i]
        if (b.heartConfig && b.heartConfig.layer === LAYER_NEAR) drawHeart(ctxFront, b, path, drawStateFront, h)
      }
    } else {
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.scale(dpr, dpr)
      for (let i = 0; i < heartBodies.length; i++) {
        if (heartBodies[i].heartConfig) drawHeart(ctx, heartBodies[i], path, drawStateBack, h)
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
