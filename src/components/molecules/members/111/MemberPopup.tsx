'use client'

/* eslint-disable react/no-unescaped-entities */

import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

import Image from 'next/image'
import Instagram from '@/components/atoms/button/InstagramButtonLink'
import LinkedInButtonLink from '@/components/atoms/button/LinkedInButtonLink'
import SpotifyEmbed from '@/components/molecules/SpotifyEmbed'

import ProfileImage from './image.jpg'
import ThumbnailImage from './faro.jpg'
import Game16 from './Game16'
import FaceImage from './imo.png' // Foto muka melet untuk selebrasi

type MemberPopupProps = {
  isOpen: boolean
  onClose: () => void
}

const MemberPopup = ({ isOpen, onClose }: MemberPopupProps) => {
  const [isProfilePhotoFlipped, setIsProfilePhotoFlipped] = useState(false)
  const [isGameWon, setIsGameWon] = useState(false)
  
  // State untuk membalik kartu konten (Depan: Selebrasi Imo, Belakang: Hobi & Lagu)
  const [isContentCardFlipped, setIsContentCardFlipped] = useState(false)

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

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center overflow-hidden px-4"
      onClick={(event) => event.stopPropagation()}
      onKeyDown={(event) => event.stopPropagation()}
    >
      
      {/* INJEKSI KODE CSS UNTUK ANIMASI MENGAMBANG (FLOAT) */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes customFloat {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-8px); }
          }
          .animate-custom-float {
            animation: customFloat 3s ease-in-out infinite;
          }
        `
      }} />

      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close member detail"
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Popup Utama */}
      <div className="relative z-10 h-[100dvh] max-h-[100dvh] w-full max-w-[720px] overflow-y-auto overscroll-contain rounded-2xl border border-white/20 shadow-xl">
        <div className="min-h-full rounded-2xl">
          <div className="relative">
            {/* Background Video */}
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              className="absolute inset-0 h-full w-full object-cover"
              src="https://files.catbox.moe/xuycql.mp4"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/15 backdrop-blur-[2px]" />

            {/* Content */}
            <div className="relative z-10 p-6 text-white sm:p-8">
              <button
                type="button"
                aria-label="Close member detail"
                onClick={onClose}
                className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-xl leading-none hover:bg-white/10"
              >
                ×
              </button>

              {/* FOTO PROFIL FLIP */}
              <div
                className="mb-5 cursor-pointer [perspective:1000px] w-full aspect-[1/1]"
                onClick={() => setIsProfilePhotoFlipped(!isProfilePhotoFlipped)}
              >
                <div
                  className={`relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] ${isProfilePhotoFlipped ? '[transform:rotateY(180deg)]' : ''}`}
                >
                  {/* Sisi Depan (Thumbnail) */}
                  <div className="absolute inset-0 [backface-visibility:hidden] flex flex-col items-center justify-center p-4 rounded-2xl border border-white/20 bg-black/50">
                    <div className="overflow-hidden rounded-full border-4 border-white/20 w-32 h-32 mb-4">
                      <Image src={ThumbnailImage} alt="Thumbnail Image" className="object-cover w-full h-full" />
                    </div>
                    <p className="text-center text-sm font-semibold text-white/50 drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">
                      p byone
                    </p>
                  </div>

                  {/* Sisi Belakang (Foto Penuh) */}
                  <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-2xl border border-white/20 overflow-hidden bg-black/50">
                    <Image src={ProfileImage} alt="Profile Image" className="object-cover w-full h-full object-top" />
                    <div className="absolute inset-x-0 bottom-0 p-4 bg-black/70 text-center text-sm font-semibold text-white/50 drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">
                      woi
                    </div>
                  </div>
                </div>
              </div>

              {/* Nama & NRP */}
              <div className="pr-10">
                <h2 className="text-2xl font-black text-white/50 drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">
                  Azfaro Zid Ilmi
                </h2>
                <p className="mt-1 text-sm font-semibold text-white/50 drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">
                  5027251111 - Jember
                </p>
              </div>

              {/* Social */}
              <div className="mt-5 flex gap-2">
                <Instagram username="azfaroo" />
                <LinkedInButtonLink username="Azfar Zid Ilmi" />
              </div>

              {/* === ALUR INTERAKSI: GAME -> KARTU IMO -> KARTU HOBI === */}
              <div className="mt-6">
                {!isGameWon ? (
                  // TAHAP 1: Tampilkan Game 16
                  <div className="animate-in fade-in zoom-in duration-500 ease-out">
                    <Game16 onWin={() => setIsGameWon(true)} />
                  </div>
                ) : (
                  // TAHAP 2 & 3: Tampilkan Kartu Konten (Bisa di-flip)
                  // Tinggi container diatur ke h-[460px] agar foto Imo dan konten Spotify muat dengan sempurna
                  <div className="[perspective:1000px] w-full h-[480px] sm:h-[460px]">
                    <div
                      className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] ${isContentCardFlipped ? '[transform:rotateY(180deg)]' : ''}`}
                    >
                      
                      {/* === SISI DEPAN: SELEBRASI MYTHICAL IMMORTAL (MENGAMBANG & BISA DIKLIK) === */}
                      <div 
                        className="absolute inset-0 [backface-visibility:hidden] flex flex-col p-5 rounded-2xl border-4 border-emerald-500/80 bg-emerald-900/60 backdrop-blur-md shadow-2xl cursor-pointer animate-custom-float"
                        onClick={() => setIsContentCardFlipped(true)}
                      >
                        {/* Header Selebrasi */}
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-3xl">0_0</span>
                          <div className="flex-1">
                            <p className="text-xs font-bold uppercase tracking-wide text-emerald-300">SELAMATT</p>
                            <h3 className="text-lg sm:text-xl font-black text-emerald-100 leading-tight">BTW UDAH IMO BELUM!</h3>
                          </div>
                        </div>
                        
                        {/* Foto Wajah Melet (imo.png) */}
                        <div className="relative flex-1 w-full overflow-hidden rounded-xl border border-emerald-500/30 bg-black/40">
                          <Image 
                            src={FaceImage} 
                            alt="Faro imo" 
                            fill
                            className="object-contain object-center"
                          />
                        </div>
                        
                        {/* Teks Pengejek */}
                        <p className="mt-3 text-sm font-semibold text-center italic text-emerald-200 drop-shadow-[0_2px_4px_rgba(0,0,0,1)] leading-snug">
                          "🤪🤪🤪"
                        </p>
                        
                        {/* Petunjuk Interaksi */}
                        <div className="mt-3 py-2 rounded-xl bg-black/30 border border-white/10 text-center flex items-center justify-center gap-2 hover:bg-black/50 transition-colors">
                          <span className="text-base"></span>
                          <span className="text-xs sm:text-sm font-bold text-white shadow-sm">
                            jgn di klik 
                          </span>
                        </div>
                      </div>

                      {/* === SISI BELAKANG: INFORMASI HOBI, FUN FACT & LAGU FAVORIT === */}
                      <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col rounded-2xl">
                        <div className="grid gap-4 text-sm font-semibold sm:grid-cols-2">
                          <div className="rounded-xl border border-white/20 bg-black/20 p-4 backdrop-blur-md">
                            <p className="text-xs uppercase tracking-wide text-white/40 drop-shadow-[0_1px_2px_rgba(0,0,0,1)]">
                              Hobi
                            </p>
                            <p className="mt-2 text-white/60 drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">
                              mangan turu maen
                            </p>
                          </div>

                          <div className="rounded-xl border border-white/20 bg-black/20 p-4 backdrop-blur-md">
                            <p className="text-xs uppercase tracking-wide text-white/40 drop-shadow-[0_1px_2px_rgba(0,0,0,1)]">
                              Fun Fact
                            </p>
                            <p className="mt-2 text-white/60 drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">
                              pernah nabrak orang di ITS
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 flex-1 rounded-xl border border-white/20 bg-black/20 p-4 backdrop-blur-md flex flex-col">
                          <p className="text-xs font-bold uppercase tracking-wide text-white/40 drop-shadow-[0_1px_2px_rgba(0,0,0,1)]">
                            Lagu Favorit
                          </p>
                          <p className="my-2 text-sm font-semibold text-white/60 drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">
                            What Is Love
                          </p>
                          <div className="flex-1 w-full min-h-[100px]">
                             <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/54mnwt3kO0uYsy0ceg14JP?si=ctaD8woUQ7CF3ue_KFIA0Q&nd=1&dlsi=b2663f48659a4123" />
                          </div>
                        </div>
                        
                        {/* Tombol Kembali ke Selebrasi */}
                        <button 
                          onClick={() => setIsContentCardFlipped(false)}
                          className="mt-4 py-3 w-full text-center text-xs sm:text-sm font-semibold text-white/50 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:text-white transition-colors"
                        >
                          klik lagi pls
                        </button>
                      </div>

                    </div>
                  </div>
                )}
              </div>
              {/* === === === === === === === === === === === === === === === */}

            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default MemberPopup
