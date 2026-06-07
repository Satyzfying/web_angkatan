'use client'

/* eslint-disable react-hooks/set-state-in-effect */

import React, { useEffect, useState, useRef } from 'react'

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
  // State untuk mengontrol urutan layar: 0 (Skull), 1 (Joker Card), 2 (Identity)
  const [stage, setStage] = useState(0)
  const [skullTaps, setSkullTaps] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Mengatur scroll body & keypress Escape
  useEffect(() => {
    if (!isOpen) {
      // Reset stage ketika popup ditutup
      setStage(0)
      setSkullTaps(0)
      audioRef.current?.pause()
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

  // FITUR BARU: Sinkronisasi BGM dengan Spotify
  useEffect(() => {
    const handleSpotifyMessage = (event: MessageEvent) => {
      // Pastikan origin dari iframe Spotify
      if (event.origin !== 'https://open.spotify.com') return

      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data
        if (data?.type === 'playback_update') {
          const isPlaying = !data.payload?.isPaused
          if (isPlaying) {
            audioRef.current?.pause() // Stop BGM jika Spotify main
          } else {
            // Lanjut BGM jika Spotify pause, dan jika kita sudah melewati stage 0
            if (stage > 0) {
              audioRef.current?.play().catch(() => {})
            }
          }
        }
      } catch {}
    }

    window.addEventListener('message', handleSpotifyMessage)
    return () => window.removeEventListener('message', handleSpotifyMessage)
  }, [stage])

  if (!isOpen) {
    return null
  }

  // Handler untuk transisi tap tap
  const handleSkullTap = () => {
    // Mulai lagu pada interaksi pertama (kebijakan autoplay browser)
    if (skullTaps === 0) {
      audioRef.current?.play().catch(() => {})
      setSkullTaps(1)
    } else {
      setStage(1) // Lanjut ke Joker Card
    }
  }

  const handleJokerClick = () => {
    setStage(2) // Lanjut ke Identity
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto px-4 pt-28 pb-8 sm:pt-32 bg-black/80 backdrop-blur-md group/modal select-none">
      
      {/* File Audio BGM Fire Force */}
      <audio ref={audioRef} src="/bgm/fire force bgm.mp3" loop className="hidden" />

      <style>{`
        /* --- Kumpulan Keyframes Tema Fire Force --- */
        @keyframes fireForceGlow {
          0%, 100% { box-shadow: 0 0 15px rgba(255, 69, 0, 0.5), inset 0 0 15px rgba(220, 38, 38, 0.3); }
          50% { box-shadow: 0 0 35px rgba(255, 69, 0, 0.9), inset 0 0 25px rgba(255, 140, 0, 0.6); }
        }
        @keyframes skullShake {
          0%, 100% { transform: scale(1.1) rotate(0deg); filter: drop-shadow(0 0 30px #ff4500); }
          25% { transform: scale(1.1) rotate(-3deg) translateX(-2px); filter: drop-shadow(0 0 40px #ff0000); }
          75% { transform: scale(1.1) rotate(3deg) translateX(2px); filter: drop-shadow(0 0 50px #ff8c00); }
        }
        
        /* Aura untuk Joker Card (Merah, Putih, Hitam, Abu) */
        @keyframes jokerAuraPulse {
          0% { box-shadow: 0 0 0 0px rgba(220, 38, 38, 0.7), 0 0 0 10px rgba(255, 255, 255, 0.4), 0 0 0 20px rgba(100, 100, 100, 0.3); }
          50% { box-shadow: 0 0 20px 10px rgba(220, 38, 38, 0.9), 0 0 30px 20px rgba(255, 255, 255, 0.6), 0 0 40px 30px rgba(0, 0, 0, 0.8); }
          100% { box-shadow: 0 0 0 0px rgba(220, 38, 38, 0), 0 0 0 0px rgba(255, 255, 255, 0), 0 0 0 0px rgba(100, 100, 100, 0); }
        }

        /* Glitch Hitam Putih Looping untuk Joker Card */
        @keyframes jokerGlitch {
          0%, 100% { filter: grayscale(100%) contrast(120%) invert(0); transform: translate(0); }
          10% { filter: grayscale(100%) contrast(200%) invert(1); transform: translate(-4px, 2px) skewX(2deg); }
          20% { filter: grayscale(100%) contrast(120%) invert(0); transform: translate(4px, -2px) skewX(-2deg); }
          30% { filter: grayscale(100%) contrast(200%) invert(1); transform: translate(-2px, -4px); }
          40% { filter: grayscale(100%) contrast(120%) invert(0); transform: translate(2px, 4px); }
          50% { filter: grayscale(100%) contrast(150%) invert(1); transform: translate(-3px, 1px) scale(1.02); }
          60% { filter: grayscale(100%) contrast(120%) invert(0); transform: translate(0); }
        }

        /* Animasi Efek Edge Api di sekitar Identitas */
        @keyframes borderFireTravel {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }

        /* Efek Ekor Api Kursor berlayer-layer */
        .cursor-fire-1, .cursor-fire-2, .cursor-fire-3, .cursor-smoke-1, .cursor-smoke-2 {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          transform: translate(-50%, -50%);
          z-index: 90;
        }
        /* Inti Api (Kuning/Putih) */
        .cursor-fire-1 { width: 15px; height: 15px; background: #fffacd; box-shadow: 0 0 10px #ffffe0; transition: top 0.05s, left 0.05s; mix-blend-mode: screen; filter: blur(2px); }
        /* Api Tengah (Orange Terang) */
        .cursor-fire-2 { width: 35px; height: 35px; background: radial-gradient(circle, #ff8c00 20%, transparent 80%); transition: top 0.1s, left 0.1s; mix-blend-mode: screen; filter: blur(4px); }
        /* Api Luar (Merah) */
        .cursor-fire-3 { width: 60px; height: 60px; background: radial-gradient(circle, #dc2626 10%, transparent 70%); transition: top 0.15s, left 0.15s; mix-blend-mode: screen; filter: blur(8px); }
        /* Asap Hitam / Abu-abu */
        .cursor-smoke-1 { width: 80px; height: 80px; background: radial-gradient(circle, rgba(50,50,50,0.6) 0%, transparent 70%); transition: top 0.25s ease-out, left 0.25s ease-out; mix-blend-mode: multiply; filter: blur(10px); }
        .cursor-smoke-2 { width: 100px; height: 100px; background: radial-gradient(circle, rgba(0,0,0,0.7) 0%, transparent 70%); transition: top 0.4s ease-out, left 0.4s ease-out; filter: blur(15px); opacity: 0.5; }

        .card-wrapper:hover .cursor-fire-1, .card-wrapper:hover .cursor-fire-2, .card-wrapper:hover .cursor-fire-3, .card-wrapper:hover .cursor-smoke-1, .card-wrapper:hover .cursor-smoke-2 {
          opacity: 1;
        }
        
        .bg-company8 {
          background: linear-gradient(135deg, rgba(20,20,20,0.95) 0%, rgba(0,0,0,0.95) 100%);
        }
        
        .fire-border {
          position: absolute;
          inset: 0;
          z-index: 0;
          border-radius: 1rem;
          padding: 3px;
          background: linear-gradient(90deg, #ff4500, #dc2626, #ffd700, #ff4500, #dc2626);
          background-size: 200% auto;
          animation: borderFireTravel 3s linear infinite;
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
        }
        
        /* Glitch class untuk stage 1 */
        .joker-glitch-active {
          animation: jokerGlitch 2.5s infinite linear;
        }
      `}</style>

      {/* Background Overlay Click to Close */}
      <button
        type="button"
        aria-label="Close member detail"
        onClick={onClose}
        className="absolute inset-0 bg-transparent cursor-default"
      />

      {/* Main Container */}
      <div 
        className="relative z-10 w-full max-w-[720px] max-h-[calc(100vh-9rem)] sm:max-h-[calc(100vh-10rem)] rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 ease-out"
        style={{ aspectRatio: stage === 1 ? 'auto' : '', height: stage === 1 ? '100%' : 'auto' }}
      >
        
        {/* ========================================================= */}
        {/* STAGE 0: TENGKORAK FIRE FORCE (TAP TAP)                   */}
        {/* ========================================================= */}
        {stage === 0 && (
          <div 
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#8b0000] cursor-pointer"
            onClick={handleSkullTap}
          >
            {/* Latar Belakang Api Statis */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,69,0,0.8)_0%,_#4a0000_100%)]" />
            
            <div className="relative z-10 flex flex-col items-center justify-center group text-center">
              {/* SVG Tengkorak Fire Force */}
              <svg 
                viewBox="0 0 100 100" 
                className="w-48 h-48 sm:w-56 sm:h-56 transition-transform duration-200"
                style={{
                  animation: skullTaps > 0 ? 'skullShake 0.3s infinite alternate' : 'none',
                  filter: 'drop-shadow(0px 10px 15px rgba(0,0,0,0.8)) drop-shadow(0px 0px 20px #ff4500)'
                }}
              >
                {/* Bentuk Kepala Tengkorak Putih */}
                <path d="M 20 50 C 20 20, 80 20, 80 50 L 75 85 C 75 90, 70 95, 60 95 L 40 95 C 30 95, 25 90, 25 85 Z" fill="#f5f5f5" stroke="#111" strokeWidth="2" />
                {/* Mata Bulat Besar */}
                <circle cx="35" cy="45" r="11" fill="#111" />
                <circle cx="65" cy="45" r="11" fill="#111" />
                {/* Hidung Bulat */}
                <circle cx="50" cy="65" r="6" fill="#111" />
                {/* Mulut dengan Gigi Copot di Tengah */}
                <path d="M 35 95 L 35 80 L 44 80 L 44 95 L 56 95 L 56 80 L 65 80 L 65 95 Z" fill="#111" />
              </svg>

              <div className="mt-8 font-mono text-sm tracking-[0.3em] font-bold text-white uppercase animate-pulse bg-black/50 px-4 py-2 rounded-lg border border-[#ff4500]">
                {skullTaps === 0 ? '[ TAP SKULL TO BREAK SEAL ]' : '[ ONE MORE TAP ]'}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* STAGE 1: KARTU KARAKTER JOKER (FULL SIZE + AURA & GLITCH) */}
        {/* ========================================================= */}
        {stage === 1 && (
          <div 
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black cursor-pointer overflow-hidden joker-glitch-active"
            onClick={handleJokerClick}
            style={{ animation: 'jokerAuraPulse 3s infinite' }}
          >
            {/* Background Texture Tarot/Card */}
            <div className="absolute inset-0 border-[12px] border-white m-4 rounded-xl flex flex-col items-center justify-between p-6 bg-[#e5e5e5] relative">
              
              {/* Corner Emblems */}
              <div className="absolute top-4 left-4 text-4xl font-serif text-black">J<br/><span className="text-2xl">♣</span></div>
              <div className="absolute bottom-4 right-4 text-4xl font-serif text-black rotate-180">J<br/><span className="text-2xl">♣</span></div>

              {/* Title */}
              <h1 className="text-4xl sm:text-5xl font-serif text-black tracking-widest mt-4 uppercase border-b-2 border-black pb-2">The Fool</h1>
              
              {/* Center Image Joker (SVG Representation of Manga Panel) */}
              <div className="flex-1 w-full flex items-center justify-center relative my-4">
                <svg viewBox="0 0 200 200" className="w-full h-full max-w-[300px] drop-shadow-[0_0_10px_rgba(0,0,0,0.5)]">
                  {/* Asap Hitam Jokernya */}
                  <path d="M 10 180 Q 30 140 50 170 T 80 130 T 110 160 T 150 120 T 190 180 Z" fill="#111" />
                  <path d="M 20 190 Q 40 100 80 150 T 130 90 T 180 190 Z" fill="#333" opacity="0.8" />
                  {/* Topi Joker */}
                  <path d="M 50 90 Q 100 70 150 90 L 140 100 Q 100 85 60 100 Z" fill="#111" />
                  <ellipse cx="100" cy="80" rx="35" ry="15" fill="#111" />
                  {/* Rambut Panjang & Wajah */}
                  <path d="M 70 100 L 70 160 L 80 150 L 80 100 Z" fill="#111" />
                  <path d="M 130 100 L 130 160 L 120 150 L 120 100 Z" fill="#111" />
                  <rect x="80" y="90" width="40" height="45" fill="#fff" />
                  {/* Senyum Joker Khas Fire Force */}
                  <path d="M 85 120 Q 100 135 115 120 Q 100 125 85 120 Z" fill="#111" />
                  {/* Mata Tertutup Poni / Kacamata (Manga style) */}
                  <rect x="80" y="90" width="40" height="20" fill="#111" />
                  <circle cx="90" cy="105" r="4" fill="#fff" />
                  {/* Api/Rokok Joker */}
                  <line x1="110" y1="125" x2="130" y2="135" stroke="#111" strokeWidth="2" />
                  <circle cx="132" cy="136" r="3" fill="#fff" />
                </svg>
              </div>

              <h2 className="text-3xl sm:text-4xl font-serif text-black tracking-[0.5em] mb-4 uppercase">Joker</h2>
              
              <div className="absolute bottom-8 text-black/60 font-mono text-xs animate-bounce">
                [ SWIPE OR CLICK TO REVEAL ]
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* STAGE 2: IDENTITAS (Full Cursor Tracking + Efek Api)      */}
        {/* ========================================================= */}
        <div 
          className={`card-wrapper relative z-10 w-full h-full min-h-[500px] overflow-y-auto p-6 sm:p-8 bg-company8 text-white transition-opacity duration-1000 ${stage === 2 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          onMouseMove={(e) => {
            if (stage !== 2) return;
            const rect = e.currentTarget.getBoundingClientRect()
            const x = e.clientX - rect.left
            const y = e.clientY - rect.top
            
            const cursorElements = ['cursor-fire-1', 'cursor-fire-2', 'cursor-fire-3', 'cursor-smoke-1', 'cursor-smoke-2']
            cursorElements.forEach(className => {
              const el = e.currentTarget.querySelector(`.${className}`) as HTMLElement | null
              if (el) {
                el.style.left = `${x}px`
                el.style.top = `${y}px`
              }
            })
          }}
        >
          {/* Border Api Animasi */}
          <div className="fire-border" />

          {/* Elemen Kursor (Akan ngikutin MouseMove di atas) */}
          <div className="cursor-smoke-2" />
          <div className="cursor-smoke-1" />
          <div className="cursor-fire-3" />
          <div className="cursor-fire-2" />
          <div className="cursor-fire-1" />

          {/* Background Elemen Fire Force (Salib Company 8 opacity rendah) */}
          <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center opacity-10 overflow-hidden">
             <svg viewBox="0 0 200 200" className="w-[150%] h-[150%] max-w-none text-[#ff4500] fill-current animate-[pulse_4s_infinite]">
               <path d="M 80 20 L 120 20 L 120 80 L 180 80 L 180 120 L 120 120 L 120 180 L 80 180 L 80 120 L 20 120 L 20 80 L 80 80 Z" />
             </svg>
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 mix-blend-overlay" />
          </div>

          {/* Header Identitas (Latom / Heating Level) */}
          <div className="relative z-10 flex justify-between items-center mb-6 border-b border-[#ff4500]/50 pb-2 text-[10px] sm:text-xs font-mono tracking-widest text-[#ff4500]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#ff4500] animate-ping" />
              <span>SQUAD: COMPANY 8 // FIRE FORCE</span>
            </div>
            <div className="text-white/80 border border-[#ff4500]/50 px-2 py-1 rounded bg-black/50 uppercase">
              HEATING LEVEL: MAX OVERDRIVE
            </div>
          </div>

          {/* Tombol Close X */}
          <button
            type="button"
            aria-label="Close member detail"
            onClick={onClose}
            className="absolute top-6 right-6 flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full border text-xl leading-none z-[60] transition-all duration-300
              border-[#ff4500]/50 text-[#ff4500] bg-black/80 backdrop-blur-sm
              hover:bg-[#ff4500] hover:text-white hover:scale-110 hover:shadow-[0_0_20px_#ff4500]"
          >
            ×
          </button>

          {/* Konten Foto */}
          <div className="mb-5 overflow-hidden rounded-xl border-2 relative z-20 transition-all duration-500 border-[#333] hover:border-[#ff4500] shadow-lg hover:shadow-[0_0_30px_rgba(255,69,0,0.6)] bg-black/50 group">
            <Image src={ProfileImage} alt="Profile Image" className="h-64 sm:h-[22rem] w-full object-cover object-center filter grayscale contrast-125 brightness-90 group-hover:grayscale-0 transition-all duration-700 relative z-0" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 z-0" />
            
            {/* Teks Identitas di Atas Foto */}
            <div className="absolute bottom-4 left-4 z-10">
              <h2 className="text-2xl sm:text-3xl font-black tracking-wide text-white drop-shadow-[0_2px_10px_#ff4500]">Akhdan Hafiz Anugrah</h2>
              <p className="text-gray-300 mt-1 text-sm font-semibold tracking-widest">5027251094 - Probolinggo</p>
            </div>
          </div>

          <div className="relative z-20">
            <div className="mt-5 flex gap-3">
              <div className="hover:shadow-[0_0_15px_#ff4500] rounded-full transition-shadow">
                <Instagram username="akdn.hpz_" />
              </div>
              <div className="hover:shadow-[0_0_15px_#ff4500] rounded-full transition-shadow">
                <LinkedInButtonLink username="akhdan-hafiz-371605379" />
              </div>
            </div>

            <div className="mt-6 grid gap-4 text-sm font-semibold sm:grid-cols-2">
              <div className="border-[#ff4500]/30 bg-black/60 backdrop-blur-md rounded-xl border p-4 hover:border-[#ff4500] transition-colors relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#ff4500] group-hover:w-full transition-all duration-500 opacity-20" />
                <p className="text-[#ff4500] text-xs tracking-widest uppercase mb-2">Hobi</p>
                <p className="relative z-10 text-gray-200">Fotografi, Baca Manhwa, Koleksi Parfum & Hotwheels</p>
              </div>
              <div className="border-[#ff4500]/30 bg-black/60 backdrop-blur-md rounded-xl border p-4 hover:border-[#ff4500] transition-colors relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#dc2626] group-hover:w-full transition-all duration-500 opacity-20" />
                <p className="text-[#ff4500] text-xs tracking-widest uppercase mb-2">Fun Fact</p>
                <p className="relative z-10 text-gray-200">admin ketolak pens masuk its loh yah</p>
              </div>
            </div>

            <div className="border-[#ff4500]/40 bg-black/80 backdrop-blur-xl mt-4 rounded-xl border p-4 hover:border-[#ff4500] transition-colors shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]">
              <p className="text-[#ff4500] text-xs font-bold tracking-widest uppercase mb-1">Lagu Favorit</p>
              <p className="my-2 text-sm font-bold text-white tracking-wide">Afterlife</p>

              {/* Spotify Embed */}
              <div className="relative z-30 ring-1 ring-[#ff4500]/30 rounded-xl overflow-hidden hover:ring-[#ff4500] transition-all">
                <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/7zAt4tdL44D3VuzsvM0N8n?si=5cf03527503649e3" />
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  )
}

export default MemberPopup
