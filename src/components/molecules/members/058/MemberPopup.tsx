'use client'

import React, { useEffect, useState, useRef } from 'react'

import Image from 'next/image'

import Instagram from '@/components/atoms/button/InstagramButtonLink'
import LinkedInButtonLink from '@/components/atoms/button/LinkedInButtonLink'
import SpotifyEmbed from '@/components/molecules/SpotifyEmbed'

import ProfileImage from './image.png'
import ProfileImage2 from './image2.png'
import QuoteImage from './quote.png'

type MemberPopupProps = {
  isOpen: boolean
  onClose: () => void
}

const MemberPopup = ({ isOpen, onClose }: MemberPopupProps) => {
  const [isHovered, setIsHovered] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isMusicPlaying, setIsMusicPlaying] = useState(true)
  const [showWarning, setShowWarning] = useState(true)
  const [isFlipped, setIsFlipped] = useState(false)
  const [showImage2, setShowImage2] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    setShowWarning(true)
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
      setShowWarning(true)
    }
  }, [isOpen, onClose])

  useEffect(() => {
    if (!isOpen || showWarning) return
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    const audio = new Audio('/assets/audio/audio.mp3')
    audio.loop = true
    audio.play()
    audioRef.current = audio
    return () => {
      audio.pause()
      audio.currentTime = 0
      audioRef.current = null
    }
  }, [isOpen, showWarning])

  useEffect(() => {
    const interval = setInterval(() => {
      setShowImage2(prev => !prev)
    }, 500)
    return () => clearInterval(interval)
  }, [])

  if (!isOpen) return null

  if (showWarning) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center"
        style={{ backgroundColor: '#210705' }}>
        <div className="text-center">
          <p className="text-white text-4xl font-black">⚠️ FLASH WARNING ⚠️</p>
          <p className="text-white/60 text-sm mt-4 max-w-sm mx-auto">This page contains flashing lights and effects that may affect photosensitive viewers.</p>
          <div className="flex gap-4 justify-center mt-8">
            <button type="button" onClick={() => setShowWarning(false)}
              className="px-6 py-2 bg-white text-black font-bold rounded-lg hover:bg-white/80 transition-all">
              Continue
            </button>
            <button type="button" onClick={onClose}
              className="px-6 py-2 border border-white/40 text-white font-bold rounded-lg hover:bg-white/10 transition-all">
              Go Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto">
      <div className="flex min-h-full items-start justify-center px-10 pt-28 pb-8 sm:pt-32">
        <div onClick={onClose} className="absolute inset-0">
          <video autoPlay loop muted playsInline className="w-full h-full object-cover">
            <source src="/assets/videos/bgVid.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0" style={{ backgroundColor: 'rgba(33, 6, 3, 0.6)' }} />
        </div>

        <div className="bg-red-950/50 relative z-10 max-h-[calc(100vh-9rem)] w-full max-w-[720px] animate-[member-popup-show_200ms_ease-out] overflow-y-auto rounded-2xl p-6 text-white shadow-2xl shadow-black sm:max-h-[calc(100vh-10rem)] sm:p-8">
          <button type="button" aria-label="Close member detail" onClick={onClose}
            className="border-neutral-cs-10 hover:bg-neutral-cs-10/10 absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border text-xl leading-none">
            x
          </button>

          <div className="mb-5 rounded-[15px] relative cursor-pointer"
            style={{ perspective: '1000px' }}
            onMouseEnter={() => { setIsFlipped(true); setIsHovered(true) }}
            onMouseLeave={() => { setIsFlipped(false); setIsHovered(false) }}>
            <div style={{
              transition: 'transform 0.6s',
              transformStyle: 'preserve-3d',
              transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
              position: 'relative',
              borderRadius: '15px'
            }}>
              <div style={{ backfaceVisibility: 'hidden', borderRadius: '15px', overflow: 'hidden' }}>
                <Image src={QuoteImage} alt="Quote" className="h-120 w-full object-cover object-center" />
              </div>
              <div style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', position: 'absolute', inset: 0, borderRadius: '15px', overflow: 'hidden' }}>
                <Image src={ProfileImage} alt="Profile Image" className="h-120 w-full object-cover object-center absolute inset-0" style={{ opacity: showImage2 ? 0 : 1 }} />
                <Image src={ProfileImage2} alt="Profile Image 2" className="h-120 w-full object-cover object-center absolute inset-0" style={{ opacity: showImage2 ? 1 : 0 }} />
              </div>
            </div>
          </div>

          <button type="button"
            onClick={(e) => {
              e.stopPropagation()
              if (audioRef.current) {
                if (isMusicPlaying) audioRef.current.pause()
                else audioRef.current.play()
                setIsMusicPlaying(!isMusicPlaying)
              }
            }}
            className="mt-2 text-sm font-semibold text-white/60 hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] hover:-translate-y-1 transition-all duration-300">
            {isMusicPlaying ? '🔇Music' : '🔊Music'}
          </button>

          <div className="pr-10">
            <h2 className="text-2xl font-black">Azita Zahwa Zahida Asmoro</h2>
            <p className="text-neutral-cs-10/70 mt-1 text-sm font-semibold">5027251058 - Banjarnegara</p>
          </div>

          <div className="mt-5 flex gap-2">
            <div className="hover:-translate-y-1 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all duration-300">
              <Instagram username="hank.ways" />
            </div>
            <div className="hover:-translate-y-1 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all duration-300">
              <LinkedInButtonLink username="zahwaasmoro" />
            </div>
          </div>

          <div className="mt-6 grid gap-4 text-sm font-semibold sm:grid-cols-2">
            <div className="border-neutral-cs-10/40 rounded-xl border p-4">
              <p className="text-neutral-cs-10/60 text-xs tracking-widest uppercase" style={{ fontFamily: 'var(--font-blackgoth)' }}>Hobi</p>
              <ul className="mt-2 list-disc list-inside space-y-1">
                <li>Loving ma <a href="https://www.instagram.com/_doolsetnet" target="_blank" rel="noopener noreferrer" className="underline hover:text-red-400">Husband</a> ♡</li>
                <li>CATS</li>
                <li>Reading n Painting</li>
                <li>Blasting songs 24/7</li>
                <li>Learn new languages</li>
                <li>Scrapbooking</li>
              </ul>
            </div>
            <div className="border-neutral-cs-10/40 rounded-xl border p-4">
              <p className="text-neutral-cs-10/60 text-xs tracking-widest uppercase" style={{ fontFamily: 'var(--font-blackgoth)' }}>Fun Fact</p>
              <p className="mt-2">Wanted to be a Firefighter</p>
            </div>
          </div>

          <div className="border-neutral-cs-10/40 mt-4 rounded-xl border p-4">
            <p className="text-neutral-cs-10/60 text-xs font-bold tracking-widest uppercase" style={{ fontFamily: 'var(--font-blackgoth)' }}>Lagu Favorit</p>
            <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/4atsZkGtoHHPugKK5wzAE1?si=ca2b456f489d40b6" />
            <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/5fpq1wF8xa5tSSlcKHdmGQ?si=f0a404fc7b534c9f" />
            <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/3EPqLcliwi9bd5h77Hkuh8?si=4b36c328c9ee4ee2" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default MemberPopup