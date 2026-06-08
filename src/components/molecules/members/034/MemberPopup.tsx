'use client'

import React, { useEffect } from 'react'
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
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto px-4">

      <div className="absolute inset-0 z-0 bg-[#5c94fc] overflow-hidden">

        <div className="absolute top-[10%] left-[10%] sm:left-[15%] opacity-95 drop-shadow-md">
          <div className="relative w-20 sm:w-24 h-8 sm:h-10 bg-white rounded-full">
            <div className="absolute w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full bottom-2 left-2" />
            <div className="absolute w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-full bottom-2 right-2" />
            <div className="absolute w-[80%] h-4 bg-white bottom-0 left-2" />
          </div>
        </div>

        <div className="absolute top-[20%] left-[45%] sm:left-[50%] opacity-95 drop-shadow-md scale-75">
          <div className="relative w-24 h-10 bg-white rounded-full">
            <div className="absolute w-12 h-12 bg-white rounded-full bottom-2 left-2" />
            <div className="absolute w-16 h-16 bg-white rounded-full bottom-2 right-2" />
            <div className="absolute w-[80%] h-4 bg-white bottom-0 left-2" />
          </div>
        </div>

        <div className="absolute top-[8%] right-[10%] sm:right-[15%] opacity-95 drop-shadow-md scale-90">
          <div className="relative w-24 h-10 bg-white rounded-full">
            <div className="absolute w-12 h-12 bg-white rounded-full bottom-2 left-2" />
            <div className="absolute w-16 h-16 bg-white rounded-full bottom-2 right-2" />
            <div className="absolute w-[80%] h-4 bg-white bottom-0 left-2" />
          </div>
        </div>

        <div className="absolute bottom-[48px] sm:bottom-[64px] left-[5%] sm:left-[15%] flex items-end drop-shadow-[4px_4px_0_rgba(0,0,0,0.2)] z-20">
          <div className="flex items-center mb-4 sm:mb-6">
            <div className="w-6 h-12 sm:h-16 bg-gradient-to-b from-[#6ce424] via-[#00a800] to-[#006000] border-4 border-black rounded-sm z-10" />
            <div className="w-12 sm:w-16 h-8 sm:h-12 bg-gradient-to-b from-[#6ce424] via-[#00a800] to-[#006000] border-y-4 border-black -ml-1" />
          </div>
          <div className="flex flex-col items-center -ml-1">
            <div className="w-16 sm:w-20 h-8 bg-gradient-to-r from-[#6ce424] via-[#00a800] to-[#006000] border-4 border-black rounded-sm z-10" />
            <div className="w-14 sm:w-16 h-20 sm:h-24 bg-gradient-to-r from-[#6ce424] via-[#00a800] to-[#006000] border-x-4 border-black -mt-1" />
          </div>
        </div>

        <div className="absolute bottom-[48px] sm:bottom-[64px] left-[45%] sm:left-[50%] flex flex-col items-center drop-shadow-[4px_4px_0_rgba(0,0,0,0.2)] z-20">
          <div className="w-16 sm:w-20 h-8 bg-gradient-to-r from-[#6ce424] via-[#00a800] to-[#006000] border-4 border-black rounded-sm z-10" />
          <div className="w-14 sm:w-16 h-12 sm:h-16 bg-gradient-to-r from-[#6ce424] via-[#00a800] to-[#006000] border-x-4 border-black -mt-1" />
        </div>

        <div className="absolute bottom-[48px] sm:bottom-[64px] right-[5%] sm:right-[15%] flex flex-col items-center drop-shadow-[4px_4px_0_rgba(0,0,0,0.2)] z-20">
          <div className="w-16 sm:w-20 h-8 bg-gradient-to-r from-[#6ce424] via-[#00a800] to-[#006000] border-4 border-black rounded-sm z-10" />
          <div className="w-14 sm:w-16 h-32 sm:h-48 bg-gradient-to-r from-[#6ce424] via-[#00a800] to-[#006000] border-x-4 border-black -mt-1" />
        </div>

        <div
          className="absolute bottom-0 left-0 w-full h-[48px] sm:h-[64px] border-t-4 border-black z-30 drop-shadow-[0_-2px_0_rgba(0,0,0,0.2)]"
          style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='32' height='16' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='32' height='16' fill='%23c84c0c' /%3E%3Cpath d='M0 16H32 M0 8H32 M16 0V8 M0 8V16 M32 8V16' stroke='%23000' stroke-width='2' fill='none' /%3E%3C/svg%3E\")"
          }}
        />

        <div className="absolute inset-0 bg-black/60 z-40" />
        <button
          type="button"
          aria-label="Close member detail"
          onClick={onClose}
          className="absolute inset-0 w-full h-full cursor-default z-40"
        />
      </div>

      <div
        className="relative z-50 w-full max-w-[720px] max-h-[100dvh] animate-[member-popup-show_200ms_ease-out] overflow-y-auto rounded-2xl border-4 border-black p-6 sm:p-8 text-white shadow-[12px_12px_0px_rgba(0,0,0,0.5)]"
        style={{ backgroundColor: '#5c94fc' }}
      >
        <button
          type="button"
          aria-label="Close member detail"
          onClick={onClose}
          className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full border-4 border-black bg-red-600 text-2xl font-black leading-none text-white shadow-[4px_4px_0_#000] hover:translate-y-1 hover:shadow-none transition-all z-50"
        >
          x
        </button>

        <div className="border-4 border-black bg-white mb-5 overflow-hidden rounded-xl shadow-[6px_6px_0_rgba(0,0,0,0.5)] mt-2">
          <Image src={ProfileImage} alt="Profile Image" className="h-120 w-full object-cover object-center" />
        </div>

        <div className="pr-10 drop-shadow-[2px_2px_0_#000]">
          <h2 className="text-3xl font-black uppercase tracking-wide">Albert Chen</h2>
          <p className="text-yellow-300 mt-1 text-sm font-bold">5027251034 - Pematangsiantar</p>
        </div>

        <div className="mt-5 flex gap-2">
          <div className="bg-black text-white border-2 border-black rounded-lg shadow-[4px_4px_0_#000] hover:-translate-y-1 transition-transform flex items-center p-2">
            <Instagram username="albert.chnn" />
          </div>
          <div className="bg-[#0a66c2] text-white border-2 border-black rounded-lg shadow-[4px_4px_0_#000] hover:-translate-y-1 transition-transform flex items-center p-2">
            <LinkedInButtonLink username="albert-chen-5a1037369" />
          </div>
        </div>

        <div className="mt-6 grid gap-4 text-sm font-bold sm:grid-cols-2 text-black">
          <div className="bg-[#fc9838] border-4 border-black rounded-xl p-4 shadow-[4px_4px_0_#000]">
            <p className="text-white drop-shadow-[1px_1px_0_#000] text-xs tracking-wide uppercase font-black">Hobi</p>
            <p className="mt-2 text-black">dengerin musik, suka hiling</p>
          </div>
          <div className="bg-[#00a800] border-4 border-black rounded-xl p-4 shadow-[4px_4px_0_#000]">
            <p className="text-white drop-shadow-[1px_1px_0_#000] text-xs tracking-wide uppercase font-black">Fun Fact</p>
            <p className="mt-2 text-white">tanggal lahir flash sale</p>
          </div>
        </div>

        <div className="bg-[#e45c10] border-4 border-black mt-4 rounded-xl p-4 shadow-[4px_4px_0_#000]">
          <div className="flex flex-col items-start mb-4">
            <p className="text-white drop-shadow-[1px_1px_0_#000] text-xs font-black tracking-wide uppercase mb-2">Lagu Favorit</p>
            <p className="text-sm font-bold text-black bg-white px-3 py-1.5 rounded-md border-2 border-black leading-none">Somebody To You</p>
          </div>

          <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/6VrLYoQKdhu1Jruei06t65?si=GL-ZeGyHRhy9c8EmX27yHA" />
        </div>
      </div>
    </div>,
    document.body
  )
}

export default MemberPopup