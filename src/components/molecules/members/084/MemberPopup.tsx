'use client'

import React, { useEffect } from 'react'

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

  return (
    // BAGIAN BAWAH INI SUDAH DISESUAIKAN DENGAN TEMA "FOOTBALL GAME"
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto px-4 pt-28 pb-8 sm:pt-32">
      {/* OVERLAY: Gelap dengan efek blur yang lebih kuat layaknya fokus ke kartu pemain */}
      <button
        type="button"
        aria-label="Close member detail"
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/80 backdrop-blur-md transition-opacity"
      />

      {/* POPUP CONTAINER: Background gradien hijau lapangan, border emas, dan efek glow */}
      <div className="relative z-10 max-h-[calc(100vh-9rem)] w-full max-w-[720px] animate-[member-popup-show_200ms_ease-out] overflow-y-auto rounded-2xl border-4 border-yellow-500/80 bg-gradient-to-br from-emerald-800 via-green-700 to-emerald-900 p-6 text-white shadow-[0_0_40px_rgba(234,179,8,0.25)] sm:max-h-[calc(100vh-10rem)] sm:p-8">
        
        {/* CLOSE BUTTON: Tombol silang dengan efek hover mencolok layaknya UI Game */}
        <button
          type="button"
          aria-label="Close member detail"
          onClick={onClose}
          className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white/50 bg-black/30 text-xl font-bold leading-none text-white backdrop-blur-sm transition-all hover:scale-110 hover:bg-red-500 hover:border-red-500 shadow-md"
        >
          x
        </button>

        {/* IMAGE CONTAINER: Diberi border emas tebal dan shadow menonjol */}
        <div className="mb-5 overflow-hidden rounded-2xl border-4 border-yellow-500/60 shadow-lg shadow-black/50 bg-black/20">
          <Image src={ProfileImage} alt="Profile Image" className="h-120 w-full object-cover object-center" />
        </div>

        <div className="pr-10">
          {/* NAMA: Menggunakan gradien teks warna emas agar terlihat seperti pemain bintang */}
          <h2 className="text-3xl font-black uppercase tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-600 drop-shadow-sm">
            Muhammad Nadhif Pasya Ikhsan
          </h2>
          {/* NRP & ASAL */}
          <p className="mt-2 text-sm font-bold text-white/90 drop-shadow-md">
            5027251084 - Pekanbaru
          </p>
        </div>

        <div className="mt-5 flex gap-2">
          {/* SOCIAL BUTTONS WRAPPER (Tombolnya sendiri diatur di komponennya, tapi gap tetap ada) */}
          <Instagram username="nadhifpasya_" />
          <LinkedInButtonLink username="muhammad-nadhif-pasya-ikhsan-0216b0379" />
        </div>

        {/* GRID KOTAK INFO: Efek kartu statistik pemain sepak bola dengan background transparan gelap */}
        <div className="mt-6 grid gap-4 text-sm font-semibold sm:grid-cols-2">
          <div className="group rounded-xl border-2 border-white/20 bg-black/30 p-4 shadow-inner shadow-black/40 backdrop-blur-md transition-all hover:border-yellow-400/60 hover:bg-black/40">
            <p className="text-xs font-bold tracking-widest text-yellow-400 uppercase drop-shadow-md group-hover:text-yellow-300">
              Hobi
            </p>
            <p className="mt-2 text-base text-white/95">Main game</p>
          </div>
          <div className="group rounded-xl border-2 border-white/20 bg-black/30 p-4 shadow-inner shadow-black/40 backdrop-blur-md transition-all hover:border-yellow-400/60 hover:bg-black/40">
            <p className="text-xs font-bold tracking-widest text-yellow-400 uppercase drop-shadow-md group-hover:text-yellow-300">
              Fun Fact
            </p>
            <p className="mt-2 text-base text-white/95">Asal pekanbaru tapi SMA naturalisasi malang</p>
          </div>
        </div>

        {/* KOTAK SPOTIFY: Dibuat senada dengan kotak info statistik di atas */}
        <div className="mt-4 rounded-xl border-2 border-white/20 bg-black/30 p-4 shadow-inner shadow-black/40 backdrop-blur-md transition-all hover:border-yellow-400/60">
          <p className="text-xs font-bold tracking-widest text-yellow-400 uppercase drop-shadow-md">
            Lagu Favorit
          </p>
          <p className="my-2 text-base font-bold text-white/95">
            Dancing In September
          </p>

          <SpotifyEmbed spotifyUrl="https://open.spotify.com/intl-id/track/3PExB0N7a56JkDdFGZ6PV8?si=cdd30bb5b62944d9" />
        </div>
      </div>
    </div>
  )
}

export default MemberPopup