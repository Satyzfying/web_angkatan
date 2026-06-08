'use client'

/* eslint-disable react-hooks/set-state-in-effect */

import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import Instagram from '@/components/atoms/button/InstagramButtonLink'
import LinkedInButtonLink from '@/components/atoms/button/LinkedInButtonLink'
import SpotifyEmbed from '@/components/molecules/SpotifyEmbed'
import ProfileImage from './image.png'

type MemberPopupProps = {
  isOpen: boolean
  onClose: () => void
}

type Phase = 'idle' | 'camera' | 'flash' | 'card'

const MemberPopup = ({ isOpen, onClose }: MemberPopupProps) => {
  const [phase, setPhase] = useState<Phase>('idle')

  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  useEffect(() => {
    if (!isOpen) {
      setPhase('idle')
      return
    }
    setPhase('camera')
    const t1 = setTimeout(() => setPhase('flash'), 600)
    const t2 = setTimeout(() => setPhase('card'), 850)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [isOpen])

  if (phase === 'idle') return null

  return createPortal((
    <>
      <style>{`
        @keyframes camera-pop {
          0%   { transform: scale(0.1) rotate(-20deg); opacity: 0; }
          65%  { transform: scale(1.12) rotate(5deg);  opacity: 1; }
          80%  { transform: scale(0.96) rotate(-2deg); }
          100% { transform: scale(1) rotate(0deg);     opacity: 1; }
        }
        @keyframes camera-shake {
          0%   { transform: scale(1) translateY(0px) rotate(0deg); }
          25%  { transform: scale(1.06) translateY(-8px) rotate(-4deg); }
          55%  { transform: scale(0.97) translateY(5px) rotate(2deg); }
          80%  { transform: scale(1.02) translateY(-2px) rotate(-1deg); }
          100% { transform: scale(1) translateY(0px) rotate(0deg); }
        }
        @keyframes flash-burst {
          0%   { opacity: 0; }
          8%   { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes card-reveal {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>

      {/* ── Phase 1: Camera ── */}
      {phase === 'camera' && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#020c1f]/85 backdrop-blur-sm">
          <div
            style={{
              animation:
                'camera-pop 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) forwards,' +
                'camera-shake 0.22s ease-in-out 0.42s forwards',
            }}
          >
            <svg viewBox="0 0 100 100" width="160" height="160" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="8" y="30" width="84" height="56" rx="10" fill="white" opacity="0.96" />
              <rect x="35" y="19" width="30" height="15" rx="7.5" fill="white" opacity="0.96" />
              {/* Flash module — kuning saturated */}
              <rect x="13" y="37" width="17" height="9" rx="4" fill="#ffd900" />
              <rect x="75" y="22" width="11" height="6" rx="3" fill="white" opacity="0.75" />
              <circle cx="53" cy="57" r="20" fill="#0d2147" />
              <circle cx="53" cy="57" r="15" fill="#0a1628" />
              <circle cx="53" cy="57" r="10" fill="#112d5e" opacity="0.6" />
              <circle cx="47" cy="51" r="5" fill="white" opacity="0.12" />
              <circle cx="49" cy="50" r="2.5" fill="white" opacity="0.5" />
              <circle cx="58" cy="62" r="1.5" fill="white" opacity="0.2" />
            </svg>
          </div>
        </div>
      )}

      {/* ── Phase 2: Flash ── */}
      {phase === 'flash' && (
        <div
          className="fixed inset-0 z-[200] bg-white"
          style={{ animation: 'flash-burst 250ms ease-out forwards' }}
        />
      )}

      {/* ── Phase 3: Card ── */}
      {phase === 'card' && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center overflow-hidden px-4"
          style={{ animation: 'card-reveal 180ms ease-out forwards' }}
        >
          {/* Backdrop — navy dark */}
          <button
            type="button"
            aria-label="Close member detail"
            onClick={onClose}
            className="absolute inset-0 bg-[#020c1f]/70 backdrop-blur-sm"
          />

          {/* Card — glassmorphism dengan border kuning */}
          <div
            className="relative z-10 h-[100dvh] max-h-[100dvh] w-full max-w-[720px] overflow-y-auto rounded-2xl p-6 text-white shadow-xl sm:h-[100dvh] max-h-[100dvh] sm:p-8"
            style={{
              background: 'rgba(255, 255, 255, 0.07)',
              backdropFilter: 'blur(20px) saturate(160%)',
              WebkitBackdropFilter: 'blur(20px) saturate(160%)',
              border: '1.5px solid rgba(255, 218, 0, 0.45)',
              boxShadow: '0 8px 40px rgba(0,0,0,0.5), 0 0 0 0.5px rgba(255,218,0,0.12) inset',
            }}
          >
            {/* Close button — border & icon kuning */}
            <button
              type="button"
              aria-label="Close member detail"
              onClick={onClose}
              className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full text-xl leading-none transition-colors"
              style={{
                border: '1.5px solid rgba(255, 218, 0, 0.55)',
                background: 'rgba(255, 218, 0, 0.08)',
                color: '#ffd900',
              }}
            >
              ✕
            </button>

            {/* Profile image — border kuning */}
            <div
              className="mb-5 overflow-hidden rounded-2xl"
              style={{ border: '1.5px solid rgba(255, 218, 0, 0.35)' }}
            >
              <Image src={ProfileImage} alt="Profile Image" className="h-120 w-full object-cover object-center" />
            </div>

            <div className="pr-10">
              {/* Nama — kuning saturated */}
              <h2 className="text-2xl font-black" style={{ color: '#ffd900' }}>
                Ahmad Nayottama Juliansyah
              </h2>
              <p className="mt-1 text-sm font-semibold" style={{ color: 'rgba(240,244,255,0.55)' }}>
                5027251045 - Yogyakarta
              </p>
            </div>

            <div className="mt-5 flex gap-2">
              <Instagram username="ahmdnytm" />
              <LinkedInButtonLink username="ahmad-juliansyah" />
            </div>

            {/* Info grid — border & label kuning */}
            <div className="mt-6 grid gap-4 text-sm font-semibold sm:grid-cols-2">
              <div
                className="rounded-xl p-4"
                style={{
                  border: '1.5px solid rgba(255, 218, 0, 0.25)',
                  background: 'rgba(255, 255, 255, 0.045)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                }}
              >
                <p className="text-xs font-bold tracking-wide uppercase" style={{ color: 'rgba(255, 218, 0, 0.6)' }}>
                  Hobi
                </p>
                <p className="mt-2">Colorgrading jos</p>
              </div>
              <div
                className="rounded-xl p-4"
                style={{
                  border: '1.5px solid rgba(255, 218, 0, 0.25)',
                  background: 'rgba(255, 255, 255, 0.045)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                }}
              >
                <p className="text-xs font-bold tracking-wide uppercase" style={{ color: 'rgba(255, 218, 0, 0.6)' }}>
                  Fun Fact
                </p>
                <p className="mt-2">Hobi colorgrade but im colorblind</p>
              </div>
            </div>

            {/* Lagu favorit */}
            <div
              className="mt-4 rounded-xl p-4"
              style={{
                border: '1.5px solid rgba(255, 218, 0, 0.25)',
                background: 'rgba(255, 255, 255, 0.045)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
              }}
            >
              <p className="text-xs font-bold tracking-wide uppercase" style={{ color: 'rgba(255, 218, 0, 0.6)' }}>
                Lagu Favorit
              </p>
              <p className="my-2 text-sm font-semibold">Helena - My Chemical Romance</p>
              <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/5dTHtzHFPyi8TlTtzoz1J9?si=23aed86947ca4ac5" />
            </div>
          </div>
        </div>
      )}
    </>
  ), document.body)
}

export default MemberPopup
