'use client'

import React, { useEffect } from 'react'
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
    if (!isOpen) return

    const wrap = document.getElementById('member-img-wrap')
    const img = document.getElementById('member-img')
    if (!wrap || !img) return

    let rafId: number

    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => {
        const r = wrap.getBoundingClientRect()
        const x = (e.clientX - r.left) / r.width
        const y = (e.clientY - r.top) / r.height
        const moveX = (x - 0.5) * 15
        const moveY = (y - 0.5) * 15
        img.style.transform = `scale(1.12) translate(${moveX}px, ${moveY}px)`
      })
    }

    const onLeave = () => {
      cancelAnimationFrame(rafId)
      img.style.transform = 'scale(1) translate(0px, 0px)'
    }

    wrap.addEventListener('mousemove', onMove)
    wrap.addEventListener('mouseleave', onLeave)

    return () => {
      cancelAnimationFrame(rafId)
      wrap.removeEventListener('mousemove', onMove)
      wrap.removeEventListener('mouseleave', onLeave)
    }
  }, [isOpen])

  if (!isOpen) {
    return null
  }

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto px-4 pt-28 pb-8 sm:pt-32">
      <button
        type="button"
        aria-label="Close member detail"
        onClick={onClose}
        className="absolute inset-0 bg-black/80"
      />
      <div className="relative z-10 max-h-[calc(100vh-9rem)] w-full max-w-[720px] animate-[member-popup-show_200ms_ease-out] overflow-x-hidden overflow-y-auto rounded-2xl border border-[#24496b] bg-[#071f35] p-6 shadow-[0_24px_60px_rgba(7,31,53,0.5)] sm:max-h-[calc(100vh-10rem)] sm:p-8">
        <button
          type="button"
          aria-label="Close member detail"
          onClick={onClose}
          className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border border-[#24496b] bg-[#071f35]/85 text-xl leading-none text-[#98b1c8] transition-all duration-300 hover:rotate-90 hover:scale-110 hover:border-[#446d92] hover:text-[#f7fafe]"
        >
          ✕
        </button>

        <div id="member-img-wrap" className="mb-5 overflow-hidden rounded-2xl border border-[#24496b] transition-[border-color] duration-300 hover:border-[#446d92]">
          <Image id="member-img" src={ProfileImage} alt="Profile Image" className="h-120 w-full object-cover object-center transition-transform duration-75" />
        </div>

        <div className="pr-10">
          {/* UBAH NAMA ANDA */}
          <h2 className="font-['Playfair_Display'] cursor-default text-[28px] font-black leading-tight tracking-tight text-[#f7fafe] transition-all duration-500 hover:tracking-wide hover:text-white">Marvelino Davas</h2>
          {/* UBAH NRP DAN ASAL */}
          <p className="mt-1.5 text-[11px] font-light tracking-[0.06em] text-[#98b1c8]">5027251085 · Pontianak</p>
        </div>

        <div className="mt-5 flex gap-3">
          {/* UBAH USERNAME INSTAGRAM */}
          <div className="transition-all duration-200 hover:-translate-y-1 hover:scale-110 hover:drop-shadow-[0_4px_12px_rgba(152,177,200,0.3)] active:scale-95">
            <Instagram username="marvelinoou" />
          </div>
          {/* UBAH USERNAME LINKEDIN */}
          <div className="transition-all duration-200 hover:-translate-y-1 hover:scale-110 hover:drop-shadow-[0_4px_12px_rgba(152,177,200,0.3)] active:scale-95">
            <LinkedInButtonLink username="marvelino-davas-6456b3379" />
          </div>
        </div>

        <div className="mt-6 grid gap-4 text-sm font-semibold sm:grid-cols-2">
          <div
            className="group relative cursor-default overflow-hidden rounded-xl border border-[#24496b] bg-[#0d2840] p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#446d92] hover:bg-[#112e48] hover:shadow-[0_6px_20px_rgba(7,31,53,0.5)]"
            onClick={(e) => {
              const r = e.currentTarget.getBoundingClientRect()
              const el = document.createElement('span')
              el.style.cssText = `position:absolute;border-radius:50%;background:rgba(152,177,200,0.15);width:8px;height:8px;left:${e.clientX - r.left - 4}px;top:${e.clientY - r.top - 4}px;transform:scale(0);pointer-events:none;animation:ripple 0.5s ease-out forwards`
              e.currentTarget.appendChild(el)
              setTimeout(() => el.remove(), 500)
            }}
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(152,177,200,0.35)] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            {/* UBAH HOBI KAMU */}
            <p className="text-[8px] font-medium uppercase tracking-[0.14em] text-[#98b1c8] transition-colors duration-200 group-hover:text-[#c8d8e8]">Hobi</p>
            <p className="mt-2 text-[13px] font-normal text-[#c8d8e8] transition-colors duration-200 group-hover:text-[#f7fafe]">Ngoding</p>
          </div>
          <div
            className="group relative cursor-default overflow-hidden rounded-xl border border-[#24496b] bg-[#0d2840] p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#446d92] hover:bg-[#112e48] hover:shadow-[0_6px_20px_rgba(7,31,53,0.5)]"
            onClick={(e) => {
              const r = e.currentTarget.getBoundingClientRect()
              const el = document.createElement('span')
              el.style.cssText = `position:absolute;border-radius:50%;background:rgba(152,177,200,0.15);width:8px;height:8px;left:${e.clientX - r.left - 4}px;top:${e.clientY - r.top - 4}px;transform:scale(0);pointer-events:none;animation:ripple 0.5s ease-out forwards`
              e.currentTarget.appendChild(el)
              setTimeout(() => el.remove(), 500)
            }}
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(152,177,200,0.35)] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            {/* UBAH FUNFACT KAMU */}
            <p className="text-[8px] font-medium uppercase tracking-[0.14em] text-[#98b1c8] transition-colors duration-200 group-hover:text-[#c8d8e8]">Fun Fact</p>
            <p className="mt-2 text-[13px] font-normal leading-snug text-[#c8d8e8] transition-colors duration-200 group-hover:text-[#f7fafe]">ga bisa minum es dan makan pedas</p>
          </div>
        </div>

        <div className="group mt-4 rounded-xl border border-[#24496b] bg-[#0d2840] p-4 transition-all duration-200 hover:border-[#446d92] hover:bg-[#112e48]">
          {/* UBAH LAGU FAVORIT KAMU */}
          <p className="text-[8px] font-medium uppercase tracking-[0.14em] text-[#98b1c8]">Lagu Favorit</p>
          <p className="my-2 font-['Playfair_Display'] text-[15px] font-bold italic text-[#c8d8e8] transition-colors duration-200 group-hover:text-[#f7fafe]">Vienna</p>
          {/* UBAH URL SPOTIFY KAMU DENGAN LAGU FAVORIT MU */}
          <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/4U45aEWtQhrm8A5mxPaFZ7?si=33b9db8892e84689" />
        </div>

      </div>
    </div>,
    document.body
  )
}

export default MemberPopup