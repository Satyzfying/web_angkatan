'use client'

import React, { useEffect } from 'react'

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

  return (
    // PADA BAGIAN INI KAMU BOLEH MENGUBAH STYLE SESUKA HATI KAMU, TAPI JANGAN UBAH STRUKTUR DAN FUNGSI DARI KODE INI AGAR FUNGSI POPUP TETAP BERJALAN DENGAN BAIK
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto px-4 pt-28 pb-8 sm:pt-32">
      <button
        type="button"
        aria-label="Close member detail"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      <div className="border-indigo-500/40 bg-gradient-to-br from-indigo-950 via-purple-900 to-black relative z-10 max-h-[calc(100vh-9rem)] w-full max-w-[720px] animate-[member-popup-show_200ms_ease-out] overflow-y-auto rounded-2xl border-2 p-6 text-white shadow-2xl shadow-purple-500/20 sm:max-h-[calc(100vh-10rem)] sm:p-8">
        <img
          src="https://media.tenor.com/2RoI-80G3w0AAAAi/pixel-chibi.gif"
          alt="Chibi Pixel"
          className="pointer-events-none absolute bottom-4 right-4 z-0 w-28 opacity-40 mix-blend-screen"
        />
        <button
          type="button"
          aria-label="Close member detail"
          onClick={onClose}
          className="border-neutral-cs-10 hover:bg-neutral-cs-10/10 absolute top-4 right-4 z-50 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 hover:bg-white/10 text-xl leading-none text-white"
        >
          x
        </button>

        <div className="border-white/20 relative z-10 mb-5 overflow-hidden rounded-2xl border">
          <Image src={ProfileImage} alt="Profile Image" className="h-120 w-full object-cover object-center" />
        </div>

        <div className="relative z-10 pr-10">
          {/* UBAH NAMA ANDA */}
          <h2 className="text-2xl font-black drop-shadow-md">Ashkhabil Abror Budihardjo</h2>
          {/* UBAH NRP DAN ASAL */}
          <p className="text-indigo-200 mt-1 text-sm font-semibold drop-shadow-md">5027251049 - Surabaya</p>
        </div>

        <div className="relative z-10 mt-5 flex gap-2">
          {/* UBAH USERNAME INSTAGRAM */}
          <Instagram username="ashkhabil.a.b" />
          {/* UBAH USERNAME LINKEDIN */}
          <LinkedInButtonLink username="ashkhabilbudihardjo" />
        </div>

        <div className="relative z-10 mt-6 grid gap-4 text-sm font-semibold sm:grid-cols-2">
          <div className="border-white/20 bg-black/40 backdrop-blur-sm rounded-xl border p-4">
            {/* UBAH HOBI KAMU */}
            <p className="text-indigo-300 text-xs tracking-wide uppercase">Hobi</p>
            <p className="mt-2 text-white">Gaming : MLBB, sama main catur tipis-tipis</p>
          </div>
          <div className="border-white/20 bg-black/40 backdrop-blur-sm rounded-xl border p-4">
            {/* UBAH FUNFACT KAMU */}
            <p className="text-indigo-300 text-xs tracking-wide uppercase">Fun Fact</p>
            <p className="mt-2 text-white">Gita oshi sejak tahun 2024</p>
          </div>
        </div>

        <div className="border-white/20 bg-black/40 backdrop-blur-sm relative z-10 mt-4 rounded-xl border p-4">
          {/* UBAH LAGU FAVORIT KAMU */}
          <p className="text-indigo-300 text-xs font-bold tracking-wide uppercase">Lagu Favorit</p>
          <p className="my-2 text-sm font-semibold text-white">Hivi! - Mata Ke Hati</p>

          {/* UBAH URL SPOTIFY KAMU DENGAN LAGU FAVORIT MU */}
          <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/4p5UcsOpnSYwqYnThBpDjD?si=40f20f0fae2e4f6a" />
        </div>
      </div>
    </div>
  )
}

export default MemberPopup