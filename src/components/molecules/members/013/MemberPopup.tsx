'use client'

/* eslint-disable react-hooks/set-state-in-effect, react/no-unescaped-entities */
import React, { useEffect, useState } from 'react'

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
  const [answer, setAnswer] = useState('')
  const [step, setStep] = useState<'quiz' | 'quote' | 'card'>('quiz')

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
    if (!isOpen) {
      setAnswer('')
      setStep('quiz')
    }
  }, [isOpen])

  if (!isOpen) {
    return null
  }

  const checkAnswer = () => {
    if (answer.trim().toLowerCase() === 'princess nadya') {
      setStep('quote')
    }
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center overflow-hidden px-4"
      onClick={(event) => event.stopPropagation()}
      onKeyDown={(event) => event.stopPropagation()}
    >
      <button
        type="button"
        aria-label="Close member detail"
        onClick={onClose}
        className="fixed inset-0 bg-pink-950/50 backdrop-blur-md"
      />

      <div className="relative z-10 h-[100dvh] max-h-[100dvh] w-full max-w-[720px] overflow-y-auto overscroll-contain rounded-[2rem] border-4 border-pink-100 bg-gradient-to-br from-pink-50 via-white to-pink-100 p-6 text-pink-950 shadow-[0_8px_40px_rgba(255,182,193,0.35)] sm:p-8">
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2rem]">
          <div className="absolute top-6 left-8 text-3xl opacity-40">🌙</div>
          <div className="absolute top-16 right-12 text-2xl opacity-30">⭐</div>
          <div className="absolute top-32 left-16 text-xl opacity-40">🌸</div>
          <div className="absolute right-10 bottom-24 text-3xl opacity-30">✨</div>
          <div className="absolute bottom-10 left-12 text-2xl opacity-30">☁️</div>
          <div className="absolute right-24 bottom-12 text-xl opacity-40">🌸</div>
          <div className="absolute top-1/2 left-6 text-lg opacity-20">⭐</div>
          <div className="absolute top-1/3 right-6 text-lg opacity-20">✨</div>
        </div>

        <button
          type="button"
          aria-label="Close member detail"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full border-2 border-pink-300 bg-white text-xl font-black shadow-md hover:bg-pink-100"
        >
          ×
        </button>

        {step === 'quiz' && (
          <div className="relative z-10 rounded-3xl border-4 border-white bg-white/80 p-6 text-center shadow-xl">
            <p className="text-5xl">👑🎀✨</p>

            <p className="mt-4 text-lg font-bold">
              Aku lagi ngumpet nih 🫣
              <br />
              Kalau mau lihat, coba panggil aku dulu 💌
            </p>

            <div className="mt-5 rounded-2xl border-2 border-dashed border-pink-300 bg-pink-50 p-4 text-sm font-semibold">
              💌 Clue:
              <br />
              coba panggil dulu princess nadya 👑
            </div>

            <div className="mt-5 flex gap-2">
              <input
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="ketik jawaban..."
                type="text"
                className="w-full rounded-full border-2 border-pink-300 bg-white px-4 py-2 text-sm font-semibold outline-none placeholder:text-pink-300 focus:border-pink-500"
              />

              <button
                type="button"
                onClick={checkAnswer}
                className="rounded-full bg-pink-500 px-5 py-2 text-sm font-black text-white shadow-md transition-all hover:scale-105 hover:bg-pink-600"
              >
                jawab
              </button>
            </div>
          </div>
        )}

        {step === 'quote' && (
          <div className="relative z-10 rounded-3xl border-4 border-pink-200 bg-pink-50 p-6 text-center shadow-xl">
            <p className="text-5xl">🎀👑✨</p>

            <p className="mt-4 text-base leading-relaxed font-bold">
              "You can always begin again!
              <br />
              Romanticize your life cause you're the main character."
            </p>

            <p className="mt-4 text-2xl">🌷💗🫧</p>

            <button
              type="button"
              onClick={() => setStep('card')}
              className="mt-5 rounded-full bg-pink-500 px-6 py-2 text-sm font-black text-white shadow-md transition-all hover:scale-105 hover:bg-pink-600"
            >
              You Found Me 👀
            </button>
          </div>
        )}

        {step === 'card' && (
          <>
            <div className="relative z-10 mb-5 overflow-hidden rounded-[1.5rem] border-4 border-white shadow-lg">
              <Image src={ProfileImage} alt="Profile Image" className="h-120 w-full object-cover object-center" />
            </div>

            <div className="relative z-10 rounded-2xl bg-white/70 p-4 shadow-md">
              <h2 className="text-3xl font-black">Nadya Putri Agustin 👑</h2>

              <p className="mt-1 text-sm font-bold text-pink-700">5027251013 - Surabaya</p>
            </div>

            <div className="relative z-10 mt-5 flex gap-2">
              <Instagram username="nadyaputria._" />
              <LinkedInButtonLink username="nadyaputria" />
            </div>

            <div className="relative z-10 mt-6 grid gap-4 text-sm font-semibold sm:grid-cols-2">
              <div className="rounded-2xl border-2 border-white bg-white/60 p-4 shadow-md">
                <p className="text-xs font-black text-pink-600 uppercase">Hobi</p>
                <p className="mt-2">Ketiduran sambil dengerin musik 🎧💤</p>
              </div>

              <div className="rounded-2xl border-2 border-white bg-white/60 p-4 shadow-md">
                <p className="text-xs font-black text-pink-600 uppercase">Fun Fact</p>
                <p className="mt-2">Kalau aku gak bales chat berarti aku ketiduran 😴</p>
              </div>
            </div>

            <div className="relative z-10 mt-4 rounded-2xl border-2 border-white bg-white/60 p-4 shadow-md">
              <p className="text-xs font-black text-pink-600 uppercase">Lagu Favorit</p>

              <p className="my-2 text-sm font-bold">Begin Again 🎶</p>

              <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/05GsNucq8Bngd9fnd4fRa0?si=87e953ecc5f4492c" />
            </div>
          </>
        )}
      </div>
    </div>,
    document.body
  )
}

export default MemberPopup
