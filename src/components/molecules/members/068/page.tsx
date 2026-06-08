'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import MemberPopup from '@/components/molecules/members/068/MemberPopup'

export default function Page() {
  const [isOpen, setIsOpen] = useState(true)
  const router = useRouter()

  const handleClose = () => {
    router.push('/members')
  }

  return (
    <main
      className="relative min-h-screen flex items-center justify-center overflow-hidden pixel-stars"
      style={{ background: '#0a0a0a' }}
    >
      {/* Pixel scanline overlay */}
      <div className="pointer-events-none fixed inset-0 z-0 scanlines" aria-hidden="true" />

      {/* CRT vignette */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{ background: 'radial-gradient(ellipse 90% 80% at 50% 50%, transparent 55%, rgba(0,0,0,0.75) 100%)' }}
        aria-hidden="true"
      />

      {/* Score HUD */}
      <div className="fixed top-0 left-0 right-0 z-10 flex justify-between items-start px-4 pt-3 pb-2 select-none" aria-hidden="true">
        <div className="flex flex-col leading-tight">
          <span className="font-pixel text-[7px] text-[#00E5FF]">1UP</span>
          <span className="font-pixel text-[9px] text-white">068000</span>
        </div>
        <div className="flex flex-col items-center leading-tight">
          <span className="font-pixel text-[7px] text-[#FF6EB4]">HI-SCORE</span>
          <span className="font-pixel text-[9px] text-white">999999</span>
        </div>
        <div className="flex flex-col items-end leading-tight">
          <span className="font-pixel text-[7px] text-[#39FF14]">CREDITS</span>
          <span className="font-pixel text-[9px] text-white">02</span>
        </div>
      </div>

      {/* Re-open button */}
      {!isOpen && (
        <div className="relative z-10 flex flex-col items-center gap-6">
          <h1 className="font-pixel text-[12px] leading-loose text-[#FF6EB4] text-glow-pink text-center">
            PLAYER 068
          </h1>
          <button
            onClick={() => setIsOpen(true)}
            className="font-pixel text-[9px] text-black bg-[#FF6EB4] px-6 py-3 border-2 border-[#FF6EB4] shadow-[4px_4px_0_0_#00E5FF] hover:shadow-[2px_2px_0_0_#00E5FF] hover:translate-x-[2px] hover:translate-y-[2px] transition-all active:shadow-none active:translate-x-1 active:translate-y-1 uppercase tracking-wider"
          >
            PRESS START
          </button>
          <div className="flex gap-1.5 mt-1" aria-hidden="true">
            {[...Array(3)].map((_, i) => (
              <span key={i} className="font-pixel text-[7px] text-[#39FF14] blink" style={{ animationDelay: `${i * 0.3}s` }}>*</span>
            ))}
          </div>
        </div>
      )}

      <MemberPopup isOpen={isOpen} onClose={handleClose} />
    </main>
  )
}
