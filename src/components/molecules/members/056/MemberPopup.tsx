'use client'

import React, { useEffect } from 'react'
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

const MemberPopup = ({ isOpen, onClose }: MemberPopupProps) => {
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

  if (!isOpen) return null

  const lefts  = [2,6,11,16,21,26,31,36,41,46,51,56,61,66,71,76,81,86,91,96,14,38,62,84]
  const durs   = [4.5,5.2,3.9,6.1,4.8,5.6,3.6,5.0,4.2,6.3,4.0,5.4,3.7,4.9,6.0,3.8,5.1,4.6,5.9,4.3,5.7,4.1,6.2,3.5]
  const delays = [0,1.3,0.5,2.2,0.9,1.8,3.1,0.4,2.6,1.1,0.7,3.4,1.6,2.9,0.2,2.0,3.6,0.6,2.3,1.4,1.0,2.8,0.3,3.2]
  const sizes  = [28,24,32,26,30,25,34,28,26,31,24,29,32,27,30,25,29,27,32,28,27,30,25,29]

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto px-4 pt-28 pb-8 sm:pt-32">
  return createPortal(
    // PADA BAGIAN INI KAMU BOLEH MENGUBAH STYLE SESUKA HATI KAMU, TAPI JANGAN UBAH STRUKTUR DAN FUNGSI DARI KODE INI AGAR FUNGSI POPUP TETAP BERJALAN DENGAN BAIK
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
          className="border-neutral-cs-10 hover:bg-neutral-cs-10/10 absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border text-xl leading-none"
        >
          x
        </button>

        <div className="border-neutral-cs-10/40 mb-5 overflow-hidden rounded-2xl border">
          <Image src={ProfileImage} alt="Profile Image" className="h-120 w-full object-cover object-center" />
        </div>

      <style>{`
        @keyframes petalFall {
          0%   { transform:translateY(-40px) translateX(0px) rotate(0deg) scale(1); opacity:0; }
          8%   { opacity:1; }
          50%  { transform:translateY(50vh) translateX(40px) rotate(380deg) scale(0.88); opacity:1; }
          100% { transform:translateY(110vh) translateX(-20px) rotate(780deg) scale(0.55); opacity:0; }
        }
        .rose-petal { position:fixed; pointer-events:none; animation:petalFall ease-in infinite; z-index:99999; }
      `}</style>

      {/* PETALS */}
      {lefts.map((l, i) => (
        <svg key={i} className="rose-petal"
          style={{ left:`${l}%`, top:'-40px', width:`${sizes[i]}px`, height:`${Math.round(sizes[i]*1.4)}px`,
            animationDuration:`${durs[i]}s`, animationDelay:`${delays[i]}s` }}
          viewBox="0 0 20 28" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 0 C4 2 0 8 0 14 C0 21 4.5 28 10 28 C15.5 28 20 21 20 14 C20 8 16 2 10 0Z" fill="#c0392b"/>
          <path d="M10 0 C10 9 7 17 10 28 C13 17 10 9 10 0Z" fill="#7b241c" opacity="0.6"/>
          <path d="M10 0 C6 5 3 11 5 17 C7 13 9 6 10 0Z" fill="#e74c3c" opacity="0.4"/>
        </svg>
      ))}

      {/* backdrop — fixed bukan absolute biar ga ikut scroll */}
      <button type="button" aria-label="Close member detail" onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm" />

      {/* MAIN CARD */}
      <div
        className="relative z-10 w-full max-w-[720px] animate-[member-popup-show_200ms_ease-out] rounded-2xl shadow-2xl"
        style={{
          background: '#3d4a28',
          border: '5px solid #f4a7b9',
          outline: '3px solid #f4a7b9',
          outlineOffset: '4px',
        }}
      >
        <div className="relative z-10 p-6 sm:p-8">

          <button type="button" aria-label="Close member detail" onClick={onClose}
            className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full text-xl leading-none text-white hover:text-white/70 transition-colors"
            style={{ border:'2px solid #f4a7b9', background:'rgba(0,0,0,0.4)' }}>
            ×
          </button>

          <div className="mb-5 overflow-hidden rounded-2xl" style={{ border:'4px solid #f4a7b9' }}>
            <Image src={ProfileImage} alt="Profile Image" className="h-120 w-full object-cover object-center" />
          </div>

          <div className="pr-10">
            {/* UBAH NAMA ANDA */}
            <h2 className="text-2xl font-black text-white">Aliya Rahmadina</h2>
            {/* UBAH NRP DAN ASAL */}
            <p className="mt-1 text-sm font-semibold text-white/70">5027251056 - Bojonegoro</p>
          </div>

          <div className="mt-5 flex gap-2">
            {/* UBAH USERNAME INSTAGRAM */}
            <Instagram username="aliyaarad" />
            {/* UBAH USERNAME LINKEDIN */}
            <LinkedInButtonLink username="aliyarahmadina" />
          </div>

          {/* Hobi & Funfact */}
          <div className="mt-6 grid gap-4 text-sm font-semibold sm:grid-cols-2">
            <div className="rounded-xl p-4" style={{ background:'#6b0f0f', border:'4px solid #f4a7b9' }}>
              {/* UBAH HOBI KAMU */}
              <p className="text-xs tracking-wide uppercase text-white/60">Hobi</p>
              <p className="mt-2 text-white">Dengerin lagu</p>
            </div>
            <div className="rounded-xl p-4" style={{ background:'#6b0f0f', border:'4px solid #f4a7b9' }}>
              {/* UBAH FUNFACT KAMU */}
              <p className="text-xs tracking-wide uppercase text-white/60">Fun Fact</p>
              <p className="mt-2 text-white">Paling gabisa nonton horor sendirian</p>
            </div>
          </div>

          {/* Lagu Favorit */}
          <div className="mt-4 rounded-xl p-4" style={{ background:'#6b0f0f', border:'4px solid #f4a7b9' }}>
            {/* UBAH LAGU FAVORIT KAMU */}
            <p className="text-xs font-bold tracking-wide uppercase text-white/60">Lagu Favorit</p>
            <p className="my-2 text-sm font-semibold text-white">Let Me Love You</p>
            {/* UBAH URL SPOTIFY KAMU */}
            <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/59NC8SuXPiSaiYL69XQ4dt?si=066b1ae7d3e74fae" />
          </div>

        </div>
      </div>
    </div>,
    document.body
  )
}

export default MemberPopup