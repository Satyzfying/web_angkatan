'use client'

import React, { useEffect } from 'react'

import Image from 'next/image'

import Instagram from '@/components/atoms/button/InstagramButtonLink'
import LinkedInButtonLink from '@/components/atoms/button/LinkedInButtonLink'
import SpotifyEmbed from '@/components/molecules/SpotifyEmbed'

import ProfileImage from './image.jpg'

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
    // PADA BAGIAN INI KAMU BOLEH MENGUBAH STYLE SESUKA HATI KAMU, TAPI JANGAN UBAH STRUKTUR DAN FUNGSI DARI KODE INI AGAR FUNGSI POPUP TETAP BERJALAN DENGAN BAIK
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto px-4 pt-28 pb-8 sm:pt-32">
      <button
        type="button"
        aria-label="Close member detail"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      <div
        className="relative z-10 max-h-[calc(100vh-9rem)] w-full max-w-[720px] animate-[member-popup-show_200ms_ease-out] overflow-y-auto rounded-2xl p-6 text-white shadow-xl sm:max-h-[calc(100vh-10rem)] sm:p-8"
        style={{
          background: '#080808',
          border: '3px solid transparent',
          backgroundClip: 'padding-box',
          boxShadow: '0 0 0 3px #a0a0a0, 0 0 0 4px #e8e8e8, 0 0 0 5px #686868, 0 25px 50px rgba(0,0,0,0.8)',
        }}
      >
        <button
          type="button"
          aria-label="Close member detail"
          onClick={onClose}
          className="hover:bg-white/10 absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full text-xl leading-none"
          style={{
            border: '2px solid transparent',
            boxShadow: '0 0 0 2px #909090, 0 0 0 3px #e0e0e0, 0 0 0 4px #606060',
          }}
        >
          x
        </button>

        <div
          className="mb-5 overflow-hidden rounded-2xl"
          style={{
            border: '2px solid transparent',
            boxShadow: '0 0 0 2px #909090, 0 0 0 3px #e0e0e0, 0 0 0 4px #606060',
          }}
        >
          <Image src={ProfileImage} alt="Profile Image" className="h-120 w-full object-cover object-top" />
        </div>

        <div className="pr-10">
          {/* UBAH NAMA ANDA */}
          <h2 className="text-2xl font-black">Mahrinza Redouane Zakariyah</h2>
          {/* UBAH NRP DAN ASAL */}
          <p className="mt-1 text-sm font-semibold" style={{ color: 'rgba(180,180,180,0.6)' }}>5027251074 - Sidoarjo</p>
        </div>

        <div className="mt-5 flex gap-2">
          {/* UBAH USERNAME INSTAGRAM */}
          <Instagram username="mahrinzaa" />
          {/* UBAH USERNAME LINKEDIN */}
          <LinkedInButtonLink username="mahrinza-zakariyah-1306b1348" />
        </div>

        <div className="mt-6 grid gap-4 text-sm font-semibold sm:grid-cols-2">
          <div
            className="rounded-xl p-4"
            style={{
              background: '#0f0f0f',
              border: '2px solid transparent',
              boxShadow: '0 0 0 2px #909090, 0 0 0 3px #e0e0e0, 0 0 0 4px #606060',
            }}
          >
            {/* UBAH HOBI KAMU */}
            <p className="text-xs tracking-wide uppercase" style={{ color: 'rgba(180,180,180,0.5)' }}>Hobi</p>
            <p className="mt-2">Main GeoGuessr</p>
          </div>
          <div
            className="rounded-xl p-4"
            style={{
              background: '#0f0f0f',
              border: '2px solid transparent',
              boxShadow: '0 0 0 2px #909090, 0 0 0 3px #e0e0e0, 0 0 0 4px #606060',
            }}
          >
            {/* UBAH FUNFACT KAMU */}
            <p className="text-xs tracking-wide uppercase" style={{ color: 'rgba(180,180,180,0.5)' }}>Fun Fact</p>
            <p className="mt-2">Gak pernah korupsi</p>
          </div>
        </div>

        <div
          className="mt-4 rounded-xl p-4"
          style={{
            background: '#0f0f0f',
            border: '2px solid transparent',
            boxShadow: '0 0 0 2px #909090, 0 0 0 3px #e0e0e0, 0 0 0 4px #606060',
          }}
        >
          {/* UBAH LAGU FAVORIT KAMU */}
          <p className="text-xs font-bold tracking-wide uppercase" style={{ color: 'rgba(180,180,180,0.5)' }}>Lagu Favorit</p>
          <p className="my-2 text-sm font-semibold">Mist</p>

          {/* UBAH URL SPOTIFY KAMU DENGAN LAGU FAVORIT MU */}
          <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/2NLOyWzztMiW5FmNhD83K6?si=fe22174931f5405e" />
        </div>
      </div>
    </div>
  )
}

export default MemberPopup
