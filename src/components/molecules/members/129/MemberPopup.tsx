'use client'

import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'

import Image from 'next/image'

import Instagram from '@/components/atoms/button/InstagramButtonLink'
import LinkedInButtonLink from '@/components/atoms/button/LinkedInButtonLink'
import SpotifyEmbed from '@/components/molecules/SpotifyEmbed'

import ProfileImage from './image.jpeg'
import BackgroundImage from './background.jpg'

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
  <div
  className="fixed inset-0 z-[100] flex items-start justify-center overflow-hidden px-4"
  style={{
  backgroundImage: `linear-gradient(rgba(255,255,255,0.5), rgba(255,255,255,0.5)), url(${BackgroundImage.src})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  }}
>
    
    <button
      type="button"
      aria-label="Close member detail"
      onClick={onClose}
      className="absolute inset-0 bg-[#222]/60 backdrop-blur-[2px]"
    />

    <div
    className="
      relative
      z-10
      w-full
      max-w-[720px]
      h-[100dvh] max-h-[100dvh]
      overflow-y-auto
      [-ms-overflow-style:none]
      [scrollbar-width:none]
      [&::-webkit-scrollbar]:hidden
      rounded-[16px]
      border-[6px]
      border-black
      bg-[#F6F2EA]
      p-6
      text-black
      shadow-[14px_14px_0px_#D6D0C8]
      animate-[member-popup-show_200ms_ease-out]
      sm:p-8
    "
>


      <button
  type="button"
  aria-label="Close member detail"
  onClick={onClose}
  className="group absolute top-5 left-5"
>
  <div className="flex gap-3">

    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FF5F57] shadow-[0_2px_8px_rgba(0,0,0,0.25)] ring-1 ring-black/10 transition hover:scale-110">
      <span className="text-[10px] font-bold text-black opacity-0 transition group-hover:opacity-100">
        ×
      </span>
    </span>

    <span className="h-5 w-5 rounded-full bg-[#FEBC2E] shadow-[0_2px_8px_rgba(0,0,0,0.25)] ring-1 ring-black/10 transition hover:scale-110" />

    <span className="h-5 w-5 rounded-full bg-[#28C840] shadow-[0_2px_8px_rgba(0,0,0,0.25)] ring-1 ring-black/10 transition hover:scale-110" />

  </div>
</button>

      <div className="mt-8 mb-6 overflow-hidden rounded-xl border-[5px] border-black">
        <Image
          src={ProfileImage}
          alt="Profile Image"
          className="h-[480px] w-full object-cover object-top"
        />
      </div>

      <div className="pr-10">

  <div
  className="
    inline-block
    rounded-2xl
    border-[4px]
    border-black
    bg-[#e70c0c]
    px-6
    py-3
    shadow-[6px_6px_0px_#000]
    transition-all
    duration-300
    hover:-translate-y-2
    hover:scale-[1.03]
    hover:shadow-[10px_10px_0px_#000]
  "
  >
    <h2 className="text-4xl font-black uppercase tracking-tight text-white">
      Dafa Ridho Zhafif
    </h2>
  </div>

  <div
  className="
    mt-3
    inline-block
    rounded-xl
    border-[4px]
    border-black
    bg-[#1fc600]
    px-5
    py-2
    shadow-[4px_4px_0px_#000]
    transition-all
    duration-300
    hover:-translate-y-1
    hover:scale-[1.05]
    hover:shadow-[8px_8px_0px_#000]
  "
  >
    <p className="text-base font-black text-[text-shadow:0_3px_6px_rgba(0,0,0,0.22)]">
      5027251129 • Jakarta
    </p>
  </div>

</div>  

      <div className="mt-6 flex gap-4">

  <div className="rounded-xl border-[4px] border-black bg-[#D8429B] p-1 shadow-[5px_5px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition">
    <Instagram username="dafazhf" />
  </div>

  <div className="rounded-xl border-[4px] border-black bg-[#004182] p-1 shadow-[5px_5px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition">
    <LinkedInButtonLink username="dafa-zhafif-0626b3379" />
  </div>

</div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">

        <div
        className="
        rounded-xl
        border-[4px]
        border-black
        bg-[#0057AD]
        p-5
        text-white
        shadow-[6px_6px_0px_#000]
        transition-all
        duration-200
        hover:-translate-y-2
        hover:shadow-[10px_10px_0px_#000]
        hover:scale-[1.02]
        cursor-default
        "
        >
          <p className="text-xs font-black uppercase [text-shadow:0_2px_4px_rgba(0,0,0,0.25)]">
            Hobi
          </p>

          <p className="mt-3 text-lg font-bold [text-shadow:0_3px_6px_rgba(0,0,0,0.22)]">
            otomotif...(?)<br />
            dengerin musik
          </p>
        </div>

        <div
       className="
       rounded-xl
       border-[4px]
       border-black
        bg-[#FBDA0C]
        p-5
        text-[#222]
        shadow-[6px_6px_0px_#000]
        transition-all
        duration-200
        hover:-translate-y-2
        hover:shadow-[10px_10px_0px_#000]
        hover:scale-[1.02]
        cursor-default
"
>
          <p className="text-xs font-black uppercase [text-shadow:0_2px_4px_rgba(0,0,0,0.25)]">
            Fun Fact
          </p>

          <p className="mt-3 text-lg font-bold [text-shadow:0_3px_6px_rgba(0,0,0,0.22)]">
            ga bisa kena asap rokok 🙏🏻🙏🏻
          </p>
        </div>

      </div>

     <div
  onClick={() =>
    window.open(
      'https://open.spotify.com/user/nips9ybrwpjs7nn1kehrk3w1s?si=966303e83c6f43c1',
      '_blank'
    )
  }
  className="
    mt-5
    rounded-xl
    border-[5px]
    border-black
    bg-[#16B6A5]
    p-5
    text-white
    shadow-[8px_8px_0px_#000]
    transition-all
    duration-300
    hover:-translate-y-2
    hover:shadow-[12px_12px_0px_#000]
    hover:scale-[1.015]
    cursor-pointer
  "
>

  <p className="text-xs font-black uppercase [text-shadow:0_2px_4px_rgba(0,0,0,0.25)]">
    Lagu Favorit
  </p>

  <p className="my-3 text-xl font-black [text-shadow:0_4px_8px_rgba(0,0,0,0.28)]">
    Egosentris
  </p>

  <div
    className="rounded-lg overflow-hidden"
    onClick={(e) => e.stopPropagation()}
  >
    <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/5rDlgdli7szsCEtipq96Mh?si=f04fc7fa50024b53" />
  </div>

</div>

</div>
    </div>,
  document.body
)
}

export default MemberPopup