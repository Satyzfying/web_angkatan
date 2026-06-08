'use client'

import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'

import Image from 'next/image'

import Instagram from '@/components/atoms/button/InstagramButtonLink'
import LinkedInButtonLink from '@/components/atoms/button/LinkedInButtonLink'
import SpotifyEmbed from '@/components/molecules/SpotifyEmbed'

import ProfileImage from './image.jpeg'
import BackgroundImage from './polkadot.jpg'
import StarImage from './star.png'
import Sticker1 from './mametchi.png'
import Sticker2 from './pinkie.png'

import { Pacifico } from 'next/font/google'
import { Quicksand } from 'next/font/google'

const pacifico = Pacifico({
  subsets: ['latin'],
  weight: ['400']
})


const quicksand = Quicksand({
  subsets: ['latin'],
  weight: ['400', '500', '600']
})

type MemberPopupProps = {
  isOpen: boolean
  onClose: () => void
}



const StarField = () => {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-20">
      {Array.from({ length: 15 }).map((_, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: `${5 + ((i * 7) % 90)}%`,
            top: '-50px',
            animation: `fall ${5 + (i % 3)}s linear ${i * 0.4}s infinite`
          }}
        >
          <Image
            src={StarImage}
            alt=""
            width={64}
            height={64}
            className="opacity-80"
          />
        </div>
      ))}

      <style jsx>{`
        @keyframes fall {
          from {
            transform: translateY(-50px);
          }

          to {
            transform: translateY(900px);
          }
        }
      `}</style>
    </div>
  )
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
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto px-4">
      <button
        type="button"
        aria-label="Close member detail"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      <div className="border-neutral-cs-10 bg-blue-cs-40 relative z-10 max-h-[100dvh] w-full max-w-[720px] animate-[member-popup-show_200ms_ease-out] overflow-y-auto rounded-2xl border-2 p-6 text-white shadow-xl sm:p-8"
      style={{
        backgroundImage: `url(${BackgroundImage.src})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}  
      > 
        <StarField />

        <button
          type="button"
          aria-label="Close member detail"
          onClick={onClose}
          className="border-neutral-cs-10 hover:bg-neutral-cs-10/10 absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border text-xl leading-none"
        >
          x
        </button>

<div className="relative mb-8 rounded-3xl border-[6px] border-black p-0 z-10">
  <div className="overflow-hidden rounded-2xl border-2 border-white">
    <Image
      src={ProfileImage}
      alt="Profile Image"
      className="h-120 w-full object-cover object-center"
    />
  </div>

  <Image
    src={Sticker1}
    alt=""
    width={200}
    height={200}
    className="absolute top-2 right-2 z-10 rotate-12"
  />

  <Image
    src={Sticker2}
    alt=""
    width={220}
    height={220}
    className="absolute bottom-2 left-2 z-10 rotate-12"
  />
</div>

       <div className="pr-10 relative z-30">
         <div className="inline-block rounded-2xl border border-white/20 bg-black/60 px-6 py-4 shadow-lg backdrop-blur-md">
           <h2 className={`${pacifico.className} text-6xl font-bold text-[#ff69b4] drop-shadow-[0_0_15px_rgba(255,105,180,0.9)]`}>
             Nabila Sharliz Sigit
           </h2>

           <p className={`${quicksand.className} mt-2 text-xl font-semibold text-white/80`}>
             5027251054 ♡ Surabaya
           </p>
         </div>
        </div>

        <div className="mt-5 flex gap-2 z-30">
          {/* UBAH USERNAME INSTAGRAM */}
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-pink-500/80 shadow-lg backdrop-blur-md">
            <Instagram username="tsukingg" />
          </div>
          {/* UBAH USERNAME LINKEDIN */}
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-pink-500/80 shadow-lg backdrop-blur-md">
            <LinkedInButtonLink username="nabilasharlizsigit" />
          </div>
        </div>

        
<div className="mt-6 grid gap-4 text-sm font-semibold sm:grid-cols-2 relative z-30">
  <div className="border-neutral-cs-10/40 rounded-xl border bg-black/60 p-4 backdrop-blur-md">
    {/* UBAH HOBI KAMU */}
    <p className={`${quicksand.className} text-neutral-cs-10/60 text-lg tracking-wide uppercase`}>
      Hobi ⋆౨ৎ˚⟡˖ ࣪
    </p>
    <div className={`${quicksand.className} mt-2 text-white space-y-1`}>
      <p>1. Nonton (mostly anime, YouTube, kartun tertentu)</p>
      <p>2. Baca Webtoon / Manhwa / Manga</p>
      <p>3. Main game (kalau ada waktu, mostly Roblox)</p>
      <p>4. Do creative things (DIY, crochet, arts, etc)</p>
      <p>5. Shopping & jalan-jalan (kalau ada duit T_T)</p>
    </div>
  </div>

  <div className="border-neutral-cs-10/40 rounded-xl border bg-black/60 p-4 backdrop-blur-md">
    {/* UBAH FUNFACT KAMU */}
    <p className={`${quicksand.className} text-neutral-cs-10/60 text-lg tracking-wide uppercase`}>
      Fun Fact ꩜ .ᐟ
    </p>
    <div className={`${quicksand.className} mt-2 text-white space-y-1`}>
      <p>1. Aku setakut itu sama kodok / katak </p>
      <p>2. Aku pengen bisa pakai tembak (firearm) anykind, bukan untuk hal buruk tentu saja,,,</p>
  </div>
  </div>
</div>

<div className="mt-4 relative z-30">
  <div className="border-neutral-cs-10/40 mb-3 rounded-xl border bg-black/60 p-4 backdrop-blur-md">
    <p className={`${quicksand.className} text-neutral-cs-10/60 text-lg font-bold tracking-wide uppercase`}>
      Lagu Favorit ♬⋆.˚
    </p>

    <p className={`${quicksand.className} mt-2 text-sm font-semibold text-white`}>
      Song of the Stars, dan banyak lagii (mostly lagunya TXT, tp ada jg dari kpop, jpop, dan pop lain, banyak dah pokoknya)
    </p>
  </div>

          {/* UBAH URL SPOTIFY KAMU DENGAN LAGU FAVORIT MU */}
          <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/1Kv0G4eKjJ4ysGRXlHvQCm?si=99115b16f3854f78" />
        </div>
      </div>
    </div>,
    document.body
  )
}

export default MemberPopup
