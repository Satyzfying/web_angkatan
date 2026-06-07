'use client'

import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'

import Image from 'next/image'

import Instagram from '@/components/atoms/button/InstagramButtonLink'
import LinkedInButtonLink from '@/components/atoms/button/LinkedInButtonLink'
import SpotifyEmbed from '@/components/molecules/SpotifyEmbed'

import ProfileImage from './image.jpeg'

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
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-hidden px-4">

      {/* Styling tema astronomi */}
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.1; transform: scale(0.7); }
          50% { opacity: 1; transform: scale(1.3); }
        }
        @keyframes nebula-drift {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(30px, -20px) scale(1.1); }
        }
        @keyframes shooting-star {
          0% { transform: translateX(-100px) translateY(-100px) rotate(45deg); opacity: 1; }
          100% { transform: translateX(800px) translateY(800px) rotate(45deg); opacity: 0; }
        }
        @keyframes planet-float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(5deg); }
        }
        .border-timbul-glow {
          border: 2px solid #97a1f7; /* Solid border warna tegas agar timbul */
          box-shadow: 0 0 25px rgba(157, 159, 252, 0.6), inset 0 0 15px rgba(99, 102, 241, 0.3);
          background: rgba(7, 11, 32, 0.85);
          backdrop-filter: blur(16px);
        }
        .inner-box-glow {
          border: 2px solid #c084fc; /* Solid border warna tegas agar timbul */
          box-shadow: 0 0 15px rgba(168, 85, 247, 0.5), inset 0 0 10px rgba(168, 85, 247, 0.2);
          background: rgba(15, 20, 50, 0.6);
          transition: all 0.3s ease;
        }
        .inner-box-glow:hover {
          border-color: #e495fe;
          box-shadow: 0 0 25px rgba(121, 125, 249, 0.7), inset 0 0 15px rgba(232, 121, 249, 0.3);
          transform: translateY(-2px);
        }
      `}</style>

      {/* background gelap */}
      <button
        type="button"
        aria-label="Close member detail"
        onClick={onClose}
        className="absolute inset-0 bg-[#020617]/90 backdrop-blur-md"
      />

      {/* pop up card */}
      <div className="relative z-10 flex h-[100dvh] max-h-[100dvh] w-full max-w-[720px] animate-[member-popup-show_300ms_ease-out] flex-col overflow-hidden rounded-3xl p-6 text-white sm:p-8 border-timbul-glow">


        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">

          {/* glow kiri atas - kanan bawah */}
          <div className="absolute top-[-10%] left-[-20%] h-[400px] w-[400px] rounded-full bg-fuchsia-600/30 blur-[100px] animate-[nebula-drift_15s_ease-in-out_infinite]"></div>
          <div className="absolute bottom-[-20%] right-[-10%] h-[450px] w-[450px] rounded-full bg-blue-600/30 blur-[120px] animate-[nebula-drift_20s_ease-in-out_infinite_reverse]"></div>

          {/* Planet-planetan */}
          <div className="absolute top-[5%] right-[5%] h-[120px] w-[120px] rounded-full bg-gradient-to-br from-indigo-300 via-purple-600 to-transparent shadow-[0_0_40px_rgba(168,85,247,0.8),inset_-10px_-10px_20px_rgba(0,0,0,0.6)] animate-[planet-float_8s_ease-in-out_infinite] opacity-80"></div>

          {/* Shooting star */}
          <div className="absolute top-0 left-[20%] h-[2px] w-[150px] bg-gradient-to-r from-transparent via-white to-transparent animate-[shooting-star_4s_linear_infinite_2s] shadow-[0_0_10px_white]"></div>

          {/* Bintang di background */}
          {[...Array(100)].map((_, i) => {
            const top = (i * 23) % 100;
            const left = (i * 47) % 100;
            const size = (i % 3) + 1;
            const delay = (i % 5);
            const duration = 2 + (i % 4);
            const colors = ['white', '#f7fafc', '#b2cffa', '#fcd34d'];
            const color = colors[i % colors.length];

            return (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  top: `${top}%`,
                  left: `${left}%`,
                  width: `${size}px`,
                  height: `${size}px`,
                  backgroundColor: color,
                  boxShadow: `0 0 ${size * 2}px ${color}`,
                  animation: `twinkle ${duration}s infinite ${delay}s`
                }}
              />
            )
          })}
        </div>

        {/* isi pop up card */}
        <div className="relative z-10 h-full min-h-0 w-full overflow-y-auto overscroll-contain pr-2 scrollbar-thin scrollbar-thumb-indigo-500/80 scrollbar-track-transparent">

          <button
            type="button"
            aria-label="Close member detail"
            onClick={onClose}
            className="absolute top-0 right-0 z-50 flex h-10 w-10 items-center justify-center rounded-full border-2 border-indigo-300 bg-[#0f172a]/90 text-xl leading-none text-indigo-100 hover:border-white hover:bg-indigo-500 hover:text-white hover:shadow-[0_0_20px_rgba(255,255,255,0.6)] transition-all"
          >
            x
          </button>

          <div className="mb-6 overflow-hidden rounded-2xl border-2 border-[#818cf8] shadow-[0_0_25px_rgba(129,140,248,0.5)] mt-2">
            <Image src={ProfileImage} alt="Profile Image" className="h-120 w-full object-cover object-center transition-transform duration-700 hover:scale-105" />
          </div>

          <div className="pr-12">
            <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-100 via-indigo-200 to-purple-200 drop-shadow-[0_2px_10px_rgba(167,139,250,0.8)]">
              Daffa Ulhaq Fadhlurrahman
            </h2>
            <p className="text-indigo-200 mt-2 text-sm font-bold tracking-widest uppercase">
              5027251033 - Banda Aceh
            </p>
          </div>

          <div className="mt-6 flex gap-3">
            <div className="hover:scale-110 hover:-translate-y-1 transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] rounded-full bg-indigo-900/40 p-1 border border-indigo-400/50">
              <Instagram username="daffa_ulhaq8" />
            </div>
            <div className="hover:scale-110 hover:-translate-y-1 transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] rounded-full bg-indigo-900/40 p-1 border border-indigo-400/50">
              <LinkedInButtonLink username="daffaulhaqf" />
            </div>
          </div>

          <div className="mt-8 grid gap-5 text-sm font-semibold sm:grid-cols-2">
            <div className="inner-box-glow rounded-xl p-5">
              <p className="text-indigo-300 text-xs tracking-widest uppercase mb-2 font-black drop-shadow-[0_0_8px_rgba(165,180,252,0.9)]">Hobi</p>
              <p className="mt-2 text-blue-50 leading-relaxed font-medium">Main game (Geometry Dash, MLBB, game FPS/TPS + Story kayak Resident Evil), dengar lagu, main futsal</p>
            </div>
            <div className="inner-box-glow rounded-xl p-5">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-2 font-black drop-shadow-[0_0_8px_rgba(216,180,254,0.9)]">Fun Fact</p>
              <p className="mt-2 text-blue-50 leading-relaxed font-medium">Aku fans King Emyu dan King Barca</p>
            </div>
          </div>

          <div className="inner-box-glow mt-5 mb-2 rounded-xl p-5 border-2 border-[#38bdf8]">
            <p className="text-blue-300 text-xs font-black tracking-widest uppercase mb-2 drop-shadow-[0_0_8px_rgba(147,197,253,0.9)]">Lagu Favorit</p>
            <p className="my-3 text-sm font-medium text-indigo-50">
              Banyak sih, sayangnya disini cuman bisa satu lagu :&apos;( Yaudah deh, ini dia &quot;Daylight -
              Maroon 5&quot;
            </p>

            <div className="rounded-xl overflow-hidden border-2 border-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.5)]">
              <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/1NNAI51EuoRWw1ydX1zV7S?si=a6edcd2e0d454909" />
            </div>
          </div>

        </div>
      </div>
    </div>,
    document.body
  )
}

export default MemberPopup
