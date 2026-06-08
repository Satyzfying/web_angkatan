'use client'

import React, { useEffect, useRef } from 'react'
import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'

import Image from 'next/image'

import Instagram from '@/components/atoms/button/InstagramButtonLink'
import LinkedInButtonLink from '@/components/atoms/button/LinkedInButtonLink'
import SpotifyEmbed from '@/components/molecules/SpotifyEmbed'

import ProfileImage from './image.png'

import FlowerBouquet from './flower-bouquet.png'
import FlowerSmall from './flower-small.png'
import Camera from './camera.png'
import Teacup from './teacup.png'
import WaxSeal from './wax-seal.png'
import Envelope from './envelope.png'
import CinemaTicket from './cinema-ticket.png'

type MemberPopupProps = {
  isOpen: boolean
  onClose: () => void
}

const MemberPopup = ({ isOpen, onClose }: MemberPopupProps) => {
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    if (audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.play().catch(() => {})
    }

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)

      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto px-4 pt-28 pb-8 sm:pt-32">
  return createPortal(
    // PADA BAGIAN INI KAMU BOLEH MENGUBAH STYLE SESUKA HATI KAMU, TAPI JANGAN UBAH STRUKTUR DAN FUNGSI DARI KODE INI AGAR FUNGSI POPUP TETAP BERJALAN DENGAN BAIK
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto px-4">
      <button
        type="button"
        aria-label="Close member detail"
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />

      <div className="relative z-10 max-h-[calc(100vh-9rem)] w-full max-w-[720px] animate-[member-popup-show_200ms_ease-out] overflow-y-auto rounded-[32px] border-2 border-[#d8c9b4] bg-[#f8f2e9] p-6 text-[#5c4632] shadow-2xl sm:max-h-[calc(100vh-10rem)] sm:p-8">

        {/* MUSIC */}
       <audio ref={audioRef} loop>
  <source
    src="/assets/audio/landslide.mp3"
    type="audio/mpeg"
  />
</audio>
        {/* TOP DECOR */}
        <Image
          src={FlowerBouquet}
          alt=""
          className="pointer-events-none absolute -left-4 -top-4 z-20 w-20 rotate-[-10deg]"
        />

        <Image
          src={FlowerSmall}
          alt=""
          className="pointer-events-none absolute right-8 top-8 z-20 w-12 rotate-[10deg]"
        />

        {/* CLOSE */}
      <div className="border-neutral-cs-10 bg-blue-cs-40 relative z-10 max-h-[100dvh] w-full max-w-[720px] animate-[member-popup-show_200ms_ease-out] overflow-y-auto rounded-2xl border-2 p-6 text-white shadow-xl sm:p-8">
        <button
          type="button"
          aria-label="Close member detail"
          onClick={onClose}
          className="absolute top-4 right-4 z-30 flex h-10 w-10 items-center justify-center rounded-full border border-[#d8c9b4] bg-[#efe3d3] text-xl font-bold text-[#5c4632] hover:scale-105"
        >
          ×
        </button>

        {/* PHOTO */}
        <div className="relative mb-8 overflow-hidden rounded-3xl border-2 border-[#d8c9b4] shadow-lg">

          <Image
            src={ProfileImage}
            alt="Profile Image"
            className="h-120 w-full object-cover object-center"
          />

          <Image
            src={Camera}
            alt=""
            className="pointer-events-none absolute left-4 bottom-6 w-10 opacity-80 animate-[float2_7s_ease-in-out_infinite]"
          />

          <Image
            src={Teacup}
            alt=""
            className="pointer-events-none absolute right-20 bottom-8 w-10 opacity-80 animate-[float1_6s_ease-in-out_infinite]"
          />

          <Image
            src={WaxSeal}
            alt=""
            className="pointer-events-none absolute right-5 bottom-4 w-8 opacity-90 animate-[float3_8s_ease-in-out_infinite]"
          />

        </div>

        {/* NAME */}
        <div className="pr-10">
          <h2 className="text-3xl font-black tracking-wide">
            Dian Piramidiana Rachmatika
          </h2>

          <p className="mt-1 text-sm font-semibold text-[#8b7157]">
            5027251031 • Sidoarjo
          </p>
        </div>

        {/* SOCIAL */}
        <div className="mt-5 flex gap-2">
          <Instagram username="piramidiana" />
          <LinkedInButtonLink username="piramidiana" />
        </div>

        {/* INFO */}
        <div className="mt-6 grid gap-4 text-sm font-semibold sm:grid-cols-2">

          <div className="rounded-2xl border border-[#d8c9b4] bg-[#fffaf4] p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-[#9a7d62]">
              Hobi
            </p>

            <p className="mt-2">
              Collecting moments.
            </p>

          </div>

          <div className="rounded-2xl border border-[#d8c9b4] bg-[#fffaf4] p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-[#9a7d62]">
              Fun Fact
            </p>

            <p className="mt-2">
              Woti cantik oshinya Michie ✿
            </p>

          </div>

        </div>

        {/* SONG */}
        <div className="mt-5 rounded-2xl border border-[#d8c9b4] bg-[#fffaf4] p-4">

          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#9a7d62]">
            Now Playing
          </p>

          <p className="mt-2 text-lg font-bold">
            Landslide
          </p>

          <p className="mb-2 text-sm text-[#8b7157]">
            Fleetwood Mac
          </p>

          <SpotifyEmbed
            spotifyUrl="https://open.spotify.com/track/5ihS6UUlyQAfmp48eSkxuQ"
          />

        </div>

        {/* BOTTOM DECOR */}

        <div className="relative mt-6 h-20">

          <Image
            src={Envelope}
            alt=""
            className="pointer-events-none absolute left-0 bottom-0 w-14 rotate-[-10deg] opacity-75 animate-[float1_8s_ease-in-out_infinite]"
          />

          <Image
            src={Camera}
            alt=""
            className="pointer-events-none absolute left-24 bottom-4 w-11 rotate-[8deg] opacity-75 animate-[float2_7s_ease-in-out_infinite]"
          />

          <div className="absolute left-1/2 bottom-8 -translate-x-1/2 text-xl opacity-70 animate-[twinkle_3s_ease-in-out_infinite]">
            ✿
          </div>

          <div className="absolute left-[58%] bottom-1 text-lg opacity-60 animate-[twinkle_4s_ease-in-out_infinite]">
            ✧
          </div>

          <Image
            src={CinemaTicket}
            alt=""
            className="pointer-events-none absolute right-24 bottom-2 w-12 rotate-[-8deg] opacity-75 animate-[float3_8s_ease-in-out_infinite]"
          />

          <Image
            src={Teacup}
            alt=""
            className="pointer-events-none absolute right-2 bottom-6 w-11 opacity-75 animate-[float1_7s_ease-in-out_infinite]"
          />

        </div>

        {/* QUOTE */}
        <div className="mt-3 text-center text-sm italic text-[#8b7157]">
          "Collecting little memories, one journey at a time."
        </div>

      </div>
    </div>,
    document.body
  )
}

export default MemberPopup