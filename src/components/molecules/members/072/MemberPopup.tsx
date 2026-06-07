'use client'

import React, { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

import Image from 'next/image'
import Instagram from '@/components/atoms/button/InstagramButtonLink'
import LinkedInButtonLink from '@/components/atoms/button/LinkedInButtonLink'
import SpotifyEmbed from '@/components/molecules/SpotifyEmbed'

import ProfileImage from './image.jpg'
import BgImage from './bg-deepwoken.jpg'
import LogoImage from './deepwoken-logo.webp' // Tambahkan import logo di sini

type MemberPopupProps = {
  isOpen: boolean
  onClose: () => void
}

const MemberPopup = ({ isOpen, onClose }: MemberPopupProps) => {
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (!isOpen) return

    if (audioRef.current) {
      audioRef.current.volume = 0.1
      audioRef.current.play().catch(e => console.log("Menunggu interaksi user:", e))
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }
    }
  }, [isOpen, onClose])

  // FITUR BARU: Sinkronisasi BGM dengan Spotify
  useEffect(() => {
    const handleSpotifyMessage = (event: MessageEvent) => {
      if (event.origin !== 'https://open.spotify.com') return

      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data
        if (data?.type === 'playback_update') {
          const isPlaying = !data.payload?.isPaused
          if (isPlaying) {
            audioRef.current?.pause() // Stop BGM jika Spotify main
          } else {
            audioRef.current?.play().catch(() => { }) // Lanjut BGM jika Spotify pause
          }
        }
      } catch (err) { }
    }

    window.addEventListener('message', handleSpotifyMessage)
    return () => window.removeEventListener('message', handleSpotifyMessage)
  }, [])

  if (!isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto px-4">

      <audio ref={audioRef} src="/assets/sounds/bgm-deepwoken.mp3" loop />

      <div className="fixed inset-0 z-0">
        <Image
          src={BgImage}
          alt="Background"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      </div>

      {/* PADA BAGIAN INI KAMU BOLEH MENGUBAH STYLE SESUKA HATI KAMU, TAPI JANGAN UBAH STRUKTUR DAN FUNGSI DARI KODE INI AGAR FUNGSI POPUP TETAP BERJALAN DENGAN BAIK */}
      <button
        type="button"
        aria-label="Close member detail"
        onClick={onClose}
        className="absolute inset-0 z-0"
      />

      <div className="border-neutral-cs-10 bg-black relative z-10 max-h-[100dvh] w-full max-w-[720px] animate-[member-popup-show_200ms_ease-out] overflow-y-auto rounded-2xl border-2 p-6 text-white shadow-xl sm:p-8">
        <button
          type="button"
          aria-label="Close member detail"
          onClick={onClose}
          className="border-neutral-cs-10 hover:bg-neutral-cs-10/10 absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border text-xl leading-none"
        >
            x
          </button>

          {/* LOGO DITAMBAHKAN DI SINI */}
          <div className="mb-4 flex justify-center">
            <Image src={LogoImage} alt="Logo" width={100} height={100} className="object-contain" />
          </div>

          <div className="border-neutral-cs-10/40 mb-5 overflow-hidden rounded-2xl border">
            <Image src={ProfileImage} alt="Profile Image" className="h-120 w-full object-cover object-center" />
          </div>

          <div className="pr-10">
            <h2 className="text-2xl font-black">I Made Gyanendra Anand Wisnawa</h2>
            <p className="text-neutral-cs-10/70 mt-1 text-sm font-semibold">5027251072 - Bekasi</p>
          </div>

          <div className="mt-5 flex gap-2">
            <Instagram username="anananand.25" />
            <LinkedInButtonLink username="i-made-gyanendra-anand-wisnawa-445476379" />
          </div>

          <div className="mt-6 grid gap-4 text-sm font-semibold sm:grid-cols-2">
            <div className="border-neutral-cs-10/40 rounded-xl border p-4">
              <p className="text-neutral-cs-10/60 text-xs tracking-wide uppercase">Hobi</p>
              <p className="mt-2">Main game (Deadlock biasanya tapi bebas), dengerin musik (yang niche tapi)</p>
            </div>
            <div className="border-neutral-cs-10/40 rounded-xl border p-4">
              <p className="text-neutral-cs-10/60 text-xs tracking-wide uppercase">Fun Fact</p>
              <p className="mt-2">Suka dengerin lagu tapi gatau dan gabisa namain nama lagu Indonesia atau (mayoritas) lagu mainstream.</p>
            </div>
          </div>

          <div className="border-neutral-cs-10/40 mt-4 rounded-xl border p-4">
            <p className="text-neutral-cs-10/60 text-xs font-bold tracking-wide uppercase">Lagu Favorit</p>
            <p className="my-2 text-sm font-semibold">2010 Justin Bieber</p>
            <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/5WIGbrfNMvFeCQOx5XykBO?si=ec95649928674a93" />
            <p className="my-2 text-sm font-semibold">the light left my iris</p>
            <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/2GtgFDhXY3u39WKjUVVHWH?si=3a8d71ce6e724ec0" />
            <p className="my-2 text-sm font-semibold">Pray for...</p>
            <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/1ySxrjvgjDmV9gWTNRklpK?si=1db4f9f20ec5410f" />
            <p className="my-2 text-sm font-semibold">blue&black&purple</p>
            <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/5qg9lwPoJfAVVKSHPG0ASK?si=of9NbU2kRReqHe1Ou9MinQ" />
            <p className="my-2 text-sm font-semibold">Place (sumpah cumang ini doang yang normal)</p>
            <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/1Bg2CNZw6S4e9cGWPmi0uI?si=318d4fbc92a1424c" />
          </div>
      </div>
    </div>,
    document.body
  )
}

export default MemberPopup