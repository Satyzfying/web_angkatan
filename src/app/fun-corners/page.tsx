import { defineMetadata, getMetadataBase } from '@/lib/metadata'

import Hero from '@/components/organisms/fun-corners/Hero'
import Menfess from '@/components/organisms/fun-corners/Menfess'

export const metadata = defineMetadata({
  title: 'Fun Corners - Evastra',
  description:
    'Fun Corners adalah tempat untuk berbagi cerita, curhat, dan pesan-pesan menarik lainnya. Kirim menfessmu sekarang dan temukan cerita seru dari teman-temanmu!',
  openGraph: {
    type: 'website',
    title: 'Fun Corners - Evastra',
    description:
      'Fun Corners adalah tempat untuk berbagi cerita, curhat, dan pesan-pesan menarik lainnya. Kirim menfessmu sekarang dan temukan cerita seru dari teman-temanmu!',
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
    title: 'Fun Corners - Evastra',
    description:
      'Fun Corners adalah tempat untuk berbagi cerita, curhat, dan pesan-pesan menarik lainnya. Kirim menfessmu sekarang dan temukan cerita seru dari teman-temanmu!',
    images: {
      url: new URL('/assets/images/metadata/og.webp ', getMetadataBase()).toString(),
      width: 1200,
      height: 630,
      type: 'image/webp',
      alt: 'Tentang Kami - Evastra'
    }
  }
})

type FunCornerProps = {
  searchParams: Promise<{
    page?: string | string[]
  }>
}

const getInitialPage = (page?: string | string[]) => {
  const pageValue = Array.isArray(page) ? page[0] : page
  const parsedPage = Number.parseInt(pageValue ?? '', 10)

  if (!Number.isFinite(parsedPage)) {
    return 1
  }

  return Math.max(1, Math.floor(parsedPage))
}

export default async function FunCorner({ searchParams }: FunCornerProps) {
  const initialPage = getInitialPage((await searchParams).page)

  return (
    <>
      <Hero />
      <Menfess initialPage={initialPage} />
    </>
  )
}
