'use client'

import React, { useEffect } from 'react'

import Image from 'next/image'

import { createPortal } from 'react-dom'

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

      <div className="border-pink-600 bg-pink-200 relative z-10 max-h-screen w-full max-w-[720px] animate-[member-popup-show_200ms_ease-out] overflow-y-auto rounded-2xl border-2 p-6 text-white shadow-xl sm:p-8">
        {/* TABURAN BUNGA AURA */}
<div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
  <span className="absolute top-6 left-12 text-md opacity-80">🌸</span>
  <span className="absolute top-20 right-16 text-xs opacity-60">🌸</span>
  <span className="absolute bottom-32 left-8 text-sm opacity-70">🌸</span>
  <span className="absolute top-1/2 right-4 text-md opacity-80">🌸</span>
  <span className="absolute bottom-12 right-24 text-xs opacity-50">🌸</span>
</div>
        <button
          type="button"
          aria-label="Close member detail"
          onClick={onClose}
          className="border-pink-600 hover:bg-neutral-cs-10/10 absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border text-xl leading-none"
        >
          x
        </button>

        <div className="border-pink-600/40 mb-5 overflow-hidden rounded-2xl border">
          <Image src={ProfileImage} alt="Profile Image" className="h-120 w-full object-cover object-center" />
        </div>

        <div className="pr-10">
          {/* UBAH NAMA ANDA */}
          <h2 className="text-2xl font-black text-pink-600">Aura Syahzanani Al Mustofa</h2>
          {/* UBAH NRP DAN ASAL */}
          <p className="text-pink-700 mt-1 text-sm font-semibold">5027251123 - Sidoarjo</p>
        </div>

        <div className="mt-5 flex gap-2">
          {/* UBAH USERNAME INSTAGRAM */}
          <Instagram username="fleudeblau" />
          {/* UBAH USERNAME LINKEDIN */}
          <LinkedInButtonLink username="Aura Syahzanani Al Mustofa" />
        </div>

        <div className="mt-6 grid gap-4 text-sm font-semibold sm:grid-cols-2">
          <div className="border-pink-400 rounded-xl border p-4">
            {/* UBAH HOBI KAMU */}
            <p className="text-pink-600 text-xs tracking-wide uppercase">Hobi</p>
            <p className="mt-2 text-pink-900">baca buku, main piano, ngebut</p>
          </div>
          <div className="border-pink-400 rounded-xl border p-4">
            {/* UBAH FUNFACT KAMU */}
            <p className="text-pink-600 text-xs tracking-wide uppercase">Fun Fact</p>
            <p className="mt-2 text-pink-900">in my opinion soto, sate, bakso, tahu, mie itu ngga enakkk !</p>
          </div>
        </div>

        <div className="border-pink-400 mt-4 rounded-xl border p-4">
          {/* UBAH LAGU FAVORIT KAMU */}
          <p className="text-pink-600 text-xs font-bold tracking-wide uppercase">Lagu Favorit</p>
          <p className="my-2 text-sm font-semibold text-pink-900">Miss Americana & The Heartbreak Prince</p>

          {/* UBAH URL SPOTIFY KAMU DENGAN LAGU FAVORIT MU */}
          <SpotifyEmbed spotifyUrl="https://open.spotify.com/intl-id/track/214nt20w5wOxJnY462klLw" />
        </div>
      </div>
    </div>,
    document.body
  )
}

export default MemberPopup
