'use client'

import React, { useEffect } from 'react'

import Image from 'next/image'

import { createPortal } from 'react-dom'

import Instagram from '@/components/atoms/button/InstagramButtonLink'
import LinkedInButtonLink from '@/components/atoms/button/LinkedInButtonLink'
import SpotifyEmbed from '@/components/molecules/SpotifyEmbed'

import ProfileImage from './image.png'

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
    <>
      <style jsx>{`
        @keyframes floating {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        @keyframes snakeMove {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>

      <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-hidden px-4">
        <button
          type="button"
          aria-label="Close member detail"
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-md"
        />

        <div
          className="relative z-10 h-[100dvh] max-h-[100dvh] w-full max-w-[720px] overflow-y-auto rounded-[38px] border-[3px] border-white bg-gradient-to-br from-[#ffe7f3] via-[#f9efff] to-[#eef5ff] p-6 shadow-[0_0_60px_rgba(255,192,203,.25)] sm:p-8"
          style={{ animation: 'floating 5s ease-in-out infinite' }}
        >
          <button
            type="button"
            aria-label="Close member detail"
            onClick={onClose}
            className="absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border-[3px] border-white bg-[#d7e8ff] text-xl font-bold text-[#355e9a]"
          >
            ×
          </button>

          <div
            className="relative mb-5 overflow-hidden rounded-[32px] p-[3px]"
            style={{
              boxShadow:
                '0 0 25px rgba(255,182,193,.45), 0 0 50px rgba(173,216,230,.35), 0 0 80px rgba(196,181,253,.25)'
            }}
          >
            <div
              className="absolute -inset-[120%]"
              style={{
                background:
                  'conic-gradient(transparent 0deg, transparent 220deg, #60a5fa 260deg, #8b5cf6 310deg, #60a5fa 360deg)',
                animation: 'snakeMove 6s linear infinite'
              }}
            />
            <div className="relative overflow-hidden rounded-[30px] border-[4px] border-white bg-white">
              <Image src={ProfileImage} alt="Profile Image" className="h-120 w-full object-cover object-top" />
            </div>
          </div>

          <div className="pr-10">
            <h2
              className="text-4xl font-black"
              style={{
                background: 'linear-gradient(90deg,#ff69b4,#ff9ac8,#ff69b4)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 0 10px rgba(255,105,180,.45))'
              }}
            >
              Ferlin Erdina S
            </h2>
            <p className="mt-2 text-sm font-semibold text-[#7285a8]">5027251002 ✧ Sidoarjo</p>
          </div>

          <div className="mt-5 flex gap-3">
            <div className="rounded-full border-[3px] border-white bg-[#d7e8ff] p-3 shadow-[0_0_20px_rgba(180,210,255,.5)]">
              <Instagram username="ferlinnerdn" />
            </div>
            <div className="rounded-full border-[3px] border-white bg-[#d7e8ff] p-3 shadow-[0_0_20px_rgba(180,210,255,.5)]">
              <LinkedInButtonLink username="ferlinerdina" />
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <GlowCard>
              <p className="text-xs font-black tracking-[0.35em] text-[#355e9a] uppercase">✦ HOBI</p>
              <p className="text-1xl mt-3 font-black text-[#355e9a]">Melukis</p>
            </GlowCard>
            <GlowCard>
              <p className="text-xs font-black tracking-[0.35em] text-[#355e9a] uppercase">✦ FUN FACT</p>
              <p className="text-1xl mt-3 font-black text-[#355e9a]">Top 1 gapernah makan sambal</p>
            </GlowCard>
          </div>

          <GlowCard className="mt-5 rounded-[32px]">
            <p className="text-xs font-black tracking-[0.35em] text-[#355e9a] uppercase">✦ FAVORITE SONG</p>
            <p className="my-3 text-2xl font-black text-[#355e9a]">E85</p>
            <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/3B4cjvGlPvyBLNG3AzEgkZ?si=28c25523329b4c0f" />
          </GlowCard>

          <div className="mt-6 text-center text-xl tracking-[0.5em] text-pink-400">✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦</div>
        </div>
      </div>
    </>,
    document.body
  )
}

const GlowCard = ({ children, className = '' }: React.PropsWithChildren<{ className?: string }>) => (
  <div
    className={`relative overflow-hidden rounded-[30px] border-[3px] border-white bg-[#d7e8ff] p-6 ${className}`}
  >
    <div
      className="absolute -inset-[120%]"
      style={{
        background:
          'conic-gradient(transparent 0deg, transparent 260deg, #60a5fa 290deg, #8b5cf6 330deg, #60a5fa 360deg)',
        animation: 'snakeMove 6s linear infinite'
      }}
    />
    <div className="absolute inset-[3px] rounded-[26px] bg-[#d7e8ff]" />
    <div className="relative z-10">{children}</div>
  </div>
)

export default MemberPopup
