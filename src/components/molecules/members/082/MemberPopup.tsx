'use client'

import React, { useEffect, useRef, useState } from 'react'
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

const FLOWERS = ['🌸', '🌼', '🌺', '🌷']

const MemberPopup = ({ isOpen, onClose }: MemberPopupProps) => {
  const [mounted, setMounted] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

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
    if (!isOpen || !overlayRef.current) return
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
        position: absolute;
        left: ${left}%;
        top: -30px;
        font-size: ${size}px;
        opacity: 0;
        pointer-events: none;
        z-index: 1;
        animation: coqFall ${dur}s linear ${delay}s infinite;
      `
      overlay.appendChild(el)
      petals.push(el)
    }

    return () => {
      petals.forEach(p => p.remove())
    }
  }, [isOpen])

  if (!mounted || !isOpen) return null

  return createPortal(
    <>
      <style>{`
        @keyframes coqFall {
          0%   { transform: translateY(-30px) rotate(0deg); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 0.8; }
          100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
        }
        @keyframes coqTwinkle {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.3; transform: scale(0.7); }
        }
      `}</style>

      <div
        ref={overlayRef}
        className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto px-4 bg-black/60 backdrop-blur-sm"
      >
        <button
          type="button"
          aria-label="Close member detail"
          onClick={onClose}
          className="absolute inset-0 z-[1]"
          style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
        />

        <div
          className="relative z-10 max-h-[100dvh] w-full max-w-[720px] animate-[member-popup-show_200ms_ease-out] overflow-y-auto rounded-2xl p-6 shadow-xl sm:p-8"
          style={{
            background: 'linear-gradient(160deg, #bde0fe 0%, #ffd6e7 60%, #ffb3cc 100%)',
            border: '2px solid #90c8f5',
            color: '#5a3045',
          }}
        >
          <button
            type="button"
            aria-label="Close member detail"
            onClick={onClose}
            className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full text-xl leading-none"
            style={{ border: '1.5px solid #90c8f5', background: 'rgba(189,224,254,0.5)', color: '#3a7bbf' }}
          >
            ✕
          </button>

          <div
            className="mb-5 overflow-hidden rounded-2xl"
            style={{ border: '2px solid #90c8f5' }}
          >
            <Image src={ProfileImage} alt="Profile Image" className="h-120 w-full object-cover object-center" />
          </div>

          <div className="pr-10">
            <h2 className="text-2xl font-black" style={{ color: '#1a5fa8' }}>Fiorellin Ilona</h2>
            <p className="mt-1 text-sm font-semibold" style={{ color: '#5a8fc4' }}>5027251082 - Surabaya</p>
          </div>

          <div className="mt-5 flex gap-2">
            <Instagram username="llonaalin" />
            <LinkedInButtonLink username="fiorellin-ilona-27aa62343" />
          </div>

          <div className="flex items-center gap-2 my-4">
            <div style={{ flex: 1, height: 1, background: '#90c8f5' }} />
            <span style={{ fontSize: 17 }}>🌸</span>
            <div style={{ flex: 1, height: 1, background: '#90c8f5' }} />
          </div>

          <div className="grid gap-4 text-sm font-semibold sm:grid-cols-2">
            <div className="rounded-xl p-4" style={{ background: 'rgba(189,224,254,0.35)', border: '1.5px solid #90c8f5' }}>
              <p className="text-xs tracking-wide uppercase" style={{ color: '#3a7bbf' }}>🌼 Hobi</p>
              <p className="mt-2" style={{ color: '#1a3a5c' }}>Ngoding</p>
            </div>
            <div className="rounded-xl p-4" style={{ background: 'rgba(189,224,254,0.35)', border: '1.5px solid #90c8f5' }}>
              <p className="text-xs tracking-wide uppercase" style={{ color: '#3a7bbf' }}>🌼 Fun Fact</p>
              <p className="mt-2" style={{ color: '#1a3a5c' }}>Gasuka Matcha, maaf ya kayak rumput</p>
            </div>
          </div>

          <div className="flex items-center gap-2 my-4">
            <div style={{ flex: 1, height: 1, background: '#90c8f5' }} />
            <span style={{ fontSize: 17 }}>🌸</span>
            <div style={{ flex: 1, height: 1, background: '#90c8f5' }} />
          </div>

          <div className="rounded-xl p-4" style={{ background: 'rgba(189,224,254,0.35)', border: '1.5px solid #90c8f5' }}>
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
    </>,
    document.body
  )
}

export default MemberPopup