'use client'

/* eslint-disable react-hooks/set-state-in-effect */

import React, { useEffect, useState } from 'react'
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
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  const [showProfile, setShowProfile] = useState(false)
  const [animatePopup, setAnimatePopup] = useState(false)

  const lines = [
    'How many miles to Babylon?',
    'Three score miles and ten.',
    'Can I get there by candle-light?',
    'Yes, and back again ...',
    'If your heels are nimble and your toes are light,',
    'You may get there by candle-light.'
  ]

  const [currentLine, setCurrentLine] = useState(0)
  const [typedText, setTypedText] = useState('')
  const [displayedLines, setDisplayedLines] = useState<string[]>([])
  const [charIndex, setCharIndex] = useState(0)
  const [isFinished, setIsFinished] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setShowProfile(false)
      setCurrentLine(0)
      setTypedText('')
      setDisplayedLines([])
      setCharIndex(0)
      setIsFinished(false)
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen) {
      setAnimatePopup(false)
      setTimeout(() => setAnimatePopup(true), 10)
    }
  }, [isOpen])

  useEffect(() => {
    if (showProfile) return
    if (currentLine >= lines.length) {
      setIsFinished(true)
      return
    }

    const currentText = lines[currentLine]
    if (charIndex < currentText.length) {
      const timer = setTimeout(() => {
        setTypedText(currentText.slice(0, charIndex + 1))
        setCharIndex((prev) => prev + 1)
      }, 35)
      return () => clearTimeout(timer)
    }

    const nextTimer = setTimeout(() => {
      setDisplayedLines((prev) => [...prev, currentText])
      setCurrentLine((prev) => prev + 1)
      setTypedText('')
      setCharIndex(0)
    }, 1200)
    return () => clearTimeout(nextTimer)
  }, [charIndex, currentLine, showProfile])

  useEffect(() => {
    const handleSpace = (event: KeyboardEvent) => {
      if (showProfile) return
      if (event.code === 'Space') {
        event.preventDefault()
        if (currentLine >= lines.length) return
        const fullText = lines[currentLine]
        if (typedText !== fullText) {
          setTypedText(fullText)
          setCharIndex(fullText.length)
        } else {
          setDisplayedLines((prev) => [...prev, fullText])
          setCurrentLine((prev) => prev + 1)
          setTypedText('')
          setCharIndex(0)
        }
      }
    }
    window.addEventListener('keydown', handleSpace)
    return () => window.removeEventListener('keydown', handleSpace)
  }, [typedText, currentLine, showProfile])

  const handleTextClick = () => {
    if (currentLine >= lines.length) return
    const fullText = lines[currentLine]
    if (typedText !== fullText) {
      setTypedText(fullText)
      setCharIndex(fullText.length)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto px-4 pt-28 pb-8 sm:pt-32">
      <button
        type="button"
        aria-label="Close member detail"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      <div
        className={`
          border-neutral-cs-10
          relative
          z-10
          max-h-[calc(100vh-9rem)]
          w-full
          max-w-[720px]
          overflow-y-auto
          rounded-2xl
          border-2
          bg-gradient-to-b
          from-[#0400FA]
          via-[#5B7CFF]
          to-[#FFD700]
          p-6
          text-white
          shadow-[0_0_40px_rgba(255,215,0,0.4)]
          sm:max-h-[calc(100vh-10rem)]
          sm:p-8
          transition-all
          duration-500
          ${animatePopup ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}
        `}
      >
        {/* Garis cahaya tipis di atas card */}
        <div className="absolute top-0 left-0 h-px w-full bg-white/40" />

        {/* Blur orb emas & biru */}
        <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-yellow-300/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-blue-200/20 blur-3xl" />

        {/* Partikel bintang kecil */}
        <div className="absolute top-10 right-14 text-white/40">✦</div>
        <div className="absolute top-32 left-10 text-yellow-200/50">✦</div>
        <div className="absolute bottom-24 right-20 text-white/30">✦</div>
        <div className="absolute bottom-12 left-24 text-yellow-100/40">✦</div>

        {/* Tombol close (hanya satu) */}
        <button
          type="button"
          aria-label="Close member detail"
          onClick={onClose}
          className="border-neutral-cs-10 hover:bg-neutral-cs-10/10 absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border text-xl leading-none"
        >
          x
        </button>

        {!showProfile ? (
          <div className="relative flex min-h-[700px] flex-col items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-b from-[#FFFDF8] via-[#FFF8E8] to-[#FFF2D0] text-center">
            <div className="absolute left-8 top-8 text-7xl opacity-70">🕊️</div>
            <div className="absolute right-12 top-16 text-3xl text-[#D4AF37]">✦</div>
            <div className="absolute bottom-20 left-16 text-2xl text-[#D4AF37]">✦</div>
            <div className="absolute bottom-24 right-20 text-4xl text-[#D4AF37]">✦</div>

            <h1 className="mb-20 px-4 text-5xl font-serif text-[#D4AF37]">How Many Miles to Babylon?</h1>

            <button
              onClick={() => setShowProfile(true)}
              className="absolute top-6 left-6 rounded-full border border-[#D4AF37] bg-white/80 px-4 py-2 text-sm font-semibold text-[#D4AF37] transition hover:bg-[#D4AF37] hover:text-white"
            >
              Skip
            </button>

            <div onClick={handleTextClick} className="min-h-[320px] max-w-2xl cursor-pointer px-8 text-center text-2xl leading-relaxed text-[#4A3521]">
              {displayedLines.map((line, index) => (
                <p key={index} className="mb-4">{line}</p>
              ))}
              {!isFinished && (
                <p className="mb-4">
                  {typedText}
                  <span className="animate-pulse text-[#D4AF37]">|</span>
                </p>
              )}
            </div>

            {isFinished && (
              <button
                onClick={() => setShowProfile(true)}
                className="mt-12 rounded-full border-2 border-[#D4AF37] bg-white px-8 py-3 font-semibold text-[#D4AF37] transition-all hover:bg-[#D4AF37] hover:text-white"
              >
                Next →
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Foto profil dengan efek floating */}
            <div className="mb-6 overflow-hidden rounded-3xl border border-white/30 shadow-[0_10px_40px_rgba(0,0,0,0.25)]">
              <Image src={ProfileImage} alt="Profile Image" className="h-120 w-full object-cover object-center" />
            </div>

            {/* Nama dengan efek elegan */}
            <div className="pr-10">
              <h2 className="text-3xl font-black tracking-wide text-white drop-shadow-lg">
                Wahyu Yoga Wicaksono
              </h2>
              <p className="mt-1 text-sm font-semibold text-white/80">
                5027251103 - Yogyakarta
              </p>
            </div>

            <div className="mt-5 flex gap-2">
              <Instagram username="wyog._a" />
              <LinkedInButtonLink username="wahyu-yoga-wicaksono-84bb22364" />
            </div>

            <div className="mt-6 grid gap-4 text-sm font-semibold sm:grid-cols-2">
              {/* Hobi dengan ikon */}
              <div className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-xl shadow-[0_8px_32px_rgba(31,38,135,0.18)] transition-all duration-300 hover:scale-[1.02] hover:bg-white/15">
                <p className="text-lg mb-2">🎯</p>
                <p className="text-white/70 text-xs tracking-[0.15em] uppercase">Hobi</p>
                <p className="mt-2">suka mencoba hal baru apapun itu</p>
              </div>

              {/* Fun Fact dengan ikon */}
              <div className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-xl shadow-[0_8px_32px_rgba(31,38,135,0.18)] transition-all duration-300 hover:scale-[1.02] hover:bg-white/15">
                <p className="text-lg mb-2">✨</p>
                <p className="text-neutral-cs-10/60 text-xs tracking-wide uppercase">Fun Fact</p>
                <p className="mt-2">pingin banyak hal dicoba tapi gabisa bisa</p>
              </div>
            </div>

            {/* Lagu Favorit (opsional, tanpa ikon tambahan) */}
            <div className="mt-4 rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-xl shadow-[0_8px_32px_rgba(31,38,135,0.18)]">
              <p className="text-neutral-cs-10/60 text-xs font-bold tracking-wide uppercase">Lagu Favorit</p>
              <p className="my-2 text-sm font-semibold">Sunshine - Panturas</p>
              <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/5j7HESfa8OXs3hTqQ1ZvnR?si=b204794961294c3d" />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default MemberPopup
