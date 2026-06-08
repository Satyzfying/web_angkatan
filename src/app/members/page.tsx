import React from 'react'

import { defineMetadata, getMetadataBase } from '@/lib/metadata'

import Hero from '@/components/organisms/members/Hero'
import MemberList from '@/components/organisms/members/MemberList'

export const metadata = defineMetadata({
  title: 'Members - Evastra',
  description:
    'Temui anggota-anggota Evastra yang luar biasa! Di sini, Anda dapat menemukan profil lengkap mereka. Bergabunglah dengan kami untuk mengenal lebih dekat para anggota yang membuat Evastra menjadi tempat yang istimewa!',
  openGraph: {
    type: 'website',
    title: 'Members - Evastra',
    description:
      'Temui anggota-anggota Evastra yang luar biasa! Di sini, Anda dapat menemukan profil lengkap mereka. Bergabunglah dengan kami untuk mengenal lebih dekat para anggota yang membuat Evastra menjadi tempat yang istimewa!',
    url: new URL('/members', getMetadataBase()).toString(),
    images: {
      url: new URL('/assets/images/metadata/og.webp', getMetadataBase()).toString(),
      width: 1200,
      height: 630,
      type: 'image/webp',
      alt: 'Members - Evastra'
    }
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Members - Evastra',
    description:
      'Temui anggota-anggota Evastra yang luar biasa! Di sini, Anda dapat menemukan profil lengkap mereka. Bergabunglah dengan kami untuk mengenal lebih dekat para anggota yang membuat Evastra menjadi tempat yang istimewa!',
    images: {
      url: new URL('/assets/images/metadata/og.webp ', getMetadataBase()).toString(),
      width: 1200,
      height: 630,
      type: 'image/webp',
      alt: 'Members - Evastra'
    }
  }
})

type MembersProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

const Members = async ({ searchParams }: MembersProps) => {
  const filters = await searchParams

  return (
    <>
      <Hero filters={filters} />
      <MemberList filters={filters} />
    </>
  )
}

export default Members
