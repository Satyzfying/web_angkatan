import Image, { type ImageProps } from 'next/image'

import SendIcon from '@/assets/images/icon/send.svg'

type SendProps = Omit<ImageProps, 'src' | 'alt'> & {
  alt?: string
}

const Send = ({ alt = 'Evastra Logo', ...props }: SendProps) => {
  return <Image src={SendIcon} alt={alt} width={8} height={8} {...props} />
}

export default Send