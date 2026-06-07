'use client'

/* eslint-disable react-hooks/set-state-in-effect */

import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import Image from 'next/image'

import Instagram from '@/components/atoms/button/InstagramButtonLink'
import LinkedInButtonLink from '@/components/atoms/button/LinkedInButtonLink'
import SpotifyEmbed from '@/components/molecules/SpotifyEmbed'

import ProfileImage from './image.png'

type MemberPopupProps = {
  isOpen: boolean
  onClose: () => void
}

const MemberPopup = ({ isOpen, onClose }: MemberPopupProps) => {
  const photoRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isHologram, setIsHologram] = useState(true)

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

  useEffect(() => {
    if (!isOpen) {
      setIsHologram(true)
      return
    }

    const wrap = photoRef.current
    const canvas = canvasRef.current

    if (!wrap || !canvas) {
      return
    }

    let animationId = 0
    const timeoutId = window.setTimeout(() => {
      canvas.width = wrap.offsetWidth
      canvas.height = wrap.offsetHeight

      const context = canvas.getContext('2d')

      if (!context) {
        return
      }

      const width = canvas.width
      const height = canvas.height
      const duration = 1750
      let start: number | null = null

      const draw = (timestamp: number) => {
        if (start === null) {
          start = timestamp
        }

        const elapsed = timestamp - start
        const progress = Math.min(elapsed / duration, 1)
        const easedProgress =
          progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress

        context.clearRect(0, 0, width, height)

        if (progress < 1) {
          context.fillStyle = '#000'
          context.fillRect(0, 0, (1 - easedProgress) * width, height)
        }

        if (isHologram && progress > 0.3) {
          const hologramProgress = Math.min((progress - 0.3) / 0.7, 1)

          context.fillStyle = `rgba(0, 200, 255, ${0.08 * hologramProgress})`
          context.fillRect(0, 0, width, height)

          context.fillStyle = `rgba(0, 0, 0, ${0.25 * hologramProgress})`
          for (let y = 0; y < height; y += 4) {
            context.fillRect(0, y, width, 2)
          }

          const scanY = ((elapsed * 0.04) % (height + 20)) - 10
          context.fillStyle = `rgba(0, 220, 255, ${0.12 * hologramProgress})`
          context.fillRect(0, scanY, width, 3)

          const vignette = context.createRadialGradient(
            width / 2,
            height / 2,
            height * 0.3,
            width / 2,
            height / 2,
            height * 0.85
          )
          vignette.addColorStop(0, 'rgba(0,0,0,0)')
          vignette.addColorStop(1, `rgba(0, 80, 150, ${0.45 * hologramProgress})`)
          context.fillStyle = vignette
          context.fillRect(0, 0, width, height)
        }

        animationId = window.requestAnimationFrame(draw)
      }

      animationId = window.requestAnimationFrame(draw)
    }, 150)

    return () => {
      window.clearTimeout(timeoutId)
      window.cancelAnimationFrame(animationId)
    }
  }, [isOpen, isHologram])

  if (!isOpen) {
    return null
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center overflow-hidden px-4"
      onClick={(event) => event.stopPropagation()}
      onKeyDown={(event) => event.stopPropagation()}
    >
      <button
        type="button"
        aria-label="Close member detail"
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-md"
      />

      <div className="relative z-10 h-[100dvh] max-h-[100dvh] w-full max-w-[720px] animate-[member-popup-show_200ms_ease-out] overflow-y-auto overscroll-contain rounded-2xl border-2 border-yellow-400 bg-black p-6 text-white shadow-xl sm:p-8">
        <button
          type="button"
          aria-label="Close member detail"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-yellow-400 text-yellow-400 hover:bg-yellow-400/10"
        >
          ×
        </button>

        <div className="mb-6 text-center">
          <p className="animate-pulse text-xs tracking-[0.4em] text-blue-300">
            A LONG TIME AGO IN A GALAXY FAR, FAR AWAY...
          </p>
          <p className="mt-2 text-xs tracking-[0.3em] text-yellow-500">GALACTIC DATABASE</p>
          <div className="mx-auto mt-3 h-[2px] w-28 bg-yellow-400" />
        </div>

        <div
          ref={photoRef}
          className="group relative mb-5 overflow-hidden rounded-2xl border border-yellow-400/30 bg-black"
        >
          <Image
            src={ProfileImage}
            alt="Profile Image"
            className="h-120 w-full object-cover object-center transition-all duration-700 hover:scale-105 hover:brightness-110"
          />
          <canvas
            ref={canvasRef}
            className="pointer-events-none absolute inset-0 z-10"
            style={{ width: '100%', height: '100%' }}
          />
        </div>

        <div className="mb-5 flex justify-center">
          <button
            type="button"
            onClick={() => setIsHologram((current) => !current)}
            className="rounded-full border border-yellow-400/50 px-4 py-1.5 text-xs tracking-widest text-yellow-400 transition-colors hover:bg-yellow-400/10"
          >
            {isHologram ? 'HOLOGRAM' : 'NORMAL'}
          </button>
        </div>

        <div className="pr-10">
          <h2 className="text-3xl font-black tracking-[0.12em] text-yellow-400 uppercase">
            A.Algifari Rantiga Isdar
          </h2>
          <p className="mt-1 text-sm font-semibold text-gray-300">UNIT #5027251112 • JAKARTA SYSTEM</p>
        </div>

        <div className="mt-5 flex gap-2">
          <Instagram username="alghifarirantiga" />
          <LinkedInButtonLink username="algifari-rantiga-6906b1379" />
        </div>

        <div className="mt-6 grid gap-4 text-sm font-semibold sm:grid-cols-2">
          <div className="rounded-xl border border-yellow-400/20 bg-yellow-400/5 p-4">
            <p className="text-xs tracking-widest text-yellow-400 uppercase">Hobi</p>
            <p className="mt-2">Ngoding (ngobrol ama dinding)</p>
          </div>

          <div className="rounded-xl border border-yellow-400/20 bg-yellow-400/5 p-4">
            <p className="text-xs tracking-widest text-yellow-400 uppercase">Fun fact</p>
            <p className="mt-2">Motor dimalingin 2 tahun berturut turut</p>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-yellow-400/20 bg-yellow-400/5 p-4">
          <p className="text-xs font-bold tracking-widest text-yellow-400 uppercase">Cantina Track</p>
          <p className="my-2 text-sm font-semibold">Sebelah mata</p>
          <div className="overflow-hidden rounded-xl border border-yellow-400/20">
            <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/3M0RfjqAJZ1f6qXJkP1Uej" />
          </div>
        </div>

        <div className="mt-6 border-t border-yellow-400/20 pt-4 text-center">
          <p className="text-yellow-400 italic">This is the way.</p>
          <p className="mt-2 text-xs tracking-[0.3em] text-gray-500">IMPERIAL PERSONNEL RECORD</p>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default MemberPopup
