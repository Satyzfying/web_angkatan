import React from 'react'

import Image from 'next/image'

import InstagramIcon from '@/assets/images/members/instagram-icon.svg'

interface InstagramButtonLinkProps {
  username: string
}

const InstagramButtonLink = ({ username }: InstagramButtonLinkProps) => {
  return (
    <a href={`https://instagram.com/${username}`} className="cursor-pointer" target="_blank" rel="noopener noreferrer">
      <Image src={InstagramIcon} alt={`${username}'s GitHub Profile`} className="h-8 w-8" />
    </a>
  )
}

export default InstagramButtonLink
