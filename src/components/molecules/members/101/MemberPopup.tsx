'use client'

import React, { useEffect, useRef, useCallback, useState } from 'react'
<<<<<<< HEAD
=======
import { createPortal } from 'react-dom'

>>>>>>> e3a11db60a9839a167f348fea8a6d7063e6e5460
import Image from 'next/image'

// Shared UI Components
import Instagram from '@/components/atoms/button/InstagramButtonLink'
import LinkedInButtonLink from '@/components/atoms/button/LinkedInButtonLink'
import SpotifyEmbed from '@/components/molecules/SpotifyEmbed'

// Assets
import ProfileBackground from './Assets/background.png'
import ProfileCutout from './Assets/profile.png'
import TextBubble from './Assets/text bubble.png'
import CardBackgroundManga from './Assets/background_manga.png'

type MemberPopupProps = {
  isOpen: boolean
  onClose: () => void
}

/**
 * MemberPopup Component
 * Displays a highly interactive 3D parallax card for a member.
 * Features include:
 * - 3D Card Tilt via Mouse and Gyroscope
 * - Parallax depth layers (Background, Cutout, Bubble)
 * - Paint splash effects on interaction
 * - Magnetic social buttons
 * - Dynamic contrast text adapting to background gradients
 */
const MemberPopup = ({ isOpen, onClose }: MemberPopupProps) => {
<<<<<<< HEAD
  // ---------------------------------------------------------------------------
  // Refs
  // ---------------------------------------------------------------------------
  const cardWrapperRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const cutoutRef = useRef<HTMLDivElement>(null)
  const bubbleRef = useRef<HTMLDivElement>(null)
  const nameSectionRef = useRef<HTMLDivElement>(null)
  const bottomSectionRef = useRef<HTMLDivElement>(null)
  const cardsGridRef = useRef<HTMLDivElement>(null)

  const lastSplashTime = useRef(0)
  const isTouching = useRef(false)

  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------
  const [nrpText, setNrpText] = useState('0000000000')
  const [isRevealed, setIsRevealed] = useState(false)
  const [isImageActive, setIsImageActive] = useState(true)
  
  // Dynamic contrast states based on scroll position
  const [isTextInDarkArea, setIsTextInDarkArea] = useState(false)
  const [isTopCardsInDarkArea, setIsTopCardsInDarkArea] = useState(true)
  const [isCardInDarkArea, setIsCardInDarkArea] = useState(true)
=======
  const cardWrapperRef = useRef<HTMLDivElement>(null)
  const splashLayerRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const lastSplashTime = useRef(0)
  const [nrpText, setNrpText] = useState('0000000000')
  const [isRevealed, setIsRevealed] = useState(false)

  const handleClose = useCallback(() => {
    setNrpText('0000000000')
    setIsRevealed(false)
    onClose()
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
>>>>>>> e3a11db60a9839a167f348fea8a6d7063e6e5460

  // ---------------------------------------------------------------------------
  // Callbacks & Handlers
  // ---------------------------------------------------------------------------

  /**
   * Spawns a randomized neon paint splash element at the target coordinates.
   */
  const spawnSplash = useCallback((x: number, y: number) => {
    const container = splashLayerRef.current
    if (!container) return

    // Throttle splash generation
    const now = Date.now()
    if (now - lastSplashTime.current < 60) return
    lastSplashTime.current = now

    const colors = ['#55FFEA60', '#44ef6c60', '#55FFEA40', '#44ef6c40', '#88FFF050', '#55FFEA50']
    const color = colors[Math.floor(Math.random() * colors.length)]
    const size = 8 + Math.random() * 18
    const rotation = Math.random() * 360

    const splash = document.createElement('div')
    splash.className = 'paint-splash'
    splash.style.left = `${x}px`
    splash.style.top = `${y}px`
    splash.style.width = `${size}px`
    splash.style.height = `${size}px`
    splash.style.transform = `translate(-50%, -50%) rotate(${rotation}deg) scale(1)`

    const splatPaths = [
      `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M50 5C55 25 75 20 85 35C95 50 80 55 90 70C80 85 65 75 50 90C35 75 20 85 10 70C20 55 5 50 15 35C25 20 45 25 50 5Z" fill="${color}"/></svg>`,
      `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M50 0C60 30 70 15 95 30C75 45 100 55 80 75C65 60 55 80 40 95C45 70 15 75 5 55C25 50 0 30 25 20C35 35 40 10 50 0Z" fill="${color}"/></svg>`,
      `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="35" fill="${color}"/><circle cx="25" cy="30" r="12" fill="${color}"/><circle cx="78" cy="35" r="10" fill="${color}"/><circle cx="30" cy="75" r="8" fill="${color}"/><circle cx="72" cy="70" r="14" fill="${color}"/></svg>`,
      `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><ellipse cx="50" cy="50" rx="40" ry="30" fill="${color}"/><ellipse cx="20" cy="35" rx="15" ry="10" fill="${color}"/><ellipse cx="80" cy="65" rx="12" ry="8" fill="${color}"/></svg>`,
    ]
    splash.innerHTML = splatPaths[Math.floor(Math.random() * splatPaths.length)]

    container.appendChild(splash)

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        splash.style.transform = `translate(-50%, -50%) rotate(${rotation}deg) scale(1.5)`
        splash.style.opacity = '0'
      })
    })

    setTimeout(() => splash.remove(), 1300)
  }, [])

  /**
   * Applies magnetic tracking to elements (e.g. social buttons).
   */
  const handleMagneticMove = useCallback((e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    const el = e.currentTarget
    const rect = el.getBoundingClientRect()
    let clientX, clientY

    if ('touches' in e) {
      if (e.touches.length > 0) {
        clientX = e.touches[0].clientX
        clientY = e.touches[0].clientY
      } else return
    } else {
      clientX = (e as React.MouseEvent).clientX
      clientY = (e as React.MouseEvent).clientY
    }

    const x = clientX - rect.left - rect.width / 2
    const y = clientY - rect.top - rect.height / 2
    el.style.transform = `translate(${x * 0.4}px, ${y * 0.4}px)`
  }, [])

  const handleMagneticLeave = useCallback((e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = 'translate(0px, 0px)'
  }, [])

  /**
   * Updates CSS variables to drive the radial glow effect on info boxes.
   */
  const handleInfoBoxMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - r.left}px`)
    e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - r.top}px`)
  }, [])

  /**
   * Temporarily hides the info box glow so it doesn't conflict with child embeds.
   */
  const handleEmbedHoverToggle = useCallback((e: React.SyntheticEvent, isHovered: boolean) => {
    const infoBox = e.currentTarget.closest('.info-box')
    if (infoBox) {
      if (isHovered) infoBox.classList.add('hide-glow')
      else infoBox.classList.remove('hide-glow')
    }
  }, [])


  // ---------------------------------------------------------------------------
  // Effects
  // ---------------------------------------------------------------------------

  // Handle ESC key to close the modal
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

  // Parallax, 3D Tilt, and Paint Splash Logic
  useEffect(() => {
    if (!isOpen) return

    const wrapper = cardWrapperRef.current
    const card = cardRef.current
    if (!wrapper || !card) return

    /**
     * Handles global pointer movement to tilt the card and parallax the image layers.
     */
    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const rect = wrapper.getBoundingClientRect()
      let clientX, clientY

<<<<<<< HEAD
      // Extract coordinates from touch or mouse event
      if ('touches' in e) {
        if (e.touches.length > 0) {
          clientX = e.touches[0].clientX
          clientY = e.touches[0].clientY
        } else {
          return
        }
      } else {
        clientX = (e as MouseEvent).clientX
        clientY = (e as MouseEvent).clientY
=======
      spawnSplash(x, y)

      // 3D Card Tilt
      const cardCenterX = rect.width / 2
      const cardCenterY = rect.height / 2
      const rotateY = ((x - cardCenterX) / cardCenterX) * 1.5
      const rotateX = -((y - cardCenterY) / cardCenterY) * 1.5
      card.style.transition = 'transform 0.1s ease-out'
      card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1, 1, 1)`

      if (glowRef.current) {
        glowRef.current.style.background = `radial-gradient(800px circle at ${x}px ${y}px, rgba(85, 255, 234, 0.15), transparent 40%)`
>>>>>>> e3a11db60a9839a167f348fea8a6d7063e6e5460
      }

      const x = clientX - rect.left
      const y = clientY - rect.top

      const cardCenterX = rect.width / 2
      const cardCenterY = rect.height / 2
      const rotateY = ((x - cardCenterX) / cardCenterX) * 3
      const rotateX = -((y - cardCenterY) / cardCenterY) * 3
      
      // Calculate normalized coordinates (-1 to 1) for parallax
      const normX = (x - cardCenterX) / cardCenterX
      const normY = (y - cardCenterY) / cardCenterY

      // Desktop-only interaction (Mouse)
      if (!('touches' in e)) {
        // Tilt the main card container
        card.style.transition = 'transform 0.1s ease-out'
        card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1, 1, 1)`

        // Parallax the image layers unconditionally
        if (imageRef.current) {
          imageRef.current.style.transition = 'transform 0.15s ease-out'
          imageRef.current.style.transform = `translate(${normX * 6}px, ${normY * 6}px)`
        }
        if (cutoutRef.current) {
          cutoutRef.current.style.transition = 'transform 0.12s ease-out, filter 0.12s ease-out'
          cutoutRef.current.style.transform = `translate(${normX * 20}px, ${normY * 20}px)`
          cutoutRef.current.style.filter = `drop-shadow(${-normX * 10}px ${-normY * 10}px 15px rgba(0,0,0,0.5))`
        }
        if (bubbleRef.current) {
          bubbleRef.current.style.transition = 'transform 0.12s ease-out'
          bubbleRef.current.style.transform = `translate(${normX * 20}px, ${normY * 20}px)`
        }
      }

      // Paint splash effect triggered when hovering the bottom section
      if (bottomSectionRef.current) {
        const bottomRect = bottomSectionRef.current.getBoundingClientRect()
        if (clientY >= bottomRect.top && cardRef.current) {
          spawnSplash(x + cardRef.current.scrollLeft, y + cardRef.current.scrollTop)
        }
      }
    }

    /**
     * Resets the 3D card tilt when the mouse leaves the wrapper.
     */
    const handleMouseLeave = () => {
      card.style.transition = 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)'
      card.style.transform = `rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`
    }

    /**
     * Handles mobile device orientation to apply tilt and parallax via gyroscope.
     */
    const handleDeviceOrientation = (e: DeviceOrientationEvent) => {
      // Pause gyro if touching screen to allow normal scrolling/clicks
      if (isTouching.current) return
      
      // Ensure we only process gyro on actual touch devices to prevent laptop jitter
      if (!window.matchMedia("(any-pointer: coarse)").matches) return
      if (e.beta === null || e.gamma === null) return
      
      // Normalize gyro data and clamp it
      let normX = e.gamma / 30 
      let normY = (e.beta - 60) / 30 
      normX = Math.max(-1.5, Math.min(1.5, normX))
      normY = Math.max(-1.5, Math.min(1.5, normY))

      // Apply 3D tilt via gyro
      if (cardRef.current) {
        const cardRotateY = normX * 6
        const cardRotateX = -normY * 6
        cardRef.current.style.transition = 'transform 0.6s cubic-bezier(0.1, 1, 0.2, 1)'
        cardRef.current.style.transform = `rotateX(${cardRotateX}deg) rotateY(${cardRotateY}deg) scale3d(1, 1, 1)`
      }

      // Apply parallax via gyro
      if (imageRef.current) {
        imageRef.current.style.transition = 'transform 0.6s cubic-bezier(0.1, 1, 0.2, 1)'
        imageRef.current.style.transform = `translate(${normX * 8}px, ${normY * 8}px)`
      }
      if (cutoutRef.current) {
        cutoutRef.current.style.transition = 'transform 0.5s cubic-bezier(0.1, 1, 0.2, 1), filter 0.5s cubic-bezier(0.1, 1, 0.2, 1)'
        cutoutRef.current.style.transform = `translate(${normX * 24}px, ${normY * 24}px)`
        cutoutRef.current.style.filter = `drop-shadow(${-normX * 12}px ${-normY * 12}px 15px rgba(0,0,0,0.5))`
      }
      if (bubbleRef.current) {
        bubbleRef.current.style.transition = 'transform 0.5s cubic-bezier(0.1, 1, 0.2, 1)'
        bubbleRef.current.style.transform = `translate(${normX * 24}px, ${normY * 24}px)`
      }
    }

    const handleTouchStart = () => { isTouching.current = true }
    const handleTouchEnd = () => {
      setTimeout(() => { isTouching.current = false }, 400)
    }

    // Attach event listeners
    wrapper.addEventListener('mousemove', handlePointerMove)
    wrapper.addEventListener('mouseleave', handleMouseLeave)
    wrapper.addEventListener('touchmove', handlePointerMove, { passive: true })
    wrapper.addEventListener('touchstart', handleTouchStart, { passive: true })
    wrapper.addEventListener('touchend', handleTouchEnd, { passive: true })
    window.addEventListener('deviceorientation', handleDeviceOrientation)
    
    return () => {
      wrapper.removeEventListener('mousemove', handlePointerMove)
      wrapper.removeEventListener('mouseleave', handleMouseLeave)
      wrapper.removeEventListener('touchmove', handlePointerMove)
      wrapper.removeEventListener('touchstart', handleTouchStart)
      wrapper.removeEventListener('touchend', handleTouchEnd)
      window.removeEventListener('deviceorientation', handleDeviceOrientation)
    }
  }, [isOpen, spawnSplash])

  // NRP Hacker Roll-up Animation
  useEffect(() => {
    if (!isOpen) {
      return
    }

    const target = '5027251101'
    let frame = 0
    const totalFrames = 20
    let interval: ReturnType<typeof setInterval> | undefined

<<<<<<< HEAD
    const interval = setInterval(() => {
      frame++
      if (frame >= totalFrames) {
        setNrpText(target)
        clearInterval(interval)
        return
      }
      const progress = frame / totalFrames
      const revealed = Math.floor(progress * target.length)
      let text = ''
      
      for (let i = 0; i < target.length; i++) {
        if (i < revealed) text += target[i]
        else text += Math.floor(Math.random() * 10).toString()
      }
      setNrpText(text)
    }, 50)
=======
    const startFrame = requestAnimationFrame(() => {
      setNrpText('0000000000')
      setIsRevealed(true)

      interval = setInterval(() => {
        frame++
        if (frame >= totalFrames) {
          setNrpText(target)

          if (interval) {
            clearInterval(interval)
          }

          return
        }
        const progress = frame / totalFrames
        const revealed = Math.floor(progress * target.length)
        let text = ''
        for (let i = 0; i < target.length; i++) {
          if (i < revealed) {
            text += target[i]
          } else {
            text += Math.floor(Math.random() * 10).toString()
          }
        }
        setNrpText(text)
      }, 50)
    })
>>>>>>> e3a11db60a9839a167f348fea8a6d7063e6e5460

    return () => {
      cancelAnimationFrame(startFrame)

      if (interval) {
        clearInterval(interval)
      }
    }
  }, [isOpen])

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  if (!isOpen) return null

<<<<<<< HEAD
  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto px-4 pt-16 pb-8 sm:pt-32" onClick={() => setIsImageActive(prev => !prev)}>
      
      {/* Manga Artwork Backdrop */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-black">
        <Image src={CardBackgroundManga} alt="Backdrop" fill className="object-cover object-center opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black" />
      </div>

      <button
        type="button"
        aria-label="Close member detail"
        onClick={onClose}
        className="absolute inset-0 z-0"
=======
  return createPortal(
    // PADA BAGIAN INI KAMU BOLEH MENGUBAH STYLE SESUKA HATI KAMU, TAPI JANGAN UBAH STRUKTUR DAN FUNGSI DARI KODE INI AGAR FUNGSI POPUP TETAP BERJALAN DENGAN BAIK
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto px-4">
      <button
        type="button"
        aria-label="Close member detail"
        onClick={handleClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
>>>>>>> e3a11db60a9839a167f348fea8a6d7063e6e5460
      />

      <div ref={cardWrapperRef} className="relative z-10 flex w-full max-w-[720px] justify-center animate-[member-popup-show_200ms_ease-out]" style={{ perspective: '2000px' }}>
        
        {/* Invisible backplate to catch mouse events globally even during extreme 3D rotation */}
        <div className="absolute inset-0 z-0" style={{ background: 'rgba(0,0,0,0.001)' }} />
        <div
          ref={splashLayerRef}
          className="pointer-events-none absolute inset-0 z-[15] overflow-hidden rounded-2xl"
          aria-hidden="true"
        />

<<<<<<< HEAD
        {/* Main 3D Card Container */}
        <div 
          ref={cardRef} 
          onScroll={(e) => {
            // Determine if the scroll position pushes the text into the bright white area of the background gradient
            setIsTextInDarkArea(e.currentTarget.scrollTop > 150)
            
            if (cardsGridRef.current) {
              const containerRect = e.currentTarget.getBoundingClientRect()
              const cardsRect = cardsGridRef.current.getBoundingClientRect()
              const cardsCenter = cardsRect.top + cardsRect.height / 2
              const ratio = (cardsCenter - containerRect.top) / containerRect.height
              
              // Top info boxes turn dark-colored text slightly earlier
              setIsTopCardsInDarkArea(ratio < 0.75)
              // Bottom info box turns dark-colored text slightly later
              setIsCardInDarkArea(ratio < 0.6)
            }
          }} 
          className="border-neutral-cs-10 member-popup-font card-breathe card-tilt relative z-10 w-full max-h-[calc(100vh-6rem)] sm:max-h-[calc(100vh-9rem)] md:max-h-[calc(100vh-10rem)] overflow-y-auto overflow-x-hidden rounded-2xl border-2 text-white"
          style={{ backgroundImage: 'linear-gradient(to bottom, black 0%, black 25%, white 100%)' }}
        >

          {/* Manga Halftone Overlay (Independent Layer for texture) */}
          <div className="pointer-events-none absolute inset-0 z-0" style={{
            backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.8) 1.5px, transparent 2px)',
            backgroundSize: '10px 10px',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 45%, black 65%, transparent 85%)',
            maskImage: 'linear-gradient(to bottom, transparent 45%, black 65%, transparent 85%)'
          }} />
=======
        <div ref={cardRef} className="border-neutral-cs-10 bg-blue-cs-40 member-popup-font card-breathe card-tilt relative z-10 w-full max-h-[100dvh] overflow-y-auto overflow-x-hidden rounded-2xl border-2 p-6 text-white sm:p-8">
          {/* Cursor glow overlay */}
          <div ref={glowRef} className="pointer-events-none absolute inset-0 z-0 rounded-2xl" />

          <div className="hover-gradient-icon-circle absolute top-4 right-4 z-20 inline-flex magnetic-btn" onMouseMove={handleMagneticMove} onMouseLeave={handleMagneticLeave}>
            <button
              type="button"
              aria-label="Close member detail"
              onClick={handleClose}
              className="border-neutral-cs-10 hover:bg-neutral-cs-10/10 flex h-9 w-9 items-center justify-center rounded-full border text-xl leading-none"
            >
              x
            </button>
          </div>
>>>>>>> e3a11db60a9839a167f348fea8a6d7063e6e5460

          {/* === TOP SECTION (Image & Header) === */}
          <div className="relative z-[60] p-5 pb-0 sm:p-6 sm:pb-0 md:p-8 md:pb-0 rounded-t-2xl">
            {/* Close Button */}
            <div className="hover-gradient-icon-circle absolute top-4 right-4 z-20 inline-flex magnetic-btn" onMouseMove={handleMagneticMove} onMouseLeave={handleMagneticLeave}>
              <button
                type="button"
                aria-label="Close member detail"
                onClick={onClose}
                className="border-neutral-cs-10 hover:bg-neutral-cs-10/10 flex h-9 w-9 items-center justify-center rounded-full border text-xl leading-none"
              >
                x
              </button>
            </div>

            {/* Picture Parallax Viewport */}
            <div className={`mb-5 overflow-hidden rounded-2xl shadow-xl popup-reveal ${isRevealed ? 'popup-reveal-active' : ''}`} style={{ transitionDelay: '0ms' }}>
              <div className="relative h-[320px] sm:h-[480px]">
                
                {/* Background Base Layer */}
                <div className={`bg-zoom-wrapper ${isImageActive ? 'zoomed' : ''} absolute inset-0`}>
                  <div ref={imageRef} className="absolute -inset-10">
                    <Image src={ProfileBackground} alt="Background" className={`h-full w-full object-cover object-center transition-all duration-500 ${isImageActive ? 'grayscale-0 contrast-100 brightness-100' : 'grayscale contrast-110 brightness-90'}`} fill />
                  </div>
                </div>
                
                {/* Vignette Overlay for Depth */}
                <div className="pointer-events-none absolute inset-0 z-10" style={{
                  background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.5) 100%)',
                }} />
                
                {/* Cutout Layer (High Depth) */}
                <div className={`cutout-zoom-wrapper ${isImageActive ? 'zoomed' : ''} absolute inset-0 z-20`}>
                  <div ref={cutoutRef} className="absolute -inset-10" style={{ filter: 'drop-shadow(0px 8px 12px rgba(0,0,0,0.4))' }}>
                    <Image src={ProfileCutout} alt="Profile" className={`h-full w-full object-cover object-center transition-all duration-500 ${isImageActive ? 'grayscale-0 contrast-100 brightness-100' : 'grayscale contrast-110 brightness-100'}`} fill />
                  </div>
                </div>

                {/* Text Bubble Layer (Floating independent) */}
                <div ref={bubbleRef} className={`cutout-zoom-wrapper ${isImageActive ? 'zoomed' : ''} absolute inset-0 z-30 pointer-events-none`}>
                  <div className="absolute top-[15%] right-[5%] w-[40%] md:w-[35%] drop-shadow-2xl" style={{ animation: 'float 4s ease-in-out infinite' }}>
                    <Image src={TextBubble} alt="Text Bubble" className="w-full h-auto" />
                  </div>
                </div>

              </div>
            </div>

            {/* Profile Info Title */}
            <div ref={nameSectionRef} className={`pr-10 popup-reveal ${isRevealed ? 'popup-reveal-active' : ''}`} style={{ transitionDelay: '100ms' }}>
              <h2 className={`text-2xl font-black member-name-font drop-shadow-sm transition-colors duration-300 ${isTextInDarkArea ? 'text-white sm:text-white' : 'text-white sm:text-black'}`}>
                <a href="https://saktisadhana.github.io/" target="_blank" rel="noopener noreferrer" className={`hover-gradient-text hover:underline transition-colors duration-300 ${isTextInDarkArea ? 'text-white sm:text-white' : 'text-white sm:text-black'}`}>
                  Putu Putra <span className="gradient-text-eternal">Sakti</span> Sadhana
                </a>
              </h2>
              
              <p className={`mt-1 text-sm font-bold w-fit cursor-default drop-shadow-sm transition-colors duration-300 ${isTextInDarkArea ? 'text-white sm:text-white' : 'text-white sm:text-black'}`}>
                {nrpText} - Badung
              </p>
            </div>
          </div>

          {/* === BOTTOM SECTION (Details & Socials) === */}
          <div ref={bottomSectionRef} className="relative z-10 p-5 pt-0 sm:p-6 sm:pt-0 md:p-8 md:pt-0">

            <div className={`mt-5 flex gap-2 popup-reveal ${isRevealed ? 'popup-reveal-active' : ''}`} style={{ transitionDelay: '200ms' }}>
              <div className="hover-gradient-icon magnetic-btn" onMouseMove={handleMagneticMove} onMouseLeave={handleMagneticLeave}>
                <Instagram username="sakti.putu" />
              </div>
              <div className="hover-gradient-icon magnetic-btn" onMouseMove={handleMagneticMove} onMouseLeave={handleMagneticLeave}>
                <LinkedInButtonLink username="saktis" />
              </div>
            </div>

            <div ref={cardsGridRef} className={`mt-6 grid gap-4 sm:grid-cols-2 popup-reveal ${isRevealed ? 'popup-reveal-active' : ''}`} style={{ transitionDelay: '300ms' }}>
              {/* Info Box: Hobi */}
              <div className="info-box p-6" onMouseMove={handleInfoBoxMove}>
                <p className={`relative z-20 text-[10px] font-semibold tracking-widest uppercase mb-3 transition-colors duration-300 ${isTopCardsInDarkArea ? 'text-neutral-400' : 'text-neutral-500'}`} style={isTopCardsInDarkArea ? { textShadow: '0 1px 8px rgba(0,0,0,0.6)' } : {}}>Hobi</p>
                <p className={`relative z-20 text-base font-medium leading-relaxed transition-colors duration-300 ${isTopCardsInDarkArea ? 'text-white' : 'text-neutral-800'}`} style={isTopCardsInDarkArea ? { textShadow: '0 1px 8px rgba(0,0,0,0.6)' } : {}}>
                  <a href="https://myanimelist.net/profile/GRACINGZONE" target="_blank" rel="noopener noreferrer" className="hover-gradient-text hover:underline transition-colors">Nonton media</a>,{' '}
                  <a href="https://www.youtube.com/watch?v=fZ2pXyBBwsQ&list=RDfZ2pXyBBwsQ&start_radio=1" target="_blank" rel="noopener noreferrer" className="hover-gradient-text hover:underline transition-colors">dengerin lagu tapi lagu cringe</a>
                </p>
              </div>

              {/* Info Box: Fun Fact */}
              <div className="info-box p-6" onMouseMove={handleInfoBoxMove}>
                <p className={`relative z-20 text-[10px] font-semibold tracking-widest uppercase mb-3 transition-colors duration-300 ${isTopCardsInDarkArea ? 'text-neutral-400' : 'text-neutral-500'}`} style={isTopCardsInDarkArea ? { textShadow: '0 1px 8px rgba(0,0,0,0.6)' } : {}}>Fun Fact</p>
                <p className={`relative z-20 text-base font-medium leading-relaxed transition-colors duration-300 ${isTopCardsInDarkArea ? 'text-white' : 'text-neutral-800'}`} style={isTopCardsInDarkArea ? { textShadow: '0 1px 8px rgba(0,0,0,0.6)' } : {}}>
                  Professional Larper, deadliner handal.
                </p>
              </div>
            </div>

            <div className={`popup-reveal ${isRevealed ? 'popup-reveal-active' : ''}`} style={{ transitionDelay: '350ms' }}>
              {/* Info Box: Lagu Favorit */}
              <div className="info-box p-6" onMouseMove={handleInfoBoxMove}>
                <p className={`relative z-20 text-[10px] font-semibold tracking-widest uppercase mb-3 transition-colors duration-300 ${isCardInDarkArea ? 'text-neutral-400' : 'text-neutral-500'}`} style={isCardInDarkArea ? { textShadow: '0 1px 8px rgba(0,0,0,0.6)' } : {}}>Lagu Favorit</p>
                <p className={`relative z-20 text-base font-medium leading-relaxed mb-5 transition-colors duration-300 ${isCardInDarkArea ? 'text-white' : 'text-neutral-800'}`} style={isCardInDarkArea ? { textShadow: '0 1px 8px rgba(0,0,0,0.6)' } : {}}>
                  Color Your Night
                </p>

                <div 
                  onMouseEnter={(e) => handleEmbedHoverToggle(e, true)}
                  onMouseLeave={(e) => handleEmbedHoverToggle(e, false)}
                  onTouchStart={(e) => handleEmbedHoverToggle(e, true)}
                  onTouchEnd={(e) => handleEmbedHoverToggle(e, false)}
                  className="w-full relative z-20"
                >
                  <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/4pjFNyjGaoKgLTnndISP6V?si=6d9de41822ca4fc7" />
                </div>
              </div>
            </div>

          </div>

          {/* === CSS STYLES === */}
          <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Workbench&family=SUSE+Mono:wght@100..800&display=swap');
            
            .member-popup-font { font-family: 'SUSE Mono', monospace; }
            .member-name-font { font-family: 'Workbench', sans-serif; }
            
            @keyframes gradientCycle {
              0% { background-position: 0% 50%; }
              100% { background-position: 200% 50%; }
            }
            
            .hover-gradient-text { transition: all 0.3s ease; }
            .hover-gradient-text:hover, .gradient-text-eternal {
              color: transparent !important;
              background-image: linear-gradient(to right, #34d399, #10b981, #34d399);
              background-size: 200% auto;
              -webkit-background-clip: text;
              background-clip: text;
              animation: gradientCycle 3s linear infinite;
            }
            
            .hover-gradient-icon {
              position: relative;
              transition: all 0.3s ease;
            }
            .hover-gradient-icon-circle {
              transition: all 0.3s ease;
            }
            .hover-gradient-icon { border-radius: 0.75rem; padding: 4px; }
            .hover-gradient-icon-circle { border-radius: 9999px; padding: 4px; }
            
            .hover-gradient-icon::before, .hover-gradient-icon-circle::before {
              content: '';
              position: absolute;
              inset: 0;
              pointer-events: none;
              padding: 2px;
              background: linear-gradient(to right, #55FFEA, #44ef6c, #55FFEA);
              background-size: 200% auto;
              -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
              mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
              -webkit-mask-composite: xor;
              mask-composite: exclude;
              opacity: 0;
              transition: opacity 0.3s ease;
            }
            .hover-gradient-icon::before { border-radius: 0.75rem; }
            .hover-gradient-icon-circle::before { border-radius: 9999px; }
            
            .hover-gradient-icon:hover::before, .hover-gradient-icon-circle:hover::before {
              opacity: 1;
              animation: gradientCycle 3s linear infinite;
            }
            .hover-gradient-icon:hover, .hover-gradient-icon-circle:hover {
              filter: drop-shadow(0 0 6px #55FFEA80) drop-shadow(0 0 6px #44ef6c80);
            }
            
            .paint-splash {
              position: absolute;
              pointer-events: none;
              opacity: 0.4;
              contain: paint;
              transition: transform 1.2s cubic-bezier(0.22, 1, 0.36, 1), opacity 1.2s ease-out;
              filter: blur(2px);
              mix-blend-mode: screen;
              will-change: transform, opacity;
            }
            
            .popup-reveal {
              opacity: 0;
              transform: translateY(20px);
              transition: opacity 0.5s ease-out, transform 0.5s ease-out;
            }
            .popup-reveal-active {
              opacity: 1;
              transform: translateY(0);
            }
            
            .card-tilt { transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1); }
            
            @keyframes breathe {
              0% { box-shadow: 0 0 15px rgba(85, 255, 234, 0.1), 0 0 30px rgba(68, 239, 108, 0.05); }
              50% { box-shadow: 0 0 25px rgba(85, 255, 234, 0.3), 0 0 50px rgba(68, 239, 108, 0.15); }
              100% { box-shadow: 0 0 15px rgba(85, 255, 234, 0.1), 0 0 30px rgba(68, 239, 108, 0.05); }
            }
<<<<<<< HEAD
            .card-breathe { transition: box-shadow 0.5s ease; }
            .card-breathe:hover { animation: breathe 4s infinite ease-in-out; }
            
            @keyframes float {
              0%, 100% { transform: translateY(0px) rotate(0deg); }
              50% { transform: translateY(-10px) rotate(2deg); }
            }
            
            .magnetic-btn { transition: transform 0.2s cubic-bezier(0.25, 1, 0.5, 1); }
            
            .bg-zoom-wrapper, .cutout-zoom-wrapper { transition: transform 0.8s ease-out; transform: scale(1); }
            .bg-zoom-wrapper.zoomed { transform: scale(1.08); }
            .cutout-zoom-wrapper.zoomed { transform: scale(1.12); }
            
=======
            .card-breathe {
              transition: box-shadow 0.5s ease;
              animation: breathe 4s infinite ease-in-out;
            }
            /* Magnetic Buttons */
            .magnetic-btn {
              transition: transform 0.2s cubic-bezier(0.25, 1, 0.5, 1);
            }
            /* Image zoom entrance animation */
            .image-zoom-wrapper {
              transform: scale(1);
              transition: transform 0.8s ease-out;
            }
            .image-zoom-wrapper.zoomed {
              transform: scale(1.05);
            }
            /* Info box hover effects */
>>>>>>> e3a11db60a9839a167f348fea8a6d7063e6e5460
            .info-box {
              position: relative;
              overflow: hidden;
              background: transparent;
              color: #171717;
              border: 1px solid rgba(0,0,0,0.1);
              transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1), border-color 0.4s ease, box-shadow 0.4s ease;
              cursor: default;
              border-radius: 1rem;
            }
            .info-box::after {
              content: '';
              position: absolute;
              inset: 0;
              opacity: 0;
              transition: opacity 0.4s ease;
              background: radial-gradient(300px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(16, 185, 129, 0.15), transparent 80%);
              pointer-events: none;
              z-index: 0;
            }
            .info-box:hover::after { opacity: 1; }
            .info-box.hide-glow::after { opacity: 0 !important; }
            .info-box:hover {
              transform: translateY(-4px);
              border-color: rgba(16, 185, 129, 0.5);
              box-shadow: 0 12px 32px rgba(16, 185, 129, 0.1);
            }
          `}</style>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default MemberPopup
