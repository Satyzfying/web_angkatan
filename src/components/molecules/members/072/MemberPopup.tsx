'use client'

import React, { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

import Image from 'next/image'
import Instagram from '@/components/atoms/button/InstagramButtonLink'
import LinkedInButtonLink from '@/components/atoms/button/LinkedInButtonLink'
import SpotifyEmbed from '@/components/molecules/SpotifyEmbed'

import ProfileImage from './image.jpg'
import BgImage from './bg-deepwoken.jpg'
import LogoImage from './deepwoken-logo.webp'

// --- KOMPONEN PARTIKEL ---
const ParticleEffect = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const PARTICLE_COUNT = 100 

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles = Array.from({ length: PARTICLE_COUNT }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2.5 + 0.5,
      speed: Math.random() * 1.5 + 0.3,
      opacity: Math.random() * 0.6 + 0.1,
    }))

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach((p) => {
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
        
        p.y -= p.speed
        
        if (p.y < -10) {
          p.y = canvas.height + 10
          p.x = Math.random() * canvas.width
          p.speed = Math.random() * 1.5 + 0.3
        }
      })
      animationFrameId = requestAnimationFrame(render)
    }
    render()
    return () => cancelAnimationFrame(animationFrameId)
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 z-[5] pointer-events-none" />
}

// --- HELPER UNTUK ANIMASI HURUF FLOATING ---
const FloatingText = ({ text }: { text: string }) => (
  <>
    {text.split('').map((char, index) => (
      <span
        key={index}
        className="inline-block animate-[float-letter_3s_ease-in-out_infinite]"
        style={{ animationDelay: `${index * 0.05}s` }}
      >
        {char === ' ' ? '\u00A0' : char}
      </span>
    ))}
  </>
);

type MemberPopupProps = {
  isOpen: boolean
  onClose: () => void
}

const MemberPopup = ({ isOpen, onClose }: MemberPopupProps) => {
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (!isOpen) return

    if (audioRef.current) {
      audioRef.current.volume = 0.1
      audioRef.current.play().catch(e => console.log("Menunggu interaksi user:", e))
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }
    }
  }, [isOpen, onClose])

  useEffect(() => {
    const handleSpotifyMessage = (event: MessageEvent) => {
      if (event.origin !== 'https://open.spotify.com') return
      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data
        if (data?.type === 'playback_update') {
          const isPlaying = !data.payload?.isPaused
          if (isPlaying) {
            audioRef.current?.pause()
          } else {
            audioRef.current?.play().catch(() => {})
            audioRef.current?.play().catch(() => { }) // Lanjut BGM jika Spotify pause
          }
        }
      } catch { }
    }
    window.addEventListener('message', handleSpotifyMessage)
    return () => window.removeEventListener('message', handleSpotifyMessage)
  }, [])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto px-4 pt-28 pb-8 sm:pt-32">
      
      {/* ANIMASI KEYFRAMES */}
      <style jsx global>{`
        @keyframes float-letter {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
        @keyframes float-logo {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        .float-logo {
          animation: float-logo 3s ease-in-out infinite;
        }
      `}</style>
  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto px-4">

      <audio ref={audioRef} src="/assets/sounds/bgm-deepwoken.mp3" loop />

      <div className="fixed inset-0 z-0">
        <Image
          src={BgImage}
          alt="Background"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]" />
        <ParticleEffect /> 
      </div>

      {/* PADA BAGIAN INI KAMU BOLEH MENGUBAH STYLE SESUKA HATI KAMU, TAPI JANGAN UBAH STRUKTUR DAN FUNGSI DARI KODE INI AGAR FUNGSI POPUP TETAP BERJALAN DENGAN BAIK */}
      <button
        type="button"
        aria-label="Close member detail"
        onClick={onClose}
        className="absolute inset-0 z-0"
      />

      <div className="border-neutral-cs-10 bg-black relative z-10 max-h-[calc(100vh-9rem)] w-full max-w-[720px] animate-[member-popup-show_200ms_ease-out] overflow-y-auto rounded-2xl border-2 p-6 text-white shadow-xl sm:max-h-[calc(100vh-10rem)] sm:p-8">
      <div className="border-neutral-cs-10 bg-black relative z-10 max-h-[100dvh] w-full max-w-[720px] animate-[member-popup-show_200ms_ease-out] overflow-y-auto rounded-2xl border-2 p-6 text-white shadow-xl sm:p-8">
        <button
          type="button"
          aria-label="Close member detail"
          onClick={onClose}
          className="border-neutral-cs-10 hover:bg-neutral-cs-10/10 absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border text-xl leading-none"
        >
            x
          </button>

        {/* LOGO DENGAN ANIMASI FLOATING */}
        <div className="mb-4 flex justify-center relative float-logo">
            <a 
                href="https://www.roblox.com/games/4111023553/Deepwoken#!/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="transition-all duration-300 hover:scale-110 cursor-pointer group"
            >
                <Image src={LogoImage} alt="Logo" width={100} height={100} className="object-contain filter drop-shadow-[0_0_15px_rgba(33,150,243,0.8)] group-hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.8)]" />
                <div className="absolute -inset-2 bg-blue-cs-50 rounded-full blur-2xl opacity-30 pointer-events-none group-hover:opacity-60 transition-opacity" />
            </a>
        </div>

        <div className="border-neutral-cs-10/40 mb-5 overflow-hidden rounded-2xl border relative transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]">
          <Image src={ProfileImage} alt="Profile Image" className="h-120 w-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
        </div>

        <div className="pr-10 relative">
          <h2 className="text-2xl font-black relative drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            <FloatingText text="I Made Gyanendra Anand Wisnawa" />
          </h2>
          <p className="text-neutral-cs-10/90 mt-1 text-sm font-semibold relative drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
            <FloatingText text="5027251072 - Bekasi" />
          </p>
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-cs-50 rounded-full blur-3xl opacity-20 pointer-events-none" />
        </div>

        <div className="mt-5 flex gap-2">
          <div className="transition-all duration-300 ease-out hover:scale-110 hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
            <Instagram username="anananand.25" />
          </div>
          <div className="transition-all duration-300 ease-out hover:scale-110 hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
            <LinkedInButtonLink username="i-made-gyanendra-anand-wisnawa-445476379" />
          </div>
        </div>

        <div className="mt-6 grid gap-4 text-sm font-semibold sm:grid-cols-2 relative">
          <div className="border-neutral-cs-10/30 rounded-xl border bg-black/40 p-4 backdrop-blur-sm transition-all duration-300 ease-out hover:scale-[1.05] hover:border-white/40 hover:bg-black/60 hover:shadow-[0_0_20px_rgba(255,255,255,0.15)]">
            <p className="text-neutral-cs-10/80 text-xs tracking-wide uppercase"><FloatingText text="Hobi" /></p>
            <p className="mt-2 text-white">
                Main game (
                <a 
                    href="https://store.steampowered.com/app/1422450/Deadlock/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="underline text-blue-400 hover:text-blue-300 font-bold"
                >
                    Deadlock
                </a>
                {" "}biasanya tapi bebas), dengerin musik (yang niche tapi)
            </p>
          </div>
          <div className="border-neutral-cs-10/30 rounded-xl border bg-black/40 p-4 backdrop-blur-sm transition-all duration-300 ease-out hover:scale-[1.05] hover:border-white/40 hover:bg-black/60 hover:shadow-[0_0_20px_rgba(255,255,255,0.15)]">
            <p className="text-neutral-cs-10/80 text-xs tracking-wide uppercase"><FloatingText text="Fun Fact" /></p>
            <p className="mt-2 text-white">Suka dengerin lagu tapi gatau dan gabisa namain nama lagu Indonesia atau (mayoritas) lagu mainstream.</p>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-blue-cs-50 rounded-full blur-3xl opacity-15 pointer-events-none" />
        </div>

        <div className="border-neutral-cs-10/30 mt-4 rounded-xl border bg-black/40 p-4 backdrop-blur-sm relative">
          <p className="text-neutral-cs-10/80 text-xs font-bold tracking-wide uppercase"><FloatingText text="Lagu Favorit" /></p>
          <div className="mt-2 space-y-4">
            <div className="transition-all duration-300 ease-out hover:scale-[1.02] hover:bg-white/5 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] p-2 rounded-lg">
              <p className="mb-1 text-sm font-semibold text-white">2010 Justin Bieber</p>
              <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/5WIGbrfNMvFeCQOx5XykBO?si=ec95649928674a93" />
            </div>
            <div className="transition-all duration-300 ease-out hover:scale-[1.02] hover:bg-white/5 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] p-2 rounded-lg">
              <p className="mb-1 text-sm font-semibold text-white">the light left my iris</p>
              <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/2GtgFDhXY3u39WKjUVVHWH?si=3a8d71ce6e724ec0" />
            </div>
            <div className="transition-all duration-300 ease-out hover:scale-[1.02] hover:bg-white/5 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] p-2 rounded-lg">
              <p className="mb-1 text-sm font-semibold text-white">Pray for...</p>
              <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/1ySxrjvgjDmV9gWTNRklpK?si=1db4f9f20ec5410f" />
            </div>
            <div className="transition-all duration-300 ease-out hover:scale-[1.02] hover:bg-white/5 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] p-2 rounded-lg">
              <p className="mb-1 text-sm font-semibold text-white">blue&black&purple</p>
              <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/5qg9lwPoJfAVVKSHPG0ASK?si=of9NbU2kRReqHe1Ou9MinQ" />
            </div>
            <div className="transition-all duration-300 ease-out hover:scale-[1.02] hover:bg-white/5 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] p-2 rounded-lg">
              <p className="mb-1 text-sm font-semibold text-white">Place (sumpah cumang ini doang yang normal)</p>
              <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/1Bg2CNZw6S4e9cGWPmi0uI?si=318d4fbc92a1424c" />
            </div>
          </div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-cs-50 rounded-full blur-3xl opacity-20 pointer-events-none" />
        </div>
          {/* LOGO DITAMBAHKAN DI SINI */}
          <div className="mb-4 flex justify-center">
            <Image src={LogoImage} alt="Logo" width={100} height={100} className="object-contain" />
          </div>

          <div className="border-neutral-cs-10/40 mb-5 overflow-hidden rounded-2xl border">
            <Image src={ProfileImage} alt="Profile Image" className="h-120 w-full object-cover object-center" />
          </div>

          <div className="pr-10">
            <h2 className="text-2xl font-black">I Made Gyanendra Anand Wisnawa</h2>
            <p className="text-neutral-cs-10/70 mt-1 text-sm font-semibold">5027251072 - Bekasi</p>
          </div>

          <div className="mt-5 flex gap-2">
            <Instagram username="anananand.25" />
            <LinkedInButtonLink username="i-made-gyanendra-anand-wisnawa-445476379" />
          </div>

          <div className="mt-6 grid gap-4 text-sm font-semibold sm:grid-cols-2">
            <div className="border-neutral-cs-10/40 rounded-xl border p-4">
              <p className="text-neutral-cs-10/60 text-xs tracking-wide uppercase">Hobi</p>
              <p className="mt-2">Main game (Deadlock biasanya tapi bebas), dengerin musik (yang niche tapi)</p>
            </div>
            <div className="border-neutral-cs-10/40 rounded-xl border p-4">
              <p className="text-neutral-cs-10/60 text-xs tracking-wide uppercase">Fun Fact</p>
              <p className="mt-2">Suka dengerin lagu tapi gatau dan gabisa namain nama lagu Indonesia atau (mayoritas) lagu mainstream.</p>
            </div>
          </div>

          <div className="border-neutral-cs-10/40 mt-4 rounded-xl border p-4">
            <p className="text-neutral-cs-10/60 text-xs font-bold tracking-wide uppercase">Lagu Favorit</p>
            <p className="my-2 text-sm font-semibold">2010 Justin Bieber</p>
            <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/5WIGbrfNMvFeCQOx5XykBO?si=ec95649928674a93" />
            <p className="my-2 text-sm font-semibold">the light left my iris</p>
            <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/2GtgFDhXY3u39WKjUVVHWH?si=3a8d71ce6e724ec0" />
            <p className="my-2 text-sm font-semibold">Pray for...</p>
            <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/1ySxrjvgjDmV9gWTNRklpK?si=1db4f9f20ec5410f" />
            <p className="my-2 text-sm font-semibold">blue&black&purple</p>
            <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/5qg9lwPoJfAVVKSHPG0ASK?si=of9NbU2kRReqHe1Ou9MinQ" />
            <p className="my-2 text-sm font-semibold">Place (sumpah cumang ini doang yang normal)</p>
            <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/1Bg2CNZw6S4e9cGWPmi0uI?si=318d4fbc92a1424c" />
          </div>
      </div>
    </div>,
    document.body
  )
}

export default MemberPopup
