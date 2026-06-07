'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'

import Image from 'next/image'

import { createPortal } from 'react-dom'

import Instagram from '@/components/atoms/button/InstagramButtonLink'
import LinkedInButtonLink from '@/components/atoms/button/LinkedInButtonLink'
import SpotifyEmbed from '@/components/molecules/SpotifyEmbed'

import ProfileImage from './image.png'

type MemberPopupProps = {
  isOpen: boolean
  onClose: () => void
}

const noiseSvg = `data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E`

const MemberPopup = ({ isOpen, onClose }: MemberPopupProps) => {
  const [isClosing, setIsClosing] = useState(false)
  const closingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isClosingRef = useRef(false)
  const [rickrollCount, setRickrollCount] = useState(0)
  const [imageFlipped, setImageFlipped] = useState(false)
  const [imageTransitioning, setImageTransitioning] = useState(false)
  const glitchAudioRef = useRef<HTMLAudioElement | null>(null)
  const bgAudioARef = useRef<HTMLAudioElement | null>(null)
  const bgAudioBRef = useRef<HTMLAudioElement | null>(null)
  const bgActiveRef = useRef<'A' | 'B'>('A')

  const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*<>{}[]'
  const scrambleChar = () => SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]

  const [nameText, setNameText] = useState('')
  const [nrpText, setNrpText] = useState('')
  const [hobiTitle, setHobiTitle] = useState('')
  const [funFactTitle, setFunFactTitle] = useState('')
  const [laguTitle, setLaguTitle] = useState('')
  const [hobi1Text, setHobi1Text] = useState('')
  const [hobi2Text, setHobi2Text] = useState('')
  const [hobi3Text, setHobi3Text] = useState('')
  const [hobi4Text, setHobi4Text] = useState('')
  const [funFactText, setFunFactText] = useState('')
  const [archText, setArchText] = useState('')
  const [laguText, setLaguText] = useState('')
  const [showVhsOverlay, setShowVhsOverlay] = useState(true)

  const handleClose = useCallback(() => {
    if (isClosingRef.current) return
    isClosingRef.current = true
    setIsClosing(true)
    closingTimerRef.current = setTimeout(() => {
      isClosingRef.current = false
      setIsClosing(false)
      onClose()
    }, 500)
  }, [onClose])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose()
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, handleClose])

  useEffect(() => {
    return () => {
      if (closingTimerRef.current) {
        clearTimeout(closingTimerRef.current)
      }
    }
  }, [])

  useEffect(() => {
    const stored = localStorage.getItem('rickrollCount')
    setRickrollCount(stored ? parseInt(stored, 10) : 0)
  }, [])

  useEffect(() => {
    if (!isOpen) return

    const timers: ReturnType<typeof setTimeout>[] = []
    const intervals: ReturnType<typeof setInterval>[] = []

    const typeWriter = (target: string, setter: (v: string) => void, delay: number, speed = 45) => {
      timers.push(
        setTimeout(() => {
          let i = 0
          const iv = setInterval(() => {
            i++
            if (i >= target.length) {
              setter(target)
              clearInterval(iv)
              return
            }
            setter(target.slice(0, i))
          }, speed)
          intervals.push(iv)
        }, delay)
      )
    }

    const scrambleReveal = (target: string, setter: (v: string) => void, delay: number, totalFrames = 20) => {
      timers.push(
        setTimeout(() => {
          let frame = 0
          const iv = setInterval(() => {
            frame++
            if (frame >= totalFrames) {
              setter(target)
              clearInterval(iv)
              return
            }
            const progress = frame / totalFrames
            const revealed = Math.floor(progress * target.length)
            let text = ''
            for (let i = 0; i < target.length; i++) {
              text += i < revealed ? target[i] : scrambleChar()
            }
            setter(text)
          }, 50)
          intervals.push(iv)
        }, delay)
      )
    }

    const genScramble = (len: number) => {
      let s = ''
      for (let i = 0; i < len; i++) s += scrambleChar()
      return s
    }

    setNameText(genScramble(11))
    setNrpText(genScramble(10))
    setHobi1Text(genScramble(12))
    setHobi2Text(genScramble(26))
    setHobi3Text(genScramble(36))
    setHobi4Text(genScramble(52))
    setFunFactText(genScramble(60))
    setArchText(genScramble(4))
    setLaguText(genScramble(15))
    setHobiTitle(genScramble(4))
    setFunFactTitle(genScramble(8))
    setLaguTitle(genScramble(12))

    scrambleReveal('Husam Danish', setNameText, 3500)
    scrambleReveal('5027251060', setNrpText, 3900)
    scrambleReveal('Hobi', setHobiTitle, 4200, 10)
    scrambleReveal('Ricing linux', setHobi1Text, 4400)
    typeWriter('Baca (mostly novel & komik)', setHobi2Text, 5400)
    typeWriter('Olahraga (jogging, cycling, basket)', setHobi3Text, 6570)
    typeWriter('Main game (mostly MLBB, but sometimes random indie game)', setHobi4Text, 8190)
    scrambleReveal('Fun Fact', setFunFactTitle, 9800, 10)
    typeWriter('Sejauh ini bolak-balik surabaya-bali (mudik) selalu motoran', setFunFactText, 10620, 30)
    scrambleReveal('Arch', setArchText, 12400, 15)
    scrambleReveal('Lagu Favorit', setLaguTitle, 12800, 10)
    typeWriter('Laskar Pelangi', setLaguText, 13200)

    return () => {
      timers.forEach(clearTimeout)
      intervals.forEach(clearInterval)
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    setShowVhsOverlay(true)
    const timer = setTimeout(() => setShowVhsOverlay(false), 3500)
    return () => clearTimeout(timer)
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const glitchAudio = new Audio('/assets/sounds/mixkit-tech-weird-glitch-2685.mp3')
    glitchAudioRef.current = glitchAudio
    glitchAudio.volume = 0.5

    const bgSrc = '/assets/sounds/mixkit-radio-waves-glitch-white-noise-1041.wav'
    const bgA = new Audio(bgSrc)
    const bgB = new Audio(bgSrc)
    bgAudioARef.current = bgA
    bgAudioBRef.current = bgB
    bgA.volume = 0
    bgB.volume = 0
    bgActiveRef.current = 'A'

    const TARGET_VOL = 0.3
    const CROSSFADE_MS = 800

    const fadeAudio = (from: HTMLAudioElement, to: HTMLAudioElement) => {
      const steps = 40
      const stepTime = CROSSFADE_MS / steps
      let step = 0
      to.volume = 0
      to.currentTime = 0
      to.play().catch(() => {})
      const iv = setInterval(() => {
        step++
        const progress = step / steps
        from.volume = TARGET_VOL * (1 - progress)
        to.volume = TARGET_VOL * progress
        if (step >= steps) {
          clearInterval(iv)
          from.pause()
          from.currentTime = 0
        }
      }, stepTime)
    }

    glitchAudio.play().catch(() => {})
    glitchAudio.onended = () => {
      bgA.volume = TARGET_VOL
      bgA.play().catch(() => {})
      bgA.onended = () => {
        fadeAudio(bgA, bgB)
        bgActiveRef.current = 'B'
        bgB.onended = () => {
          fadeAudio(bgB, bgA)
          bgActiveRef.current = 'A'
        }
      }
    }

    return () => {
      glitchAudio.pause()
      glitchAudio.currentTime = 0
      bgA.pause()
      bgA.currentTime = 0
      bgA.onended = null
      bgA.volume = 0
      bgB.pause()
      bgB.currentTime = 0
      bgB.onended = null
      bgB.volume = 0
    }
  }, [isOpen])

  if (!isOpen) {
    return null
  }

  return createPortal(
    // PADA BAGIAN INI KAMU BOLEH MENGUBAH STYLE SESUKA HATI KAMU, TAPI JANGAN UBAH STRUKTUR DAN FUNGSI DARI KODE INI AGAR FUNGSI POPUP TETAP BERJALAN DENGAN BAIK
    <div className="group fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto px-4">
      <button
        type="button"
        aria-label="Open YouTube"
        onClick={() => {
          const newCount = rickrollCount + 1
          setRickrollCount(newCount)
          localStorage.setItem('rickrollCount', String(newCount))
          window.open('https://www.youtube.com/watch?v=Aq5WXmQQooo', '_blank')
        }}
        className="absolute inset-0 cursor-pointer"
      >
        <Image
          src="https://cdn.terminaltrove.com/m/a03290ca-6b48-4c34-9970-93174008e7c8.gif"
          alt=""
          fill
          unoptimized
          sizes="100vw"
          className="absolute inset-0 object-cover"
        />
        <div className="absolute inset-0 bg-[#060e1a]/70 backdrop-blur-sm" />
        <div
          className="noise-layer absolute inset-0"
          style={{
            backgroundImage: `url("${noiseSvg}")`,
            backgroundSize: '256px 256px'
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(0,229,255,0.12) 0%, transparent 70%)'
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)'
          }}
        />
      </button>

      <div
        className="relative z-10 max-h-[100dvh] w-full max-w-[720px] animate-[member-popup-show_200ms_ease-out] overflow-y-auto rounded-2xl border-2 p-6 shadow-xl sm:p-8"
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          backgroundColor: '#0a1628',
          borderColor: '#00e5ff',
          color: '#c8f0f8',
          boxShadow: '0 0 40px rgba(0,229,255,0.15), 0 8px 32px rgba(0,0,0,0.6)'
        }}
      >
        {/* CRT turn-on: thin horizontal line */}
        <div
          className="crt-line pointer-events-none absolute inset-0 z-50 rounded-2xl"
          style={{
            background:
              'linear-gradient(180deg, transparent 0%, transparent 49%, rgba(0,229,255,0.8) 49.5%, white 50%, rgba(0,229,255,0.8) 50.5%, transparent 51%, transparent 100%)'
          }}
        />
        {/* CRT turn-on: black overlay that slowly fades out */}
        <div className="crt-blackout pointer-events-none absolute inset-0 z-50 rounded-2xl bg-black" />

        {/* VHS chaos overlay */}
        {showVhsOverlay && (
          <div className="vhs-overlay pointer-events-none absolute inset-0 z-[52] overflow-hidden rounded-2xl">
            <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.5)' }} />
            <div
              className="absolute inset-0"
              style={{
                background:
                  'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(255,255,255,0.12) 1px, rgba(255,255,255,0.12) 2px)',
                animation: 'vhs-noise 0.03s steps(4) infinite'
              }}
            />
            <div
              className="vhs-shear absolute inset-0"
              style={{
                background:
                  'linear-gradient(180deg, transparent 0%, rgba(0,229,255,0.15) 20%, transparent 22%, transparent 48%, rgba(255,0,128,0.12) 50%, transparent 52%, transparent 78%, rgba(0,229,255,0.1) 80%, transparent 100%)'
              }}
            />
            <div
              className="vhs-track-1 absolute right-0 left-0 h-[5px]"
              style={{ background: 'rgba(0,229,255,0.6)' }}
            />
            <div
              className="vhs-track-2 absolute right-0 left-0 h-[4px]"
              style={{ background: 'rgba(255,0,128,0.55)' }}
            />
            <div
              className="vhs-track-3 absolute right-0 left-0 h-[7px]"
              style={{ background: 'rgba(255,255,255,0.5)' }}
            />
            <div
              className="vhs-track-4 absolute right-0 left-0 h-[3px]"
              style={{ background: 'rgba(0,255,128,0.45)' }}
            />
            <div
              className="vhs-track-5 absolute right-0 left-0 h-[6px]"
              style={{ background: 'rgba(255,200,0,0.5)' }}
            />
            <div
              className="vhs-track-6 absolute right-0 left-0 h-[4px]"
              style={{ background: 'rgba(255,60,60,0.45)' }}
            />
            <div className="vhs-tint-r absolute inset-0" style={{ background: 'rgba(255,0,0,0.25)' }} />
            <div className="vhs-tint-g absolute inset-0" style={{ background: 'rgba(0,255,0,0.18)' }} />
            <div className="vhs-tint-b absolute inset-0" style={{ background: 'rgba(0,80,255,0.22)' }} />
            <div
              className="vhs-block-1 absolute"
              style={{ width: '120px', height: '60px', background: 'rgba(255,0,64,0.55)', top: '10%', left: '5%' }}
            />
            <div
              className="vhs-block-2 absolute"
              style={{ width: '90px', height: '45px', background: 'rgba(0,255,128,0.5)', top: '45%', right: '8%' }}
            />
            <div
              className="vhs-block-3 absolute"
              style={{ width: '140px', height: '35px', background: 'rgba(0,128,255,0.45)', bottom: '20%', left: '20%' }}
            />
            <div
              className="vhs-block-4 absolute"
              style={{ width: '75px', height: '75px', background: 'rgba(255,200,0,0.4)', top: '30%', left: '50%' }}
            />
            <div
              className="vhs-block-5 absolute"
              style={{ width: '100px', height: '25px', background: 'rgba(255,0,200,0.45)', top: '70%', left: '35%' }}
            />
            <div
              className="vhs-block-6 absolute"
              style={{ width: '70px', height: '55px', background: 'rgba(0,200,255,0.4)', top: '15%', right: '20%' }}
            />
            <div
              className="vhs-block-7 absolute"
              style={{ width: '90px', height: '12px', background: 'rgba(255,100,0,0.3)', bottom: '40%', right: '5%' }}
            />
            <div className="absolute" style={{ width: '120px', height: '60px', background: 'rgba(0,255,200,0.25)', top: '5%', left: '30%', animation: 'vhs-block-1-anim 0.08s steps(1) infinite' }} />
            <div className="absolute" style={{ width: '80px', height: '80px', background: 'rgba(255,0,200,0.3)', top: '60%', left: '10%', animation: 'vhs-block-2-anim 0.07s steps(1) infinite' }} />
            <div className="absolute" style={{ width: '150px', height: '25px', background: 'rgba(200,0,255,0.35)', bottom: '10%', left: '40%', animation: 'vhs-block-3-anim 0.06s steps(1) infinite' }} />
            <div className="absolute" style={{ width: '60px', height: '100px', background: 'rgba(255,255,0,0.2)', top: '25%', right: '5%', animation: 'vhs-block-4-anim 0.09s steps(1) infinite' }} />
            <div className="absolute" style={{ width: '200px', height: '15px', background: 'rgba(0,200,255,0.4)', top: '45%', left: '0', animation: 'vhs-block-5-anim 0.05s steps(1) infinite' }} />
            <div className="absolute" style={{ width: '100px', height: '50px', background: 'rgba(255,100,100,0.3)', bottom: '30%', right: '15%', animation: 'vhs-block-6-anim 0.07s steps(1) infinite' }} />
            <div className="absolute" style={{ width: '70px', height: '70px', background: 'rgba(100,255,100,0.25)', top: '70%', left: '60%', animation: 'vhs-block-7-anim 0.08s steps(1) infinite' }} />
            <div className="absolute" style={{ width: '180px', height: '20px', background: 'rgba(255,150,0,0.35)', top: '15%', left: '15%', animation: 'vhs-block-1-anim 0.06s steps(1) infinite' }} />
            <div className="absolute" style={{ width: '90px', height: '40px', background: 'rgba(0,100,255,0.3)', bottom: '50%', left: '25%', animation: 'vhs-block-2-anim 0.09s steps(1) infinite' }} />
            <div className="absolute" style={{ width: '140px', height: '30px', background: 'rgba(255,0,100,0.4)', top: '35%', right: '10%', animation: 'vhs-block-3-anim 0.05s steps(1) infinite' }} />
            <div className="absolute" style={{ width: '55px', height: '55px', background: 'rgba(0,255,100,0.3)', bottom: '20%', left: '55%', animation: 'vhs-block-4-anim 0.07s steps(1) infinite' }} />
            <div className="absolute" style={{ width: '110px', height: '18px', background: 'rgba(200,200,0,0.35)', top: '80%', left: '5%', animation: 'vhs-block-5-anim 0.08s steps(1) infinite' }} />
            <div className="vhs-pixel-1 absolute w-3 h-3" style={{ background: '#ff0080', top: '8%', left: '18%' }} />
            <div className="vhs-pixel-2 absolute w-2 h-2" style={{ background: '#00e5ff', top: '60%', left: '68%' }} />
            <div className="vhs-pixel-3 absolute w-4 h-4" style={{ background: '#ff4040', bottom: '15%', left: '38%' }} />
            <div className="vhs-pixel-4 absolute w-2 h-3" style={{ background: '#00ff80', top: '38%', left: '12%' }} />
            <div className="vhs-pixel-5 absolute w-3 h-2" style={{ background: '#ffaa00', bottom: '30%', right: '18%' }} />
            <div className="vhs-pixel-6 absolute w-2 h-2" style={{ background: '#ff00ff', top: '25%', left: '60%' }} />
            <div className="vhs-pixel-7 absolute w-3 h-3" style={{ background: '#0080ff', bottom: '45%', left: '75%' }} />
            <div className="vhs-pixel-8 absolute w-2 h-4" style={{ background: '#ff6040', top: '50%', left: '30%' }} />
            <div className="vhs-pixel-9 absolute w-4 h-2" style={{ background: '#40ff80', bottom: '10%', right: '30%' }} />
            <div className="vhs-pixel-10 absolute w-2 h-2" style={{ background: '#ffff00', top: '75%', left: '55%' }} />
            <div className="vhs-pixel-11 absolute w-3 h-2" style={{ background: '#00ffff', top: '20%', right: '10%' }} />
            <div className="vhs-pixel-12 absolute w-2 h-3" style={{ background: '#ff2020', bottom: '25%', left: '10%' }} />
            <div className="absolute w-5 h-5" style={{ background: '#ff00ff', top: '12%', left: '45%', animation: 'vhs-pixel-1-anim 0.04s steps(1) infinite' }} />
            <div className="absolute w-4 h-4" style={{ background: '#00ffcc', top: '55%', right: '20%', animation: 'vhs-pixel-2-anim 0.05s steps(1) infinite' }} />
            <div className="absolute w-6 h-3" style={{ background: '#ff3300', bottom: '35%', left: '20%', animation: 'vhs-pixel-3-anim 0.04s steps(1) infinite' }} />
            <div className="absolute w-3 h-6" style={{ background: '#3300ff', top: '40%', left: '70%', animation: 'vhs-pixel-4-anim 0.06s steps(1) infinite' }} />
            <div className="absolute w-5 h-5" style={{ background: '#00ff33', bottom: '15%', right: '35%', animation: 'vhs-pixel-5-anim 0.05s steps(1) infinite' }} />
            <div className="absolute w-4 h-3" style={{ background: '#ffff33', top: '65%', left: '40%', animation: 'vhs-pixel-6-anim 0.04s steps(1) infinite' }} />
            <div className="absolute w-3 h-4" style={{ background: '#ff33ff', top: '30%', left: '5%', animation: 'vhs-pixel-7-anim 0.05s steps(1) infinite' }} />
            <div className="absolute w-5 h-2" style={{ background: '#33ffff', bottom: '40%', right: '10%', animation: 'vhs-pixel-8-anim 0.06s steps(1) infinite' }} />
            <div className="absolute inset-0" style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,0,128,0.15) 3px, rgba(255,0,128,0.15) 6px)', animation: 'vhs-noise 0.03s steps(6) infinite' }} />
            <div className="absolute inset-0" style={{ background: 'repeating-linear-gradient(90deg, transparent, transparent 4px, rgba(0,229,255,0.1) 4px, rgba(0,229,255,0.1) 8px)', animation: 'vhs-noise 0.04s steps(5) infinite' }} />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(255,0,0,0.15) 0%, transparent 20%, rgba(0,255,0,0.1) 40%, transparent 60%, rgba(0,0,255,0.15) 80%, transparent 100%)', animation: 'vhs-tint-r-anim 0.06s steps(1) infinite' }} />
            <div className="vhs-pixel-1 absolute h-3 w-3" style={{ background: '#ff0080', top: '8%', left: '18%' }} />
            <div className="vhs-pixel-2 absolute h-2 w-2" style={{ background: '#00e5ff', top: '60%', left: '68%' }} />
            <div
              className="vhs-pixel-3 absolute h-4 w-4"
              style={{ background: '#ff4040', bottom: '15%', left: '38%' }}
            />
            <div className="vhs-pixel-4 absolute h-3 w-2" style={{ background: '#00ff80', top: '38%', left: '12%' }} />
            <div
              className="vhs-pixel-5 absolute h-2 w-3"
              style={{ background: '#ffaa00', bottom: '30%', right: '18%' }}
            />
            <div className="vhs-pixel-6 absolute h-2 w-2" style={{ background: '#ff00ff', top: '25%', left: '60%' }} />
            <div
              className="vhs-pixel-7 absolute h-3 w-3"
              style={{ background: '#0080ff', bottom: '45%', left: '75%' }}
            />
            <div className="vhs-pixel-8 absolute h-4 w-2" style={{ background: '#ff6040', top: '50%', left: '30%' }} />
            <div
              className="vhs-pixel-9 absolute h-2 w-4"
              style={{ background: '#40ff80', bottom: '10%', right: '30%' }}
            />
            <div className="vhs-pixel-10 absolute h-2 w-2" style={{ background: '#ffff00', top: '75%', left: '55%' }} />
            <div
              className="vhs-pixel-11 absolute h-2 w-3"
              style={{ background: '#00ffff', top: '20%', right: '10%' }}
            />
            <div
              className="vhs-pixel-12 absolute h-3 w-2"
              style={{ background: '#ff2020', bottom: '25%', left: '10%' }}
            />
            <div
              className="absolute top-3 left-3 font-mono text-[10px] tracking-wider"
              style={{
                color: 'rgba(255,255,255,0.6)',
                fontFamily: "'JetBrains Mono', monospace",
                animation: 'vhs-osd-flicker 0.15s steps(1) infinite'
              }}
            >
              PLAY ▶
            </div>
            <div
              className="absolute top-3 right-3 font-mono text-[10px] tracking-wider"
              style={{
                color: 'rgba(255,255,255,0.5)',
                fontFamily: "'JetBrains Mono', monospace",
                animation: 'vhs-osd-flicker 0.12s steps(1) infinite'
              }}
            >
              SP
            </div>
            <div
              className="absolute bottom-3 left-3 font-mono text-[10px] tracking-wider"
              style={{
                color: 'rgba(255,255,255,0.45)',
                fontFamily: "'JetBrains Mono', monospace",
                animation: 'vhs-osd-flicker 0.18s steps(1) infinite'
              }}
            >
              CH 02
            </div>
            <div
              className="absolute right-3 bottom-3 font-mono text-[10px] tracking-wider"
              style={{
                color: 'rgba(255,255,255,0.5)',
                fontFamily: "'JetBrains Mono', monospace",
                animation: 'vhs-osd-flicker 0.1s steps(1) infinite'
              }}
            >
              SOURCE
            </div>
            <div
              className="absolute top-3 left-1/2 -translate-x-1/2 font-mono text-[9px] tracking-widest"
              style={{
                color: 'rgba(255,255,255,0.35)',
                fontFamily: "'JetBrains Mono', monospace",
                animation: 'vhs-osd-flicker 0.14s steps(1) infinite'
              }}
            >
              ▮ REC
            </div>
            <div
              className="absolute bottom-3 left-1/2 -translate-x-1/2 font-mono text-[9px] tracking-wider"
              style={{
                color: 'rgba(255,255,255,0.3)',
                fontFamily: "'JetBrains Mono', monospace",
                animation: 'vhs-osd-flicker 0.16s steps(1) infinite'
              }}
            >
              00:03:42
            </div>
            <div
              className="absolute inset-0"
              style={{
                background:
                  'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.6) 2px, rgba(0,0,0,0.6) 4px)'
              }}
            />
          </div>
        )}

        <div
          className="pointer-events-none absolute inset-0 rounded-2xl select-none"
          style={{
            background:
              'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)'
          }}
        />

        <button
          type="button"
          aria-label="Close member detail"
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-2 text-lg leading-none font-bold transition-all"
          style={{ borderColor: '#00e5ff', color: '#00e5ff', backgroundColor: '#0a1628' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#00e5ff'
            e.currentTarget.style.color = '#0a1628'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#0a1628'
            e.currentTarget.style.color = '#00e5ff'
          }}
        >
          ✕
        </button>

        <div
          className="image-glitch relative mb-5 overflow-hidden rounded-2xl border-2 cursor-pointer"
          style={{ borderColor: '#0099ff' }}
          onClick={() => {
            if (imageTransitioning) return
            setImageTransitioning(true)
            setTimeout(() => {
              setImageFlipped(!imageFlipped)
              setImageTransitioning(false)
            }, 400)
          }}
        >
          <div
            className="relative w-full transition-none"
            style={{
              animation: imageFlipped ? 'none' : 'none'
            }}
          >
            <div style={{ opacity: imageFlipped ? 0 : 1, transition: 'opacity 0s', position: imageFlipped ? 'absolute' : 'relative', inset: 0 }}>
              <Image src={ProfileImage} alt="Profile Image" className="h-120 w-full object-cover object-center" />
              <div
                className="pointer-events-none absolute inset-0 z-[5]"
                style={{
                  background:
                    'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.4) 2px, rgba(0,0,0,0.4) 4px)',
                  animation: 'scanline-roll 4s linear infinite'
                }}
              />
            </div>
            <div
              className="flex items-center justify-center"
              style={{ opacity: imageFlipped ? 1 : 0, position: imageFlipped ? 'relative' : 'absolute', inset: 0, background: '#0a1628' }}
            >
              <img
                src="https://preview.redd.it/svg-formatted-logo-for-navi-v0-rkwxximk4s0e1.png?width=743&format=png&auto=webp&s=07c9719ea424cb691f6979e7f8f9457b2cefc270"
                alt="NAVI"
                className="h-120 w-full object-contain"
                style={{ filter: 'drop-shadow(0 0 15px rgba(0,229,255,0.5))' }}
              />
            </div>
          </div>
          {imageTransitioning && (
            <div className="pointer-events-none absolute inset-0 z-[10] overflow-hidden" style={{ animation: 'glitch-swap 0.4s steps(1) forwards' }}>
              <div style={{ background: 'rgba(0,229,255,0.3)', position: 'absolute', top: '10%', left: '5%', width: '40%', height: '20%', animation: 'vhs-block-1-anim 0.05s steps(1) infinite' }} />
              <div style={{ background: 'rgba(255,0,128,0.3)', position: 'absolute', top: '30%', right: '10%', width: '35%', height: '25%', animation: 'vhs-block-2-anim 0.04s steps(1) infinite' }} />
              <div style={{ background: 'rgba(0,255,128,0.25)', position: 'absolute', bottom: '20%', left: '15%', width: '50%', height: '15%', animation: 'vhs-block-3-anim 0.06s steps(1) infinite' }} />
              <div style={{ background: 'rgba(255,200,0,0.3)', position: 'absolute', top: '50%', left: '30%', width: '30%', height: '30%', animation: 'vhs-block-4-anim 0.05s steps(1) infinite' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.15) 2px, rgba(255,255,255,0.15) 4px)', animation: 'vhs-noise 0.03s steps(4) infinite' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,0,0,0.15)', animation: 'vhs-tint-r-anim 0.04s steps(1) infinite' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,255,0,0.1)', animation: 'vhs-tint-g-anim 0.05s steps(1) infinite' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,255,0.15)', animation: 'vhs-tint-b-anim 0.04s steps(1) infinite' }} />
            </div>
          )}
        </div>

        <div className="relative z-10 pr-10">
          {/* UBAH NAMA ANDA */}
          <h2 className="glitch-text text-2xl font-black" style={{ color: '#00e5ff' }}>
            {nameText}
          </h2>
          {/* UBAH NRP DAN ASAL */}
          <p className="mt-1 text-sm font-semibold" style={{ color: '#7ab8c8' }}>
            {nrpText} - Buleleng
          </p>
        </div>

        <div className="relative z-10 mt-5 flex gap-2">
          {/* UBAH USERNAME INSTAGRAM */}
          <div className="icon-glitch"><Instagram username="husam.danish" /></div>
          {/* UBAH USERNAME LINKEDIN */}
          <div className="icon-glitch"><LinkedInButtonLink username="husam.danish" /></div>
        </div>

        <div className="relative z-10 mt-6 grid gap-4 text-sm font-semibold sm:grid-cols-2">
          <div
            className="glitch-border rounded-xl border p-4 transition-transform"
            style={{ borderColor: '#00e5ff', transition: 'transform 0.2s, box-shadow 0.2s' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.03)'
              e.currentTarget.style.boxShadow = '0 0 20px rgba(0,229,255,0.3)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            {/* UBAH HOBI KAMU */}
            <p className="glitch-text text-xs tracking-wide uppercase" style={{ color: '#00e5ff' }}>
              {hobiTitle}
            </p>
            <ul className="mt-2 list-inside list-disc" style={{ color: '#c8f0f8' }}>
              <li>
                <a
                  href="https://www.reddit.com/r/unixporn/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="highlight-link"
                  style={{ color: '#00e5ff' }}
                >
                  <b>{hobi1Text}</b>
                </a>
              </li>
              <li>{hobi2Text}</li>
              <li>{hobi3Text}</li>
              <li>{hobi4Text}</li>
            </ul>
          </div>
          <div
            className="glitch-border rounded-xl border p-4 transition-transform"
            style={{ borderColor: '#0099ff', transition: 'transform 0.2s, box-shadow 0.2s' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.03)'
              e.currentTarget.style.boxShadow = '0 0 20px rgba(0,153,255,0.3)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            {/* UBAH FUNFACT KAMU */}
            <p className="glitch-text text-xs tracking-wide uppercase" style={{ color: '#0099ff' }}>
              {funFactTitle}
            </p>
            <p className="mt-2" style={{ color: '#c8f0f8' }}>
              {funFactText}
              <br />
              <br />I use{' '}
              <a
                href="https://wiki.archlinux.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="highlight-link"
                style={{ color: '#00e5ff' }}
              >
                <b>{archText}</b>
              </a>{' '}
              BTW!
            </p>
            <p className="mt-3" style={{ color: 'rgba(122, 184, 200, 0.25)', fontSize: '9px', letterSpacing: '0.5px' }}>
              Victims of ricrolled in this page: {rickrollCount}
            </p>
          </div>
        </div>

        <div
          className="glitch-border relative z-10 mt-4 rounded-xl border p-4 transition-transform"
          style={{ borderColor: '#00e5ff', transition: 'transform 0.2s, box-shadow 0.2s' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.03)'
            e.currentTarget.style.boxShadow = '0 0 20px rgba(0,229,255,0.3)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          {/* UBAH LAGU FAVORIT KAMU */}
          <p className="glitch-text text-xs font-bold tracking-wide uppercase" style={{ color: '#00e5ff' }}>
            {laguTitle}
          </p>
          <p className="my-2 text-sm font-semibold" style={{ color: '#c8f0f8' }}>
            {laguText}
          </p>

          {/* UBAH URL SPOTIFY KAMU DENGAN LAGU FAVORIT MU */}
          <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/0ejpHFKbEqTcNQ4OMBawrP?si=1a84201e2f18426f" />
        </div>

        <div className="relative z-10 mt-6 text-center text-xs" style={{ color: '#004466' }}>
          present day... present time...
        </div>

        {isClosing && (
          <>
            <div className="crt-collapse-dark pointer-events-none absolute inset-0 z-[60] rounded-2xl" />
            <div
              className="crt-collapse-line pointer-events-none absolute inset-0 z-[61] rounded-2xl"
              style={{
                background:
                  'linear-gradient(180deg, transparent 0%, transparent 48%, rgba(0,229,255,0.9) 49%, white 50%, rgba(0,229,255,0.9) 51%, transparent 52%, transparent 100%)'
              }}
            />
          </>
        )}
      </div>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100..800;1,100..800');
.highlight-link {
  color: inherit;
  text-decoration: underline;
  text-underline-offset: 3px;
  text-decoration-thickness: 2px;
  text-decoration-color: inherit;
  transition: opacity 0.2s;
}
.highlight-link:hover {
  opacity: 0.7;
}
.noise-layer {
  opacity: 0.35;
  animation: drift 8s linear infinite;
}
.group:hover .noise-layer {
  opacity: 0.5;
  animation: glitch-noise 0.15s steps(3) infinite;
}
.glitch-text:hover {
  animation: glitch-text 0.2s steps(2) infinite;
}
.glitch-border:hover .glitch-text {
  animation: glitch-text 0.2s steps(2) infinite;
}
.glitch-border {
  position: relative;
}
.group:hover .glitch-border {
  animation: widget-jitter 0.4s steps(1) infinite;
}
.group:hover .glitch-border::before {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent 0%, #00e5ff 20%, #00e5ff 80%, transparent 100%);
  opacity: 0;
  pointer-events: none;
  z-index: 10;
  animation: tear-line 1.5s steps(1) infinite;
}
.group:hover .glitch-border::after {
  content: '';
  position: absolute;
  left: -3px;
  right: -3px;
  top: 0;
  bottom: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent 0px,
    transparent 8px,
    rgba(0,229,255,0.12) 8px,
    rgba(0,229,255,0.12) 10px,
    transparent 10px,
    transparent 20px,
    rgba(255,0,128,0.08) 20px,
    rgba(255,0,128,0.08) 22px
  );
  opacity: 0;
  pointer-events: none;
  z-index: 10;
  animation: glitch-flash 0.9s steps(1) infinite;
}
.image-glitch {
  position: relative;
}
.group:hover .image-glitch::before {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, transparent 0%, #00e5ff 15%, #ff0080 50%, #00e5ff 85%, transparent 100%);
  opacity: 0;
  pointer-events: none;
  z-index: 10;
  animation: img-tear 1.8s steps(1) infinite;
}
.group:hover .image-glitch::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent 0px,
    transparent 12px,
    rgba(0,229,255,0.15) 12px,
    rgba(0,229,255,0.15) 14px,
    transparent 14px,
    transparent 28px,
    rgba(255,0,128,0.1) 28px,
    rgba(255,0,128,0.1) 30px
  );
  opacity: 0;
  pointer-events: none;
  z-index: 10;
  animation: img-flash 1.1s steps(1) infinite;
}
@keyframes drift {
  0% { background-position: 0 0; }
  50% { background-position: 10px -5px; }
  100% { background-position: -5px 10px; }
}
@keyframes glitch-noise {
  0%   { transform: translate(0); }
  25%  { transform: translate(-5px, 3px); }
  50%  { transform: translate(5px, -3px); }
  75%  { transform: translate(-3px, -5px); }
  100% { transform: translate(3px, 5px); }
}
@keyframes glitch-text {
  0%   { text-shadow: -2px 0 #00e5ff, 2px 0 #ff0080; }
  50%  { text-shadow: 2px 0 #00e5ff, -2px 0 #ff0080; }
  100% { text-shadow: -1px 0 #00e5ff, 1px 0 #ff0080; }
}
@keyframes widget-jitter {
  0%   { transform: translate(0, 0); }
  8%   { transform: translate(-1px, 0); }
  12%  { transform: translate(0, 0); }
  30%  { transform: translate(1px, 0); }
  35%  { transform: translate(0, 0); }
  55%  { transform: translate(0, -1px); }
  60%  { transform: translate(0, 0); }
  80%  { transform: translate(1px, 1px); }
  85%  { transform: translate(0, 0); }
  100% { transform: translate(0, 0); }
}
@keyframes tear-line {
  0%   { top: 12%; opacity: 0; }
  8%   { top: 12%; opacity: 0.85; }
  10%  { top: 12%; opacity: 0; }
  25%  { top: 48%; opacity: 0; }
  28%  { top: 48%; opacity: 0.7; }
  30%  { top: 48%; opacity: 0; }
  55%  { top: 75%; opacity: 0; }
  58%  { top: 75%; opacity: 0.9; }
  60%  { top: 75%; opacity: 0; }
  80%  { top: 33%; opacity: 0; }
  82%  { top: 33%; opacity: 0.6; }
  84%  { top: 33%; opacity: 0; }
  100% { top: 90%; opacity: 0; }
}
@keyframes glitch-flash {
  0%   { opacity: 0; transform: translateX(0); }
  12%  { opacity: 0.7; transform: translateX(-3px); }
  14%  { opacity: 0; transform: translateX(0); }
  40%  { opacity: 0; transform: translateX(0); }
  43%  { opacity: 0.5; transform: translateX(2px); }
  45%  { opacity: 0; transform: translateX(0); }
  70%  { opacity: 0; transform: translateX(0); }
  73%  { opacity: 0.6; transform: translateX(-1px); }
  75%  { opacity: 0; transform: translateX(0); }
  100% { opacity: 0; transform: translateX(0); }
}
@keyframes img-tear {
  0%   { top: 8%; opacity: 0; }
  5%   { top: 8%; opacity: 0.9; }
  7%   { top: 8%; opacity: 0; }
  22%  { top: 35%; opacity: 0; }
  25%  { top: 35%; opacity: 0.8; }
  27%  { top: 35%; opacity: 0; }
  48%  { top: 62%; opacity: 0; }
  50%  { top: 62%; opacity: 0.85; }
  52%  { top: 62%; opacity: 0; }
  70%  { top: 88%; opacity: 0; }
  72%  { top: 88%; opacity: 0.7; }
  74%  { top: 88%; opacity: 0; }
  88%  { top: 20%; opacity: 0; }
  90%  { top: 20%; opacity: 0.6; }
  92%  { top: 20%; opacity: 0; }
  100% { top: 50%; opacity: 0; }
}
@keyframes img-flash {
  0%   { opacity: 0; transform: translateX(0); }
  8%   { opacity: 0.8; transform: translateX(-4px); }
  10%  { opacity: 0; transform: translateX(0); }
  30%  { opacity: 0; transform: translateX(0); }
  33%  { opacity: 0.6; transform: translateX(3px); }
  35%  { opacity: 0; transform: translateX(0); }
  55%  { opacity: 0; transform: translateX(0); }
  58%  { opacity: 0.7; transform: translateX(-2px); }
  60%  { opacity: 0; transform: translateX(0); }
  80%  { opacity: 0; transform: translateX(0); }
  83%  { opacity: 0.5; transform: translateX(2px); }
  85%  { opacity: 0; transform: translateX(0); }
  100% { opacity: 0; transform: translateX(0); }
}
@keyframes scanline-roll {
  0% { background-position: 0 0; }
  100% { background-position: 0 4px; }
}
.crt-line {
  animation: crt-expand 1.2s cubic-bezier(0.23, 1, 0.32, 1) forwards;
}
.crt-blackout {
  animation: crt-fade 3s ease-out forwards;
}
@keyframes crt-expand {
  0%   { transform: scaleY(0.005); opacity: 1; }
  15%  { transform: scaleY(0.005); opacity: 1; }
  100% { transform: scaleY(1); opacity: 0; }
}
@keyframes crt-fade {
  0%   { opacity: 1; }
  100% { opacity: 0; }
}
.crt-collapse-dark {
  animation: crt-collapse-dark-anim 0.5s ease-in forwards;
}
.crt-collapse-line {
  animation: crt-collapse-line-anim 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}
@keyframes crt-collapse-dark-anim {
  0%   { opacity: 0; background: transparent; }
  30%  { opacity: 0.6; background: black; }
  60%  { opacity: 0.9; background: black; }
  100% { opacity: 1; background: black; }
}
@keyframes crt-collapse-line-anim {
  0%   { transform: scaleY(1) scaleX(1); opacity: 0; }
  15%  { transform: scaleY(1) scaleX(1); opacity: 1; }
  40%  { transform: scaleY(0.008) scaleX(1); opacity: 1; }
  65%  { transform: scaleY(0.008) scaleX(0.15); opacity: 1; }
  85%  { transform: scaleY(0.008) scaleX(0.01); opacity: 0.9; }
  100% { transform: scaleY(0) scaleX(0); opacity: 0; }
}
.vhs-overlay {
  animation: vhs-flicker 2.5s steps(1) forwards;
}
@keyframes vhs-flicker {
  0%  { opacity: 1; }
  8%  { opacity: 0.7; }
  12% { opacity: 1; }
  18% { opacity: 0.5; }
  22% { opacity: 0.9; }
  30% { opacity: 1; }
  38% { opacity: 0.6; }
  42% { opacity: 0.85; }
  50% { opacity: 1; }
  58% { opacity: 0.55; }
  62% { opacity: 0.9; }
  70% { opacity: 0.7; }
  78% { opacity: 1; }
  85% { opacity: 0.4; }
  92% { opacity: 0.6; }
  100% { opacity: 0; }
}
.vhs-track-1 { animation: vhs-track-1-anim 0.1s steps(1) infinite; }
.vhs-track-2 { animation: vhs-track-2-anim 0.08s steps(1) infinite; }
.vhs-track-3 { animation: vhs-track-3-anim 0.07s steps(1) infinite; }
.vhs-track-4 { animation: vhs-track-4-anim 0.09s steps(1) infinite; }
.vhs-track-5 { animation: vhs-track-5-anim 0.06s steps(1) infinite; }
.vhs-track-6 { animation: vhs-track-6-anim 0.11s steps(1) infinite; }
.vhs-block-1 { animation: vhs-block-1-anim 0.12s steps(1) infinite; }
.vhs-block-2 { animation: vhs-block-2-anim 0.1s steps(1) infinite; }
.vhs-block-3 { animation: vhs-block-3-anim 0.09s steps(1) infinite; }
.vhs-block-4 { animation: vhs-block-4-anim 0.11s steps(1) infinite; }
.vhs-block-5 { animation: vhs-block-5-anim 0.08s steps(1) infinite; }
.vhs-block-6 { animation: vhs-block-6-anim 0.1s steps(1) infinite; }
.vhs-block-7 { animation: vhs-block-7-anim 0.07s steps(1) infinite; }
.vhs-pixel-1 { animation: vhs-pixel-1-anim 0.06s steps(1) infinite; }
.vhs-pixel-2 { animation: vhs-pixel-2-anim 0.05s steps(1) infinite; }
.vhs-pixel-3 { animation: vhs-pixel-3-anim 0.07s steps(1) infinite; }
.vhs-pixel-4 { animation: vhs-pixel-4-anim 0.05s steps(1) infinite; }
.vhs-pixel-5 { animation: vhs-pixel-5-anim 0.06s steps(1) infinite; }
.vhs-pixel-6 { animation: vhs-pixel-6-anim 0.04s steps(1) infinite; }
.vhs-pixel-7 { animation: vhs-pixel-7-anim 0.05s steps(1) infinite; }
.vhs-pixel-8 { animation: vhs-pixel-8-anim 0.06s steps(1) infinite; }
.vhs-pixel-9 { animation: vhs-pixel-9-anim 0.05s steps(1) infinite; }
.vhs-pixel-10 { animation: vhs-pixel-10-anim 0.04s steps(1) infinite; }
.vhs-pixel-11 { animation: vhs-pixel-11-anim 0.05s steps(1) infinite; }
.vhs-pixel-12 { animation: vhs-pixel-12-anim 0.06s steps(1) infinite; }
@keyframes vhs-noise {
  0%   { background-position: 0 0; }
  25%  { background-position: 3px -2px; }
  50%  { background-position: -2px 3px; }
  75%  { background-position: 1px -3px; }
  100% { background-position: -1px 2px; }
}
.vhs-shear {
  animation: vhs-shear-anim 0.08s steps(1) infinite;
}
@keyframes vhs-shear-anim {
  0%   { transform: translateX(0); }
  25%  { transform: translateX(-8px); }
  50%  { transform: translateX(12px); }
  75%  { transform: translateX(-5px); }
  100% { transform: translateX(6px); }
}
.vhs-tint-r {
  animation: vhs-tint-r-anim 0.12s steps(1) infinite;
}
@keyframes vhs-tint-r-anim {
  0%   { opacity: 0; }
  20%  { opacity: 1; }
  25%  { opacity: 0; }
  55%  { opacity: 0.6; }
  60%  { opacity: 0; }
  85%  { opacity: 0.8; }
  90%  { opacity: 0; }
  100% { opacity: 0.4; }
}
.vhs-tint-g {
  animation: vhs-tint-g-anim 0.1s steps(1) infinite;
}
@keyframes vhs-tint-g-anim {
  0%   { opacity: 0; }
  15%  { opacity: 0.8; }
  20%  { opacity: 0; }
  45%  { opacity: 0.5; }
  50%  { opacity: 0; }
  75%  { opacity: 0.7; }
  80%  { opacity: 0; }
  100% { opacity: 0.3; }
}
.vhs-tint-b {
  animation: vhs-tint-b-anim 0.09s steps(1) infinite;
}
@keyframes vhs-tint-b-anim {
  0%   { opacity: 0; }
  10%  { opacity: 0.7; }
  15%  { opacity: 0; }
  40%  { opacity: 0.9; }
  45%  { opacity: 0; }
  70%  { opacity: 0.5; }
  75%  { opacity: 0; }
  100% { opacity: 0.6; }
}
@keyframes vhs-track-1-anim {
  0%   { top: 12%; transform: translateX(0); }
  10%  { top: 12%; transform: translateX(-30px); }
  18%  { top: 48%; transform: translateX(22px); }
  28%  { top: 48%; transform: translateX(-15px); }
  38%  { top: 78%; transform: translateX(35px); }
  48%  { top: 78%; transform: translateX(-10px); }
  58%  { top: 28%; transform: translateX(18px); }
  68%  { top: 60%; transform: translateX(-25px); }
  78%  { top: 60%; transform: translateX(12px); }
  88%  { top: 15%; transform: translateX(-8px); }
  100% { top: 15%; transform: translateX(0); }
}
@keyframes vhs-track-2-anim {
  0%   { top: 32%; transform: translateX(0); }
  12%  { top: 32%; transform: translateX(40px); }
  24%  { top: 62%; transform: translateX(-32px); }
  36%  { top: 62%; transform: translateX(28px); }
  48%  { top: 8%; transform: translateX(-22px); }
  60%  { top: 8%; transform: translateX(16px); }
  72%  { top: 82%; transform: translateX(-35px); }
  84%  { top: 82%; transform: translateX(20px); }
  100% { top: 45%; transform: translateX(0); }
}
@keyframes vhs-track-3-anim {
  0%   { top: 85%; transform: translateX(0); opacity: 1; }
  15%  { top: 18%; transform: translateX(-40px); opacity: 0.6; }
  30%  { top: 52%; transform: translateX(30px); opacity: 1; }
  45%  { top: 52%; transform: translateX(-18px); opacity: 0.4; }
  60%  { top: 92%; transform: translateX(12px); opacity: 0.8; }
  75%  { top: 35%; transform: translateX(-28px); opacity: 1; }
  90%  { top: 70%; transform: translateX(8px); opacity: 0.5; }
  100% { top: 40%; transform: translateX(0); opacity: 1; }
}
@keyframes vhs-track-4-anim {
  0%   { top: 5%; transform: translateX(0); }
  20%  { top: 5%; transform: translateX(20px); }
  40%  { top: 72%; transform: translateX(-18px); }
  60%  { top: 72%; transform: translateX(25px); }
  80%  { top: 22%; transform: translateX(-12px); }
  100% { top: 55%; transform: translateX(0); }
}
@keyframes vhs-track-5-anim {
  0%   { top: 90%; transform: translateX(0); }
  16%  { top: 40%; transform: translateX(-22px); }
  33%  { top: 40%; transform: translateX(15px); }
  50%  { top: 10%; transform: translateX(-30px); }
  66%  { top: 10%; transform: translateX(18px); }
  83%  { top: 65%; transform: translateX(-10px); }
  100% { top: 80%; transform: translateX(0); }
}
@keyframes vhs-track-6-anim {
  0%   { top: 25%; transform: translateX(0); }
  25%  { top: 25%; transform: translateX(-15px); }
  50%  { top: 58%; transform: translateX(20px); }
  75%  { top: 88%; transform: translateX(-25px); }
  100% { top: 42%; transform: translateX(0); }
}
@keyframes vhs-block-1-anim {
  0%   { opacity: 0; transform: translate(0, 0); }
  12%  { opacity: 1; transform: translate(15px, -10px); }
  24%  { opacity: 0; transform: translate(-10px, 18px); }
  36%  { opacity: 0.9; transform: translate(22px, 8px); }
  48%  { opacity: 0; transform: translate(-18px, -15px); }
  60%  { opacity: 0.7; transform: translate(10px, 20px); }
  72%  { opacity: 0; transform: translate(-25px, -5px); }
  84%  { opacity: 0.8; transform: translate(8px, 12px); }
  100% { opacity: 0; transform: translate(0, 0); }
}
@keyframes vhs-block-2-anim {
  0%   { opacity: 0; transform: translate(0, 0) scale(1); }
  20%  { opacity: 0.9; transform: translate(-22px, 15px) scale(1.4); }
  40%  { opacity: 0; transform: translate(18px, -10px) scale(0.6); }
  60%  { opacity: 0.8; transform: translate(-10px, 22px) scale(1.2); }
  80%  { opacity: 0; transform: translate(12px, -18px) scale(0.8); }
  100% { opacity: 0.5; transform: translate(0, 0) scale(1); }
}
@keyframes vhs-block-3-anim {
  0%   { opacity: 0; transform: translateX(0); }
  25%  { opacity: 0.8; transform: translateX(30px); }
  50%  { opacity: 0; transform: translateX(-22px); }
  75%  { opacity: 0.7; transform: translateX(15px); }
  100% { opacity: 0; transform: translateX(0); }
}
@keyframes vhs-block-4-anim {
  0%   { opacity: 0; transform: translate(0, 0) rotate(0deg); }
  20%  { opacity: 0.7; transform: translate(-12px, 10px) rotate(20deg); }
  40%  { opacity: 0; transform: translate(20px, -15px) rotate(-15deg); }
  60%  { opacity: 0.8; transform: translate(-8px, 18px) rotate(12deg); }
  80%  { opacity: 0; transform: translate(15px, -10px) rotate(-8deg); }
  100% { opacity: 0.4; transform: translate(0, 0) rotate(0deg); }
}
@keyframes vhs-block-5-anim {
  0%   { opacity: 0; transform: translateX(0); }
  33%  { opacity: 0.7; transform: translateX(-20px); }
  66%  { opacity: 0; transform: translateX(25px); }
  100% { opacity: 0.5; transform: translateX(0); }
}
@keyframes vhs-block-6-anim {
  0%   { opacity: 0; transform: translate(0, 0); }
  25%  { opacity: 0.6; transform: translate(18px, -12px); }
  50%  { opacity: 0; transform: translate(-15px, 8px); }
  75%  { opacity: 0.8; transform: translate(10px, -20px); }
  100% { opacity: 0; transform: translate(0, 0); }
}
@keyframes vhs-block-7-anim {
  0%   { opacity: 0; transform: translateX(0); }
  20%  { opacity: 0.8; transform: translateX(-28px); }
  40%  { opacity: 0; transform: translateX(18px); }
  60%  { opacity: 0.6; transform: translateX(-12px); }
  80%  { opacity: 0; transform: translateX(22px); }
  100% { opacity: 0.4; transform: translateX(0); }
}
@keyframes vhs-pixel-1-anim {
  0%   { opacity: 1; transform: translate(0, 0); }
  33%  { opacity: 0; transform: translate(40px, 28px); }
  66%  { opacity: 1; transform: translate(-15px, 55px); }
  100% { opacity: 0; transform: translate(25px, -20px); }
}
@keyframes vhs-pixel-2-anim {
  0%   { opacity: 1; transform: translate(0, 0); }
  25%  { opacity: 0; transform: translate(-28px, 42px); }
  50%  { opacity: 0.8; transform: translate(22px, -28px); }
  75%  { opacity: 0; transform: translate(-10px, 35px); }
  100% { opacity: 1; transform: translate(0, 0); }
}
@keyframes vhs-pixel-3-anim {
  0%   { opacity: 1; transform: translate(0, 0) scale(1); }
  20%  { opacity: 0; transform: translate(32px, -22px) scale(2); }
  40%  { opacity: 0.8; transform: translate(-28px, 15px) scale(0.3); }
  60%  { opacity: 0; transform: translate(15px, 28px) scale(1.5); }
  80%  { opacity: 0.9; transform: translate(-18px, -10px) scale(0.7); }
  100% { opacity: 1; transform: translate(0, 0) scale(1); }
}
@keyframes vhs-pixel-4-anim {
  0%   { opacity: 1; transform: translate(0, 0); }
  30%  { opacity: 0; transform: translate(25px, -35px); }
  60%  { opacity: 0.7; transform: translate(-18px, 24px); }
  100% { opacity: 1; transform: translate(0, 0); }
}
@keyframes vhs-pixel-5-anim {
  0%   { opacity: 1; transform: translate(0, 0); }
  50%  { opacity: 0; transform: translate(-32px, 18px); }
  100% { opacity: 0.8; transform: translate(12px, -25px); }
}
@keyframes vhs-pixel-6-anim {
  0%   { opacity: 1; transform: translate(0, 0); }
  33%  { opacity: 0; transform: translate(18px, 30px); }
  66%  { opacity: 0.9; transform: translate(-22px, -15px); }
  100% { opacity: 0; transform: translate(10px, 20px); }
}
@keyframes vhs-pixel-7-anim {
  0%   { opacity: 1; transform: translate(0, 0); }
  25%  { opacity: 0; transform: translate(-15px, -25px); }
  50%  { opacity: 0.8; transform: translate(28px, 12px); }
  75%  { opacity: 0; transform: translate(-8px, 30px); }
  100% { opacity: 1; transform: translate(0, 0); }
}
@keyframes vhs-pixel-8-anim {
  0%   { opacity: 1; transform: translate(0, 0); }
  40%  { opacity: 0; transform: translate(20px, -18px); }
  80%  { opacity: 0.7; transform: translate(-25px, 22px); }
  100% { opacity: 1; transform: translate(0, 0); }
}
@keyframes vhs-pixel-9-anim {
  0%   { opacity: 1; transform: translate(0, 0); }
  33%  { opacity: 0; transform: translate(-12px, 20px); }
  66%  { opacity: 0.9; transform: translate(30px, -28px); }
  100% { opacity: 0; transform: translate(-18px, 10px); }
}
@keyframes vhs-pixel-10-anim {
  0%   { opacity: 1; transform: translate(0, 0); }
  50%  { opacity: 0; transform: translate(15px, -20px); }
  100% { opacity: 0.8; transform: translate(-22px, 15px); }
}
@keyframes vhs-pixel-11-anim {
  0%   { opacity: 1; transform: translate(0, 0); }
  25%  { opacity: 0; transform: translate(-20px, 15px); }
  50%  { opacity: 0.7; transform: translate(12px, -25px); }
  75%  { opacity: 0; transform: translate(25px, 10px); }
  100% { opacity: 1; transform: translate(0, 0); }
}
@keyframes vhs-pixel-12-anim {
  0%   { opacity: 1; transform: translate(0, 0); }
  33%  { opacity: 0; transform: translate(18px, 22px); }
  66%  { opacity: 0.8; transform: translate(-15px, -18px); }
  100% { opacity: 0; transform: translate(8px, 30px); }
}
@keyframes vhs-osd-flicker {
  0%   { opacity: 1; }
  20%  { opacity: 0; }
  40%  { opacity: 0.8; }
  60%  { opacity: 0; }
  80%  { opacity: 1; }
  100% { opacity: 0.3; }
}
.icon-glitch {
  position: relative;
  display: inline-flex;
}
.icon-glitch:hover {
  animation: icon-glitch-anim 0.3s steps(2) infinite;
}
.icon-glitch:hover::before {
  content: '';
  position: absolute;
  inset: 0;
  background: inherit;
  opacity: 0.7;
  animation: icon-glitch-r 0.3s steps(1) infinite;
  mix-blend-mode: screen;
}
.icon-glitch:hover::after {
  content: '';
  position: absolute;
  inset: 0;
  background: inherit;
  opacity: 0.7;
  animation: icon-glitch-b 0.3s steps(1) infinite;
  mix-blend-mode: screen;
}
@keyframes icon-glitch-anim {
  0%   { transform: translate(0); }
  25%  { transform: translate(-2px, 1px); }
  50%  { transform: translate(2px, -1px); }
  75%  { transform: translate(-1px, -2px); }
  100% { transform: translate(1px, 2px); }
}
@keyframes icon-glitch-r {
  0%   { transform: translate(-2px, 0); clip-path: inset(0 0 60% 0); }
  25%  { transform: translate(2px, 0); clip-path: inset(20% 0 40% 0); }
  50%  { transform: translate(-1px, 0); clip-path: inset(40% 0 20% 0); }
  75%  { transform: translate(1px, 0); clip-path: inset(60% 0 0 0); }
  100% { transform: translate(-2px, 0); clip-path: inset(0 0 60% 0); }
}
@keyframes icon-glitch-b {
  0%   { transform: translate(2px, 0); clip-path: inset(40% 0 0 0); }
  25%  { transform: translate(-2px, 0); clip-path: inset(0 0 40% 0); }
  50%  { transform: translate(1px, 0); clip-path: inset(60% 0 20% 0); }
  75%  { transform: translate(-1px, 0); clip-path: inset(20% 0 60% 0); }
  100% { transform: translate(2px, 0); clip-path: inset(40% 0 0 0); }
}
@keyframes glitch-swap {
  0%   { opacity: 1; }
  10%  { opacity: 1; transform: translate(-3px, 2px) skewX(2deg); }
  20%  { opacity: 0.8; transform: translate(4px, -1px) skewX(-3deg); }
  30%  { opacity: 1; transform: translate(-2px, 3px) skewX(1deg); }
  40%  { opacity: 0.7; transform: translate(3px, -2px) skewX(-2deg); }
  50%  { opacity: 1; transform: translate(-1px, 1px) skewX(3deg); }
  60%  { opacity: 0.9; transform: translate(2px, -3px) skewX(-1deg); }
  70%  { opacity: 1; transform: translate(-4px, 2px) skewX(2deg); }
  80%  { opacity: 0.6; transform: translate(1px, -1px) skewX(-3deg); }
  90%  { opacity: 1; transform: translate(-2px, 3px) skewX(1deg); }
  100% { opacity: 0; transform: translate(0); }
}`}</style>
    </div>,
    document.body
  )
}

export default MemberPopup
