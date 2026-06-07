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
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      <div className="relative z-10 max-h-screen w-full max-w-[720px] animate-[member-popup-show_200ms_ease-out] overflow-y-auto rounded-2xl border-2 border-[#D9B8C4] bg-[#FAF4EF] p-6 shadow-xl sm:p-8">
        {/* deco floating */}
        <span className="pointer-events-none absolute top-3 left-5 select-none text-xl text-[#C49aaa] opacity-40">✦</span>
        <span className="pointer-events-none absolute top-3 left-36 select-none text-xl text-[#C49aaa] opacity-35">✿</span>
        <span className="pointer-events-none absolute bottom-28 left-4 select-none text-xl text-[#C49aaa] opacity-25">✦</span>
        <span className="pointer-events-none absolute bottom-16 right-6 select-none text-xl text-[#C49aaa] opacity-30">✿</span>

        <button
          type="button"
          aria-label="Close member detail"
          onClick={onClose}
          className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border border-[#C49aaa] bg-[#EDD9E2] text-xl leading-none text-[#6b3a4a] hover:bg-[#D9B8C4]"
        >
          x
        </button>

        <div className="mb-5 overflow-hidden rounded-2xl border border-[#D9B8C4]">
          <Image src={ProfileImage} alt="Profile Image" className="h-120 w-full object-cover object-center" />
        </div>

        <div className="pr-10">
          {/* UBAH NAMA ANDA */}
          <h2 className="text-2xl font-black text-[#3D1F2A]">Tafidah Hasna Mumtazah</h2>
          {/* UBAH NRP DAN ASAL */}
          <p className="mt-1 text-sm font-semibold text-[#8a5f6a]">5027251025 - Bogor</p>
        </div>

        <div className="mt-5 flex gap-2">
          {/* UBAH USERNAME INSTAGRAM */}
          <Instagram username="fidasn_" />
          {/* UBAH USERNAME LINKEDIN */}
          <LinkedInButtonLink username="fidasn" />
        </div>

        <div className="mt-6 grid gap-4 text-sm font-semibold sm:grid-cols-2">
          <div className="relative overflow-hidden rounded-xl border border-[#C49aaa] bg-[#EDD9E2] p-4">
            {/* UBAH HOBI KAMU */}
            <p className="text-[9px] font-black tracking-widest uppercase text-[#8a5f6a]">Hobi</p>
            <p className="mt-2 text-[#3D1F2A]">Nonton film</p>
            <span className="pointer-events-none absolute right-2 bottom-1 select-none text-2xl opacity-20">🎬</span>
          </div>
          <div className="relative overflow-hidden rounded-xl border border-[#C49aaa] bg-[#EDD9E2] p-4">
            {/* UBAH FUNFACT KAMU */}
            <p className="text-[9px] font-black tracking-widest uppercase text-[#8a5f6a]">Fun Fact</p>
            <p className="mt-2 text-[#3D1F2A]">Member ke-5 aespa</p>
            <span className="pointer-events-none absolute right-2 bottom-1 select-none text-2xl opacity-20">✨</span>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-[#C49aaa] bg-[#EDD9E2] p-4">
          {/* UBAH LAGU FAVORIT KAMU */}
          <p className="text-xs font-bold tracking-wide uppercase text-[#8a5f6a]">Lagu Favorit</p>
          <p className="my-2 text-sm font-semibold text-[#3D1F2A]">Merry Christmas, Please Don't Call</p>

          {/* UBAH URL SPOTIFY KAMU DENGAN LAGU FAVORIT MU */}
          <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/0UOG0zUn7t8m8QcxfzR7AH?si=cc3beff2bd1d4d7a" />
        </div>
      </div>
    </div>,
    document.body
  )
}

export default MemberPopup