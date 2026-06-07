'use client'

import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'

import Image from 'next/image'

import Instagram from '@/components/atoms/button/InstagramButtonLink'
import LinkedInButtonLink from '@/components/atoms/button/LinkedInButtonLink'
import SpotifyEmbed from '@/components/molecules/SpotifyEmbed'

import ProfileImage from './image.jpg'
import VoidBackground from './Time.webp'

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
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden px-4 py-8">
      <button
        type="button"
        aria-label="Close member detail"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      <div className="relative z-10 max-h-[100dvh] w-full max-w-[760px] overflow-y-auto overflow-x-hidden rounded-[32px] border-4 border-black/80 shadow-[0_0_20px_rgba(255,255,255,0.4),0_0_40px_rgba(255,255,255,0.15),inset_0_0_15px_rgba(255,255,255,0.05)] bg-[#071226]/70 p-5 text-white shadow-[0_0_60px_rgba(124,58,237,0.18)] backdrop-blur-xl sm:p-8"
        style={{
          backgroundImage: `linear-gradient(rgba(0,8,20,0.65), rgba(0,8,20,0.65)), url(${VoidBackground.src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          backgroundAttachment: 'local',
  }}
>
        
        <button
          type="button"
          aria-label="Close member detail"
          onClick={onClose}
          className="absolute top-5 right-5 flex h-12 w-12 items-center justify-center rounded-full border border-white/40 bg-black/20 text-2xl text-white backdrop-blur-md transition-all hover:scale-105 hover:bg-white/10"
        >
          x
        </button>

        <div className="mb-5 overflow-hidden rounded-[32px] border border-white/20">
          <Image src={ProfileImage} alt="Profile Image" className="h-[320px] w-full rounded-[28px] object-cover object-top sm:h-[480px] lg:h-[540px]" />
        </div>

        <div className="pr-10">
          {/* UBAH NAMA ANDA */}
          <h2 className="font-sans text-4xl font-black tracking-wide" style={{textShadow: '-2px -2px 0 black, 2px -2px 0 black, -2px 2px 0 black, 2px 2px 0 black'}} >Rayhan Fadhilah Allayn</h2>
          {/* UBAH NRP DAN ASAL */}
          <p className="mt-2 text-lg font-semibold text-white/70">5027251126 - Bogor</p>
        </div>

        
        <div className="mt-5 flex gap-2">
          {/* UBAH USERNAME INSTAGRAM */}
          <Instagram username="raillyn._" />
          {/* UBAH USERNAME LINKEDIN */}
          <LinkedInButtonLink username="rayhan-fadhilah-allayn" />
        </div>

          <div className="mt-6 grid gap-4 text-sm font-semibold sm:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-black/20 p-4 backdrop-blur-sm">
              {/* UBAH HOBI KAMU */}
              <p className="text-neutral-cs-10/60 text-xs tracking-wide uppercase">Hobi</p>
              <p className="mt-2">Main Game & Dengerin Musik</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/20 p-4 backdrop-blur-sm">
              {/* UBAH FUNFACT KAMU */}
              <p className="text-neutral-cs-10/60 text-xs tracking-wide uppercase">Fun Fact</p>
              <p className="mt-2">Pernah Hampir Diculik Pas TK</p>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-white/12 bg-black/20 p-4 backdrop-blur-sm">
            {/* UBAH LAGU FAVORIT KAMU */}
            <p className="text-neutral-cs-10/60 text-xs font-bold tracking-wide uppercase">Lagu Favorit</p>
            <p className="my-2 text-sm font-semibold">All Night Radio</p>

            {/* UBAH URL SPOTIFY KAMU DENGAN LAGU FAVORIT MU */}
            <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/7GRfiALpnehkSNn34LDeci?si=7bca50f780124d5b" />
          </div>
      </div>
    </div>,
    document.body
  )
}

export default MemberPopup
