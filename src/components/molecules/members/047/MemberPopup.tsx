'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'

import Image from 'next/image'

import { createPortal } from 'react-dom'

import Instagram from '@/components/atoms/button/InstagramButtonLink'
import LinkedInButtonLink from '@/components/atoms/button/LinkedInButtonLink'
import SpotifyEmbed from '@/components/molecules/SpotifyEmbed'
import ProfileImage from './foto.jpg'

import Slide1 from './1.png'
import Slide2 from './2.png'
import Slide3 from './3.png'
import Slide4 from './4.png'
import Slide5 from './5.png'

type MemberPopupProps = {
  isOpen: boolean
  onClose: () => void
}

const TOTAL_SLIDES = 5

const MemberPopup = ({ isOpen, onClose }: MemberPopupProps) => {
  const [slideIndex, setSlideIndex] = useState(0)
  const [showCard, setShowCard] = useState(false)
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])

  const killAll = useCallback(() => {
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
  }, [])

  const closePopup = useCallback(() => {
    killAll()
    setSlideIndex(0)
    setShowCard(false)
    onClose()
  }, [killAll, onClose])

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closePopup()
    }

    let currentSlide = 0
    const advance = () => {
      currentSlide++
      if (currentSlide < TOTAL_SLIDES) {
        setSlideIndex(currentSlide)
        const timer = setTimeout(advance, 250)
        timersRef.current.push(timer)
      } else {
        setShowCard(true)
      }
    }
    const timer = setTimeout(advance, 1000)
    timersRef.current.push(timer)

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
      killAll()
    }
  }, [isOpen, closePopup, killAll])

  if (!isOpen) return null

  const mono = "'IBM Plex Mono', 'Courier New', monospace" as const
  const slideImages = [Slide1, Slide2, Slide3, Slide4, Slide5]

  return createPortal(
    <>
      {/* PADA BAGIAN INI KAMU BOLEH MENGUBAH STYLE SESUKA HATI KAMU, TAPI JANGAN UBAH STRUKTUR DAN FUNGSI DARI KODE INI AGAR FUNGSI POPUP TETAP BERJALAN DENGAN BAIK */}
      <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-hidden px-4">
        <button
          type="button"
          aria-label="Close member detail"
          onClick={closePopup}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* container utama — height eksplisit biar absolute children punya ruang */}
        <div
          className="relative z-10 w-full max-w-[560px]"
          style={{
            height: '100dvh',
            maxHeight: '100dvh',
            border: '2px solid #fff',
            borderRadius: 0,
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {/* INTRO SLIDES — posisi absolute, jadi tetap keliatan saat card naik */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: '#fff',
              zIndex: 1,
              pointerEvents: showCard ? 'none' : 'auto',
            }}
          >
            {slideImages.map((src, i) => (
  <div
    key={i}
    style={{
      position: 'absolute', inset: 0,
      opacity: slideIndex === i ? 1 : 0,
      transition: 'opacity 0.15s ease',
      pointerEvents: slideIndex === i ? 'auto' : 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#fff',
      overflow: 'hidden',
    }}
  >
    <Image
      src={src}
      alt={`slide ${i + 1}`}
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        display: 'block',
        // zoom in halus saat slide aktif
        transform: slideIndex === i ? 'scale(1.06)' : 'scale(1)',
        transition: 'transform 0.8s cubic-bezier(0.22,1,0.36,1), opacity 0.15s ease',
        transformOrigin: 'center center',
      }}
    />
  </div>
))}
          </div>

          {/* CARD — absolute, swipe up dari bawah di atas intro */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: '#111111',
              transform: showCard ? 'translateY(0)' : 'translateY(100%)',
              transition: 'transform 0.6s cubic-bezier(0.22,1,0.36,1)',
              overflowY: 'auto',
              zIndex: 2,
            }}
          >
            <button
              type="button"
              aria-label="Close member detail"
              onClick={closePopup}
              style={{
                position: 'absolute', top: 16, right: 16,
                width: 34, height: 34,
                border: '1px solid #333',
                borderRadius: 0,
                background: 'transparent',
                color: '#666',
                fontFamily: mono,
                fontSize: 18,
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 10,
              }}
            >×</button>

            {/* foto */}
            <div style={{ width: '100%', overflow: 'hidden', borderBottom: '1px solid #222' }}>
              <Image
                src={ProfileImage}
                alt="Profile Image"
                className="w-full object-cover object-center"
                style={{ height: 280, display: 'block' }}
              />
            </div>

            {/* nama */}
            <div style={{ padding: '22px 28px', borderBottom: '1px solid #222' }}>
              <h2 style={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 900,
                fontSize: 'clamp(20px, 4vw, 28px)',
                color: '#F5F5F5',
                letterSpacing: '-0.03em',
                lineHeight: 0.95,
                marginBottom: 8,
              }}>Putri Permata Sabila</h2>
              <p style={{
                fontFamily: mono,
                fontSize: 11,
                color: '#555',
                letterSpacing: '0.08em',
              }}>5027251047 — Malang</p>
            </div>

            {/* sosmed */}
            <div style={{
              padding: '16px 28px',
              borderBottom: '1px solid #222',
              display: 'flex', gap: 12,
            }}>
              <Instagram username="sabilapuputt" />
              <LinkedInButtonLink username="putri-permata-sabila-239932320" />
            </div>

            {/* hobi + fun fact — 2 kolom */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              borderBottom: '1px solid #222',
            }}>
              <div style={{ padding: '18px 24px', borderRight: '1px solid #222' }}>
                <p style={{
                  fontFamily: mono, fontSize: 9,
                  letterSpacing: '0.2em', textTransform: 'uppercase',
                  color: '#444', marginBottom: 8,
                }}>Hobi</p>
                <p style={{
                  fontFamily: "'Inter', sans-serif", fontWeight: 500,
                  fontSize: 13, color: '#D0D0D0', lineHeight: 1.55,
                }}>mendengarkan lagu, bernyanyi (meskipun suara awikwok), main musik</p>
              </div>
              <div style={{ padding: '18px 24px' }}>
                <p style={{
                  fontFamily: mono, fontSize: 9,
                  letterSpacing: '0.2em', textTransform: 'uppercase',
                  color: '#444', marginBottom: 8,
                }}>Fun Fact</p>
                <p style={{
                  fontFamily: "'Inter', sans-serif", fontWeight: 500,
                  fontSize: 13, color: '#D0D0D0', lineHeight: 1.55,
                }}>gabisa pedas dan ga suka pedas (mie gacoan level 0 enjoyer)</p>
              </div>
            </div>

            {/* lagu favorit */}
            <div style={{ padding: '18px 28px 28px' }}>
              <p style={{
                fontFamily: mono, fontSize: 9,
                letterSpacing: '0.2em', textTransform: 'uppercase',
                color: '#444', marginBottom: 8,
              }}>Lagu Favorit</p>
              <p style={{
                fontFamily: "'Inter', sans-serif", fontWeight: 500,
                fontSize: 13, color: '#D0D0D0', lineHeight: 1.55,
                marginBottom: 12,
              }}>Pasti Ada Jalan — lagi suka ini karena lagunya bikin optimis!!</p>
              <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/6KUO3GzqmTnF0aCNlALa62?si=d5038e19ddda42aa" />
            </div>
          </div>
        </div>
      </div>
    </>,
    document.body
  )
}

export default MemberPopup
