'use client'

/* eslint-disable react-hooks/purity, react-hooks/set-state-in-effect */

import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react'
import Image from 'next/image'
import Instagram from '@/components/atoms/button/InstagramButtonLink'
import LinkedInButtonLink from '@/components/atoms/button/LinkedInButtonLink'
import SpotifyEmbed from '@/components/molecules/SpotifyEmbed'
import ProfileImage from './image.jpg'
import BgImage from './bg-image.png'

// ─── Types ────────────────────────────────────────────────────────────────────
type Phase = 'prompt' | 'countdown' | 'warp' | 'card'

type MemberPopupProps = {
  isOpen: boolean
  onClose: () => void
}

// ─── Hook: Text Scramble ──────────────────────────────────────────────────────
// Reveals text by scrambling random chars → actual characters, left-to-right
function useScramble(text: string, active: boolean, delay = 0): string {
  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*!?><~±§'
  const [display, setDisplay] = useState(() => text.replace(/[^ ]/g, '▓'))

  useEffect(() => {
    if (!active) {
      setDisplay(text.replace(/[^ ]/g, '▓'))
      return
    }
    let iteration = 0
    let inner: ReturnType<typeof setInterval>

    const outerT = setTimeout(() => {
      inner = setInterval(() => {
        setDisplay(
          text
            .split('')
            .map((char, i) => {
              if (char === ' ') return ' '
              if (i < Math.floor(iteration)) return char
              return CHARS[Math.floor(Math.random() * CHARS.length)]
            })
            .join('')
        )
        iteration += 0.5
        if (Math.floor(iteration) >= text.length) {
          clearInterval(inner)
          setDisplay(text)
        }
      }, 35)
    }, delay)

    return () => {
      clearTimeout(outerT)
      clearInterval(inner)
    }
  }, [active, text, delay])

  return display
}

// ─── Constants ────────────────────────────────────────────────────────────────
const COUNTDOWN_COLORS: Record<number, string> = {
  3: '#2ed4e0',
  2: '#f56236',
  1: '#c139ab'
}
const RING_R = 90
const RING_C = +(2 * Math.PI * RING_R).toFixed(2) // 565.49

// ─── Component ────────────────────────────────────────────────────────────────
const MemberPopup = ({ isOpen, onClose }: MemberPopupProps) => {
  const [phase, setPhase] = useState<Phase>('prompt')
  const [countdownNum, setCountdownNum] = useState(3)
  const timerRefs = useRef<ReturnType<typeof setTimeout>[]>([])
  const cardRef = useRef<HTMLDivElement>(null)

  // Scramble name only during card phase (starts 300ms after card appears)
  const scrambledName = useScramble('Muhammad Satrio Utomo', phase === 'card', 300)

  // ─── Memoized warp streaks ─────────────────────────────────────────────────
  // Diubah dari 100 menjadi 35 untuk mengurangi lag
  const warpStreaks = useMemo(() => {
    const colors = ['#2ed4e0', '#c139ab', '#f56236', '#3b8500', '#ffffff']
    return Array.from({ length: 35 }, (_, i) => ({
      id: i,
      rot: Math.random() * 360,
      delay: Math.random() * 0.5,
      duration: 0.2 + Math.random() * 0.4,
      height: 2 + Math.random() * 4,
      width: 60 + Math.random() * 150,
      color: colors[Math.floor(Math.random() * colors.length)]
    }))
  }, [])

  // ─── Handlers ─────────────────────────────────────────────────────────────
  const clearTimers = useCallback(() => {
    timerRefs.current.forEach(clearTimeout)
    timerRefs.current = []
  }, [])

  const handleConfirm = useCallback(() => {
    clearTimers()
    setPhase('countdown')
    setCountdownNum(3)
    // Sequence: 3 → 2 → 1 (900ms each) → warp (1400ms) → card
    timerRefs.current = [
      setTimeout(() => setCountdownNum(2), 900),
      setTimeout(() => setCountdownNum(1), 1800),
      setTimeout(() => setPhase('warp'), 2700),
      setTimeout(() => setPhase('card'), 4100)
    ]
  }, [clearTimers])

  const handleClose = useCallback(() => {
    clearTimers()
    setPhase('prompt')
    setCountdownNum(3)
    onClose()
  }, [clearTimers, onClose])

  // ─── 3D Holographic Tilt ──────────────────────────────────────────────────
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current
    if (!el) return
    const { left, top, width, height } = el.getBoundingClientRect()
    const x = ((e.clientX - left) / width - 0.5) * 10
    const y = ((e.clientY - top) / height - 0.5) * 10
    el.style.transition = 'transform 0ms'
    el.style.transform = `perspective(1200px) rotateY(${x}deg) rotateX(${-y}deg) scale3d(1.01,1.01,1.01)`
  }, [])

  const handleMouseLeave = useCallback(() => {
    const el = cardRef.current
    if (!el) return
    el.style.transition = 'transform 600ms ease'
    el.style.transform = 'perspective(1200px) rotateY(0deg) rotateX(0deg) scale3d(1,1,1)'
  }, [])

  // ─── Effects ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) {
      clearTimers()
      setPhase('prompt')
      setCountdownNum(3)
      return
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [isOpen, handleClose, clearTimers])

  // Cleanup timers on unmount
  useEffect(() => () => clearTimers(), [clearTimers])

  if (!isOpen) return null

  const currentColor = COUNTDOWN_COLORS[countdownNum] ?? '#2ed4e0'

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto px-4 sm:p-0">
      {/* ── Google Fonts: Orbitron + Space Mono + Syne ── */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Syne:wght@400;500;600;700;800&display=swap');
      `}</style>

      {/* ── All Keyframes & Scoped Styles ── */}
      <style jsx>{`
        /* ─── Existing animations (kept / refined) ─── */
        @keyframes mp-backdrop-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes mp-warp-reveal {
          0% {
            clip-path: inset(20% 20% 20% 20% round 24px);
            transform: scale(1.3);
            filter: blur(20px) brightness(2);
            opacity: 0;
          }
          40% {
            clip-path: inset(0 0 0 0 round 24px);
            transform: scale(1.02);
            filter: blur(2px) brightness(1.2);
            opacity: 1;
          }
          100% {
            clip-path: inset(0 0 0 0 round 24px);
            transform: scale(1);
            filter: blur(0) brightness(1);
            opacity: 1;
          }
        }

        @keyframes mp-prompt-in {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(20px);
            filter: blur(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
            filter: blur(0);
          }
        }

        @keyframes mp-holo-in {
          0% {
            opacity: 0;
            transform: translateY(10px);
            filter: blur(6px);
          }
          60% {
            opacity: 0.6;
            filter: blur(1px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0);
          }
        }

        @keyframes mp-twinkle {
          0%,
          100% {
            opacity: 0.2;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.4);
          }
        }

        @keyframes mp-wave {
          0%,
          100% {
            transform: scaleY(0.3);
          }
          50% {
            transform: scaleY(1);
          }
        }

        @keyframes bg-warp-zoom {
          0% {
            transform: scale(1);
            filter: brightness(1);
          }
          80% {
            transform: scale(1.6);
            filter: brightness(1.4);
          }
          100% {
            transform: scale(1);
            filter: brightness(1);
          }
        }

        @keyframes warp-streak {
          0% {
            transform: rotate(var(--rot)) translateX(80px) scaleX(0);
            opacity: 0;
          }
          15% {
            transform: rotate(var(--rot)) translateX(150px) scaleX(1);
            opacity: 1;
          }
          100% {
            transform: rotate(var(--rot)) translateX(1500px) scaleX(20);
            opacity: 0;
          }
        }

        @keyframes warp-flash {
          0%,
          75% {
            opacity: 0;
            background: transparent;
          }
          90% {
            opacity: 1;
            background: #fff;
            filter: blur(10px);
          }
          100% {
            opacity: 0;
            background: transparent;
            filter: blur(0);
          }
        }

        @keyframes twinkle-shuriken {
          0%,
          100% {
            opacity: 0.1;
            transform: translate(-50%, -50%) scale(0.3);
          }
          50% {
            opacity: 0.9;
            transform: translate(-50%, -50%) scale(1.3);
          }
        }
        @keyframes twinkle-cross {
          0%,
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0);
          }
          50% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }

        @keyframes mp-flicker {
          0%,
          94%,
          100% {
            opacity: 1;
          }
          95% {
            opacity: 0.7;
          }
          96% {
            opacity: 1;
          }
          97% {
            opacity: 0.25;
          }
          98% {
            opacity: 0.9;
          }
          99% {
            opacity: 0.6;
          }
        }
        @keyframes mp-shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(300%);
          }
        }

        /* ─── NEW: Countdown ─── */
        @keyframes mp-num-pulse {
          0% {
            transform: scale(1.6);
            opacity: 0;
            filter: blur(20px) brightness(2);
          }
          22% {
            transform: scale(1);
            opacity: 1;
            filter: blur(0) brightness(1.2);
          }
          76% {
            transform: scale(1);
            opacity: 1;
            filter: blur(0) brightness(1);
          }
          100% {
            transform: scale(0.65);
            opacity: 0;
            filter: blur(12px) brightness(0.5);
          }
        }
        @keyframes mp-ring-deplete {
          from {
            stroke-dashoffset: 0;
          }
          to {
            stroke-dashoffset: ${RING_C};
          }
        }
        @keyframes mp-cd-glow {
          0%,
          100% {
            opacity: 0.35;
            transform: translate(-50%, -50%) scale(0.95);
          }
          50% {
            opacity: 0.7;
            transform: translate(-50%, -50%) scale(1.1);
          }
        }

        /* ─── NEW: Spinning conic border ─── */
        @keyframes mp-border-rotate {
          from {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }

        /* ─── NEW: Scan-line reveal (sweeps once on card appear) ─── */
        @keyframes mp-scan {
          0% {
            top: 0;
            opacity: 1;
          }
          100% {
            top: 106%;
            opacity: 0;
          }
        }

        /* ─── Shuriken stars ─── */
        .space-shuriken {
          position: absolute;
          width: 3px;
          height: 3px;
          background: #fff;
          border-radius: 50%;
          box-shadow:
            0 0 5px #fff,
            0 0 10px #fff;
          opacity: 0;
          pointer-events: none;
          animation: twinkle-shuriken 4s ease-in-out infinite;
        }
        .space-shuriken::before,
        .space-shuriken::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          background: #fff;
          box-shadow:
            0 0 5px #fff,
            0 0 10px #fff;
          border-radius: 1px;
          opacity: 0;
          pointer-events: none;
          animation: twinkle-cross 4s ease-in-out infinite;
        }
        .space-shuriken::before {
          width: 100%;
          height: 350%;
        }
        .space-shuriken::after {
          width: 350%;
          height: 100%;
        }

        /* ─── Hover micro-interactions ─── */
        .mp-card-tile {
          transition:
            transform 280ms ease,
            border-color 280ms ease,
            box-shadow 280ms ease,
            background-color 280ms ease;
        }
        .mp-card-tile:hover {
          transform: translateY(-4px);
          border-color: rgba(255, 255, 255, 0.4);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
          background-color: rgba(255, 255, 255, 0.12);
        }
        .mp-social-wrap {
          transition:
            transform 220ms ease,
            filter 220ms ease;
        }
        .mp-social-wrap:hover {
          transform: translateY(-2px) scale(1.04);
          filter: drop-shadow(0 0 10px rgba(245, 98, 54, 0.7)) drop-shadow(0 0 20px rgba(193, 57, 171, 0.5));
        }
        .mp-close-btn {
          transition: all 200ms ease;
        }
        .mp-close-btn:hover {
          transform: rotate(90deg) scale(1.1);
          color: #fff;
          background-color: rgba(255, 255, 255, 0.2);
        }
      `}</style>

      {/* ══════════════════════════════════════
          BACKGROUND IMAGE
      ══════════════════════════════════════ */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-[#0a0606]">
        <Image
          src={BgImage}
          alt=""
          fill
          className="object-cover opacity-80"
          style={{ animation: phase === 'warp' ? 'bg-warp-zoom 1.4s ease-in forwards' : 'none' }}
        />
      </div>

      {/* ══════════════════════════════════════
          BACKDROP
      ══════════════════════════════════════ */}
      <button
        type="button"
        aria-label="Close modal"
        onClick={handleClose}
        className="absolute inset-0 z-0 bg-[#0a0606]/40 backdrop-blur-[2px]"
        style={{ animation: 'mp-backdrop-in 280ms ease-out both' }}
      />

      {/* ══════════════════════════════════════
          PHASE 1 · CONFIRMATION PROMPT
      ══════════════════════════════════════ */}
      {phase === 'prompt' && (
        <div
          className="relative z-10 w-full max-w-sm rounded-2xl border border-white/20 p-8 text-center shadow-[0_10px_40px_rgba(0,0,0,0.55)]"
          style={{
            background: 'linear-gradient(135deg, rgba(18,18,28,0.78) 0%, rgba(38,18,42,0.78) 100%)',
            backdropFilter: 'blur(18px)',
            WebkitBackdropFilter: 'blur(18px)',
            animation: 'mp-prompt-in 500ms cubic-bezier(0.2,0.8,0.2,1) both',
            fontFamily: "'Syne', sans-serif"
          }}
        >
          {/* Corner ornaments */}
          <span className="absolute top-2 left-2 h-3 w-3 border-t-2 border-l-2 border-[#2ed4e0]" />
          <span className="absolute right-2 bottom-2 h-3 w-3 border-r-2 border-b-2 border-[#f56236]" />

          <p
            className="mb-2 text-[9px] font-bold tracking-[0.4em] text-[#2ed4e0] uppercase"
            style={{ fontFamily: "'Space Mono', monospace" }}
          >
            SYSTEM READY
          </p>
          <h3
            className="mb-8 text-base font-bold tracking-wider text-white drop-shadow-md"
            style={{ fontFamily: "'Orbitron', sans-serif", lineHeight: 1.5 }}
          >
            Are you ready to begin
            <br />
            the journey?
          </h3>

          <button
            onClick={handleConfirm}
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-full border border-[#f56236] bg-[#f56236]/10 px-10 py-3 tracking-[0.25em] text-[#f56236] transition-all duration-300 hover:bg-[#f56236] hover:text-white hover:shadow-[0_0_24px_rgba(245,98,54,0.65)]"
            style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 700, fontSize: '0.8rem' }}
          >
            <span className="relative z-10">YES</span>
            {/* Shimmer sweep on hover */}
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          </button>
        </div>
      )}

      {/* ══════════════════════════════════════
          PHASE 2 · COUNTDOWN  3 → 2 → 1
      ══════════════════════════════════════ */}
      {phase === 'countdown' && (
        <div className="relative z-10 flex min-h-[320px] min-w-[320px] flex-col items-center justify-center">
          {/* Radial color glow — remounts on each number so animation restarts */}
          <div
            key={`glow-${countdownNum}`}
            className="pointer-events-none absolute"
            style={{
              width: 520,
              height: 520,
              top: '50%',
              left: '50%',
              background: `radial-gradient(circle, ${currentColor}45 0%, transparent 65%)`,
              animation: 'mp-cd-glow 0.9s ease-in-out both'
            }}
          />

          {/* Ring + Number */}
          <div className="relative flex items-center justify-center">
            {/* Depleting SVG ring — key forces full remount every number change */}
            <svg
              key={`ring-${countdownNum}`}
              width={240}
              height={240}
              viewBox="0 0 200 200"
              className="absolute"
              aria-hidden="true"
            >
              {/* Ghost track */}
              <circle cx="100" cy="100" r={RING_R} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1.5" />
              {/* Depleting ring */}
              <circle
                cx="100"
                cy="100"
                r={RING_R}
                fill="none"
                stroke={currentColor}
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={RING_C}
                strokeDashoffset={0}
                style={
                  {
                    transformBox: 'fill-box',
                    transformOrigin: 'center',
                    transform: 'rotate(-90deg)',
                    filter: `drop-shadow(0 0 5px ${currentColor}) drop-shadow(0 0 14px ${currentColor}80)`,
                    animation: 'mp-ring-deplete 0.9s linear forwards'
                  } as React.CSSProperties
                }
              />
            </svg>

            {/* The number — key forces remount for animation restart */}
            <div
              key={`num-${countdownNum}`}
              aria-live="polite"
              style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: 'clamp(5.5rem, 16vw, 9rem)',
                fontWeight: 900,
                lineHeight: 1,
                color: currentColor,
                textShadow: [
                  `0 0 18px ${currentColor}`,
                  `0 0 45px ${currentColor}`,
                  `0 0 90px ${currentColor}70`,
                  `0 0 150px ${currentColor}30`
                ].join(', '),
                animation: 'mp-num-pulse 0.9s ease-in-out forwards',
                userSelect: 'none'
              }}
            >
              {countdownNum}
            </div>
          </div>

          {/* Label */}
          <p
            className="mt-9 text-[0.52rem] uppercase"
            style={{
              fontFamily: "'Space Mono', monospace",
              letterSpacing: '0.5em',
              color: 'rgba(255,255,255,0.28)'
            }}
          >
            INITIATING WARP SEQUENCE
          </p>
        </div>
      )}

      {/* ══════════════════════════════════════
          PHASE 3 · WARP SPEED
      ══════════════════════════════════════ */}
      {phase === 'warp' && (
        <div className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-[60] animate-[warp-flash_1.4s_ease-in-out_forwards]" />
          {warpStreaks.map((s) => (
            <div
              key={s.id}
              className="absolute top-1/2 left-1/2 rounded-full"
              style={
                {
                  backgroundColor: s.color,
                  height: `${s.height}px`,
                  width: `${s.width}px`,
                  transformOrigin: '0 50%',
                  boxShadow: `0 0 ${s.height * 1.5}px ${s.color}`,
                  ['--rot']: `${s.rot}deg`,
                  animation: `warp-streak ${s.duration}s linear ${s.delay}s infinite forwards`
                } as React.CSSProperties
              }
            />
          ))}
        </div>
      )}

      {/* ══════════════════════════════════════
          PHASE 4 · MAIN CARD
      ══════════════════════════════════════ */}
      {phase === 'card' && (
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative z-10 my-8 max-h-[calc(100vh-4rem)] w-full max-w-[720px] overflow-y-auto rounded-2xl border-2 p-6 text-white shadow-xl sm:p-8"
          style={{
            background:
              'linear-gradient(135deg, rgba(230,90,40,0.11) 0%, rgba(130,45,170,0.11) 45%, rgba(59,133,0,0.11) 100%)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            borderColor: 'rgba(255,255,255,0.14)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.45), inset 0 0 60px rgba(46,212,224,0.025)',
            animation: 'mp-warp-reveal 700ms cubic-bezier(0.1,0.9,0.2,1) both',
            isolation: 'isolate',
            fontFamily: "'Syne', sans-serif",
            willChange: 'transform'
          }}
        >
          {/* ── Scan-line sweeps top → bottom once on reveal ── */}
          <div
            className="pointer-events-none absolute inset-x-0 z-30 h-[2px]"
            style={{
              background:
                'linear-gradient(90deg, transparent 0%, #2ed4e0 25%, #f56236 50%, #c139ab 75%, transparent 100%)',
              boxShadow: '0 0 10px #2ed4e0, 0 0 22px rgba(46,212,224,0.35)',
              animation: 'mp-scan 1.3s ease-in 150ms forwards'
            }}
          />

          {/* ── Ambient deep-space glow layers ── */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
            <div
              className="absolute -inset-20"
              style={{
                background:
                  'radial-gradient(circle at 18% 12%, rgba(230,90,40,0.18), transparent 45%),' +
                  'radial-gradient(circle at 85% 85%, rgba(59,133,0,0.22), transparent 50%),' +
                  'radial-gradient(circle at 60% 30%, rgba(130,45,170,0.18), transparent 55%)',
                filter: 'blur(20px)'
              }}
            />
            {[
              { t: '8%', l: '12%', d: '0s', s: 2 },
              { t: '22%', l: '78%', d: '0.6s', s: 3 },
              { t: '40%', l: '32%', d: '1.2s', s: 2 },
              { t: '58%', l: '88%', d: '0.3s', s: 2 },
              { t: '72%', l: '18%', d: '1.8s', s: 3 },
              { t: '86%', l: '55%', d: '0.9s', s: 2 },
              { t: '14%', l: '62%', d: '2.1s', s: 2 },
              { t: '50%', l: '8%', d: '1.5s', s: 3 }
            ].map((p, i) => (
              <span
                key={i}
                className="absolute rounded-full"
                style={{
                  top: p.t,
                  left: p.l,
                  width: p.s,
                  height: p.s,
                  background: '#fff',
                  boxShadow: '0 0 6px #fff, 0 0 12px rgba(230,90,40,0.8)',
                  animation: `mp-twinkle 3.2s ease-in-out ${p.d} infinite`
                }}
              />
            ))}
          </div>

          {/* ── Spinning conic border ring ── */}
          <div className="pointer-events-none absolute -inset-px overflow-hidden rounded-2xl">
            <div
              className="absolute top-1/2 left-1/2 h-[260%] w-[260%] opacity-[0.22]"
              style={{
                background:
                  'conic-gradient(from 0deg, rgba(230,90,40,0.7), rgba(130,45,170,0.7) 30%, rgba(59,133,0,0.7) 60%, rgba(46,212,224,0.7) 80%, rgba(230,90,40,0.7))',
                animation: 'mp-border-rotate 6s linear infinite'
              }}
            />
          </div>

          {/* ── HUD corner brackets ── */}
          {[
            { cls: 'top-2 left-2', rot: '0deg' },
            { cls: 'top-2 right-2', rot: '90deg' },
            { cls: 'bottom-2 right-2', rot: '180deg' },
            { cls: 'bottom-2 left-2', rot: '270deg' }
          ].map((c, i) => (
            <span
              key={i}
              className={`pointer-events-none absolute ${c.cls} h-5 w-5`}
              style={{
                transform: `rotate(${c.rot})`,
                borderTop: '2px solid #2ed4e0',
                borderLeft: '2px solid #2ed4e0',
                boxShadow: '0 0 10px rgba(46,212,224,0.6)'
              }}
            />
          ))}

          {/* ── Close Button — proper SVG ✕ ── */}
          <button
            type="button"
            aria-label="Close member detail"
            onClick={handleClose}
            className="mp-close-btn absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full border"
            style={{
              borderColor: 'rgba(245,98,54,0.6)',
              color: '#f56236',
              background: 'rgba(20,10,14,0.6)',
              boxShadow: '0 0 14px rgba(245,98,54,0.35), inset 0 0 10px rgba(245,98,54,0.15)',
              backdropFilter: 'blur(6px)'
            }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          </button>

          {/* ── Profile Image ── */}
          <div
            className="mp-img-wrap relative mb-5 overflow-hidden rounded-2xl border"
            style={{
              borderColor: 'rgba(230,90,40,0.5)',
              boxShadow: '0 0 24px -4px rgba(230,90,40,0.5), inset 0 0 30px rgba(130,45,170,0.2)',
              animation: 'mp-holo-in 600ms 120ms ease-out both'
            }}
          >
            <Image src={ProfileImage} alt="Profile Image" className="h-120 w-full object-cover object-center" />
            {/* Holographic color overlay */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'linear-gradient(135deg, rgba(46,212,224,0.14) 0%, transparent 40%, transparent 60%, rgba(130,45,170,0.2) 100%)',
                mixBlendMode: 'screen'
              }}
            />
            {/* CRT scanlines */}
            <div
              className="pointer-events-none absolute inset-0 opacity-25"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(180deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 1px, transparent 1px, transparent 3px)'
              }}
            />
            {/* Shimmer otomatis */}
            <div
              className="mp-img-shimmer pointer-events-none absolute inset-y-0 left-0 w-1/3"
              style={{
                background:
                  'linear-gradient(115deg, transparent 0%, rgba(230,90,40,0.35) 43%, rgba(255,255,255,0.55) 50%, rgba(46,212,224,0.35) 57%, transparent 100%)',
                animation: 'mp-shimmer 1.8s ease-in-out infinite',
                mixBlendMode: 'screen'
              }}
            />
          </div>

          {/* ── Shuriken stars ── */}
          {[
            { t: '10%', l: '15%', d: '-1s' },
            { t: '25%', l: '80%', d: '-2.5s' },
            { t: '50%', l: '5%', d: '-0.5s' },
            { t: '70%', l: '90%', d: '-3s' },
            { t: '85%', l: '20%', d: '-1.5s' },
            { t: '15%', l: '60%', d: '-2s' },
            { t: '40%', l: '70%', d: '-3.5s' },
            { t: '60%', l: '30%', d: '-0.8s' },
            { t: '92%', l: '75%', d: '-1.2s' }
          ].map((s, i) => (
            <span key={i} className="space-shuriken" style={{ top: s.t, left: s.l, animationDelay: s.d }} />
          ))}

          {/* ── Name + NRP ── */}
          <div className="pr-10" style={{ animation: 'mp-holo-in 600ms 180ms ease-out both' }}>
            <p
              className="mb-1 text-[9px] uppercase"
              style={{
                fontFamily: "'Space Mono', monospace",
                letterSpacing: '0.38em',
                color: 'rgba(245,230,200,0.9)'
              }}
            >
              ◇ CREW IDENTITY
            </p>
            {/* Scramble effect reveals the name on card appear */}
            <h2
              className="text-2xl font-black"
              style={{
                fontFamily: "'Orbitron', sans-serif",
                color: '#ffffff',
                animation: 'mp-flicker 4.2s ease-in-out 2s infinite',
                letterSpacing: '0.01em',
                wordBreak: 'break-word'
              }}
            >
              {scrambledName}
            </h2>
            <p
              className="mt-1 text-sm font-semibold"
              style={{ fontFamily: "'Space Mono', monospace", color: 'rgba(255,255,255,0.85)' }}
            >
              <span style={{ color: '#f56236' }}>[ID://]</span> 5027251022 ·{' '}
              <span style={{ color: '#2ed4e0' }}>ORIGIN</span> Surabaya
            </p>
          </div>

          {/* ── Socials ── */}
          <div className="mt-5 flex gap-2" style={{ animation: 'mp-holo-in 600ms 240ms ease-out both' }}>
            <div className="mp-social-wrap">
              <Instagram username="satrio.utomo_" />
            </div>
            <div className="mp-social-wrap">
              <LinkedInButtonLink username="msatrioutomo" />
            </div>
          </div>

          {/* ── Hobi + Fun Fact ── */}
          <div
            className="mt-6 grid gap-4 text-sm font-semibold sm:grid-cols-2"
            style={{ animation: 'mp-holo-in 600ms 300ms ease-out both' }}
          >
            {/* Hobi */}
            <div
              className="mp-card-tile relative rounded-xl border p-4"
              style={{
                borderColor: 'rgba(46,212,224,0.4)',
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <span
                className="pointer-events-none absolute top-1 left-1 h-2 w-2 border-t border-l"
                style={{ borderColor: 'rgba(46,212,224,0.85)' }}
              />
              <span
                className="pointer-events-none absolute right-1 bottom-1 h-2 w-2 border-r border-b"
                style={{ borderColor: 'rgba(230,90,40,0.85)' }}
              />
              <p
                className="text-xs uppercase"
                style={{ color: '#2ed4e0', letterSpacing: '0.22em', fontFamily: "'Space Mono', monospace" }}
              >
                ▣ Hobi
              </p>
              <p className="mt-2 font-normal text-white/90" style={{ fontFamily: "'Syne', sans-serif" }}>
                Nonton film, main musik, main game
              </p>
            </div>

            {/* Fun Fact */}
            <div
              className="mp-card-tile relative rounded-xl border p-4"
              style={{
                borderColor: 'rgba(230,90,40,0.4)',
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <span
                className="pointer-events-none absolute top-1 left-1 h-2 w-2 border-t border-l"
                style={{ borderColor: 'rgba(176,76,95,0.85)' }}
              />
              <span
                className="pointer-events-none absolute right-1 bottom-1 h-2 w-2 border-r border-b"
                style={{ borderColor: 'rgba(56,159,183,0.85)' }}
              />
              <p
                className="text-xs uppercase"
                style={{ color: '#f56236', letterSpacing: '0.22em', fontFamily: "'Space Mono', monospace" }}
              >
                ✦ Fun Fact
              </p>
              <p className="mt-2 font-normal text-white/90" style={{ fontFamily: "'Syne', sans-serif" }}>
                Suka makan, jadi kalo ada yang mau ngajak makan jangan lupa ngajak aku
              </p>
            </div>
          </div>

          {/* ── Lagu Favorit + Spotify ── */}
          <div
            className="mp-card-tile relative mt-4 rounded-xl border p-4"
            style={{
              borderColor: 'rgba(59,133,0,0.45)',
              background: 'rgba(255,255,255,0.05)',
              backdropFilter: 'blur(10px)',
              animation: 'mp-holo-in 600ms 360ms ease-out both'
            }}
          >
            <span
              className="pointer-events-none absolute top-1 left-1 h-2 w-2 border-t border-l"
              style={{ borderColor: 'rgba(230,90,40,0.85)' }}
            />
            <span
              className="pointer-events-none absolute top-1 right-1 h-2 w-2 border-t border-r"
              style={{ borderColor: 'rgba(193,57,171,0.85)' }}
            />
            <span
              className="pointer-events-none absolute bottom-1 left-1 h-2 w-2 border-b border-l"
              style={{ borderColor: 'rgba(46,212,224,0.85)' }}
            />
            <span
              className="pointer-events-none absolute right-1 bottom-1 h-2 w-2 border-r border-b"
              style={{ borderColor: 'rgba(245,230,200,0.85)' }}
            />

            <div className="flex items-center justify-between">
              <p
                className="flex items-center gap-2 text-xs font-bold uppercase"
                style={{ color: '#2ed4e0', letterSpacing: '0.28em', fontFamily: "'Space Mono', monospace" }}
              >
                ▶ Lagu Favorit
              </p>
              {/* Audio visualizer bars */}
              <div className="flex h-4 items-end gap-[3px]">
                {['#e65a28', '#822daa', '#3b8500', '#e2ba4e', '#f1e9e9'].map((c, i) => (
                  <span
                    key={i}
                    className="block w-[3px] rounded-sm"
                    style={{
                      height: '100%',
                      background: c,
                      boxShadow: `0 0 6px ${c}`,
                      transformOrigin: 'bottom',
                      animation: `mp-wave 1.${2 + i}s ease-in-out ${i * 0.12}s infinite`
                    }}
                  />
                ))}
              </div>
            </div>

            <p className="my-2 text-sm font-semibold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
              Sign Of The Times — Harry Styles
            </p>

            <div className="mt-3 opacity-90 transition-opacity hover:opacity-100">
              <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/5Ohxk2dO5COHF1krpoPigN?si=9674dd19694b4299" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MemberPopup
