'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

/* ─────────────────────────────────────────────
   Web Audio helpers
───────────────────────────────────────────── */
function createAudioCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  return new (window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
}

function playTick(ctx: AudioContext, time: number) {
  const osc  = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.frequency.setValueAtTime(1400, time)
  osc.frequency.exponentialRampToValueAtTime(600, time + 0.04)
  gain.gain.setValueAtTime(0.18, time)
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05)
  osc.start(time)
  osc.stop(time + 0.06)
}

function playEngineRev(ctx: AudioContext) {
  for (let i = 0; i < 6; i++) {
    const osc  = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = 'sawtooth'
    const t = ctx.currentTime + i * 0.09
    osc.frequency.setValueAtTime(80 + i * 55, t)
    osc.frequency.exponentialRampToValueAtTime(700 + i * 120, t + 0.4)
    gain.gain.setValueAtTime(0.65, t)
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45)
    osc.start(t)
    osc.stop(t + 0.48)
  }
}

function playTurnRev(ctx: AudioContext) {
  for (let i = 0; i < 3; i++) {
    const osc  = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = 'square'
    const t = ctx.currentTime + i * 0.04
    osc.frequency.setValueAtTime(200 + i * 120, t)
    osc.frequency.exponentialRampToValueAtTime(700 + i * 80, t + 0.15)
    gain.gain.setValueAtTime(0.55, t)
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18)
    osc.start(t)
    osc.stop(t + 0.2)
  }
}

function playOvertureBeep(ctx: AudioContext, onDone: () => void) {
  const notes = [523, 587, 659, 784, 880, 784, 659, 587, 523]
  let lastEnd = ctx.currentTime + 0.6
  notes.forEach((freq, i) => {
    const osc  = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = 'sine'
    const t = lastEnd + i * 0.2
    osc.frequency.setValueAtTime(freq, t)
    gain.gain.setValueAtTime(0.15, t)
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35)
    osc.start(t)
    osc.stop(t + 0.38)
    if (i === notes.length - 1) {
      setTimeout(onDone, (t - ctx.currentTime + 0.4) * 1000)
    }
  })
}

/* ─────────────────────────────────────────────
   Start Lights
───────────────────────────────────────────── */
function StartLights({ lit, isGreen }: { lit: number; isGreen: boolean }) {
  return (
    <div className="flex items-center gap-2.5" role="status" aria-label={`${lit} of 5 lights lit`}>
      <div
        className="relative flex items-center gap-2 px-4 py-2.5"
        style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.25) 0%, rgba(180,230,255,0.12) 50%, rgba(100,180,255,0.08) 100%)',
          border: '1.5px solid rgba(255,255,255,0.45)',
          borderRadius: '10px',
          boxShadow: '0 4px 24px rgba(0,150,255,0.18), inset 0 1px 0 rgba(255,255,255,0.5)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <div
          className="absolute top-0 left-3 right-3 h-[3px] rounded-b-full pointer-events-none"
          style={{ background: 'rgba(255,255,255,0.6)' }}
          aria-hidden="true"
        />
        {[...Array(5)].map((_, i) => {
          const isLit = i < lit
          return (
            <div key={i} className="flex flex-col items-center gap-0.5">
              <div
                className="w-7 h-9 flex items-center justify-center"
                style={{
                  background: 'linear-gradient(180deg,rgba(255,255,255,0.15) 0%,rgba(100,180,255,0.08) 100%)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  borderRadius: '6px',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4)',
                }}
              >
                <div
                  className="w-4 h-4 rounded-full transition-all duration-300"
                  style={{
                    background: isLit
                      ? isGreen
                        ? 'radial-gradient(circle at 35% 30%, #a8ffb0, #22c55e 45%, #15803d)'
                        : 'radial-gradient(circle at 35% 30%, #ff9090, #ef4444 45%, #991b1b)'
                      : 'radial-gradient(circle at 35% 30%, rgba(180,220,255,0.25), rgba(100,160,220,0.1) 60%)',
                    boxShadow: isLit
                      ? isGreen
                        ? '0 0 12px 5px rgba(34,197,94,0.75), 0 0 28px 8px rgba(34,197,94,0.3)'
                        : '0 0 12px 5px rgba(239,68,68,0.75), 0 0 28px 8px rgba(239,68,68,0.3)'
                      : 'none',
                  }}
                />
              </div>
              <div
                className="w-1.5 h-1.5 rounded-b"
                style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)' }}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Steering Wheel SVG
───────────────────────────────────────────── */
function SteeringWheel() {
  return (
    <svg
      viewBox="0 0 280 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      style={{ filter: 'drop-shadow(0 0 32px rgba(0,180,255,0.35)) drop-shadow(0 8px 16px rgba(0,80,180,0.4))' }}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="sw-rim" cx="40%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#1a6fa8" />
          <stop offset="40%" stopColor="#0d4a7a" />
          <stop offset="100%" stopColor="#06284d" />
        </radialGradient>
        <radialGradient id="sw-center" cx="45%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#1a8fa8" />
          <stop offset="50%" stopColor="#0a5a72" />
          <stop offset="100%" stopColor="#042a3a" />
        </radialGradient>
        <linearGradient id="sw-grip" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1a6080" />
          <stop offset="50%" stopColor="#0d3d55" />
          <stop offset="100%" stopColor="#1a6080" />
        </linearGradient>
        <linearGradient id="sw-gloss" x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.35)" />
          <stop offset="40%" stopColor="rgba(255,255,255,0.08)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
        <linearGradient id="sw-aqua" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00D4FF" />
          <stop offset="50%" stopColor="#00FFEE" />
          <stop offset="100%" stopColor="#00D4FF" />
        </linearGradient>
        <filter id="sw-shadow"><feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#003060" floodOpacity="0.7" /></filter>
        <filter id="sw-btnglow"><feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#00D4FF" floodOpacity="0.9" /></filter>
        <radialGradient id="sw-sheen" cx="35%" cy="25%" r="50%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.22)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
      </defs>
      <circle cx="140" cy="140" r="128" fill="url(#sw-rim)" filter="url(#sw-shadow)" />
      <circle cx="140" cy="140" r="128" fill="none" stroke="rgba(0,200,255,0.4)" strokeWidth="1.5" />
      <circle cx="140" cy="140" r="128" fill="url(#sw-gloss)" />
      <circle cx="140" cy="140" r="116" fill="none" stroke="rgba(0,180,255,0.2)" strokeWidth="8" />
      <path d="M 90 22 A 120 120 0 0 1 190 22" stroke="url(#sw-grip)" strokeWidth="14" fill="none" strokeLinecap="round" />
      <path d="M 22 100 A 120 120 0 0 0 22 180" stroke="url(#sw-grip)" strokeWidth="14" fill="none" strokeLinecap="round" />
      <path d="M 258 100 A 120 120 0 0 1 258 180" stroke="url(#sw-grip)" strokeWidth="14" fill="none" strokeLinecap="round" />
      <path d="M 95 18 A 122 122 0 0 1 185 18" stroke="url(#sw-aqua)" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M 140 70 L 140 24" stroke="#0a3a5a" strokeWidth="16" strokeLinecap="round" />
      <path d="M 140 70 L 140 24" stroke="rgba(0,200,255,0.25)" strokeWidth="9" strokeLinecap="round" />
      <path d="M 110 175 L 38 218" stroke="#0a3a5a" strokeWidth="16" strokeLinecap="round" />
      <path d="M 110 175 L 38 218" stroke="rgba(0,200,255,0.25)" strokeWidth="9" strokeLinecap="round" />
      <path d="M 170 175 L 242 218" stroke="#0a3a5a" strokeWidth="16" strokeLinecap="round" />
      <path d="M 170 175 L 242 218" stroke="rgba(0,200,255,0.25)" strokeWidth="9" strokeLinecap="round" />
      <path d="M 80 155 Q 80 80 140 80 Q 200 80 200 155 L 200 175 Q 200 190 185 195 L 155 200 L 140 205 L 125 200 L 95 195 Q 80 190 80 175 Z"
        fill="url(#sw-center)" stroke="rgba(0,200,255,0.35)" strokeWidth="1.5" />
      <path d="M 80 155 Q 80 80 140 80 Q 200 80 200 155 L 200 175 Q 200 190 185 195 L 155 200 L 140 205 L 125 200 L 95 195 Q 80 190 80 175 Z"
        fill="url(#sw-sheen)" />
      <rect x="106" y="95" width="22" height="10" rx="2" fill="#00B4D8" filter="url(#sw-btnglow)" />
      <rect x="132" y="95" width="16" height="10" rx="2" fill="#0a9a6a" />
      <rect x="152" y="95" width="22" height="10" rx="2" fill="#0a4a9a" />
      <rect x="86" y="120" width="30" height="14" rx="3" fill="rgba(0,180,255,0.15)" stroke="rgba(0,200,255,0.4)" strokeWidth="1" />
      <rect x="88" y="122" width="12" height="10" rx="2" fill="#00B4D8" opacity="0.85" />
      <rect x="102" y="122" width="12" height="10" rx="2" fill="rgba(0,180,255,0.2)" />
      <rect x="164" y="120" width="30" height="14" rx="3" fill="rgba(0,180,255,0.15)" stroke="rgba(0,200,255,0.4)" strokeWidth="1" />
      <rect x="166" y="122" width="12" height="10" rx="2" fill="rgba(0,180,255,0.2)" />
      <rect x="180" y="122" width="12" height="10" rx="2" fill="#00B4D8" opacity="0.85" />
      {[...Array(9)].map((_, i) => (
        <rect key={i} x={107 + i * 8} y="148" width="5" height="4" rx="1"
          fill={i < 3 ? '#00E5FF' : i < 6 ? '#00FF9F' : '#0080FF'}
          opacity={0.55 + i * 0.05} />
      ))}
      <rect x="108" y="158" width="64" height="18" rx="3"
        fill="rgba(0,20,60,0.7)" stroke="rgba(0,200,255,0.3)" strokeWidth="1" />
      <text x="140" y="170" textAnchor="middle" fontSize="7" fill="rgba(0,220,255,0.85)" fontFamily="monospace" letterSpacing="2">DRIVER</text>
      <path d="M 30 80 A 118 118 0 0 1 250 80" stroke="rgba(255,255,255,0.18)" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  )
}

/* ─────────────────────────────────────────────
   Music Box Key
───────────────────────────────────────────── */
function MusicBoxKey({ rotation }: { rotation: number }) {
  return (
    <svg
      viewBox="0 0 60 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      style={{ transform: `rotate(${rotation}deg)`, transformOrigin: '50% 80%' }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="mk-aqua" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a8f0ff" />
          <stop offset="25%" stopColor="#00D4FF" />
          <stop offset="50%" stopColor="#80EEFF" />
          <stop offset="75%" stopColor="#00A8CC" />
          <stop offset="100%" stopColor="#00D4FF" />
        </linearGradient>
        <linearGradient id="mk-shaft" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0080A8" />
          <stop offset="30%" stopColor="#80EEFF" />
          <stop offset="70%" stopColor="#00D4FF" />
          <stop offset="100%" stopColor="#005070" />
        </linearGradient>
        <filter id="mk-glow">
          <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#00D4FF" floodOpacity="0.9" />
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#003060" floodOpacity="0.5" />
        </filter>
        <linearGradient id="mk-knob" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a8f0ff" />
          <stop offset="50%" stopColor="#00D4FF" />
          <stop offset="100%" stopColor="#005070" />
        </linearGradient>
        <radialGradient id="mk-shine" cx="30%" cy="25%" r="50%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.8)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
      </defs>
      <rect x="5" y="8" width="50" height="11" rx="5.5" fill="url(#mk-aqua)" filter="url(#mk-glow)" />
      <rect x="8" y="9" width="44" height="4" rx="3" fill="rgba(255,255,255,0.4)" />
      <circle cx="10" cy="13.5" r="7" fill="url(#mk-knob)" filter="url(#mk-glow)" />
      <circle cx="50" cy="13.5" r="7" fill="url(#mk-knob)" filter="url(#mk-glow)" />
      <circle cx="8" cy="11" r="3" fill="url(#mk-shine)" />
      <circle cx="48" cy="11" r="3" fill="url(#mk-shine)" />
      <rect x="24" y="16" width="12" height="7" rx="2" fill="url(#mk-shaft)" />
      <rect x="26.5" y="22" width="7" height="50" rx="3.5" fill="url(#mk-shaft)" />
      {[30, 40, 50, 60].map((y) => (
        <rect key={y} x="26.5" y={y} width="7" height="2" rx="1" fill="#005070" opacity="0.7" />
      ))}
      <rect x="28.5" y="24" width="2.5" height="44" rx="1.2" fill="rgba(255,255,255,0.35)" />
      <rect x="25" y="70" width="10" height="18" rx="2" fill="url(#mk-aqua)" filter="url(#mk-glow)" />
      <rect x="26.5" y="71.5" width="7" height="15" rx="1.5" fill="url(#mk-shaft)" />
    </svg>
  )
}

/* ─────────────────────────────────────────────
   Floating Bubbles (dalam F1 minigame) — semua putih
───────────────────────────────────────────── */
function Bubbles() {
  const bubbles = [
    { size: 60, x: '8%',  y: '70%', delay: '0s',   dur: '7s'   },
    { size: 30, x: '15%', y: '40%', delay: '1.5s', dur: '5s'   },
    { size: 80, x: '88%', y: '60%', delay: '0.8s', dur: '9s'   },
    { size: 20, x: '78%', y: '30%', delay: '2.2s', dur: '6s'   },
    { size: 45, x: '55%', y: '80%', delay: '0.3s', dur: '8s'   },
    { size: 15, x: '40%', y: '20%', delay: '3s',   dur: '5.5s' },
    { size: 35, x: '92%', y: '85%', delay: '1.2s', dur: '7.5s' },
    { size: 25, x: '4%',  y: '15%', delay: '2.8s', dur: '6.5s' },
    { size: 18, x: '65%', y: '10%', delay: '0.5s', dur: '8s'   },
    { size: 50, x: '28%', y: '88%', delay: '1.7s', dur: '6s'   },
    { size: 12, x: '48%', y: '5%',  delay: '2.4s', dur: '5s'   },
  ]
  return (
    <>
      {bubbles.map((b, i) => (
        <div
          key={i}
          className="absolute pointer-events-none"
          style={{
            left: b.x, top: b.y,
            width: b.size, height: b.size,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.6), rgba(220,235,255,0.15) 55%, transparent 80%)',
            border: '1.5px solid rgba(255,255,255,0.4)',
            boxShadow: 'inset 0 0 6px rgba(255,255,255,0.2)',
            animation: `bubble-float ${b.dur} ease-in-out infinite`,
            animationDelay: b.delay,
          }}
          aria-hidden="true"
        />
      ))}
    </>
  )
}

/* ─────────────────────────────────────────────
   Main F1 Mini-game
───────────────────────────────────────────── */
export type F1MinigameProps = {
  onComplete: () => void
  f1VideoSrc?: string
  overtureSrc?: string
}

export function F1Minigame({ onComplete, f1VideoSrc, overtureSrc }: F1MinigameProps) {
  const [rotations, setRotations]       = useState(0)
  const [keyAngle, setKeyAngle]         = useState(0)
  const [isGreen, setIsGreen]           = useState(false)
  const [climax, setClimax]             = useState(false)
  const [shaking, setShaking]           = useState(false)
  const [exiting, setExiting]           = useState(false)
  const [done, setDone]                 = useState(false)
  const [overturePlaying, setOverturePlaying] = useState(false)

  const dragging              = useRef(false)
  const lastAngle             = useRef(0)
  const accumulatedDeg        = useRef(0)
  const completedFullTurns    = useRef(0)
  const keyRef                = useRef<HTMLDivElement>(null)
  const audioCtxRef           = useRef<AudioContext | null>(null)
  const tickIntervalRef       = useRef<ReturnType<typeof setInterval> | null>(null)
  const overtureAudioRef      = useRef<HTMLAudioElement | null>(null)
  const overtureTimerRef      = useRef<number | null>(null)

  const getAudioCtx = useCallback(() => {
    if (!audioCtxRef.current) audioCtxRef.current = createAudioCtx()
    return audioCtxRef.current
  }, [])

  const startTicking = useCallback(() => {
    if (tickIntervalRef.current) return
    tickIntervalRef.current = setInterval(() => {
      const ctx = getAudioCtx()
      if (ctx) playTick(ctx, ctx.currentTime)
    }, 90)
  }, [getAudioCtx])

  const stopTicking = useCallback(() => {
    if (tickIntervalRef.current) {
      clearInterval(tickIntervalRef.current)
      tickIntervalRef.current = null
    }
  }, [])

  const getPointerAngle = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!keyRef.current) return 0
    const rect = keyRef.current.getBoundingClientRect()
    const cx   = rect.left + rect.width / 2
    const cy   = rect.top  + rect.height * 0.8
    return Math.atan2(e.clientY - cy, e.clientX - cx) * (180 / Math.PI)
  }, [])

  const finalizeClimax = useCallback(() => {
    // ── Task 1: hentikan overture sepenuhnya sebelum profile BGM main ──
    try { overtureAudioRef.current?.pause(); if (overtureAudioRef.current) overtureAudioRef.current.currentTime = 0 } catch (_) {}
    if (overtureTimerRef.current) window.clearTimeout(overtureTimerRef.current)
    try {
      const arr = (window as any).__member_media || []
      if (overtureAudioRef.current) {
        const idx = arr.indexOf(overtureAudioRef.current)
        if (idx >= 0) arr.splice(idx, 1)
      }
    } catch (_) {}
    overtureAudioRef.current = null

    setOverturePlaying(false)
    setExiting(true)
    setTimeout(() => { setDone(true); onComplete() }, 700)
  }, [onComplete])

  // Start overture setelah 3 putaran
  const startOverture = useCallback(() => {
    if (overturePlaying) return
    setOverturePlaying(true)
    setClimax(true)
    setIsGreen(true)
    setShaking(true)
    const ctx = getAudioCtx()
    if (ctx) playEngineRev(ctx)

    if (overtureSrc) {
      const audio = new Audio(overtureSrc)
      audio.volume = 0.5
      overtureAudioRef.current = audio
      try {
        ;(window as any).__member_media = (window as any).__member_media || []
        ;(window as any).__member_media.push(audio)
      } catch (_) {}

      setTimeout(() => {
        audio.play().catch(() => {
          const ctx2 = getAudioCtx()
          if (ctx2) playOvertureBeep(ctx2, () => finalizeClimax())
        })

        if (overtureTimerRef.current) window.clearTimeout(overtureTimerRef.current)
        overtureTimerRef.current = window.setTimeout(() => {
          try { audio.pause(); audio.currentTime = 0 } catch (_) {}
          try {
            const arr = (window as any).__member_media || []
            const idx = arr.indexOf(audio)
            if (idx >= 0) arr.splice(idx, 1)
          } catch (_) {}
          finalizeClimax()
        }, 39000)

        audio.onended = () => {
          if (overtureTimerRef.current) window.clearTimeout(overtureTimerRef.current)
          try { audio.currentTime = 0 } catch (_) {}
          try {
            const arr = (window as any).__member_media || []
            const idx = arr.indexOf(audio)
            if (idx >= 0) arr.splice(idx, 1)
          } catch (_) {}
          finalizeClimax()
        }
      }, 220)
    } else {
      const ctx2 = getAudioCtx()
      if (ctx2) playOvertureBeep(ctx2, () => finalizeClimax())
    }
  }, [overturePlaying, getAudioCtx, overtureSrc, finalizeClimax])

  // ── Task 2: SKIP button — langsung finalize tanpa tunggu overture selesai ──
  const handleSkip = useCallback(() => {
    finalizeClimax()
  }, [finalizeClimax])

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (climax) return
    e.currentTarget.setPointerCapture(e.pointerId)
    dragging.current = true
    lastAngle.current = getPointerAngle(e)
    startTicking()
    const ctx = getAudioCtx()
    if (ctx?.state === 'suspended') ctx.resume()
  }, [climax, getPointerAngle, startTicking, getAudioCtx])

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging.current || climax) return
    const current = getPointerAngle(e)
    let delta     = current - lastAngle.current
    lastAngle.current = current
    if (delta >  180) delta -= 360
    if (delta < -180) delta += 360
    if (delta > 0) {
      accumulatedDeg.current += delta
      setKeyAngle(prev => prev + delta)
      const newTurns = Math.floor(accumulatedDeg.current / 360)
      if (newTurns > completedFullTurns.current) {
        const added = newTurns - completedFullTurns.current
        completedFullTurns.current = newTurns
        const ctx = getAudioCtx()
        if (ctx) {
          for (let i = 0; i < added; i++) playTurnRev(ctx)
        }
        setRotations(prev => {
          const next = Math.min(prev + added, 3)
          if (next >= 3) {
            setTimeout(() => startOverture(), 50)
          }
          return next
        })
      }
    }
  }, [climax, getPointerAngle, startOverture, getAudioCtx])

  const onPointerUp = useCallback(() => {
    dragging.current = false
    stopTicking()
  }, [stopTicking])

  useEffect(() => () => {
    stopTicking()
    audioCtxRef.current?.close()
    try { overtureAudioRef.current?.pause() } catch (_) {}
    if (overtureTimerRef.current) window.clearTimeout(overtureTimerRef.current)
    try {
      const arr = (window as any).__member_media || []
      if (overtureAudioRef.current) {
        const idx = arr.indexOf(overtureAudioRef.current)
        if (idx >= 0) arr.splice(idx, 1)
      }
    } catch (_) {}
  }, [stopTicking])

  if (done) return null

  const lightsLit  = Math.min(Math.round((rotations / 3) * 5), 5)
  const shakeStyle = shaking
    ? { transform: `translate(${Math.random() * 14 - 7}px, ${Math.random() * 14 - 7}px) rotate(${Math.random() * 1.5 - 0.75}deg)` }
    : {}

  return (
    <div
      className="fixed inset-0 z-[110] flex flex-col items-center justify-between overflow-hidden select-none"
      style={{
        opacity: exiting ? 0 : 1,
        transition: exiting ? 'opacity 0.7s ease-in' : 'opacity 0.3s',
        ...shakeStyle,
      }}
    >
      {/* Background: F1 video */}
      {f1VideoSrc ? (
        <video
          autoPlay loop muted playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: 'brightness(0.55) saturate(1.3) hue-rotate(180deg)' }}
        >
          <source src={f1VideoSrc} type="video/mp4" />
        </video>
      ) : (
        <div
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(180deg,
                #87CEEB 0%, #5BB8E8 18%, #2196C8 35%, #0a6090 55%, #063a60 75%, #021828 100%
              )
            `,
          }}
          aria-hidden="true"
        />
      )}

      {/* Depth overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(0deg, rgba(0,10,40,0.6) 0%, transparent 50%)' }}
        aria-hidden="true"
      />

      {/* Caustic rays */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 45% 30% at 30% 0%, rgba(135,206,235,0.28) 0%, transparent 70%),
            radial-gradient(ellipse 35% 25% at 70% 0%, rgba(180,230,255,0.18) 0%, transparent 70%),
            radial-gradient(ellipse 60% 40% at 50% 0%, rgba(100,190,240,0.12) 0%, transparent 60%)
          `,
        }}
        aria-hidden="true"
      />

      {/* Bubbles putih (task 8) */}
      <Bubbles />

      {/* TOP: Start Lights */}
      <div className="relative z-10 flex flex-col items-center gap-3 pt-10 md:pt-14">
        <div className="flex flex-col items-center gap-1">
          <div
            className="w-64 h-1.5 rounded-full"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3) 30%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0.3) 70%, transparent)' }}
          />
          <div className="w-56 h-px" style={{ background: 'rgba(255,255,255,0.2)' }} />
          <div className="mt-1">
            <StartLights lit={lightsLit} isGreen={isGreen} />
          </div>
        </div>

        {/* Status chip */}
        <div
          className="flex items-center gap-2 mt-1 px-4 py-1.5"
          style={{
            background: 'rgba(255,255,255,0.15)',
            border: '1px solid rgba(255,255,255,0.35)',
            borderRadius: '20px',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 2px 12px rgba(0,150,255,0.2)',
          }}
        >
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#00D4FF', boxShadow: '0 0 6px #00D4FF' }} />
          <span
            className="font-pixel text-[12px] tracking-widest uppercase"
            style={{ color: '#e0f6ff', textShadow: '0 0 12px rgba(0,212,255,0.6)', fontWeight: 700 }}
          >
            {rotations < 3 ? `WINDING ${rotations}/3` : 'LIGHTS OUT!'}
          </span>
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#00D4FF', boxShadow: '0 0 6px #00D4FF', animationDelay: '0.5s' }} />
        </div>
      </div>

      {/* CENTER: Steering Wheel + Key */}
      <div
        className="relative z-10 flex items-center justify-center"
        style={{ width: 'min(85vw, 310px)', height: 'min(85vw, 310px)' }}
      >
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            boxShadow: climax
              ? '0 0 80px 30px rgba(34,197,94,0.25), 0 0 0 2px rgba(34,197,94,0.4)'
              : '0 0 60px 20px rgba(0,150,255,0.2), 0 0 0 1px rgba(0,200,255,0.15)',
            transition: 'box-shadow 0.5s ease',
          }}
        />
        <div className="absolute inset-0"><SteeringWheel /></div>

        <div
          ref={keyRef}
          className="absolute cursor-grab active:cursor-grabbing touch-none"
          style={{ width: '50px', height: '84px', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 10 }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
          role="slider"
          aria-label="Music box key — drag clockwise 3 times"
          aria-valuenow={rotations}
          aria-valuemin={0}
          aria-valuemax={3}
          tabIndex={0}
        >
          <MusicBoxKey rotation={keyAngle} />
        </div>

        {climax && (
          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(34,197,94,0.2) 0%, transparent 70%)',
              animation: 'f1-pulse 0.5s ease-in-out 3',
            }}
          />
        )}
      </div>

      {/* BOTTOM: Hint / Status */}
      <div className="relative z-10 flex flex-col items-center gap-3 pb-10 md:pb-14">
        {!climax ? (
          <>
            <div className="flex items-center gap-3">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="animate-bounce" aria-hidden="true">
                <path d="M12 4 C16.4 4 20 7.6 20 12 C20 16.4 16.4 20 12 20" stroke="#80EEFF" strokeWidth="2" strokeLinecap="round" />
                <path d="M16 8 L20 12 L16 16" stroke="#80EEFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p
                className="font-pixel text-[14px] text-center leading-loose max-w-[320px]"
                style={{ color: 'rgba(200,240,255,0.95)', fontWeight: 700 }}
              >
                Drag the{' '}
                <span style={{ color: '#00D4FF', textShadow: '0 0 10px #00D4FF', fontWeight: 800 }}>AQUA KEY</span>
                {' '}x3 clockwise
              </p>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="animate-bounce" style={{ animationDelay: '150ms' }} aria-hidden="true">
                <path d="M12 4 C16.4 4 20 7.6 20 12 C20 16.4 16.4 20 12 20" stroke="#80EEFF" strokeWidth="2" strokeLinecap="round" />
                <path d="M16 8 L20 12 L16 16" stroke="#80EEFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            {/* Progress pips */}
            <div className="flex items-center gap-3">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: i < rotations ? '22px' : '10px',
                    height: '10px',
                    background: i < rotations
                      ? 'radial-gradient(circle at 35% 30%, #80EEFF, #00B4D8 60%, #006090)'
                      : 'rgba(255,255,255,0.12)',
                    border: i < rotations
                      ? '1px solid rgba(0,220,255,0.6)'
                      : '1px solid rgba(255,255,255,0.25)',
                    boxShadow: i < rotations
                      ? '0 0 10px rgba(0,200,255,0.7), 0 0 20px rgba(0,200,255,0.3)'
                      : 'inset 0 1px 0 rgba(255,255,255,0.3)',
                  }}
                />
              ))}
            </div>

            {/* SKIP button muncul setelah 3 rotasi */}
            {rotations >= 3 && (
              <button
                type="button"
                onClick={handleSkip}
                className="mt-2 rounded-full font-bold transition-all hover:opacity-90 active:scale-95"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.35), rgba(0,200,255,0.25))',
                  border: '2px solid rgba(255,255,255,0.55)',
                  backdropFilter: 'blur(8px)',
                  boxShadow: '0 4px 20px rgba(0,180,255,0.35), inset 0 1px 0 rgba(255,255,255,0.6)',
                  color: '#e0f6ff',
                  fontFamily: 'var(--font-pixel, monospace)',
                  fontSize: '15px',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  padding: '12px 36px',
                  minWidth: '140px',
                }}
              >
                SKIP
              </button>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 animate-pulse">
            <p
              className="font-pixel text-[11px] tracking-widest uppercase"
              style={{ color: '#00FF99', textShadow: '0 0 12px #00FF99, 0 0 30px rgba(0,255,153,0.5)' }}
            >
              LIGHTS OUT!
            </p>
            <p className="font-pixel text-[7px]" style={{ color: 'rgba(200,240,255,0.6)' }}>
              AND AWAY WE GO...
            </p>
            {/* SKIP juga tersedia saat climax */}
            <button
              type="button"
              onClick={handleSkip}
              className="mt-2 rounded-full font-bold transition-all hover:opacity-90 active:scale-95"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.35), rgba(0,200,255,0.25))',
                border: '2px solid rgba(255,255,255,0.55)',
                backdropFilter: 'blur(8px)',
                boxShadow: '0 4px 20px rgba(0,180,255,0.35), inset 0 1px 0 rgba(255,255,255,0.6)',
                color: '#e0f6ff',
                fontFamily: 'var(--font-pixel, monospace)',
                fontSize: '15px',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                padding: '12px 36px',
                minWidth: '140px',
              }}
            >
              SKIP
            </button>
          </div>
        )}


      </div>

      <style>{`
        @keyframes f1-pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        @keyframes bubble-float {
          0%, 100% { transform: translateY(0px) scale(1); opacity: 0.7; }
          33% { transform: translateY(-18px) scale(1.05); opacity: 0.9; }
          66% { transform: translateY(-8px) scale(0.95); opacity: 0.6; }
        }
      `}</style>
    </div>
  )
}
