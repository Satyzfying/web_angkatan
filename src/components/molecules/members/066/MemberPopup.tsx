'use client'

import React, { useEffect, useState } from 'react'

import Image from 'next/image'

import { createPortal } from 'react-dom'

import ProfileImage from './image.webp'

const SPOTIFY_TRACK_ID = '73CKjW3vsUXRpy3NnX4H7F'

const SPOTIFY_EMBED_URL = `https://open.spotify.com/embed/track/${SPOTIFY_TRACK_ID}?utm_source=generator`

type MemberPopupProps = {
  isOpen: boolean
  isBackgroundMusicOn: boolean
  onToggleBackgroundMusic: () => void
  onClose: () => void
}

const MemberPopup = ({ isOpen, isBackgroundMusicOn, onToggleBackgroundMusic, onClose }: MemberPopupProps) => {
  const [showSpotify, setShowSpotify] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      const resetTimer = window.setTimeout(() => {
        setShowSpotify(false)
      }, 0)

      return () => {
        window.clearTimeout(resetTimer)
      }
    }

    const timer = window.setTimeout(() => {
      setShowSpotify(true)
    }, 300)

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.clearTimeout(timer)
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) {
    return null
  }

  return createPortal(
    <div className="fixed inset-0 z-[1000] overflow-y-auto bg-[#050403] text-black">
      <button
        type="button"
        aria-label="Close member detail"
        onClick={onClose}
        className="fixed inset-0 bg-[radial-gradient(circle_at_24%_18%,rgba(213,177,145,0.42),transparent_30%),radial-gradient(circle_at_78%_20%,rgba(123,168,154,0.34),transparent_28%),linear-gradient(135deg,rgba(0,0,0,0.9),rgba(29,18,15,0.94))] backdrop-blur-md"
      />

      <div className="relative z-10 flex min-h-full items-center justify-center px-4 py-6">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="member-066-name"
          className="relative max-h-[calc(100vh-1.5rem)] w-full max-w-[760px] animate-[member-popup-show_200ms_ease-out] overflow-y-auto border-4 border-[#f6efe4] bg-[#d0a383] shadow-[12px_12px_0_#000]"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(255,255,255,0.22)_0_2px,transparent_3px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:22px_22px,44px_44px] opacity-45" />
          <div className="pointer-events-none absolute top-0 right-0 h-full w-[42%] bg-[#7ba89a]/70" />
          <div className="pointer-events-none absolute top-8 right-10 h-28 w-28 rounded-full border-[18px] border-[#f6efe4]/55" />
          <div className="pointer-events-none absolute bottom-0 left-0 h-28 w-full bg-[linear-gradient(90deg,#d40000_0_18%,#f6efe4_18%_24%,#d40000_24%_38%,#f6efe4_38%_45%,#111_45%_100%)] opacity-90" />

          <button
            type="button"
            aria-label="Close member detail"
            onClick={onClose}
            className="absolute top-3 right-3 z-40 border-4 border-black bg-[#d40000] px-3 py-1.5 text-xs font-black text-white uppercase shadow-[5px_5px_0_#f6efe4] transition hover:scale-105 hover:-rotate-2 focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-black"
          >
            close
          </button>

          <button
            type="button"
            aria-label={isBackgroundMusicOn ? 'Turn off background music' : 'Turn on background music'}
            aria-pressed={isBackgroundMusicOn}
            onClick={onToggleBackgroundMusic}
            className={`absolute top-3 right-24 z-40 border-4 border-black px-3 py-1.5 text-xs font-black uppercase shadow-[5px_5px_0_#000] transition hover:scale-105 ${
              isBackgroundMusicOn ? 'bg-[#7ba89a] text-black' : 'bg-[#f6efe4] text-black'
            }`}
          >
            music {isBackgroundMusicOn ? 'on' : 'off'}
          </button>

          <div className="relative z-10 grid lg:grid-cols-[40%_60%]">
            <div className="relative min-h-[460px] overflow-hidden bg-[#0a0908]">
              <Image
                src={ProfileImage}
                alt="Profile Image"
                className="h-full min-h-[460px] w-full object-cover object-center contrast-125 saturate-50 sepia"
                priority
              />
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(246,239,228,0.08),rgba(195,141,107,0.42)),repeating-linear-gradient(0deg,rgba(255,255,255,0.12)_0_1px,transparent_1px_5px)] mix-blend-screen" />
              <div className="pointer-events-none absolute inset-x-0 bottom-[19%] h-14 bg-[#d40000] shadow-[0_0_0_5px_#f6efe4]" />
              <p className="absolute right-4 bottom-[22%] z-10 bg-[#f6efe4] px-2.5 py-1 text-[10px] font-black tracking-[0.22em] text-[#d40000] uppercase">
                the bends scan
              </p>
              <div className="pointer-events-none absolute top-7 left-7 h-24 w-24 rounded-full border-[17px] border-[#7ba89a]/70" />
            </div>

            <div className="relative min-w-0 p-4 pt-16 sm:p-6 sm:pt-16">
              <h2 id="member-066-name" className="leading-[0.82] font-black tracking-[-0.11em] uppercase">
                <span className="block bg-[#d40000] px-3 py-1 text-4xl text-[#f6efe4] sm:text-6xl">Catur</span>
                <span className="mt-1 block bg-[#f6efe4] px-3 py-1 text-4xl text-black sm:text-6xl">Setyo</span>
                <span className="mt-1 block bg-[#d40000] px-3 py-1 text-4xl text-[#f6efe4] sm:text-6xl">Ragil</span>
              </h2>

              <div className="mt-4 border-y-4 border-black bg-[#f6efe4] px-3 py-2.5">
                {/* UBAH NRP DAN ASAL */}
                <p className="text-xs font-black tracking-wide text-black uppercase sm:text-sm">
                  5027251066 - Temanggung
                </p>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="border-4 border-black bg-[#7ba89a] p-3 shadow-[5px_5px_0_#f6efe4]">
                  {/* UBAH HOBI KAMU */}
                  <p className="bg-black px-2 py-1 text-[10px] font-black tracking-[0.25em] text-[#f6efe4] uppercase">
                    hobi
                  </p>
                  <p className="mt-3 text-2xl leading-none font-black tracking-[-0.08em] text-black uppercase">
                    Solo Guitar
                  </p>
                </div>

                <div className="border-4 border-black bg-[#f6efe4] p-3 shadow-[5px_5px_0_#d40000]">
                  {/* UBAH FUNFACT KAMU */}
                  <p className="bg-[#d40000] px-2 py-1 text-[10px] font-black tracking-[0.25em] text-white uppercase">
                    fun fact
                  </p>
                  <p className="mt-3 text-base leading-tight font-black text-black uppercase">
                    Fact-nya banyak, tapi ngga fun
                  </p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <a
                  href="https://instagram.com/catur.styo"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Open Catur Setyo Ragil's Instagram profile"
                  className="border-4 border-black bg-[#d40000] px-3 py-2.5 text-center text-xs font-black text-white uppercase shadow-[4px_4px_0_#000] transition hover:-translate-y-1"
                >
                  instagram
                </a>
                <a
                  href="https://linkedin.com/in/catursetyo"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Open Catur Setyo Ragil's LinkedIn profile"
                  className="border-4 border-black bg-[#f6efe4] px-3 py-2.5 text-center text-xs font-black text-black uppercase shadow-[4px_4px_0_#d40000] transition hover:-translate-y-1"
                >
                  linkedin
                </a>
              </div>

              <div
                aria-label="Lagu Favorit: Fake Plastic Trees - Radiohead"
                className="mt-4 border-4 border-black bg-[#111] p-3 shadow-[7px_7px_0_#f6efe4]"
              >
                <div className="mb-3 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-black tracking-[0.28em] text-[#d40000] uppercase">song object</p>
                    <p className="text-xl leading-none font-black tracking-[-0.08em] text-[#f6efe4] uppercase">
                      Fake Plastic Trees
                    </p>
                  </div>
                  <p className="text-right text-[10px] font-black text-[#7ba89a] uppercase">Radiohead</p>
                </div>

                <div className="min-h-[112px] overflow-hidden bg-black [&_iframe]:mt-0 [&_iframe]:rounded-none">
                  {/* UBAH URL SPOTIFY KAMU DENGAN LAGU FAVORIT MU */}
                  {showSpotify ? (
                    <iframe
                      title="Spotify favorite song"
                      src={SPOTIFY_EMBED_URL}
                      width="100%"
                      height="112"
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      loading="eager"
                      className="w-full rounded-none"
                    />
                  ) : (
                    <div className="flex h-[112px] items-center justify-center border border-white/20 text-[10px] font-black tracking-[0.28em] text-[#d40000] uppercase">
                      loading the bends signal
                    </div>
                  )}
                </div>
              </div>

              <div aria-hidden="true" className="mt-4 grid grid-cols-12 gap-1">
                {Array.from({ length: 48 }).map((_, index) => (
                  <span
                    key={index}
                    className={`h-2 ${
                      index % 4 === 0
                        ? 'bg-[#d40000]'
                        : index % 4 === 1
                          ? 'bg-[#f6efe4]'
                          : index % 4 === 2
                            ? 'bg-[#7ba89a]'
                            : 'bg-black'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default MemberPopup
