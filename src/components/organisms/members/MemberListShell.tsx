'use client'

import React, { type ReactNode, useEffect, useRef, useState } from 'react'

import Image from 'next/image'

import CloudAtas from '@/assets/images/members/cloud-atas.svg'
import CloudBawah from '@/assets/images/members/cloud-bawah.svg'
import CloudTengah from '@/assets/images/members/cloud-tengah.svg'
import MemberBg from '@/assets/images/members/member-bg.png'

const CLOUD_GAP_VH = 300
const EDGE_OFFSET_VH = 1

const getVh = (value: number) => (window.innerHeight * value) / 100

type MemberListShellProps = {
  children: ReactNode
}

const MemberListShell = ({ children }: MemberListShellProps) => {
  const sectionRef = useRef<HTMLElement>(null)
  const [middleCloudCount, setMiddleCloudCount] = useState(0)

  useEffect(() => {
    const section = sectionRef.current

    if (!section) {
      return
    }

    const updateMiddleCloudCount = () => {
      const sectionHeight = section.getBoundingClientRect().height
      const viewportWidth = window.innerWidth
      const gap = getVh(CLOUD_GAP_VH)
      const edgeOffset = getVh(EDGE_OFFSET_VH)
      const topCloudHeight = (viewportWidth * 1204) / 1440
      const middleCloudHeight = (viewportWidth * 1249) / 1440
      const bottomCloudHeight = (viewportWidth * 1091) / 1440
      const availableHeight = sectionHeight - edgeOffset * 2 - topCloudHeight - bottomCloudHeight - gap * 2

      setMiddleCloudCount(Math.max(0, Math.floor(availableHeight / (middleCloudHeight + gap))))
    }

    updateMiddleCloudCount()

    const resizeObserver = new ResizeObserver(updateMiddleCloudCount)

    resizeObserver.observe(section)
    window.addEventListener('resize', updateMiddleCloudCount)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', updateMiddleCloudCount)
    }
  }, [])

  return (
    <section ref={sectionRef} className="bg-blue-cs-40 relative min-h-[100vh] w-full overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-repeat-y opacity-80"
        style={{
          backgroundImage: `url(${MemberBg.src})`,
          backgroundPosition: 'top center',
          backgroundSize: '100% auto'
        }}
        aria-hidden="true"
      />
      <div
        className="from-blue-cs-40 pointer-events-none absolute top-0 left-0 z-4 h-[17vh] w-full bg-linear-to-b to-transparent md:h-[50vh] lg:h-[30vh]"
        aria-hidden="true"
      />
      <Image
        src={CloudAtas}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 z-3 h-auto w-full opacity-40 select-none"
        priority
      />
      {Array.from({ length: middleCloudCount }, (_, index) => (
        <Image
          key={index}
          src={CloudTengah}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute left-0 z-10 h-auto w-full opacity-40 select-none"
          style={{
            top: `calc(1vh + (100vw * 1204 / 1440) + ${CLOUD_GAP_VH}vh + ${index} * ((100vw * 1249 / 1440) + ${CLOUD_GAP_VH}vh))`
          }}
        />
      ))}
      <Image
        src={CloudBawah}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[1vh] left-0 z-2 h-auto w-full opacity-40 select-none"
      />

      <div className="relative z-20 flex flex-wrap justify-center gap-8 px-6 py-24 sm:px-10 lg:px-20">{children}</div>
    </section>
  )
}

export default MemberListShell
