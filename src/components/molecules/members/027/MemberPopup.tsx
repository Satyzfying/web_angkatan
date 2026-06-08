'use client'

import React, { useEffect } from 'react'

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
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-hidden px-4">
      <button
        type="button"
        aria-label="Close member detail"
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />

      <div
        className="border-neutral-cs-10 bg-blue-cs-40 relative z-10 h-[100dvh] max-h-[100dvh] w-full max-w-[720px] animate-[member-popup-show_200ms_ease-out] overflow-y-auto overscroll-contain rounded-2xl border-2 p-6 text-white shadow-xl sm:p-8"
        style={{
          background: 'linear-gradient(160deg, #1a0000 0%, #0f0f0f 40%, #1a0000 100%)',
          border: '1px solid #cc0000',
          borderRadius: '4px',
          boxShadow: '0 0 40px rgba(204,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)',
        }}
      >
        <button
          type="button"
          aria-label="Close member detail"
          onClick={onClose}
          className="border-neutral-cs-10 hover:bg-neutral-cs-10/10 absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border text-xl leading-none"
        >
          x
        </button>

        <div className="border-neutral-cs-10/40 mb-5 overflow-hidden rounded-2xl border">
          <Image src={ProfileImage} alt="Profile Image" className="h-120 w-full object-cover object-center" />
        </div>

        {/* HEADER BAR — Constructor style */}
        <div
          className="flex items-center justify-between px-6 py-3"
          style={{
            background: 'linear-gradient(90deg, #cc0000 0%, #8a0000 60%, transparent 100%)',
            borderBottom: '1px solid rgba(204,0,0,0.4)',
          }}
        >
          <div className="flex items-center gap-3">
            {/* F1 Chequered flag icon */}
            <div className="flex h-6 w-6 overflow-hidden rounded-sm" style={{ border: '1px solid rgba(255,255,255,0.3)' }}>
              {[...Array(16)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: '25%',
                    height: '25%',
                    background: (Math.floor(i / 4) + (i % 4)) % 2 === 0 ? '#fff' : '#000',
                    flexShrink: 0,
                  }}
                />
              ))}
            </div>
            <span
              className="text-xs font-black uppercase tracking-[0.3em] text-white/90"
              style={{ fontFamily: 'Georgia, serif', letterSpacing: '0.35em' }}
            >
              Driver Profile
            </span>
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-white/50">
            2025 Season
          </span>
        </div>

        <div className="p-6 sm:p-8">
          {/* CLOSE BUTTON */}
          <button
            type="button"
            aria-label="Close member detail"
            onClick={onClose}
            className="absolute top-10 right-4 flex h-8 w-8 items-center justify-center text-sm font-black text-white/60 transition-colors hover:text-white"
            style={{
              border: '1px solid rgba(204,0,0,0.5)',
              background: 'rgba(0,0,0,0.5)',
              borderRadius: '2px',
            }}
          >
            ✕
          </button>

          {/* PROFILE IMAGE — with racing frame */}
          <div
            className="mb-6 overflow-hidden"
            style={{
              borderRadius: '4px',
              border: '2px solid #cc0000',
              position: 'relative',
              boxShadow: '4px 4px 0 #8a0000, 0 0 20px rgba(204,0,0,0.2)',
            }}
          >
            {/* Speed lines overlay */}
            <div
              className="absolute inset-0 z-10 pointer-events-none"
              style={{
                background:
                  'linear-gradient(90deg, rgba(204,0,0,0.15) 0%, transparent 30%, transparent 70%, rgba(204,0,0,0.1) 100%)',
              }}
            />
            {/* Top-left corner accent */}
            <div
              className="absolute top-0 left-0 z-10 pointer-events-none"
              style={{
                width: '40px',
                height: '40px',
                borderTop: '3px solid #cc0000',
                borderLeft: '3px solid #cc0000',
              }}
            />
            {/* Bottom-right corner accent */}
            <div
              className="absolute bottom-0 right-0 z-10 pointer-events-none"
              style={{
                width: '40px',
                height: '40px',
                borderBottom: '3px solid #cc0000',
                borderRight: '3px solid #cc0000',
              }}
            />
            <Image
              src={ProfileImage}
              alt="Profile Image"
              className="h-96 w-full object-cover object-top"
              style={{ filter: 'contrast(1.05) saturate(0.95)' }}
            />
            {/* Driver number badge */}
            <div
              className="absolute bottom-4 left-4 z-10"
              style={{
                background: '#cc0000',
                padding: '4px 12px',
                borderRadius: '2px',
                clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)',
              }}
            >
              <span className="text-2xl font-black text-white" style={{ fontFamily: 'Georgia, serif' }}>
                #27
              </span>
            </div>
          </div>

          {/* DRIVER NAME BLOCK */}
          <div className="pr-10 mb-1">
            <div className="flex items-start gap-3">
              {/* Vertical red accent bar */}
              <div className="mt-1 h-full w-1 self-stretch" style={{ background: '#cc0000', minHeight: '40px', borderRadius: '1px' }} />
              <div>
                <p
                  className="text-xs font-bold uppercase tracking-[0.4em] mb-1"
                  style={{ color: '#cc0000' }}
                >
                  Evastra Racing
                </p>
                <h2
                  className="text-3xl font-black uppercase leading-tight text-white"
                  style={{ fontFamily: 'Georgia, serif', letterSpacing: '0.02em', textShadow: '2px 2px 0 rgba(204,0,0,0.3)' }}
                >
                  Iqbal Rizki
                  <br />
                  <span style={{ color: '#ff4444' }}>Muhammad Fadhli</span>
                </h2>
                <p
                  className="mt-2 text-xs font-bold uppercase tracking-widest"
                  style={{ color: 'rgba(255,255,255,0.4)' }}
                >
                  5027251027 · Kota Reog
                </p>
              </div>
            </div>
          </div>

          {/* SOCIAL LINKS */}
          <div
            className="mt-5 flex gap-3 py-3"
            style={{ borderTop: '1px solid rgba(204,0,0,0.3)', borderBottom: '1px solid rgba(204,0,0,0.3)' }}
          >
            <Instagram username="iqb.rz_" />
            <LinkedInButtonLink username="iqbalrizkimuhf" />
          </div>

          {/* TELEMETRY DATA CARDS */}
          <div className="mt-5 grid gap-3 text-sm font-semibold sm:grid-cols-2">
            {/* Hobi */}
            <div
              className="relative overflow-hidden p-4"
              style={{
                background: 'rgba(204,0,0,0.08)',
                border: '1px solid rgba(204,0,0,0.35)',
                borderRadius: '3px',
              }}
            >
              {/* Diagonal speed stripe */}
              <div
                className="absolute top-0 right-0 h-full w-12 pointer-events-none"
                style={{
                  background: 'linear-gradient(135deg, transparent 50%, rgba(204,0,0,0.08) 50%)',
                }}
              />
              <p
                className="text-xs font-black uppercase tracking-[0.3em] mb-2 flex items-center gap-2"
                style={{ color: '#cc0000' }}
              >
                <span style={{ display: 'inline-block', width: '8px', height: '8px', background: '#cc0000', borderRadius: '50%' }} />
                Hobi
              </p>
              <p className="text-white font-bold text-sm">Senyum</p>
            </div>

            {/* Fun Fact */}
            <div
              className="relative overflow-hidden p-4"
              style={{
                background: 'rgba(204,0,0,0.08)',
                border: '1px solid rgba(204,0,0,0.35)',
                borderRadius: '3px',
              }}
            >
              <div
                className="absolute top-0 right-0 h-full w-12 pointer-events-none"
                style={{
                  background: 'linear-gradient(135deg, transparent 50%, rgba(204,0,0,0.08) 50%)',
                }}
              />
              <p
                className="text-xs font-black uppercase tracking-[0.3em] mb-2 flex items-center gap-2"
                style={{ color: '#cc0000' }}
              >
                <span style={{ display: 'inline-block', width: '8px', height: '8px', background: '#cc0000', borderRadius: '50%' }} />
                Fun Fact
              </p>
              <p className="text-white font-bold text-sm">Tidak bisa tidur siang di malam hari</p>
            </div>
          </div>

          {/* LAGU FAVORIT */}
          <div
            className="mt-3 p-4 relative overflow-hidden"
            style={{
              background: 'rgba(204,0,0,0.08)',
              border: '1px solid rgba(204,0,0,0.35)',
              borderRadius: '3px',
            }}
          >
            <p
              className="text-xs font-black uppercase tracking-[0.3em] mb-3 flex items-center gap-2"
              style={{ color: '#cc0000' }}
            >
              <span style={{ display: 'inline-block', width: '8px', height: '8px', background: '#cc0000', borderRadius: '50%' }} />
              Lagu Favorit
            </p>
            <p className="mb-3 text-sm font-bold text-white">Message In A Bottle</p>
            <SpotifyEmbed spotifyUrl="https://open.spotify.com/intl-id/track/3z6XUommYDWPHeFhmhhT6j?si=abad557666e6450b" />
          </div>

          {/* BOTTOM LIVERY STRIPE */}
          <div
            className="mt-6 h-2 w-full"
            style={{
              background: 'repeating-linear-gradient(90deg, #cc0000 0px, #cc0000 20px, #8a0000 20px, #8a0000 22px, #cc0000 22px)',
              borderRadius: '1px',
            }}
          />
        </div>
      </div>
    </div>,
    document.body
  )
}

export default MemberPopup
