'use client'

/* eslint-disable react/no-unescaped-entities */

import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'

import Image from 'next/image'

import Instagram from '@/components/atoms/button/InstagramButtonLink'
import LinkedInButtonLink from '@/components/atoms/button/LinkedInButtonLink'
import SpotifyEmbed from '@/components/molecules/SpotifyEmbed'

import ProfileImage from './image.jpeg'

type MemberPopupProps = {
  isOpen: boolean
  onClose: () => void
}

// ─── Stars helper ─────────────────────────────────────────────────────────────
const STAR_CHARS = ['✦', '✧', '⋆', '·'] as const
const STAR_COLORS = [
  'rgba(148,180,220,0.45)',
  'rgba(201,169,110,0.30)',
  'rgba(142,207,202,0.38)',
  'rgba(190,160,230,0.32)',
] as const

function StarField({ count }: { count: number }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          className="absolute select-none"
          style={{
            left:  `${(i * 43 + 7)  % 93}%`,
            top:   `${(i * 61 + 11) % 91}%`,
            fontSize:        `${5 + (i % 4) * 4}px`,
            color:           STAR_COLORS[i % 4],
            animation:       `botaf-twinkle ${2.2 + (i % 6) * 0.45}s ease-in-out infinite`,
            animationDelay:  `${(i * 0.28) % 4.5}s`,
          }}
        >
          {STAR_CHARS[i % 4]}
        </span>
      ))}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
const MemberPopup = ({ isOpen, onClose }: MemberPopupProps) => {
  useEffect(() => {
    if (!isOpen) return

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

  if (!isOpen) return null

  return createPortal(
    <>
      {/* ── Keyframes ── */}
      <style>{`
        @keyframes botaf-twinkle {
          0%,100% { opacity:.1;  transform:scale(.85); }
          50%      { opacity:.9;  transform:scale(1.1); }
        }
        @keyframes botaf-profile-in {
          0%   { opacity:0; transform:scale(.95) translateY(20px); filter:blur(6px); }
          100% { opacity:1; transform:scale(1)   translateY(0);    filter:blur(0px); }
        }
      `}</style>

      {/* PADA BAGIAN INI KAMU BOLEH MENGUBAH STYLE SESUKA HATI KAMU, TAPI JANGAN UBAH STRUKTUR DAN FUNGSI DARI KODE INI AGAR FUNGSI POPUP TETAP BERJALAN DENGAN BAIK */}
      <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto px-4">

        {/* ── Backdrop ── */}
        <button
          type="button"
          aria-label="Close member detail"
          onClick={onClose}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm cursor-default"
        />

        {/* ── Modal wrapper ── */}
        <div
          className="relative z-10 my-6 w-full max-w-[720px] overflow-y-auto rounded-2xl border border-[rgba(120,160,220,0.08)] p-6 text-white shadow-2xl sm:p-8"
          style={{
            /* Background diperbarui menjadi biru yang lebih gelap dan pekat */
            background: 'linear-gradient(155deg, #020813 0%, #091C3D 55%, #030A18 100%)',
            boxShadow:  '0 0 100px rgba(20,60,130,0.15)',
            animation:  'botaf-profile-in 0.75s cubic-bezier(0.16,1,0.3,1) forwards',
            maxHeight:  'calc(100dvh - 3rem)',
          }}
        >
          <StarField count={30} />
          
          <button
            type="button"
            aria-label="Close member detail"
            onClick={onClose}
            className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(120,165,220,0.18)] bg-[rgba(2,6,15,0.75)] text-xl leading-none backdrop-blur-md transition-opacity hover:opacity-70"
            style={{ color: 'rgba(160,205,245,0.55)' }}
          >
            x
          </button>

          {/* ── Profile image ── */}
          <div
            className="mb-5 overflow-hidden rounded-2xl"
            style={{
              border:    '1px solid rgba(130,172,225,0.15)',
              boxShadow: '0 8px 60px rgba(0,0,0,0.8), 0 0 80px rgba(45,108,185,0.12)',
            }}
          >
            <Image
              src={ProfileImage}
              alt="Profile Image"
              className="h-120 w-full object-cover object-center"
            />
          </div>

          {/* ── Name & origin ── */}
          <div className="pr-10 relative z-10">
            {/* UBAH NAMA ANDA */}
            <h2 className="text-2xl font-black" style={{ color: '#DFF0FA', textShadow: '0 0 40px rgba(100,150,220,0.3)' }}>
              Muhammad Atallah Mas&apos;udi
            </h2>
            {/* UBAH NRP DAN ASAL */}
            <p className="mt-1 text-sm font-semibold" style={{ color: 'rgba(138,175,222,0.7)' }}>
              5027251071 - Malang
            </p>
          </div>

          {/* ── Social links ── */}
          <div className="mt-5 flex gap-2 relative z-10">
            {/* UBAH USERNAME INSTAGRAM */}
            <Instagram username="shaelata" />
            {/* UBAH USERNAME LINKEDIN */}
            <LinkedInButtonLink username="matallah1111" />
          </div>

          {/* ── Info cards ── */}
          <div className="mt-6 grid gap-4 text-sm sm:grid-cols-2 relative z-10">
            <div
              className="rounded-xl border p-4"
              style={{
                background:     'rgba(88,148,218,0.04)',
                border:         '1px solid rgba(130,175,222,0.1)',
                backdropFilter: 'blur(12px)',
              }}
            >
              {/* UBAH HOBI KAMU */}
              <p className="text-xs tracking-wide uppercase font-semibold" style={{ color: 'rgba(138,180,232,0.6)' }}>
                Hobi
              </p>
              <p className="mt-2 font-semibold" style={{ color: '#C5DAF2' }}>
                Badminton
              </p>
            </div>

            <div
              className="rounded-xl border p-4"
              style={{
                background:     'rgba(88,148,218,0.04)',
                border:         '1px solid rgba(130,175,222,0.1)',
                backdropFilter: 'blur(12px)',
              }}
            >
              {/* UBAH FUNFACT KAMU */}
              <p className="text-xs tracking-wide uppercase font-semibold" style={{ color: 'rgba(138,180,232,0.6)' }}>
                Fun Fact
              </p>
              <p className="mt-2 font-semibold" style={{ color: '#C5DAF2' }}>
                aku sering balik malang ga bilang ke ortu
              </p>
            </div>
          </div>

          {/* ── Spotify card ── */}
          <div
            className="mt-4 rounded-xl border p-4 relative z-10"
            style={{
              background:     'rgba(100,205,200,0.03)',
              border:         '1px solid rgba(138,210,205,0.1)',
              backdropFilter: 'blur(12px)',
            }}
          >
            {/* UBAH LAGU FAVORIT KAMU */}
            <p className="text-xs font-bold tracking-wide uppercase" style={{ color: 'rgba(128,210,200,0.6)' }}>
              Lagu Favorit
            </p>
            <p className="my-2 text-sm font-semibold" style={{ color: '#A6DBD6' }}>
              BIRDS OF A FEATHER
            </p>
            {/* UBAH URL SPOTIFY KAMU DENGAN LAGU FAVORIT MU */}
            <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/6dOtVTDdiauQNBQEDOtlAB" />
          </div>

        </div>
      </div>
    </>,
    document.body
  )
}

export default MemberPopup