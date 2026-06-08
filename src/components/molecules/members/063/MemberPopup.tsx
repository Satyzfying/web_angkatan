'use client'

import React, { useEffect, useState, useCallback, memo, useRef, useMemo } from 'react'
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

// ============================================================================
// FONTS
// ============================================================================

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
  chant: 4300,
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

const REQUIRED_PRAISE_PHRASE = 'praise the fool'

const INTRO_TITLE_LINES = [
  'Do you believe in',
  'The Fool who rules',
  'above the gray fog?',
] as const

const MADNESS_TEXTS = [
  'The stars are not watching. They are remembering.',
  'Something beyond the fog has learned your name.',
  'The moon blinked first.',
  'Do not answer the voice beneath the silence.',
  'The sky is a wound that refuses to close.',
  'A prayer was spoken before the mouth existed.',
  'The room is larger when no one is inside.',
  'Every shadow has been waiting for permission.',
  'The clock moves, but time remains dead.',
  'A thousand eyes opened behind the gray fog.',
  'The world is only stable because no one looks too closely.',
  'Sanity is a candle in a cathedral of wind.',
  'Someone is laughing where the stars should be.',
  'The fog does not hide the truth. It digests it.',
  'There are doors that only appear after being forgotten.',
  'The mirror remembers a face you have not worn yet.',
  'The universe is whispering in a language made of teeth.',
  'Do not count the bells after midnight.',
  'The higher you look, the deeper you fall.',
  'A nameless god dreams with open eyes.',
  'Your thoughts are no longer arranged in order.',
  'The city sleeps under a mistaken sky.',
  'All roads bend toward the same impossible tower.',
  'Something sacred has gone horribly wrong.',
  'The stars rearranged themselves into a warning.',
  'A voice behind the veil asked to be believed.',
] as const

const MADNESS_FRAGMENTS = [
  'LOOK UP',
  'DO NOT REMEMBER',
  'THE FOG KNOWS',
  'PRAISE HIM',
  'THE SKY IS WRONG',
  'WAKE UP AGAIN',
  'THE DOOR IS OPEN',
  'SOMETHING ANSWERED',
  'NO ONE IS ALONE',
  'THE NAME RETURNS',
] as const

type MadnessLevel = 1 | 2 | 3

type PopupPhase = 'intro' | 'chant' | 'preGif' | 'gif' | 'logo' | 'profile'

type MemberPopupProps = {
  isOpen: boolean
  onClose: () => void
}

const RITUAL_AUDIO_URL =
  'https://res.cloudinary.com/dtieforw6/video/upload/v1780815961/vsw_dbwqbv.mp4'

const preloadedImages = new Set<string>()

const preloadImage = (src: string) => {
  if (typeof window === 'undefined') return
  if (preloadedImages.has(src)) return

  preloadedImages.add(src)

  const image = new window.Image()
  image.src = src
}

let sharedAudio: HTMLAudioElement | null = null

const getOrCreateAudio = (): HTMLAudioElement | null => {
  if (typeof window === 'undefined') return null
  if (sharedAudio) return sharedAudio

  const audio = new Audio(RITUAL_AUDIO_URL)
  audio.preload = 'none'
  audio.loop = true
  audio.volume = 0

  sharedAudio = audio
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
// STYLES
// ============================================================================

const STYLE_ID = 'member-popup-styles'

const injectStyles = () => {
  if (typeof document === 'undefined') return
  if (document.getElementById(STYLE_ID)) return

  const style = document.createElement('style')
  style.id = STYLE_ID
  style.textContent = `
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
  background: linear-gradient(90deg, transparent, rgba(142,172,226,0.72), rgba(216,199,163,0.42), transparent);
  opacity: 0.28;
  transform: scaleX(0.55);
  transform-origin: center;
  transition: opacity 220ms ease, transform 220ms ease;
}

.hobby-link:hover,
.hobby-link:focus-visible {
  color: #E6EEFF;
  text-shadow:
    0 0 8px rgba(123,158,220,0.62),
    0 0 18px rgba(72,112,190,0.42),
    0 0 28px rgba(176,141,87,0.18);
  transform: translateY(-1px);
}

.hobby-link:hover::after,
.hobby-link:focus-visible::after {
  opacity: 1;
  transform: scaleX(1);
}

.hobby-link:focus-visible {
  outline: 1px solid rgba(142,172,226,0.42);
  outline-offset: 3px;
  border-radius: 0.25rem;
}

.cosmic-glass-box {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  border-radius: 1.25rem;
  border: 1px solid rgba(102,130,184,0.14);
  background:
    radial-gradient(circle at 18% 16%, rgba(34,69,122,0.13), transparent 34%),
    linear-gradient(180deg, rgba(5,11,26,0.34), rgba(3,7,18,0.26));
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow:
    inset 0 0 0 1px rgba(255,255,255,0.016),
    inset 0 0 30px rgba(0,0,0,0.22),
    0 0 20px rgba(18,42,86,0.08);
}

.cosmic-glass-box::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background-image:
    radial-gradient(circle at 12% 24%, rgba(224,235,255,0.18) 0 1px, transparent 1.7px),
    radial-gradient(circle at 48% 32%, rgba(255,255,255,0.11) 0 1px, transparent 1.7px),
    radial-gradient(circle at 88% 28%, rgba(176,141,87,0.08) 0 1px, transparent 1.8px);
  opacity: 0.38;
}

.cosmic-glass-box::after {
  content: "";
  position: absolute;
  inset: 8px;
  z-index: 1;
  pointer-events: none;
  border-radius: 0.95rem;
  border: 1px solid rgba(112,140,196,0.055);
}

.cosmic-glass-box > * {
  position: relative;
  z-index: 2;
}

.cosmic-glass-box :is(a, button) {
  position: relative;
  z-index: 20;
}

.cosmic-image-frame {
  position: relative;
  overflow: hidden;
  border-radius: 0.95rem;
  border: 1px solid rgba(115,145,204,0.12);
  box-shadow: inset 0 0 26px rgba(0,0,0,0.24);
}

.member-popup-card {
  font-family: var(--font-cormorant-garamond), Georgia, serif;
}

.font-ancient-title {
  font-family: var(--font-cinzel-decorative), Georgia, serif;
}

.font-ancient-label {
  font-family: var(--font-cinzel-decorative), Georgia, serif;
}

.font-ritual-chant {
  font-family: var(--font-im-fell-english), Georgia, serif;
}

.font-victorian-body {
  font-family: var(--font-cormorant-garamond), Georgia, serif;
}

.member-popup-card::before {
  content: "";
  pointer-events: none;
  position: absolute;
  inset: 0;
  z-index: 1;
  opacity: 0.12;
  background-image:
    radial-gradient(circle at 20% 30%, rgba(216,199,163,0.16) 0 1px, transparent 1px),
    radial-gradient(circle at 80% 70%, rgba(180,180,180,0.12) 0 1px, transparent 1px);
  background-size: 90px 90px, 130px 130px;
}

.member-popup-card::after {
  content: "";
  pointer-events: none;
  position: absolute;
  inset: 0;
  z-index: 2;
  background: radial-gradient(circle at center, transparent 0%, rgba(7,10,15,0.14) 44%, rgba(7,10,15,0.84) 100%);
}

@keyframes card-enter {
  0% {
    opacity: 0;
    transform: translateY(18px) scale(0.98);
  }

  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes mist-drift {
  0% {
    transform: translate3d(-9%, 0, 0) scale(1);
    opacity: 0.16;
  }

  50% {
    opacity: 0.34;
  }

  100% {
    transform: translate3d(9%, -4%, 0) scale(1.08);
    opacity: 0.2;
  }
}

@keyframes castle-tremor {
  0%, 100% {
    transform: translate3d(0, 0, 0) scale(1.045);
  }

  15% {
    transform: translate3d(-2px, 1px, 0) scale(1.047);
  }

  30% {
    transform: translate3d(2px, -1px, 0) scale(1.05);
  }

  60% {
    transform: translate3d(3px, 0, 0) scale(1.05);
  }
}

@keyframes castle-pulse {
  0%, 100% {
    opacity: 0.26;
  }

  40% {
    opacity: 0.3;
  }

  60% {
    opacity: 0.5;
  }
}

@keyframes chant-line-fog-reveal {
  0% {
    opacity: 0;
    filter: blur(8px);
  }

  78% {
    opacity: 0.88;
    filter: blur(1px);
  }

  100% {
    opacity: 1;
    filter: blur(0);
    text-shadow: 0 0 10px rgba(216,199,163,0.3);
  }
}

@keyframes chant-fog-breathe {
  0%, 100% {
    opacity: 0.22;
  }

  50% {
    opacity: 0.36;
  }
}

@keyframes pre-gif-blur {
  0% {
    opacity: 1;
    transform: scale(1);
    filter: blur(0px) brightness(1);
  }

  100% {
    opacity: 0.96;
    transform: scale(1.03);
    filter: blur(10px) brightness(0.72);
  }
}

@keyframes gif-reveal {
  0% {
    opacity: 0;
    transform: scale(1.02);
    filter: blur(8px);
  }

  18% {
    opacity: 1;
    filter: blur(0);
  }

  82% {
    opacity: 1;
  }

  100% {
    opacity: 0;
    transform: scale(1.08);
    filter: blur(6px);
  }
}

@keyframes fool-logo-reveal {
  0% {
    opacity: 0;
    clip-path: inset(0 0 100% 0);
  }

  70% {
    opacity: 1;
    clip-path: inset(0 0 0 0);
  }

  100% {
    opacity: 1;
    clip-path: inset(0 0 0 0);
  }
}

@keyframes fool-logo-rise {
  0% {
    opacity: 1;
    transform: translate3d(0, 0, 0) scale(1);
  }

  100% {
    opacity: 0;
    transform: translate3d(0, -320px, 0) scale(0.9);
  }
}

@keyframes profile-enter {
  0% {
    opacity: 0;
    transform: translateY(24px) scale(0.987);
  }

  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes intro-fog-letter-reveal {
  0% {
    opacity: 0;
    filter: blur(16px);
    transform: translate3d(0, 14px, 0) scale(1.08);
  }

  55% {
    opacity: 0.52;
    filter: blur(7px);
  }

  100% {
    opacity: 1;
    filter: blur(0);
    transform: translate3d(0, 0, 0) scale(1);
  }
}

.intro-fog-title {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: min(92vw, 760px);
  margin-inline: auto;

  text-align: center;
  font-size: clamp(1.85rem, 4.1vw, 3.35rem);
  line-height: 1.16;
}

.intro-fog-line {
  display: flex;
  justify-content: center;
  flex-wrap: nowrap;
  column-gap: 0.34em;
  white-space: nowrap;
}

.intro-fog-word {
  display: inline-flex;
  white-space: nowrap;
}

.intro-fog-letter {
  display: inline-block;
  opacity: 0;
  filter: blur(16px);
  transform: translate3d(0, 14px, 0) scale(1.08);
  animation: intro-fog-letter-reveal 1500ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
  animation-delay: calc(260ms + (var(--letter-index) * 82ms));
  will-change: opacity, filter, transform;
}

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
  filter: drop-shadow(0 0 18px rgba(176,141,87,0.24));
}

.fool-logo-masked-shine {
  position: absolute;
  inset: 0;
  z-index: 3;
  pointer-events: none;
  opacity: 0;
  background:
    linear-gradient(
      180deg,
      transparent 0%,
      rgba(216,199,163,0.08) 34%,
      rgba(216,199,163,0.72) 50%,
      rgba(176,141,87,0.12) 62%,
      transparent 100%
    );
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

.occult-corner {
  position: absolute;
  width: 34px;
  height: 34px;
  z-index: 4;
  pointer-events: none;
  opacity: 0.58;
}

.occult-corner::before,
.occult-corner::after {
  content: "";
  position: absolute;
  background: rgba(176,141,87,0.62);
}

.occult-corner::before {
  width: 100%;
  height: 1px;
}

.occult-corner::after {
  width: 1px;
  height: 100%;
}

.corner-tl {
  left: 18px;
  top: 18px;
}

.corner-tr {
  right: 18px;
  top: 18px;
  transform: rotate(90deg);
}

.corner-bl {
  left: 18px;
  bottom: 18px;
  transform: rotate(-90deg);
}

.corner-br {
  right: 18px;
  bottom: 18px;
  transform: rotate(180deg);
}

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

.intro-content-shield {
  position: relative;
  z-index: 20;
  isolation: isolate;
}

.intro-content-shield::before {
  content: "";
  position: absolute;
  inset: -32px -28px;
  z-index: -1;
  border-radius: 999px;
  background:
    radial-gradient(
      circle at center,
      rgba(7,10,15,0.72),
      rgba(7,10,15,0.36) 48%,
      transparent 72%
    );
  filter: blur(12px);
}

.madness-scripture-layer {
  pointer-events: auto;
  position: absolute;
  inset: -10vh -14vw;
  z-index: 8;
  overflow: visible;
  opacity: 1;
  mix-blend-mode: normal;
}

.madness-script {
  pointer-events: auto;
  position: absolute;
  left: var(--madness-x);
  width: max-content;
  max-width: 82vw;
  white-space: nowrap;
  font-family: var(--font-im-fell-english), Georgia, serif;
  font-size: clamp(0.78rem, 1.8vw, 1.65rem);
  line-height: 1;
  letter-spacing: 0.11em;
  color: rgba(216,199,163,1);
  opacity: var(--madness-opacity);
  filter: blur(var(--madness-blur));
  transform:
    translate3d(0, 0, 0)
    rotate(var(--madness-rotate))
    scale(var(--madness-scale));
  will-change: transform, opacity;
  animation-duration: var(--madness-duration);
  animation-delay: var(--madness-delay);
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  animation-fill-mode: both;
  cursor: pointer;
  transition: all 300ms ease;
}

.madness-script.from-top {
  top: -4vh;
  animation-name: madness-slide-down;
}

.madness-script.from-bottom {
  bottom: -4vh;
  animation-name: madness-slide-up;
}

.madness-script.is-urgent {
  color: rgba(230,238,255,0.46);
}

.madness-script.is-hovered {
  animation-play-state: paused;
  opacity: 1 !important;
  filter: blur(0) !important;
  color: rgba(230,238,255,1) !important;
  text-shadow:
    0 0 12px rgba(216,199,163,0.6),
    0 0 24px rgba(176,141,87,0.3);
  z-index: 50;
}

.madness-fragment {
  position: absolute;
  left: var(--fragment-left);
  top: var(--fragment-top);
  max-width: 80vw;
  font-family: var(--font-cinzel-decorative), Georgia, serif;
  font-size: clamp(1rem, 4vw, 3.1rem);
  letter-spacing: 0.24em;
  color: rgba(230,238,255,0);
  transform:
    translate(-50%, -50%)
    rotate(var(--fragment-rotate))
    scale(0.92);
  filter: blur(14px);
  animation: madness-fragment-flash 6.4s ease-in-out infinite;
  animation-delay: var(--fragment-delay);
  will-change: transform, opacity, filter;
}

.fool-apparition-layer {
  pointer-events: none;
  position: absolute;
  inset: 0;
  z-index: 5;
  overflow: hidden;
}

.fool-apparition-layer[data-level="1"] {
  opacity: 0;
}

.fool-apparition-layer[data-level="2"] {
  opacity: 0.46;
}

.fool-apparition-layer[data-level="3"] {
  opacity: 0.88;
}

.fool-apparition {
  position: absolute;
  left: var(--fool-left);
  top: var(--fool-top);
  width: var(--fool-size);
  height: var(--fool-size);
  background-image: var(--fool-logo-url);
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.92);
  filter: blur(18px);
  animation: fool-apparition-flash-simple 7.8s steps(1, end) infinite;
  animation-delay: var(--fool-delay);
  will-change: transform, opacity, filter;
}

@keyframes madness-slide-down {
  0% {
    opacity: 0;
    transform:
      translate3d(0, -14vh, 0)
      rotate(var(--madness-rotate))
      scale(var(--madness-scale));
  }

  12% {
    opacity: 1;
  }

  72% {
    opacity: 0.82;
  }

  100% {
    opacity: 0;
    transform:
      translate3d(var(--madness-drift), 122vh, 0)
      rotate(var(--madness-rotate-end))
      scale(var(--madness-scale));
  }
}

@keyframes madness-slide-up {
  0% {
    opacity: 0;
    transform:
      translate3d(0, 14vh, 0)
      rotate(var(--madness-rotate))
      scale(var(--madness-scale));
  }

  12% {
    opacity: 1;
  }

  72% {
    opacity: 0.82;
  }

  100% {
    opacity: 0;
    transform:
      translate3d(var(--madness-drift), -122vh, 0)
      rotate(var(--madness-rotate-end))
      scale(var(--madness-scale));
  }
}

@keyframes madness-fragment-flash {
  0%, 60%, 100% {
    opacity: 0;
    color: rgba(230,238,255,0);
    filter: blur(16px);
    transform:
      translate(-50%, -50%)
      rotate(var(--fragment-rotate))
      scale(0.86);
  }

  66% {
    opacity: 0.38;
    color: rgba(230,238,255,0.42);
    filter: blur(7px);
  }

  70% {
    opacity: 0.22;
    filter: blur(3px);
    transform:
      translate(-50%, -50%)
      rotate(var(--fragment-rotate-end))
      scale(1.04);
  }

  78% {
    opacity: 0;
    filter: blur(18px);
  }
}

@keyframes fool-apparition-flash-simple {
  0%, 57%, 100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.92);
    filter: blur(22px);
  }

  60% {
    opacity: 0.22;
    transform: translate(-50%, -50%) scale(1);
    filter: blur(7px);
  }

  63% {
    opacity: 0.3;
    transform: translate(-50%, -50%) scale(1.02);
    filter: blur(0.5px);
  }

  70% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(1.12);
    filter: blur(20px);
  }
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
      rgba(216,199,163,0.32) 0%,
      rgba(180,180,180,0.18) 40%,
      transparent 70%
    );
  opacity: 0;
  filter: blur(8px);
  transform:
    translate3d(var(--fog-x), var(--fog-y), 0)
    translate(-50%, -50%)
    scale(0.4);
  animation: fog-cursor-dissolve 900ms ease-out forwards;
  will-change: transform, opacity;
}

@keyframes fog-cursor-dissolve {
  0% {
    opacity: 0;
    transform:
      translate3d(var(--fog-x), var(--fog-y), 0)
      translate(-50%, -50%)
      scale(0.35);
  }

  18% {
    opacity: 0.4;
  }

  100% {
    opacity: 0;
    transform:
      translate3d(var(--fog-x), var(--fog-y), 0)
      translate(
        calc(-50% + var(--fog-dx)),
        calc(-50% + var(--fog-dy))
      )
      scale(2.5);
    filter: blur(14px);
  }
}

@media (max-width: 640px) {
  .intro-content-shield::before {
    inset: -24px -14px;
  }

  .intro-fog-title {
    width: min(94vw, 420px);
    font-size: clamp(1.2rem, 6vw, 2rem);
    line-height: 1.2;
  }

  .intro-fog-line {
    column-gap: 0.26em;
  }

  .intro-fog-letter {
    animation-delay: calc(220ms + (var(--letter-index) * 68ms));
    animation-duration: 1350ms;
  }

  .madness-script {
    max-width: 118vw;
    font-size: clamp(0.72rem, 4vw, 1.1rem);
    letter-spacing: 0.08em;
  }

  .madness-fragment {
    font-size: clamp(0.92rem, 7vw, 2.2rem);
    letter-spacing: 0.16em;
  }
}
`

  document.head.appendChild(style)
}

// ============================================================================
// REUSABLE SUB-COMPONENTS
// ============================================================================

const MADNESS_TEXT_COUNT = 26

const getMadnessDuration = (index: number) => {
  const baseDuration = 12.5
  const variation = (index % 5) * 0.75
  return `${baseDuration + variation}s`
}

const getMadnessItems = () => MADNESS_TEXTS.slice(0, MADNESS_TEXT_COUNT)

const MadnessTextLayer = memo(({ level }: { level: MadnessLevel }) => {
  const activeTexts = useMemo(() => getMadnessItems(), [])
  const showFragments = level >= 3
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <div className="madness-scripture-layer" data-level={level} aria-hidden="true">
      {activeTexts.map((text, index) => {
        const fromTop = index % 2 === 0
        const opacity = level === 3 ? 0.72 : level === 2 ? 0.5 : 0.34
        const blur = level === 3 ? '2px' : level === 2 ? '4px' : '6px'
        const isHovered = hoveredIndex === index

        return (
          <span
            key={`madness-text-${index}`}
            className={`madness-script ${fromTop ? 'from-top' : 'from-bottom'}${
              level === 3 && index % 5 === 0 ? ' is-urgent' : ''
            }${isHovered ? ' is-hovered' : ''}`}
            style={
              {
                '--madness-x': `${-16 + ((index * 19) % 132)}vw`,
                '--madness-drift': `${(index % 4 - 1.5) * 18}vw`,
                '--madness-rotate': `${(index % 7 - 3) * 4}deg`,
                '--madness-rotate-end': `${(3 - (index % 7)) * 4}deg`,
                '--madness-scale': `${0.88 + (index % 4) * 0.08}`,
                '--madness-opacity': opacity,
                '--madness-blur': blur,
                '--madness-duration': getMadnessDuration(index),
                '--madness-delay': `${(index % 10) * -0.75}s`,
              } as React.CSSProperties
            }
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {text}
          </span>
        )
      })}

      {showFragments &&
        MADNESS_FRAGMENTS.slice(0, 6).map((fragment, index) => (
          <span
            key={`madness-fragment-${index}`}
            className="madness-fragment"
            style={
              {
                '--fragment-left': `${14 + ((index * 17) % 74)}%`,
                '--fragment-top': `${18 + ((index * 23) % 68)}%`,
                '--fragment-rotate': `${(index % 5 - 2) * 5}deg`,
                '--fragment-rotate-end': `${(2 - (index % 5)) * 5}deg`,
                '--fragment-delay': `${index * 0.9}s`,
              } as React.CSSProperties
            }
          >
            {fragment}
          </span>
        ))}
    </div>
  )
})

MadnessTextLayer.displayName = 'MadnessTextLayer'

const FOOL_APPARITIONS = [
  { left: '50%', top: '46%', size: 'min(62vw, 440px)', delay: '0s' },
  { left: '18%', top: '32%', size: 'min(42vw, 300px)', delay: '2.8s' },
  { left: '82%', top: '66%', size: 'min(46vw, 340px)', delay: '5.4s' },
] as const

const FoolApparition = memo(({ level }: { level: MadnessLevel }) => (
  <div
    className="fool-apparition-layer"
    data-level={level}
    aria-hidden="true"
    style={{ '--fool-logo-url': `url(${FoolLogo.src})` } as React.CSSProperties}
  >
    {FOOL_APPARITIONS.map((item, index) => (
      <span
        key={`fool-apparition-${index}`}
        className="fool-apparition"
        style={
          {
            '--fool-left': item.left,
            '--fool-top': item.top,
            '--fool-size': item.size,
            '--fool-delay': item.delay,
          } as React.CSSProperties
        }
      />
    ))}
  </div>
))

FoolApparition.displayName = 'FoolApparition'

const OccultCorners = memo(() => (
  <>
    <span className="occult-corner corner-tl" />
    <span className="occult-corner corner-tr" />
    <span className="occult-corner corner-bl" />
    <span className="occult-corner corner-br" />
  </>
))

OccultCorners.displayName = 'OccultCorners'

const IntroFogTitle = memo(({ lines }: { lines: readonly string[] }) => {
  let letterIndex = 0
  const fullText = lines.join(' ')

  return (
    <h2
      className="font-ancient-title intro-fog-title text-[#E5E7EB] drop-shadow-[0_0_18px_rgba(0,0,0,0.6)]"
      aria-label={fullText}
    >
      {lines.map((line, lineIndex) => (
        <span
          key={`intro-title-line-${lineIndex}`}
          className="intro-fog-line"
          aria-hidden="true"
        >
          {line.split(' ').map((word, wordIndex) => (
            <span
              key={`intro-title-word-${lineIndex}-${wordIndex}`}
              className="intro-fog-word"
            >
              {Array.from(word).map((char, charIndex) => {
                const currentIndex = letterIndex
                letterIndex += 1

                return (
                  <span
                    key={`intro-title-char-${lineIndex}-${wordIndex}-${charIndex}`}
                    className="intro-fog-letter"
                    style={{ '--letter-index': currentIndex } as React.CSSProperties}
                  >
                    {char}
                  </span>
                )
              })}
            </span>
          ))}
        </span>
      ))}
    </h2>
  )
})

IntroFogTitle.displayName = 'IntroFogTitle'

const FogCursorTrail = memo(({ enabled }: { enabled: boolean }) => {
  useEffect(() => {
    if (!enabled || typeof window === 'undefined' || typeof document === 'undefined') return

    const layerId = 'fog-cursor-layer'
    const oldLayer = document.getElementById(layerId)
    oldLayer?.remove()

    const layer = document.createElement('div')
    layer.id = layerId
    layer.setAttribute('aria-hidden', 'true')
    Object.assign(layer.style, {
      position: 'fixed',
      inset: '0',
      zIndex: '2147483647',
      pointerEvents: 'none',
      overflow: 'hidden',
      width: '100vw',
      height: '100dvh',
    })
    document.body.appendChild(layer)

    let lastSpawnTime = 0
    let activePuffs = 0
    const MAX_PUFFS = 8

    const spawnFogAt = (x: number, y: number) => {
      if (activePuffs >= MAX_PUFFS) return

      const puff = document.createElement('span')
      const size = 38 + Math.random() * 48
      const driftX = (Math.random() * 2 - 1) * 38
      const driftY = -20 - Math.random() * 32

      puff.className = 'fog-cursor-puff'
      puff.style.setProperty('--fog-size', `${size}px`)
      puff.style.setProperty('--fog-x', `${x}px`)
      puff.style.setProperty('--fog-y', `${y}px`)
      puff.style.setProperty('--fog-dx', `${driftX}px`)
      puff.style.setProperty('--fog-dy', `${driftY}px`)

      activePuffs++
      layer.appendChild(puff)

      puff.addEventListener(
        'animationend',
        () => {
          puff.remove()
          activePuffs--
        },
        { once: true }
      )
    }

    const spawnFog = (event: MouseEvent) => {
      const now = performance.now()
      if (now - lastSpawnTime < 180) return

      lastSpawnTime = now
      spawnFogAt(event.clientX, event.clientY)
    }

    window.addEventListener('mousemove', spawnFog, { passive: true })

    return () => {
      window.removeEventListener('mousemove', spawnFog)
      layer.remove()
    }
  }, [enabled])

  return null
})

FogCursorTrail.displayName = 'FogCursorTrail'

const CastleBackground = memo(({ animated = false }: { animated?: boolean }) => (
  <div
    className="absolute inset-0 bg-cover grayscale-[26%] sepia-[16%]"
    style={{
      backgroundImage: `url(${CastleImage.src})`,
      backgroundPosition: 'center center',
      animation: animated ? 'castle-pulse 1.85s ease-in-out infinite' : undefined,
    }}
  />
))

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

const IntroPhase = memo(({ onNext }: { onNext: () => void }) => {
  const [praiseText, setPraiseText] = useState('')
  const [hasError, setHasError] = useState(false)
  const [madnessLevel, setMadnessLevel] = useState<MadnessLevel>(1)

  const normalizedInput = praiseText.trim().toLowerCase()
  const isCorrectPhrase = normalizedInput === REQUIRED_PRAISE_PHRASE

  useEffect(() => {
    if (isCorrectPhrase) {
      setMadnessLevel(1)
      return
    }

    const levelTwoTimer = window.setTimeout(() => {
      setMadnessLevel((cur) => (cur < 2 ? 2 : cur))
    }, 1400)

    const levelThreeTimer = window.setTimeout(() => {
      setMadnessLevel(3)
    }, 5200)

    return () => {
      window.clearTimeout(levelTwoTimer)
      window.clearTimeout(levelThreeTimer)
    }
  }, [isCorrectPhrase, praiseText])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!isCorrectPhrase) {
      setHasError(true)
      setMadnessLevel(3)
      return
    }

    setHasError(false)
    setMadnessLevel(1)
    onNext()
  }

  return (
    <div className="relative z-10 flex h-[100dvh] min-h-[620px] items-center justify-center overflow-hidden p-6 text-center sm:p-8">
      <div
        className="absolute -inset-4 bg-cover opacity-[0.52] blur-[3px] grayscale-[24%] sepia-[16%] saturate-[0.82]"
        style={{
          backgroundImage: `url(${CastleImage.src})`,
          backgroundPosition: 'center center',
          transform: 'scale(1.05)',
        }}
      />

      <div className="absolute inset-0 bg-[#070A0F]/46" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(7,10,15,0.04)_0%,rgba(7,10,15,0.2)_42%,rgba(7,10,15,0.9)_100%)]" />
      <div className="absolute left-[-18%] top-[18%] h-44 w-[140%] bg-gradient-to-r from-transparent via-[rgba(180,180,180,0.2)] to-transparent blur-3xl animate-[mist-drift_8s_ease-in-out_infinite_alternate]" />

      <MadnessTextLayer level={madnessLevel} />
      <FoolApparition level={madnessLevel} />

      <div className="intro-content-shield max-w-[760px]">
        <p className="font-ancient-label mb-5 text-[10px] tracking-[0.34em] text-[#B08D57]">
          SEALED INQUIRY
        </p>

        <IntroFogTitle lines={INTRO_TITLE_LINES} />

        <div className="mx-auto my-7 h-px w-44 bg-gradient-to-r from-transparent via-[#B08D57]/85 to-transparent" />

        <form onSubmit={handleSubmit} className="mx-auto flex max-w-[430px] flex-col items-center gap-3">
          <label
            htmlFor="fool-praise-input"
            className="font-ritual-chant text-sm tracking-[0.16em] text-[#D8C7A3]/85"
          >
            Type the sacred phrase
          </label>

          <input
            id="fool-praise-input"
            type="text"
            value={praiseText}
            onChange={(event) => {
              const nextValue = event.target.value
              setPraiseText(nextValue)
              setHasError(false)

              if (nextValue.trim().toLowerCase() === REQUIRED_PRAISE_PHRASE) {
                setMadnessLevel(1)
                return
              }

              setMadnessLevel((cur) => (cur < 2 ? 2 : cur))
            }}
            placeholder="Praise the Fool"
            autoComplete="off"
            spellCheck={false}
            onKeyDown={(e) => e.stopPropagation()}
            className={`font-ritual-chant w-full rounded-full border bg-[#070A0F]/72 px-5 py-3 text-center text-base tracking-[0.08em] text-[#E5E7EB] outline-none backdrop-blur-md transition duration-300 placeholder:text-[#9CA3AF]/55 ${
              hasError
                ? 'border-[#6F1D1B]/80 shadow-[0_0_18px_rgba(111,29,27,0.34)]'
                : 'border-[#B08D57]/45 shadow-[0_0_18px_rgba(176,141,87,0.14)] focus:border-[#D8C7A3]/80 focus:shadow-[0_0_24px_rgba(176,141,87,0.24)]'
            }`}
          />

          {hasError && (
            <p className="font-victorian-body text-sm italic text-[#D8C7A3]/80">
              The gray fog remains silent.
            </p>
          )}

          <button
            type="submit"
            className="font-ancient-label group relative mt-2 inline-flex items-center justify-center overflow-hidden rounded-full border border-[#B08D57]/45 bg-[#070A0F]/70 px-8 py-3 text-[11px] tracking-[0.28em] text-[#D8C7A3] shadow-[0_0_18px_rgba(176,141,87,0.14)] transition duration-300 hover:border-[#D8C7A3]/70 hover:bg-[#B08D57]/10 hover:text-[#E5E7EB]"
          >
            <span className="relative z-10">CONFIRM</span>
            <span className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-[#D8C7A3]/60 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
            <span className="pointer-events-none absolute inset-x-4 bottom-0 h-px bg-gradient-to-r from-transparent via-[#D8C7A3]/60 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
          </button>
        </form>
      </div>
    </div>
  )
})

IntroPhase.displayName = 'IntroPhase'

const ChantPhase = memo(() => (
  <div className="relative z-10 flex h-[100dvh] min-h-[620px] items-center justify-center overflow-hidden p-6 text-center sm:p-8">
    <div className="absolute inset-0 bg-[#070A0F]" />

    <div
      className="absolute inset-0 bg-cover grayscale-[22%] sepia-[16%]"
      style={{
        backgroundImage: `url(${CastleImage.src})`,
        backgroundPosition: 'center center',
        animation: 'castle-tremor 1.25s ease-in-out infinite',
        opacity: 0.4,
      }}
    />

    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_24%,rgba(176,141,87,0.1),transparent_28%),linear-gradient(180deg,rgba(7,10,15,0.54),rgba(7,10,15,0.9))]" />

    <img
      src={ChantFog.src}
      alt=""
      className="absolute inset-0 h-full w-full object-cover object-center opacity-[0.3] mix-blend-screen animate-[chant-fog-breathe_2.8s_ease-in-out_infinite]"
      loading="eager"
      decoding="async"
      fetchPriority="high"
    />

    <div className="absolute left-[-10%] top-[18%] h-44 w-[120%] bg-gradient-to-r from-transparent via-[rgba(180,180,180,0.16)] to-transparent blur-2xl animate-[mist-drift_5s_ease-in-out_infinite_alternate]" />

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
  <div className="relative z-10 h-[100dvh] min-h-[620px] overflow-hidden">
    <div
      className="absolute inset-0"
      style={{ animation: 'pre-gif-blur 800ms ease-out forwards' }}
    >
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
    </div>
  </div>
))

PreGifPhase.displayName = 'PreGifPhase'

const GifPhase = memo(() => (
  <div className="relative z-10 h-[100dvh] min-h-[620px] overflow-hidden bg-[#070A0F]">
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
  <div className="relative z-10 flex h-[100dvh] min-h-[620px] items-center justify-center overflow-hidden bg-[#070A0F] p-6">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(180,180,180,0.1),transparent_44%),linear-gradient(180deg,rgba(7,10,15,1),rgba(11,15,23,1))]" />
    <div className="absolute left-[-18%] top-[30%] h-52 w-[140%] bg-gradient-to-r from-transparent via-[rgba(180,180,180,0.18)] to-transparent blur-3xl animate-[mist-drift_7s_ease-in-out_infinite_alternate]" />

    <div
      className="fool-logo-stage relative h-72 w-72 bg-transparent sm:h-80 sm:w-80"
      style={{ '--fool-logo-mask': `url(${FoolLogo.src})` } as React.CSSProperties}
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

type SpotifyAutoStopAreaProps = {
  onSpotifyInteract: () => void
  children: React.ReactNode
}

const SpotifyAutoStopArea = memo(({ onSpotifyInteract, children }: SpotifyAutoStopAreaProps) => {
  const isPointerInsideRef = useRef(false)

  useEffect(() => {
    const handleWindowBlur = () => {
      if (isPointerInsideRef.current) {
        onSpotifyInteract()
      }
    }

    window.addEventListener('blur', handleWindowBlur)

    return () => {
      window.removeEventListener('blur', handleWindowBlur)
    }
  }, [onSpotifyInteract])

  return (
    <div
      onPointerEnter={() => {
        isPointerInsideRef.current = true
      }}
      onPointerLeave={() => {
        isPointerInsideRef.current = false
      }}
      onPointerDownCapture={onSpotifyInteract}
      onTouchStartCapture={onSpotifyInteract}
      onFocusCapture={onSpotifyInteract}
    >
      {children}
    </div>
  )
})

SpotifyAutoStopArea.displayName = 'SpotifyAutoStopArea'

const ProfilePhase = memo(({ onSpotifyInteract }: { onSpotifyInteract: () => void }) => (
  <div className="relative z-10 animate-[profile-enter_900ms_cubic-bezier(0.22,1,0.36,1)_forwards] overflow-visible">
    <div className="pointer-events-none sticky top-0 z-0 h-[100dvh] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-[0.9] grayscale-[25%] sepia-[18%] saturate-[0.78]"
        style={{ backgroundImage: `url(${CardBg.src})` }}
      />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(176,141,87,0.18),transparent_34%),linear-gradient(180deg,rgba(17,24,39,0.72),rgba(7,10,15,0.94))]" />
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

      <div className="cosmic-glass-box mt-5 p-4">
        <div className="relative z-20 flex flex-wrap gap-3">
          <Instagram username="o.deraa" />
          <LinkedInButtonLink username="dewa-ngakan-gede-wira-adhimukti" />
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
                Nandemonaiya by RADWIMPS
              </p>
            </div>

            <p className="text-[10px] italic text-[#9CA3AF]">
              catalogued under private listening archive
            </p>
          </div>

          <SpotifyAutoStopArea onSpotifyInteract={onSpotifyInteract}>
            <SpotifyEmbed spotifyUrl="https://open.spotify.com/intl-id/track/7dEfa89dZfo6CQPdsgGCF6?si=a72337d44bfc4a4f" />
          </SpotifyAutoStopArea>
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
  const [isBgMusicEnabled, setIsBgMusicEnabled] = useState(true)
  const [isBgMusicPlaying, setIsBgMusicPlaying] = useState(false)

  const audioFadeTimerRef = useRef<number | null>(null)

  const clearAudioFadeTimer = useCallback(() => {
    if (audioFadeTimerRef.current) {
      window.clearInterval(audioFadeTimerRef.current)
      audioFadeTimerRef.current = null
    }
  }, [])

  const playRitualAudio = useCallback(
    (restart = false) => {
      const audio = getOrCreateAudio()
      if (!audio) return

      clearAudioFadeTimer()

      if (restart) {
        audio.currentTime = 0
      }

      audio.volume = 0

      audio
        .play()
        .then(() => {
          setIsBgMusicPlaying(true)
          audioFadeTimerRef.current = fadeInAudio(audio, 0.28)
        })
        .catch(() => {
          audio.pause()
          audio.currentTime = 0
          audio.volume = 0
          setIsBgMusicPlaying(false)
        })
    },
    [clearAudioFadeTimer]
  )

  const stopRitualAudio = useCallback(
    (withFade = true) => {
      const audio = getOrCreateAudio()
      clearAudioFadeTimer()

      if (!audio) return

      if (withFade && !audio.paused && audio.volume > 0) {
        audioFadeTimerRef.current = fadeOutAudio(audio, () => {
          audioFadeTimerRef.current = null
          setIsBgMusicPlaying(false)
        })
        return
      }

      audio.pause()
      audio.currentTime = 0
      audio.volume = 0
      setIsBgMusicPlaying(false)
    },
    [clearAudioFadeTimer]
  )

  const handleToggleBgMusic = useCallback(() => {
    setIsBgMusicEnabled((currentValue) => {
      const nextValue = !currentValue

      if (!nextValue) {
        stopRitualAudio(true)
        return nextValue
      }

      if (phase === 'profile') {
        playRitualAudio(false)
      }

      return nextValue
    })
  }, [phase, playRitualAudio, stopRitualAudio])

  const handleSpotifyInteraction = useCallback(() => {
    setIsBgMusicEnabled(false)
    stopRitualAudio(true)
  }, [stopRitualAudio])

  const handleClose = useCallback(() => {
    stopRitualAudio(true)
    setMounted(false)
    onClose()
  }, [onClose, stopRitualAudio])

  useEffect(() => {
    injectStyles()
  }, [])

  useEffect(() => {
    if (!isOpen) return

    setMounted(true)
    setPhase('intro')
    setIsBgMusicEnabled(true)
    setIsBgMusicPlaying(false)

    preloadImage(RitualGif.src)

    return () => {
      stopRitualAudio(false)
    }
  }, [isOpen, stopRitualAudio])

  useEffect(() => {
    return () => {
      clearAudioFadeTimer()
    }
  }, [clearAudioFadeTimer])

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

  useEffect(() => {
    if (!isOpen || phase === 'intro' || phase === 'profile') return

    const duration = PHASE_TIMINGS[phase]

    const timerId = window.setTimeout(() => {
      const nextIdx = PHASE_SEQUENCE.indexOf(phase) + 1

      if (nextIdx < PHASE_SEQUENCE.length) {
        setPhase(PHASE_SEQUENCE[nextIdx])
      }
    }, duration)

    return () => {
      window.clearTimeout(timerId)
    }
  }, [phase, isOpen])

  const handlePhaseChange = useCallback(() => {
    preloadImage(RitualGif.src)

    if (isBgMusicEnabled) {
      playRitualAudio(true)
    }

    setPhase('chant')
  }, [isBgMusicEnabled, playRitualAudio])

  const isCinematicPhase = phase !== 'profile'

  if (!isOpen || !mounted) return null

  return createPortal(
    <div
      className={`${cinzelDecorative.variable} ${imFellEnglish.variable} ${cormorantGaramond.variable} fixed inset-0 z-[100] overflow-hidden text-[#E5E7EB]`}
    >
      <FogCursorTrail enabled={isOpen && mounted && phase === 'profile'} />

      <button
        type="button"
        aria-label="Close member detail backdrop"
        onClick={handleClose}
        className="fixed inset-0 z-0 bg-[#070A0F]/88 backdrop-blur-sm"
      />

      <button
        type="button"
        aria-label="Close member detail"
        onClick={handleClose}
        className="fixed right-4 top-4 z-[120] flex h-10 w-10 items-center justify-center rounded-full border border-[#B08D57]/50 bg-[#070A0F]/80 text-xl leading-none text-[#D8C7A3] shadow-[0_0_18px_rgba(176,141,87,0.14)] transition hover:bg-[#6F1D1B]/45 hover:text-[#E5E7EB]"
      >
        X
      </button>

      {phase === 'profile' && (
        <button
          type="button"
          aria-pressed={isBgMusicEnabled}
          aria-label={isBgMusicEnabled ? 'Turn off background music' : 'Turn on background music'}
          onClick={handleToggleBgMusic}
          className="font-ancient-label fixed left-4 top-4 z-[120] rounded-full border border-[#B08D57]/45 bg-[#070A0F]/80 px-4 py-3 text-[10px] tracking-[0.2em] text-[#D8C7A3] shadow-[0_0_18px_rgba(176,141,87,0.14)] transition hover:border-[#D8C7A3]/70 hover:bg-[#B08D57]/10 hover:text-[#E5E7EB]"
        >
          {isBgMusicEnabled && isBgMusicPlaying ? 'BG MUSIC ON' : 'BG MUSIC OFF'}
        </button>
      )}

      {isCinematicPhase ? (
        <div className="fixed inset-0 z-10 overflow-hidden bg-[#070A0F] animate-[card-enter_450ms_ease-out_forwards]">
          {phase === 'intro' && <IntroPhase onNext={handlePhaseChange} />}
          {phase === 'chant' && <ChantPhase />}
          {phase === 'preGif' && <PreGifPhase />}
          {phase === 'gif' && <GifPhase />}
          {phase === 'logo' && <LogoPhase />}
        </div>
      ) : (
        <div className="pointer-events-none fixed inset-0 z-10 flex items-center justify-center overflow-y-auto px-4 py-6">
          <div className="member-popup-card pointer-events-auto relative z-10 max-h-[100dvh] w-full max-w-[720px] animate-[card-enter_450ms_ease-out_forwards] overflow-y-auto rounded-2xl border border-[#5F7EB2]/24 bg-[#050914] text-[#E5E7EB] shadow-[0_0_54px_rgba(18,42,86,0.26)]">
            <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_top,rgba(176,141,87,0.14),transparent_36%),linear-gradient(145deg,rgba(17,24,39,0.98),rgba(7,10,15,0.98))]" />
            <div className="pointer-events-none absolute inset-4 z-[3] rounded-xl border border-[#6C88BC]/10" />

            <OccultCorners />
            <ProfilePhase onSpotifyInteract={handleSpotifyInteraction} />
          </div>
        </div>
      )}
    </div>,
    document.body
  )
}

export default MemberPopup
