'use client'

import React, { useEffect, useState, useCallback, memo, useRef } from 'react'
import { createPortal } from 'react-dom'
import localFont from 'next/font/local'
import Image from 'next/image'

import Instagram from '@/components/atoms/button/InstagramButtonLink'
import LinkedInButtonLink from '@/components/atoms/button/LinkedInButtonLink'
import SpotifyEmbed from '@/components/molecules/SpotifyEmbed'

import ProfileImage from './image.png'
import CastleImage from './castle.webp'
import RitualGif from './fog.gif'
import ChantFog from './chant_fog.gif'
import FoolLogo from './fool_logo_fix.png'
import CardBg from './card_bg.jpg'

// FONTS


const cinzelDecorative = localFont({
  src: './fonts/CinzelDecorative-Regular.ttf',
  variable: '--font-cinzel-decorative',
  display: 'swap',
})

const imFellEnglish = localFont({
  src: './fonts/IMFellEnglish-Regular.ttf',
  variable: '--font-im-fell-english',
  display: 'swap',
})

const cormorantGaramond = localFont({
  src: './fonts/CormorantGaramond-Regular.ttf',
  variable: '--font-cormorant-garamond',
  display: 'swap',
})

// ============================================================================
// CONSTANTS & TYPES
// ============================================================================

const PHASE_TIMINGS = {
  intro: -1,
  chant: 4500,
  preGif: 800,
  gif: 4200,
  logo: 3300,
} as const

const PHASE_SEQUENCE: PopupPhase[] = ['chant', 'preGif', 'gif', 'logo', 'profile']

const CHANT_LINES = [
  "The Fool that doesn't belong to this era;",
  'The Mysterious Ruler above the gray fog;',
  'The King of Yellow and Black who wields good luck.',
]

const CHANT_DELAYS = ['0.18s', '1.00s', '1.98s']

const COSMIC_PARTICLES = [
  { left: '7%', top: '14%', size: '2px', delay: '0s', duration: '7s' },
  { left: '14%', top: '68%', size: '3px', delay: '1.1s', duration: '9s' },
  { left: '23%', top: '24%', size: '2px', delay: '2.4s', duration: '8s' },
  { left: '31%', top: '82%', size: '2px', delay: '0.8s', duration: '10s' },
  { left: '39%', top: '12%', size: '3px', delay: '1.7s', duration: '8.5s' },
  { left: '46%', top: '54%', size: '2px', delay: '2.9s', duration: '11s' },
  { left: '57%', top: '18%', size: '2px', delay: '0.4s', duration: '9.5s' },
  { left: '63%', top: '74%', size: '3px', delay: '1.9s', duration: '8.8s' },
  { left: '72%', top: '31%', size: '2px', delay: '3.2s', duration: '10.5s' },
  { left: '81%', top: '59%', size: '2px', delay: '1.3s', duration: '7.8s' },
  { left: '89%', top: '19%', size: '3px', delay: '2.1s', duration: '9.8s' },
  { left: '92%', top: '81%', size: '2px', delay: '0.7s', duration: '8.2s' },
] as const

type PopupPhase = 'intro' | 'chant' | 'preGif' | 'gif' | 'logo' | 'profile'

type MemberPopupProps = {
  isOpen: boolean
  onClose: () => void
}

const RITUAL_AUDIO_URL =
  'https://res.cloudinary.com/dtieforw6/video/upload/v1780815961/vsw_dbwqbv.mp4'

const preloadImage = (src: string) => {
  if (typeof window === 'undefined') return

  const image = new window.Image()
  image.src = src
}

const createRitualAudio = () => {
  if (typeof window === 'undefined') return null

  const audio = new Audio(RITUAL_AUDIO_URL)

  audio.preload = 'auto'
  audio.loop = true
  audio.volume = 0

  return audio
}

const fadeInAudio = (audio: HTMLAudioElement, targetVolume = 0.28) => {
  let currentVolume = 0

  audio.volume = currentVolume

  const intervalId = window.setInterval(() => {
    currentVolume = Math.min(currentVolume + 0.02, targetVolume)
    audio.volume = currentVolume

    if (currentVolume >= targetVolume) {
      window.clearInterval(intervalId)
    }
  }, 80)

  return intervalId
}

const fadeOutAudio = (audio: HTMLAudioElement, onComplete?: () => void) => {
  const intervalId = window.setInterval(() => {
    audio.volume = Math.max(audio.volume - 0.04, 0)

    if (audio.volume <= 0) {
      window.clearInterval(intervalId)
      audio.pause()
      audio.currentTime = 0
      onComplete?.()
    }
  }, 60)

  return intervalId
}

// ============================================================================
// STYLES CONSTANT
// ============================================================================

const POPUP_STYLES = `
.hobby-link {
  position: relative;
  display: inline-block;
  color: #B8C7E6;
  text-decoration: none;
  font-weight: 700;
  transition: color 220ms ease, text-shadow 220ms ease, transform 220ms ease;
}

.hobby-link::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0.02em;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(142, 172, 226, 0.72), rgba(216, 199, 163, 0.42), transparent);
  opacity: 0.28;
  transform: scaleX(0.55);
  transform-origin: center;
  transition: opacity 220ms ease, transform 220ms ease;
}

.hobby-link:hover, .hobby-link:focus-visible {
  color: #E6EEFf;
  text-shadow: 0 0 8px rgba(123, 158, 220, 0.62), 0 0 18px rgba(72, 112, 190, 0.42), 0 0 28px rgba(176, 141, 87, 0.18);
  transform: translateY(-1px);
}

.hobby-link:hover::after, .hobby-link:focus-visible::after {
  opacity: 1;
  transform: scaleX(1);
}

.hobby-link:focus-visible {
  outline: 1px solid rgba(142, 172, 226, 0.42);
  outline-offset: 3px;
  border-radius: 0.25rem;
}

.cosmic-glass-box :is(a, button) {
  position: relative;
  z-index: 20;
  filter: drop-shadow(0 0 6px rgba(73, 110, 180, 0.10));
}

.cosmic-glass-box {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  border-radius: 1.25rem;
  border: 1px solid rgba(102, 130, 184, 0.14);
  background: radial-gradient(circle at 18% 16%, rgba(34, 69, 122, 0.13), transparent 34%), radial-gradient(circle at 82% 78%, rgba(12, 27, 61, 0.14), transparent 38%), linear-gradient(180deg, rgba(5, 11, 26, 0.34), rgba(3, 7, 18, 0.26));
  backdrop-filter: blur(12px) saturate(116%);
  -webkit-backdrop-filter: blur(12px) saturate(116%);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.016), inset 0 0 30px rgba(0, 0, 0, 0.22), 0 0 20px rgba(18, 42, 86, 0.08);
}

.cosmic-glass-box::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background-image: radial-gradient(circle at 12% 24%, rgba(224, 235, 255, 0.18) 0 1px, transparent 1.7px), radial-gradient(circle at 28% 76%, rgba(130, 158, 214, 0.13) 0 1px, transparent 1.8px), radial-gradient(circle at 48% 32%, rgba(255, 255, 255, 0.11) 0 1px, transparent 1.7px), radial-gradient(circle at 73% 62%, rgba(111, 145, 205, 0.12) 0 1px, transparent 1.8px), radial-gradient(circle at 88% 28%, rgba(176, 141, 87, 0.08) 0 1px, transparent 1.8px);
  opacity: 0.38;
}

.cosmic-glass-box::after {
  content: "";
  position: absolute;
  inset: 8px;
  z-index: 1;
  pointer-events: none;
  border-radius: 0.95rem;
  border: 1px solid rgba(112, 140, 196, 0.055);
  box-shadow: inset 0 0 18px rgba(71, 102, 164, 0.025);
}

.cosmic-glass-box > * {
  position: relative;
  z-index: 2;
}

.cosmic-image-frame {
  position: relative;
  overflow: hidden;
  border-radius: 0.95rem;
  border: 1px solid rgba(115, 145, 204, 0.12);
  box-shadow: inset 0 0 26px rgba(0, 0, 0, 0.24), 0 0 18px rgba(20, 45, 88, 0.08);
}

.member-popup-card {
  font-family: var(--font-cormorant-garamond), Georgia, "Times New Roman", serif;
}

.font-ancient-title {
  font-family: var(--font-cinzel-decorative), Georgia, "Times New Roman", serif;
}

.font-ancient-label {
  font-family: var(--font-cinzel-decorative), Georgia, "Times New Roman", serif;
}

.font-ritual-chant {
  font-family: var(--font-im-fell-english), Georgia, "Times New Roman", serif;
}

.font-victorian-body {
  font-family: var(--font-cormorant-garamond), Georgia, "Times New Roman", serif;
}

.member-popup-card::before {
  content: "";
  pointer-events: none;
  position: absolute;
  inset: 0;
  z-index: 1;
  opacity: 0.12;
  background-image: radial-gradient(circle at 20% 30%, rgba(216, 199, 163, 0.16) 0 1px, transparent 1px), radial-gradient(circle at 80% 70%, rgba(180, 180, 180, 0.12) 0 1px, transparent 1px), repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.02) 0px, rgba(255, 255, 255, 0.02) 1px, transparent 1px, transparent 4px);
  background-size: 90px 90px, 130px 130px, 100% 5px;
}

.member-popup-card::after {
  content: "";
  pointer-events: none;
  position: absolute;
  inset: 0;
  z-index: 2;
  background: radial-gradient(circle at center, transparent 0%, rgba(7, 10, 15, 0.14) 44%, rgba(7, 10, 15, 0.84) 100%);
}

@keyframes card-enter { 0% { opacity: 0; transform: translateY(18px) scale(0.98); filter: blur(8px); } 100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); } }
@keyframes mist-drift { 0% { transform: translate3d(-9%, 0, 0) scale(1); opacity: 0.16; } 50% { opacity: 0.34; } 100% { transform: translate3d(9%, -4%, 0) scale(1.08); opacity: 0.2; } }
@keyframes particle-float { 0% { transform: translate3d(0, 0, 0) scale(1); opacity: 0.18; } 35% { opacity: 0.72; } 70% { transform: translate3d(10px, -16px, 0) scale(1.25); opacity: 0.44; } 100% { transform: translate3d(-6px, -28px, 0) scale(0.9); opacity: 0.2; } }
@keyframes castle-tremor { 0%, 100% { transform: translate3d(0, 0, 0) scale(1.045); filter: grayscale(22%) sepia(16%) blur(0.8px); } 15% { transform: translate3d(-2px, 1px, 0) scale(1.047); } 30% { transform: translate3d(2px, -1px, 0) scale(1.05); } 45% { transform: translate3d(-3px, 2px, 0) scale(1.046); } 60% { transform: translate3d(3px, 0, 0) scale(1.05); } 75% { transform: translate3d(-1px, -2px, 0) scale(1.047); } 90% { transform: translate3d(2px, 2px, 0) scale(1.049); } }
@keyframes castle-pulse { 0%, 100% { opacity: 0.26; } 20% { opacity: 0.42; } 40% { opacity: 0.3; } 60% { opacity: 0.5; } 80% { opacity: 0.34; } }
@keyframes chant-line-fog-reveal { 0% { opacity: 0; filter: blur(12px); letter-spacing: 0.04em; text-shadow: 0 0 18px rgba(180, 180, 180, 0.22), 0 0 28px rgba(180, 180, 180, 0.18); } 45% { opacity: 0.42; filter: blur(7px); letter-spacing: 0.03em; } 78% { opacity: 0.88; filter: blur(2px); letter-spacing: 0.015em; } 100% { opacity: 1; filter: blur(0); letter-spacing: 0.01em; text-shadow: 0 0 10px rgba(216, 199, 163, 0.3), 0 0 22px rgba(176, 141, 87, 0.16); } }
@keyframes chant-fog-breathe { 0%, 100% { opacity: 0.22; } 50% { opacity: 0.36; } }
@keyframes pre-gif-blur { 0% { opacity: 1; transform: scale(1); filter: blur(0px) brightness(1); } 100% { opacity: 0.96; transform: scale(1.03); filter: blur(14px) brightness(0.72); } }
@keyframes gif-reveal { 0% { opacity: 0; transform: scale(1.02); filter: blur(12px); } 18% { opacity: 1; filter: blur(0); } 82% { opacity: 1; filter: blur(0); } 100% { opacity: 0; transform: scale(1.08); filter: blur(8px); } }
@keyframes fool-logo-reveal { 0% { opacity: 0; clip-path: inset(0 0 100% 0); } 70% { opacity: 1; clip-path: inset(0 0 0 0); } 100% { opacity: 1; clip-path: inset(0 0 0 0); } }
@keyframes fool-logo-rise { 0% { opacity: 1; transform: translate3d(0, 0, 0) scale(1); } 100% { opacity: 0; transform: translate3d(0, -320px, 0) scale(0.9); } }
@keyframes profile-enter { 0% { opacity: 0; transform: translateY(24px) scale(0.987); filter: blur(10px); } 100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); } }

.fool-logo-stage {
  will-change: transform, opacity;
  animation: fool-logo-rise 1.05s cubic-bezier(0.22, 1, 0.36, 1) 2s forwards;
}

.fool-logo-pure {
  position: relative;
  z-index: 2;
  display: block;
  background: transparent;
  opacity: 0;
  will-change: opacity, clip-path;
  animation: fool-logo-reveal 1.1s ease-out forwards;
  filter: drop-shadow(0 0 18px rgba(176, 141, 87, 0.24));
}

.fool-logo-masked-shine {
  position: absolute;
  inset: 0;
  z-index: 3;
  pointer-events: none;
  opacity: 0;
  background: linear-gradient(180deg, transparent 0%, rgba(216, 199, 163, 0.08) 34%, rgba(216, 199, 163, 0.72) 50%, rgba(176, 141, 87, 0.12) 62%, transparent 100%);
  mask-image: var(--fool-logo-mask);
  mask-size: contain;
  mask-repeat: no-repeat;
  mask-position: center;
  -webkit-mask-image: var(--fool-logo-mask);
  -webkit-mask-size: contain;
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;
  mix-blend-mode: screen;
  will-change: transform, opacity;
}

.cosmic-particle {
  position: absolute;
  border-radius: 9999px;
  background: rgba(216, 199, 163, 0.95);
  box-shadow: 0 0 12px rgba(216, 199, 163, 0.75);
  animation-name: particle-float;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
  animation-direction: alternate;
}

.occult-corner {
  position: absolute;
  width: 34px;
  height: 34px;
  z-index: 4;
  pointer-events: none;
  opacity: 0.58;
}

.occult-corner::before, .occult-corner::after {
  content: "";
  position: absolute;
  background: rgba(176, 141, 87, 0.62);
  box-shadow: 0 0 14px rgba(176, 141, 87, 0.14);
}

.occult-corner::before { width: 100%; height: 1px; }
.occult-corner::after { width: 1px; height: 100%; }

.corner-tl { left: 18px; top: 18px; }
.corner-tr { right: 18px; top: 18px; transform: rotate(90deg); }
.corner-bl { left: 18px; bottom: 18px; transform: rotate(-90deg); }
.corner-br { right: 18px; bottom: 18px; transform: rotate(180deg); }

.chant-block {
  width: min(100%, 650px);
  min-height: 210px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  text-align: center;
}

.chant-line {
  opacity: 0;
  margin: 0;
  will-change: opacity, filter;
  animation: chant-line-fog-reveal 0.8s ease-out forwards;
}

`

// ============================================================================
// REUSABLE SUB-COMPONENTS
// ============================================================================

const CosmicParticles = memo(() => (
  <>
    {COSMIC_PARTICLES.map((particle, index) => (
      <span
        key={`particle-${index}`}
        className="cosmic-particle"
        style={{
          left: particle.left,
          top: particle.top,
          width: particle.size,
          height: particle.size,
          animationDelay: particle.delay,
          animationDuration: particle.duration,
        }}
      />
    ))}
  </>
))

CosmicParticles.displayName = 'CosmicParticles'

const OccultCorners = memo(() => (
  <>
    <span className="occult-corner corner-tl" />
    <span className="occult-corner corner-tr" />
    <span className="occult-corner corner-bl" />
    <span className="occult-corner corner-br" />
  </>
))

OccultCorners.displayName = 'OccultCorners'

const FogCursorTrail = memo(({ enabled }: { enabled: boolean }) => {
  useEffect(() => {
    if (!enabled) return
    if (typeof window === 'undefined') return
    if (typeof document === 'undefined') return

    if (window.matchMedia('(pointer: coarse)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const styleId = 'fog-cursor-style'
    const layerId = 'fog-cursor-layer'

    let styleTag = document.getElementById(styleId) as HTMLStyleElement | null

    if (!styleTag) {
      styleTag = document.createElement('style')
      styleTag.id = styleId
      styleTag.textContent = `
        #${layerId} {
          position: fixed;
          inset: 0;
          z-index: 2147483647;
          pointer-events: none;
          overflow: hidden;
        }

        .fog-cursor-puff {
          position: fixed;
          left: 0;
          top: 0;
          width: var(--fog-size);
          height: var(--fog-size);
          border-radius: 9999px;
          pointer-events: none;
          background:
            radial-gradient(
              circle,
              rgba(216, 199, 163, 0.52) 0%,
              rgba(180, 180, 180, 0.34) 34%,
              rgba(78, 107, 90, 0.18) 58%,
              transparent 78%
            );
          filter: blur(8px);
          opacity: 0;
          transform:
            translate3d(var(--fog-x), var(--fog-y), 0)
            translate(-50%, -50%)
            scale(0.45);
          animation: fog-cursor-dissolve 900ms ease-out forwards;
          will-change: transform, opacity, filter;
        }

        @keyframes fog-cursor-dissolve {
          0% {
            opacity: 0;
            transform:
              translate3d(var(--fog-x), var(--fog-y), 0)
              translate(-50%, -50%)
              scale(0.35);
            filter: blur(4px);
          }

          20% {
            opacity: 0.85;
          }

          100% {
            opacity: 0;
            transform:
              translate3d(var(--fog-x), var(--fog-y), 0)
              translate(
                calc(-50% + var(--fog-dx)),
                calc(-50% + var(--fog-dy))
              )
              scale(2.7);
            filter: blur(16px);
          }
        }
      `

      document.head.appendChild(styleTag)
    }

    const oldLayer = document.getElementById(layerId)
    oldLayer?.remove()

    const layer = document.createElement('div')
    layer.id = layerId
    layer.setAttribute('aria-hidden', 'true')
    document.body.appendChild(layer)

    let lastSpawnTime = 0

    const spawnFog = (event: MouseEvent) => {
      const now = performance.now()

      if (now - lastSpawnTime < 80) return

      lastSpawnTime = now

      const puff = document.createElement('span')

      const size = 26 + Math.random() * 36
      const driftX = (Math.random() * 2 - 1) * 28
      const driftY = -16 - Math.random() * 24

      puff.className = 'fog-cursor-puff'
      puff.style.setProperty('--fog-size', `${size}px`)
      puff.style.setProperty('--fog-x', `${event.clientX}px`)
      puff.style.setProperty('--fog-y', `${event.clientY}px`)
      puff.style.setProperty('--fog-dx', `${driftX}px`)
      puff.style.setProperty('--fog-dy', `${driftY}px`)

      layer.appendChild(puff)

      puff.addEventListener(
        'animationend',
        () => {
          puff.remove()
        },
        { once: true }
      )
    }

    document.addEventListener('mousemove', spawnFog, { passive: true })

    return () => {
      document.removeEventListener('mousemove', spawnFog)
      layer.remove()
    }
  }, [enabled])

  return null
})

FogCursorTrail.displayName = 'FogCursorTrail'

const CastleBackground = memo(({ animated = false }: { animated?: boolean }) => {
  const pulseAnimation = animated
    ? 'castle-pulse 1.85s ease-in-out infinite'
    : undefined

  return (
    <div
      className="absolute inset-0 bg-cover grayscale-[26%] sepia-[16%]"
      style={{
        backgroundImage: `url(${CastleImage.src})`,
        backgroundPosition: '56% center',
        animation: pulseAnimation,
      }}
    />
  )
})

CastleBackground.displayName = 'CastleBackground'

const ChantLineText = memo(({ text, delay }: { text: string; delay: string }) => (
  <p className="chant-line" style={{ animationDelay: delay }}>
    {text}
  </p>
))

ChantLineText.displayName = 'ChantLineText'

// ============================================================================
// PHASE COMPONENTS
// ============================================================================

const IntroPhase = memo(({ onNext }: { onNext: () => void }) => (
  <div className="relative z-10 flex min-h-[620px] items-center justify-center overflow-hidden p-6 text-center sm:p-8">
    <div
      className="absolute inset-0 bg-cover opacity-[0.5] grayscale-[24%] sepia-[16%] saturate-[0.82]"
      style={{
        backgroundImage: `url(${CastleImage.src})`,
        backgroundPosition: '56% center',
      }}
    />

    <div className="absolute inset-0 bg-[#070A0F]/46" />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(7,10,15,0.04)_0%,rgba(7,10,15,0.2)_42%,rgba(7,10,15,0.9)_100%)]" />
    <div className="absolute left-[-18%] top-[18%] h-44 w-[140%] bg-gradient-to-r from-transparent via-[rgba(180,180,180,0.2)] to-transparent blur-3xl animate-[mist-drift_8s_ease-in-out_infinite_alternate]" />
    <div className="absolute bottom-[4%] right-[-20%] h-56 w-[125%] bg-gradient-to-r from-transparent via-[#4E6B5A]/20 to-transparent blur-3xl animate-[mist-drift_11s_ease-in-out_infinite_alternate]" />

    <CosmicParticles />

    <div className="relative z-10 max-w-[560px]">
      <p className="font-ancient-label mb-5 text-[10px] tracking-[0.34em] text-[#B08D57]">
        SEALED INQUIRY
      </p>

      <h2 className="font-ancient-title text-3xl leading-tight text-[#E5E7EB] drop-shadow-[0_0_18px_rgba(0,0,0,0.6)] sm:text-5xl">
        Do you believe in The Fool who rules above the gray fog?
      </h2>

      <div className="mx-auto my-7 h-px w-44 bg-gradient-to-r from-transparent via-[#B08D57]/85 to-transparent" />

      <button
        type="button"
        onClick={onNext}
        className="font-ancient-label group relative inline-flex items-center justify-center overflow-hidden rounded-full border border-[#B08D57]/45 bg-[#070A0F]/70 px-8 py-3 text-[11px] tracking-[0.28em] text-[#D8C7A3] shadow-[0_0_18px_rgba(176,141,87,0.14)] transition duration-300 hover:border-[#D8C7A3]/70 hover:bg-[#B08D57]/10 hover:text-[#E5E7EB]"
      >
        <span className="relative z-10">PRAISE THE FOOL</span>
        <span className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-[#D8C7A3]/60 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
        <span className="pointer-events-none absolute inset-x-4 bottom-0 h-px bg-gradient-to-r from-transparent via-[#D8C7A3]/60 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
      </button>
    </div>
  </div>
))

IntroPhase.displayName = 'IntroPhase'

const ChantPhase = memo(() => (
  <div className="relative z-10 flex min-h-[620px] items-center justify-center overflow-hidden p-6 text-center sm:p-8">
    <div className="absolute inset-0 bg-[#070A0F]" />

    <CastleBackground animated />

    <div
      className="absolute inset-0 bg-cover opacity-[0.34]"
      style={{
        backgroundImage: `url(${CastleImage.src})`,
        backgroundPosition: '56% center',
        animation: 'castle-tremor 1.25s ease-in-out infinite',
      }}
    />

    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_24%,rgba(176,141,87,0.1),transparent_28%),radial-gradient(circle_at_70%_70%,rgba(78,107,90,0.16),transparent_38%),linear-gradient(180deg,rgba(7,10,15,0.54),rgba(7,10,15,0.9))]" />

    <img
      src={ChantFog.src}
      alt=""
      className="absolute inset-0 h-full w-full object-cover object-center opacity-[0.3] mix-blend-screen animate-[chant-fog-breathe_2.8s_ease-in-out_infinite]"
      loading="eager"
      decoding="async"
      fetchPriority="high"
    />

    <div className="absolute left-[-10%] top-[18%] h-44 w-[120%] bg-gradient-to-r from-transparent via-[rgba(180,180,180,0.16)] to-transparent blur-2xl animate-[mist-drift_5s_ease-in-out_infinite_alternate]" />

    <CosmicParticles />

    <div className="relative z-10 flex w-full max-w-[650px] items-center justify-center">
      <div className="chant-block text-[clamp(0.95rem,2.55vw,1.45rem)] leading-[1.9] tracking-[0.01em] text-[#D8C7A3]">
        {CHANT_LINES.map((line, idx) => (
          <ChantLineText key={`chant-${idx}`} text={line} delay={CHANT_DELAYS[idx]} />
        ))}
      </div>
    </div>
  </div>
))

ChantPhase.displayName = 'ChantPhase'

const PreGifPhase = memo(() => (
  <div className="relative z-10 min-h-[620px] overflow-hidden">
    <div className="absolute inset-0 animate-[pre-gif-blur_800ms_ease-out_forwards]">
      <div className="absolute inset-0 bg-[#070A0F]" />

      <CastleBackground />

      <img
        src={ChantFog.src}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-center opacity-[0.34] mix-blend-screen"
        loading="eager"
        decoding="async"
        fetchPriority="high"
      />

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,10,15,0.56),rgba(7,10,15,0.94))]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(176,141,87,0.08),transparent_36%)]" />
    </div>
  </div>
))

PreGifPhase.displayName = 'PreGifPhase'

const GifPhase = memo(() => (
  <div className="relative z-10 h-[min(620px,100dvh)] min-h-[620px] overflow-hidden bg-[#070A0F]">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(176,141,87,0.12),transparent_36%),linear-gradient(180deg,rgba(7,10,15,1),rgba(11,15,23,1))]" />

    <img
      src={RitualGif.src}
      alt=""
      className="absolute inset-0 h-full w-full scale-[1.08] object-cover object-center opacity-0 animate-[gif-reveal_4.2s_ease-in-out_forwards]"
      loading="eager"
      decoding="sync"
      fetchPriority="high"
    />

    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(7,10,15,0.08)_42%,rgba(7,10,15,0.54)_100%)]" />
  </div>
))

GifPhase.displayName = 'GifPhase'

const LogoPhase = memo(() => (
  <div className="relative z-10 flex min-h-[620px] items-center justify-center overflow-hidden bg-[#070A0F] p-6">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(176,141,87,0.12),transparent_28%),radial-gradient(circle_at_70%_72%,rgba(78,107,90,0.16),transparent_36%),radial-gradient(circle_at_center,rgba(180,180,180,0.1),transparent_44%),linear-gradient(180deg,rgba(7,10,15,1),rgba(11,15,23,1))]" />

    <CosmicParticles />

    <div className="absolute left-[-18%] top-[30%] h-52 w-[140%] bg-gradient-to-r from-transparent via-[rgba(180,180,180,0.18)] to-transparent blur-3xl animate-[mist-drift_7s_ease-in-out_infinite_alternate]" />

    <div
      className="fool-logo-stage relative h-72 w-72 bg-transparent sm:h-80 sm:w-80"
      style={
        {
          '--fool-logo-mask': `url(${FoolLogo.src})`,
        } as React.CSSProperties
      }
    >
      <img
        src={FoolLogo.src}
        alt=""
        className="fool-logo-pure h-full w-full object-contain bg-transparent"
        loading="lazy"
        decoding="async"
      />

      <div className="fool-logo-masked-shine" />
    </div>
  </div>
))

LogoPhase.displayName = 'LogoPhase'

const ProfilePhase = memo(() => (
  <div className="relative z-10 animate-[profile-enter_900ms_cubic-bezier(0.22,1,0.36,1)_forwards] overflow-visible">
    <div className="pointer-events-none sticky top-0 z-0 h-[100dvh] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-[0.9] grayscale-[25%] sepia-[18%] saturate-[0.78]"
        style={{
          backgroundImage: `url(${CardBg.src})`,
        }}
      />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(176,141,87,0.18),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(78,107,90,0.16),transparent_36%),linear-gradient(180deg,rgba(17,24,39,0.72),rgba(7,10,15,0.94))]" />

      <div className="absolute left-[-20%] top-[18%] h-52 w-[135%] bg-gradient-to-r from-transparent via-[rgba(180,180,180,0.12)] to-transparent blur-3xl animate-[mist-drift_10s_ease-in-out_infinite_alternate]" />
    </div>

    <div className="relative z-10 -mt-[100dvh] p-5 sm:p-8">
      <div className="cosmic-glass-box p-3">
        <div className="cosmic-image-frame">
          <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(7,10,15,0.08)_46%,rgba(7,10,15,0.45)_100%)]" />
          <Image
            src={ProfileImage}
            alt="Profile Image"
            className="h-[30rem] max-h-[420px] w-full object-cover object-center grayscale-[22%] sepia-[16%]"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>

      <div className="cosmic-glass-box mt-6 p-4">
        <div className="relative z-10 pr-10">
          <h2 className="font-ancient-title text-3xl leading-tight tracking-wide text-[#E5E7EB]">
            Dewa Ngakan Gede Wira Adhimukti
          </h2>

          <p className="font-victorian-body mt-2 text-base text-[#B8C7E6]">
            5027251063 - Gianyar
          </p>
        </div>
      </div>

      <div className="mt-5 social-cosmic-panel">
        <div
          className="social-cosmic-sigil"
          style={{
            backgroundImage: `url(${FoolLogo.src})`,
          }}
        />

        <span className="social-cosmic-orbit orbit-one" />
        <span className="social-cosmic-orbit orbit-two" />

        <span className="social-cosmic-corner corner-a" />
        <span className="social-cosmic-corner corner-b" />
        <span className="social-cosmic-corner corner-c" />
        <span className="social-cosmic-corner corner-d" />

        <div className="cosmic-glass-box mt-5 p-4">
          <div className="relative z-20 flex flex-wrap gap-3">
            <Instagram username="o.deraa" />
            <LinkedInButtonLink username="dewa-ngakan-gede-wira-adhimukti" />
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 text-sm font-semibold sm:grid-cols-2">
        <div className="cosmic-glass-box p-4">
          <div className="relative z-10">
            <p className="font-ancient-label text-[10px] tracking-[0.24em] text-[#B08D57]">
              HOBI
            </p>
            <p className="mt-2 leading-relaxed text-[#E5E7EB]">
              Kadang baca{' '}
              <a
                href="https://www.webnovel.com/id/book/lord-of-mysteries_11022733006234505"
                target="_blank"
                rel="noopener noreferrer"
                className="hobby-link"
              >
                novel
              </a>
              , kadang baca{' '}
              <a
                href="https://myanimelist.net/manga/1706/JoJo_no_Kimyou_na_Bouken_Part_7__Steel_Ball_Run"
                target="_blank"
                rel="noopener noreferrer"
                className="hobby-link"
              >
                manga
              </a>
              , kadang baca{' '}
              <a
                href="https://myanimelist.net/manga/146750/Pigpen"
                target="_blank"
                rel="noopener noreferrer"
                className="hobby-link"
              >
                manhwa
              </a>
              , kadang nonton{' '}
              <a
                href="https://myanimelist.net/anime/37450/Seishun_Buta_Yarou_wa_Bunny_Girl_Senpai_no_Yume_wo_Minai"
                target="_blank"
                rel="noopener noreferrer"
                className="hobby-link"
              >
                anime
              </a>
              , kadang nonton{' '}
              <a
                href="https://www.imdb.com/title/tt6710474/"
                target="_blank"
                rel="noopener noreferrer"
                className="hobby-link"
              >
                film
              </a>
              , kadang mencoba hal baru, kadang gagal, kadang larping, kadang (sering){' '}
              <a
                href="https://www.instagram.com/reel/DZPOkl3pPW9/?igsh=MngxaTFxMW54b2cw"
                target="_blank"
                rel="noopener noreferrer"
                className="hobby-link"
              >
                doomscrolling
              </a>
              .
            </p>
          </div>
        </div>

        <div className="cosmic-glass-box p-4">
          <div className="relative z-10">
            <p className="text-[10px] font-bold tracking-[0.24em] text-[#B08D57]">
              FUN FACT
            </p>
            <p className="mt-2 text-[#E5E7EB]">
              Part time builder of tomorrow, full time deserter of today.
            </p>
          </div>
        </div>
      </div>

      <div className="cosmic-glass-box mt-4 p-4">
        <div className="relative z-10">
          <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
            <div>
              <p className="text-[10px] font-bold tracking-[0.24em] text-[#B08D57]">
                LAGU FAVORIT
              </p>

              <p className="my-2 text-sm font-semibold text-[#E5E7EB]">
                Nandemonaiya by Radwimps
              </p>
            </div>

            <p className="text-[10px] italic text-[#9CA3AF]">
              catalogued under private listening archive
            </p>
          </div>

          <SpotifyEmbed spotifyUrl="https://open.spotify.com/intl-id/track/7dEfa89dZfo6CQPdsgGCF6?si=a72337d44bfc4a4f" />
        </div>
      </div>

      <div className="mt-6 flex items-center gap-3 text-[10px] tracking-[0.22em] text-[#9CA3AF]">
        <div className="h-px flex-1 bg-[#B08D57]/30" />
        <span>FILE SEALED</span>
        <div className="h-px flex-1 bg-[#B08D57]/30" />
      </div>
    </div>
  </div>
))

ProfilePhase.displayName = 'ProfilePhase'

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const MemberPopup = ({ isOpen, onClose }: MemberPopupProps) => {
  const [phase, setPhase] = useState<PopupPhase>('intro')
  const [mounted, setMounted] = useState(false)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const audioFadeTimerRef = useRef<number | null>(null)

  const clearAudioFadeTimer = useCallback(() => {
    if (audioFadeTimerRef.current) {
      window.clearInterval(audioFadeTimerRef.current)
      audioFadeTimerRef.current = null
    }
  }, [])

  const stopRitualAudio = useCallback(
    (withFade = true) => {
      const audio = audioRef.current

      clearAudioFadeTimer()

      if (!audio) return

      if (withFade && !audio.paused && audio.volume > 0) {
        audioFadeTimerRef.current = fadeOutAudio(audio, () => {
          audioFadeTimerRef.current = null
        })

        return
      }

      audio.pause()
      audio.currentTime = 0
      audio.volume = 0
    },
    [clearAudioFadeTimer]
  )

  const handleClose = useCallback(() => {
    stopRitualAudio(true)
    setMounted(false)
    onClose()
  }, [onClose, stopRitualAudio])

  // Handle opening, mounting, and early asset preload
  useEffect(() => {
    if (!isOpen) return

    setMounted(true)
    setPhase('intro')

    preloadImage(RitualGif.src)
    preloadImage(ChantFog.src)

    return () => {
      stopRitualAudio(false)
    }
  }, [isOpen, stopRitualAudio])

  // Cleanup audio when component unmounts
  useEffect(() => {
    return () => {
      clearAudioFadeTimer()

      const audio = audioRef.current

      if (audio) {
        audio.pause()
        audio.src = ''
        audioRef.current = null
      }
    }
  }, [clearAudioFadeTimer])

  // Handle escape key & body overflow
  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose()
      }
    }

    const previousOverflow = document.body.style.overflow

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleEscape)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, handleClose])

  // Handle phase transitions
  useEffect(() => {
    if (!isOpen || phase === 'intro' || phase === 'profile') return

    const duration = PHASE_TIMINGS[phase]

    const timerId = window.setTimeout(() => {
      const nextIdx = PHASE_SEQUENCE.indexOf(phase) + 1

      if (nextIdx < PHASE_SEQUENCE.length) {
        setPhase(PHASE_SEQUENCE[nextIdx])
      }
    }, duration)

    return () => clearTimeout(timerId)
  }, [phase, isOpen])

const handlePhaseChange = useCallback(() => {
  preloadImage(RitualGif.src)

  if (!audioRef.current) {
    audioRef.current = createRitualAudio()
  }

  const audio = audioRef.current

  if (audio) {
    clearAudioFadeTimer()

    audio.currentTime = 0
    audio.volume = 0

    audio
      .play()
      .then(() => {
        audioFadeTimerRef.current = fadeInAudio(audio, 0.28)
      })
      .catch(() => {
        audio.pause()
        audio.currentTime = 0
        audio.volume = 0
      })
  }

  setPhase('chant')
}, [clearAudioFadeTimer])

  if (!isOpen || !mounted) return null

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto px-4 py-6">
      <style>{POPUP_STYLES}</style>
      <FogCursorTrail enabled={isOpen && mounted && phase === 'profile'} />

      <button
        type="button"
        aria-label="Close member detail"
        onClick={handleClose}
        className="absolute inset-0 bg-[#070A0F]/82 backdrop-blur-sm"
      />

      <div
        className={`${cinzelDecorative.variable} ${imFellEnglish.variable} ${cormorantGaramond.variable} member-popup-card relative z-10 max-h-[100dvh] w-full max-w-[720px] animate-[card-enter_450ms_ease-out_forwards] overflow-y-auto rounded-2xl border border-[#5F7EB2]/24 bg-[#050914] text-[#E5E7EB] shadow-[0_0_54px_rgba(18,42,86,0.26)]`}
      >
        <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_top,rgba(176,141,87,0.14),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(78,107,90,0.14),transparent_34%),linear-gradient(145deg,rgba(17,24,39,0.98),rgba(7,10,15,0.98))]" />
        <div className="pointer-events-none absolute inset-4 z-[3] rounded-xl border border-[#6C88BC]/10" />

        <OccultCorners />

        <button
          type="button"
          aria-label="Close member detail"
          onClick={handleClose}
          className="absolute right-4 top-4 z-50 flex h-9 w-9 items-center justify-center rounded-full border border-[#B08D57]/50 bg-[#070A0F]/80 text-xl leading-none text-[#D8C7A3] shadow-[0_0_18px_rgba(176,141,87,0.14)] transition hover:bg-[#6F1D1B]/45 hover:text-[#E5E7EB]"
        >
          X
        </button>

        {phase === 'intro' && <IntroPhase onNext={handlePhaseChange} />}
        {phase === 'chant' && <ChantPhase />}
        {phase === 'preGif' && <PreGifPhase />}
        {phase === 'gif' && <GifPhase />}
        {phase === 'logo' && <LogoPhase />}
        {phase === 'profile' && <ProfilePhase />}
      </div>
    </div>,
    document.body
  )
}

export default MemberPopup