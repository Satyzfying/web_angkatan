'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'

import Image from 'next/image'

import { createPortal } from 'react-dom'

import Instagram from '@/components/atoms/button/InstagramButtonLink'
import LinkedInButtonLink from '@/components/atoms/button/LinkedInButtonLink'
import SpotifyEmbed from '@/components/molecules/SpotifyEmbed'

import styles from './MemberPopup.module.css'
import ProfileImage from './image.png'

type MemberPopupProps = {
  isOpen: boolean
  onClose: () => void
}

const QUOTE = `"Being nice is important, being a bitch is surviving."`

const STATS = [
  {
    label: 'Introverted',
    value: 58,
    color: '#22d3ee',
    shadow: 'rgba(34,211,238,0.8)',
    roast: 'needs 3 days to recover from one hangout 💀'
  },
  {
    label: 'Extroverted',
    value: 52,
    color: '#60a5fa',
    shadow: 'rgba(96,165,250,0.8)',
    roast: 'extrovert era... for exactly 20 minutes then bye 👋'
  },
  {
    label: 'Asbun',
    value: 89,
    color: '#c084fc',
    shadow: 'rgba(192,132,252,0.8)',
    roast: 'speaks first, thinks never. legend behavior 🎤'
  },
  { label: 'Dream', value: 92, color: '#f472b6', shadow: 'rgba(244,114,182,0.8)', roast: 'dreams big, naps bigger 🌙' },
  {
    label: 'Budget Left',
    value: 3,
    color: '#f87171',
    shadow: undefined,
    roast: 'literally surviving on prayers and free campus wifi 🙏'
  },
  {
    label: 'Coding Skill',
    value: 76,
    color: '#4ade80',
    shadow: 'rgba(74,222,128,0.8)',
    roast: 'could ship it. will it compile? mystery 🎲'
  }
]

const SONGS = [
  {
    title: 'Chk Chk Boom',
    artist: 'Stray Kids',
    spotifyUrl: 'https://open.spotify.com/track/09keT5ocFhEd5W5HidiUNq?si=5wvA8QLFQNqIe0BGVHlKcA',
    color: '#c084fc'
  },
  {
    title: 'Tricky House',
    artist: 'xikers',
    spotifyUrl: 'https://open.spotify.com/track/2MeEPaL5HsW9njvrtP0Agj?si=qR80JTheQcmXgHdg-2IozQ',
    color: '#60a5fa'
  },
  {
    title: 'Arriba',
    artist: 'ATEEZ',
    spotifyUrl: 'https://open.spotify.com/track/5wZu9Hw69jORB2OxeX3qC6?si=WE8MD5YLRA-MRZdNWv_lag',
    color: '#f472b6'
  }
]

const ASK_RESPONSES: Record<string, string[]> = {
  mood: [
    'Stable. Keyword: stable. Not good, not bad. Stable.',
    'Currently running on 12% battery and sheer delusion.',
    'Mood: loading... please wait... still loading...',
    'Somewhere between "I got this" and "what is happening".',
    'Wow, you are very patient. Still loading...'
  ],
  recommend: [
    'Chk Chk Boom - Stray Kids. Non-negotiable.',
    'Listen to Arriba by ATEEZ and tell me ur not gaslit into feeling powerful.',
    "Tricky House - Xikers. U won't regret it. Probably.",
    "Whatever's on my queue rn. I have taste, trust me.",
    "What? 3 playlists aren't enough??",
    "If you're asking movies, Maze Runners are my top lists",
    "What? Harwy Po'er?",
    'I recommend you go outside and touch grass'
  ],
  advice: [
    'Being nice is important. Being a bitch is surviving. Pick your moment.',
    'Sleep. The answer is always sleep.',
    "Just vibe through it. If vibing doesn't work, vibe harder.",
    'Bro just do it. Worst case scenario you fail and that becomes a fun story.'
  ],
  fun: [
    "My stomach genuinely cannot process Soto. It's personal between us.",
    'I once stayed up 36 hours gaming. Would do again.',
    'Writing is my therapy. Cheaper and no appointment needed.',
    'Basketball player by spirit, couch player by reality.',
    "Did you know that this question bar has a familiar AI function? Nahh I'm bluffing"
  ],
  default: [
    'hm. interesting question. let me overthink it for 3 days.',
    'skill issue (mine). let me get back to you.',
    'the answer is somewhere between "idk" and "maybe".',
    "my budget is at 3%. can't afford to answer rn 💸",
    'error 404: tejan.exe is currently daydreaming.',
    'CIYEEEE penasaran sama Tejan. Ahaha huekk!',
    'In case you\'re struggling looking for keywords, try type "fun".',
    'In case you\'re struggling looking for keywords, try type "advice".',
    'In case you\'re struggling looking for keywords, try type "recommend".',
    'In case you\'re struggling looking for keywords, try type "mood".'
  ]
}

function getAskResponse(question: string): string {
  const q = question.toLowerCase()
  let pool = ASK_RESPONSES.default
  if (q.includes('mood') || q.includes('feeling') || q.includes('how are')) pool = ASK_RESPONSES.mood
  else if (q.includes('song') || q.includes('music') || q.includes('recommend')) pool = ASK_RESPONSES.recommend
  else if (q.includes('advice') || q.includes('tip') || q.includes('help')) pool = ASK_RESPONSES.advice
  else if (q.includes('fun') || q.includes('fact') || q.includes('tell me')) pool = ASK_RESPONSES.fun
  return pool[Math.floor(Math.random() * pool.length)]
}

function EqualizerBars({ active, color }: { active: boolean; color: string }) {
  return (
    <div className="flex items-end gap-[2px]" style={{ height: 16 }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className={`${styles.eqBar} ${active ? styles.eqBarActive : ''}`}
          style={{
            backgroundColor: color,
            height: active ? undefined : 3,
            boxShadow: active ? `0 0 6px ${color}` : undefined
          }}
        />
      ))}
    </div>
  )
}

const MemberPopup = ({ isOpen, onClose }: MemberPopupProps) => {
  const [loaded, setLoaded] = useState(false)
  const [typedQuote, setTypedQuote] = useState('')
  const [activeRoastIdx, setActiveRoastIdx] = useState<number | null>(null)
  const [activeSongIdx, setActiveSongIdx] = useState<number | null>(null)
  const [askInput, setAskInput] = useState('')
  const [askAnswer, setAskAnswer] = useState<string | null>(null)
  const [askShaking, setAskShaking] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)
  const typeRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Starfield
  useEffect(() => {
    if (!isOpen || !canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    type Star = { x: number; y: number; r: number; phase: number; speed: number }
    type Meteor = { x: number; y: number; len: number; speed: number; life: number; maxLife: number }

    const stars: Star[] = Array.from({ length: 150 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.4 + 0.2,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.02 + 0.005
    }))
    const meteors: Meteor[] = []
    let frame = 0

    const spawnMeteor = () =>
      meteors.push({
        x: Math.random() * canvas.width * 0.8 + canvas.width * 0.1,
        y: Math.random() * canvas.height * 0.4,
        len: Math.random() * 90 + 50,
        speed: Math.random() * 5 + 3,
        life: 0,
        maxLife: 45
      })

    const ANGLE = Math.PI / 5
    const dx = Math.cos(ANGLE),
      dy = Math.sin(ANGLE)

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const s of stars) {
        const alpha = 0.25 + 0.55 * (0.5 + 0.5 * Math.sin(s.phase + frame * s.speed))
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(210,225,255,${alpha.toFixed(2)})`
        ctx.fill()
      }
      if (frame % 90 === 0) spawnMeteor()
      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i]
        const t = m.life / m.maxLife
        const alpha = t < 0.4 ? t / 0.4 : 1 - (t - 0.4) / 0.6
        const tailX = m.x - dx * m.len,
          tailY = m.y - dy * m.len
        const grad = ctx.createLinearGradient(tailX, tailY, m.x, m.y)
        grad.addColorStop(0, 'rgba(180,210,255,0)')
        grad.addColorStop(1, `rgba(210,235,255,${(alpha * 0.85).toFixed(2)})`)
        ctx.beginPath()
        ctx.moveTo(tailX, tailY)
        ctx.lineTo(m.x, m.y)
        ctx.strokeStyle = grad
        ctx.lineWidth = 1.5
        ctx.stroke()
        m.x += dx * m.speed
        m.y += dy * m.speed
        m.life++
        if (m.life >= m.maxLife) meteors.splice(i, 1)
      }
      frame++
      animRef.current = requestAnimationFrame(draw)
    }
    animRef.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(animRef.current)
  }, [isOpen])

  // Typing effect
  useEffect(() => {
    if (!isOpen) {
      setTypedQuote('')
      return
    }
    let i = 0
    setTypedQuote('')
    const type = () => {
      if (i <= QUOTE.length) {
        setTypedQuote(QUOTE.slice(0, i))
        i++
        typeRef.current = setTimeout(type, 38)
      }
    }
    typeRef.current = setTimeout(type, 400)
    return () => {
      if (typeRef.current) clearTimeout(typeRef.current)
    }
  }, [isOpen])

  // Bar load + reset
  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => setLoaded(true), 120)
      return () => clearTimeout(t)
    } else {
      setLoaded(false)
      setActiveRoastIdx(null)
      setActiveSongIdx(null)
      setAskInput('')
      setAskAnswer(null)
    }
  }, [isOpen])

  // Keyboard + scroll lock
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [isOpen, onClose])

  const handleBarClick = (idx: number) => {
    setActiveRoastIdx((prev) => (prev === idx ? null : idx))
  }

  const handleSongClick = (idx: number) => {
    setActiveSongIdx((prev) => (prev === idx ? null : idx))
  }

  const handleAsk = useCallback(() => {
    if (!askInput.trim()) {
      setAskShaking(true)
      setTimeout(() => setAskShaking(false), 500)
      return
    }
    setAskAnswer(null)
    setTimeout(() => setAskAnswer(getAskResponse(askInput)), 300)
  }, [askInput])

  if (!isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto px-4">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close member detail"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Card */}
      <div className="relative z-10 max-h-[calc(100vh-9rem)] w-full max-w-[740px] animate-[member-popup-show_200ms_ease-out] overflow-y-auto rounded-2xl border-2 border-white/10 bg-[linear-gradient(135deg,#020617_0%,#0f172a_45%,#1e1b4b_100%)] p-6 text-white shadow-[0_0_60px_rgba(59,130,246,0.3)] sm:max-h-[calc(100vh-10rem)] sm:p-8">
        {/* Starfield canvas */}
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full rounded-2xl"
          style={{ zIndex: 0 }}
        />

        {/* Ambient glows */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-20 -left-20 h-80 w-80 rounded-full bg-cyan-500/15 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-16 right-0 h-64 w-64 rounded-full bg-purple-500/15 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-blue-500/15 blur-3xl"
        />

        {/* Twinkle dots */}
        <div aria-hidden="true" className="absolute top-8 left-8 h-1.5 w-1.5 animate-ping rounded-full bg-cyan-300" />
        <div aria-hidden="true" className="absolute top-36 right-20 h-1 w-1 animate-pulse rounded-full bg-white" />
        <div
          aria-hidden="true"
          className="absolute bottom-28 left-1/2 h-1.5 w-1.5 animate-ping rounded-full bg-blue-300"
        />

        {/* Content */}
        <div className="relative z-10">
          {/* Close button */}
          <button
            type="button"
            aria-label="Close member detail"
            onClick={onClose}
            className="absolute top-0 right-0 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-lg leading-none transition-colors hover:bg-white/10"
          >
            ×
          </button>

          {/* Profile photo */}
          <div className="mb-5 overflow-hidden rounded-2xl border border-white/10">
            <Image
              src={ProfileImage}
              alt="Foto profil Razana Aulia"
              className="h-72 w-full object-cover object-center sm:h-96"
            />
          </div>

          {/* Name & info */}
          <div className="pr-10">
            <h2 className="text-2xl font-black tracking-tight">Razana Aulia - Tejan</h2>
            <p className="mt-1 text-sm font-semibold text-white/60">5027251127 · Jakarta</p>
            <p className="mt-3 min-h-[1.5rem] text-sm text-blue-300 italic">
              {typedQuote}
              <span className="ml-[1px] inline-block h-[0.9em] w-[2px] animate-pulse bg-blue-300 align-middle" />
            </p>
          </div>

          {/* Social links */}
          <div className="mt-4 flex gap-2">
            <Instagram username="ragi.lzr" />
            <LinkedInButtonLink username="razana-aulia-825564365" />
          </div>

          {/* Online status */}
          <div className="mt-4 rounded-xl border border-emerald-400/25 bg-slate-900/50 p-4 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-400" />
              <span className="text-xs font-bold tracking-widest text-emerald-300 uppercase">Online</span>
            </div>
            <p className="mt-2 font-bold">Razana Aulia</p>
            <p className="mt-0.5 text-sm text-slate-300">Last Login : 2 minutes ago</p>
            <p className="mt-1.5 text-sm text-emerald-300 italic">Surviving on vibes and delusion.</p>
          </div>

          {/* ══ MAIN GRID ══ */}
          <div className="mt-5 grid gap-4 text-sm font-semibold sm:grid-cols-2">
            {/* LEFT */}
            <div className="flex flex-col gap-4">
              {/* Hobi */}
              <div className="rounded-xl border border-white/10 p-4">
                <p className="text-xs tracking-wide text-white/50 uppercase">Hobi</p>
                <p className="mt-2">Writing, Gaming, Sleeping, Basketball</p>
              </div>

              {/* Profile RPG */}
              <div className="rounded-xl border border-cyan-400/25 bg-slate-900/50 p-4 backdrop-blur-md">
                <p className="text-xs font-bold tracking-widest text-cyan-300 uppercase">Profile</p>
                <div className="mt-3 space-y-1.5 text-sm">
                  <p>
                    <span className="text-cyan-400">CLASS</span> : Professional Overthinker
                  </p>
                  <p>
                    <span className="text-cyan-400">RARITY</span> : Epic
                  </p>
                  <p>
                    <span className="text-cyan-400">STATUS</span> : Still Surviving
                  </p>
                </div>
              </div>

              {/* System Status + Circuit */}
              <div className="relative overflow-hidden rounded-xl border border-blue-400/25 bg-slate-900/50 p-4 backdrop-blur-md">
                <svg
                  aria-hidden="true"
                  className="pointer-events-none absolute top-0 right-0 h-full w-36 opacity-20"
                  viewBox="0 0 90 160"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <line x1="8" y1="18" x2="55" y2="18" stroke="#38bdf8" strokeWidth="1" />
                  <line x1="8" y1="42" x2="45" y2="42" stroke="#38bdf8" strokeWidth="1" />
                  <line x1="20" y1="68" x2="70" y2="68" stroke="#38bdf8" strokeWidth="1" />
                  <line x1="8" y1="95" x2="58" y2="95" stroke="#38bdf8" strokeWidth="1" />
                  <line x1="28" y1="122" x2="72" y2="122" stroke="#38bdf8" strokeWidth="1" />
                  <line x1="15" y1="145" x2="60" y2="145" stroke="#38bdf8" strokeWidth="1" />
                  <line x1="28" y1="18" x2="28" y2="42" stroke="#38bdf8" strokeWidth="1" />
                  <line x1="45" y1="42" x2="45" y2="68" stroke="#38bdf8" strokeWidth="1" />
                  <line x1="20" y1="68" x2="20" y2="95" stroke="#38bdf8" strokeWidth="1" />
                  <line x1="58" y1="68" x2="58" y2="95" stroke="#38bdf8" strokeWidth="1" />
                  <line x1="40" y1="95" x2="40" y2="122" stroke="#38bdf8" strokeWidth="1" />
                  <line x1="60" y1="122" x2="60" y2="145" stroke="#38bdf8" strokeWidth="1" />
                  <polyline points="8,95 8,122 28,122" fill="none" stroke="#38bdf8" strokeWidth="1" />
                  <polyline points="55,18 70,18 70,68" fill="none" stroke="#38bdf8" strokeWidth="1" />
                  <rect x="31" y="76" width="22" height="16" rx="2" fill="none" stroke="#38bdf8" strokeWidth="1" />
                  <line x1="36" y1="76" x2="36" y2="72" stroke="#38bdf8" strokeWidth="0.8" />
                  <line x1="42" y1="76" x2="42" y2="72" stroke="#38bdf8" strokeWidth="0.8" />
                  <line x1="48" y1="76" x2="48" y2="72" stroke="#38bdf8" strokeWidth="0.8" />
                  <line x1="36" y1="92" x2="36" y2="96" stroke="#38bdf8" strokeWidth="0.8" />
                  <line x1="42" y1="92" x2="42" y2="96" stroke="#38bdf8" strokeWidth="0.8" />
                  <line x1="48" y1="92" x2="48" y2="96" stroke="#38bdf8" strokeWidth="0.8" />
                  <path d="M31 84 a2 2 0 0 1 0-4" fill="none" stroke="#38bdf8" strokeWidth="0.8" />
                  <line x1="15" y1="42" x2="15" y2="50" stroke="#38bdf8" strokeWidth="0.8" />
                  <rect x="12" y="50" width="6" height="12" rx="1" fill="none" stroke="#38bdf8" strokeWidth="0.8" />
                  <line x1="15" y1="62" x2="15" y2="68" stroke="#38bdf8" strokeWidth="0.8" />
                  <circle cx="28" cy="18" r="2.2" fill="#38bdf8" />
                  <circle cx="45" cy="42" r="2.2" fill="#38bdf8" />
                  <circle cx="20" cy="68" r="2.2" fill="#38bdf8" />
                  <circle cx="58" cy="68" r="2.2" fill="#38bdf8" />
                  <circle cx="58" cy="95" r="2.2" fill="#38bdf8" />
                  <circle cx="40" cy="95" r="2.2" fill="#38bdf8" />
                  <circle cx="40" cy="122" r="2.2" fill="#38bdf8" />
                  <circle cx="60" cy="122" r="2.2" fill="#38bdf8" />
                  <circle cx="60" cy="145" r="2.2" fill="#38bdf8" />
                  <circle cx="70" cy="68" r="2.2" fill="#38bdf8" />
                </svg>
                <p className="text-xs font-bold tracking-widest text-blue-300 uppercase">System Status</p>
                <div className="mt-3 space-y-2 text-sm">
                  <p>Mood : Stable</p>
                  <p>Battery : 12%</p>
                  <p>Overthinking : ACTIVE</p>
                  <p>Budget : CRITICAL</p>
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex flex-col gap-4">
              {/* Fun Fact */}
              <div className="rounded-xl border border-white/10 p-4">
                <p className="text-xs tracking-wide text-white/50 uppercase">Fun Fact</p>
                <p className="mt-2">My stomach rejects Soto every single time</p>
              </div>

              {/* Character Sheet */}
              <div className="rounded-xl border border-cyan-400/25 bg-slate-900/50 p-4 backdrop-blur-md">
                <p className="text-xs font-bold tracking-widest text-cyan-300 uppercase">Character Sheet</p>
                <p className="mt-1 text-[10px] tracking-wide text-white/30 uppercase">klik bar buat roast 👆</p>
                <div className="mt-3 space-y-4">
                  {STATS.map(({ label, value, color, shadow, roast }, idx) => (
                    <div key={label}>
                      <div className="mb-1.5 flex justify-between text-xs">
                        <span>{label}</span>
                        <span className="tabular-nums">{value}%</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleBarClick(idx)}
                        className="group w-full text-left focus:outline-none"
                        aria-label={`Klik untuk roast ${label}`}
                      >
                        <div className="h-2.5 overflow-hidden rounded-full bg-slate-700/80 transition-all group-hover:brightness-110">
                          <div
                            className="h-full rounded-full transition-all duration-1000 ease-out"
                            style={{
                              width: loaded ? `${value}%` : '0%',
                              backgroundColor: color,
                              boxShadow: shadow ? `0 0 10px ${shadow}` : undefined
                            }}
                          />
                        </div>
                      </button>
                      {activeRoastIdx === idx && (
                        <p className={`${styles.roastIn} mt-1.5 pl-1 text-[11px] text-white/70 italic`}>→ {roast}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Ask Razana */}
          <div className="mt-4 rounded-xl border border-purple-400/25 bg-slate-900/50 p-4 backdrop-blur-md">
            <div className="mb-3 flex items-center gap-2">
              <span className="text-base">🔮</span>
              <p className="text-xs font-bold tracking-widest text-purple-300 uppercase">Ask Tejan</p>
              <span className="text-[10px] text-white/30">anything. she'll answer. kinda.</span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={askInput}
                onChange={(e) => setAskInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
                placeholder="mood kamu gimana? ada saran lagu?"
                className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white transition-colors placeholder:text-white/25 focus:border-purple-400/50 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAsk}
                className={`rounded-lg border border-purple-400/40 bg-purple-500/20 px-4 py-2 text-sm font-bold text-purple-300 transition-colors hover:bg-purple-500/30 ${askShaking ? styles.shake : ''}`}
              >
                Tanya
              </button>
            </div>
            {askAnswer && (
              <div
                className={`${styles.answerIn} mt-3 rounded-lg border border-purple-400/20 bg-purple-900/20 px-3 py-2.5 text-sm text-purple-200 italic`}
              >
                "{askAnswer}"
              </div>
            )}
          </div>

          {/* Lagu Favorit */}
          <div className="mt-4 rounded-xl border border-blue-400/25 bg-slate-900/50 p-4 backdrop-blur-md">
            <p className="text-xs font-bold tracking-widest text-white/50 uppercase">Lagu Favorit</p>
            <p className="mt-1 text-[10px] tracking-wide text-white/30 uppercase">klik lagu buat expand player 🎵</p>
            <div className="mt-3 space-y-2">
              {SONGS.map((song, idx) => {
                const isActive = activeSongIdx === idx
                return (
                  <div key={song.title}>
                    <button
                      type="button"
                      onClick={() => handleSongClick(idx)}
                      className="flex w-full items-center gap-3 rounded-lg border border-white/5 bg-white/5 px-3 py-2.5 text-left transition-all hover:bg-white/10"
                    >
                      <span className="w-4 flex-shrink-0 text-center text-xs text-white/40">
                        {isActive ? '▶' : idx + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p
                          className="truncate text-sm font-semibold"
                          style={{ color: isActive ? song.color : undefined }}
                        >
                          {song.title}
                        </p>
                        <p className="text-[11px] text-white/40">{song.artist}</p>
                      </div>
                      <EqualizerBars active={isActive} color={song.color} />
                    </button>
                    {isActive && (
                      <div className={`${styles.answerIn} mt-1 overflow-hidden rounded-lg border border-white/5`}>
                        <SpotifyEmbed spotifyUrl={song.spotifyUrl} />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default MemberPopup
