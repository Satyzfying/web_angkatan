'use client'

import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import Image from 'next/image'

import Instagram from '@/components/atoms/button/InstagramButtonLink'
import LinkedInButtonLink from '@/components/atoms/button/LinkedInButtonLink'
import SpotifyEmbed from '@/components/molecules/SpotifyEmbed'

import ProfileImage from './image.jpg'
// Pastikan file bg-image.png ada di folder yang sama (022) sesuai screenshot kamu
import BgImage from './bg-image.png'

type MemberPopupProps = {
  isOpen: boolean
  onClose: () => void
}

const MemberPopup = ({ isOpen, onClose }: MemberPopupProps) => {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  // Fungsi untuk play/pause manual
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        audioRef.current.play()
        setIsPlaying(true)
      }
    }
  }

  useEffect(() => {
    if (!isOpen) {
      if (audioRef.current) {
        audioRef.current.pause()
        setIsPlaying(false)
      }
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    // Autoplay handling
    if (audioRef.current) {
      audioRef.current.volume = 0.5
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((e) => {
          console.log('Autoplay diblokir oleh browser, butuh interaksi:', e)
          setIsPlaying(false)
        })
    }

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) {
    return null
  }

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto px-4">
      {/* ===== AUDIO AUTOPLAY (Pastikan file mp3 ada di folder public) ===== */}
      <audio ref={audioRef} loop src="/sign-of-the-times.mp3" />

      {/* ===== SELF-CONTAINED KEYFRAMES & EFFECTS ===== */}
      <style jsx>{`
        @keyframes mp-backdrop-in {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
        @keyframes mp-airlock-open {
          0% {
            clip-path: inset(50% 0 50% 0 round 24px);
            transform: scale(0.92);
            filter: blur(14px);
            opacity: 0;
          }
          100% {
            clip-path: inset(0 0 0 0 round 24px);
            transform: scale(1);
            filter: blur(0);
            opacity: 1;
          }
        }
        @keyframes mp-holo-in {
          0% {
            opacity: 0;
            transform: translateY(10px);
            filter: blur(6px);
          }
          60% {
            opacity: 0.6;
            filter: blur(1px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0);
          }
        }
        @keyframes mp-grid-drift {
          from {
            background-position:
              0 0,
              0 0;
          }
          to {
            background-position:
              40px 40px,
              40px 40px;
          }
        }
        @keyframes mp-twinkle {
          0%,
          100% {
            opacity: 0.2;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.4);
          }
        }
        @keyframes mp-wave {
          0%,
          100% {
            transform: scaleY(0.3);
          }
          50% {
            transform: scaleY(1);
          }
        }

        /* Animasi Bintang Shuriken Redup-Cerah-Cross */
        @keyframes twinkle-shuriken {
          0%,
          100% {
            opacity: 0.1;
            transform: translate(-50%, -50%) scale(0.3);
          }
          50% {
            opacity: 0.9;
            transform: translate(-50%, -50%) scale(1.3);
          }
        }

        @keyframes twinkle-cross {
          0%,
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0);
          }
          50% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }

        .mp-card-tile {
          transition:
            transform 280ms ease,
            border-color 280ms ease,
            box-shadow 280ms ease,
            background-color 280ms ease;
        }
        .mp-card-tile:hover {
          transform: translateY(-4px);
          border-color: rgba(255, 255, 255, 0.4);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
          background-color: rgba(255, 255, 255, 0.15);
        }

        .mp-social-wrap {
          transition:
            transform 220ms ease,
            filter 220ms ease;
        }
        .mp-social-wrap:hover {
          transform: translateY(-2px) scale(1.03);
          filter: drop-shadow(0 0 10px rgba(245, 98, 54, 0.7)) drop-shadow(0 0 18px rgba(193, 57, 171, 0.5));
        }

        .mp-close-btn {
          transition: all 200ms ease;
        }
        .mp-close-btn:hover {
          transform: rotate(90deg);
          color: #fff;
          background-color: rgba(255, 255, 255, 0.2);
        }

        .mp-img-wrap:hover .mp-img-shimmer {
          animation-play-state: running;
        }

        /* REVISI: Gaya Bintang Shuriken (Ukuran diperbesar sedikit) */
        .space-shuriken {
          position: absolute;
          width: 3px; /* Diperbesar dari 2px */
          height: 3px; /* Diperbesar dari 2px */
          background: #fff;
          border-radius: 50%;
          box-shadow:
            0 0 5px #fff,
            0 0 10px #fff; /* Shadow disesuaikan */
          opacity: 0;
          pointer-events: none;
          animation: twinkle-shuriken 4s ease-in-out infinite;
        }

        .space-shuriken::before,
        .space-shuriken::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          background: #fff;
          box-shadow:
            0 0 5px #fff,
            0 0 10px #fff;
          border-radius: 1px;
          opacity: 0;
          pointer-events: none;
          animation: twinkle-cross 4s ease-in-out infinite;
        }

        .space-shuriken::before {
          width: 100%;
          height: 350%; /* Diperbesar dari 300% Vertikal */
        }

        .space-shuriken::after {
          width: 350%; /* Diperbesar dari 300% Horizontal */
          height: 100%;
        }
      `}</style>

      {/* ===== BACKGROUND IMAGE ===== */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <Image
          src={BgImage}
          alt="Background Warp"
          fill
          className="object-cover opacity-90" // Opacity tinggi agar jelas menembus glass
        />
      </div>

      {/* ===== BACKDROP (Opacity dikurangi agar background terlihat) ===== */}
      <button
        type="button"
        aria-label="Close member detail"
        onClick={onClose}
        className="absolute inset-0 z-0 bg-[#0a0606]/30"
        style={{ animation: 'mp-backdrop-in 280ms ease-out both' }}
      />

      {/* ===== MAIN CARD - GLASSMORPHISM CONTAINER (STRUKTUR JANGAN DIUBAH) ===== */}
      <div
        className="border-neutral-cs-10 bg-blue-cs-40 relative z-10 max-h-[100dvh] w-full max-w-[720px] animate-[member-popup-show_200ms_ease-out] overflow-y-auto rounded-2xl border-2 p-6 text-white shadow-xl sm:p-8"
        style={{
          /* EFEK GLASSMORPHISM DENGAN GRADASI 3 WARNA */
          background:
            'linear-gradient(135deg, rgba(230, 90, 40, 0.15) 0%, rgba(130, 45, 170, 0.15) 40%, rgba(59, 133, 0, 0.15) 100%)',
          backdropFilter: 'blur(24px)', // Efek buram/kaca
          WebkitBackdropFilter: 'blur(24px)',
          borderColor: 'rgba(255, 255, 255, 0.2)', // Border putih tipis khas glass
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
          animation: 'mp-airlock-open 600ms cubic-bezier(.2,.8,.2,1) both',
          isolation: 'isolate'
        }}
      >
        {/* === DEEP SPACE LAYER (HUD & Nebula - TANPA RADAR/SCANLINE) === */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
          {/* Nebula glow (Oranye, Biru-Ungu, Hijau #3b8500) */}
          <div
            className="absolute -inset-20"
            style={{
              background:
                'radial-gradient(circle at 18% 12%, rgba(230, 90, 40, 0.2), transparent 45%), radial-gradient(circle at 85% 85%, rgba(59, 133, 0, 0.25), transparent 50%), radial-gradient(circle at 60% 30%, rgba(130, 45, 170, 0.2), transparent 55%)',
              filter: 'blur(20px)'
            }}
          />
          {/* HUD grid */}
          <div
            className="absolute inset-0 opacity-[0.25]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(245, 230, 200, 0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(245, 230, 200, 0.25) 1px, transparent 1px)',
              backgroundSize: '40px 40px, 40px 40px',
              maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 80%)',
              WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 80%)',
              animation: 'mp-grid-drift 18s linear infinite'
            }}
          />
          {/* Twinkling stars DI LUAR CARD (KEMBALIKAN JIKA MAU) */}
          {[
            { t: '8%', l: '12%', d: '0s', s: 2 },
            { t: '22%', l: '78%', d: '0.6s', s: 3 },
            { t: '40%', l: '32%', d: '1.2s', s: 2 },
            { t: '58%', l: '88%', d: '0.3s', s: 2 },
            { t: '72%', l: '18%', d: '1.8s', s: 3 },
            { t: '86%', l: '55%', d: '0.9s', s: 2 },
            { t: '14%', l: '62%', d: '2.1s', s: 2 },
            { t: '50%', l: '8%', d: '1.5s', s: 3 }
          ].map((p, i) => (
            <span
              key={i}
              className="absolute rounded-full"
              style={{
                top: p.t,
                left: p.l,
                width: p.s,
                height: p.s,
                background: '#fff',
                boxShadow: '0 0 6px #fff, 0 0 12px rgba(230, 90, 40, 0.8)',
                animation: `mp-twinkle 3.2s ease-in-out ${p.d} infinite`
              }}
            />
          ))}

          {/* EFEEK RADAR DAN SCANLINE DIHAPUS DARI DEEP SPACE LAYER */}
        </div>

        {/* === Conic Border Ring (Statik Hale Mary - TANPA EFEK BERPUTAR/RADAR) === */}
        <div className="pointer-events-none absolute -inset-px overflow-hidden rounded-2xl">
          <div
            className="absolute top-1/2 left-1/2 h-[260%] w-[260%] -translate-x-1/2 -translate-y-1/2 opacity-[0.3]"
            style={{
              /* Gradasi statis Hale Mary */
              background:
                'conic-gradient(from 0deg, rgba(230,90,40,0.6), rgba(130,45,170,0.6) 30%, rgba(59,133,0,0.6) 60%, rgba(230,90,40,0.6) 90%)'
              /* HAPUS ANIMASI mp-holo-spin */
            }}
          />
        </div>

        {/* === HUD corner brackets (Kembalikan Aksen Teal Cerah) === */}
        {[
          { pos: 'top-2 left-2', rot: '0deg' },
          { pos: 'top-2 right-2', rot: '90deg' },
          { pos: 'bottom-2 right-2', rot: '180deg' },
          { pos: 'bottom-2 left-2', rot: '270deg' }
        ].map((c, i) => (
          <span
            key={i}
            className={`pointer-events-none absolute ${c.pos} h-5 w-5`}
            style={{
              transform: `rotate(${c.rot})`,
              borderTop: '2px solid #2ed4e0',
              borderLeft: '2px solid #2ed4e0',
              boxShadow: '0 0 10px rgba(46, 212, 224, 0.6)'
            }}
          />
        ))}

        {/* === Close button === */}
        <button
          type="button"
          aria-label="Close member detail"
          onClick={onClose}
          className="border-neutral-cs-10 hover:bg-neutral-cs-10/10 mp-close-btn absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full border text-xl leading-none"
          style={{
            borderColor: 'rgba(245, 98, 54, 0.6)',
            color: '#f56236',
            background: 'rgba(20, 10, 14, 0.6)',
            boxShadow: '0 0 14px rgba(245, 98, 54, 0.35), inset 0 0 10px rgba(245, 98, 54, 0.15)',
            backdropFilter: 'blur(6px)'
          }}
        >
          x
        </button>

        {/* === Profile Image (STRUKTUR HTML AWAL DIKEMBALIKAN) === */}
        <div
          className="border-neutral-cs-10/40 mp-img-wrap relative mb-5 overflow-hidden rounded-2xl border"
          style={{
            borderColor: 'rgba(230, 90, 40, 0.5)',
            boxShadow: '0 0 24px -4px rgba(230, 90, 40, 0.5), inset 0 0 30px rgba(130, 45, 170, 0.2)',
            animation: 'mp-holo-in 600ms 120ms ease-out both'
          }}
        >
          {/* Image tetap menggunakan className asli (h-120 w-full object-cover object-center) */}
          <Image src={ProfileImage} alt="Profile Image" className="h-120 w-full object-cover object-center" />

          {/* Tiga elemen holographic overlays ini dikembalikan posisinya (Jangan Dihapus) */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'linear-gradient(135deg, rgba(46,212,224,0.15) 0%, transparent 40%, transparent 60%, rgba(130,45,170,0.2) 100%)',
              mixBlendMode: 'screen'
            }}
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                'repeating-linear-gradient(180deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 1px, transparent 1px, transparent 3px)'
            }}
          />
          <div
            className="mp-img-shimmer pointer-events-none absolute inset-y-0 left-0 w-1/3"
            style={{
              // Shimmer warna Hail Mary
              background:
                'linear-gradient(115deg, transparent 0%, rgba(230, 90, 40, 0.4) 45%, rgba(255, 255, 255, 0.6) 50%, rgba(46, 212, 224, 0.4) 55%, transparent 100%)',
              animation: 'mp-shimmer 1.6s ease-in-out infinite',
              animationPlayState: 'paused',
              mixBlendMode: 'screen'
            }}
          />
        </div>

        {/* REVISI: Menambahkan Bintang Shuriken DI DALAM CARD (Posisi strategis & diperbanyak) */}
        <span className="space-shuriken" style={{ top: '10%', left: '15%', animationDelay: '-1s' }} />
        <span className="space-shuriken" style={{ top: '25%', left: '80%', animationDelay: '-2.5s' }} />
        <span className="space-shuriken" style={{ top: '50%', left: '5%', animationDelay: '-0.5s' }} />
        <span className="space-shuriken" style={{ top: '70%', left: '90%', animationDelay: '-3s' }} />
        <span className="space-shuriken" style={{ top: '85%', left: '20%', animationDelay: '-1.5s' }} />
        {/* Tambahan bintang baru */}
        <span className="space-shuriken" style={{ top: '15%', left: '60%', animationDelay: '-2s' }} />
        <span className="space-shuriken" style={{ top: '40%', left: '70%', animationDelay: '-3.5s' }} />
        <span className="space-shuriken" style={{ top: '60%', left: '30%', animationDelay: '-0.8s' }} />
        <span className="space-shuriken" style={{ top: '92%', left: '75%', animationDelay: '-1.2s' }} />

        {/* === Name + NRP (Teks Tetap) === */}
        <div className="pr-10" style={{ animation: 'mp-holo-in 600ms 180ms ease-out both' }}>
          <p
            className="mb-1 text-[10px] tracking-[0.35em] uppercase"
            style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', color: 'rgba(245, 230, 200, 0.9)' }}
          >
            ◇ CREW IDENTITY
          </p>
          <h2
            className="text-2xl font-black"
            style={{
              color: '#ffffff',
              animation: 'mp-flicker 4.2s ease-in-out infinite',
              letterSpacing: '0.01em'
            }}
          >
            Muhammad Satrio Utomo
          </h2>
          <p
            className="text-neutral-cs-10/70 mt-1 text-sm font-semibold"
            style={{ color: 'rgba(255, 255, 255, 0.85)', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}
          >
            <span style={{ color: '#f56236' }}>[ID://]</span> 5027251022 ·{' '}
            <span style={{ color: '#2ed4e0' }}>ORIGIN</span> Surabaya
          </p>
        </div>

        {/* === Socials === */}
        <div className="mt-5 flex gap-2" style={{ animation: 'mp-holo-in 600ms 240ms ease-out both' }}>
          <div className="mp-social-wrap transition-transform duration-200 hover:scale-105">
            <Instagram username="satrio.utomo_" />
          </div>
          <div className="mp-social-wrap transition-transform duration-200 hover:scale-105">
            <LinkedInButtonLink username="msatrioutomo" />
          </div>
        </div>

        {/* === Hobi + Fun Fact (Sub-Cards Glass) grid dipulihkan === */}
        <div
          className="mt-6 grid gap-4 text-sm font-semibold sm:grid-cols-2"
          style={{ animation: 'mp-holo-in 600ms 300ms ease-out both' }}
        >
          {/* Ubin Hobi (STRUKTUR ASLI dengan div, p, p) */}
          <div
            className="mp-card-tile relative rounded-xl border p-4"
            style={{
              borderColor: 'rgba(46, 212, 224, 0.4)',
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)'
            }}
          >
            {/* Braket ubin dipertahankan strukturnya */}
            <span
              className="pointer-events-none absolute top-1 left-1 h-2 w-2 border-t border-l"
              style={{ borderColor: 'rgba(46, 212, 224, 0.85)' }}
            />
            <span
              className="pointer-events-none absolute right-1 bottom-1 h-2 w-2 border-r border-b"
              style={{ borderColor: 'rgba(230, 90, 40, 0.85)' }}
            />

            <p
              className="text-xs tracking-wide uppercase"
              style={{ color: '#2ed4e0', letterSpacing: '0.2em', fontFamily: 'monospace' }}
            >
              ▣ Hobi
            </p>
            <p className="mt-2 font-normal text-white/90">Nonton film, main musik, main game, </p>
          </div>

          {/* Ubin Fun Fact (STRUKTUR ASLI dengan div, p, p) */}
          <div
            className="mp-card-tile relative rounded-xl border p-4"
            style={{
              borderColor: 'rgba(230, 90, 40, 0.4)',
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)'
            }}
          >
            {/* Braket ubin dipertahankan strukturnya */}
            <span
              className="pointer-events-none absolute top-1 left-1 h-2 w-2 border-t border-l"
              style={{ borderColor: 'rgba(176, 76, 95, 0.85)' }}
            />
            <span
              className="pointer-events-none absolute right-1 bottom-1 h-2 w-2 border-r border-b"
              style={{ borderColor: 'rgba(56, 159, 183, 0.85)' }}
            />

            <p
              className="text-xs tracking-wide uppercase"
              style={{ color: '#f56236', letterSpacing: '0.2em', fontFamily: 'monospace' }}
            >
              ✦ Fun Fact
            </p>
            <p className="mt-2 font-normal text-white/90">
              Suka makan, jadi kalo ada yang mau ngajak makan jangan lupa ngajak aku
            </p>
          </div>
        </div>

        {/* === Lagu Favorit + Spotify (Sub-Card Glass dengan Play/Pause) === */}
        <div
          className="mp-card-tile relative mt-4 rounded-xl border p-4"
          style={{
            borderColor: 'rgba(59, 133, 0, 0.45)',
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            animation: 'mp-holo-in 600ms 360ms ease-out both'
          }}
        >
          {/* Braket ubin dipertahankan strukturnya */}
          <span
            className="pointer-events-none absolute top-1 left-1 h-2 w-2 border-t border-l"
            style={{ borderColor: 'rgba(230, 90, 40, 0.85)' }}
          />
          <span
            className="pointer-events-none absolute top-1 right-1 h-2 w-2 border-t border-r"
            style={{ borderColor: 'rgba(193, 57, 171, 0.85)' }}
          />
          <span
            className="pointer-events-none absolute bottom-1 left-1 h-2 w-2 border-b border-l"
            style={{ borderColor: 'rgba(46, 212, 224, 0.85)' }}
          />
          <span
            className="pointer-events-none absolute right-1 bottom-1 h-2 w-2 border-r border-b"
            style={{ borderColor: 'rgba(245, 230, 200, 0.85)' }}
          />

          {/* Pembungkus ini bisa diklik untuk play/pause */}
          <div
            className="flex cursor-pointer items-center justify-between transition-opacity hover:opacity-80"
            onClick={togglePlay}
            title=" Klik untuk Play/Pause lagu"
          >
            <p
              className="flex items-center gap-2 text-xs font-bold tracking-wide uppercase"
              style={{ color: '#2ed4e0', letterSpacing: '0.25em', fontFamily: 'monospace' }}
            >
              {isPlaying ? '⏸ Lagu Favorit' : '▶ Putar Lagu'}
            </p>

            {/* Equalizer bars (Palette Oranye-Biru-Ungu) */}
            <div className="flex h-4 items-end gap-[3px]">
              {[0, 1, 2, 3, 4].map((i) => {
                const palette = ['#e65a28', '#822daa', '#3b8500', '#e2ba4e', '#f1e9e9']
                const c = palette[i]
                return (
                  <span
                    key={i}
                    className="block w-[3px] rounded-sm transition-all duration-300"
                    style={{
                      height: '100%',
                      background: c,
                      boxShadow: `0 0 6px ${c}`,
                      transformOrigin: 'bottom',
                      animation: isPlaying ? `mp-wave 1.${2 + i}s ease-in-out ${i * 0.12}s infinite` : 'none',
                      transform: isPlaying ? 'none' : 'scaleY(0.2)'
                    }}
                  />
                )
              })}
            </div>
          </div>

          <p className="my-2 text-sm font-semibold text-white">Sign Of The Times - Harry Styles</p>

          <div className="mt-3 opacity-90 transition-opacity hover:opacity-100">
            <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/5Ohxk2dO5COHF1krpoPigN?si=9674dd19694b4299" />
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default MemberPopup
