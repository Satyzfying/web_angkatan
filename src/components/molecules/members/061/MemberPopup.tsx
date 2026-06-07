'use client'

import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import Image from 'next/image'
import SpotifyEmbed from '@/components/molecules/SpotifyEmbed'
import ProfileImage from './image.webp'
import ProfileImageAlt from './image2.webp'
import BgImage from './bg.gif'
import bgMusic from './bgMusic'

type MemberPopupProps = {
  isOpen: boolean
  onClose: () => void
  onOpenHelp?: () => void
}

const C = {
  bHi:    '#ffffff',
  bLo:    '#808080',
  bDark:  '#404040',
  winBg:  '#ece9d8',
  raised: '#d4d0c8',
  fieldBg:'#ffffff',
  text:   '#000000',
  barBg:  '#0b0b8b',
  barText:'#ffffff',
  mono:   '"Courier New", Courier, monospace',
  ui:     '"Trebuchet MS", "Segoe UI", sans-serif',
}

const raisedStyle = (invert = false): React.CSSProperties => ({
  border: '2px solid',
  borderColor: invert
    ? `${C.bLo} ${C.bHi} ${C.bHi} ${C.bLo}`
    : `${C.bHi} ${C.bLo} ${C.bLo} ${C.bHi}`,
})

const SectionBar = ({ label }: { label: string }) => (
  <div style={{
    background: C.barBg, padding: '2px 6px 3px',
    color: C.barText, fontSize: 12, fontWeight: 700,
    fontFamily: C.ui, userSelect: 'none',
  }}>
    {label}
  </div>
)

const InstagramBtn = ({ username }: { username: string }) => (
  <a
    href={`https://instagram.com/${username}`}
    target="_blank" rel="noopener noreferrer"
    title={`@${username}`}
    style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: 34, height: 34,
      border: '2px solid',
      borderColor: `${C.bHi} ${C.bDark} ${C.bDark} ${C.bHi}`,
      boxShadow: `inset 0 1px 0 rgba(255,255,255,0.8)`,
      background: 'linear-gradient(135deg, #f9ce34 0%, #ee2a7b 50%, #6228d7 100%)',
      cursor: 'pointer', textDecoration: 'none', flexShrink: 0,
    }}
  >
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="1" fill="#fff" stroke="none"/>
    </svg>
  </a>
)

const LinkedInBtn = ({ username }: { username: string }) => (
  <a
    href={`https://linkedin.com/in/${username}`}
    target="_blank" rel="noopener noreferrer"
    title={username}
    style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: 34, height: 34,
      border: '2px solid',
      borderColor: `${C.bHi} ${C.bDark} ${C.bDark} ${C.bHi}`,
      boxShadow: `inset 0 1px 0 rgba(255,255,255,0.8)`,
      background: '#0a66c2',
      cursor: 'pointer', textDecoration: 'none', flexShrink: 0,
    }}
  >
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
      <rect x="2" y="9" width="4" height="12"/>
      <circle cx="4" cy="4" r="2"/>
    </svg>
  </a>
)

const MemberPopup = ({ isOpen, onClose, onOpenHelp }: MemberPopupProps) => {
  const [hovered, setHovered] = useState(false)
  const [muted, setMuted]     = useState(false)
  const audioRef              = useRef<HTMLAudioElement | null>(null)

  const fadeAudio = (target: number, duration: number) => {
    const audio = audioRef.current
    if (!audio) return
    const steps    = 20
    const interval = duration / steps
    const delta    = (target - audio.volume) / steps
    let step       = 0
    const timer = setInterval(() => {
      step++
      audio.volume = Math.min(1, Math.max(0, audio.volume + delta))
      if (step >= steps) clearInterval(timer)
    }, interval)
  }

  const toggleMute = () => {
    setMuted(m => {
      const next = !m
      if (audioRef.current) audioRef.current.muted = next
      return next
    })
  }

  /* ── scroll lock ── */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  /* ── keyboard ── */
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  /* ── audio: create once on open, destroy on close ── */
  useEffect(() => {
    if (!isOpen) return

    const audio = new Audio(bgMusic)
    audio.loop   = true
    audio.volume = 0.4
    audio.muted  = muted
    audioRef.current = audio
    audio.play().catch(() => {})

    return () => {
      audio.pause()
      audio.src    = ''   // release the resource
      audioRef.current = null
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])              // ← only open/close triggers this, NOT muted

  /* ── spotify fade via window blur/focus ── */
  useEffect(() => {
    if (!isOpen) return
    const onBlur  = () => fadeAudio(0, 600)
    const onFocus = () => { if (!muted) fadeAudio(0.4, 600) }
    window.addEventListener('blur', onBlur)
    window.addEventListener('focus', onFocus)
    return () => {
      window.removeEventListener('blur', onBlur)
      window.removeEventListener('focus', onFocus)
    }
  }, [isOpen, muted])

  if (!isOpen) return null

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundImage: `url(${BgImage.src})`,
      backgroundSize: 'cover', backgroundPosition: 'center',
    }}>
      <button type="button" aria-label="Close" onClick={onClose} style={{
        position: 'absolute', inset: 0,
        background: 'rgba(0,0,0,0.35)', border: 'none', cursor: 'default',
      }}/>
  return createPortal(
    // PADA BAGIAN INI KAMU BOLEH MENGUBAH STYLE SESUKA HATI KAMU, TAPI JANGAN UBAH STRUKTUR DAN FUNGSI DARI KODE INI AGAR FUNGSI POPUP TETAP BERJALAN DENGAN BAIK
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto px-4">
      <button
        type="button"
        aria-label="Close member detail"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      <div className="border-neutral-cs-10 bg-blue-cs-40 relative z-10 max-h-[100dvh] w-full max-w-[720px] animate-[member-popup-show_200ms_ease-out] overflow-y-auto rounded-2xl border-2 p-6 text-white shadow-xl sm:p-8">
        <button
          type="button"
          aria-label="Close member detail"
          onClick={onClose}
          className="border-neutral-cs-10 hover:bg-neutral-cs-10/10 absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border text-xl leading-none"
        >
          x
        </button>

        <div className="border-neutral-cs-10/40 mb-5 overflow-hidden rounded-2xl border">
          <Image src={ProfileImage} alt="Profile Image" className="h-120 w-full object-cover object-center" />
        </div>

      <div style={{
        position: 'relative', zIndex: 10, width: 480,
        maxHeight: '90vh', overflowY: 'auto',
        outline: `1px solid #0a246a`,
        border: '2px solid',
        borderColor: `${C.bHi} ${C.bDark} ${C.bDark} ${C.bHi}`,
        boxShadow: `1px 1px 0 #0a246a`,
        background: C.winBg, fontFamily: C.mono,
      }}>

        {/* Title bar */}
        <div style={{
          background: `linear-gradient(180deg,#0a246a 0%,#3169c4 6%,#2558b0 15%,#1d4fa3 50%,#1a47a0 94%,#0a246a 100%)`,
          padding: '3px 3px 3px 6px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          userSelect: 'none',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 16, height: 16, background: 'linear-gradient(135deg,#aef,#48f)', border: '1px solid rgba(255,255,255,0.4)', flexShrink: 0 }}/>
            <span style={{ color: '#fff', fontSize: 12, fontWeight: 700, fontFamily: `"Trebuchet MS",sans-serif`, textShadow: '1px 1px 1px rgba(0,0,0,0.5)' }}>
              verdya.exe
            </span>
          </div>
          <div style={{ display: 'flex', gap: 2 }}>
            <button type="button" onClick={onOpenHelp} title="Play yesterday's Wordle" style={{
              width: 21, height: 21, padding: 0,
              background: 'linear-gradient(180deg,#e8e6e0 0%,#cdc9c0 100%)',
              border: '1px solid', borderColor: `${C.bHi} ${C.bDark} ${C.bDark} ${C.bHi}`,
              boxShadow: `inset 1px 1px 0 rgba(255,255,255,0.9)`,
              color: '#000', fontSize: 11, fontWeight: 900,
              fontFamily: `"Trebuchet MS",sans-serif`,
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>?</button>
            <button type="button" onClick={onClose} style={{
              width: 21, height: 21, padding: 0,
              background: 'linear-gradient(180deg,#e8e6e0 0%,#cdc9c0 100%)',
              border: '1px solid', borderColor: `${C.bHi} ${C.bDark} ${C.bDark} ${C.bHi}`,
              boxShadow: `inset 1px 1px 0 rgba(255,255,255,0.9)`,
              color: '#000', fontSize: 11, fontWeight: 900,
              fontFamily: `"Trebuchet MS",sans-serif`,
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>X</button>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '8px', display: 'flex', flexDirection: 'column', gap: 6, background: C.winBg }}>

          {/* Photo hover swap */}
          <div
            style={{ position: 'relative', lineHeight: 0, ...raisedStyle() }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <Image src={ProfileImage} alt="Profile" width={464} height={280} style={{
              width: '100%', height: 280, objectFit: 'cover', objectPosition: 'center', display: 'block',
              opacity: hovered ? 0 : 1, transition: 'opacity 0.35s ease',
            }}/>
            <Image src={ProfileImageAlt} alt="Profile Alt" width={464} height={280} style={{
              position: 'absolute', inset: 0,
              width: '100%', height: 280, objectFit: 'cover', objectPosition: 'center', display: 'block',
              opacity: hovered ? 1 : 0, transition: 'opacity 0.35s ease',
            }}/>
          </div>

          {/* Name plate */}
          <div style={{ ...raisedStyle(), background: C.raised, padding: '6px 10px 8px' }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: C.text, fontFamily: C.mono, letterSpacing: 0.5 }}>
              I Ketut Weda Adikusuma
            </div>
            <div style={{
              marginTop: 4,
              border: '2px solid', borderColor: `${C.bLo} ${C.bHi} ${C.bHi} ${C.bLo}`,
              background: C.fieldBg, padding: '3px 8px', display: 'inline-block',
            }}>
              <span style={{ fontSize: 13, fontFamily: C.mono, color: C.text }}>5027251061 – Denpasar</span>
            </div>
          </div>

          {/* Social icons */}
          <div style={{ display: 'flex', gap: 4, padding: '2px 0' }}>
            <InstagramBtn username="wedaislost" />
            <LinkedInBtn username="weda-adikusuma-a5264a379" />
          </div>

          {/* Notes */}
          <div style={{ ...raisedStyle(), overflow: 'hidden' }}>
            <SectionBar label="Notes" />
            <div style={{
              background: C.fieldBg, border: `1px solid #7f9db9`,
              margin: 4, padding: '6px 8px',
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px',
              fontSize: 12, fontFamily: C.mono, color: C.text, lineHeight: 1.65,
            }}>
              <div>
                <div style={{ fontWeight: 700, marginBottom: 2 }}>Hobi</div>
                <div>1. Obsessing over rabbit holes</div>
                <div>2. Design</div>
                <div>3. Animating</div>
                <div>4. Building semi-useless stuff and shipping them</div>
              </div>
              <div>
                <div style={{ fontWeight: 700, marginBottom: 2 }}>Fun-fact</div>
                <div>1. Deep sleeper</div>
                <div>2. Pokoknya caffeine</div>
                <div>3. Jack of all trades, master of none.</div>
              </div>
            </div>
          </div>

          {/* Player */}
          <div style={{ ...raisedStyle(), overflow: 'hidden' }}>
            <SectionBar label="Player" />
            <div style={{ background: C.raised, padding: '8px', minHeight: 90 }}>
              <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/3ZDeWNiSmXUFr98iTQKf0p?si=c605ddabe8ef4aee" />
            </div>
          </div>

          {/* Status bar / mute button */}
          <button
            type="button"
            onClick={toggleMute}
            style={{
              ...raisedStyle(true),
              background: C.raised,
              padding: '2px 6px',
              fontSize: 11,
              fontFamily: C.ui,
              color: '#444',
              cursor: 'pointer',
              width: '100%',
              textAlign: 'left',
              border: '2px solid',
              borderColor: `${C.bLo} ${C.bHi} ${C.bHi} ${C.bLo}`,
            }}
          >
            {muted ? '🔇 Unmute' : '🔊 Mute'}
          </button>

        </div>
      </div>
    </div>,
    document.body
  )
}

export default MemberPopup
