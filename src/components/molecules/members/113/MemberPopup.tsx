'use client'

import React, { useEffect, useRef, useState } from 'react'

import Image from 'next/image'

import Instagram from '@/components/atoms/button/InstagramButtonLink'
import LinkedInButtonLink from '@/components/atoms/button/LinkedInButtonLink'
import SpotifyEmbed from '@/components/molecules/SpotifyEmbed'

import ProfileImage from './image.png'
import OorBg from './ONE OK ROCK.jpg'

declare global {
  interface Window {
    YT: any
    onYouTubeIframeAPIReady: () => void
  }
}

type MemberPopupProps = {
  isOpen: boolean
  onClose: () => void
}

const MemberPopup = ({ isOpen, onClose }: MemberPopupProps) => {
  const [isMuted, setIsMuted] = useState(false)
  const playerRef = useRef<any>(null)
  const playerContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

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

  useEffect(() => {
    if (!isOpen) return

    const initPlayer = () => {
      if (!playerContainerRef.current) return
      playerRef.current = new window.YT.Player(playerContainerRef.current, {
        videoId: 'IGInsosP0Ac',
        playerVars: {
          autoplay: 1,
          mute: 0,
          loop: 1,
          playlist: 'IGInsosP0Ac',
          controls: 0,
          disablekb: 1,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          playsinline: 1,
          start: 188,
        },
        events: {
          onReady: (event: any) => {
            event.target.playVideo()
          },
        },
      })
    }

    if (window.YT && window.YT.Player) {
      initPlayer()
    } else {
      const tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      document.head.appendChild(tag)
      window.onYouTubeIframeAPIReady = initPlayer
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy()
        playerRef.current = null
      }
    }
  }, [isOpen])

  const toggleMute = () => {
    if (!playerRef.current) return
    if (isMuted) {
      playerRef.current.unMute()
    } else {
      playerRef.current.mute()
    }
    setIsMuted((prev) => !prev)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto px-4 pt-28 pb-8 sm:pt-32">

      {/* Background YouTube via IFrame API */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div
          ref={playerContainerRef}
          className="absolute top-1/2 left-1/2 h-[150%] w-[100%] -translate-x-1/2 -translate-y-1/2"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Overlay close button */}
      <button
        type="button"
        aria-label="Close member detail"
        onClick={onClose}
        className="fixed inset-0 z-[1] block h-full w-full"
      />

      {/* Wrapper luar modal */}
      <div
        style={{ boxShadow: '0 0 32px 4px rgba(255,255,255,0.4)' }}
        className="relative z-[3] w-full max-w-[720px] animate-[member-popup-show_200ms_ease-out] rounded-2xl border-2 border-white text-white overflow-hidden"
      >

        {/* Background foto di dalam modal */}
        <div className="absolute inset-0 z-0 h-full w-full">
          <Image
            src={OorBg}
            alt="Card Background"
            className="h-full w-full object-cover brightness-[0.25] blur-[2px]"
          />
        </div>

        {/* Inner scroll */}
        <div className="relative z-10 max-h-[calc(100vh-9rem)] overflow-y-auto p-6 sm:max-h-[calc(100vh-10rem)] sm:p-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

          {/* Baris atas: tombol mute (kiri) + tombol close (kanan) */}
          <div className="flex items-center justify-between mb-5">
            <button
              type="button"
              onClick={toggleMute}
              className="flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-4 py-2 text-xs font-semibold backdrop-blur-sm transition-all hover:bg-white/20"
              aria-label="Toggle mute"
            >
              {isMuted ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                    <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM17.78 9.22a.75.75 0 10-1.06 1.06L18.44 12l-1.72 1.72a.75.75 0 101.06 1.06L19.5 13.06l1.72 1.72a.75.75 0 101.06-1.06L20.56 12l1.72-1.72a.75.75 0 00-1.06-1.06L19.5 10.94l-1.72-1.72z" />
                  </svg>
                  Unmute
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                    <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />
                    <path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.06z" />
                  </svg>
                  Mute
                </>
              )}
            </button>

            {/* Tombol close */}
            <button
              type="button"
              aria-label="Close member detail"
              onClick={onClose}
              className="hover:bg-white/10 flex h-9 w-9 items-center justify-center rounded-full border border-white text-xl leading-none"
            >
              x
            </button>
          </div>

          {/* Foto profil */}
          <div className="mb-5 overflow-hidden rounded-2xl border-2 border-white/50">
            <Image src={ProfileImage} alt="Profile Image" className="h-120 w-full object-cover object-center" />
          </div>

          {/* Nama & NRP */}
          <div className="pr-10">
            <h2 className="text-2xl font-black">
              Muhammad Ridwan
              <span className="block mt-1 h-[3px] w-16 rounded-full bg-white" />
            </h2>
            <p className="text-white/70 mt-2 text-sm font-semibold">5027251113 - Tangerang</p>
          </div>

          {/* Sosmed */}
          <div className="mt-5 flex gap-2">
            <Instagram username="rdwaanqt" />
            <LinkedInButtonLink username="muhammad-ridwan-4050b5314" />
          </div>

          {/* Hobi & Fun Fact */}
          <div className="mt-6 grid gap-4 text-sm font-semibold sm:grid-cols-2">
            <div className="rounded-xl border border-white/40 bg-white/5 p-4">
              <p className="text-white/60 text-xs tracking-wide uppercase">Hobi</p>
              <p className="mt-2">Beli Buku</p>
            </div>
            <div className="rounded-xl border border-white/40 bg-white/5 p-4">
              <p className="text-white/60 text-xs tracking-wide uppercase">Fun Fact</p>
              <p className="mt-2">Males Baca Buku</p>
            </div>
          </div>

          {/* Lagu Favorit */}
          <div className="mt-4 rounded-xl border border-white/40 bg-white/5 p-4">
            <p className="text-white/80 text-xs font-bold tracking-wide uppercase">Lagu Favorit</p>
            <p className="my-2 text-sm font-semibold">Stand out fit in - ONE OK ROCK</p>
            <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/4zXRMjTaeflesB3Ih4eHnJ?si=fb2382498b5c4039" />
          </div>

        </div>
      </div>
    </div>
  )
}

export default MemberPopup