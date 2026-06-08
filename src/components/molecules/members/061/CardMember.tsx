'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Instagram from '@/components/atoms/button/InstagramButtonLink'
import LinkedInButtonLink from '@/components/atoms/button/LinkedInButtonLink'
import DiscordEffect from '@/assets/images/members/discord-effect.svg'
import MemberPopup from './MemberPopup'
import WordleGate from './WordleGate'
import { getTodayKey } from './WordleGate'
import ProfileImage from './image.webp'

const CardMember = () => {
  const [isPopupOpen, setIsPopupOpen]   = useState(false)
  const [isGateOpen,  setIsGateOpen]    = useState(false)
  const [isSolved,    setIsSolved]      = useState(false)
  // offsetDays: 0 = today's gate, 1+ = historical help mode from ? button
  const [offsetDays,  setOffsetDays]    = useState(0)

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setIsSolved(localStorage.getItem(getTodayKey(0)) === 'true')
    }, 0)

    return () => window.clearTimeout(timeout)
  }, [])

  const handleCardClick = () => {
    if (isSolved) setIsPopupOpen(true)
    else { setOffsetDays(0); setIsGateOpen(true) }
  }

  /* called when any wordle is solved or user wants to go back further */
  const handleWordleSolved = (offset: number) => {
    if (offset === 0) {
      // today's gate solved — open the real popup
      setIsSolved(true)
      setIsGateOpen(false)
      setIsPopupOpen(true)
    } else {
      // help mode: roll back another day
      setOffsetDays(offset)
    }
  }

  /* ? button in popup — open yesterday's wordle without closing popup */
  const handleHelpRequest = () => {
    setIsPopupOpen(false)
    setOffsetDays(1)
    setIsGateOpen(true)
  }

  /* when help-mode gate closes, reopen the profile popup */
  const handleGateClose = () => {
    setIsGateOpen(false)
    if (isSolved) setIsPopupOpen(true)
  }

  return (
    <>
      {/*  JANGAN PERNAH UBAH STRUKTUR CARD MEMBER */}
      <div
        role="button" tabIndex={0}
        onClick={handleCardClick}
        onKeyDown={(e) => { if(e.key==='Enter'||e.key===' '){e.preventDefault();handleCardClick()} }}
        className="relative z-10 h-auto w-72 cursor-pointer overflow-hidden rounded-2xl border-2 border-neutral-50 px-6 py-7 backdrop-blur-lg transition-transform hover:scale-[1.02]"
      >
        <Image src={DiscordEffect} alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-50 select-none"/>
        <div className="bg-blue-cs-40/10 absolute inset-0 -z-10 select-none"/>
        <div className="flex h-full w-full flex-col gap-4">
          <div className="flex flex-col gap-3">
            <div className="flex gap-2 px-1" onClick={e=>e.stopPropagation()}>
              <Instagram username="wedaislost" />
              <LinkedInButtonLink username="weda-adikusuma-a5264a379" />
            </div>
            <div className="w-full rounded-2xl">
              <Image src={ProfileImage} alt="Profile Image" className="h-50 w-full rounded-2xl object-cover object-center"/>
            </div>
          </div>
          <div className="bg-blue-cs-40 rounded-2xl border-2 border-neutral-50 px-3 py-4 text-sm font-extrabold text-neutral-100">
            <p>I Ketut Weda Adikusuma</p>
            <p>5027251061</p>
            <p>Denpasar</p>
          </div>
        </div>
      </div>

      {isGateOpen && (
        <WordleGate
          key={offsetDays}
          isOpen
          onClose={handleGateClose}
          onSolved={handleWordleSolved}
          offsetDays={offsetDays}
        />
      )}

      <MemberPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        onOpenHelp={handleHelpRequest}
      />
    </>
  )
}

export default CardMember
