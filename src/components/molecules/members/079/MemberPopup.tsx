'use client'

import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'

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

  return createPortal(
    // PADA BAGIAN INI KAMU BOLEH MENGUBAH STYLE SESUKA HATI KAMU, TAPI JANGAN UBAH STRUKTUR DAN FUNGSI DARI KODE INI AGAR FUNGSI POPUP TETAP BERJALAN DENGAN BAIK
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto px-4 font-sans">
      <button
        type="button"
        aria-label="Close member detail"
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
      />

      <div className="relative z-10 max-h-[100dvh] w-full max-w-[720px] animate-[member-popup-show_200ms_ease-out] overflow-y-auto rounded-sm border-2 border-yellow-500/80 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-950 p-6 text-white shadow-[0_0_30px_rgba(234,179,8,0.2)] sm:p-8">

        {/* MLBB Style Close Button (Red/Gold aesthetic) */}
        <button
          type="button"
          aria-label="Close member detail"
          onClick={onClose}
          className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-sm border border-red-500/80 bg-red-950/50 text-xl font-bold leading-none text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.4)] transition-all hover:bg-red-600 hover:text-white"
        >
          x
        </button>

        {/* Profile Image Wrapper - Hero Portrait Style */}
        <div className="mb-5 overflow-hidden rounded-sm border-2 border-yellow-500/60 shadow-[0_0_15px_rgba(234,179,8,0.3)]">
          <Image src={ProfileImage} alt="Profile Image" className="h-120 w-full object-cover object-center grayscale-[20%] transition-all duration-500 hover:scale-105 hover:grayscale-0" />
        </div>

        <div className="pr-10">
          {/* UBAH NAMA ANDA - Mythic Gold Text Style */}
          <h2 className="bg-gradient-to-r from-yellow-200 via-yellow-500 to-yellow-700 bg-clip-text text-3xl font-black uppercase tracking-wider text-transparent drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
            Raffa Al Azmi
          </h2>
          {/* UBAH NRP DAN ASAL */}
          <p className="mt-2 text-sm font-semibold tracking-widest text-blue-200/80 uppercase">
            5027251079 - Gresik
          </p>
        </div>

        <div className="mt-5 flex gap-3">
          {/* UBAH USERNAME INSTAGRAM */}
          <div className="rounded-sm border border-yellow-600/30 bg-slate-800/50 p-1 shadow-[inset_0_0_10px_rgba(234,179,8,0.1)]">
            <Instagram username="raappa.alz" />
          </div>
          {/* UBAH USERNAME LINKEDIN */}
          <div className="rounded-sm border border-yellow-600/30 bg-slate-800/50 p-1 shadow-[inset_0_0_10px_rgba(234,179,8,0.1)]">
            <LinkedInButtonLink username="affa-al-azmi-260655379" />
          </div>
        </div>

        {/* Stats / Info Section - MLBB Equipment Build Box Style */}
        <div className="mt-6 grid gap-4 text-sm font-semibold sm:grid-cols-2">
          <div className="rounded-sm border border-yellow-600/40 bg-gradient-to-b from-slate-800/80 to-slate-900/80 p-4 shadow-[inset_0_0_15px_rgba(234,179,8,0.05)] transition-colors hover:border-yellow-400/80">
            {/* UBAH HOBI KAMU */}
            <p className="text-xs font-bold tracking-widest text-yellow-500 uppercase drop-shadow-md">Hobi</p>
            <p className="mt-2 text-gray-100">Olahraga</p>
          </div>
          <div className="rounded-sm border border-yellow-600/40 bg-gradient-to-b from-slate-800/80 to-slate-900/80 p-4 shadow-[inset_0_0_15px_rgba(234,179,8,0.05)] transition-colors hover:border-yellow-400/80">
            {/* UBAH FUNFACT KAMU */}
            <p className="text-xs font-bold tracking-widest text-yellow-500 uppercase drop-shadow-md">Fun Fact</p>
            <p className="mt-2 text-gray-100">-</p>
          </div>
        </div>

        <div className="mt-4 rounded-sm border border-yellow-600/40 bg-gradient-to-b from-slate-800/80 to-slate-900/80 p-4 shadow-[inset_0_0_15px_rgba(234,179,8,0.05)] transition-colors hover:border-yellow-400/80">
          {/* UBAH LAGU FAVORIT KAMU */}
          <p className="text-xs font-bold tracking-widest text-yellow-500 uppercase drop-shadow-md">Theme Song</p>
          <p className="my-2 text-sm font-semibold text-gray-100">black hole</p>

          {/* UBAH URL SPOTIFY KAMU DENGAN LAGU FAVORIT MU */}
          <div className="overflow-hidden rounded-sm border border-yellow-900/50 ring-1 ring-yellow-500/20">
            <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/0LUEM4bPQ9uX79SXfg8KAE?si=6lUKZvJpREGPqQCCSHpsVA&rowId=89cf8f4ab4e84379" />
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default MemberPopup