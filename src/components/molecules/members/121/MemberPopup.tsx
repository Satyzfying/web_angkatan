'use client'

import React, { useEffect, useState, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'

import Image from 'next/image'

import Instagram from '@/components/atoms/button/InstagramButtonLink'
import LinkedInButtonLink from '@/components/atoms/button/LinkedInButtonLink'
import SpotifyEmbed from '@/components/molecules/SpotifyEmbed'

import ProfileImage from './image.jpg'

type MemberPopupProps = {
  isOpen: boolean
  onClose: () => void
}

type Question = {
  id: number
  emoji: string
  hint: string
  question: string
  choices: string[]
  answer: string
  points: number
  mobColor: string
}

const QUESTIONS: Question[] = [
  { id: 1, emoji: '🕷️', hint: 'Hostile at night, neutral at day', question: 'Mob ini bisa memanjat dinding dan matanya menyala merah. Siapa dia?', choices: ['Cave Spider', 'Spider', 'Silverfish', 'Endermite'], answer: 'Spider', points: 5, mobColor: '#8B0000' },
  { id: 2, emoji: '💚', hint: 'Ssss... BOOM!', question: 'Mob paling ikonik yang meledak saat mendekat ke player. Namanya?', choices: ['TNT Golem', 'Creeper', 'Ghast', 'Blaze'], answer: 'Creeper', points: 5, mobColor: '#228B22' },
  { id: 3, emoji: '🏹', hint: 'Green + Bow', question: 'Mob undead yang menyerang dari jarak jauh dengan panah. Siapa?', choices: ['Drowned', 'Skeleton', 'Pillager', 'Stray'], answer: 'Skeleton', points: 5, mobColor: '#D3D3D3' },
  { id: 4, emoji: '🌑', hint: 'Jangan tatap matanya', question: 'Mob tinggi gelap yang teleport dan marah kalau kamu menatap matanya langsung?', choices: ['Wither', 'Enderman', 'Vex', 'Phantom'], answer: 'Enderman', points: 10, mobColor: '#1a1a2e' },
  { id: 5, emoji: '🐷', hint: 'Oink oink', question: 'Hewan pasif yang drop porkchop saat dibunuh. Namanya?', choices: ['Hoglin', 'Pig', 'Sow', 'Boar'], answer: 'Pig', points: 5, mobColor: '#FFB6C1' },
  { id: 6, emoji: '🔥', hint: 'Nether + Fire Rod', question: 'Mob nether yang terbang dan menembak bola api. Siapa?', choices: ['Blaze', 'Magma Cube', 'Ghast', 'Strider'], answer: 'Blaze', points: 10, mobColor: '#FF8C00' },
  { id: 7, emoji: '🐺', hint: 'Bisa dijinakkan dengan tulang', question: 'Mob ini bisa dijadikan pet dengan memberikannya tulang. Namanya?', choices: ['Fox', 'Wolf', 'Ocelot', 'Dog'], answer: 'Wolf', points: 5, mobColor: '#A9A9A9' },
  { id: 8, emoji: '💀', hint: '3 kepala + boss bar', question: 'Boss mob yang bisa di-summon dengan 4 soul sand dan 3 wither skeleton skull?', choices: ['Ender Dragon', 'Warden', 'Wither', 'Elder Guardian'], answer: 'Wither', points: 20, mobColor: '#2d2d5e' },
  { id: 9, emoji: '🌊', hint: 'Zombie tapi di air', question: 'Zombie yang bisa hidup di dalam air dan kadang pegang trident?', choices: ['Drowned', 'Zombie', 'Guardian', 'Elder Guardian'], answer: 'Drowned', points: 10, mobColor: '#006994' },
  { id: 10, emoji: '🐄', hint: 'Susu + Steak', question: 'Hewan pasif yang bisa diperah susunya dan drop beef. Siapa?', choices: ['Sheep', 'Goat', 'Cow', 'Mooshroom'], answer: 'Cow', points: 5, mobColor: '#8B4513' },
]

const TARGET_SCORE = 50

const BLOCK_TYPES = [
  { id: 'grass',     emoji: '🟩', label: 'Grass',    color: '#4a7c3f' },
  { id: 'dirt',      emoji: '🟫', label: 'Dirt',     color: '#8B5E3C' },
  { id: 'stone',     emoji: '⬜', label: 'Stone',    color: '#9e9e9e' },
  { id: 'wood',      emoji: '🟧', label: 'Wood',     color: '#b5651d' },
  { id: 'leaves',    emoji: '🌿', label: 'Leaves',   color: '#2d7a27' },
  { id: 'water',     emoji: '🟦', label: 'Water',    color: '#1565c0' },
  { id: 'sand',      emoji: '🟨', label: 'Sand',     color: '#e6c97e' },
  { id: 'lava',      emoji: '🟥', label: 'Lava',     color: '#cc3300' },
  { id: 'obsidian',  emoji: '🟪', label: 'Obsidian', color: '#2a0a3a' },
  { id: 'snow',      emoji: '🤍', label: 'Snow',     color: '#dde8f0' },
  { id: 'glowstone', emoji: '🟡', label: 'Glow',     color: '#ffcc44' },
  { id: 'tnt',       emoji: '💥', label: 'TNT',      color: '#cc0000' },
  { id: 'erase',     emoji: '❌', label: 'Erase',    color: 'transparent' },
]

const GRID_COLS    = 20
const GRID_ROWS    = 12
const TOTAL_HEARTS = 10
const XP_LEVEL     = 19
const XP_PERCENT   = 67

// ─────────────────────────────────────────────────────────────────────────────
// 🎵 GANTI LAGU & VIDEO DI SINI — semua file di /public/assets/videos/
const SONG_SPOTIFY_URL = 'https://open.spotify.com/track/7ovUcF5uHTBRzUpB6ZOmvt?si=9a787a23b8af4511'
const SONG_TITLE       = 'Idol'
const SONG_ARTIST      = 'YOASOBI'
const SONG_AUDIO_SRC   = '/assets/videos/yoasobi.mp3'
const BG_VIDEO_SRC     = '/assets/videos/yoasobivid.mp4'
// ─────────────────────────────────────────────────────────────────────────────

// ── Pixel Heart Full — 10×10 grid, true Minecraft HUD style ──
// Setiap pixel digambar sebagai <rect> 2×2 pada viewBox 20×20
// Grid pixel (row,col) → rect x=col*2, y=row*2
const HEART_PIXELS_FULL: [number, number, string][] = [
  // shadow/outline pixels (dark border)
  [0,1,'#3d0000'],[0,2,'#3d0000'],[0,4,'#3d0000'],[0,5,'#3d0000'],
  [1,0,'#3d0000'],[1,3,'#3d0000'],[1,6,'#3d0000'],
  [2,0,'#3d0000'],[2,7,'#3d0000'],
  [3,0,'#3d0000'],[3,7,'#3d0000'],
  [4,0,'#3d0000'],[4,7,'#3d0000'],
  [5,1,'#3d0000'],[5,6,'#3d0000'],
  [6,2,'#3d0000'],[6,5,'#3d0000'],
  [7,3,'#3d0000'],[7,4,'#3d0000'],
  // red fill body
  [0,2,'#ff0000'],[0,3,'#ff0000'],[0,5,'#ff0000'],[0,6,'#ff0000'],
  [1,1,'#ff0000'],[1,2,'#ff0000'],[1,3,'#ff0000'],[1,4,'#ff0000'],[1,5,'#ff0000'],[1,6,'#ff0000'],
  [2,1,'#ff0000'],[2,2,'#ff0000'],[2,3,'#ff0000'],[2,4,'#ff0000'],[2,5,'#ff0000'],[2,6,'#ff0000'],
  [3,1,'#ff0000'],[3,2,'#ff0000'],[3,3,'#ff0000'],[3,4,'#ff0000'],[3,5,'#ff0000'],[3,6,'#ff0000'],
  [4,1,'#ff0000'],[4,2,'#ff0000'],[4,3,'#ff0000'],[4,4,'#ff0000'],[4,5,'#ff0000'],[4,6,'#ff0000'],
  [5,2,'#ff0000'],[5,3,'#ff0000'],[5,4,'#ff0000'],[5,5,'#ff0000'],
  [6,3,'#ff0000'],[6,4,'#ff0000'],
  // highlight (lighter top-left)
  [1,1,'#ff6e6e'],[1,2,'#ff6e6e'],
  [2,1,'#ff4444'],[2,2,'#ff4444'],
  [1,4,'#ff6e6e'],[1,5,'#ff6e6e'],
  // deep shadow bottom-right
  [4,5,'#cc0000'],[4,6,'#cc0000'],
  [5,4,'#cc0000'],[5,5,'#cc0000'],
]

const HEART_PIXELS_EMPTY: [number, number, string][] = [
  [0,1,'#2a0a0a'],[0,2,'#2a0a0a'],[0,4,'#2a0a0a'],[0,5,'#2a0a0a'],
  [1,0,'#2a0a0a'],[1,3,'#2a0a0a'],[1,6,'#2a0a0a'],
  [2,0,'#2a0a0a'],[2,7,'#2a0a0a'],
  [3,0,'#2a0a0a'],[3,7,'#2a0a0a'],
  [4,0,'#2a0a0a'],[4,7,'#2a0a0a'],
  [5,1,'#2a0a0a'],[5,6,'#2a0a0a'],
  [6,2,'#2a0a0a'],[6,5,'#2a0a0a'],
  [7,3,'#2a0a0a'],[7,4,'#2a0a0a'],
  // dim fill
  [1,1,'#1a0505'],[1,2,'#1a0505'],[1,3,'#1a0505'],[1,4,'#1a0505'],[1,5,'#1a0505'],[1,6,'#1a0505'],
  [2,1,'#1a0505'],[2,2,'#1a0505'],[2,3,'#1a0505'],[2,4,'#1a0505'],[2,5,'#1a0505'],[2,6,'#1a0505'],
  [3,1,'#1a0505'],[3,2,'#1a0505'],[3,3,'#1a0505'],[3,4,'#1a0505'],[3,5,'#1a0505'],[3,6,'#1a0505'],
  [4,1,'#1a0505'],[4,2,'#1a0505'],[4,3,'#1a0505'],[4,4,'#1a0505'],[4,5,'#1a0505'],[4,6,'#1a0505'],
  [5,2,'#1a0505'],[5,3,'#1a0505'],[5,4,'#1a0505'],[5,5,'#1a0505'],
  [6,3,'#1a0505'],[6,4,'#1a0505'],
]

// Pixel heart SVG — viewBox 16×14 (8 cols × 7 rows, each pixel = 2×2)
const HeartFull = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size * 0.875} viewBox="0 0 16 14"
    style={{ imageRendering: 'pixelated', display: 'block', shapeRendering: 'crispEdges' }}>
    {HEART_PIXELS_FULL.map(([row, col, color], i) => (
      <rect key={i} x={col * 2} y={row * 2} width={2} height={2} fill={color} />
    ))}
  </svg>
)

const HeartEmpty = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size * 0.875} viewBox="0 0 16 14"
    style={{ imageRendering: 'pixelated', display: 'block', shapeRendering: 'crispEdges' }}>
    {HEART_PIXELS_EMPTY.map(([row, col, color], i) => (
      <rect key={i} x={col * 2} y={row * 2} width={2} height={2} fill={color} />
    ))}
  </svg>
)

// ── Orb border canvas ──
const ORB_COLOR = '#ffaa00'

const OrbBorder = ({ size }: { size: { w: number; h: number } }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef   = useRef<number>(0)
  const tRef      = useRef<number>(Math.random())
  const tailRef   = useRef<{ x: number; y: number }[]>([])
  const MARGIN = 1, TAIL_LEN = 50, ORB_R = 4.5, SPEED = 0.0022

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const W = canvas.width, H = canvas.height
    const x0 = MARGIN, y0 = MARGIN, x1 = W - MARGIN, y1 = H - MARGIN
    const bw = x1 - x0, bh = y1 - y0, perimeter = 2 * (bw + bh)

    const getPos = (t: number) => {
      const dist = ((t % 1) + 1) % 1 * perimeter
      if (dist <= bw)          return { x: x0 + dist,             y: y0 }
      if (dist <= bw + bh)     return { x: x1,                    y: y0 + (dist - bw) }
      if (dist <= bw * 2 + bh) return { x: x1 - (dist - bw - bh), y: y1 }
      return                          { x: x0,                    y: y1 - (dist - bw * 2 - bh) }
    }

    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      tRef.current += SPEED
      const pos = getPos(tRef.current)
      tailRef.current.push({ x: pos.x, y: pos.y })
      if (tailRef.current.length > TAIL_LEN) tailRef.current.shift()

      for (let i = 0; i < tailRef.current.length; i++) {
        const p = tailRef.current[i], progress = i / tailRef.current.length
        const r = (ORB_R * 0.6) * progress
        if (r <= 0.3) continue
        const alpha = progress * 0.7
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r + 2)
        const hex = Math.round(alpha * 255).toString(16).padStart(2, '0')
        grad.addColorStop(0, `${ORB_COLOR}${hex}`); grad.addColorStop(1, `${ORB_COLOR}00`)
        ctx.beginPath(); ctx.arc(p.x, p.y, r + 2, 0, Math.PI * 2); ctx.fillStyle = grad; ctx.fill()
      }
      const aura = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, ORB_R * 3.2)
      aura.addColorStop(0, `${ORB_COLOR}55`); aura.addColorStop(0.5, `${ORB_COLOR}18`); aura.addColorStop(1, `${ORB_COLOR}00`)
      ctx.beginPath(); ctx.arc(pos.x, pos.y, ORB_R * 3.2, 0, Math.PI * 2); ctx.fillStyle = aura; ctx.fill()
      const core = ctx.createRadialGradient(pos.x - 1, pos.y - 1, 0, pos.x, pos.y, ORB_R)
      core.addColorStop(0, '#ffffff'); core.addColorStop(0.35, ORB_COLOR); core.addColorStop(1, `${ORB_COLOR}aa`)
      ctx.beginPath(); ctx.arc(pos.x, pos.y, ORB_R, 0, Math.PI * 2)
      ctx.fillStyle = core; ctx.shadowColor = ORB_COLOR; ctx.shadowBlur = 12; ctx.fill(); ctx.shadowBlur = 0
      animRef.current = requestAnimationFrame(draw)
    }
    animRef.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(animRef.current)
  }, [size.w, size.h])

  return (
    <canvas ref={canvasRef} width={size.w} height={size.h}
      style={{ position: 'absolute', top: 0, left: 0, width: size.w, height: size.h, pointerEvents: 'none', zIndex: 20 }} />
  )
}

const OrbBox = ({ children, style, className, onMouseEnter, onMouseLeave }: {
  children: React.ReactNode; style?: React.CSSProperties; className?: string
  onMouseEnter?: () => void; onMouseLeave?: () => void
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ w: 0, h: 0 })
  useEffect(() => {
    if (!ref.current) return
    const ro = new ResizeObserver(entries => {
      for (const e of entries) setSize({ w: Math.round(e.borderBoxSize?.[0]?.inlineSize ?? e.contentRect.width), h: Math.round(e.borderBoxSize?.[0]?.blockSize ?? e.contentRect.height) })
    })
    ro.observe(ref.current); return () => ro.disconnect()
  }, [])
  return (
    <div ref={ref} className={className} style={{ position: 'relative', ...style }} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      {size.w > 0 && size.h > 0 && <OrbBorder size={size} />}
      {children}
    </div>
  )
}

// ── XP Bar ──
const XpBar = ({ level, percent, animated }: { level: number; percent: number; animated: boolean }) => {
  const [displayPct, setDisplayPct] = useState(0)
  useEffect(() => {
    if (!animated) return
    const start = Date.now(), duration = 1200
    const tick = () => {
      const p = Math.min((Date.now() - start) / duration, 1)
      setDisplayPct(Math.round((1 - Math.pow(1 - p, 3)) * percent))
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [animated, percent])
  return (
    <div style={{ marginTop: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3 }}>
        <span style={{ fontFamily: '"Courier New",monospace', fontSize: 8, color: '#444422', letterSpacing: '0.08em', textTransform: 'uppercase' }}>✦ Experience</span>
        <span style={{ fontFamily: '"Press Start 2P","Courier New",monospace', fontSize: 7, color: '#88ff44', textShadow: '0 0 6px rgba(136,255,68,0.6)', letterSpacing: '0.06em' }}>LVL {level}</span>
      </div>
      <div style={{ position: 'relative', height: 10, background: '#1a1a08', outline: '2px solid #2a2a10', boxShadow: 'inset 0 2px 0 rgba(0,0,0,0.5)', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: `${displayPct}%`, background: 'linear-gradient(180deg,#a0ff30 0%,#88ee20 40%,#5acc00 100%)', boxShadow: '0 0 8px rgba(136,255,68,0.6),inset 0 1px 0 rgba(255,255,255,0.35)', transition: 'width 0.1s linear' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `repeating-linear-gradient(90deg,transparent,transparent calc(${100/30}% - 1px),rgba(0,0,0,0.35) calc(${100/30}% - 1px),rgba(0,0,0,0.35) ${100/30}%)`, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'rgba(255,255,255,0.12)', pointerEvents: 'none' }} />
      </div>
      <div style={{ textAlign: 'right', marginTop: 2 }}>
        <span style={{ fontFamily: '"Courier New",monospace', fontSize: 8, color: '#557722', letterSpacing: '0.06em' }}>{displayPct}% to level {level + 1}</span>
      </div>
    </div>
  )
}

// ── Mute Button ──
const MuteButton = ({ muted, onToggle }: { muted: boolean; onToggle: () => void }) => {
  const [hov, setHov] = useState(false)
  return (
    <button onClick={onToggle} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} title={muted ? 'Unmute' : 'Mute'}
      style={{ display: 'flex', alignItems: 'center', gap: 6, background: muted ? '#1a0a0a' : '#0a1a0a', outline: muted ? '2px solid #aa3333' : '2px solid #33aa55', boxShadow: hov ? (muted ? '0 0 10px rgba(200,50,50,0.4)' : '0 0 10px rgba(50,200,80,0.4)') : 'inset 1px 1px 0 rgba(255,255,255,0.05)', border: 'none', borderRadius: 0, cursor: 'pointer', padding: '5px 10px', transition: 'all 0.15s', transform: hov ? 'translateY(-1px)' : 'translateY(0)' }}>
      <svg width={14} height={14} viewBox="0 0 14 14" style={{ imageRendering: 'pixelated', flexShrink: 0 }}>
        <rect x="1" y="4" width="3" height="6" fill={muted ? '#aa4444' : '#44aa66'} />
        <rect x="4" y="2" width="3" height="10" fill={muted ? '#cc5555' : '#55cc88'} />
        {muted ? (<><rect x="8" y="4" width="2" height="2" fill="#ff5555" /><rect x="10" y="6" width="2" height="2" fill="#ff5555" /><rect x="8" y="8" width="2" height="2" fill="#ff5555" /><rect x="10" y="4" width="2" height="2" fill="#ff5555" /><rect x="8" y="6" width="2" height="2" fill="#dd3333" /><rect x="10" y="8" width="2" height="2" fill="#dd3333" /></>)
        : (<><rect x="8" y="5" width="1" height="4" fill="#66ffaa" /><rect x="10" y="3" width="1" height="8" fill="#44ee88" /><rect x="12" y="1" width="1" height="12" fill="#22cc66" opacity="0.7" /></>)}
      </svg>
      <span style={{ fontFamily: '"Press Start 2P","Courier New",monospace', fontSize: 7, color: muted ? '#ff6666' : '#66ffaa', textShadow: muted ? '0 0 6px rgba(255,100,100,0.5)' : '0 0 6px rgba(100,255,170,0.5)', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
        {muted ? 'MUTED' : 'MUSIC ON'}
      </span>
    </button>
  )
}

type GamePhase   = 'game' | 'builder' | 'profile'
type AnswerState = 'idle' | 'correct' | 'wrong'

const MemberPopup = ({ isOpen, onClose }: MemberPopupProps) => {
  const [visible,           setVisible]           = useState(false)
  const [animIn,            setAnimIn]            = useState(false)
  const [hoveredBox,        setHoveredBox]        = useState<string | null>(null)
  const [phase,             setPhase]             = useState<GamePhase>('game')
  const [profileRevealStep, setProfileRevealStep] = useState(0)
  const [heartsVisible,     setHeartsVisible]     = useState(0)
  const [xpAnimated,        setXpAnimated]        = useState(false)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [muted, setMuted] = useState(false)

  const [currentQ,       setCurrentQ]       = useState(0)
  const [score,          setScore]          = useState(0)
  const [answerState,    setAnswerState]    = useState<AnswerState>('idle')
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null)
  const [unlocked,       setUnlocked]       = useState(false)
  const [questionOrder,  setQuestionOrder]  = useState<number[]>([])
  const [floats,         setFloats]         = useState<{ id: number; pts: number; correct: boolean }[]>([])
  const [floatId,        setFloatId]        = useState(0)
  const [streak,         setStreak]         = useState(0)

  const [grid,          setGrid]          = useState<(string | null)[][]>(() => Array.from({ length: GRID_ROWS }, () => Array(GRID_COLS).fill(null)))
  const [selectedBlock, setSelectedBlock] = useState<string>('grass')
  const [isPainting,    setIsPainting]    = useState(false)
  const [igHovered,     setIgHovered]     = useState(false)
  const [liHovered,     setLiHovered]     = useState(false)

  // ── init audio ──
  useEffect(() => {
    if (!SONG_AUDIO_SRC) return
    const audio = new Audio(SONG_AUDIO_SRC)
    audio.loop = true; audio.volume = 0.55; audio.preload = 'auto'
    audioRef.current = audio
    return () => { audio.pause(); audio.src = '' }
  }, [])

  // ── play/pause — dipanggil saat user klik "LIHAT PROFIL" sehingga browser izinkan autoplay ──
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !SONG_AUDIO_SRC) return
    if (phase === 'profile') {
      audio.muted = muted
      audio.currentTime = 0
      audio.load()
      audio.play().catch(() => {
        const resumeOnClick = () => { audio.play().catch(() => {}); window.removeEventListener('click', resumeOnClick) }
        window.addEventListener('click', resumeOnClick)
      })
    } else {
      audio.pause(); audio.currentTime = 0
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  const handleToggleMute = useCallback(() => {
    setMuted(prev => { const next = !prev; if (audioRef.current) audioRef.current.muted = next; return next })
  }, [])

  const initGame = useCallback(() => {
    const order = [...Array(QUESTIONS.length).keys()].sort(() => Math.random() - 0.5)
    setQuestionOrder(order); setCurrentQ(0); setScore(0)
    setAnswerState('idle'); setSelectedChoice(null); setUnlocked(false); setStreak(0)
  }, [])

  useEffect(() => {
    if (!isOpen) {
      setAnimIn(false)
      const t = setTimeout(() => {
        setVisible(false); setPhase('game')
        setProfileRevealStep(0); setHeartsVisible(0); setXpAnimated(false)
        initGame()
        if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0 }
      }, 300)
      return () => clearTimeout(t)
    }
    setVisible(true); initGame()
    requestAnimationFrame(() => requestAnimationFrame(() => setAnimIn(true)))
  }, [isOpen])

  useEffect(() => {
    if (phase !== 'profile') return
    setProfileRevealStep(0); setHeartsVisible(0); setXpAnimated(false)
    const timers: ReturnType<typeof setTimeout>[] = []
    timers.push(setTimeout(() => setProfileRevealStep(1), 100))
    timers.push(setTimeout(() => setProfileRevealStep(2), 350))
    timers.push(setTimeout(() => setProfileRevealStep(3), 550))
    timers.push(setTimeout(() => setProfileRevealStep(4), 750))
    timers.push(setTimeout(() => setProfileRevealStep(5), 950))
    for (let i = 1; i <= TOTAL_HEARTS; i++)
      timers.push(setTimeout(() => setHeartsVisible(i), 400 + i * 120))
    timers.push(setTimeout(() => setXpAnimated(true), 400 + TOTAL_HEARTS * 120 + 200))
    return () => timers.forEach(clearTimeout)
  }, [phase])

  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', handleKeyDown) }
  }, [isOpen, onClose])

  const question = questionOrder.length > 0 ? QUESTIONS[questionOrder[currentQ % questionOrder.length]] : null
  const totalQ   = QUESTIONS.length

  const handleAnswer = useCallback((choice: string) => {
    if (answerState !== 'idle' || !question) return
    setSelectedChoice(choice)
    const correct = choice === question.answer
    if (correct) {
      const newStreak = streak + 1
      const bonus = newStreak >= 3 ? Math.floor(question.points * 0.5) : 0
      const earned = question.points + bonus
      setStreak(newStreak); setAnswerState('correct')
      setScore(s => { const next = s + earned; if (next >= TARGET_SCORE) setUnlocked(true); return next })
      setFloats(f => [...f, { id: floatId, pts: earned, correct: true }])
      setFloatId(i => i + 1)
      setTimeout(() => setFloats(f => f.filter(x => x.id !== floatId)), 1000)
    } else {
      setStreak(0); setAnswerState('wrong')
      setFloats(f => [...f, { id: floatId, pts: 0, correct: false }])
      setFloatId(i => i + 1)
      setTimeout(() => setFloats(f => f.filter(x => x.id !== floatId)), 900)
    }
    setTimeout(() => { setAnswerState('idle'); setSelectedChoice(null); setCurrentQ(q => q + 1) }, 900)
  }, [answerState, question, streak, floatId])

  const paintBlock = useCallback((row: number, col: number) => {
    setGrid(prev => { const n = prev.map(r => [...r]); n[row][col] = selectedBlock === 'erase' ? null : selectedBlock; return n })
  }, [selectedBlock])

  const clearGrid = useCallback(() => {
    setGrid(Array.from({ length: GRID_ROWS }, () => Array(GRID_COLS).fill(null)))
  }, [])

  const profileCardStyle = (id: string): React.CSSProperties => ({
    background:  hoveredBox === id ? '#1a1a2e' : '#12121f',
    outline:     hoveredBox === id ? '2px solid rgba(255,170,0,0.5)' : '2px solid #2a2a4a',
    boxShadow:   hoveredBox === id ? 'inset 1px 1px 0 rgba(255,200,80,0.15),0 0 20px rgba(255,170,0,0.12),0 4px 16px rgba(0,0,0,0.5)' : 'inset 1px 1px 0 rgba(255,255,255,0.04),0 2px 8px rgba(0,0,0,0.4)',
    borderRadius: 0, cursor: 'default',
    transform:   hoveredBox === id ? 'translateY(-4px) scale(1.018)' : 'translateY(0) scale(1)',
    transition:  'all 0.22s cubic-bezier(0.34,1.56,0.64,1)',
  })

  const revealStyle = (step: number): React.CSSProperties => ({
    opacity:    profileRevealStep >= step ? 1 : 0,
    transform:  profileRevealStep >= step ? 'translateY(0px) scale(1)' : 'translateY(28px) scale(0.97)',
    transition: 'opacity 0.45s cubic-bezier(0.22,1,0.36,1),transform 0.45s cubic-bezier(0.34,1.56,0.64,1)',
  })

  if (!visible) return null

  const progress = Math.min((score / TARGET_SCORE) * 100, 100)
  const qIndex   = currentQ % totalQ

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto px-4 pt-28 pb-8 sm:pt-32"
      style={{ opacity: animIn ? 1 : 0, transition: 'opacity 0.3s ease', fontFamily: '"Courier New",Courier,monospace' }}>

      {/* ── Video background — path diperbaiki ke /assets/videos/ ── */}
      <div className="absolute inset-0">
        <video autoPlay loop muted playsInline className="w-full h-full object-cover">
          <source src={BG_VIDEO_SRC} type="video/mp4" />
        </video>
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center,rgba(8,12,30,0.78) 0%,rgba(3,5,16,0.96) 100%)' }} />
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.07) 2px,rgba(0,0,0,0.07) 4px)', zIndex: 1 }} />
      </div>

      <button type="button" aria-label="Close" onClick={onClose} className="absolute inset-0" style={{ background: 'transparent', zIndex: 1 }} />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ zIndex: 1, backgroundImage: `repeating-linear-gradient(0deg,transparent,transparent 31px,rgba(80,80,160,0.03) 31px,rgba(80,80,160,0.03) 32px),repeating-linear-gradient(90deg,transparent,transparent 31px,rgba(80,80,160,0.03) 31px,rgba(80,80,160,0.03) 32px)` }} />
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

      {floats.map(f => (
        <div key={f.id} className="pointer-events-none fixed" style={{ left: '50%', top: '40%', zIndex: 9999, color: f.correct ? '#44ffaa' : '#ff4444', fontWeight: 900, fontSize: f.pts >= 15 ? 28 : 22, textShadow: f.correct ? '0 0 14px rgba(68,255,170,0.9),2px 2px 0 #000' : '0 0 10px rgba(255,68,68,0.8),2px 2px 0 #000', animation: 'mcFloatUp 1s cubic-bezier(0.22,1,0.36,1) forwards', transform: 'translateX(-50%)', pointerEvents: 'none' }}>
          {f.correct ? `+${f.pts} ✔` : '✘ WRONG'}
        </div>
      ))}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
        @keyframes mcFloatUp{0%{opacity:1;transform:translateX(-50%) translateY(0) scale(1.3);}15%{transform:translateX(-50%) translateY(-8px) scale(1);}100%{opacity:0;transform:translateX(-50%) translateY(-70px) scale(0.85);}}
        @keyframes unlockPulse{0%,100%{box-shadow:0 0 16px rgba(0,220,0,0.5),0 0 40px rgba(0,180,0,0.2);background:linear-gradient(135deg,#003800,#005500,#003800);}50%{box-shadow:0 0 28px rgba(0,255,0,0.7),0 0 64px rgba(0,220,0,0.35);background:linear-gradient(135deg,#004800,#007700,#004800);}}
        @keyframes questionSlideIn{0%{opacity:0;transform:translateX(30px);}100%{opacity:1;transform:translateX(0);}}
        @keyframes correctFlash{0%,100%{background:#003300;outline-color:#00aa44;}50%{background:#005500;outline-color:#00ff88;box-shadow:0 0 20px rgba(0,255,100,0.4);}}
        @keyframes wrongShake{0%,100%{transform:translateX(0);}20%{transform:translateX(-6px);}40%{transform:translateX(6px);}60%{transform:translateX(-4px);}80%{transform:translateX(4px);}}
        @keyframes streakBounce{0%{transform:scale(1);}50%{transform:scale(1.3);}100%{transform:scale(1);}}
        @keyframes titleBlink{0%,49%{opacity:1;}50%,100%{opacity:0.65;}}
        @keyframes progressGlow{0%,100%{box-shadow:0 0 6px rgba(68,255,136,0.4);}50%{box-shadow:0 0 14px rgba(68,255,136,0.7);}}
        @keyframes builderFadeIn{0%{opacity:0;transform:translateY(12px);}100%{opacity:1;transform:translateY(0);}}
        @keyframes photoReveal{0%{opacity:0;filter:brightness(3) saturate(0) blur(4px);transform:scale(1.04);}40%{opacity:1;filter:brightness(1.4) saturate(0.6) blur(1px);transform:scale(1.01);}100%{opacity:1;filter:brightness(1) saturate(1) blur(0);transform:scale(1);}}
        @keyframes labelShimmer{0%,100%{color:#ffaa00;text-shadow:1px 1px 0 #553300;}50%{color:#ffdd55;text-shadow:0 0 8px rgba(255,220,80,0.7),1px 1px 0 #553300;}}
        @keyframes nameShimmerSweep{0%{background-position:-250% center;}100%{background-position:250% center;}}
        @keyframes namePulseGlow{0%,100%{filter:drop-shadow(0 0 4px rgba(45,212,191,0.5)) drop-shadow(2px 2px 0 rgba(0,0,0,0.9));}50%{filter:drop-shadow(0 0 12px rgba(45,212,191,0.95)) drop-shadow(0 0 24px rgba(45,212,191,0.4)) drop-shadow(2px 2px 0 rgba(0,0,0,0.9));}}
        @keyframes whiteNameGlow{0%,100%{filter:drop-shadow(0 0 3px rgba(255,255,255,0.3)) drop-shadow(2px 2px 0 rgba(0,0,0,0.9));}50%{filter:drop-shadow(0 0 8px rgba(255,255,255,0.7)) drop-shadow(2px 2px 0 rgba(0,0,0,0.9));}}
        @keyframes popupFadeIn{0%{opacity:0;transform:translateX(-50%) translateY(6px) scale(0.94);}100%{opacity:1;transform:translateX(-50%) translateY(0) scale(1);}}
        @keyframes musicBarBounce{0%,100%{height:4px;}50%{height:12px;}}

        /* ── Heart pixel pop animation ── */
        @keyframes heartPixelPop{
          0%  { transform: scale(0) rotate(-15deg); opacity: 0; filter: brightness(3); }
          40% { transform: scale(1.5) rotate(6deg);  opacity: 1; filter: brightness(1.8); }
          65% { transform: scale(0.85) rotate(-3deg); filter: brightness(1.2); }
          80% { transform: scale(1.1) rotate(1deg);  filter: brightness(1.05); }
          100%{ transform: scale(1)   rotate(0deg);  opacity: 1; filter: brightness(1); }
        }
        @keyframes heartPixelGlow{
          0%,100%{ filter: drop-shadow(0 0 2px rgba(255,0,0,0.4)); }
          50%    { filter: drop-shadow(0 0 6px rgba(255,80,80,0.9)) drop-shadow(0 0 12px rgba(255,0,0,0.4)); }
        }

        .unlock-btn{animation:unlockPulse 1s ease-in-out infinite;}
        .streak-badge{animation:streakBounce 0.4s ease;}
        .builder-wrap{animation:builderFadeIn 0.35s ease both;}
        .mc-font{font-family:'Press Start 2P','Courier New',monospace !important;}
        .mc-label-shimmer{animation:labelShimmer 2.5s ease-in-out infinite;}
        .mc-name-shiny{font-family:'Press Start 2P','Courier New',monospace;background:linear-gradient(90deg,#2dd4bf 0%,#5eead4 22%,#ccfbf1 38%,#ffffff 46%,#ccfbf1 54%,#5eead4 68%,#2dd4bf 78%,#0d9488 88%,#2dd4bf 100%);background-size:300% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:nameShimmerSweep 2.8s linear infinite,namePulseGlow 2s ease-in-out infinite;display:inline-block;}
        .mc-name-white{font-family:'Press Start 2P','Courier New',monospace;background:linear-gradient(90deg,#c0c0c0 0%,#e8e8e8 22%,#ffffff 38%,#ffffff 46%,#eeeeee 54%,#d0d0d0 68%,#ffffff 80%,#b8b8b8 100%);background-size:300% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:nameShimmerSweep 3.5s linear infinite,whiteNameGlow 2.5s ease-in-out infinite;display:inline-block;}
        .social-popup{position:absolute;bottom:calc(100% + 10px);left:50%;transform:translateX(-50%);background:linear-gradient(135deg,#0d0d22,#111130);outline:2px solid #ffaa00;box-shadow:0 0 20px rgba(255,170,0,0.25),0 8px 24px rgba(0,0,0,0.7),inset 1px 1px 0 rgba(255,200,80,0.1);padding:10px 14px;min-width:160px;pointer-events:none;z-index:100;white-space:nowrap;animation:popupFadeIn 0.2s cubic-bezier(0.34,1.56,0.64,1) both;}
        .social-popup::after{content:'';position:absolute;top:100%;left:50%;transform:translateX(-50%);border:6px solid transparent;border-top-color:#ffaa00;}
        .music-bar{width:3px;background:#44ee88;border-radius:1px;display:inline-block;margin:0 1px;animation:musicBarBounce 0.7s ease-in-out infinite;}
        .heart-filled{animationName:heartPixelPop,heartPixelGlow;animationDuration:0.45s,2s;animationTimingFunction:cubic-bezier(0.34,1.56,0.64,1),ease-in-out;animationFillMode:both,none;animationDelay:0s,0.5s;animationIterationCount:1,infinite;}
      `}</style>

      {/* Main card */}
      <div className="relative w-full max-w-[720px] overflow-y-auto p-6 text-white sm:p-8"
        style={{ background: 'linear-gradient(160deg,#0c0c20ee,#10102aee)', outline: '3px solid #3a3a6a', boxShadow: `inset 1px 1px 0 rgba(120,120,200,0.1),inset -1px -1px 0 rgba(0,0,20,0.6),0 0 0 6px rgba(20,20,50,0.85),0 0 0 9px rgba(40,40,80,0.4),0 8px 48px rgba(0,0,0,0.9)`, maxHeight: 'calc(100vh - 9rem)', zIndex: 10, borderRadius: 0, transform: animIn ? 'translateY(0px) scale(1)' : 'translateY(-40px) scale(0.92)', transition: 'transform 0.35s cubic-bezier(0.34,1.56,0.64,1)', backdropFilter: 'blur(4px)' }}>

        {/* Title bar */}
        <div className="mb-5 flex items-center justify-between px-3 py-2" style={{ background: 'linear-gradient(90deg,rgba(30,30,100,0.4),rgba(15,15,50,0.4))', borderBottom: '1px solid rgba(80,80,160,0.25)', borderTop: '1px solid rgba(100,100,200,0.15)' }}>
          <span style={{ fontWeight: 900, fontSize: '13px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#7777ee', textShadow: '0 0 10px rgba(110,110,255,0.4)', animation: 'titleBlink 2s step-end infinite' }}>
            {phase === 'game' ? '⚔ Minecraft Mob Quiz' : phase === 'builder' ? '🧱 Minecraft Free Builder' : '▶ Player Profile'}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {phase === 'profile' && SONG_AUDIO_SRC && <MuteButton muted={muted} onToggle={handleToggleMute} />}
            <button type="button" aria-label="Close" onClick={onClose} style={{ width: 28, height: 28, background: 'linear-gradient(135deg,#880000,#aa0000)', border: 'none', outline: '2px solid #cc3333', boxShadow: 'inset 1px 1px 0 rgba(255,100,100,0.3),0 0 8px rgba(200,0,0,0.3)', color: '#ffffff', fontWeight: 900, fontSize: '13px', cursor: 'pointer', lineHeight: 1, borderRadius: 0, transition: 'all 0.15s' }} onMouseEnter={e => { e.currentTarget.style.background = 'linear-gradient(135deg,#aa0000,#dd0000)' }} onMouseLeave={e => { e.currentTarget.style.background = 'linear-gradient(135deg,#880000,#aa0000)' }}>✕</button>
          </div>
        </div>

        {/* ===== GAME PHASE ===== */}
        {phase === 'game' && question && (
          <div>
            <div className="mb-4 px-1">
              <div className="flex items-center justify-between mb-2">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ color: '#ffdd00', fontWeight: 900, fontSize: 16, textShadow: '0 0 8px rgba(255,220,0,0.5)' }}>{score}</span>
                  <span style={{ color: '#333355', fontSize: 12 }}>/ {TARGET_SCORE} pts</span>
                  {streak >= 2 && <span className="streak-badge" style={{ background: streak >= 5 ? '#ff4400' : streak >= 3 ? '#ff8800' : '#ffaa00', color: '#000', fontSize: 10, fontWeight: 900, padding: '2px 7px', letterSpacing: '0.1em', outline: '1px solid rgba(255,255,255,0.2)', textShadow: 'none' }}>🔥 {streak}x STREAK</span>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: '#333355', fontSize: 11 }}>Q {(qIndex + 1)}/{totalQ}</span>
                  <button onClick={() => setPhase('builder')} style={{ background: 'transparent', border: 'none', outline: '1px solid #2a2a4a', color: '#444466', fontSize: 10, fontFamily: '"Courier New",monospace', fontWeight: 700, letterSpacing: '0.1em', padding: '3px 8px', cursor: 'pointer', borderRadius: 0, transition: 'all 0.15s' }} onMouseEnter={e => { e.currentTarget.style.color = '#8888aa' }} onMouseLeave={e => { e.currentTarget.style.color = '#444466' }}>skip »</button>
                </div>
              </div>
              <div style={{ height: 8, background: '#07070f', outline: '1px solid #1e1e3a', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${progress}%`, background: unlocked ? 'linear-gradient(90deg,#00bb55,#44ffaa)' : 'linear-gradient(90deg,#1155aa,#44aaff,#88eeff)', transition: 'width 0.5s cubic-bezier(0.34,1.56,0.64,1)', animation: 'progressGlow 2s ease-in-out infinite' }} />
              </div>
            </div>

            {unlocked && (
              <button onClick={() => setPhase('builder')} className="w-full mb-4 py-3 unlock-btn" style={{ border: 'none', outline: '2px solid #00cc44', color: '#00ff88', fontFamily: '"Courier New",monospace', fontWeight: 900, fontSize: 14, letterSpacing: '0.2em', cursor: 'pointer', borderRadius: 0, textShadow: '0 0 12px rgba(0,255,136,0.8)', textTransform: 'uppercase' }}>
                ✦ Profile Unlocked — Build Dulu Baru Lihat! ✦
              </button>
            )}

            <div key={question.id + '-' + currentQ} style={{ background: `linear-gradient(135deg,${question.mobColor}22,#0a0a1a)`, outline: `2px solid ${question.mobColor}55`, boxShadow: `inset 1px 1px 0 rgba(255,255,255,0.04),0 0 20px ${question.mobColor}22`, padding: '20px 18px 16px', marginBottom: 14, animation: 'questionSlideIn 0.3s ease both' }}>
              <div style={{ fontSize: 48, textAlign: 'center', marginBottom: 6, lineHeight: 1 }}>{question.emoji}</div>
              <div style={{ textAlign: 'center', marginBottom: 10 }}>
                <span style={{ fontSize: 10, color: '#888899', letterSpacing: '0.12em', background: 'rgba(255,255,255,0.04)', padding: '2px 10px', outline: '1px solid #2a2a3a', textTransform: 'uppercase' }}>HINT: {question.hint}</span>
              </div>
              <p style={{ color: '#ddddee', fontSize: 14, lineHeight: 1.7, textAlign: 'center', textShadow: '1px 1px 0 #000', letterSpacing: '0.03em' }}>{question.question}</p>
              <div style={{ textAlign: 'center', marginTop: 8 }}>
                <span style={{ fontSize: 11, color: '#ffaa44', fontWeight: 700, textShadow: '0 0 6px rgba(255,170,68,0.5)' }}>+{question.points} pts{streak >= 3 ? ` (+${Math.floor(question.points * 0.5)} streak bonus!)` : ''}</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {question.choices.map((choice, i) => {
                const isSelected = selectedChoice === choice
                const isCorrect  = answerState !== 'idle' && choice === question.answer
                const isWrong    = isSelected && answerState === 'wrong'
                const labels     = ['A', 'B', 'C', 'D']
                return (
                  <button key={choice} onClick={() => handleAnswer(choice)} disabled={answerState !== 'idle'}
                    style={{ background: isCorrect ? '#003300' : isWrong ? '#330000' : '#0e0e1e', outline: isCorrect ? '2px solid #00ff88' : isWrong ? '2px solid #ff4444' : '2px solid #2a2a4a', boxShadow: isCorrect ? '0 0 16px rgba(0,255,136,0.35)' : isWrong ? '0 0 12px rgba(255,68,68,0.3)' : 'inset 1px 1px 0 rgba(255,255,255,0.04)', color: isCorrect ? '#44ffaa' : isWrong ? '#ff6666' : '#aaaacc', fontFamily: '"Courier New",monospace', fontWeight: 700, fontSize: 12, padding: '12px 14px', textAlign: 'left', cursor: answerState !== 'idle' ? 'default' : 'pointer', border: 'none', borderRadius: 0, transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 10, animation: isCorrect ? 'correctFlash 0.6s ease' : isWrong ? 'wrongShake 0.4s ease' : 'none', letterSpacing: '0.04em' }}
                    onMouseEnter={e => { if (answerState !== 'idle') return; e.currentTarget.style.outline = '2px solid #5555aa'; e.currentTarget.style.background = '#14142a'; e.currentTarget.style.color = '#ffffff' }}
                    onMouseLeave={e => { if (answerState !== 'idle') return; e.currentTarget.style.outline = '2px solid #2a2a4a'; e.currentTarget.style.background = '#0e0e1e'; e.currentTarget.style.color = '#aaaacc' }}>
                    <span style={{ minWidth: 22, height: 22, background: isCorrect ? '#00aa44' : isWrong ? '#aa0000' : '#1e1e3a', outline: '1px solid ' + (isCorrect ? '#00ff88' : isWrong ? '#ff4444' : '#333355'), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 900, color: isCorrect ? '#fff' : isWrong ? '#fff' : '#6666aa', flexShrink: 0 }}>
                      {isCorrect ? '✔' : isWrong ? '✘' : labels[i]}
                    </span>
                    {choice}
                  </button>
                )
              })}
            </div>
            <p style={{ color: '#222244', fontSize: 10, textAlign: 'center', marginTop: 12, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Jawab dengan benar &bull; Capai {TARGET_SCORE} poin untuk unlock profil</p>
          </div>
        )}

        {/* ===== BUILDER PHASE ===== */}
        {phase === 'builder' && (
          <div className="builder-wrap">
            <div className="mb-4 px-1">
              <div className="flex items-center justify-between mb-2">
                <span style={{ color: '#44ffaa', fontWeight: 900, fontSize: 13, textShadow: '0 0 8px rgba(68,255,170,0.5)', letterSpacing: '0.12em' }}>🧱 FREE BUILD MODE</span>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={clearGrid} style={{ background: '#1a0505', outline: '1px solid #440000', border: 'none', color: '#ff4444', fontSize: 10, fontFamily: '"Courier New",monospace', fontWeight: 700, letterSpacing: '0.1em', padding: '3px 10px', cursor: 'pointer', borderRadius: 0 }} onMouseEnter={e => { e.currentTarget.style.background = '#2a0808' }} onMouseLeave={e => { e.currentTarget.style.background = '#1a0505' }}>CLEAR</button>
                  <button onClick={() => setPhase('profile')} style={{ background: '#003300', outline: '2px solid #00cc44', border: 'none', color: '#44ffaa', fontSize: 10, fontFamily: '"Courier New",monospace', fontWeight: 900, letterSpacing: '0.12em', padding: '3px 12px', cursor: 'pointer', borderRadius: 0, textShadow: '0 0 6px rgba(68,255,170,0.6)' }} onMouseEnter={e => { e.currentTarget.style.background = '#004400' }} onMouseLeave={e => { e.currentTarget.style.background = '#003300' }}>LIHAT PROFIL »</button>
                </div>
              </div>
              <p style={{ color: '#333355', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Pilih block · klik / drag untuk build · buat apapun sebelum lihat profil</p>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 10, padding: '8px 10px', background: '#07070f', outline: '1px solid #1e1e3a' }}>
              {BLOCK_TYPES.map(b => (
                <button key={b.id} onClick={() => setSelectedBlock(b.id)} title={b.label} style={{ width: 36, height: 36, background: selectedBlock === b.id ? `${b.color}55` : '#0e0e1e', outline: selectedBlock === b.id ? `2px solid ${b.color === 'transparent' ? '#ff4444' : b.color}` : '1px solid #2a2a4a', border: 'none', borderRadius: 0, cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.12s', boxShadow: selectedBlock === b.id ? `0 0 10px ${b.color === 'transparent' ? 'rgba(255,68,68,0.3)' : b.color + '44'}` : 'none', transform: selectedBlock === b.id ? 'scale(1.12)' : 'scale(1)' }} onMouseEnter={e => { if (selectedBlock !== b.id) e.currentTarget.style.outline = '1px solid #5555aa' }} onMouseLeave={e => { if (selectedBlock !== b.id) e.currentTarget.style.outline = '1px solid #2a2a4a' }}>{b.emoji}</button>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${GRID_COLS},1fr)`, gap: 1, background: '#050510', outline: '2px solid #1e1e3a', userSelect: 'none', cursor: 'crosshair', padding: 2 }} onMouseLeave={() => setIsPainting(false)}>
              {grid.map((row, ri) => row.map((cell, ci) => {
                const blockDef = cell ? BLOCK_TYPES.find(b => b.id === cell) : null
                return (
                  <div key={`${ri}-${ci}`} onMouseDown={() => { setIsPainting(true); paintBlock(ri, ci) }} onMouseUp={() => setIsPainting(false)} onMouseEnter={() => { if (isPainting) paintBlock(ri, ci) }} style={{ aspectRatio: '1', background: blockDef ? blockDef.color : '#0a0a18', outline: blockDef ? `1px solid ${blockDef.color}88` : '1px solid #111122', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'crosshair', userSelect: 'none' }}>
                    {blockDef ? <span style={{ fontSize: 7, lineHeight: 1, pointerEvents: 'none' }}>{blockDef.emoji}</span> : null}
                  </div>
                )
              }))}
            </div>
            <p style={{ color: '#222244', fontSize: 10, textAlign: 'center', marginTop: 10, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{GRID_COLS}×{GRID_ROWS} blocks &bull; drag to paint &bull; pilih ❌ untuk hapus block</p>
          </div>
        )}

        {/* ===== PROFILE PHASE ===== */}
        {phase === 'profile' && (
          <div>
            {/* Photo */}
            <div style={{ ...revealStyle(1), marginBottom: 20 }}>
              <OrbBox onMouseEnter={() => setHoveredBox('foto')} onMouseLeave={() => setHoveredBox(null)}
                style={{ outline: hoveredBox === 'foto' ? '2px solid rgba(255,170,0,0.5)' : '2px solid #3a2a1a', boxShadow: hoveredBox === 'foto' ? '0 0 30px rgba(255,170,0,0.2),0 8px 24px rgba(0,0,0,0.6)' : '0 4px 16px rgba(0,0,0,0.5)', transform: hoveredBox === 'foto' ? 'translateY(-4px) scale(1.01)' : 'translateY(0) scale(1)', transition: 'all 0.22s cubic-bezier(0.34,1.56,0.64,1)', overflow: 'hidden' }}>
                <div style={{ animation: profileRevealStep >= 1 ? 'photoReveal 0.9s cubic-bezier(0.22,1,0.36,1) both' : 'none' }}>
                  <Image src={ProfileImage} alt="Profile Image" className="h-120 w-full object-cover object-center" />
                </div>
              </OrbBox>
            </div>

            {/* Name + Hearts + XP */}
            <div style={{ ...revealStyle(2), marginBottom: 20 }}>
              <OrbBox onMouseEnter={() => setHoveredBox('nama')} onMouseLeave={() => setHoveredBox(null)} className="px-3 py-4"
                style={{ background: hoveredBox === 'nama' ? '#0f0f22' : 'linear-gradient(135deg,#07071a,#0d0d22)', outline: hoveredBox === 'nama' ? '2px solid rgba(255,170,0,0.5)' : '2px solid #2a2a4a', boxShadow: hoveredBox === 'nama' ? 'inset 1px 1px 0 rgba(255,200,80,0.12),0 0 20px rgba(255,170,0,0.1),0 4px 16px rgba(0,0,0,0.5)' : 'inset 1px 1px 0 rgba(80,80,160,0.08)', transform: hoveredBox === 'nama' ? 'translateY(-4px) scale(1.015)' : 'translateY(0) scale(1)', transition: 'all 0.22s cubic-bezier(0.34,1.56,0.64,1)' }}>
                <h2 style={{ lineHeight: 1.7, marginBottom: 8, letterSpacing: '0.04em', display: 'flex', flexWrap: 'wrap', gap: '0.3em', alignItems: 'baseline' }}>
                  <span className="mc-name-white" style={{ fontSize: 'clamp(9px,2vw,14px)' }}>Alif</span>
                  <span className="mc-name-shiny"  style={{ fontSize: 'clamp(9px,2vw,14px)' }}>Ramzy</span>
                  <span className="mc-name-white" style={{ fontSize: 'clamp(9px,2vw,14px)' }}>Pasha Firdaus</span>
                </h2>
                <p className="mc-font" style={{ color: '#555577', letterSpacing: '0.04em', fontSize: '7px', lineHeight: 1.8, marginBottom: 12 }}>5027251121 &bull; Surabaya</p>

                {/* ── Pixel Hearts — animasi dikontrol via state, BUKAN animationDelay inline ── */}
                <div style={{ marginBottom: 12 }}>
                  <p style={{ color: '#442222', fontSize: 8, marginBottom: 6, letterSpacing: '0.1em', fontFamily: '"Courier New",monospace', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span style={{ color: '#ff4444', textShadow: '0 0 6px rgba(255,68,68,0.6)' }}>❤</span> Health
                  </p>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', alignItems: 'center' }}>
                    {Array.from({ length: TOTAL_HEARTS }).map((_, i) => {
                      const filled = i < heartsVisible
                      return (
                        <div
                          key={i}
                          style={{
                            display: 'inline-flex',
                            opacity: filled ? 1 : 0.25,
                            // FIX: longhand semua — tidak ada konflik shorthand vs animationDelay
                            animationName:           filled ? 'heartPixelPop, heartPixelGlow' : 'none',
                            animationDuration:        '0.45s, 2s',
                            animationTimingFunction:  'cubic-bezier(0.34,1.56,0.64,1), ease-in-out',
                            animationFillMode:        'both, none',
                            animationDelay:           '0s, 0.5s',
                            animationIterationCount:  '1, infinite',
                          }}
                        >
                          {filled ? <HeartFull size={26} /> : <HeartEmpty size={26} />}
                        </div>
                      )
                    })}
                  </div>
                </div>

                <XpBar level={XP_LEVEL} percent={XP_PERCENT} animated={xpAnimated} />
              </OrbBox>
            </div>

            {/* Social */}
            <div className="mb-5 flex gap-3" style={{ ...revealStyle(3) }}>
              <div style={{ position: 'relative', display: 'inline-block' }} onMouseEnter={() => setIgHovered(true)} onMouseLeave={() => setIgHovered(false)}>
                <Instagram username="ramzyy_pf" />
                {igHovered && (
                  <div className="social-popup">
                    <p className="mc-font" style={{ fontSize: 7, color: '#ff8888', marginBottom: 6, letterSpacing: '0.1em' }}>📸 Instagram</p>
                    <p style={{ fontSize: 11, color: '#ffffff', fontFamily: '"Courier New",monospace', fontWeight: 700 }}>@ramzyy_pf</p>
                    <p style={{ fontSize: 9, color: '#888899', fontFamily: '"Courier New",monospace', marginTop: 3 }}>Klik untuk buka profil</p>
                  </div>
                )}
              </div>
              <div style={{ position: 'relative', display: 'inline-block' }} onMouseEnter={() => setLiHovered(true)} onMouseLeave={() => setLiHovered(false)}>
                <LinkedInButtonLink username="Alif Ramzy Pasha Firdaus" />
                {liHovered && (
                  <div className="social-popup">
                    <p className="mc-font" style={{ fontSize: 7, color: '#6699ff', marginBottom: 6, letterSpacing: '0.1em' }}>💼 LinkedIn</p>
                    <p style={{ fontSize: 11, color: '#ffffff', fontFamily: '"Courier New",monospace', fontWeight: 700 }}>Alif Ramzy Pasha Firdaus</p>
                    <p style={{ fontSize: 9, color: '#888899', fontFamily: '"Courier New",monospace', marginTop: 3 }}>Klik untuk buka profil</p>
                  </div>
                )}
              </div>
            </div>

            {/* Hobi + Fun Fact */}
            <div className="grid gap-3 text-sm sm:grid-cols-2 mb-4" style={{ ...revealStyle(4) }}>
              <OrbBox onMouseEnter={() => setHoveredBox('hobi')} onMouseLeave={() => setHoveredBox(null)} className="p-4" style={profileCardStyle('hobi')}>
                <p className="mc-font text-xs uppercase mb-3 mc-label-shimmer" style={{ letterSpacing: '0.12em', fontSize: '7px' }}>&gt; Hobi</p>
                <p style={{ color: '#ccccdd', fontSize: '12px', lineHeight: 2, fontFamily: '"Courier New",monospace' }}>1. Badminton<br />2. Nonton Film<br />3. Dengerin Lagu<br />4. Main Game</p>
              </OrbBox>
              <OrbBox onMouseEnter={() => setHoveredBox('funfact')} onMouseLeave={() => setHoveredBox(null)} className="p-4" style={profileCardStyle('funfact')}>
                <p className="mc-font text-xs uppercase mb-3 mc-label-shimmer" style={{ letterSpacing: '0.12em', fontSize: '7px' }}>&gt; Fun Fact</p>
                <p style={{ color: '#ccccdd', fontSize: '12px', fontFamily: '"Courier New",monospace', lineHeight: 1.9 }}>Suka makan pedes<br />tapi gabisa pedes</p>
              </OrbBox>
            </div>

            {/* Spotify */}
            <div style={{ ...revealStyle(5) }}>
              <OrbBox onMouseEnter={() => setHoveredBox('spotify')} onMouseLeave={() => setHoveredBox(null)} className="p-4" style={profileCardStyle('spotify')}>
                <p className="mc-font text-xs uppercase mb-2 mc-label-shimmer" style={{ letterSpacing: '0.12em', fontSize: '7px' }}>&gt; Jukebox: Lagu Favorit</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  {!muted && (
                    <div style={{ display: 'flex', alignItems: 'flex-end', height: 14, gap: 1 }}>
                      {[0, 0.15, 0.3, 0.45].map((delay, i) => (
                        <span key={i} className="music-bar" style={{ animationDelay: `${delay}s`, height: 4 + (i % 3) * 3 }} />
                      ))}
                    </div>
                  )}
                  <p style={{ color: '#44ee88', fontSize: '11px', textShadow: '0 0 8px rgba(68,238,136,0.5)', fontFamily: '"Courier New",monospace', letterSpacing: '0.06em', margin: 0 }}>
                    {muted ? '⏸ ' : '♪ '}{SONG_TITLE}
                  </p>
                  <span style={{ color: '#444455', fontSize: 10, fontFamily: '"Courier New",monospace' }}>— {SONG_ARTIST}</span>
                </div>
                <SpotifyEmbed spotifyUrl={SONG_SPOTIFY_URL} />
              </OrbBox>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  )
}

export default MemberPopup