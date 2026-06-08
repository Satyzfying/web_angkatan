'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'

import Image from 'next/image'

import { createPortal } from 'react-dom'

import Instagram from '@/components/atoms/button/InstagramButtonLink'
import LinkedInButtonLink from '@/components/atoms/button/LinkedInButtonLink'

import DiscordEffect from '@/assets/images/members/discord-effect.svg'

import MemberPopup from './MemberPopup'
import ProfileImage from './image.jpeg'

type IntroStage = 'idle' | 'video' | 'videoFade' | 'quote' | 'fade'

const CardMember = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [introStage, setIntroStage] = useState<IntroStage>('idle')
  const introVideoRef = useRef<HTMLVideoElement>(null)
  const videoFadeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const quoteTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const fadeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (videoFadeTimerRef.current) {
        clearTimeout(videoFadeTimerRef.current)
      }

      if (quoteTimerRef.current) {
        clearTimeout(quoteTimerRef.current)
      }

      if (fadeTimerRef.current) {
        clearTimeout(fadeTimerRef.current)
      }
    }
  }, [])

  const openPopupAfterIntro = useCallback(() => {
    if (videoFadeTimerRef.current) {
      clearTimeout(videoFadeTimerRef.current)
    }

    if (quoteTimerRef.current) {
      clearTimeout(quoteTimerRef.current)
    }

    if (fadeTimerRef.current) {
      clearTimeout(fadeTimerRef.current)
    }

    if (introStage === 'quote' || introStage === 'fade') {
      setIntroStage('fade')

      fadeTimerRef.current = setTimeout(() => {
        setIntroStage('idle')
        setIsPopupOpen(true)
      }, 700)

      return
    }

    setIntroStage('videoFade')

    videoFadeTimerRef.current = setTimeout(() => {
      setIntroStage('quote')

      quoteTimerRef.current = setTimeout(() => {
        setIntroStage('fade')

        fadeTimerRef.current = setTimeout(() => {
          setIntroStage('idle')
          setIsPopupOpen(true)
        }, 700)
      }, 2000)
    }, 300)
  }, [introStage])

  const openPopupWithIntro = () => {
    setIntroStage('video')

    requestAnimationFrame(() => {
      if (introVideoRef.current) {
        introVideoRef.current.volume = 0.6
      }

      introVideoRef.current?.play().catch(() => {
        openPopupAfterIntro()
      })
    })
  }

  useEffect(() => {
    if (introStage === 'idle') {
      return
    }

    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        openPopupAfterIntro()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [introStage, openPopupAfterIntro])

  return (
    <>
      {/*  JANGAN PERNAH UBAH STRUKTUR CARD MEMBER KARENA KODE INI AKAN DI-CRAWL OLEH SCRIPT UNTUK MENGAMBIL DATA MEMBER, UBAH DATA MEMBER YANG DIPERLUKAN SAJA. JANGAN JUGA UBAH STYLE CARD MEMBER KARENA STYLE YANG SAMA DIBUTUHKAN AGAR TAMPILAN WEBSITE KONSISTEN */}
      <div
        role="button"
        tabIndex={0}
        onClick={openPopupWithIntro}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            openPopupWithIntro()
          }
        }}
        className="relative z-10 h-auto w-72 cursor-pointer overflow-hidden rounded-2xl border-2 border-neutral-50 px-6 py-7 backdrop-blur-lg transition-transform hover:scale-[1.02]"
      >
        <Image
          src={DiscordEffect}
          alt=""
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-50 select-none"
        />
        <div className="bg-blue-cs-40/10 absolute inset-0 -z-10 select-none"></div>
        <div className="flex h-full w-full flex-col gap-4">
          <div className="flex flex-col gap-3">
            <div className="flex gap-2 px-1" onClick={(event) => event.stopPropagation()}>
              {/* UBAH USERNAME INSTAGRAM KAMU */}
              <Instagram username="satyaarynt" />
              {/* UBAH USERNAME LINKEDIN KAMU */}
              <LinkedInButtonLink username="satya-putra-aryanta" />
            </div>
            <div className="w-full rounded-2xl">
              <Image
                src={ProfileImage}
                alt="Profile Image"
                className="h-50 w-full rounded-2xl object-cover object-center"
              />
            </div>
          </div>
          {/*  JANGAN PERNAH UBAH STRUKTUR CARD MEMBER KARENA KODE INI AKAN DI-CRAWL OLEH SCRIPT UNTUK MENGAMBIL DATA MEMBER, UBAH DATA MEMBER YANG DIPERLUKAN SAJA. JANGAN JUGA UBAH STYLE CARD MEMBER KARENA STYLE YANG SAMA DIBUTUHKAN AGAR TAMPILAN WEBSITE KONSISTEN */}
          <div className="bg-blue-cs-40 rounded-2xl border-2 border-neutral-50 px-3 py-4 text-sm font-extrabold text-neutral-100">
            {/* UBAH NAMA KAMU */}
            <p>Gede Satya Putra Aryanta</p>
            {/* UBAH NRP KAMU */}
            <p>5027251012</p>
            {/* UBAH ASAL KOTA KAMU */}
            <p>Denpasar</p>
          </div>
        </div>
      </div>
      {introStage !== 'idle'
        ? createPortal(
            <div className="fixed inset-0 z-[200] flex h-[100dvh] max-h-[100dvh] items-center justify-center overflow-hidden bg-black">
              {introStage === 'video' || introStage === 'videoFade' ? (
                <>
                  <video
                    ref={introVideoRef}
                    className={`h-full w-full object-cover object-center transition-opacity duration-300 sm:object-contain ${
                      introStage === 'videoFade' ? 'opacity-0' : 'opacity-100'
                    }`}
                    autoPlay
                    playsInline
                    onEnded={openPopupAfterIntro}
                    onError={openPopupAfterIntro}
                    onLoadedMetadata={(event) => {
                      event.currentTarget.volume = 0.6
                    }}
                  >
                    <source src="/assets/videos/members/012/xaleidintro.mp4" type="video/mp4" />
                  </video>
                  <button
                    type="button"
                    onClick={openPopupAfterIntro}
                    className={`font-maimai absolute right-4 bottom-4 rounded-lg border border-[#ADD8E6]/70 bg-black/70 px-4 py-2 text-sm font-bold text-[#ADD8E6] backdrop-blur-sm transition-all duration-300 hover:bg-black/85 sm:right-6 sm:bottom-6 sm:text-base ${
                      introStage === 'videoFade' ? 'opacity-0' : 'opacity-100'
                    }`}
                  >
                    SKIP INTRO &gt;&gt;
                  </button>
                </>
              ) : (
                <div
                  className={`font-cinzel flex max-w-[760px] animate-[member-popup-show_500ms_ease-out] flex-col items-center px-6 text-center text-white transition-opacity duration-700 ${
                    introStage === 'fade' ? 'opacity-0' : 'opacity-100'
                  }`}
                >
                  <p className="animate-[quote-glow-breathe_2.4s_ease-in-out_infinite] text-2xl leading-relaxed font-semibold tracking-wide text-[#ADD8E6] sm:text-4xl">
                    一緒に行きましょう、
                    <br />
                    すべての決着をつけに。
                  </p>
                  <p className="mt-6 animate-[quote-glow-breathe_2.8s_ease-in-out_infinite] text-sm leading-relaxed tracking-[0.18em] text-white/70 sm:text-lg">
                    -Let&apos;s go together.
                    <br />
                    To settle everything-
                  </p>
                </div>
              )}
            </div>,
            document.body
          )
        : null}
      <MemberPopup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} />
    </>
  )
}

export default CardMember
