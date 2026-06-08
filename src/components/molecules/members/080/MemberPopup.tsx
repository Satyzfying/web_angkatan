'use client'

import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'

import Image from 'next/image'

import Instagram from '@/components/atoms/button/InstagramButtonLink'
import LinkedInButtonLink from '@/components/atoms/button/LinkedInButtonLink'
import SpotifyEmbed from '@/components/molecules/SpotifyEmbed'

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
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
      />

      <div className="
relative z-10
max-h-screen
w-full max-w-[720px]
overflow-y-auto
rounded-3xl
border
border-red-900/40
bg-gradient-to-br
from-black/90
via-[#120000]/80
to-black/90
backdrop-blur-xl
p-6
text-white
animate-[member-popup-show_200ms_ease-out]
shadow-[0_0_30px_rgba(255,0,0,0.15),0_0_80px_rgba(120,0,0,0.08)]
sm:p-8
">
        <button
          type="button"
          aria-label="Close member detail"
          onClick={onClose}
          className="
absolute top-4 right-4
flex h-10 w-10 items-center justify-center
rounded-full
border border-red-900/50
bg-black/30
text-red-200
backdrop-blur-md
hover:bg-red-950/40
hover:border-red-700
transition-all
"
        >
          x
        </button>

        <div
          className="
  mb-5
  overflow-hidden
  rounded-2xl
  border
  border-red-900/40
"
        >
          <Image src={ProfileImage} alt="Profile Image" className="
h-120
w-full
object-cover
object-center
brightness-90
contrast-110
saturate-125
sepia-[0.15]
" />
        </div>

        <div className="pr-10">
          {/* UBAH NAMA ANDA */}
          <h2 className="text-3xl font-black tracking-tight text-white">Reyhan Adi Satrio</h2>
          {/* UBAH NRP DAN ASAL */}
          <p className="mt-1 text-sm font-semibold text-red-300">5027251080 - Sidoarjo</p>
        </div>

        <div className="mt-5 flex gap-2">
          {/* UBAH USERNAME INSTAGRAM */}
          <Instagram username="reyhanadss" />
          {/* UBAH USERNAME LINKEDIN */}
          <LinkedInButtonLink username="reyhan-adi-6ba653379" />
        </div>

        <div className="mt-6 grid gap-4 text-sm font-semibold sm:grid-cols-2">
          <div className="
rounded-2xl
border
border-red-900/30
bg-white/5
backdrop-blur-md
p-4
transition-all
hover:border-red-700/50
">
            {/* UBAH HOBI KAMU */}
            <p className="
text-red-400
text-xs
font-bold
tracking-[0.2em]
uppercase
">Hobi</p>
            <p className="mt-2">Books, Bikes, & Music</p>
          </div>
          <div
            className="
  rounded-2xl
  border
  border-red-900/30
  bg-white/5
  backdrop-blur-md
  p-4
  transition-all
  hover:border-red-700/50
"
          >
            {/* UBAH FUNFACT KAMU */}
            <p className="
text-red-400
text-xs
font-bold
tracking-[0.2em]
uppercase
">Fun Fact</p>
            <p className="mt-2">My motorcycle is my biggest opp.</p>
          </div>
        </div>

        <div className="
mt-4
rounded-2xl
border
border-red-900/30
bg-white/5
backdrop-blur-md
p-4
">
          {/* UBAH LAGU FAVORIT KAMU */}
          <p
            className="
  text-red-400
  text-xs
  font-bold
  tracking-[0.2em]
  uppercase
"
          >Lagu Favorit</p>
          <p className="my-2 text-sm font-semibold">Alexandra - Reality Club</p>

          {/* UBAH URL SPOTIFY KAMU DENGAN LAGU FAVORIT MU */}
          <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/6ZGgaShxOimGDfRz1T1zje?si=55d5cabe9faa49c0" />
        </div>
      </div>
    </div>,
    document.body
  )
}

export default MemberPopup
