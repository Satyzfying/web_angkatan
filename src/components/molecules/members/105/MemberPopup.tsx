'use client'

import React, { useEffect, useState } from 'react'
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
  const [isSolved, setIsSolved] = useState(false)
  const [inputValue, setInputValue] = useState('')

  const CORRECT_ANSWER = '5'

  const sudokuBoard = [
    3, 4, 5, 8, 9, 1, 6, 7, 8,
    6, 7, 8, 2, 3, 4, 9, 1, 2,
    9, 1, 2, 5, 6, 7, 3, 4, 5,

    4, 5, 6, 1, 2, 3, 7, 8, 9,
    7, 8, 9, 4, null, 6, 1, 2, 3,
    1, 2, 3, 7, 8, 9, 4, 5, 6,

    2, 3, 4, 9, 1, 2, 5, 6, 7,
    5, 6, 7, 3, 4, 5, 8, 9, 1,
    8, 9, 1, 6, 7, 8, 2, 3, 4
  ]

  useEffect(() => {
    if (!isOpen) {
      setIsSolved(false)
      setInputValue('')
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value !== '' && !/^[1-9]$/.test(value)) return

    setInputValue(value)

    if (value === CORRECT_ANSWER) {
      setTimeout(() => {
        setIsSolved(true)
      }, 350)
    } else if (value !== '') {
      setTimeout(() => {
        setInputValue('')
      }, 400)
    }
  }

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

      <div className="border-neutral-cs-10 bg-blue-cs-40 relative z-10 max-h-[100dvh] w-full max-w-[720px] animate-[member-popup-show_200ms_ease-out] overflow-y-auto rounded-2xl border-2 p-6 text-white shadow-xl sm:p-8">
        <button
          type="button"
          aria-label="Close member detail"
          onClick={onClose}
          className="border-neutral-cs-10 hover:bg-neutral-cs-10/10 absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border text-xl leading-none"
        >
          x
        </button>

        {!isSolved ? (
          <div className="flex flex-col items-center justify-center py-6">
            <h3 className="mb-4 text-lg font-bold text-center">Complete the Sudoku</h3>

            <div className="grid grid-cols-9 gap-[1px] bg-slate-200 p-[1px] text-slate-800 w-full max-w-[360px] aspect-square rounded-lg shadow-xl overflow-hidden">
              {sudokuBoard.map((val, index) => {
                const row = Math.floor(index / 9)
                const col = index % 9

                let extraClass = ''
                if (col === 2 || col === 5) extraClass += ' mr-[2px] border-r border-slate-400/70'
                if (row === 2 || row === 5) extraClass += ' mb-[2px] border-b border-slate-400/70'

                return (
                  <div key={index} className={`flex items-center justify-center font-sans text-base font-medium relative bg-white ${extraClass}`}>
                    {val !== null ? (
                      <span>{val}</span>
                    ) : (
                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={inputValue}
                        onChange={handleInputChange}
                        className="absolute inset-0 w-full h-full text-center font-bold text-xl text-blue-600 bg-yellow-50 focus:outline-none"
                        autoFocus
                      />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="animate-[member-popup-show_200ms_ease-out] font-mono">
            <div className="mb-5 overflow-hidden rounded-2xl bg-[#16252d] border border-t-[3px] border-l-[2px] border-t-cyan-400/60 border-l-cyan-500/40 border-b-slate-800 border-r-slate-800 p-1 shadow-md">
              <Image src={ProfileImage} alt="Profile Image" className="h-120 w-full object-cover object-center rounded-xl" />
            </div>

            <div className="pr-10">
              {/* UBAH NAMA ANDA */}
              <h2 className="text-2xl font-semibold tracking-wide bg-gradient-to-r from-white via-neutral-100 to-cyan-300 bg-clip-text text-transparent">
                Michiko Artika Satriyo
              </h2>
              {/* UBAH NRP DAN ASAL */}
              <p className="text-neutral-cs-10/70 mt-1 text-sm font-medium tracking-wider">5027251105 - Lumajang</p>
            </div>

            <div className="mt-5 flex gap-2">
              {/* UBAH USERNAME INSTAGRAM */}
              <Instagram username="michikosatriyo" />
              {/* UBAH USERNAME LINKEDIN */}
              <LinkedInButtonLink username="michikosatriyo" />
            </div>

            <div className="mt-6 grid gap-4 text-sm font-medium sm:grid-cols-2">
              <div className="relative bg-[#16252d] border border-t-[3px] border-l-[2px] border-t-cyan-400/60 border-l-cyan-500/40 border-b-slate-800 border-r-slate-800 rounded-xl p-4 shadow-md">
                {/* UBAH HOBI KAMU */}
                <p className="text-cyan-400/50 text-xs tracking-widest uppercase font-bold">Hobi</p>
                <p className="mt-2 text-white/95 tracking-wide">main sudoku</p>
              </div>

              <div className="relative bg-[#16252d] border border-t-[3px] border-l-[2px] border-t-cyan-400/60 border-l-cyan-500/40 border-b-slate-800 border-r-slate-800 rounded-xl p-4 shadow-md">
                {/* UBAH FUNFACT KAMU */}
                <p className="text-cyan-400/50 text-xs tracking-widest uppercase font-bold">Fun Fact</p>
                <p className="mt-2 text-white/95 tracking-wide">my whole life is comedy</p>
              </div>
            </div>

            <div className="relative bg-[#16252d] border border-t-[3px] border-l-[2px] border-t-cyan-400/60 border-l-cyan-500/40 border-b-slate-800 border-r-slate-800 mt-4 rounded-xl p-4 shadow-md">
              {/* UBAH LAGU FAVORIT KAMU */}
              <p className="text-cyan-400/50 text-xs font-bold tracking-widest uppercase">Lagu Favorit</p>
              <p className="my-2 text-sm tracking-wide text-white">Sayonara End Roll - Eve</p>

              {/* UBAH URL SPOTIFY KAMU DENGAN LAGU FAVORIT MU */}
              <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/1o8MB4nLZVVwiTwVNhFj37?si=fca22f075136424c" />
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  )
}

export default MemberPopup