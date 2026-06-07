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

    // Popup entry shake
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
          border: 1.5px solid rgba(56,182,255,0.75) !important;
          box-shadow:
            0 0 14px rgba(56,182,255,0.35),
            0 0 32px rgba(56,182,255,0.14),
            inset 0 1px 0 rgba(255,255,255,0.08);
        }

        .yusuf-close {
          border: 1.5px solid rgba(56,182,255,0.65) !important;
          background: rgba(56,182,255,0.08) !important;
          box-shadow: 0 0 8px rgba(56,182,255,0.22);
          color: rgba(200,230,255,0.9) !important;
          font-family: 'Space Mono', monospace;
          transition: background 0.2s;
        }
        .yusuf-close:hover { background: rgba(56,182,255,0.2) !important; }

        .yusuf-photo {
          border: 1.5px solid rgba(56,182,255,0.7) !important;
          box-shadow: 0 0 12px rgba(56,182,255,0.32), 0 0 24px rgba(56,182,255,0.12);
        }

        .yusuf-name {
          font-family: 'DM Sans', sans-serif;
          font-weight: 900;
          color: #d4edff !important;
          letter-spacing: -0.3px;
        }

        .yusuf-nim {
          font-family: 'Space Mono', monospace !important;
          color: rgba(150,200,255,0.55) !important;
        }

        .yusuf-infobox {
          border: 1.5px solid rgba(56,182,255,0.55) !important;
          box-shadow: 0 0 8px rgba(56,182,255,0.18), 0 0 18px rgba(56,182,255,0.07);
          background: rgba(10,30,55,0.45) !important;
        }

        .yusuf-infobox p:first-child {
          font-family: 'Space Mono', monospace;
          font-size: 10px; font-weight: 700;
          letter-spacing: 1.2px; text-transform: uppercase;
          color: rgba(100,180,255,0.6) !important;
        }

        .yusuf-infobox p:last-child {
          color: #c8e6ff !important;
        }

        .yusuf-songbox {
          border: 1.5px solid rgba(56,182,255,0.55) !important;
          box-shadow: 0 0 8px rgba(56,182,255,0.18), 0 0 18px rgba(56,182,255,0.07);
          background: rgba(10,30,55,0.45) !important;
        }

        .yusuf-songbox p:first-child {
          font-family: 'Space Mono', monospace;
          font-size: 10px; font-weight: 700;
          letter-spacing: 1.2px; text-transform: uppercase;
          color: rgba(100,180,255,0.6) !important;
        }

        .yusuf-songbox p.yusuf-songtitle {
          color: #c8e6ff !important;
        }

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
          90%  { transform: rotate(-1deg) translateX(0px); }
          100% { transform: rotate(0deg) translateX(0px); }
        }
        .yusuf-shake { animation: yusufSixSeven 0.45s ease forwards; }

        @keyframes yusufPopupEntry {
          0%   { opacity: 0; transform: scale(0.92) rotate(0deg); }
          12%  { opacity: 1; transform: scale(1.01) rotate(-9deg) translateX(-5px); }
          24%  { transform: scale(1.0) rotate(9deg) translateX(5px); }
          36%  { transform: scale(1.0) rotate(-8deg) translateX(-4px); }
          48%  { transform: scale(1.0) rotate(8deg) translateX(4px); }
          60%  { transform: scale(1.0) rotate(-5deg) translateX(-2px); }
          72%  { transform: scale(1.0) rotate(5deg) translateX(2px); }
          84%  { transform: scale(1.0) rotate(-2deg) translateX(-1px); }
          92%  { transform: scale(1.0) rotate(1deg); }
          100% { opacity: 1; transform: scale(1) rotate(0deg) translateX(0px); }
        }
        .yusuf-popup-enter { animation: yusufPopupEntry 0.6s ease forwards; }
      `}</style>

      <div className="yusuf-popup fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto px-4">
        {/* Cursor glow */}
        <div ref={glowRef} className="yusuf-glow" />

        <button
          type="button"
          aria-label="Close member detail"
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        <div
          ref={cardRef}
          className="yusuf-card border-neutral-cs-10 relative z-10 max-h-screen w-full max-w-[720px] overflow-y-auto rounded-2xl border-2 p-6 text-white shadow-xl sm:p-8"
        >
          <button
            type="button"
            aria-label="Close member detail"
            onClick={onClose}
            className="yusuf-close border-neutral-cs-10 absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border text-xl leading-none"
          >
            x
          </button>

          {/* FOTO — ukuran h-120 tetap persis */}
          <div
            className="yusuf-photo border-neutral-cs-10/40 mb-5 overflow-hidden rounded-2xl border cursor-default"
            onMouseEnter={handleShake}
          >
            <Image
              src={ProfileImage}
              alt="Profile Image"
              className="h-120 w-full object-cover object-center"
            />
          </div>

          <div className="pr-10">
            {/* UBAH NAMA ANDA */}
            <h2 className="yusuf-name text-2xl font-black">Muhammad Yusuf</h2>
            {/* UBAH NRP DAN ASAL */}
            <p className="yusuf-nim mt-1 text-sm font-semibold">5027251067 - Klaten</p>
          </div>

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

          <div className="mt-6 grid gap-4 text-sm font-semibold sm:grid-cols-2">
            <div
              className="yusuf-infobox border-neutral-cs-10/40 rounded-xl border p-4 cursor-default"
              onMouseEnter={handleShake}
            >
              {/* UBAH HOBI KAMU */}
              <p className="text-neutral-cs-10/60 text-xs tracking-wide uppercase">Hobi</p>
              <p className="mt-2">Badminton, Main game, Nonton YouTube, Nonton Film</p>
            </div>
            <div
              className="yusuf-infobox border-neutral-cs-10/40 rounded-xl border p-4 cursor-default"
              onMouseEnter={handleShake}
            >
              {/* UBAH FUNFACT KAMU */}
              <p className="text-neutral-cs-10/60 text-xs tracking-wide uppercase">Fun Fact</p>
              <p className="mt-2">Suka pedes tapi gak kuat makan pedes</p>
            </div>
          </div>

          <div
            className="yusuf-songbox border-neutral-cs-10/40 mt-4 rounded-xl border p-4 cursor-default"
            onMouseEnter={handleShake}
          >
            {/* UBAH LAGU FAVORIT KAMU */}
            <p className="text-neutral-cs-10/60 text-xs font-bold tracking-wide uppercase">Lagu Favorit</p>
            <p className="yusuf-songtitle my-2 text-sm font-semibold">December</p>

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