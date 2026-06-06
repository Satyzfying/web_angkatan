'use client'

import React, { useEffect } from 'react'

import Image from 'next/image'

import { createPortal } from 'react-dom'

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
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-hidden px-4">
      <button
        type="button"
        aria-label="Close member detail"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      <div className="border-pink-200 relative z-10 h-[100dvh] max-h-[100dvh] w-full max-w-[720px] animate-[member-popup-show_200ms_ease-out] overflow-y-auto rounded-2xl border-2 bg-gradient-to-br from-pink-400 via-fuchsia-500 to-fuchsia-900 p-6 text-white shadow-2xl ring-1 ring-pink-100/20 sm:p-8">
        <button
          type="button"
          aria-label="Close member detail"
          onClick={onClose}
          className="border-pink-200 absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full border bg-rose-400/20 text-lg text-white transition-colors hover:bg-rose-300/40"
        >
          x
        </button>

        <div className="border-pink-200/50 mb-5 overflow-hidden rounded-2xl border bg-white/5">
          <Image
            src={ProfileImage}
            alt="Profile Image"
            className="h-120 w-full object-cover object-center transition-transform duration-300 hover:scale-105"
          />
        </div>

        <div className="pr-10">
          {/* UBAH NAMA ANDA */}
          <h2 className="text-3xl font-black text-pink-50">Nabila Nafisatus Zuhro</h2>
          {/* UBAH NRP DAN ASAL */}
          <p className="mt-1 text-sm font-semibold text-pink-100/80">5027251073 - Nganjuk</p>
        </div>

        <div className="mt-5 flex gap-2">
          {/* UBAH USERNAME INSTAGRAM */}
          <Instagram username="nabilanafisa__" />
          {/* UBAH USERNAME LINKEDIN */}
          <LinkedInButtonLink username="nabila-nafisatus-zuhro-6466aa388" />
        </div>

        <div className="mt-6 grid gap-4 text-sm font-semibold sm:grid-cols-2">
          <div className="border-pink-200/40 rounded-xl border bg-pink-100/10 p-4 backdrop-blur-sm">
            {/* UBAH HOBI KAMU */}
            <p className="text-pink-200 text-xs tracking-widest uppercase">Hobi</p>
            <p className="mt-2">Bikin puisi, nggambar, dengerin lagu Yowis Ben</p>
          </div>
          <div className="border-pink-200/40 rounded-xl border bg-fuchsia-200/10 p-4 transition-colors backdrop-blur-sm hover:border-pink-100 hover:bg-fuchsia-100/20">
            {/* UBAH FUNFACT KAMU */}
            <p className="text-pink-200 text-xs tracking-widest uppercase">Fun Fact</p>
            <p className="mt-2">Suka ngelindur dari kecil</p>
          </div>
        </div>

        <div className="border-pink-200/40 mt-4 rounded-xl border bg-pink-100/10 p-4 transition-colors backdrop-blur-sm hover:border-pink-100 hover:bg-pink-100/20">
          {/* UBAH LAGU FAVORIT KAMU */}
          <p className="text-pink-200 text-xs font-bold tracking-widest uppercase">Lagu Favorit</p>
          <p className="my-2 text-sm font-semibold">
            Akad - Payung Teduh, tapi sebenernya banyakk lagu fav dari Yowis Ben, Sheila On 7, Hivi, hmm lagu R&B, pop,
            jawa, hipdut, bollywood
          </p>

          {/* UBAH URL SPOTIFY KAMU DENGAN LAGU FAVORIT MU */}
          <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/3AAAGS7iM1ekDywqdYMJG2?si=pDg9SaHgTNqdlLN-AmweuQ" />
        </div>
      </div>
    </div>,
    document.body
  )
}

export default MemberPopup
