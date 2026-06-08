'use client'

/* eslint-disable react-hooks/set-state-in-effect */

import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import Image from 'next/image'

import Instagram from '@/components/atoms/button/InstagramButtonLink'
import LinkedInButtonLink from '@/components/atoms/button/LinkedInButtonLink'
import SpotifyEmbed from '@/components/molecules/SpotifyEmbed'

import ProfileImage from './image.png'
import LogoJonut from './aha-instant/logo-jonut.png'
import OverlayLights from './aha-instant/overlay.png'

import styles from './MemberPopup.module.css'

type MemberPopupProps = {
  isOpen: boolean
  onClose: () => void
}

type AnimationPhase = 'aha-video' | 'moving-bg' | 'detail'

const ahaInstantSrc = new URL('./aha-instant/aha_instant.mp4', import.meta.url).href
const movingBgSrc = new URL('./aha-instant/movingbg.mp4', import.meta.url).href
const ahaLaughSrc = new URL('./aha-instant/aha-laugh.mp3', import.meta.url).href
const loopAudioSrc = new URL('./aha-instant/loop_audio.mp3', import.meta.url).href

const MemberPopup = ({ isOpen, onClose }: MemberPopupProps) => {
  const [phase, setPhase] = useState<AnimationPhase>('aha-video')

  const ahaVideoRef = useRef<HTMLVideoElement>(null)
  const movingBgRef = useRef<HTMLVideoElement>(null)
  const ahaLaughRef = useRef<HTMLAudioElement>(null)
  const loopAudioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (!isOpen) return

    setPhase('aha-video')

    const ahaVideo = ahaVideoRef.current
    const movingBg = movingBgRef.current
    const ahaLaugh = ahaLaughRef.current
    const loopAudio = loopAudioRef.current

    if (movingBg) {
      movingBg.pause()
      movingBg.currentTime = 0
    }

    if (loopAudio) {
      loopAudio.pause()
      loopAudio.currentTime = 0
      loopAudio.volume = 1
      loopAudio.muted = false
    }

    if (ahaLaugh) {
      ahaLaugh.pause()
      ahaLaugh.currentTime = 0
      ahaLaugh.volume = 1
      ahaLaugh.muted = false

      void ahaLaugh.play().catch((error) => {
        console.warn('Aha laugh audio failed:', error)
      })
    }

    if (ahaVideo) {
      ahaVideo.pause()
      ahaVideo.currentTime = 0
      ahaVideo.muted = true

      void ahaVideo.play().catch((error) => {
        console.warn('Aha video failed:', error)
      })
    }
  }, [isOpen])

  useEffect(() => {
    if (phase !== 'moving-bg') return

    const movingBg = movingBgRef.current
    const loopAudio = loopAudioRef.current
    const ahaLaugh = ahaLaughRef.current

    if (ahaLaugh) {
      ahaLaugh.pause()
      ahaLaugh.currentTime = 0
    }

    if (movingBg) {
      movingBg.currentTime = 0
      movingBg.muted = true

      void movingBg.play().catch(() => {})
    }

    if (loopAudio) {
      loopAudio.currentTime = 0
      loopAudio.volume = 1
      loopAudio.muted = false

      void loopAudio.play().catch((error) => {
        console.warn('Loop audio failed:', error)
      })
    }

    setPhase('detail')
  }, [phase])

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') handleClose()
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const handleAhaVideoEnded = () => {
    setPhase('moving-bg')
  }

  const handleClose = () => {
    ahaVideoRef.current?.pause()
    movingBgRef.current?.pause()
    ahaLaughRef.current?.pause()
    loopAudioRef.current?.pause()

    if (ahaVideoRef.current) ahaVideoRef.current.currentTime = 0
    if (movingBgRef.current) movingBgRef.current.currentTime = 0
    if (ahaLaughRef.current) ahaLaughRef.current.currentTime = 0
    if (loopAudioRef.current) loopAudioRef.current.currentTime = 0

    onClose()
  }

  if (!isOpen) return null

  return createPortal(
    <>
      <audio ref={ahaLaughRef} src={ahaLaughSrc} preload="auto" />
      <audio ref={loopAudioRef} src={loopAudioSrc} preload="auto" loop />

      <div className="fixed inset-0 z-[100] overflow-hidden bg-black">
        <video
          ref={ahaVideoRef}
          playsInline
          preload="auto"
          onEnded={handleAhaVideoEnded}
          className={`${phase === 'aha-video' ? 'opacity-100' : 'opacity-0'} absolute inset-0 h-full w-full object-cover`}
        >
          <source src={ahaInstantSrc} type="video/mp4" />
        </video>

        {(phase === 'moving-bg' || phase === 'detail') && (
          <video
            ref={movingBgRef}
            playsInline
            preload="auto"
            loop
            muted
            className={`${styles.movingBgFadeIn} absolute inset-0 h-full w-full object-cover`}
          >
            <source src={movingBgSrc} type="video/mp4" />
          </video>
        )}

        {phase === 'detail' && (
          <div className="absolute inset-0 z-10 flex items-start justify-center overflow-y-auto px-4 pt-28 pb-8 sm:pt-32">
            <div className="absolute inset-0 bg-black/45 backdrop-blur-[1px]" />

            <Image
              src={OverlayLights}
              alt=""
              priority
              className={`${styles.lightsOverlay} pointer-events-none fixed -top-24 left-1/2 z-30 h-auto w-[125vw] max-w-none -translate-x-1/2`}
            />

            <button type="button" aria-label="Close member detail" onClick={handleClose} className="absolute inset-0" />

            <div className={`${styles.memberCardEnter} relative z-10 max-h-[calc(100vh-9rem)] w-full max-w-[720px] overflow-hidden rounded-2xl border-2 border-orange-300/50 bg-gradient-to-br from-[#5a1b00]/95 via-[#9a3200]/95 to-[#2b0c00]/95 text-white shadow-xl sm:max-h-[calc(100vh-10rem)]`}>
              <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden">
                <Image
                  src={LogoJonut}
                  alt=""
                  priority
                  className={`${styles.cardBgLogo} h-auto w-[780px] max-w-none object-contain opacity-20`}
                />
              </div>

              <div className="relative z-10 max-h-[calc(100vh-9rem)] overflow-y-auto p-6 sm:max-h-[calc(100vh-10rem)] sm:p-8">
                <button
                  type="button"
                  aria-label="Close member detail"
                  onClick={handleClose}
                  className="absolute top-4 right-4 z-30 flex h-9 w-9 items-center justify-center rounded-full border border-white/80 text-xl leading-none text-white hover:bg-white/10"
                >
                  x
                </button>

                <div className="mb-5 flex justify-center">
                  <div className="aspect-square w-full max-w-[360px] overflow-hidden rounded-2xl border border-orange-200/40">
                    <Image src={ProfileImage} alt="Profile Image" className="h-full w-full object-cover object-center" />
                  </div>
                </div>

                <div className="pr-10">
                  <h2 className="text-2xl font-black">Jonathan Steven Tjahjaputra</h2>
                  <p className="mt-1 text-sm font-semibold text-orange-100/80">5027251036 - Batam</p>
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-2">
                  <Instagram username="jonathan.st_tj" />
                  <LinkedInButtonLink username="jonathan-steven-tjahjaputra-90769a379" />

                  <a
                    href="https://linktr.ee/jonathansteventjahjaputra"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-10 items-center justify-center rounded-full border border-white/80 px-4 text-xs font-black tracking-wide text-white transition hover:bg-white/10"
                  >
                    DISCOVER MORE ABOUT ME
                  </a>
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
          </div>
        )}
      </div>
    </>, document.body
  )
}

export default MemberPopup
