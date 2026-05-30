'use client'
import React, { useState } from 'react'

const colorData = [
  { id: 1, name: 'Star Sapphire', meaning: 'Kepercayaan', bgClass: 'bg-blue-cs-30', textClass: 'text-white' },
  { id: 2, name: 'Nature Blue', meaning: 'Keterbukaan', bgClass: 'bg-blue-cs-20', textClass: 'text-white' },
  { id: 3, name: 'Scintillating Turquoise', meaning: 'Ketenangan', bgClass: 'bg-blue-cs-10', textClass: 'text-white' },
  {
    id: 4,
    name: 'Light Gold Matte',
    meaning: 'Optimisme dan Harapan',
    bgClass: 'bg-yellow-cs-20',
    textClass: 'text-white'
  },
  { id: 5, name: 'Dixie', meaning: 'Semangat dan kehangatan', bgClass: 'bg-yellow-cs-40', textClass: 'text-white' },
  { id: 6, name: 'Chosen Blue', meaning: 'Keteguhan', bgClass: 'bg-blue-cs-40', textClass: 'text-white' }
]

const ColorPallete = () => {
  const [activeId, setActiveId] = useState<number | null>(colorData[0].id)

  const totalItems = colorData.length
  const wActive = 60
  const wInactive = 8
  const wDefault = 100 / totalItems

  return (
    <section className="flex w-full flex-col items-center px-4 py-16">
      <h2 className="font-rubikone relative z-10 mb-12 text-center text-3xl text-white md:text-5xl">Color Pallete</h2>

      <div
        className="bg-neutral-cs-100 relative isolate flex h-[600px] w-full max-w-[300px] transform-gpu cursor-pointer overflow-hidden rounded-[30px] shadow-none md:h-[400px] md:max-w-5xl md:rounded-[40px]"
        style={{ WebkitMaskImage: '-webkit-radial-gradient(white, black)' }}
      >
        {colorData.map((color, i) => {
          const isActive = activeId === color.id
          const isDefault = activeId === null

          const activeIndex = activeId ? colorData.findIndex((c) => c.id === activeId) : -1

          let leftVal = 0
          let topVal = 0
          let wVisibleSize = 0

          if (isDefault) {
            leftVal = i * wDefault
            topVal = i * wDefault
            wVisibleSize = wDefault
          } else {
            leftVal = i <= activeIndex ? i * wInactive : wActive + (i - 1) * wInactive
            topVal = i <= activeIndex ? i * wInactive : wActive + (i - 1) * wInactive
            wVisibleSize = isActive ? wActive : wInactive
          }

          const isLast = i === totalItems - 1

          return (
            <div
              key={color.id}
              onClick={() => setActiveId(isActive ? null : color.id)}
              className={`absolute top-[var(--mobile-pos)] left-0 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] md:top-0 md:left-[var(--desktop-pos)] ${
                isLast
                  ? 'h-[calc(100%-var(--mobile-pos))] w-full md:h-full md:w-[calc(100%-var(--desktop-pos))]'
                  : 'h-[calc(var(--mobile-size)+80px)] w-full md:h-full md:w-[calc(var(--desktop-size)+80px)]'
              } ${color.bgClass} ${color.textClass} ${i === 0 || isDefault ? 'rounded-none' : 'rounded-t-[30px] shadow-[0_-5px_15px_rgba(0,0,0,0.1)] md:rounded-t-none md:rounded-l-[40px] md:shadow-[-10px_0_20px_rgba(0,0,0,0.1)]'} `}
              style={
                {
                  zIndex: i + 1,
                  '--mobile-pos': `${topVal}%`,
                  '--desktop-pos': `${leftVal}%`,
                  '--mobile-size': `${wVisibleSize}%`,
                  '--desktop-size': `${wVisibleSize}%`
                } as React.CSSProperties
              }
            >
              <div
                className={`absolute top-0 left-0 flex w-full items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] ${isLast ? 'h-full' : 'h-[calc(100%-80px)]'} md:h-full ${isLast ? 'md:w-full' : 'md:w-[calc(100%-80px)]'} `}
              >
                <span
                  className={`absolute origin-center text-sm font-bold tracking-widest whitespace-nowrap transition-all duration-500 md:-rotate-90 md:transform md:text-lg ${isActive ? 'pointer-events-none scale-90 opacity-0' : 'scale-100 opacity-100 delay-200'} `}
                >
                  {color.name}
                </span>

                <div
                  className={`pointer-events-none absolute inset-0 flex h-full w-full flex-col items-center justify-center px-6 text-center transition-all duration-500 md:px-12 ${isActive ? 'scale-100 opacity-100 delay-300' : 'scale-90 opacity-0'} `}
                >
                  <span className="mb-2 text-sm font-bold tracking-[0.2em] uppercase opacity-90 drop-shadow-sm md:text-xl">
                    {color.name}
                  </span>
                  <h3 className="max-w-2xl text-2xl leading-snug font-normal md:text-4xl md:leading-tight lg:text-5xl">
                    {color.meaning}
                  </h3>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default ColorPallete
