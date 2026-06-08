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
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-hidden px-4">
      <button
        type="button"
        aria-label="Close member detail"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      <div className="border-white/50 bg-gradient-to-br from-pink-300 via-orange-200 to-cyan-200 relative z-10 h-[100dvh] max-h-[100dvh] w-full max-w-[720px] animate-[member-popup-show_200ms_ease-out] overflow-y-auto overscroll-contain rounded-2xl border-2 p-6 text-slate-800 shadow-2xl sm:p-8">
        <button
          type="button"
          aria-label="Close member detail"
          onClick={onClose}
          className="border-neutral-cs-10 hover:bg-neutral-cs-10/10 absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border text-xl leading-none"
        >
          x
        </button>

        <div className="border-white/50 mb-5 overflow-hidden rounded-3xl border-2 shadow-lg">
          <Image src={ProfileImage} alt="Profile Image" className="h-120 w-full object-cover object-center" />
        </div>

        <div className="pr-10">
          {/* UBAH NAMA ANDA */}
          <h2 className="text-6xl font-light tracking-wide">Najla Tufailah</h2>
          {/* UBAH NRP DAN ASAL */}
          <p className="mt-1 text-sm italic text-slate-600">5027251078 - Banda Aceh</p>
        </div>

        <div className="mt-5 flex gap-2">
          {/* UBAH USERNAME INSTAGRAM */}
          <Instagram username="najlatflh" />
          {/* UBAH USERNAME LINKEDIN */}
          <LinkedInButtonLink username="najlatufailah" />
        </div>

        <div className="mt-6 grid gap-4 text-sm font-semibold sm:grid-cols-2">
          <div className="bg-white/20 backdrop-blur-md border-white/40 rounded-xl border p-4">
            {/* UBAH HOBI KAMU */}
            <p className="text-neutral-cs-10/60 text-xs tracking-wide uppercase">Hobi</p>
            <p className="mt-1 text-sm italic text-slate-600">Main PUBG</p>
          </div>
          <div className="bg-white/20 backdrop-blur-md border-white/40 rounded-xl border p-4">
            {/* UBAH FUNFACT KAMU */}
            <p className="text-neutral-cs-10/60 text-xs tracking-wide uppercase">Fun Fact</p>
            <p className="mt-1 text-sm italic text-slate-600">Gasuka Cincau</p>
          </div>
        </div>

        <div className="bg-white/20 backdrop-blur-md border-white/40 mt-4 rounded-xl border p-4">
          {/* UBAH LAGU FAVORIT KAMU */}
          <p className="text-neutral-cs-10/60 text-xs font-bold tracking-wide uppercase">Lagu Favorit</p>
          <p className="mt-1 text-sm italic text-slate-600">Air &amp; Api</p>

          {/* UBAH URL SPOTIFY KAMU DENGAN LAGU FAVORIT MU */}
          <SpotifyEmbed spotifyUrl="https://open.spotify.com/intl-id/track/0Z3E3USDNRILRhQBwy0ljP?si=f019dc28fbd1469e" />
        </div>
      </div>
    </div>,
    document.body
  )
}

export default MemberPopup
