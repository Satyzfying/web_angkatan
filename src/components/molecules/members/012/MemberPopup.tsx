'use client'

import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'

import Image from 'next/image'

import Instagram from '@/components/atoms/button/InstagramButtonLink'
import LinkedInButtonLink from '@/components/atoms/button/LinkedInButtonLink'
import SpotifyEmbed from '@/components/molecules/SpotifyEmbed'

import AimainaImage from './aimaina.png'
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
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-hidden px-4">
      <button
        type="button"
        aria-label="Close member detail"
        onClick={onClose}
        className="absolute inset-0 bg-black/65 backdrop-blur-sm"
      />

      <div className="font-maimai relative z-10 h-[100dvh] max-h-[100dvh] w-full max-w-[720px] animate-[member-popup-show_350ms_ease-out] overflow-y-auto rounded-2xl border-2 border-[#ADD8E6] bg-black p-6 text-[#ADD8E6] shadow-xl sm:p-8">
        <video
          className="pointer-events-none absolute inset-x-0 top-200 bottom-0 h-auto w-full object-cover object-center opacity-50 sm:top-135"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        >
          <source src="/assets/videos/members/012/background.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/45" aria-hidden="true" />

        <button
          type="button"
          aria-label="Close member detail"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-[#ADD8E6] bg-black/45 text-xl leading-none text-[#ADD8E6] backdrop-blur-sm hover:bg-black/60"
        >
          x
        </button>

        <div className="relative z-10 mb-5 overflow-hidden rounded-2xl border border-[#ADD8E6]/60">
          <Image src={ProfileImage} alt="Profile Image" className="h-120 w-full object-cover object-center" />
        </div>

        <div className="relative z-10 overflow-hidden rounded-xl border-2 border-[#ADD8E6] bg-[#ADD8E6]/20 p-4 pr-32 backdrop-blur-sm sm:pr-40">
          {/* UBAH NAMA ANDA */}
          <h2 className="text-4xl font-black text-[#ADD8E6]">Gede Satya Putra Aryanta</h2>
          {/* UBAH NRP DAN ASAL */}
          <p className="mt-2 text-lg font-semibold text-[#ADD8E6]/75">5027251012 - Denpasar</p>
          <Image
            src={AimainaImage}
            alt="Aimaina"
            className="pointer-events-none absolute right-3 bottom-0 h-24 w-auto object-contain sm:h-24"
          />
        </div>

        <div className="relative z-10 mt-3 flex w-fit gap-2 rounded-xl border-2 border-[#ADD8E6] bg-[#ADD8E6]/20 p-3 backdrop-blur-sm">
          {/* UBAH USERNAME INSTAGRAM */}
          <Instagram username="satyaarynt" />
          {/* UBAH USERNAME LINKEDIN */}
          <LinkedInButtonLink username="satya-putra-aryanta" />
        </div>

        <div className="relative z-10 mt-6 grid gap-4 text-lg font-semibold sm:grid-cols-2">
          <div className="rounded-xl border-2 border-[#ADD8E6] bg-[#ADD8E6]/20 p-4 backdrop-blur-sm">
            {/* UBAH HOBI KAMU */}
            <p className="text-sm tracking-wide text-[#ADD8E6]/70 uppercase">Hobi</p>
            <p className="mt-2">Main maimai (game yang lagi ke play di background, terus yang tadi di play di intro juga part of the lore of the game.) Also likes playing billiard</p>
          </div>
          <div className="rounded-xl border-2 border-[#ADD8E6] bg-[#ADD8E6]/20 p-4 backdrop-blur-sm">
            {/* UBAH FUNFACT KAMU */}
            <p className="text-sm tracking-wide text-[#ADD8E6]/70 uppercase">Fun Fact</p>
            <p className="mt-2">Suka banget makanan/minuman manis tapi berat badan masih segini segini aja</p>
          </div>
        </div>

        <div className="relative z-10 mt-4 rounded-xl border-2 border-[#ADD8E6] bg-[#ADD8E6]/20 p-4 backdrop-blur-sm">
          {/* UBAH LAGU FAVORIT KAMU */}
          <p className="text-sm font-bold tracking-wide text-[#ADD8E6]/70 uppercase">Lagu Favorit</p>
          <p className="my-3 text-lg font-semibold">Vocaloids Are Lame - PinnochioP   (sebenarnya ada banyak tapi ini aja)</p>

          {/* UBAH URL SPOTIFY KAMU DENGAN LAGU FAVORIT MU */}
          <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/14vSQsIaGXnAPmdNxvTLfi?si=8e8d9f779c6d44fd" />
        </div>
      </div>
    </div>,
    document.body
  )
}

export default MemberPopup
