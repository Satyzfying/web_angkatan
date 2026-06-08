'use client'

import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

import Image from 'next/image'

import Instagram from '@/components/atoms/button/InstagramButtonLink'
import LinkedInButtonLink from '@/components/atoms/button/LinkedInButtonLink'
import SpotifyEmbed from '@/components/molecules/SpotifyEmbed'

// Memakai foto profil terbaru dari image_697962.jpg
import ProfileImage from './image2.png'
// Memakai logo BMTH dari image_698c8b.png atau image_697681.png
import BmthLogo from './image.png'

type MemberPopupProps = {
  isOpen: boolean
  onClose: () => void
}

// ─── Open Profile Button ──────────────────────────────────────────────────────
export const OpenProfileButton = ({ onClick }: { onClick: () => void }) => (
  <>
    <button
      type="button"
      onClick={onClick}
      className="bmth-open-btn group relative inline-flex items-center gap-3 overflow-hidden outline-none"
      style={{
        height: 56,
        padding: '0 28px 0 18px',
        cursor: 'pointer',
        background: 'transparent',
        border: 'none',
        clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))',
      }}
    >
      <div
        className="absolute inset-0 z-0 transition-opacity"
        style={{
          background: 'linear-gradient(135deg, #cc0000 0%, #8b0000 60%, #cc0000 100%)',
          clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))',
        }}
      />
      <div
        className="absolute z-0 transition-colors group-hover:bg-[#1a0000]"
        style={{
          inset: '1.5px',
          background: '#0e0e0e',
          clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))',
        }}
      />
      <div className="bmth-scan-line pointer-events-none absolute inset-0 z-10" />
      <div className="absolute top-0 left-0 z-20 h-1.5 w-1.5 border-t-2 border-l-2" style={{ borderColor: '#cc0000' }} />
      <div className="absolute top-0 z-20 h-1.5 w-1.5 border-t-2 border-r-2" style={{ right: 14, borderColor: '#cc0000' }} />
      <div className="absolute bottom-0 z-20 h-1.5 w-1.5 border-b-2 border-l-2" style={{ left: 14, borderColor: '#cc0000' }} />
      <div className="absolute bottom-0 right-0 z-20 h-1.5 w-1.5 border-b-2 border-r-2" style={{ borderColor: '#cc0000' }} />
      
      <div className="relative z-30 flex items-center gap-3">
        <span className="bmth-skull-pulse text-xl" style={{ filter: 'drop-shadow(0 0 6px rgba(204,0,0,0.9))' }}>☠</span>
        <div className="flex flex-col items-start">
          <span
            style={{
              fontFamily: "'Metal Mania', cursive",
              fontSize: 18,
              color: '#f0f0f0',
              letterSpacing: 2,
              lineHeight: 1,
              textShadow: '0 0 20px rgba(204,0,0,0.5)',
            }}
          >
            Open Profile
          </span>
          <span
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: 4,
              textTransform: 'uppercase',
              color: '#cc0000',
              marginTop: 2,
            }}
          >
            Bring Me The Horizon
          </span>
        </div>
        <span
          className="bmth-btn-arrow ml-1 transition-transform group-hover:translate-x-1"
          style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 20, color: '#cc0000' }}
        >
          ›
        </span>
      </div>
    </button>

    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Metal+Mania&family=Barlow+Condensed:wght@700&display=swap');
      .bmth-skull-pulse { animation: bmthSkullPulse 2s ease-in-out infinite; }
      @keyframes bmthSkullPulse { 0%,100% { transform: scale(1); opacity: 1; } 50% { transform: scale(0.93); opacity: 0.7; } }
      .bmth-open-btn:hover .bmth-scan-line { animation: bmthBtnScan 0.5s linear forwards; background: linear-gradient(90deg, transparent, rgba(204,0,0,0.09), transparent); }
      @keyframes bmthBtnScan { from { transform: translateX(-100%); } to { transform: translateX(200%); } }
    `}</style>
  </>
)

// ─── Intro Animation ──────────────────────────────────────────────────────────
const BmthIntro = ({ onDone }: { onDone: () => void }) => {
  useEffect(() => {
    const t = setTimeout(onDone, 2600)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden" style={{ background: '#060606' }}>
      <div className="pointer-events-none absolute inset-0" style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.25) 2px, rgba(0,0,0,0.25) 3px)' }} />
      <div className="pointer-events-none absolute inset-0 z-30" style={{ background: '#cc0000', animation: 'bmthFlash 0.35s ease-out forwards' }} />
      <div className="pointer-events-none absolute left-0 right-0 z-20 h-[2px]" style={{ background: '#cc0000', animation: 'bmthGlitchBar 2.6s steps(1) forwards', opacity: 0 }} />

      {['top-4 left-4 border-t-2 border-l-2', 'top-4 right-4 border-t-2 border-r-2', 'bottom-4 left-4 border-b-2 border-l-2', 'bottom-4 right-4 border-b-2 border-r-2'].map((cls, i) => (
        <div key={i} className={`absolute h-6 w-6 ${cls}`} style={{ borderColor: '#cc0000', opacity: 0, animation: `bmthFadeIn 0.3s ease forwards ${0.4 + i * 0.05}s` }} />
      ))}

      {[1.1, 1.7].map((delay, i) => (
        <div key={i} className="pointer-events-none absolute rounded-full" style={{ width: 260, height: 260, border: '1px solid rgba(204,0,0,0.18)', animation: `bmthPulse 2.2s ease-out infinite ${delay}s` }} />
      ))}

      <div className="relative z-10 flex flex-col items-center" style={{ animation: 'bmthLogoIn 2.6s cubic-bezier(0.16,1,0.3,1) forwards' }}>
        <div className="relative select-none" style={{ width: 280 }}>
          <Image
            src={BmthLogo}
            alt="Bring Me The Horizon"
            width={280}
            height={160}
            className="h-auto w-full object-contain"
            style={{ filter: 'invert(1) brightness(1.2) drop-shadow(0 0 24px rgba(204,0,0,0.9))' }}
            priority
          />
        </div>
        <div className="mt-3 h-px" style={{ width: 200, background: 'linear-gradient(90deg, transparent, #cc0000, transparent)', animation: 'bmthLineExpand 0.5s ease forwards 0.8s', transform: 'scaleX(0)' }} />
        <p className="mt-3" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: 6, textTransform: 'uppercase', color: '#cc0000', opacity: 0, animation: 'bmthFadeUp 0.5s ease forwards 1s' }}>
          Loading Profile...
        </p>
        <div className="relative mt-5 overflow-hidden" style={{ width: 130, height: 2, background: '#1a0000', opacity: 0, animation: 'bmthFadeIn 0.3s ease forwards 1.1s' }}>
          <div className="absolute inset-y-0 left-0" style={{ background: 'linear-gradient(90deg, #8b0000, #cc0000)', animation: 'bmthBarFill 1.3s linear forwards 1.2s', width: 0 }} />
        </div>
      </div>

      <style>{`
        @keyframes bmthFlash { 0% { opacity: 0.55; } 100% { opacity: 0; } }
        @keyframes bmthLogoIn { 0% { opacity: 0; transform: scale(1.35) rotate(-2deg); } 20% { opacity: 1; transform: scale(1.01) rotate(0.3deg); } 75% { opacity: 1; transform: scale(1.015); } 100% { opacity: 0; transform: scale(1.06); filter: brightness(0.2); } }
        @keyframes bmthFadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes bmthFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes bmthPulse { 0% { transform: scale(0.8); opacity: 0.5; } 100% { transform: scale(1.9); opacity: 0; } }
        @keyframes bmthGlitchBar { 0%,55%,100% { opacity: 0; top: 50%; } 57% { opacity: 0.9; top: 22%; } 59% { opacity: 0; top: 72%; } 61% { opacity: 0.5; top: 15%; } 63% { opacity: 0; } }
        @keyframes bmthLineExpand { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        @keyframes bmthBarFill { from { width: 0; } to { width: 100%; } }
        @keyframes member-popup-show { from { opacity: 0; transform: translateY(14px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
      `}</style>
    </div>
  )
}

// ─── Main Popup ───────────────────────────────────────────────────────────────
const MemberPopup = ({ isOpen, onClose }: MemberPopupProps) => {
  const [showIntro, setShowIntro] = useState(false)
  const [showCard, setShowCard] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      setShowIntro(false)
      setShowCard(false)
      return
    }
    setShowIntro(true)
    setShowCard(false)

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return createPortal(
    <>
      {showIntro && <BmthIntro onDone={() => { setShowIntro(false); setShowCard(true); }} />}

      {showCard && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto px-4 py-6"
          style={{ background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(6px)' }}
        >
          <button type="button" aria-label="Close member detail" onClick={onClose} className="absolute inset-0" />

          <div
            className="relative z-10 my-auto w-full max-w-[680px] overflow-hidden rounded-xl"
            style={{
              background: '#0e0e0e',
              border: '1px solid #3a0000',
              boxShadow: '0 0 0 1px rgba(255,0,0,0.07), 0 40px 100px rgba(0,0,0,0.95)',
              animation: 'member-popup-show 300ms ease-out both',
            }}
          >
            {/* Top dekorasi line merah */}
            <div className="absolute top-0 left-0 right-0 z-10 h-[3px]" style={{ background: 'linear-gradient(90deg, #8b0000, #cc0000, #ff2200, #cc0000, #8b0000)' }} />

            {/* Tombol Close */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-6 right-6 z-20 flex h-9 w-9 items-center justify-center text-sm font-bold transition-colors hover:bg-[#cc0000] hover:text-[#0e0e0e]"
              style={{
                background: '#0e0e0e',
                border: '1px solid #cc0000',
                color: '#cc0000',
                clipPath: 'polygon(8px 0%, 100% 0%, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0% 100%, 0% 8px)',
              }}
            >
              ✕
            </button>

            {/* ── BAGIAN BORDER FOTO YANG DIUBAH (Sesuai image_69234b.jpg) ── */}
            <div className="p-4 sm:p-6 pb-0">
              <div className="relative h-64 w-full overflow-hidden rounded-xl sm:h-80" style={{ background: '#111' }}>
                <Image
                  src={ProfileImage}
                  alt="Profile Image"
                  className="h-full w-full object-cover object-center"
                  priority
                />
                
                {/* Logo Watermark BMTH kecil di sudut kiri bawah foto */}
                <div className="absolute bottom-4 left-4 z-10 w-20 opacity-40 mix-blend-screen">
                  <Image 
                    src={BmthLogo} 
                    alt="" 
                    className="h-auto w-full object-contain" 
                    style={{ filter: 'invert(1) sepia(1) saturate(5000%) hue-rotate(340deg)' }} 
                    aria-hidden 
                  />
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="px-6 pb-8 pt-4 sm:px-8">
              <div className="pr-10">
                <h2
                  className="text-3xl font-black leading-tight tracking-wide"
                  style={{ fontFamily: "'Metal Mania', cursive", color: '#f0f0f0', textShadow: '0 0 30px rgba(200,0,0,0.4)' }}
                >
                  Senna Bagus Harimurti
                </h2>
                <p className="mt-1 text-xs font-bold uppercase tracking-[3px]" style={{ color: '#cc0000' }}>
                  5027251106 · Palangka Raya
                </p>
              </div>

              <div className="my-4 h-px w-full" style={{ background: 'linear-gradient(90deg, #cc0000, transparent)' }} />

              <div className="flex gap-2">
                <Instagram username="22tr1cky_" />
                <LinkedInButtonLink username="senna-bagus-harimurti-a68616379" />
              </div>

              <div className="my-4 flex items-center gap-3">
                <div className="h-px flex-1" style={{ background: '#2a0000' }} />
                <span style={{ color: '#3a0000', fontSize: 14 }}>☠</span>
                <div className="h-px flex-1" style={{ background: '#2a0000' }} />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="p-4" style={{ background: '#111', border: '1px solid #2a0000', borderLeft: '2px solid #cc0000' }}>
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-[3px]" style={{ color: '#cc0000' }}>Hobi</p>
                  <p className="text-sm font-semibold" style={{ color: '#d0d0d0' }}>Main Game</p>
                </div>
                <div className="p-4" style={{ background: '#111', border: '1px solid #2a0000', borderLeft: '2px solid #cc0000' }}>
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-[3px]" style={{ color: '#cc0000' }}>Fun Fact</p>
                  <p className="text-sm font-semibold" style={{ color: '#d0d0d0' }}>Ga pernah juara 1 dan 3</p>
                </div>
              </div>

              <div className="mt-3 p-4" style={{ background: '#111', border: '1px solid #2a0000', borderLeft: '2px solid #cc0000' }}>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[3px]" style={{ color: '#cc0000' }}>Lagu Favorit</p>
                <p className="mb-3 text-base font-black tracking-wide" style={{ fontFamily: "'Metal Mania', cursive", color: '#f0f0f0' }}>
                  Pray for Plagues
                </p>
                <SpotifyEmbed spotifyUrl="https://open.spotify.com/intl-id/track/4hTn5kvaI6mTDckWU7gm91?si=8e26c93d98e24a55" />
              </div>
            </div>
          </div>
        </div>
      )}
    </>,
    document.body
  )
}

export default MemberPopup