import React from 'react'

import Image from 'next/image'

import Icon from '@/assets/images/members/linkedin.svg'

interface LinkedInButtonLinkProps {
  username: string
}

const LinkedInButtonLink = ({ username }: LinkedInButtonLinkProps) => {
  return (
    <a
      href={`https://linkedin.com/in/${username}`}
      className="cursor-pointer"
      target="_blank"
      rel="noopener noreferrer"
    >
      <Image src={Icon} alt={`${username}'s GitHub Profile`} className="h-8 w-8" />
    </a>
  )
}

export default LinkedInButtonLink
