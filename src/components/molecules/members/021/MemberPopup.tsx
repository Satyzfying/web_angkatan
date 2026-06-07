'use client'

/* eslint-disable react/no-unescaped-entities */

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
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      <div className="border-rose-900 bg-red-900 relative z-10 max-h-screen w-full max-w-[720px] animate-[member-popup-show_200ms_ease-out] overflow-y-auto rounded-2xl border-2 p-6 text-white shadow-xl sm:p-8">
      <span className="absolute top-4 left-4 text-white text-lg">★</span>
      <span className="absolute top-8 left-32 text-white text-sm">★</span>
      <span className="absolute top-12 right-16 text-white text-lg">★</span>
      <span className="absolute top-24 right-40 text-white text-sm">★</span>

      <span className="absolute top-52 left-6 text-white text-base">★</span>
      <span className="absolute top-40 right-6 text-white text-lg">★</span>
      <span className="absolute top-72 left-20 text-white text-sm">★</span>

      <span className="absolute bottom-52 right-12 text-white text-base">★</span>
      <span className="absolute bottom-40 left-10 text-white text-lg">★</span>
      <span className="absolute bottom-36 right-36 text-white text-sm">★</span>

      <span className="absolute bottom-24 left-32 text-white text-base">★</span>
      <span className="absolute bottom-16 right-20 text-white text-lg">★</span>
      <span className="absolute bottom-10 left-1/2 text-white text-sm">★</span>
      <span className="absolute bottom-8 right-8 text-white text-base">★</span>
      <span className="absolute bottom-4 left-4 text-white">★</span>
      <span className="absolute bottom-4 left-60 text-white">★</span>
      <span className="absolute bottom-8 right-40 text-white text-base">★</span>
      <span className="absolute bottom-25 right-55 text-white text-base">★</span>


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
          <h2 className="text-2xl font-black">Az Zahra Fiddien Al Farabi</h2>
          {/* UBAH NRP DAN ASAL */}
          <p className="text-neutral-cs-10/70 mt-1 text-sm font-semibold">5027251021 - Surabaya</p>
        </div>

        <div className="mt-5 flex gap-2">
          {/* UBAH USERNAME INSTAGRAM */}
          <Instagram username="hi4zara" />
          {/* UBAH USERNAME LINKEDIN */}
          <LinkedInButtonLink username="zaraalfarabi" />
        </div>

        <div className="mt-6 grid gap-4 text-sm font-semibold sm:grid-cols-2">
          <div className="border-neutral-cs-10/40 rounded-xl border p-4">
            {/* UBAH HOBI KAMU */}
            <p className="text-neutral-cs-10/60 text-xs tracking-wide uppercase">Hobi</p>
            <p className="mt-2">Main piano</p>
          </div>
          <div className="border-neutral-cs-10/40 rounded-xl border p-4">
            {/* UBAH FUNFACT KAMU */}
            <p className="text-neutral-cs-10/60 text-xs tracking-wide uppercase">Fun Fact</p>
            <p className="mt-2">#ajengfebriaholic</p>
          </div>
        </div>

        <div className="border-neutral-cs-10/40 mt-4 rounded-xl border p-4">
          {/* UBAH LAGU FAVORIT KAMU */}
          <p className="text-neutral-cs-10/60 text-xs font-bold tracking-wide uppercase">Lagu Favorit</p>
          <p className="my-2 text-sm font-semibold">Isn't She Lovely</p>

          {/* UBAH URL SPOTIFY KAMU DENGAN LAGU FAVORIT MU */}
          <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/6RANU8AS5ICU5PEHh8BYtH?si=b530ce017b104d36" />
        </div>
      </div>
    </div>,
    document.body
  )
}

export default MemberPopup
