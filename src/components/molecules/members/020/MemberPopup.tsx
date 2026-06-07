'use client'

import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'

import Image from 'next/image'

import Instagram from '@/components/atoms/button/InstagramButtonLink'
import LinkedInButtonLink from '@/components/atoms/button/LinkedInButtonLink'
import SpotifyEmbed from '@/components/molecules/SpotifyEmbed'

import ProfileImage from './image.png'
import HobiIcon from './hobi.png'
import FunFactIcon from './funfact.png'
import LaguIcon from './lagu.png'
import Evangelion from './evangelion.gif'

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
      <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto px-4 pt-28 pb-8 sm:pt-32">
        <img
          src={Evangelion.src}
          alt="Evangelion"
          className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover opacity-100"
        />

  return createPortal(
    // PADA BAGIAN INI KAMU BOLEH MENGUBAH STYLE SESUKA HATI KAMU, TAPI JANGAN UBAH STRUKTUR DAN FUNGSI DARI KODE INI AGAR FUNGSI POPUP TETAP BERJALAN DENGAN BAIK
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto px-4">
      <button
        type="button"
        aria-label="Close member detail"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      <div className="border-neutral-cs-10 bg-blue-cs-40 relative z-10 max-h-[100dvh] w-full max-w-[720px] animate-[member-popup-show_200ms_ease-out] overflow-y-auto rounded-2xl border-2 p-6 text-white shadow-xl sm:p-8">
        <button
          type="button"
          aria-label="Close member detail"
          onClick={onClose}
          className="absolute inset-0 z-10 bg-black/30 backdrop-blur-[4px]"
        />

        <div
          className="relative z-10 max-h-[calc(100vh-9rem)] w-full max-w-[720px] animate-[member-popup-show_200ms_ease-out] overflow-y-auto rounded-2xl border border-[#734f9a] bg-black/30 p-6 text-white shadow-[0_0_28px_rgba(115,79,154,0.55)] backdrop-blur-md sm:max-h-[calc(100vh-10rem)] sm:p-8"
          style={{ fontFamily: '"Matisse EB", serif' }}
        >
          <button
            type="button"
            aria-label="Close member detail"
            onClick={onClose}
            className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border border-[#734f9a] bg-black/50 text-xl leading-none text-white shadow-[0_0_12px_rgba(115,79,154,0.65)] transition hover:bg-[#734f9a]/30"
          >
            x
          </button>

          <div className="mb-5 overflow-hidden rounded-2xl border border-[#2986cc] bg-black/50 shadow-[0_0_30px_rgba(29,68,108,0.45)]">
            <Image
              src={ProfileImage}
              alt="Profile Image"
              className="h-120 w-full object-cover object-center"
            />
          </div>

          <div className="pr-10">
            {/* UBAH NAMA ANDA */}
            <h2 className="text-3xl font-black text-white drop-shadow-[0_0_8px_rgba(150,95,212,0.75)]">
              Farrel Arteya Kumara
            </h2>

            {/* UBAH NRP DAN ASAL */}
            <p className="mt-1 text-base font-semibold text-white/75">
              5027251020 - Surabaya
            </p>
          </div>

          <div className="mt-5 flex gap-2">
            {/* UBAH USERNAME INSTAGRAM */}
            <Instagram username="_f.arrel15" />

            {/* UBAH USERNAME LINKEDIN */}
            <LinkedInButtonLink username="farrel-kumara-98a605379" />
          </div>

          <div className="mt-6 grid gap-4 text-sm font-semibold sm:grid-cols-2">
            <div className="rounded-xl border border-[#ed2323] bg-black/50 p-4 shadow-[0_0_14px_rgba(237,35,35,0.45)]">
              {/* UBAH HOBI KAMU */}
              <div className="flex items-center gap-2">
                <Image
                  src={HobiIcon}
                  alt="Hobi Icon"
                  width={20}
                  height={20}
                  className="h-7 w-7 shrink-0 object-contain"
                />
                <p className="text-sm tracking-wide text-[#ed2323] uppercase">
                  Hobi
                </p>
              </div>

              <p className="mt-2 text-base text-white">Baca komik</p>
            </div>

            <div className="rounded-xl border border-[#ea8532] bg-black/50 p-4 shadow-[0_0_14px_rgba(234,133,50,0.45)]">
              {/* UBAH FUNFACT KAMU */}
              <div className="flex items-center gap-2">
                <Image
                  src={FunFactIcon}
                  alt="Fun Fact Icon"
                  width={20}
                  height={20}
                  className="h-7 w-7 shrink-0 object-contain"
                />
                <p className="text-sm tracking-wide text-[#ea8532] uppercase">
                  Fun Fact
                </p>
              </div>

              <p className="mt-2 text-base text-white">Ngantukan</p>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-[#52d053] bg-black/50 p-4 shadow-[0_0_14px_rgba(150,95,212,0.45)]">
            {/* UBAH LAGU FAVORIT KAMU */}
            <div className="flex items-center gap-2">
              <Image
                src={LaguIcon}
                alt="Lagu Favorit Icon"
                width={20}
                height={20}
                className="h-7 w-7 shrink-0 object-contain"
              />
              <p className="text-sm font-bold tracking-wide text-[#52d053] uppercase">
                Lagu Favorit
              </p>
            </div>

            <p className="my-2 text-base font-semibold text-white">
              A Cruel Angel's Thesis
            </p>

            {/* UBAH URL SPOTIFY KAMU DENGAN LAGU FAVORIT MU */}
            <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/23phSRwoMy48rwFpmuAP8q" />
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default MemberPopup
