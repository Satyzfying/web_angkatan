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
      <button type="button" aria-label="Close member detail" onClick={onClose} className="absolute inset-0">
        <img
          src="https://cdn.terminaltrove.com/m/a03290ca-6b48-4c34-9970-93174008e7c8.gif"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      </button>

      <div
        className="relative z-10 max-h-[100dvh] w-full max-w-[720px] animate-[member-popup-show_200ms_ease-out] overflow-y-auto rounded-2xl border-2 p-6 shadow-xl sm:p-8"
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          backgroundColor: '#24273a',
          borderColor: '#494d64',
          color: '#cad3f5'
        }}
      >
        <button
          type="button"
          aria-label="Close member detail"
          onClick={onClose}
          className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border text-xl leading-none"
          style={{ borderColor: '#494d64', color: '#cad3f5' }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#363a4f')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          x
        </button>

        <div className="mb-5 overflow-hidden rounded-2xl border" style={{ borderColor: '#494d64' }}>
          <Image src={ProfileImage} alt="Profile Image" className="h-120 w-full object-cover object-center" />
        </div>

        <div className="pr-10">
          {/* UBAH NAMA ANDA */}
          <h2 className="text-2xl font-black">Husam Danish</h2>
          {/* UBAH NRP DAN ASAL */}
          <p className="mt-1 text-sm font-semibold" style={{ color: '#a5adcb' }}>
            5027251060 - Buleleng
          </p>
        </div>

        <div className="mt-5 flex gap-2">
          {/* UBAH USERNAME INSTAGRAM */}
          <Instagram username="husam.danish" />
          {/* UBAH USERNAME LINKEDIN */}
          <LinkedInButtonLink username="husam-danish" />
        </div>

        <div className="mt-6 grid gap-4 text-sm font-semibold sm:grid-cols-2">
          <div className="rounded-xl border p-4" style={{ borderColor: '#494d64' }}>
            {/* UBAH HOBI KAMU */}
            <p className="text-xs tracking-wide uppercase" style={{ color: '#8087a2' }}>
              Hobi
            </p>
            <p className="mt-2">
              Ricing, Baca (mostly novel & komik), olahraga (jogging, cycling, basket), main game (mostly MLBB, but
              sometimes random indie game)
            </p>
          </div>
          <div className="rounded-xl border p-4" style={{ borderColor: '#494d64' }}>
            {/* UBAH FUNFACT KAMU */}
            <p className="text-xs tracking-wide uppercase" style={{ color: '#8087a2' }}>
              Fun Fact
            </p>
            <p className="mt-2">
              Sejauh ini bolak-balik surabaya-bali (mudik) selalu motoran
              <br></br>
              <br></br>I use Arch BTW!
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-xl border p-4" style={{ borderColor: '#494d64' }}>
          {/* UBAH LAGU FAVORIT KAMU */}
          <p className="text-xs font-bold tracking-wide uppercase" style={{ color: '#8087a2' }}>
            Lagu Favorit
          </p>
          <p className="my-2 text-sm font-semibold">Laskar Pelangi</p>

          {/* UBAH URL SPOTIFY KAMU DENGAN LAGU FAVORIT MU */}
          <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/0ejpHFKbEqTcNQ4OMBawrP?si=1a84201e2f18426f" />
        </div>
      </div>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100..800;1,100..800');`}</style>
    </div>,
    document.body
  )
}

export default MemberPopup
