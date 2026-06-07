'use client'

import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'

// Import bawaan kamu sudah dikembalikan seperti semula
import Instagram from '@/components/atoms/button/InstagramButtonLink'
import LinkedInButtonLink from '@/components/atoms/button/LinkedInButtonLink'
import SpotifyEmbed from '@/components/molecules/SpotifyEmbed'

import ProfileImage from './image.png'

type MemberPopupProps = {
  isOpen: boolean
  onClose: () => void
}

// Static background petal positions
const PETALS: [number, number, number, number, number][] = [
  [6, 8, 15, 1.1, 0.5], [10, 88, -20, 0.9, 0.4], [18, 3, 35, 0.8, 0.35],
  [22, 93, -10, 1.0, 0.45], [48, 2, 50, 0.7, 0.25], [52, 94, -35, 0.9, 0.3],
  [62, 5, -15, 1.0, 0.2], [66, 91, 25, 0.8, 0.25], [78, 8, 40, 0.9, 0.18],
  [82, 89, -25, 0.7, 0.18],
]

// Animated Falling Petal configurations
const FALLING_PETALS = Array.from({ length: 12 }).map((_, i) => ({
  id: i,
  left: Math.random() * 100,
  delay: Math.random() * 5,
  duration: 4 + Math.random() * 6,
  scale: 0.5 + Math.random() * 0.5,
  rotation: Math.random() * 360,
}))

// Burst Petal configurations
const BURST_PETALS = Array.from({ length: 16 }).map((_, i) => {
  const angle = (i * 360) / 16
  const distance = 80 + Math.random() * 100
  const tx = Math.cos((angle * Math.PI) / 180) * distance
  const ty = Math.sin((angle * Math.PI) / 180) * distance
  return { id: i, angle, tx, ty, scale: 0.8 + Math.random() * 0.5 }
})

const PetalSVG = ({
  top, left, rotate, scale, opacity, isAnimated = false, customStyle = {}
}: {
  top?: number | string; left?: number | string; rotate?: number; scale: number; opacity: number; isAnimated?: boolean; customStyle?: React.CSSProperties
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 32"
    aria-hidden="true"
    className={isAnimated ? '' : 'absolute'}
    style={{
      top: top !== undefined ? (typeof top === 'number' ? `${top}%` : top) : undefined,
      left: left !== undefined ? (typeof left === 'number' ? `${left}%` : left) : undefined,
      width: `${14 * scale}px`,
      height: `${18 * scale}px`,
      transform: rotate !== undefined ? `rotate(${rotate}deg)` : undefined,
      opacity,
      pointerEvents: 'none',
      ...customStyle
    }}
  >
    <defs>
      <radialGradient id={`pg-${Math.random()}`} cx="40%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#fce7f3" />
        <stop offset="60%" stopColor="#fbcfe8" />
        <stop offset="100%" stopColor="#f9a8d4" />
      </radialGradient>
    </defs>
    <path
      d="M12 2 C16 6 20 12 18 20 C16 26 12 30 12 30 C12 30 8 26 6 20 C4 12 8 6 12 2 Z"
      fill={`url(#pg-${Math.random()})`}
    />
    <path d="M12 6 C12 14 12 24 12 29" stroke="#f9a8d4" strokeWidth="0.6" strokeLinecap="round" fill="none" opacity="0.5" />
  </svg>
)

const MixtapeLayout = ({ isPlaying, setIsPlaying, spotifyUrl }: { isPlaying: boolean; setIsPlaying: (val: boolean) => void; spotifyUrl: string }) => {
  return (
    <div
      className="relative mx-auto mt-4 w-full rounded-xl p-4 shadow-lg"
      style={{
        background: 'linear-gradient(180deg, #1f1b3b 0%, #15122b 100%)',
        border: '2px solid rgba(249,168,212,0.4)',
        boxShadow: 'inset 0 4px 10px rgba(0,0,0,0.5), 0 8px 20px rgba(0,0,0,0.4)'
      }}
    >
      {/* Cassette Screws */}
      <div className="absolute top-2 left-2 h-1.5 w-1.5 rounded-full bg-pink-300/40 shadow-inner" />
      <div className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-pink-300/40 shadow-inner" />
      <div className="absolute bottom-2 left-2 h-1.5 w-1.5 rounded-full bg-pink-300/40 shadow-inner" />
      <div className="absolute bottom-2 right-2 h-1.5 w-1.5 rounded-full bg-pink-300/40 shadow-inner" />

      {/* Mixtape Label */}
      <div className="relative overflow-hidden rounded bg-pink-900/30 p-3 border border-pink-400/30">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(transparent, transparent 19px, #f9a8d4 20px)' }} />
        
        <div className="relative z-10 flex items-center justify-between mb-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-pink-300/80">Mixtape</p>
            <p className="font-['Courier_New'] font-bold text-white tracking-wide">Kissing a Fool</p>
          </div>
          <p className="font-['Courier_New'] text-xs font-bold text-pink-300/80">Side A</p>
        </div>

        {/* Tape Spools Window */}
        <div className="mx-auto mb-3 flex h-14 w-3/4 items-center justify-center gap-6 rounded-md bg-black/60 p-2 border border-black/80 shadow-inner">
          <div className={`h-10 w-10 rounded-full border-2 border-gray-700 bg-gray-900 flex items-center justify-center ${isPlaying ? 'animate-[spin_3s_linear_infinite]' : ''}`}>
            <div className="h-4 w-4 rounded-full border border-gray-600 bg-gray-800 relative">
              <div className="absolute top-0 left-1/2 h-full w-[2px] -translate-x-1/2 bg-gray-400" />
              <div className="absolute left-0 top-1/2 w-full h-[2px] -translate-y-1/2 bg-gray-400" />
            </div>
          </div>
          <div className={`h-10 w-10 rounded-full border-2 border-gray-700 bg-gray-900 flex items-center justify-center ${isPlaying ? 'animate-[spin_3s_linear_infinite]' : ''}`}>
             <div className="h-4 w-4 rounded-full border border-gray-600 bg-gray-800 relative">
              <div className="absolute top-0 left-1/2 h-full w-[2px] -translate-x-1/2 bg-gray-400" />
              <div className="absolute left-0 top-1/2 w-full h-[2px] -translate-y-1/2 bg-gray-400" />
            </div>
          </div>
        </div>

        {/* Spotify Embed integration */}
        <div className="relative z-10 mt-2 rounded-md overflow-hidden ring-1 ring-pink-500/20">
           <SpotifyEmbed spotifyUrl={spotifyUrl} />
        </div>
      </div>

      {/* Cassette Tape Bottom & Controls */}
      <div className="mt-3 relative flex h-10 w-full items-center justify-center">
        <div className="absolute inset-x-8 bottom-0 top-0 border-t border-pink-400/20 bg-[#15122b] rounded-t-md opacity-50" />
        
        {/* Media Buttons */}
        <div className="relative z-10 flex items-center gap-3">
          <button
            onClick={() => setIsPlaying(false)}
            className="flex h-7 w-7 items-center justify-center rounded bg-gray-800/80 border border-gray-600 text-pink-300 hover:bg-pink-500/30 hover:border-pink-400 transition-all active:scale-95"
            aria-label="Pause"
          >
            <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
          </button>
          <button
            onClick={() => setIsPlaying(true)}
            className="flex h-8 w-12 items-center justify-center rounded bg-gray-800/80 border border-gray-600 text-pink-300 hover:bg-pink-500/30 hover:border-pink-400 transition-all active:scale-95"
            aria-label="Start"
          >
             <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          </button>
          <button
            onClick={() => { /* Next Logic if needed */ }}
            className="flex h-7 w-7 items-center justify-center rounded bg-gray-800/80 border border-gray-600 text-pink-300 hover:bg-pink-500/30 hover:border-pink-400 transition-all active:scale-95"
            aria-label="Next"
          >
            <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
          </button>
        </div>
      </div>
    </div>
  )
}

const MemberPopup = ({ isOpen, onClose }: MemberPopupProps) => {
  const [isPlaying, setIsPlaying] = useState(false)

  // Fungsi bawaan useEffect tidak diubah
  useEffect(() => {
    if (!isOpen) {
      setIsPlaying(false)
      return
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  // Kondisi return null bawaan tidak diubah
  if (!isOpen) {
    return null
  }

  // createPortal bawaan tidak diubah
  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto px-4">
      <style>{`
        /* Petal Burst Outward Animation */
        @keyframes petal-shoot {
          0% { transform: translate(0, 0) scale(0) rotate(0deg); opacity: 0; }
          20% { opacity: 1; transform: translate(calc(var(--tx) * 0.3px), calc(var(--ty) * 0.3px)) scale(var(--s)) rotate(calc(var(--r) * 0.5deg)); }
          80% { opacity: 1; }
          100% { transform: translate(calc(var(--tx) * 1px), calc(var(--ty) * 1px)) scale(calc(var(--s) * 1.5)) rotate(calc(var(--r) * 1deg)); opacity: 0; display: none; }
        }

        /* Animated Falling Petals Loop */
        @keyframes falling-petal {
          0% { transform: translateY(-20px) translateX(0) rotate(0deg); opacity: 0; }
          10% { opacity: var(--o); }
          90% { opacity: var(--o); }
          100% { transform: translateY(100vh) translateX(40px) rotate(360deg); opacity: 0; }
        }

        /* Open Book Slide Animation */
        @keyframes door-slide-left {
          0%, 30% { transform: translateX(0); opacity: 1; }
          80% { transform: translateX(-100%); opacity: 1; }
          100% { transform: translateX(-100%); opacity: 0; display: none; }
        }
        @keyframes door-slide-right {
          0%, 30% { transform: translateX(0); opacity: 1; }
          80% { transform: translateX(100%); opacity: 1; }
          100% { transform: translateX(100%); opacity: 0; display: none; }
        }
        
        /* Popup Reveal Animation */
        @keyframes popup-reveal {
          0%, 50% { opacity: 0; transform: scale(0.9); }
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

      {/* Petal Burst Bloom Overlay */}
      <div className="fixed inset-0 z-[120] flex items-center justify-center pointer-events-none">
        {BURST_PETALS.map((bp) => (
          <div
            key={`burst-${bp.id}`}
            className="absolute animate-[petal-shoot_1s_ease-out_forwards]"
            style={{
              '--tx': bp.tx,
              '--ty': bp.ty,
              '--r': bp.angle,
              '--s': bp.scale,
            } as React.CSSProperties}
          >
            <PetalSVG scale={bp.scale} opacity={0.8} />
          </div>
        ))}
        <div className="absolute w-24 h-24 rounded-full bg-pink-400 blur-3xl animate-[popup-reveal_0.8s_reverse_ease-out_forwards]" />
      </div>

      {/* Efek Pintu Terbuka */}
      <div className="fixed inset-0 z-[110] flex pointer-events-none">
        <div className="h-full w-1/2 bg-[#120E2B] animate-[door-slide-left_1.5s_ease-in-out_forwards] border-r border-pink-500/10 shadow-2xl" />
        <div className="h-full w-1/2 bg-[#120E2B] animate-[door-slide-right_1.5s_ease-in-out_forwards] border-l border-pink-500/10 shadow-2xl" />
      </div>

      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0" style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 30%, rgba(251,207,232,0.14) 0%, transparent 70%)' }} />

      <div
        className="relative w-full max-w-[680px] opacity-0 animate-[popup-reveal_1.2s_ease-out_forwards] overflow-hidden rounded-3xl text-white shadow-2xl z-10"
        style={{
          background: 'linear-gradient(145deg,rgba(20,16,60,0.96) 0%,rgba(30,24,80,0.93) 100%)',
          border: '1.5px solid rgba(249,168,212,0.28)',
          boxShadow: '0 8px 40px rgba(249,168,212,0.15), 0 2px 12px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.07)',
          marginTop: '2rem',
          marginBottom: '2rem',
        }}
      >
        {/* Static Background Petals */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
          {PETALS.map(([top, left, rotate, scale, opacity], i) => (
            <PetalSVG key={`static-${i}`} top={top} left={left} rotate={rotate} scale={scale} opacity={opacity} />
          ))}
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-[50] flex h-9 w-9 items-center justify-center rounded-full text-xl leading-none transition-colors hover:bg-white/10"
          style={{ background: 'rgba(10,8,40,0.78)', border: '1.5px solid rgba(249,168,212,0.45)', color: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(6px)' }}
        >
          ×
        </button>

        {/* Hero Image */}
        <div className="relative z-10 w-full h-72 sm:h-80 bg-gradient-to-br from-[#a855f7] to-[#ec4899] flex items-center justify-center overflow-hidden">
          <svg className="absolute w-32 h-32 text-black/20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
          <Image src={ProfileImage} alt="Profile Image" className="absolute inset-0 h-full w-full object-cover object-center z-10" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 z-20" style={{ background: 'linear-gradient(to top, rgba(20,16,60,1), transparent)' }} />
        </div>

        {/* Container Content */}
        <div className="relative z-20 px-6 pb-6 pt-5 sm:px-8 sm:pb-8">
          
          {/* Animated Falling Petals */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-b-3xl">
            {FALLING_PETALS.map((petal) => (
              <div
                key={`falling-${petal.id}`}
                className="absolute top-0"
                style={{
                  left: `${petal.left}%`,
                  animation: `falling-petal ${petal.duration}s linear infinite`,
                  animationDelay: `${petal.delay}s`,
                  '--o': 0.2 + Math.random() * 0.2,
                } as React.CSSProperties}
              >
                <PetalSVG scale={petal.scale} opacity={1} rotate={petal.rotation} isAnimated={true} />
              </div>
            ))}
          </div>

          <div className="relative z-10">
            <h2 className="text-2xl font-black tracking-tight" style={{ textShadow: '0 1px 12px rgba(249,168,212,0.35)' }}>
              Helen Audya
            </h2>
            <p className="mt-1 mb-4 text-sm font-semibold" style={{ color: 'rgba(249,168,212,0.8)' }}>
              5027251069 - Kediri
            </p>

            {/* KOMPONEN SOSIAL MEDIA BAWAAN KAMU DIKEMBALIKAN */}
            <div className="mt-5 mb-5 flex gap-2">
              <Instagram username="hlenaudya" />
              <LinkedInButtonLink username="helenaudya" />
            </div>

            {/* Hobi & Fun Fact */}
            <div className="mb-3 grid gap-3 text-sm font-semibold sm:grid-cols-2">
              <div className="rounded-xl p-4 relative overflow-hidden backdrop-blur-sm" style={{ background: 'rgba(10,8,40,0.6)', border: '1px solid rgba(249,168,212,0.22)' }}>
                <p className="text-xs uppercase tracking-wide mb-2" style={{ color: 'rgba(249,168,212,0.7)', letterSpacing: '0.08em' }}>Hobi</p>
                <p>baca buku, nonton film</p>
              </div>
              <div className="rounded-xl p-4 relative overflow-hidden backdrop-blur-sm" style={{ background: 'rgba(10,8,40,0.6)', border: '1px solid rgba(249,168,212,0.22)' }}>
                <p className="text-xs uppercase tracking-wide mb-2" style={{ color: 'rgba(249,168,212,0.7)', letterSpacing: '0.08em' }}>Fun Fact</p>
                <p>bisa tiap hari makan soto</p>
              </div>
            </div>

            {/* Lagu Favorit -> Mixtape */}
            <MixtapeLayout 
              isPlaying={isPlaying} 
              setIsPlaying={setIsPlaying} 
              spotifyUrl="https://open.spotify.com/track/1sEGwuvScFU2uNzlI7Aepy?si=8ba00be641094baa" 
            />

          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default MemberPopup