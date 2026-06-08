'use client'

import React, { useEffect } from 'react'

import Image from 'next/image'

import { createPortal } from 'react-dom'

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

      <div className="fixed inset-0 z-[999999] flex items-start justify-center overflow-y-auto bg-black/60 backdrop-blur-sm px-4 py-8">
        <button
          type="button"
          aria-label="Close member detail"
          onClick={onClose}
          className="absolute inset-0"
        />

    <div className="relative z-[1000000] max-h-[90vh] w-full max-w-[720px] overflow-y-auto rounded-[32px] border-4 border-black bg-neutral-900 p-10 pb-14 text-white shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] animate-[pop-in_0.3s_ease-out_forwards] transition-all duration-300 ease-in-out sm:p-8">

      <button
        type="button"
        aria-label="Close member detail"
        onClick={onClose}
        className="absolute top-8 right-8 z-[999] flex h-12 w-12 items-center justify-center rounded-full border-4 border-black bg-red-600 text-3xl font-black text-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:scale-110 hover:rotate-6 active:scale-95"
      >
        ×
      </button>

        <div className="relative overflow-hidden border-4 border-cyan-500/30 mb-8 rounded-[24px] shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-transform duration-500 hover:scale-[1.02]">
          <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-cyan-500/10 blur-[90px]"></div>
          <Image src={ProfileImage} alt="Profile Image" className="relative z-10 h-120 w-full object-cover object-center" />
        </div>

        <div className="pr-10 ">
          {/* UBAH NAMA ANDA */}
          <h2 className="w-full object-cover object-center transition duration-500 hover:scale-105 bg-gradient-to-r from-cyan-300 to-blue-500 bg-clip-text text-4xl font-extrabold tracking-tighter text-cyan-400 drop-shadow-[2px_2px_0px_#000]">
            Muhamad Sabilil Haq
          </h2>
          {/* UBAH NRP DAN ASAL */}
          <div className="object-cover object-center transition duration-500 hover:scale-95 bg-clip-text mt-3 inline-block rounded-full border-2 border-cyan-500/30 bg-neutral-800 px-5 py-2 text-sm font-semibold text-neutral-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            5027251041 <span className="mx-2 text-neutral-500">•</span> Ciamis
          </div>
        </div>

        <div className="mt-6 flex gap-4 transition-opacity">
          {/* UBAH USERNAME INSTAGRAM */}
          <div className="rounded-xl border-2 border-cyan-500/30 bg-neutral-800 p-1.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-1 hover:bg-neutral-600">
            <Instagram username="sbillhq_" />
          </div>
          {/* UBAH USERNAME LINKEDIN */}
          <div className="rounded-xl border-2 border-cyan-500/30 bg-neutral-800 p-1.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-1 hover:bg-neutral-600">
            <LinkedInButtonLink username="muhamad-sabilil-haq-110665379" />
          </div>
        </div>


        <div className="mt-8 grid gap-6 text-sm font-semibold sm:grid-cols-2">

          <div className="relative overflow-hidden rounded-[20px] border-4 border-cyan-500/30 bg-neutral-800 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-1">
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-cyan-500/10 blur-[70px]"></div>
            {/* UBAH HOBI KAMU */}
            <p className="inline-block rounded-md border border-cyan-500/30 bg-neutral-950 px-2 py-0.5 text-xs font-bold tracking-widest uppercase bg-gradient-to-r from-cyan-300 to-blue-500 bg-clip-text text-transparent">Hobi</p>
            <p className="mt-3 text-lg font-bold text-white">maen game, rebahan, jalan jalan</p>
          </div>

          <div className="relative overflow-hidden rounded-[20px] border-4 border-cyan-500/30 bg-neutral-800 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-1">
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-500/10 blur-[70px]"></div>
            {/* UBAH FUNFACT KAMU */}
            <p className="inline-block rounded-md border border-blue-500/30 bg-neutral-950 px-2 py-0.5 text-xs font-bold tracking-widest uppercase bg-gradient-to-r from-cyan-300 to-blue-500 bg-clip-text text-transparent">Fun Fact</p>
            <p className="mt-3 text-lg font-bold text-lime-100">kalo bawa laptop, pasti bawa keyboard external</p>
          </div>
        </div>

        <div className="relative mt-8 rounded-[24px] border-4 border-cyan-500/30 bg-neutral-800/80 p-6 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 hover:border-cyan-400/40">

          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-cyan-500/10 blur-[100px]"></div>

          <div className="relative z-10 mb-4 flex items-center justify-between">

        <p className="inline-block rounded-md border border-cyan-500/30 bg-neutral-950 px-2 py-0.5 text-xs font-black tracking-widest uppercase bg-gradient-to-r from-cyan-300 to-blue-500 bg-clip-text text-transparent">
          Lagu Favorit
        </p>

          <div className="h-3 w-3 animate-pulse rounded-full border border-black bg-cyan-400 shadow-[0_0_4px_rgba(34,211,238,0.35)]"></div>
          </div>

          <p className="relative z-10 my-3 text-xl font-bold text-white">Melompat Lebih Tinggi</p>

          {/* UBAH URL SPOTIFY KAMU DENGAN LAGU FAVORIT MU */}
          <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/7Hun5YHQ5TEe9j97cU5XPg?si=ae659af071984234" />

        </div>
      </div>
    </div>,
    document.body
  )
}

export default MemberPopup