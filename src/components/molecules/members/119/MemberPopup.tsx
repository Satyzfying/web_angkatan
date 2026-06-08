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
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto px-4">
      <button
        type="button"
        aria-label="Close member detail"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      <div className="border-neutral-cs-10 bg-gradient-to-br from-zinc-950 via-stone-900 to-amber-950 relative z-10 max-h-screen w-full max-w-[720px] animate-[member-popup-show_200ms_ease-out] overflow-y-auto rounded-2xl border-2 p-6 text-white shadow-xl sm:p-8">
        <button
          type="button"
          aria-label="Close member detail"
          onClick={onClose}
          className="border-neutral-cs-10 hover:bg-neutral-cs-10/10 absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border text-xl leading-none"
        >
          x
        </button>

        <div className="border-neutral-cs-10/40 mb-5 overflow-hidden rounded-2xl border">
          <Image src={ProfileImage} alt="Profile Image" className="h-120 w-full object-cover object-[center_22%]" />
        </div>

        <div className="pr-10">
          {/* UBAH NAMA ANDA */}
          <h2 className="text-3xl font-black tracking-tight">Ronnin Raditya Putra Purbono</h2>
          {/* UBAH NRP DAN ASAL */}
          <p className="text-neutral-cs-10 mt-1 text-base font-bold tracking-wide">Tinggi badan = 182 cm / 6'0 ft </p>
          <p className="text-neutral-cs-10 mt-1 text-base font-bold tracking-wide">ukuran sepatu = 45</p>
          <p className="text-neutral-cs-10/70 mt-1 text-sm font-semibold">5027251119 - jakarta</p>
        </div>

        <div className="mt-5 flex gap-2">
          {/* UBAH USERNAME INSTAGRAM */}
          <Instagram username="ronninrp" />
          {/* UBAH USERNAME LINKEDIN */}
          <LinkedInButtonLink username="ronnin purbono" />
        </div>

        <div className="mt-6 grid gap-4 text-sm font-semibold sm:grid-cols-2">
          <div className="border-neutral-cs-10/40 rounded-xl border p-4">
            {/* UBAH HOBI KAMU */}
            <p className="text-red-300 text-xs tracking-widest uppercase">Hobi</p>
            <p className="mt-2">
              🏀 Basket <br />
              ⛳ Golf <br />
              🎵 dengerin lagu JJ
              </p>
          </div>
          <div className="border-neutral-cs-10/40 rounded-xl border p-4">
            {/* UBAH FUNFACT KAMU */}
            <p className="text-red-300 text-xs tracking-widest uppercase">Fun Fact</p>
            <p className="mt-2">
              1. Arti dari nama ronnin itu samurai yang kehilangan tuan <br />
              2. kaki kanan sama kaki kiri beda ukuran sepatu 
            </p>
          </div>
        </div>a

        <div className="border-neutral-cs-10/40 mt-4 rounded-xl border p-4">
          {/* UBAH LAGU FAVORIT KAMU */}
          <p className="text-red-300 text-xs tracking-widest uppercase">Lagu Favorit</p>
          <p className="my-2 text-sm font-semibold">Kaka Pu Manis Bikin Sa Suka</p>

          {/* UBAH URL SPOTIFY KAMU DENGAN LAGU FAVORIT MU */}
          <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/6Hfzok2nMdgXi5fCsozudj?si=a09e9e12166d42a9" />
        </div>
      </div>
    </div>,
    document.body
  )
}

export default MemberPopup
