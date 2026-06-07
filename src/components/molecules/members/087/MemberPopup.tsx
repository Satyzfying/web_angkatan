'use client'

import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'

import Image from 'next/image'

import Instagram from '@/components/atoms/button/InstagramButtonLink'
import LinkedInButtonLink from '@/components/atoms/button/LinkedInButtonLink'
import SpotifyEmbed from '@/components/molecules/SpotifyEmbed'

import ExpeditionBackgroundImage from './expedition-bg.png'
import ExpeditionTitleImage from './expedition-title.png'
import ProfileImage from './image.png'

type MemberPopupProps = {
  isOpen: boolean
  onClose: () => void
}

type HoverSparkTextProps = {
  children: React.ReactNode
  className?: string
}

const fallingPetals = Array.from({ length: 150 }, (_, index) => ({
  id: index,
  right: `${-10 + ((index * 17) % 55)}%`,
  top: `${-35 + ((index * 13) % 95)}%`,
  size: `${7 + ((index * 5) % 14)}px`,
  delay: `-${(index % 16) * 0.35}s`,
  duration: `${6 + (index % 7) * 0.55}s`,
  rotate: `${(index * 47) % 360}deg`,
  color:
    index % 3 === 0
      ? 'rgba(122, 20, 24, 0.55)'
      : index % 3 === 1
        ? 'rgba(218, 209, 192, 0.58)'
        : 'rgba(82, 12, 16, 0.48)',
}))

const sparkPetals = Array.from({ length: 9 }, (_, index) => ({
  id: index,
  size: `${5 + (index % 4) * 2}px`,
  delay: `${index * 0.035}s`,
  x: `${[-30, -18, -8, 10, 22, 32, -24, 16, 4][index]}px`,
  y: `${[-26, -36, -22, -34, -18, -28, 10, 8, -44][index]}px`,
  rotate: `${index * 47}deg`,
  color:
    index % 3 === 0
      ? 'rgba(130, 20, 24, 0.78)'
      : index % 3 === 1
        ? 'rgba(232, 224, 208, 0.82)'
        : 'rgba(90, 12, 16, 0.72)',
}))

const HoverSparkText = ({ children, className = '' }: HoverSparkTextProps) => {
  return (
    <span className={`spark-text relative inline-block cursor-default ${className}`}>
      {children}

      <span className="pointer-events-none absolute top-1/2 left-1/2 z-30 block h-0 w-0">
        {sparkPetals.map((petal) => (
          <span
            key={petal.id}
            className="spark-petal absolute rounded-[70%_30%_70%_30%] opacity-0"
            style={
              {
                width: petal.size,
                height: `calc(${petal.size} * 1.45)`,
                backgroundColor: petal.color,
                '--spark-x': petal.x,
                '--spark-y': petal.y,
                '--spark-rotate': petal.rotate,
                '--spark-delay': petal.delay,
                boxShadow:
                  petal.id % 2 === 0
                    ? '0 0 8px rgba(130, 20, 24, 0.5)'
                    : '0 0 8px rgba(232, 224, 208, 0.4)',
              } as React.CSSProperties
            }
          />
        ))}
      </span>
    </span>
  )
}

const MemberPopup = ({ isOpen, onClose }: MemberPopupProps) => {
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

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto px-4">
      {/* Background landscape kanan kiri */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <Image
          src={ExpeditionBackgroundImage}
          alt="Expedition Background"
          fill
          loading="eager"
          sizes="100vw"
          className="scale-105 object-cover object-center opacity-100"
        />

        <div className="absolute inset-0 bg-black/25" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.12),rgba(0,0,0,0.68)_82%)]" />
        <div className="absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-black/55 via-black/15 to-transparent" />
        <div className="absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-black/55 via-black/15 to-transparent" />
      </div>

      <button
        type="button"
        aria-label="Close member detail"
        onClick={onClose}
        className="absolute inset-0 bg-black/10 backdrop-blur-[1px]"
      />

      {/* Bunga jatuh diagonal dari kanan atas ke kiri bawah */}
      <div className="pointer-events-none fixed inset-0 z-[120] overflow-hidden">
        {fallingPetals.map((petal) => (
          <span
            key={petal.id}
            className="absolute rounded-[70%_30%_70%_30%] blur-[0.2px]"
            style={
              {
                right: petal.right,
                top: petal.top,
                width: petal.size,
                height: `calc(${petal.size} * 1.45)`,
                backgroundColor: petal.color,
                rotate: petal.rotate,
                opacity: 0,
                animation: `petal-diagonal-fall ${petal.duration} linear ${petal.delay} infinite both`,
                boxShadow:
                  petal.id % 2 === 0
                    ? '0 0 8px rgba(122, 20, 24, 0.35)'
                    : '0 0 8px rgba(218, 209, 192, 0.28)',
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      <div className="relative z-[110] max-h-[100dvh] w-full max-w-[760px] animate-[member-popup-show_250ms_ease-out] overflow-y-auto rounded-2xl border border-[#725524]/70 bg-[#020100] p-5 text-[#f3dfb2] shadow-[0_0_55px_rgba(94,68,24,0.24)] sm:p-7">
        {/* Dark Gold Glow */}
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_top,rgba(90,65,24,0.2),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.025),transparent_35%,rgba(70,8,8,0.12))]" />

        <button
          type="button"
          aria-label="Close member detail"
          onClick={onClose}
          className="absolute top-4 right-4 z-[140] flex h-9 w-9 items-center justify-center rounded-full border border-[#9f7c3b]/80 bg-black/80 text-xl leading-none text-[#f3dfb2] transition-all duration-300 hover:scale-110 hover:bg-[#b8944d] hover:text-black hover:shadow-[0_0_18px_rgba(184,148,77,0.75)]"
        >
          ×
        </button>

        <div className="relative z-10">
          {/* Profile Image + Title */}
          <div className="relative mb-5 pt-[148px] sm:pt-[160px]">
            <div className="pointer-events-none absolute top-[-18px] left-1/2 z-20 w-[420px] max-w-[78%] -translate-x-1/2">
              <Image
                src={ExpeditionTitleImage}
                alt="Expedition 33 Title"
                loading="eager"
                className="h-auto w-full object-contain opacity-95 mix-blend-screen drop-shadow-[0_0_18px_rgba(181,139,70,0.5)]"
              />
            </div>

            <div className="group relative overflow-hidden rounded-2xl border border-[#725524]/70 bg-black shadow-[0_0_28px_rgba(90,65,24,0.25)]">
              <div className="absolute inset-0 z-10 bg-gradient-to-tr from-black/40 via-transparent to-[#8a6a2f]/10 opacity-85" />
              <div className="absolute inset-x-0 top-0 z-10 h-28 bg-gradient-to-b from-black/55 via-black/15 to-transparent" />

              <Image
                src={ProfileImage}
                alt="Profile Image"
                loading="eager"
                fetchPriority="high"
                className="h-120 w-full object-cover object-center transition-all duration-700 group-hover:scale-[1.04] group-hover:brightness-110"
              />
            </div>
          </div>

          <div className="pr-10">
            <h2 className="text-2xl font-black text-[#f3dfb2] transition-all duration-300 hover:-translate-y-1 hover:tracking-wide hover:text-[#b8944d] hover:drop-shadow-[0_0_12px_rgba(184,148,77,0.8)]">
              <HoverSparkText>Muhammad Rifki Pribadi</HoverSparkText>
            </h2>

            <p className="mt-1 text-sm font-semibold text-[#a89162]/80 transition-all duration-300 hover:translate-x-2 hover:text-white">
              <HoverSparkText>5027251087 - Jakarta</HoverSparkText>
            </p>
          </div>

          <div className="mt-5 flex gap-2">
            <Instagram username="rifki407" />
            <LinkedInButtonLink username="rifkipribadi" />
          </div>

          <div className="mt-6 grid gap-4 text-sm font-semibold sm:grid-cols-2">
            <div className="group rounded-xl border border-[#725524]/55 bg-black/70 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-[#b8944d] hover:bg-[#070403] hover:shadow-[0_0_18px_rgba(120,89,32,0.25)]">
              <p className="text-xs tracking-wide text-[#b8944d]/75 uppercase transition-all duration-300 group-hover:text-[#f3dfb2]">
                <HoverSparkText>Hobi</HoverSparkText>
              </p>

              <p className="mt-2 transition-all duration-300 group-hover:translate-x-1 group-hover:text-white">
                <HoverSparkText>Game (Valorant, Persona, Tekken, etc.)</HoverSparkText>
              </p>
            </div>

            <div className="group rounded-xl border border-[#725524]/55 bg-black/70 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-[#b8944d] hover:bg-[#070403] hover:shadow-[0_0_18px_rgba(120,89,32,0.25)]">
              <p className="text-xs tracking-wide text-[#b8944d]/75 uppercase transition-all duration-300 group-hover:text-[#f3dfb2]">
                <HoverSparkText>Fun Fact</HoverSparkText>
              </p>

              <p className="mt-2 transition-all duration-300 group-hover:translate-x-1 group-hover:text-white">
                <HoverSparkText>Kalo udah suka sama sesuatu suka lupa waktu</HoverSparkText>
              </p>
            </div>
          </div>

          <div className="group mt-4 rounded-xl border border-[#725524]/55 bg-black/70 p-4 transition-all duration-300 hover:border-[#b8944d] hover:bg-[#070403] hover:shadow-[0_0_22px_rgba(120,89,32,0.3)]">
            <p className="text-xs font-bold tracking-wide text-[#b8944d]/75 uppercase transition-all duration-300 group-hover:text-[#f3dfb2]">
              <HoverSparkText>Lagu Favorit</HoverSparkText>
            </p>

            <p className="my-2 text-sm font-semibold transition-all duration-300 hover:translate-x-2 hover:text-[#b8944d] hover:drop-shadow-[0_0_8px_rgba(184,148,77,0.75)]">
              <HoverSparkText>Ransom</HoverSparkText>
            </p>

            <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/1lOe9qE0vR9zwWQAOk6CoO?si=8fc54909d8ca4fdd" />
          </div>
        </div>

        <style jsx global>{`
          @keyframes petal-diagonal-fall {
            0% {
              transform: translate(80px, -160px) rotate(0deg) scale(0.35);
              opacity: 0;
            }

            10% {
              opacity: 0.7;
            }

            45% {
              transform: translate(-38vw, 42vh) rotate(170deg) scale(1);
              opacity: 0.75;
            }

            100% {
              transform: translate(-95vw, 105vh) rotate(380deg) scale(0.55);
              opacity: 0;
            }
          }

          .spark-text:hover .spark-petal {
            animation: spark-burst 720ms ease-out var(--spark-delay) forwards;
          }

          @keyframes spark-burst {
            0% {
              transform: translate(-50%, -50%) rotate(0deg) scale(0.2);
              opacity: 0;
            }

            18% {
              opacity: 0.9;
            }

            100% {
              transform: translate(var(--spark-x), var(--spark-y)) rotate(var(--spark-rotate)) scale(0.85);
              opacity: 0;
            }
          }

          @keyframes member-popup-show {
            from {
              opacity: 0;
              transform: translateY(18px) scale(0.96);
            }

            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
        `}</style>
      </div>
    </div>,
    document.body
  )
}

export default MemberPopup