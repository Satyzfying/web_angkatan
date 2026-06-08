'use client'

import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'

import Image from 'next/image'

import Instagram from '@/components/atoms/button/InstagramButtonLink'
import LinkedInButtonLink from '@/components/atoms/button/LinkedInButtonLink'
import SpotifyEmbed from '@/components/molecules/SpotifyEmbed'

import ProfileImage from './image.jpg'
import bgCard from './background.png';

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

      <div style={{ backgroundImage: `url(${bgCard.src || bgCard})` }}
           className="border-[#3B2D21] relative z-10 max-h-[100dvh] w-full max-w-[720px] animate-[member-popup-show_200ms_ease-out] overflow-y-auto rounded-2xl border-4 bg-cover bg-center bg-no-repeat p-6 text-white shadow-xl sm:p-8">
        <button
          type="button"
          aria-label="Close member detail"
          onClick={onClose}
          className="border-neutral-cs-10 hover:bg-neutral-cs-10/10 absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border text-xl leading-none"
        >
          x
        </button>

        <div className="border-neutral-cs-10/40 mb-5 overflow-hidden rounded-2xl border">
          <Image src={ProfileImage} alt="Profile Image" className="h-120 w-full object-cover object-center" />
        </div>

        <div className="pr-10">
          {/* UBAH NAMA ANDA */}
          <h2 className="text-2xl font-black text-[#3B2D21]">Elisabeth La Satta Sitorus</h2>
          {/* UBAH NRP DAN ASAL */}
          <p className="mt-1 text-sm font-semibold text-[#3B2D21]/80">5027251039 - Jakarta</p>
        </div>

        <div className="mt-5 flex gap-2 text-[#3B2D21]">
          {/* UBAH USERNAME INSTAGRAM */}
          <Instagram username="ibethhhhhhhh" />
          {/* UBAH USERNAME LINKEDIN */}
          <LinkedInButtonLink username="elisabeth-la-satta-sitorus-546916304" />
        </div>

        <div className="mt-6 grid gap-4 text-sm font-semibold sm:grid-cols-2">
          <div className="bg-white/10 backdrop-blur border border-white/40 shadow-lg rounded-xl p-4 sm:p-5">
            {/* UBAH HOBI KAMU */}
            <p className="text-xs font-bold tracking-wider text-[#3B2D21]/80 uppercase">Hobi</p>
            <p className="mt-2 text-sm font-medium text-[#3B2D21]">Nonton movie atau series (plis moots letterboxd @beebed)</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 shadow-lg rounded-xl p-4 sm:p-5">
            {/* UBAH FUNFACT KAMU */}
            <p className="text-xs font-bold tracking-wider text-[#3B2D21]/80 uppercase">Fun Fact</p>
            <p className="mt-2 text-sm font-medium text-[#3B2D21]">Bisa nyanyi pake siulan</p>
          </div>
        </div>

        <div className="mt-5 bg-white/10 backdrop-blur-md border border-white/20 shadow-lg rounded-xl p-4 sm:p-5">
          {/* UBAH LAGU FAVORIT KAMU */}
          <p className="text-xs font-bold tracking-wider text-[#3B2D21]/80 uppercase">Lagu Favorit</p>
          <p className="my-2 text-sm font-medium text-[#3B2D21]">Behind The Moon Shadow - Lamp</p>

          {/* UBAH URL SPOTIFY KAMU DENGAN LAGU FAVORIT MU */}
          <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/77zsHdb523rUQnOYUSG3qb?si=6c98e40a50ff4290" />
        </div>
      </div>
    </div>,
    document.body
  )
}

export default MemberPopup
