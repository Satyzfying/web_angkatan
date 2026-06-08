'use client'

import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'

import Image from 'next/image'
import Instagram from '@/components/atoms/button/InstagramButtonLink'
import LinkedInButtonLink from '@/components/atoms/button/LinkedInButtonLink'
import SpotifyEmbed from '@/components/molecules/SpotifyEmbed'

import ProfileImage from './image.png'
import Achievement1 from './image1.png'
import Achievement2 from './image2.png'
import Achievement3 from './image3.png'

type MemberPopupProps = {
  isOpen: boolean
  onClose: () => void
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

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto px-4">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes steam-shine {
          0% { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
        .animate-steam-shine { background-size: 200% auto; animation: steam-shine 2.5s linear infinite; }
        @keyframes profile-sweep {
          0% { transform: translateX(-100%) translateY(-100%); }
          50% { transform: translateX(100%) translateY(100%); }
          100% { transform: translateX(100%) translateY(100%); }
        }
        .animate-profile-sweep { animation: profile-sweep 4s ease-in-out infinite; }
      `}} />

      <button type="button" aria-label="Close" onClick={onClose} className="fixed inset-0 bg-[#000000]/80" />

      <div className="relative z-10 w-full max-w-[640px] animate-[member-popup-show_200ms_ease-out] overflow-hidden rounded-sm border border-[#45556c] bg-[#1b2838] bg-gradient-to-b from-[#2a475e] to-[#1b2838] shadow-2xl">
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-sm">
          <div className="animate-profile-sweep absolute -inset-[100%] h-[300%] w-[300%] bg-gradient-to-br from-transparent via-white/[0.04] to-transparent"></div>
        </div>

        <div className="relative z-10 h-full w-full max-h-[calc(100vh-9rem)] overflow-y-auto p-6 sm:max-h-[calc(100vh-10rem)] sm:p-8">
          
          {/* FIX: Close button is now in a sticky container to ensure it stays above the image */}
          <div className="sticky top-0 right-0 z-50 flex justify-end">
            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center text-2xl text-[#8f98a0] transition-colors hover:text-white"
            >
              ×
            </button>
          </div>

          <div className="mb-6 overflow-hidden rounded-sm border-2 border-[#54a5d4] bg-black shadow-[0_0_15px_rgba(84,165,212,0.25)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(84,165,212,0.5)]">
            <Image src={ProfileImage} alt="Profile" className="h-80 w-full object-cover object-[50%_30%] sm:h-96" />
          </div>

          {/* ... rest of your code remains the same ... */}
          <div className="pr-10">
            <div className="group flex w-fit origin-left items-center gap-3 transition-transform duration-300 hover:scale-105">
              <h2 className="cursor-default text-3xl font-light text-white drop-shadow-md transition-all duration-300 group-hover:text-[#66c0f4] group-hover:drop-shadow-[0_0_10px_rgba(102,192,244,0.6)]">
                Khalifa Suryadinarta
              </h2>
              <div title="Steam Level" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-[#c02942] bg-black/40 text-sm font-medium text-white shadow-[0_0_8px_rgba(192,41,66,0.4)]">
                19
              </div>
            </div>
            <p className="mt-1.5 text-sm text-[#8f98a0]">5027251104 - Jogja</p>
          </div>

          <div className="mt-5 flex gap-3">
             <div className="transition-transform duration-300 hover:scale-110 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]"><Instagram username="Ava.khlfa" /></div>
             <div className="transition-transform duration-300 hover:scale-110 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]"><LinkedInButtonLink username="Ava.khlfa" /></div>
          </div>

          <div className="mt-8 grid gap-4 text-sm sm:grid-cols-2">
            <div className="rounded-sm border border-[#232833] bg-black/40 p-4 transition-colors hover:bg-black/60">
              <p className="mb-2 text-[11px] font-normal uppercase tracking-wider text-[#66c0f4]">Hobi</p>
              <p className="font-medium text-[#e1e8ed]">Edit</p>
            </div>
            <div className="rounded-sm border border-[#232833] bg-black/40 p-4 transition-colors hover:bg-black/60">
              <p className="mb-2 text-[11px] font-normal uppercase tracking-wider text-[#66c0f4]">Fun Fact</p>
              <p className="font-medium text-[#e1e8ed]">Secara impulsif daftar sapang</p>
            </div>
          </div>

          <div className="mt-4 rounded-sm border border-[#232833] bg-black/40 p-4 transition-colors hover:bg-black/60">
            <p className="mb-2 text-[11px] font-normal uppercase tracking-wider text-[#66c0f4]">Lagu Favorit</p>
            <p className="mb-4 text-[#e1e8ed]">Deftones - I think about you all of the time</p>

            <div className="overflow-hidden rounded-sm border border-[#232833] shadow-md">
              <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/0M5NH22uVXHSXjSi5SXTXM?si=181bf6334d9a4217" />
            </div>
          </div>

          {/* Steam Achievement Progress */}
          <div className="mt-4 flex flex-col justify-between gap-4 rounded-sm border border-[#232833] bg-[#121a25]/60 p-4 transition-colors hover:bg-black/60 sm:flex-row sm:items-center">
            
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="text-sm font-medium text-[#e1e8ed]">Achievement Progress</span>
              <span className="text-sm text-[#8f98a0]">9 of 9</span>
              
              {/* Animated Gold Steam Progress Bar */}
              <div className="mt-1 h-2 w-full rounded-full bg-black/80 shadow-[0_0_8px_rgba(220,185,87,0.3)] sm:mt-0 sm:ml-2 sm:w-32">
                <div className="animate-steam-shine h-full w-full rounded-full bg-gradient-to-r from-[#7a622c] via-[#ffd050] to-[#7a622c]"></div>
              </div>
            </div>

            {/* Actual Imported Images for Achievements */}
            <div className="flex shrink-0 items-center gap-1">
              <Image 
                src={Achievement1} 
                alt="White Pony Achievement" 
                title="White Pony"
                className="h-10 w-10 rounded-[2px] border border-[#3b4b5e] object-cover shadow-sm transition-transform hover:scale-110" 
              />
              <Image 
                src={Achievement2} 
                alt="Around the Fur Achievement" 
                title="Around the Fur"
                className="h-10 w-10 rounded-[2px] border border-[#3b4b5e] object-cover shadow-sm transition-transform hover:scale-110" 
              />
              <Image 
                src={Achievement3} 
                alt="Diamond Eyes Achievement" 
                title="Diamond Eyes"
                className="h-10 w-10 rounded-[2px] border border-[#3b4b5e] object-cover shadow-sm transition-transform hover:scale-110" 
              />
            </div>
            
          </div>
        </div>

      </div>
    </div>,
    document.body
  )
}

export default MemberPopup