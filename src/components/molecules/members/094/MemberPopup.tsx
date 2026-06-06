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
<div className="group/modal fixed inset-0 z-[100] flex items-start justify-center overflow-hidden bg-black/40 px-4 backdrop-blur-md">
  
  {/* INLINE CUSTOM ANIMATION - Menghasilkan efek kelas dunia tanpa merusak config project */}
  <style>{`
    @keyframes antiMagicAura {
      0% { transform: scale(1) rotate(0deg); opacity: 0.4; filter: blur(20px); }
      50% { transform: scale(1.05) rotate(180deg); opacity: 0.6; filter: blur(25px); }
      100% { transform: scale(1) rotate(360deg); opacity: 0.4; filter: blur(20px); }
    }
    @keyframes fireFlicker {
      0%, 100% { box-shadow: 0 0 20px rgba(239, 68, 68, 0.5), inset 0 0 15px rgba(249, 115, 22, 0.3); }
      50% { box-shadow: 0 0 35px rgba(249, 115, 22, 0.8), inset 0 0 25px rgba(239, 68, 68, 0.5); }
    }
    @keyframes grimoireUnlock {
      0% { transform: scale(1); opacity: 1; visibility: visible; }
      40% { transform: scale(1.02); filter: hue-rotate(45deg); opacity: 1; }
      99% { transform: scale(0.95); opacity: 0; filter: blur(10px); visibility: visible; }
      100% { transform: scale(0.95); opacity: 0; filter: blur(10px); visibility: hidden; }
    }
    @keyframes chainBreakLeft {
      0% { transform: translateX(0) rotate(0deg); opacity: 1; }
      100% { transform: translateX(-150px) rotate(-45deg); opacity: 0; }
    }
    @keyframes chainBreakRight {
      0% { transform: translateX(0) rotate(0deg); opacity: 1; }
      100% { transform: translateX(150px) rotate(45deg); opacity: 0; }
    }
    .animate-aura { animation: antiMagicAura 6s infinite linear; }
    .animate-fire-active:hover { animation: fireFlicker 0.8s infinite alternate; }
    .animate-unlock { animation: grimoireUnlock 1.2s cubic-bezier(0.77, 0, 0.175, 1) forwards; animation-delay: 0.2s; }
    .animate-chain-l { animation: chainBreakLeft 1s cubic-bezier(0.77, 0, 0.175, 1) forwards; animation-delay: 0.4s; }
    .animate-chain-r { animation: chainBreakRight 1s cubic-bezier(0.77, 0, 0.175, 1) forwards; animation-delay: 0.4s; }
  `}</style>

  <button
    type="button"
    aria-label="Close member detail"
    onClick={onClose}
    className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-[#120303]/90 transition-all duration-500"
  />

  {/* MAIN CONTAINER: Diubah menjadi tekstur Grimoire kulit hitam legam dengan border api Fire Force */}
  <div className="relative z-10 h-[100dvh] max-h-[100dvh] w-full max-w-[720px] overflow-y-auto p-6 sm:p-8 rounded-2xl border-2 text-white shadow-2xl transition-all duration-500 ease-out select-none cursor-pointer
    bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-900 via-[#0d0707] to-black
    border-orange-600/40 hover:border-orange-500 group/card animate-fire-active
    active:scale-[0.99] active:rotate-1">

    {/* BACKGROUND EFFECT: Aura Anti-SMagic Hitam Merah mengambang di belakang */}
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl z-0">
      <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,_rgba(239,68,68,0.15),_rgba(0,0,0,0)_50%)] animate-aura" />
      <div className="absolute -bottom-1/2 -right-1/2 w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,_rgba(0,0,0,0.8),_rgba(249,115,22,0.08)_60%)] animate-aura" style={{ animationDirection: 'reverse' }} />
      {/* Garis Grid Taktis ala Fire Force */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(255,255,255,0.02)_1px,_transparent_1px)] bg-[size:20px_20px] mix-blend-overlay opacity-40" />
    </div>

    {/* SENSOR / INTERACTIVE LAYER: Efek bara api beterbangan saat kursor bergerak di dalam card */}
    <div className="absolute inset-0 pointer-events-none z-10 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_var(--x,50%)_var(--y,50%),_rgba(249,115,22,0.12)_0%,_transparent_50%)]" 
         onMouseMove={(e) => {
           const rect = e.currentTarget.getBoundingClientRect();
           e.currentTarget.style.setProperty('--x', `${e.clientX - rect.left}px`);
           e.currentTarget.style.setProperty('--y', `${e.clientY - rect.top}px`);
         }}
    />

    {/* ORNAMEN IDENTITAS: Teks taktis Unit Pemadam x Ksatria Sihir */}
    <div className="relative z-10 flex justify-between items-center mb-6 border-b border-orange-500/20 pb-2 text-[10px] font-mono tracking-widest text-orange-500/70">
      <div className="flex items-center gap-2">
        <span className="inline-block w-2 h-2 bg-red-600 rounded-full animate-pulse" />
        <span>SQUAD: BLACK BULLS // CO-8</span>
      </div>
      <div>HEATING LEVEL: MAX_OVERDRIVE</div>
    </div>

    <button
      type="button"
      aria-label="Close member detail"
      onClick={onClose}
      className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border text-xl leading-none z-30 transition-all duration-300
        border-orange-500/30 text-orange-500 bg-black/40 backdrop-blur-sm
        hover:bg-red-600 hover:text-white hover:border-red-600 hover:scale-110 hover:shadow-[0_0_15px_rgba(239,68,68,0.6)]"
    >
      ×
    </button>

    {/* FOTO PROFIL: Diubah bingkainya menjadi bergaya Heavy Industrial dengan indikator Warning Sign Fire Force */}
    <div className="mb-5 overflow-hidden rounded-2xl border relative z-20 transition-all duration-500 group-hover/card:scale-[1.01]
      border-neutral-800 group-hover/card:border-orange-500 shadow-lg group-hover/card:shadow-[0_0_25px_rgba(249,115,22,0.3)]">
      
      {/* Garis hazard oranye khas Fire Force */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-stripes bg-[linear-gradient(45deg,#f97316_25%,#000_25%,#000_50%,#f97316_50%,#f97316_75%,#000_75%,#000)] bg-[size:15px_15px] opacity-80" />
      
      <Image src={ProfileImage} alt="Profile Image" className="h-120 w-full object-cover object-center filter grayscale contrast-125 brightness-90 group-hover/card:grayscale-0 transition-all duration-700" />
      
      {/* Shadow overlay penambah aura mistis di dalam foto */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
    </div>

    {/* SCREEN PEMBUKA: Animasi "Grimoire Asta Locked" yang hancur terbuka saat popup dipicu */}
    <div className="absolute inset-0 z-50 rounded-2xl bg-[radial-gradient(inset_0_0_50px_rgba(0,0,0,1)),_linear-gradient(135deg,#111,#050505)] border-4 border-[#2a2115] flex flex-col items-center justify-center p-8 animate-unlock pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.9)]">
      
      {/* Ornamen Rantai Black Clover */}
      <div className="absolute left-0 top-1/4 w-1/2 h-12 border-b-4 border-dashed border-neutral-700/60 animate-chain-l origin-right" />
      <div className="absolute right-0 top-1/4 w-1/2 h-12 border-b-4 border-dashed border-neutral-700/60 animate-chain-r origin-left" />
      
      {/* Kerangka Pengunci / Logam Segel Gabungan */}
      <div className="relative flex flex-col items-center justify-center p-8 bg-[#1a1313] border-2 border-orange-600 rounded-xl shadow-[0_0_30px_rgba(239,68,68,0.4)] transition-transform">
        {/* Simbol Daun Semanggi 5 (5-Leaf Clover) Berpendar Api */}
        <div className="text-5xl font-serif text-red-600 filter drop-shadow-[0_0_12px_#ef4444] tracking-tighter mb-2 animate-pulse">
          🍀
        </div>
        
        {/* Teks Protokol Pembukaan Kunci */}
        <div className="text-[11px] font-mono tracking-widest text-orange-500 uppercase animate-pulse">
          [ SYSTEM UNSEALING ]
        </div>
        <div className="text-[9px] font-mono text-neutral-500 mt-1">
          ANTIMAGIC × FIRE_FORCE_ENGAGED
        </div>
      </div>

      <div className="absolute bottom-6 text-[10px] font-mono text-neutral-600 tracking-wider">
        MANUAL BOOK VII // CLICK OR SWIPE TO ENGAGE
      </div>
    </div>

        <div className="pr-10">
          {/* UBAH NAMA ANDA */}
          <h2 className="text-2xl font-black">Akhdan Hafiz Anugrah</h2>
          {/* UBAH NRP DAN ASAL */}
          <p className="text-neutral-cs-10/70 mt-1 text-sm font-semibold">5027251094 - Probolinggo</p>
        </div>

        <div className="mt-5 flex gap-2">
          {/* UBAH USERNAME INSTAGRAM */}
          <Instagram username="akdn.hpz_" />
          {/* UBAH USERNAME LINKEDIN */}
          <LinkedInButtonLink username="akhdan-hafiz" />
        </div>

        <div className="mt-6 grid gap-4 text-sm font-semibold sm:grid-cols-2">
          <div className="border-neutral-cs-10/40 rounded-xl border p-4">
            {/* UBAH HOBI KAMU */}
            <p className="text-neutral-cs-10/60 text-xs tracking-wide uppercase">Hobi</p>
            <p className="mt-2">Fotografi, Baca Manhwa, Koleksi Parfum & Hotwheels</p>
          </div>
          <div className="border-neutral-cs-10/40 rounded-xl border p-4">
            {/* UBAH FUNFACT KAMU */}
            <p className="text-neutral-cs-10/60 text-xs tracking-wide uppercase">Fun Fact</p>
            <p className="mt-2">admin ketolak pens masuk its loh yah</p>
          </div>
        </div>

        <div className="border-neutral-cs-10/40 mt-4 rounded-xl border p-4">
          {/* UBAH LAGU FAVORIT KAMU */}
          <p className="text-neutral-cs-10/60 text-xs font-bold tracking-wide uppercase">Lagu Favorit</p>
          <p className="my-2 text-sm font-semibold">Afterlife</p>

          {/* UBAH URL SPOTIFY KAMU DENGAN LAGU FAVORIT MU */}
          <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/7zAt4tdL44D3VuzsvM0N8n?si=2904e26f70974d0a" />
        </div>
      </div>
    </div>,
    document.body
  )
}

export default MemberPopup
