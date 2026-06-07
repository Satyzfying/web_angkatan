'use client'

/* eslint-disable react-hooks/set-state-in-effect */

import React, { useEffect, useState } from 'react'

import Image from 'next/image'

import Instagram from '@/components/atoms/button/InstagramButtonLink'
import LinkedInButtonLink from '@/components/atoms/button/LinkedInButtonLink'
import SpotifyEmbed from '@/components/molecules/SpotifyEmbed'

import ProfileImage from './image.jpeg'

type MemberPopupProps = {
  isOpen: boolean
  onClose: () => void
}

const MemberPopup = ({ isOpen, onClose }: MemberPopupProps) => {
  const [showIntro, setShowIntro] = useState(true)
  const [isAmbruk, setIsAmbruk] = useState(false)
  const [minionState, setMinionState] = useState<'hop-back' | 'become-o' | 'freeze-first' | 'missile-strike'>('hop-back')

  useEffect(() => {
    if (!isOpen) {
      setShowIntro(true)
      setIsAmbruk(false)
      setMinionState('hop-back')
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    const ambrukTimer = setTimeout(() => { setIsAmbruk(true); setMinionState('become-o'); }, 2400)
    const freezeTimer = setTimeout(() => { setMinionState('freeze-first'); }, 3000)
    const missileTimer = setTimeout(() => { setMinionState('missile-strike'); }, 5000)
    const entryTimer = setTimeout(() => { setShowIntro(false); }, 7500)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
      clearTimeout(ambrukTimer); clearTimeout(freezeTimer); clearTimeout(missileTimer); clearTimeout(entryTimer)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto px-4 py-6 bg-[#0072BB]/60 backdrop-blur-md">
      <button type="button" aria-label="Close" onClick={onClose} className="absolute inset-0" />

      <style>{`
        /* ANIMASI INTRO */
        @keyframes hop-backward-smooth { 0% { transform: translate(170px, -30px) scale(1); } 15% { transform: translate(140px, -140px) scale(0.95, 1.05); } 35% { transform: translate(110px, -40px) scale(1.05, 0.95); } 50% { transform: translate(80px, -150px) scale(0.95, 1.05); } 75% { transform: translate(45px, -40px) scale(1.05, 0.95); } 90% { transform: translate(20px, -160px) scale(0.9, 1.1); } 100% { transform: translate(0px, -50px) scale(1); } }
        .animate-hop-back { animation: hop-backward-smooth 2.4s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
        @keyframes fall-down-to-baseline { 0% { transform: translate(0px, -50px) scale(1); } 50% { transform: translate(0px, 12px) scale(1.15, 0.8); } 80% { transform: translate(0px, -2px) scale(0.95, 1.05); } 100% { transform: translate(0px, 6px) scale(1); } }
        .animate-become-o { animation: fall-down-to-baseline 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        .minion-freeze-state { transform: translate(0px, 6px) scale(1); }
        @keyframes big-missile-drop { 0% { transform: translateY(-400px) scale(2.5); opacity: 0; } 10% { opacity: 1; } 100% { transform: translateY(50px) scale(2.5); opacity: 1; } }
        .animate-big-missile { animation: big-missile-drop 0.5s cubic-bezier(0.55, 0.055, 0.675, 0.19) forwards; }
        @keyframes yellow-flash-bang { 0% { opacity: 0; transform: scale(0); } 20% { opacity: 1; transform: scale(1); } 80% { opacity: 1; transform: scale(1); } 100% { opacity: 0; transform: scale(1); } }
        .animate-yellow-explosion { animation: yellow-flash-bang 2s ease-in-out forwards; background-color: #FFE100; }
        @keyframes custom-o-fall { 0% { transform: translateY(0) rotate(0deg); opacity: 1; } 100% { transform: translateY(200px) rotate(45deg); opacity: 0; } }
        .animate-o-ambruk { animation: custom-o-fall 0.5s cubic-bezier(0.6, -0.28, 0.735, 0.045) forwards; }
        
        /* DOODLE & INTERACTIVE STYLING */
        @keyframes doodle-pop { 0% { transform: scale(0); } 100% { transform: scale(1); } }
        .animate-doodle { animation: doodle-pop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        .minion-shadow { box-shadow: 15px 15px 0px 0px rgba(0, 0, 0, 1); }
        .denim-texture { background-color: #0072BB; background-image: radial-gradient(#005da1 3px, transparent 0); background-size: 20px 20px; }
        .hover-comic:hover { transform: scale(1.03) rotate(1deg); transition: 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
      `}</style>

      {showIntro ? (
        <div className="relative z-10 flex flex-col items-center justify-center p-10 select-none w-full h-full overflow-hidden">
          {minionState === 'missile-strike' && (
            <div className="absolute inset-0 z-50 animate-yellow-explosion flex flex-col items-center justify-center text-black font-sans">
              <div className="text-5xl sm:text-7xl font-black tracking-normal uppercase border-8 border-black p-6 bg-white rotate-[-4deg] minion-shadow">KA-BOOM!</div>
            </div>
          )}
          {minionState === 'freeze-first' && <div className="absolute top-1/2 left-1/2 -mt-40 -ml-4 z-40 text-6xl animate-big-missile">💣</div>}
          
          <div className="relative flex items-end font-mono text-7xl font-black tracking-tighter text-white drop-shadow-[5px_5px_0px_rgba(0,0,0,1)] sm:text-8xl">
            <span>P</span><span>R</span>
            <div className="relative inline-flex items-center justify-center w-[55px] sm:w-[65px] h-[75px] sm:h-[95px] mx-1">
              <span className={`absolute inset-0 text-center ${isAmbruk ? 'animate-o-ambruk' : ''}`}>O</span>
              <div className={`absolute left-1/2 -ml-6 flex h-16 w-12 items-center justify-center rounded-full border-4 border-black bg-[#FFE100] p-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] origin-bottom z-20 ${minionState === 'hop-back' ? 'animate-hop-back' : ''} ${minionState === 'become-o' ? 'animate-become-o' : ''} ${minionState === 'freeze-first' || minionState === 'missile-strike' ? 'minion-freeze-state' : ''}`}>
                <div className="relative flex h-7 w-7 items-center justify-center rounded-full border-[3px] border-black bg-white">
                  <div className={`h-2.5 w-2.5 rounded-full bg-black transition-all duration-300 ${minionState === 'hop-back' ? '-translate-x-1' : ''} ${minionState === 'become-o' ? 'scale-120 translate-y-0.5' : ''} ${minionState === 'freeze-first' ? 'scale-75 translate-y-0' : ''}`} />
                </div>
                {minionState === 'freeze-first' && <div className="absolute -top-7 text-xs font-black text-white bg-[#FF595E] border-2 border-black h-5 w-5 flex items-center justify-center rounded-full animate-bounce">?</div>}
              </div>
            </div>
            <span>F</span><span>I</span><span>L</span>
          </div>
        </div>
      ) : (
        <div className="relative z-10 w-full max-w-[720px] max-h-[calc(100vh-9rem)] sm:max-h-[calc(100vh-10rem)] overflow-y-auto rounded-[60px] border-[12px] border-black bg-[#FFE100] p-8 sm:p-10 text-black minion-shadow">
          
          {/* DEKORASI RAME JUMBO */}
          <div className="absolute -top-8 -left-8 text-8xl animate-doodle rotate-[-25deg] pointer-events-none">🍌</div>
          <div className="absolute top-10 -right-8 text-7xl animate-doodle pointer-events-none">💣</div>
          <div className="absolute bottom-1/3 -left-12 text-7xl animate-doodle pointer-events-none">⚡</div>
          <div className="absolute bottom-10 right-8 text-6xl animate-doodle pointer-events-none">🤪</div>

          <button onClick={onClose} className="absolute top-6 right-6 z-30 flex h-14 w-14 items-center justify-center rounded-full border-[6px] border-black bg-[#FF595E] text-3xl font-black text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:rotate-180 transition-all active:scale-90">X</button>

          <div className="w-full overflow-hidden rounded-[30px] border-[8px] border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-8 aspect-[16/9] hover-comic">
            <Image src={ProfileImage} alt="Profile" className="h-full w-full object-cover object-center" priority />
          </div>

          <div className="space-y-6 text-left">
            <div>
              <h3 className="text-5xl font-black uppercase tracking-tighter italic">Daffa Rifqi As Shidiq</h3>
              <p className="mt-3 font-mono text-lg font-black text-[#0072BB]">5027251038 — TEGAL</p>
            </div>

            <div className="flex justify-start gap-6 pl-2">
              <div className="rounded-[30px] border-[6px] border-black bg-[#0072BB] h-20 w-20 flex items-center justify-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:bg-black transition-all hover:scale-110 hover-comic cursor-pointer"><Instagram username="daffarifqiasshidiq" /></div>
              <div className="rounded-[30px] border-[6px] border-black bg-[#0072BB] h-20 w-20 flex items-center justify-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:bg-black transition-all hover:scale-110 hover-comic cursor-pointer"><LinkedInButtonLink username="daffa-rifqi-as-shidiq-0b6619379" /></div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-[30px] border-[6px] border-black denim-texture p-6 text-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover-comic">
                <span className="bg-white px-4 py-1 text-xs font-black uppercase text-black border-4 border-black rounded-xl">HOBI</span>
                <p className="mt-4 text-xl font-black">Ngemil & Musik</p>
              </div>
              <div className="rounded-[30px] border-[6px] border-black bg-[#38B000] p-6 text-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover-comic">
                <span className="bg-white px-4 py-1 text-xs font-black uppercase text-black border-4 border-black rounded-xl">FUN FACT</span>
                <p className="mt-4 text-xl font-black">Linjur SMK Akuntansi!</p>
              </div>
            </div>

            <div className="rounded-[35px] border-[8px] border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover-comic">
              <div className="mb-4 pb-3 border-b-4 border-black">
                <p className="font-mono text-sm font-black text-[#0072BB] uppercase tracking-widest">Lagu Favorit</p>
                <p className="mt-1 text-2xl font-black uppercase tracking-tight">Helena</p>
              </div>
              <div className="overflow-hidden rounded-2xl border-4 border-black bg-[#FFE100] p-4">
                <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/5dTHtzHFPyi8TlTtzoz1J9?si=TZ-VGQ-2S--93gh5AAlqQQ" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MemberPopup
