'use client'

import React, { useEffect } from 'react'

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

    /* Cell hover fire glow */
    .info-cell-hover {
      position: relative;
      overflow: hidden;
      transition: background 0.25s;
    }
    .info-cell-hover::after {
      content: '';
      position: absolute;
      bottom: -24px; left: 50%;
      width: 70px; height: 70px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(255,69,0,0.35) 0%, transparent 70%);
      transform: translateX(-50%);
      opacity: 0;
      transition: opacity 0.3s, bottom 0.3s;
      mix-blend-mode: screen;
      pointer-events: none;
    }
    .info-cell-hover:hover::after { opacity: 1; bottom: -10px; }
    .info-cell-hover:hover { background: rgba(255,69,0,0.05); }

    /* BG symbols */
    .bg-symbol-drift { animation: bgSymbolDrift ease-in-out infinite; }

    /* Hazard stripe */
    .hazard-stripe {
      background: repeating-linear-gradient(90deg, #ff4500 0, #ff4500 14px, #000 14px, #000 28px);
    }

    /* Scan lines */
    .scanlines-overlay {
      background: repeating-linear-gradient(0deg, transparent 0px, transparent 3px, rgba(0,0,0,0.12) 3px, rgba(0,0,0,0.12) 4px);
      pointer-events: none;
    }

    /* Grimoire glitch wrapper */
    .grimoire-glitch { animation: glitchShift 5s infinite; }

    /* Aura ring */
    .aura-ring {
      position: absolute;
      top: 50%; left: 50%;
      border-radius: 50%;
      border: 1.5px solid;
      animation: auraRingExpand 3s ease-out infinite;
      pointer-events: none;
    }

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
