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
        className="absolute inset-0 bg-[#1a2e0f]/60 backdrop-blur-sm"
      />

      <div className="relative z-10 h-[100dvh] max-h-[100dvh] w-full max-w-[720px] animate-[member-popup-show_200ms_ease-out] overflow-y-auto rounded-2xl border-2 border-[#c8ddb8] bg-[#f0f5e8] p-6 text-[#1a3a0e] shadow-xl sm:p-8">
        <button
          type="button"
          aria-label="Close member detail"
          onClick={onClose}
          className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border border-[#c8ddb8] text-xl leading-none text-[#2d4a1e] hover:bg-[#c8ddb8]/30"
        >
          x
        </button>

        <div className="mb-5 overflow-hidden rounded-2xl border border-[#c8ddb8]">
          <Image src={ProfileImage} alt="Profile Image" className="h-120 w-full object-cover object-center" />
        </div>

        <div className="pr-10">
          {/* UBAH NAMA ANDA */}
          <h2 className="text-2xl font-black text-[#1a3a0e]">Arjunina Maqbulin Usman</h2>
          {/* UBAH NRP DAN ASAL */}
          <p className="mt-1 text-sm font-semibold text-[#4a7a2e]/70">5027251007 - Ponorogo</p>
        </div>

        <div className="mt-5 flex gap-2">
          {/* UBAH USERNAME INSTAGRAM */}
          <Instagram username="aulinsn" />
          {/* UBAH USERNAME LINKEDIN */}
          <LinkedInButtonLink username="arjuninamu" />
        </div>

        <div className="mt-6 grid gap-4 text-sm font-semibold sm:grid-cols-2">
          <div className="rounded-xl border border-[#c8ddb8] bg-[#e8f2d8] p-4">
            {/* UBAH HOBI KAMU */}
            <p className="text-xs tracking-wide uppercase text-[#4a7a2e]">Hobi</p>
            <p className="mt-2 text-[#1a3a0e]">Nonton Film, Scroll Substack</p>
          </div>
          <div className="rounded-xl border border-[#c8ddb8] bg-[#e8f2d8] p-4">
            {/* UBAH FUNFACT KAMU */}
            <p className="text-xs tracking-wide uppercase text-[#4a7a2e]">Fun Fact</p>
            <p className="mt-2 text-[#1a3a0e]">Suka air putih</p>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-[#c8ddb8] bg-[#e8f2d8] p-4">
          {/* UBAH LAGU FAVORIT KAMU */}
          <p className="text-xs font-bold tracking-wide uppercase text-[#4a7a2e]">Lagu Favorit</p>
          <p className="my-2 text-sm font-semibold text-[#1a3a0e]">Vienna - Billy Joel</p>

          {/* UBAH URL SPOTIFY KAMU DENGAN LAGU FAVORIT MU */}
          <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/4U45aEWtQhrm8A5mxPaFZ7?si=ae0aa43532d74224" />
        </div>
      </div>
    </div>,
    document.body
  )
}

export default MemberPopup
