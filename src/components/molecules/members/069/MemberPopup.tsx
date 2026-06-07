'use client'

import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import SpotifyEmbed from '@/components/molecules/SpotifyEmbed'
import ProfileImage from './image.png'

type MemberPopupProps = {
  isOpen: boolean
  onClose: () => void
}

// Static petal positions: [top%, left%, rotateDeg, scale, opacity]
const PETALS: [number, number, number, number, number][] = [
  [6, 8, 15, 1.1, 0.5],
  [10, 88, -20, 0.9, 0.4],
  [18, 3, 35, 0.8, 0.35],
  [22, 93, -10, 1.0, 0.45],
  [48, 2, 50, 0.7, 0.25],
  [52, 94, -35, 0.9, 0.3],
  [62, 5, -15, 1.0, 0.2],
  [66, 91, 25, 0.8, 0.25],
  [78, 8, 40, 0.9, 0.18],
  [82, 89, -25, 0.7, 0.18],
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

const VinylDisc = ({ isPlaying, spotifyUrl }: { isPlaying: boolean; spotifyUrl: string }) => {
  return (
    <>
      <button
        type="button"
        onClick={() => window.open(spotifyUrl, '_blank', 'noopener,noreferrer')}
        aria-label="Open on Spotify"
        className="vinyl-btn group relative flex-shrink-0"
        style={{ width: 60, height: 60, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
      >
        <span
          className="vinyl-tip pointer-events-none absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-semibold"
          style={{ color: 'rgba(249,168,212,0.7)', opacity: 0, transition: 'opacity 0.2s' }}
        >
          open
        </span>
        <div
          className={`vinyl-disc relative flex items-center justify-center rounded-full${isPlaying ? ' vinyl-spinning' : ''}`}
          style={{
            width: 60, height: 60,
            background: `conic-gradient(
              #1a1a2e 0deg,#0f0f1a 20deg,#1a1a2e 40deg,#0f0f1a 60deg,
              #1a1a2e 80deg,#0f0f1a 100deg,#1a1a2e 120deg,#0f0f1a 140deg,
              #1a1a2e 160deg,#0f0f1a 180deg,#1a1a2e 200deg,#0f0f1a 220deg,
              #1a1a2e 240deg,#0f0f1a 260deg,#1a1a2e 280deg,#0f0f1a 300deg,
              #1a1a2e 320deg,#0f0f1a 340deg,#1a1a2e 360deg
            )`,
            boxShadow: isPlaying ? '0 0 0 2px rgba(249,168,212,0.6), 0 0 14px rgba(249,168,212,0.25)' : '0 0 0 2px rgba(249,168,212,0.25)',
            transition: 'box-shadow 0.3s',
          }}
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `
                radial-gradient(circle,transparent 26%, rgba(249,168,212,0.06) 27%, rgba(249,168,212,0.06) 28%, transparent 29%),
                radial-gradient(circle,transparent 36%, rgba(249,168,212,0.05) 37%, rgba(249,168,212,0.05) 38%, transparent 39%),
                radial-gradient(circle,transparent 46%, rgba(249,168,212,0.04) 47%, rgba(249,168,212,0.04) 48%, transparent 49%)
              `,
            }}
          />
          <div
            className="relative z-10 flex items-center justify-center rounded-full"
            style={{
              width: 18, height: 18,
              background: 'radial-gradient(circle, #ec4899 0%, #9333ea 100%)',
            }}
          >
            <div className="rounded-full" style={{ width: 6, height: 6, background: 'rgba(0,0,0,0.6)' }} />
          </div>
        </div>
      </button>
    </>
  )
}

const MemberPopup = ({ isOpen, onClose }: MemberPopupProps) => {
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      setIsPlaying(false)
      return
    }
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
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto px-4">
      <style>{`
        @keyframes vinyl-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .vinyl-spinning { animation: vinyl-spin 2s linear infinite; }
        .vinyl-btn:hover .vinyl-tip { opacity: 1 !important; }
        
        /* Animasi Burst Bloom (Ledakan awal) */
        @keyframes burst-bloom-glow {
          0% { transform: scale(0); opacity: 1; }
          40% { opacity: 0.8; }
          100% { transform: scale(8); opacity: 0; display: none; }
        }
        @keyframes burst-bloom-core {
          0% { transform: scale(0); opacity: 1; }
          100% { transform: scale(4); opacity: 0; display: none; }
        }

        /* Animasi Open Book Slide (Delay sedikit agar burst mekar dulu) */
        @keyframes door-slide-left {
          0%, 15% { transform: translateX(0); opacity: 1; }
          80% { transform: translateX(-100%); opacity: 1; }
          100% { transform: translateX(-100%); opacity: 0; display: none; }
        }
        @keyframes door-slide-right {
          0%, 15% { transform: translateX(0); opacity: 1; }
          80% { transform: translateX(100%); opacity: 1; }
          100% { transform: translateX(100%); opacity: 0; display: none; }
        }
        
        /* Animasi Popup Reveal setelah pintu terbuka */
        @keyframes popup-reveal {
          0%, 40% { opacity: 0; transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>

      {/* Background Overlay */}
      <button
        type="button"
        aria-label="Close member detail"
        onClick={onClose}
        className="absolute inset-0 bg-black/55 backdrop-blur-md cursor-default"
      />

      {/* Efek Burst Bloom (Mekar saat baru diklik) */}
      <div className="fixed inset-0 z-[120] flex items-center justify-center pointer-events-none overflow-hidden">
        <div className="absolute w-32 h-32 rounded-full bg-gradient-to-tr from-pink-400 to-purple-500 blur-2xl animate-[burst-bloom-glow_0.8s_ease-out_forwards]" />
        <div className="absolute w-16 h-16 rounded-full bg-white blur-xl animate-[burst-bloom-core_0.5s_ease-out_forwards]" />
      </div>

      {/* Efek Pintu Terbuka (Open Book Animation Overlay) */}
      <div className="fixed inset-0 z-[110] flex pointer-events-none">
        <div className="h-full w-1/2 bg-[#120E2B] animate-[door-slide-left_1.2s_ease-in-out_forwards] border-r border-pink-500/10 shadow-2xl" />
        <div className="h-full w-1/2 bg-[#120E2B] animate-[door-slide-right_1.2s_ease-in-out_forwards] border-l border-pink-500/10 shadow-2xl" />
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 30%, rgba(251,207,232,0.14) 0%, transparent 70%)',
        }}
      />

      <div
        className="relative z-10 w-full max-w-[680px] opacity-0 animate-[popup-reveal_1s_ease-out_forwards] overflow-hidden rounded-3xl text-white shadow-2xl"
        style={{
          background: 'linear-gradient(145deg,rgba(20,16,60,0.96) 0%,rgba(30,24,80,0.93) 100%)',
          border: '1.5px solid rgba(249,168,212,0.28)',
          boxShadow: '0 8px 40px rgba(249,168,212,0.15), 0 2px 12px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.07)',
          marginTop: '2rem',
          marginBottom: '2rem',
        }}
      >
        {/* Petal decorations */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          {PETALS.map(([top, left, rotate, scale, opacity], i) => (
            <PetalSVG key={i} top={top} left={left} rotate={rotate} scale={scale} opacity={opacity} />
          ))}
        </div>

        {/* Close button */}
        <button
          type="button"
          aria-label="Close member detail"
          onClick={onClose}
          className="absolute top-4 right-4 z-[50] flex h-9 w-9 items-center justify-center rounded-full text-xl leading-none transition-colors"
          style={{
            background: 'rgba(10,8,40,0.78)',
            border: '1.5px solid rgba(249,168,212,0.45)',
            color: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(6px)',
          }}
        >
          ×
        </button>

        {/* Hero image */}
        <div className="relative z-10 w-full h-72 sm:h-80 bg-gradient-to-br from-[#a855f7] to-[#ec4899] flex items-center justify-center overflow-hidden">
          <svg className="absolute w-32 h-32 text-black/20" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
          <Image
            src={ProfileImage}
            alt="Profile Image"
            className="absolute inset-0 h-full w-full object-cover object-center z-10"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 z-20"
            style={{ background: 'linear-gradient(to top, rgba(20,16,60,1), transparent)' }}
          />
        </div>

        {/* Body Content */}
        <div className="relative z-20 px-6 pb-6 pt-5 sm:px-8 sm:pb-8">
          <h2
            className="text-2xl font-black tracking-tight"
            style={{ textShadow: '0 1px 12px rgba(249,168,212,0.35)' }}
          >
            Helen Audya
          </h2>
          <p className="mt-1 mb-4 text-sm font-semibold" style={{ color: 'rgba(249,168,212,0.8)' }}>
            5027251069 ✿ Kediri
          </p>

          {/* Social icons */}
          <div className="mb-5 flex gap-2 relative z-20">
            <a
              href="https://instagram.com/hlenaudya"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram @hlenaudya"
              className="flex h-9 w-9 items-center justify-center rounded-xl transition-all hover:scale-105"
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(249,168,212,0.3)',
                color: '#fff',
              }}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
            </a>
            <a
              href="https://linkedin.com/in/helenaudya"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn helenaudya"
              className="flex h-9 w-9 items-center justify-center rounded-xl transition-all hover:scale-105"
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(249,168,212,0.3)',
                color: '#fff',
              }}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
            </a>
          </div>

          {/* Hobi & Fun Fact */}
          <div className="mb-3 grid gap-3 text-sm font-semibold sm:grid-cols-2">
            <div className="rounded-xl p-4 relative overflow-hidden" style={{ background: 'rgba(10,8,40,0.82)', border: '1px solid rgba(249,168,212,0.22)' }}>
              <p className="text-xs uppercase tracking-wide mb-2" style={{ color: 'rgba(249,168,212,0.7)', letterSpacing: '0.08em' }}>Hobi</p>
              <p>baca buku, nonton film</p>
            </div>
            <div className="rounded-xl p-4 relative overflow-hidden" style={{ background: 'rgba(10,8,40,0.82)', border: '1px solid rgba(249,168,212,0.22)' }}>
              <p className="text-xs uppercase tracking-wide mb-2" style={{ color: 'rgba(249,168,212,0.7)', letterSpacing: '0.08em' }}>Fun Fact</p>
              <p>bisa tiap hari makan soto</p>
            </div>
          </div>

          {/* Lagu Favorit */}
          <div
            className="relative rounded-xl p-4 overflow-hidden"
            style={{
              background: 'rgba(10,8,40,0.82)',
              border: '1px solid rgba(249,168,212,0.22)',
            }}
          >
            <svg className="absolute bottom-0 left-0 w-full h-full z-0 opacity-40 pointer-events-none" preserveAspectRatio="none" viewBox="0 0 1440 320">
              <path fill="url(#wave-grad)" d="M0,192L60,181.3C120,171,240,149,360,149.3C480,149,600,171,720,165.3C840,160,960,128,1080,128C1200,128,1320,160,1380,176L1440,192L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
              <defs>
                <linearGradient id="wave-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(249,168,212,0.05)" />
                  <stop offset="50%" stopColor="rgba(255,255,255,0.15)" />
                  <stop offset="100%" stopColor="rgba(249,168,212,0.05)" />
                </linearGradient>
              </defs>
            </svg>

            <div className="relative z-10">
              <p
                className="text-xs font-bold uppercase tracking-wide mb-3"
                style={{ color: 'rgba(249,168,212,0.7)', letterSpacing: '0.08em' }}
              >
                Lagu Favorit
              </p>
              <div className="flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate">Kissing a Fool</p>
                  <div className="flex items-center gap-2 mt-1.5 mb-3">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      aria-label={isPlaying ? "Pause" : "Play"}
                      className="flex h-7 w-7 items-center justify-center rounded-full transition-colors hover:bg-pink-500/30"
                      style={{ background: 'rgba(249,168,212,0.15)', color: 'rgba(249,168,212,0.9)' }}
                    >
                      {isPlaying ? (
                        <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                      ) : (
                        <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24" style={{ marginLeft: '2px' }}><path d="M8 5v14l11-7z"/></svg>
                      )}
                    </button>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>
                      George Michael
                    </p>
                  </div>
                  <div className="mt-1">
                    <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/1sEGwuvScFU2uNzlI7Aepy?si=8ba00be641094baa" />
                  </div>
                </div>
                <VinylDisc isPlaying={isPlaying} spotifyUrl="https://open.spotify.com/track/1sEGwuvScFU2uNzlI7Aepy" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>,
    document.body
  )
}

export default MemberPopup