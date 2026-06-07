'use client'

import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'

import Image from 'next/image'

import Instagram from '@/components/atoms/button/InstagramButtonLink'
import LinkedInButtonLink from '@/components/atoms/button/LinkedInButtonLink'
import SpotifyEmbed from '@/components/molecules/SpotifyEmbed'

import ProfileImage from './image.png'
import MoonlightBg from './moonlight-bg.gif'

type MemberPopupProps = {
  isOpen: boolean
  onClose: () => void
}

const MemberPopup = ({ isOpen, onClose }: MemberPopupProps) => {
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
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@300;400;600&family=Shippori+Mincho:wght@400;600;700&family=M+PLUS+1p:wght@300;400;700&display=swap');

        .jp-overlay {
          background: rgba(4, 6, 22, 0.78);
        }

        @keyframes jp-rise {
          0%   { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes sakura-fall {
          0%   { transform: translateY(-20px) translateX(0) rotate(0deg); opacity: 0; }
          10%  { opacity: 0.7; }
          90%  { opacity: 0.4; }
          100% { transform: translateY(110%) translateX(30px) rotate(360deg); opacity: 0; }
        }

        @keyframes text-shimmer {
          0%   { background-position: -300% center; }
          100% { background-position: 300% center; }
        }

        @keyframes lantern-sway {
          0%, 100% { transform: rotate(-3deg); }
          50%       { transform: rotate(3deg); }
        }

        @keyframes moon-glow {
          0%, 100% { box-shadow: 0 0 24px 6px rgba(251, 229, 161, 0.3), 0 0 60px 12px rgba(251, 191, 36, 0.1); }
          50%       { box-shadow: 0 0 36px 10px rgba(251, 229, 161, 0.5), 0 0 90px 20px rgba(251, 191, 36, 0.2); }
        }

        @keyframes border-glow {
          0%, 100% { border-color: rgba(180, 120, 80, 0.4); }
          50%       { border-color: rgba(251, 191, 36, 0.45); }
        }

        .jp-card {
          animation: jp-rise 700ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
          font-family: 'M PLUS 1p', sans-serif;
          background: rgba(8, 6, 18, 0.82);
          border: 1px solid rgba(180, 120, 80, 0.4);
          border-radius: 4px;
          position: relative;
          overflow: hidden;
          overflow-y: auto;
          color: #e8dcc8;
          animation: jp-rise 700ms cubic-bezier(0.22, 1, 0.36, 1) forwards, border-glow 5s ease-in-out 800ms infinite;
        }

        .jp-video-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
          overflow: hidden;
        }

        .jp-video-bg img,
        .jp-video-bg video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
        }

        .jp-video-bg::after {
          content: '';
          position: absolute;
          inset: 0;
          background:
            linear-gradient(to bottom,
              rgba(8, 6, 18, 0.55) 0%,
              rgba(8, 6, 18, 0.45) 40%,
              rgba(8, 6, 18, 0.72) 100%
            );
          backdrop-filter: blur(3px);
          -webkit-backdrop-filter: blur(3px);
          z-index: 1;
        }

        .jp-card > * { position: relative; z-index: 2; }

        .jp-card-wrapper {
          position: relative;
          border: 1px solid rgba(180, 120, 80, 0.4);
          border-radius: 4px;
          overflow: hidden;
          max-height: calc(100vh - 9rem);
          animation: jp-rise 700ms cubic-bezier(0.22, 1, 0.36, 1) forwards,
                     border-glow 5s ease-in-out 800ms infinite;
        }

        @media (min-width: 640px) {
          .jp-card-wrapper { max-height: calc(100vh - 10rem); }
        }

        .jp-video-bg {
          position: absolute !important;
          inset: 0 !important;
          z-index: 0 !important;
          pointer-events: none !important;
          overflow: hidden !important;
        }

        .jp-video-bg img,
        .jp-video-bg video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
        }

        .jp-video-bg::after {
          content: '';
          position: absolute;
          inset: 0;
          background:
            linear-gradient(to bottom,
              rgba(8, 6, 18, 0.25) 0%,
              rgba(8, 6, 18, 0.18) 40%,
              rgba(8, 6, 18, 0.35) 100%
            );
          backdrop-filter: blur(1.5px);
          -webkit-backdrop-filter: blur(1.5px);
          z-index: 1;
        }

        .jp-card-scroll {
          position: relative;
          z-index: 2;
          overflow-y: auto;
          max-height: calc(100vh - 9rem);
        }

        @media (min-width: 640px) {
          .jp-card-scroll { max-height: calc(100vh - 10rem); }
        }

        .jp-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 1;
          opacity: 0.6;
        }

        .jp-corner {
          position: absolute;
          width: 28px;
          height: 28px;
          z-index: 5;
          opacity: 0.7;
          pointer-events: none;
        }
        .jp-corner::before,
        .jp-corner::after {
          content: '';
          position: absolute;
          background: rgba(251, 191, 36, 0.6);
        }
        .jp-corner.tl { top: 10px; left: 10px; }
        .jp-corner.tr { top: 10px; right: 10px; }
        .jp-corner.bl { bottom: 10px; left: 10px; }
        .jp-corner.br { bottom: 10px; right: 10px; }

        .jp-corner.tl::before { width: 100%; height: 1px; top: 0; left: 0; }
        .jp-corner.tl::after  { width: 1px; height: 100%; top: 0; left: 0; }
        .jp-corner.tr::before { width: 100%; height: 1px; top: 0; right: 0; }
        .jp-corner.tr::after  { width: 1px; height: 100%; top: 0; right: 0; }
        .jp-corner.bl::before { width: 100%; height: 1px; bottom: 0; left: 0; }
        .jp-corner.bl::after  { width: 1px; height: 100%; bottom: 0; left: 0; }
        .jp-corner.br::before { width: 100%; height: 1px; bottom: 0; right: 0; }
        .jp-corner.br::after  { width: 1px; height: 100%; bottom: 0; right: 0; }

        .sakura-petal {
          position: absolute;
          width: 8px;
          height: 8px;
          background: radial-gradient(circle at 40% 40%, #fda4af, #fb7185);
          border-radius: 80% 0 80% 0;
          pointer-events: none;
          z-index: 2;
          animation: sakura-fall linear infinite;
          opacity: 0;
        }
        .sakura-petal:nth-child(1) { left: 8%;  animation-duration: 9s;  animation-delay: 0s;    width: 7px;  height: 7px; }
        .sakura-petal:nth-child(2) { left: 22%; animation-duration: 11s; animation-delay: -3s;   width: 6px;  height: 6px; }
        .sakura-petal:nth-child(3) { left: 45%; animation-duration: 8s;  animation-delay: -6s;   width: 9px;  height: 9px; }
        .sakura-petal:nth-child(4) { left: 68%; animation-duration: 13s; animation-delay: -1.5s; width: 6px;  height: 6px; }
        .sakura-petal:nth-child(5) { left: 82%; animation-duration: 10s; animation-delay: -8s;   width: 8px;  height: 8px; }
        .sakura-petal:nth-child(6) { left: 57%; animation-duration: 12s; animation-delay: -4s;   width: 5px;  height: 5px; }

        .jp-moon {
          position: absolute;
          top: 18px;
          right: 54px;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 35%, #fef3c7, #fbbf24);
          animation: moon-glow 4s ease-in-out infinite;
          z-index: 2;
          pointer-events: none;
        }

        .jp-vertical-text {
          position: absolute;
          right: 16px;
          top: 80px;
          font-family: 'Shippori Mincho', serif;
          writing-mode: vertical-rl;
          font-size: 0.65rem;
          letter-spacing: 0.3em;
          color: rgba(251, 191, 36, 0.35);
          pointer-events: none;
          z-index: 2;
          user-select: none;
        }

        .jp-divider {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 14px 0;
        }
        .jp-divider::before,
        .jp-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(251, 191, 36, 0.3), transparent);
        }
        .jp-divider-icon {
          color: rgba(251, 191, 36, 0.4);
          font-size: 0.6rem;
          letter-spacing: 0.2em;
        }

        .jp-image-panel {
          border: 1px solid rgba(180, 120, 80, 0.35);
          border-radius: 3px;
          overflow: hidden;
          position: relative;
          box-shadow: 0 4px 30px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.04);
        }

        .jp-image-panel::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, transparent 55%, rgba(8, 6, 18, 0.65) 100%);
          pointer-events: none;
        }

        .jp-name {
          font-family: 'Shippori Mincho', serif;
          font-weight: 700;
          letter-spacing: 0.06em;
          background: linear-gradient(135deg, #fef3c7 0%, #fbbf24 35%, #fde68a 60%, #fef3c7 100%);
          background-size: 250% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: text-shimmer 5s linear infinite;
          line-height: 1.2;
        }

        .jp-nrp {
          display: inline-block;
          font-family: 'M PLUS 1p', sans-serif;
          font-size: 0.72rem;
          letter-spacing: 0.2em;
          color: rgba(203, 179, 140, 0.65);
          margin-top: 4px;
          text-transform: uppercase;
        }

        .jp-label {
          font-family: 'Shippori Mincho', serif;
          font-size: 0.58rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: rgba(251, 191, 36, 0.5);
          display: block;
          margin-bottom: 6px;
        }

        .jp-info-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(180, 120, 80, 0.2);
          border-radius: 3px;
          padding: 14px;
          position: relative;
          overflow: hidden;
          transition: border-color 200ms ease, background 200ms ease;
        }

        .jp-info-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: 2px;
          height: 100%;
          background: linear-gradient(to bottom, transparent, rgba(251, 191, 36, 0.4), transparent);
        }

        .jp-info-card:hover {
          border-color: rgba(251, 191, 36, 0.35);
          background: rgba(255, 255, 255, 0.05);
        }

        .jp-info-text {
          font-family: 'M PLUS 1p', sans-serif;
          font-size: 0.9rem;
          font-weight: 300;
          color: #d6c8b0;
          line-height: 1.6;
        }

        .jp-song-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(180, 120, 80, 0.2);
          border-radius: 3px;
          padding: 14px;
          position: relative;
          overflow: hidden;
        }

        .jp-song-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: 2px;
          height: 100%;
          background: linear-gradient(to bottom, transparent, rgba(251, 191, 36, 0.4), transparent);
        }

        .jp-song-card::after {
          content: '月';
          position: absolute;
          right: 12px;
          bottom: -10px;
          font-family: 'Shippori Mincho', serif;
          font-size: 6rem;
          color: rgba(251, 191, 36, 0.04);
          pointer-events: none;
          user-select: none;
          line-height: 1;
        }

        .jp-song-title {
          font-family: 'Shippori Mincho', serif;
          font-size: 0.9rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          color: rgba(251, 229, 161, 0.85);
          margin-bottom: 10px;
        }

        .jp-social a,
        .jp-social button {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          padding: 6px 10px !important;
          transition: filter 200ms ease !important;
          display: flex !important;
          align-items: center !important;
          gap: 6px !important;
        }

        .jp-social a svg,
        .jp-social button svg {
          width: 18px !important;
          height: 18px !important;
          transition: color 200ms ease, fill 200ms ease, filter 200ms ease !important;
        }

        .jp-social a:hover,
        .jp-social button:hover {
          background: transparent !important;
          filter: drop-shadow(0 0 6px rgba(251, 191, 36, 0.6)) !important;
        }

        .jp-social a:hover svg,
        .jp-social button:hover svg {
          color: #fbbf24 !important;
          fill: #fbbf24 !important;
        }

        .jp-social a:hover *,
        .jp-social button:hover * {
          color: #fbbf24 !important;
          stroke: #fbbf24 !important;
        }

        .jp-close-btn {
          background: rgba(8, 6, 18, 0.7);
          border: 1.5px solid rgba(251, 191, 36, 0.5) !important;
          border-radius: 2px;
          width: 34px;
          height: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(251, 229, 161, 0.8);
          font-size: 0.8rem;
          cursor: pointer;
          transition: background 150ms ease, color 150ms ease, border-color 150ms ease, box-shadow 150ms ease;
          position: absolute;
          top: 16px;
          right: 16px;
          z-index: 10 !important;
        }

        .jp-close-btn:hover {
          background: rgba(251, 191, 36, 0.2);
          border-color: rgba(251, 191, 36, 0.9) !important;
          color: #fef3c7;
          box-shadow: 0 0 12px rgba(251, 191, 36, 0.3);
        }
      `}</style>

      <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto px-4 pt-28 pb-8 sm:pt-32">
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto px-4">
      <button
        type="button"
        aria-label="Close member detail"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      <div className="border-neutral-cs-10 bg-blue-cs-40 relative z-10 max-h-[100dvh] w-full max-w-[720px] animate-[member-popup-show_200ms_ease-out] overflow-y-auto rounded-2xl border-2 p-6 text-white shadow-xl sm:p-8">
        <button
          type="button"
          aria-label="Close member detail"
          onClick={onClose}
          className="jp-overlay absolute inset-0"
        />

        <div className="relative z-10 w-full max-w-[720px]">
          <div className="jp-card-wrapper w-full">

            <div className="jp-video-bg">
              <img src={MoonlightBg.src} alt="" aria-hidden="true" />
            </div>

            <span className="jp-corner tl" />
            <span className="jp-corner tr" />
            <span className="jp-corner bl" />
            <span className="jp-corner br" />

            <span className="sakura-petal" />
            <span className="sakura-petal" />
            <span className="sakura-petal" />
            <span className="sakura-petal" />
            <span className="sakura-petal" />
            <span className="sakura-petal" />

            <div className="jp-moon" />

            <span className="jp-vertical-text">星街すいせい　月光</span>

            <button
              type="button"
              aria-label="Close member detail"
              onClick={onClose}
              className="jp-close-btn"
            >
              ✕
            </button>

          <div className="jp-card jp-card-scroll w-full p-6 sm:p-8">

            <div className="jp-image-panel mb-5">
              <Image src={ProfileImage} alt="Profile Image" className="h-120 w-full object-cover object-center" />
            </div>

            {/* ── NAME & NRP ── */}
            <div className="pr-10">
              {/* UBAH NAMA ANDA */}
              <h2 className="jp-name text-3xl sm:text-4xl">Akbar Reyhan Fabian Susanto</h2>
              {/* UBAH NRP DAN ASAL */}
              <span className="jp-nrp">5027251053 — Kediri</span>
            </div>

            {/* ── DIVIDER ── */}
            <div className="jp-divider">
              <span className="jp-divider-icon">✦ 月 ✦</span>
            </div>

            {/* ── SOCIAL ── */}
            <div className="jp-social flex">
              {/* UBAH USERNAME INSTAGRAM */}
              <Instagram username="arey.fs" />
              {/* UBAH USERNAME LINKEDIN */}
              <LinkedInButtonLink username="akbar-reyhan-0536b6379" />
            </div>

            {/* ── INFO CARDS ── */}
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="jp-info-card">
                {/* UBAH HOBI KAMU */}
                <span className="jp-label">趣味 / Hobi</span>
                <p className="jp-info-text">Anime, Art</p>
              </div>
              <div className="jp-info-card">
                {/* UBAH FUNFACT KAMU */}
                <span className="jp-label">豆知識 / Fun Fact</span>
                <p className="jp-info-text">Makanan favorit udang tapi alergi udang</p>
              </div>
            </div>

            {/* ── SONG ── */}
            <div className="jp-song-card mt-3">
              {/* UBAH LAGU FAVORIT KAMU */}
              <span className="jp-label">好きな曲 / Lagu Favorit</span>
              <p className="jp-song-title">Moonlight — Hoshimachi Suisei</p>
              {/* UBAH URL SPOTIFY KAMU DENGAN LAGU FAVORIT MU */}
              <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/7fcEOJGsOOVyz8XeDwvLRZ?si=c332a2611a0542d6" />
            </div>

          </div>
          </div>
        </div>
      </div>
    </>
    </div>,
    document.body
  )
}

export default MemberPopup
