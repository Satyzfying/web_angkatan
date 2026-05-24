'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import HeroLogo from '@/assets/images/homepage/hero-logo.png'

const Hero = () => {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.error("Autoplay prevented:", error)
      })
    }
  }, [])

  return (
    <section
      id="hero"
      /* PERBAIKAN: Gunakan relative tanpa z-0 agar tidak membuat stacking context baru yang mengunci z-negatif */
      className="relative flex w-full items-center justify-center overflow-hidden bg-[#0B1E38] text-neutral-cs-10"
    >
      {/* 1. LAYER VIDEO: Paling bawah tapi tetap terlihat */}
      <video
        ref={videoRef}
        /* PERBAIKAN: Gunakan z-0 dan pastikan container utama tidak menindihnya */
        className="absolute inset-0 z-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      >
        <source src="/assets/videos/starrynight.mp4" type="video/mp4" />
      </video>

      {/* 2. LAYER OVERLAY: Di atas video (z-10) */}
      <div 
        className="absolute inset-0 z-10 bg-gradient-to-b from-[#173679]/20 to-[#0B1E38]" 
        aria-hidden="true" 
      />
      
      {/* 3. LAYER KONTEN: Paling atas (z-20) */}
      <div className="relative z-20 flex min-h-[640px] w-full max-w-[1260px] flex-col items-center gap-10 px-6 py-24 text-center sm:px-10 lg:min-h-[916px] lg:gap-[52px] lg:px-[90px] lg:py-[136px]">
        <div className="flex flex-col items-center gap-2">
          <Image
            src={HeroLogo}
            alt="Evastra logo"
            width={514}
            height={393}
            className="h-auto w-[220px] sm:w-[320px] lg:w-[514px]"
            priority
          />
          <p className="max-w-[800px] text-lg font-bold leading-8 sm:text-xl lg:text-[28px] lg:leading-[32px]">
            Welcome to A Space to Grow Together.
          </p>
        </div>
        
        <a
          href="#about-us"
          className="inline-flex h-[57px] w-[164px] items-center justify-center rounded-full border-2 border-neutral-cs-10 text-base font-semibold leading-6 text-neutral-cs-10 transition hover:bg-neutral-cs-10/10 sm:text-lg lg:text-lg"
        >
          Explore
        </a>
      </div>
    </section>
  )
}

export default Hero