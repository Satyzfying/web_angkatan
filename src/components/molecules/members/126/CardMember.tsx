'use client'

import React, { useState } from 'react'

import Image from 'next/image'

import Instagram from '@/components/atoms/button/InstagramButtonLink'
import LinkedInButtonLink from '@/components/atoms/button/LinkedInButtonLink'

import DiscordEffect from '@/assets/images/members/discord-effect.svg'

import MemberPopup from './MemberPopup'
import ProfileImage from './image.jpg'
import CodeBg from './assets/code.png'

const introVideoSrc = "https://github.com/Raillyn-FA/MyAssets/releases/download/v1.0/Intro.mp4"
const welcomeVideoSrc = "https://github.com/Raillyn-FA/MyAssets/releases/download/v1.0/welcome.mp4"

const CardMember = () => {
  const [phase, setPhase] = useState<'idle' | 'intro' | 'code' | 'welcome' | 'popup'>('idle')
  const [code, setCode] = useState('')
  const [wrongCode, setWrongCode] = useState(false)

  return (
    <>
      {/*  JANGAN PERNAH UBAH STRUKTUR CARD MEMBER KARENA KODE INI AKAN DI-CRAWL OLEH SCRIPT UNTUK MENGAMBIL DATA MEMBER, UBAH DATA MEMBER YANG DIPERLUKAN SAJA. JANGAN JUGA UBAH STYLE CARD MEMBER KARENA STYLE YANG SAMA DIBUTUHKAN AGAR TAMPILAN WEBSITE KONSISTEN */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => setPhase('intro')}
        onKeyDown={(event) => {
          if (event.target !== event.currentTarget) {
            return
          }

          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            setPhase('intro')
          }
        }}
        className="relative z-10 h-auto w-72 cursor-pointer overflow-hidden rounded-2xl border-2 border-neutral-50 px-6 py-7 backdrop-blur-lg transition-transform hover:scale-[1.02]"
      >
        <Image
          src={DiscordEffect}
          alt=""
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-50 select-none"
        />
        <div className="bg-blue-cs-40/10 absolute inset-0 -z-10 select-none"></div>
        <div className="flex h-full w-full flex-col gap-4">
          <div className="flex flex-col gap-3">
            <div className="flex gap-2 px-1" onClick={(event) => event.stopPropagation()}>
              {/* UBAH USERNAME INSTAGRAM KAMU */}
              <Instagram username="raillyn._" />
              {/* UBAH USERNAME LINKEDIN KAMU */}
              <LinkedInButtonLink username="rayhan-fadhilah-allayn" />
            </div>
            <div className="w-full rounded-2xl">
              <Image
                src={ProfileImage}
                alt="Profile Image"
                className="h-50 w-full rounded-2xl object-cover object-center"
              />
            </div>
          </div>
          {/*  JANGAN PERNAH UBAH STRUKTUR CARD MEMBER KARENA KODE INI AKAN DI-CRAWL OLEH SCRIPT UNTUK MENGAMBIL DATA MEMBER, UBAH DATA MEMBER YANG DIPERLUKAN SAJA. JANGAN JUGA UBAH STYLE CARD MEMBER KARENA STYLE YANG SAMA DIBUTUHKAN AGAR TAMPILAN WEBSITE KONSISTEN */}
          <div className="bg-blue-cs-40 rounded-2xl border-2 border-neutral-50 px-3 py-4 text-sm font-extrabold text-neutral-100">
            {/* UBAH NAMA KAMU */}
            <p>Rayhan Fadhilah Allayn</p>
            {/* UBAH NRP KAMU */}
            <p>5027251126</p>
            {/* UBAH ASAL KOTA KAMU */}
            <p>Bogor</p>
          </div>
        </div>
      </div>

      {/* PHASE: INTRO */}
      {phase === 'intro' && (
        <div className="fixed inset-0 z-[99] bg-black flex items-center justify-center">
          <video
            src={introVideoSrc}
            autoPlay
            playsInline
            className="h-full w-full object-contain"
            onEnded={() => setPhase('code')}
          />
          <button
            onClick={() => setPhase('code')}
            className="absolute bottom-8 right-8 px-4 py-2 text-sm font-bold text-white bg-white/20 border border-white/40 rounded-full backdrop-blur-sm hover:bg-white/30 hover:scale-105 transition-all"
          >
            Skip →
          </button>
        </div>
      )}

      {/* PHASE: CODE */}
      {phase === 'code' && (
        <div className="fixed inset-0 z-[99] bg-white flex items-center justify-center">
          {/* Card biru di tengah, mirip gambar */}
          <div className="relative w-[min(500px,90vw)]">
            <Image src={CodeBg} alt="Enter Code" className="w-full" />

            {/* Input — posisi di dalam kotak input putih pada gambar */}
            <input
              type="password"
              maxLength={3}
              value={code}
              onChange={(e) => { setCode(e.target.value); setWrongCode(false) }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  if (code === '126') {
                    setCode('')
                    setPhase('welcome')
                  } else {
                    setWrongCode(true)
                    setCode('')
                  }
                }
              }}
              placeholder="___"
              className="absolute top-[28%] right-[7%] h-[22%] w-[48%] bg-transparent text-center text-2xl text-gray-500 outline-none tracking-[0.5em]"
              autoFocus
            />

            {/* Tombol Confirm — overlay di atas area tombol pada gambar */}
            <button
              onClick={() => {
                if (code === '126') {
                  setCode('')
                  setPhase('welcome')
                } else {
                  setWrongCode(true)
                  setCode('')
                }
              }}
              className="absolute bottom-[7%] left-[7%] right-[7%] h-[22%] bg-transparent cursor-pointer"
              aria-label="Confirm"
            />
          </div>

          {wrongCode && (
            <p
              className="absolute bottom-[30%] text-sm font-bold animate-pulse"
              style={{ color: '#ff3c3c', textShadow: '0 0 8px #ff0000' }}
            >
              ACCESS DENIED
            </p>
          )}

          <button
            onClick={() => { setPhase('idle'); setCode('') }}
            className="absolute bottom-6 px-5 py-2 text-sm font-bold text-gray-600 bg-gray-200 border border-gray-400 rounded-full hover:bg-gray-300 hover:scale-105 transition-all"
          >
            Cancel
          </button>
        </div>
      )}

      {/* PHASE: WELCOME */}
      {phase === 'welcome' && (
        <div className="fixed inset-0 z-[99] bg-black flex items-center justify-center">
          <video
            src={welcomeVideoSrc}
            autoPlay
            playsInline
            className="h-full w-full object-contain"
            onEnded={() => setPhase('popup')}
          />
          <button
            onClick={() => setPhase('popup')}
            className="absolute bottom-8 right-8 px-4 py-2 text-sm font-bold text-white bg-white/20 border border-white/40 rounded-full backdrop-blur-sm hover:bg-white/30 hover:scale-105 transition-all"
          >
            Skip →
          </button>
        </div>
      )}

      <MemberPopup isOpen={phase === 'popup'} onClose={() => setPhase('idle')} />
    </>
  )
}

export default CardMember