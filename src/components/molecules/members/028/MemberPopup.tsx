'use client'

import React, { useEffect, useRef } from 'react'

import Image from 'next/image'

import { createPortal } from 'react-dom'

import Instagram from '@/components/atoms/button/InstagramButtonLink'
import LinkedInButtonLink from '@/components/atoms/button/LinkedInButtonLink'
import SpotifyEmbed from '@/components/molecules/SpotifyEmbed'

import ProfileImage from './foto webang 2.png'

type MemberPopupProps = {
  isOpen: boolean
  onClose: () => void
}

const animationStyles = `
  @keyframes orb1 {
    0%   { transform: translate(0, 0) scale(1); }
    20%  { transform: translate(80px, -60px) scale(1.2); }
    40%  { transform: translate(-40px, 80px) scale(0.85); }
    60%  { transform: translate(100px, 40px) scale(1.15); }
    80%  { transform: translate(-60px, -40px) scale(0.9); }
    100% { transform: translate(0, 0) scale(1); }
  }
  @keyframes orb2 {
    0%   { transform: translate(0, 0) scale(1); }
    25%  { transform: translate(-90px, 60px) scale(1.25); }
    50%  { transform: translate(60px, -80px) scale(0.8); }
    75%  { transform: translate(-50px, 100px) scale(1.1); }
    100% { transform: translate(0, 0) scale(1); }
  }
  @keyframes orb3 {
    0%   { transform: translate(0, 0) scale(1); }
    30%  { transform: translate(70px, 90px) scale(1.3); }
    60%  { transform: translate(-80px, -50px) scale(0.75); }
    100% { transform: translate(0, 0) scale(1); }
  }
  @keyframes orb4 {
    0%   { transform: translate(0, 0) scale(1); }
    35%  { transform: translate(-70px, -80px) scale(1.2); }
    70%  { transform: translate(90px, 60px) scale(0.85); }
    100% { transform: translate(0, 0) scale(1); }
  }
  @keyframes orb5 {
    0%   { transform: translate(0, 0) scale(1); }
    40%  { transform: translate(60px, -100px) scale(1.3); }
    80%  { transform: translate(-90px, 50px) scale(0.8); }
    100% { transform: translate(0, 0) scale(1); }
  }
  @keyframes ringRotate {
    from { transform: translate(-50%, -50%) rotate(0deg); }
    to   { transform: translate(-50%, -50%) rotate(360deg); }
  }
  @keyframes ringRotateReverse {
    from { transform: translate(-50%, -50%) rotate(0deg); }
    to   { transform: translate(-50%, -50%) rotate(-360deg); }
  }
  @keyframes orbPulse {
    0%, 100% { opacity: 0.55; }
    50%       { opacity: 1; }
  }
  @keyframes floatDot {
    0%   { transform: translateY(0) translateX(0); opacity: 0; }
    15%  { opacity: 1; }
    85%  { opacity: 0.8; }
    100% { transform: translateY(-160px) translateX(var(--dx, 0px)); opacity: 0; }
  }
  @keyframes member-popup-show {
    from { opacity: 0; transform: scale(0.95) translateY(8px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }
`

const MemberPopup = ({ isOpen, onClose }: MemberPopupProps) => {
  const dotsRef = useRef<HTMLDivElement>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  useEffect(() => {
    if (!isOpen || !dotsRef.current) return

    const container = dotsRef.current

    const spawnDot = () => {
      const dot = document.createElement('div')
      const size = Math.random() * 4 + 1.5
      const x = Math.random() * 100
      const dur = Math.random() * 3 + 3
      const delay = Math.random() * 0.5
      const dx = (Math.random() - 0.5) * 80
      const colors = ['80,160,255', '0,220,255', '100,200,255', '40,120,255']
      const c = colors[Math.floor(Math.random() * colors.length)]
      dot.style.cssText = `
        position: absolute;
        bottom: ${Math.random() * 20}%;
        left: ${x}%;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: rgba(${c}, ${Math.random() * 0.6 + 0.3});
        --dx: ${dx}px;
        animation: floatDot ${dur}s ${delay}s ease-out forwards;
        pointer-events: none;
      `
      container.appendChild(dot)
      setTimeout(() => dot.remove(), (dur + delay + 0.5) * 1000)
    }

    for (let i = 0; i < 20; i++) setTimeout(spawnDot, i * 80)
    intervalRef.current = setInterval(spawnDot, 150)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      container.innerHTML = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  return createPortal(
    // PADA BAGIAN INI KAMU BOLEH MENGUBAH STYLE SESUKA HATI KAMU, TAPI JANGAN UBAH STRUKTUR DAN FUNGSI DARI KODE INI AGAR FUNGSI POPUP TETAP BERJALAN DENGAN BAIK
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto px-4">
      <style dangerouslySetInnerHTML={{ __html: animationStyles }} />

      {/* Animated background */}
      <div className="absolute inset-0" style={{ background: '#010814' }}>
        <div
          style={{
            position: 'absolute',
            top: '-120px',
            left: '-100px',
            width: '480px',
            height: '480px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,120,255,0.65) 0%, transparent 60%)',
            animation: 'orb1 7s ease-in-out infinite',
            pointerEvents: 'none'
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '80px',
            right: '-120px',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,210,255,0.45) 0%, transparent 60%)',
            animation: 'orb2 9s ease-in-out infinite',
            pointerEvents: 'none'
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-100px',
            left: '10%',
            width: '440px',
            height: '440px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(20,80,255,0.55) 0%, transparent 60%)',
            animation: 'orb3 11s ease-in-out infinite',
            pointerEvents: 'none'
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '60px',
            right: '0',
            width: '280px',
            height: '280px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,180,255,0.4) 0%, transparent 60%)',
            animation: 'orb4 8s ease-in-out infinite',
            pointerEvents: 'none'
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '40%',
            left: '30%',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(80,160,255,0.3) 0%, transparent 65%)',
            animation: 'orb5 6s ease-in-out infinite',
            pointerEvents: 'none'
          }}
        />

        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '700px',
            height: '700px',
            marginTop: '-350px',
            marginLeft: '-350px',
            borderRadius: '50%',
            border: '1px solid rgba(0,140,255,0.08)',
            animation: 'ringRotate 20s linear infinite',
            pointerEvents: 'none'
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '-2px',
              left: '50%',
              width: '4px',
              height: '4px',
              borderRadius: '50%',
              background: 'rgba(0,200,255,0.8)',
              marginLeft: '-2px'
            }}
          />
        </div>
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '500px',
            height: '500px',
            marginTop: '-250px',
            marginLeft: '-250px',
            borderRadius: '50%',
            border: '1px solid rgba(0,100,255,0.07)',
            animation: 'ringRotateReverse 14s linear infinite',
            pointerEvents: 'none'
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '-2px',
              left: '50%',
              width: '3px',
              height: '3px',
              borderRadius: '50%',
              background: 'rgba(100,180,255,0.7)',
              marginLeft: '-1.5px'
            }}
          />
        </div>

        <div ref={dotsRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(1,8,20,0.25)' }} />
      </div>

      <button type="button" aria-label="Close member detail" onClick={onClose} className="absolute inset-0" />

      <div
        className="relative z-10 h-[100dvh] max-h-[100dvh] w-full max-w-[720px] overflow-y-auto overscroll-contain rounded-2xl p-6 text-white sm:p-8"
        style={{
          background: 'linear-gradient(160deg, rgba(10,25,70,0.97) 0%, rgba(6,16,48,0.99) 100%)',
          border: '1px solid rgba(50,130,255,0.45)',
          boxShadow:
            '0 0 60px rgba(0,100,255,0.3), 0 0 120px rgba(0,60,200,0.15), inset 0 1px 0 rgba(100,160,255,0.15)',
          animation: 'member-popup-show 200ms ease-out'
        }}
      >
        <button
          type="button"
          aria-label="Close member detail"
          onClick={onClose}
          className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full text-xl leading-none"
          style={{ border: '1px solid rgba(80,140,255,0.25)', background: 'rgba(30,80,200,0.15)', color: '#6090d0' }}
        >
          x
        </button>

        <div className="mb-5 overflow-hidden rounded-2xl" style={{ border: '1px solid rgba(50,120,255,0.3)' }}>
          <Image src={ProfileImage} alt="Profile Image" className="h-120 w-full object-cover object-center" />
        </div>

        <div className="pr-10">
          {/* UBAH NAMA ANDA */}
          <h2 className="text-2xl font-black" style={{ color: '#f0f6ff' }}>
            Danish Faeyza Rusmawan
          </h2>
          {/* UBAH NRP DAN ASAL */}
          <p className="mt-1 text-sm font-semibold" style={{ color: '#4a90ff' }}>
            5027251028 - Malang
          </p>
        </div>

        <div className="mt-5 flex gap-2">
          {/* UBAH USERNAME INSTAGRAM */}
          <Instagram username="faeyzaaar_" />
          {/* UBAH USERNAME LINKEDIN */}
          <LinkedInButtonLink username="danish-faeyza-r" />
        </div>

        <div className="mt-6 grid gap-4 text-sm font-semibold sm:grid-cols-2">
          <div
            className="rounded-xl p-4"
            style={{
              background: 'linear-gradient(140deg, rgba(8,20,60,0.9), rgba(10,28,80,0.8))',
              border: '1px solid rgba(50,120,255,0.3)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                position: 'absolute',
                bottom: '-14px',
                right: '-14px',
                width: '70px',
                height: '70px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(40,120,255,0.25), transparent 70%)'
              }}
            />
            {/* UBAH HOBI KAMU */}
            <p className="text-xs tracking-wide uppercase" style={{ color: '#3a80e0' }}>
              Hobi
            </p>
            <p className="mt-2" style={{ color: '#b0d0ff' }}>
              Olahraga
            </p>
          </div>
          <div
            className="rounded-xl p-4"
            style={{
              background: 'linear-gradient(140deg, rgba(201,130,8,0.2), rgba(120,70,0,0.3))',
              border: '1px solid rgba(255,160,20,0.4)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                position: 'absolute',
                bottom: '-14px',
                right: '-14px',
                width: '70px',
                height: '70px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(255,160,20,0.25), transparent 70%)'
              }}
            />
            {/* UBAH FUNFACT KAMU */}
            <p className="text-xs tracking-wide uppercase" style={{ color: '#e8a030' }}>
              Fun Fact
            </p>
            <p className="mt-2" style={{ color: '#ffd080' }}>
              Wong e baik poll iki
            </p>
          </div>
        </div>

        <div
          className="mt-4 rounded-xl p-4"
          style={{
            background: 'linear-gradient(140deg, rgba(0,60,20,0.5), rgba(0,40,15,0.6))',
            border: '1px solid rgba(29,185,84,0.35)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '-20px',
              right: '-20px',
              width: '90px',
              height: '90px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(29,185,84,0.2), transparent 70%)'
            }}
          />
          {/* UBAH LAGU FAVORIT KAMU */}
          <p className="text-xs font-bold tracking-wide uppercase" style={{ color: '#1DB954' }}>
            Lagu Favorit
          </p>
          <p className="my-2 text-sm font-semibold" style={{ color: '#80d898' }}>
            Work From Home
          </p>

          {/* UBAH URL SPOTIFY KAMU DENGAN LAGU FAVORIT MU */}
          <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/4tCtwWceOPWzenK2HAIJSb?si=4147f972475c4c40" />
        </div>
      </div>
    </div>,
    document.body
  )
}

export default MemberPopup
