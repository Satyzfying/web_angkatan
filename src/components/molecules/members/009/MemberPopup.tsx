'use client'

import React, { useCallback, useEffect, useState } from 'react'

import Image from 'next/image'

import { createPortal } from 'react-dom'

import Instagram from '@/components/atoms/button/InstagramButtonLink'
import LinkedInButtonLink from '@/components/atoms/button/LinkedInButtonLink'
import SpotifyEmbed from '@/components/molecules/SpotifyEmbed'

import PokemonGate from './PokemonGate'
import ProfileImage from './image.png'

type MemberPopupProps = {
  isOpen: boolean
  onClose: () => void
}

const MemberPopup = ({ isOpen, onClose }: MemberPopupProps) => {
  const [passed, setPassed] = useState(false)

  const handleClose = useCallback(() => {
    setPassed(false)
    onClose()
  }, [onClose])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose()
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, handleClose])

  if (!isOpen) {
    return null
  }

  if (!passed) {
    return createPortal(<PokemonGate onClose={handleClose} onSuccess={() => setPassed(true)} />, document.body)
  }

  return createPortal(
    // PADA BAGIAN INI KAMU BOLEH MENGUBAH STYLE SESUKA HATI KAMU, TAPI JANGAN UBAH STRUKTUR DAN FUNGSI DARI KODE INI AGAR FUNGSI POPUP TETAP BERJALAN DENGAN BAIK
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto px-4 py-6">
      <button
        type="button"
        aria-label="Close member detail"
        onClick={handleClose}
        className="absolute inset-0 bg-[linear-gradient(135deg,#ef4444dd_0%,#fef3c7dd_46%,#3b82f6dd_100%)] backdrop-blur-md"
      />

      <div className="relative z-10 max-h-[100dvh] w-full max-w-[760px] animate-[member-popup-show_200ms_ease-out] overflow-y-auto rounded-[28px] border-4 border-slate-950 bg-[linear-gradient(180deg,#ef4444_0_92px,#111827_92px_104px,#f8fafc_104px_100%)] p-4 text-slate-950 shadow-[0_24px_70px_rgba(15,23,42,0.45)] sm:p-7">
        <button
          type="button"
          aria-label="Close member detail"
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-4 border-slate-950 bg-white text-xl leading-none font-black text-red-500 shadow-[0_4px_0_#111827] transition-transform hover:-translate-y-0.5 hover:shadow-[0_5px_0_#111827]"
        >
          x
        </button>

        <div className="mb-5 overflow-hidden rounded-[22px] border-4 border-slate-950 bg-yellow-300 p-2 shadow-[0_8px_0_#111827]">
          <Image
            src={ProfileImage}
            alt="Profile Image"
            className="h-80 w-full rounded-2xl border-4 border-white object-cover object-[center_35%] saturate-125 sm:h-112"
          />
        </div>

        <div className="rounded-2xl border-4 border-slate-950 bg-white p-4 pr-14 shadow-[0_8px_0_#111827]">
          {/* UBAH NAMA ANDA */}
          <h2 className="text-3xl leading-tight font-black tracking-normal text-slate-950 sm:text-5xl">
            Maulana Zaki Putra Zakaria
          </h2>
          {/* UBAH NRP DAN ASAL */}
          <p className="mt-3 inline-block rounded-full border-4 border-slate-950 bg-yellow-300 px-4 py-1 text-sm font-black text-slate-950 shadow-[0_4px_0_#ca8a04] sm:text-base">
            5027251009 - Banyuwangi
          </p>
        </div>

        <div className="mt-6 flex gap-3">
          {/* UBAH USERNAME INSTAGRAM */}
          <div className="rounded-2xl border-4 border-slate-950 bg-red-500 p-3 shadow-[0_6px_0_#111827] transition-transform hover:-translate-y-1">
            <Instagram username="just_zakarawr" />
          </div>
          {/* UBAH USERNAME LINKEDIN */}
          <div className="rounded-2xl border-4 border-slate-950 bg-blue-500 p-3 shadow-[0_6px_0_#111827] transition-transform hover:-translate-y-1">
            <LinkedInButtonLink username="maulanazaki07" />
          </div>
        </div>

        <div className="mt-7 grid gap-5 text-sm font-black sm:grid-cols-2">
          <div className="rounded-2xl border-4 border-slate-950 bg-emerald-300 p-4 shadow-[0_8px_0_#111827]">
            {/* UBAH HOBI KAMU */}
            <p className="inline-block rounded-full border-4 border-slate-950 bg-white px-3 py-1 text-xs font-black tracking-normal uppercase">
              Hobi
            </p>
            <p className="mt-4 text-xl leading-snug text-slate-950">Otak atik dan membuat game (Game Developer)</p>
          </div>
          <div className="rounded-2xl border-4 border-slate-950 bg-sky-300 p-4 shadow-[0_8px_0_#111827]">
            {/* UBAH FUNFACT KAMU */}
            <p className="inline-block rounded-full border-4 border-slate-950 bg-white px-3 py-1 text-xs font-black tracking-normal uppercase">
              Fun Fact
            </p>
            <p className="mt-4 text-xl leading-snug text-slate-950">
              Dulu dipanggil Zakar ama guru PKN akhirnya yang lain ikut ikutan manggil nama itu dan akhirnya jadi
              Nickname (ZackAre)
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border-4 border-slate-950 bg-white p-4 shadow-[0_8px_0_#111827]">
          {/* UBAH LAGU FAVORIT KAMU */}
          <p className="inline-block rounded-full border-4 border-slate-950 bg-yellow-300 px-3 py-1 text-xs font-black tracking-normal uppercase">
            Lagu Favorit
          </p>
          <p className="my-4 text-lg leading-snug font-black text-slate-950">1 • 2 • 3</p>

          {/* UBAH URL SPOTIFY KAMU DENGAN LAGU FAVORIT MU */}
          <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/5a6YChdEs7LDu5RuCsxHXH?si=5838b4a305e343c8" />
        </div>
      </div>
    </div>,
    document.body
  )
}

export default MemberPopup
