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
        className="absolute inset-0 bg-[#0c0818]/85 backdrop-blur-sm"
      />
      <div className="relative z-10 max-h-[100dvh] w-full max-w-[720px] animate-[member-popup-show_200ms_ease-out] overflow-y-auto rounded-2xl border-2 border-violet-400/50 bg-gradient-to-b from-[#0c0818] via-[#120a22] to-[#0e061a] p-6 text-white shadow-[0_0_120px_rgba(139,92,246,0.55),0_30px_60px_rgba(0,0,0,0.8)] sm:p-8">
        <button
          type="button"
          aria-label="Close member detail"
          onClick={onClose}
          className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border border-violet-300/45 text-xl leading-none text-violet-200 transition-colors hover:border-violet-300/80 hover:bg-violet-500/20"
        >
          x
        </button>
        <div className="relative mb-5 overflow-hidden rounded-2xl border border-violet-400/25">
          <Image src={ProfileImage} alt="Profile Image" className="h-120 w-full object-cover object-center" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0c0818]" />
        </div>
        <div className="pr-10">
          {/* UBAH NAMA ANDA */}
          <h2 className="bg-gradient-to-r from-white via-violet-200 to-purple-300 bg-clip-text text-2xl font-black text-transparent">Naila Anggun E.R</h2>
          {/* UBAH NRP DAN ASAL */}
          <p className="mt-1 text-sm font-semibold text-violet-300/55">5027251122 - Malang</p>
        </div>
        <div className="mt-5 flex gap-2">
          {/* UBAH USERNAME INSTAGRAM */}
          <Instagram username="_naerizq" />
          {/* UBAH USERNAME LINKEDIN */}
          <LinkedInButtonLink username="NailaAnggun" />
        </div>
        <div className="mt-6 grid gap-4 text-sm font-semibold sm:grid-cols-2">
          <div className="rounded-xl border border-violet-400/18 bg-[#2e1065]/70 p-4">
            {/* UBAH HOBI KAMU */}
            <p className="text-xs tracking-wide uppercase text-violet-300/50">Hobi</p>
            <p className="mt-2 text-violet-100">Dengerin Lagu :P</p>
          </div>
          <div className="rounded-xl border border-violet-400/18 bg-[#2e1065]/70 p-4">
            {/* UBAH FUNFACT KAMU */}
            <p className="text-xs tracking-wide uppercase text-violet-300/50">Fun Fact</p>
            <p className="mt-2 text-violet-100">Hobiku 5. Dengerin Lagu, Nyanyi, Main Gitar, Baca Buku & Nonton Film</p>
          </div>
        </div>
        <div className="mt-4 rounded-xl border border-violet-400/18 bg-[#2e1065]/70 p-4">
          {/* UBAH LAGU FAVORIT KAMU */}
          <p className="text-xs font-bold tracking-wide uppercase text-violet-300/50">Lagu Favorit</p>
          <p className="my-2 text-sm font-semibold text-violet-100">The World is Ugly - My Chemical Romance</p>
          {/* UBAH URL SPOTIFY KAMU DENGAN LAGU FAVORIT MU */}
          <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/6VtcgrVYo2xfygcWAfRpd1?si=10058d41ccab4eca" />
        </div>
      </div>
    </div>,
    document.body
  )
}
export default MemberPopup