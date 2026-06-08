'use client'

/* eslint-disable react-hooks/set-state-in-effect */

import React, { useEffect, useState, useRef } from 'react'
import { createPortal } from 'react-dom'

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
  // State dasar popup
  const [stage, setStage] = useState(0)
  const [skullTaps, setSkullTaps] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const popupRef = useRef<HTMLDivElement>(null)

  // STATS BARU: Untuk kontrol interaksi swipe / drag kartu
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState(0)
  const [dragOffset, setDragOffset] = useState(0)
  const [isSwipedAway, setIsSwipedAway] = useState(false)
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null)

  // Mengatur scroll body & keypress Escape
  useEffect(() => {
    if (!isOpen) {
      // Reset semua state ketika popup ditutup
      setStage(0)
      setSkullTaps(0)
      setIsDragging(false)
      setDragOffset(0)
      setIsSwipedAway(false)
      setSwipeDirection(null)
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

  // Sinkronisasi BGM dengan Spotify
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
            if (stage > 0) {
              audioRef.current?.play().catch(() => { })
            }
          }
        }
      } catch { }
    }

    window.addEventListener('message', handleSpotifyMessage)
    return () => window.removeEventListener('message', handleSpotifyMessage)
  }, [stage])

  useEffect(() => {
    if (!isOpen || !popupRef.current || stage !== 2) {
      return
    }

    const itemAnimations = Array.from(popupRef.current.querySelectorAll<HTMLElement>('[data-popup-item]')).map(
      (item, index) =>
        item.animate(
          [
            { opacity: 0, transform: 'translateY(-32px)' },
            { opacity: 1, transform: 'translateY(0)' },
          ],
          {
            duration: 450,
            delay: 100 + index * 90,
            easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
            fill: 'both',
          }
        )
    )

    return () => {
      itemAnimations.forEach((animation) => animation.cancel())
    }
  }, [isOpen, stage])

  if (!isOpen) {
    return null
  }

  // Handler Stage 0 (Skull)
  const handleSkullTap = () => {
    if (skullTaps === 0) {
      audioRef.current?.play().catch(() => { })
      setSkullTaps(1)
    } else {
      setStage(1)
    }
  }

  // =========================================================
  // LOGIKAH GESTUR SWIPE (MOUSE & TOUCH UNIFIED)
  // =========================================================
  const onDragStart = (clientX: number) => {
    if (stage !== 1 || isSwipedAway) return
    setIsDragging(true)
    setDragStart(clientX)
  }

  const onDragMove = (clientX: number) => {
    if (!isDragging || isSwipedAway) return
    const offset = clientX - dragStart
    setDragOffset(offset)
  }

  const onDragEnd = () => {
    if (!isDragging || isSwipedAway) return
    setIsDragging(false)

    const swipeThreshold = 100 // Batas pixel minimal untuk dihitung swipe

    if (Math.abs(dragOffset) > swipeThreshold) {
      // Kasus 1: Berhasil di-swipe melewati batas
      const direction = dragOffset > 0 ? 'right' : 'left'
      setIsSwipedAway(true)
      setSwipeDirection(direction)

      // Beri jeda animasi melempar kartu (350ms) sebelum ganti ke identitas
      setTimeout(() => {
        setStage(2)
      }, 350)
    } else if (Math.abs(dragOffset) < 6) {
      // Kasus 2: Hanya klik/tap biasa tanpa geser, otomatis swipe otomatis ke kanan
      setIsSwipedAway(true)
      setSwipeDirection('right')
      setTimeout(() => {
        setStage(2)
      }, 350)
    } else {
      // Kasus 3: Tarikan kurang jauh, kembalikan posisi kartu ke tengah (snap back)
      setDragOffset(0)
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/85 px-4 py-4 backdrop-blur-md group/modal select-none">
      
      <audio 
        ref={audioRef} 
        src="/assets/sounds/Fire Force.mp3" 
        loop 
        className="hidden" 
      />

      <style>{`
        @keyframes fireForceGlow {
          0%, 100% { box-shadow: 0 0 15px rgba(255, 69, 0, 0.5), inset 0 0 15px rgba(220, 38, 38, 0.3); }
          50% { box-shadow: 0 0 35px rgba(255, 69, 0, 0.9), inset 0 0 25px rgba(255, 140, 0, 0.6); }
        }
        @keyframes skullShake {
          0%, 100% { transform: scale(1.1) rotate(0deg); filter: drop-shadow(0 0 30px #ff4500); }
          25% { transform: scale(1.1) rotate(-3deg) translateX(-2px); filter: drop-shadow(0 0 40px #ff0000); }
          75% { transform: scale(1.1) rotate(3deg) translateX(2px); filter: drop-shadow(0 0 50px #ff8c00); }
        }
        @keyframes jokerAuraPulse {
          0% { box-shadow: 0 0 0 0px rgba(220, 38, 38, 0.7), 0 0 0 10px rgba(255, 255, 255, 0.4), 0 0 0 20px rgba(100, 100, 100, 0.3); }
          50% { box-shadow: 0 0 20px 10px rgba(220, 38, 38, 0.9), 0 0 30px 20px rgba(255, 255, 255, 0.6), 0 0 40px 30px rgba(0, 0, 0, 0.8); }
          100% { box-shadow: 0 0 0 0px rgba(220, 38, 38, 0), 0 0 0 0px rgba(255, 255, 255, 0), 0 0 0 0px rgba(100, 100, 100, 0); }
        }
        @keyframes jokerGlitch {
          0%, 100% { filter: grayscale(100%) contrast(120%) invert(0); transform: translate(0); }
          10% { filter: grayscale(100%) contrast(200%) invert(1); transform: translate(-4px, 2px) skewX(2deg); }
          20% { filter: grayscale(100%) contrast(120%) invert(0); transform: translate(4px, -2px) skewX(-2deg); }
          30% { filter: grayscale(100%) contrast(200%) invert(1); transform: translate(-2px, -4px); }
          40% { filter: grayscale(100%) contrast(120%) invert(0); transform: translate(2px, 4px); }
          50% { filter: grayscale(100%) contrast(150%) invert(1); transform: translate(-3px, 1px) scale(1.02); }
          60% { filter: grayscale(100%) contrast(120%) invert(0); transform: translate(0); }
        }
        @keyframes borderFireTravel {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        
        /* KEYFRAMES BARU: Efek Bara Api Terbang di Background */
        @keyframes emberRise {
          0% { transform: translateY(110vh) translateX(0) scale(0.6); opacity: 0; }
          10% { opacity: 1; }
          50% { transform: translateY(50vh) translateX(calc(var(--ember-x) / 2)) scale(1); }
          90% { opacity: 0.8; }
          100% { transform: translateY(-10vh) translateX(var(--ember-x)) scale(0.4); opacity: 0; filter: blur(1px); }
        }

        /* KEYFRAMES BARU: Gelombang Api dari Bawah & Garis Api */
        @keyframes ragingFire {
          0%, 100% { transform: scaleY(0.8) translateY(15px); opacity: 0.6; }
          50% { transform: scaleY(1.3) translateY(-15px); opacity: 1; }
        }
        @keyframes fireLineTravel {
          0% { background-position: 0% 0; }
          100% { background-position: 200% 0; }
        }

        .cursor-fire-1, .cursor-fire-2, .cursor-fire-3, .cursor-smoke-1, .cursor-smoke-2 {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          transform: translate(-50%, -50%);
          z-index: 90;
        }
        .cursor-fire-1 { width: 15px; height: 15px; background: #fffacd; box-shadow: 0 0 10px #ffffe0; transition: top 0.05s, left 0.05s; mix-blend-mode: screen; filter: blur(2px); }
        .cursor-fire-2 { width: 35px; height: 35px; background: radial-gradient(circle, #ff8c00 20%, transparent 80%); transition: top 0.1s, left 0.1s; mix-blend-mode: screen; filter: blur(4px); }
        .cursor-fire-3 { width: 60px; height: 60px; background: radial-gradient(circle, #dc2626 10%, transparent 70%); transition: top 0.15s, left 0.15s; mix-blend-mode: screen; filter: blur(8px); }
        .cursor-smoke-1 { width: 80px; height: 80px; background: radial-gradient(circle, rgba(50,50,50,0.6) 0%, transparent 70%); transition: top 0.25s ease-out, left 0.25s ease-out; mix-blend-mode: multiply; filter: blur(10px); }
        .cursor-smoke-2 { width: 100px; height: 100px; background: radial-gradient(circle, rgba(0,0,0,0.7) 0%, transparent 70%); transition: top 0.4s ease-out, left 0.4s ease-out; filter: blur(15px); opacity: 0.5; }

        .card-wrapper:hover .cursor-fire-1, .card-wrapper:hover .cursor-fire-2, .card-wrapper:hover .cursor-fire-3, .card-wrapper:hover .cursor-smoke-1, .card-wrapper:hover .cursor-smoke-2 {
          opacity: 1;
        }
        .bg-company8 { background: linear-gradient(135deg, rgba(20,20,20,0.95) 0%, rgba(0,0,0,0.95) 100%); }
        
        .fire-border {
          position: absolute;
          inset: 0;
          z-index: 50;
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
        
        /* CLASS BARU: Partikel dan Api Dasar */
        .ember-particle {
          position: absolute;
          bottom: -20px;
          background: radial-gradient(circle, #ffffff 0%, #ffbc3d 40%, #ff4500 80%, transparent 100%);
          box-shadow: 0 0 8px #ff4500, 0 0 15px #dc2626;
          border-radius: 50%;
          pointer-events: none;
          mix-blend-mode: screen;
          animation: emberRise linear infinite;
        }
        .flame-base {
          position: absolute;
          bottom: -40px;
          border-radius: 50% 50% 0 0;
          mix-blend-mode: screen;
          filter: blur(25px);
        }
        
        /* CLASS BARU: Garis Identitas Api */
        .fire-line {
          height: 2px;
          background: linear-gradient(90deg, transparent 0%, #ff4500 20%, #ffd700 50%, #dc2626 80%, transparent 100%);
          background-size: 200% auto;
          animation: fireLineTravel 2s linear infinite;
          box-shadow: 0 0 12px #ff4500, 0 0 6px #dc2626;
          border-radius: 2px;
        }

        .joker-glitch-active { animation: jokerGlitch 2.5s infinite linear; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0, 0, 0, 0.5); border-radius: 8px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #ff4500; border-radius: 8px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #dc2626; }
      `}</style>

      {/* Background Overlay Click to Close */}
      <button
        type="button"
        aria-label="Close member detail"
        onClick={onClose}
        className="absolute inset-0 bg-transparent cursor-default w-full h-full z-10"
      />

      {/* ========================================================= */}
      {/* AMBIENT BACKGROUND LAYER (TEMA FIRE FORCE) */}
      {/* ========================================================= */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        
        {/* KOBARAN API DARI BAWAH (BARU) */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#ff4500]/50 via-[#dc2626]/20 to-transparent blur-2xl" />
        <div className="flame-base w-48 h-56 bg-[#ff4500] left-[-5%] animate-[ragingFire_2s_infinite_alternate]" />
        <div className="flame-base w-64 h-64 bg-[#dc2626] left-[20%] animate-[ragingFire_2.5s_infinite_alternate-reverse]" />
        <div className="flame-base w-56 h-60 bg-[#ff8c00] left-[45%] animate-[ragingFire_1.8s_infinite_alternate]" />
        <div className="flame-base w-72 h-64 bg-[#ff4500] left-[70%] animate-[ragingFire_2.2s_infinite_alternate-reverse]" />
        
        {/* Aura Api membara besar di bagian dasar layar */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[140%] h-[55%] bg-[radial-gradient(ellipse_at_bottom,_rgba(220,38,38,0.25),_rgba(255,69,0,0.12),_transparent_70%)] blur-3xl animate-[pulse_4s_infinite_alternate]" />
        
        {/* Pencahayaan orange tipis dari atas untuk kontras */}
        <div className="absolute top-0 inset-x-0 h-[30%] bg-gradient-to-b from-red-950/20 to-transparent blur-xl" />

        {/* Partikel Bara Api Terbang (Embers) dengan posisi, delay, dan arah acak */}
        <div className="ember-particle w-2.5 h-2.5 left-[8%] animate-[emberRise_7s_infinite]" style={{ '--ember-x': '60px', animationDelay: '0s' } as React.CSSProperties} />
        <div className="ember-particle w-3.5 h-3.5 left-[22%] animate-[emberRise_9s_infinite]" style={{ '--ember-x': '-80px', animationDelay: '2s' } as React.CSSProperties} />
        <div className="ember-particle w-2 h-2 left-[38%] animate-[emberRise_6s_infinite]" style={{ '--ember-x': '40px', animationDelay: '4s' } as React.CSSProperties} />
        <div className="ember-particle w-4 h-4 left-[52%] animate-[emberRise_11s_infinite]" style={{ '--ember-x': '-50px', animationDelay: '0.5s' } as React.CSSProperties} />
        <div className="ember-particle w-2.5 h-2.5 left-[67%] animate-[emberRise_8s_infinite]" style={{ '--ember-x': '90px', animationDelay: '3.5s' } as React.CSSProperties} />
        <div className="ember-particle w-3 h-3 left-[81%] animate-[emberRise_10s_infinite]" style={{ '--ember-x': '-60px', animationDelay: '1.2s' } as React.CSSProperties} />
        <div className="ember-particle w-1.5 h-1.5 left-[93%] animate-[emberRise_6.5s_infinite]" style={{ '--ember-x': '30px', animationDelay: '5s' } as React.CSSProperties} />
      </div>

      {/* Main Responsive Frame Canvas */}
      <div 
        className="custom-scrollbar relative z-20 h-[100dvh] max-h-[100dvh] w-full max-w-[720px] overflow-y-auto overscroll-contain rounded-2xl bg-black shadow-[0_0_50px_rgba(255,69,0,0.25)] transition-all duration-300 ease-out"
      >

        {/* ========================================================= */}
        {/* STAGE 0: TENGKORAK FIRE FORCE (TAP TAP)                   */}
        {/* ========================================================= */}
        {stage === 0 && (
          <div
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#8b0000] cursor-pointer"
            onClick={handleSkullTap}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,69,0,0.8)_0%,_#4a0000_100%)]" />
            <div className="relative z-10 flex flex-col items-center justify-center group text-center">
              <svg
                viewBox="0 0 100 100"
                className="w-48 h-48 sm:w-56 sm:h-56 transition-transform duration-200"
                style={{
                  animation: skullTaps > 0 ? 'skullShake 0.3s infinite alternate' : 'none',
                  filter: 'drop-shadow(0px 10px 15px rgba(0,0,0,0.8)) drop-shadow(0px 0px 20px #ff4500)'
                }}
              >
                <path d="M 20 50 C 20 20, 80 20, 80 50 L 75 85 C 75 90, 70 95, 60 95 L 40 95 C 30 95, 25 90, 25 85 Z" fill="#f5f5f5" stroke="#111" strokeWidth="2" />
                <circle cx="35" cy="45" r="11" fill="#111" />
                <circle cx="65" cy="45" r="11" fill="#111" />
                <circle cx="50" cy="65" r="6" fill="#111" />
                <path d="M 35 95 L 35 80 L 44 80 L 44 95 L 56 95 L 56 80 L 65 80 L 65 95 Z" fill="#111" />
              </svg>
              <div className="mt-8 font-mono text-sm tracking-[0.3em] font-bold text-white uppercase animate-pulse bg-black/50 px-4 py-2 rounded-lg border border-[#ff4500]">
                {skullTaps === 0 ? '[ TAP SKULL TO BREAK SEAL ]' : '[ ONE MORE TAP ]'}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* STAGE 1: KARTU KARAKTER JOKER (DENGAN NAVIGASI SWIPE)     */}
        {/* ========================================================= */}
        {stage === 1 && (
          <div
            className={`absolute inset-0 z-50 flex flex-col items-center justify-center bg-black overflow-hidden ${!isDragging && !isSwipedAway ? 'joker-glitch-active' : ''}`}
            style={{ animation: 'jokerAuraPulse 3s infinite' }}

            // Mouse Events (Desktop Drag Simulation)
            onMouseDown={(e) => onDragStart(e.clientX)}
            onMouseMove={(e) => onDragMove(e.clientX)}
            onMouseUp={onDragEnd}
            onMouseLeave={onDragEnd}

            // Touch Events (Mobile Native Swipe)
            onTouchStart={(e) => onDragStart(e.touches[0].clientX)}
            onTouchMove={(e) => onDragMove(e.touches[0].clientX)}
            onTouchEnd={onDragEnd}
          >
            {/* KARTU JOKER ANIMATIF:
              Bergeser dan berputar halus real-time mengikuti cursor/jari 
            */}
            <div
              style={{
                transform: isSwipedAway
                  ? `translateX(${swipeDirection === 'right' ? '160%' : '-160%'}) rotate(${swipeDirection === 'right' ? '35deg' : '-35deg'})`
                  : `translateX(${dragOffset}px) rotate(${dragOffset * 0.05}deg)`,
                transition: isDragging ? 'none' : 'transform 0.35s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.3s',
                opacity: isSwipedAway ? 0 : 1,
                cursor: isDragging ? 'grabbing' : 'grab'
              }}
              className="absolute inset-0 border-[12px] border-white m-4 rounded-xl flex flex-col items-center justify-between p-6 bg-[#e5e5e5] relative select-none shadow-[0_20px_50px_rgba(0,0,0,0.9)]"
            >
              {/* Desain Pojok Kartu */}
              <div className="absolute top-4 left-4 text-4xl font-serif text-black pointer-events-none">J<br /><span className="text-2xl">♣</span></div>
              <div className="absolute bottom-4 right-4 text-4xl font-serif text-black rotate-180 pointer-events-none">J<br /><span className="text-2xl">♣</span></div>

              {/* Title */}
              <h1 className="text-4xl sm:text-5xl font-serif text-black tracking-widest mt-4 uppercase border-b-2 border-black pb-2 pointer-events-none">The Fool</h1>

              {/* Gambar Vektor Manga Joker */}
              <div className="flex-1 w-full flex items-center justify-center relative my-4 pointer-events-none">
                <svg viewBox="0 0 200 200" className="w-full h-full max-w-[300px] drop-shadow-[0_0_10px_rgba(0,0,0,0.5)]">
                  <path d="M 10 180 Q 30 140 50 170 T 80 130 T 110 160 T 150 120 T 190 180 Z" fill="#111" />
                  <path d="M 20 190 Q 40 100 80 150 T 130 90 T 180 190 Z" fill="#333" opacity="0.8" />
                  <path d="M 50 90 Q 100 70 150 90 L 140 100 Q 100 85 60 100 Z" fill="#111" />
                  <ellipse cx="100" cy="80" rx="35" ry="15" fill="#111" />
                  <path d="M 70 100 L 70 160 L 80 150 L 80 100 Z" fill="#111" />
                  <path d="M 130 100 L 130 160 L 120 150 L 120 100 Z" fill="#111" />
                  <rect x="80" y="90" width="40" height="45" fill="#fff" />
                  <path d="M 85 120 Q 100 135 115 120 Q 100 125 85 120 Z" fill="#111" />
                  <rect x="80" y="90" width="40" height="20" fill="#111" />
                  <circle cx="90" cy="105" r="4" fill="#fff" />
                  <line x1="110" y1="125" x2="130" y2="135" stroke="#111" strokeWidth="2" />
                  <circle cx="132" cy="136" r="3" fill="#fff" />
                </svg>
              </div>

              <h2 className="text-3xl sm:text-4xl font-serif text-black tracking-[0.5em] mb-4 uppercase pointer-events-none">Joker</h2>

              <div className="absolute bottom-8 text-black/60 font-mono text-xs animate-bounce pointer-events-none">
                [ SWIPE CARD LEFT/RIGHT TO REVEAL ]
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* STAGE 2: IDENTITAS (Bisa Di-Scroll)                       */}
        {/* ========================================================= */}
        <div
          className={`transition-opacity duration-1000 w-full ${stage === 2 ? 'opacity-100 relative' : 'opacity-0 absolute inset-0 pointer-events-none'}`}
        >
          {/* Border Api membingkai container (full) */}
          <div className="fire-border" />

          {/* Wrapper Konten Scrollable */}
          <div
            className="card-wrapper relative w-full p-6 sm:p-8 bg-company8 text-white rounded-2xl"
            onMouseMove={(e) => {
              if (stage !== 2) return;
              const rect = e.currentTarget.getBoundingClientRect()
              const x = e.clientX - rect.left
              // Penambahan e.currentTarget.scrollTop agar koordinat kursor menyesuaikan ketika discroll
              const y = e.clientY - rect.top + e.currentTarget.scrollTop 
              
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
            {/* Elemen Kursor */}
            <div className="cursor-smoke-2" />
            <div className="cursor-smoke-1" />
            <div className="cursor-fire-3" />
            <div className="cursor-fire-2" />
            <div className="cursor-fire-1" />

            {/* Background Salib Company 8 */}
            <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center opacity-10 overflow-hidden">
              <svg viewBox="0 0 200 200" className="w-[150%] h-[150%] max-w-none text-[#ff4500] fill-current animate-[pulse_4s_infinite]">
                <path d="M 80 20 L 120 20 L 120 80 L 180 80 L 180 120 L 120 120 L 120 180 L 80 180 L 80 120 L 20 120 L 20 80 L 80 80 Z" />
              </svg>
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 mix-blend-overlay" />
            </div>

            {/* Header Identitas DENGAN GARIS API (BARU) */}
            <div className="relative z-10 mb-6">
              <div className="flex justify-between items-center pb-2 text-[10px] sm:text-xs font-mono tracking-widest text-[#ff4500]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#ff4500] animate-ping" />
                  <span>SQUAD: COMPANY 8 // FIRE FORCE</span>
                </div>
                <div className="text-white/80 border border-[#ff4500]/50 px-2 py-1 rounded bg-black/50 uppercase">
                  HEATING LEVEL: MAX OVERDRIVE
                </div>
              </div>
              {/* Garis Api Mengalir di Bawah SQUAD Header */}
              <div className="fire-line w-full mt-1" />
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
            <div data-popup-item className="mb-5 overflow-hidden rounded-xl border-2 relative z-20 transition-all duration-500 border-[#333] hover:border-[#ff4500] shadow-lg hover:shadow-[0_0_30px_rgba(255,69,0,0.6)] bg-black/50 group">
              <Image src={ProfileImage} alt="Profile Image" className="h-64 sm:h-[22rem] w-full object-cover object-center filter grayscale contrast-125 brightness-90 group-hover:grayscale-0 transition-all duration-700 relative z-0" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 z-0" />

              <div className="absolute bottom-4 left-4 z-10">
                <h2 className="text-2xl sm:text-3xl font-black tracking-wide text-white drop-shadow-[0_2px_10px_#ff4500]">Akhdan Hafiz Anugrah</h2>
                <p className="text-gray-300 mt-1 text-sm font-semibold tracking-widest">5027251094 - Probolinggo</p>
              </div>
            </div>

            {/* Sosial Media & Informasi */}
            <div className="relative z-20 pb-8">
              <div data-popup-item className="mt-5 flex gap-3">
                <div className="hover:shadow-[0_0_15px_#ff4500] rounded-full transition-shadow">
                  <Instagram username="akdn.hpz_" />
                </div>
                <div className="hover:shadow-[0_0_15px_#ff4500] rounded-full transition-shadow">
                  <LinkedInButtonLink username="akhdan-hafiz-371605379" />
                </div>
              </div>

              <div data-popup-item className="mt-6 grid gap-4 text-sm font-semibold sm:grid-cols-2">
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

              <div data-popup-item className="border-[#ff4500]/40 bg-black/80 backdrop-blur-xl mt-4 rounded-xl border p-4 hover:border-[#ff4500] transition-colors shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]">
                <p className="text-[#ff4500] text-xs font-bold tracking-widest uppercase mb-1">Lagu Favorit</p>
                <p className="my-2 text-sm font-bold text-white tracking-wide">Afterlife</p>

                <div className="relative z-30 ring-1 ring-[#ff4500]/30 rounded-xl overflow-hidden hover:ring-[#ff4500] transition-all">
                  <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/7zAt4tdL44D3VuzsvM0N8n?si=5cf03527503649e3" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default MemberPopup
