'use client'

import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import Image from 'next/image'

import Instagram from '@/components/atoms/button/InstagramButtonLink'
import LinkedInButtonLink from '@/components/atoms/button/LinkedInButtonLink'
import SpotifyEmbed from '@/components/molecules/SpotifyEmbed'

import CyberpunkEdgerunnersLogo from './Cyberpunk_Edgerunners_logo.png'
import IntroScreen from './IntroScreen'
import PixelTransition from './PixelTransition'
import ProfileImage from './image.png'

type MemberPopupProps = {
  isOpen: boolean
  onClose: () => void
}

type FuzzyTextProps = {
  children: React.ReactNode
  fontSize?: string | number
  fontWeight?: number
  fontFamily?: string
  color?: string
  enableHover?: boolean
  baseIntensity?: number
  hoverIntensity?: number
  fuzzRange?: number
  fps?: number
  direction?: 'horizontal' | 'vertical' | 'both'
  transitionDuration?: number
  clickEffect?: boolean
  glitchMode?: boolean
  glitchInterval?: number
  glitchDuration?: number
  gradient?: string[] | null
  letterSpacing?: number
  className?: string
}

type FuzzyCanvasElement = HTMLCanvasElement & {
  cleanupFuzzyText?: () => void
}

const FuzzyText = ({
  children,
  fontSize = 'clamp(2rem, 10vw, 10rem)',
  fontWeight = 900,
  fontFamily = 'inherit',
  color = '#fff',
  enableHover = true,
  baseIntensity = 0.18,
  hoverIntensity = 0.5,
  fuzzRange = 30,
  fps = 60,
  direction = 'horizontal',
  transitionDuration = 0,
  clickEffect = false,
  glitchMode = false,
  glitchInterval = 2000,
  glitchDuration = 200,
  gradient = null,
  letterSpacing = 0,
  className = '',
}: FuzzyTextProps) => {
  const canvasRef = useRef<FuzzyCanvasElement | null>(null)

  useEffect(() => {
    let animationFrameId = 0
    let isCancelled = false
    let glitchTimeoutId: ReturnType<typeof setTimeout> | undefined
    let glitchEndTimeoutId: ReturnType<typeof setTimeout> | undefined
    let clickTimeoutId: ReturnType<typeof setTimeout> | undefined

    const canvas = canvasRef.current
    if (!canvas) return

    const init = async () => {
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const computedFontFamily =
        fontFamily === 'inherit' ? window.getComputedStyle(canvas).fontFamily || 'sans-serif' : fontFamily

      const fontSizeStr = typeof fontSize === 'number' ? `${fontSize}px` : fontSize
      const fontString = `${fontWeight} ${fontSizeStr} ${computedFontFamily}`

      try {
        await document.fonts.load(fontString)
      } catch {
        await document.fonts.ready
      }
      if (isCancelled) return

      let numericFontSize
      if (typeof fontSize === 'number') {
        numericFontSize = fontSize
      } else {
        const temp = document.createElement('span')
        temp.style.fontSize = fontSize
        document.body.appendChild(temp)
        const computedSize = window.getComputedStyle(temp).fontSize
        numericFontSize = Number.parseFloat(computedSize)
        document.body.removeChild(temp)
      }

      const text = React.Children.toArray(children).join('')

      const offscreen = document.createElement('canvas')
      const offCtx = offscreen.getContext('2d')
      if (!offCtx) return

      offCtx.font = `${fontWeight} ${fontSizeStr} ${computedFontFamily}`
      offCtx.textBaseline = 'alphabetic'

      let totalWidth = 0
      if (letterSpacing !== 0) {
        for (const char of text) {
          totalWidth += offCtx.measureText(char).width + letterSpacing
        }
        totalWidth -= letterSpacing
      } else {
        totalWidth = offCtx.measureText(text).width
      }

      const metrics = offCtx.measureText(text)
      const actualLeft = metrics.actualBoundingBoxLeft ?? 0
      const actualRight = letterSpacing !== 0 ? totalWidth : metrics.actualBoundingBoxRight ?? metrics.width
      const actualAscent = metrics.actualBoundingBoxAscent ?? numericFontSize
      const actualDescent = metrics.actualBoundingBoxDescent ?? numericFontSize * 0.2

      const textBoundingWidth = Math.ceil(letterSpacing !== 0 ? totalWidth : actualLeft + actualRight)
      const tightHeight = Math.ceil(actualAscent + actualDescent)

      const extraWidthBuffer = 10
      const offscreenWidth = textBoundingWidth + extraWidthBuffer

      offscreen.width = offscreenWidth
      offscreen.height = tightHeight

      const xOffset = extraWidthBuffer / 2
      offCtx.font = `${fontWeight} ${fontSizeStr} ${computedFontFamily}`
      offCtx.textBaseline = 'alphabetic'

      if (gradient && Array.isArray(gradient) && gradient.length >= 2) {
        const grad = offCtx.createLinearGradient(0, 0, offscreenWidth, 0)
        gradient.forEach((c, i) => grad.addColorStop(i / (gradient.length - 1), c))
        offCtx.fillStyle = grad
      } else {
        offCtx.fillStyle = color
      }

      if (letterSpacing !== 0) {
        let xPos = xOffset
        for (const char of text) {
          offCtx.fillText(char, xPos, actualAscent)
          xPos += offCtx.measureText(char).width + letterSpacing
        }
      } else {
        offCtx.fillText(text, xOffset - actualLeft, actualAscent)
      }

      const horizontalMargin = fuzzRange + 20
      const verticalMargin = 0
      canvas.width = offscreenWidth + horizontalMargin * 2
      canvas.height = tightHeight + verticalMargin * 2
      ctx.translate(horizontalMargin, verticalMargin)

      const interactiveLeft = horizontalMargin + xOffset
      const interactiveTop = verticalMargin
      const interactiveRight = interactiveLeft + textBoundingWidth
      const interactiveBottom = interactiveTop + tightHeight

      let isHovering = false
      let isClicking = false
      let isGlitching = false
      let currentIntensity = baseIntensity
      let targetIntensity = baseIntensity
      let lastFrameTime = 0
      const frameDuration = 1000 / fps

      const startGlitchLoop = () => {
        if (!glitchMode || isCancelled) return
        glitchTimeoutId = setTimeout(() => {
          if (isCancelled) return
          isGlitching = true
          glitchEndTimeoutId = setTimeout(() => {
            isGlitching = false
            startGlitchLoop()
          }, glitchDuration)
        }, glitchInterval)
      }

      if (glitchMode) startGlitchLoop()

      const run = (timestamp: number) => {
        if (isCancelled) return

        if (timestamp - lastFrameTime < frameDuration) {
          animationFrameId = window.requestAnimationFrame(run)
          return
        }
        lastFrameTime = timestamp

        ctx.clearRect(
          -fuzzRange - 20,
          -fuzzRange - 10,
          offscreenWidth + 2 * (fuzzRange + 20),
          tightHeight + 2 * (fuzzRange + 10)
        )

        if (isClicking) {
          targetIntensity = 1
        } else if (isGlitching) {
          targetIntensity = 1
        } else if (isHovering) {
          targetIntensity = hoverIntensity
        } else {
          targetIntensity = baseIntensity
        }

        if (transitionDuration > 0) {
          const step = 1 / (transitionDuration / frameDuration)
          if (currentIntensity < targetIntensity) {
            currentIntensity = Math.min(currentIntensity + step, targetIntensity)
          } else if (currentIntensity > targetIntensity) {
            currentIntensity = Math.max(currentIntensity - step, targetIntensity)
          }
        } else {
          currentIntensity = targetIntensity
        }

        if (direction === 'horizontal') {
          for (let j = 0; j < tightHeight; j += 1) {
            const dx = Math.floor(currentIntensity * (Math.random() - 0.5) * fuzzRange)
            ctx.drawImage(offscreen, 0, j, offscreenWidth, 1, dx, j, offscreenWidth, 1)
          }
        } else if (direction === 'vertical') {
          for (let i = 0; i < offscreenWidth; i += 1) {
            const dy = Math.floor(currentIntensity * (Math.random() - 0.5) * fuzzRange)
            ctx.drawImage(offscreen, i, 0, 1, tightHeight, i, dy, 1, tightHeight)
          }
        } else {
          for (let j = 0; j < tightHeight; j += 1) {
            const dx = Math.floor(currentIntensity * (Math.random() - 0.5) * fuzzRange)
            ctx.drawImage(offscreen, 0, j, offscreenWidth, 1, dx, j, offscreenWidth, 1)
          }
          const tempData = ctx.getImageData(0, 0, offscreenWidth + fuzzRange, tightHeight + fuzzRange)
          ctx.clearRect(
            -fuzzRange - 20,
            -fuzzRange - 10,
            offscreenWidth + 2 * (fuzzRange + 20),
            tightHeight + 2 * (fuzzRange + 10)
          )
          ctx.putImageData(tempData, 0, 0)
          for (let i = 0; i < offscreenWidth + fuzzRange; i += 1) {
            const dy = Math.floor(currentIntensity * (Math.random() - 0.5) * fuzzRange * 0.5)
            const colData = ctx.getImageData(i, 0, 1, tightHeight + fuzzRange)
            ctx.clearRect(i, -fuzzRange, 1, tightHeight + 2 * fuzzRange)
            ctx.putImageData(colData, i, dy)
          }
        }
        animationFrameId = window.requestAnimationFrame(run)
      }

      animationFrameId = window.requestAnimationFrame(run)

      const isInsideTextArea = (x: number, y: number) => {
        return x >= interactiveLeft && x <= interactiveRight && y >= interactiveTop && y <= interactiveBottom
      }

      const handleMouseMove = (e: MouseEvent) => {
        if (!enableHover) return
        const rect = canvas.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        isHovering = isInsideTextArea(x, y)
      }

      const handleMouseLeave = () => {
        isHovering = false
      }

      const handleClick = () => {
        if (!clickEffect) return
        isClicking = true
        clearTimeout(clickTimeoutId)
        clickTimeoutId = setTimeout(() => {
          isClicking = false
        }, 150)
      }

      const handleTouchMove = (e: TouchEvent) => {
        if (!enableHover) return
        e.preventDefault()
        const rect = canvas.getBoundingClientRect()
        const touch = e.touches[0]
        const x = touch.clientX - rect.left
        const y = touch.clientY - rect.top
        isHovering = isInsideTextArea(x, y)
      }

      const handleTouchEnd = () => {
        isHovering = false
      }

      if (enableHover) {
        canvas.addEventListener('mousemove', handleMouseMove)
        canvas.addEventListener('mouseleave', handleMouseLeave)
        canvas.addEventListener('touchmove', handleTouchMove, { passive: false })
        canvas.addEventListener('touchend', handleTouchEnd)
      }

      if (clickEffect) {
        canvas.addEventListener('click', handleClick)
      }

      const cleanup = () => {
        window.cancelAnimationFrame(animationFrameId)
        clearTimeout(glitchTimeoutId)
        clearTimeout(glitchEndTimeoutId)
        clearTimeout(clickTimeoutId)
        if (enableHover) {
          canvas.removeEventListener('mousemove', handleMouseMove)
          canvas.removeEventListener('mouseleave', handleMouseLeave)
          canvas.removeEventListener('touchmove', handleTouchMove)
          canvas.removeEventListener('touchend', handleTouchEnd)
        }
        if (clickEffect) {
          canvas.removeEventListener('click', handleClick)
        }
      }

      canvas.cleanupFuzzyText = cleanup
    }

    void init()

    return () => {
      isCancelled = true
      window.cancelAnimationFrame(animationFrameId)
      clearTimeout(glitchTimeoutId)
      clearTimeout(glitchEndTimeoutId)
      clearTimeout(clickTimeoutId)
      if (canvas && canvas.cleanupFuzzyText) {
        canvas.cleanupFuzzyText()
      }
    }
  }, [
    children,
    fontSize,
    fontWeight,
    fontFamily,
    color,
    enableHover,
    baseIntensity,
    hoverIntensity,
    fuzzRange,
    fps,
    direction,
    transitionDuration,
    clickEffect,
    glitchMode,
    glitchInterval,
    glitchDuration,
    gradient,
    letterSpacing,
  ])

  return <canvas ref={canvasRef} className={className} />
}

/* ─── UBAH nilai berikut sesuai akun game kamu ─── */
const VALORANT_ID = 'Hanni팜#jeans'
const WUWA_UID    = '907619312'
/* ──────────────────────────────────────────────── */

const HobiCard = () => {
  const [copied, setCopied]   = useState(false)
  const [wuwaOpen, setWuwaOpen] = useState(false)

  const handleCopyValo = async () => {
    try {
      await navigator.clipboard.writeText(VALORANT_ID)
    } catch {
      /* fallback: do nothing */
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="member-glitch-card border-[#111111] bg-[#f8e900] relative overflow-hidden rounded-none border-none p-4 text-[#111111] shadow-[0_14px_34px_rgba(0,0,0,0.2)] [clip-path:polygon(0_0,calc(100%-16px)_0,100%_16px,100%_100%,16px_100%,0_calc(100%-16px))]">
      <p className="text-[#111111] text-[11px] font-black tracking-[0.32em] uppercase mb-3">Hobi</p>

      <div className="flex flex-col md:flex-row gap-4">
        {/* Kolom Kiri: Musik */}
        <div className="flex-1">
          <span className="inline-flex items-center gap-1.5 bg-[#111111] px-3 py-1 text-xs font-black text-[#f8e900] tracking-wider uppercase [clip-path:polygon(0_0,calc(100%-8px)_0,100%_8px,100%_100%,8px_100%,0_calc(100%-8px))]">
            <span>♪</span> Musik
          </span>
          <p className="mt-1.5 text-xs font-semibold text-[#111111]/70 pl-1">dengerin + main musik, apalagi lagunya harry styles</p>
        </div>

        {/* Kolom Kanan: Games */}
        <div className="flex-1">
          <span className="inline-flex items-center gap-1.5 bg-[#111111] px-3 py-1 text-xs font-black text-[#f8e900] tracking-wider uppercase [clip-path:polygon(0_0,calc(100%-8px)_0,100%_8px,100%_100%,8px_100%,0_calc(100%-8px))]">
            <span>🎮</span> Games
          </span>
          <div className="mt-3 flex flex-col gap-2">
            {/* Valorant chip */}
            <button
              type="button"
              onClick={handleCopyValo}
              className="group flex w-full items-center justify-between bg-[#111111] px-3 py-2 transition-all hover:bg-[#ff4655] active:scale-95 [clip-path:polygon(0_0,calc(100%-12px)_0,100%_12px,100%_100%,12px_100%,0_calc(100%-12px))]"
            >
              <div className="flex items-center gap-2">
                {/* Valorant "V" icon */}
                <span className="flex h-6 w-6 items-center justify-center rounded-none [clip-path:polygon(0_0,calc(100%-4px)_0,100%_4px,100%_100%,4px_100%,0_calc(100%-4px))] bg-[#ff4655] text-white text-[10px] font-black group-hover:bg-white group-hover:text-[#ff4655] transition-colors">V</span>
                <span className="text-[10px] font-black text-[#f8e900] group-hover:text-white tracking-wider">VALORANT</span>
              </div>
              <span className="text-[8px] font-bold text-[#f8e900]/60 group-hover:text-white/80 transition-colors">
                {copied ? '✓ Copied!' : 'copy ID'}
              </span>
            </button>

            {/* Wuthering Waves chip */}
            <button
              type="button"
              onClick={() => setWuwaOpen(true)}
              className="group flex w-full items-center justify-between bg-[#111111] px-3 py-2 transition-all hover:bg-[#4e8fff] active:scale-95 [clip-path:polygon(0_0,calc(100%-12px)_0,100%_12px,100%_100%,12px_100%,0_calc(100%-12px))]"
            >
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-none [clip-path:polygon(0_0,calc(100%-4px)_0,100%_4px,100%_100%,4px_100%,0_calc(100%-4px))] bg-[#4e8fff] text-white text-[10px] font-black group-hover:bg-white group-hover:text-[#4e8fff] transition-colors">W</span>
                <span className="text-[10px] font-black text-[#f8e900] group-hover:text-white tracking-wider">WUWA</span>
              </div>
              <span className="text-[8px] font-bold text-[#f8e900]/60 group-hover:text-white/80 transition-colors">lihat →</span>
            </button>
          </div>
        </div>
      </div>

      {/* Wuthering Waves UID popup */}
      {wuwaOpen && (
        <div
          className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#0a1628]/95 backdrop-blur-sm"
          onClick={() => setWuwaOpen(false)}
        >
          <div
            className="flex flex-col items-center gap-3 p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-[11px] font-black tracking-[0.32em] uppercase text-[#4e8fff]">Wuthering Waves</span>
            <p className="text-3xl font-black text-white tracking-widest">{WUWA_UID}</p>
            <span className="text-[10px] text-white/50">UID</span>
            <button
              type="button"
              onClick={() => setWuwaOpen(false)}
              className="mt-1 bg-[#4e8fff] px-4 py-1.5 text-xs font-black text-white hover:bg-white hover:text-[#4e8fff] transition-colors [clip-path:polygon(0_0,calc(100%-8px)_0,100%_8px,100%_100%,8px_100%,0_calc(100%-8px))]"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

const FunFactCard = () => {
  return (
    <div className="member-glitch-card border-[#111111] bg-[#f8e900] relative overflow-hidden rounded-none border-none p-4 text-[#111111] shadow-[0_14px_34px_rgba(0,0,0,0.2)] [clip-path:polygon(0_0,calc(100%-16px)_0,100%_16px,100%_100%,16px_100%,0_calc(100%-16px))]">
      <p className="text-[#111111] text-[11px] font-black tracking-[0.32em] uppercase mb-3">Fun Fact</p>

      {/* Bunnies badge */}
      <div className="mb-3 flex items-center gap-2">
        <span className="inline-flex items-center bg-[#111111] px-3 py-1 text-xs font-black text-[#f8e900] tracking-wider uppercase [clip-path:polygon(0_0,calc(100%-8px)_0,100%_8px,100%_100%,8px_100%,0_calc(100%-8px))]">
          Bunnies
        </span>
      </div>

      <p className="text-xs font-semibold text-[#111111]/70 mb-3 leading-relaxed">
        orangnya malesan, hanni newjeans bini gweh
      </p>
    </div>
  )
}

const AUDIO_URL =
  'https://rareusgolecuqcptmeqy.supabase.co/storage/v1/object/public/videos/i-really-want-to-stay-at-your-house-epic-emotional-cover-feat-lorien-lra-samu_Fm38kWkY.mp3'
const AUDIO_VOLUME = 0.40

const MemberPopup = ({ isOpen, onClose }: MemberPopupProps) => {
  const [showIntro, setShowIntro] = useState(true)
  const bgAudioRef = useRef<HTMLAudioElement | null>(null)

  /* Buat audio saat popup pertama dibuka — referensi langsung ada
     di bgAudioRef, SEBELUM IntroScreen selesai. Ini yang memastikan
     stopAudio() selalu bisa menemukan audio meski user navigasi
     di tengah-tengah intro. */
  useEffect(() => {
    if (isOpen) {
      setShowIntro(true)
      if (!bgAudioRef.current) {
        const audio = new Audio(AUDIO_URL)
        audio.volume = AUDIO_VOLUME
        audio.preload = 'auto'
        bgAudioRef.current = audio
      }
    } else {
      /* Popup ditutup: stop background audio */
      if (bgAudioRef.current) {
        bgAudioRef.current.pause()
        bgAudioRef.current.currentTime = 0
        bgAudioRef.current = null
      }
    }
  }, [isOpen])

  /* Stop audio saat user meninggalkan halaman:
     - refresh / tutup tab  → beforeunload + pagehide
     - navigasi SPA Next.js → cleanup saat unmount  */
  useEffect(() => {
    const stopAudio = () => {
      if (bgAudioRef.current) {
        bgAudioRef.current.pause()
        bgAudioRef.current.currentTime = 0
      }
    }

    window.addEventListener('beforeunload', stopAudio)
    window.addEventListener('pagehide', stopAudio)

    return () => {
      /* Navigasi SPA: komponen unmount → hentikan audio */
      stopAudio()
      window.removeEventListener('beforeunload', stopAudio)
      window.removeEventListener('pagehide', stopAudio)
    }
  }, [])

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

  const handleIntroEnd = () => {
    setShowIntro(false)
  }

  if (!isOpen) {
    return null
  }

  if (typeof document === 'undefined') {
    return null
  }

  return createPortal(
    <>
      {/* Intro screen — audio dikelola MemberPopup, IntroScreen hanya play */}
      {showIntro && <IntroScreen audio={bgAudioRef.current} onEnd={handleIntroEnd} />}

      {/* Card popup — selalu di-mount agar audio bisa diserahkan,
          tapi disembunyikan sampai intro selesai */}
      <div style={{ display: showIntro ? 'none' : undefined }}>
        {/* PADA BAGIAN INI KAMU BOLEH MENGUBAH STYLE SESUKA HATI KAMU, TAPI JANGAN UBAH STRUKTUR DAN FUNGSI DARI KODE INI AGAR FUNGSI POPUP TETAP BERJALAN DENGAN BAIK */}
        <div className="fixed inset-0 isolate z-[100] flex items-start justify-center overflow-x-hidden overflow-y-auto px-4 pt-16 pb-8 sm:pt-20">
      <video
        className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover opacity-90 brightness-125 contrast-110 saturate-150"
        src="https://cdn-l-cyberpunk.cdprojektred.com/video/Edgerunners_KV_Animation.webm"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      />
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(circle_at_top,_rgba(255,245,77,0.22),_rgba(255,245,77,0.05)_32%,_rgba(0,0,0,0.24)_70%,_rgba(0,0,0,0.36))]" />
      <div className="pointer-events-none absolute inset-0 z-[2] bg-[rgba(0,0,0,0.16)]" />
      <div className="pointer-events-none absolute inset-0 z-[3] bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[length:100%_4px] opacity-14 mix-blend-screen" />
      <button
        type="button"
        aria-label="Close member detail"
        onClick={onClose}
        className="absolute inset-0 z-[4] bg-[rgba(0,0,0,0.16)] backdrop-blur-[0.5px]"
      />

      <div className="member-scrollbar-hide bg-[#111111]/62 relative z-10 max-h-[calc(100vh-9rem)] w-full max-w-[760px] animate-[member-popup-show_200ms_ease-out] overflow-y-auto overflow-x-hidden overscroll-contain rounded-none border-none p-4 text-[#fff9bf] shadow-[0_0_0_1px_rgba(248,233,0,0.24),_0_30px_90px_rgba(0,0,0,0.28)] backdrop-blur-sm sm:max-h-[calc(100vh-10rem)] sm:p-6 [clip-path:polygon(0_0,calc(100%-32px)_0,100%_32px,100%_100%,32px_100%,0_calc(100%-32px))]">
        <div className="pointer-events-none absolute inset-0 bg-transparent border-none shadow-[inset_0_0_0_1px_rgba(248,233,0,0.2)]" />
        <button
          type="button"
          aria-label="Close member detail"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center bg-[#111111]/80 text-[#f8e900] backdrop-blur-md transition-all hover:scale-110 hover:bg-[#f8e900] hover:text-[#111111] active:scale-95 [clip-path:polygon(0_0,calc(100%-12px)_0,100%_12px,100%_100%,12px_100%,0_calc(100%-12px))]"
        >
          x
        </button>

      

        <div className="mb-5 overflow-hidden rounded-none border-none bg-[#111111]/40 shadow-[0_18px_50px_rgba(0,0,0,0.24)] [clip-path:polygon(0_0,calc(100%-24px)_0,100%_24px,100%_100%,24px_100%,0_calc(100%-24px))]">
          <PixelTransition
            pixelColor="#f8e900"
            gridSize={10}
            animationStepDuration={0.4}
            once={false}
            className="h-120 w-full"
            firstContent={
              <Image
                src={ProfileImage}
                alt="Profile Image"
                className="h-120 w-full object-cover object-center saturate-125 contrast-110"
              />
            }
            secondContent={
              <div className="h-120 w-full flex items-center justify-center bg-[#f8e900]">
                <p className="font-black text-5xl text-[#111111] tracking-widest select-none drop-shadow-none">Choom!</p>
              </div>
            }
          />
        </div>
      <div className="mb-5 flex flex-col items-center gap-3 px-2">
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-center sm:gap-x-6">
            <img
              src="https://www.cyberpunk.net/build/images/edgerunners/logo-cdpred-3fe2e2b6.svg"
              alt="CD PROJEKT RED"
              className="h-20 w-auto object-contain sm:h-16 -mt-3 transform -translate-y-0.5"
            />
            <img
              src="https://www.cyberpunk.net/build/images/edgerunners/logo-trigger-white-6e8c256e.svg"
              alt="TRIGGER"
              className="h-7 w-auto object-contain sm:h-6"
            />
            <img
              src="https://www.cyberpunk.net/build/images/edgerunners/logo-netflix-d54ee543.svg"
              alt="Netflix"
              className="h-7 w-auto object-contain sm:h-8"
            />
          </div>

         
        </div>
        <div className="px-2 text-center">
          {/* UBAH NAMA ANDA */}
          <div className="mx-auto flex max-w-full justify-center overflow-hidden">
            <FuzzyText
              fontSize="clamp(2.6rem, 5.6vw, 4.9rem)"
              fontWeight={900}
              color="#f8e900"
              enableHover
              baseIntensity={0.22}
              hoverIntensity={0.72}
              fuzzRange={28}
              fps={60}
              direction="horizontal"
              transitionDuration={80}
              clickEffect
              glitchMode
              glitchInterval={1100}
              glitchDuration={260}
              letterSpacing={2}
              className="block mx-auto w-full font-black uppercase tracking-[0.18em] drop-shadow-[0_0_18px_rgba(248,233,0,0.32)]"
            >
              Anargya Shafa Setiyadi Putra
            </FuzzyText>
          </div>
          
          {/* UBAH NRP DAN ASAL */}
          <p className="mt-2 text-xs font-bold tracking-[0.28em] uppercase text-[#f8e900] sm:text-sm">
            5027251081 - Bogor
          </p>
        </div>

        <div className="member-socials mt-5 flex gap-3">
          {/* UBAH USERNAME INSTAGRAM */}
          <Instagram username="kang_sembako" />
          {/* UBAH USERNAME LINKEDIN */}
          <LinkedInButtonLink username="anargya-shafa-setiyadi-putra-ba9621379" />
        </div>

        <div className="mt-6 grid gap-4 text-sm font-semibold sm:grid-cols-2">
          {/* HOBI CARD */}
          <HobiCard />
          {/* FUN FACT CARD */}
          <FunFactCard />
        </div>

        <div className="member-glitch-card mt-4 bg-[#f8e900] relative overflow-hidden rounded-none border-none p-4 text-[#111111] shadow-[0_14px_34px_rgba(0,0,0,0.2)] [clip-path:polygon(0_0,calc(100%-16px)_0,100%_16px,100%_100%,16px_100%,0_calc(100%-16px))]">
          {/* UBAH LAGU FAVORIT KAMU */}
          <p className="text-[#111111] text-[11px] font-black tracking-[0.32em] uppercase">Lagu Favorit</p>
          <p className="my-2 text-sm font-semibold tracking-[0.08em]">I Really Want To Stay At Your House</p>

          {/* UBAH URL SPOTIFY KAMU DENGAN LAGU FAVORIT MU */}
          <div className="relative mt-2 rounded-none [clip-path:polygon(0_0,calc(100%-12px)_0,100%_12px,100%_100%,12px_100%,0_calc(100%-12px))] overflow-hidden">
            <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/7mykoq6R3BArsSpNDjFQTm?si=34876ee3546d45d2" />
          </div>
        </div>
        
      </div>

      <style jsx>{`
        .member-glitch-card {
          transform: translate3d(0, 0, 0);
          will-change: transform, filter, opacity, box-shadow;
        }

        .member-glitch-card::before,
        .member-glitch-card::after {
          content: '';
          pointer-events: none;
          position: absolute;
          inset: 0;
          opacity: 0;
          mix-blend-mode: multiply;
        }

        .member-glitch-card::before {
          background: linear-gradient(90deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.28), rgba(255, 255, 255, 0));
          transform: translateX(-110%);
        }

        .member-glitch-card::after {
          background: linear-gradient(180deg, rgba(0, 255, 255, 0.18), rgba(255, 0, 128, 0.14));
          transform: translateY(0);
        }

        .member-glitch-card:hover {
          animation: member-card-glitch 0.28s linear 1 forwards;
        }

        .member-glitch-card:hover::before {
          animation: member-card-scan 0.28s linear 1 forwards;
        }

        .member-glitch-card:hover::after {
          animation: member-card-rgb 0.28s linear 1 forwards;
        }

        @keyframes member-card-glitch {
          0% {
            transform: translate3d(0, 0, 0) skewX(0deg);
            filter: hue-rotate(0deg) saturate(1);
            opacity: 1;
          }
          15% {
            transform: translate3d(-2px, 0, 0) skewX(-1.5deg);
            filter: hue-rotate(10deg) saturate(1.15);
            opacity: 0.95;
          }
          30% {
            transform: translate3d(3px, -1px, 0) skewX(2deg);
            filter: hue-rotate(-8deg) saturate(1.25);
            opacity: 0.88;
          }
          45% {
            transform: translate3d(-3px, 1px, 0) skewX(-2deg);
            filter: hue-rotate(12deg) saturate(1.1);
            opacity: 0.92;
          }
          60% {
            transform: translate3d(2px, 0, 0) skewX(1deg);
            filter: hue-rotate(-4deg) saturate(1.05);
            opacity: 0.96;
          }
          100% {
            transform: translate3d(0, 0, 0) skewX(0deg);
            filter: hue-rotate(0deg) saturate(1);
            opacity: 1;
          }
        }

        @keyframes member-card-scan {
          0% {
            opacity: 0;
            transform: translateX(-110%);
          }
          20% {
            opacity: 0.4;
            transform: translateX(-55%);
          }
          50% {
            opacity: 0.7;
            transform: translateX(10%);
          }
          100% {
            opacity: 0;
            transform: translateX(120%);
          }
        }

        @keyframes member-card-rgb {
          0% {
            opacity: 0;
            transform: translate3d(0, 0, 0);
          }
          18% {
            opacity: 0.5;
            transform: translate3d(-1px, 0, 0);
          }
          38% {
            opacity: 0.35;
            transform: translate3d(1px, -1px, 0);
          }
          60% {
            opacity: 0.45;
            transform: translate3d(-1px, 1px, 0);
          }
          100% {
            opacity: 0;
            transform: translate3d(0, 0, 0);
          }
        }

        .member-scrollbar-hide {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .member-scrollbar-hide::-webkit-scrollbar {
          width: 0;
          height: 0;
        }

        .member-socials :global(img) {
          filter: brightness(0) saturate(100%) invert(82%) sepia(87%) saturate(1200%) hue-rotate(8deg)
            brightness(104%) contrast(102%);
        }
      `}</style>

    </div>
      </div>
    </>,
    document.body
  )
}


export default MemberPopup
