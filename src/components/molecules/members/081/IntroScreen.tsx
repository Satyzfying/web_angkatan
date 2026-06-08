'use client'

import React, { useEffect, useRef, useState } from 'react'

const VIDEO_URL =
  'https://rareusgolecuqcptmeqy.supabase.co/storage/v1/object/public/videos/to%20the%20moon.mp4'

interface IntroScreenProps {
  /** Audio object dibuat dan dimiliki oleh MemberPopup */
  audio: HTMLAudioElement | null
  /** Dipanggil setelah video selesai / skip */
  onEnd: () => void
}

type Phase = 'playing' | 'fading'

const IntroScreen: React.FC<IntroScreenProps> = ({ audio, onEnd }) => {
  const videoRef  = useRef<HTMLVideoElement>(null)
  const [phase, setPhase]             = useState<Phase>('playing')
  const [textVisible, setTextVisible] = useState(false)
  const calledRef = useRef(false)

  /* Play audio + video saat mount */
  useEffect(() => {
    void audio?.play().catch(() => { /* autoplay policy */ })
    void videoRef.current?.play().catch(() => {})

    const textTimer = setTimeout(() => setTextVisible(true), 1000)
    return () => clearTimeout(textTimer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const triggerEnd = () => {
    if (calledRef.current) return
    calledRef.current = true
    setPhase('fading')
    setTimeout(() => onEnd(), 800)
  }

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden bg-black"
      style={{
        opacity: phase === 'fading' ? 0 : 1,
        transition: 'opacity 0.8s ease-in-out',
        pointerEvents: phase === 'fading' ? 'none' : 'auto',
      }}
    >
      {/* Video */}
      <video
        ref={videoRef}
        src={VIDEO_URL}
        className="absolute inset-0 h-full w-full object-cover"
        muted
        playsInline
        onEnded={triggerEnd}
      />

      {/* Dark vignette overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(0,0,0,0.1)_0%,_rgba(0,0,0,0.65)_100%)]" />

      {/* CRT scanlines */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.18) 2px, rgba(0,0,0,0.18) 4px)',
        }}
      />

      {/* Overlay text */}
      <div
        className="relative z-10 flex flex-col items-center gap-4 px-6 text-center"
        style={{
          opacity: textVisible ? 1 : 0,
          transform: textVisible ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity 1.6s ease, transform 1.6s ease',
        }}
      >
        <p className="font-black uppercase tracking-[0.28em] text-white/30 text-[11px]">
          ✦ &nbsp; a message &nbsp; ✦
        </p>

        <p
          className="max-w-md text-2xl font-black leading-relaxed tracking-wide text-white sm:text-3xl"
          style={{ textShadow: '0 0 40px rgba(255,255,255,0.3)' }}
        >
          sorry wish we could go to the moon together
        </p>

        <p className="text-sm font-bold tracking-[0.32em] uppercase text-white/50">
          — david
        </p>

        {/* subtle yellow accent line */}
        <div
          className="mt-2 h-px w-20 rounded-full bg-[#f8e900]"
          style={{ boxShadow: '0 0 12px 2px rgba(248,233,0,0.5)' }}
        />
      </div>

      {/* Skip button */}
      <button
        type="button"
        onClick={triggerEnd}
        className="absolute bottom-8 right-8 z-20 rounded-full border border-white/20 bg-black/30 px-4 py-2 text-xs font-bold tracking-[0.2em] uppercase text-white/40 backdrop-blur-sm transition-all hover:border-white/50 hover:text-white/80"
      >
        skip →
      </button>
    </div>
  )
}

export default IntroScreen
