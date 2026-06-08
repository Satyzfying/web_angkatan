'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import Image from 'next/image'

import Instagram from '@/components/atoms/button/InstagramButtonLink'
import LinkedInButtonLink from '@/components/atoms/button/LinkedInButtonLink'
import SpotifyEmbed from '@/components/molecules/SpotifyEmbed'

import ProfileBackground from './Assets/background.png'
import ProfileCutout from './Assets/profile.png'
import TextBubble from './Assets/text bubble.png'
import CardBackgroundManga from './Assets/background_manga.png'

type MemberPopupProps = {
  isOpen: boolean
  onClose: () => void
}

const MemberPopup = ({ isOpen, onClose }: MemberPopupProps) => {
  const cardWrapperRef = useRef<HTMLDivElement>(null)
  const splashLayerRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const cutoutRef = useRef<HTMLDivElement>(null)
  const bubbleRef = useRef<HTMLDivElement>(null)
  const lastSplashTime = useRef(0)
  const isTouching = useRef(false)

  const [nrpText, setNrpText] = useState('0000000000')
  const [isRevealed, setIsRevealed] = useState(false)
  const [isImageActive, setIsImageActive] = useState(true)

  const handleClose = useCallback(() => {
    setNrpText('0000000000')
    setIsRevealed(false)
    setIsImageActive(true)
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

  const handleMagneticMove = useCallback((event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    const element = event.currentTarget
    const rect = element.getBoundingClientRect()

    let clientX: number
    let clientY: number

    if ('touches' in event) {
      if (event.touches.length === 0) {
        return
      }

      clientX = event.touches[0].clientX
      clientY = event.touches[0].clientY
    } else {
      clientX = event.clientX
      clientY = event.clientY
    }

    const x = clientX - rect.left - rect.width / 2
    const y = clientY - rect.top - rect.height / 2
    element.style.transform = `translate(${x * 0.4}px, ${y * 0.4}px)`
  }, [])

  const handleMagneticLeave = useCallback((event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    event.currentTarget.style.transform = 'translate(0px, 0px)'
  }, [])

  const handleInfoBoxMove = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty('--mouse-x', `${event.clientX - rect.left}px`)
    event.currentTarget.style.setProperty('--mouse-y', `${event.clientY - rect.top}px`)
  }, [])

  const handleEmbedHoverToggle = useCallback((event: React.SyntheticEvent, isHovered: boolean) => {
    const infoBox = event.currentTarget.closest('.info-box')

    if (!infoBox) {
      return
    }

    if (isHovered) {
      infoBox.classList.add('hide-glow')
      return
    }

    infoBox.classList.remove('hide-glow')
  }, [])

  const spawnSplash = useCallback((x: number, y: number) => {
    const container = splashLayerRef.current
    if (!container) return

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

  useEffect(() => {
    if (!isOpen) return

    const wrapper = cardWrapperRef.current
    const card = cardRef.current
    if (!wrapper || !card) return

    const resetTransforms = () => {
      card.style.transition = 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)'
      card.style.transform = 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'

      for (const element of [imageRef.current, cutoutRef.current, bubbleRef.current]) {
        if (!element) {
          continue
        }

        element.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), filter 0.5s cubic-bezier(0.25, 1, 0.5, 1)'
        element.style.transform = 'translate(0, 0)'
      }

      if (cutoutRef.current) {
        cutoutRef.current.style.filter = 'drop-shadow(0px 8px 12px rgba(0,0,0,0.4))'
      }
    }

    const handlePointerMove = (event: MouseEvent | TouchEvent) => {
      const rect = wrapper.getBoundingClientRect()
      let clientX: number
      let clientY: number

      if ('touches' in event) {
        if (event.touches.length === 0) {
          return
        }

        clientX = event.touches[0].clientX
        clientY = event.touches[0].clientY
      } else {
        clientX = event.clientX
        clientY = event.clientY
      }

      const x = clientX - rect.left
      const y = clientY - rect.top
      const cardCenterX = rect.width / 2
      const cardCenterY = rect.height / 2
      const normX = (x - cardCenterX) / cardCenterX
      const normY = (y - cardCenterY) / cardCenterY

      if (!('touches' in event)) {
        const rotateY = normX * 3
        const rotateX = -normY * 3

        card.style.transition = 'transform 0.1s ease-out'
        card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1, 1, 1)`

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

        if (y >= rect.height * 0.42) {
          spawnSplash(x, y)
        }
      }
    }

    const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
      if (isTouching.current) return
      if (!window.matchMedia('(any-pointer: coarse)').matches) return
      if (event.beta === null || event.gamma === null) return

      let normX = event.gamma / 30
      let normY = (event.beta - 60) / 30

      normX = Math.max(-1.5, Math.min(1.5, normX))
      normY = Math.max(-1.5, Math.min(1.5, normY))

      card.style.transition = 'transform 0.6s cubic-bezier(0.1, 1, 0.2, 1)'
      card.style.transform = `rotateX(${-normY * 6}deg) rotateY(${normX * 6}deg) scale3d(1, 1, 1)`

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

    const handleTouchStart = () => {
      isTouching.current = true
    }

    const handleTouchEnd = () => {
      setTimeout(() => {
        isTouching.current = false
      }, 400)
    }

    wrapper.addEventListener('mousemove', handlePointerMove)
    wrapper.addEventListener('mouseleave', resetTransforms)
    wrapper.addEventListener('touchmove', handlePointerMove, { passive: true })
    wrapper.addEventListener('touchstart', handleTouchStart, { passive: true })
    wrapper.addEventListener('touchend', handleTouchEnd, { passive: true })
    window.addEventListener('deviceorientation', handleDeviceOrientation)

    return () => {
      wrapper.removeEventListener('mousemove', handlePointerMove)
      wrapper.removeEventListener('mouseleave', resetTransforms)
      wrapper.removeEventListener('touchmove', handlePointerMove)
      wrapper.removeEventListener('touchstart', handleTouchStart)
      wrapper.removeEventListener('touchend', handleTouchEnd)
      window.removeEventListener('deviceorientation', handleDeviceOrientation)
      resetTransforms()
    }
  }, [isOpen, spawnSplash])

  useEffect(() => {
    if (!isOpen) return

    const target = '5027251101'
    let frame = 0
    const totalFrames = 20
    let interval: ReturnType<typeof setInterval> | undefined

    const startFrame = requestAnimationFrame(() => {
      setNrpText('0000000000')
      setIsImageActive(true)
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

        for (let index = 0; index < target.length; index++) {
          if (index < revealed) {
            text += target[index]
          } else {
            text += Math.floor(Math.random() * 10).toString()
          }
        }

        setNrpText(text)
      }, 50)
    })

    return () => {
      cancelAnimationFrame(startFrame)
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [isOpen])

  if (!isOpen) {
    return null
  }

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto px-4 py-5">
      <div className="pointer-events-none absolute inset-0 bg-black">
        <Image
          src={CardBackgroundManga}
          alt="Backdrop"
          fill
          sizes="100vw"
          className="object-cover object-center opacity-35"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.72),rgba(2,6,23,0.9))]" />
      </div>

      <button
        type="button"
        aria-label="Close member detail"
        onClick={handleClose}
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at top, rgba(85,255,234,0.08), transparent 24%), linear-gradient(180deg, rgba(8,10,18,0.48), rgba(8,10,18,0.8))',
          backdropFilter: 'blur(8px)',
        }}
      />

      <div
        ref={cardWrapperRef}
        className="relative z-10 flex w-full max-w-[860px] justify-center animate-[member-popup-show_200ms_ease-out]"
        style={{ perspective: '2000px' }}
      >
        <div
          ref={splashLayerRef}
          className="pointer-events-none absolute inset-0 z-[15] overflow-hidden rounded-[12px]"
          aria-hidden="true"
        />

        <div className="absolute inset-0 z-0 rounded-[12px]" style={{ background: 'rgba(0,0,0,0.001)' }} />

        <div
          ref={cardRef}
          className="member-popup-font card-breathe card-tilt relative z-10 h-[100dvh] max-h-[100dvh] w-full overflow-y-auto overscroll-contain rounded-[12px] border-[5px] border-white bg-[#04122d]/92 p-4 text-white shadow-[10px_10px_0_#ffffff,22px_22px_0_rgba(0,0,0,0.18)] backdrop-blur-sm sm:p-6"
        >
          <div
            className="hover-gradient-icon-circle absolute top-4 right-4 z-20 inline-flex magnetic-btn"
            onMouseMove={handleMagneticMove}
            onMouseLeave={handleMagneticLeave}
            onTouchMove={handleMagneticMove}
            onTouchEnd={handleMagneticLeave}
          >
            <button
              type="button"
              aria-label="Close member detail"
              onClick={handleClose}
              className="border-neutral-cs-10 hover:bg-neutral-cs-10/10 flex h-9 w-9 items-center justify-center rounded-full border bg-[#04122d]/80 text-xl leading-none"
            >
              x
            </button>
          </div>

          <div className={`overflow-hidden rounded-2xl border border-white/20 popup-reveal ${isRevealed ? 'popup-reveal-active' : ''}`}>
            <button
              type="button"
              onClick={() => setIsImageActive((previous) => !previous)}
              className="relative block h-96 w-full overflow-hidden bg-black text-left sm:h-[460px]"
            >
              <div className={`bg-zoom-wrapper absolute inset-0 ${isImageActive ? 'zoomed' : ''}`}>
                <div ref={imageRef} className="absolute -inset-8">
                  <Image
                    src={ProfileBackground}
                    alt="Background artwork"
                    fill
                    sizes="(min-width: 640px) 812px, 100vw"
                    className={`object-cover object-center transition-all duration-500 ${isImageActive ? 'grayscale-0 contrast-100 brightness-100' : 'grayscale contrast-110 brightness-90'}`}
                  />
                </div>
              </div>

              <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_center,transparent_28%,rgba(0,0,0,0.52)_100%)]" />

              <div className={`cutout-zoom-wrapper absolute inset-0 z-20 ${isImageActive ? 'zoomed' : ''}`}>
                <div ref={cutoutRef} className="absolute -inset-8" style={{ filter: 'drop-shadow(0px 8px 12px rgba(0,0,0,0.4))' }}>
                  <Image
                    src={ProfileCutout}
                    alt="Profile artwork"
                    fill
                    sizes="(min-width: 640px) 812px, 100vw"
                    className={`object-cover object-center transition-all duration-500 ${isImageActive ? 'grayscale-0 contrast-100 brightness-100' : 'grayscale contrast-110 brightness-100'}`}
                  />
                </div>
              </div>

              <div ref={bubbleRef} className={`cutout-zoom-wrapper pointer-events-none absolute inset-0 z-30 ${isImageActive ? 'zoomed' : ''}`}>
                <div className="absolute top-[15%] right-[5%] w-[40%] drop-shadow-2xl md:w-[35%]" style={{ animation: 'float 4s ease-in-out infinite' }}>
                  <Image src={TextBubble} alt="Text bubble" className="h-auto w-full" />
                </div>
              </div>
            </button>
          </div>

          <div className={`mt-5 pr-10 popup-reveal ${isRevealed ? 'popup-reveal-active' : ''}`} style={{ transitionDelay: '100ms' }}>
            <h2 className="member-name-font text-2xl font-black">
              <a
                href="https://saktisadhana.github.io/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover-gradient-text hover:underline"
              >
                Putu Putra <span className="gradient-text-eternal">Sakti</span> Sadhana
              </a>
            </h2>
            <p className="gradient-text-eternal mt-1 w-fit cursor-default text-sm font-semibold">{nrpText} - Badung</p>
          </div>

          <div className={`mt-5 flex gap-2 popup-reveal ${isRevealed ? 'popup-reveal-active' : ''}`} style={{ transitionDelay: '200ms' }}>
            <div className="hover-gradient-icon magnetic-btn" onMouseMove={handleMagneticMove} onMouseLeave={handleMagneticLeave}>
              <Instagram username="sakti.putu" />
            </div>
            <div className="hover-gradient-icon magnetic-btn" onMouseMove={handleMagneticMove} onMouseLeave={handleMagneticLeave}>
              <LinkedInButtonLink username="saktis" />
            </div>
          </div>

          <div
            className={`mt-6 grid gap-4 text-sm font-semibold sm:grid-cols-2 popup-reveal ${isRevealed ? 'popup-reveal-active' : ''}`}
            style={{ transitionDelay: '300ms' }}
          >
            <div className="info-box rounded-xl border border-white/20 p-4" onMouseMove={handleInfoBoxMove}>
              <p className="text-neutral-cs-10/60 text-xs tracking-wide uppercase">Hobi</p>
              <p className="mt-2">
                <a
                  href="https://myanimelist.net/profile/GRACINGZONE"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover-gradient-text hover:underline"
                >
                  Nonton media
                </a>
                ,{' '}
                <a
                  href="https://www.youtube.com/watch?v=fZ2pXyBBwsQ&list=RDfZ2pXyBBwsQ&start_radio=1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover-gradient-text hover:underline"
                >
                  dengerin lagu tapi lagu cringe
                </a>
              </p>
            </div>

            <div className="info-box rounded-xl border border-white/20 p-4" onMouseMove={handleInfoBoxMove}>
              <p className="text-neutral-cs-10/60 text-xs tracking-wide uppercase">Fun Fact</p>
              <p className="mt-2">Professional Larper, deadliner handal.</p>
            </div>
          </div>

          <div className={`popup-reveal ${isRevealed ? 'popup-reveal-active' : ''}`} style={{ transitionDelay: '350ms' }}>
            <div className="info-box mt-4 rounded-xl border border-white/20 p-4" onMouseMove={handleInfoBoxMove}>
              <p className="text-neutral-cs-10/60 text-xs font-bold tracking-wide uppercase">Lagu Favorit</p>
              <p className="my-2 text-sm font-semibold">Color Your Night</p>

              <div
                onMouseEnter={(event) => handleEmbedHoverToggle(event, true)}
                onMouseLeave={(event) => handleEmbedHoverToggle(event, false)}
                onTouchStart={(event) => handleEmbedHoverToggle(event, true)}
                onTouchEnd={(event) => handleEmbedHoverToggle(event, false)}
                className="relative z-20 w-full"
              >
                <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/4pjFNyjGaoKgLTnndISP6V?si=6d9de41822ca4fc7" />
              </div>
            </div>
          </div>

          <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Workbench&family=SUSE+Mono:wght@100..800&display=swap');

            .member-popup-font {
              font-family: 'SUSE Mono', monospace;
            }

            .member-name-font {
              font-family: 'Workbench', sans-serif;
            }

            @keyframes gradientCycle {
              0% {
                background-position: 0% 50%;
              }
              100% {
                background-position: 200% 50%;
              }
            }

            @keyframes breathe {
              0% {
                box-shadow: 0 0 15px rgba(85, 255, 234, 0.1), 0 0 30px rgba(68, 239, 108, 0.05);
              }
              50% {
                box-shadow: 0 0 25px rgba(85, 255, 234, 0.3), 0 0 50px rgba(68, 239, 108, 0.15);
              }
              100% {
                box-shadow: 0 0 15px rgba(85, 255, 234, 0.1), 0 0 30px rgba(68, 239, 108, 0.05);
              }
            }

            @keyframes float {
              0%,
              100% {
                transform: translateY(0px) rotate(0deg);
              }
              50% {
                transform: translateY(-10px) rotate(2deg);
              }
            }

            .hover-gradient-text {
              transition: all 0.3s ease;
            }

            .hover-gradient-text:hover,
            .gradient-text-eternal {
              color: transparent !important;
              background-image: linear-gradient(to right, #55ffea, #44ef6c, #55ffea);
              background-size: 200% auto;
              -webkit-background-clip: text;
              background-clip: text;
              animation: gradientCycle 3s linear infinite;
            }

            .hover-gradient-icon,
            .hover-gradient-icon-circle {
              position: relative;
              transition: all 0.3s ease;
            }

            .hover-gradient-icon {
              border-radius: 0.75rem;
              padding: 4px;
            }

            .hover-gradient-icon-circle {
              border-radius: 9999px;
              padding: 4px;
            }

            .hover-gradient-icon::before,
            .hover-gradient-icon-circle::before {
              content: '';
              position: absolute;
              inset: 0;
              pointer-events: none;
              padding: 2px;
              background: linear-gradient(to right, #55ffea, #44ef6c, #55ffea);
              background-size: 200% auto;
              -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
              mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
              -webkit-mask-composite: xor;
              mask-composite: exclude;
              opacity: 0;
              transition: opacity 0.3s ease;
            }

            .hover-gradient-icon::before {
              border-radius: 0.75rem;
            }

            .hover-gradient-icon-circle::before {
              border-radius: 9999px;
            }

            .hover-gradient-icon:hover::before,
            .hover-gradient-icon-circle:hover::before {
              opacity: 1;
              animation: gradientCycle 3s linear infinite;
            }

            .hover-gradient-icon:hover,
            .hover-gradient-icon-circle:hover {
              filter: drop-shadow(0 0 6px #55ffea80) drop-shadow(0 0 6px #44ef6c80);
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

            .card-tilt {
              transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1);
            }

            .card-breathe {
              transition: box-shadow 0.5s ease;
              animation: breathe 4s infinite ease-in-out;
            }

            .magnetic-btn {
              transition: transform 0.2s cubic-bezier(0.25, 1, 0.5, 1);
            }

            .bg-zoom-wrapper,
            .cutout-zoom-wrapper {
              transform: scale(1);
              transition: transform 0.8s ease-out;
            }

            .bg-zoom-wrapper.zoomed {
              transform: scale(1.08);
            }

            .cutout-zoom-wrapper.zoomed {
              transform: scale(1.12);
            }

            .info-box {
              position: relative;
              overflow: hidden;
              background: rgba(4, 18, 45, 0.55);
              backdrop-filter: blur(8px);
              transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
              cursor: default;
            }

            .info-box::after {
              content: '';
              position: absolute;
              inset: 0;
              opacity: 0;
              transition: opacity 0.3s ease;
              background: radial-gradient(
                300px circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
                rgba(85, 255, 234, 0.12),
                transparent 60%
              );
              pointer-events: none;
            }

            .info-box:hover::after {
              opacity: 1;
            }

            .info-box.hide-glow::after {
              opacity: 0 !important;
            }

            .info-box:hover {
              transform: translateY(-3px);
              border-color: rgba(85, 255, 234, 0.4);
              box-shadow: 0 8px 25px rgba(85, 255, 234, 0.1), 0 4px 10px rgba(68, 239, 108, 0.08);
            }
          `}</style>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default MemberPopup
