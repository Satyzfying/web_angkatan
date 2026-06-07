'use client'

/* eslint-disable react-hooks/set-state-in-effect, react/no-unescaped-entities */

import React, { useEffect, useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import { createPortal } from 'react-dom'

import Instagram from '@/components/atoms/button/InstagramButtonLink'
import LinkedInButtonLink from '@/components/atoms/button/LinkedInButtonLink'
import SpotifyEmbed from '@/components/molecules/SpotifyEmbed'

import ProfileImage from './image.png'
import HoverProfileImage from './hover-image.png' 
import CoverBgImage from './cover-bg.png'     

// 1. IMPORT FOTO STIKER ANDA
import MyStickerPhoto from './sticker-bg.png' 

// 2. IMPORT GAMBAR UNTUK BACKGROUND DI SEBELAH/LUAR POPUP
import OutsideBgImage from './outside-bg.png' 

// 3. IMPORT LOGO ANDA (Ganti './logo.png' dengan file logo kerajaan/pribadi kamu)
import LogoImage from './logo.png' 

type MemberPopupProps = {
  isOpen: boolean
  onClose: () => void
}

const MemberPopup = ({ isOpen, onClose }: MemberPopupProps) => {
  // ---------------------------------------------------------
  // [STATE & REFS UNTUK FITUR DRAG-TO-PEEL STIKER]
  // ---------------------------------------------------------
  const [isSealed, setIsSealed] = useState(true)
  const [showWelcome, setShowWelcome] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const dragStartY = useRef(0)
  const [dragYPercentage, setDragYPercentage] = useState(0)
  
  const PEEL_THRESHOLD_PX = 180
  const stickerRef = useRef<HTMLDivElement>(null)

  const calculateDragPercentage = useCallback((currentY: number) => {
    const deltaY = dragStartY.current - currentY
    const percentage = Math.min(1, Math.max(0, deltaY / PEEL_THRESHOLD_PX))
    setDragYPercentage(percentage)
    return percentage
  }, [PEEL_THRESHOLD_PX])

  // ---------------------------------------------------------
  // [EVENT HANDLERS UNTUK MOUSE & TOUCH]
  // ---------------------------------------------------------
  const onDragStart = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!isSealed || isDragging) return
    setIsDragging(true)
    dragStartY.current = 'touches' in e ? e.touches[0].clientY : e.clientY
  }

  const onDragMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDragging || !isSealed) return
    const currentY = 'touches' in e ? e.touches[0].clientY : e.clientY
    calculateDragPercentage(currentY)
  }, [isDragging, isSealed, calculateDragPercentage])

  const onDragEnd = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDragging || !isSealed) return
    setIsDragging(false)
    
    const finalY = 'changedTouches' in e ? e.changedTouches[0].clientY : e.clientY
    const finalPercentage = calculateDragPercentage(finalY)
    
    if (finalPercentage > 0.9) {
      setIsSealed(false)
      setShowWelcome(true)
    } else {
      setDragYPercentage(0) 
    }
  }, [isDragging, isSealed, calculateDragPercentage])

  useEffect(() => {
    if (showWelcome) {
      const timer = setTimeout(() => {
        setShowWelcome(false)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [showWelcome])

  // ---------------------------------------------------------
  // [EFFECTS GLOBAL LISTENERS]
  // ---------------------------------------------------------
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', onDragMove)
      window.addEventListener('mouseup', onDragEnd)
      window.addEventListener('touchmove', onDragMove)
      window.addEventListener('touchend', onDragEnd)
    }
    
    return () => {
      window.removeEventListener('mousemove', onDragMove)
      window.removeEventListener('mouseup', onDragEnd)
      window.removeEventListener('touchmove', onDragMove)
      window.removeEventListener('touchend', onDragEnd)
    }
  }, [isDragging, onDragMove, onDragEnd])

  useEffect(() => {
    if (!isOpen) {
      setIsSealed(true)
      setShowWelcome(false)
      setIsDragging(false)
      setDragYPercentage(0)
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

  // ---------------------------------------------------------
  // [STYLING DINAMIS TRANSFORMASI STIKER]
  // ---------------------------------------------------------
  const stickerTransform = isSealed ? {
    transform: `
      translateY(${-dragYPercentage * PEEL_THRESHOLD_PX}px) 
      rotateX(${dragYPercentage * 20}deg)
      scaleY(${1 + dragYPercentage * 0.1}) 
      skewY(${-dragYPercentage * 5}deg)
    `,
    transformOrigin: 'top center',
    opacity: 1 - Math.max(0, dragYPercentage - 0.5) * 2,
    transition: isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.3s ease',
    boxShadow: 'none'
  } : {
    transform: `translateY(-200%) rotateX(45deg)`,
    opacity: 0,
    transition: 'all 0.5s ease-in'
  };

  const showMainContent = !isSealed && !showWelcome

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto px-4">
      
      {/* BACKGROUND DI SEBELAH/LUAR POPUP */}
      <div className="absolute inset-0 bg-black/75 backdrop-blur-md">
        <Image 
          src={OutsideBgImage} 
          alt="Outside Background" 
          fill
          className={`object-cover transition-opacity duration-1000 ease-in-out pointer-events-none ${isSealed ? 'opacity-0' : 'opacity-40'}`} 
        />
        <button
          type="button"
          aria-label="Close member detail"
          onClick={onClose}
          className="absolute inset-0 h-full w-full cursor-default"
        />
      </div>

      <div className={`relative z-10 max-h-[100dvh] w-full max-w-[720px] animate-[member-popup-show_200ms_ease-out] rounded-none border-4 border-amber-600/60 bg-zinc-950 p-6 font-mono text-zinc-100 shadow-[0_0_50px_rgba(217,119,6,0.15)] sm:p-8 ${showMainContent ? 'overflow-y-auto' : 'overflow-hidden'}`}>
        
        {/* 1. LAYER COVER & STIKER */}
        <div className={`absolute inset-0 z-30 bg-zinc-950 flex flex-col items-center justify-center cursor-default select-none transition-all duration-1000 ease-in-out ${isSealed ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          
          <Image 
            src={CoverBgImage} 
            alt="Cover Background" 
            fill
            className="object-cover opacity-40 z-0 pointer-events-none" 
          />

          <div className="absolute top-4 right-4 text-[10px] text-amber-400 font-bold tracking-widest bg-zinc-950 px-2 py-1 border border-amber-800 uppercase z-40">
            [ KINGDOM OF LIBERL SEAL ]
          </div>

          <div className="flex flex-col items-center justify-center w-full max-w-xs gap-4">
            <div 
              ref={stickerRef}
              style={stickerTransform}
              className="relative w-10/12 aspect-square bg-transparent transform rotate-1 rounded-sm text-center will-change-transform pointer-events-auto overflow-hidden"
            >
              <Image 
                src={MyStickerPhoto} 
                alt="My Photo Sticker" 
                fill
                className="object-cover opacity-100 z-0 pointer-events-none" 
              />
              <div 
                onMouseDown={onDragStart}
                onTouchStart={onDragStart}
                className="absolute -bottom-4 -right-4 flex h-14 w-14 items-center justify-center cursor-grab active:cursor-grabbing bg-transparent rounded-full z-20"
              />
            </div>
            <p className="text-[10px] text-amber-500/80 font-bold tracking-[0.2em] text-center uppercase animate-pulse">
              ◄ DRAG FROM THE CORNER TO OPEN ►
            </p>
          </div>
        </div>

        {/* 2. LAYAR TEKS WELCOME */}
        {!isSealed && (
          <div className={`absolute inset-0 z-20 bg-transparent flex flex-col items-center justify-center transition-all duration-700 ease-in-out pointer-events-none ${showWelcome ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <h1 className="text-2xl sm:text-3xl font-black tracking-[0.2em] text-amber-400 animate-pulse uppercase text-center max-w-md leading-relaxed drop-shadow-[0_0_10px_rgba(251,191,36,0.4)]">              WELCOME TO KINGDOM OF LIBERL
            </h1>
            <p className="text-[10px] text-amber-600/80 tracking-widest mt-2 uppercase font-bold">
              [ Now here's the profile ]
            </p>
          </div>
        )}

        {/* 3. WRAPPER UNTUK KONTEN PROFIL */}
        <div className={`transition-opacity duration-1000 ease-in-out ${showMainContent ? 'opacity-100' : 'opacity-0'}`}>
          
          <button
            type="button"
            aria-label="Close member detail"
            onClick={onClose}
            className="absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-none border-2 border-amber-700 text-xl leading-none font-bold text-amber-400 hover:bg-amber-950/30"
          >
            ✕
          </button>

          {/* --- BAGIAN LOGO DI ATAS FOTO --- */}
          <div className="flex justify-center mb-4">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]">
              <Image 
                src={LogoImage} 
                alt="Kingdom Crest" 
                fill 
                className="object-contain"
              />
            </div>
          </div>

          <div className="group relative z-10 mb-6 overflow-hidden rounded-none border-2 border-stone-700 transition-all duration-500">
            <Image src={ProfileImage} alt="Profile Image" className="h-[480px] w-full object-cover object-top" />
            <Image src={HoverProfileImage} alt="Hover Profile Image" className="absolute top-0 h-[480px] w-full object-cover object-top opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>

          <div className="pr-10">
            <h2 className="text-3xl font-black tracking-tight text-zinc-100 uppercase">Afriezal Suryapraba Laiasach</h2>
            <p className="mt-1 text-xs font-bold tracking-widest text-amber-400 uppercase">» NO. 5027251096 — REGION: SURABAYA</p>
          </div>

          <div className="mt-5 flex gap-2">
            <Instagram username="zalaiasach.1604" />
            <LinkedInButtonLink username="afriezal-suryapraba-laiasach" />
          </div>

          <div className="mt-6 grid gap-4 text-sm font-semibold sm:grid-cols-2">
            <div className="rounded-none border-2 border-stone-800 bg-zinc-900/40 p-4">
              <p className="text-xs font-bold tracking-widest text-amber-400 uppercase">HOBBY & PREFERENCES</p>
              <p className="mt-2 text-xs leading-relaxed font-normal text-zinc-300">
                Main Game(Mostly JRPG(Especialy Trails/Kiseki), tapi suka genre lain), Baca Buku(Mostly novel dan komik), Ndengerin musik(Especialy
                Rock or alt rock), Ngerakit model kit(kalo ada duit dan waktu)
              </p>
            </div>
            <div className="rounded-none border-2 border-stone-800 bg-zinc-900/40 p-4">
              <p className="text-xs font-bold tracking-widest text-amber-400 uppercase">FUN FACT</p>
              <p className="mt-2 text-xs leading-relaxed font-normal text-zinc-300">
                As you can see, my favorite game is Trails/Kiseki Series. Jangan tanya aku kenapa ini series game favorit ku kalo nggak mau mendengar aku yapping 10 jam
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-none border-2 border-stone-800 bg-zinc-900/30 p-4">
            <p className="text-xs font-bold tracking-widest text-amber-400 uppercase">SONG OF THE DAY AND BEYOND</p>
            <p className="my-2 text-lg font-black tracking-tight text-zinc-100 italic">
              "Wish You Were Here" by Pink Floyd
            </p>

            <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/6mFkJmJqdDVQ1REhVfGgd1?si=3c35d8c069c94247" />
          </div>
        </div>

      </div>
    </div>,
    document.body
  )
}

export default MemberPopup
