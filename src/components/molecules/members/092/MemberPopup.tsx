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
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto px-4">
      <button
        type="button"
        aria-label="Close member detail"
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />

      <div className="relative z-10 max-h-[calc(100vh-9rem)] w-full max-w-[720px] animate-[member-popup-show_200ms_ease-out] overflow-y-auto rounded-2xl border border-white/20 bg-white/10 p-6 text-white shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-xl sm:max-h-[calc(100vh-10rem)] sm:p-8">

        <button
          type="button"
          aria-label="Close member detail"
          onClick={onClose}
          className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/30 text-xl leading-none text-white/80 transition-all hover:bg-white/20"
        >
          x
        </button>

        {/* Foto profil */}
        <div className="mb-5 overflow-hidden rounded-2xl border border-white/20 shadow-[0_4px_16px_rgba(0,0,0,0.3)]">
          <Image src={ProfileImage} alt="Profile Image" className="h-120 w-full object-cover object-center" />
        </div>

        <div className="pr-10">
          {/* UBAH NAMA ANDA */}
          <h2 className="text-2xl font-black tracking-wide text-white drop-shadow-md">Naoval James Osamah</h2>
          {/* UBAH NRP DAN ASAL */}
          <p className="mt-1 text-sm font-semibold text-white/60">5027251092 - Jombang</p>
        </div>

        <div className="mt-5 flex gap-2">
          {/* UBAH USERNAME INSTAGRAM */}
          <Instagram username="naovaljo" />
          {/* UBAH USERNAME LINKEDIN */}
          <LinkedInButtonLink username="Naoval James" />
        </div>

        <div className="mt-6 grid gap-4 text-sm font-semibold sm:grid-cols-2">
          <div className="rounded-xl border border-white/15 bg-white/5 p-4 backdrop-blur-md">
            {/* UBAH HOBI KAMU */}
            <p className="text-xs uppercase tracking-widest text-white/50">Hobi</p>
            <p className="mt-2 text-white">Tidur</p>
          </div>
          <div className="rounded-xl border border-white/15 bg-white/5 p-4 backdrop-blur-md">
            {/* UBAH FUNFACT KAMU */}
            <p className="text-xs uppercase tracking-widest text-white/50">Fun Fact</p>
            <p className="mt-2 text-white">Pernah push rank mobile legends waktu sistem rank masih points sampai 3111 points</p>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-white/15 bg-white/5 p-4 backdrop-blur-md">
          {/* UBAH LAGU FAVORIT KAMU */}
          <p className="text-xs font-bold uppercase tracking-widest text-white/50">Lagu Favorit</p>
          <p className="my-2 text-sm font-semibold text-white">Linger</p>

          {/* UBAH URL SPOTIFY KAMU DENGAN LAGU FAVORIT MU */}
          <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/3HHehSGzW9dhs2V7Sod4jX?si=xj9AzfCPQsm3xYp5MVkJMQ" />
        </div>
      </div>
    </div>,
    document.body
  )
}

export default MemberPopup
