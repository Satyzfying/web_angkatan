import Image, { type ImageProps } from 'next/image'

import SendBlackIcon from '@/assets/images/icon/send-black.svg'

type SendBlackProps = Omit<ImageProps, 'src' | 'alt'> & {
  alt?: string
}

const SendBlack = ({ alt = 'Evastra Logo', ...props }: SendBlackProps) => {
  return <Image src={SendBlackIcon} alt={alt} width={8} height={8} {...props} />
}

export default SendBlack