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
    <div className="member-086-particle-stage fixed inset-0 z-[100] flex items-start justify-center overflow-hidden px-4">
      <button
        type="button"
        aria-label="Close member detail"
        onClick={onClose}
        className="member-086-backdrop absolute inset-0 bg-black/75 backdrop-blur-sm"
      />

      <div className="member-086-particle-card relative z-10 h-[100dvh] max-h-[100dvh] w-full max-w-[720px] overflow-y-auto rounded-2xl border border-white/[0.08] p-6 text-white shadow-2xl shadow-black/60 sm:h-[100dvh] max-h-[100dvh] sm:p-8">
        <button
          type="button"
          aria-label="Close member detail"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xl leading-none text-white/55 transition-colors hover:bg-white/10 hover:text-white"
        >
          x
        </button>

        <div className="mb-5 overflow-hidden rounded-2xl border border-white/[0.08]">
          <Image
            src={ProfileImage}
            alt="Profile Image"
            className="h-120 w-full object-cover object-center transition-transform duration-700 hover:scale-[1.02]"
          />
        </div>

        <div className="pr-10">
          {/* UBAH NAMA ANDA */}
          <h2 className="text-2xl font-black tracking-tight">M Razzan Azizi Djauhari</h2>
          {/* UBAH NRP DAN ASAL */}
          <p className="mt-1 text-sm font-semibold text-white/45">5027251086 - Samarinda</p>
        </div>

        <div className="mt-5 flex gap-2">
          {/* UBAH USERNAME INSTAGRAM */}
          <Instagram username="aziiiziizii" />
          {/* UBAH USERNAME LINKEDIN */}
          <LinkedInButtonLink username="azizidjauhari" />
        </div>

        <div className="mt-6 grid gap-4 text-sm font-semibold sm:grid-cols-2">
          <div className="liquid-glass-086 p-4">
            {/* UBAH HOBI KAMU */}
            <p className="text-xs tracking-wide text-white/35 uppercase">Hobi</p>
            <p className="mt-2 text-white/80">Apa aja</p>
          </div>
          <div className="liquid-glass-086 p-4">
            {/* UBAH FUNFACT KAMU */}
            <p className="text-xs tracking-wide text-white/35 uppercase">Fun Fact</p>
            <p className="mt-2 text-white/80">Whale</p>
          </div>
        </div>

        <div className="liquid-glass-086 mt-4 p-4">
          {/* UBAH LAGU FAVORIT KAMU */}
          <p className="text-xs font-bold tracking-wide text-white/35 uppercase">Lagu Favorit</p>
          <p className="my-2 text-sm font-semibold text-white/80">Snowfall</p>

          {/* UBAH URL SPOTIFY KAMU DENGAN LAGU FAVORIT MU */}
          <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/6pWgRkpqVfxnj3WuIcJ7WP?si=11f2ad7b6f5545cb" />
        </div>
      </div>
    </div>,
    document.body
  )
}

export default MemberPopup
