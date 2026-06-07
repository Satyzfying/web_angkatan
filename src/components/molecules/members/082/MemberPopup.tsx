'use client'

import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'

import Instagram from '@/components/atoms/button/InstagramButtonLink'
import LinkedInButtonLink from '@/components/atoms/button/LinkedInButtonLink'
import SpotifyEmbed from '@/components/molecules/SpotifyEmbed'

import ProfileImage from './image.png'

type Step = 1 | 2

type MemberPopupProps = {
  isOpen: boolean
  onClose: () => void
}

const FLOWERS = ['🌸', '🌼', '🌺', '🌷']

// ─────────────────────────────────────────
// STEP 1 — KERTAS FLIP + KELINCI
// ─────────────────────────────────────────
function NotePage({ onNext }: { onNext: () => void }) {
  const [flipped, setFlipped] = useState(false)

  function handleFlip() {
    if (flipped) return
    setFlipped(true)
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #FBF2C0, #FFC8DD, #BDE0FE)',
        padding: '2rem',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');

        @keyframes noteSlideIn {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes readyFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes bunnyHop {
          0%   { transform: translateY(0px) scaleY(1) scaleX(1); }
          15%  { transform: translateY(-18px) scaleY(1.08) scaleX(0.93); }
          30%  { transform: translateY(0px) scaleY(0.92) scaleX(1.08); }
          40%  { transform: translateY(0px) scaleY(1) scaleX(1); }
          55%  { transform: translateY(-12px) scaleY(1.05) scaleX(0.95); }
          68%  { transform: translateY(0px) scaleY(0.95) scaleX(1.05); }
          75%  { transform: translateY(0px) scaleY(1) scaleX(1); }
          100% { transform: translateY(0px) scaleY(1) scaleX(1); }
        }
        @keyframes earWiggle {
          0%,100% { transform: rotate(0deg); }
          25%     { transform: rotate(-8deg); }
          75%     { transform: rotate(8deg); }
        }
        @keyframes tailBounce {
          0%,100% { transform: scale(1); }
          50%     { transform: scale(1.3); }
        }

        .note-scene {
          perspective: 900px;
          width: 280px;
          height: 340px;
          cursor: pointer;
          animation: noteSlideIn 0.55s cubic-bezier(.4,.2,.2,1) forwards;
          margin-bottom: 20px;
        }
        .note-flipper {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          transition: transform 0.7s cubic-bezier(.4,.2,.2,1);
        }
        .note-flipper.flipped {
          transform: rotateY(180deg);
        }
        .nface {
          position: absolute;
          inset: 0;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          border-radius: 18px;
          border: 1.5px solid #ffd6e7;
          background: white;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 24px rgba(224,90,138,0.13);
          -webkit-mask-image: radial-gradient(circle at 50% -1px, transparent 9px, black 9px);
          mask-image: radial-gradient(circle at 50% -1px, transparent 9px, black 9px);
          padding: 24px 20px;
        }
        .nface-back {
          transform: rotateY(180deg);
          background: linear-gradient(160deg, #fff0f8, #fffde7);
          border-color: #ffd6e7;
        }

        .bunny-wrap {
          animation: bunnyHop 1.6s ease-in-out infinite;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .ear-left  { animation: earWiggle 0.8s ease-in-out infinite; transform-origin: bottom center; }
        .ear-right { animation: earWiggle 0.8s ease-in-out 0.15s infinite; transform-origin: bottom center; }
        .bunny-tail { animation: tailBounce 0.8s ease-in-out infinite; }

        .note-title {
          font-family: 'Dancing Script', cursive;
          font-size: 32px;
          color: #d77fa6;
          text-align: center;
          line-height: 1.2;
          margin-bottom: 8px;
        }
        .note-subtitle {
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 2px;
          color: #c4a0b5;
          text-align: center;
          text-transform: uppercase;
          margin-bottom: 14px;
        }
        .note-hint {
          font-size: 10px;
          color: #e8a0c0;
          font-weight: 600;
          margin-top: 10px;
          letter-spacing: 0.5px;
        }

        .ready-wrap {
          animation: readyFadeIn 0.4s ease forwards;
          text-align: center;
          width: 100%;
          margin-top: 16px;
        }
        .ready-btn {
          padding: 11px 36px;
          border-radius: 999px;
          border: none;
          background: linear-gradient(135deg, #cce6fb, #ec81ad);
          color: #5a3045;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.2s;
        }
        .ready-btn:hover { transform: translateY(-2px) scale(1.04); }
      `}</style>

      <p style={{ color: '#d77fa6', fontSize: 13, fontWeight: 700, marginBottom: 16, letterSpacing: 0.5 }}>
        💌 You&apos;ve Got Mail!
      </p>

      <div className="note-scene" onClick={handleFlip}>
        <div className={`note-flipper${flipped ? ' flipped' : ''}`}>

          {/* DEPAN — kelinci lompat */}
          <div className="nface">
            <div className="note-title">
              Ilona&apos;s<br />Little Note
            </div>
            <div className="note-subtitle">✦-----------------------------------✦</div>

            {/* Kelinci SVG pixel art */}
            <div className="bunny-wrap">
              <svg width="90" height="100" viewBox="0 0 90 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Telinga kiri */}
                <g className="ear-left">
                  <rect x="24" y="4" width="10" height="26" rx="5" fill="#f9c8dc"/>
                  <rect x="26" y="7" width="6" height="18" rx="3" fill="#f48fb1"/>
                </g>
                {/* Telinga kanan */}
                <g className="ear-right">
                  <rect x="56" y="4" width="10" height="26" rx="5" fill="#f9c8dc"/>
                  <rect x="58" y="7" width="6" height="18" rx="3" fill="#f48fb1"/>
                </g>
                {/* Kepala */}
                <ellipse cx="45" cy="42" rx="22" ry="20" fill="#fde8f2"/>
                {/* Mata kiri */}
                <circle cx="37" cy="38" r="3.5" fill="#5a3045"/>
                <circle cx="38.2" cy="36.8" r="1.2" fill="white"/>
                {/* Mata kanan */}
                <circle cx="53" cy="38" r="3.5" fill="#5a3045"/>
                <circle cx="54.2" cy="36.8" r="1.2" fill="white"/>
                {/* Pipi */}
                <ellipse cx="36" cy="44" rx="5" ry="3" fill="#f9b8d4" opacity="0.6"/>
                <ellipse cx="54" cy="44" rx="5" ry="3" fill="#f9b8d4" opacity="0.6"/>
                {/* Hidung */}
                <ellipse cx="45" cy="44" rx="2.5" ry="2" fill="#f48fb1"/>
                {/* Mulut */}
                <path d="M42 47 Q45 50 48 47" stroke="#e07aab" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
                {/* Badan */}
                <ellipse cx="45" cy="70" rx="18" ry="16" fill="#fcedf4"/>
                {/* Kaki depan kiri */}
                <ellipse cx="31" cy="78" rx="7" ry="5" fill="#fac6d7"/>
                {/* Kaki depan kanan */}
                <ellipse cx="59" cy="78" rx="7" ry="5" fill="#fac6d7"/>
                {/* Kaki belakang kiri */}
                <ellipse cx="28" cy="84" rx="9" ry="5" fill="#fac6d7"/>
                {/* Kaki belakang kanan */}
                <ellipse cx="62" cy="84" rx="9" ry="5" fill="#fac6d7"/>
                {/* Ekor */}
                <g className="bunny-tail">
                  <circle cx="63" cy="66" r="6" fill="white"/>
                </g>
              </svg>
            </div>

            <p className="note-hint">✦ klik untuk buka ✦</p>
          </div>

          {/* BELAKANG — are you ready */}
          <div className="nface nface-back">
            <div style={{ fontSize: 36, marginBottom: 12 }}>🌷</div>
            <p style={{
              fontFamily: "'Palatino Linotype', Palatino, serif",
              fontSize: 15,
              color: '#d77fa6',
              textAlign: 'center',
              lineHeight: 1.3,
              marginBottom: 8,
            }}>
              Welcome to my little corner<br />How's your day going?<br />Are you ready to get to know me?
            </p>
            <p style={{ fontSize: 11, color: '#c4a0b5', marginBottom: 20, textAlign: 'center' }}>
              ✦ ✦ ✦
            </p>
            <div className="ready-wrap">
              <button className="ready-btn" onClick={(e) => { e.stopPropagation(); onNext(); }}>
                Ready ✨
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────
// STEP 2 — POPUP PROFILE
// ─────────────────────────────────────────
function MemberPopupContent({ onClose }: { onClose: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  useEffect(() => {
    if (!overlayRef.current) return
    const overlay = overlayRef.current
    const petals: HTMLDivElement[] = []
    for (let i = 0; i < 18; i++) {
      const el = document.createElement('div')
      const size = 12 + Math.random() * 16
      const left = Math.random() * 100
      const delay = Math.random() * 5
      const dur = 4 + Math.random() * 4
      el.textContent = FLOWERS[Math.floor(Math.random() * FLOWERS.length)]
      el.style.cssText = `
        position:absolute;left:${left}%;top:-30px;
        font-size:${size}px;opacity:0;pointer-events:none;z-index:1;
        animation:coqFall ${dur}s linear ${delay}s infinite;
      `
      overlay.appendChild(el)
      petals.push(el)
    }
    return () => petals.forEach(p => p.remove())
  }, [])

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto px-4 bg-black/60 backdrop-blur-sm"
    >
      <style>{`
        @keyframes coqFall {
          0%   { transform:translateY(-30px) rotate(0deg); opacity:0; }
          10%  { opacity:1; }
          90%  { opacity:0.8; }
          100% { transform:translateY(110vh) rotate(360deg); opacity:0; }
        }
        @keyframes coqTwinkle {
          0%,100% { opacity:1; transform:scale(1); }
          50%     { opacity:0.3; transform:scale(0.7); }
        }
        .profile-frame {
          position:relative; padding:4px;
          border-radius:24px; overflow:hidden; margin-bottom:1.25rem;
        }
        .profile-frame::before {
          content:""; position:absolute; inset:-50%;
          background:conic-gradient(#ffe58f,#ffd6e7,#bde0fe,#ffb3cc,#ffe58f);
          animation:spinBorder 4s linear infinite;
        }
        @keyframes spinBorder {
          from { transform:rotate(0deg); }
          to   { transform:rotate(360deg); }
        }
        .profile-inner {
          position:relative; z-index:2; overflow:hidden;
          border-radius:20px; background:white;
        }
        .social-wrapper {
          padding:4px; border-radius:999px;
          background:linear-gradient(135deg,#ffe58f,#ffd6e7,#bde0fe);
          box-shadow:0 0 12px rgba(255,214,231,.4); transition:.3s;
        }
        .social-wrapper:hover { transform:translateY(-2px) scale(1.05); }
        .coq-card {
          position:relative;
          background: #eef7fe;
          border:5px solid #bdeefe; border-radius:18px; overflow:hidden;
        }
        .coq-card::before {
          content:""; position:absolute; inset:4px;
          border:3px dashed #bdeefe; border-radius:14px; pointer-events:none;
        }
      `}</style>

      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 z-[1]"
        style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
      />

      <div
        className="relative z-10 my-8 w-full max-w-[720px] overflow-y-auto rounded-2xl p-6 shadow-xl sm:p-8"
        style={{
          background: 'linear-gradient(160deg,#bde0fe 0%,#ffd6e7 60%,#ffb3cc 100%)',
          border: '2px solid #90c8f5',
          color: '#5a3045',
        }}
      >
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full text-xl"
          style={{ border: '1.5px solid #90c8f5', background: 'rgba(189,224,254,0.5)', color: '#3a7bbf' }}
        >
          ✕
        </button>

        <div className="profile-frame">
          <div className="profile-inner">
            <Image src={ProfileImage} alt="Profile Image" className="h-120 w-full object-cover object-center" />
          </div>
        </div>

        <div className="pr-10">
          <h2 className="text-2xl font-black" style={{ color: '#1a5fa8' }}>Fiorellin Ilona</h2>
          <p className="mt-1 text-sm font-semibold" style={{ color: '#5a8fc4' }}>5027251082 - Surabaya</p>
        </div>

        <div className="mt-5 flex gap-3">
          <div className="social-wrapper"><Instagram username="llonaalin" /></div>
          <div className="social-wrapper"><LinkedInButtonLink username="fiorellin-ilona-27aa62343" /></div>
        </div>

        <div className="flex items-center gap-2 my-4">
          <div style={{ flex: 1, height: 1, background: '#fd9fda' }} />
          <span style={{ fontSize: 17 }}>🌸</span>
          <div style={{ flex: 1, height: 1, background: '#fd9fda' }} />
        </div>

        <div className="grid gap-4 text-sm font-semibold sm:grid-cols-2">
          <div className="coq-card p-4">
            <p className="text-xs tracking-wide uppercase" style={{ color: '#3a7bbf' }}>🌼 Hobi</p>
            <p className="mt-2" style={{ color: '#1a3a5c' }}>Ngoding</p>
          </div>
          <div className="coq-card p-4">
            <p className="text-xs tracking-wide uppercase" style={{ color: '#3a7bbf' }}>🌼 Fun Fact</p>
            <p className="mt-2" style={{ color: '#1a3a5c' }}>Gasuka Matcha, Banyak yang bilang aku mirip jisoo blackpink (sepakat)</p>
          </div>
        </div>

        <div className="flex items-center gap-2 my-4">
          <div style={{ flex: 1, height: 1, background: '#fd9fda' }} />
          <span style={{ fontSize: 17 }}>🌸</span>
          <div style={{ flex: 1, height: 1, background: '#fd9fda' }} />
        </div>

        <div className="coq-card p-4">
          <p className="text-xs font-bold tracking-wide uppercase" style={{ color: '#3a7bbf' }}>🌼 Lagu Favorit</p>
          <p className="my-2 text-sm font-semibold" style={{ color: '#1a3a5c' }}>Begini Begitu</p>
          <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/4yTEKXWBDWoazJWrjii0Hk?si=_4_Cf81fTayf1AtP62Z1Mg" />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 18, flexWrap: 'wrap' }}>
          {[
            { icon: '✦', size: 18, delay: '0s',   color: '#90c8f5' },
            { icon: '✧', size: 13, delay: '0.2s', color: '#ffb3cc' },
            { icon: '★', size: 20, delay: '0.4s', color: '#bde0fe' },
            { icon: '✦', size: 13, delay: '0.6s', color: '#90c8f5' },
            { icon: '🌸', size: 16, delay: '0.1s', color: '#ffb3cc' },
            { icon: '✧', size: 13, delay: '0.5s', color: '#90c8f5' },
            { icon: '★', size: 20, delay: '0.3s', color: '#bde0fe' },
            { icon: '✦', size: 13, delay: '0.7s', color: '#ffb3cc' },
            { icon: '✧', size: 18, delay: '0.9s', color: '#90c8f5' },
          ].map((sp, i) => (
            <span
              key={i}
              aria-hidden="true"
              style={{
                display: 'inline-block',
                fontSize: sp.size,
                color: sp.color,
                animation: `coqTwinkle 1.6s ease-in-out ${sp.delay} infinite`,
              }}
            >
              {sp.icon}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────
const MemberPopup = ({ isOpen, onClose }: MemberPopupProps) => {
  const [mounted, setMounted] = useState(false)
  const [step, setStep] = useState<Step>(1)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (isOpen) setStep(1)
  }, [isOpen])

  if (!mounted || !isOpen) return null

  return createPortal(
    <>
      {step === 1 && <NotePage onNext={() => setStep(2)} />}
      {step === 2 && <MemberPopupContent onClose={onClose} />}
    </>,
    document.body
  )
}

export default MemberPopup