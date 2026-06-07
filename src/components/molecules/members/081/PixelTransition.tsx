'use client'

import React, {
  CSSProperties,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'

interface PixelTransitionProps {
  firstContent: React.ReactNode
  secondContent: React.ReactNode
  gridSize?: number
  pixelColor?: string
  animationStepDuration?: number
  once?: boolean
  className?: string
  style?: CSSProperties
}

const PixelTransition: React.FC<PixelTransitionProps> = ({
  firstContent,
  secondContent,
  gridSize = 8,
  pixelColor = '#e6cc4b',
  animationStepDuration = 0.4,
  once = false,
  className = '',
  style = {},
}) => {
  const [isActive, setIsActive] = useState(false)
  const [pixels, setPixels] = useState<{ id: number; delay: number }[]>([])
  const [showingPixels, setShowingPixels] = useState(false)
  const [showSecond, setShowSecond] = useState(false)
  const animatingRef = useRef(false)
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    const total = gridSize * gridSize
    const arr = Array.from({ length: total }, (_, i) => ({
      id: i,
      delay: Math.random(),
    }))
    setPixels(arr)
  }, [gridSize])

  const clearTimeouts = () => {
    timeoutsRef.current.forEach(clearTimeout)
    timeoutsRef.current = []
  }

  const animate = useCallback(
    (activate: boolean) => {
      if (animatingRef.current) return
      animatingRef.current = true
      clearTimeouts()

      setShowingPixels(true)

      const half = animationStepDuration * 1000
      const full = animationStepDuration * 2 * 1000

      const t1 = setTimeout(() => {
        setShowSecond(activate)
        setIsActive(activate)
      }, half)

      const t2 = setTimeout(() => {
        setShowingPixels(false)
        animatingRef.current = false
      }, full)

      timeoutsRef.current.push(t1, t2)
    },
    [animationStepDuration],
  )

  const handleEnter = () => {
    if (!isActive) animate(true)
  }

  const handleLeave = () => {
    if (isActive && !once) animate(false)
  }

  const handleClick = () => {
    if (!isActive) animate(true)
    else if (!once) animate(false)
  }

  const isTouchDevice =
    typeof window !== 'undefined' &&
    ('ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia('(pointer: coarse)').matches)

  const size = 100 / gridSize

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={style}
      onMouseEnter={!isTouchDevice ? handleEnter : undefined}
      onMouseLeave={!isTouchDevice ? handleLeave : undefined}
      onClick={isTouchDevice ? handleClick : undefined}
    >
      {/* First content */}
      <div
        className="absolute inset-0 h-full w-full"
        style={{ opacity: showSecond ? 0 : 1 }}
      >
        {firstContent}
      </div>

      {/* Second content */}
      <div
        className="absolute inset-0 h-full w-full"
        style={{ opacity: showSecond ? 1 : 0, transition: 'opacity 0s' }}
      >
        {secondContent}
      </div>

      {/* Pixel grid overlay */}
      {showingPixels &&
        pixels.map((px) => {
          const row = Math.floor(px.id / gridSize)
          const col = px.id % gridSize
          return (
            <div
              key={px.id}
              className="absolute"
              style={{
                backgroundColor: pixelColor,
                width: `${size}%`,
                height: `${size}%`,
                left: `${col * size}%`,
                top: `${row * size}%`,
                opacity: 1,
                animation: `pixel-flash ${animationStepDuration}s ${px.delay * animationStepDuration}s linear forwards`,
              }}
            />
          )
        })}

      <style>{`
        @keyframes pixel-flash {
          0%   { opacity: 0; }
          30%  { opacity: 1; }
          70%  { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  )
}

export default PixelTransition
