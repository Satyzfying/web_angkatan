'use client'
import React, { useEffect } from 'react'
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

const MemberPopup = ({ isOpen, onClose }: MemberPopupProps) => {
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

  if (!isOpen) {
    return null
  }

  return createPortal(
    // PADA BAGIAN INI KAMU BOLEH MENGUBAH STYLE SESUKA HATI KAMU, TAPI JANGAN UBAH STRUKTUR DAN FUNGSI DARI KODE INI AGAR FUNGSI POPUP TETAP BERJALAN DENGAN BAIK
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;800;900&family=Rajdhani:wght@400;500;600;700&family=Item&display=swap');
        .crew-popup-bg {
          background-color: #0d2050;
          background-image:
            radial-gradient(ellipse at 20% 50%, rgba(30,80,220,0.35) 0%, transparent 60%),
            radial-gradient(ellipse at 80% 20%, rgba(10,70,200,0.28) 0%, transparent 55%),
            radial-gradient(ellipse at 60% 80%, rgba(20,50,180,0.22) 0%, transparent 50%);
        }
        .corner-bracket {
          position: absolute;
          width: 18px;
          height: 18px;
          border-color: #4a90ff;
          border-style: solid;
          opacity: 0.7;
        }
        .corner-tl { top: 0; left: 0; border-width: 2px 0 0 2px; }
        .corner-tr { top: 0; right: 0; border-width: 2px 2px 0 0; }
        .corner-bl { bottom: 0; left: 0; border-width: 0 0 2px 2px; }
        .corner-br { bottom: 0; right: 0; border-width: 0 2px 2px 0; }
        .scan-line {
          position: absolute;
          left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(60,120,255,0.4), transparent);
          animation: scan 3s ease-in-out infinite;
          pointer-events: none;
        }
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }

        .galaxy-rotate {
          animation: galaxyRotate 180s linear infinite;
          transform-origin: center;
        }

        @keyframes galaxyRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .gspin1 { animation: galaxyRotate 22s linear infinite; }
        .gspin2 { animation: galaxyRotate 30s linear infinite reverse; }
        .gspin3 { animation: galaxyRotate 18s linear infinite; }
        .gspin4 { animation: galaxyRotate 26s linear infinite reverse; }

        .pspin1 { animation: galaxyRotate 35s linear infinite; }
        .pspin2 { animation: galaxyRotate 28s linear infinite reverse; }
        .pspin3 { animation: galaxyRotate 20s linear infinite; }
        .pspin4 { animation: galaxyRotate 32s linear infinite reverse; }
        
      `}</style>
      <div
        className="crew-popup-bg fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto px-4"
      >
        <button
          type="button"
          aria-label="Close member detail"
          onClick={onClose}
          className="absolute inset-0"
          style={{ background: 'rgba(5,15,40,0.55)', backdropFilter: 'blur(4px)' }}
        />

        {/* ── STATIC decorations: planets & stars OUTSIDE the rotating SVG ── */}
        <div style={{ position: 'fixed', inset: 0, zIndex: 11, pointerEvents: 'none', overflow: 'hidden' }}>
          {/* Static background stars & dots */}
          <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
            <defs>
              <filter id="glow-static"><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
              <filter id="softglow-static"><feGaussianBlur stdDeviation="6" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
              <radialGradient id="gs1" cx="40%" cy="40%"><stop offset="0%" stopColor="white" stopOpacity="0.5" /><stop offset="100%" stopColor="#4f46e5" stopOpacity="0" /></radialGradient>
              <radialGradient id="gs2" cx="40%" cy="40%"><stop offset="0%" stopColor="white" stopOpacity="0.4" /><stop offset="100%" stopColor="#0284c7" stopOpacity="0" /></radialGradient>
              <radialGradient id="gs3" cx="40%" cy="40%"><stop offset="0%" stopColor="white" stopOpacity="0.4" /><stop offset="100%" stopColor="#7c3aed" stopOpacity="0" /></radialGradient>
              <radialGradient id="gs4" cx="40%" cy="40%"><stop offset="0%" stopColor="white" stopOpacity="0.45" /><stop offset="100%" stopColor="#0e7490" stopOpacity="0" /></radialGradient>
            </defs>
            {/* ── PLANET large — left mid ── */}
            <g transform="translate(110,420)" opacity="0.82">
              <circle r="38" fill="#3730a3" />
              <circle r="38" fill="url(#gs1)" />
              <ellipse rx="60" ry="10" fill="none" stroke="#818cf8" strokeWidth="2.5" opacity="0.7" transform="rotate(-25)" />
              <ellipse rx="48" ry="7" fill="none" stroke="#a5b4fc" strokeWidth="1.2" opacity="0.5" transform="rotate(-25)" />
            </g>
            {/* ── PLANET medium — right mid ── */}
            <g transform="translate(1300,420)" opacity="0.78">
              <circle r="30" fill="#075985" />
              <circle r="30" fill="url(#gs2)" />
              <ellipse rx="50" ry="9" fill="none" stroke="#38bdf8" strokeWidth="2" opacity="0.65" transform="rotate(20)" />
              <ellipse rx="40" ry="6" fill="none" stroke="#7dd3fc" strokeWidth="1" opacity="0.45" transform="rotate(20)" />
            </g>
            {/* ── PLANET small — top center-left ── */}
            <g transform="translate(270,60)" opacity="0.72">
              <circle r="20" fill="#5b21b6" />
              <circle r="20" fill="url(#gs3)" />
              <ellipse rx="34" ry="7" fill="none" stroke="#7c3aed" strokeWidth="1.8" opacity="0.6" transform="rotate(-15)" />
            </g>
            {/* ── PLANET small — bottom center-right ── */}
            <g transform="translate(1130,840)" opacity="0.7">
              <circle r="22" fill="#164e63" />
              <circle r="22" fill="url(#gs4)" />
              <ellipse rx="36" ry="7" fill="none" stroke="#0891b2" strokeWidth="1.8" opacity="0.55" transform="rotate(10)" />
            </g>
            {/* ── STARS bright 4-point ── */}
            <g transform="translate(210,170)" filter="url(#glow-static)" opacity="0.9">
              <polygon points="0,-10 2,-2 10,0 2,2 0,10 -2,2 -10,0 -2,-2" fill="white" />
            </g>
            <g transform="translate(1190,140)" filter="url(#glow-static)" opacity="0.85">
              <polygon points="0,-12 2.5,-2.5 12,0 2.5,2.5 0,12 -2.5,2.5 -12,0 -2.5,-2.5" fill="#bae6fd" />
            </g>
            <g transform="translate(50,600)" filter="url(#glow-static)" opacity="0.8">
              <polygon points="0,-9 2,-2 9,0 2,2 0,9 -2,2 -9,0 -2,-2" fill="#c7d2fe" />
            </g>
            <g transform="translate(1360,600)" filter="url(#glow-static)" opacity="0.82">
              <polygon points="0,-10 2,-2 10,0 2,2 0,10 -2,2 -10,0 -2,-2" fill="white" />
            </g>
            <g transform="translate(680,40)" filter="url(#glow-static)" opacity="0.78">
              <polygon points="0,-8 1.8,-1.8 8,0 1.8,1.8 0,8 -1.8,1.8 -8,0 -1.8,-1.8" fill="#e0f2fe" />
            </g>
            <g transform="translate(700,860)" filter="url(#glow-static)" opacity="0.75">
              <polygon points="0,-8 1.8,-1.8 8,0 1.8,1.8 0,8 -1.8,1.8 -8,0 -1.8,-1.8" fill="#ddd6fe" />
            </g>
            {/* ── tiny dots ── */}
            <circle cx="330" cy="820" r="3" fill="white" opacity="0.7" filter="url(#glow-static)" />
            <circle cx="1060" cy="60" r="2.5" fill="#bae6fd" opacity="0.75" filter="url(#glow-static)" />
            <circle cx="160" cy="240" r="2" fill="white" opacity="0.6" />
            <circle cx="1240" cy="680" r="2.5" fill="#a5b4fc" opacity="0.7" filter="url(#glow-static)" />
            <circle cx="420" cy="870" r="2" fill="white" opacity="0.55" />
            <circle cx="980" cy="30" r="2" fill="#e0f2fe" opacity="0.65" />
          </svg>

          {/* ── ROTATING galaxy SVG ── */}
          <svg
            className="galaxy-rotate"
            width="100%"
            height="100%"
            style={{ position: 'absolute', inset: 0 }}
          >
            <defs>
              <filter id="softglow"><feGaussianBlur stdDeviation="6" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
            </defs>

            {/* ── GALAXY top-left ── */}
            <g transform="translate(80,90)" opacity="0.75"><g className="gspin1">
              <ellipse rx="55" ry="20" fill="none" stroke="#818cf8" strokeWidth="1.5" />
              <ellipse rx="35" ry="12" fill="none" stroke="#a5b4fc" strokeWidth="1" />
              <ellipse rx="15" ry="5" fill="#c7d2fe" opacity="0.4" />
              <circle r="6" fill="white" opacity="0.9" filter="url(#softglow)" />
            </g></g>

            {/* ── GALAXY bottom-right ── */}
            <g transform="translate(1320,780)" opacity="0.7"><g className="gspin2">
              <ellipse rx="60" ry="22" fill="none" stroke="#60a5fa" strokeWidth="1.5" />
              <ellipse rx="38" ry="13" fill="none" stroke="#93c5fd" strokeWidth="1" />
              <ellipse rx="16" ry="6" fill="#bfdbfe" opacity="0.35" />
              <circle r="7" fill="white" opacity="0.88" filter="url(#softglow)" />
            </g></g>

            {/* ── GALAXY top-right ── */}
            <g transform="translate(1280,100)" opacity="0.65"><g className="gspin3">
              <ellipse rx="45" ry="16" fill="none" stroke="#a78bfa" strokeWidth="1.5" />
              <ellipse rx="28" ry="9" fill="none" stroke="#c4b5fd" strokeWidth="1" />
              <ellipse rx="11" ry="4" fill="#ddd6fe" opacity="0.4" />
              <circle r="5" fill="white" opacity="0.9" filter="url(#softglow)" />
            </g></g>

            {/* ── GALAXY bottom-left ── */}
            <g transform="translate(100,800)" opacity="0.7"><g className="gspin4">
              <ellipse rx="50" ry="18" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
              <ellipse rx="30" ry="10" fill="none" stroke="#7dd3fc" strokeWidth="1" />
              <ellipse rx="12" ry="4" fill="#bae6fd" opacity="0.35" />
              <circle r="5" fill="white" opacity="0.88" filter="url(#softglow)" />
            </g></g>
          </svg>
        </div>

        <div
          className="relative z-10 max-h-[100dvh] w-full max-w-[720px] animate-[member-popup-show_200ms_ease-out] overflow-y-auto p-6 text-white sm:p-8"
          style={{
            background: 'linear-gradient(160deg, rgba(10,22,54,0.97) 0%, rgba(8,20,50,0.97) 100%)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '2px solid rgba(255,255,255,0.85)',
            borderRadius: '16px',
            boxShadow: '0 0 30px rgba(255,255,255,0.2), 0 0 80px rgba(70,120,255,0.4), 0 0 180px rgba(40,90,255,0.35)',
            marginTop: '1rem',
            marginBottom: '1rem',
          }}
        >
          {/* Close button */}
          <button
            type="button"
            aria-label="Close member detail"
            onClick={onClose}
            className="absolute top-4 right-4 flex h-5 w-5 items-center justify-center"
            style={{
              background: 'rgba(255,255,255,0.9)',
              border: '1px solid #4f46e5',
              borderRadius: '50%',
              color: '#4f46e5',
              fontFamily: "'Orbitron', sans-serif",
              fontSize: '12px',
              boxShadow: '0 0 10px rgba(79,70,229,0.3)',
            }}
          >
            ✕
          </button>

          {/* Profile image with bracket corners */}
          <div
            className="mb-5 overflow-hidden"
            style={{
              borderRadius: '16px',
              border: '1px solid rgba(30,80,220,0.2)',
              position: 'relative',
            }}
          >
            <div className="scan-line" />
            <Image src={ProfileImage} alt="Profile Image" className="h-[480px] w-full object-cover object-center" />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 55%, rgba(8,20,50,0.85) 100%)', pointerEvents: 'none' }} />
          </div>

          {/* Identity section */}
          <div className="pr-10">
            {/* UBAH NAMA ANDA */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <h2
                className="text-2xl font-black"
                style={{
                  fontFamily: "'Rajdhani', sans-serif",
                  fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
                  fontWeight: 700,
                  color: '#e8f4f0',
                  letterSpacing: '0.04em',
                  margin: 0,
                  lineHeight: 1.2,
                }}
              >
                Abhista Athallah Dyfan
              </h2>
            </div>

            {/* UBAH NRP DAN ASAL */}
            <p
              className="mt-2 text-sm font-semibold"
              style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: '11px',
                letterSpacing: '0.12em',
                color: '#a0b8b4',
                margin: '8px 0 0 0',
              }}
            >
              5027251006 · Kediri
            </p>
          </div>

          {/* Social buttons */}
          <div className="mt-5 flex gap-3 flex-wrap">
            {/* UBAH USERNAME INSTAGRAM */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              background:
                'linear-gradient(135deg, #1e487b 0%, #60a5fa 50%, #1e487b 100%)',
              border: '1px solid rgba(255,255,255,0.18)',
              borderRadius: '12px',
              padding: '8px 14px',
              boxShadow: '8px 8px 0px #ffffff'
            }}>
              {/* Instagram inline SVG logo */}
              <Instagram username="aadyfan" />
              <span
                style={{
                  fontFamily: "'Rajdhani', sans-serif",
                  color: '#000000',
                  fontSize: '15px',
                  fontWeight: 800,
                  margin: 0,
                }}
              >
                @aadyfan
              </span>
            </div>
            {/* UBAH USERNAME LINKEDIN */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              background:
                'linear-gradient(135deg, #1e487b 0%, #60a5fa 50%, #1e487b 100%)',
              border: '1px solid rgba(255,255,255,0.18)',
              borderRadius: '12px',
              padding: '8px 14px',
              boxShadow: '8px 8px 0px #ffffff'
            }}>
              {/* LinkedIn inline SVG logo */}
              <LinkedInButtonLink username="abhista-athallah-dyfan-242b6b36a" />
              <span
                style={{
                  fontFamily: "'Rajdhani', sans-serif",
                  color: '#000000',
                  fontSize: '15px',
                  fontWeight: 800,
                  margin: 0,
                }}
              >
                Abhista A. Dyfan
              </span>
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: '1px', background: 'linear-gradient(90deg, rgba(60,130,255,0.3), transparent)', margin: '20px 0' }} />

          {/* Hobi & Fun Fact */}
          <div className="grid gap-4 text-sm font-semibold sm:grid-cols-2">
            <div
              style={{
                background:
                  'linear-gradient(135deg, #1e487b 0%, #60a5fa 50%, #1e487b 100%)',
                border: '1px solid rgba(255,255,255,0.18)',
                borderRadius: '14px',
                padding: '14px',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '8px 8px 0px #ffffff'
              }}
            >
              <span className="corner-bracket corner-tl" style={{ width: 10, height: 10, borderColor: 'rgba(60,130,255,0.5)' }} />
              <span className="corner-bracket corner-br" style={{ width: 10, height: 10, borderColor: 'rgba(60,130,255,0.5)' }} />
              {/* UBAH HOBI KAMU */}
              <p style={{
                fontFamily: "'Item', sans-serif",
                fontSize: '9px',
                letterSpacing: '0.25em',
                color: '#0f172a',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}>
                <span style={{ display: 'inline-block', width: 6, height: 6, background: '#4a90ff', borderRadius: '1px' }} />
                HOBI
              </p>
              <p style={{ fontFamily: "'Rajdhani', sans-serif", color: '#000000', fontSize: '15px', fontWeight: 800, margin: 0 }}>Makan &amp; Tidur</p>
            </div>

            <div
              style={{
                background:
                  'linear-gradient(135deg, #1e487b 0%, #60a5fa 50%, #1e487b 100%)',
                border: '1px solid rgba(255,255,255,0.18)',
                borderRadius: '14px',
                padding: '14px',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '8px 8px 0px #ffffff',
              }}
            >
              <span className="corner-bracket corner-tl" style={{ width: 10, height: 10, borderColor: 'rgba(60,130,255,0.5)' }} />
              <span className="corner-bracket corner-br" style={{ width: 10, height: 10, borderColor: 'rgba(60,130,255,0.5)' }} />
              {/* UBAH FUNFACT KAMU */}
              <p style={{
                fontFamily: "'Item', sans-serif",
                fontSize: '9px',
                letterSpacing: '0.25em',
                color: '#0f172a',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}>
                <span style={{ display: 'inline-block', width: 6, height: 6, background: '#4a90ff', borderRadius: '1px' }} />
                FUN FACT
              </p>
              <p style={{ fontFamily: "'Rajdhani', sans-serif", color: '#000000', fontSize: '15px', fontWeight: 800, margin: 0 }}>setengah warlok</p>
            </div>
          </div>

          {/* Lagu Favorit */}
          <div
            className="mt-4"
            style={{
              background:
                'linear-gradient(135deg, #1e487b 0%, #60a5fa 50%, #1e487b 100%)',
              border: '1px solid rgba(255,255,255,0.18)',
              borderRadius: '14px',
              padding: '14px',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '8px 8px 0px #ffffff'
            }}
          >
            <span className="corner-bracket corner-tl" style={{ width: 10, height: 10, borderColor: 'rgba(100,80,220,0.5)' }} />
            <span className="corner-bracket corner-br" style={{ width: 10, height: 10, borderColor: 'rgba(100,80,220,0.5)' }} />
            {/* UBAH LAGU FAVORIT KAMU */}
            <p style={{
              fontFamily: "'Item', sans-serif",
              fontSize: '9px',
              letterSpacing: '0.25em',
              color: '#0f172a',
              marginBottom: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}>
              <span style={{ display: 'inline-block', width: 6, height: 6, background: '#9080ff', borderRadius: '1px' }} />
              LAGU FAVORIT
            </p>
            <p
              className="my-2"
              style={{
                fontFamily: "'Rajdhani', sans-serif",
                color: '#000000',
                fontSize: '18px',
                fontWeight: 850,
                letterSpacing: '0.02em',
                margin: '8px 0',
              }}
            >
              Untukku
            </p>
            {/* UBAH URL SPOTIFY KAMU DENGAN LAGU FAVORIT MU */}
            <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/2tm79rrJ6hJkyqlz6FYI7L?si=b940785685ce4a62" />
          </div>
        </div>
      </div>
    </>,
    document.body
  )
}

export default MemberPopup