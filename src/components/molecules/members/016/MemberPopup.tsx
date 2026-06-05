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

   return (
    // PADA BAGIAN INI KAMU BOLEH MENGUBAH STYLE SESUKA HATI KAMU, TAPI JANGAN UBAH STRUKTUR DAN FUNGSI DARI KODE INI AGAR FUNGSI POPUP TETAP BERJALAN DENGAN BAIK
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto px-4 pt-28 pb-8 sm:pt-32 font-sans selection:bg-white selection:text-black">
      <button
        type="button"
        aria-label="Close member detail"
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity"
      />

      <div className="border-neutral-800 bg-neutral-950 relative z-10 max-h-[100dvh] w-full max-w-[640px] animate-[member-popup-show_200ms_ease-out] overflow-y-auto rounded-2xl border p-6 text-neutral-100 shadow-2xl shadow-black/50 sm:p-8">
        <button
          type="button"
          aria-label="Close member detail"
          onClick={onClose}
          className="border-neutral-800 hover:bg-neutral-800 absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border text-md leading-none text-neutral-400 hover:text-white transition-colors duration-200"
        >
          ✕
        </button>

        <div className="border-neutral-800/60 mb-6 overflow-hidden rounded-xl border bg-neutral-900">
          <Image src={ProfileImage} alt="Profile Image" className="h-96 w-full object-cover object-center" />
        </div>

        <div className="pr-10">
          {/* UBAH NAMA ANDA */}
          <h2 className="text-2xl font-bold tracking-tight text-white">Annabel Clarissa</h2>
          {/* UBAH NRP DAN ASAL */}
          <p className="text-neutral-400 mt-1.5 text-xs font-mono tracking-widest uppercase">5027251016 • Surabaya</p>
        </div>

        <div className="mt-5 flex gap-2">
          {/* UBAH USERNAME INSTAGRAM */}
          <Instagram username="annabel_9936" />
          {/* UBAH USERNAME LINKEDIN */}
          <LinkedInButtonLink username="annabelclarissa" />
        </div>

        <div className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
          <div className="border-neutral-800/60 bg-neutral-900/30 rounded-xl border p-4 hover:border-neutral-700 transition-colors">
            {/* UBAH HOBI KAMU */}
            <p className="text-neutral-500 text-[10px] font-bold tracking-widest uppercase">Hobi</p>
            <p className="mt-2 text-neutral-300 font-medium leading-relaxed">Mendengarkan musik? menggambar? shodou? banyak sebenarnya</p>
          </div>
          <div className="border-neutral-800/60 bg-neutral-900/30 rounded-xl border p-4 hover:border-neutral-700 transition-colors">
            {/* UBAH FUNFACT KAMU */}
            <p className="text-neutral-500 text-[10px] font-bold tracking-widest uppercase">Fun Fact</p>
            <p className="mt-2 text-neutral-300 font-medium leading-relaxed">Susah menghapalkan orang lain (minim 6 bulan tapi harus sering ketemu TT)</p>
          </div>
        </div>

        <div className="border-neutral-800/60 bg-neutral-900/30 mt-4 rounded-xl border p-4 hover:border-neutral-700 transition-colors">
          {/* UBAH LAGU FAVORIT KAMU */}
          <p className="text-neutral-500 text-[10px] font-bold tracking-widest uppercase">Lagu Favorit</p>
          <p className="my-2 text-sm font-semibold text-neutral-200">Amanojaku</p>

          {/* UBAH URL SPOTIFY KAMU DENGAN LAGU FAVORIT MU */}
          <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/0LgZadzsnpOYzCFD22FhqW?si=a43b923a93714c13" />
        </div>
      </div>
    </div>,
    document.body
  )
}

export default MemberPopup
