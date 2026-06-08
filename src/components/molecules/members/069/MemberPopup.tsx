'use client'

import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import SpotifyEmbed from '@/components/molecules/SpotifyEmbed'
import ProfileImage from './image.png'

type MemberPopupProps = {
  isOpen: boolean
  onClose: () => void
}

// ── Static petal positions: [top%, left%, rotateDeg, scale, opacity]
const STATIC_PETALS: [number, number, number, number, number][] = [
  [4, 4, 18, 1.1, 0.45],
  [7, 88, -22, 0.9, 0.35],
  [48, 2, 35, 1.0, 0.25],
  [50, 93, -28, 0.9, 0.22],
]

const PetalSVG = ({
  top, left, rotate, scale, opacity,
}: {
  top: number; left: number; rotate: number; scale: number; opacity: number
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 32"
    aria-hidden="true"
    style={{
      position: 'absolute',
      top: `${top}%`,
      left: `${left}%`,
      width: `${14 * scale}px`,
      height: `${18 * scale}px`,
      transform: `rotate(${rotate}deg)`,
      opacity,
      pointerEvents: 'none',
      zIndex: 0,
    }}
  >
    <defs>
      <radialGradient id={`pg-${top}-${left}`} cx="40%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#fce7f3" />
        <stop offset="60%" stopColor="#fbcfe8" />
        <stop offset="100%" stopColor="#f9a8d4" />
      </radialGradient>
    </defs>
    <path
      d="M12 2 C16 6 20 12 18 20 C16 26 12 30 12 30 C12 30 8 26 6 20 C4 12 8 6 12 2 Z"
      fill={`url(#pg-${top}-${left})`}
    />
    <path
      d="M12 6 C12 14 12 24 12 29"
      stroke="#f9a8d4"
      strokeWidth="0.6"
      strokeLinecap="round"
      fill="none"
      opacity="0.5"
    />
  </svg>
)

// ── Vinyl disc
const VinylDisc = ({ spotifyUrl }: { spotifyUrl: string }) => {
  const [spinning, setSpinning] = useState(false)
  const handleClick = () => {
    setSpinning((s) => !s)
    window.open(spotifyUrl, '_blank', 'noopener,noreferrer')
  }
  return (
    <>
      <style>{`
        @keyframes vinyl-spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        .vinyl-spinning { animation: vinyl-spin 2.2s linear infinite; }
        .vinyl-btn-wrap:hover .vinyl-play-tip { opacity: 1 !important; }
        .vinyl-btn-wrap:hover .vinyl-disc-el {
          box-shadow: 0 0 0 2px rgba(249,168,212,0.6), 0 0 14px rgba(249,168,212,0.2) !important;
        }
      `}</style>
      <button
        type="button"
        onClick={handleClick}
        aria-label="Play on Spotify"
        className="vinyl-btn-wrap group relative flex-shrink-0"
        style={{ width: 52, height: 52, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
      >
        <span
          className="vinyl-play-tip pointer-events-none absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-semibold"
          style={{ color: 'rgba(249,168,212,0.7)', opacity: 0, transition: 'opacity 0.2s' }}
        >
          play ↗
        </span>
        <div
          className={`vinyl-disc-el relative flex items-center justify-center rounded-full${spinning ? ' vinyl-spinning' : ''}`}
          style={{
            width: 52, height: 52,
            background: `conic-gradient(
              #1a1a2e 0deg,#0f0f1a 20deg,#1a1a2e 40deg,#0f0f1a 60deg,
              #1a1a2e 80deg,#0f0f1a 100deg,#1a1a2e 120deg,#0f0f1a 140deg,
              #1a1a2e 160deg,#0f0f1a 180deg,#1a1a2e 200deg,#0f0f1a 220deg,
              #1a1a2e 240deg,#0f0f1a 260deg,#1a1a2e 280deg,#0f0f1a 300deg,
              #1a1a2e 320deg,#0f0f1a 340deg,#1a1a2e 360deg
            )`,
            boxShadow: '0 0 0 2px rgba(249,168,212,0.22)',
            transition: 'box-shadow 0.2s',
          }}
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `
                radial-gradient(circle,transparent 26%,rgba(249,168,212,0.06) 27%,rgba(249,168,212,0.06) 28%,transparent 29%),
                radial-gradient(circle,transparent 36%,rgba(249,168,212,0.04) 37%,rgba(249,168,212,0.04) 38%,transparent 39%),
                radial-gradient(circle,transparent 46%,rgba(249,168,212,0.04) 47%,rgba(249,168,212,0.04) 48%,transparent 49%)
              `,
            }}
          />
          <div
            className="relative z-10 flex items-center justify-center rounded-full"
            style={{ width: 16, height: 16, background: 'radial-gradient(circle, #ec4899 0%, #9333ea 100%)' }}
          >
            <div className="rounded-full" style={{ width: 5, height: 5, background: 'rgba(0,0,0,0.65)' }} />
          </div>
        </div>
      </button>
    </>
  )
}

// ── Falling petals canvas (overlays popup body content)
const FallingPetals = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const parent = canvas.parentElement
    if (!parent) return

    const resize = () => {
      canvas.width = parent.offsetWidth
      canvas.height = parent.offsetHeight
    }
    resize()

    const ctx = canvas.getContext('2d')!
    const cols = ['#fce7f3', '#fbcfe8', '#f9a8d4', '#f472b6']

    type Petal = {
      x: number; y: number; vx: number; vy: number
      sz: number; rot: number; rspd: number; alpha: number
      col: string; life: number; maxLife: number
    }
    let petals: Petal[] = []

    const spawn = () => {
      petals.push({
        x: Math.random() * canvas.width,
        y: -8,
        vx: (Math.random() - 0.5) * 0.8,
        vy: 0.6 + Math.random() * 1.0,
        sz: 3 + Math.random() * 5,
        rot: Math.random() * Math.PI * 2,
        rspd: (Math.random() - 0.5) * 0.07,
        alpha: 0.55 + Math.random() * 0.35,
        col: cols[Math.floor(Math.random() * cols.length)],
        life: 0,
        maxLife: 110 + Math.random() * 60,
      })
    }

    const draw = (p: Petal) => {
      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate(p.rot)
      ctx.globalAlpha = p.alpha
      ctx.beginPath()
      ctx.moveTo(0, -p.sz)
      ctx.bezierCurveTo(p.sz * 0.55, -p.sz * 0.75, p.sz * 0.75, p.sz * 0.2, 0, p.sz)
      ctx.bezierCurveTo(-p.sz * 0.75, p.sz * 0.2, -p.sz * 0.55, -p.sz * 0.75, 0, -p.sz)
      ctx.fillStyle = p.col
      ctx.fill()
      ctx.restore()
    }

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      if (Math.random() < 0.2) spawn()
      petals = petals.filter((p) => {
        p.x += p.vx; p.y += p.vy; p.rot += p.rspd; p.life++
        p.alpha = Math.max(0, (0.55 + 0.35) * (1 - p.life / p.maxLife))
        draw(p)
        return p.life < p.maxLife && p.y < canvas.height + 10
      })
      animRef.current = requestAnimationFrame(loop)
    }

    animRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(animRef.current)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'absolute',
        top: 0, left: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none',
        zIndex: 10,
      }}
    />
  )
}

const MemberPopup = ({ isOpen, onClose }: MemberPopupProps) => {
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return createPortal(
    // PADA BAGIAN INI KAMU BOLEH MENGUBAH STYLE SESUKA HATI KAMU, TAPI JANGAN UBAH STRUKTUR DAN FUNGSI DARI KODE INI AGAR FUNGSI POPUP TETAP BERJALAN DENGAN BAIK
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto px-4">
      <button
        type="button"
        aria-label="Close member detail"
        onClick={onClose}
        className="absolute inset-0 bg-black/55 backdrop-blur-md"
      />

      {/* Pink atmosphere glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 30%, rgba(251,207,232,0.13) 0%, transparent 70%)',
        }}
      />

      {/* Card */}
      <div
        className="relative z-10 w-full max-w-[680px] animate-[member-popup-show_200ms_ease-out] overflow-hidden rounded-3xl text-white shadow-2xl"
        style={{
          background: 'linear-gradient(145deg,rgba(20,16,60,0.97) 0%,rgba(30,24,80,0.94) 100%)',
          border: '1.5px solid rgba(249,168,212,0.32)',
          boxShadow:
            '0 8px 40px rgba(249,168,212,0.18), 0 2px 14px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)',
          marginTop: '2rem',
          marginBottom: '2rem',
        }}
      >
        {/* Soft tint pendar */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-10 -left-10 rounded-full"
          style={{
            width: 220, height: 220,
            background: 'radial-gradient(circle, rgba(236,72,153,0.13) 0%, transparent 70%)',
            zIndex: 0,
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-12 -right-8 rounded-full"
          style={{
            width: 240, height: 240,
            background: 'radial-gradient(circle, rgba(147,51,234,0.12) 0%, transparent 70%)',
            zIndex: 0,
          }}
        />

        {/* Static corner petals */}
        {STATIC_PETALS.map(([top, left, rotate, scale, opacity], i) => (
          <PetalSVG key={i} top={top} left={left} rotate={rotate} scale={scale} opacity={opacity} />
        ))}

        {/* Close button — z-30, always above image */}
        <button
          type="button"
          aria-label="Close member detail"
          onClick={onClose}
          className="absolute top-4 right-4 z-30 flex h-9 w-9 items-center justify-center rounded-full text-xl leading-none transition-colors"
          style={{
            background: 'rgba(10,8,40,0.78)',
            border: '1.5px solid rgba(249,168,212,0.45)',
            color: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(6px)',
          }}
        >
          ×
        </button>

        {/* Hero image — flush to top */}
        <div className="relative z-10">
          <Image
            src={ProfileImage}
            alt="Profile Image"
            className="h-72 w-full object-cover object-center sm:h-80"
          />
          {/* Shadow at bottom of image */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0"
            style={{
              height: '60%',
              background:
                'linear-gradient(to top, rgba(20,16,60,1) 0%, rgba(20,16,60,0.55) 50%, transparent 100%)',
              zIndex: 1,
            }}
          />
        </div>

        {/* Body — position:relative so FallingPetals canvas can overlay */}
        <div className="relative z-10 overflow-hidden px-6 pb-6 pt-5 sm:px-8 sm:pb-8">
          {/* Falling petals canvas — covers full body, starts at top (right below image) */}
          <FallingPetals />

          {/* UBAH NAMA ANDA */}
          <h2
            className="relative z-20 text-2xl font-black tracking-tight"
            style={{ textShadow: '0 0 20px rgba(249,168,212,0.3)' }}
          >
            Helen Audya
          </h2>
          {/* UBAH NRP DAN ASAL */}
          <p
            className="relative z-20 mt-1 mb-4 text-sm font-semibold"
            style={{ color: 'rgba(249,168,212,0.8)' }}
          >
            5027251069 ✿ Kediri
          </p>

          {/* Social icon buttons */}
          <div className="relative z-20 mb-5 flex gap-2">
            {/* UBAH USERNAME INSTAGRAM */}
            <a
              href="https://instagram.com/hlenaudya"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram @hlenaudya"
              className="flex h-9 w-9 items-center justify-center rounded-xl transition-all hover:scale-105"
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(249,168,212,0.28)',
                color: '#fff',
              }}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            {/* UBAH USERNAME LINKEDIN */}
            <a
              href="https://linkedin.com/in/helenaudya"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn helenaudya"
              className="flex h-9 w-9 items-center justify-center rounded-xl transition-all hover:scale-105"
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(249,168,212,0.28)',
                color: '#fff',
              }}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
          </div>

          {/* Hobi & Fun Fact */}
          <div className="relative z-20 mb-3 grid gap-3 text-sm font-semibold sm:grid-cols-2">
            <div
              className="rounded-xl p-4"
              style={{
                background: 'rgba(10,8,40,0.82)',
                border: '1px solid rgba(249,168,212,0.2)',
              }}
            >
              {/* UBAH HOBI KAMU */}
              <p
                className="mb-2 text-xs uppercase tracking-wide"
                style={{ color: 'rgba(249,168,212,0.7)', letterSpacing: '0.08em' }}
              >
                Hobi
              </p>
              <p>baca buku, nonton film</p>
            </div>
            <div
              className="rounded-xl p-4"
              style={{
                background: 'rgba(10,8,40,0.82)',
                border: '1px solid rgba(249,168,212,0.2)',
              }}
            >
              {/* UBAH FUNFACT KAMU */}
              <p
                className="mb-2 text-xs uppercase tracking-wide"
                style={{ color: 'rgba(249,168,212,0.7)', letterSpacing: '0.08em' }}
              >
                Fun Fact
              </p>
              <p>bisa tiap hari makan soto</p>
            </div>
          </div>

          {/* Lagu Favorit */}
          <div
            className="relative z-20 rounded-xl p-4"
            style={{
              background: 'rgba(10,8,40,0.82)',
              border: '1px solid rgba(249,168,212,0.2)',
            }}
          >
            {/* UBAH LAGU FAVORIT KAMU */}
            <p
              className="mb-3 text-xs font-bold uppercase tracking-wide"
              style={{ color: 'rgba(249,168,212,0.7)', letterSpacing: '0.08em' }}
            >
              Lagu Favorit
            </p>
            <div className="flex items-center gap-4">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold">Kissing a Fool</p>
                <p className="mt-0.5 text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  George Michael
                </p>
                <div className="mt-3">
                  {/* UBAH URL SPOTIFY */}
                  <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/1sEGwuvScFU2uNzlI7Aepy?si=8ba00be641094baa" />
                </div>
              </div>
              {/* UBAH URL SPOTIFY VINYL */}
              <VinylDisc spotifyUrl="https://open.spotify.com/track/1sEGwuvScFU2uNzlI7Aepy" />
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default MemberPopup