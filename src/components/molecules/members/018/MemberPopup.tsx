'use client'

import React, { useEffect } from 'react'

import Image from 'next/image'

import Instagram from '@/components/atoms/button/InstagramButtonLink'
import LinkedInButtonLink from '@/components/atoms/button/LinkedInButtonLink'
import SpotifyEmbed from '@/components/molecules/SpotifyEmbed'

import ProfileImage from './image.jpeg'
import { createPortal } from 'react-dom'

type MemberPopupProps = {
  isOpen: boolean
  onClose: () => void
}

const MemberPopup = ({ isOpen, onClose }: MemberPopupProps) => {
  const handleDecorPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty('--cursor-x', `${event.clientX - rect.left}px`)
    event.currentTarget.style.setProperty('--cursor-y', `${event.clientY - rect.top}px`)
  }

  const handleDecorPointerLeave = (event: React.PointerEvent<HTMLDivElement>) => {
    event.currentTarget.style.setProperty('--cursor-x', '0px')
    event.currentTarget.style.setProperty('--cursor-y', '0px')
  }

  useEffect(() => {
    if (!isOpen) {
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

  if (!isOpen) {
    return null
  }

  return createPortal(
    // PADA BAGIAN INI KAMU BOLEH MENGUBAH STYLE SESUKA HATI KAMU, TAPI JANGAN UBAH STRUKTUR DAN FUNGSI DARI KODE INI AGAR FUNGSI POPUP TETAP BERJALAN DENGAN BAIK
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto px-4">
      <button
        type="button"
        aria-label="Close member detail"
        onClick={onClose}
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,214,122,0.12),_transparent_35%),_linear-gradient(180deg,_rgba(0,0,0,0.82)_0%,_rgba(0,0,0,0.95)_100%)] backdrop-blur-md transition duration-300 hover:bg-[radial-gradient(circle_at_center,_rgba(255,214,122,0.18),_transparent_35%),_linear-gradient(180deg,_rgba(0,0,0,0.88)_0%,_rgba(0,0,0,0.98)_100%)] touch-pan-y"
      />

      <div
        className="popup-card border-yellow-cs-30/40 bg-[radial-gradient(circle_at_top_right,_rgba(255,214,122,0.18),_transparent_30%),_linear-gradient(180deg,_rgba(35,21,12,0.96)_0%,_rgba(15,9,5,0.98)_100%)] relative z-10 max-h-[100dvh] w-full max-w-[720px] animate-[member-popup-show_200ms_ease-out] overflow-y-auto rounded-[28px] border-2 p-6 text-white shadow-[0_28px_90px_-24px_rgba(0,0,0,0.8)] ring-1 ring-yellow-cs-20/20 transition duration-500 hover:shadow-[0_44px_120px_-42px_rgba(255,214,122,0.32)] sm:p-8"
        onPointerMove={handleDecorPointerMove}
        onPointerLeave={handleDecorPointerLeave}
      >
        <button
          type="button"
          aria-label="Close member detail"
          onClick={onClose}
          className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border border-yellow-cs-20/60 bg-yellow-cs-20/15 text-yellow-cs-20 text-xl leading-none shadow-[0_12px_30px_-18px_rgba(255,214,122,0.75)] transition duration-300 hover:-translate-y-0.5 hover:scale-105 hover:bg-yellow-cs-20/30 active:scale-95"
        >
          x
        </button>

        <div className="border-yellow-cs-20/20 mb-5 overflow-hidden rounded-2xl border bg-black/10 shadow-inner transition duration-500 hover:-translate-y-1 hover:shadow-[0_30px_60px_-34px_rgba(255,214,122,0.55)]">
          <Image src={ProfileImage} alt="Profile Image" className="h-120 w-full object-cover object-center transition duration-700 ease-out hover:scale-[1.04] hover:rotate-[0.2deg]" />
        </div>

        <span className="popup-note" style={{ '--note-x': '48px', '--note-y': '32px', '--note-rotation': '-12deg' } as React.CSSProperties}>♪</span>
        <span className="popup-note" style={{ '--note-x': '216px', '--note-y': '28px', '--note-rotation': '10deg' } as React.CSSProperties}>♫</span>
        <span className="popup-note" style={{ '--note-x': '128px', '--note-y': '108px', '--note-rotation': '6deg' } as React.CSSProperties}>♬</span>
        <span className="popup-note" style={{ '--note-x': '46px', '--note-y': '180px', '--note-rotation': '-18deg' } as React.CSSProperties}>🎵</span>
        <span className="popup-note" style={{ '--note-x': '310px', '--note-y': '72px', '--note-rotation': '14deg' } as React.CSSProperties}>★</span>

        <div className="pr-10">
          {/* UBAH NAMA ANDA */}
          <h2 className="popup-title text-3xl font-black tracking-[0.03em] text-yellow-cs-10 drop-shadow-[0_8px_30px_rgba(0,0,0,0.25)]">Nazwa Aulia Dwi P</h2>
          {/* UBAH NRP DAN ASAL */}
          <p className="popup-subtitle text-neutral-cs-10/60 mt-1 text-sm font-semibold tracking-[0.02em]">5027251018 - Lumajang</p>
        </div>

        <div className="mt-5 flex flex-wrap gap-3 social-links">
          {/* UBAH USERNAME INSTAGRAM */}
          <Instagram username="nazwaadp" />
          {/* UBAH USERNAME LINKEDIN */}
          <LinkedInButtonLink username="nazwaauliadwipurnomo" />
        </div>

        <div className="popup-info-grid mt-6 grid gap-4 text-sm font-semibold sm:grid-cols-2">
          <div className="popup-info-card border-yellow-cs-20/20 rounded-xl border bg-black/10 p-4 backdrop-blur-sm transition duration-300 hover:-translate-y-0.5 hover:bg-black/15 hover:shadow-[0_16px_40px_-34px_rgba(255,214,122,0.55)]">
            {/* UBAH HOBI KAMU */}
            <p className="text-neutral-cs-10/60 text-xs tracking-[0.24em] uppercase">Hobi</p>
            <p className="mt-2">Olahraga :D</p>
          </div>
          <div className="popup-info-card border-yellow-cs-20/20 rounded-xl border bg-black/10 p-4 backdrop-blur-sm transition duration-300 hover:-translate-y-0.5 hover:bg-black/15 hover:shadow-[0_16px_40px_-34px_rgba(255,214,122,0.55)]">
            {/* UBAH FUNFACT KAMU */}
            <p className="text-neutral-cs-10/60 text-xs tracking-[0.24em] uppercase">Fun Fact</p>
            <p className="mt-2">Pernah jadi admin fanbase Gen Halilintar Jawa Timur</p>
          </div>
        </div>

        <div className="popup-track border-yellow-cs-20/20 mt-4 rounded-xl border bg-black/10 p-4 shadow-sm backdrop-blur-sm transition duration-300 hover:-translate-y-0.5 hover:bg-black/15 hover:shadow-[0_18px_60px_-38px_rgba(255,214,122,0.45)]">
          {/* UBAH LAGU FAVORIT KAMU */}
          <p className="text-neutral-cs-10/60 text-xs font-bold tracking-[0.24em] uppercase">Lagu Favorit</p>
          <p className="my-2 text-sm font-semibold text-yellow-cs-10">Wonderwall - Remastered</p>

          {/* UBAH URL SPOTIFY KAMU DENGAN LAGU FAVORIT MU */}
          <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/5qqabIl2vWzo9ApSC317sa?si=KOgOCmtcSSW7DJ4GVMzj0Q&pi=9E9lJQbNTVmuE" />
        </div>

        <span className="popup-instrument" style={{ '--instrument-left': '34px', '--instrument-top': 'calc(100% - 80px)', '--instrument-rotation': '-14deg' } as React.CSSProperties}>🎸</span>
        <span className="popup-instrument" style={{ '--instrument-left': '136px', '--instrument-top': 'calc(100% - 92px)', '--instrument-rotation': '8deg' } as React.CSSProperties}>🎹</span>
        <span className="popup-instrument" style={{ '--instrument-left': '246px', '--instrument-top': 'calc(100% - 70px)', '--instrument-rotation': '12deg' } as React.CSSProperties}>🥁</span>
        <span className="popup-instrument" style={{ '--instrument-left': '332px', '--instrument-top': 'calc(100% - 86px)', '--instrument-rotation': '-8deg' } as React.CSSProperties}>🎻</span>
        <span className="popup-instrument" style={{ '--instrument-left': '420px', '--instrument-top': 'calc(100% - 78px)', '--instrument-rotation': '16deg' } as React.CSSProperties}>🎷</span>
      </div>
      <style jsx>{`
        .social-links :global(a) {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 3rem;
          height: 3rem;
          border-radius: 9999px;
          border: 1px solid rgba(255, 214, 122, 0.24);
          background: rgba(23, 12, 6, 0.55);
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.05);
          transition: transform 230ms ease, background-color 230ms ease, border-color 230ms ease, box-shadow 230ms ease, filter 230ms ease;
        }

        .social-links :global(a:hover) {
          transform: translateY(-2px);
          background: rgba(255, 214, 122, 0.24);
          border-color: rgba(255, 214, 122, 0.72);
          box-shadow: 0 12px 35px -24px rgba(255, 214, 122, 0.45);
        }

        .social-links :global(a:hover img) {
          filter: saturate(1.4) brightness(1.1) sepia(0.18);
        }

        .social-links :global(a:focus-visible) {
          outline: 2px solid rgba(255, 214, 122, 0.9);
          outline-offset: 4px;
        }

        .social-links :global(a:active) {
          transform: translateY(0) scale(0.97);
        }

        .popup-card {
          position: relative;
          overflow: auto;
          -webkit-overflow-scrolling: touch;
          font-family: Georgia, Cambria, 'Times New Roman', Times, serif;
          font-variant-ligatures: discretionary-ligatures;
          font-feature-settings: 'liga' 1, 'dlig' 1, 'calt' 1;
          letter-spacing: 0.01em;
          background: rgba(25, 12, 6, 0.96);
          background-image: linear-gradient(160deg, rgba(255, 214, 122, 0.08), transparent 35%), radial-gradient(circle at 18% 12%, rgba(255, 238, 191, 0.08), transparent 18%), radial-gradient(circle at 80% 75%, rgba(255, 174, 55, 0.1), transparent 16%);
          background-blend-mode: screen, normal, normal;
          border-color: rgba(255, 214, 122, 0.24);
        }

        .popup-note {
          position: absolute;
          left: var(--note-x, 0px);
          top: var(--note-y, 0px);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 2rem;
          height: 2rem;
          color: rgba(255, 214, 122, 0.95);
          font-size: 1rem;
          text-shadow: 0 0 18px rgba(255, 214, 122, 0.24);
          transform: translate(calc((var(--note-x, 0px) - var(--cursor-x, 0px)) * 0.09), calc((var(--note-y, 0px) - var(--cursor-y, 0px)) * 0.09)) rotate(var(--note-rotation, 0deg));
          transition: transform 220ms ease, opacity 220ms ease;
          pointer-events: none;
          opacity: 0.88;
        }

        .popup-note:hover {
          opacity: 1;
          transform: scale(1.03) translate(calc((var(--note-x, 0px) - var(--cursor-x, 0px)) * 0.12), calc((var(--note-y, 0px) - var(--cursor-y, 0px)) * 0.12)) rotate(var(--note-rotation, 0deg));
        }

        .popup-instrument {
          position: absolute;
          left: var(--instrument-left, 0px);
          top: var(--instrument-top, 0px);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 2.3rem;
          height: 2.3rem;
          color: rgba(255, 214, 122, 0.96);
          font-size: 1.25rem;
          text-shadow: 0 0 18px rgba(255, 214, 122, 0.22);
          transform: translate(calc((var(--instrument-left, 0px) - var(--cursor-x, 0px)) * 0.1), calc((var(--instrument-top, 0px) - var(--cursor-y, 0px)) * 0.1)) rotate(var(--instrument-rotation, 0deg));
          transition: transform 220ms ease, opacity 220ms ease;
          pointer-events: none;
          opacity: 0.92;
        }

        .popup-instrument:hover {
          opacity: 1;
          transform: scale(1.05) translate(calc((var(--instrument-left, 0px) - var(--cursor-x, 0px)) * 0.14), calc((var(--instrument-top, 0px) - var(--cursor-y, 0px)) * 0.14)) rotate(var(--instrument-rotation, 0deg));
        }

        .popup-card::before {
          content: '';
          position: absolute;
          inset: 0;
          pointer-events: none;
          background-image: linear-gradient(90deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.02) 50%, transparent 50%, transparent 100%), linear-gradient(180deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.02) 50%, transparent 50%, transparent 100%);
          background-size: 11px 11px;
          opacity: 0.18;
          mix-blend-mode: lighten;
        }

        .popup-card::after {
          content: '';
          position: absolute;
          top: 1.25rem;
          right: 1.25rem;
          width: 4.5rem;
          height: 4.5rem;
          border: 1px dashed rgba(255, 214, 122, 0.24);
          border-radius: 9999px;
          opacity: 0.55;
          transform: rotate(12deg);
          pointer-events: none;
          animation: vintage-glow 6s ease-in-out infinite;
        }

        .popup-image::before {
          content: '';
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: linear-gradient(180deg, rgba(255, 214, 122, 0.08), rgba(255, 214, 122, 0) 55%);
          mix-blend-mode: screen;
        }

        .popup-header {
          position: relative;
        }

        .popup-title {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.15rem 0.85rem;
          border-radius: 9999px;
          background: rgba(255, 214, 122, 0.12);
          border: 1px solid rgba(255, 214, 122, 0.18);
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.06);
        }

        .popup-title::after {
          content: '★';
          position: absolute;
          top: -0.5rem;
          right: -0.75rem;
          color: rgba(255, 214, 122, 0.6);
          font-size: 1rem;
          opacity: 0.9;
        }

        .popup-subtitle {
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .popup-info-grid {
          position: relative;
        }

        .popup-info-card {
          position: relative;
        }

        .popup-info-card::after {
          content: '';
          position: absolute;
          right: 0.75rem;
          top: 0.75rem;
          width: 0.75rem;
          height: 0.75rem;
          border-radius: 9999px;
          border: 1px dashed rgba(255, 214, 122, 0.28);
          opacity: 0.8;
          pointer-events: none;
        }

        .popup-track {
          position: relative;
        }

        .popup-track::before {
          content: '';
          position: absolute;
          left: 1rem;
          top: -0.8rem;
          width: 1.8rem;
          height: 1.8rem;
          border-radius: 9999px;
          border: 1px dashed rgba(255, 255, 255, 0.16);
          opacity: 0.65;
          pointer-events: none;
        }

        .popup-track::after {
          content: '♫';
          position: absolute;
          top: -1.25rem;
          right: 1rem;
          color: rgba(255, 214, 122, 0.55);
          font-size: 1rem;
          opacity: 0.9;
          pointer-events: none;
          animation: vintage-glow 8s ease-in-out infinite;
        }

        @keyframes vintage-glow {
          0%, 100% {
            opacity: 0.55;
            transform: scale(1) rotate(12deg);
          }
          50% {
            opacity: 0.75;
            transform: scale(1.04) rotate(12deg);
          }
        }
      `}</style>
    </div>,
    document.body
  )
}

export default MemberPopup
