'use client'

import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'

import Image from 'next/image'

import Instagram from '@/components/atoms/button/InstagramButtonLink'
import LinkedInButtonLink from '@/components/atoms/button/LinkedInButtonLink'
import SpotifyEmbed from '@/components/molecules/SpotifyEmbed'

import ProfileImage from './image.png'
import Background from './background.jpg'

import localFont from 'next/font/local'
const amoresa = localFont({
  src: './Amoresa.otf',
})

import { Della_Respira } from 'next/font/google'
const dellaRespira = Della_Respira({
  weight: '400',
  subsets: ['latin'],
})

import { DM_Sans } from 'next/font/google'
const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500'],
})

import { Cormorant_Garamond, Nunito } from 'next/font/google'
const cormorantGaramond = Cormorant_Garamond({
  weight: ['700'],
  subsets: ['latin'],
})

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '600'],
})

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
        className="absolute inset-0 bg-[#DDE8F5]/20 backdrop-blur-md"
      />

      <div
        className="border-[1.5px] border-white/40 relative z-10 max-h-[100dvh] w-full max-w-[720px] animate-[member-popup-show_200ms_ease-out] overflow-y-auto rounded-2xl shadow-2xl"
        style={{
          backgroundImage: `url(${Background.src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'local',
        }}
      >
        <div className="min-h-full bg-[#FFFDF0]/25 backdrop-blur-[2px] p-6 text-[#3F4E63] sm:p-8">
          <button
            type="button"
            aria-label="Close member detail"
            onClick={onClose}
            className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border border-[#A8C0D6] bg-white/70 text-xl leading-none text-[#6F8098] hover:bg-white/90"
          >
            x
          </button>

          <div className="border-neutral-cs-10/40 mb-5 overflow-hidden rounded-2xl border">
            <Image src={ProfileImage} alt="Profile Image" className="h-120 w-full object-cover object-center" />
          </div>

          <div className="pr-10">
            {/* UBAH NAMA ANDA */}
            <h2 className="text-[#3F4E63] leading-tight">
              <span className={`${amoresa.className} text-4xl`}>
                S
              </span>
              <span className={`${dellaRespira.className} text-3xl`}>
                ilfi Rochmatul Auliyah
              </span>
            </h2>
            {/* UBAH NRP DAN ASAL */}
            <p className={`${dmSans.className} mt-1 text-[13px] font-medium tracking-[0.15em] text-[#8092A8] uppercase`}>
              5027251008 • Sidoarjo
            </p>
          </div>

          <div className="mt-5 flex gap-2">
            {/* UBAH USERNAME INSTAGRAM */}
            <div className="rounded-xl border-[3px] border-[#A8C0D6]/85 bg-[#3F4E63]/10 backdrop-blur-md p-3">
              <Instagram username="seelfwee" />
            </div>
            {/* UBAH USERNAME LINKEDIN */}
            <div className="rounded-xl border-[3px] border-[#A8C0D6]/85 bg-[#3F4E63]/10 backdrop-blur-md p-3">
              <LinkedInButtonLink username="silfirochmatulauliyah" />
            </div>
          </div>

          <div className="mt-6 grid gap-4 text-sm font-semibold sm:grid-cols-2">
            <div className="rounded-xl border-[3px] border-[#A8C0D6]/85 bg-white/25 backdrop-blur-md p-4">
              {/* UBAH HOBI KAMU */}
              <p className={`${cormorantGaramond.className} text-xl font-bold tracking-wide text-[#6F8098]`}>Hobbies</p>
              <p className={`${nunito.className} mt-2 text-base text-[#49596D]`}>baca komik, nonton series, main game</p>
              <span className="absolute -top-3 -left-2.5 text-2xl text-[#6F8098]">✦</span>
            </div>
            <div className="rounded-xl border-[3px] border-[#A8C0D6]/85 bg-white/25 backdrop-blur-md p-4">
              {/* UBAH FUNFACT KAMU */}
              <p className={`${cormorantGaramond.className} text-xl font-bold tracking-wide text-[#6F8098]`}>Fun Fact</p>
              <p className={`${nunito.className} mt-2 text-base text-[#49596D]`}>member H2H yang ditinggal</p>
              <span className="absolute -top-3 -right-2.5 text-2xl text-[#6F8098]">✦</span>
            </div>
          </div>

          <div className="mt-4 rounded-xl border-[3px] border-[#A8C0D6]/85 bg-white/25 backdrop-blur-md p-4">
            {/* UBAH LAGU FAVORIT KAMU */}
            <p className={`${cormorantGaramond.className} text-xl font-bold tracking-wide text-[#6F8098]`}>Favorite Song</p>
            <p className={`${nunito.className} mt-2 text-base font-semibold text-[#49596D]`}>Neon moon</p>
            <span className="absolute -top-4 -left-3 text-3xl text-[#6F8098]">✦</span>

            {/* UBAH URL SPOTIFY KAMU DENGAN LAGU FAVORIT MU */}
            <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/7nbAMKGkPMjc4EuNNsjXqZ?si=e689f5d4296f4abf" />
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default MemberPopup
