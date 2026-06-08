'use client'

import React, { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import { createPortal } from 'react-dom'

import Instagram from '@/components/atoms/button/InstagramButtonLink'
import LinkedInButtonLink from '@/components/atoms/button/LinkedInButtonLink'
import SpotifyEmbed from '@/components/molecules/SpotifyEmbed'

// Struktur Import Ori Sesuai Permintaan + Tambahan Background Baru
import CinemeowImg from './absolute_cinemeow.jpg'
import ProfileImage from './image.png'
import ZetaGif from './zeta.gif'
import BackgroundImg from './background.png'

type MemberPopupProps = {
  isOpen: boolean
  onClose: () => void
}

type Step = 'login' | 'welcome' | 'popup'
type SpotifyTrack = 'none' | 'you-re-mine' | 'break-it-down'

const MemberPopup = ({ isOpen, onClose }: MemberPopupProps) => {
  const [currentStep, setCurrentStep] = useState<Step>('login')
  const [username] = useState('Bl4nk06')
  const [code, setCode] = useState('')
  const [loginError, setLoginError] = useState('')
  const [isFlipped, setIsFlipped] = useState(false)
 
  const [activeTrack, setActiveTrack] = useState<'none' | 'you-re-mine' | 'break-it-down'>('none')
  const [activeSpotify, setActiveSpotify] = useState<SpotifyTrack>('none')

  const trackRef1 = useRef<HTMLAudioElement | null>(null)
  const trackRef2 = useRef<HTMLAudioElement | null>(null)
  const sfxWelcomeRef = useRef<HTMLAudioElement | null>(null)
  const sfxCloseRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    trackRef1.current = new Audio('/assets/members/120/Youre_Mine_Instrumental.mp3')
    trackRef2.current = new Audio('/assets/members/120/Break_It_Down_Instrumental.mp3')
    sfxWelcomeRef.current = new Audio('/assets/members/120/Halo.mp3')
    sfxCloseRef.current = new Audio('/assets/members/120/Dadah.mp3')

    if (trackRef1.current) trackRef1.current.loop = true
    if (trackRef2.current) trackRef2.current.loop = true

    return () => {
      trackRef1.current?.pause()
      trackRef2.current?.pause()
      sfxWelcomeRef.current?.pause()
      sfxCloseRef.current?.pause()
    }
  }, [])

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep('login')
      setIsFlipped(false)
      setCode('')
      setLoginError('')
      stopAllInternalAudio()
      setActiveSpotify('none')
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        triggerClose()
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const stopAllInternalAudio = () => {
    if (trackRef1.current) { trackRef1.current.pause(); trackRef1.current.currentTime = 0 }
    if (trackRef2.current) { trackRef2.current.pause(); trackRef2.current.currentTime = 0 }
    setActiveTrack('none')
  }

  const handleTrackChange = (track: 'you-re-mine' | 'break-it-down') => {
    stopAllInternalAudio()
    setActiveSpotify('none')
   
    if (activeTrack !== track) {
      setActiveTrack(track)
      if (track === 'you-re-mine' && trackRef1.current) {
        trackRef1.current.play().catch((e) => console.log("Audio play blocked", e))
      } else if (track === 'break-it-down' && trackRef2.current) {
        trackRef2.current.play().catch((e) => console.log("Audio play blocked", e))
      }
    }
  }

  const handleSpotifyPlay = (track: 'you-re-mine' | 'break-it-down') => {
    stopAllInternalAudio()
    setActiveSpotify(track)
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    if (/^\d*$/.test(val)) {
      setCode(val)
    }
  }

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (code === '06042007') {
      setLoginError('')
      setCurrentStep('welcome')
      if (sfxWelcomeRef.current) {
        sfxWelcomeRef.current.currentTime = 0
        sfxWelcomeRef.current.play().catch((e) => console.log("Audio play blocked", e))
      }
    } else {
      setLoginError('ACCESS DENIED: Invalid Agent Code.')
    }
  }

  const handleWelcomeNext = () => {
    setCurrentStep('popup')
    handleTrackChange('break-it-down')
  }

  const triggerClose = () => {
    stopAllInternalAudio()
    setActiveSpotify('none')
    if (sfxCloseRef.current) {
      sfxCloseRef.current.currentTime = 0
      sfxCloseRef.current.play().catch((e) => console.log("Audio play blocked", e))
    }
    setTimeout(() => {
      onClose()
    }, 1100)
  }

  if (!isOpen) return null

  return createPortal(
    /* REVISI: Mengganti backdrop blur luar menggunakan background.jpg yang digelapkan 50% (bg-black/50) */
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto px-4 select-none">
      
      {/* Background Image Container */}
      <div className="absolute inset-0 -z-20">
        <Image
          src={BackgroundImg}
          alt="Outer Background"
          fill
          priority
          className="object-cover object-center"
        />
        {/* Overlay Gelap 50% */}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <button
        type="button"
        aria-label="Close member detail"
        onClick={triggerClose}
        className="absolute inset-0"
      />

      {/* SCREEN 1: LOGIN INTERFACE */}
      {currentStep === 'login' && (
        <div className="w-full max-w-md border-2 border-slate-700 bg-zinc-950 p-6 rounded-2xl shadow-2xl mt-20 text-slate-200 relative z-10">
          <div className="text-center mb-6">
            <h2 className="text-xl font-black tracking-widest text-cyan-400 font-mono">ADMIN LOGIN SYSTEM</h2>
            <p className="text-xs text-slate-500 font-mono mt-1">BLK-KZR-CORP // SECURE ACCESS</p>
          </div>
         
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono font-bold tracking-wide uppercase text-slate-400 mb-1">Usr:</label>
              <input
                type="text"
                value={username}
                readOnly
                className="w-full bg-zinc-900/50 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-500 font-mono cursor-not-allowed outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-mono font-bold tracking-wide uppercase text-slate-400 mb-1">Code:</label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={code}
                onChange={handlePasswordChange}
                placeholder="Masukkan kode angka"
                className="w-full bg-zinc-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-cyan-300 focus:outline-none focus:border-cyan-400 font-mono tracking-widest"
                required
              />
            </div>

            {loginError && (
              <p className="text-xs text-red-400 font-mono text-center bg-red-950/40 py-1.5 rounded-lg border border-red-900/50">{loginError}</p>
            )}

            <div className="text-center py-1">
              <span className="text-xs text-cyan-500/70 font-mono font-bold tracking-wider">
                {"---> 06/04/2007 <---"}
              </span>
            </div>

            <button
              type="submit"
              className="w-full bg-cyan-950/60 hover:bg-cyan-900 border border-cyan-700 text-cyan-400 font-mono text-sm py-2.5 rounded-xl font-bold tracking-widest transition-colors shadow-lg shadow-cyan-950/20"
            >
              ENTER
            </button>
          </form>
        </div>
      )}

      {/* SCREEN 2: WELCOME SCREEN */}
      {currentStep === 'welcome' && (
        <div className="w-full max-w-md border border-slate-800 bg-black p-8 rounded-2xl text-center space-y-5 mt-20 text-slate-100 shadow-xl relative z-10">
          <h1 className="text-2xl font-light tracking-wide text-slate-400 font-mono">
            WELCOME <span className="font-black text-cyan-400 block mt-1">Mr. {username}</span>
          </h1>
          <div className="pt-1 space-y-1">
            <h2 className="text-3xl font-extrabold tracking-widest text-red-500 font-sans">
              ミッションスタート
            </h2>
            <p className="text-sm font-bold tracking-wider text-red-400 font-mono uppercase">
              Mission Start
            </p>
          </div>
          <p className="text-[11px] font-mono text-slate-500 tracking-wider uppercase">Secure Link Established. Authorization Confirmed.</p>
         
          <button
            type="button"
            onClick={handleWelcomeNext}
            className="w-full mt-4 bg-red-950/40 hover:bg-red-900/60 border border-red-700 text-red-400 font-mono text-xs py-2 rounded-xl font-bold tracking-widest transition-all uppercase animate-pulse"
          >
            MULAI QUEST
          </button>
        </div>
      )}

      {/* SCREEN 3: POPUP UTAMA DETIL MEMBER */}
      {currentStep === 'popup' && (
        <div className="border-neutral-cs-10 relative z-10 h-[100dvh] max-h-[100dvh] w-full max-w-[720px] animate-[member-popup-show_200ms_ease-out] overflow-hidden rounded-2xl border-2 text-white shadow-xl bg-zinc-950 my-4">
         
          <Image
            src={ZetaGif}
            alt="Vestia Zeta Background"
            fill
            unoptimized
            className="pointer-events-none absolute inset-0 -z-10 object-cover object-center opacity-30 mix-blend-lighten"
          />

          <div className="absolute inset-0 -z-10 bg-black/50 backdrop-blur-[1px]" />

          <div className="absolute inset-0 overflow-y-auto p-6 sm:p-8">

            {/* REVISI: Tombol close 'x' di dalam popup sekarang berubah warna merah cerah saat dihover/active */}
            <button
              type="button"
              aria-label="Close member detail"
              onClick={triggerClose}
              className="border-neutral-cs-10 hover:border-red-500 hover:text-red-500 active:text-red-600 active:border-red-600 absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full border text-xl leading-none transition-colors duration-200"
            >
              x
            </button>

            {/* CONTAINER FOTO PROFIL DENGAN UKURAN DAN STRUKTUR ORI */}
            <div
              onClick={() => setIsFlipped((prev) => !prev)}
              className="border-neutral-cs-10/40 group relative z-10 mb-5 cursor-pointer overflow-hidden rounded-2xl border select-none bg-black"
            >
              {/* REVISI: Mengganti h-120 dengan ukuran dinamis agar presisi di handphone dan monitor desktop */}
              <Image
                src={ProfileImage}
                alt="Profile Image"
                className="h-[380px] sm:h-[480px] w-full object-cover object-center"
              />
             
              <Image
                src={CinemeowImg}
                alt="Absolute Cinemeow Overlay"
                fill
                sizes="(max-width: 768px) 100vw, 720px"
                className={`${isFlipped ? 'opacity-0' : 'opacity-100'} pointer-events-none absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-500 ease-in-out group-hover:opacity-0`}
              />
             
              <div className="absolute bottom-2 left-3 bg-zinc-950/80 border border-slate-700 text-[10px] text-slate-400 font-mono px-2 py-0.5 rounded-md pointer-events-none z-20">
                {isFlipped ? "TAP/HOVER UNTUK TUTUP MEME" : "TAP/HOVER UNTUK LIHAT DOKSLI ASLI WAJAH ASLI GWEH"}
              </div>
            </div>

            {/* REVISI: Ukuran nama dibikin lebih gede (text-3xl di HP, sm:text-4xl di desktop) */}
            <div className="relative z-10 pr-10">
              <h2 className="font-sans text-3xl sm:text-4xl font-black tracking-wide">Rido Patra Yudhistira Edwin</h2>
              <p className="text-neutral-cs-10/70 mt-1 font-mono text-sm font-semibold">5027251120 - Surabaya</p>
            </div>

            <div className="relative z-10 mt-5 flex gap-2">
              <Instagram username="bl4nk_06/" />
              <LinkedInButtonLink username="rido-patra-yudhistira-edwin-2a0697379" />
            </div>

            {/* TRACK BACKSOUND CONTROLLER SYSTEM */}
            <div className="border-neutral-cs-10/40 bg-black/40 backdrop-blur-md mt-6 rounded-xl border p-4 relative z-10 transition-all duration-300">
              <p className="text-slate-400 text-xs font-bold tracking-wide uppercase font-mono mb-3">🔊 ADMIN SYSTEM BACKSOUND CONTROLLER:</p>
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => handleTrackChange('you-re-mine')}
                  className={`px-3 py-2 border rounded-lg font-semibold tracking-wide transition-all ${activeTrack === 'you-re-mine' ? 'bg-cyan-950/80 border-cyan-500 text-cyan-400 shadow-md shadow-cyan-500/10' : 'bg-zinc-900/60 border-slate-800 text-slate-400 hover:border-slate-700'}`}
                >
                  {activeTrack === 'you-re-mine' ? '■ STOP: You\'re Mine' : '▶ PLAY: You\'re Mine'}
                </button>
                <button
                  type="button"
                  onClick={() => handleTrackChange('break-it-down')}
                  className={`px-3 py-2 border rounded-lg font-semibold tracking-wide transition-all ${activeTrack === 'break-it-down' ? 'bg-cyan-950/80 border-cyan-500 text-cyan-400 shadow-md shadow-cyan-500/10' : 'bg-zinc-900/60 border-slate-800 text-slate-400 hover:border-slate-700'}`}
                >
                  {activeTrack === 'break-it-down' ? '■ STOP: Break It Down' : '▶ PLAY: Break It Down'}
                </button>
              </div>
              {activeTrack !== 'none' && (
                <p className="text-[10px] text-amber-400 font-mono mt-2 text-center animate-pulse">
                  ⚠️ Backsound internal aktif. Menyalakan salah satu widget Spotify di bawah otomatis mematikan player ini!
                </p>
              )}
            </div>

            <div className="relative z-10 mt-6 grid gap-4 text-sm font-semibold sm:grid-cols-2">
              {/* REVISI: Merapikan bagian hobi menggunakan struktur list (ul/li) */}
              <div className="border-neutral-cs-10/40 rounded-xl border bg-black/40 p-4 backdrop-blur-md">
                <p className="text-neutral-cs-10/60 font-mono text-xs tracking-wide uppercase mb-2">
                  Site ɑ: 俺の趣味 (Hobiku):
                </p>
                <ul className="space-y-1.5 font-sans font-medium text-slate-200 text-sm">
                  <li className="flex items-start gap-1.5">
                    <span className="text-cyan-400">‣</span>
                    <span>Nonton Anime dan Donghua</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-cyan-400">‣</span>
                    <span>Baca Manga, Manhwa, Manhua, dan Light Novel</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-cyan-400">‣</span>
                    <span>Main Game terutama Gacha, Shooter, RPG, Anime, Sandbox</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-cyan-400">‣</span>
                    <span>Menggambar</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-cyan-400">‣</span>
                    <span>Mendengarkan Lagu (Mostly lagu Jepang, Game, Anime)</span>
                  </li>
                </ul>
              </div>
              <div className="border-neutral-cs-10/40 rounded-xl border bg-black/40 p-4 backdrop-blur-md">
                <p className="text-neutral-cs-10/60 font-mono text-xs tracking-wide uppercase">
                  Site β: 俺の豆知識 (Fun Fact tentang aku):
                </p>
                <p className="mt-2 font-sans font-medium">
                  Sudah main dan preregist banyak anime style RPG gacha game (Terlalu banyak sampe bisa jadi bahan yapping
                  berjam-jam)
                </p>
              </div>
            </div>

            <div
              onClickCapture={() => handleSpotifyPlay('you-re-mine')}
              className="border-neutral-cs-10/40 relative z-10 mt-4 rounded-xl border bg-black/40 p-4 backdrop-blur-md"
            >
              <p className="text-neutral-cs-10/60 font-mono text-xs font-bold tracking-wide uppercase">
                Site ζ-1: 俺が好きな曲 (Lagu kesukaanku):
              </p>
              <p className="my-2 font-sans text-sm font-semibold">"You're Mine" — Vestia Zeta</p>
              <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/3kK8euC9eUBRwZKpMsQsDZ?si=2337bb62b0bd4ada" />
            </div>

            <div
              onClickCapture={() => handleSpotifyPlay('break-it-down')}
              className="border-neutral-cs-10/40 relative z-10 mt-4 rounded-xl border bg-black/40 p-4 backdrop-blur-md"
            >
              <p className="text-neutral-cs-10/60 font-mono text-xs font-bold tracking-wide uppercase">
                Site ζ-2: 俺が好きな曲 (Lagu kesukaanku):
              </p>
              <p className="my-2 font-sans text-sm font-semibold">"Break It Down" — Vestia Zeta</p>
              <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/7cQy74WB3BNs8dDSF5luMK?si=e01d3c2752804077" />
            </div>

          </div>
        </div>
      )}
    </div>,
    document.body
  )
}

export default MemberPopup