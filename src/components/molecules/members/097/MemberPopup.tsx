'use client'

/* eslint-disable react-hooks/set-state-in-effect, react/no-unescaped-entities */

import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

import Image from 'next/image'

import Instagram from '@/components/atoms/button/InstagramButtonLink'
import LinkedInButtonLink from '@/components/atoms/button/LinkedInButtonLink'
import SpotifyEmbed from '@/components/molecules/SpotifyEmbed'

import ProfileImage from './image.jpeg'

type MemberPopupProps = {
  isOpen: boolean
  onClose: () => void
}

type Particle = {
  id: number
  top: number
  left: number
  size: number
  delay: number
  duration: number
  color: string
}

const MemberPopup = ({ isOpen, onClose }: MemberPopupProps) => {
  // --- STATE MINI GAME R6 ---
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [hp, setHp] = useState(100)
  const [ammo, setAmmo] = useState(30)
  const [targetPos, setTargetPos] = useState({ top: '40%', left: '50%' })

  // --- STATE PARTIKEL (SEKARANG UNTUK SATU LAYAR PENUH) ---
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    if (!isOpen) {
      setIsUnlocked(false)
      setHp(100)
      setAmmo(30)
      setParticles([])
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
      if (event.key === 'r' || event.key === 'R') {
        setAmmo(30)
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  // Pemicu partikel full screen saat game berhasil diselesaikan
  useEffect(() => {
    if (isUnlocked) {
      const colors = ['bg-emerald-400', 'bg-amber-400', 'bg-teal-400', 'bg-cyan-400']
      // Jumlah ditingkatkan menjadi 65 agar memenuhi kanan-kiri layar dengan pas
      const generatedParticles = Array.from({ length: 65 }).map((_, i) => ({
        id: i,
        top: Math.random() * 100,       // Dari paling bawah sampai paling atas layar
        left: Math.random() * 100,      // Dari paling kiri sampai paling kanan layar
        size: Math.random() * 5 + 2,    // Ukuran bervariasi 2px - 7px
        delay: Math.random() * 6,       // Jeda rilis acak hingga 6 detik
        duration: Math.random() * 6 + 6, // Kecepatan melayang santai (6s - 12s)
        color: colors[Math.floor(Math.random() * colors.length)]
      }))
      setParticles(generatedParticles)
    } else {
      setParticles([])
    }
  }, [isUnlocked])

  // Pergerakan target Ash (Tetap lambat & meluncur halus)
  useEffect(() => {
    if (!isOpen || isUnlocked) return

    const interval = setInterval(() => {
      const randomTop = Math.floor(Math.random() * 50) + 25 
      const randomLeft = Math.floor(Math.random() * 60) + 20 
      setTargetPos({ top: `${randomTop}%`, left: `${randomLeft}%` })
    }, 1500) 

    return () => clearInterval(interval)
  }, [isOpen, isUnlocked])

  if (!isOpen) {
    return null
  }

  const handleHitTarget = (e: React.MouseEvent) => {
    e.stopPropagation() 
    if (ammo <= 0 || isUnlocked) return

    setAmmo((prev) => prev - 1)
    setHp((prev) => {
      const nextHp = prev - 50 
      if (nextHp <= 0) {
        setIsUnlocked(true)
        return 0
      }
      return nextHp
    })
  }

  const handleMissShot = () => {
    if (ammo > 0 && !isUnlocked) {
      setAmmo((prev) => prev - 1)
    }
  }

  return createPortal((
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-hidden px-4">
      
      {/* Animasi partikel melayang secara global */}
      <style>{`
        @keyframes floatAndPulse {
          0% { transform: translateY(0px) scale(1); opacity: 0; }
          20% { opacity: 0.7; }
          80% { opacity: 0.7; }
          100% { transform: translateY(-150px) scale(0.4); opacity: 0; }
        }
        .unlocked-particle {
          animation: floatAndPulse linear infinite;
        }
      `}</style>

      {/* Background Overlay */}
      <button
        type="button"
        aria-label="Close member detail"
        onClick={onClose}
        className="absolute inset-0 bg-black/85 backdrop-blur-md"
      />

      {/* ========================================================= */}
      {/* LAYER PARTIKEL BARU (SEKARANG BERADA DI LUAR POPUP)       */}
      {/* Menyebar ke seluruh layar (Kanan, Kiri, Atas, Bawah)      */}
      {/* ========================================================= */}
      {isUnlocked && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-20 opacity-70">
          {particles.map((p) => (
            <div
              key={p.id}
              className={`unlocked-particle absolute ${p.color} rounded-full`}
              style={{
                top: `${p.top}%`,
                left: `${p.left}%`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                animationDelay: `${p.delay}s`,
                animationDuration: `${p.duration}s`,
                filter: 'blur(0.5px)',
                boxShadow: '0 0 6px currentColor'
              }}
            />
          ))}
        </div>
      )}

      {/* Kontainer Utama (z-10 agar partikel melayang indah melintasi komponen ini) */}
      <div className="border-neutral-cs-10 bg-zinc-950 relative z-10 h-[100dvh] max-h-[100dvh] w-full max-w-[720px] animate-[member-popup-show_200ms_ease-out] overflow-y-auto rounded-2xl border-2 p-6 text-white shadow-2xl sm:h-[100dvh] max-h-[100dvh] sm:p-8 font-mono overflow-hidden">
        
        {/* Tombol Close */}
        <button
          type="button"
          aria-label="Close member detail"
          onClick={onClose}
          className="border-white/20 hover:bg-white/10 absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border text-xl leading-none z-50 transition-colors"
        >
          ×
        </button>

        {/* ========================================================= */}
        {/* TAMPILAN GATED GAME */}
        {/* ========================================================= */}
        {!isUnlocked ? (
          <div 
            onClick={handleMissShot}
            style={{ touchAction: 'manipulation' }}
            className="relative h-[450px] w-full rounded-xl border border-amber-500/30 bg-zinc-900/50 overflow-hidden flex flex-col items-center justify-between p-4 cursor-crosshair select-none"
          >
            <div className="text-center z-20">
              <h3 className="text-amber-500 font-black tracking-widest text-lg animate-pulse">
                ⚠️ SECURITY PROTOCOL: ATTACKER DETECTED
              </h3>
              <p className="text-xs text-neutral-400 mt-1">
                Eliminate Ash to reveal the operator's intel.
              </p>
            </div>

            {/* Target Operator R6 */}
            <div
              onClick={handleHitTarget}
              style={{ top: targetPos.top, left: targetPos.left }}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ease-in-out z-30 group"
            >
              <div className="w-14 h-14 rounded-full border-2 border-red-500 bg-red-500/20 flex items-center justify-center animate-ping absolute inset-0 opacity-40"></div>
              <div className="w-14 h-14 rounded-full border-2 border-red-600 bg-zinc-900 flex flex-col items-center justify-center shadow-[0_0_15px_rgba(220,38,38,0.5)] cursor-crosshair hover:scale-110 transition-transform">
                <span className="text-[10px] font-bold text-red-500">ASH</span>
                <span className="text-[9px] text-white/60 font-sans font-bold">{hp} HP</span>
              </div>
            </div>

            {/* HUD Bawah */}
            <div className="w-full flex justify-between items-end border-t border-white/10 pt-3 z-20">
              <div>
                <p className="text-xs text-neutral-400">AMMO</p>
                <p className={`text-2xl font-black ${ammo <= 5 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                  {ammo} <span className="text-xs text-neutral-500">/ 30</span>
                </p>
                {ammo === 0 && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); setAmmo(30); }}
                    className="text-[10px] bg-amber-500 text-black px-2 py-0.5 rounded font-bold mt-1 uppercase animate-bounce"
                  >
                    Click to Reload
                  </button>
                )}
              </div>
              <div className="text-right">
                <p className="text-xs text-neutral-400">HITBOX STATUS</p>
                <p className="text-sm font-bold text-emerald-400 uppercase">Nerfed (Fair Play)</p>
              </div>
            </div>
          </div>
        ) : (
          // =========================================================
          // TAMPILAN BIODATA ASLI
          // =========================================================
          <div className="animate-[member-popup-show_300ms_ease-out]">
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-2 text-center text-xs text-emerald-400 mb-4 font-bold tracking-wider animate-pulse">
              🔓 ACCESS GRANTED: INTEL UNLOCKED SUCCESSFULLY
            </div>

            <div className="border-neutral-cs-10/40 mb-5 overflow-hidden rounded-2xl border shadow-lg shadow-black/50">
              <Image src={ProfileImage} alt="Profile Image" className="h-120 w-full object-cover object-center" />
            </div>

            <div className="pr-10">
              <h2 className="text-2xl font-black text-white tracking-tight">Muhammad Salman Rifki Haq</h2>
              <p className="text-amber-400 mt-1 text-sm font-semibold">5027251097 - Kediri</p>
            </div>

            <div className="mt-5 flex gap-2">
              <Instagram username="rifkihaq_" />
              <LinkedInButtonLink username="rifki-haq-711700379" />
            </div>

            <div className="mt-6 grid gap-4 text-sm font-semibold sm:grid-cols-2">
              <div className="bg-zinc-900/60 border border-white/10 rounded-xl p-4 hover:border-amber-500/40 transition-colors backdrop-blur-xs">
                <p className="text-neutral-400 text-xs tracking-wide uppercase">Hobi</p>
                <p className="mt-2">Travelling, Game, Nyanyi</p>
              </div>
              <div className="bg-zinc-900/60 border border-white/10 rounded-xl p-4 hover:border-amber-500/40 transition-colors backdrop-blur-xs">
                <p className="text-neutral-400 text-xs tracking-wide uppercase">Fun Fact</p>
                <p className="mt-2">Kalo Ketemu Aku Di Jalan Itu Belum Tentu Aku</p>
              </div>
            </div>

            <div className="bg-zinc-900/60 border border-white/10 mt-4 rounded-xl p-4 backdrop-blur-xs">
              <p className="text-neutral-400 text-xs font-bold tracking-wide uppercase">Lagu Favorit</p>
              <p className="my-2 text-sm font-semibold">Double Take</p>
              <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/47isJpIIO8m7BJEhiFhnaf?si=6dd25a97d02c419d" />
            </div>
          </div>
        )}
      </div>
    </div>
  ), document.body)
}

export default MemberPopup
