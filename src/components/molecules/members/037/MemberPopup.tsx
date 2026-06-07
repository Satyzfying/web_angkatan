'use client'

import React, { useEffect, useState } from 'react'
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

    setIntroPhase('playing')

    const zoomTimer = window.setTimeout(() => {
      setIntroPhase('zooming')
    }, 6000)

    const doneTimer = window.setTimeout(() => {
      setIntroPhase('done')
    }, 7000)

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

  return (
    // PADA BAGIAN INI KAMU BOLEH MENGUBAH STYLE SESUKA HATI KAMU, TAPI JANGAN UBAH STRUKTUR DAN FUNGSI DARI KODE INI AGAR FUNGSI POPUP TETAP BERJALAN DENGAN BAIK
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

        @keyframes intro-glow-pulse {
          0%,
          100% {
            opacity: 0.5;
            transform: scale(1);
          }

          50% {
            opacity: 0.95;
            transform: scale(1.09);
          }
        }

        @keyframes star-float {
          0%,
          100% {
            transform: translateY(0) scale(1) rotate(0deg);
            opacity: 0.72;
          }
          50% {
            transform: translateY(-12px) scale(1.15) rotate(8deg);
            opacity: 1;
          }
        }

        @keyframes side-float-soft {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
            opacity: 0.7;
          }

          50% {
            transform: translateY(-12px) rotate(5deg);
            opacity: 1;
          }
        }

        @keyframes glow-twinkle {
          0%,
          100% {
            opacity: 0.58;
            transform: scale(1) rotate(0deg);
          }

          50% {
            opacity: 1;
            transform: scale(1.18) rotate(8deg);
          }
        }

        @keyframes ribbon-sway {
          0%,
          100% {
            transform: translateY(0) rotate(-8deg);
            opacity: 0.75;
          }

          50% {
            transform: translateY(-10px) rotate(8deg);
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
          background: rgba(255, 239, 179, 0.45);
          border-radius: 999px;
        }

        .member-popup-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 239, 179, 0.7);
        }
      `}</style>

      <button
        type="button"
        aria-label="Close member detail"
        onClick={onClose}
        className="absolute inset-0 bg-[#020617]/80 backdrop-blur-md"
      />

      {introPhase !== 'done' ? (
        <div className="relative z-20 flex h-full w-full items-center justify-center overflow-hidden">
          <div
            className="absolute inset-0 opacity-95"
            style={{
              backgroundImage: `linear-gradient(135deg, rgba(3, 7, 18, 0.76), rgba(15, 39, 72, 0.72), rgba(3, 7, 18, 0.86)), url(${BackgroundImage.src})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundSize: 'cover'
            }}
          />

          <div className="pointer-events-none absolute left-[8%] top-[14%] z-10 text-4xl text-[#ffefb3] drop-shadow-[0_0_18px_rgba(255,239,179,0.95)] animate-[star-float_2700ms_ease-in-out_infinite] sm:left-[10%] sm:top-[16%] sm:text-5xl">
            ✦
          </div>

          <div className="pointer-events-none absolute right-[8%] top-[18%] z-10 text-4xl text-[#ffefb3] drop-shadow-[0_0_18px_rgba(255,239,179,0.95)] animate-[star-float_3300ms_ease-in-out_infinite] sm:right-[14%] sm:top-[20%] sm:text-5xl">
            ☆
          </div>

          <div className="pointer-events-none absolute bottom-[18%] left-[12%] z-10 text-3xl text-[#ffefb3] drop-shadow-[0_0_18px_rgba(255,239,179,0.95)] animate-[star-float_3000ms_ease-in-out_infinite] sm:left-[18%] sm:text-4xl">
            ୨ৎ
          </div>

          <div className="pointer-events-none absolute bottom-[16%] right-[14%] z-10 text-3xl text-[#ffefb3] drop-shadow-[0_0_18px_rgba(255,239,179,0.95)] animate-[star-float_3600ms_ease-in-out_infinite] sm:right-[20%] sm:text-4xl">
            ❀
          </div>

          <div className="pointer-events-none absolute h-[280px] w-[280px] rounded-full bg-[#ffefb3]/20 blur-3xl animate-[intro-glow-pulse_2800ms_ease-in-out_infinite] sm:h-[420px] sm:w-[420px]" />

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
              className="max-h-[70dvh] w-full object-contain drop-shadow-[0_0_38px_rgba(255,239,179,0.62)] sm:max-h-[80dvh] sm:drop-shadow-[0_0_50px_rgba(255,239,179,0.72)]"
            />
          </div>
        </div>
      ) : (
        <>
          {/* ORNAMEN KIRI DESKTOP - DIBUAT MENCAR */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-[35] hidden w-[260px] lg:block">
            <div className="absolute left-8 top-[8%] text-3xl text-[#ffefb3] drop-shadow-[0_0_18px_rgba(255,239,179,0.95)] animate-[side-float-soft_3600ms_ease-in-out_infinite]">
              ✧
            </div>
            <div className="absolute left-28 top-[13%] text-5xl text-[#ffefb3] drop-shadow-[0_0_22px_rgba(255,239,179,0.95)] animate-[glow-twinkle_2500ms_ease-in-out_infinite]">
              ☆
            </div>
            <div className="absolute left-14 top-[24%] text-4xl text-[#ffefb3] drop-shadow-[0_0_20px_rgba(255,239,179,0.95)] animate-[ribbon-sway_3300ms_ease-in-out_infinite]">
              ୨ৎ
            </div>
            <div className="absolute left-36 top-[34%] text-3xl text-[#ffefb3] drop-shadow-[0_0_18px_rgba(255,239,179,0.95)] animate-[glow-twinkle_2800ms_ease-in-out_infinite]">
              ✦
            </div>
            <div className="absolute left-6 top-[44%] text-4xl text-[#ffefb3] drop-shadow-[0_0_18px_rgba(255,239,179,0.95)] animate-[side-float-soft_3400ms_ease-in-out_infinite]">
              ❀
            </div>
            <div className="absolute left-32 top-[55%] text-4xl text-[#ffefb3] drop-shadow-[0_0_20px_rgba(255,239,179,0.95)] animate-[glow-twinkle_3000ms_ease-in-out_infinite]">
              🐾
            </div>
            <div className="absolute left-12 top-[66%] text-4xl text-[#ffefb3] drop-shadow-[0_0_20px_rgba(255,239,179,0.95)] animate-[side-float-soft_3900ms_ease-in-out_infinite]">
              🐈
            </div>
            <div className="absolute left-40 top-[76%] text-5xl text-[#ffefb3] drop-shadow-[0_0_22px_rgba(255,239,179,0.95)] animate-[ribbon-sway_3600ms_ease-in-out_infinite]">
              ୨ৎ
            </div>
            <div className="absolute left-20 top-[88%] text-3xl text-[#ffefb3] drop-shadow-[0_0_18px_rgba(255,239,179,0.95)] animate-[glow-twinkle_2600ms_ease-in-out_infinite]">
              ✩
            </div>
          </div>

          {/* ORNAMEN KANAN DESKTOP - DIBUAT MENCAR */}
          <div className="pointer-events-none absolute inset-y-0 right-0 z-[35] hidden w-[260px] lg:block">
            <div className="absolute right-12 top-[7%] text-5xl text-[#ffefb3] drop-shadow-[0_0_22px_rgba(255,239,179,0.95)] animate-[glow-twinkle_2600ms_ease-in-out_infinite]">
              ☆
            </div>
            <div className="absolute right-36 top-[16%] text-3xl text-[#ffefb3] drop-shadow-[0_0_18px_rgba(255,239,179,0.95)] animate-[side-float-soft_3500ms_ease-in-out_infinite]">
              ✦
            </div>
            <div className="absolute right-18 top-[27%] text-5xl text-[#ffefb3] drop-shadow-[0_0_22px_rgba(255,239,179,0.95)] animate-[ribbon-sway_3400ms_ease-in-out_infinite]">
              ୨ৎ
            </div>
            <div className="absolute right-40 top-[38%] text-4xl text-[#ffefb3] drop-shadow-[0_0_20px_rgba(255,239,179,0.95)] animate-[glow-twinkle_2900ms_ease-in-out_infinite]">
              ❀
            </div>
            <div className="absolute right-8 top-[50%] text-3xl text-[#ffefb3] drop-shadow-[0_0_18px_rgba(255,239,179,0.95)] animate-[side-float-soft_4000ms_ease-in-out_infinite]">
              ✧
            </div>
            <div className="absolute right-34 top-[60%] text-4xl text-[#ffefb3] drop-shadow-[0_0_20px_rgba(255,239,179,0.95)] animate-[glow-twinkle_2700ms_ease-in-out_infinite]">
              🐾
            </div>
            <div className="absolute right-14 top-[70%] text-4xl text-[#ffefb3] drop-shadow-[0_0_20px_rgba(255,239,179,0.95)] animate-[side-float-soft_3800ms_ease-in-out_infinite]">
              🐱
            </div>
            <div className="absolute right-40 top-[82%] text-4xl text-[#ffefb3] drop-shadow-[0_0_20px_rgba(255,239,179,0.95)] animate-[ribbon-sway_3600ms_ease-in-out_infinite]">
              ୨ৎ
            </div>
            <div className="absolute right-10 top-[91%] text-3xl text-[#ffefb3] drop-shadow-[0_0_18px_rgba(255,239,179,0.95)] animate-[glow-twinkle_3000ms_ease-in-out_infinite]">
              ✩
            </div>
          </div>

          <div
            className="member-popup-scroll relative z-10 max-h-[calc(100dvh-1.5rem)] w-full max-w-[720px] animate-[popup-reveal_700ms_cubic-bezier(0.16,1,0.3,1)_forwards] overflow-y-auto rounded-[24px] border border-[#ffefb3]/45 p-4 text-white shadow-[0_0_48px_rgba(255,239,179,0.28)] sm:max-h-[calc(100vh-4rem)] sm:rounded-[30px] sm:p-8 sm:shadow-[0_0_65px_rgba(255,239,179,0.34)]"
            style={{
              backgroundImage: `linear-gradient(135deg, rgba(13, 35, 64, 0.68), rgba(45, 79, 115, 0.52), rgba(4, 18, 37, 0.78)), url(${BackgroundImage.src})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              scrollbarWidth: 'thin',
              scrollbarColor: '#ffefb355 transparent',
            }}
          >
            <div className="pointer-events-none absolute inset-0 z-0 rounded-[24px] bg-[radial-gradient(circle_at_18%_14%,rgba(255,239,179,0.18),transparent_25%),radial-gradient(circle_at_85%_35%,rgba(255,239,179,0.14),transparent_30%),radial-gradient(circle_at_50%_100%,rgba(255,239,179,0.1),transparent_38%)] sm:rounded-[30px]" />

            {/* Ornamen di dalam modal */}
            <div className="pointer-events-none absolute left-4 top-6 z-[70] text-[#ffefb3] sm:left-5 sm:top-7">
              <div className="text-2xl drop-shadow-[0_0_14px_rgba(255,239,179,0.95)] sm:text-3xl">✧</div>
              <div className="mt-2 text-3xl drop-shadow-[0_0_16px_rgba(255,239,179,0.95)] sm:text-4xl">☆</div>
              <div className="mt-3 text-xl drop-shadow-[0_0_12px_rgba(255,239,179,0.95)] sm:text-2xl">✦</div>
            </div>

            <div className="pointer-events-none absolute right-6 top-4 z-[70] text-[#ffefb3] sm:right-7 sm:top-5">
              <div className="text-4xl drop-shadow-[0_0_18px_rgba(255,239,179,0.95)] sm:text-5xl">☆</div>
            </div>

            <div className="pointer-events-none absolute bottom-7 left-4 z-[70] text-[#ffefb3] sm:bottom-8 sm:left-5">
              <div className="text-4xl drop-shadow-[0_0_18px_rgba(255,239,179,0.95)] sm:text-5xl">୨ৎ</div>
            </div>

            <div className="pointer-events-none absolute bottom-8 right-5 z-[70] text-[#ffefb3] sm:bottom-10 sm:right-7">
              <div className="text-3xl drop-shadow-[0_0_16px_rgba(255,239,179,0.95)] sm:text-4xl">❀</div>
            </div>

            <button
              type="button"
              aria-label="Close member detail"
              onClick={onClose}
              className="absolute top-3 right-3 z-[90] flex h-10 w-10 items-center justify-center rounded-full border border-[#ffefb3]/75 bg-[#ffefb3]/12 text-xl leading-none text-[#ffefb3] shadow-[0_0_26px_rgba(255,239,179,0.5)] backdrop-blur-md transition hover:bg-[#ffefb3]/18 hover:shadow-[0_0_38px_rgba(255,239,179,0.85)] sm:top-4 sm:right-4 sm:h-11 sm:w-11 sm:text-2xl"
            >
              ×
            </button>

            <div className="relative z-10">
              <div className="relative mb-4 overflow-hidden rounded-[20px] border border-[#ffefb3]/45 bg-[rgba(91,133,182,0.16)] shadow-[0_0_30px_rgba(255,239,179,0.22)] backdrop-blur-md sm:mb-5 sm:rounded-[24px] sm:shadow-[0_0_36px_rgba(255,239,179,0.26)]">
                <div className="pointer-events-none absolute left-3 top-3 z-10 text-xl text-[#ffefb3] drop-shadow-[0_0_12px_rgba(255,239,179,0.95)]">
                  ✦
                </div>

                <div className="pointer-events-none absolute right-4 top-3 z-10 text-2xl text-[#ffefb3] drop-shadow-[0_0_14px_rgba(255,239,179,0.95)]">
                  ୨ৎ
                </div>

                <Image
                  src={ProfileImage}
                  alt="Profile Image"
                  className="h-72 w-full object-cover object-center sm:h-120"
                />
              </div>

              <div className="relative rounded-[20px] border border-[#ffefb3]/40 bg-[rgba(91,133,182,0.16)] px-4 py-4 pr-8 shadow-[0_0_28px_rgba(255,239,179,0.22)] backdrop-blur-md sm:rounded-[24px] sm:px-5 sm:pr-10 sm:shadow-[0_0_32px_rgba(255,239,179,0.26)]">
                <div className="pointer-events-none absolute -top-3 right-5 text-3xl text-[#ffefb3] drop-shadow-[0_0_14px_rgba(255,239,179,0.95)]">
                  ☆
                </div>

                <div className="pointer-events-none absolute -top-3 left-5 text-2xl text-[#ffefb3] drop-shadow-[0_0_12px_rgba(255,239,179,0.95)]">
                  ୨ৎ
                </div>

                {/* UBAH NAMA ANDA */}
                <h2
                  className={`${titleFont.className} whitespace-nowrap text-[clamp(1.55rem,7vw,3.25rem)] font-bold leading-none tracking-wide text-[#fff5d0] drop-shadow-[0_0_14px_rgba(255,239,179,0.98)]`}
                >
                  <span className="text-[clamp(2.1rem,9vw,4.55rem)] italic leading-none drop-shadow-[0_0_16px_rgba(255,239,179,0.98)]">
                    S
                  </span>
                  ahira{' '}
                  <span className="text-[clamp(2.1rem,9vw,4.55rem)] italic leading-none drop-shadow-[0_0_16px_rgba(255,239,179,0.98)]">
                    B
                  </span>
                  ilqis{' '}
                  <span className="text-[clamp(2.1rem,9vw,4.55rem)] italic leading-none drop-shadow-[0_0_16px_rgba(255,239,179,0.98)]">
                    R
                  </span>
                  ivadito
                </h2>

                {/* UBAH NRP DAN ASAL */}
                <p className="mt-1 text-sm font-extrabold text-[#f8fafc]/92 sm:text-lg">5027251037 - Bekasi</p>
              </div>

              <div className="mt-4 grid gap-3 sm:mt-5 sm:grid-cols-2">
                <div className="relative rounded-[18px] border border-[#ffefb3]/35 bg-[rgba(91,133,182,0.16)] px-4 py-3 shadow-[0_0_24px_rgba(255,239,179,0.18)] backdrop-blur-md transition hover:bg-[rgba(91,133,182,0.22)] hover:shadow-[0_0_32px_rgba(255,239,179,0.28)]">
                  <div className="pointer-events-none absolute -top-3 left-4 text-2xl text-[#ffefb3] drop-shadow-[0_0_12px_rgba(255,239,179,0.95)]">
                    ୨ৎ
                  </div>
                  {/* UBAH USERNAME INSTAGRAM */}
                  <Instagram username="sahirabqs" />
                </div>

                <div className="relative rounded-[18px] border border-[#ffefb3]/35 bg-[rgba(91,133,182,0.16)] px-4 py-3 shadow-[0_0_24px_rgba(255,239,179,0.18)] backdrop-blur-md transition hover:bg-[rgba(91,133,182,0.22)] hover:shadow-[0_0_32px_rgba(255,239,179,0.28)]">
                  <div className="pointer-events-none absolute -top-3 right-4 text-2xl text-[#ffefb3] drop-shadow-[0_0_12px_rgba(255,239,179,0.95)]">
                    ✦
                  </div>
                  {/* UBAH USERNAME LINKEDIN */}
                  <LinkedInButtonLink username="sahira-rivadito-211611379" />
                </div>
              </div>

              <div className="mt-5 grid gap-3 text-sm font-semibold sm:mt-6 sm:grid-cols-2 sm:gap-4">
                <div className="relative flex min-h-[148px] flex-col items-center justify-center overflow-hidden rounded-[20px] border border-[#ffefb3]/35 bg-[rgba(91,133,182,0.16)] p-4 shadow-[0_0_26px_rgba(255,239,179,0.18)] backdrop-blur-md transition hover:scale-[1.01] hover:bg-[rgba(91,133,182,0.22)] hover:shadow-[0_0_36px_rgba(255,239,179,0.28)] sm:min-h-[168px] sm:rounded-[22px] sm:p-5">
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,239,179,0.14),transparent_42%)]" />

                  <div className="pointer-events-none absolute -top-3 left-4 text-2xl text-[#ffefb3] drop-shadow-[0_0_12px_rgba(255,239,179,0.95)]">
                    ☆
                  </div>

                  <div className="pointer-events-none absolute right-4 top-4 text-xl text-[#ffefb3] drop-shadow-[0_0_12px_rgba(255,239,179,0.95)]">
                    ✦
                  </div>

                  {/* UBAH HOBI KAMU */}
                  <p className="absolute left-4 top-4 text-xs font-extrabold tracking-[0.3em] uppercase text-[#ffefb3]/85 sm:left-5 sm:top-5">
                    Hobi
                  </p>

                  <Image
                    src={SleepingCatGif}
                    alt="Sleeping cat"
                    unoptimized
                    className="relative z-10 mt-5 h-20 w-20 object-contain drop-shadow-[0_0_18px_rgba(255,239,179,0.88)] sm:h-24 sm:w-24 sm:drop-shadow-[0_0_22px_rgba(255,239,179,0.92)]"
                  />
                </div>

                <div className="relative rounded-[20px] border border-[#ffefb3]/35 bg-[rgba(91,133,182,0.16)] p-4 shadow-[0_0_24px_rgba(255,239,179,0.18)] backdrop-blur-md transition hover:scale-[1.01] hover:bg-[rgba(91,133,182,0.22)] hover:shadow-[0_0_34px_rgba(255,239,179,0.28)] sm:rounded-[22px] sm:p-5">
                  <div className="pointer-events-none absolute -top-3 right-4 text-2xl text-[#ffefb3] drop-shadow-[0_0_12px_rgba(255,239,179,0.95)]">
                    ୨ৎ
                  </div>

                  <div className="pointer-events-none absolute bottom-4 right-4 text-2xl text-[#ffefb3] drop-shadow-[0_0_12px_rgba(255,239,179,0.95)]">
                    ❀
                  </div>

                  {/* UBAH FUNFACT KAMU */}
                  <p className="text-xs font-extrabold tracking-[0.3em] uppercase text-[#ffefb3]/85">Fun Fact</p>
                  <p className="mt-3 text-base font-extrabold leading-relaxed text-[#f8fafc] sm:text-lg">
                    hidup seputar kucing, biru, nonton, tidur /ᐠ - ˕ -マ
                  </p>
                </div>
              </div>

              <div className="relative mt-4 rounded-[20px] border border-[#ffefb3]/35 bg-[rgba(91,133,182,0.16)] p-4 shadow-[0_0_28px_rgba(255,239,179,0.2)] backdrop-blur-md transition hover:bg-[rgba(91,133,182,0.22)] hover:shadow-[0_0_40px_rgba(255,239,179,0.3)] sm:rounded-[24px] sm:p-5 sm:shadow-[0_0_34px_rgba(255,239,179,0.22)] sm:hover:shadow-[0_0_44px_rgba(255,239,179,0.32)]">
                <div className="pointer-events-none absolute -top-3 right-5 text-2xl text-[#ffefb3] drop-shadow-[0_0_12px_rgba(255,239,179,0.95)]">
                  ❀
                </div>

                <div className="pointer-events-none absolute -top-3 left-5 text-2xl text-[#ffefb3] drop-shadow-[0_0_12px_rgba(255,239,179,0.95)]">
                  ୨ৎ
                </div>

                {/* UBAH LAGU FAVORIT KAMU */}
                <p className="text-xs font-extrabold tracking-[0.3em] uppercase text-[#ffefb3]/85">Lagu Favorit</p>
                <p
                  className={`${titleFont.className} my-2 text-[1.9rem] font-bold leading-tight tracking-wide text-[#fff5d0] drop-shadow-[0_0_14px_rgba(255,239,179,0.98)] sm:text-4xl sm:leading-none`}
                >
                  hidup mati kokwet laufey ౨ৎ
                </p>

                <div className="rounded-[18px] border border-[#ffefb3]/18 bg-[#061a33]/72 p-2 shadow-[inset_0_0_24px_rgba(255,239,179,0.06)] sm:rounded-[20px] sm:p-3">
                  {/* UBAH URL SPOTIFY KAMU DENGAN LAGU FAVORIT MU */}
                  <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/43iIQbw5hx986dUEZbr3eN?si=95173f1123ab4b7a" />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default MemberPopup
