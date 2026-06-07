'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Instagram from '@/components/atoms/button/InstagramButtonLink'
import LinkedInButtonLink from '@/components/atoms/button/LinkedInButtonLink'
import SpotifyEmbed from '@/components/molecules/SpotifyEmbed'

import ProfileImage from './image.jpg'

type MemberPopupProps = {
  isOpen: boolean
  onClose: () => void
}

const MemberPopup = ({ isOpen, onClose }: MemberPopupProps) => {
  const [showVideo, setShowVideo] = useState(true)

  useEffect(() => {
    if (!isOpen) return

    setShowVideo(true)

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  // INTRO VIDEO - aspect ratio 16:9, mulai dari menit ke-1 (detik 60)
  if (showVideo) {
    return (
      <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black/90 p-4">
        {/* Container video */}
        <div className="relative w-full max-w-[720px]">
          {/* Tombol X */}
          <button
            type="button"
            onClick={onClose}
            className="absolute -top-3 -right-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-xl font-bold text-black shadow-lg hover:bg-white transition-colors"
            aria-label="Tutup"
          >
            ✕
          </button>

          {/* Video dengan aspect ratio 16:9, mulai start=60 */}
          <div className="relative aspect-video w-full overflow-hidden rounded-xl border-4 border-white shadow-2xl pointer-events-none">
            <iframe
              className="absolute inset-0 h-full w-full"
              src="https://www.youtube.com/embed/mlG7Yh-Le5g?autoplay=1&mute=0&controls=0&disablekb=1&rel=0&playsinline=1&loop=1&playlist=mlG7Yh-Le5g&modestbranding=1&iv_load_policy=3&showinfo=0&fs=0&start=60"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        </div>

        {/* Tombol navigasi */}
        <div className="mt-6 flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={() => setShowVideo(false)}
            className="w-40 rounded-full bg-white px-6 py-3 font-semibold text-black shadow-lg transition-colors hover:bg-gray-200"
          >
            Lihat Profil →
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-40 rounded-full border border-white bg-transparent px-6 py-2 font-medium text-white transition-colors hover:bg-white/10"
          >
            Tutup
          </button>
        </div>
        <p className="pointer-events-none mt-3 text-xs text-white/50">Tekan ESC untuk menutup</p>
      </div>
    )
  }

  // ==============================================
  // KODE POPUP ASLI - TIDAK ADA PERUBAHAN
  // ==============================================
  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto px-4 pt-28 pb-8 sm:pt-32">
      <div className="absolute inset-0 overflow-hidden">
        <iframe
          className="absolute top-0 left-0 h-full w-full object-cover"
          src="https://www.youtube.com/embed/URRimPZBHf8?autoplay=1&mute=1&loop=1&playlist=URRimPZBHf8&controls=0&disablekb=1&modestbranding=1&rel=0&showinfo=0&playsinline=1&start=60"
          title="YouTube background player"
          allow="autoplay; encrypted-media"
          allowFullScreen
          style={{ pointerEvents: 'none' }}
        />
      </div>

      <div
        className="absolute inset-0 bg-[#285b75]/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 max-h-[calc(100vh-9rem)] w-full max-w-[720px] animate-[member-popup-show_200ms_ease-out] overflow-y-auto rounded-3xl bg-white p-6 text-slate-800 shadow-2xl border-t-[12px] border-[#285b75] sm:max-h-[calc(100vh-10rem)] sm:p-8">
        <div className="absolute top-2 left-1/2 h-2 w-16 -translate-x-1/2 rounded-full bg-gray-200"></div>

        <button
          type="button"
          aria-label="Close member detail"
          onClick={onClose}
          className="bg-gray-100 hover:bg-gray-200 absolute top-5 right-5 flex h-10 w-10 items-center justify-center rounded-full text-xl text-gray-500 transition-all"
        >
          ✕
        </button>

        <div className="border-gray-200 mt-4 mb-6 overflow-hidden rounded-2xl border shadow-sm">
          <Image src={ProfileImage} alt="Profile Image" className="h-80 w-full object-cover object-center sm:h-120" />
        </div>

        <div className="pr-10">
          <h2 className="text-3xl font-black tracking-tight text-[#285b75]">
            Muhammad Faturrahman
          </h2>
          <p className="text-[#659bb6] mt-1 text-sm font-bold tracking-widest uppercase">
            5027251065 — Luwu Utara
          </p>
        </div>

        <div className="mt-6 flex justify-center sm:justify-start">
          <div className="flex gap-4 bg-[#285b75] px-4 py-2 rounded-xl shadow-md">
            <Instagram username="faturra._" />
            <LinkedInButtonLink username="mfaturrahman668" />
          </div>
        </div>

        <div className="mt-8 grid gap-4 text-sm sm:grid-cols-2">
          <div className="bg-[#f2f8fb] border-[#a6d1e6]/50 rounded-2xl border p-5 transition-all hover:bg-[#e6f1f7]">
            <p className="text-[#285b75] text-[10px] font-bold tracking-[0.2em] uppercase mb-2">Hobi & Interest</p>
            <p className="text-slate-700 leading-relaxed text-sm">
              Merenung, Menulis, Membaca, dan nonton drakor (
              <a href="https://www.tiktok.com/@misty.bud/video/7505692513655704838" target="_blank" rel="noopener noreferrer" className="text-[#285b75] font-bold hover:underline">Daily Dose of Sunshine</a>,{' '}
              <a href="https://www.tiktok.com/@bubuumood_/video/7629723892139052308" target="_blank" rel="noopener noreferrer" className="text-[#285b75] font-bold hover:underline">Resident Playbook</a>,{' '}
              <a href="https://www.tiktok.com/@mintchocod/video/7505341181287484680" target="_blank" rel="noopener noreferrer" className="text-[#285b75] font-bold hover:underline">Hospital Playlist</a>, dan{' '}
              <a href="https://www.tiktok.com/@userezhnqmrskd/video/7637065533409496341" target="_blank" rel="noopener noreferrer" className="text-[#285b75] font-bold hover:underline">Our Unwritten Seoul</a>).
            </p>
          </div>

          <div className="bg-[#f2f8fb] border-[#a6d1e6]/50 rounded-2xl border p-5 transition-all hover:bg-[#e6f1f7]">
            <p className="text-[#285b75] text-[10px] font-bold tracking-[0.2em] uppercase mb-2">Fun Fact</p>
            <p className="mt-2 text-slate-700 leading-relaxed font-medium">
              Dapat julukan penghuni perpus padahal jarang masuk perpus.
            </p>
          </div>
        </div>

        <div className="bg-[#f2f8fb] border-[#a6d1e6]/50 mt-4 rounded-2xl border p-5 transition-all hover:bg-[#e6f1f7]">
          <p className="text-[#285b75] text-[10px] font-bold tracking-[0.2em] uppercase mb-4">Original Soundtrack</p>
          <div className="mb-4">
            <p className="text-lg font-bold text-slate-800">A Race</p>
            <p className="text-xs font-semibold text-[#659bb6]">Favorite Track</p>
          </div>
          <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/2XIxIDXxuE9d97TqjQPwQy" />
        </div>
      </div>
    </div>
  )
}

export default MemberPopup