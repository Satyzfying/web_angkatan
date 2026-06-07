'use client'

import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'

import Image from 'next/image'

import Instagram from '@/components/atoms/button/InstagramButtonLink'
import LinkedInButtonLink from '@/components/atoms/button/LinkedInButtonLink'
import SpotifyEmbed from '@/components/molecules/SpotifyEmbed'

import Civ1 from './civ1.png'
import Civ2 from './civ2.png'
import ProfileImage from './image.png'

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
      className="absolute inset-0 bg-[#08111d]/85 backdrop-blur-sm"
    />
<div className="pointer-events-none fixed left-[-250px] top-1/2 z-[90] -translate-y-1/2 opacity-90">
  <Image
    src={Civ1}
    alt=""
    width={1200}
    height={2400}
    className="h-auto w-[800px]"
  />
</div>

{/* Leader Kanan */}
      {/* Leader Kanan */}
<div className="pointer-events-none fixed right-[-50px] top-1/2 z-[90] -translate-y-1/2 opacity-90">
  <Image
    src={Civ2}
    alt=""
    width={1200}
    height={2400}
    className="h-auto w-[430px]"
  />
</div>
    <div
      className="
        relative z-10
        max-h-[100dvh]
        w-full
        max-w-[920px]
        overflow-y-auto

        rounded-xl

        border-[3px]
        border-[#b89042]

        bg-[url('/images/civ-bg.jpg')]
        bg-cover
        bg-center

        p-6

        text-[#f5e7c1]

        shadow-[0_0_40px_rgba(0,0,0,0.7)]

        animate-[member-popup-show_200ms_ease-out]

        sm:p-8
      "
    >
      {/* Overlay */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-[#20324f]/90 via-[#162234]/85 to-[#09111d]/90" />

      {/* Border Dalam */}
      <div className="absolute inset-[10px] rounded-lg border border-[#d8b46a]/40" />

    
      

      {/* Close */}
      <button
        type="button"
        aria-label="Close member detail"
        onClick={onClose}
        className="
          absolute
          top-5
          right-5
          z-20

          flex
          h-10
          w-10

          items-center
          justify-center

          rounded-full

          border-2
          border-[#c49b52]

          bg-[#162235]

          text-[#e6c977]

          text-lg

          transition-all
          duration-200

          hover:scale-105
          hover:bg-[#22314c]
        "
      >
        ✕
      </button>

      {/* Header */}
      <div className="relative z-10 mb-6 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-[#d0b36a]">
          Civilization
        </p>

        <h1 className="mt-2 text-5xl font-bold tracking-[0.15em] text-[#f0d68c]">
          PROFILE
        </h1>

        <div className="mx-auto mt-3 h-[2px] w-40 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />
      </div>

      {/* Foto */}
      <div className="relative z-10 mb-5 overflow-hidden rounded-xl border-[3px] border-[#c49b52] shadow-[0_0_20px_rgba(212,175,55,0.15)]">
        <Image
  src={ProfileImage}
  alt="Profile Image"
  className="h-auto w-full object-contain"
/>
        
      </div>

      {/* Nama */}
      <div className="relative z-10 pr-10">
        <h2 className="text-3xl font-black uppercase tracking-wider text-[#f4dc97]">
          Barra Ahza Fakhrullah
        </h2>

        <p className="mt-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#d0b36a]">
          5027251023 - Bekasi
        </p>
      </div>

      {/* Sosmed */}
      <div className="relative z-10 mt-5 flex gap-2">
        <Instagram username="Bahzaf_" />
        <LinkedInButtonLink username="barrahza" />
      </div>

      {/* Hobi & Fun Fact */}
      <div className="relative z-10 mt-6 grid gap-4 text-sm font-semibold sm:grid-cols-2">
        <div className="rounded-xl border border-[#c49b52]/50 bg-[#111a28]/60 p-4 backdrop-blur-sm">
          <p className="text-xs uppercase tracking-[0.2em] text-[#d0b36a]">
            Hobi
          </p>
          <p className="mt-2">Ngegame</p>
        </div>

        <div className="rounded-xl border border-[#c49b52]/50 bg-[#111a28]/60 p-4 backdrop-blur-sm">
          <p className="text-xs uppercase tracking-[0.2em] text-[#d0b36a]">
            Fun Fact
          </p>
          <p className="mt-2">Takut angin</p>
        </div>
      </div>

      {/* Lagu */}
      <div className="relative z-10 mt-4 rounded-xl border border-[#c49b52]/50 bg-[#111a28]/60 p-4 backdrop-blur-sm">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#d0b36a]">
          Lagu Favorit
        </p>

        <p className="my-2 text-sm font-semibold">
          Not Strong Enough
        </p>

        <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/09DR0sHnQUhHOiSNttc1mv?si=2e7fb75e5fe94ef6" />
      </div>
    </div>
  </div>,
  document.body
)
}

export default MemberPopup
