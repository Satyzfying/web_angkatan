'use client'

import React, { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

import Image from 'next/image'

import Instagram from '@/components/atoms/button/InstagramButtonLink'
import LinkedInButtonLink from '@/components/atoms/button/LinkedInButtonLink'
import SpotifyEmbed from '@/components/molecules/SpotifyEmbed'

import ProfileImage from './image.png'

type MemberPopupProps = {
  isOpen: boolean
  onClose: () => void
}

const MemberPopup = ({ isOpen, onClose }: MemberPopupProps) => {
  const popupRef = useRef<HTMLDivElement>(null)

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

  useEffect(() => {
    if (!isOpen || !popupRef.current) {
      return
    }

    const itemAnimations = Array.from(popupRef.current.querySelectorAll<HTMLElement>('[data-popup-item]')).map(
      (item, index) =>
        item.animate(
          [
            { opacity: 0, transform: 'translateY(-32px)' },
            { opacity: 1, transform: 'translateY(0)' },
          ],
          {
            duration: 450,
            delay: 100 + index * 90,
            easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
            fill: 'both',
          }
        )
    )

    return () => {
      itemAnimations.forEach((animation) => animation.cancel())
    }
  }, [isOpen])

  if (!isOpen) {
    return null
  }

  return createPortal(
    // PADA BAGIAN INI KAMU BOLEH MENGUBAH STYLE SESUKA HATI KAMU, TAPI JANGAN UBAH STRUKTUR DAN FUNGSI DARI KODE INI AGAR FUNGSI POPUP TETAP BERJALAN DENGAN BAIK
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto px-4 pt-28 pb-8 sm:pt-32">
      <button
        type="button"
        aria-label="Close member detail"
        onClick={onClose}
        className="absolute inset-0 bg-green-950/40 backdrop-blur-sm"
      />
      <div className="relative z-10 max-h-[calc(100vh-9rem)] w-full max-w-[720px] animate-[member-popup-show_200ms_ease-out] overflow-y-auto rounded-2xl border-2 border-green-200 bg-green-50 p-6 text-green-900 shadow-xl sm:max-h-[calc(100vh-10rem)] sm:p-8">
        <button
          type="button"
          aria-label="Close member detail"
          onClick={onClose}
          className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border border-green-300 bg-green-200 text-xl leading-none text-green-800 transition hover:scale-105 hover:bg-green-300"
        >
          x
        </button>

        <div className="mb-5 overflow-hidden rounded-2xl border border-green-200/60 bg-white shadow-sm">
          <Image src={ProfileImage} alt="Profile Image" className="h-120 w-full object-cover object-center" />
        </div>

        <div data-popup-item className="pr-10">
          {/* UBAH NAMA ANDA */}
          <h2 className="text-2xl font-black text-green-900">Muhammad Rafi Pramudya Putra</h2>
          {/* UBAH NRP DAN ASAL */}
          <p className="mt-1 text-sm font-semibold text-green-700">5027251024 - Bojonegoro</p>
        </div>

        <div className="mt-5 flex gap-2">
          {/* UBAH USERNAME INSTAGRAM */}
          <Instagram username="rpramoedya" />
          {/* UBAH USERNAME LINKEDIN */}
          <LinkedInButtonLink username="rafi-pramudya-8140a132a" />
        </div>

        <div className="mt-6 grid gap-4 text-sm font-semibold sm:grid-cols-2">
          <div className="rounded-2xl border border-green-200 bg-white p-4 shadow-sm">
            {/* UBAH HOBI KAMU */}
            <p className="text-xs tracking-wide text-green-600 uppercase">Hobi</p>
            <p className="mt-2 text-green-900">Renang</p>
          </div>
          <div className="rounded-2xl border border-green-200 bg-white p-4 shadow-sm">
            {/* UBAH FUNFACT KAMU */}
            <p className="text-xs tracking-wide text-green-600 uppercase">Fun Fact</p>
            <p className="mt-2 text-green-900">Suka Mengaji 😇😇</p>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-green-200 bg-white p-4 shadow-sm">
          {/* UBAH LAGU FAVORIT KAMU */}
          <p className="text-xs font-bold tracking-wide text-green-600 uppercase">Lagu Favorit</p>
          <p className="my-2 text-sm font-semibold text-green-900">Somewhere Only We Know</p>

          {/* UBAH URL SPOTIFY KAMU DENGAN LAGU FAVORIT MU */}
          <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/1SKPmfSYaPsETbRHaiA18G?si=a4b57c4e3eda479d" />
        </div>
      </div>
    </div>,
    document.body
  )
}

export default MemberPopup
