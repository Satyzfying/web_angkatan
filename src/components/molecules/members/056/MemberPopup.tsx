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

const RibbonStrip = ({ viewW = 700 }: { viewW?: number }) => {
  const count = Math.ceil(viewW / 35) + 2
  const points = Array.from({ length: count }, (_, k) => k)
  return (
    <svg
      viewBox={`0 0 ${viewW} 20`}
      preserveAspectRatio="none"
      style={{ width: '100%', height: '20px', display: 'block' }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="0" y="0" width={viewW} height="20" fill="rgba(244,167,195,0.18)" />
      {points.map((k) => (
        <path key={`t${k}`} d={`M${k*35} 4 Q${k*35+17.5} 0 ${k*35+35} 4`}
          fill="none" stroke="#f4a7c3" strokeWidth="2" />
      ))}
      {points.map((k) => (
        <path key={`m${k}`} d={`M${k*35} 10 Q${k*35+17.5} 6 ${k*35+35} 10`}
          fill="none" stroke="#e8d5a3" strokeWidth="1.2" strokeDasharray="5 3" />
      ))}
      {points.map((k) => (
        <path key={`b${k}`} d={`M${k*35} 16 Q${k*35+17.5} 12 ${k*35+35} 16`}
          fill="none" stroke="#f4a7c3" strokeWidth="2" />
      ))}
    </svg>
  )
}

const MemberPopup = ({ isOpen, onClose }: MemberPopupProps) => {
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const petalData = [
    {l:2,d:4.5,dl:0},{l:7,d:5.2,dl:1.3},{l:13,d:3.9,dl:0.5},{l:18,d:6.1,dl:2.2},
    {l:24,d:4.8,dl:0.9},{l:29,d:5.6,dl:1.8},{l:35,d:3.6,dl:3.1},{l:40,d:5.0,dl:0.4},
    {l:46,d:4.2,dl:2.6},{l:51,d:6.3,dl:1.1},{l:57,d:4.0,dl:0.7},{l:62,d:5.4,dl:3.4},
    {l:68,d:3.7,dl:1.6},{l:73,d:4.9,dl:2.9},{l:79,d:6.0,dl:0.2},{l:84,d:3.8,dl:2.0},
    {l:90,d:5.1,dl:3.6},{l:95,d:4.6,dl:0.6},{l:11,d:5.9,dl:2.3},{l:38,d:4.3,dl:1.4},
    {l:55,d:5.7,dl:1.0},{l:72,d:4.1,dl:2.8},{l:88,d:6.2,dl:0.3},{l:44,d:3.5,dl:3.2},
  ]
  const petalSizes = [22,19,25,21,23,20,24,22,20,23,19,22,25,21,23,20,22,24,21,20,23,19,22,21]

  const content = (
    <>
      <style>{`
        @keyframes petalFall {
          0%   { transform:translateY(-30px) translateX(0px) rotate(0deg) scale(1); opacity:0; }
          8%   { opacity:1; }
          50%  { transform:translateY(50vh) translateX(35px) rotate(380deg) scale(0.9); opacity:0.9; }
          100% { transform:translateY(110vh) translateX(-15px) rotate(760deg) scale(0.55); opacity:0; }
        }
        .rose-petal {
          position: fixed;
          pointer-events: none;
          animation: petalFall ease-in infinite;
          z-index: 999999;
        }

        @keyframes borderGlow {
          0%   { box-shadow: 0 0 8px 2px #f4a7c3, inset 0 0 6px rgba(244,167,195,0.2); }
          25%  { box-shadow: 0 0 18px 5px #ff85b3, 0 0 30px 8px rgba(244,167,195,0.3), inset 0 0 10px rgba(244,167,195,0.15); }
          50%  { box-shadow: 0 0 8px 2px #f4a7c3, inset 0 0 6px rgba(244,167,195,0.2); }
          75%  { box-shadow: 0 0 20px 6px #ffb3d0, 0 0 35px 10px rgba(255,150,190,0.25), inset 0 0 12px rgba(244,167,195,0.18); }
          100% { box-shadow: 0 0 8px 2px #f4a7c3, inset 0 0 6px rgba(244,167,195,0.2); }
        }
        @keyframes wiggleGentle {
          0%,100% { transform: rotate(0deg) translateX(0px); }
          20%     { transform: rotate(-0.4deg) translateX(-1px); }
          40%     { transform: rotate(0.4deg) translateX(1px); }
          60%     { transform: rotate(-0.3deg) translateX(-0.5px); }
          80%     { transform: rotate(0.3deg) translateX(0.5px); }
        }

        .box-nama    { animation: borderGlow 2.8s ease-in-out infinite; }
        .box-hobi    { animation: wiggleGentle 3.5s ease-in-out infinite; animation-delay: 0s; }
        .box-funfact { animation: wiggleGentle 3.5s ease-in-out infinite; animation-delay: 0.9s; }
        .box-lagu    { animation: wiggleGentle 3.5s ease-in-out infinite; animation-delay: 1.8s; }

        .info-box {
          position: relative;
          overflow: hidden;
          border: 2px solid #f4a7c3;
          cursor: default;
          will-change: transform, box-shadow;
        }
        .info-box:hover {
          transform: translateY(-3px) scale(1.015) !important;
          animation-play-state: paused !important;
        }
        .ribbon-top {
          position: absolute; top: 0; left: 0; right: 0;
          height: 20px; pointer-events: none; z-index: 3; overflow: hidden;
        }
        .ribbon-bot {
          position: absolute; bottom: 0; left: 0; right: 0;
          height: 20px; pointer-events: none; z-index: 3; overflow: hidden;
          transform: scaleY(-1);
        }
        .info-box-inner { padding: 26px 16px; }

        .popup-backdrop {
          position: fixed;
          inset: 0;
          z-index: 99997;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          cursor: pointer;
        }

        .popup-scroll {
          position: fixed;
          inset: 0;
          z-index: 99998;
          overflow-y: auto;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          pointer-events: none;
        }
        .popup-card-wrap {
          pointer-events: auto;
          width: 100%;
          max-width: 720px;
          margin-top: 16px;
          margin-bottom: 32px;
          padding: 0 1rem;
        }
      `}</style>

      {petalData.map((p, i) => (
        <svg key={i} className="rose-petal"
          style={{
            left: `${p.l}%`, top: '-30px',
            width: `${petalSizes[i]}px`,
            height: `${Math.round(petalSizes[i] * 1.35)}px`,
            animationDuration: `${p.d}s`,
            animationDelay: `${p.dl}s`,
          }}
          viewBox="0 0 20 27" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 0 C5 2 0 7 0 13 C0 20 4.5 27 10 27 C15.5 27 20 20 20 13 C20 7 15 2 10 0Z" fill="#8b1a1a"/>
          <path d="M10 0 C10 8 7 16 10 27 C13 16 10 8 10 0Z" fill="#6b0f0f" opacity="0.7"/>
          <path d="M10 0 C6 5 4 10 5 16 C7 12 9 6 10 0Z" fill="#a02020" opacity="0.4"/>
        </svg>
      ))}

      <div className="popup-backdrop" onClick={onClose} />

      <div className="popup-scroll">
        <div className="popup-card-wrap">
          <div
            className="relative w-full rounded-2xl shadow-2xl"
            style={{
              backgroundColor: '#4a4a38',
              backgroundImage: `
                radial-gradient(circle, #8a9468 11px, transparent 11px),
                radial-gradient(circle, #8a9468 11px, transparent 11px)
              `,
              backgroundSize: '68px 68px',
              backgroundPosition: '0 0, 34px 34px',
              border: '4px solid #f4a7c3',
              outline: '3px solid rgba(244,167,195,0.45)',
              outlineOffset: '4px',
            }}
          >
            <div className="relative z-10 p-6 sm:p-8">

              <button
                type="button"
                aria-label="Close member detail"
                onClick={onClose}
                className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full text-xl leading-none text-white hover:text-white/70 transition-colors"
                style={{ border: '2px solid #f4a7c9', background: 'rgba(0,0,0,0.4)' }}
              >
                ×
              </button>

              <div className="mb-4 overflow-hidden rounded-2xl" style={{ border: '3px solid #f4a7c3' }}>
                <Image src={ProfileImage} alt="Profile Image" className="h-120 w-full object-cover object-center" />
              </div>

              <div className="info-box box-nama rounded-xl mb-2" style={{ background: '#6b0f0f' }}>
                <div className="ribbon-top"><RibbonStrip viewW={700} /></div>
                <div className="ribbon-bot"><RibbonStrip viewW={700} /></div>
                <div className="info-box-inner pr-8">
                  <h2 className="text-2xl font-black text-white drop-shadow">Aliya Rahmadina</h2>
                  <p className="mt-1 text-sm font-semibold text-white/70">5027251056 - Bojonegoro</p>
                  <div className="mt-4 flex gap-2">
                    <Instagram username="aliyaarad" />
                    <LinkedInButtonLink username="aliyarahmadina" />
                  </div>
                </div>
              </div>

              <div className="grid gap-2 text-sm font-semibold sm:grid-cols-2 mb-2">
                <div className="info-box box-hobi rounded-xl" style={{ background: '#6b0f0f' }}>
                  <div className="ribbon-top"><RibbonStrip viewW={350} /></div>
                  <div className="ribbon-bot"><RibbonStrip viewW={350} /></div>
                  <div className="info-box-inner">
                    <p className="text-xs tracking-wide uppercase text-white/60">Hobi</p>
                    <p className="mt-2 text-white font-bold">Dengerin lagu</p>
                  </div>
                </div>
                <div className="info-box box-funfact rounded-xl" style={{ background: '#6b0f0f' }}>
                  <div className="ribbon-top"><RibbonStrip viewW={350} /></div>
                  <div className="ribbon-bot"><RibbonStrip viewW={350} /></div>
                  <div className="info-box-inner">
                    <p className="text-xs tracking-wide uppercase text-white/60">Fun Fact</p>
                    <p className="mt-2 text-white font-bold">Paling gabisa nonton horor sendirian</p>
                  </div>
                </div>
              </div>

              <div className="info-box box-lagu rounded-xl" style={{ background: '#6b0f0f' }}>
                <div className="ribbon-top"><RibbonStrip viewW={700} /></div>
                <div className="ribbon-bot"><RibbonStrip viewW={700} /></div>
                <div className="info-box-inner">
                  <p className="text-xs font-bold tracking-wide uppercase text-white/60">Lagu Favorit</p>
                  <p className="my-2 text-sm font-bold text-white">Let Me Love You</p>
                  <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/59NC8SuXPiSaiYL69XQ4dt?si=066b1ae7d3e74fae" />
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  )

  return createPortal(content, document.body)
}

export default MemberPopup
