'use client'

import React, { useEffect, useState, useRef } from 'react'

import Image from 'next/image'

import { createPortal } from 'react-dom'

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
      } catch (err) {}
  if (!isOpen) {
    return null
  }

  return createPortal(
    <div className="group/modal fixed inset-0 z-[100] flex items-start justify-center overflow-hidden bg-black/40 px-4 backdrop-blur-md">
      <style>{`
    @keyframes antiMagicAura {
      0% { transform: scale(1) rotate(0deg); opacity: 0.5; filter: blur(25px); }
      50% { transform: scale(1.1) rotate(180deg); opacity: 0.8; filter: blur(35px); }
      100% { transform: scale(1) rotate(360deg); opacity: 0.5; filter: blur(25px); }
    }
    @keyframes fireFlicker {
      0%, 100% { box-shadow: 0 0 20px rgba(239, 68, 68, 0.5), inset 0 0 15px rgba(249, 115, 22, 0.3); }
      50% { box-shadow: 0 0 40px rgba(249, 115, 22, 0.9), inset 0 0 30px rgba(239, 68, 68, 0.6); }
    }
    @keyframes floatClover {
      0%, 100% { transform: translateY(0) scale(1); filter: drop-shadow(0 0 15px rgba(255,0,0,0.8)); }
      50% { transform: translateY(-10px) scale(1.05); filter: drop-shadow(0 0 30px rgba(255,0,0,1)); }
    }
    @keyframes emberFloat {
      0% { transform: translateY(0) translateX(0) scale(1); opacity: 0.8; }
      80% { opacity: 0.4; }
      100% { transform: translateY(-120px) translateX(var(--drift, 0px)) scale(0.2); opacity: 0; }
    }
    @keyframes glitchShift {
      0%, 88%, 100% { transform: translate(0); filter: none; }
      89% { transform: translate(-3px, 1px); filter: hue-rotate(90deg) brightness(1.5); }
      90% { transform: translate(3px, -2px); filter: hue-rotate(200deg) brightness(0.8); }
      91% { transform: translate(0); filter: none; }
      92% { transform: translate(2px, 1px); filter: brightness(2); }
      93% { transform: translate(-1px, 0); filter: none; }
    }
    @keyframes auraRingExpand {
      0% { transform: translate(-50%, -50%) scale(0.6); opacity: 0.7; }
      100% { transform: translate(-50%, -50%) scale(1.8); opacity: 0; }
    }
    @keyframes fireEdgePulse {
      0%, 100% { opacity: 0.5; box-shadow: 0 0 8px #ff4500; }
      50% { opacity: 1; box-shadow: 0 0 20px #ff4500, 0 0 40px rgba(255,69,0,0.3); }
    }
    @keyframes fireParticleRise {
      0% { transform: translateY(0) translateX(0) scaleX(1); opacity: 0.8; }
      50% { transform: translateY(-60px) translateX(var(--px, 0px)) scaleX(0.8); opacity: 0.5; }
      100% { transform: translateY(-120px) translateX(var(--px2, 0px)) scaleX(0.4) rotate(15deg); opacity: 0; }
    }
    @keyframes dotPulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(0.7); }
    }
    @keyframes bgSymbolDrift {
      0%, 100% { transform: translateY(0) rotate(var(--rot, 0deg)); opacity: 0.05; }
      50% { transform: translateY(-8px) rotate(var(--rot, 0deg)); opacity: 0.1; }
    }

    /* PALET AURA: Merah, Putih, Abu-abu, Hitam */
    .animate-aura-red { animation: antiMagicAura 8s infinite linear; background: radial-gradient(circle, rgba(220,38,38,0.4) 0%, transparent 60%); }
    .animate-aura-white { animation: antiMagicAura 6s infinite reverse linear; background: radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 50%); }
    .animate-aura-gray { animation: antiMagicAura 10s infinite linear; background: radial-gradient(circle, rgba(156,163,175,0.3) 0%, transparent 60%); }
    .animate-aura-black { animation: antiMagicAura 7s infinite reverse linear; background: radial-gradient(circle, rgba(0,0,0,0.8) 0%, transparent 70%); }

    .interactive-fire:hover { animation: fireFlicker 0.6s infinite alternate; }

    /* EFEK EKOR API KURSOR — berlayer 3 lapis */
    .cursor-fire-trail-1 {
      position: absolute;
      width: 80px; height: 80px;
      background: radial-gradient(circle, rgba(255,69,0,0.45) 0%, transparent 70%);
      border-radius: 50%;
      pointer-events: none;
      transform: translate(-50%, -50%);
      mix-blend-mode: screen;
      transition: top 0.18s ease-out, left 0.18s ease-out;
      z-index: 35;
      opacity: 0;
      filter: blur(12px);
    }
    .cursor-fire-trail-2 {
      position: absolute;
      width: 50px; height: 50px;
      background: radial-gradient(circle, rgba(220,38,38,0.6) 0%, transparent 70%);
      border-radius: 50%;
      pointer-events: none;
      transform: translate(-50%, -50%);
      mix-blend-mode: screen;
      transition: top 0.1s ease-out, left 0.1s ease-out;
      z-index: 36;
      opacity: 0;
      filter: blur(7px);
    }
    .cursor-fire-trail-3 {
      position: absolute;
      width: 22px; height: 22px;
      background: radial-gradient(circle, rgba(255,200,50,0.9) 0%, transparent 70%);
      border-radius: 50%;
      pointer-events: none;
      transform: translate(-50%, -50%);
      mix-blend-mode: screen;
      transition: top 0.05s linear, left 0.05s linear;
      z-index: 37;
      opacity: 0;
      filter: blur(3px);
    }
    .card-container:hover .cursor-fire-trail-1,
    .card-container:hover .cursor-fire-trail-2,
    .card-container:hover .cursor-fire-trail-3 { opacity: 1; }

    /* Fire edge borders */
    .fire-edge-top, .fire-edge-bottom {
      position: absolute;
      left: 0; right: 0;
      height: 3px;
      background: linear-gradient(90deg, transparent, #dc2626, #ff4500, #fff, #ff4500, #dc2626, transparent);
      animation: fireEdgePulse 2s ease-in-out infinite;
      pointer-events: none;
      z-index: 5;
    }
    .fire-edge-top { top: 0; animation-delay: 1s; }
    .fire-edge-bottom { bottom: 0; }

    /* Fire particles floating on card */
    .fire-particle {
      position: absolute;
      border-radius: 50% 50% 30% 30%;
      pointer-events: none;
      animation: fireParticleRise linear infinite;
      opacity: 0;
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
    /* Dot pulse */
    .dot-pulse-anim {
      width: 7px; height: 7px;
      border-radius: 50%;
      background: #dc2626;
      animation: dotPulse 1.5s infinite;
      box-shadow: 0 0 6px #dc2626;
      flex-shrink: 0;
    }
  `}</style>

      {/* Tombol Close Background Overlay */}
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
          

      <div
        className="relative z-10 h-[100dvh] max-h-[100dvh] w-full max-w-[720px] overflow-hidden rounded-2xl border-2 text-white shadow-2xl transition-all duration-500 ease-out select-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-900 via-[#0d0707] to-black border-orange-600/40 hover:border-orange-500 interactive-fire card-container group animate-fire-active"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect()
          const x = e.clientX - rect.left
          const y = e.clientY - rect.top
          const t1 = e.currentTarget.querySelector('.cursor-fire-trail-1') as HTMLElement | null
          const t2 = e.currentTarget.querySelector('.cursor-fire-trail-2') as HTMLElement | null
          const t3 = e.currentTarget.querySelector('.cursor-fire-trail-3') as HTMLElement | null
          if (t1) { t1.style.left = `${x}px`; t1.style.top = `${y}px`; }
          if (t2) { t2.style.left = `${x}px`; t2.style.top = `${y}px`; }
          if (t3) { t3.style.left = `${x}px`; t3.style.top = `${y}px`; }
        }}
      >
        <div className="scanlines-overlay absolute inset-0 z-[55] pointer-events-none" />
        <div className="fire-edge-top" />
        <div className="fire-edge-bottom" />

        {/* BACKGROUND AURA */}
        <div className="absolute inset-0 pointer-events-none z-0 mix-blend-screen overflow-hidden">
          <div className="absolute -top-1/4 -left-1/4 w-[150%] h-[150%] animate-aura-red" />
          <div className="absolute top-1/4 right-1/4 w-[100%] h-[100%] animate-aura-white" />
          <div className="absolute -bottom-1/4 -right-1/4 w-[150%] h-[150%] animate-aura-gray" />
          <div className="absolute inset-0 animate-aura-black mix-blend-multiply" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(255,255,255,0.05)_1px,_transparent_1px)] bg-[size:30px_30px] opacity-20" />
        </div>

        {/* ELEMEN EKOR API berlayer 3 */}
        <div className="cursor-fire-trail-1" />
        <div className="cursor-fire-trail-2" />
        <div className="cursor-fire-trail-3" />
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="fire-particle"
            style={{
              width: `${4 + (i * 7) % 6}px`,
              height: `${7 + (i * 5) % 8}px`,
              background: ['rgba(255,69,0,0.75)', 'rgba(220,38,38,0.8)', 'rgba(255,140,0,0.6)', 'rgba(255,200,50,0.55)'][i % 4],
              left: `${8 + i * 9}%`,
              bottom: `${(i * 11) % 30}px`,
              animationDuration: `${1.2 + i * 0.3}s`,
              animationDelay: `${i * 0.35}s`,
              ['--px' as string]: `${(i % 2 === 0 ? 1 : -1) * (10 + i * 3)}px`,
              ['--px2' as string]: `${(i % 2 === 0 ? -1 : 1) * (20 + i * 4)}px`,
              filter: `blur(${i % 3}px)`,
              zIndex: 3,
            }}
          />
        ))}

        {/* TOMBOL CLOSE */}
        <button
          type="button"
          aria-label="Close member detail"
          onClick={onClose}
          className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border text-xl leading-none z-[60] transition-all duration-300 border-[#ff4500]/50 text-[#ff4500] bg-black/60 backdrop-blur-sm hover:bg-[#ff4500] hover:text-white hover:border-[#ff4500] hover:scale-110 hover:shadow-[0_0_15px_#ff4500]"
        >×</button>
        <div className="absolute inset-0 overflow-y-auto overflow-x-hidden p-6 sm:p-8 z-[30]">
          {/* ORNAMEN IDENTITAS: Crossover Fire Force x Black Clover */}
          <div className="relative z-10 flex justify-between items-center mb-6 border-b border-[#ff4500]/30 pb-2 text-[11px] font-mono tracking-widest text-[#ff4500]">
            <div className="flex items-center gap-2">
              <span className="dot-pulse-anim" />
              <span>GRIMOIRE // 8TH BRIGADE</span>
            </div>
          </div>
          {/* FOTO PROFIL: Bingkai Heavy Industrial Fire Force */}
          <div className="mb-5 overflow-hidden rounded-2xl border-2 relative z-20 transition-all duration-500
      border-[#1f1f1f] group-hover:border-[#ff4500] shadow-lg group-hover:shadow-[0_0_30px_rgba(255,69,0,0.4)] bg-black">

            {/* Garis hazard oranye Fire Force */}
            <div className="hazard-stripe absolute top-0 left-0 right-0 h-1.5 opacity-90 z-10" />

            <Image src={ProfileImage} alt="Profile Image" className="h-120 w-full object-cover object-center filter grayscale contrast-125 brightness-90 group-hover:grayscale-0 transition-all duration-700 relative z-0" />

            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80 z-0" />
          </div>

          <div className="relative z-10 pr-10">
            <h2 className="text-2xl font-black">Akhdan Hafiz Anugrah</h2>
            <p className="text-white/70 mt-1 text-sm font-semibold">5027251094 - Probolinggo</p>
          </div>

          <div className="relative z-10 mt-5 flex gap-2">
            <div className="rounded-xl border-[3px] border-[#ff4500]/30 bg-black/50 backdrop-blur-md p-3 hover:border-[#ff4500] transition-colors">
              <Instagram username="akdn.hpz_" />
            </div>
            <div className="rounded-xl border-[3px] border-[#ff4500]/30 bg-black/50 backdrop-blur-md p-3 hover:border-[#ff4500] transition-colors">
              <LinkedInButtonLink username="akhdan-hafiz" />
            </div>
          </div>

          <div className="relative z-10 mt-6 grid gap-4 text-sm font-semibold sm:grid-cols-2">
            <div className="rounded-xl border-[3px] border-[#ff4500]/30 bg-black/50 backdrop-blur-md p-4">
              <p className="text-[#ff4500] text-xs font-bold tracking-wide uppercase">Hobi</p>
              <p className="mt-2 text-gray-300">Fotografi, Baca Manhwa, Koleksi Parfum & Hotwheels</p>
            </div>
            <div className="rounded-xl border-[3px] border-[#ff4500]/30 bg-black/50 backdrop-blur-md p-4">
              <p className="text-[#ff4500] text-xs font-bold tracking-wide uppercase">Fun Fact</p>
              <p className="mt-2 text-gray-300">admin ketolak pens masuk its loh yah</p>
            </div>
          </div>

          <div className="relative z-10 mt-4 rounded-xl border-[3px] border-[#ff4500]/30 bg-black/50 backdrop-blur-md p-4">
            <p className="text-[#ff4500] text-xs font-bold tracking-wide uppercase">Lagu Favorit</p>
            <p className="my-2 text-sm font-semibold text-gray-300">Afterlife</p>
            <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/7zAt4tdL44D3VuzsvM0N8n?si=2904e26f70974d0a" />
          </div>

        </div>

        {/* LAYER 2: GRIMOIRE ASTA & KUNCI (Klik Key untuk Unlock)    */}
        {/* ========================================================= */}
        <div
          className="absolute inset-0 z-40 bg-[#0d0d0d] flex flex-col items-center justify-center p-8 transition-all duration-1000 ease-in-out cursor-pointer overflow-hidden"
          onClick={(e) => {
            // Interaksi menghilangkan Grimoire tanpa state (pure DOM JS)
            e.currentTarget.style.opacity = '0';
            e.currentTarget.style.transform = 'scale(1.1) perspective(500px) rotateX(15deg)';
            e.currentTarget.style.pointerEvents = 'none';
          }}
        >
          {/* Ambient bg */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(100,0,0,0.35)_0%,_#000_70%)] pointer-events-none" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(255,255,255,0.03)_1px,_transparent_1px)] bg-[size:28px_28px] opacity-30 pointer-events-none" />

          {/* Aura rings */}
          {[
            { size: 200, color: 'rgba(220,38,38,0.5)', delay: '0s' },
            { size: 200, color: 'rgba(255,255,255,0.15)', delay: '1s' },
            { size: 200, color: 'rgba(220,38,38,0.3)', delay: '2s' },
          ].map((ring, i) => (
            <div
              key={i}
              className="aura-ring"
              style={{
                width: ring.size,
                height: ring.size,
                borderColor: ring.color,
                animationDelay: ring.delay,
              }}
            />
          ))}

          {/* Grimoire Book + key — glitch wrapper */}
          <div className="grimoire-glitch relative z-10 flex flex-col items-center justify-center">
            {/* SVG Grimoire Book */}
            <svg
              viewBox="0 0 280 320"
              xmlns="http://www.w3.org/2000/svg"
              className="w-[220px] sm:w-[260px]"
              style={{ filter: 'drop-shadow(0 0 24px rgba(220,38,38,0.8))' }}
            >
              <defs>
                <radialGradient id="bookBody" cx="50%" cy="50%" r="55%">
                  <stop offset="0%" stopColor="#2a0505" />
                  <stop offset="70%" stopColor="#120202" />
                  <stop offset="100%" stopColor="#0a0000" />
                </radialGradient>
                <radialGradient id="cloverGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#dc2626" stopOpacity="0.9" />
                  <stop offset="60%" stopColor="#991b1b" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="transparent" />
                </radialGradient>
              </defs>

              {/* Shadow */}
              <ellipse cx="140" cy="312" rx="95" ry="10" fill="rgba(0,0,0,0.5)" />

              {/* Pages */}
              <path d="M148,22 C160,20 195,28 218,38 L228,278 C208,273 175,268 150,270 Z" fill="#d4a54a" stroke="#8b6914" strokeWidth="0.5" />
              <line x1="158" y1="48" x2="216" y2="50" stroke="#a0783a" strokeWidth="0.5" opacity="0.6" />
              <line x1="158" y1="58" x2="216" y2="60" stroke="#a0783a" strokeWidth="0.5" opacity="0.5" />
              <line x1="158" y1="68" x2="216" y2="70" stroke="#a0783a" strokeWidth="0.5" opacity="0.4" />

              {/* Spine */}
              <rect x="135" y="20" width="16" height="253" rx="2" fill="#0a0000" stroke="#3a0000" strokeWidth="1" />

              {/* Cover */}
              <path d="M148,20 C130,16 50,23 30,33 L26,276 C46,270 130,268 148,272 Z" fill="url(#bookBody)" stroke="#3a0000" strokeWidth="1.5" />

              {/* Torn edges */}
              <path d="M30,33 L20,36 L28,48 L18,58 L30,63 L22,78 L32,83 L24,98 L30,103 L22,118 L30,128 L20,142 L28,152 L18,168 L25,176 L20,193 L28,203 L22,218 L30,226 L24,242 L30,248 L25,262 L30,268 L26,276"
                stroke="#1a0000" strokeWidth="3" fill="none" opacity="0.7" />

              {/* Corner ornaments */}
              <rect x="28" y="24" width="18" height="18" fill="none" stroke="#8b0000" strokeWidth="1.5" rx="2" />
              <line x1="28" y1="33" x2="46" y2="33" stroke="#8b0000" strokeWidth="0.5" />
              <line x1="37" y1="24" x2="37" y2="42" stroke="#8b0000" strokeWidth="0.5" />
              <rect x="28" y="252" width="18" height="18" fill="none" stroke="#8b0000" strokeWidth="1.5" rx="2" />
              <line x1="28" y1="261" x2="46" y2="261" stroke="#8b0000" strokeWidth="0.5" />
              <line x1="37" y1="252" x2="37" y2="270" stroke="#8b0000" strokeWidth="0.5" />

              {/* Scratch texture */}
              <path d="M40,78 L60,68 M35,88 L55,83 M42,98 L62,93" stroke="#1a0000" strokeWidth="1" opacity="0.6" />

              {/* 5-Leaf Clover glowing on cover */}
              <circle cx="90" cy="148" r="52" fill="url(#cloverGlow)" opacity="0.35" />
              <path d="M90,148 C76,132 63,110 80,98 C93,89 106,91 104,102 C120,113 110,136 90,148Z" fill="#dc2626" opacity="0.85" stroke="#ff4500" strokeWidth="1" />
              <path d="M90,148 C108,136 130,130 130,112 C130,99 120,92 111,98 C96,108 92,132 90,148Z" fill="#dc2626" opacity="0.85" stroke="#ff4500" strokeWidth="1" />
              <path d="M90,148 C105,165 110,188 97,200 C88,209 76,205 76,193 C72,181 78,161 90,148Z" fill="#dc2626" opacity="0.85" stroke="#ff4500" strokeWidth="1" />
              <path d="M90,148 C72,165 50,172 42,158 C35,147 42,135 53,137 C66,140 80,145 90,148Z" fill="#dc2626" opacity="0.85" stroke="#ff4500" strokeWidth="1" />
              <path d="M90,148 C72,133 58,113 68,101 C76,91 88,92 88,103 C94,115 88,137 90,148Z" fill="#dc2626" opacity="0.85" stroke="#ff4500" strokeWidth="1" />
              <circle cx="90" cy="148" r="9" fill="#ff4500" stroke="#fff" strokeWidth="1.5" />
              <circle cx="90" cy="148" r="4" fill="#000" />

              {/* Grimoire face */}
              <circle cx="118" cy="185" r="3" fill="#fff" opacity="0.55" />
              <circle cx="128" cy="188" r="3" fill="#fff" opacity="0.55" />
              <path d="M114,196 Q121,203 130,196" stroke="#fff" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.65" />
              <line x1="115" y1="198" x2="115" y2="202" stroke="#fff" strokeWidth="1" opacity="0.55" />
              <line x1="118" y1="199" x2="118" y2="204" stroke="#fff" strokeWidth="1" opacity="0.55" />
              <line x1="121" y1="200" x2="121" y2="204" stroke="#fff" strokeWidth="1" opacity="0.55" />
              <line x1="124" y1="199" x2="124" y2="203" stroke="#fff" strokeWidth="1" opacity="0.55" />
              <line x1="127" y1="198" x2="127" y2="201" stroke="#fff" strokeWidth="1" opacity="0.55" />

              {/* D letter top-left */}
              <text x="35" y="52" fontFamily="Cinzel" fontSize="16" fill="#8b0000" fontWeight="700">D</text>

              {/* Fire swirls */}
              <path d="M26,145 Q12,125 22,105 Q32,85 27,65" stroke="#dc2626" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.4" strokeDasharray="3,3" />
              <path d="M148,155 Q162,135 152,115 Q142,95 148,75" stroke="#ff4500" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.3" strokeDasharray="3,3" />
            </svg>

            {/* Key + Unlock text */}
            <div className="mt-6 flex flex-col items-center gap-3">
              <div
                className="w-14 h-14 rounded-full border-2 border-[#ff4500] flex items-center justify-center bg-black/60
            shadow-[0_0_18px_#ff4500] hover:bg-[#ff4500]/20 hover:scale-110 hover:shadow-[0_0_35px_#ff4500]
            transition-all duration-200 cursor-pointer"
              >
                <span className="text-2xl" style={{ filter: 'drop-shadow(0 0 6px #ff4500)' }}>🗝️</span>
              </div>
              <p className="font-mono text-[10px] tracking-[0.35em] text-[#ff4500] animate-pulse uppercase">
                unlock to see more
              </p>
            </div>
          </div>
        </div>

        {/* LAYER 1: 5-LEAF CLOVER AWAL (Harus di Tap-Tap)            */}
        {/* ========================================================= */}
        <div
          className="absolute inset-0 z-50 bg-black flex flex-col items-center justify-center transition-opacity duration-700 ease-out cursor-crosshair overflow-hidden"
          onClick={(e) => {
            // Mekanisme Tap-Tap manual (Double tap to destroy)
            const clicks = parseInt(e.currentTarget.dataset.clicks || '0') + 1;
            e.currentTarget.dataset.clicks = String(clicks);
            const clover = e.currentTarget.querySelector('.clover-icon') as HTMLElement | null;
            const fireBg = e.currentTarget.querySelector('.fire-bg') as HTMLElement | null;
            const instruction = e.currentTarget.querySelector('.instruction-text') as HTMLElement | null;

            if (clicks === 1) {
              if (clover) { clover.style.transform = 'scale(1.4)'; clover.style.filter = 'drop-shadow(0 0 50px #ff4500)'; }
              if (fireBg) fireBg.style.opacity = '0.9';
              if (instruction) { instruction.innerHTML = '[ TAP ONCE MORE TO IGNITE ]'; instruction.style.color = '#ff4500'; }
            } else if (clicks >= 2) {
              e.currentTarget.style.opacity = '0';
              e.currentTarget.style.pointerEvents = 'none';
            }
          }}
        >
          {/* Latar Belakang Api (Fire Force) */}
          <div className="fire-bg absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,69,0,0.6)_0%,_transparent_60%)] opacity-40 transition-opacity duration-500 pointer-events-none" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-50 animate-pulse pointer-events-none" />

          <div className="relative z-10 text-center pointer-events-none">
            {/* Ikon Semanggi 5 Daun Bergaris Oranye */}
            <div className="clover-icon text-9xl text-black filter drop-shadow-[0_0_20px_#dc2626] transition-all duration-500 transform scale-100 mb-8">
              <span style={{ WebkitTextStroke: '2px #ff4500' }}>🍀</span>
            </div>
            <div className="instruction-text text-white/80 font-mono text-[11px] tracking-[0.4em] uppercase transition-colors duration-300">
              [ TAP TO BREAK SEAL ]
            </div>
          </div>

        </div>
      </div>
    </div>,
    document.body
  )
}

export default MemberPopup
