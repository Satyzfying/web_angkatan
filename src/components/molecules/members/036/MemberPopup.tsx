'use client'

import React, { useEffect, useRef, useState } from 'react'
import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'

import Image from 'next/image'
import { Montserrat } from 'next/font/google'

import Instagram from '@/components/atoms/button/InstagramButtonLink'
import LinkedInButtonLink from '@/components/atoms/button/LinkedInButtonLink'
import SpotifyEmbed from '@/components/molecules/SpotifyEmbed'

import ProfileImage from './image.png'
import Aha036 from './aha-instant/aha-036.png'
import CardsInstant from './aha-instant/cards-instant.png'
import AhaBackground from './aha-instant/background.jpg'
import LogoJonut from './aha-instant/logo-jonut.png'

import styles from './MemberPopup.module.css'

type MemberPopupProps = {
  isOpen: boolean
  onClose: () => void
}

type AnimationPhase = 'intro' | 'video' | 'video-fade-out' | 'detail'

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800', '900'],
})

const ahaVideoSrc = new URL('./aha-instant/aha-instant.mp4', import.meta.url).href
const ahaLaughSrc = new URL('./aha-instant/aha-laugh.mp3', import.meta.url).href

const MemberPopup = ({ isOpen, onClose }: MemberPopupProps) => {
  const [phase, setPhase] = useState<AnimationPhase>('intro')

  const introAudioRef = useRef<HTMLAudioElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const hahaTexts = ['HAHA', 'HAHAHA', 'HA', 'HA', 'HA']

  const fadeOutIntroAudio = () => {
    const audio = introAudioRef.current
    if (!audio) return

    const startVolume = audio.volume
    const duration = 500
    const intervalTime = 25
    const step = startVolume / (duration / intervalTime)

    const fadeInterval = window.setInterval(() => {
      if (audio.volume <= step) {
        audio.volume = 0
        audio.pause()
        window.clearInterval(fadeInterval)
        return
      }

      audio.volume -= step
    }, intervalTime)
  }

  useEffect(() => {
    if (!isOpen) return

    setPhase('intro')

    const introAudio = introAudioRef.current

    if (introAudio) {
      introAudio.currentTime = 0
      introAudio.volume = 1
      void introAudio.play().catch(() => {})
    }

    const videoTimeout = window.setTimeout(() => {
      setPhase('video')
    }, 1800)

    const videoFadeOutTimeout = window.setTimeout(() => {
      setPhase('video-fade-out')
    }, 3300)

    const audioFadeOutTimeout = window.setTimeout(() => {
      fadeOutIntroAudio()
    }, 4300)

    const detailTimeout = window.setTimeout(() => {
      setPhase('detail')
    }, 4800)

    return () => {
      window.clearTimeout(videoTimeout)
      window.clearTimeout(videoFadeOutTimeout)
      window.clearTimeout(audioFadeOutTimeout)
      window.clearTimeout(detailTimeout)

      if (introAudio) {
        introAudio.pause()
        introAudio.currentTime = 0
        introAudio.volume = 1
      }
    }
  }, [isOpen])

  useEffect(() => {
    if (phase !== 'video') return

    const video = videoRef.current
    if (!video) return

    video.currentTime = 0
    video.muted = true

    void video.play().catch(() => {})
  }, [phase])

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

  if (!isOpen) return null

  return (
    <>
      <audio ref={introAudioRef} src={ahaLaughSrc} preload="auto" />

      {(phase === 'intro' || phase === 'video' || phase === 'video-fade-out') && (
        <div className="fixed inset-0 z-[100] overflow-hidden bg-black">
          <Image src={AhaBackground} alt="" fill sizes="100vw" priority className="pointer-events-none object-cover opacity-70" />

          <div className="absolute inset-0 bg-black/35" />

          <video
            ref={videoRef}
            playsInline
            preload="auto"
            className={`${
              phase === 'intro'
                ? styles.ahaVideoHidden
                : phase === 'video-fade-out'
                  ? styles.ahaVideoFadeOut
                  : styles.ahaVideoVisible
            } absolute inset-0 z-30 h-full w-full object-cover`}
          >
            <source src={ahaVideoSrc} type="video/mp4" />
          </video>

          {phase === 'intro' && (
            <>
              <Image src={CardsInstant} alt="" fill sizes="100vw" priority className={`${styles.ahaCards} pointer-events-none z-10 object-contain`} />

              <div className="pointer-events-none absolute inset-0 z-[15] overflow-hidden">
                {Array.from({ length: 28 }).map((_, index) => {
                  const variant = (index % 5) + 1

                  return (
                    <span key={index} className={`${styles.flickerText} ${styles[`flickerText${variant}` as keyof typeof styles]}`}>
                      {hahaTexts[index % hahaTexts.length]}
                    </span>
                  )
                })}
              </div>

              <div className="absolute inset-0 z-20 flex items-center justify-center px-6">
                <Image src={Aha036} alt="Aha Instant 036" priority className={`${styles.ahaLogo} h-auto w-[min(82vw,430px)]`} />
              </div>
            </>
          )}
  return createPortal(
    // PADA BAGIAN INI KAMU BOLEH MENGUBAH STYLE SESUKA HATI KAMU, TAPI JANGAN UBAH STRUKTUR DAN FUNGSI DARI KODE INI AGAR FUNGSI POPUP TETAP BERJALAN DENGAN BAIK
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto px-4">
      <button
        type="button"
        aria-label="Close member detail"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      <div className="border-neutral-cs-10 bg-blue-cs-40 relative z-10 max-h-[100dvh] w-full max-w-[720px] animate-[member-popup-show_200ms_ease-out] overflow-y-auto rounded-2xl border-2 p-6 text-white shadow-xl sm:p-8">
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

        <div className="pr-10">
          {/* UBAH NAMA ANDA */}
          <h2 className="text-2xl font-black">Catherina Vallencia K</h2>
          {/* UBAH NRP DAN ASAL */}
          <p className="text-neutral-cs-10/70 mt-1 text-sm font-semibold">5027251082 - Surakarta</p>
        </div>

        <div className="mt-5 flex gap-2">
          {/* UBAH USERNAME INSTAGRAM */}
          <Instagram username="jkt48.erine" />
          {/* UBAH USERNAME LINKEDIN */}
          <LinkedInButtonLink username="jkt48.erine" />
        </div>
      )}

      {phase === 'detail' && (
        <div className={`${montserrat.className} fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto px-4 pt-28 pb-8 sm:pt-32`}>
          <Image src={AhaBackground} alt="" fill sizes="100vw" priority className="pointer-events-none object-cover" />

          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          <button type="button" aria-label="Close member detail" onClick={onClose} className="absolute inset-0" />

          <div
            className={`${styles.memberCardEnter} relative z-10 max-h-[calc(100vh-9rem)] w-full max-w-[720px] overflow-y-auto rounded-2xl border-2 border-orange-300/50 bg-gradient-to-br from-[#5a1b00] via-[#9a3200] to-[#2b0c00] p-6 text-white shadow-xl sm:max-h-[calc(100vh-10rem)] sm:p-8`}
          >
            <button
              type="button"
              aria-label="Close member detail"
              onClick={onClose}
              className="absolute top-4 right-4 z-30 flex h-9 w-9 items-center justify-center rounded-full border border-white/80 text-xl leading-none text-white hover:bg-white/10"
            >
              x
            </button>

            <div className="mb-5 overflow-hidden rounded-2xl border border-orange-200/40">
              <Image src={ProfileImage} alt="Profile Image" className="h-120 w-full object-cover object-center" />
            </div>

            <div className="mt-6 grid items-center gap-4 sm:grid-cols-[1fr_150px]">
              <div className="pr-4">
                <h2 className="text-2xl font-black">Jonathan Steven Tjahjaputra</h2>
                <p className="mt-1 text-sm font-semibold text-orange-100/80">5027251036 - Batam</p>

                <div className="mt-5 flex gap-2">
                  <Instagram username="jonathan.st_tj" />
                  <LinkedInButtonLink username="jonathan-steven-tjahjaputra-90769a379" />
                </div>
              </div>

              <div className="hidden items-center justify-center sm:flex">
                <Image
                  src={LogoJonut}
                  alt="Logo Jonut"
                  priority
                  className={`${styles.rotatingLogo} h-auto w-[105px] object-contain drop-shadow-2xl`}
                />
              </div>
            </div>

            <div className="mt-6 grid gap-4 text-sm font-semibold sm:grid-cols-2">
              <div className="rounded-xl border border-orange-200/40 bg-black/10 p-4">
                <p className="text-xs tracking-wide text-yellow-200/80 uppercase">Hobi</p>
                <p className="mt-2">Ngedesain Karakter, Gambar, Nyanyi, Ngegame</p>
              </div>
              <div className="rounded-xl border border-orange-200/40 bg-black/10 p-4">
                <p className="text-xs tracking-wide text-yellow-200/80 uppercase">Fun Fact</p>
                <p className="mt-2">Selalu di divisi event karena Jonathan St(event) Tjahjaputra</p>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-orange-200/40 bg-black/10 p-4">
              <p className="text-xs font-bold tracking-wide text-yellow-200/80 uppercase">Lagu Favorit</p>
              <p className="my-2 text-sm font-semibold">Rain ~ The Script</p>
              <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/2QWP8NYYplOqEFBYGCcq0S?si=ef7fa8a6fd5a4c10" />
            </div>
          </div>
        </div>
      )}
    </>

        <div className="border-neutral-cs-10/40 mt-4 rounded-xl border p-4">
          {/* UBAH LAGU FAVORIT KAMU */}
          <p className="text-neutral-cs-10/60 text-xs font-bold tracking-wide uppercase">Lagu Favorit</p>
          <p className="my-2 text-sm font-semibold">There Is a Light That Never Goes Out</p>

          {/* UBAH URL SPOTIFY KAMU DENGAN LAGU FAVORIT MU */}
          <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/2X62SjtuwVQiGiZvZZ9Ztr?si=f6718391848a4469" />
        </div>
      </div>
    </div>,
    document.body
  )
}

export default MemberPopup