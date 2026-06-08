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
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto px-4">
      <button
        type="button"
        aria-label="Close member detail"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      <div className="relative z-10 max-h-screen w-full max-w-[720px] animate-[member-popup-show_200ms_ease-out] overflow-y-auto rounded-2xl border-2 border-[#7f1d1d] bg-[#1a1111] p-6 text-white shadow-xl sm:p-8">
        <button
          type="button"
          aria-label="Close member detail"
          onClick={onClose}
          className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border border-[#f97316] text-xl leading-none transition-colors hover:bg-[#f97316]/20"
        >
          x
        </button>

        <div className="mb-5 overflow-hidden rounded-2xl border border-[#f97316]/40">
          <Image src={ProfileImage} alt="Profile Image" className="h-120 w-full object-cover object-center" />
        </div>

        <div className="pr-10">
          {/* UBAH NAMA ANDA */}
          <h2 className="text-2xl font-black">Irsa Fairuza</h2>
          {/* UBAH NRP DAN ASAL */}
          <p className="mt-1 text-sm font-semibold text-stone-300/80">5027251115 - Depok</p>
        </div>

        <div className="mt-5 flex gap-2">
          {/* UBAH USERNAME INSTAGRAM */}
          <Instagram username="irsaaf_" />
          {/* UBAH USERNAME LINKEDIN */}
          <LinkedInButtonLink username="irsa-fairuza-299696379" />
        </div>

        <div className="mt-6 grid gap-4 text-sm font-semibold sm:grid-cols-2">
          <div className="rounded-xl border border-[#f97316]/40 bg-[#2a1a1a]/30 p-4">
            {/* UBAH HOBI KAMU */}
            <p className="text-xs tracking-wide text-stone-400/80 uppercase">Hobi</p>
            <p className="mt-2 text-stone-100">drakoran, denger musik, jalan kemana aja asal jalan</p>
          </div>
          <div className="rounded-xl border border-[#f97316]/40 bg-[#2a1a1a]/30 p-4">
            {/* UBAH FUNFACT KAMU */}
            <p className="text-xs tracking-wide text-stone-400/80 uppercase">Fun Fact</p>
            <p className="text-stone-1000 mt-2">suka denger cerita tapi besoknya bakal lupa</p>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-[#f97316]/40 bg-[#2a1a1a]/30 p-4">
          {/* UBAH LAGU FAVORIT KAMU */}
          <p className="text-xs font-bold tracking-wide text-stone-400/80 uppercase">Lagu Favorit</p>
          <p className="my-2 text-sm font-semibold text-stone-100">someone like u</p>

          {/* UBAH URL SPOTIFY KAMU DENGAN LAGU FAVORIT MU */}
          <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/6VMuD05WDxorQZJr5e9sDI?si=255c6aec9b0c45de" />
        </div>
      </div>
    </div>,
    document.body
  )
}

export default MemberPopup
