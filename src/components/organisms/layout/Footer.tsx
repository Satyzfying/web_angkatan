import Image from 'next/image'

import Ig from '@/components/atoms/icon/Ig'
import LogoIcon from '@/components/atoms/icon/LogoIcon'
import Star from '@/components/atoms/icon/Star'

import FooterImage from '@/assets/images/layout/footer.webp'
import { getTextStrokeStyle } from '@/lib/textStroke'

const Footer = () => {
  return (
    <div className="bg-blue-cs-40 relative flex h-65.75 w-full items-center justify-between overflow-hidden p-20 text-white">
      <Image
        src={FooterImage}
        alt="Footer"
        className="absolute inset-0 w-full object-cover opacity-10"
        height={200}
        width={400}
      />
      <LogoIcon width={100} height={100} />
      <div className="relative flex flex-col items-end gap-4">
        <h2
          className="font-rubikone text-blue-cs-30 text-4xl"
          style={getTextStrokeStyle({ color: '#fffddd', width: 2 })}
        >
          A Space to Grow Together
          <Star className="absolute top-0 -right-3" width={20} height={20} />
        </h2>
        <p className="flex items-center gap-2 font-semibold">
          <a
            href="https://www.instagram.com/it2025_its/"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-transform hover:scale-110"
          >
            <Ig width={28} />
          </a>
          <span>© ITS Information Technology — est. 2025</span>
        </p>
      </div>
    </div>
  )
}

export default Footer
