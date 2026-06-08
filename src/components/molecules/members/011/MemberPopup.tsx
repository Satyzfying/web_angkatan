'use client'

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

//tambahan
const CatDecoration = ({ style }: { style: React.CSSProperties }) => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ position: 'absolute', opacity: 0.12, pointerEvents: 'none', ...style }}
  >
    <polygon points="8,18 14,4 20,18" fill="#c9a96e" />
    <polygon points="28,18 34,4 40,18" fill="#c9a96e" />
    <ellipse cx="24" cy="26" rx="16" ry="14" fill="#c9a96e" />
    <ellipse cx="18" cy="24" rx="2.5" ry="3" fill="#1a1108" />
    <ellipse cx="30" cy="24" rx="2.5" ry="3" fill="#1a1108" />
    <ellipse cx="24" cy="29" rx="1.5" ry="1" fill="#a8845a" />
    <line x1="24" y1="29" x2="8" y2="27" stroke="#1a1108" strokeWidth="0.8" />
    <line x1="24" y1="30" x2="8" y2="32" stroke="#1a1108" strokeWidth="0.8" />
    <line x1="24" y1="29" x2="40" y2="27" stroke="#1a1108" strokeWidth="0.8" />
    <line x1="24" y1="30" x2="40" y2="32" stroke="#1a1108" strokeWidth="0.8" />
  </svg>
)

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
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto px-4">
      <button
        type="button"
        aria-label="Close member detail"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      <div className="relative z-10 max-h-[100dvh] w-full max-w-[720px] animate-[member-popup-show_200ms_ease-out] overflow-y-auto rounded-2xl border-2 p-6 text-white shadow-xl sm:p-8"
      style={{ backgroundColor: '#1a1108', borderColor: '#c9a96e' }}
      >
        <CatDecoration style={{ top: '8px', left: '12px', transform: 'rotate(-15deg)' }} />
        <CatDecoration style={{ top: '12px', right: '50px', transform: 'rotate(10deg)', width: 36, height: 36 }} />
        <CatDecoration style={{ bottom: '80px', left: '8px', transform: 'rotate(20deg)', width: 40, height: 40 }} />
        <CatDecoration style={{ bottom: '40px', right: '12px', transform: 'rotate(-10deg)', width: 32, height: 32 }} />
        <CatDecoration style={{ top: '45%', right: '6px', transform: 'rotate(5deg)', width: 28, height: 28 }} />
        <CatDecoration style={{ top: '360px', left: '8px', transform: 'rotate(-12deg)', width: 36, height: 36 }} />
        <CatDecoration style={{ top: '360px', right: '40%', transform: 'rotate(20deg)', width: 30, height: 30 }} />
        <CatDecoration style={{ top: '460px', left: '45%', transform: 'rotate(-5deg)', width: 32, height: 32 }} />
        <CatDecoration style={{ top: '460px', right: '6px', transform: 'rotate(18deg)', width: 38, height: 38 }} />
        <CatDecoration style={{ top: '560px', left: '10px', transform: 'rotate(10deg)', width: 28, height: 28 }} />
        <CatDecoration style={{ top: '560px', right: '30%', transform: 'rotate(-15deg)', width: 34, height: 34 }} />
        <CatDecoration style={{ top: '660px', left: '30%', transform: 'rotate(5deg)', width: 36, height: 36 }} />
        <CatDecoration style={{ top: '660px', right: '8px', transform: 'rotate(-10deg)', width: 30, height: 30 }} />
        <CatDecoration style={{ top: '760px', left: '8px', transform: 'rotate(22deg)', width: 32, height: 32 }} />
        <CatDecoration style={{ top: '760px', right: '45%', transform: 'rotate(-18deg)', width: 28, height: 28 }} />
        <CatDecoration style={{ top: '860px', left: '40%', transform: 'rotate(8deg)', width: 38, height: 38 }} />
        <CatDecoration style={{ top: '860px', right: '10px', transform: 'rotate(-22deg)', width: 30, height: 30 }} />
        <CatDecoration style={{ top: '960px', left: '6px', transform: 'rotate(15deg)', width: 34, height: 34 }} />
        <button
          type="button"
          aria-label="Close member detail"
          onClick={onClose}
          className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border text-xl leading-none transition-colors"
          style={{ borderColor: '#c9a96e', color: '#c9a96e' }}
        >
          x
        </button>

        <div className="mb-5 overflow-hidden rounded-2xl border-2" style={{ borderColor: '#c9a96e' }}>
          <Image src={ProfileImage} alt="Profile Image" className="h-120 w-full object-cover object-center" />
        </div>

        <div className="pr-10">
          {/* UBAH NAMA ANDA */}
          <h2 className="text-2xl font-black italic" style={{ color: '#f0d9a8' }}>Revalinda Bunga Nayla Laksono</h2>
          {/* UBAH NRP DAN ASAL */}
          <p className="mt-1 text-sm font-semibold" style={{ color: '#a8845a' }}>5027251011 - Ponorogo</p>
        </div>

        <div className="mt-5 flex gap-2">
          {/* UBAH USERNAME INSTAGRAM */}
          <Instagram username="rbvnga_l5" />
          {/* UBAH USERNAME LINKEDIN */}
          <LinkedInButtonLink username="revalinda-bunga-nayla-laksono" />
        </div>

        <div className="mt-6 grid gap-4 text-sm font-semibold sm:grid-cols-2">
          <div className="rounded-xl border p-4" style={{ borderColor: '#c9a96e40', backgroundColor: '#2a1e0f' }}>
            {/* UBAH HOBI KAMU */}
            <p className="text-xs tracking-wide uppercase" style={{ color: '#a8845a' }}>Hobi</p>
            <p className="mt-2" style={{ color: '#f0d9a8' }}>Membaca, Nonton, Dengerin Lagu</p>
          </div>
          <div className="rounded-xl border p-4" style={{ borderColor: '#c9a96e40', backgroundColor: '#2a1e0f' }}>
            {/* UBAH FUNFACT KAMU */}
            <p className="text-xs tracking-wide uppercase" style={{ color: '#a8845a' }}>Fun Fact</p>
            <p className="mt-2" style={{ color: '#f0d9a8' }}>Ga Suka Coklat</p>
          </div>
        </div>

        <div className="mt-4 rounded-xl border p-4" style={{ borderColor: '#c9a96e40', backgroundColor: '#2a1e0f' }}>
          {/* UBAH LAGU FAVORIT KAMU */}
          <p className="text-xs font-bold tracking-wide uppercase" style={{ color: '#a8845a' }}>Lagu Favorit</p>
          <p className="my-2 text-sm font-semibold" style={{ color: '#f0d9a8' }}>Cinnamon Girl</p>

          {/* UBAH URL SPOTIFY KAMU DENGAN LAGU FAVORIT MU */}
          <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/2mdEsXPu8ZmkHRRtAdC09e?si=WSrBH5MSQvasTnUdZXEOVQ" />
        </div>
      </div>
    </div>,
    document.body
  )
}

export default MemberPopup
