'use client'

import React, { useEffect, useState, useRef } from 'react'
import { createPortal } from 'react-dom'

import Image from 'next/image'

import Instagram from '@/components/atoms/button/InstagramButtonLink'
import LinkedInButtonLink from '@/components/atoms/button/LinkedInButtonLink'
import SpotifyEmbed from '@/components/molecules/SpotifyEmbed'

import ProfileImage from './z.jpeg'
import { read } from 'fs'
import { setUncaughtExceptionCaptureCallback } from 'process'

type MemberPopupProps = {
  isOpen: boolean
  onClose: () => void
}

const MemberPopup = ({ isOpen, onClose }: MemberPopupProps) => {
  const [showOverlay, setShowOverlay] = useState(true)
  const [showCard, setShowCard] = useState(false)
  const [ready, setReady] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [showQuote, setShowQuote] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)


  useEffect(() => {
    audioRef.current = new Audio('/assets/sounds/members/062/ena5.mp3')

    audioRef.current.loop = true
    audioRef.current.volume = 0.35

    return () => {
      audioRef.current?.pause()
    }
  }, [])

  useEffect(() => {
    if (!isOpen) {
      setReady(false)
      return
    }

    requestAnimationFrame(() => {
      setReady(true)
    })
  }, [isOpen])


  useEffect(() => {
    if (isOpen) return

    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }, [isOpen])

useEffect(() => {
  if (!isOpen) return

  setShowOverlay(true)
  setShowCard(false)
  setShowQuote(false)

  const quoteFade = setTimeout(() => {
    setShowQuote(true)
  }, 1000);

  const startMusic = setTimeout(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.volume = isMuted ? 0 : 0.35
      audioRef.current.play().catch(() => {})
    }
  }, 2000)

  const revealVideo = setTimeout(() => {
    setShowOverlay(false)
  }, 3000)

  const revealCard = setTimeout(() => {
    setShowCard(true)
  }, 3000)

  return () => {
    clearTimeout(revealVideo)
    clearTimeout(revealCard)
    clearTimeout(quoteFade)
  }
}, [isOpen])

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
  const toggleMute = () => {
    if (!audioRef.current) return

    if (isMuted) {
      audioRef.current.volume = 0.35
    } else {
      audioRef.current.volume = 0
    }

    setIsMuted(!isMuted)
  }

  if (!isOpen || !ready) {
    return null
  }

  return createPortal(
    // PADA BAGIAN INI KAMU BOLEH MENGUBAH STYLE SESUKA HATI KAMU, TAPI JANGAN UBAH STRUKTUR DAN FUNGSI DARI KODE INI AGAR FUNGSI POPUP TETAP BERJALAN DENGAN BAIK
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto px-4">
      <video
        ref={videoRef}
        muted
        autoPlay
        loop
        preload='auto'
        playsInline
        className="absolute inset-0 h-full w-full object-cover brightness-50"
      >
        <source src="/assets/videos/members/062/mzk.mp4" type="video/mp4" />
      </video>

      <div
        className={`
          absolute inset-0
          transition-opacity
          duration-[1000ms]
          pointer-events-none

          flex flex-col
          items-center
          justify-center
          text-center

          ${showOverlay ? 'opacity-100' : 'opacity-0'}
        `}
        style={{
          background: `
            radial-gradient(
              circle at center,
              #ffd7a8 0%,
              #ffb36b 45%,
              #d97745 100%
            )
          `
        }}
      >
          <p
            className={`
              text-4xl
              font-bold
              text-white
              drop-shadow-lg
              transition-opacity
              duration-[200ms]
              ${showQuote ? 'opacity-100' : 'opacity-0'}
            `}
          >
          With Your Miracle
          <br />
          and
          <br/>
          My Luck
        </p>
      </div>
      <button
        type="button"
        aria-label="Close member detail"
        onClick={onClose}
        className="absolute inset-0 bg-black/6"
      />


      {showCard && (
        <div
          className="
            border-purple-300/20
            bg-[#1e1e2e]/40 backdrop-blur-xl border-[#cba6f7]/20
            relative z-10
            max-h-[100dvh]
            w-full
            max-w-[720px]
            overflow-y-auto
            rounded-2xl
            border-2
            p-6
            text-white
            shadow-xl
            sm:p-8

            animate-[member-popup-show_800ms_ease-out]
          "
        >
        <button
          type="button"
          aria-label="Close member detail"
          onClick={onClose}
          className="border-neutral-cs-10 hover:bg-neutral-cs-10/10 absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border text-xl leading-none"
        >
          x
        </button>

        <div className="border-neutral-cs-10/40 mb-5 overflow-hidden rounded-2xl border">
          <Image src={ProfileImage} alt="Profile Image" className="h-120 w-full object-cover object-center" />
        </div>

        <div className="flex items-start justify-between gap-4 pr-10">
          <div>
            <h2 className="text-2xl font-black text-[#cba6f7] drop-shadow-[0_0_12px_rgba(203,166,247,0.4)]">
              Izzat Ilham Wahyudi
            </h2>

            <p className="mt-1 text-sm font-semibold text-[#cdd6f4]/70">
              5027251062 - Denpasar
            </p>
          </div>

          <button
            type="button"
            onClick={toggleMute}
            className="
              flex items-center gap-2

              rounded-xl
              border
              border-[#cba6f7]/20

              bg-[#181825]/60
              px-3
              py-2

              text-[#cba6f7]
              text-sm
              font-semibold

              shadow-[0_0_15px_rgba(203,166,247,0.15)]

              hover:bg-[#cba6f7]/10
              transition-all
            "
          >
            {isMuted ? '🔇 Muted' : '🎵 BGM'}
          </button>
        </div>

        <div className="mt-5 flex gap-2">
          {/* UBAH USERNAME INSTAGRAM */}
          <Instagram username="zee33e" />
          {/* UBAH USERNAME LINKEDIN */}
          <LinkedInButtonLink username="izzat-ilham-wahyudi-163644379" />
        </div>

        <div className="mt-6 grid gap-4 text-sm font-semibold sm:grid-cols-2">
        <div
          className="
            rounded-xl
            border
            border-[#cba6f7]/15
            bg-[#181825]/40
            p-4
          "
        >
            {/* UBAH HOBI KAMU */}
            <p className="text-[#cba6f7] text-xs tracking-wide uppercase">Hobi</p>
            <p className="mt-2">1. Storywriting<br/>2. Video Games<br/>3. Drawing<br/> 4. Philosophies</p>
          </div>
          <div
            className="
              rounded-xl
              border
              border-[#cba6f7]/15
              bg-[#181825]/40
              p-4
            "
          >
            {/* UBAH FUNFACT KAMU */}
            <p className="text-[#cba6f7] text-xs tracking-wide uppercase">Fun Fact</p>
            <p className="mt-2">1. Literally Mizuki Akiyama<br/>2. Score UTBK paling tinggi di angkatan tapi modal gambling<br/>3. More fluent in English than Indonesian</p>
          </div>
        </div>

          <div
            className="
              mt-4
              rounded-xl
              border
              border-[#cba6f7]/15
              bg-[#181825]/40
              p-4
            "
          >
          {/* UBAH LAGU FAVORIT KAMU */}
          <p className="text-[#cba6f7] text-xs font-bold tracking-wide uppercase">Lagu Favorit</p>
          <p className="my-2 text-sm font-semibold">IDSMILE</p>
          <p className="mt-1 text-sm font-semibold text-[#cdd6f4]/70">25-ji, Nightcord de. x MEIKO </p>

          {/* UBAH URL SPOTIFY KAMU DENGAN LAGU FAVORIT MU */}
          <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/6D83eyksFpi3mIIs3KMWrS" />
        </div>
      </div>
      )}
    </div>,
    document.body
  )
}

export default MemberPopup
