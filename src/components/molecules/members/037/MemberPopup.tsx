'use client'

import React, { useCallback, useEffect, useState } from 'react'

import Image from 'next/image'
import { Cormorant_Garamond, Nunito } from 'next/font/google'

import { createPortal } from 'react-dom'

import Instagram from '@/components/atoms/button/InstagramButtonLink'
import LinkedInButtonLink from '@/components/atoms/button/LinkedInButtonLink'
import SpotifyEmbed from '@/components/molecules/SpotifyEmbed'

import BackgroundImage from './background.jpg'
import ProfileImage from './image.jpg'
import IntroGif from './member-intro.gif'
import SleepingCatGif from './sleeping_cat_zzz_clean.gif'

type MemberPopupProps = {
  isOpen: boolean
  onClose: () => void
}

const titleFont = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['600', '700']
})

const bodyFont = Nunito({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800']
})

const MemberPopup = ({ isOpen, onClose }: MemberPopupProps) => {
  const [introPhase, setIntroPhase] = useState<'playing' | 'zooming' | 'done'>('playing')

  const closePopup = useCallback(() => {
    setIntroPhase('playing')
    onClose()
  }, [onClose])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const zoomTimer = window.setTimeout(() => setIntroPhase('zooming'), 6000)
    const doneTimer = window.setTimeout(() => setIntroPhase('done'), 7000)

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closePopup()
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.clearTimeout(zoomTimer)
      window.clearTimeout(doneTimer)
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, closePopup])

  if (!isOpen) {
    return null
  }

  return createPortal(
    <div
      className={`fixed inset-0 z-[100] flex items-start justify-center overflow-hidden px-4 ${bodyFont.className}`}
    >
      <style jsx global>{`
        @keyframes intro-gif-zoom {
          0% {
            opacity: 1;
            transform: scale(1);
            filter: blur(0);
          }
          65% {
            opacity: 1;
            transform: scale(1.65);
            filter: blur(2px);
          }
          100% {
            opacity: 0;
            transform: scale(2.45);
            filter: blur(10px);
          }
        }

        @keyframes popup-reveal {
          0% {
            opacity: 0;
            transform: scale(0.76);
            filter: blur(16px);
          }
          100% {
            opacity: 1;
            transform: scale(1);
            filter: blur(0);
          }
        }

        @keyframes star-float {
          0%,
          100% {
            transform: translateY(0) scale(1) rotate(0deg);
            opacity: 0.62;
          }
          50% {
            transform: translateY(-12px) scale(1.15) rotate(8deg);
            opacity: 1;
          }
        }

        .member-popup-scroll::-webkit-scrollbar {
          width: 6px;
        }

        .member-popup-scroll::-webkit-scrollbar-track {
          background: transparent;
        }

        .member-popup-scroll::-webkit-scrollbar-thumb {
          background: rgba(219, 234, 254, 0.35);
          border-radius: 999px;
        }
      `}</style>

      <button
        type="button"
        aria-label="Close member detail"
        onClick={closePopup}
        className="absolute inset-0 bg-[#020617]/78 backdrop-blur-md"
      />

      {introPhase !== 'done' ? (
        <div className="relative z-20 flex h-full w-full items-center justify-center overflow-hidden">
          <div
            className="absolute inset-0 opacity-95"
            style={{
              backgroundImage: `linear-gradient(135deg, rgba(3, 7, 18, 0.74), rgba(15, 39, 72, 0.7), rgba(3, 7, 18, 0.84)), url(${BackgroundImage.src})`,
              backgroundPosition: 'center',
              backgroundSize: 'cover'
            }}
          />

          <div className="pointer-events-none absolute top-[14%] left-[8%] z-10 animate-[star-float_2700ms_ease-in-out_infinite] text-4xl text-[#fff7d6] drop-shadow-[0_0_20px_rgba(255,247,214,0.95)] sm:text-5xl">
            ✦
          </div>
          <div className="pointer-events-none absolute top-[18%] right-[8%] z-10 animate-[star-float_3300ms_ease-in-out_infinite] text-4xl text-[#dbeafe] drop-shadow-[0_0_22px_rgba(191,219,254,0.95)] sm:text-5xl">
            ☆
          </div>
          <div className="pointer-events-none absolute bottom-[18%] left-[12%] z-10 animate-[star-float_3000ms_ease-in-out_infinite] text-3xl text-[#fff7d6] drop-shadow-[0_0_18px_rgba(255,247,214,0.9)] sm:text-4xl">
            ✧
          </div>
          <div className="pointer-events-none absolute right-[14%] bottom-[16%] z-10 animate-[star-float_3600ms_ease-in-out_infinite] text-3xl text-[#dbeafe] drop-shadow-[0_0_18px_rgba(191,219,254,0.9)] sm:text-4xl">
            ✩
          </div>

          <button
            type="button"
            aria-label="Close member detail"
            onClick={closePopup}
            className="absolute top-4 right-4 z-30 flex h-11 w-11 items-center justify-center rounded-full border border-white/60 bg-white/10 text-2xl leading-none text-white shadow-[0_0_22px_rgba(255,255,255,0.45)] backdrop-blur-md transition hover:bg-white/20"
          >
            ×
          </button>

          <div
            className={`relative z-20 flex w-full max-w-[92vw] items-center justify-center sm:max-w-[720px] ${
              introPhase === 'zooming'
                ? 'animate-[intro-gif-zoom_1000ms_cubic-bezier(0.16,1,0.3,1)_forwards]'
                : ''
            }`}
          >
            <Image
              src={IntroGif}
              alt="Member intro animation"
              unoptimized
              className="max-h-[80dvh] w-full object-contain drop-shadow-[0_0_45px_rgba(255,247,214,0.55)]"
            />
          </div>
        </div>
      ) : (
        <div
          className="member-popup-scroll relative z-10 h-[100dvh] max-h-[100dvh] w-full max-w-[720px] animate-[popup-reveal_700ms_cubic-bezier(0.16,1,0.3,1)_forwards] overflow-y-auto overscroll-contain rounded-[28px] border-2 border-white/60 p-4 text-white shadow-[0_0_60px_rgba(147,197,253,0.42)] sm:p-8"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(13, 35, 64, 0.62), rgba(37, 73, 105, 0.52), rgba(4, 18, 37, 0.72)), url(${BackgroundImage.src})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            scrollbarColor: '#dbeafe55 transparent',
            scrollbarWidth: 'thin'
          }}
        >
          <div className="pointer-events-none absolute inset-0 z-0 rounded-[28px] bg-[radial-gradient(circle_at_18%_14%,rgba(255,247,214,0.2),transparent_25%),radial-gradient(circle_at_85%_35%,rgba(191,219,254,0.18),transparent_30%),radial-gradient(circle_at_50%_100%,rgba(96,165,250,0.16),transparent_38%)]" />

          <div className="pointer-events-none absolute top-7 left-5 z-[70] text-white/90">
            <div className="text-3xl drop-shadow-[0_0_14px_rgba(255,255,255,0.9)]">✧</div>
            <div className="mt-2 text-4xl drop-shadow-[0_0_16px_rgba(255,255,255,0.9)]">☆</div>
            <div className="mt-3 text-2xl drop-shadow-[0_0_12px_rgba(255,255,255,0.85)]">✦</div>
          </div>

          <button
            type="button"
            aria-label="Close member detail"
            onClick={closePopup}
            className="absolute top-4 right-4 z-[90] flex h-11 w-11 items-center justify-center rounded-full border border-[#fff7d6]/70 bg-[#dbeafe]/15 text-2xl leading-none text-[#fff7d6] shadow-[0_0_24px_rgba(255,247,214,0.55)] backdrop-blur-md transition hover:bg-[#fff7d6]/20"
          >
            ×
          </button>

          <div className="relative z-10">
            <div className="mb-5 overflow-hidden rounded-[24px] border border-[#dbeafe]/55 bg-[#dbeafe]/10 shadow-[0_0_34px_rgba(191,219,254,0.38)] backdrop-blur-md">
              <Image src={ProfileImage} alt="Profile Image" className="h-72 w-full object-cover object-center sm:h-120" />
            </div>

            <div className="relative rounded-[24px] border border-[#dbeafe]/45 bg-[#dbeafe]/12 px-4 py-4 pr-10 shadow-[0_0_30px_rgba(147,197,253,0.35)] backdrop-blur-md sm:px-5">
              <h2
                className={`${titleFont.className} text-[clamp(2rem,8vw,3.25rem)] leading-none font-bold tracking-wide text-[#fff7d6] drop-shadow-[0_0_12px_rgba(255,247,214,0.9)]`}
              >
                Sahira Bilqis Rivadito
              </h2>
              <p className="mt-2 text-sm font-extrabold text-[#f8fafc]/90 sm:text-lg">5027251037 - Bekasi</p>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-[18px] border border-[#dbeafe]/45 bg-[#dbeafe]/12 px-4 py-3 shadow-[0_0_24px_rgba(147,197,253,0.34)] backdrop-blur-md transition hover:bg-[#dbeafe]/18">
                <Instagram username="sahirabqs" />
              </div>
              <div className="rounded-[18px] border border-[#dbeafe]/45 bg-[#dbeafe]/12 px-4 py-3 shadow-[0_0_24px_rgba(147,197,253,0.34)] backdrop-blur-md transition hover:bg-[#dbeafe]/18">
                <LinkedInButtonLink username="sahira-rivadito-211611379" />
              </div>
            </div>

            <div className="mt-6 grid gap-4 text-sm font-semibold sm:grid-cols-2">
              <div className="relative flex min-h-[140px] flex-col items-center justify-center overflow-hidden rounded-[22px] border border-[#dbeafe]/45 bg-[#dbeafe]/12 p-5 shadow-[0_0_28px_rgba(147,197,253,0.36)] backdrop-blur-md transition hover:bg-[#dbeafe]/18">
                <p className="absolute top-5 left-5 text-xs font-extrabold tracking-[0.3em] text-[#dbeafe]/75 uppercase">
                  Hobi
                </p>
                <Image
                  src={SleepingCatGif}
                  alt="Sleeping cat"
                  unoptimized
                  className="mt-4 h-20 w-20 object-contain drop-shadow-[0_0_18px_rgba(255,247,214,0.72)]"
                />
              </div>

              <div className="rounded-[22px] border border-[#dbeafe]/45 bg-[#dbeafe]/12 p-5 shadow-[0_0_28px_rgba(147,197,253,0.36)] backdrop-blur-md transition hover:bg-[#dbeafe]/18">
                <p className="text-xs font-extrabold tracking-[0.3em] text-[#dbeafe]/75 uppercase">Fun Fact</p>
                <p className="mt-3 text-lg leading-relaxed font-extrabold text-[#f8fafc]">
                  hidup seputar kucing, biru, nonton, tidur /ᐠ - ˕ -マ
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-[24px] border border-[#dbeafe]/45 bg-[#dbeafe]/12 p-5 shadow-[0_0_32px_rgba(147,197,253,0.4)] backdrop-blur-md transition hover:bg-[#dbeafe]/18">
              <p className="text-xs font-extrabold tracking-[0.3em] text-[#dbeafe]/75 uppercase">Lagu Favorit</p>
              <p
                className={`${titleFont.className} my-2 text-4xl leading-none font-bold tracking-wide text-[#fff7d6] drop-shadow-[0_0_12px_rgba(255,247,214,0.78)]`}
              >
                hidup kokwet yg penting laufey ౨ৎ
              </p>
              <div className="rounded-[20px] border border-[#dbeafe]/20 bg-[#061a33]/70 p-3 shadow-[inset_0_0_24px_rgba(219,234,254,0.08)]">
                <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/43iIQbw5hx986dUEZbr3eN?si=95173f1123ab4b7a" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>,
    document.body
  )
}

export default MemberPopup
