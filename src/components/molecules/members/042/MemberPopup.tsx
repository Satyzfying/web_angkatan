'use client'

import { useCallback, useEffect, useState } from 'react'

import Image from 'next/image'

import { createPortal } from 'react-dom'

import Instagram from '@/components/atoms/button/InstagramButtonLink'
import LinkedInButtonLink from '@/components/atoms/button/LinkedInButtonLink'
import SpotifyEmbed from '@/components/molecules/SpotifyEmbed'

import TetrisGate from './TetrisGate'
import ProfileImage from './image.jpg'

type MemberPopupProps = {
  isOpen: boolean
  onClose: () => void
}

const MemberPopup = ({ isOpen, onClose }: MemberPopupProps) => {
  const [passed, setPassed] = useState(false)

  const handleClose = useCallback(() => {
    setPassed(false)
    onClose()
  }, [onClose])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose()
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, handleClose])

  if (!isOpen) {
    return null
  }

  if (!passed) {
    return createPortal(<TetrisGate onSuccess={() => setPassed(true)} onClose={handleClose} />, document.body)
  }

  return createPortal(
    // PADA BAGIAN INI KAMU BOLEH MENGUBAH STYLE SESUKA HATI KAMU, TAPI JANGAN UBAH STRUKTUR DAN FUNGSI DARI KODE INI AGAR FUNGSI POPUP TETAP BERJALAN DENGAN BAIK
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto px-4">

      <button
        type="button"
        aria-label="Close member detail"
        onClick={handleClose}
        className="absolute inset-0 z-0 bg-[#080B1A]/80 backdrop-blur-sm"
      />

      <div className="fixed inset-0 z-[1] overflow-hidden pointer-events-none">
        <div className="absolute rounded-full w-[500px] h-[500px] -top-20 -left-24"
          style={{ background: 'rgba(0, 40, 220, 0.25)', filter: 'blur(72px)' }} />
        <div className="absolute rounded-full w-[400px] h-[400px] top-32 -right-20"
          style={{ background: 'rgba(0, 180, 210, 0.15)', filter: 'blur(64px)' }} />
        <div className="absolute rounded-full w-[360px] h-[360px] -bottom-16 left-1/3"
          style={{ background: 'rgba(0, 110, 255, 0.2)', filter: 'blur(60px)' }} />
        <div className="absolute rounded-full w-[240px] h-[240px] bottom-24 right-1/4"
          style={{ background: 'rgba(20, 15, 80, 0.35)', filter: 'blur(50px)' }} />
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        
        .popup-font-serif { font-family: 'Cormorant Garamond', serif; }
        .popup-font-sans { font-family: 'DM Sans', sans-serif; }

        @keyframes zzzRandom1 {
          0% { transform: translate(-80px, 20px) scale(0.6) rotate(-15deg); opacity: 0; }
          40% { opacity: 0.8; }
          100% { transform: translate(-40px, -25px) scale(1.1) rotate(10deg); opacity: 0; }
        }
        @keyframes zzzRandom2 {
          0% { transform: translate(-140px, 35px) scale(0.5) rotate(20deg); opacity: 0; }
          50% { opacity: 0.9; }
          100% { transform: translate(-90px, -15px) scale(1.3) rotate(-15deg); opacity: 0; }
        }
        @keyframes zzzRandom3 {
          0% { transform: translate(-40px, 15px) scale(0.8) rotate(0deg); opacity: 0; }
          30% { opacity: 0.7; }
          100% { transform: translate(-10px, -30px) scale(0.7) rotate(35deg); opacity: 0; }
        }
        
        .zzz-anim-1 { animation: zzzRandom1 3s ease-in-out infinite; }
        .zzz-anim-2 { animation: zzzRandom2 3.8s ease-in-out infinite; }
        .zzz-anim-3 { animation: zzzRandom3 2.5s ease-in-out infinite; }

        .neon-glow-turu {
          color: #DCD7FF;
          text-shadow: 0 0 10px rgba(131,123,222,0.8), 0 0 20px rgba(131,123,222,0.4);
        }
      `}} />

      <div className="relative z-10 max-h-[100dvh] w-full max-w-[720px] animate-[member-popup-show_200ms_ease-out] overflow-y-auto rounded-2xl border border-white/10 p-6 text-white shadow-xl sm:p-8"
        style={{ background: 'rgba(8,11,26,0.75)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>

        <button
          type="button"
          aria-label="Close member detail"
          onClick={handleClose}
          className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-xl leading-none text-white/50 hover:bg-white/10"
        >
          x
        </button>

        <div className="mb-5 overflow-hidden rounded-2xl border border-white/10">
          <Image src={ProfileImage} alt="Profile Image" className="h-120 w-full object-cover object-top" />
        </div>

        <div className="pr-10">
          {/* UBAH NAMA ANDA */}
          <h2 className="popup-font-serif text-3xl font-semibold text-[#F0EEFF] tracking-wide">Nayla Arsha Adyuta — Acha</h2>
          {/* UBAH NRP DAN ASAL */}
          <p className="popup-font-sans mt-1 text-sm font-light tracking-widest text-[#B4AAFF]/60">5027251042 · Tangerang</p>
        </div>

        <div className="mt-5 flex gap-2">
          {/* UBAH USERNAME INSTAGRAM */}
          <Instagram username="adyutaar" />
          {/* UBAH USERNAME LINKEDIN */}
          <LinkedInButtonLink username="adyutaar" />
        </div>

        <div className="my-5 h-px w-full" style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.08), transparent)' }} />

        <div className="grid gap-4 text-sm sm:grid-cols-2">
          
          {/* UBAH HOBI KAMU */}
          <div className="relative overflow-hidden rounded-xl border border-white/[0.07] p-4" style={{ background: 'rgba(255,255,255,0.04)' }}>
            <p className="popup-font-sans text-xs font-medium tracking-widest uppercase text-[#9690DC]/70">Hobi</p>
              
            <div className="absolute inset-0 pointer-events-none select-none">
              <span className="absolute zzz-anim-2 font-serif text-base text-[#B4AAFF]/60 bottom-1 left-2">z</span>
              <span className="absolute zzz-anim-1 font-serif text-lg text-[#9690DC]/70 top-8 left-3" style={{ animationDelay: '-0.5s' }}>zz</span>
              <span className="absolute zzz-anim-3 font-serif text-2xl font-semibold text-[#DCD7FF]/60 bottom-1 left-1/3">Z</span>
              <span className="absolute zzz-anim-2 font-serif text-xl text-[#B4AAFF]/50 bottom-2 right-4" style={{ animationDelay: '-1.5s' }}>Zz</span>
              <span className="absolute zzz-anim-1 font-serif text-sm italic text-[#9690DC]/80 top-2 left-1/2">zZ</span>
            </div>

            <p className="popup-font-sans mt-2 text-sm font-light neon-glow-turu text-[#DCD7FF]/85 leading-relaxed">Turu 24/7</p>
          </div>
            
          {/* UBAH FUNFACT KAMU */}
          <div className="rounded-xl border border-white/[0.07] p-4" style={{ background: 'rgba(255,255,255,0.04)' }}>
            <p className="popup-font-sans text-xs font-medium tracking-widest uppercase text-[#9690DC]/70">Fun Fact</p>
            <p className="popup-font-sans mt-2 text-sm font-light neon-glow-turu text-[#DCD7FF]/85 leading-relaxed">
              BHAAP APA YH, ini dah top 4:<br />
              - cinta kopsus tetangga tuku<br />
              - cinta kopsus kluarga famima<br />
              - cinta caramel macchiato point<br />
              - cinta bumi latte fore
            </p>
          </div>

        </div>

        {/* UBAH LAGU FAVORIT KAMU */}
        <div className="mt-4 rounded-xl border border-[#534AB7]/25 p-4" style={{ background: 'rgba(83,74,183,0.12)' }}>
          <p className="popup-font-sans text-xs font-medium tracking-widest uppercase text-[#9690DC]/70">Lagu Favorit</p>
          <p className="popup-font-sans mt-2 text-sm font-light neon-glow-turu text-[#DCD7FF]/85 leading-relaxed">Disillusioned [P.S. pokonya abang daniel]</p>
          <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/1gUyF1kls2Q5MkuAi9djjx?si=ba0c1b7a9498419c" />
        </div>

      </div>
    </div>,
    document.body
  )
}

export default MemberPopup
