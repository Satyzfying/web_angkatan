'use client'

import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'

import Image from 'next/image'

import Instagram from '@/components/atoms/button/InstagramButtonLink'
import LinkedInButtonLink from '@/components/atoms/button/LinkedInButtonLink'
import SpotifyEmbed from '@/components/molecules/SpotifyEmbed'

import ProfileImage from './image.jpeg'

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
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto px-4 font-serif">
      {/* Backdrop: Misty/Cloud-like blur for a soft feel */}
      <button
        type="button"
        aria-label="Close member detail"
        onClick={onClose}
        className="absolute inset-0 bg-slate-200/40 backdrop-blur-xl"
      />

      {/* Main Content Box: Inspired by the light aesthetic and rounded panels of image_0.png */}
      <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto px-4 font-serif">
      {/* Backdrop: Dibuat gelap transparan dengan blur agar menyatu dengan tema dark */}
      <button
        type="button"
        aria-label="Close member detail"
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
      />

      {/* Main Content Box: Menggunakan warna dasar Deep Midnight Navy sesuai gambar Spotify */}
      <div 
        className="relative z-10 max-h-[90dvh] w-full max-w-[550px] animate-[member-popup-show_250ms_ease-out] overflow-y-auto rounded-[2.5rem] p-6 text-slate-200 shadow-[0_20px_50px_rgba(13,34,58,0.5)] border border-slate-800 bg-[#0d223a] sm:p-8"
      >
        {/* Tombol Close Silang yang minimalis */}
        <button
          type="button"
          aria-label="Close member detail"
          onClick={onClose}
          className="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full text-lg leading-none text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all border border-slate-700/50"
        > </button>
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto px-4 font-serif">
      </div>
      {/* Backdrop: Dibuat gelap transparan dengan blur agar menyatu dengan tema dark */}
      <button
        type="button"
        aria-label="Close member detail"
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
      />

      {/* Main Content Box: Menggunakan warna dasar Deep Midnight Navy sesuai gambar Spotify */}
      <div 
        className="relative z-10 max-h-[90dvh] w-full max-w-[550px] animate-[member-popup-show_250ms_ease-out] overflow-y-auto rounded-[2.5rem] p-6 text-slate-200 shadow-[0_20px_50px_rgba(13,34,58,0.5)] border border-slate-800 bg-[#0d223a] sm:p-8"
      >
      </div>
        {/* Tombol Close Silang yang minimalis */}
        <button
          type="button"
          aria-label="Close member detail"
          onClick={onClose}
          className="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full text-lg leading-none text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all border border-slate-700/50"
        > </button>
          <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto px-4 font-serif">
      </div>
      {/* Backdrop: Dibuat gelap transparan dengan blur agar menyatu dengan tema dark */}
      <button
        type="button"
        aria-label="Close member detail"
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
      />

      {/* Main Content Box: Menggunakan warna dasar Deep Midnight Navy sesuai gambar Spotify */}
      <div 
        className="relative z-10 max-h-[90dvh] w-full max-w-[550px] animate-[member-popup-show_250ms_ease-out] overflow-y-auto rounded-[2.5rem] p-6 text-slate-200 shadow-[0_20px_50px_rgba(13,34,58,0.5)] border border-slate-800 bg-[#0d223a] sm:p-8"
      > </div>
        {/* Tombol Close Silang yang minimalis */}
        <button
          type="button"
          aria-label="Close member detail"
          onClick={onClose}
          className="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full text-lg leading-none text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all border border-slate-700/50"
        > </button>
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto px-4 font-serif">
      {/* Backdrop: Dibuat gelap transparan dengan blur agar menyatu dengan tema dark */}
      <button
        type="button"
        aria-label="Close member detail"
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
      />

      {/* Main Content Box: Menggunakan warna dasar Deep Midnight Navy sesuai gambar Spotify */}
      <div 
        className="relative z-10 max-h-[90dvh] w-full max-w-[550px] animate-[member-popup-show_250ms_ease-out] overflow-y-auto rounded-[2.5rem] p-6 text-slate-200 shadow-[0_20px_50px_rgba(13,34,58,0.5)] border border-slate-800 bg-[#0d223a] sm:p-8"
      >
        {/* Tombol Close Silang yang minimalis */}
        <button
          type="button"
          aria-label="Close member detail"
          onClick={onClose}
          className="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full text-lg leading-none text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all border border-slate-700/50"
        > </button>

        {/* Profile Image with 'cloud-like' / soft organic shape and white frame */}
        <div className="mb-6 overflow-hidden rounded-[3rem] border-4 border-white shadow-md mx-auto w-32 h-32 bg-white/50">
          <Image src={ProfileImage} alt="Profile Image" className="h-full w-full object-cover object-center mix-blend-normal" />
        </div>

        {/* Profile Information Section */}
        <div className="text-center">
          {/* UBAH NAMA ANDA - Apply Gothic/Fairytale system font style for the name */}
          <h2 className="text-3xl font-black font-serif tracking-tight text-white">Syarifah Nailatur Rohma</h2>
          {/* UBAH NRP DAN ASAL - Keep other text soft and medium weight */}
          <p className="text-zinc-400/80 mt-1 text-xs font-medium tracking-wide">.5027251109 • Tangerang Selatan</p>
        </div>

        {/* Social Icons Section */}
        <div className="mt-5 flex gap-3 justify-center">
          {/* UBAH USERNAME INSTAGRAM */}
          <div className="hover:opacity-80 transition-opacity">
            <Instagram username="fa3lyn3" />
          </div>
          {/* UBAH USERNAME LINKEDIN */}
          <div className="hover:opacity-80 transition-opacity">
            <LinkedInButtonLink username="syarifah-nailatur-rohma-10a641379" />
          </div>
        </div>

        {/* Grid Sections: Clean white panels with subtle borders and shadows like image_0.png */}
        <div className="mt-6 grid gap-4 text-xs font-medium sm:grid-cols-2">
          
          {/* Kotak Hobi */}
          <div className="bg-white rounded-2xl border border-zinc-100 p-5 shadow-sm">
            {/* UBAH HOBI KAMU */}
            <p className="text-zinc-400 text-[10px] tracking-wider uppercase font-bold">Hobi</p>
            <p className="mt-1 text-zinc-600">Membaca, Menulis, Melukis, Panahan</p>
          </div>

          {/* Kotak Fun Fact */}
          <div className="bg-white rounded-2xl border border-zinc-100 p-5 shadow-sm">
            {/* UBAH FUNFACT KAMU */}
            <p className="text-zinc-400 text-[10px] tracking-wider uppercase font-bold">Fun Fact</p>
            <p className="mt-1 text-zinc-600">Aku pelihara ikan di kosan</p>
          </div>
        </div>

        {/* Kotak Lagu Favorit */}
        <div className="bg-white mt-4 rounded-2xl border border-zinc-100 p-5 shadow-sm">
          {/* UBAH LAGU FAVORIT KAMU */}
          <p className="text-zinc-400 text-[10px] font-bold tracking-wider uppercase">Lagu Favorit</p>
          <p className="my-1 text-sm font-semibold text-zinc-700">Goddess by Laufey</p>

          {/* UBAH URL SPOTIFY KAMU DENGAN LAGU FAVORIT MU */}
          <div className="mt-2 rounded-xl overflow-hidden border border-zinc-200/50">
            <SpotifyEmbed spotifyUrl="https://open.spotify.com/intl-id/track/4R3AU2pjv8ge2siX1fVbZs?si=044d6ee8a968437c" />
          </div>
          </div>
          </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default MemberPopup
