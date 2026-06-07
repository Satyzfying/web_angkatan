'use client'

import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'

import Instagram from '@/components/atoms/button/InstagramButtonLink'
import LinkedInButtonLink from '@/components/atoms/button/LinkedInButtonLink'
import SpotifyEmbed from '@/components/molecules/SpotifyEmbed'

import ProfileImage from './image.jpg'

type MemberPopupProps = {
  isOpen: boolean
  onClose: () => void
}

const triviaQuestions = [
  {
    question: "Siapa vokalis dari band legendaris The Doors?",
    options: ["Mick Jagger", "Jim Morrison", "Roger Daltrey", "Janis Joplin"],
    answer: 1,
  },
  {
    question: "Kapan Queen membawakan penampilan Live Aid yang legendaris itu?",
    options: ["13 Juli 1983", "13 Juli 1985", "7 Juni 1981", "21 November 1986"],
    answer: 1,
  },
  {
    question: "Lagu 'The Long and Winding Road' dibawakan oleh band mana?",
    options: ["The Rolling Stones", "Led Zeppelin", "The Who", "The Beatles"],
    answer: 3,
  },
  {
    question: "Siapa yang mempopulerkan genre grunge di tahun 90-an?",
    options: ["Pearl Jam", "Soundgarden", "Nirvana", "Alice in Chains"],
    answer: 2,
  },
]

const MemberPopup = ({ isOpen, onClose }: MemberPopupProps) => {
  const [triviaCleared, setTriviaCleared] = useState(false)
  const [triviaIndex, setTriviaIndex] = useState(0)
  const [answered, setAnswered] = useState<number | null>(null)
  const [failed, setFailed] = useState(false)

  // Reset trivia setiap kali popup dibuka
  useEffect(() => {
    if (isOpen) {
      setTriviaCleared(false)
      setTriviaIndex(0)
      setAnswered(null)
      setFailed(false)
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return

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

  const handleAnswer = (i: number) => {
    if (answered !== null || failed) return
    setAnswered(i)

    if (i !== triviaQuestions[triviaIndex].answer) {
      setFailed(true)
      setTimeout(() => {
        setTriviaIndex(0)
        setAnswered(null)
        setFailed(false)
      }, 1800)
      return
    }

    setTimeout(() => {
      if (triviaIndex + 1 >= triviaQuestions.length) {
        setTriviaCleared(true)
      } else {
        setTriviaIndex(idx => idx + 1)
        setAnswered(null)
      }
    }, 900)
  }

  if (!isOpen) return null

  // Gunakan createPortal agar popup ter-render di luar hirarki DOM utama (sesuai req branch dev)
  return createPortal(
    <>
      {/* ── TRIVIA GATE ────────────────────────────────────────────── */}
      {!triviaCleared ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center px-4"
          style={{ background: 'rgba(10, 5, 0, 0.96)' }}
        >
          {/* Background SVG decorations */}
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full"
            style={{ opacity: 0.15, zIndex: 1 }}
            viewBox="0 0 700 820"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <circle cx="620" cy="130" r="88" fill="none" stroke="#e8dfc0" strokeWidth="1" opacity="0.06" />
            <circle cx="620" cy="130" r="62" fill="none" stroke="#e8dfc0" strokeWidth="0.6" opacity="0.05" />
            <circle cx="620" cy="130" r="35" fill="none" stroke="#e8dfc0" strokeWidth="0.4" opacity="0.05" />
            <circle cx="620" cy="130" r="5" fill="#c8972a" opacity="0.18" />
            <g transform="translate(58,690)" stroke="#c8972a" fill="none" opacity="0.16">
              <ellipse cx="0" cy="-44" rx="15" ry="44" strokeWidth="1.4" />
              <ellipse cx="0" cy="-44" rx="9" ry="24" strokeWidth="0.7" />
              <line x1="-15" y1="-44" x2="15" y2="-44" strokeWidth="0.7" />
              <line x1="0" y1="0" x2="0" y2="18" strokeWidth="2" />
              <rect x="-14" y="18" width="28" height="11" rx="2" strokeWidth="1.4" />
              <line x1="-5" y1="-72" x2="-5" y2="-88" strokeWidth="1.2" />
              <line x1="5" y1="-72" x2="5" y2="-88" strokeWidth="1.2" />
              <circle cx="-5" cy="-92" r="4" strokeWidth="1.2" />
              <circle cx="5" cy="-92" r="4" strokeWidth="1.2" />
            </g>
            <g transform="translate(638,720)" stroke="#c8972a" fill="none" opacity="0.16">
              <rect x="-20" y="-58" width="40" height="72" rx="3" strokeWidth="1.2" />
              <circle cx="0" cy="5" r="7" strokeWidth="1" />
              <circle cx="0" cy="5" r="3" strokeWidth="1" />
            </g>
            <path d="M-20,230 Q100,210 200,248 Q300,280 400,238 Q500,200 620,228 Q680,240 730,218" fill="none" stroke="#c8972a" strokeWidth="0.5" opacity="0.1" />
            <text x="350" y="34" fill="#c8972a" fontFamily="'Oswald',sans-serif" fontSize="9" letterSpacing="7" textAnchor="middle" opacity="0.28" fontWeight="700">★  ROCK  AND  ROLL  ★</text>
            <line x1="30" y1="42" x2="670" y2="42" stroke="#c8972a" strokeWidth="0.4" opacity="0.22" />
            <text x="350" y="808" fill="#c8972a" fontFamily="'Oswald',sans-serif" fontSize="9" letterSpacing="7" textAnchor="middle" opacity="0.28" fontWeight="700">★  ROCK  AND  ROLL  ★</text>
            <line x1="30" y1="793" x2="670" y2="793" stroke="#c8972a" strokeWidth="0.4" opacity="0.22" />
          </svg>

          {/* Trivia panel */}
          <div
            className="relative w-full max-w-[480px] p-6 sm:p-8"
            style={{
              zIndex: 10,
              background: '#100d08',
              border: '2px solid #c8972a',
              borderRadius: '2px',
              fontFamily: "'Special Elite', monospace",
            }}
          >
            {/* Corner ornaments */}
            <div className="pointer-events-none absolute top-[14px] left-[14px] h-[18px] w-[18px]"
              style={{ borderTop: '2px solid #c8972a', borderLeft: '2px solid #c8972a', opacity: 0.75 }} />
            <div className="pointer-events-none absolute top-[14px] right-[14px] h-[18px] w-[18px]"
              style={{ borderTop: '2px solid #c8972a', borderRight: '2px solid #c8972a', opacity: 0.75 }} />
            <div className="pointer-events-none absolute bottom-[14px] left-[14px] h-[18px] w-[18px]"
              style={{ borderBottom: '2px solid #c8972a', borderLeft: '2px solid #c8972a', opacity: 0.75 }} />
            <div className="pointer-events-none absolute bottom-[14px] right-[14px] h-[18px] w-[18px]"
              style={{ borderBottom: '2px solid #c8972a', borderRight: '2px solid #c8972a', opacity: 0.75 }} />

            {/* Close button */}
            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full text-base leading-none transition-colors"
              style={{
                border: '1.5px solid #c8972a',
                color: '#c8972a',
                background: 'transparent',
                fontFamily: "'Special Elite', monospace",
                zIndex: 10,
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(200,151,42,0.15)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              ✕
            </button>

            {/* Header */}
            <div className="mb-5 pr-24">
              <h2
                style={{
                  fontFamily: "'Oswald', sans-serif",
                  fontSize: '20px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '3px',
                  color: '#f2d878',
                }}
              >
                ★ Rock Trivia
              </h2>
              <p
                className="mt-1 text-[10px] tracking-[3px] uppercase"
                style={{ color: 'rgba(200,151,42,0.5)', fontFamily: "'Oswald', sans-serif" }}
              >
                Jawab semua benar untuk membuka profil
              </p>
            </div>

            <div className="mb-4" style={{ borderTop: '1px solid rgba(200,151,42,0.25)' }} />

            {/* Progress bar */}
            <div className="mb-4 flex gap-2">
              {triviaQuestions.map((_, i) => (
                <div
                  key={i}
                  className="h-1 flex-1"
                  style={{
                    background: i < triviaIndex
                      ? '#c8972a'
                      : i === triviaIndex
                      ? 'rgba(200,151,42,0.45)'
                      : 'rgba(200,151,42,0.12)',
                    borderRadius: '1px',
                    transition: 'background 0.3s',
                  }}
                />
              ))}
            </div>

            {/* Soal number */}
            <p
              className="mb-3 text-[10px] tracking-[3px] uppercase"
              style={{ color: 'rgba(200,151,42,0.5)', fontFamily: "'Oswald', sans-serif" }}
            >
              ⟡ Soal {triviaIndex + 1} / {triviaQuestions.length}
            </p>

            {/* Question */}
            <p
              className="mb-5 text-sm leading-relaxed"
              style={{ fontFamily: "'Libre Baskerville', serif", color: '#e8dfc0' }}
            >
              {triviaQuestions[triviaIndex].question}
            </p>

            {/* Failed notice */}
            {failed && (
              <div
                className="mb-3 px-3 py-2 text-xs text-center tracking-widest uppercase"
                style={{
                  border: '1px solid rgba(229,115,115,0.4)',
                  background: 'rgba(229,115,115,0.07)',
                  color: '#ef9a9a',
                  fontFamily: "'Oswald', sans-serif",
                  letterSpacing: '2px',
                }}
              >
                ✕ Salah — Mulai dari awal...
              </div>
            )}

            {/* Options */}
            <div className="flex flex-col gap-2">
              {triviaQuestions[triviaIndex].options.map((opt, i) => {
                let borderColor = 'rgba(200,151,42,0.25)'
                let bgColor = 'transparent'
                let textColor = '#e8dfc0'

                if (answered !== null) {
                  if (i === triviaQuestions[triviaIndex].answer) {
                    borderColor = '#4caf50'
                    bgColor = 'rgba(76,175,80,0.1)'
                    textColor = '#a5d6a7'
                  } else if (i === answered && i !== triviaQuestions[triviaIndex].answer) {
                    borderColor = '#e57373'
                    bgColor = 'rgba(229,115,115,0.1)'
                    textColor = '#ef9a9a'
                  }
                }

                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleAnswer(i)}
                    className="text-left px-3 py-2 text-xs"
                    style={{
                      border: `1px solid ${borderColor}`,
                      borderRadius: '2px',
                      background: bgColor,
                      color: textColor,
                      fontFamily: "'Special Elite', monospace",
                      cursor: answered !== null ? 'default' : 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => {
                      if (answered === null) e.currentTarget.style.background = 'rgba(200,151,42,0.08)'
                    }}
                    onMouseLeave={e => {
                      if (answered === null) e.currentTarget.style.background = bgColor
                    }}
                  >
                    {String.fromCharCode(65 + i)}. {opt}
                  </button>
                )
              })}
            </div>

            {/* Footer */}
            <div className="mt-5 pt-3" style={{ borderTop: '1px solid rgba(200,151,42,0.18)' }}>
              <svg
                viewBox="0 0 600 26"
                xmlns="http://www.w3.org/2000/svg"
                style={{ width: '100%', height: '26px' }}
                aria-hidden="true"
              >
                <text
                  x="300" y="17"
                  fill="#c8972a"
                  fontFamily="'Oswald',sans-serif"
                  fontSize="9"
                  letterSpacing="5"
                  textAnchor="middle"
                  opacity="0.42"
                  fontWeight="700"
                >
                  ★   THE BEATLES  ·  LED ZEPPELIN  ·  THE ROLLING STONES  ·  QUEEN   ★
                </text>
              </svg>
            </div>
          </div>
        </div>
      ) : (
        /* ── MEMBER POPUP (setelah trivia cleared) ──────────────────── */
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto px-4 pt-28 pb-8 sm:pt-32"
          style={{ background: 'rgba(10, 5, 0, 0.92)' }}
        >
          {/* Backdrop close */}
          <button
            type="button"
            aria-label="Close member detail"
            onClick={onClose}
            className="absolute inset-0"
          />

          {/* Background SVG decorations */}
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full"
            style={{ opacity: 0.18, zIndex: 1 }}
            viewBox="0 0 700 820"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <circle cx="620" cy="130" r="88" fill="none" stroke="#e8dfc0" strokeWidth="1" opacity="0.06" />
            <circle cx="620" cy="130" r="62" fill="none" stroke="#e8dfc0" strokeWidth="0.6" opacity="0.05" />
            <circle cx="620" cy="130" r="35" fill="none" stroke="#e8dfc0" strokeWidth="0.4" opacity="0.05" />
            <circle cx="620" cy="130" r="5" fill="#c8972a" opacity="0.18" />
            <line x1="532" y1="130" x2="610" y2="130" stroke="#e8dfc0" strokeWidth="0.5" opacity="0.05" />
            <line x1="630" y1="130" x2="708" y2="130" stroke="#e8dfc0" strokeWidth="0.5" opacity="0.05" />
            <line x1="620" y1="42" x2="620" y2="120" stroke="#e8dfc0" strokeWidth="0.5" opacity="0.05" />
            <line x1="620" y1="140" x2="620" y2="218" stroke="#e8dfc0" strokeWidth="0.5" opacity="0.05" />
            <g transform="translate(58,690)" stroke="#c8972a" fill="none" opacity="0.16">
              <ellipse cx="0" cy="-44" rx="15" ry="44" strokeWidth="1.4" />
              <ellipse cx="0" cy="-44" rx="9" ry="24" strokeWidth="0.7" />
              <line x1="-15" y1="-44" x2="15" y2="-44" strokeWidth="0.7" />
              <line x1="0" y1="0" x2="0" y2="18" strokeWidth="2" />
              <rect x="-14" y="18" width="28" height="11" rx="2" strokeWidth="1.4" />
              <line x1="-5" y1="-72" x2="-5" y2="-88" strokeWidth="1.2" />
              <line x1="5" y1="-72" x2="5" y2="-88" strokeWidth="1.2" />
              <circle cx="-5" cy="-92" r="4" strokeWidth="1.2" />
              <circle cx="5" cy="-92" r="4" strokeWidth="1.2" />
            </g>
            <g transform="translate(638,720)" stroke="#c8972a" fill="none" opacity="0.16">
              <rect x="-20" y="-58" width="40" height="72" rx="3" strokeWidth="1.2" />
              <line x1="-12" y1="-46" x2="-7" y2="-46" strokeWidth="1.8" />
              <line x1="-12" y1="-37" x2="-7" y2="-37" strokeWidth="1.8" />
              <line x1="-12" y1="-28" x2="-7" y2="-28" strokeWidth="1.8" />
              <line x1="-12" y1="-19" x2="-7" y2="-19" strokeWidth="1.8" />
              <circle cx="0" cy="5" r="7" strokeWidth="1" />
              <circle cx="0" cy="5" r="3" strokeWidth="1" />
            </g>
            <g transform="translate(660,420)" stroke="#c8972a" fill="none" opacity="0.14">
              <path d="M0,-44 L10,-13 L44,-13 L18,5 L28,38 L0,18 L-28,38 L-18,5 L-44,-13 L-10,-13 Z" fill="#c8972a" opacity="0.1" strokeWidth="1.2" />
            </g>
            <g transform="translate(56,370)" stroke="#c8972a" fill="none" opacity="0.14">
              <path d="M-6,22 C-6,22 -3,-34 0,-42 C3,-34 6,22 6,22" strokeWidth="1" />
              <ellipse cx="0" cy="22" rx="6" ry="3" strokeWidth="1" />
              <line x1="0" y1="-42" x2="0" y2="-55" strokeWidth="1.5" />
              <circle cx="0" cy="-59" r="4" strokeWidth="1" />
              <path d="M-10,5 C-18,0 -18,-18 -10,-14" strokeWidth="0.8" />
              <path d="M10,5 C18,0 18,-18 10,-14" strokeWidth="0.8" />
            </g>
            <path d="M-20,230 Q100,210 200,248 Q300,280 400,238 Q500,200 620,228 Q680,240 730,218" fill="none" stroke="#c8972a" strokeWidth="0.5" opacity="0.1" />
            <text x="350" y="34" fill="#c8972a" fontFamily="'Oswald',sans-serif" fontSize="9" letterSpacing="7" textAnchor="middle" opacity="0.28" fontWeight="700">★  ROCK  AND  ROLL  ★</text>
            <line x1="30" y1="42" x2="670" y2="42" stroke="#c8972a" strokeWidth="0.4" opacity="0.22" />
            <text x="350" y="808" fill="#c8972a" fontFamily="'Oswald',sans-serif" fontSize="9" letterSpacing="7" textAnchor="middle" opacity="0.28" fontWeight="700">★  ROCK  AND  ROLL  ★</text>
            <line x1="30" y1="793" x2="670" y2="793" stroke="#c8972a" strokeWidth="0.4" opacity="0.22" />
          </svg>

          {/* Main panel */}
          <div
            className="relative w-full max-w-[720px] animate-[member-popup-show_200ms_ease-out] overflow-y-auto p-6 text-[#e8dfc0] sm:p-8"
            style={{
              zIndex: 10,
              background: '#100d08',
              border: '2px solid #c8972a',
              borderRadius: '2px',
              maxHeight: 'calc(100vh - 9rem)',
              fontFamily: "'Special Elite', monospace",
            }}
          >
            <div className="pointer-events-none absolute inset-[8px]"
              style={{ border: '1px solid rgba(200,151,42,0.18)', borderRadius: '1px' }} />
            <div className="pointer-events-none absolute top-[14px] left-[14px] h-[18px] w-[18px]"
              style={{ borderTop: '2px solid #c8972a', borderLeft: '2px solid #c8972a', opacity: 0.75 }} />
            <div className="pointer-events-none absolute top-[14px] right-[14px] h-[18px] w-[18px]"
              style={{ borderTop: '2px solid #c8972a', borderRight: '2px solid #c8972a', opacity: 0.75 }} />
            <div className="pointer-events-none absolute bottom-[14px] left-[14px] h-[18px] w-[18px]"
              style={{ borderBottom: '2px solid #c8972a', borderLeft: '2px solid #c8972a', opacity: 0.75 }} />
            <div className="pointer-events-none absolute bottom-[14px] right-[14px] h-[18px] w-[18px]"
              style={{ borderBottom: '2px solid #c8972a', borderRight: '2px solid #c8972a', opacity: 0.75 }} />

            <button
              type="button"
              aria-label="Close member detail"
              onClick={onClose}
              className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full text-base leading-none transition-colors"
              style={{
                border: '1.5px solid #c8972a',
                color: '#c8972a',
                background: 'transparent',
                fontFamily: "'Special Elite', monospace",
                zIndex: 10,
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(200,151,42,0.15)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              ✕
            </button>

            <div className="relative mb-5 overflow-hidden"
              style={{ border: '2px solid #c8972a', borderRadius: '2px' }}>
              <div className="w-full aspect-[62/34] relative">
                <Image
                  src={ProfileImage}
                  alt="Profile Image"
                  className="object-cover h-full w-full object-center"
                  style={{ filter: 'contrast(1.05) saturate(1.0)' }}
                />
                <div className="pointer-events-none absolute inset-0"
                  style={{ background: 'radial-gradient(ellipse at 50% 50%, transparent 50%, rgba(0,0,0,0.4) 100%)', zIndex: 2 }} />
                <svg className="pointer-events-none absolute inset-0 h-full w-full"
                  style={{ opacity: 0.12, zIndex: 3 }} viewBox="0 0 620 340"
                  preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <defs>
                    <pattern id="grain" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
                      <rect width="4" height="4" fill="transparent" />
                      <circle cx="1" cy="1" r="0.6" fill="#fff" opacity="0.2" />
                      <circle cx="3" cy="3" r="0.4" fill="#fff" opacity="0.12" />
                      <circle cx="2" cy="0.5" r="0.5" fill="#fff" opacity="0.1" />
                      <circle cx="0.5" cy="3" r="0.3" fill="#fff" opacity="0.08" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grain)" />
                </svg>
                <svg className="pointer-events-none absolute inset-0 h-full w-full"
                  style={{ zIndex: 4 }} viewBox="0 0 620 340"
                  preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <rect x="8" y="8" width="604" height="324" fill="none" stroke="#c8972a" strokeWidth="0.8" opacity="0.35" />
                  <line x1="8" y1="8" x2="32" y2="8" stroke="#c8972a" strokeWidth="1.5" opacity="0.6" />
                  <line x1="8" y1="8" x2="8" y2="32" stroke="#c8972a" strokeWidth="1.5" opacity="0.6" />
                  <line x1="612" y1="8" x2="588" y2="8" stroke="#c8972a" strokeWidth="1.5" opacity="0.6" />
                  <line x1="612" y1="8" x2="612" y2="32" stroke="#c8972a" strokeWidth="1.5" opacity="0.6" />
                  <line x1="8" y1="332" x2="32" y2="332" stroke="#c8972a" strokeWidth="1.5" opacity="0.6" />
                  <line x1="8" y1="332" x2="8" y2="308" stroke="#c8972a" strokeWidth="1.5" opacity="0.6" />
                  <line x1="612" y1="332" x2="588" y2="332" stroke="#c8972a" strokeWidth="1.5" opacity="0.6" />
                  <line x1="612" y1="332" x2="612" y2="308" stroke="#c8972a" strokeWidth="1.5" opacity="0.6" />
                </svg>
              </div>
            </div>

            <div className="pr-10">
              <h2 className="leading-tight"
                style={{ fontFamily: "'Oswald', sans-serif", fontSize: '26px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '3px', color: '#f2d878' }}>
                Sean Arthur Tamajaya
              </h2>
              <p className="mt-1 text-xs tracking-widest uppercase"
                style={{ color: 'rgba(200,151,42,0.58)', fontFamily: "'Special Elite', monospace" }}>
                5027251050  ·  Jombang
              </p>
            </div>

            <div className="my-2" style={{ borderTop: '1px solid rgba(200,151,42,0.25)' }} />

            <div className="-mt-1 flex items-center justify-start gap-2" style={{ transform: 'scale(0.78)', transformOrigin: 'left center' }}>
              <Instagram username="seanarthur17" />
              <LinkedInButtonLink username="sean-arthur-tamajaya-1846b3379" />
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="p-4" style={{ border: '1px solid rgba(200,151,42,0.25)', borderRadius: '2px', background: 'rgba(200,151,42,0.03)' }}>
                <p className="mb-2 text-[10px] tracking-[3px] uppercase"
                  style={{ color: 'rgba(200,151,42,0.5)', fontFamily: "'Oswald', sans-serif" }}>⟡ Hobi</p>
                <p className="text-sm leading-relaxed"
                  style={{ fontFamily: "'Libre Baskerville', serif", fontWeight: 400, color: '#e8dfc0' }}>
                  Olahraga, Main musik
                </p>
              </div>
              <div className="p-4" style={{ border: '1px solid rgba(200,151,42,0.25)', borderRadius: '2px', background: 'rgba(200,151,42,0.03)' }}>
                <p className="mb-2 text-[10px] tracking-[3px] uppercase"
                  style={{ color: 'rgba(200,151,42,0.5)', fontFamily: "'Oswald', sans-serif" }}>⟡ Fun Fact</p>
                <p className="text-sm leading-relaxed"
                  style={{ fontFamily: "'Libre Baskerville', serif", fontWeight: 400, color: '#e8dfc0' }}>
                  I Am Vengeance! I Am The Night! I Am Batman!
                </p>
              </div>
            </div>

            <div className="mt-4 p-4" style={{ border: '1px solid rgba(200,151,42,0.25)', borderRadius: '2px', background: 'rgba(200,151,42,0.03)' }}>
              <p className="text-[10px] tracking-[3px] uppercase"
                style={{ color: 'rgba(200,151,42,0.5)', fontFamily: "'Oswald', sans-serif" }}>♪ Lagu Favorit</p>

              {/* Lagu 1 */}
              <p className="mt-3 mb-2 tracking-widest uppercase"
                style={{ fontFamily: "'Oswald', sans-serif", fontSize: '13px', fontWeight: 700, color: '#f2d878', letterSpacing: '2px' }}>
                Oh! Darling
              </p>
              <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/2mxByJWOajjiVsLWjNXvDJ?si=f21ada6a0280484f" />

              {/* Divider */}
              <div className="my-3" style={{ borderTop: '1px solid rgba(200,151,42,0.15)' }} />

              {/* Lagu 2 */}
              <p className="mt-3 mb-2 tracking-widest uppercase"
                style={{ fontFamily: "'Oswald', sans-serif", fontSize: '13px', fontWeight: 700, color: '#f2d878', letterSpacing: '2px' }}>
                Rock and Roll
              </p>
              <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/4PRGxHpCpF2yoOHYKQIEwD?si=3bc87257be594c38" />

              {/* Divider */}
              <div className="my-3" style={{ borderTop: '1px solid rgba(200,151,42,0.15)' }} />

              {/* Lagu 3 */}
              <p className="mt-3 mb-2 tracking-widest uppercase"
                style={{ fontFamily: "'Oswald', sans-serif", fontSize: '13px', fontWeight: 700, color: '#f2d878', letterSpacing: '2px' }}>
                Don't Look Back in Anger
              </p>
              <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/0UvCh63URrLFcPkKt99hHd?si=75b7a85f2d4c4ff8" />
            </div>

            <div className="mt-4 pt-3" style={{ borderTop: '1px solid rgba(200,151,42,0.18)' }}>
              <svg viewBox="0 0 600 26" xmlns="http://www.w3.org/2000/svg"
                style={{ width: '100%', height: '26px' }} aria-hidden="true">
                <text x="300" y="17" fill="#c8972a" fontFamily="'Oswald',sans-serif"
                  fontSize="9" letterSpacing="5" textAnchor="middle" opacity="0.42" fontWeight="700">
                  ★   THE BEATLES  ·  LED ZEPPELIN  ·  THE ROLLING STONES  ·  QUEEN   ★
                </text>
              </svg>
            </div>
          </div>
        </div>
      )}
    </>,
    document.body
  )
}

export default MemberPopup