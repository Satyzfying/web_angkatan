'use client'

/* eslint-disable react-hooks/set-state-in-effect, react/no-unescaped-entities */

import React, { useEffect, useState } from 'react'
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
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [showError, setShowError] = useState(false)
  const [isZoomed, setIsZoomed] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      setIsUnlocked(false)
      setInputValue('')
      setShowError(false)
      setIsZoomed(false)
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

  const handleCheckName = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    
    if (inputValue.toLowerCase().trim() === 'faris') {
      setIsUnlocked(true)
      setShowError(false)
    } else {
      setShowError(true)
    }
  }

  if (!isOpen) {
    return null
  }

  // --- TAMPILAN TERMINAL MACBOOK DENGAN TEBAK-TEBAKAN ---
  if (!isUnlocked) {
    return createPortal(
      <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden px-4">
        {/* Background Backdrop */}
        <button
          type="button"
          aria-label="Close challenge"
          onClick={onClose}
          className="fixed inset-0 cursor-default bg-neutral-900/80 backdrop-blur-sm"
        />

        {/* Mac Terminal Window */}
        <div className="relative z-10 max-h-[100dvh] w-full max-w-2xl animate-[member-popup-show_200ms_ease-out] overflow-y-auto overscroll-contain rounded-xl bg-zinc-900/95 shadow-2xl ring-1 ring-zinc-700">
          
          {/* Terminal Header (Title Bar) */}
          <div className="flex h-12 w-full items-center justify-between bg-zinc-800 px-4 border-b border-zinc-700">
            {/* Mac Window Buttons (Traffic Lights) */}
            <div className="flex items-center gap-2">
              <button 
                onClick={onClose}
                className="h-3 w-3 rounded-full bg-[#ff5f56] hover:bg-red-600 transition-colors"
                aria-label="Close terminal"
              />
              <div className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
              <div className="h-3 w-3 rounded-full bg-[#27c93f]" />
            </div>
            {/* Terminal Title */}
            <div className="absolute left-1/2 -translate-x-1/2 text-xs font-semibold text-zinc-400 font-mono select-none">
              tebak-nama — -zsh — 80x24
            </div>
          </div>

          {/* Terminal Body */}
          <div className="p-4 sm:p-6 min-h-[300px] flex flex-col font-mono text-sm sm:text-base text-zinc-300">
            <p className="mb-4 text-zinc-500">
              Last login: {new Date().toDateString()} on ttys000
            </p>
            
            <div className="mb-4 space-y-2">
              <p className="font-bold text-zinc-100">=== RESTRICTED PROFILE ACCESS ===</p>
              <p>Jawab tebak-tebakan ini untuk membuka profil:</p>
              <p className="text-cyan-400 mt-2">? QUESTION: Siapa nama panggilanku?</p>
              <p className="text-amber-400">! CLUE: Aku ini arek Kediri asli.</p>
            </div>

            {/* Error Message */}
            {showError && (
              <p className="text-red-400 mb-2 mt-2">
                zsh: access denied. '{inputValue}' is not the correct name!
              </p>
            )}

            {/* Input Line */}
            <form onSubmit={handleCheckName} className="flex flex-wrap items-center gap-2 mt-2">
              <span className="text-green-400 font-bold">whoami@kediri ~ %</span>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value)
                  setShowError(false)
                }}
                className="flex-1 bg-transparent text-zinc-100 outline-none border-none caret-zinc-100 min-w-[100px]"
                autoFocus
                spellCheck={false}
                autoComplete="off"
              />
            </form>
          </div>
        </div>
      </div>,
      document.body
    )
  }

  // --- TAMPILAN PROFIL SETELAH UNLOCK ---
  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-hidden px-4">
      <button
        type="button"
        aria-label="Close member detail"
        onClick={onClose}
        className="fixed inset-0 bg-neutral-900/90"
      />

      <div className="relative z-10 h-[100dvh] max-h-[100dvh] w-full max-w-[720px] animate-[member-popup-show_200ms_ease-out] overflow-y-auto overscroll-contain rounded-md border-8 border-zinc-600 bg-zinc-950 p-6 text-zinc-100 shadow-[8px_8px_0_rgba(0,0,0,0.5)] sm:p-8">
        <button
          type="button"
          aria-label="Close member detail"
          onClick={onClose}
          className="border-red-600 bg-red-600 hover:bg-red-700 active:scale-90 transition-transform absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-sm border-4 text-zinc-100 text-3xl font-black leading-none p-1"
        >
          X
        </button>

        <div
          onClick={() => setIsZoomed(!isZoomed)}
          className={`mb-5 p-3 rounded-xl cursor-pointer transition-all duration-500 group relative bg-gradient-to-br from-black via-indigo-950 to-purple-900 border-4 border-white shadow-[0_0_15px_rgba(255,255,255,0.7)] hover:shadow-[0_0_30px_rgba(255,255,255,1)] ${isZoomed ? 'scale-[1.05]' : 'hover:scale-[1.02]'}`}
        >
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-4 left-6 h-1 w-1 rounded-full bg-white shadow-[0_0_5px_white] animate-pulse"></div>
            <div className="absolute bottom-8 right-10 h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_8px_white] animate-pulse delay-150"></div>
            <div className="absolute top-1/2 right-4 h-0.5 w-0.5 rounded-full bg-white shadow-[0_0_3px_white] animate-pulse delay-300"></div>
            <div className="absolute bottom-4 left-1/4 h-1 w-1 rounded-full bg-white shadow-[0_0_5px_white] animate-pulse delay-75"></div>
          </div>

          <div className="overflow-hidden border border-white/20 rounded-lg relative z-10">
            <Image
              src={ProfileImage}
              alt="Profile Image"
              className={`h-120 w-full object-cover object-center transition-transform duration-700 ease-in-out ${isZoomed ? 'scale-[1.6]' : 'group-hover:scale-110'}`}
            />
          </div>
        </div>

        <div className="pr-10">
          <h2 className="text-3xl font-black tracking-tighter text-zinc-100 uppercase font-mono">M.Faris Roisul Azhar</h2>
          <p className="text-zinc-400 mt-1 text-sm font-bold font-mono">5027251048 - Kediri</p>
        </div>

        <div className="mt-5 flex gap-4 items-end h-14">
          <div className="transition-all duration-300 ease-out origin-bottom hover:scale-[1.3] hover:-translate-y-2 cursor-pointer">
            <Instagram username="muhammadfarisazhar" />
          </div>
          <div className="transition-all duration-300 ease-out origin-bottom hover:scale-[1.3] hover:-translate-y-2 cursor-pointer">
            <LinkedInButtonLink username="M.Faris Roisul Azhar" />
          </div>
        </div>

        <div className="mt-6 grid gap-4 text-sm font-semibold sm:grid-cols-2">
          <div className="border-white rounded-md border-8 p-4 bg-zinc-900 transition-all duration-300 ease-out origin-bottom hover:scale-[1.05] hover:-translate-y-2 hover:shadow-[0_0_20px_rgba(255,255,255,0.6)] cursor-default">
            <p className="text-lime-400 text-xs tracking-widest uppercase font-black font-mono">Hobi</p>
            <p className="mt-2 text-zinc-100 font-bold">Berenang,Main Piano</p>
          </div>
          <div className="border-white rounded-md border-8 p-4 bg-zinc-900 transition-all duration-300 ease-out origin-bottom hover:scale-[1.05] hover:-translate-y-2 hover:shadow-[0_0_20px_rgba(255,255,255,0.6)] cursor-default">
            <p className="text-amber-300 text-xs tracking-widest uppercase font-black font-mono">Fun Fact</p>
            <p className="mt-2 text-zinc-100 font-bold">aku bisa mandi 4 kali sehari</p>
          </div>
        </div>

        <div className="border-zinc-500 mt-4 rounded-md border-8 p-4 bg-zinc-900 transition-all duration-300 ease-out origin-bottom hover:scale-[1.02] hover:-translate-y-2 hover:shadow-[0_0_20px_rgba(255,255,255,0.6)]">
          <p className="text-cyan-400 text-xs tracking-widest uppercase font-black font-mono">LAGU FAVORIT</p>
          <p className="my-2 text-sm font-bold text-zinc-100">Sunsetz by CAS</p>

          <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/0yuAWlxq59xT3agQ965OxE?si=xJgvh7N5TEaJkS26EnMQkw" />
        </div>
      </div>
    </div>,
    document.body
  )
}

export default MemberPopup
