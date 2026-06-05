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
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto px-4 py-8 bg-[#05050e]/90 backdrop-blur-md">
      
      {/* --- INJEKSI CUSTOM CSS UNTUK ANIMASI ABSTRAK --- */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin-gradient { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes float-slow { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(15px, -20px); } }
        @keyframes float-reverse { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(-15px, 20px); } }
        @keyframes twinkle { 0%, 100% { opacity: 0.1; transform: scale(0.3); } 50% { opacity: 1; transform: scale(1.2); box-shadow: 0 0 10px currentColor; } }
        @keyframes abstract-float-1 { 0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); } 50% { transform: translateY(-25px) rotate(15deg) scale(1.1); } }
        @keyframes abstract-float-2 { 0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); } 50% { transform: translateY(20px) translateX(15px) rotate(-20deg); } }
        @keyframes abstract-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes abstract-pulse-spin { 0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.6; } 50% { transform: scale(1.2) rotate(90deg); opacity: 1; } }
        .animate-spin-slow { animation: spin-gradient 5s linear infinite; }
        .animate-float-1 { animation: float-slow 7s ease-in-out infinite; }
        .animate-float-2 { animation: float-reverse 9s ease-in-out infinite; }
        .glass-panel { background: linear-gradient(145deg, rgba(15, 15, 26, 0.9), rgba(10, 11, 20, 0.95)); box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.1); backdrop-filter: blur(20px); }
        .glass-bento { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .glass-bento:hover { transform: translateY(-4px); box-shadow: 0 10px 30px -10px rgba(0,0,0,0.5); }
      `}} />

      {/* Background Orbs Global */}
      <div className="fixed top-20 left-10 w-[300px] h-[300px] rounded-full bg-fuchsia-600/10 blur-[100px] animate-float-1 pointer-events-none z-0"></div>
      <div className="fixed bottom-20 right-10 w-[250px] h-[250px] rounded-full bg-cyan-600/10 blur-[100px] animate-float-2 pointer-events-none z-0"></div>

      <button
        type="button"
        aria-label="Close member detail"
        onClick={onClose}
        className="absolute inset-0 z-0"
      />

      {/* Wrapper Card Utama */}
      <div className="relative w-full max-w-[720px] z-10 group animate-in fade-in zoom-in duration-300">
        
        {/* ELEMEN ABSTRAK LUAR 1: Bintang Neon */}
        <svg className="absolute -top-12 -right-8 w-16 h-16 text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)] pointer-events-none z-20" style={{ animation: 'abstract-pulse-spin 6s ease-in-out infinite' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
        </svg>

        {/* ELEMEN ABSTRAK LUAR 2: Plus/Cross */}
        <svg className="absolute -top-6 -left-10 w-12 h-12 text-pink-500 drop-shadow-[0_0_8px_rgba(236,72,153,0.6)] pointer-events-none z-0" style={{ animation: 'abstract-float-1 5s ease-in-out infinite' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>

        {/* ELEMEN ABSTRAK LUAR 3: Ring / Cincin 3D */}
        <svg className="absolute -bottom-8 -right-12 w-20 h-20 text-purple-500/60 drop-shadow-[0_0_15px_rgba(168,85,247,0.4)] pointer-events-none z-20" style={{ animation: 'abstract-float-2 7s ease-in-out infinite' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1}>
          <circle cx="12" cy="12" r="9" strokeDasharray="4 4" />
          <circle cx="12" cy="12" r="5" />
        </svg>

        {/* Spinning Gradient Border */}
        <div className="absolute inset-0 rounded-[28px] overflow-hidden z-10">
          <div className="absolute top-1/2 left-1/2 w-[150%] h-[150%] -translate-x-1/2 -translate-y-1/2 bg-[conic-gradient(from_0deg,#f472b6_0%,#a855f7_25%,#22d3ee_50%,#4ade80_75%,#f472b6_100%)] animate-spin-slow opacity-80 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>

        {/* Inner Card Container */}
        <div className="relative m-[2px] rounded-[26px] glass-panel p-6 sm:p-8 overflow-hidden z-10 text-white">
          
          {/* Partikel Twinkle di dalam Card */}
          <div className="absolute top-[10%] left-[15%] w-1.5 h-1.5 rounded-full bg-pink-400 pointer-events-none" style={{ animation: 'twinkle 3s ease-in-out infinite' }}></div>
          <div className="absolute top-[25%] right-[20%] w-1 h-1 rounded-full bg-cyan-400 pointer-events-none" style={{ animation: 'twinkle 4s ease-in-out infinite 1s' }}></div>
          <div className="absolute bottom-[30%] left-[10%] w-1.5 h-1.5 rounded-full bg-purple-400 pointer-events-none" style={{ animation: 'twinkle 2.5s ease-in-out infinite 0.5s' }}></div>
          
          <button
            type="button"
            aria-label="Close member detail"
            onClick={onClose}
            className="absolute top-6 right-6 w-9 h-9 rounded-full border border-white/10 bg-white/5 text-white/60 hover:text-white hover:bg-white/10 flex items-center justify-center transition-all z-20 hover:rotate-90"
          >
            x
          </button>

          {/* Profile Header Area */}
          <div className="relative flex flex-col sm:flex-row items-center sm:items-end gap-5 mb-6 z-10 pt-2 text-center sm:text-left">
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-[20px] bg-[#0d0d1f] border border-purple-500/30 flex items-center justify-center relative overflow-hidden group/avatar shadow-[0_0_20px_rgba(168,85,247,0.15)] shrink-0">
              <Image src={ProfileImage} alt="Profile Image" className="absolute inset-0 w-full h-full object-cover group-hover/avatar:scale-110 transition-transform duration-500" />
            </div>

            <div className="pb-1 flex-1">
              {/* UBAH NAMA ANDA */}
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-pink-300 via-purple-300 to-cyan-300">
                Rifqi Dwi Muslim
              </h2>
              {/* UBAH NRP DAN ASAL */}
              <p className="mt-2 text-sm sm:text-base font-semibold text-cyan-400/90 tracking-wide">
                5027251077 - Prabumulih
              </p>
            </div>
          </div>

          <div className="flex justify-center sm:justify-start flex-wrap gap-3 mb-6 relative z-10">
            <div className="hover:-translate-y-1 transition-transform">
              {/* UBAH USERNAME INSTAGRAM */}
              <Instagram username="rifqidwm" />
            </div>
            <div className="hover:-translate-y-1 transition-transform">
              {/* UBAH USERNAME LINKEDIN */}
              <LinkedInButtonLink username="rifqidwm" />
            </div>
          </div>

          {/* Separator Glow Line */}
          <div className="relative h-[1px] w-full bg-gradient-to-r from-transparent via-purple-500/50 to-transparent mb-6 z-10">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 h-[2px] bg-cyan-400/30 blur-[2px]"></div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-4 relative z-10">
            <div className="glass-bento bg-rose-500/5 border border-rose-500/20 rounded-2xl p-5 relative overflow-hidden group/card">
              <div className="absolute -right-6 -top-6 w-20 h-20 bg-rose-500/10 rounded-full blur-xl group-hover/card:bg-rose-500/20 transition-colors"></div>
              {/* UBAH HOBI KAMU */}
              <p className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-rose-400 mb-2">Hobi</p>
              <p className="text-sm sm:text-lg font-semibold text-white/90 leading-snug">Kadang membaca, nulis, desain🖍️</p>
            </div>
            
            <div className="glass-bento bg-purple-500/5 border border-purple-500/20 rounded-2xl p-5 relative overflow-hidden group/card">
              <div className="absolute -right-6 -top-6 w-20 h-20 bg-purple-500/10 rounded-full blur-xl group-hover/card:bg-purple-500/20 transition-colors"></div>
              {/* UBAH FUNFACT KAMU */}
              <p className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-purple-400 mb-2">Fun Fact</p>
              <p className="text-sm sm:text-lg font-semibold text-white/90 leading-snug">Ga dengerin musik dan lagu kecuali diplay sama orang lain🔊 </p>
            </div>
          </div>

          <div className="glass-bento bg-cyan-500/5 border border-cyan-500/20 rounded-2xl p-5 relative overflow-hidden z-10 group/spotify mt-4">
            <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl group-hover/spotify:bg-cyan-500/20 transition-colors"></div>
            
            <div className="mb-4">
              {/* UBAH LAGU FAVORIT KAMU */}
              <p className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-cyan-400 mb-1">Lagu Favorit</p>
              <p className="text-sm sm:text-base font-semibold text-white/90">Blinding Lights</p>
            </div>

            <div className="rounded-xl overflow-hidden border border-white/5 shadow-inner">
              {/* UBAH URL SPOTIFY KAMU DENGAN LAGU FAVORIT MU */}
              <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/0VjIjW4GlUZAMYd2vXMi3b" />
            </div>
          </div>

        </div>
      </div>
    </div>,
    document.body
  )
}

export default MemberPopup