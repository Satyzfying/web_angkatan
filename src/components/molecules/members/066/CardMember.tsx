'use client'

import React, { useEffect, useRef, useState } from 'react'

import Image from 'next/image'

import { createPortal } from 'react-dom'

import Instagram from '@/components/atoms/button/InstagramButtonLink'
import LinkedInButtonLink from '@/components/atoms/button/LinkedInButtonLink'

import DiscordEffect from '@/assets/images/members/discord-effect.svg'

import MemberPopup from './MemberPopup'
import ProfileImage from './image.webp'

const CLICK_TARGET = 25
const CLICK_SECONDS = 5
const AUDIO_START_SECONDS = 118

const CardMember = () => {
  const backgroundAudioRef = useRef<HTMLAudioElement>(null)
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [isGameOpen, setIsGameOpen] = useState(false)
  const [clickCount, setClickCount] = useState(0)
  const [clickTimeLeft, setClickTimeLeft] = useState(CLICK_SECONDS)
  const [gameMessage, setGameMessage] = useState('Click 25 times in 5 seconds to unlock the profile.')
  const [isGameCleared, setIsGameCleared] = useState(false)
  const [isBackgroundMusicOn, setIsBackgroundMusicOn] = useState(false)

  const clickProgress = Math.min((clickCount / CLICK_TARGET) * 100, 100)

  const playBackgroundSong = (restart = false) => {
    const audio = backgroundAudioRef.current

    if (!audio) {
      return
    }

    if (restart || audio.currentTime < AUDIO_START_SECONDS) {
      audio.currentTime = AUDIO_START_SECONDS
    }

    void audio
      .play()
      .then(() => {
        setIsBackgroundMusicOn(true)
      })
      .catch(() => {
        setIsBackgroundMusicOn(false)
      })
  }

  const pauseBackgroundSong = () => {
    const audio = backgroundAudioRef.current

    if (!audio) {
      return
    }

    audio.pause()
    setIsBackgroundMusicOn(false)
  }

  const stopBackgroundSong = () => {
    const audio = backgroundAudioRef.current

    if (!audio) {
      return
    }

    audio.pause()
    audio.currentTime = AUDIO_START_SECONDS
    setIsBackgroundMusicOn(false)
  }

  const toggleBackgroundSong = () => {
    if (isBackgroundMusicOn) {
      pauseBackgroundSong()
      return
    }

    playBackgroundSong()
  }

  const startMiniGame = () => {
    stopBackgroundSong()
    setClickCount(0)
    setClickTimeLeft(CLICK_SECONDS)
    setGameMessage('Click 25 times in 5 seconds to unlock the profile.')
    setIsGameCleared(false)
    setIsGameOpen(true)
  }

  const closeMiniGame = () => {
    stopBackgroundSong()
    setIsGameOpen(false)
    setIsGameCleared(false)
  }

  const handleClickerPress = () => {
    if (isGameCleared) {
      return
    }

    const nextClickCount = clickCount + 1

    setClickCount(nextClickCount)

    if (nextClickCount >= CLICK_TARGET) {
      playBackgroundSong(true)
      setGameMessage('Challenge cleared. Playing Creep from 1:58...')
      setIsGameCleared(true)
      return
    }

    setGameMessage(`${CLICK_TARGET - nextClickCount} clicks left. Keep going.`)
  }

  useEffect(() => {
    if (!isGameOpen) {
      return
    }

    const previousOverflow = document.body.style.overflow

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        stopBackgroundSong()
        setIsGameOpen(false)
        setIsGameCleared(false)
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isGameOpen])

  useEffect(() => {
    if (!isGameOpen || isGameCleared) {
      return
    }

    const timer = window.setInterval(() => {
      setClickTimeLeft((currentTime) => {
        if (currentTime <= 1) {
          setClickCount(0)
          setGameMessage('Time is up. Try again: 25 clicks in 5 seconds.')

          return CLICK_SECONDS
        }

        return currentTime - 1
      })
    }, 1000)

    return () => {
      window.clearInterval(timer)
    }
  }, [isGameCleared, isGameOpen])

  useEffect(() => {
    if (!isGameCleared) {
      return
    }

    const timer = window.setTimeout(() => {
      setIsGameOpen(false)
      setIsPopupOpen(true)
    }, 700)

    return () => {
      window.clearTimeout(timer)
    }
  }, [isGameCleared])

  return (
    <>
      {/*  JANGAN PERNAH UBAH STRUKTUR CARD MEMBER KARENA KODE INI AKAN DI-CRAWL OLEH SCRIPT UNTUK MENGAMBIL DATA MEMBER, UBAH DATA MEMBER YANG DIPERLUKAN SAJA. JANGAN JUGA UBAH STYLE CARD MEMBER KARENA STYLE YANG SAMA DIBUTUHKAN AGAR TAMPILAN WEBSITE KONSISTEN */}
      <div
        role="button"
        tabIndex={0}
        onClick={startMiniGame}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            startMiniGame()
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
              <Instagram username="catur.styo" />
              {/* UBAH USERNAME LINKEDIN KAMU */}
              <LinkedInButtonLink username="catursetyo" />
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
            <p>Catur Setyo Ragil</p>
            {/* UBAH NRP KAMU */}
            <p>5027251066</p>
            {/* UBAH ASAL KOTA KAMU */}
            <p>Temanggung</p>
          </div>
        </div>
      </div>

      {isGameOpen &&
        createPortal(
          <div className="fixed inset-0 z-[1000] overflow-y-auto bg-[#0b0807]/95 text-white">
            <button
              type="button"
              aria-label="Cancel clicker challenge mini game"
              onClick={closeMiniGame}
              className="fixed inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(192,139,104,0.42),transparent_28%),radial-gradient(circle_at_82%_14%,rgba(114,162,148,0.32),transparent_30%),linear-gradient(135deg,rgba(0,0,0,0.94),rgba(34,18,14,0.9))]"
            />

            <div className="relative z-10 flex min-h-full items-center justify-center px-4 py-8">
              <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="member-066-game-title"
                className="relative w-full max-w-[860px] overflow-hidden border-4 border-[#f6efe4] bg-[#15100e] p-5 shadow-[14px_14px_0_#d40000] [clip-path:polygon(0_3%,97%_0,100%_92%,93%_100%,4%_97%)] sm:p-7"
              >
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.07)_1px,transparent_1px)] [background-size:32px_32px] opacity-25" />
                <div className="pointer-events-none absolute -top-24 -right-16 h-64 w-64 rounded-full border-[28px] border-[#7ba89a]/30" />
                <div className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 bg-[#c08b68]/25 [clip-path:polygon(50%_0,62%_36%,100%_35%,69%_57%,80%_100%,50%_72%,20%_100%,31%_57%,0_35%,38%_36%)]" />

                <div className="relative z-10 flex items-start justify-between gap-4">
                  <div>
                    <p className="inline-block -rotate-2 bg-[#d40000] px-3 py-1 text-xs font-black tracking-[0.28em] text-white uppercase">
                      clicker challenge
                    </p>
                    <h2
                      id="member-066-game-title"
                      className="mt-4 text-4xl leading-none font-black tracking-[-0.08em] text-[#f6efe4] uppercase sm:text-6xl"
                    >
                      25 Click Sprint
                    </h2>
                    <p className="mt-3 max-w-xl text-sm font-bold text-[#d9b79e]">
                      Hit the button 25 times before the 5-second timer runs out.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={closeMiniGame}
                    className="border-2 border-[#f6efe4] bg-black px-3 py-2 text-sm font-black text-[#f6efe4] uppercase shadow-[5px_5px_0_#d40000] transition hover:scale-105 hover:-rotate-3"
                  >
                    cancel
                  </button>
                </div>

                <div className="relative z-10 mt-6 grid gap-5 lg:grid-cols-[1fr_260px]">
                  <div className="border-4 border-[#f6efe4] bg-black p-5 shadow-[8px_8px_0_#7ba89a]">
                    <div className="relative flex min-h-[360px] flex-col items-center justify-center overflow-hidden bg-[#1f1511] p-5">
                      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,0,0,0.2),transparent_34%),repeating-linear-gradient(0deg,rgba(246,239,228,0.1)_0_1px,transparent_1px_6px)]" />
                      <button
                        type="button"
                        onClick={handleClickerPress}
                        disabled={isGameCleared}
                        className="relative z-10 flex h-48 w-48 items-center justify-center rounded-full border-[10px] border-[#f6efe4] bg-[#d40000] text-center text-5xl leading-none font-black tracking-[-0.08em] text-white shadow-[0_0_0_14px_rgba(246,239,228,0.12),12px_12px_0_#000] transition hover:scale-105 active:scale-95 disabled:bg-[#7ba89a]"
                      >
                        CLICK
                      </button>
                      <div className="relative z-10 mt-8 h-6 w-full border-4 border-[#f6efe4] bg-black">
                        <div
                          className="h-full bg-[#d40000] transition-all duration-150"
                          style={{ width: `${clickProgress}%` }}
                        />
                      </div>
                      <p className="relative z-10 mt-4 text-center text-sm font-black tracking-[0.2em] text-[#f6efe4] uppercase">
                        {clickCount}/{CLICK_TARGET} clicks
                      </p>
                    </div>
                  </div>

                  <div className="border-4 border-[#f6efe4] bg-[#2d201b] p-4 shadow-[8px_8px_0_#f6efe4]">
                    <p className="text-xs font-black tracking-[0.26em] text-[#d40000] uppercase">challenge status</p>
                    <p className="mt-5 text-6xl font-black tracking-[-0.08em] text-[#f6efe4]">{clickTimeLeft}s</p>
                    <p className="mt-1 text-xs font-black tracking-[0.24em] text-[#d9b79e] uppercase">time left</p>
                    <div className="mt-5 grid grid-cols-5 gap-1">
                      {Array.from({ length: 10 }).map((_, index) => (
                        <span
                          key={index}
                          className={`h-8 border-2 border-[#f6efe4] ${
                            clickProgress >= (index + 1) * 10 ? 'bg-[#d40000]' : 'bg-black'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="mt-3 min-h-[3rem] text-sm font-bold text-[#f6efe4]">{gameMessage}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}

      <audio
        ref={backgroundAudioRef}
        src="/members/066/audio/creep.mp3"
        preload="auto"
        onPlay={() => setIsBackgroundMusicOn(true)}
        onPause={() => setIsBackgroundMusicOn(false)}
        onEnded={() => setIsBackgroundMusicOn(false)}
      />

      <MemberPopup
        isOpen={isPopupOpen}
        isBackgroundMusicOn={isBackgroundMusicOn}
        onToggleBackgroundMusic={toggleBackgroundSong}
        onClose={() => {
          stopBackgroundSong()
          setIsPopupOpen(false)
        }}
      />
    </>
  )
}

export default CardMember
