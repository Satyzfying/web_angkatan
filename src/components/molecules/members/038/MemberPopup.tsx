'use client'

import React, { useEffect, useState, useRef } from 'react'
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
  const popupRef = useRef<HTMLDivElement>(null)
  const [showIntro, setShowIntro] = useState(true)
  const [isAmbruk, setIsAmbruk] = useState(false)
  // State timeline akting: hop-back -> become-o -> freeze-first -> missile-strike
  const [minionState, setMinionState] = useState<'hop-back' | 'become-o' | 'freeze-first' | 'missile-strike'>('hop-back')
  
  // State untuk kontrol balik kartu (Flip Card)
  const [isFlipped, setIsFlipped] = useState(false)

  useEffect(() => {
    if (!isOpen || !popupRef.current) {
      return
    }

    const itemAnimations = Array.from(popupRef.current.querySelectorAll<HTMLElement>('[data-popup-item]')).map(
      (item, index) =>
        item.animate(
          [
            { opacity: 0, transform: 'translateY(-32px)' },
            { opacity: 1, transform: 'translateY(0)' },
          ],
          {
            duration: 450,
            delay: 100 + index * 90,
            easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
            fill: 'both',
          }
        )
    )

    return () => {
      itemAnimations.forEach((animation) => animation.cancel())
    }
  }, [isOpen, showIntro])

  useEffect(() => {
    if (!isOpen) {
      setShowIntro(true)
      setIsAmbruk(false)
      setMinionState('hop-back')
      setIsFlipped(false)
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    // ================= TIMELINE DRAMA INTRO BARU =================
    
    // 1. Detik 2.4: Minion mendarat pas di slot O, huruf O asli amblas ke bawah
    const ambrukTimer = setTimeout(() => {
      setIsAmbruk(true)
      setMinionState('become-o')
    }, 2400)

    // 2. Detik 3.0: Minion mengunci posisi di slot O dan MATUNG DIAM selama 2 detik penuh
    const freezeTimer = setTimeout(() => {
      setMinionState('freeze-first')
    }, 3000)

    // 3. Detik 5.0: Setelah 2 detik matung, bom jatuh meledakkan seluruh layar jadi KUNING
    const missileTimer = setTimeout(() => {
      setMinionState('missile-strike')
    }, 5000)

    // 4. Detik 7.5: Efek ledakan kuning selesai, langsung dialihkan ke profil utama Daffa
    const entryTimer = setTimeout(() => {
      setShowIntro(false)
    }, 7500)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
      clearTimeout(ambrukTimer)
      clearTimeout(freezeTimer)
      clearTimeout(missileTimer)
      clearTimeout(entryTimer)
    }
  }, [isOpen, onClose])

  if (!isOpen) {
    return null
  }

  return createPortal(
    // PADA BAGIAN INI KAMU BOLEH MENGUBAH STYLE SESUKA HATI KAMU, TAPI JANGAN UBAH STRUKTUR DAN FUNGSI DARI KODE INI AGAR FUNGSI POPUP TETAP BERJALAN DENGAN BAIK
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto px-4 bg-[#0072BB]/40 backdrop-blur-md">
      <button
        type="button"
        aria-label="Close member detail"
        onClick={onClose}
        className="absolute inset-0"
      />

      <style>{`
        /* 1. MINION LONCAT MUNDUR */
        @keyframes hop-backward-smooth {
          0% { transform: translate(170px, -30px) scale(1); }
          15% { transform: translate(140px, -140px) scale(0.95, 1.05); }
          35% { transform: translate(110px, -40px) scale(1.05, 0.95); }
          50% { transform: translate(80px, -150px) scale(0.95, 1.05); }
          75% { transform: translate(45px, -40px) scale(1.05, 0.95); }
          90% { transform: translate(20px, -160px) scale(0.9, 1.1); }
          100% { transform: translate(0px, -50px) scale(1); }
        }
        .animate-hop-back {
          animation: hop-backward-smooth 2.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        /* 2. MINION JATUH MENGGANTIKAN O */
        @keyframes fall-down-to-baseline {
          0% { transform: translate(0px, -50px) scale(1); }
          50% { transform: translate(0px, 12px) scale(1.15, 0.8); }
          80% { transform: translate(0px, -2px) scale(0.95, 1.05); }
          100% { transform: translate(0px, 6px) scale(1); }
        }
        .animate-become-o {
          animation: fall-down-to-baseline 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }

        /* 3. MINION MATUNG DIAM */
        .minion-freeze-state {
          transform: translate(0px, 6px) scale(1);
        }

        /* 4. BOM GEDE JATUH DARI ATAS */
        @keyframes big-missile-drop {
          0% { transform: translateY(-400px) scale(2.5); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: translateY(50px) scale(2.5); opacity: 1; }
        }
        .animate-big-missile {
          animation: big-missile-drop 0.5s cubic-bezier(0.55, 0.055, 0.675, 0.19) forwards;
        }

        /* 5. LEDAKAN KOMIK JADI KUNING TOTAL */
        @keyframes yellow-flash-bang {
          0% { opacity: 0; transform: scale(0); }
          20% { opacity: 1; transform: scale(1); }
          80% { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(1); }
        }
        .animate-yellow-explosion {
          animation: yellow-flash-bang 2s ease-in-out forwards;
          background-color: #FFE100;
        }

        /* HURUF O ASLI JATUH */
        @keyframes custom-o-fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(200px) rotate(45deg); opacity: 0; }
        }
        .animate-o-ambruk {
          animation: custom-o-fall 0.5s cubic-bezier(0.6, -0.28, 0.735, 0.045) forwards;
        }

        .minion-shadow {
          box-shadow: 10px 10px 0px 0px rgba(0, 0, 0, 1);
        }
        .denim-texture {
          background-color: #0072BB;
          background-image: radial-gradient(#005da1 1.5px, transparent 0);
          background-size: 12px 12px;
        }

        /* ENGINE ROTASI 3D BALIK KARTU */
        .perspective-wrapper {
          perspective: 1200px;
        }
        .card-rotator-3d {
          transform-style: preserve-3d;
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .flipped-state {
          transform: rotateY(180deg);
        }
        .card-face-front, .card-face-back {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .card-face-back {
          transform: rotateY(180deg);
        }
      `}</style>

      {/* ================= TAMPILAN 1: INTRO SEQUENCE MISSILE BLAST ================= */}
      {showIntro ? (
        <div className="relative z-10 flex flex-col items-center justify-center p-10 select-none w-full min-h-[100dvh] overflow-hidden">
          
          {/* OVERLAY LEDAKAN KUNING KOMIK */}
          {minionState === 'missile-strike' && (
            <div className="absolute inset-0 z-50 animate-yellow-explosion flex flex-col items-center justify-center text-black font-sans">
              <div className="text-5xl sm:text-7xl font-black tracking-normal uppercase border-8 border-black p-6 bg-white rotate-[-4deg] minion-shadow">
                KA-BOOM!
              </div>
            </div>
          )}

          {/* ANIMASI BOM GEDE SEBELUM MELEDAK (ROKET SUDAH DIGANTI BOM) */}
          {minionState === 'freeze-first' && (
            <div className="absolute top-1/2 left-1/2 -mt-40 -ml-4 z-40 text-4xl animate-big-missile pointer-events-none">
              💣
            </div>
          )}

          {/* Wrapper Konten Teks PROFIL */}
          <div className="relative flex items-end font-mono text-7xl font-black tracking-tighter text-white drop-shadow-[5px_5px_0px_rgba(0,0,0,1)] sm:text-8xl">
            <span>P</span>
            <span>R</span>
            
            <div className="relative inline-flex items-center justify-center w-[55px] sm:w-[65px] h-[75px] sm:h-[95px] mx-1">
              <span className={`absolute inset-0 text-center ${isAmbruk ? 'animate-o-ambruk' : ''}`}>
                O
              </span>
              
              {/* Karakter Minion Kapsul */}
              <div 
                className={`absolute left-1/2 -ml-6 flex h-16 w-12 items-center justify-center rounded-full border-4 border-black bg-[#FFE100] p-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] origin-bottom z-20
                  ${minionState === 'hop-back' ? 'animate-hop-back' : ''}
                  ${minionState === 'become-o' ? 'animate-become-o' : ''}
                  ${minionState === 'freeze-first' || minionState === 'missile-strike' ? 'minion-freeze-state' : ''}
                `}
              >
                <div className="relative flex h-7 w-7 items-center justify-center rounded-full border-[3px] border-black bg-white">
                  <div className={`h-2.5 w-2.5 rounded-full bg-black transition-all duration-300
                    ${minionState === 'hop-back' ? '-translate-x-1' : ''}
                    ${minionState === 'become-o' ? 'scale-120 translate-y-0.5' : ''}
                    ${minionState === 'freeze-first' ? 'scale-75 translate-y-0' : ''}
                  `} />
                </div>

                {/* Tanda Tanya Bingung Saat Matung */}
                {minionState === 'freeze-first' && (
                  <div className="absolute -top-7 text-xs font-black text-white bg-[#FF595E] border-2 border-black h-5 w-5 flex items-center justify-center rounded-full animate-bounce">
                    ?
                  </div>
                )}
              </div>
            </div>
            
            <span>F</span>
            <span>I</span>
            <span>L</span>
          </div>

          <p className="mt-14 font-mono text-xs font-black uppercase tracking-[0.4em] text-[#FFE100] drop-shadow-[1px_1px_0px_rgba(0,0,0,1)] text-center h-4">
            {minionState === 'hop-back' && "WALKING_BACKWARDS..."}
            {minionState === 'become-o' && "CRASHED!!"}
            {minionState === 'freeze-first' && "WATCH OUT FROM ABOVE!!"}
            {minionState === 'missile-strike' && "BANANA EXPLOSION!!"}
          </p>
        </div>
      ) : (
        
        /* ================= TAMPILAN 2: PROFIL UTAMA DAFFA (FLIP 3D CARD JUMBO SIZE) ================= */
        <div
          ref={popupRef}
          className="perspective-wrapper relative z-10 max-h-[100dvh] h-[780px] sm:h-[820px] w-full max-w-[700px] animate-[member-popup-show_200ms_ease-out] my-auto"
        >
          
          {/* Container Rotator Utama */}
          <div className={`card-rotator-3d relative w-full h-full hover:rotate-1 transition-transform duration-300 ${isFlipped ? 'flipped-state' : ''}`}>
            
            {/* ─── KARTU SISI DEPAN (FRONT FACE) ─── */}
            <div className="card-face-front absolute inset-0 w-full h-full rounded-[40px] border-[8px] border-black bg-[#FFE100] p-6 sm:p-8 text-black minion-shadow flex flex-col justify-between overflow-y-auto">
              
              <div>
                {/* Tombol Close Silang */}
                <button
                  type="button"
                  onClick={onClose}
                  className="absolute top-4 right-4 z-30 flex h-12 w-12 items-center justify-center rounded-full border-[5px] border-black bg-[#FF595E] text-2xl font-black text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:scale-110 active:scale-95 transition-all"
                >
                  X
                </button>

                {/* Foto Lanskap Daffa */}
                <div data-popup-item className="w-full overflow-hidden rounded-[25px] border-[6px] border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mb-6 aspect-[16/10]">
                  <Image 
                    src={ProfileImage} 
                    alt="Profile Image" 
                    className="h-full w-full object-cover object-center" 
                    priority
                  />
                </div>

                {/* Identitas Teks */}
                <div data-popup-item className="px-2 text-left">
                  <h3 className="text-4xl sm:text-5xl font-black uppercase tracking-tight leading-none drop-shadow-[1px_1px_0px_rgba(255,255,255,1)]">
                    Daffa Rifqi As Shidiq
                  </h3>
                  <p className="mt-3 font-mono text-sm sm:text-base font-bold text-[#0072BB]">
                    5027251038 — TEGAL
                  </p>
                </div>

                {/* Kotak Sosmed Denim Gelap & Hitam kontras */}
                <div data-popup-item className="flex justify-start gap-4 pl-2 mt-6">
                   <div className="rounded-2xl border-[4px] border-black bg-[#0072BB] h-16 w-16 flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:bg-black hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer">
                      <Instagram username="daffarifqiasshidiq" />
                   </div>
                   <div className="rounded-2xl border-[4px] border-black bg-[#0072BB] h-16 w-16 flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:bg-black hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer">
                      <LinkedInButtonLink username="daffa-rifqi-as-shidiq-0b6619379" />
                   </div>
                </div>
              </div>

              {/* Tombol Interaktif buat ngebalik kartu */}
              <button
                data-popup-item
                type="button"
                onClick={() => setIsFlipped(true)}
                className="w-full py-4 sm:py-5 mt-6 rounded-2xl border-[4px] border-black bg-white text-xs font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-2"
              >
                LIHAT DETAIL INFO ➔
              </button>
            </div>

            {/* ─── KARTU SISI BELAKANG (BACK FACE) ─── */}
            <div className="card-face-back absolute inset-0 w-full h-full rounded-[40px] border-[8px] border-black bg-[#FFE100] p-6 sm:p-8 text-black minion-shadow flex flex-col justify-between overflow-y-auto">
              
              <div className="space-y-5 text-left">
                {/* Header Kartu Belakang */}
                <div data-popup-item className="flex justify-between items-center border-b-4 border-black pb-3 px-1 mt-2">
                  <h4 className="text-2xl font-black uppercase tracking-tight">Banana Details 🍌</h4>
                  <span className="text-xs font-mono font-bold bg-white border-2 border-black px-2.5 py-1 rounded-md">INFO</span>
                </div>

                {/* Grid Box Hobi & Fun Fact */}
                <div data-popup-item className="grid gap-5 sm:grid-cols-2">
                  <div className="rounded-[20px] border-[5px] border-black denim-texture p-5 text-white shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:scale-[1.03] transition-transform flex flex-col justify-between h-full min-h-[140px]">
                    <span className="rounded-md bg-white px-2.5 py-1 text-[10px] font-black uppercase text-black border-2 border-black self-start">
                      Hobi
                    </span>
                    <p className="mt-3 text-base font-black">Ngemil & Musik</p>
                  </div>
                  <div className="rounded-[20px] border-[5px] border-black bg-[#38B000] p-5 text-white shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:scale-[1.03] transition-transform flex flex-col justify-between h-full min-h-[140px]">
                    <span className="rounded-md bg-white px-2.5 py-1 text-[10px] font-black uppercase text-black border-2 border-black self-start">
                      Fun Fact
                    </span>
                    <p className="mt-3 text-base font-black">Linjur dari SMK Akuntansi!</p>
                  </div>
                </div>

                {/* Spotify Embed */}
                <div data-popup-item className="rounded-[25px] border-[6px] border-black bg-white p-5 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
                  <div className="mb-3.5 flex items-center justify-between border-b-4 border-black pb-2 px-1">
                    <p className="font-mono text-sm font-black text-[#0072BB]">♫ LAGU FAVORIT</p>
                    <span className="animate-bounce text-base">🎵</span>
                  </div>
                  <div className="overflow-hidden rounded-xl border-4 border-black bg-[#FFE100] p-2.5">
                    <p className="mb-2 text-[11px] font-black uppercase tracking-tighter text-black">
                      Playing: Helena
                    </p>
                    <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/5dTHtzHFPyi8TlTtzoz1J9?si=TZ-VGQ-2S--93gh5AAlqQQ" />
                  </div>
                </div>
              </div>

              {/* Tombol Balik Kembali ke Depan */}
              <button
                data-popup-item
                type="button"
                onClick={() => setIsFlipped(false)}
                className="w-full py-4 sm:py-5 mt-6 rounded-2xl border-[4px] border-black bg-black text-white text-xs font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(100,100,100,0.5)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
              >
                🠔 KEMBALI KE FOTO
              </button>
            </div>

          </div>
        </div>
      )}
    </div>,
    document.body
  )
}

export default MemberPopup