'use client'

import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

import Image from 'next/image'

import Instagram from '@/components/atoms/button/InstagramButtonLink'
import LinkedInButtonLink from '@/components/atoms/button/LinkedInButtonLink'
import SpotifyEmbed from '@/components/molecules/SpotifyEmbed'

import ProfileImage from './image.png'
import EvaBackground from './eva-background.jpg'
import EvaCover from './eva-cover.png'

type MemberPopupProps = {
  isOpen: boolean
  onClose: () => void
}

const MemberPopup = ({ isOpen, onClose }: MemberPopupProps) => {
  const [accessCode, setAccessCode] = useState('')
  const [accessGranted, setAccessGranted] = useState(false)
  const [error, setError] = useState('')
  const [isAuthorizing, setIsAuthorizing] = useState(false)
  const [terminalText, setTerminalText] = useState('')

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

  const handleAuthorize = async () => {
    if (accessCode !== '057') {
      setError('ACCESS DENIED')
      return
    }

    setError('')
    setIsAuthorizing(true)

    const lines = [
      'CHECKING AUTHORIZATION...',
      'SYNCHRONIZING PILOT DATA...',
      'VERIFYING NERV DATABASE...',
      'PILOT IDENTITY CONFIRMED',
      'NERV AUTHORIZATION ACCEPTED',
    ]

    setTerminalText('')

    for (const line of lines) {
      await new Promise((resolve) => setTimeout(resolve, 700))

      setTerminalText((prev) =>
        prev ? `${prev}\n${line}` : line
      )
    }

    setTimeout(() => {
      setAccessGranted(true)
      setIsAuthorizing(false)
    }, 1000)
  }

  if (!isOpen) {
    return null
  }

  if (!accessGranted) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
        <style>{`
          @keyframes scanMove {
            0%   { top: -80px; }
            100% { top: 100%; }
          }
        `}</style>
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${EvaBackground.src})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
        {/* Overlay */}
        <div className="absolute inset-0 z-0 bg-black/85" />

        {/* Moving Scanline */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute left-0 w-full h-20"
            style={{
              background:
                'linear-gradient(to bottom, transparent, rgba(255,0,0,0.15), transparent)',
              animation: 'scanMove 4s linear infinite',
            }}
          />
        </div>

        {/* Pulse Border Glow */}
        <div
          className="absolute inset-0 pointer-events-none animate-pulse"
          style={{
            boxShadow: 'inset 0 0 120px rgba(255,0,0,1)',
          }}
        />

        {/* Scanline Effect */}
        <div
          className="pointer-events-none absolute inset-0 opacity-10"
          style={{
            background:
              'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.8) 3px, rgba(0,0,0,0.8) 4px)',
          }}
        />

        {/* Grid */}
        <div
          className="absolute inset-0 z-0 opacity-20"
          style={{
            backgroundImage:
              'linear-gradient(red 1px, transparent 1px), linear-gradient(90deg, red 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* CLASSIFIED */}
        <div className="absolute top-6 left-6 z-10 text-red-600">
          <p className="text-xs tracking-[0.5em]">NERV DATABASE</p>
          <p className="text-3xl font-black">CLASSIFIED</p>
        </div>

        <div className="relative z-20 w-full max-w-xl rounded-2xl border-2 border-red-600 bg-black p-8 text-white shadow-2xl">
          <div className="mb-6">
            <p className="text-xs tracking-[0.5em] text-red-500">
              NERV SECURITY SYSTEM
            </p>
            <h2 className="mt-3 text-3xl font-black text-red-500">
              AUTHORIZATION REQUIRED
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              Enter Pilot Access Code
            </p>
          </div>

          {!isAuthorizing ? (
            <>
              <input
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                placeholder="- - -"
                className="w-full rounded-lg border border-red-600 bg-black p-3 text-center text-lg tracking-[0.3em] outline-none"
              />

              {error && (
                <p className="mt-3 font-semibold text-red-500">{error}</p>
              )}

              <button
                onClick={handleAuthorize}
                className="mt-5 w-full rounded-lg bg-red-600 py-3 font-bold transition hover:bg-red-700"
              >
                AUTHORIZE
              </button>

              <button
                onClick={onClose}
                className="mt-3 w-full rounded-lg border border-gray-600 py-3"
              >
                CANCEL
              </button>
            </>
          ) : (
            <div className="min-h-[220px] rounded-lg border border-red-600 bg-black p-4 font-mono text-green-400 whitespace-pre-line">
              {terminalText}
              <span className="animate-pulse">█</span>
            </div>
          )}
        </div>
      </div>
    )
  }

  return createPortal(
    // PADA BAGIAN INI KAMU BOLEH MENGUBAH STYLE SESUKA HATI KAMU, TAPI JANGAN UBAH STRUKTUR DAN FUNGSI DARI KODE INI AGAR FUNGSI POPUP TETAP BERJALAN DENGAN BAIK
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto p-4"
      onClick={onClose}
    >
      <style>{`
        @keyframes scanMove {
          0%   { top: -80px; }
          100% { top: 100%; }
        }
      `}</style>

      {/* Full Screen EVA Overlay */}
      <div className="fixed inset-0 z-[9999] bg-black" />

      {/* EVA Background */}
      <div
        className="fixed inset-0 z-[10000]"
        style={{
          backgroundImage: `url(${EvaBackground.src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* Overlay */}
      <div className="fixed inset-0 z-[10001] bg-black/85" />

      {/* Pulse Border Glow */}
      <div
        className="fixed inset-0 z-[10001] pointer-events-none animate-pulse"
        style={{
          boxShadow: 'inset 0 0 120px rgba(255,0,0,1)',
        }}
      />

      {/* Red Scanline Full Screen */}
      <div className="pointer-events-none fixed inset-0 z-[10001] overflow-hidden">
        <div
          style={{
            position: 'absolute',
            left: 0,
            width: '100%',
            height: '64px',
            background:
              'linear-gradient(to bottom, transparent, rgba(255,0,0,0.3), transparent)',
            animation: 'scanMove 3s linear infinite',
          }}
        />
      </div>

      <button
        type="button"
        aria-label="Close member detail"
        onClick={onClose}
        className="fixed inset-0 bg-black/90 z-[9999]"
      />

      <div
        className="relative z-[10002] max-h-[calc(100vh-9rem)] w-full max-w-[720px] overflow-y-auto rounded-2xl border-2 border-red-600 text-white shadow-xl sm:max-h-[calc(100vh-10rem)]"
        style={{
          backgroundColor: '#0a0a0a',
          boxShadow: 'inset 8px 0 0 #ff0000, inset -8px 0 0 #ff0000',
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 rounded-2xl bg-black/60" />

        {/* EVA Scan Line inside card */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute left-0 w-full h-20"
            style={{
              background:
                'linear-gradient(to bottom, transparent, rgba(255,0,0,0.15), transparent)',
              animation: 'scanMove 4s linear infinite',
            }}
          />
        </div>

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-[180px] font-black text-red-600/5">NERV</span>
        </div>

        {/* Content */}
        <div className="relative z-[101] p-6 sm:p-8">
          <button
            type="button"
            aria-label="Close member detail"
            onClick={onClose}
            className="border-neutral-cs-10 hover:bg-neutral-cs-10/10 absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border text-xl leading-none"
          >
            x
          </button>

          <div className="group relative mb-5 overflow-hidden rounded-2xl border border-red-600/50">
            {/* COVER EVA */}
            <Image
              src={EvaCover}
              alt="Eva Cover"
              className="
                absolute inset-0 z-20
                h-full w-full
                object-cover
                transition-opacity duration-700
                group-hover:opacity-0
              "
            />

            {/* FOTO ASLI */}
            <Image
              src={ProfileImage}
              alt="Profile Image"
              className="
                h-120 w-full
                object-cover object-center
              "
            />

            {/* NERV Label */}
            <div className="absolute bottom-4 left-4 bg-red-700 px-3 py-1 text-xs font-bold tracking-widest">
              NERV PILOT FILE
            </div>
          </div>

          <div className="mb-3 text-xs font-bold tracking-[0.3em] text-red-500">
            NERV PERSONNEL FILE
          </div>

          <div className="pr-10">
            {/* UBAH NAMA ANDA */}
            <h2 className="text-2xl font-black tracking-wider text-red-500">
              Riezco Eka Bayu Witantra
            </h2>

            {/* UBAH NRP DAN ASAL */}
            <p className="mt-1 text-sm font-semibold text-gray-400">
              5027251057 - Rembang
            </p>
          </div>

          <div className="mt-5 flex gap-2">
            {/* UBAH USERNAME INSTAGRAM */}
            <Instagram username="riez_wi" />

            {/* UBAH USERNAME LINKEDIN */}
            <LinkedInButtonLink username="riezcowitantra" />
          </div>

          <div className="mt-6 grid gap-4 text-sm font-semibold sm:grid-cols-2">
            <div className="border-red-700/40 bg-black rounded-xl border p-4">
              {/* UBAH HOBI KAMU */}
              <p className="text-neutral-cs-10/60 text-xs tracking-wide uppercase">
                Hobi
              </p>
              <p className="mt-2">nge game sama sepeda aja deh</p>
            </div>

            <div className="border-red-700/40 bg-black rounded-xl border p-4">
              {/* UBAH FUNFACT KAMU */}
              <p className="text-neutral-cs-10/60 text-xs tracking-wide uppercase">
                Fun Fact
              </p>
              <p className="mt-2">
                Candidate for EVA Unit-01 synchronization test.
              </p>
            </div>
          </div>

          <div className="border-neutral-cs-10/40 mt-4 rounded-xl border p-4">
            {/* UBAH LAGU FAVORIT KAMU */}
            <p className="text-neutral-cs-10/60 text-xs font-bold tracking-wide uppercase">
              Lagu Favorit
            </p>

            <p className="my-2 text-sm font-semibold">残酷な天使のテーゼ</p>

            {/* UBAH URL SPOTIFY KAMU DENGAN LAGU FAVORIT MU */}
            <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/23phSRwoMy48rwFpmuAP8q?si=c795c4c5f2ca48e0" />
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default MemberPopup
