'use client'

import { useEffect, useState } from 'react'

import Image from 'next/image'
import type { StaticImageData } from 'next/image'

import { getTextStrokeStyle } from '@/lib/textStroke'

import supporterPlaceholder from '@/assets/images/homepage/moments/supporter-placeholder.jpg'

type MomentPhoto = {
  id: number
  src: StaticImageData
  alt: string
  desktopClassName: string
}

const momentPhotos: MomentPhoto[] = [
  {
    id: 1,
    src: supporterPlaceholder,
    alt: 'Supporter top center',
    desktopClassName: 'top-[180px] left-1/2 z-20 w-[520px] -translate-x-1/2 rotate-[-1deg] shadow-2xl'
  },
  {
    id: 2,
    src: supporterPlaceholder,
    alt: 'Supporter top left',
    desktopClassName: 'top-[120px] left-[40px] z-10 w-[520px] rotate-[-16deg] shadow-xl'
  },
  {
    id: 3,
    src: supporterPlaceholder,
    alt: 'Supporter top right',
    desktopClassName: 'top-[100px] right-[40px] z-[15] w-[520px] rotate-[8deg] shadow-xl'
  },
  {
    id: 4,
    src: supporterPlaceholder,
    alt: 'Supporter bottom left',
    desktopClassName: 'bottom-[240px] left-[20px] z-[9] w-[520px] rotate-[-4deg] shadow-xl'
  },
  {
    id: 5,
    src: supporterPlaceholder,
    alt: 'Supporter bottom center',
    desktopClassName: 'bottom-[160px] left-1/2 z-[12] w-[520px] -translate-x-1/2 rotate-[15deg] shadow-2xl'
  },
  {
    id: 6,
    src: supporterPlaceholder,
    alt: 'Supporter bottom right',
    desktopClassName: 'right-[40px] bottom-[250px] z-10 w-[520px] rotate-[-12deg] shadow-xl'
  }
]

const Moments = () => {
  const [activePhoto, setActivePhoto] = useState<MomentPhoto | null>(null)

  useEffect(() => {
    if (!activePhoto) return

    const previousOverflow = document.body.style.overflow
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActivePhoto(null)
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onEscape)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onEscape)
    }
  }, [activePhoto])

  return (
    <section className="bg-blue-cs-40 min-h-screen w-full">
      <div className="blob !bg-yellow-cs-30 min-h-screen w-full overflow-hidden rounded-t-[12rem] shadow-[inset_0px_10px_4px_7px_#00000059] sm:rounded-t-[25rem]">
        <h2
          className="font-rubikone text-blue-cs-30 pt-16 text-center text-[32px] leading-[40px] sm:text-[40px] sm:leading-[52px] lg:text-[56px] lg:leading-[70px]"
          style={getTextStrokeStyle({ color: '#ffffff', width: 2 })}
        >
          Our Moments
        </h2>

        <div className="block px-4 py-8 lg:hidden">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {momentPhotos.map((photo) => (
              <button
                key={photo.id}
                type="button"
                onClick={() => setActivePhoto(photo)}
                className="mx-auto w-5/6 cursor-pointer border-[8px] border-white shadow-xl transition-transform hover:scale-[1.01] focus:outline-none"
                aria-label={`Open photo: ${photo.alt}`}
              >
                <div className="relative aspect-video w-full overflow-hidden">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 767px) 80vw, 45vw"
                  />
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="relative hidden h-[900px] w-full overflow-hidden lg:block">
          {momentPhotos.map((photo) => (
            <button
              key={photo.id}
              type="button"
              onClick={() => setActivePhoto(photo)}
              className={`absolute aspect-video cursor-pointer border-[14px] border-white object-cover transition-transform hover:scale-[1.01] focus:outline-none ${photo.desktopClassName}`}
              aria-label={`Open photo: ${photo.alt}`}
            >
              <div className="relative h-full w-full overflow-hidden">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 520px"
                />
              </div>
            </button>
          ))}
        </div>
      </div>

      {activePhoto ? (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/75 px-4 py-8"
          onClick={() => setActivePhoto(null)}
          aria-modal="true"
          role="dialog"
          aria-label="Moment photo preview"
        >
          <div className="relative w-full max-w-5xl" onClick={(event) => event.stopPropagation()}>
            <div className="bg-neutral-cs-10 relative border-[10px] border-white shadow-[0_22px_60px_rgba(0,0,0,0.55)]">
              <button
                type="button"
                className="bg-neutral-cs-10 text-neutral-cs-80 border-neutral-cs-50 absolute top-[-1px] right-[-1px] z-10 inline-flex h-6 w-6 items-center justify-center border text-xl leading-none"
                onClick={() => setActivePhoto(null)}
                aria-label="Close photo preview"
              >
                ×
              </button>
              <div className="relative aspect-video w-full overflow-hidden">
                <Image
                  src={activePhoto.src}
                  alt={activePhoto.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1023px) 92vw, 70vw"
                />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  )
}

export default Moments
