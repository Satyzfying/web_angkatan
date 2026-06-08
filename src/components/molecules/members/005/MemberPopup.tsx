'use client'

import React, { useEffect, useRef, useState } from 'react'

import Image from 'next/image'

import { createPortal } from 'react-dom'

import Instagram from '@/components/atoms/button/InstagramButtonLink'
import LinkedInButtonLink from '@/components/atoms/button/LinkedInButtonLink'
import SpotifyEmbed from '@/components/molecules/SpotifyEmbed'

import ProfileImage from './image.jpeg'

const backgroundVideoSrc = new URL('./supernatural.mp4', import.meta.url).href
const backgroundAudioSrc = new URL('./supernatural.mp3', import.meta.url).href

type MemberPopupProps = {
  isOpen: boolean
  onClose: () => void
}

const MemberPopup = ({ isOpen, onClose }: MemberPopupProps) => {
  const audioRef = useRef<HTMLAudioElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    const video = videoRef.current
    if (!audio) return

    audio.volume = 0.2

    if (!isOpen) {
      audio.pause()
      audio.currentTime = 0
      if (video) {
        video.pause()
        video.currentTime = 0
      }
      return
    }

    audio.currentTime = 0
    if (video) video.currentTime = 0

    audio.play().catch(() => { })
    if (video) video.play().catch(() => { })
  }, [isOpen])

  const toggleAudio = () => {
    const audio = audioRef.current
    const video = videoRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
      if (video) video.pause()
      setIsPlaying(false)
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(() => { })
      if (video) video.play().catch(() => { })
    }
  }

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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="h-full w-full object-cover object-[15%_center] sm:object-center"
        >
          <source src={backgroundVideoSrc} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <button
        type="button"
        aria-label="Close member detail"
        onClick={onClose}
        className="fixed inset-0 z-0"
      />

      <div className="relative z-10 w-full max-w-3xl animate-[member-popup-show_300ms_ease-out]">
        <audio
          ref={audioRef}
          src={backgroundAudioSrc}
          loop
          preload="auto"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />

        <div className="relative flex max-h-[85dvh] flex-col overflow-y-auto overflow-x-hidden rounded-2xl border border-sky-400/20 bg-[#050f14]/90 shadow-[0_0_40px_rgba(56,189,248,0.1)] sm:max-h-none sm:flex-row sm:overflow-hidden">

          <div className="absolute top-4 right-4 z-20 flex items-center gap-3">
            <button
              type="button"
              onClick={toggleAudio}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-xs text-white transition-colors hover:bg-white/20"
            >
              {isPlaying ? '🔊' : '🔇'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-sm text-white transition-colors hover:bg-white/20"
            >
              ✕
            </button>
          </div>

          <div className="relative flex w-full flex-col justify-center p-5 pb-0 sm:w-2/5 sm:p-8 sm:pr-0">
            <div className="relative h-64 w-full overflow-hidden rounded-2xl shadow-2xl ring-1 ring-sky-400/30 sm:h-full sm:min-h-[20rem]">
              <Image
                src={ProfileImage}
                alt="Profile Image"
                className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 hover:scale-105"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
          </div>

          <div className="flex flex-1 flex-col p-5 sm:p-8">
            <div className="mb-6">
              <h2 className="text-3xl font-semibold tracking-tight text-sky-50">Umar</h2>
              <p className="mt-1 text-sm font-medium text-sky-200/80">5027251005 • Semarang</p>
            </div>

            <div className="mb-6 flex gap-3">
              <div className="rounded-full bg-sky-400/10 p-2 transition-colors hover:bg-sky-400/20 [&_a]:!text-sky-200 hover:[&_a]:!text-white">
                <Instagram username="umarbaharun" />
              </div>
              <div className="rounded-full bg-sky-400/10 p-2 transition-colors hover:bg-sky-400/20 [&_a]:!text-sky-200 hover:[&_a]:!text-white">
                <LinkedInButtonLink username="umarhyl" />
              </div>
            </div>

            <div className="mb-6 grid gap-6 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-sky-400">Hobi</p>
                <p className="mt-1 text-sm text-sky-100">Masak & Membaca</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-sky-400">Fun Fact</p>
                <p className="mt-1 text-sm text-sky-100">Fans JKT48</p>
              </div>
            </div>

            <div className="mt-auto">
              <p className="mb-3 text-xs font-medium uppercase tracking-wider text-sky-400">Lagu Favorit</p>
              <div className="rounded-xl ring-1 ring-sky-400/20">
                <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/142PiXzA84lmEw2RstFHFa?si=9a02a710ab7c4655" />
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
