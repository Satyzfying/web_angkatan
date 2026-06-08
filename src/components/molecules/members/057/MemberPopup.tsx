'use client'

import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

import Image from 'next/image'

import Instagram from '@/components/atoms/button/InstagramButtonLink'
import LinkedInButtonLink from '@/components/atoms/button/LinkedInButtonLink'
import SpotifyEmbed from '@/components/molecules/SpotifyEmbed'

import ProfileImage from './image.png'
import EvaBackground from './eva-background.jpg'
import EvaBackground2 from './background2.jpg'
import EvaCover from './eva-cover.png'

type MemberPopupProps = {
  isOpen: boolean
  onClose: () => void
}

const MemberPopup = ({ isOpen, onClose }: MemberPopupProps) => {
  const [accessCode, setAccessCode] = useState('')
  const [accessGranted, setAccessGranted] = useState(false)
  const [error, setError] = useState('')
  const [isAuthorizing, setIsAuthorizing] = useState(false)
  const [terminalText, setTerminalText] = useState('')
  const [isMuted, setIsMuted] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      setAccessCode('')
      setError('')
      setTerminalText('')
      setIsAuthorizing(false)
      setAccessGranted(false)
      document.body.style.overflow = ''
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

  const handleAuthorize = async () => {
    if (accessCode !== '057') {
      setError('ACCESS DENIED')
      return
    }

    setError('')
    setIsAuthorizing(true)

    const lines = [
      'CHECKING AUTHORIZATION...',
      'SYNCHRONIZING PILOT DATA...',
      'VERIFYING NERV DATABASE...',
      'PILOT IDENTITY CONFIRMED',
      'NERV AUTHORIZATION ACCEPTED',
    ]

    setTerminalText('')

    for (const line of lines) {
      await new Promise((resolve) => setTimeout(resolve, 700))
      setTerminalText((prev) => prev ? `${prev}\n${line}` : line)
    }

    setTimeout(() => {
      setAccessGranted(true)
      setIsAuthorizing(false)
    }, 1000)
  }

  if (!isOpen) {
    return null
  }

  if (!accessGranted) {
    return createPortal(
      <div
        className="fixed inset-0 z-[9999] flex h-[100dvh] max-h-[100dvh] items-center justify-center overflow-hidden px-4"
        onClick={(event) => event.stopPropagation()}
      >
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Orbitron:wght@400;700;900&display=swap');

          @keyframes scanMove {
            0%   { top: -80px; }
            100% { top: 100%; }
          }
          .eva-font {
            font-family: 'Orbitron', monospace;
          }
        `}</style>
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${EvaBackground.src})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
        <div className="absolute inset-0 z-0 bg-black/85" />

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute left-0 w-full h-20"
            style={{
              background: 'linear-gradient(to bottom, transparent, rgba(255,0,0,0.15), transparent)',
              animation: 'scanMove 4s linear infinite',
            }}
          />
        </div>

        <div
          className="absolute inset-0 pointer-events-none animate-pulse"
          style={{ boxShadow: 'inset 0 0 120px rgba(255,0,0,1)' }}
        />

        <div
          className="pointer-events-none absolute inset-0 opacity-10"
          style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.8) 3px, rgba(0,0,0,0.8) 4px)',
          }}
        />

        <div
          className="absolute inset-0 z-0 opacity-20"
          style={{
            backgroundImage: 'linear-gradient(red 1px, transparent 1px), linear-gradient(90deg, red 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        <audio autoPlay loop muted={isMuted}>
          <source src="https://res.cloudinary.com/doyj3ztus/video/upload/q_auto/f_auto/v1780834303/Evangelion_sounds_redesign2_cnxdxs.mp4" type="video/mp4" />
        </audio>

        <div className="absolute top-6 left-6 z-10 text-red-600 eva-font">
          <p className="text-xs tracking-[0.5em]">NERV DATABASE</p>
          <p className="text-3xl font-black">CLASSIFIED</p>
        </div>

        <button
          type="button"
          onClick={() => setIsMuted((prev) => !prev)}
          className="absolute top-6 right-6 z-10 border border-red-600 px-3 py-1 text-xs font-bold tracking-widest text-red-500 hover:bg-red-600 hover:text-white transition eva-font"
        >
          AMBIENCE {isMuted ? 'OFF' : 'ON'}
        </button>

        <div className="relative z-20 w-full max-w-xl rounded-2xl border-2 border-red-600 bg-black p-8 text-white shadow-2xl">
          <div className="mb-6">
            <p className="text-xs tracking-[0.5em] text-red-500 eva-font">NERV SECURITY SYSTEM</p>
            <h2 className="mt-3 text-3xl font-black text-red-500 eva-font">AUTHORIZATION REQUIRED</h2>
            <p className="mt-2 text-sm text-gray-400">Enter Pilot Access Code</p>
          </div>

          {!isAuthorizing ? (
            <>
              <input
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                placeholder="- - -"
                className="w-full rounded-full border border-red-600 bg-black p-3 text-center text-lg tracking-[0.3em] outline-none eva-font"
              />

              {error && <p className="mt-3 font-semibold text-red-500 eva-font">{error}</p>}

              <button
                onClick={handleAuthorize}
                className="mt-5 w-full rounded-lg bg-red-600 py-3 font-bold transition hover:bg-red-700 eva-font"
              >
                AUTHORIZE
              </button>

              <button
                onClick={onClose}
                className="mt-3 w-full rounded-lg border border-gray-600 py-3 eva-font"
              >
                CANCEL
              </button>
            </>
          ) : (
            <div className="min-h-[220px] rounded-lg border border-red-600 bg-black p-4 font-mono text-green-400 whitespace-pre-line">
              {terminalText}
              <span className="animate-pulse">█</span>
            </div>
          )}
        </div>
      </div>,
      document.body
    )
  }

  return createPortal(
    // PADA BAGIAN INI KAMU BOLEH MENGUBAH STYLE SESUKA HATI KAMU, TAPI JANGAN UBAH STRUKTUR DAN FUNGSI DARI KODE INI AGAR FUNGSI POPUP TETAP BERJALAN DENGAN BAIK
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto p-4"
      onClick={(event) => event.stopPropagation()}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Orbitron:wght@400;700;900&display=swap');

        @keyframes scanMove {
          0%   { top: -80px; }
          100% { top: 100%; }
        }

        @keyframes glitch {
          0%   { clip-path: inset(0 0 98% 0); transform: translate(-4px, 0); }
          10%  { clip-path: inset(30% 0 50% 0); transform: translate(4px, 0); }
          20%  { clip-path: inset(60% 0 20% 0); transform: translate(-2px, 0); }
          30%  { clip-path: inset(80% 0 5% 0);  transform: translate(3px, 0); }
          40%  { clip-path: inset(10% 0 85% 0); transform: translate(-3px, 0); }
          50%  { clip-path: inset(50% 0 40% 0); transform: translate(2px, 0); }
          60%  { clip-path: inset(20% 0 70% 0); transform: translate(-4px, 0); }
          70%  { clip-path: inset(70% 0 10% 0); transform: translate(4px, 0); }
          80%  { clip-path: inset(40% 0 55% 0); transform: translate(-2px, 0); }
          90%  { clip-path: inset(5% 0 90% 0);  transform: translate(3px, 0); }
          100% { clip-path: inset(0 0 98% 0);   transform: translate(0, 0); }
        }

        @keyframes glitch2 {
          0%   { clip-path: inset(50% 0 30% 0); transform: translate(4px, 0); }
          20%  { clip-path: inset(10% 0 80% 0); transform: translate(-4px, 0); }
          40%  { clip-path: inset(70% 0 15% 0); transform: translate(2px, 0); }
          60%  { clip-path: inset(25% 0 60% 0); transform: translate(-3px, 0); }
          80%  { clip-path: inset(85% 0 5% 0);  transform: translate(4px, 0); }
          100% { clip-path: inset(50% 0 30% 0); transform: translate(0, 0); }
        }

        .eva-font {
          font-family: 'Orbitron', monospace;
        }

        .glitch-name {
          position: relative;
          font-family: 'Orbitron', monospace;
        }
        .glitch-name::before,
        .glitch-name::after {
          content: attr(data-text);
          position: absolute;
          left: 0; top: 0;
          width: 100%;
          opacity: 0;
        }
        .glitch-name:hover::before {
          color: #ff0000;
          opacity: 0.8;
          animation: glitch 0.4s steps(1) infinite;
        }
        .glitch-name:hover::after {
          color: #ff6666;
          opacity: 0.6;
          animation: glitch2 0.4s steps(1) infinite;
        }

        .glitch-card {
          position: relative;
          overflow: hidden;
          transition: background-color 0.3s, border-color 0.3s, color 0.3s;
        }
        .glitch-card:hover {
          background-color: #cc0000 !important;
          border-color: #ff0000 !important;
          box-shadow: 0 0 16px rgba(255,0,0,0.6);
        }
        .glitch-card:hover p {
          color: #ffffff !important;
        }

        /* EVA Capsule Door */
        .capsule-door {
          position: absolute;
          inset: 0;
          z-index: 20;
          background: #0a0a0a;
          transform: translateY(0%);
          transition: transform 1.2s cubic-bezier(0.77,0,0.175,1);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .group:hover .capsule-door {
          transform: translateY(-100%);
        }

        @keyframes door-scan {
          0%   { top: -20px; }
          100% { top: 100%; }
        }
        .door-scanline {
          position: absolute;
          left: 0;
          width: 100%;
          height: 3px;
          background: rgba(255,0,0,0.6);
          animation: door-scan 2s linear infinite;
        }

        /* Metal Block Card */
        .metal-card {
          position: relative;
          overflow: hidden;
          transition: box-shadow 0.2s;
          background: #111;
        }
        .metal-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            180deg,
            transparent,
            transparent 3px,
            rgba(255,255,255,0.03) 3px,
            rgba(255,255,255,0.03) 4px
          );
          z-index: 1;
          pointer-events: none;
        }
        .metal-card::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            rgba(255,255,255,0.06) 0%,
            transparent 40%,
            rgba(0,0,0,0.4) 100%
          );
          z-index: 1;
          pointer-events: none;
          transition: opacity 0.2s;
          opacity: 0;
        }
        .metal-card:hover {
          background: linear-gradient(
            160deg,
            #3a0000 0%,
            #800000 30%,
            #cc0000 60%,
            #8b0000 80%,
            #2a0000 100%
          ) !important;
          border-color: #ff0000 !important;
          box-shadow:
            0 0 0 1px #ff0000,
            0 0 20px rgba(255,0,0,0.5),
            inset 0 1px 0 rgba(255,100,100,0.3),
            inset 0 -1px 0 rgba(0,0,0,0.5);
        }
        .metal-card:hover::after {
          opacity: 1;
        }
        .metal-card:hover p {
          color: #ffffff !important;
          text-shadow: 0 0 8px rgba(255,150,150,0.6);
        }
      `}</style>

      <audio autoPlay loop muted={isMuted}>
        <source src="https://res.cloudinary.com/doyj3ztus/video/upload/q_auto/f_auto/v1780834624/%E6%AE%8B%E9%85%B7%E3%81%AA%E5%A4%A9%E4%BD%BF%E3%81%AE%E3%83%86%E3%83%BC%E3%82%BC_MUSIC_VIDEO_HDver.__Zankoku_na_Tenshi_no_Te-ze_The_Cruel_Angel_s_Thesis_clr3uq.mp4" type="video/mp4" />
      </audio>

      <div className="fixed inset-0 z-[9999] bg-black" />
      <div
        className="fixed inset-0 z-[10000]"
        style={{
          backgroundImage: `url(${EvaBackground2.src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      <div className="fixed inset-0 z-[10001] bg-black/60" />
      <div
        className="fixed inset-0 z-[10001] pointer-events-none animate-pulse"
        style={{ boxShadow: 'inset 0 0 120px rgba(255,0,0,1)' }}
      />

      <button
        type="button"
        aria-label="Close member detail"
        onClick={onClose}
        className="fixed inset-0 bg-black/90 z-[9999]"
      />

      <div
        className="relative z-[10002] max-h-screen w-full max-w-[720px] overflow-y-auto border-2 border-red-600 text-white shadow-xl"
        style={{
          backgroundColor: '#0a0a0a',
          boxShadow: 'inset 8px 0 0 #ff0000, inset -8px 0 0 #ff0000, 0 0 30px rgba(255,0,0,0.3)',
          clipPath: 'polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 24px 100%, 0 calc(100% - 24px))',
        }}
      >
        <div className="absolute inset-0 bg-black/60" />

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-[180px] font-black text-red-600/5 eva-font">NERV</span>
        </div>

        <div className="relative z-[101] p-6 sm:p-8">
          {/* Close button */}
          <button
            type="button"
            aria-label="Close member detail"
            onClick={onClose}
            className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center border-2 border-red-600 text-red-500 text-xl leading-none font-black hover:bg-red-600 hover:text-white transition z-10"
            style={{ clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))' }}
          >
            ✕
          </button>

          <div className="group relative mb-5 overflow-hidden border border-red-600/50"
            style={{ clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))' }}
          >
            {/* Foto Asli - selalu ada di belakang */}
            <Image
              src={ProfileImage}
              alt="Profile Image"
              className="h-120 w-full object-cover object-center"
            />

            {/* EVA Capsule Door - nutup foto, naik ke atas saat hover */}
            <div className="capsule-door">
              <div className="door-scanline" />

              {/* Panel lines dekorasi */}
              <div style={{ width: '80%', borderTop: '2px solid #ff0000', opacity: 0.6 }} />
              <div style={{ width: '60%', borderTop: '1px solid #ff0000', opacity: 0.4 }} />

              {/* Teks NERV */}
              <p className="eva-font text-red-500 text-lg font-black tracking-[0.4em]">NERV</p>
              <p className="eva-font text-red-400 text-xs tracking-[0.3em] opacity-80">EVANGELION UNIT-057</p>

              <div style={{ width: '60%', borderTop: '1px solid #ff0000', opacity: 0.4 }} />
              <div style={{ width: '80%', borderTop: '2px solid #ff0000', opacity: 0.6 }} />

              {/* Hex pattern dekorasi */}
              <p className="eva-font text-red-700 text-[10px] tracking-widest opacity-50 mt-2">
                ▣ CLASSIFIED ▣
              </p>
            </div>

            <div className="absolute bottom-4 left-4 bg-red-700 px-3 py-1 text-xs font-bold tracking-widest eva-font z-30">
              NERV PILOT FILE
            </div>
          </div>

          <div className="mb-1 text-xs font-bold tracking-[0.3em] text-red-500 eva-font text-center">
            NERV PERSONNEL FILE
          </div>

          {/* Ambience Toggle */}
          <div className="flex justify-center mb-4">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setIsMuted((prev) => !prev) }}
              className="rounded-full border border-red-600 px-4 py-1 text-xs font-bold tracking-widest text-red-500 hover:bg-red-600 hover:text-white transition eva-font"
            >
              AMBIENCE {isMuted ? 'OFF' : 'ON'}
            </button>
          </div>

          {/* Nama & NRP - centered with glitch */}
          <div className="text-center mb-5">
            <h2
              className="text-2xl font-black tracking-wider text-red-500 glitch-name"
              data-text="Riezco Eka Bayu Witantra"
            >
              {/* UBAH NAMA ANDA */}
              Riezco Eka Bayu Witantra
            </h2>
            <p className="mt-1 text-sm font-semibold text-gray-400 eva-font">
              {/* UBAH NRP DAN ASAL */}
              5027251057 · Rembang
            </p>
          </div>

          <div className="flex justify-center mb-5 gap-2">
            {/* UBAH USERNAME INSTAGRAM */}
            <Instagram username="riez_wi" />
            {/* UBAH USERNAME LINKEDIN */}
            <LinkedInButtonLink username="riezcowitantra" />
          </div>

          <div className="mt-2 grid gap-4 text-sm font-semibold sm:grid-cols-2">
            <div className="metal-card border-red-700/40 bg-black border p-4"
              style={{ clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))' }}
            >
              {/* UBAH HOBI KAMU */}
              <p className="text-neutral-cs-10/60 text-xs tracking-wide uppercase eva-font">Hobi</p>
              <p className="mt-2">nge game sama sepeda aja deh</p>
            </div>

            <div className="metal-card border-red-700/40 bg-black border p-4"
              style={{ clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))' }}
            >
              {/* UBAH FUNFACT KAMU */}
              <p className="text-neutral-cs-10/60 text-xs tracking-wide uppercase eva-font">Fun Fact</p>
              <p className="mt-2">Candidate for EVA Unit-01 synchronization test.</p>
            </div>
          </div>

          <div className="metal-card border-neutral-cs-10/40 mt-4 border p-4"
            style={{ clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))' }}
          >
            {/* UBAH LAGU FAVORIT KAMU */}
            <p className="text-neutral-cs-10/60 text-xs font-bold tracking-wide uppercase eva-font">Lagu Favorit</p>
            <p className="my-2 text-sm font-semibold">残酷な天使のテーゼ</p>
            {/* UBAH URL SPOTIFY KAMU DENGAN LAGU FAVORIT MU */}
            <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/23phSRwoMy48rwFpmuAP8q?si=c795c4c5f2ca48e0" />
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default MemberPopup
