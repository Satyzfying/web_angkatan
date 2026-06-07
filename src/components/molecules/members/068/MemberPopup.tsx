'use client'

/* eslint-disable react-hooks/set-state-in-effect */


import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { F1Minigame } from '@/components/molecules/members/068/f1-minigame'

const ASSET = {
  f1Video:      '/assets/members/068/f1-race.mp4',
  mvVideo:      '/assets/members/068/mv-jkt48.mp4',
  overture:     '/assets/members/068/jkt48-overture.mp3',
  profileBgm:   '/assets/members/068/jkt48-mv-passion.mp3',
  profileImage: '/assets/members/068/image1.jpg',
}

// ─────────────────────────────────────────────────────────────────────────────
// Spotify Track IDs
// ─────────────────────────────────────────────────────────────────────────────
const SPOTIFY_TRACKS = [
  { label: 'FAV 1',  trackId: '0d8Hq4l7irVb8cYXOkACwu' }, //https://open.spotify.com/intl-id/track/0d8Hq4l7irVb8cYXOkACwu?si=ee81d020354e44a3
  { label: 'FAV 2',  trackId: '3ZwqWrRpylU9nfy99qwKdR' }, //https://open.spotify.com/intl-id/track/3ZwqWrRpylU9nfy99qwKdR?si=7142c21489654693
  { label: 'FAV 3',  trackId: '52iLDrSoRtf9lcgFuLVfqE' }, //https://open.spotify.com/intl-id/track/52iLDrSoRtf9lcgFuLVfqE?si=c9c34898d56f4e0c
]

// ─────────────────────────────────────────────────────────────────────────────
// Cursor Bubble Trail
// ─────────────────────────────────────────────────────────────────────────────
type BubbleTrailItem = { id: number; x: number; y: number; size: number }

function CursorBubbleTrail() {
  const [bubbles, setBubbles] = useState<BubbleTrailItem[]>([])
  const idRef = useRef(0)

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const newBubble: BubbleTrailItem = {
        id: idRef.current++,
        x: e.clientX,
        y: e.clientY,
        size: 8 + Math.random() * 14,
      }
      setBubbles((prev) => [...prev.slice(-18), newBubble])
      setTimeout(() => {
        setBubbles((prev) => prev.filter((b) => b.id !== newBubble.id))
      }, 700)
    }
    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [])

  return (
    <>
      {bubbles.map((b) => (
        <div
          key={b.id}
          className="pointer-events-none fixed z-[200]"
          style={{
            left: b.x - b.size / 2,
            top: b.y - b.size / 2,
            width: b.size,
            height: b.size,
            borderRadius: '50%',
            background:
              'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.85), rgba(200,230,255,0.35) 55%, transparent 80%)',
            border: '1px solid rgba(255,255,255,0.55)',
            animation: 'cursor-bubble-fade 0.7s ease-out forwards',
          }}
          aria-hidden="true"
        />
      ))}
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Floating White Bubbles
// ─────────────────────────────────────────────────────────────────────────────
function FloatingBubbles() {
  const bubbles = [
    { size: 70,  x: '5%',  y: '72%', delay: '0s',    dur: '7s'   },
    { size: 28,  x: '14%', y: '38%', delay: '1.5s',  dur: '5s'   },
    { size: 90,  x: '87%', y: '58%', delay: '0.8s',  dur: '9s'   },
    { size: 18,  x: '77%', y: '28%', delay: '2.2s',  dur: '6s'   },
    { size: 50,  x: '53%', y: '82%', delay: '0.3s',  dur: '8s'   },
    { size: 14,  x: '38%', y: '18%', delay: '3s',    dur: '5.5s' },
    { size: 38,  x: '92%', y: '83%', delay: '1.2s',  dur: '7.5s' },
    { size: 22,  x: '3%',  y: '12%', delay: '2.8s',  dur: '6.5s' },
    { size: 42,  x: '60%', y: '10%', delay: '0.6s',  dur: '8.5s' },
    { size: 16,  x: '25%', y: '88%', delay: '1.8s',  dur: '6s'   },
    { size: 60,  x: '45%', y: '50%', delay: '2.5s',  dur: '10s'  },
    { size: 24,  x: '72%', y: '70%', delay: '0.4s',  dur: '5.5s' },
    { size: 35,  x: '18%', y: '55%', delay: '3.5s',  dur: '7s'   },
    { size: 12,  x: '82%', y: '42%', delay: '1.1s',  dur: '4.5s' },
    { size: 48,  x: '30%', y: '25%', delay: '2s',    dur: '9s'   },
  ]
  return (
    <>
      {bubbles.map((b, i) => (
        <div
          key={i}
          className="pointer-events-none absolute"
          style={{
            left: b.x,
            top: b.y,
            width: b.size,
            height: b.size,
            borderRadius: '50%',
            background:
              'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.6), rgba(230,240,255,0.18) 55%, transparent 80%)',
            border: '1.5px solid rgba(255,255,255,0.4)',
            boxShadow: 'inset 0 0 6px rgba(255,255,255,0.2)',
            animation: `bubble-float ${b.dur} ease-in-out infinite`,
            animationDelay: b.delay,
          }}
          aria-hidden="true"
        />
      ))}
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Social Buttons (glass style)
// ─────────────────────────────────────────────────────────────────────────────
function InstagramStub({ username }: { username: string }) {
  return (
    <a
      href={`https://instagram.com/${username}`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 px-3 py-2 transition-all hover:opacity-80"
      style={{
        background: 'rgba(255,255,255,0.18)',
        border: '1.5px solid rgba(255,255,255,0.4)',
        borderRadius: '10px',
        backdropFilter: 'blur(8px)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4)',
        color: '#333',
        fontSize: '11px',
        fontFamily: 'monospace',
        textDecoration: 'none',
      }}
      aria-label={`Instagram @${username}`}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
      @{username}
    </a>
  )
}

function LinkedInStub({ username }: { username: string }) {
  return (
    <a
      href={`https://linkedin.com/in/${username}`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 px-3 py-2 transition-all hover:opacity-80"
      style={{
        background: 'rgba(255,255,255,0.18)',
        border: '1.5px solid rgba(255,255,255,0.4)',
        borderRadius: '10px',
        backdropFilter: 'blur(8px)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4)',
        color: '#333',
        fontSize: '11px',
        fontFamily: 'monospace',
        textDecoration: 'none',
      }}
      aria-label={`LinkedIn ${username}`}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
      LinkedIn
    </a>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Spotify Embed (iframe asli — bisa diputar beneran
// ─────────────────────────────────────────────────────────────────────────────
function SpotifyEmbed({ label, trackId }: { label: string; trackId: string }) {
  return (
    <div className="flex flex-col gap-1">
      <p
        className="text-[10px] font-semibold uppercase tracking-widest"
        style={{ color: 'rgba(60,60,60,0.7)', fontFamily: 'monospace' }}
      >
        {label}
      </p>
      <iframe
        src={`https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0`}
        width="100%"
        height="80"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        style={{ borderRadius: '10px', border: 'none' }}
        title={label}
      />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Glass Panel — putih/bening
// ─────────────────────────────────────────────────────────────────────────────
function GlassPanel({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={`relative ${className}`}
      style={{
        background: 'rgba(255,255,255,0.22)',
        border: '1.5px solid rgba(255,255,255,0.45)',
        borderRadius: '14px',
        backdropFilter: 'blur(14px)',
        boxShadow:
          '0 4px 24px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.6)',
        padding: '1rem',
      }}
    >
      {/* top shine */}
      <div
        className="pointer-events-none absolute left-4 right-4 top-0 h-px rounded-full"
        style={{
          background:
            'linear-gradient(90deg, transparent, rgba(255,255,255,0.8) 40%, rgba(255,255,255,0.9) 50%, rgba(255,255,255,0.8) 60%, transparent)',
        }}
        aria-hidden="true"
      />
      {children}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
type MemberPopupProps = {
  isOpen: boolean
  onClose: () => void
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────
const MemberPopup = ({ isOpen, onClose }: MemberPopupProps) => {
  const [mounted, setMounted]       = useState(false)
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [bgmMuted, setBgmMuted]     = useState(false)
  const [mouse, setMouse]           = useState({ x: 0.5, y: 0.5 })

  const profileBgmRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => { setMounted(true) }, [])

  // BGM profile baru dibuat saat popup dibuka — cegah double audio
  useEffect(() => {
    if (!isOpen) return
    if (ASSET.profileBgm && !profileBgmRef.current) {
      profileBgmRef.current            = new Audio(ASSET.profileBgm)
      profileBgmRef.current.loop       = true
      profileBgmRef.current.volume     = 0.33
    }
    return () => {
      profileBgmRef.current?.pause()
    }
  }, [isOpen])

  // BGM profile langsung play setelah F1 selesai, hentikan semua audio lain dulu
  useEffect(() => {
    if (!isUnlocked || !profileBgmRef.current) return
    try {
      const arr = (window as unknown as { __member_media?: HTMLMediaElement[] }).__member_media || []
      arr.forEach((m) => { try { m.pause(); m.currentTime = 0 } catch (_) {} })
      ;(window as unknown as { __member_media: HTMLMediaElement[] }).__member_media = []
    } catch (_) {}
    profileBgmRef.current.currentTime = 0
    profileBgmRef.current.play().catch(() => null)
  }, [isUnlocked])

  const closePopup = useCallback(() => {
    profileBgmRef.current?.pause()
    if (profileBgmRef.current) {
      profileBgmRef.current.currentTime = 0
      profileBgmRef.current = null
    }
    setIsUnlocked(false)
    setBgmMuted(false)
    try {
      const media = Array.from(
        document.querySelectorAll('audio, video')
      ) as HTMLMediaElement[]
      media.forEach((m) => { try { m.pause(); m.currentTime = 0 } catch (_) {} })
    } catch (_) {}
    try {
      const arr = (window as unknown as { __member_media?: HTMLMediaElement[] }).__member_media || []
      arr.forEach((m) => { try { m.pause(); m.currentTime = 0 } catch (_) {} })
      ;(window as unknown as { __member_media: HTMLMediaElement[] }).__member_media = []
    } catch (_) {}
    onClose()
  }, [onClose])

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closePopup() }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [isOpen, closePopup])

  // Mouse tracking untuk parallax bubbles
  useEffect(() => {
    if (!isOpen) return
    const onMove = (e: MouseEvent) => {
      setMouse({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      })
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [isOpen])

  const handleGameComplete = useCallback(() => {
    setIsUnlocked(true)
  }, [])

  const toggleBgm = () => {
    if (!profileBgmRef.current) return
    if (bgmMuted) {
      profileBgmRef.current.volume = 0.33
      profileBgmRef.current.play().catch(() => null)
    } else {
      profileBgmRef.current.volume = 0
    }
    setBgmMuted((prev) => !prev)
  }


  if (!isOpen || !mounted) return null

  // ── SCREEN 1: F1 Mini-game ──
  if (!isUnlocked) {
    return createPortal(
      <>
        <div className="fixed inset-0 z-[100]">
          {ASSET.f1Video ? (
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 h-full w-full object-cover"
              aria-hidden="true"
            >
              <source src={ASSET.f1Video} type="video/mp4" />
            </video>
          ) : (
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(180deg, #87CEEB 0%, #2196C8 40%, #063a60 80%, #010d1e 100%)',
              }}
            />
          )}
          <div className="absolute inset-0 bg-black/30" />
        </div>

        <F1Minigame
          onComplete={handleGameComplete}
          f1VideoSrc={ASSET.f1Video || undefined}
          overtureSrc={ASSET.overture || undefined}
        />

        <button
          type="button"
          aria-label="Close popup"
          onClick={closePopup}
          className="fixed right-4 top-4 z-[120] flex h-9 w-9 items-center justify-center transition-all hover:opacity-80"
          style={{
            background:
              'linear-gradient(135deg, rgba(255,255,255,0.35) 0%, rgba(180,230,255,0.15) 100%)',
            border: '1.5px solid rgba(255,255,255,0.5)',
            borderRadius: '50%',
            backdropFilter: 'blur(8px)',
            boxShadow:
              '0 2px 12px rgba(0,100,200,0.3), inset 0 1px 0 rgba(255,255,255,0.6)',
            color: 'white',
            fontSize: '14px',
          }}
        >
          &#x2715;
        </button>
      </>,
      document.body
    )
  }

  // ── SCREEN 2: Profile Card ──
  // Background FIXED supaya tidak ikut scroll saat card di-scroll
  return createPortal(
    <div className="fixed inset-0 z-[100]">
      {/* Cursor bubble trail */}
      <CursorBubbleTrail />

      {/* Background FIXED — MV video + bubbles — tidak ikut scroll */}
      <div className="fixed inset-0 z-[0]">
        {ASSET.mvVideo ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
            aria-hidden="true"
          >
            <source src={ASSET.mvVideo} type="video/mp4" />
          </video>
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(180deg, #87CEEB 0%, #5BB8E8 25%, #2196C8 55%, #0a5a90 80%, #031428 100%)',
            }}
            aria-hidden="true"
          />
        )}

        {/* Bubbles melayang + paralaks kursor */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <FloatingBubbles />
          {[...Array(6)].map((_, i) => {
            const ox = (mouse.x - 0.5) * 60 * (i + 1) * 0.08
            const oy = (mouse.y - 0.5) * 40 * (i + 1) * 0.08
            return (
              <div
                key={`mx-${i}`}
                className="absolute"
                style={{
                  left: `${20 + i * 13}%`,
                  top: `${30 + i * 8}%`,
                  width: 18 + i * 6,
                  height: 18 + i * 6,
                  borderRadius: '50%',
                  background:
                    'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.55), rgba(230,240,255,0.1) 60%, transparent 80%)',
                  border: '1px solid rgba(255,255,255,0.35)',
                  transform: `translate(${ox}px, ${oy}px)`,
                  transition: 'transform 0.4s ease-out',
                }}
                aria-hidden="true"
              />
            )
          })}
        </div>

        {/* Overlay dim */}
        <div className="absolute inset-0 bg-black/35 backdrop-blur-[2px]" />
      </div>

      {/* Backdrop click tutup */}
      <button
        type="button"
        aria-label="Close member detail"
        onClick={closePopup}
        className="absolute inset-0 z-[1]"
      />

      {/* Scrollable container — hanya card yang scroll, background tetap fixed */}
      <div className="relative z-[2] flex items-start justify-center overflow-y-auto h-full px-4 pb-8 pt-16 sm:pt-20">

      {/* ── CARD UTAMA — putih/bening ── */}
      <div
        className="relative z-10 w-full max-w-[720px] animate-[member-popup-show_200ms_ease-out] overflow-hidden"
        style={{
          background: 'rgba(255,255,255,0.25)',
          border: '1.5px solid rgba(255,255,255,0.55)',
          borderRadius: '20px',
          backdropFilter: 'blur(24px)',
          boxShadow:
            '0 8px 48px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.7)',
        }}
      >
        {/* Foto profil — dengan padding/margin di sekeliling, tidak full bleed */}
        <div className="relative w-full px-5 pt-5">
          {/* Close button — di pojok kanan atas CARD (bukan foto), selalu terlihat */}
          <button
            type="button"
            aria-label="Close member detail"
            onClick={closePopup}
            className="absolute right-4 top-4 z-50 flex h-9 w-9 items-center justify-center transition-all hover:scale-110 active:scale-95"
            style={{
              background: 'rgba(0,0,0,0.55)',
              border: '2px solid rgba(255,255,255,0.75)',
              borderRadius: '50%',
              color: '#fff',
              fontSize: '15px',
              fontWeight: 700,
              backdropFilter: 'blur(4px)',
              boxShadow: '0 2px 12px rgba(0,0,0,0.4)',
            }}
          >
            &#x2715;
          </button>

          {/* Foto dengan margin di sekeliling — seperti contoh */}
          <div
            className="overflow-hidden w-full"
            style={{ borderRadius: '14px', aspectRatio: '1 / 1' }}
          >
            {ASSET.profileImage ? (
              <img
                src={ASSET.profileImage}
                alt="Keisya Halimah Mulia"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center top',
                  display: 'block',
                }}
              />
            ) : (
              <div
                className="flex h-full w-full items-center justify-center"
                style={{ background: 'linear-gradient(180deg, rgba(135,206,235,0.6) 0%, rgba(33,150,200,0.4) 100%)' }}
              >
                <p className="text-center text-[10px] font-mono" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  IMAGE1.JPG<br />Taruh di public/assets/members/068/
                </p>
              </div>
            )}
          </div>

        </div>

        {/* Konten card */}
        <div className="relative z-10 p-6 sm:p-8">
          {/* BGM toggle — warna teks sama, hanya background button yang beda ON/OFF */}
          <div className="mb-5">
            <button
              onClick={toggleBgm}
              className="flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
              style={{
                /* background putih untuk ON, abu gelap untuk OFF — teks selalu hitam pekat */
                background: bgmMuted
                  ? 'rgba(80,80,80,0.65)'
                  : 'rgba(255,255,255,0.80)',
                border: '2px solid rgba(255,255,255,0.7)',
                borderRadius: '24px',
                backdropFilter: 'blur(10px)',
                boxShadow: bgmMuted
                  ? '0 2px 10px rgba(0,0,0,0.25)'
                  : 'inset 0 1px 0 rgba(255,255,255,0.9), 0 2px 10px rgba(0,0,0,0.12)',
                color: bgmMuted ? '#fff' : '#0a0a0a',
                fontFamily: 'monospace',
                fontSize: '13px',
                fontWeight: 700,
                letterSpacing: '0.13em',
                textTransform: 'uppercase',
                padding: '9px 22px',
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
              </svg>
              {bgmMuted ? 'BGM OFF' : 'BGM ON'}
            </button>
          </div>

          {/* Nama + NRP — NRP 2-3 ukuran lebih kecil dari nama */}
          <div className="mb-5">
            <h2
              className="text-balance tracking-tight"
              style={{
                color: '#0a0a0a',
                fontFamily: "var(--font-rubikone, 'Rubik One', Montserrat, sans-serif)",
                fontSize: '26px',
                fontWeight: 500,
                textShadow: '0 1px 8px rgba(255,255,255,0.7), 0 2px 16px rgba(255,255,255,0.4)',
                letterSpacing: '-0.01em',
              }}
            >
              Keisya Halimah Mulia
            </h2>
            <p
              className="mt-1.5 tracking-widest"
              style={{ color: 'rgba(20,20,20,0.8)', fontFamily: 'monospace', fontSize: '16px', fontWeight: 600 }}
            >
              5027251068 &mdash; SURAKARTA
            </p>
          </div>

          {/* Social */}
          <div className="mb-6 flex flex-wrap gap-2">
            <InstagramStub username="keisyaahm" />
            <LinkedInStub username="keisyahalimahmulia" />
          </div>

          {/* Hobi & Fun Fact */}
          <div className="mb-4 grid gap-4 sm:grid-cols-2">
            <GlassPanel>
              <p
                className="mb-3 uppercase tracking-widest font-bold"
                style={{ color: 'rgba(30,30,30,0.6)', fontFamily: 'monospace', fontSize: '13px' }}
              >
                HOBI
              </p>
              <ul
                className="space-y-2"
                style={{ color: '#1a1a1a', fontFamily: 'monospace', fontSize: '13px', lineHeight: '1.6' }}
              >
                <li>Nonton live member JKT48</li>
                <li>Baca All Cerita Fiksi</li>
                <li>Gambar (sekarang lebih suka tidur sih)</li>
              </ul>
            </GlassPanel>

            <GlassPanel>
              <p
                className="mb-3 uppercase tracking-widest font-bold"
                style={{ color: 'rgba(30,30,30,0.6)', fontFamily: 'monospace', fontSize: '13px' }}
              >
                FUN FACT
              </p>
              <ul
                className="space-y-2"
                style={{ color: '#1a1a1a', fontFamily: 'monospace', fontSize: '13px', lineHeight: '1.6' }}
              >
                <li>Bukan orang solo kota</li>
                <li>Suka gambar tapi ga jago-jago amat, suka gambar pakai pencil charcoal</li>
                <li>Kalau udah gila banget siklusnya buka tiktok-search JJ-floating tiktok sambil ngerjain tugas</li>
              </ul>
            </GlassPanel>
          </div>

          {/* Spotify Embed (iframe asli — bisa diputar) */}
          <GlassPanel>
            <p
              className="mb-4 uppercase tracking-widest font-bold"
              style={{ color: 'rgba(30,30,30,0.6)', fontFamily: 'monospace', fontSize: '13px' }}
            >
              MY TOP 3 SONGS
            </p>
            <div className="flex flex-col gap-4">
              {SPOTIFY_TRACKS.map((t) => (
                <SpotifyEmbed key={t.trackId} label={t.label} trackId={t.trackId} />
              ))}
            </div>
          </GlassPanel>
        </div>
      </div>


      <style>{`
        @keyframes bubble-float {
          0%, 100% { transform: translateY(0px) scale(1); opacity: 0.65; }
          33%       { transform: translateY(-20px) scale(1.06); opacity: 0.85; }
          66%       { transform: translateY(-9px) scale(0.94); opacity: 0.5; }
        }
        @keyframes member-popup-show {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes cursor-bubble-fade {
          0%   { opacity: 0.9; transform: scale(1); }
          100% { opacity: 0; transform: scale(1.6) translateY(-12px); }
        }
      `}</style>
      </div>{/* end scrollable container */}

    </div>,
    document.body
  )
}

export default MemberPopup
