'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'

import InstagramButtonLink from '@/components/atoms/button/InstagramButtonLink'
import LinkedInButtonLink from '@/components/atoms/button/LinkedInButtonLink'
import SpotifyEmbed from '@/components/molecules/SpotifyEmbed'

// Memanggil foto profil aslimu
import ProfileImage from './image.jpeg'

type MemberPopupProps = {
  isOpen: boolean
  onClose: () => void
}

const MemberPopup = ({ isOpen, onClose }: MemberPopupProps) => {
  const [isUnlocked, setIsUnlocked] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      setIsUnlocked(false)
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

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto px-4 pt-28 pb-8 sm:pt-32">
      <button
        type="button"
        aria-label="Close member detail"
        onClick={onClose}
        className="absolute inset-0 bg-pink-900/40 backdrop-blur-sm transition-opacity"
      />

      {!isUnlocked ? (
        // TAMPILAN 1: BOOM LOVE GATE DENGAN BLINK-BLINK ✨
        <div className="relative z-10 flex flex-col items-center justify-center animate-[member-popup-show_300ms_ease-out]">
          <div className="relative flex items-center justify-center">
            {/* Animasi Blink-Blink mengelilingi Love */}
            <span className="absolute -top-12 -left-10 text-5xl animate-pulse text-amber-300 drop-shadow-lg">✨</span>
            <span className="absolute -top-8 -right-14 text-4xl animate-bounce text-amber-400 drop-shadow-lg" style={{ animationDelay: '0.2s' }}>✨</span>
            <span className="absolute top-10 -left-16 text-3xl animate-pulse text-pink-300 drop-shadow-lg" style={{ animationDelay: '0.5s' }}>✨</span>
            <span className="absolute bottom-4 -right-12 text-5xl animate-pulse text-amber-200 drop-shadow-lg" style={{ animationDelay: '0.3s' }}>✨</span>
            <span className="absolute -bottom-8 left-4 text-4xl animate-bounce text-yellow-300 drop-shadow-lg" style={{ animationDelay: '0.1s' }}>✨</span>

            {/* Tombol Hati Utama */}
            <button
              onClick={() => setIsUnlocked(true)}
              className="text-9xl hover:scale-125 active:scale-150 transition-all duration-300 animate-pulse drop-shadow-2xl relative z-20"
              style={{ textShadow: '0 0 40px rgba(251, 191, 36, 0.9)' }}
            >
              💖
            </button>
          </div>

          <p className="mt-14 text-xl font-extrabold text-amber-400 drop-shadow-md bg-white/30 backdrop-blur-md px-8 py-3 rounded-full border-2 border-amber-300 animate-bounce">
            tekan dulu yaaw ✨
          </p>
        </div>
      ) : (
        // TAMPILAN 2: BIODATA PASTEL
        <div 
          className="relative z-10 max-h-[calc(100vh-9rem)] w-full max-w-[720px] animate-[member-popup-show_400ms_ease-out] overflow-y-auto rounded-3xl border-4 border-amber-300 p-6 shadow-2xl shadow-pink-200/50 sm:max-h-[calc(100vh-10rem)] sm:p-8"
          style={{
            backgroundColor: '#fce7f3',
            backgroundImage: 'radial-gradient(#ffffff 20%, transparent 20%)',
            backgroundSize: '24px 24px'
          }}
        >
          <button
            type="button"
            aria-label="Close member detail"
            onClick={onClose}
            className="bg-white/90 border-amber-400 text-amber-500 hover:bg-yellow-100 hover:text-amber-600 absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border-2 text-xl font-bold leading-none transition-colors shadow-sm"
          >
            x
          </button>

          <div className="border-amber-300 bg-white mb-5 overflow-hidden rounded-2xl border-4 shadow-sm p-1">
            <Image src={ProfileImage} alt="Profile Image" className="h-120 w-full rounded-xl object-cover object-center" />
          </div>

          <div className="pr-10 bg-white/70 p-3 rounded-xl border border-white inline-block shadow-sm mb-4">
            <h2 className="text-3xl font-black text-pink-500">A Putri Matulina 🍓🧚🏼‍♀️</h2>
            <p className="mt-1 text-sm font-bold text-amber-500">5027251128 - Bekasi</p>
          </div>

          <div className="mt-2 flex gap-2">
            <InstagramButtonLink username="matuliinaaa" />
            <LinkedInButtonLink username="atikmatulinap-putri-8b16b0379/" />
          </div>

          <div className="mt-6 grid gap-4 text-sm font-semibold sm:grid-cols-2">
            <div className="border-amber-300 bg-yellow-50/95 rounded-xl border-2 p-4 shadow-sm">
              <p className="text-xs tracking-wide uppercase text-amber-500 font-bold">Hobi 💆🏻‍♀️</p>
              <p className="mt-2 text-pink-600">dengerin musik, nonton konser</p>
            </div>
            <div className="border-amber-300 bg-yellow-50/95 rounded-xl border-2 p-4 shadow-sm">
              <p className="text-xs tracking-wide uppercase text-amber-500 font-bold">Fun Fact 💃🏻</p>
              <p className="mt-2 text-pink-600">aku suka bgt strawberry dan olahan strawberry apapun 🍓❤️</p>
            </div>
          </div>

          <div className="border-amber-300 bg-white/95 mt-4 rounded-xl border-2 p-4 shadow-sm">
            <p className="text-xs font-bold tracking-wide uppercase text-amber-500">Lagu Favorit 🎵</p>
            <p className="my-2 text-sm font-bold text-pink-600">Tapi Diterima</p>

            <div className="border-amber-300 rounded-lg border-2 overflow-hidden">
              <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/4CIZgWmteK86MCVXe8grBg?" />
            </div>
          </div>

          <div className="mt-8 text-center mb-2 flex items-center justify-center gap-2">
            <span className="text-2xl animate-pulse">✨</span>
            <p className="text-4xl font-extrabold text-amber-400 drop-shadow-sm" style={{ fontFamily: 'cursive, font-serif', fontStyle: 'italic' }}>
              Have a nice day! 💫🩷❗️
            </p>
            <span className="text-2xl animate-pulse" style={{ animationDelay: '0.5s' }}>✨</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default MemberPopup