'use client'

import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'

import Image from 'next/image'
import { Cormorant_Garamond, Nunito } from 'next/font/google'

import Instagram from '@/components/atoms/button/InstagramButtonLink'
import LinkedInButtonLink from '@/components/atoms/button/LinkedInButtonLink'
import SpotifyEmbed from '@/components/molecules/SpotifyEmbed'

import ProfileImage from './image.jpg'
import BackgroundImage from './background.jpg'

type MemberPopupProps = {
  isOpen: boolean
  onClose: () => void
}

const titleFont = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['600', '700'],
})

const bodyFont = Nunito({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
})

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
    <div
      className={`fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto px-4 pt-28 pb-8 sm:pt-32 ${bodyFont.className}`}
    >
      <button
        type="button"
        aria-label="Close member detail"
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />

      <div
        className="relative z-10 max-h-screen w-full max-w-[720px] animate-[member-popup-show_200ms_ease-out] overflow-y-auto rounded-[28px] border-2 border-white/60 p-6 text-white shadow-[0_0_45px_rgba(96,165,250,0.45)] sm:p-8"
        style={{
          backgroundImage: `linear-gradient(rgba(9, 26, 52, 0.35), rgba(9, 26, 52, 0.5)), url(${BackgroundImage.src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="pointer-events-none absolute left-5 top-8 text-white/90">
          <div className="text-2xl drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">✧</div>
          <div className="mt-2 text-3xl drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">☆</div>
          <div className="mt-3 text-xl drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">✦</div>
          <div className="mt-2 text-2xl drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">☆</div>
        </div>

        <div className="pointer-events-none absolute right-5 top-18 text-white/90">
          <div className="text-4xl drop-shadow-[0_0_12px_rgba(255,255,255,0.85)]">✩</div>
          <div className="ml-4 text-2xl drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">☆</div>
        </div>

        <div className="pointer-events-none absolute bottom-8 left-4 text-white/90">
          <div className="text-4xl drop-shadow-[0_0_12px_rgba(255,255,255,0.85)]">✩</div>
        </div>

        <div className="pointer-events-none absolute bottom-10 right-6 text-white/90">
          <div className="text-3xl drop-shadow-[0_0_12px_rgba(255,255,255,0.85)]">☆</div>
        </div>

        <button
          type="button"
          aria-label="Close member detail"
          onClick={onClose}
          className="absolute top-4 right-4 flex h-11 w-11 items-center justify-center rounded-full border border-white/60 bg-white/10 text-2xl leading-none text-white shadow-[0_0_22px_rgba(255,255,255,0.45)] backdrop-blur-md transition hover:bg-white/20 hover:shadow-[0_0_30px_rgba(255,255,255,0.7)]"
        >
          ×
        </button>

        <div className="mb-5 overflow-hidden rounded-[24px] border border-white/50 bg-white/10 shadow-[0_0_30px_rgba(191,219,254,0.5)] backdrop-blur-md">
          <Image src={ProfileImage} alt="Profile Image" className="h-120 w-full object-cover object-center" />
        </div>

        <div className="relative rounded-[22px] border border-white/45 bg-white/10 px-5 py-4 pr-10 shadow-[0_0_28px_rgba(147,197,253,0.45)] backdrop-blur-md">
          <div className="pointer-events-none absolute -right-3 -top-4 text-5xl text-white/85 drop-shadow-[0_0_14px_rgba(255,255,255,0.9)]">
            ☆
          </div>

          {/* UBAH NAMA ANDA */}
          <h2
            className={`${titleFont.className} whitespace-nowrap text-[2.45rem] font-bold leading-none tracking-wide text-[#f7edc8] drop-shadow-[0_0_8px_rgba(255,255,255,0.85)] sm:text-[3.35rem]`}
          >
            <span className="text-[3.4rem] italic leading-none drop-shadow-[0_0_12px_rgba(253,230,138,0.8)] sm:text-[4.7rem]">
              S
            </span>
            ahira{' '}
            <span className="text-[3.4rem] italic leading-none drop-shadow-[0_0_12px_rgba(253,230,138,0.8)] sm:text-[4.7rem]">
              B
            </span>
            ilqis{' '}
            <span className="text-[3.4rem] italic leading-none drop-shadow-[0_0_12px_rgba(253,230,138,0.8)] sm:text-[4.7rem]">
              R
            </span>
            ivadito
          </h2>

          {/* UBAH NRP DAN ASAL */}
          <p className="mt-1 text-base font-bold text-white/85 sm:text-lg">5027251037 - Bekasi</p>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-[18px] border border-white/45 bg-white/10 px-4 py-3 shadow-[0_0_24px_rgba(96,165,250,0.45)] backdrop-blur-md transition hover:bg-white/15 hover:shadow-[0_0_30px_rgba(191,219,254,0.65)]">
            {/* UBAH USERNAME INSTAGRAM */}
            <Instagram username="sahirabqs" />
          </div>

          <div className="rounded-[18px] border border-white/45 bg-white/10 px-4 py-3 shadow-[0_0_24px_rgba(96,165,250,0.45)] backdrop-blur-md transition hover:bg-white/15 hover:shadow-[0_0_30px_rgba(191,219,254,0.65)]">
            {/* UBAH USERNAME LINKEDIN */}
            <LinkedInButtonLink username="sahira-rivadito-211611379" />
          </div>
        </div>

        <div className="mt-6 grid gap-4 text-sm font-semibold sm:grid-cols-2">
          <div className="relative rounded-[20px] border border-white/45 bg-white/10 p-5 shadow-[0_0_26px_rgba(147,197,253,0.45)] backdrop-blur-md transition hover:scale-[1.01] hover:bg-white/15 hover:shadow-[0_0_34px_rgba(191,219,254,0.68)]">
            {/* UBAH HOBI KAMU */}
            <p className="text-xs font-bold tracking-[0.28em] uppercase text-white/70">Hobi</p>
            <p className="mt-3 text-[1.7rem] font-extrabold text-white">Tidur</p>

            <div className="pointer-events-none absolute bottom-3 right-4 text-3xl text-white/75 drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]">
              zᶻ 𝗓
            </div>
          </div>

          <div className="relative rounded-[20px] border border-white/45 bg-white/10 p-5 shadow-[0_0_26px_rgba(147,197,253,0.45)] backdrop-blur-md transition hover:scale-[1.01] hover:bg-white/15 hover:shadow-[0_0_34px_rgba(191,219,254,0.68)]">
            {/* UBAH FUNFACT KAMU */}
            <p className="text-xs font-bold tracking-[0.28em] uppercase text-white/70">Fun Fact</p>
            <p className="mt-3 text-lg font-extrabold leading-relaxed text-white">
              hidup seputar kucing, biru, nonton, tidur /ᐠ - ˕ -マ Ⳋ
            </p>

            <div className="pointer-events-none absolute bottom-2 right-4 text-3xl text-white/80 drop-shadow-[0_0_10px_rgba(255,255,255,0.65)]">
              ᓚ₍ ^. .^₎
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-[22px] border border-white/45 bg-white/10 p-5 shadow-[0_0_28px_rgba(147,197,253,0.5)] backdrop-blur-md transition hover:bg-white/15 hover:shadow-[0_0_38px_rgba(191,219,254,0.7)]">
          {/* UBAH LAGU FAVORIT KAMU */}
          <p className="text-xs font-bold tracking-[0.28em] uppercase text-white/70">Lagu Favorit</p>
          <p
            className={`${titleFont.className} my-2 text-4xl font-bold leading-none tracking-wide text-[#f7edc8] drop-shadow-[0_0_10px_rgba(255,255,255,0.7)]`}
          >
            From The Start
          </p>

          <div className="rounded-[18px] border border-white/20 bg-[#0b2343]/60 p-3 shadow-[inset_0_0_20px_rgba(255,255,255,0.06)]">
            {/* UBAH URL SPOTIFY KAMU DENGAN LAGU FAVORIT MU */}
            <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/43iIQbw5hx986dUEZbr3eN?si=95173f1123ab4b7a" />
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default MemberPopup