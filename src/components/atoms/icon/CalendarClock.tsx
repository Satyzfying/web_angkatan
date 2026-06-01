import Image, { type ImageProps } from 'next/image'

import CalendarClockIcon from '@/assets/images/icon/calendar-clock.svg'

type CalendarClockProps = Omit<ImageProps, 'src' | 'alt'> & {
  alt?: string
}

const CalendarClock = ({ alt = 'Evastra Logo', ...props }: CalendarClockProps) => {
  return <Image src={CalendarClockIcon} alt={alt} width={8} height={8} {...props} />
}

export default CalendarClock