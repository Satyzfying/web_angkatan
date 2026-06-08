'use client'

import { useEffect, useRef } from 'react'

import { getTextStrokeStyle } from '@/lib/textStroke'

import MenfessForm from '@/components/molecules/MenfessForm'

const Hero = () => {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.error('Autoplay prevented:', error)
      })
    }
  }, [])

  return (
    <section
      id="hero"
      className="bg-blue-cs-40 text-neutral-cs-10 relative flex w-full items-center justify-center overflow-hidden pt-36 md:pt-16"
    >
      {/* 1. LAYER VIDEO: Tanpa z-index (Otomatis paling bawah) */}
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      >
        <source src="/assets/videos/starrynight.mp4" type="video/mp4" />
      </video>

      {/* 2. LAYER OVERLAY: Tanpa z-index (Otomatis di atas video berdasarkan DOM) */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B1E38] to-[#173679]/40" aria-hidden="true" />

      {/* 3. LAYER KONTEN: Cukup z-10 agar di atas background, sangat aman untuk Navbar */}
      <div className="relative z-10 flex min-h-[640px] w-full max-w-[1260px] flex-col items-center gap-10 py-12 text-center lg:min-h-[700px] lg:gap-[52px] lg:py-[136px] 2xl:min-h-[716px]">
        <div className="flex flex-col items-center gap-2 px-11 sm:px-10 lg:px-[90px]">
          {/* =< 768px */}
          <h2
            className="font-rubikone text-blue-cs-30 relative z-10 block text-[48px] leading-[60px] sm:text-[64px] sm:leading-[68px] lg:hidden"
            style={getTextStrokeStyle({ color: '#ffffff', width: 4 })}
          >
            MENFESS
          </h2>

          {/* >= 768px */}
          <h2
            className="font-rubikone text-blue-cs-30 relative z-10 hidden lg:block lg:text-[88px] lg:leading-[112px]"
            style={getTextStrokeStyle({ color: '#ffffff', width: 9 })}
          >
            MENFESS
          </h2>
          <p className="max-w-[800px] text-lg leading-8 font-semibold sm:text-xl lg:text-[28px] lg:leading-[32px]">
            Share your thoughts and feelings with us.
          </p>
        </div>

        <div className="w-full max-w-[1200px]">
          <MenfessForm />
        </div>
      </div>
    </section>
  )
}

export default Hero
