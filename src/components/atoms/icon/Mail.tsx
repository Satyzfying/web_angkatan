import Image, { type ImageProps } from 'next/image'

import MailIcon from '@/assets/images/icon/mail.svg'

type MailProps = Omit<ImageProps, 'src' | 'alt'> & {
  alt?: string
}

const Mail = ({ alt = 'Evastra Logo', ...props }: MailProps) => {
  return <Image src={MailIcon} alt={alt} width={8} height={8} {...props} />
}

export default Mail