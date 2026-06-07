'use client'

import React, { useEffect, useState } from 'react'

import Image from 'next/image'

import Instagram from '@/components/atoms/button/InstagramButtonLink'
import LinkedInButtonLink from '@/components/atoms/button/LinkedInButtonLink'
import SpotifyEmbed from '@/components/molecules/SpotifyEmbed'

import { Cinzel } from 'next/font/google'
import BgGif from './gif.gif'
import ProfileImage from './foto.jpeg'

const cinzel = Cinzel({
  subsets: ['latin'],
})

const popupStyle = `
  @keyframes slideUpFade {
    from {
      opacity: 0;
      transform: translateY(40px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes goldGlow {
    0%, 100% {
      box-shadow: 0 0 8px 2px rgba(212, 175, 55, 0.4);
    }
    50% {
      box-shadow: 0 0 20px 6px rgba(212, 175, 55, 0.8);
    }
  }

  .popup-animated {
    animation: slideUpFade 0.4s ease-out, goldGlow 2.5s ease-in-out 0.4s infinite;
  }
`

type MemberPopupProps = {
  isOpen: boolean
  onClose: () => void
}

const MemberPopup = ({ isOpen, onClose }: MemberPopupProps) => {
  const [isAnswered, setIsAnswered] = useState(false)
  const [isWrong, setIsWrong] = useState(false)
  const [inputJawaban, setInputJawaban] = useState('')
  const audioRef = React.useRef<HTMLAudioElement>(null)
const [isBgmOn, setIsBgmOn] = useState(false)

const toggleBgm = () => {
  if (audioRef.current) {
    if (isBgmOn) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsBgmOn(!isBgmOn)
  }
}

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

  return (
    // PADA BAGIAN INI KAMU BOLEH MENGUBAH STYLE SESUKA HATI KAMU, TAPI JANGAN UBAH STRUKTUR DAN FUNGSI DARI KODE INI AGAR FUNGSI POPUP TETAP BERJALAN DENGAN BAIK
    <>
      <style>{popupStyle}</style>
      <audio ref={audioRef} loop onError={() => console.log('audio error')}>
  <source src="https://res.cloudinary.com/dyy28dpzr/video/upload/v1780829222/fools_w7bp4d.mp3" type="audio/mpeg" />
</audio>
      <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto px-4 pt-28 pb-8 sm:pt-32">
        <button
          type="button"
          aria-label="Close member detail"
          onClick={onClose}
          className="absolute inset-0 backdrop-blur-sm"
          style={{ backgroundImage: `url(${BgGif.src})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        />

        <div
          className={`popup-animated relative z-10 max-h-[calc(100vh-9rem)] w-full max-w-[720px] overflow-y-auto rounded-2xl p-6 text-white sm:max-h-[calc(100vh-10rem)] sm:p-8 ${cinzel.className}`}
          style={{ borderColor: '#D4AF37', borderWidth: '3px', borderStyle: 'solid', backgroundColor: 'rgba(10, 10, 10, 0.88)' }}
        >
          <button
            type="button"
            aria-label="Close member detail"
            onClick={onClose}
            className="border-neutral-cs-10 hover:bg-neutral-cs-10/10 absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border text-xl leading-none"
          >
            x
          </button>

          <button
  onClick={toggleBgm}
  className="absolute top-4 right-16 flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-bold transition-colors"
  style={{ borderColor: '#D4AF37', color: '#D4AF37' }}
>
  🎵 BGM {isBgmOn ? 'ON' : 'OFF'}
</button>

          {!isAnswered ? (
            <div className="flex flex-col items-center justify-center gap-4 py-10 text-center">
              <p className="text-lg font-bold">Jawab dulu yh</p>
              <p className="text-neutral-cs-10/70 text-sm">Buah, buah apa yang sakit? (A)</p>
              {isWrong && <p className="text-red-400 text-sm">Salahhhh AWOKOAKWOWKOWK</p>}
              <input
                type="text"
                value={inputJawaban}
                onChange={(e) => setInputJawaban(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    if (inputJawaban.toLowerCase().trim() === 'alpucat') {
                      setIsAnswered(true)
                    } else {
                      setIsWrong(true)
                      setInputJawaban('')
                    }
                  }
                }}
                placeholder="Jawaban kamu..."
                className="border-neutral-cs-10/40 bg-transparent rounded-xl border p-3 text-sm w-full text-center"
              />
              <button
                onClick={() => {
                  if (inputJawaban.toLowerCase().trim() === 'alpucat') {
                    setIsAnswered(true)
                  } else {
                    setIsWrong(true)
                    setInputJawaban('')
                  }
                }}
                className="border-neutral-cs-10/40 hover:bg-neutral-cs-10/10 rounded-xl border p-3 text-sm font-semibold w-full transition-colors"
              >
                Jawab
              </button>
            </div>
          ) : (
            <>
              <div className="border-neutral-cs-10/40 mb-5 overflow-hidden rounded-2xl border">
                <Image src={ProfileImage} alt="Profile Image" className="h-120 w-full object-cover object-center" />
              </div>

              <div className="pr-10">
                {/* UBAH NAMA ANDA */}
                <h2 className="text-2xl font-black">Rheza Pramudita Adi Putra</h2>
                {/* UBAH NRP DAN ASAL */}
                <p className="text-neutral-cs-10/70 mt-1 text-sm font-semibold">5027251090 - Surabaya</p>
              </div>

              <div className="mt-5 flex gap-2">
                {/* UBAH USERNAME INSTAGRAM */}
                <Instagram username="rhezapap" />
                {/* UBAH USERNAME LINKEDIN */}
                <LinkedInButtonLink username="rhezapap" />
              </div>

              <div className="mt-6 grid gap-4 text-sm font-semibold sm:grid-cols-2">
                <div className="border-neutral-cs-10/40 rounded-xl border p-4">
                  {/* UBAH HOBI KAMU */}
                  <p className="text-neutral-cs-10/60 text-xs tracking-wide uppercase">Hobi</p>
                  <p className="mt-2">main, belajar, tidur, olahraga, nonton, repeat</p>
                </div>
                <div className="border-neutral-cs-10/40 rounded-xl border p-4">
                  {/* UBAH FUNFACT KAMU */}
                  <p className="text-neutral-cs-10/60 text-xs tracking-wide uppercase">Fun Fact</p>
                  <p className="mt-2">gabisa lari pagi kalo udah malem</p>
                </div>
              </div>

              <div className="border-neutral-cs-10/40 mt-4 rounded-xl border p-4">
                {/* UBAH LAGU FAVORIT KAMU */}
                <p className="text-neutral-cs-10/60 text-xs font-bold tracking-wide uppercase">Lagu Favorit</p>
                <p className="my-2 text-sm font-semibold">Dinda</p>

                {/* UBAH URL SPOTIFY KAMU DENGAN LAGU FAVORIT MU */}
                <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/0YxZwR2nJViImRcbNpDQDj?si=4e63caf7a6c14296" />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default MemberPopup