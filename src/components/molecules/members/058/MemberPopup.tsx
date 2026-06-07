'use client'

import React, { useCallback, useEffect, useState, useRef } from 'react'
import { createPortal } from 'react-dom'

import Image from 'next/image'

import Instagram from '@/components/atoms/button/InstagramButtonLink'
import LinkedInButtonLink from '@/components/atoms/button/LinkedInButtonLink'
import SpotifyEmbed from '@/components/molecules/SpotifyEmbed'

import ProfileImage from './image.png'
import ProfileImage2 from './image2.png'


type MemberPopupProps = {
  isOpen: boolean
  onClose: () => void
}

const MemberPopup = ({ isOpen, onClose }: MemberPopupProps) => {
  const [isHovered, setIsHovered] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isMusicPlaying, setIsMusicPlaying] = useState(true)
  const [showWarning, setShowWarning] = useState(true)

  const closePopup = useCallback(() => {
    setShowWarning(true)
    setIsMusicPlaying(true)
    onClose()
  }, [onClose])

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closePopup()
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, closePopup])

  useEffect(() => { //for audio
    if (!isOpen || showWarning) return

    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }

    const audio = new Audio('/assets/audio/Audio.mp3')
    audio.loop = true
    // Catch the promise rejection to avoid unhandledRejection if autoplay is blocked or file fails
    audio.play().catch(e => console.warn('Audio play failed:', e))
    audioRef.current = audio

    return () => {
      audio.pause()
      audio.currentTime = 0
      audioRef.current = null
    }
  }, [isOpen, showWarning])



  if (!isOpen) {
    return null
  }

  if (showWarning) {
    return createPortal(
      <div className="fixed inset-0 z-[100] flex items-center justify-center"
        style={{ backgroundColor: '#210705' }}>
        <div className="text-center">
          <p className="text-white text-4xl font-black"
            style={{ fontFamily: 'var(--font-cloisterblack)' }}
          >⚠️ FLASH WARNING ⚠️</p>
          <p className="text-white/60 text-sm mt-4 max-w-sm mx-auto">This page contains flashing lights and effects that may affect photosensitive viewers.</p>
          <div className="flex gap-4 justify-center mt-8">
            <button
              type="button"
              onClick={() => setShowWarning(false)}
              className="px-6 py-2 bg-white text-black font-bold rounded-lg hover:bg-white/80 transition-all"
            >
              Continue
            </button>
            <button
              type="button"
              onClick={closePopup}
              className="px-6 py-2 border border-white/40 text-white font-bold rounded-lg hover:bg-white/10 transition-all"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>,
      document.body
    )
  }

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-hidden px-4">
      <div onClick={closePopup} className="fixed inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/assets/videos/bgVid.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0" style={{ backgroundColor: 'rgba(33, 6, 3, 0.6)' }} />
      </div>

      <div className="bg-red-950/50 relative z-10 h-[100dvh] max-h-[100dvh] w-full max-w-[720px] animate-[member-popup-show_200ms_ease-out] overflow-y-auto overscroll-contain rounded-2xl p-6 text-white shadow-2xl shadow-black sm:p-8">
        <button
          type="button"
          aria-label="Close member detail"
          onClick={closePopup}
          className="border-neutral-cs-10 hover:bg-neutral-cs-10/10 absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border text-xl leading-none"
        >
          x
        </button>

        <div
          className="border-neutral-cs-10/40 mb-5 overflow-hidden rounded-2xl border relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Image
            src={isHovered ? ProfileImage2 : ProfileImage}
            alt="Profile Image"
            className="h-120 w-full object-cover object-center transition-all duration-100"
          />
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            if (audioRef.current) {
              if (isMusicPlaying) {
                audioRef.current.pause()
              } else {
                audioRef.current.play()
              }
              setIsMusicPlaying(!isMusicPlaying)
            }
          }}
          className="mt-2 text-xs text-white/60 hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] hover:-translate-y-1 transition-all duration-300"
          style={{ fontFamily: 'var(--font-blackgoth)' }}
        >
          {isMusicPlaying ? 'Music🔇' : 'Music🔊'}
        </button>

        <div className="pr-10">
          {/* UBAH NAMA ANDA */}
          <h2 className="text-2xl" style={{ fontFamily: 'var(--font-blackgoth)' }} >Azita Zahwa Zahida Asmoro</h2>
          {/* UBAH NRP DAN ASAL */}
          <p className="text-neutral-cs-10/70 mt-1 text-sm font-semibold">5027251058 - Banjarnegara</p>
        </div>

        <div className="mt-5 flex gap-2">
          <div className="hover:-translate-y-1 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all duration-300">
            <Instagram username="hank.ways" />
          </div>
          <div className="hover:-translate-y-1 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all duration-300">
            <LinkedInButtonLink username="zahwaasmoro" />
          </div>
        </div>

        <div className="mt-6 grid gap-4 text-sm font-semibold sm:grid-cols-2">
          <div className="border-neutral-cs-10/40 rounded-xl border p-4">
            {/* UBAH HOBI KAMU */}
            <p className="text-neutral-cs-10/60 text-xs tracking-widest uppercase"
              style={{ fontFamily: 'var(--font-blackgoth)' }}
            >Hobi</p>

            <ul className="mt-2 list-disc list-inside space-y-1">
              <li>Loving ma <a href="https://www.instagram.com/_doolsetnet"
                target="_blank" rel="noopener noreferrer"
                className="underline hover:text-red-400">Husband</a> ♡</li>
              <li>CATS</li>
              <li>Reading n Painting</li>
              <li>Blasting songs 24/7</li>
              <li>Learn new languages</li>
            </ul>
          </div>
          <div className="border-neutral-cs-10/40 rounded-xl border p-4">
            {/* UBAH FUNFACT KAMU */}
            <p className="text-neutral-cs-10/60 text-xs tracking-widest uppercase"
              style={{ fontFamily: 'var(--font-blackgoth)' }}
            >Fun Fact</p>
            <p className="mt-2">Wanted to be a Firefighter</p>
          </div>
        </div>

        <div className="border-neutral-cs-10/40 mt-4 rounded-xl border p-4">
          {/* UBAH LAGU FAVORIT KAMU */}
          <p className="text-neutral-cs-10/60 text-xs font-bold tracking-widest uppercase"
            style={{ fontFamily: 'var(--font-blackgoth)' }}
          >Lagu Favorit</p>

          {/*<p className="my-2 text-sm font-semibold">Alien</p>*/}
          <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/3czfvJgfEDfBT5OKA5qAU5?si=673ccc70ea4141c0" />

          {/*<p className="my-2 text-sm font-semibold">sTraNgeRs</p>*/}
          <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/5fpq1wF8xa5tSSlcKHdmGQ?si=f0a404fc7b534c9f" />

          {/*<p className="my-2 text-sm font-semibold">sTraNgeRs</p>*/}
          <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/3EPqLcliwi9bd5h77Hkuh8?si=4b36c328c9ee4ee2" />
        </div>
      </div>
    </div>,
    document.body
  )
}

export default MemberPopup
