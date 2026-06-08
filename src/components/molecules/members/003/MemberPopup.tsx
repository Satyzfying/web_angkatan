'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { createPortal } from 'react-dom'

import Instagram from '@/components/atoms/button/InstagramButtonLink'
import LinkedInButtonLink from '@/components/atoms/button/LinkedInButtonLink'
import SpotifyEmbed from '@/components/molecules/SpotifyEmbed'

import ProfileImage from './image.jpg'

type MemberPopupProps = {
  isOpen: boolean
  onClose: () => void
}

const MemberPopup = ({ isOpen, onClose }: MemberPopupProps) => {
  // State untuk mengontrol fase gacha: 'banner' -> 'animating' -> 'revealed'
  const [gachaPhase, setGachaPhase] = useState<'banner' | 'animating' | 'revealed'>('banner')
  const revealTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const closePopup = useCallback(() => {
    if (revealTimerRef.current) {
      clearTimeout(revealTimerRef.current)
      revealTimerRef.current = null
    }
    setGachaPhase('banner')
    onClose()
  }, [onClose])

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closePopup()
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
      if (revealTimerRef.current) {
        clearTimeout(revealTimerRef.current)
        revealTimerRef.current = null
      }
    }
  }, [isOpen, closePopup])

  // Fungsi untuk menjalankan animasi gacha
  const handlePullGacha = () => {
    setGachaPhase('animating')
    // Animasi berjalan selama 2.5 detik sebelum memunculkan kartu
    revealTimerRef.current = setTimeout(() => {
      setGachaPhase('revealed')
      revealTimerRef.current = null
    }, 2500)
  }

  if (!isOpen) {
    return null
  }

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-hidden px-4">
      {/* CSS Khusus untuk animasi meteor Gacha (Krem) & Glow */}
      <style>{`
        @keyframes gacha-meteor {
          0% { transform: translate(-50vw, -50vh) scale(0.1); opacity: 0; }
          20% { opacity: 1; }
          80% { transform: translate(0, 0) scale(1.5); filter: brightness(2) drop-shadow(0 0 30px #E7DCCA); opacity: 1; }
          100% { transform: scale(15); opacity: 0; filter: brightness(10); }
        }
        @keyframes card-reveal {
          0% { transform: scale(0.85); opacity: 0; filter: brightness(3); }
          100% { transform: scale(1); opacity: 1; filter: brightness(1); }
        }
        .animate-meteor {
          animation: gacha-meteor 2.5s ease-in-out forwards;
        }
        .animate-card {
          animation: card-reveal 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
      `}</style>

      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close member detail"
        onClick={closePopup}
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-all duration-500"
      />

      {/* FASE 1: BANNER SPECIAL SUMMON (KREM - UNKNOWN) */}
      {gachaPhase === 'banner' && (
        <div className="relative z-10 h-[100dvh] max-h-[100dvh] w-full max-w-[800px] animate-pulse overflow-y-auto overscroll-contain rounded-3xl border-4 border-[#E7DCCA]/80 bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] p-1 shadow-[0_0_60px_rgba(231,220,202,0.5)]">
          {/* Inner Container untuk border krem */}
          <div className="relative min-h-full rounded-2xl bg-gradient-to-br from-[#1a1a1a] via-[#101010] to-[#050505] p-8 text-white">
            
            {/* Tombol Cancel / Close di Banner */}
            <button
              type="button"
              aria-label="Cancel Summon"
              onClick={closePopup}
              className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#E7DCCA]/50 bg-[#1a1a1a]/80 text-xl font-bold text-[#E7DCCA] transition-all hover:bg-[#E7DCCA] hover:text-slate-900"
            >
              ✕
            </button>

            {/* Ornamen Gacha di pojok (Krem) */}
            <div className="pointer-events-none absolute left-0 top-0 h-32 w-32 border-l-4 border-t-4 border-[#E7DCCA]/60 rounded-tl-xl opacity-80"></div>
            <div className="pointer-events-none absolute bottom-0 right-0 h-32 w-32 border-b-4 border-r-4 border-[#E7DCCA]/60 rounded-br-xl opacity-80"></div>
            
            <div className="flex flex-col md:flex-row items-center gap-8 mt-4">
              {/* Gambar Profil Unknown / Misterius */}
              <div className="relative w-48 h-48 flex-shrink-0 flex items-center justify-center overflow-hidden rounded-full border-4 border-[#E7DCCA]/50 bg-slate-900 shadow-[0_0_25px_rgba(231,220,202,0.2)]">
                <span className="text-7xl font-black text-[#E7DCCA]/30 drop-shadow-md">?</span>
              </div>

              {/* Detail Banner */}
              <div className="flex-grow text-center md:text-left">
                <h2 className="text-sm md:text-base font-bold tracking-widest text-[#E7DCCA]/70 uppercase">
                  EVASTRA Random Summon
                </h2>
                <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FDF5E6] via-[#E7DCCA] to-[#FDF5E6] drop-shadow-sm mt-1 uppercase">
                  ???
                </h1>
                
                {/* Rarity Stars (Krem) - Disamarkan */}
                <div className="my-4 flex justify-center md:justify-start gap-1 text-3xl text-[#E7DCCA]/30 drop-shadow-[0_0_5px_rgba(231,220,202,0.2)]">
                  ✦ ✦ ✦ ✦ ✦
                </div>

                {/* Gacha Stats Grid */}
                <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-left w-fit mx-auto md:mx-0">
                  <div>
                    <p className="text-[10px] sm:text-xs text-[#E7DCCA]/60 uppercase tracking-widest font-bold mb-0.5">Class</p>
                    <p className="text-sm sm:text-base font-semibold text-[#E7DCCA]/50">???</p>
                  </div>
                  <div>
                    <p className="text-[10px] sm:text-xs text-[#E7DCCA]/60 uppercase tracking-widest font-bold mb-0.5">Element</p>
                    <p className="text-sm sm:text-base font-semibold text-[#E7DCCA]/50">???</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-[10px] sm:text-xs text-[#E7DCCA]/60 uppercase tracking-widest font-bold mb-0.5">Affiliation</p>
                    <p className="text-sm sm:text-base font-semibold text-[#E7DCCA]/50">EVASTRA</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Area Tombol Wish yang terintegrasi */}
            <div className="mt-10 flex flex-col items-center justify-center border-t-2 border-[#E7DCCA]/30 pt-8">
              <button
                onClick={handlePullGacha}
                className="group relative flex items-center justify-center overflow-hidden rounded-full border-2 border-[#E7DCCA] bg-gradient-to-r from-[#E7DCCA] via-[#FDF5E6] to-[#E7DCCA] px-12 py-5 text-2xl font-extrabold tracking-widest text-slate-900 shadow-[0_0_40px_#E7DCCA] transition-all hover:scale-110 hover:shadow-[0_0_60px_#FDF5E6]"
              >
                <span className="absolute inset-0 bg-white/30 opacity-0 transition-opacity group-hover:opacity-100"></span>
                ✦ PULL x1 ✦
              </button>
              <p className="mt-6 text-sm font-semibold tracking-widest text-[#E7DCCA] drop-shadow-[0_0_5px_#E7DCCA]">
                CLICK TO REVEAL
              </p>
            </div>

          </div>
        </div>
      )}

      {/* FASE 2: ANIMASI BINTANG JATUH (METEOR - KREM) */}
      {gachaPhase === 'animating' && (
        <div className="pointer-events-none relative z-10 flex h-[100dvh] w-full items-center justify-center">
          <div className="animate-meteor h-8 w-8 rounded-full bg-white shadow-[0_0_80px_40px_#E7DCCA,0_0_120px_60px_#FDF5E6]"></div>
        </div>
      )}

      {/* FASE 3: POPUP KARAKTER (THEMA GACHA/GENSHIN - KREM) */}
      {gachaPhase === 'revealed' && (
        <div className="relative z-10 h-[100dvh] max-h-[100dvh] w-full max-w-[720px] animate-card overflow-y-auto overscroll-contain rounded-2xl bg-gradient-to-br from-[#E7DCCA] via-[#FDF5E6] to-[#E7DCCA] p-1 shadow-[0_0_50px_rgba(231,220,202,0.6)]">
          {/* Inner Container untuk efek border krem */}
          <div className="relative min-h-full w-full overflow-hidden rounded-xl bg-gradient-to-b from-slate-900 via-[#0f172a] to-[#1e1b4b] p-6 text-white sm:p-8">
            
            {/* Ornamen Gacha di pojok (Krem) */}
            <div className="pointer-events-none absolute left-0 top-0 h-24 w-24 border-l-4 border-t-4 border-[#E7DCCA]/50 rounded-tl-xl opacity-70"></div>
            <div className="pointer-events-none absolute bottom-0 right-0 h-24 w-24 border-b-4 border-r-4 border-[#E7DCCA]/50 rounded-br-xl opacity-70"></div>
            <div className="pointer-events-none absolute right-4 top-16 text-[#E7DCCA]/20 text-6xl">✦</div>
            <div className="pointer-events-none absolute left-4 bottom-16 text-[#E7DCCA]/20 text-8xl">✦</div>

            {/* Tombol Close (Krem) */}
            <button
              type="button"
              aria-label="Close member detail"
              onClick={closePopup}
              className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#E7DCCA]/50 bg-slate-900/80 text-xl font-bold text-[#E7DCCA] transition-all hover:bg-[#E7DCCA] hover:text-slate-900"
            >
              ✕
            </button>

            {/* Gambar Profil Asli dengan Efek Glow (Krem) */}
            <div className="relative mb-4 overflow-hidden rounded-2xl border-2 border-[#E7DCCA] shadow-[0_0_25px_rgba(231,220,202,0.4)]">
              <Image src={ProfileImage} alt="Profile Image" className="h-120 w-full object-cover object-center transition-transform duration-700 hover:scale-105" />
              {/* Overlay Gradient bawah gambar */}
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-900 to-transparent"></div>
            </div>

            {/* Rarity Stars (Krem) */}
            <div className="mb-2 flex gap-1 text-2xl text-[#E7DCCA] drop-shadow-[0_0_5px_rgba(231,220,202,0.8)]">
              ✦ ✦ ✦ ✦ ✦
            </div>

            <div className="relative z-10 pr-10">
              <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FDF5E6] via-[#E7DCCA] to-[#FDF5E6] drop-shadow-sm uppercase">
                Chilmi Muhammad Ulin Nuha
              </h2>
              <p className="mt-1 text-sm font-semibold tracking-wider text-[#E7DCCA]/70">
                5027251003 - Gresik
              </p>
            </div>

            <div className="mt-5 flex gap-3 relative z-10">
              <Instagram username="nuhak.hak" />
              <LinkedInButtonLink username="chilminuha" />
            </div>

            <div className="mt-6 grid gap-4 text-sm font-semibold sm:grid-cols-2 relative z-10">
              <div className="group rounded-xl border border-[#E7DCCA]/30 bg-slate-800/50 p-4 backdrop-blur-sm transition-all hover:border-[#E7DCCA]/80 hover:shadow-[0_0_15px_rgba(231,220,202,0.2)]">
                <p className="text-xs font-bold uppercase tracking-widest text-[#E7DCCA]">Hobi</p>
                <p className="mt-2 text-slate-200 group-hover:text-white">
                  Main game (PES, Valorant, Puzzle apapun itu, dan game chill lainn) dan baca novel
                </p>
              </div>
              <div className="group rounded-xl border border-[#E7DCCA]/30 bg-slate-800/50 p-4 backdrop-blur-sm transition-all hover:border-[#E7DCCA]/80 hover:shadow-[0_0_15px_rgba(231,220,202,0.2)]">
                <p className="text-xs font-bold uppercase tracking-widest text-[#E7DCCA]">Fun Fact</p>
                <p className="mt-2 text-slate-200 group-hover:text-white">
                  Jempolku bengkok (Banget!) kata Ibu gara-gara keseringan main lego
                  <br /><br />
                  Rahangku dislok gara-gara pangsit gacoan 😹
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-[#E7DCCA]/30 bg-slate-800/50 p-4 backdrop-blur-sm relative z-10">
              <p className="text-xs font-bold uppercase tracking-widest text-[#E7DCCA]">Lagu Favorit</p>
              <p className="my-2 text-sm font-bold text-white drop-shadow-md">...Baby One More Time</p>
              <div className="rounded-xl overflow-hidden ring-1 ring-[#E7DCCA]/30 mt-2">
                <SpotifyEmbed spotifyUrl="https://open.spotify.com/embed/track/3MjUtNVVq3C8Fn0MP3zhXa" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>,
    document.body
  )
}

export default MemberPopup
