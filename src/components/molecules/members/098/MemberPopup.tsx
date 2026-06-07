'use client'

import React, { useEffect } from 'react'

import Image from 'next/image'

import { createPortal } from 'react-dom'

import Instagram from '@/components/atoms/button/InstagramButtonLink'
import LinkedInButtonLink from '@/components/atoms/button/LinkedInButtonLink'
import SpotifyEmbed from '@/components/molecules/SpotifyEmbed'

import ProfileImage from './image.jpg'

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
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-hidden px-4">
      <button
        type="button"
        aria-label="Close member detail"
        onClick={onClose}
        className="absolute inset-0 bg-black/75 backdrop-blur-[6px] transition-opacity duration-300"
      />

      <div className="border-neutral-cs-10/40 bg-blue-cs-40/90 relative z-10 h-[100dvh] max-h-[100dvh] w-full max-w-[640px] animate-[member-popup-show_280ms_cubic-bezier(0.16,1,0.3,1)] overflow-y-auto rounded-2xl border p-6 text-white shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] backdrop-blur-xl transition-all sm:p-8">
        <button
          type="button"
          aria-label="Close member detail"
          onClick={onClose}
          className="border-neutral-cs-10/30 absolute top-5 right-5 z-20 flex h-8 w-8 items-center justify-center rounded-full border text-sm font-medium tracking-normal text-neutral-400 transition-all duration-200 hover:border-white/50 hover:bg-white/10 hover:text-white focus:ring-2 focus:ring-white/20 focus:outline-none active:scale-95"
        >
          ✕
        </button>

        <div className="border-neutral-cs-10/30 group mb-6 overflow-hidden rounded-xl border bg-black/20">
          <Image
            src={ProfileImage}
            alt="Profile Image"
            className="h-96 w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        </div>

        <div className="pr-10">
          <h2 className="bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-2xl font-bold tracking-tight text-transparent">
            Jude Athala Yazid Sari
          </h2>
          <p className="text-neutral-cs-10/80 mt-1.5 text-xs font-medium tracking-widest uppercase">
            5027251098 &bull; Tangerang
          </p>
        </div>

        <div className="mt-5 flex gap-2.5 transition-all duration-200">
          <div className="rounded-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(225,48,108,0.3)]">
            <Instagram username="Judeatha" />
          </div>
          <div className="rounded-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(0,119,181,0.2)]">
            <LinkedInButtonLink username="jude-athala" />
          </div>
        </div>

        <div className="mt-6 grid gap-4 text-sm font-normal sm:grid-cols-2">
          <InfoCard title="Hobi">
            <p className="mt-2 font-medium tracking-wide text-white/90">Bermain Sepak Bola</p>
          </InfoCard>
          <InfoCard title="Fun Fact">
            <p className="mt-2 leading-relaxed font-medium text-white/90">
              Gw orangnya susah tidur cepet dan susah untuk bangun
            </p>
          </InfoCard>
        </div>

        <InfoCard title="Lagu Favorit" className="mt-4">
          <p className="mt-1.5 mb-3 text-base font-semibold tracking-wide text-white">Soulmate</p>
          <div className="overflow-hidden rounded-lg bg-black/10 shadow-inner">
            <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/1rwGbGLDE0AkaH1UgUbufL?si=02a2150c40ed49e3" />
          </div>
        </InfoCard>
      </div>
    </div>,
    document.body
  )
}

const InfoCard = ({ title, children, className = '' }: React.PropsWithChildren<{ title: string; className?: string }>) => (
  <div
    className={`rounded-xl border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-transparent p-5 transition-all duration-300 hover:border-white/[0.15] ${className}`}
  >
    <p className="text-[11px] font-bold tracking-wider text-white/40 uppercase">{title}</p>
    {children}
  </div>
)

export default MemberPopup
