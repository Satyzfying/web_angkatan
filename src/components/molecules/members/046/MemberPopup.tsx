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
        className="absolute inset-0 bg-slate-900/80 backdrop-blur-md transition-opacity"
      />

      <div className="relative z-10 max-h-[calc(100vh-9rem)] w-full max-w-[720px] animate-[member-popup-show_200ms_ease-out] overflow-y-auto rounded-3xl border border-white/10 bg-gradient-to-br from-slate-800 to-slate-950 p-6 text-slate-100 shadow-2xl shadow-indigo-500/10 sm:max-h-[calc(100vh-10rem)] sm:p-8">
      <div className="border-neutral-cs-10 bg-blue-cs-40 relative z-10 max-h-[100dvh] w-full max-w-[720px] animate-[member-popup-show_200ms_ease-out] overflow-y-auto rounded-2xl border-2 p-6 text-white shadow-xl sm:p-8">
        <button
          type="button"
          aria-label="Close member detail"
          onClick={onClose}
          className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-slate-800/50 text-xl leading-none text-slate-400 transition-all hover:border-rose-500 hover:bg-rose-500 hover:text-white"
        >
          x
        </button>

        <div className="mb-6 overflow-hidden rounded-2xl border border-white/10 shadow-lg">
          <Image
            src={ProfileImage}
            alt="Profile Image"
            className="h-[20rem] w-full object-cover object-center sm:h-[24rem]"
          />
        </div>

        <div className="pr-10">
          <h2 className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-3xl font-black text-transparent sm:text-4xl">
            Nayarfa Syamahira Dyananta
          </h2>

          <p className="mt-2 text-sm font-medium text-slate-400 sm:text-base">5027251046 - Yogyakarta</p>
        </div>

        <div className="mt-6 flex gap-3">
          <Instagram username="nayarfa_" />

          <LinkedInButtonLink username="Nayarfa S. Dyananta" />
        </div>

        <div className="mt-8 grid gap-4 text-sm font-semibold sm:grid-cols-2">
          <div className="group rounded-2xl border border-white/5 bg-white/5 p-5 backdrop-blur-sm transition-all hover:border-indigo-500/30 hover:bg-white/10">
            <p className="text-xs font-bold tracking-wider text-indigo-400 uppercase">Hobi</p>
            <p className="mt-2 text-base font-medium text-slate-200 group-hover:text-white">Main Billiard</p>
          </div>
          <div className="group rounded-2xl border border-white/5 bg-white/5 p-5 backdrop-blur-sm transition-all hover:border-cyan-500/30 hover:bg-white/10">
            <p className="text-xs font-bold tracking-wider text-cyan-400 uppercase">Fun Fact</p>
            <p className="mt-2 text-base font-medium text-slate-200 group-hover:text-white">
              Belum pernah naik pesawat seumur hidup saya
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-white/5 bg-white/5 p-5 backdrop-blur-sm transition-all hover:border-white/10">
          <p className="text-xs font-bold tracking-wider text-purple-400 uppercase">Lagu Favorit</p>
          <p className="mt-2 mb-4 text-base font-medium text-slate-200">Dewi - Threesixty</p>

          {/* UBAH NAMA ANDA */}
          <h2 className="text-2xl font-black">Nayarfa Syamahira Dyananta</h2>
          {/* UBAH NRP DAN ASAL */}
          <p className="text-neutral-cs-10/70 mt-1 text-sm font-semibold">5027251046 - Yogyakarta</p>
        </div>

        <div className="mt-5 flex gap-2">
          {/* UBAH USERNAME INSTAGRAM */}
          <Instagram username="nayarfa_" />
          {/* UBAH USERNAME LINKEDIN */}
          <LinkedInButtonLink username="Nayarfa S. Dyananta" />
        </div>

        <div className="mt-6 grid gap-4 text-sm font-semibold sm:grid-cols-2">
          <div className="border-neutral-cs-10/40 rounded-xl border p-4">
            {/* UBAH HOBI KAMU */}
            <p className="text-neutral-cs-10/60 text-xs tracking-wide uppercase">Hobi</p>
            <p className="mt-2">Main Billiard</p>
          </div>
          <div className="border-neutral-cs-10/40 rounded-xl border p-4">
            {/* UBAH FUNFACT KAMU */}
            <p className="text-neutral-cs-10/60 text-xs tracking-wide uppercase">Fun Fact</p>
            <p className="mt-2">Belum pernah naik pesawat seumur hidup</p>
          </div>
        </div>

        <div className="border-neutral-cs-10/40 mt-4 rounded-xl border p-4">
          {/* UBAH LAGU FAVORIT KAMU */}
          <p className="text-neutral-cs-10/60 text-xs font-bold tracking-wide uppercase">Lagu Favorit</p>
          <p className="my-2 text-sm font-semibold">Dewi - Threesixty</p>

          {/* UBAH URL SPOTIFY KAMU DENGAN LAGU FAVORIT MU */}
          <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/1GK0IE5FNd8M66A109z6jm?si=vMBTJItxQUekZJnNzUIrfQ" />
        </div>
      </div>
    </div>,
    document.body
  )
}

export default MemberPopup
