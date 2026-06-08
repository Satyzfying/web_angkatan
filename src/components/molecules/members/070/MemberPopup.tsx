'use client'

import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'

import Image from 'next/image'

import Instagram from '@/components/atoms/button/InstagramButtonLink'
import LinkedInButtonLink from '@/components/atoms/button/LinkedInButtonLink'
import SpotifyEmbed from '@/components/molecules/SpotifyEmbed'

import ProfileImage from './image.jpeg'

type MemberPopupProps = {
  isOpen: boolean
  onClose: () => void
}

const MemberPopup = ({ isOpen, onClose }: MemberPopupProps) => {
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

  if (!isOpen) {
    return null
  }

  return createPortal(
    // PADA BAGIAN INI KAMU BOLEH MENGUBAH STYLE SESUKA HATI KAMU, TAPI JANGAN UBAH STRUKTUR DAN FUNGSI DARI KODE INI AGAR FUNGSI POPUP TETAP BERJALAN DENGAN BAIK
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-hidden px-4">
      <button
        type="button"
        aria-label="Close member detail"
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/85 backdrop-blur-md"
      />

      <div className="relative z-10 h-[100dvh] max-h-[100dvh] w-full max-w-[760px] animate-[member-popup-show_200ms_ease-out] overflow-y-auto rounded-[1.75rem] border-2 border-cyan-300/80 bg-[#08111f] p-5 text-white shadow-[0_0_35px_rgba(34,211,238,0.22),0_24px_80px_rgba(0,0,0,0.55)] sm:h-[100dvh] max-h-[100dvh] sm:p-7">
        <div className="pointer-events-none absolute inset-0 rounded-[1.75rem] bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:22px_22px]" />
        <div className="pointer-events-none absolute -top-24 -right-20 h-64 w-64 rounded-full bg-cyan-400/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-violet-500/15 blur-3xl" />
        <div className="pointer-events-none absolute top-0 left-0 h-1.5 w-full bg-gradient-to-r from-cyan-300 via-violet-400 to-cyan-300" />

        <button
          type="button"
          aria-label="Close member detail"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-200/60 bg-slate-900/80 text-xl leading-none font-black text-cyan-100 shadow-[0_0_16px_rgba(34,211,238,0.22)] transition hover:scale-105 hover:bg-cyan-300 hover:text-slate-950"
        >
          ×
        </button>

        <div className="relative z-10 mb-5 flex flex-wrap items-center gap-2">
          <div className="rounded-xl border border-cyan-300/70 bg-cyan-300 px-3 py-1 text-xs font-black tracking-[0.18em] text-slate-950 uppercase shadow-[3px_3px_0_rgba(0,0,0,0.45)]">
            Player Card
          </div>

          <div className="rounded-xl border border-violet-300/70 bg-violet-500/20 px-3 py-1 text-xs font-black tracking-[0.16em] text-violet-100 uppercase shadow-[3px_3px_0_rgba(0,0,0,0.45)]">
            LV. 070
          </div>
        </div>

        <div className="relative z-10 mb-5 overflow-hidden rounded-[1.35rem] border-2 border-cyan-300/70 bg-slate-900/80 p-2 shadow-[0_0_26px_rgba(34,211,238,0.18)]">
          <div className="pointer-events-none absolute top-0 left-0 z-10 h-full w-full bg-[repeating-linear-gradient(0deg,rgba(255,255,255,0.10)_0px,rgba(255,255,255,0.10)_1px,transparent_2px,transparent_8px)] opacity-20" />

          <div className="overflow-hidden rounded-[1rem] border border-white/10">
            <Image
              src={ProfileImage}
              alt="Profile Image"
              className="h-[340px] w-full rounded-[1rem] object-cover object-[center_70%] contrast-105 saturate-110 transition duration-500 hover:scale-[1.03]"
            />
          </div>
        </div>

        <div className="relative z-10 pr-12">
          {/* UBAH NAMA ANDA */}
          <p className="mb-2 w-fit rounded-lg border border-cyan-300/50 bg-cyan-300/10 px-3 py-1 text-xs font-black tracking-[0.2em] text-cyan-100 uppercase">
            Select Character
          </p>

          <h2 className="text-3xl leading-tight font-black tracking-tight text-white drop-shadow-[0_0_12px_rgba(34,211,238,0.45)] sm:text-4xl">
            Sultan Ahmad Maulana Bahyshidqi
          </h2>

          {/* UBAH NRP DAN ASAL */}
          <p className="mt-3 w-fit rounded-lg border border-violet-300/40 bg-violet-500/15 px-3 py-2 text-sm font-black text-violet-100">
            ID: 5027251070 • Surabaya
          </p>
        </div>

        <div className="relative z-10 mt-5 flex flex-wrap gap-2">
          {/* UBAH USERNAME INSTAGRAM */}
          <Instagram username="sultanahm_ad" />
          {/* UBAH USERNAME LINKEDIN */}
          <LinkedInButtonLink username="sultanbahyshidqi" />
        </div>

        <div className="relative z-10 mt-5 flex flex-wrap gap-2">
          <div className="rounded-full border border-cyan-300/35 bg-cyan-300/10 px-3 py-1.5 text-xs font-black text-cyan-100">
            🏆 Night Coder
          </div>
          <div className="rounded-full border border-violet-300/35 bg-violet-300/10 px-3 py-1.5 text-xs font-black text-violet-100">
            🎧 Music Buff
          </div>
          <div className="rounded-full border border-emerald-300/35 bg-emerald-300/10 px-3 py-1.5 text-xs font-black text-emerald-100">
            🎱 Billiard Rookie
          </div>
        </div>

        <div className="relative z-10 mt-6 grid gap-4 text-sm font-semibold sm:grid-cols-2">
          <div className="rounded-2xl border-2 border-cyan-300/65 bg-slate-900/80 p-5 shadow-[0_0_24px_rgba(34,211,238,0.14)] transition hover:-translate-y-1 hover:border-cyan-200 hover:shadow-[0_0_30px_rgba(34,211,238,0.22)]">
            {/* UBAH HOBI KAMU */}
            <div className="mb-3 flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-200/40 bg-cyan-300/15 text-xl">
                🎮
              </span>
              <p className="text-xs font-black tracking-[0.2em] text-cyan-100 uppercase">Hobi</p>
            </div>

            <div className="grid gap-2">
              <div className="rounded-xl border border-cyan-200/20 bg-cyan-300/10 px-3 py-2 text-sm font-black text-white">
                🎧 Mendengar lagu
              </div>
              <div className="rounded-xl border border-cyan-200/20 bg-cyan-300/10 px-3 py-2 text-sm font-black text-white">
                🍿 Nonton anime
              </div>
              <div className="rounded-xl border border-cyan-200/20 bg-cyan-300/10 px-3 py-2 text-sm font-black text-white">
                🎱 Main billiard
              </div>
            </div>
          </div>

          <div className="rounded-2xl border-2 border-violet-300/65 bg-slate-900/80 p-5 shadow-[0_0_24px_rgba(139,92,246,0.14)] transition hover:-translate-y-1 hover:border-violet-200 hover:shadow-[0_0_30px_rgba(139,92,246,0.22)]">
            {/* UBAH FUNFACT KAMU */}
            <div className="mb-3 flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-200/40 bg-violet-300/15 text-xl">
                ✨
              </span>
              <p className="text-xs font-black tracking-[0.2em] text-violet-100 uppercase">Fun Fact</p>
            </div>

            <div className="grid gap-2">
              <div className="rounded-xl border border-violet-200/20 bg-violet-300/10 px-3 py-2 text-sm font-black text-white">
                🤖 Pelanggan tetap ChatGPT Plus 350k per bulan
              </div>
              <div className="rounded-xl border border-violet-200/20 bg-violet-300/10 px-3 py-2 text-sm font-black text-white">
                🍚 Pagi makan nasi
              </div>
              <div className="rounded-xl border border-violet-200/20 bg-violet-300/10 px-3 py-2 text-sm font-black text-white">
                🥛 Malam minum susu
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-4 rounded-2xl border-2 border-emerald-300/65 bg-slate-900/80 p-5 shadow-[0_0_24px_rgba(52,211,153,0.14)]">
          {/* UBAH LAGU FAVORIT KAMU */}
          <div className="mb-3 flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-200/40 bg-emerald-300/15 text-xl">
              🎵
            </span>
            <div>
              <p className="text-xs font-black tracking-[0.2em] text-emerald-100 uppercase">Lagu Favorit</p>
              <p className="mt-1 text-lg font-black text-white">Rubahlah</p>
            </div>
          </div>

          {/* UBAH URL SPOTIFY KAMU DENGAN LAGU FAVORIT MU */}
          <div className="overflow-hidden rounded-xl border border-emerald-200/25">
            <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/6Dru2lWxzeSTlQUDUUqyrE?si=2ca2066e1f34492c" />
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default MemberPopup