'use client'

import React, { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import Instagram from '@/components/atoms/button/InstagramButtonLink'
import LinkedInButtonLink from '@/components/atoms/button/LinkedInButtonLink'
import SpotifyEmbed from '@/components/molecules/SpotifyEmbed'
import ProfileImage from './image.jpg'

type MemberPopupProps = {
  isOpen: boolean
  onClose: () => void
}

const MemberPopup = ({ isOpen, onClose }: MemberPopupProps) => {
  const glowRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (glowRef.current) {
        glowRef.current.style.left = `${e.clientX}px`
        glowRef.current.style.top = `${e.clientY}px`
      }
    }

    // Trigger popup entry shake
    if (cardRef.current) {
      cardRef.current.classList.remove('yusuf-popup-enter')
      void cardRef.current.offsetWidth
      cardRef.current.classList.add('yusuf-popup-enter')
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [isOpen, onClose])

  const handleShake = (e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget
    el.classList.remove('yusuf-shake')
    void (el as HTMLElement).offsetWidth
    el.classList.add('yusuf-shake')
  }

  if (!isOpen) return null

  return createPortal(
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;900&family=Space+Mono:wght@400;700&display=swap');

        .yusuf-popup * { font-family: 'DM Sans', sans-serif; }

        .yusuf-glow {
          position: fixed;
          width: 220px; height: 220px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(56,182,255,0.055) 0%, rgba(0,180,216,0.025) 50%, transparent 70%);
          pointer-events: none;
          transform: translate(-50%, -50%);
          transition: left 0.06s linear, top 0.06s linear;
          z-index: 200;
          mix-blend-mode: screen;
        }

        .yusuf-card {
          background: linear-gradient(160deg, #0e2a45 0%, #0b1e35 60%, #071525 100%);
          border: 1.5px solid rgba(56,182,255,0.75);
          box-shadow:
            0 0 12px rgba(56,182,255,0.35),
            0 0 30px rgba(56,182,255,0.15),
            inset 0 1px 0 rgba(255,255,255,0.09);
        }

        .yusuf-label {
          font-family: 'Space Mono', monospace;
          font-size: 10px; font-weight: 700;
          letter-spacing: 1.2px; text-transform: uppercase;
          color: rgba(100,180,255,0.6);
          margin-bottom: 8px;
        }

        .yusuf-nim {
          font-family: 'Space Mono', monospace;
          font-size: 12px; font-weight: 500;
          color: rgba(150,200,255,0.55);
          margin-top: 3px;
        }

        /* Hover shake */
        @keyframes yusufSixSeven {
          0%   { transform: rotate(0deg) translateX(0px); }
          10%  { transform: rotate(-10deg) translateX(-6px); }
          20%  { transform: rotate(10deg) translateX(6px); }
          30%  { transform: rotate(-10deg) translateX(-6px); }
          40%  { transform: rotate(10deg) translateX(6px); }
          50%  { transform: rotate(-7deg) translateX(-4px); }
          60%  { transform: rotate(7deg) translateX(4px); }
          70%  { transform: rotate(-4deg) translateX(-2px); }
          80%  { transform: rotate(4deg) translateX(2px); }
          90%  { transform: rotate(-1deg) translateX(-1px); }
          100% { transform: rotate(0deg) translateX(0px); }
        }
        .yusuf-shake {
          animation: yusufSixSeven 0.45s ease forwards;
        }

        /* Popup entry shake */
        @keyframes yusufPopupEntry {
          0%   { opacity: 0; transform: scale(0.92) rotate(0deg) translateX(0px); }
          10%  { opacity: 1; transform: scale(1.01) rotate(-9deg) translateX(-5px); }
          22%  { transform: scale(1.01) rotate(9deg) translateX(5px); }
          34%  { transform: scale(1.0) rotate(-8deg) translateX(-4px); }
          46%  { transform: scale(1.0) rotate(8deg) translateX(4px); }
          58%  { transform: scale(1.0) rotate(-5deg) translateX(-2px); }
          70%  { transform: scale(1.0) rotate(5deg) translateX(2px); }
          82%  { transform: scale(1.0) rotate(-2deg) translateX(-1px); }
          91%  { transform: scale(1.0) rotate(1deg) translateX(0px); }
          100% { opacity: 1; transform: scale(1) rotate(0deg) translateX(0px); }
        }
        .yusuf-popup-enter {
          animation: yusufPopupEntry 0.6s ease forwards;
        }
      `}</style>

      <div className="yusuf-popup fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto px-4">
        {/* Cursor glow */}
        <div ref={glowRef} className="yusuf-glow" />

        {/* Backdrop */}
        <button
          type="button"
          aria-label="Close member detail"
          onClick={onClose}
          className="absolute inset-0 bg-[#020c18]/80 backdrop-blur-sm"
        />

        {/* Card */}
        <div
          ref={cardRef}
          className="yusuf-card relative z-10 max-h-[100dvh] w-full max-w-[720px] overflow-y-auto rounded-2xl p-6 text-white sm:p-8"
        >
          {/* Close button */}
          <button
            type="button"
            aria-label="Close member detail"
            onClick={onClose}
            className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full text-base leading-none transition-colors hover:bg-[rgba(56,182,255,0.2)]"
            style={{
              border: '1.5px solid rgba(56,182,255,0.65)',
              background: 'rgba(56,182,255,0.08)',
              boxShadow: '0 0 8px rgba(56,182,255,0.25)',
              color: 'rgba(200,230,255,0.9)',
              fontFamily: "'Space Mono', monospace"
            }}
          >
            ✕
          </button>

          {/* Photo */}
          <div
            className="mb-5 overflow-hidden rounded-2xl cursor-default"
            style={{
              border: '1.5px solid rgba(56,182,255,0.7)',
              boxShadow: '0 0 10px rgba(56,182,255,0.3), 0 0 22px rgba(56,182,255,0.12)'
            }}
            onMouseEnter={handleShake}
          >
            <Image
              src={ProfileImage}
              alt="Profile Image"
              className="h-120 w-full object-cover object-center"
            />
          </div>

          {/* Name & NIM */}
          <div className="pr-10">
            {/* UBAH NAMA ANDA */}
            <h2 className="text-2xl font-black tracking-tight" style={{ color: '#d4edff' }}>
              Muhammad Yusuf
            </h2>
            {/* UBAH NRP DAN ASAL */}
            <p className="yusuf-nim">5027251067 — Klaten</p>
          </div>

          {/* Social links */}
          <div className="mt-5 flex gap-2">
            {/* UBAH USERNAME INSTAGRAM */}
            <span onMouseEnter={handleShake} className="inline-block">
              <Instagram username="_m.ysuff" />
            </span>
            {/* UBAH USERNAME LINKEDIN */}
            <span onMouseEnter={handleShake} className="inline-block">
              <LinkedInButtonLink username="m--yusuf" />
            </span>
          </div>

          {/* Info grid */}
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div
              className="rounded-xl p-4 bg-[rgba(10,30,55,0.5)] cursor-default"
              style={{
                border: '1.5px solid rgba(56,182,255,0.55)',
                boxShadow: '0 0 8px rgba(56,182,255,0.2), 0 0 18px rgba(56,182,255,0.08)'
              }}
              onMouseEnter={handleShake}
            >
              {/* UBAH HOBI KAMU */}
              <p className="yusuf-label">Hobi</p>
              <p className="text-sm font-semibold" style={{ color: '#c8e6ff' }}>Badminton, Main game, Nonton YouTube</p>
            </div>
            <div
              className="rounded-xl p-4 bg-[rgba(10,30,55,0.5)] cursor-default"
              style={{
                border: '1.5px solid rgba(56,182,255,0.55)',
                boxShadow: '0 0 8px rgba(56,182,255,0.2), 0 0 18px rgba(56,182,255,0.08)'
              }}
              onMouseEnter={handleShake}
            >
              {/* UBAH FUNFACT KAMU */}
              <p className="yusuf-label">Fun Fact</p>
              <p className="text-sm font-semibold" style={{ color: '#c8e6ff' }}>Suka pedes tapi gak kuat makan pedes</p>
            </div>
          </div>

          {/* Lagu favorit */}
          <div
            className="mt-3 rounded-xl p-4 bg-[rgba(10,30,55,0.5)] cursor-default"
            style={{
              border: '1.5px solid rgba(56,182,255,0.55)',
              boxShadow: '0 0 8px rgba(56,182,255,0.2), 0 0 18px rgba(56,182,255,0.08)'
            }}
            onMouseEnter={handleShake}
          >
            {/* UBAH LAGU FAVORIT KAMU */}
            <p className="yusuf-label">Lagu Favorit</p>
            <p className="my-2 text-sm font-semibold" style={{ color: '#c8e6ff' }}>December</p>

            {/* UBAH URL SPOTIFY KAMU DENGAN LAGU FAVORIT MU */}
            <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/4oVdhvxZrKQTM9ZsUIZa3S?si=edb272e809014c25" />
          </div>
        </div>
      </div>
    </>,
    document.body
  )
}

export default MemberPopup