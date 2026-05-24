import type { CSSProperties } from 'react'

type TextStrokeStyleOptions = {
  color: string
  width: number
}

const toRounded = (value: number) => Number(value.toFixed(2))

export const getTextStrokeStyle = ({ color, width }: TextStrokeStyleOptions): CSSProperties => {
  const radius = Math.max(0, width)

  if (radius === 0) {
    return {}
  }

  const shadowSteps: string[] = []
  const maxOffset = Math.ceil(radius)

  for (let x = -maxOffset; x <= maxOffset; x += 1) {
    for (let y = -maxOffset; y <= maxOffset; y += 1) {
      if (x === 0 && y === 0) continue

      const distance = Math.hypot(x, y)
      if (distance > radius) continue

      shadowSteps.push(`${toRounded(x)}px ${toRounded(y)}px 0 ${color}`)
    }
  }

  if (shadowSteps.length === 0) {
    shadowSteps.push(`0 0 0 ${color}`)
  }

  return {
    textShadow: shadowSteps.join(', ')
  }
}
