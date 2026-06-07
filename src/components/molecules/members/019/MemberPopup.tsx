'use client'

import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'

import Image from 'next/image'

import Instagram from '@/components/atoms/button/InstagramButtonLink'
import LinkedInButtonLink from '@/components/atoms/button/LinkedInButtonLink'
import SpotifyEmbed from '@/components/molecules/SpotifyEmbed'

import ProfileImage from './image.png'
// INI WAJIB DITAMBAHKAN BIAR LOGONYA KEBACA
import MercedesLogo from './mercedes-logo.png'

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
    <>
      {/* CUSTOM KEYFRAMES UNTUK ANIMASI INTRO */}
      <style>
        {`
          /* Layar intro akan hilang setelah 3 detik */
          @keyframes introOverlay {
            0%, 80% { opacity: 1; visibility: visible; z-index: 200; }
            100% { opacity: 0; visibility: hidden; z-index: -1; }
          }
          
          /* Logo HANYA muncul dan hilang (diam di tengah, ditambah sedikit efek zoom in) */
          @keyframes logoFade {
            0% { opacity: 0; transform: scale(0.9); }
            20%, 70% { opacity: 1; transform: scale(1); }
            100% { opacity: 0; transform: scale(1.1); }
          }
          
          /* Menunda kemunculan pop card utama agar menunggu intro selesai */
          @keyframes cardDelay {
            0%, 90% { opacity: 0; pointer-events: none; transform: translateY(20px) scale(0.95); }
            100% { opacity: 1; pointer-events: auto; transform: translateY(0) scale(1); }
          }
        `}
      </style>

      {/* LAYAR INTRO MERCEDES (Hanya Logo) */}
      <div
        className="pointer-events-none fixed inset-0 flex flex-col items-center justify-center overflow-hidden bg-slate-950"
        style={{ animation: 'introOverlay 3s ease-out forwards' }}
      >
        {/* LOGO MERCEDES */}
        <div
          className="absolute z-10 flex h-full w-full items-center justify-center"
          style={{ animation: 'logoFade 2.5s ease-in-out forwards' }}
        >
          {/* MENGGUNAKAN VARIABLE IMPORT */}
          <Image
            src={MercedesLogo}
            alt="Mercedes Logo"
            className="h-32 w-32 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
          />
        </div>
      </div>

      {/* KONTEN POP CARD UTAMA */}
      <div
        className="fixed inset-0 z-[100] flex items-start justify-center overflow-hidden px-4"
        style={{ animation: 'cardDelay 3s cubic-bezier(0.4, 0, 0.2, 1) forwards' }}
      >
        <button
          type="button"
          aria-label="Close member detail"
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
        />

        <div className="relative z-10 h-[100dvh] max-h-[100dvh] w-full max-w-[720px] overflow-y-auto overscroll-contain rounded-3xl border border-white/10 bg-slate-900/95 p-6 text-slate-100 shadow-2xl shadow-blue-500/10 backdrop-blur-xl sm:p-8">
          <button
            type="button"
            aria-label="Close member detail"
            onClick={onClose}
            className="absolute top-5 right-5 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xl leading-none text-slate-300 transition-all hover:border-red-500/30 hover:bg-red-500/20 hover:text-red-400"
          >
            x
          </button>

          <div className="mb-6 overflow-hidden rounded-2xl border border-white/10 ring-2 ring-white/5">
            <Image
              src={ProfileImage}
              alt="Profile Image"
              className="h-[280px] w-full object-cover object-center transition-transform duration-500 hover:scale-105 sm:h-[320px]"
            />
          </div>

          <div className="pr-10">
            <h2 className="text-3xl font-black tracking-tight text-white">M. Rama Maulana Wafa</h2>
            <div className="mt-2 flex items-center gap-2">
              <span className="rounded-md bg-blue-500/20 px-2.5 py-1 text-xs font-semibold text-blue-300 ring-1 ring-blue-500/30 ring-inset">
                5027251019
              </span>
              <span className="text-sm font-medium text-slate-400">• Sumenep</span>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <Instagram username="mramamw" />
            <LinkedInButtonLink username="mramamw" />
          </div>

          <div className="mt-8 grid gap-4 text-sm font-semibold sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 transition-all hover:bg-white/10 hover:shadow-md">
              <p className="text-xs font-bold tracking-wider text-blue-400 uppercase">Hobi</p>
              <p className="mt-2 text-slate-200">Olahraga, Dengerin lagu city pop</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 transition-all hover:bg-white/10 hover:shadow-md">
              <p className="text-xs font-bold tracking-wider text-blue-400 uppercase">Fun Fact</p>
              <p className="mt-2 text-slate-200">Suka bersih-bersih kamar</p>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-5 transition-all hover:bg-white/10 hover:shadow-md">
            <p className="text-xs font-bold tracking-wider text-blue-400 uppercase">Lagu Favorit</p>
            <p className="mt-2 mb-3 text-sm font-semibold text-slate-200">C.H.R.I.S.Y.E.</p>

            <div className="overflow-hidden rounded-xl">
              <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/42si4ikg5dh732gPuQ0xHb?si=1319245260904cf7" />
            </div>
          </div>
        </div>
      </div>
    </>,
    document.body
  )
}

export default MemberPopup
