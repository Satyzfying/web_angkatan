'use client'

import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'

import Image from 'next/image'

import Instagram from '@/components/atoms/button/InstagramButtonLink'
import LinkedInButtonLink from '@/components/atoms/button/LinkedInButtonLink'
import SpotifyEmbed from '@/components/molecules/SpotifyEmbed'

import ProfileImage from './ndr.jpeg'

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
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto px-4">
      <button
        type="button"
        aria-label="Close member detail"
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
      />

      <div className="relative z-10 max-h-[calc(100vh-8rem)] w-full max-w-[780px] animate-[member-popup-show_200ms_ease-out] overflow-y-auto rounded-[1.7rem] border border-[#8B0000] bg-[#0D0D0D] p-5 text-[#E0CBA8] shadow-[0_0_45px_rgba(139,0,0,0.65)] sm:max-h-[calc(100vh-9rem)] sm:p-7">
        <div className="pointer-events-none absolute inset-0 rounded-[1.7rem] bg-[radial-gradient(circle_at_top_left,rgba(211,47,47,0.22),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(139,0,0,0.28),transparent_40%)]" />
        <div className="pointer-events-none absolute inset-0 rounded-[1.7rem] opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:28px_28px]" />

        <button
          type="button"
          aria-label="Close member detail"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-md border border-[#D32F2F] bg-[#8B0000] text-2xl font-black leading-none text-white shadow-[0_0_18px_rgba(211,47,47,0.5)] transition hover:scale-105 hover:bg-[#D32F2F]"
        >
          ×
        </button>

        <div className="relative z-10 grid gap-6 md:grid-cols-[280px_1fr]">
          <div className="relative">
            <div className="absolute -top-3 -left-3 z-20 h-10 w-24 rotate-[-12deg] bg-[#E0CBA8]/80 shadow-md" />
            <div className="absolute -right-3 -bottom-3 z-20 h-10 w-24 rotate-[-10deg] bg-[#E0CBA8]/80 shadow-md" />

            <div className="overflow-hidden rounded-sm border-4 border-[#E0CBA8] bg-black shadow-[0_0_28px_rgba(139,0,0,0.6)]">
              <Image
                src={ProfileImage}
                alt="Profile Image"
                className="h-[440px] w-full object-cover object-center grayscale-[25%] contrast-125 saturate-75"
              />
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <div className="mb-3 inline-flex w-fit items-center rounded-sm bg-[#8B0000] px-3 py-1 text-xs font-black tracking-[0.3em] text-[#E0CBA8] uppercase shadow-[0_0_14px_rgba(139,0,0,0.6)]">
              PROFESSOR&apos;S PICK
            </div>

            <div className="relative">
              <p className="absolute -right-1 -top-8 hidden text-[120px] leading-none font-black text-white/5 md:block">
                🎭
              </p>

              <h2 className="text-5xl leading-[0.9] font-black tracking-tight text-[#E8E1D1] uppercase drop-shadow-[0_0_10px_rgba(211,47,47,0.35)] sm:text-6xl">
                NDARU
                <br />
                SATRIA <span className="bg-[#D32F2F] px-2 text-white">TAMA</span>
              </h2>

              <p className="mt-4 inline-block rounded-sm bg-[#E0CBA8] px-3 py-1 text-sm font-black tracking-[0.12em] text-black uppercase">
                5027251124 - BANJARBARU
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <div className="rounded-sm border border-[#D32F2F] bg-black/60 p-1 shadow-[0_0_16px_rgba(211,47,47,0.28)] transition hover:scale-[1.02]">
                <Instagram username="ndarutama_18" />
              </div>

              <div className="rounded-sm border border-[#E0CBA8]/50 bg-black/60 p-1 shadow-[0_0_16px_rgba(224,203,168,0.14)] transition hover:scale-[1.02]">
                <LinkedInButtonLink username="ndaru-satria-tama-2346a4379" />
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-7 grid gap-4 text-sm font-semibold sm:grid-cols-2">
          <div className="relative overflow-hidden rounded-sm border border-[#D32F2F] bg-black/55 p-5 shadow-[inset_0_0_20px_rgba(139,0,0,0.25)]">
            <div className="absolute right-3 bottom-2 text-6xl text-white/5">🎭</div>

            <p className="inline-block rounded-sm bg-[#8B0000] px-3 py-1 text-xs font-black tracking-[0.18em] text-[#E0CBA8] uppercase">
              Hobi
            </p>
            <p className="mt-5 text-2xl font-black text-[#E8E1D1]">CTF</p>
          </div>

          <div className="relative overflow-hidden rounded-sm border border-[#D32F2F] bg-black/55 p-5 shadow-[inset_0_0_20px_rgba(139,0,0,0.25)]">
            <div className="absolute right-3 bottom-2 text-6xl text-white/5">🏦</div>

            <p className="inline-block rounded-sm bg-[#8B0000] px-3 py-1 text-xs font-black tracking-[0.18em] text-[#E0CBA8] uppercase">
              Fun Fact
            </p>
            <p className="mt-5 text-2xl font-black text-[#E8E1D1]">Suka Belajar</p>
          </div>
        </div>

        <div className="relative z-10 mt-4 overflow-hidden rounded-sm border border-[#8B0000] bg-black/65 p-5 shadow-[inset_0_0_25px_rgba(139,0,0,0.32)]">
          <div className="absolute -left-6 bottom-4 rotate-[-8deg] border border-[#8B0000] bg-[#1A1A1A] px-5 py-8 opacity-70">
            <p className="text-center text-xl leading-none font-black text-[#E0CBA8] uppercase">
              La
              <br />
              Casa
            </p>
          </div>

          <div className="relative z-10 ml-0 sm:ml-28">
            <p className="inline-block rounded-sm bg-[#8B0000] px-3 py-1 text-xs font-black tracking-[0.18em] text-[#E0CBA8] uppercase">
              Lagu Favorit
            </p>

            <p className="mt-4 text-2xl font-black text-[#E8E1D1]">Live Forever</p>
            <p className="mb-4 text-sm font-bold text-[#D32F2F]">Oasis</p>

            <div className="overflow-hidden rounded-md border border-[#D32F2F]/50 bg-[#8B0000]/30 p-2">
              <SpotifyEmbed spotifyUrl="https://open.spotify.com/intl-id/track/1KgfeuVn5OlsBEtoEmBa1t?si=88d44e6f4b5e44e9" />
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-5 flex flex-col gap-2 border-t border-[#8B0000]/70 pt-4 text-xs font-bold tracking-[0.18em] text-[#E0CBA8]/60 uppercase sm:flex-row sm:items-center sm:justify-between">
          <p>Red Tier Access</p>
          <p>Encrypted Profile</p>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default MemberPopup