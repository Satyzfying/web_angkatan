'use client'

import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

import Image from 'next/image'

import Instagram from '@/components/atoms/button/InstagramButtonLink'
import LinkedInButtonLink from '@/components/atoms/button/LinkedInButtonLink'
import SpotifyEmbed from '@/components/molecules/SpotifyEmbed'

import ProfileImage from './image.jpg'

type MemberPopupProps = {
  isOpen: boolean
  onClose: () => void
}

const MemberPopup = ({ isOpen, onClose }: MemberPopupProps) => {
  const [answer, setAnswer] = useState('')
  const [isWrong, setIsWrong] = useState(false)
  const [unlocked, setUnlocked] = useState(false)

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

  useEffect(() => {
    if (!isOpen) {
      setAnswer('')
      setIsWrong(false)
      setUnlocked(false)
    }
  }, [isOpen])

  if (!isOpen) return null

  const checkAnswer = () => {
    if (answer.trim().toLowerCase() === 'princess nadya') {
      setUnlocked(true)
      setIsWrong(false)
      return
    }

    setIsWrong(true)
  }

  return (
<<<<<<< HEAD
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-pink-300 px-4 py-8 text-pink-900">
=======
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto px-4 pt-20 pb-8 sm:pt-24">
  return createPortal(
    // PADA BAGIAN INI KAMU BOLEH MENGUBAH STYLE SESUKA HATI KAMU, TAPI JANGAN UBAH STRUKTUR DAN FUNGSI DARI KODE INI AGAR FUNGSI POPUP TETAP BERJALAN DENGAN BAIK
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto px-4">
>>>>>>> 0b5782897e73de7c6d6cc5b53dc4f58a0892dd24
      <button
        type="button"
        aria-label="Close member detail"
        onClick={onClose}
        className="absolute inset-0 bg-pink-950/20 backdrop-blur-[2px]"
      />

      {/* BACKGROUND */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden bg-gradient-to-br from-purple-400 via-pink-300 to-pink-200">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_8%,rgba(255,255,255,.9),transparent_13%),radial-gradient(circle_at_80%_12%,rgba(255,255,255,.75),transparent_12%),radial-gradient(circle_at_50%_90%,rgba(255,255,255,.8),transparent_28%)]" />

        <div className="animate-float-cute absolute -left-8 top-2 text-[150px] opacity-90 drop-shadow-[0_0_20px_rgba(255,255,255,.9)]">
          ☾
        </div>

<<<<<<< HEAD
        <div className="animate-cloud absolute -bottom-12 left-0 text-[180px] opacity-80">
          ☁️
        </div>
        <div className="animate-cloud-slow absolute -bottom-10 right-0 text-[190px] opacity-80">
          ☁️
        </div>
        <div className="animate-cloud absolute bottom-8 left-1/4 text-[130px] opacity-60">
          ☁️
        </div>
        <div className="animate-cloud-slow absolute bottom-6 right-1/4 text-[130px] opacity-60">
          ☁️
        </div>

        {[
          '⭐',
          '✦',
          '✨',
          '🌟',
          '🌸',
          '🌷',
          '💫',
          '✧',
          '⭐',
          '🌸',
          '✨',
          '✦',
          '💗',
          '🌙',
          '🌺',
          '⭐',
          '✨',
          '🌸',
        ].map((item, index) => (
          <span
            key={index}
            className="animate-sparkle absolute text-3xl opacity-80 drop-shadow-[0_0_10px_rgba(255,255,255,.9)]"
            style={{
              top: `${7 + ((index * 13) % 82)}%`,
              left: `${4 + ((index * 19) % 90)}%`,
              animationDelay: `${index * 0.18}s`,
            }}
          >
            {item}
          </span>
        ))}

        {Array.from({ length: 14 }).map((_, index) => (
          <span
            key={`petal-${index}`}
            className="animate-petal absolute text-3xl opacity-80"
            style={{
              left: `${4 + index * 7}%`,
              animationDelay: `${index * 0.45}s`,
              animationDuration: `${6 + (index % 5)}s`,
            }}
          >
            🌸
          </span>
        ))}
      </div>

      <div className="relative z-10 mx-auto max-w-[1450px]">
=======
      <div className="border-neutral-cs-10 bg-blue-cs-40 relative z-10 max-h-[100dvh] w-full max-w-[720px] animate-[member-popup-show_200ms_ease-out] overflow-y-auto rounded-2xl border-2 p-6 text-white shadow-xl sm:p-8">
>>>>>>> 0b5782897e73de7c6d6cc5b53dc4f58a0892dd24
        <button
          type="button"
          aria-label="Close member detail"
          onClick={onClose}
          className="animate-pop-cute absolute right-2 top-2 z-50 flex h-14 w-14 items-center justify-center rounded-full border-4 border-pink-200 bg-white/90 text-4xl font-black text-pink-500 shadow-xl transition hover:scale-110"
        >
          ×
        </button>

        <div className="grid items-start gap-7 pt-16 lg:grid-cols-[360px_70px_480px_70px_380px]">
          {/* QUIZ CARD */}
          <section className="animate-pop-cute">
            <div className="mb-5 text-center">
              <h3 className="mx-auto w-fit rounded-full bg-pink-100 px-8 py-2 text-lg font-black text-pink-800 shadow-md">
                1. TEBAK-TEBAKAN
              </h3>

              <p className="mt-3 text-sm font-bold text-white">
                Sebelum masuk, tebak dulu!
              </p>
            </div>

            <div className="relative min-h-[560px] overflow-hidden rounded-[2rem] border-[3px] border-pink-200 bg-gradient-to-b from-white/80 via-pink-50/75 to-pink-100/80 p-7 text-center shadow-[0_20px_60px_rgba(190,24,93,.28)] backdrop-blur-md">
              <button className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white text-3xl font-black text-pink-500 shadow-md transition hover:scale-110">
                ×
              </button>

              <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2rem]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,.8),transparent_18%),radial-gradient(circle_at_80%_75%,rgba(255,192,203,.45),transparent_22%)]" />

                <div className="animate-float-cute absolute left-6 top-6 text-5xl drop-shadow-lg">
                  🌙
                </div>
                <div className="animate-heart absolute left-1/2 top-10 -translate-x-1/2 text-4xl">
                  👑
                </div>
                <div className="animate-float-cute absolute left-1/2 top-20 -translate-x-1/2 text-5xl">
                  🎀
                </div>

                <div className="animate-sparkle absolute left-5 top-24 text-2xl">
                  ✨
                </div>
                <div className="animate-sparkle absolute right-8 top-16 text-2xl">
                  ⭐
                </div>
                <div className="animate-sparkle absolute right-5 top-32 text-xl">
                  ✦
                </div>
                <div className="animate-float-cute absolute left-12 top-40 text-xl">
                  🌸
                </div>
                <div className="animate-sparkle absolute right-10 top-48 text-2xl">
                  💫
                </div>
                <div className="animate-float-cute absolute left-8 top-60 text-xl">
                  🌷
                </div>
                <div className="animate-sparkle absolute right-12 top-72 text-xl">
                  ✨
                </div>

                <div className="animate-cloud absolute -left-8 bottom-0 text-8xl opacity-90">
                  ☁️
                </div>
                <div className="animate-cloud-slow absolute bottom-0 left-16 text-7xl opacity-80">
                  ☁️
                </div>
                <div className="animate-cloud absolute -right-8 bottom-0 text-8xl opacity-90">
                  ☁️
                </div>

                <div className="animate-float-cute absolute -left-4 bottom-16 text-6xl">
                  🌸
                </div>
                <div className="animate-float-cute absolute bottom-4 left-8 text-5xl">
                  🌷
                </div>
                <div className="animate-float-cute absolute -right-3 bottom-4 text-7xl">
                  🌸
                </div>
                <div className="animate-float-cute absolute right-14 bottom-20 text-4xl">
                  🌺
                </div>

                <div className="animate-heart absolute left-6 bottom-32 text-2xl">
                  💗
                </div>
                <div className="animate-sparkle absolute right-8 bottom-36 text-2xl">
                  ✨
                </div>
                <div className="animate-sparkle absolute left-1/2 bottom-24 text-xl">
                  ⭐
                </div>
              </div>

              <div className="relative z-10 pt-32">
                <p className="text-2xl font-black leading-relaxed text-pink-700">
                  Aku lagi ngumpet nih 🫣
                  <br />
                  Kalau mau ketemu,
                  <br />
                  coba panggil aku dulu 💌
                </p>

                <div className="mt-8 rounded-3xl border-2 border-dashed border-pink-300 bg-pink-50/70 p-5 text-lg font-black text-pink-700">
                  💌 Clue:
                  <br />
                  coba panggil dulu
                  <br />
                  princess nadya 👑
                </div>

                <div className="mt-7 flex gap-3">
                  <input
                    value={answer}
                    onChange={(e) => {
                      setAnswer(e.target.value)
                      setIsWrong(false)
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') checkAnswer()
                    }}
                    placeholder="ketik jawaban..."
                    className="w-full rounded-2xl border-2 border-pink-200 bg-white px-5 py-3 text-sm font-bold text-pink-700 outline-none placeholder:text-pink-300 focus:border-pink-500"
                  />

                  <button
                    type="button"
                    onClick={checkAnswer}
                    className="rounded-2xl bg-gradient-to-r from-pink-400 to-pink-500 px-6 py-3 text-sm font-black text-white shadow-lg transition hover:scale-105"
                  >
                    jawab
                  </button>
                </div>

                {isWrong && (
                  <p className="mt-4 text-xs font-bold text-pink-500">
                    Belum bener, coba panggil sesuai clue dulu yaa 💗
                  </p>
                )}

                <p className="mt-6 text-xs font-black text-pink-500">
                  💗 Hint: semua huruf kecil yaa 💗
                </p>
              </div>
            </div>
          </section>

          <div className="animate-arrow hidden pt-[330px] text-center text-7xl font-black text-pink-300 drop-shadow-[0_0_6px_white] lg:block">
            →
          </div>

          {/* QUOTE ENVELOPE */}
          <section className="animate-pop-cute animation-delay-200">
            <div className="mb-5 text-center">
              <h3 className="mx-auto w-fit rounded-full bg-pink-100 px-10 py-2 text-lg font-black text-pink-800 shadow-md">
                2. QUOTE
              </h3>

              <p className="mt-3 text-sm font-bold text-white">
                Setelah benar, quote rahasia untukmu!
              </p>
            </div>

            <div className="relative flex min-h-[620px] items-center justify-center">
              <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,.65),transparent_55%)]" />

              <div className="animate-float-cute relative h-[560px] w-full max-w-[500px]">
                <div className="absolute bottom-20 left-1/2 z-20 h-[310px] w-[94%] -translate-x-1/2 rounded-b-[2rem] rounded-t-xl bg-gradient-to-br from-pink-300 via-pink-200 to-pink-400 shadow-[0_25px_70px_rgba(236,72,153,.4)]" />

                <div
                  className={`absolute bottom-[180px] left-1/2 z-30 min-h-[360px] w-[78%] -translate-x-1/2 rounded-3xl border-2 border-pink-100 bg-white/95 px-8 py-10 text-center shadow-[0_0_60px_rgba(255,255,255,.9)] transition-all duration-700 ${
                    unlocked
                      ? 'animate-letter-wiggle -translate-y-14 rotate-[-4deg] opacity-100'
                      : 'translate-y-28 rotate-0 opacity-70'
                  }`}
                >
                  <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
                    <div className="animate-float-cute absolute left-5 top-5 text-3xl">
                      🌸
                    </div>
                    <div className="animate-float-cute absolute right-5 top-16 text-3xl">
                      🌸
                    </div>
                    <div className="animate-sparkle absolute left-8 bottom-10 text-xl">
                      ✨
                    </div>
                    <div className="animate-sparkle absolute right-8 bottom-8 text-xl">
                      ⭐
                    </div>
                  </div>

                  <p className="animate-heart relative z-10 text-5xl">🎀</p>

                  <p className="relative z-10 mt-7 text-2xl font-black leading-relaxed text-pink-700">
                    “You can always
                    <br />
                    begin again!
                    <br />
                    Romanticize your life
                    <br />
                    cause you’re the
                    <br />
                    main character.”
                  </p>

                  <p className="relative z-10 mt-6 text-3xl">🌷 💗 🫧 🫧</p>
                </div>

                <div className="absolute bottom-20 left-1/2 z-40 h-[310px] w-[94%] -translate-x-1/2 overflow-hidden rounded-b-[2rem]">
                  <div className="absolute bottom-0 left-0 h-full w-1/2 origin-bottom-right rotate-[33deg] bg-gradient-to-br from-pink-300 to-pink-400" />
                  <div className="absolute bottom-0 right-0 h-full w-1/2 origin-bottom-left rotate-[-33deg] bg-gradient-to-bl from-pink-300 to-pink-400" />
                </div>

                <div className="animate-heart absolute bottom-[190px] left-1/2 z-50 flex h-20 w-20 -translate-x-1/2 items-center justify-center rounded-full border-4 border-pink-200 bg-gradient-to-br from-pink-400 to-pink-600 text-4xl shadow-lg">
                  💗
                </div>

                <div className="animate-cloud absolute bottom-8 left-0 z-50 text-7xl">
                  ☁️
                </div>
                <div className="animate-cloud-slow absolute bottom-8 right-0 z-50 text-7xl">
                  ☁️
                </div>
                <div className="animate-float-cute absolute bottom-12 right-16 z-50 text-6xl">
                  🎀
                </div>
                <div className="animate-float-cute absolute bottom-16 left-10 z-50 text-5xl">
                  🌸
                </div>

                <button
                  type="button"
                  onClick={() => setUnlocked(true)}
                  className="animate-heart absolute bottom-0 left-1/2 z-[60] -translate-x-1/2 rounded-2xl bg-gradient-to-r from-pink-400 to-pink-500 px-10 py-3 text-xl font-black text-white shadow-lg transition hover:scale-105"
                >
                  You Found Me 👀
                </button>
              </div>
            </div>
          </section>

          <div className="animate-arrow hidden pt-[330px] text-center text-7xl font-black text-pink-300 drop-shadow-[0_0_6px_white] lg:block">
            →
          </div>

          {/* MEMBER CARD */}
          <section className="animate-pop-cute animation-delay-400">
            <div className="mb-5 text-center">
              <h3 className="mx-auto w-fit rounded-full bg-pink-100 px-8 py-2 text-lg font-black text-pink-800 shadow-md">
                3. MEMBER CARD
              </h3>

              <p className="mt-3 text-sm font-bold text-white">
                Terakhir, member card Nadya muncul!
              </p>
            </div>

            <div className="relative min-h-[560px] overflow-hidden rounded-[2rem] border-[3px] border-pink-200 bg-gradient-to-b from-white/80 via-pink-50/75 to-pink-100/80 p-6 text-center shadow-[0_20px_60px_rgba(190,24,93,.28)] backdrop-blur-md">
              <button className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white text-3xl font-black text-pink-500 shadow-md transition hover:scale-110">
                ×
              </button>

              <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2rem]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_15%,rgba(255,255,255,.85),transparent_18%),radial-gradient(circle_at_80%_70%,rgba(255,182,193,.45),transparent_25%)]" />

                <div className="animate-heart absolute left-4 top-4 text-4xl drop-shadow-lg">
                  👑
                </div>
                <div className="animate-float-cute absolute right-8 top-4 text-4xl">
                  🌸
                </div>
                <div className="animate-float-cute absolute right-3 top-24 text-5xl">
                  🌸
                </div>
                <div className="animate-sparkle absolute left-3 top-28 text-2xl">
                  ✨
                </div>

                <div className="animate-sparkle absolute left-8 top-56 text-2xl">
                  ⭐
                </div>
                <div className="animate-sparkle absolute right-8 top-56 text-2xl">
                  💫
                </div>
                <div className="animate-float-cute absolute left-5 top-72 text-xl">
                  🌷
                </div>
                <div className="animate-sparkle absolute right-6 top-72 text-xl">
                  ✨
                </div>

                <div className="animate-cloud absolute -left-8 bottom-0 text-8xl opacity-90">
                  ☁️
                </div>
                <div className="animate-cloud-slow absolute bottom-0 left-20 text-7xl opacity-80">
                  ☁️
                </div>
                <div className="animate-cloud absolute -right-8 bottom-0 text-8xl opacity-90">
                  ☁️
                </div>

                <div className="animate-float-cute absolute -right-3 bottom-0 text-7xl">
                  🌸
                </div>
                <div className="animate-float-cute absolute left-5 bottom-4 text-5xl">
                  🌷
                </div>
                <div className="animate-float-cute absolute right-16 bottom-20 text-4xl">
                  🎀
                </div>
                <div className="animate-heart absolute left-8 bottom-24 text-3xl">
                  💗
                </div>

                <div className="animate-sparkle absolute left-1/2 top-40 text-xl">
                  ✦
                </div>
                <div className="animate-sparkle absolute left-1/3 bottom-36 text-xl">
                  ⭐
                </div>
                <div className="animate-sparkle absolute right-1/3 bottom-32 text-xl">
                  ✨
                </div>
              </div>

              <div className="relative z-10 pt-8">
                <div className="relative mx-auto overflow-hidden rounded-2xl border-4 border-white shadow-lg transition duration-300 hover:scale-[1.03]">
                  <Image
                    src={ProfileImage}
                    alt="Profile Image"
                    className="h-44 w-full object-cover object-center"
                  />
                </div>

                <h2 className="mt-4 text-2xl font-black text-pink-600">
                  Nadya Putri Agustin 👑
                </h2>

                <p className="mt-1 text-sm font-black text-pink-400">
                  5027251013 - Surabaya
                </p>

                <div className="mt-5 flex justify-center gap-3">
                  <Instagram username="nadyaputria._" />
                  <LinkedInButtonLink username="nadyaputria" />
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3 text-xs font-bold">
                  <div className="rounded-2xl border-2 border-pink-100 bg-pink-50/80 p-4 shadow-md transition hover:scale-105">
                    <p className="font-black text-pink-500 uppercase">Hobi</p>

                    <p className="mt-2 text-pink-800">
                      Ketiduran sambil dengerin musik 🎧🎶
                    </p>
                  </div>

                  <div className="rounded-2xl border-2 border-pink-100 bg-pink-50/80 p-4 shadow-md transition hover:scale-105">
                    <p className="font-black text-pink-500 uppercase">
                      Fun Fact
                    </p>

                    <p className="mt-2 text-pink-800">
                      Kalau aku gak bales chat berarti aku ketiduran 😴
                    </p>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border-2 border-pink-100 bg-pink-50/80 p-4 shadow-md transition hover:scale-[1.02]">
                  <p className="text-xs font-black uppercase text-pink-500">
                    Lagu Favorit
                  </p>

                  <p className="my-2 text-sm font-black text-pink-800">
                    Begin Again 🎶
                  </p>

                  <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/05GsNucq8Bngd9fnd4fRa0?si=87e953ecc5f4492c" />
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* FOOTER */}
        <div className="animate-pop-cute mx-auto mt-8 flex max-w-[720px] items-center justify-center gap-6 rounded-[2rem] border-2 border-pink-200 bg-white/65 px-8 py-5 text-pink-700 shadow-xl backdrop-blur-md">
          <p className="text-lg font-black">🎮 Cara bermain:</p>

          <ol className="text-sm font-black leading-relaxed">
            <li>1. Tebak dulu: panggil "princess nadya"</li>
            <li>2. Baca quote penyemangat 💗</li>
            <li>3. Lihat member card Nadya! 👑</li>
          </ol>

          <p className="animate-heart text-5xl">💗</p>
        </div>
      </div>
<<<<<<< HEAD

      <style jsx>{`
        @keyframes floatCute {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-14px) rotate(4deg);
          }
        }

        @keyframes sparkleBlink {
          0%,
          100% {
            opacity: 0.35;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1.22);
          }
        }

        @keyframes popInCute {
          0% {
            opacity: 0;
            transform: scale(0.85) translateY(30px);
          }
          70% {
            opacity: 1;
            transform: scale(1.04) translateY(-6px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes cloudMove {
          0%,
          100% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(25px);
          }
        }

        @keyframes cloudMoveSlow {
          0%,
          100% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(-25px);
          }
        }

        @keyframes petalFall {
          0% {
            transform: translateY(-80px) rotate(0deg);
            opacity: 0;
          }
          15% {
            opacity: 1;
          }
          100% {
            transform: translateY(850px) rotate(300deg);
            opacity: 0;
          }
        }

        @keyframes heartBeat {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.15);
          }
        }

        @keyframes letterWiggle {
          0%,
          100% {
            transform: translateX(-50%) translateY(-56px) rotate(-4deg);
          }
          50% {
            transform: translateX(-50%) translateY(-66px) rotate(2deg);
          }
        }

        @keyframes arrowMove {
          0%,
          100% {
            transform: translateX(0);
            opacity: 0.75;
          }
          50% {
            transform: translateX(12px);
            opacity: 1;
          }
        }

        .animate-pop-cute {
          animation: popInCute 0.75s ease-out both;
        }

        .animate-float-cute {
          animation: floatCute 3s ease-in-out infinite;
        }

        .animate-sparkle {
          animation: sparkleBlink 1.8s ease-in-out infinite;
        }

        .animate-cloud {
          animation: cloudMove 5s ease-in-out infinite;
        }

        .animate-cloud-slow {
          animation: cloudMoveSlow 6s ease-in-out infinite;
        }

        .animate-heart {
          animation: heartBeat 1.2s ease-in-out infinite;
        }

        .animate-letter-wiggle {
          animation: letterWiggle 2.6s ease-in-out infinite;
        }

        .animate-petal {
          animation-name: petalFall;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }

        .animate-arrow {
          animation: arrowMove 1.4s ease-in-out infinite;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
        }
      `}</style>
    </div>
=======
    </div>,
    document.body
>>>>>>> 0b5782897e73de7c6d6cc5b53dc4f58a0892dd24
  )
}

export default MemberPopup