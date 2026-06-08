'use client'

import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'

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

  return createPortal(
    // PADA BAGIAN INI KAMU BOLEH MENGUBAH STYLE SESUKA HATI KAMU, TAPI JANGAN UBAH STRUKTUR DAN FUNGSI DARI KODE INI AGAR FUNGSI POPUP TETAP BERJALAN DENGAN BAIK
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto px-4">
      <button
        type="button"
        aria-label="Close member detail"
        onClick={onClose}
        className="absolute inset-0 bg-black/90 backdrop-blur-md"
      />

      <div className="relative z-10 max-h-[100dvh] w-full max-w-[800px] overflow-y-auto rounded-3xl border-2 border-red-700 bg-gradient-to-b from-black via-zinc-950 to-red-950 p-6 text-red-100 shadow-[0_0_50px_rgba(220,38,38,0.5)] animate-[member-popup-show_250ms_ease-out] sm:p-8">

        {/* Glow Background */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-10 left-10 h-40 w-40 rounded-full bg-red-600 blur-[100px]" />
          <div className="absolute bottom-10 right-10 h-40 w-40 rounded-full bg-red-800 blur-[100px]" />
        </div>

        {/* Close Button */}
        <button
          type="button"
          aria-label="Close member detail"
          onClick={onClose}
          className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full border border-red-600 bg-black/50 text-red-500 transition-all hover:scale-110 hover:bg-red-900/40 hover:text-white"
        >
          ✕
        </button>

        {/* Profile Image */}
        <div className="mb-6 overflow-hidden rounded-3xl border-2 border-red-700 shadow-[0_0_25px_rgba(239,68,68,0.4)]">
          <Image
            src={ProfileImage}
            alt="Profile Image"
            className="h-[500px] w-full object-cover object-center grayscale hover:grayscale-0 transition-all duration-500"
          />
        </div>

        {/* Header */}
        <div className="pr-10 text-center">
          <p className="mb-2 text-xs tracking-[0.5em] text-red-500 uppercase">
            Welcome To The Upside Down
          </p>

          <h2
            className="text-4xl font-black uppercase tracking-[0.2em] text-red-500"
            style={{
              textShadow:
                "0 0 5px #ef4444, 0 0 15px #dc2626, 0 0 30px #991b1b",
            }}
          >
            Muhammad Hugo Rayandra E
          </h2>

          <p className="mt-3 text-sm font-semibold text-zinc-400">
            5027251076 • Bandung
          </p>
        </div>

        {/* Social */}
        <div className="mt-6 flex justify-center gap-3">
          <Instagram username="hugorayandra" />
          <LinkedInButtonLink username="hugorayandra" />
        </div>

        {/* Info Cards */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          <div className="rounded-2xl border border-red-800 bg-black/50 p-5 backdrop-blur-sm transition-all hover:shadow-[0_0_20px_rgba(220,38,38,0.5)]">
            <p className="text-xs uppercase tracking-[0.3em] text-red-500">
              Hobi
            </p>
            <p className="mt-3 text-lg font-semibold text-zinc-200">
              Olahraga <br />
            </p>
          </div>

          <div className="rounded-2xl border border-red-800 bg-black/50 p-5 backdrop-blur-sm transition-all hover:shadow-[0_0_20px_rgba(220,38,38,0.5)]">
            <p className="text-xs uppercase tracking-[0.3em] text-red-500">
              Fun Fact
            </p>
            <p className="mt-3 text-lg font-semibold text-zinc-200">
              🚫 Tidak suka semua seafood
            </p>
          </div>
        </div>

        {/* Favorite Song */}
        <div className="mt-6 rounded-2xl border border-red-800 bg-black/50 p-5 backdrop-blur-sm">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-red-500">
            Favorite Soundtrack
          </p>

          <p className="my-3 text-lg font-semibold text-zinc-100">
            🎵 Movie
          </p>

          <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/0kKrJbP4oATz98qQp2iXeC?si=101a3464ac3547b2" />
        </div>
      </div>
    </div>,
    document.body
  )
}

export default MemberPopup
