'use client'

import { useCallback, useEffect, useState, useRef } from 'react'

import Image from 'next/image'

import { createPortal } from 'react-dom'

import Instagram from '@/components/atoms/button/InstagramButtonLink'
import LinkedInButtonLink from '@/components/atoms/button/LinkedInButtonLink'
import SpotifyEmbed from '@/components/molecules/SpotifyEmbed'

import ProfileImage from './image.png'

type MemberPopupProps = {
  onClose: () => void
  isOpen?: boolean
}

type SkillType = {
  label: string
  val: number
}

// ─── view states ────────────────────────────────────────────────
type ViewState = 'terminal' | 'globe' | 'profile'

// ─── sub-components (unchanged) ─────────────────────────────────

function ScanlineOverlay() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-10 overflow-hidden rounded-2xl"
      style={{
        background:
          'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,255,200,0.015) 3px, rgba(0,255,200,0.015) 4px)'
      }}
    />
  )
}

function NodeDot({ color = '#00ffc8', size = 5, pulse = false }: { color?: string; size?: number; pulse?: boolean }) {
  return (
    <span className="relative inline-flex" style={{ width: size, height: size }}>
      {pulse && (
        <span
          className="absolute inline-flex h-full w-full animate-ping rounded-full"
          style={{ backgroundColor: color, opacity: 0.5 }}
        />
      )}
      <span
        className="relative inline-flex rounded-full"
        style={{ width: size, height: size, backgroundColor: color }}
      />
    </span>
  )
}

function CoordTicker({ lat = -7.575, lng = 110.827 }: { lat?: number; lng?: number }) {
  const [tick, setTick] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1800)
    return () => clearInterval(id)
  }, [])
  const jitter = (v: number) => (v + Math.sin(tick * 1.7) * 0.00003).toFixed(6)
  return (
    <div className="font-mono text-[10px] leading-tight">
      <span className="text-teal-400">φ</span>
      <span className="ml-1 text-cyan-300">{jitter(lat)}°</span>
      <span className="ml-2 text-teal-400">λ</span>
      <span className="ml-1 text-cyan-300">{jitter(lng)}°</span>
    </div>
  )
}

function SignalBars({ level = 4, max = 5, color = '#00ffc8' }: { level?: number; max?: number; color?: string }) {
  return (
    <span className="inline-flex items-end gap-[2px]">
      {Array.from({ length: max }).map((_, i) => (
        <span
          key={i}
          style={{
            width: 3,
            height: 4 + i * 2,
            backgroundColor: i < level ? color : 'rgba(255,255,255,0.1)',
            borderRadius: 1,
            display: 'inline-block'
          }}
        />
      ))}
    </span>
  )
}

function TelChip({
  label,
  value,
  ok = true,
  pulse = false
}: {
  label: string
  value: string
  ok?: boolean
  pulse?: boolean
}) {
  return (
    <div
      className="flex items-center gap-1.5 rounded border px-2 py-1"
      style={{
        borderColor: ok ? 'rgba(0,255,200,0.3)' : 'rgba(249,115,22,0.4)',
        background: ok ? 'rgba(0,255,200,0.05)' : 'rgba(249,115,22,0.07)'
      }}
    >
      <NodeDot color={ok ? '#00ffc8' : '#f97316'} size={5} pulse={pulse} />
      <span className="font-mono text-[9px] tracking-widest text-teal-400 uppercase">{label}</span>
      <span className="ml-auto font-mono text-[9px] font-bold" style={{ color: ok ? '#67e8f9' : '#fb923c' }}>
        {value}
      </span>
    </div>
  )
}

function HexAccent({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={`opacity-20 ${className}`} xmlns="http://www.w3.org/2000/svg">
      <polygon points="20,2 36,11 36,29 20,38 4,29 4,11" fill="none" stroke="#00ffc8" strokeWidth="1" />
    </svg>
  )
}

// ─── ProfileWithCrosshair — with animated scope/keker pan ────────
function ProfileWithCrosshair() {
  const [panStep, setPanStep] = useState(0)
  const positions = [
    { x: -40, y: -22 },
    { x: 15, y: -10 },
    { x: 29, y: -63 },
    { x: -14, y: -65 },
    { x: -30, y: 27 },
    { x: 10, y: -57 },
    { x: 0, y: 0 },
    { x: 23, y: 47 }
  ]

  // Keyframe positions for scope pan — object-position shifts
  useEffect(() => {
    const id = setInterval(() => {
      setPanStep((s) => (s + 1) % 8)
    }, 900)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="group relative overflow-hidden rounded-xl border border-teal-500/30 bg-black">
      <Image
        src={ProfileImage}
        alt="Profile"
        className="h-84 w-full object-cover object-[center_18%] brightness-75 contrast-125 saturate-[1.2]"
        style={{
          // objectPosition: panKeyframes[panStep],
          // transition: 'object-position 1.6s cubic-bezier(0.4,0,0.2,1)',
          // transform: 'scale(1.06)',
          // transformOrigin: 'center'

          transform: `
           scale(1.48)
          translate(${positions[panStep].x}px, ${positions[panStep].y}px)
        `,
          transition: 'transform 1.5s ease-in-out'
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {[25, 50, 75].map((v) => (
          <g key={v}>
            <line x1={v} y1="0" x2={v} y2="100" stroke="rgba(0,255,200,0.12)" strokeWidth="0.4" />
            <line x1="0" y1={v} x2="100" y2={v} stroke="rgba(0,255,200,0.12)" strokeWidth="0.4" />
          </g>
        ))}
        <line x1="50" y1="38" x2="50" y2="62" stroke="#00ffc8" strokeWidth="0.5" opacity="0.7" />
        <line x1="38" y1="50" x2="62" y2="50" stroke="#00ffc8" strokeWidth="0.5" opacity="0.7" />
        <line x1="50" y1="46" x2="50" y2="54" stroke="#000" strokeWidth="2" opacity="0.7" />
        <line x1="46" y1="50" x2="54" y2="50" stroke="#000" strokeWidth="2" opacity="0.7" />
        <circle cx="50" cy="50" r="7" fill="none" stroke="#00ffc8" strokeWidth="0.5" opacity="0.5" />
        <circle
          cx="50"
          cy="50"
          r="14"
          fill="none"
          stroke="#00ffc8"
          strokeWidth="0.3"
          strokeDasharray="2 3"
          opacity="0.3"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 50 50"
            to="360 50 50"
            dur="8s"
            repeatCount="indefinite"
          />
        </circle>
        <circle
          cx="50"
          cy="50"
          r="22"
          fill="none"
          stroke="#00ffc8"
          strokeWidth="0.2"
          strokeDasharray="1 4"
          opacity="0.15"
        />
        {[33, 38, 62, 67].map((x) => (
          <line key={`tx${x}`} x1={x} y1="48.5" x2={x} y2="51.5" stroke="#00ffc8" strokeWidth="0.4" opacity="0.45" />
        ))}
        {[33, 38, 62, 67].map((y) => (
          <line key={`ty${y}`} x1="48.5" y1={y} x2="51.5" y2={y} stroke="#00ffc8" strokeWidth="0.4" opacity="0.45" />
        ))}
        <path d="M4,4 L4,11 M4,4 L11,4" fill="none" stroke="#00ffc8" strokeWidth="0.8" opacity="0.6" />
        <path d="M96,4 L96,11 M96,4 L89,4" fill="none" stroke="#00ffc8" strokeWidth="0.8" opacity="0.6" />
        <path d="M4,96 L4,89 M4,96 L11,96" fill="none" stroke="#00ffc8" strokeWidth="0.8" opacity="0.6" />
        <path d="M96,96 L96,89 M96,96 L89,96" fill="none" stroke="#00ffc8" strokeWidth="0.8" opacity="0.6" />
      </svg>
      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 rounded border border-teal-500/40 bg-black/70 px-2 py-1 backdrop-blur-sm">
        <NodeDot color="#00ffc8" size={5} pulse />
        <span className="font-mono text-[8px] tracking-widest text-teal-300">GNSS · FIX 3D</span>
      </div>
      <div className="absolute top-2.5 right-2.5 rounded border border-teal-500/30 bg-black/70 px-2 py-1 backdrop-blur-sm">
        <CoordTicker />
      </div>
      <div className="absolute right-0 bottom-0 left-0 p-3">
        <div className="flex items-end justify-between">
          <div>
            <h2
              className="font-mono text-xl font-black tracking-tighter text-white"
              style={{ textShadow: '0 0 10px rgba(0,255,200,0.4)' }}
            >
              Hasheemi Rafsanjani
            </h2>
            <p className="mt-0.5 font-mono text-[9px] text-teal-400">Geodesy × IoT Fusion Enthusiast ~~~ MHS ITS</p>
          </div>
          <div className="font-mono text-[8px] text-purple-400">TILE: 49M_0082</div>
        </div>
      </div>
    </div>
  )
}

// ─── Terminal screen ─────────────────────────────────────────────

type TermLine = {
  text: string
  color: 'teal' | 'cyan' | 'red' | 'yellow' | 'dim' | 'white' | 'default'
  id: number
}

let lineId = 0

function TerminalScreen({ onSuccess, onClose }: { onSuccess: () => void; onClose: () => void }) {
  const [lines, setLines] = useState<TermLine[]>([
    { id: lineId++, text: 'Last login: Sun Jun 08 06:42:28 2025 from 10.14.17.3', color: 'teal' },
    { id: lineId++, text: '──────────────────────────────────────────────────', color: 'dim' },
    { id: lineId++, text: 'GEO TERMINAL v4.2.1 · DATUM: WGS84 · ZONE: 49M · EPSG:32649', color: 'cyan' },
    { id: lineId++, text: 'System: Ubuntu 22.04 LTS · Kernel 5.19.0-UNIX · uptime 4d 11h', color: 'dim' }
  ])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const bodyRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const addLine = (text: string, color: TermLine['color'] = 'default') => {
    setLines((prev) => [...prev, { id: lineId++, text, color }])
  }

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight
  }, [lines])

  const colorClass: Record<TermLine['color'], string> = {
    teal: 'text-teal-400',
    cyan: 'text-cyan-300',
    red: 'text-red-400',
    yellow: 'text-yellow-400',
    dim: 'text-teal-700',
    white: 'text-white',
    default: 'text-gray-300'
  }

  const handleCommand = (cmd: string) => {
    if (busy) return
    const trimmed = cmd.trim()

    // echo the command
    addLine(`user@geoterm:~$ ${trimmed}`, 'dim')

    if (trimmed === 'ls') {
      addLine('CardMember.tsx   image.png   MemberPopup.tsx', 'cyan')
    } else if (trimmed === 'pwd') {
      addLine('/home/evastra25/members', 'teal')
      // trimmed === 'sudo profile 15'
    } else if (trimmed === 'whoami') {
      addLine('manusia,anakadam', 'teal')
      // trimmed === 'sudo profile 15'
    } else if (trimmed === 'sudo profile 15') {
      setBusy(true)
      addLine('[sudo] password for evastra25/015: ········', 'yellow')
      setTimeout(() => {
        addLine('Password accepted · Role: GE_ADMIN', 'teal')
        addLine('Authenticating profile 015 ...', 'dim')
        setTimeout(() => {
          addLine('✓ Authorization granted · Decrypting entity record · GNSS FIX 3D', 'teal')
          setTimeout(() => {
            onSuccess()
          }, 700)
        }, 800)
      }, 600)
    } else if (trimmed === 'sudo profile 015') {
      setBusy(true)
      addLine('[sudo] password for evastra25/015: ········', 'yellow')
      setTimeout(() => {
        addLine('Password accepted · Role: GE_ADMIN', 'teal')
        addLine('Authenticating profile 015 ...', 'dim')
        setTimeout(() => {
          addLine('✓ Authorization granted · Decrypting entity record · GNSS FIX 3D', 'teal')
          setTimeout(() => {
            onSuccess()
          }, 700)
        }, 800)
      }, 600)
    } else if (/^sudo profile \d+$/.test(trimmed)) {
      const num = trimmed.match(/\d+$/)?.[0]
      addLine(`Checking entity ${num} ...`, 'dim')
      setTimeout(() => {
        addLine(`✗ AUTHORIZATION FAILED · Entity ${num} not found in GNSS registry`, 'red')
        addLine(`ERR: ACCESS_DENIED · EPSG:32649 · Sector mismatch · Clearance insufficient`, 'red')
        addLine(
          `Logging attempt · IP: 10.14.17.3 · Incident ID: GEO-${Math.floor(Math.random() * 9999)
            .toString()
            .padStart(4, '0')}`,
          'yellow'
        )
      }, 600)
    } else if (trimmed === 'help') {
      addLine('Available commands: ls  pwd  sudo profile [ID]  clear  help  exit  whoami', 'dim')
    } else if (trimmed === 'clear') {
      setLines([])
    } else if (trimmed === 'exit') {
      addLine('Closing the terminal........', 'red')
      onClose()
    } else if (trimmed === '') {
      // do nothing
    } else {
      addLine(`command not found: ${trimmed} · try 'help'`, 'red')
    }
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(input)
      setInput('')
    }
  }

  return (
    <div
      className="flex flex-col"
      style={{ background: 'linear-gradient(135deg, #020c0a 0%, #040d14 50%, #060810 100%)' }}
    >
      {/* Title bar */}
      <div
        className="flex items-center gap-2 border-b px-4 py-2"
        style={{ borderColor: 'rgba(0,255,200,0.15)', background: 'rgba(0,255,200,0.04)' }}
      >
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
        </div>
        <span className="ml-2 font-mono text-[9px] tracking-[0.2em] text-teal-500 uppercase">
          GEO TERMINAL · SECURE SHELL
        </span>
        <span className="ml-auto font-mono text-[9px] text-teal-700">SSH-2.0-OpenSSH_9.1</span>
      </div>

      {/* Output body */}
      <div
        ref={bodyRef}
        className="flex flex-col gap-0.5 overflow-y-auto p-4"
        style={{ minHeight: '220px', maxHeight: '320px' }}
      >
        {lines.map((l) => (
          <div key={l.id} className={`font-mono text-[12px] leading-relaxed ${colorClass[l.color]}`}>
            {l.text}
          </div>
        ))}
      </div>

      {/* Input row */}
      <div className="flex items-center gap-2 border-t px-4 py-3" style={{ borderColor: 'rgba(0,255,200,0.12)' }}>
        <span className="shrink-0 font-mono text-[12px] text-teal-400">user@geoterm:~$</span>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          disabled={busy}
          autoFocus
          autoComplete="off"
          spellCheck={false}
          className="flex-1 bg-transparent font-mono text-[12px] text-white outline-none placeholder:text-teal-800"
          style={{ caretColor: '#00ffc8' }}
        />
        <span className="h-3.5 w-1.5 animate-pulse" style={{ background: '#00ffc8', opacity: busy ? 0 : 1 }} />
      </div>

      {/* Hint bar */}
      <div
        className="px-4 py-2 text-center font-mono text-[13px] tracking-widest"
        style={{ borderTop: '1px solid rgba(0,255,200,0.08)', color: 'rgba(0,255,200,0.35)' }}
      >
        type <span style={{ color: 'rgba(0,255,200,0.7)' }}>&apos;sudo profile 015&apos;</span> to access · also try{' '}
        <span style={{ color: 'rgba(0,255,200,0.5)' }}>ls</span>
        {', '}
        <span style={{ color: 'rgba(0,255,200,0.5)' }}>pwd</span>
      </div>
    </div>
  )
}

// ─── Globe transition screen ────────────────────────────────────

const GLOBE_STEPS = [
  'DECRYPTING PROFILE · SECTOR 49M',
  'FETCHING GNSS FIX · 14/16 SATS',
  'VERIFYING AES-256 HANDSHAKE …',
  'LOADING ENTITY RECORD · 015',
  'ESTABLISHING SECURE CHANNEL …'
]

function GlobeScreen({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // advance text steps
    const textId = setInterval(() => {
      setStep((s) => Math.min(s + 1, GLOBE_STEPS.length - 1))
    }, 550)

    // progress bar
    const startTime = Date.now()
    const duration = 3000
    const rafId = { current: 0 }
    const tick = () => {
      const elapsed = Date.now() - startTime
      const pct = Math.min(elapsed / duration, 1)
      setProgress(pct * 100)
      if (pct < 1) {
        rafId.current = requestAnimationFrame(tick)
      } else {
        clearInterval(textId)
        onDone()
      }
    }
    rafId.current = requestAnimationFrame(tick)

    return () => {
      clearInterval(textId)
      cancelAnimationFrame(rafId.current)
    }
  }, [onDone])

  return (
    <div
      className="flex flex-col items-center justify-center gap-5 py-16"
      style={{ background: 'linear-gradient(135deg, #020c0a 0%, #040d14 50%, #060810 100%)' }}
    >
      {/* Animated globe SVG */}
      <div style={{ filter: 'drop-shadow(0 0 14px #00ffc8)' }}>
        <svg width="110" height="110" viewBox="0 0 110 110" xmlns="http://www.w3.org/2000/svg">
          <circle cx="55" cy="55" r="44" fill="none" stroke="rgba(0,255,200,0.35)" strokeWidth="1.5" />
          <ellipse cx="55" cy="55" rx="20" ry="44" fill="none" stroke="rgba(0,255,200,0.2)" strokeWidth="1" />
          <ellipse cx="55" cy="55" rx="44" ry="20" fill="none" stroke="rgba(0,255,200,0.2)" strokeWidth="1" />
          <line x1="11" y1="55" x2="99" y2="55" stroke="rgba(0,255,200,0.12)" strokeWidth="1" />
          <line x1="55" y1="11" x2="55" y2="99" stroke="rgba(0,255,200,0.12)" strokeWidth="1" />
          {/* rotating ring */}
          <circle
            cx="55"
            cy="55"
            r="28"
            fill="none"
            stroke="#00ffc8"
            strokeWidth="0.8"
            strokeDasharray="4 6"
            opacity="0.5"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 55 55"
              to="360 55 55"
              dur="3s"
              repeatCount="indefinite"
            />
          </circle>
          {/* center dot */}
          <circle cx="55" cy="55" r="3" fill="#00ffc8" />
          {/* crosshair arms */}
          <line x1="55" y1="35" x2="55" y2="47" stroke="#00ffc8" strokeWidth="1.5" opacity="0.9" />
          <line x1="55" y1="63" x2="55" y2="75" stroke="#00ffc8" strokeWidth="1.5" opacity="0.9" />
          <line x1="35" y1="55" x2="47" y2="55" stroke="#00ffc8" strokeWidth="1.5" opacity="0.9" />
          <line x1="63" y1="55" x2="75" y2="55" stroke="#00ffc8" strokeWidth="1.5" opacity="0.9" />
        </svg>
      </div>

      {/* Status text */}
      <div className="font-mono text-[10px] tracking-[0.25em] text-teal-400 uppercase" style={{ minHeight: '16px' }}>
        {GLOBE_STEPS[step]}
      </div>

      {/* Progress bar */}
      <div className="h-0.5 w-56 overflow-hidden rounded-full" style={{ background: 'rgba(0,255,200,0.1)' }}>
        <div
          className="h-full rounded-full"
          style={{
            width: `${progress}%`,
            background: '#00ffc8',
            transition: 'width 0.05s linear'
          }}
        />
      </div>

      <div className="font-mono text-[8px] tracking-[0.15em] text-teal-800">AES-256 · HANDSHAKE OK · GNSS FIX 3D</div>
    </div>
  )
}

// ─── Main export ────────────────────────────────────────────────

export default function MemberPopup({ onClose, isOpen = true }: MemberPopupProps) {
  const [view, setView] = useState<ViewState>('terminal')

  const closePopup = useCallback(() => {
    setView('terminal')
    onClose()
  }, [onClose])

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closePopup()
      }
    }

    // Lock body scroll - prevent background from scrolling
    const scrollY = window.scrollY
    document.body.style.overflow = 'hidden'
    document.body.style.position = 'fixed'
    document.body.style.width = '100%'
    document.body.style.top = `-${scrollY}px`

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      // Restore body scroll
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
      document.body.style.top = ''
      window.scrollTo(0, scrollY)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, closePopup])

  if (!isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-hidden bg-black/85 backdrop-blur-md">
      <button type="button" onClick={closePopup} className="absolute inset-0" aria-label="Close" />

      <div
        className="relative z-10 h-[100dvh] max-h-[100dvh] w-full max-w-[720px] animate-[member-popup-show_200ms_ease-out] overflow-y-auto overscroll-contain rounded-2xl"
        style={{
          background: 'linear-gradient(135deg, #020c0a 0%, #040d14 50%, #060810 100%)',
          border: '1px solid rgba(0,255,200,0.2)',
          boxShadow: '0 0 60px rgba(0,255,200,0.08), 0 0 120px rgba(59,130,246,0.05), inset 0 0 60px rgba(0,0,0,0.5)'
        }}
      >
        <ScanlineOverlay />

        {/* ── TERMINAL VIEW ── */}
        {view === 'terminal' && <TerminalScreen onSuccess={() => setView('globe')} onClose={closePopup} />}

        {/* ── GLOBE TRANSITION ── */}
        {view === 'globe' && <GlobeScreen onDone={() => setView('profile')} />}

        {/* ── PROFILE VIEW ── */}
        {view === 'profile' && (
          <>
            {/* Top status bar */}
            <div
              className="top-6 z-20 mt-12 flex flex-wrap items-center justify-between gap-2 border-b px-4 py-2"
              style={{ borderColor: 'rgba(0,255,200,0.12)', background: 'rgba(0,255,200,0.04)' }}
            >
              <div className="flex items-center gap-2">
                <NodeDot color="#00ffc8" size={6} pulse />
                <span className="font-mono text-[9px] tracking-[0.2em] text-teal-400 uppercase">
                  HASHEEMI Workstation v4.2.1
                </span>
              </div>
              <div className="flex items-center gap-3 font-mono text-[9px]">
                <span className="text-teal-600">
                  SESSION: <span className="text-teal-400">0xA3F8</span>
                </span>
                <span className="text-teal-600">
                  ENC: <span className="text-cyan-400">AES-256</span>
                </span>
                <span className="text-teal-600">
                  UTC: <span className="text-cyan-400">06:42:28Z</span>
                </span>
              </div>
              <button
                onClick={closePopup}
                className="ml-auto flex h-10 w-10 items-center justify-center rounded border border-teal-500/40 bg-black/80 font-mono text-[16px] text-teal-400 transition-colors hover:bg-teal-500/20 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Main content */}
            <div className="relative space-y-4 p-4 sm:p-5">
              {/* Telemetry chips */}
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                <TelChip label="SATS" value="14/16" ok />
                <TelChip label="PDOP" value="0.82" ok />
                <TelChip label="PKT_LOSS" value="0.3%" ok />
                <TelChip label="BASELINE" value="2.31m" ok />
              </div>

              {/* Foto crosshair */}
              <ProfileWithCrosshair />

              {/* Entity record + social */}
              <div
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border p-3"
                style={{ borderColor: 'rgba(59,130,246,0.25)', background: 'rgba(0,5,15,0.8)' }}
              >
                <div>
                  <div className="mb-1 font-mono text-[8px] tracking-[0.2em] text-blue-500 uppercase">
                    &gt; ENTITY.RECORD
                  </div>
                  <div className="font-mono text-xs text-blue-200">
                    ID: <span className="text-cyan-300">5027251015</span>
                    <span className="mx-2 text-blue-600">·</span>
                    LOC: <span className="text-cyan-300">Gresik</span>
                  </div>
                  <div className="mt-1 font-mono text-[9px] text-blue-400">
                    DATUM: WGS84 · ZONE: 49M · EPSG:<span className="text-cyan-400">32649</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Instagram username="hash.rfs" />
                  <LinkedInButtonLink username="hasheemi-rafsanjani-b7a620379" />
                </div>
              </div>

              {/* Hobi + Fun Fact */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div
                  className="relative overflow-hidden rounded-xl border p-3"
                  style={{ borderColor: 'rgba(0,255,200,0.2)', background: 'rgba(0,12,10,0.9)' }}
                >
                  <HexAccent className="absolute -top-2 -right-2 h-12 w-12" />
                  <div className="mb-2 font-mono text-[10px] tracking-[0.2em] text-teal-500 uppercase">
                    &gt; SYS.HOBI
                  </div>
                  <p className="font-mono text-[16px] text-teal-100">Nonton Siaran Olahraga</p>
                  <div className="mt-3 space-y-1.5">
                    {[
                      { label: 'Volley', val: 90 },
                      { label: 'Football', val: 84 },
                      { label: 'Motogp', val: 58 }
                    ].map((s: SkillType) => (
                      <div key={s.label} className="flex items-center gap-2">
                        <span className="w-24 shrink-0 font-mono text-[12px] text-teal-600">{s.label}</span>
                        <div className="h-1 flex-1 rounded-full bg-teal-950">
                          <div
                            className="h-1 rounded-full"
                            style={{ width: `${s.val}%`, background: 'linear-gradient(90deg, #00ffc8, #3b82f6)' }}
                          />
                        </div>
                        <span className="w-6 text-right font-mono text-[12px] text-cyan-400">{s.val}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div
                  className="relative overflow-hidden rounded-xl border p-3"
                  style={{ borderColor: 'rgba(168,85,247,0.25)', background: 'rgba(5,0,15,0.9)' }}
                >
                  <HexAccent className="absolute -bottom-2 -left-2 h-12 w-12" />
                  <div className="mb-2 font-mono text-[10px] tracking-[0.2em] text-purple-400 uppercase">
                    &gt; SYS.FUNFACT
                  </div>
                  <p className="mb-3 font-mono text-[16px] leading-relaxed text-purple-100">Aku plg muda di IT 2025</p>
                  <div className="space-y-1.5 border-t border-purple-900/40 pt-2">
                    <div className="flex justify-between font-mono text-[12px]">
                      <span className="text-purple-500">Pelatt</span>
                      <div className="flex items-center gap-1">
                        <SignalBars level={4} color="#a855f7" />
                        <span className="text-purple-300">+9.2 dB</span>
                      </div>
                    </div>
                    <div className="flex justify-between font-mono text-[12px]">
                      <span className="text-purple-500">Mangan cepet</span>
                      <div className="flex items-center gap-1">
                        <SignalBars level={3} color="#7c3aed" />
                        <span className="text-purple-300">-87 dBm</span>
                      </div>
                    </div>
                    <div className="flex justify-between font-mono text-[12px]">
                      <span className="text-purple-500">aga rohis</span>
                      <span className="text-cyan-300">Level 1 · 23ms</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lagu Favorit */}
              <div
                className="overflow-hidden rounded-xl border"
                style={{ borderColor: 'rgba(59,130,246,0.25)', background: 'rgba(0,5,15,0.9)' }}
              >
                <div
                  className="flex items-center justify-between border-b px-3 py-2"
                  style={{ borderColor: 'rgba(59,130,246,0.15)', background: 'rgba(59,130,246,0.05)' }}
                >
                  <div>
                    <div className="mb-0.5 font-mono text-[8px] tracking-widest text-blue-500 uppercase">
                      /media/stream :: OTA · BUFFER_OK
                    </div>
                    <div className="font-mono text-sm font-semibold text-blue-200">FSTVLST</div>
                  </div>
                  <div className="flex flex-col items-end gap-0.5">
                    <SignalBars level={5} color="#3b82f6" />
                    <span className="font-mono text-[7px] text-blue-500">320kbps</span>
                  </div>
                </div>
                <div className="p-3">
                  <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/1i7cOGKkxWacG8ffHC3nBz?si=6c154513c7824e12" />
                </div>
              </div>

              {/* Bottom status strip */}
              <div
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg px-3 py-2"
                style={{ background: 'rgba(0,255,200,0.04)', border: '1px solid rgba(0,255,200,0.1)' }}
              >
                <div className="font-mono text-[8px] text-teal-700">© Geo Terminal · HASHHASH## · 2025</div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>,
    document.body
  )
}
