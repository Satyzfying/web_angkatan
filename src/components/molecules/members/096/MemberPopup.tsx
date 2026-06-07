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
        className="absolute inset-0 bg-black/85 backdrop-blur-md"
      />

      <div className="border-zinc-700 bg-zinc-950 relative z-10 max-h-[calc(100vh-9rem)] w-full max-w-[720px] animate-[member-popup-show_200ms_ease-out] overflow-y-auto rounded-none border-4 p-6 text-zinc-100 shadow-[0_0_30px_rgba(0,0,0,0.8)] sm:max-h-[calc(100vh-10rem)] sm:p-8 font-mono">
        <button
          type="button"
          aria-label="Close member detail"
          onClick={onClose}
          className="border-zinc-700 hover:bg-zinc-800 absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-none border-2 text-xl font-bold leading-none"
        >
          ✕
        </button>

        <div className="border-zinc-700 mb-6 overflow-hidden rounded-none border-2 grayscale hover:grayscale-0 transition-all duration-500">
          <Image src={ProfileImage} alt="Profile Image" className="h-[480px] w-full object-cover object-center" />
        </div>

        <div className="pr-10">
          {/* UBAH NAMA ANDA */}
          <h2 className="text-3xl font-extrabold tracking-tighter uppercase text-zinc-100">Afriezal Suryapraba L</h2>
          {/* UBAH NRP DAN ASAL */}
          <p className="text-zinc-400 mt-1 text-xs font-bold tracking-widest uppercase">5027251096 - Surabaya</p>
        </div>

        <div className="mt-5 flex gap-2">
          {/* UBAH USERNAME INSTAGRAM */}
          <Instagram username="zalaiasach.1604" />
          {/* UBAH USERNAME LINKEDIN */}
          <LinkedInButtonLink username="afriezal-suryapraba-laiasach" />
        </div>

        <div className="mt-6 grid gap-4 text-sm font-semibold sm:grid-cols-2">
          <div className="border-zinc-800 bg-zinc-900/50 rounded-none border-2 p-4">
            {/* UBAH HOBI KAMU */}
            <p className="text-amber-500 text-xs tracking-widest font-black uppercase">SIDE A: HOBBIES & PREFERENCE</p>
            <p className="mt-2 text-zinc-300 leading-relaxed text-xs font-normal">Main Game(Mostly JRPG, tapi suka genre lain), Baca Buku(Mostly novel dan komik), Ndengerin musik(Especialy Rock or alt rock), Ngerakit model kit(kalo ada duit dan waktu)</p>
          </div>
          <div className="border-zinc-800 bg-zinc-900/50 rounded-none border-2 p-4">
            {/* UBAH FUNFACT KAMU */}
            <p className="text-amber-500 text-xs tracking-widest font-black uppercase">SIDE B: FUN FACT</p>
            <p className="mt-2 text-zinc-300 leading-relaxed text-xs font-normal">Jangan tanya aku game favorit ku apa kalo nggak mau mendengar aku yapping 10 jam</p>
          </div>
        </div>

        <div className="border-zinc-800 bg-zinc-900/30 mt-4 rounded-none border-2 p-4">
          {/* UBAH LAGU FAVORIT KAMU */}
          <p className="text-amber-500 text-xs font-black tracking-widest uppercase">Song of the Day and Beyond</p>
          <p className="my-2 text-lg font-black tracking-tight text-zinc-100 italic">"Wish You Were Here" by Pink Floyd</p>

          {/* UBAH URL SPOTIFY KAMU DENGAN LAGU FAVORIT MU */}
          <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/6mFkJmJqdDVQ1REhVfGgd1?si=3c35d8c069c94247" />
        </div>
      </div>
    </div>,
    document.body
  )
}

export default MemberPopup
