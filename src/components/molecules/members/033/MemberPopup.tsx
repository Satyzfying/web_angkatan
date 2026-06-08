'use client'

/* eslint-disable react-hooks/set-state-in-effect, react/no-unescaped-entities */

import React, { useEffect, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import Instagram from '@/components/atoms/button/InstagramButtonLink'
import LinkedInButtonLink from '@/components/atoms/button/LinkedInButtonLink'
import SpotifyEmbed from '@/components/molecules/SpotifyEmbed'
import ProfileImage from './image.jpeg'

import AriesImg from './Aries.png'
import TaurusImg from './Taurus.png'
import GeminiImg from './Gemini.png'
import CancerImg from './Cancer.png'
import LeoImg from './Leo.png'
import VirgoImg from './Virgo.png'
import LibraImg from './Libra.png'
import ScorpioImg from './Scorpio.png'
import SagittariusImg from './Sagittarius.png'
import CapricornImg from './Capricorn.png'
import AquariusImg from './Aquarius.png'
import PiscesImg from './Pisces.png'

const ZODIAC_DATA = [
  {
    image: AriesImg,
    answer: 'Aries',
    choices: ['Aries', 'Taurus', 'Leo', 'Scorpio'],
  },
  {
    image: TaurusImg,
    answer: 'Taurus',
    choices: ['Taurus', 'Gemini', 'Aries', 'Capricorn'],
  },
  {
    image: GeminiImg,
    answer: 'Gemini',
    choices: ['Cancer', 'Virgo', 'Gemini', 'Pisces'],
  },
  {
    image: CancerImg,
    answer: 'Cancer',
    choices: ['Scorpio', 'Cancer', 'Aquarius', 'Leo'],
  },
  {
    image: LeoImg,
    answer: 'Leo',
    choices: ['Aries', 'Sagittarius', 'Virgo', 'Leo'],
  },
  {
    image: VirgoImg,
    answer: 'Virgo',
    choices: ['Gemini', 'Libra', 'Virgo', 'Taurus'],
  },
  {
    image: LibraImg,
    answer: 'Libra',
    choices: ['Cancer', 'Libra', 'Capricorn', 'Pisces'],
  },
  {
    image: ScorpioImg,
    answer: 'Scorpio',
    choices: ['Aries', 'Aquarius', 'Scorpio', 'Leo'],
  },
  {
    image: SagittariusImg,
    answer: 'Sagittarius',
    choices: ['Sagittarius', 'Capricorn', 'Virgo', 'Gemini'],
  },
  {
    image: CapricornImg,
    answer: 'Capricorn',
    choices: ['Capricorn', 'Taurus', 'Pisces', 'Scorpio'],
  },
  {
    image: AquariusImg,
    answer: 'Aquarius',
    choices: ['Libra', 'Aquarius', 'Cancer', 'Sagittarius'],
  },
  {
    image: PiscesImg,
    answer: 'Pisces',
    choices: ['Gemini', 'Leo', 'Pisces', 'Aquarius'],
  },
]

function pickThreeRandom() {
  const shuffled = [...ZODIAC_DATA].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, 3)
}

type MemberPopupProps = {
  isOpen: boolean
  onClose: () => void
}

const MemberPopup = ({ isOpen, onClose }: MemberPopupProps) => {
  const [quizPool, setQuizPool] = useState<typeof ZODIAC_DATA>([])
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [isWrong, setIsWrong] = useState(false)
  const [wrongCount, setWrongCount] = useState(0)

  useEffect(() => {
    if (isOpen) {
      setQuizPool(pickThreeRandom())
      setStep(0)
      setSelected(null)
      setIsWrong(false)
    }
  }, [isOpen])

  const handleAnswer = useCallback((choice: string) => {
    const correct = quizPool[step]?.answer
    if (choice === correct) {
      setSelected(null)
      setIsWrong(false)
      setWrongCount(0)
      if (step < 2) {
        setStep((s) => (s + 1) as 0 | 1 | 2 | 3)
      } else {
        setStep(3)
      }
    } else {
      const newCount = wrongCount + 1
      setSelected(choice)
      setIsWrong(true)
      setWrongCount(newCount)

      if (newCount >= 3) {
        setTimeout(() => {
          setQuizPool(pickThreeRandom())
          setStep(0)
          setSelected(null)
          setIsWrong(false)
          setWrongCount(0)
        }, 500)
      }
    }
  }, [quizPool, step, wrongCount])

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

  if (!isOpen) return null

  const currentQ = quizPool[Math.min(step, 2)]

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-hidden px-4">

      <style>{`
        @keyframes member-popup-show {
          from { opacity: 0; transform: scale(0.93) translateY(14px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.1; transform: scale(0.7); }
          50% { opacity: 1; transform: scale(1.3); }
        }
        @keyframes nebula-drift {
          0%, 100% { transform: translate(0px, 0px) scale(1); opacity: 0.7; }
          50% { transform: translate(20px, -15px) scale(1.08); opacity: 1; }
        }
        @keyframes shooting-star {
          0%   { transform: translateX(-120px) translateY(-120px) rotate(45deg); opacity: 0; }
          8%   { opacity: 1; }
          100% { transform: translateX(900px) translateY(900px) rotate(45deg); opacity: 0; }
        }
        @keyframes planet-float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(4deg); }
        }
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          20%     { transform: translateX(-8px); }
          40%     { transform: translateX(8px); }
          60%     { transform: translateX(-5px); }
          80%     { transform: translateX(5px); }
        }
        .shake-anim { animation: shake 0.4s ease; }
        .section-glow-blue {
          border: 1.5px solid rgba(129,140,248,0.7);
          box-shadow: 0 0 0 1px rgba(129,140,248,0.08),
                      0 0 12px 0px rgba(129,140,248,0.35),
                      inset 0 0 10px 0px rgba(99,102,241,0.12);
          background: rgba(7,11,32,0.82);
          backdrop-filter: blur(14px);
        }
        .inner-glow-purple {
          border: 1.5px solid rgba(192,132,252,0.65);
          box-shadow: 0 0 0 1px rgba(192,132,252,0.07),
                      0 0 10px 0px rgba(168,85,247,0.3),
                      inset 0 0 8px 0px rgba(168,85,247,0.1);
          background: rgba(15,20,50,0.7);
          backdrop-filter: blur(12px);
          transition: all 0.3s ease;
        }
        .inner-glow-purple:hover {
          border-color: rgba(232,121,249,0.85);
          box-shadow: 0 0 0 1px rgba(232,121,249,0.09),
                      0 0 16px 1px rgba(168,85,247,0.45),
                      inset 0 0 12px 0px rgba(232,121,249,0.15);
          transform: translateY(-2px);
        }
        .inner-glow-cyan {
          border: 1.5px solid rgba(56,189,248,0.65);
          box-shadow: 0 0 0 1px rgba(56,189,248,0.07),
                      0 0 10px 0px rgba(56,189,248,0.28),
                      inset 0 0 8px 0px rgba(56,189,248,0.1);
          background: rgba(15,20,50,0.7);
          backdrop-filter: blur(12px);
          transition: all 0.3s ease;
        }
        .inner-glow-cyan:hover {
          border-color: rgba(103,232,249,0.85);
          box-shadow: 0 0 0 1px rgba(103,232,249,0.09),
                      0 0 16px 1px rgba(56,189,248,0.42),
                      inset 0 0 12px 0px rgba(103,232,249,0.15);
          transform: translateY(-2px);
        }
      `}</style>

      <button
        type="button"
        aria-label="Close member detail"
        onClick={onClose}
        className="fixed inset-0 bg-[#020617]/90 backdrop-blur-md"
      />

      {/* Card utama */}
      <div className="section-glow-blue relative z-10 flex h-[100dvh] max-h-[100dvh] w-full max-w-[720px] animate-[member-popup-show_300ms_ease-out] flex-col overflow-hidden rounded-3xl text-white">

        {/* Background*/}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-20%] h-[400px] w-[400px] rounded-full bg-fuchsia-600/25 blur-[90px] animate-[nebula-drift_16s_ease-in-out_infinite]" />
          <div className="absolute bottom-[-20%] right-[-10%] h-[450px] w-[450px] rounded-full bg-blue-600/25 blur-[110px] animate-[nebula-drift_22s_ease-in-out_infinite_reverse]" />
          {/* Bintang */}
          <div
            className="absolute top-[5%] right-[5%] h-[90px] w-[90px] rounded-full animate-[planet-float_9s_ease-in-out_infinite] opacity-85"
            style={{
              background: 'radial-gradient(circle at 38% 35%, #fef5bf 0%, #fac460 30%, #d89d1d 65%, #4a320c 100%)',
              boxShadow: '0 0 30px 8px rgba(250, 235, 96, 0.55), 0 0 60px 16px rgba(246, 206, 59, 0.25), inset -6px -6px 14px rgba(0,0,0,0.5)',
            }}
          />
          {/* Shooting stars */}
          <div className="absolute top-0 left-[15%] h-[1.5px] w-[130px] bg-gradient-to-r from-transparent via-white to-transparent shadow-[0_0_8px_white] animate-[shooting-star_5s_linear_infinite_1s]" />
          <div className="absolute top-0 left-[55%] h-[1px] w-[80px] bg-gradient-to-r from-transparent via-blue-200 to-transparent shadow-[0_0_6px_#bfdbfe] animate-[shooting-star_7s_linear_infinite_3.5s]" />

          {[...Array(100)].map((_, i) => {
            const top = (i * 23) % 100
            const left = (i * 47) % 100
            const size = (i % 3) + 1
            const colors = ['white', '#f0f9ff', '#acd0fc', '#fcd34d']
            return (
              <div key={i} className="absolute rounded-full" style={{
                top: `${top}%`, left: `${left}%`,
                width: `${size}px`, height: `${size}px`,
                backgroundColor: colors[i % colors.length],
                boxShadow: `0 0 ${size * 2}px ${colors[i % colors.length]}`,
                animation: `twinkle ${2 + (i % 4)}s infinite ${i % 5}s`,
              }} />
            )
          })}
        </div>

        {/* Tombol tutup */}
        <button
          type="button"
          aria-label="Close member detail"
          onClick={onClose}
          className="absolute top-4 right-4 z-50 flex h-10 w-10 items-center justify-center rounded-full text-xl leading-none text-indigo-100 transition-all"
          style={{
            border: '1.5px solid rgba(129,140,248,0.6)',
            background: 'rgba(10,15,40,0.88)',
            boxShadow: '0 0 10px rgba(99,102,241,0.35)',
          }}
        >x</button>

        {/* Kuis */}
        {step < 3 && currentQ && (
          <div className="relative z-10 flex flex-col items-center justify-center p-8 min-h-[480px] text-center">
            {/* Progress */}
            <p className="text-[11px] text-indigo-300/70 uppercase tracking-widest font-bold mb-1">
              Soal {step + 1} dari 3
            </p>

            {/* Judul */}
            <h2 className="text-xl font-black mb-5 text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-400">
              Rasi apakah ini?
            </h2>

            {/* Gambar rasi */}
            <div className={`mb-6 rounded-2xl ${isWrong ? 'shake-anim' : ''}`}
              style={{
                maxWidth: '700px',
                border: '1.5px solid rgba(129,140,248,0.5)',
                boxShadow: '0 0 20px rgba(99,102,241,0.3)',
              }}
              key={step}
            >
              <Image
                src={currentQ.image}
                alt="Rasi zodiak"
                width={700}
                height={700}
                className="w-auto h-auto"
                style={{ display: 'block' }}
              />
            </div>

            {/* Pesan salah */}
            {isWrong && (
              <p className="text-red-400 text-xs font-bold mb-3 tracking-wide">
                Jawaban salah! {wrongCount >= 3 ? 'Ulang dari awal yak...' : `${3 - wrongCount} kesempatan tersisa`}
              </p>
            )}

            {/* Pilihan jawaban */}
            <div className="flex flex-col gap-2.5 w-full max-w-[300px] mx-auto">
              {currentQ.choices.map((choice) => {
                const isSelected = selected === choice
                const isCorrect = choice === currentQ.answer
                return (
                  <button
                    key={choice}
                    onClick={() => handleAnswer(choice)}
                    style={{
                      display: 'block', width: '100%',
                      border: isSelected && !isCorrect
                        ? '1.5px solid rgba(239,68,68,0.8)'
                        : '1.5px solid rgba(255,255,255,0.15)',
                      borderRadius: '0.75rem',
                      padding: '0.7rem 1rem',
                      background: isSelected && !isCorrect
                        ? 'rgba(239,68,68,0.15)'
                        : 'rgba(255,255,255,0.04)',
                      fontSize: '0.875rem', fontWeight: 600,
                      color: 'rgba(255,255,255,0.85)',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      boxShadow: isSelected && !isCorrect
                        ? '0 0 8px rgba(239,68,68,0.3)'
                        : 'none',
                    }}
                    onMouseEnter={e => {
                      if (!isSelected || isCorrect) {
                        const el = e.currentTarget as HTMLElement
                        el.style.background = 'rgba(96,165,250,0.12)'
                        el.style.borderColor = 'rgba(96,165,250,0.5)'
                      }
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget as HTMLElement
                      if (isSelected && !isCorrect) {
                        el.style.background = 'rgba(239,68,68,0.15)'
                        el.style.borderColor = 'rgba(239,68,68,0.8)'
                      } else {
                        el.style.background = 'rgba(255,255,255,0.04)'
                        el.style.borderColor = 'rgba(255,255,255,0.15)'
                      }
                    }}
                  >
                    {choice}
                  </button>
                )
              })}
            </div>

            <p className="text-[10px] text-white/30 mt-5 uppercase tracking-wider">
              Pilih jawaban yang benar untuk lanjut
            </p>
          </div>
        )}

        {/* Profile view*/}
        {step === 3 && (
          <div className="relative z-10 overflow-y-auto w-full h-full p-6 sm:p-8 animate-[member-popup-show_400ms_ease-out]">

            {/* Foto profil */}
            <div className="mb-6 mt-2 mx-auto overflow-hidden rounded-2xl"
              style={{
                width: '75%', aspectRatio: '1 / 1',
                border: '1.5px solid rgba(129,140,248,0.6)',
                boxShadow: '0 0 0 1px rgba(129,140,248,0.08), 0 0 20px 2px rgba(99,102,241,0.3)',
              }}
            >
              <Image
                src={ProfileImage}
                alt="Profile Image"
                width={600}
                height={600}
                className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
              />
            </div>

            {/* Nama & NRP */}
            <div className="pr-12">
              <h2 className="text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-100 via-indigo-200 to-purple-200 drop-shadow-[0_2px_10px_rgba(167,139,250,0.7)]">
                {/* UBAH NAMA ANDA */}
                Daffa Ulhaq Fadhlurrahman
              </h2>
              <p className="text-indigo-200/70 mt-2 text-sm font-bold tracking-widest uppercase">
                {/* UBAH NRP DAN ASAL */}
                5027251033 • BANDA ACEH
              </p>
            </div>

            {/* Social media */}
            <div className="mt-6 flex gap-3">
              <div className="hover:scale-110 hover:-translate-y-1 transition-all duration-300 rounded-full p-1"
                style={{ background: 'rgba(30,40,90,0.5)', border: '1px solid rgba(129,140,248,0.35)', boxShadow: '0 0 8px rgba(99,102,241,0.2)' }}>
                {/* UBAH USERNAME INSTAGRAM */}
                <Instagram username="daffa_ulhaq8" />
              </div>
              <div className="hover:scale-110 hover:-translate-y-1 transition-all duration-300 rounded-full p-1"
                style={{ background: 'rgba(30,40,90,0.5)', border: '1px solid rgba(129,140,248,0.35)', boxShadow: '0 0 8px rgba(99,102,241,0.2)' }}>
                {/* UBAH USERNAME LINKEDIN */}
                <LinkedInButtonLink username="daffaulhaqf" />
              </div>
            </div>

            {/* Hobi & Fun Fact */}
            <div className="mt-8 grid gap-5 text-sm font-semibold sm:grid-cols-2">
              <div className="inner-glow-purple rounded-xl p-5">
                {/* UBAH HOBI KAMU */}
                <p className="text-indigo-300 text-xs tracking-widest uppercase mb-2 font-black">Hobi</p>
                <p className="text-blue-50 leading-relaxed font-medium">Main game (Geometry Dash, MLBB, game FPS/TPS + Story kayak Resident Evil), dengar lagu, main futsal</p>
              </div>
              <div className="inner-glow-purple rounded-xl p-5">
                {/* UBAH FUNFACT KAMU */}
                <p className="text-purple-300 text-xs tracking-widest uppercase mb-2 font-black">Fun Fact</p>
                <p className="text-blue-50 leading-relaxed font-medium">Aku fans King Emyu dan King Barca</p>
              </div>
            </div>

            {/* Lagu Favorit */}
            <div className="inner-glow-cyan mt-5 mb-2 rounded-xl p-5">
              {/* UBAH LAGU FAVORIT KAMU */}
              <p className="text-blue-300 text-xs font-black tracking-widest uppercase mb-2">Lagu Favorit</p>
              <p className="my-3 text-sm font-medium text-indigo-50">Banyak sih, sayangnya disini cuman bisa satu lagu :'( Yaudah deh, ini dia "Daylight - Maroon 5"</p>
              <div className="rounded-xl overflow-hidden"
                style={{ border: '1.5px solid rgba(99,102,241,0.45)', boxShadow: '0 0 12px rgba(99,102,241,0.25)' }}>
                {/* UBAH URL SPOTIFY KAMU */}
                <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/1NNAI51EuoRWw1ydX1zV7S?si=a6edcd2e0d454909" />
              </div>
            </div>

          </div>
        )}

      </div>
    </div>,
    document.body
  )
}

export default MemberPopup
