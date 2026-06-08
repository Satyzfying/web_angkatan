'use client'

import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'

import Image from 'next/image'

import Instagram from '@/components/atoms/button/InstagramButtonLink'
import LinkedInButtonLink from '@/components/atoms/button/LinkedInButtonLink'
import SpotifyEmbed from '@/components/molecules/SpotifyEmbed'

import ProfileImage from './image.png'
import './nier.css'

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
        className="absolute inset-0 bg-[#0f0e0b]/70 backdrop-blur-sm"
      />

      <div
        className="nier-panel relative z-10 max-h-[100dvh] w-full max-w-[720px] overflow-y-auto rounded-none border border-[#454138] bg-[#c6c0a8] p-6 text-[#454138] shadow-[0_0_40px_rgba(15,14,11,0.65)] sm:p-8"
        style={{ animation: 'member-popup-show 200ms ease-out, nier-flicker 6s linear 1s infinite' }}
      >
        <button
          type="button"
          aria-label="Close member detail"
          onClick={onClose}
          className="absolute top-4 right-4 z-40 flex h-9 w-9 items-center justify-center rounded-none border border-[#454138] text-xl leading-none text-[#454138] transition-colors hover:bg-[#454138] hover:text-[#c6c0a8]"
        >
          x
        </button>

        <div className="mb-5 overflow-hidden rounded-none border border-[#454138]">
          <Image src={ProfileImage} alt="Profile Image" className="h-120 w-full object-cover object-center" />
        </div>

        <div className="pr-10">
          {/* UBAH NAMA ANDA */}
          <h2 className="text-2xl font-medium tracking-[0.15em] uppercase">Sulthan Daffa Al Hasyimi</h2>
          {/* UBAH NRP DAN ASAL */}
          <p className="mt-1 text-sm font-medium tracking-[0.25em] text-[#454138]/70">5027251091 - Banjarmasin</p>
        </div>

        <div className="mt-5 flex gap-2">
          {/* UBAH USERNAME INSTAGRAM */}
          <Instagram username="s.daff.a" />
          {/* UBAH USERNAME LINKEDIN */}
          <LinkedInButtonLink username="sulthandaffaaalhasyimi" />
        </div>

        <div className="mt-6 grid gap-4 text-sm font-medium sm:grid-cols-2">
          <div className="rounded-none border border-[#454138]/40 bg-[#cdc9b4] p-4">
            {/* UBAH HOBI KAMU */}
            <p className="text-xs tracking-[0.3em] text-[#454138]/60 uppercase">Hobi</p>
            <p className="mt-2">Nonton Film Dokumenter</p>
          </div>
          <div className="rounded-none border border-[#454138]/40 bg-[#cdc9b4] p-4">
            {/* UBAH FUNFACT KAMU */}
            <p className="text-xs tracking-[0.3em] text-[#454138]/60 uppercase">Fun Fact</p>
            <p className="mt-2">Nulis Journal setiap hari tentang seluruh kejadian dunia sejak SMA</p>
          </div>
        </div>

        <div className="mt-4 rounded-none border border-[#454138]/40 bg-[#cdc9b4] p-4">
          {/* UBAH LAGU FAVORIT KAMU */}
          <p className="text-xs font-bold tracking-[0.3em] text-[#454138]/60 uppercase">Lagu Favorit</p>
          <p className="my-2 text-sm font-medium">Weight of the World/the End of YoRHa</p>

          {/* UBAH URL SPOTIFY KAMU DENGAN LAGU FAVORIT MU */}
          <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/1crLzBCIw7XxYt0AAbjeiE?si=b0be58c5f80541e6" />
        </div>
      </div>
    </div>,
    document.body
  )
}

export default MemberPopup
