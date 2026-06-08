'use client'

import React, { useEffect, useRef } from 'react'
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

const MemberPopup = ({ isOpen, onClose }: MemberPopupProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  // Sparkle canvas animation
  useEffect(() => {
    if (!isOpen) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const RETRO_COLORS: [number, number, number][] = [
      [255, 220, 60],
      [200, 140, 255],
      [255, 255, 255],
      [255, 200, 80],
      [180, 100, 255],
      [249, 215, 107],
      [220, 160, 255],
    ]

    function rand(a: number, b: number) { return a + Math.random() * (b - a) }
    function randInt(a: number, b: number) { return Math.floor(rand(a, b)) }

    function resize() {
      if (!canvas) return
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    class Particle {
      x = 0; y = 0; size = 0
      rgb: [number, number, number] = [255, 255, 255]
      phase = 0; twinkleSpeed = 1; kind = 0; rot = 0; rotV = 0

      constructor() { this.init() }

      init() {
        if (!canvas) return
        this.x = rand(0, canvas.width)
        this.y = rand(0, canvas.height)
        this.size = rand(2.5, 7)
        this.rgb = RETRO_COLORS[randInt(0, RETRO_COLORS.length)]
        this.phase = rand(0, Math.PI * 2)
        this.twinkleSpeed = rand(0.5, 1.9)
        this.kind = rand(0, 1)
        this.rot = rand(0, Math.PI * 2)
        this.rotV = rand(-0.04, 0.04)
      }

      alpha(t: number) {
        return Math.max(0, Math.abs(Math.sin(t * this.twinkleSpeed + this.phase)))
      }

      draw(t: number) {
        if (!ctx || !canvas) return
        const a = this.alpha(t)
        const [r, g, b] = this.rgb
        const x = this.x + Math.sin(t * 0.4 + this.phase) * 6
        const y = this.y + Math.cos(t * 0.3 + this.phase) * 4
        this.rot += this.rotV
        ctx.save()
        ctx.globalAlpha = a
        ctx.translate(x, y)
        ctx.rotate(this.rot)
        ctx.fillStyle = `rgb(${r},${g},${b})`

        if (this.kind < 0.35) {
          ctx.strokeStyle = `rgb(${r},${g},${b})`
          ctx.lineWidth = this.size * 0.38
          ctx.lineCap = 'round'
          ctx.beginPath(); ctx.moveTo(-this.size * 1.5, 0); ctx.lineTo(this.size * 1.5, 0); ctx.stroke()
          ctx.beginPath(); ctx.moveTo(0, -this.size * 1.5); ctx.lineTo(0, this.size * 1.5); ctx.stroke()
          ctx.fillStyle = `rgba(255,255,255,${a * 0.7})`
          ctx.beginPath(); ctx.arc(0, 0, this.size * 0.28, 0, Math.PI * 2); ctx.fill()
        } else if (this.kind < 0.65) {
          const outer = this.size * 1.6, inner = this.size * 0.45
          ctx.beginPath()
          for (let i = 0; i < 8; i++) {
            const angle = (i * Math.PI) / 4
            const rad = i % 2 === 0 ? outer : inner
            if (i === 0) {
              ctx.moveTo(Math.cos(angle) * rad, Math.sin(angle) * rad)
            } else {
              ctx.lineTo(Math.cos(angle) * rad, Math.sin(angle) * rad)
            }
          }
          ctx.closePath(); ctx.fill()
          ctx.fillStyle = `rgba(255,255,255,${a * 0.5})`
          ctx.beginPath(); ctx.arc(-this.size * 0.3, -this.size * 0.3, this.size * 0.25, 0, Math.PI * 2); ctx.fill()
        } else if (this.kind < 0.82) {
          ctx.beginPath(); ctx.arc(0, 0, this.size * 0.65, 0, Math.PI * 2); ctx.fill()
          ctx.fillStyle = `rgba(255,255,255,${a * 0.8})`
          ctx.beginPath(); ctx.arc(-this.size * 0.2, -this.size * 0.2, this.size * 0.22, 0, Math.PI * 2); ctx.fill()
        } else {
          const s = this.size * 1.4
          ctx.beginPath()
          ctx.moveTo(0, -s); ctx.lineTo(s * 0.55, 0)
          ctx.lineTo(0, s); ctx.lineTo(-s * 0.55, 0)
          ctx.closePath(); ctx.fill()
        }
        ctx.restore()
      }
    }

    const particles = Array.from({ length: 85 }, () => new Particle())
    let t = 0

    function animate() {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      t += 0.018
      particles.forEach(p => p.draw(t))
      animRef.current = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [isOpen])

  if (!isOpen) {
    return null
  }

  return createPortal(
    // PADA BAGIAN INI KAMU BOLEH MENGUBAH STYLE SESUKA HATI KAMU, TAPI JANGAN UBAH STRUKTUR DAN FUNGSI DARI KODE INI AGAR FUNGSI POPUP TETAP BERJALAN DENGAN BAIK
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-hidden px-4">
      <button
        type="button"
        aria-label="Close member detail"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      <div
        className="relative z-10 h-[100dvh] max-h-[100dvh] w-full max-w-[720px] animate-[member-popup-show_200ms_ease-out] overflow-y-auto overscroll-contain rounded-2xl border-2 p-6 text-white shadow-xl sm:p-8"
        style={{ background: '#1a1060', borderColor: 'rgba(249,215,107,0.4)' }}
      >
        {/* Curtains */}
        <div className="pointer-events-none absolute top-0 left-0 h-full w-20 z-[1]" style={{ background: 'linear-gradient(to right, #5a2a8a, #7a4aaa, rgba(122,74,170,0))' }} />
        <div className="pointer-events-none absolute top-0 right-0 h-full w-20 z-[1]" style={{ background: 'linear-gradient(to left, #5a2a8a, #7a4aaa, rgba(122,74,170,0))' }} />

        {/* Gold bars top & bottom */}
        <div className="pointer-events-none absolute top-0 left-0 right-0 h-[10px] z-[4]" style={{ background: 'linear-gradient(90deg,#a06200,#f9d76b,#f0c040,#c8860a,#f9d76b,#a06200)', borderRadius: '14px 14px 0 0' }} />
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-[10px] z-[4]" style={{ background: 'linear-gradient(90deg,#a06200,#f9d76b,#f0c040,#c8860a,#f9d76b,#a06200)', borderRadius: '0 0 14px 14px' }} />

        {/* Corner stars */}
        <span className="pointer-events-none absolute top-3 left-3 z-[5] text-lg" style={{ color: '#f9d76b', filter: 'drop-shadow(0 0 5px rgba(249,215,107,0.8))', transform: 'rotate(-10deg)' }}>✦</span>
        <span className="pointer-events-none absolute top-3 right-3 z-[5] text-lg" style={{ color: '#f9d76b', filter: 'drop-shadow(0 0 5px rgba(249,215,107,0.8))', transform: 'rotate(10deg)' }}>✦</span>
        <span className="pointer-events-none absolute bottom-3 left-3 z-[5] text-base" style={{ color: '#f9d76b', filter: 'drop-shadow(0 0 5px rgba(249,215,107,0.8))', transform: 'rotate(8deg)' }}>★</span>
        <span className="pointer-events-none absolute bottom-3 right-3 z-[5] text-base" style={{ color: '#f9d76b', filter: 'drop-shadow(0 0 5px rgba(249,215,107,0.8))', transform: 'rotate(-8deg)' }}>★</span>

        {/* Blob decorations */}
        <div className="pointer-events-none absolute -top-20 -right-16 h-72 w-72 rounded-full opacity-35 z-[1]" style={{ background: '#7a3fb8', filter: 'blur(70px)' }} />
        <div className="pointer-events-none absolute -bottom-16 -left-10 h-60 w-60 rounded-full opacity-[0.12] z-[1]" style={{ background: '#e8c84a', filter: 'blur(65px)' }} />

        {/* Sparkle canvas */}
        <canvas
          ref={canvasRef}
          className="pointer-events-none absolute inset-0 h-full w-full z-[2]"
        />

        {/* All content above sparkles */}
        <div className="relative z-[3]">
          <button
            type="button"
            aria-label="Close member detail"
            onClick={onClose}
            className="absolute top-0 right-0 flex h-9 w-9 items-center justify-center rounded-full border text-xl leading-none"
            style={{ background: 'rgba(255,255,255,0.15)', borderColor: 'rgba(249,215,107,0.4)', color: '#f9d76b' }}
          >
            x
          </button>

          {/* Photo card with disco ball */}
          <div
            className="mb-5 overflow-hidden rounded-2xl border-2 relative flex flex-col items-center justify-center"
            style={{ borderColor: 'rgba(249,215,107,0.55)', background: 'linear-gradient(135deg,#2a1060 0%,#4a2090 35%,#7b52b8 70%,#9b7fd4 100%)', minHeight: '200px' }}
          >
            {/* Disco ball */}
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-3xl z-10 animate-[disco-glow_2.5s_ease-in-out_infinite_alternate]">🪩</span>

            {/* NRP badge */}
            <span className="absolute top-3 left-3 rounded-full px-3 py-1 text-xs font-semibold z-10" style={{ background: 'rgba(249,215,107,0.15)', border: '1px solid rgba(249,215,107,0.45)', color: '#f9d76b' }}>
              032 · 2025
            </span>

            <Image src={ProfileImage} alt="Profile Image" className="h-120 w-full object-cover object-center" />

            {/* Honey badge */}
            <span className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full px-4 py-1.5 text-xs font-bold z-10" style={{ background: '#f9d76b', color: '#3a1a00', boxShadow: '0 0 10px rgba(249,215,107,0.4)' }}>
              🍯 honey
            </span>
          </div>

          <div className="pr-10">
            {/* UBAH NAMA ANDA */}
            <h2 className="text-2xl font-black italic" style={{ fontFamily: '"DM Serif Display", Georgia, serif', color: '#5b3a8a' }}>Malikha Syarifa Dewi</h2>
            {/* UBAH NRP DAN ASAL */}
            <p className="mt-1 text-sm font-semibold" style={{ color: '#a08040' }}>5027251032 - Klaten</p>
          </div>

          <div className="mt-5 flex gap-2">
            {/* UBAH USERNAME INSTAGRAM */}
            <Instagram username="malikhasyaa" />
            {/* UBAH USERNAME LINKEDIN */}
            <LinkedInButtonLink username="malikhasyaa" />
          </div>

          <div className="mt-6 grid gap-4 text-sm font-semibold sm:grid-cols-2">
            <div className="rounded-xl border p-4" style={{ background: '#fdf8e1', borderColor: 'rgba(200,134,10,0.18)' }}>
              {/* UBAH HOBI KAMU */}
              <p className="text-xs tracking-wide uppercase" style={{ color: '#b090d0' }}>Hobi</p>
              <p className="mt-2" style={{ color: '#3a2a10' }}>keliling surabaya malem-malem</p>
            </div>
            <div className="rounded-xl border p-4" style={{ background: '#fdf8e1', borderColor: 'rgba(200,134,10,0.18)' }}>
              {/* UBAH FUNFACT KAMU */}
              <p className="text-xs tracking-wide uppercase" style={{ color: '#b090d0' }}>Fun Fact</p>
              <p className="mt-2" style={{ color: '#3a2a10' }}>namaku ada unsur kecapnya, cuman nggak suka kecap...</p>
            </div>
          </div>

          <div className="mt-4 rounded-xl border p-4" style={{ background: '#fdf8e1', borderColor: 'rgba(200,134,10,0.18)' }}>
            {/* UBAH LAGU FAVORIT KAMU */}
            <p className="text-xs font-bold tracking-wide uppercase" style={{ color: '#b090d0' }}>Lagu Favorite</p>
            <p className="my-2 text-sm font-semibold italic" style={{ fontFamily: '"DM Serif Display", Georgia, serif', color: '#6b3fa0' }}>honey</p>

            {/* UBAH URL SPOTIFY KAMU DENGAN LAGU FAVORIT MU */}
            <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/6pXe0HxGT1xufKGhZYqweC?si=7d26c61e884547eb" />
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default MemberPopup
