'use client'

import React, { useEffect } from 'react'

import Image from 'next/image'

import { createPortal } from 'react-dom'

import Instagram from '@/components/atoms/button/InstagramButtonLink'
import LinkedInButtonLink from '@/components/atoms/button/LinkedInButtonLink'
import SpotifyEmbed from '@/components/molecules/SpotifyEmbed'

import ProfileImage from './image.jpeg'

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
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-hidden px-4 py-[5dvh] backdrop-blur-md">
      <button
        type="button"
        aria-label="Close member detail"
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/30 transition-opacity"
      />

      <div className="relative z-10 max-h-[90dvh] w-full max-w-2xl animate-[member-popup-show_200ms_ease-out] overflow-y-auto rounded-[2rem] border-[6px] border-white bg-gradient-to-b from-sky-50 to-white p-6 shadow-[0_20px_50px_-12px_rgba(2,132,199,0.2)] sm:p-8">
        {/* Decorative Glow Backgrounds */}
        <div className="pointer-events-none absolute top-0 left-1/2 h-64 w-2/3 -translate-x-1/2 rounded-full bg-sky-200/40 blur-[80px]" />

        <button
          type="button"
          aria-label="Close member detail"
          onClick={onClose}
          className="absolute top-5 right-5 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-sky-100 text-sm font-bold text-sky-600 shadow-sm transition-all duration-300 hover:rotate-90 hover:bg-sky-200 hover:text-sky-800 sm:top-6 sm:right-6"
        >
          ✕
        </button>

        <div className="relative z-10">
          <div className="group mb-6 overflow-hidden rounded-[1.5rem] border-[4px] border-white bg-white shadow-sm">
            <Image
              src={ProfileImage}
              alt="Profile Image"
              className="h-[22rem] w-full object-cover object-center transition-transform duration-700 group-hover:scale-105 sm:h-[28rem]"
            />
          </div>

          <div className="pr-10">
            {/* UBAH NAMA ANDA */}
            <h2 className="text-4xl font-black text-sky-400 drop-shadow-[0_0_12px_rgba(56,189,248,0.4)] sm:text-5xl">
              Umar
            </h2>
            {/* UBAH NRP DAN ASAL */}
            <p className="mt-2 text-sm font-bold tracking-wide text-slate-500 sm:text-base">5027251005 - Semarang</p>
          </div>

          <div className="mt-5 flex gap-3">
            {/* UBAH USERNAME INSTAGRAM */}
            <div className="flex items-center justify-center rounded-full border-[3px] border-sky-100 bg-white p-1 shadow-sm transition-transform duration-300 hover:-translate-y-1 [&_a]:!text-sky-400 hover:[&_a]:!text-sky-500">
              <Instagram username="umarbaharun" />
            </div>
            {/* UBAH USERNAME LINKEDIN */}
            <div className="flex items-center justify-center rounded-full border-[3px] border-sky-100 bg-white p-1 shadow-sm transition-transform duration-300 hover:-translate-y-1 [&_a]:!text-sky-400 hover:[&_a]:!text-sky-500">
              <LinkedInButtonLink username="umarhyl" />
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="group relative overflow-hidden rounded-[1.25rem] bg-sky-100/60 p-5 transition-all duration-300 hover:-translate-y-1 hover:bg-sky-100 hover:shadow-lg hover:shadow-sky-200/40">
              <div className="relative z-10">
                {/* UBAH HOBI KAMU */}
                <p className="text-[11px] font-black tracking-widest text-sky-700 uppercase">✦ HOBI</p>
                <p className="mt-2 text-lg font-bold text-sky-950">Masak & Membaca</p>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-[1.25rem] bg-sky-100/60 p-5 transition-all duration-300 hover:-translate-y-1 hover:bg-sky-100 hover:shadow-lg hover:shadow-sky-200/40">
              <div className="relative z-10">
                {/* UBAH FUNFACT KAMU */}
                <p className="text-[11px] font-black tracking-widest text-sky-700 uppercase">✦ FUN FACT</p>
                <p className="mt-2 text-lg font-bold text-sky-950">Gwe Fans JKT</p>
              </div>
            </div>
          </div>

          <div className="group relative mt-4 overflow-hidden rounded-[1.25rem] bg-sky-100/60 p-5 transition-all duration-300 hover:bg-sky-100 hover:shadow-lg hover:shadow-sky-200/40">
            <div className="relative z-10">
              {/* UBAH LAGU FAVORIT KAMU */}
              <p className="text-[11px] font-black tracking-widest text-sky-700 uppercase">✦ FAVORITE SONG</p>
              <p className="mt-2 mb-4 text-lg font-bold text-sky-950">Supernatural</p>

              {/* UBAH URL SPOTIFY KAMU DENGAN LAGU FAVORIT MU */}
              <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-4 ring-white transition-transform duration-300 group-hover:scale-[1.01]">
                <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/142PiXzA84lmEw2RstFHFa?si=9a02a710ab7c4655" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default MemberPopup
