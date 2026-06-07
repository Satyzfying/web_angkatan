'use client'

import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

import Image from 'next/image'
import { Cormorant_Garamond, Nunito } from 'next/font/google'

import Instagram from '@/components/atoms/button/InstagramButtonLink'
import LinkedInButtonLink from '@/components/atoms/button/LinkedInButtonLink'
import SpotifyEmbed from '@/components/molecules/SpotifyEmbed'

import ProfileImage from './image.jpg'
import BackgroundImage from './background.jpg'
import SleepingCatGif from './sleeping_cat_zzz_clean.gif'
import IntroGif from './member-intro.gif'

type MemberPopupProps = {
  isOpen: boolean
  onClose: () => void
}

const titleFont = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['600', '700'],
})

const bodyFont = Nunito({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
})

const MemberPopup = ({ isOpen, onClose }: MemberPopupProps) => {
  const [introPhase, setIntroPhase] = useState<'playing' | 'zooming' | 'done'>('playing')

  useEffect(() => {
    if (!isOpen) {
      return
    }

    setIntroPhase('playing')

    // 0–6 detik: GIF normal
    const zoomTimer = window.setTimeout(() => {
      setIntroPhase('zooming')
    }, 6000)

    // detik ke-7: popup data member muncul
    const doneTimer = window.setTimeout(() => {
      setIntroPhase('done')
    }, 7000)

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
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
  }, [isOpen, onClose])

  if (!isOpen) {
    return null
  }

  return createPortal(
    // PADA BAGIAN INI KAMU BOLEH MENGUBAH STYLE SESUKA HATI KAMU, TAPI JANGAN UBAH STRUKTUR DAN FUNGSI DARI KODE INI AGAR FUNGSI POPUP TETAP BERJALAN DENGAN BAIK
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center overflow-hidden px-3 py-3 sm:px-4 sm:py-8 ${bodyFont.className}`}
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
            opacity: 0.45;
            transform: scale(1);
          }

          50% {
            opacity: 0.85;
            transform: scale(1.08);
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

        .member-popup-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 247, 214, 0.45);
        }
      `}</style>

      <button
        type="button"
        aria-label="Close member detail"
        onClick={onClose}
        className="absolute inset-0 bg-[#020617]/78 backdrop-blur-md"
      />

      {introPhase !== 'done' ? (
        <div className="relative z-20 flex h-full w-full items-center justify-center overflow-hidden">
          <div
            className="absolute inset-0 opacity-95"
            style={{
              backgroundImage: `linear-gradient(135deg, rgba(3, 7, 18, 0.74), rgba(15, 39, 72, 0.7), rgba(3, 7, 18, 0.84)), url(${BackgroundImage.src})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
      <div
        className="relative z-10 h-[100dvh] max-h-[100dvh] w-full max-w-[720px] animate-[member-popup-show_200ms_ease-out] overflow-y-auto rounded-[28px] border-2 border-white/60 p-6 text-white shadow-[0_0_45px_rgba(96,165,250,0.45)] sm:p-8"
        style={{
          backgroundImage: `linear-gradient(rgba(9, 26, 52, 0.35), rgba(9, 26, 52, 0.5)), url(${BackgroundImage.src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="pointer-events-none absolute left-5 top-8 text-white/90">
          <div className="text-2xl drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">✧</div>
          <div className="mt-2 text-3xl drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">☆</div>
          <div className="mt-3 text-xl drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">✦</div>
          <div className="mt-2 text-2xl drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">☆</div>
        </div>

          <div className="pointer-events-none absolute left-[8%] top-[14%] z-10 text-4xl text-[#fff7d6] drop-shadow-[0_0_20px_rgba(255,247,214,0.95)] animate-[star-float_2700ms_ease-in-out_infinite] sm:left-[10%] sm:top-[16%] sm:text-5xl">
            ✦
          </div>

          <div className="pointer-events-none absolute right-[8%] top-[18%] z-10 text-4xl text-[#dbeafe] drop-shadow-[0_0_22px_rgba(191,219,254,0.95)] animate-[star-float_3300ms_ease-in-out_infinite] sm:right-[14%] sm:top-[20%] sm:text-5xl">
            ☆
          </div>

          <div className="pointer-events-none absolute bottom-[18%] left-[12%] z-10 text-3xl text-[#fff7d6] drop-shadow-[0_0_18px_rgba(255,247,214,0.9)] animate-[star-float_3000ms_ease-in-out_infinite] sm:left-[18%] sm:text-4xl">
            ✧
          </div>

          <div className="pointer-events-none absolute bottom-[16%] right-[14%] z-10 text-3xl text-[#dbeafe] drop-shadow-[0_0_18px_rgba(191,219,254,0.9)] animate-[star-float_3600ms_ease-in-out_infinite] sm:right-[20%] sm:text-4xl">
            ✩
          </div>

          <div className="pointer-events-none absolute h-[280px] w-[280px] rounded-full bg-[#dbeafe]/20 blur-3xl animate-[intro-glow-pulse_2800ms_ease-in-out_infinite] sm:h-[420px] sm:w-[420px]" />
        <button
          type="button"
          aria-label="Close member detail"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/60 bg-white/10 text-2xl leading-none text-white shadow-[0_0_22px_rgba(255,255,255,0.45)] backdrop-blur-md transition hover:bg-white/20 hover:shadow-[0_0_30px_rgba(255,255,255,0.7)]"
        >
          ×
        </button>

          <div
            className={`relative z-20 flex w-full max-w-[92vw] items-center justify-center overflow-visible rounded-[24px] bg-transparent sm:max-w-[720px] sm:rounded-[32px] ${
              introPhase === 'zooming'
                ? 'animate-[intro-gif-zoom_1000ms_cubic-bezier(0.16,1,0.3,1)_forwards]'
                : ''
            }`}
          >
            <Image
              src={IntroGif}
              alt="Member intro animation"
              unoptimized
              className="max-h-[70dvh] w-full object-contain drop-shadow-[0_0_35px_rgba(255,247,214,0.5)] sm:max-h-[80dvh] sm:drop-shadow-[0_0_45px_rgba(255,247,214,0.55)]"
            />
          </div>
        </div>
      ) : (
        <div
          className="member-popup-scroll relative z-10 max-h-[calc(100dvh-1.5rem)] w-full max-w-[720px] animate-[popup-reveal_700ms_cubic-bezier(0.16,1,0.3,1)_forwards] overflow-y-auto rounded-[24px] border border-[#dbeafe]/55 p-4 text-white shadow-[0_0_45px_rgba(147,197,253,0.38)] sm:max-h-[calc(100vh-4rem)] sm:rounded-[30px] sm:p-8 sm:shadow-[0_0_60px_rgba(147,197,253,0.42)]"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(13, 35, 64, 0.62), rgba(37, 73, 105, 0.52), rgba(4, 18, 37, 0.72)), url(${BackgroundImage.src})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            scrollbarWidth: 'thin',
            scrollbarColor: '#dbeafe55 transparent',
          }}
        >
          <div className="pointer-events-none absolute inset-0 z-0 rounded-[24px] bg-[radial-gradient(circle_at_18%_14%,rgba(255,247,214,0.2),transparent_25%),radial-gradient(circle_at_85%_35%,rgba(191,219,254,0.18),transparent_30%),radial-gradient(circle_at_50%_100%,rgba(96,165,250,0.16),transparent_38%)] sm:rounded-[30px]" />

          <div className="pointer-events-none absolute left-4 top-6 z-[70] text-white/90 sm:left-5 sm:top-7">
            <div className="text-2xl drop-shadow-[0_0_14px_rgba(255,255,255,0.9)] sm:text-3xl">✧</div>
            <div className="mt-2 text-3xl drop-shadow-[0_0_16px_rgba(255,255,255,0.9)] sm:text-4xl">☆</div>
            <div className="mt-3 text-xl drop-shadow-[0_0_12px_rgba(255,255,255,0.85)] sm:text-2xl">✦</div>
          </div>

          <div className="pointer-events-none absolute right-6 top-4 z-[70] text-white/95 sm:right-7 sm:top-5">
            <div className="text-4xl drop-shadow-[0_0_18px_rgba(255,255,255,0.95)] sm:text-5xl">☆</div>
          </div>

          <div className="pointer-events-none absolute bottom-7 left-4 z-[70] text-white/90 sm:bottom-8 sm:left-5">
            <div className="text-4xl drop-shadow-[0_0_18px_rgba(255,255,255,0.9)] sm:text-5xl">✩</div>
          </div>

          <div className="pointer-events-none absolute bottom-8 right-5 z-[70] text-white/90 sm:bottom-10 sm:right-7">
            <div className="text-3xl drop-shadow-[0_0_16px_rgba(255,255,255,0.9)] sm:text-4xl">☆</div>
          </div>

          <button
            type="button"
            aria-label="Close member detail"
            onClick={onClose}
            className="absolute top-3 right-3 z-[90] flex h-10 w-10 items-center justify-center rounded-full border border-[#fff7d6]/70 bg-[#dbeafe]/15 text-xl leading-none text-[#fff7d6] shadow-[0_0_22px_rgba(255,247,214,0.5)] backdrop-blur-md transition hover:bg-[#fff7d6]/20 hover:shadow-[0_0_34px_rgba(255,247,214,0.85)] sm:top-4 sm:right-4 sm:h-11 sm:w-11 sm:text-2xl"
          >
            ×
          </button>

          <div className="relative z-10">
            <div className="mb-4 overflow-hidden rounded-[20px] border border-[#dbeafe]/55 bg-[#dbeafe]/10 shadow-[0_0_28px_rgba(191,219,254,0.34)] backdrop-blur-md sm:mb-5 sm:rounded-[24px] sm:shadow-[0_0_34px_rgba(191,219,254,0.38)]">
              <Image
                src={ProfileImage}
                alt="Profile Image"
                className="h-72 w-full object-cover object-center sm:h-120"
              />
            </div>

            <div className="relative rounded-[20px] border border-[#dbeafe]/45 bg-[#dbeafe]/12 px-4 py-4 pr-8 shadow-[0_0_26px_rgba(147,197,253,0.35)] backdrop-blur-md sm:rounded-[24px] sm:px-5 sm:pr-10 sm:shadow-[0_0_30px_rgba(147,197,253,0.35)]">
              {/* UBAH NAMA ANDA */}
              <h2
                className={`${titleFont.className} whitespace-nowrap text-[clamp(1.55rem,7vw,3.25rem)] font-bold leading-none tracking-wide text-[#fff7d6] drop-shadow-[0_0_12px_rgba(255,247,214,0.9)]`}
              >
                <span className="text-[clamp(2.1rem,9vw,4.55rem)] italic leading-none drop-shadow-[0_0_16px_rgba(255,247,214,0.95)]">
                  S
                </span>
                ahira{' '}
                <span className="text-[clamp(2.1rem,9vw,4.55rem)] italic leading-none drop-shadow-[0_0_16px_rgba(255,247,214,0.95)]">
                  B
                </span>
                ilqis{' '}
                <span className="text-[clamp(2.1rem,9vw,4.55rem)] italic leading-none drop-shadow-[0_0_16px_rgba(255,247,214,0.95)]">
                  R
                </span>
                ivadito
              </h2>

              {/* UBAH NRP DAN ASAL */}
              <p className="mt-1 text-sm font-extrabold text-[#f8fafc]/90 sm:text-lg">5027251037 - Bekasi</p>
            </div>

            <div className="mt-4 grid gap-3 sm:mt-5 sm:grid-cols-2">
              <div className="rounded-[18px] border border-[#dbeafe]/45 bg-[#dbeafe]/12 px-4 py-3 shadow-[0_0_24px_rgba(147,197,253,0.34)] backdrop-blur-md transition hover:bg-[#dbeafe]/18 hover:shadow-[0_0_32px_rgba(191,219,254,0.58)]">
                {/* UBAH USERNAME INSTAGRAM */}
                <Instagram username="sahirabqs" />
              </div>

              <div className="rounded-[18px] border border-[#dbeafe]/45 bg-[#dbeafe]/12 px-4 py-3 shadow-[0_0_24px_rgba(147,197,253,0.34)] backdrop-blur-md transition hover:bg-[#dbeafe]/18 hover:shadow-[0_0_32px_rgba(191,219,254,0.58)]">
                {/* UBAH USERNAME LINKEDIN */}
                <LinkedInButtonLink username="sahira-rivadito-211611379" />
              </div>
            </div>

            <div className="mt-5 grid gap-3 text-sm font-semibold sm:mt-6 sm:grid-cols-2 sm:gap-4">
              <div className="relative flex min-h-[120px] flex-col items-center justify-center overflow-hidden rounded-[20px] border border-[#dbeafe]/45 bg-[#dbeafe]/12 p-4 shadow-[0_0_24px_rgba(147,197,253,0.34)] backdrop-blur-md transition hover:scale-[1.01] hover:bg-[#dbeafe]/18 hover:shadow-[0_0_34px_rgba(191,219,254,0.58)] sm:min-h-[140px] sm:rounded-[22px] sm:p-5">
                {/* UBAH HOBI KAMU */}
                <p className="absolute left-4 top-4 text-xs font-extrabold tracking-[0.3em] uppercase text-[#dbeafe]/75 sm:left-5 sm:top-5">
                  Hobi
                </p>

                <Image
                  src={SleepingCatGif}
                  alt="Sleeping cat"
                  unoptimized
                  className="mt-4 h-16 w-16 object-contain drop-shadow-[0_0_16px_rgba(255,247,214,0.68)] sm:h-20 sm:w-20 sm:drop-shadow-[0_0_18px_rgba(255,247,214,0.72)]"
                />
              </div>

              <div className="relative rounded-[20px] border border-[#dbeafe]/45 bg-[#dbeafe]/12 p-4 shadow-[0_0_24px_rgba(147,197,253,0.34)] backdrop-blur-md transition hover:scale-[1.01] hover:bg-[#dbeafe]/18 hover:shadow-[0_0_34px_rgba(191,219,254,0.58)] sm:rounded-[22px] sm:p-5">
                {/* UBAH FUNFACT KAMU */}
                <p className="text-xs font-extrabold tracking-[0.3em] uppercase text-[#dbeafe]/75">Fun Fact</p>
                <p className="mt-3 text-base font-extrabold leading-relaxed text-[#f8fafc] sm:text-lg">
                  hidup seputar kucing, biru, nonton, tidur /ᐠ - ˕ -マ
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-[20px] border border-[#dbeafe]/45 bg-[#dbeafe]/12 p-4 shadow-[0_0_28px_rgba(147,197,253,0.38)] backdrop-blur-md transition hover:bg-[#dbeafe]/18 hover:shadow-[0_0_38px_rgba(191,219,254,0.64)] sm:rounded-[24px] sm:p-5 sm:shadow-[0_0_32px_rgba(147,197,253,0.4)] sm:hover:shadow-[0_0_42px_rgba(191,219,254,0.68)]">
              {/* UBAH LAGU FAVORIT KAMU */}
              <p className="text-xs font-extrabold tracking-[0.3em] uppercase text-[#dbeafe]/75">Lagu Favorit</p>
              <p
                className={`${titleFont.className} my-2 text-[1.9rem] font-bold leading-tight tracking-wide text-[#fff7d6] drop-shadow-[0_0_12px_rgba(255,247,214,0.78)] sm:text-4xl sm:leading-none`}
              >
                hidup kokwet yg penting laufey ౨ৎ
              </p>

              <div className="rounded-[18px] border border-[#dbeafe]/20 bg-[#061a33]/70 p-2 shadow-[inset_0_0_24px_rgba(219,234,254,0.08)] sm:rounded-[20px] sm:p-3">
                {/* UBAH URL SPOTIFY KAMU DENGAN LAGU FAVORIT MU */}
                <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/43iIQbw5hx986dUEZbr3eN?si=95173f1123ab4b7a" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>

        <div className="mt-4 rounded-[22px] border border-white/45 bg-white/10 p-5 shadow-[0_0_28px_rgba(147,197,253,0.5)] backdrop-blur-md transition hover:bg-white/15 hover:shadow-[0_0_38px_rgba(191,219,254,0.7)]">
          {/* UBAH LAGU FAVORIT KAMU */}
          <p className="text-xs font-bold tracking-[0.28em] uppercase text-white/70">Lagu Favorit</p>
          <p
            className={`${titleFont.className} my-2 text-4xl font-bold leading-none tracking-wide text-[#f7edc8] drop-shadow-[0_0_10px_rgba(255,255,255,0.7)]`}
          >
            From The Start
          </p>

          <div className="rounded-[18px] border border-white/20 bg-[#0b2343]/60 p-3 shadow-[inset_0_0_20px_rgba(255,255,255,0.06)]">
            {/* UBAH URL SPOTIFY KAMU DENGAN LAGU FAVORIT MU */}
            <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/43iIQbw5hx986dUEZbr3eN?si=95173f1123ab4b7a" />
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default MemberPopup
