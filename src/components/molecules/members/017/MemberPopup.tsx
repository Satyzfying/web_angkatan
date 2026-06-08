'use client'

import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

import Image from 'next/image'

import Instagram from '@/components/atoms/button/InstagramButtonLink'
import LinkedInButtonLink from '@/components/atoms/button/LinkedInButtonLink'
import SpotifyEmbed from '@/components/molecules/SpotifyEmbed'

import ProfileImage from './image.jpeg'
import Cat1 from './cat1.png'
import Cat2 from './cat2.png'
import Cat3 from './cat3.png'

type MemberPopupProps = {
  isOpen: boolean
  onClose: () => void
}

const MemberPopup = ({ isOpen, onClose }: MemberPopupProps) => {
  const cats = [Cat1, Cat2, Cat3]
  const [showLoading, setShowLoading] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      setShowLoading(false)
      return
    }

    setShowLoading(true)
    const timer = window.setTimeout(() => setShowLoading(false), 3000)

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.clearTimeout(timer)
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) {
    return null
  }

  return createPortal((
    // PADA BAGIAN INI KAMU BOLEH MENGUBAH STYLE SESUKA HATI KAMU, TAPI JANGAN UBAH STRUKTUR DAN FUNGSI DARI KODE INI AGAR FUNGSI POPUP TETAP BERJALAN DENGAN BAIK
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto px-4 pt-28 pb-8 sm:pt-32">
      {showLoading && (
        <div className="absolute inset-0 z-[110] flex items-center justify-center bg-gradient-to-br from-slate-950 via-blue-900 to-black">
          <div className="flex flex-col items-center gap-6">
            <div className="relative h-16 w-16">
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-yellow-300 border-r-yellow-300 animate-spin" />
              <div className="absolute inset-2 rounded-full border-4 border-transparent border-b-sky-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '2s' }} />
            </div>
            <p className="text-xl font-bold text-yellow-300 tracking-widest">SABAR WOII !!!</p>
          </div>
        </div>
      )}
      <button
        type="button"
        aria-label="Close member detail"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

{/* Floating Cats Background */}
<div className="pointer-events-none absolute inset-0 overflow-hidden">
  {Array.from({ length: 70 }).map((_, index) => {
    const randomCat = cats[Math.floor(Math.random() * cats.length)]

    return (
      <Image
        key={index}
        src={randomCat}
        alt="Floating Cat"
        width={150}
        height={150}
        className="absolute animate-bounce opacity-80"
        style={{
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animationDuration: `${1 + Math.random() * 3}s`,
          transform: `
            rotate(${Math.random() * 360}deg)
            scale(${0.8 + Math.random() * 1.5})
          `,
        }}
      />
    )
  })}
</div>

      <div className="border-black/30 bg-gradient-to-br from-slate-950 via-blue-900 to-black relative z-10 overflow-hidden max-h-[calc(100vh-9rem)] w-full max-w-[720px] animate-[member-popup-show_200ms_ease-out] overflow-y-auto rounded-3xl border-2 p-6 text-white shadow-[0_30px_70px_rgba(0,0,0,0.5)] sm:max-h-[calc(100vh-10rem)] sm:p-8">
        <button
          type="button"
          aria-label="Close member detail"
          onClick={onClose}
          className="border-white/10 hover:bg-white/10 absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full border text-xl leading-none text-white"
        >
          x
        </button>

        <div className="border-yellow-200/20 mb-5 overflow-hidden rounded-[32px] border bg-black/10 shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
          <div className="rounded-[32px] border-4 border-yellow-300/80 p-1 shadow-[0_0_0_6px_rgba(245,158,11,0.22)]">
            <Image src={ProfileImage} alt="Profile Image" className="h-120 w-full rounded-[28px] object-cover object-center" />
          </div>
        </div>

        <div className="pr-10">
          {/* UBAH NAMA ANDA */}
          <h2 className="text-2xl font-black">Viko Rizky Fauzan</h2>
          {/* UBAH NRP DAN ASAL */}
          <p className="text-neutral-cs-10/70 mt-1 text-sm font-semibold">5027251017 - Surabaya</p>
        </div>

        <div className="mt-5 flex gap-2">
          {/* UBAH USERNAME INSTAGRAM */}
          <Instagram username="viko.fauzan" />
          {/* UBAH USERNAME LINKEDIN */}
          <LinkedInButtonLink username="viko.fauzan" />
        </div>

        <div className="mt-6 rounded-3xl bg-slate-950/95 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
          <div className="grid gap-4 text-sm font-semibold sm:grid-cols-2">
            <div className="rounded-3xl bg-yellow-300 p-4 shadow-[0_10px_30px_rgba(245,158,11,0.2)]">
              {/* UBAH HOBI KAMU */}
              <p className="text-slate-950 text-xs tracking-wide uppercase">Hobi</p>
              <p className="mt-2 text-slate-950">Belajar</p>
            </div>
            <div className="rounded-3xl bg-yellow-300 p-4 shadow-[0_10px_30px_rgba(245,158,11,0.2)]">
              {/* UBAH FUNFACT KAMU */}
              <p className="text-slate-950 text-xs tracking-wide uppercase">Fun Fact</p>
              <p className="mt-2 text-slate-950">Viko introvert parah</p>
            </div>
          </div>

          <div className="mt-4 rounded-3xl bg-yellow-300 p-5 shadow-[0_10px_30px_rgba(245,158,11,0.2)]">
            {/* UBAH LAGU FAVORIT KAMU */}
            <p className="text-slate-950 text-xs font-bold tracking-wide uppercase">Lagu Favorit</p>
            <p className="my-2 text-lg font-semibold text-slate-950">Stand by Me</p>

            {/* UBAH URL SPOTIFY KAMU DENGAN LAGU FAVORIT MU */}
            <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/2gANywSFYF58YFMPdDSAjC?si=w_eRxkMLQlmke7L3uooE4g" />
          </div>
        </div>
      </div>
    </div>
  ), document.body)
}

export default MemberPopup
