import Image from 'next/image'

import { defineMetadata, getMetadataBase } from '@/lib/metadata'

import AboutUs from '@/components/organisms/about-us/AboutUs'
import ColorPallete from '@/components/organisms/about-us/ColorPallete'
import Hero from '@/components/organisms/about-us/Hero'
import LogoPhilosophy from '@/components/organisms/about-us/LogoPhilosophy'
import Mission from '@/components/organisms/about-us/Mission'
import Vision from '@/components/organisms/about-us/Vision'

import aboutUsBg from '@/assets/images/about-us/about-us-bg.png'

export const metadata = defineMetadata({
  title: 'Tentang Kami - Evastra',
  description:
    'Pelajari lebih lanjut tentang Evastra, teknologi informasi ITS 2025. Temukan visi, misi, dan filosofi kami.',
  openGraph: {
    type: 'website',
    title: 'Tentang Kami - Evastra',
    description:
      'Pelajari lebih lanjut tentang Evastra, teknologi informasi ITS 2025. Temukan visi, misi, dan filosofi kami.',
    url: new URL('/about-us', getMetadataBase()).toString(),
    images: {
      url: new URL('/assets/images/metadata/og.webp', getMetadataBase()).toString(),
      width: 1200,
      height: 630,
      type: 'image/webp',
      alt: 'Tentang Kami - Evastra'
    }
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tentang Kami - Evastra',
    description:
      'Pelajari lebih lanjut tentang Evastra, teknologi informasi ITS 2025. Temukan visi, misi, dan filosofi kami.',
    images: {
      url: new URL('/assets/images/metadata/og.webp ', getMetadataBase()).toString(),
      width: 1200,
      height: 630,
      type: 'image/webp',
      alt: 'Tentang Kami - Evastra'
    }
  }
})

export default function AboutUsPage() {
  return (
    <main className="bg-blue-cs-40 relative z-0 flex min-h-screen w-full flex-col overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -bottom-4 z-0 opacity-50">
        <Image src={aboutUsBg} alt="About Us Background" fill priority className="object-cover object-top" />
      </div>

      <>
        <Hero />
        <AboutUs />
        <LogoPhilosophy />
        <ColorPallete />
        <Vision />
        <Mission />
      </>
    </main>
  )
}
