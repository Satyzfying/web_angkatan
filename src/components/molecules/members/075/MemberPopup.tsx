'use client'
 
import React, { useEffect, useRef, useState, useCallback } from 'react'
import Image from 'next/image'
 
import SpotifyEmbed from '@/components/molecules/SpotifyEmbed'
import ProfileImage from './image.png'
 
// ─────────────────────────────────────────────
// SWIPE INTRO COMPONENT
// ─────────────────────────────────────────────
 
type SwipeIntroProps = {
  onComplete: () => void
}
 
const SwipeIntro = ({ onComplete }: SwipeIntroProps) => {
  const smudgeRef = useRef<HTMLCanvasElement>(null)
  const eraseRef = useRef<HTMLCanvasElement>(null)
  const compositeRef = useRef<HTMLCanvasElement>(null)
  const eraseStoreRef = useRef<HTMLCanvasElement>(null)
  const cursorRef = useRef<HTMLDivElement>(null)
  const isErasingRef = useRef(false)
  const animFrameRef = useRef<number>(0)
  const checkIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const revealedRef = useRef(false)
 
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState<'start' | 'mid' | 'almost' | 'done'>('start')
 
  const phaseText = {
    start: { title: '✦ layarnya kotor nih~ ✦', sub: 'usap-usap buat bersihin layar dulu ya!' },
    mid:   { title: '✦ ayo terus usap~ ✦',      sub: 'dikit lagi udah bersih!' },
    almost:{ title: '✦ wah hampir bersih! ✦',    sub: 'semangat!!! 🌸' },
    done:  { title: '✦ sebentar lagi~ ✦',         sub: 'tinggal sedikit lagi!!! 🌷' },
  }
 
  const drawSmudges = useCallback((ctx: CanvasRenderingContext2D, W: number, H: number) => {
    ctx.clearRect(0, 0, W, H)
 
    const colors = [
      'rgba(252,192,197,0.55)', 'rgba(254,237,170,0.55)',
      'rgba(249,160,176,0.45)', 'rgba(200,220,255,0.4)',
      'rgba(200,255,200,0.35)', 'rgba(255,200,150,0.4)',
    ]
 
    const blobs = [
      { x:0.1,  y:0.15, rx:120, ry:80,  ci:0 },
      { x:0.85, y:0.1,  rx:100, ry:70,  ci:1 },
      { x:0.25, y:0.7,  rx:90,  ry:110, ci:2 },
      { x:0.75, y:0.75, rx:110, ry:80,  ci:3 },
      { x:0.5,  y:0.3,  rx:80,  ry:60,  ci:4 },
      { x:0.55, y:0.85, rx:95,  ry:65,  ci:5 },
      { x:0.15, y:0.45, rx:70,  ry:90,  ci:0 },
      { x:0.9,  y:0.55, rx:85,  ry:75,  ci:1 },
    ]
 
    blobs.forEach(b => {
      ctx.save()
      ctx.translate(b.x * W, b.y * H)
      ctx.scale(1, b.ry / b.rx)
      ctx.beginPath()
      ctx.arc(0, 0, b.rx, 0, Math.PI * 2)
      ctx.fillStyle = colors[b.ci]
      ctx.fill()
      ctx.restore()
    })
 
    // Paw prints
    const paws = [
      { x:0.08, y:0.08 }, { x:0.92, y:0.2 },  { x:0.3,  y:0.4  },
      { x:0.65, y:0.15 }, { x:0.18, y:0.82 }, { x:0.8,  y:0.9  },
      { x:0.45, y:0.55 }, { x:0.72, y:0.5  },
    ]
    paws.forEach(p => drawPaw(ctx, p.x * W, p.y * H, 22, 'rgba(249,160,176,0.6)'))
 
    // Doodle symbols
    const symbols = ['✦', '✿', '★', '♥', '◆']
    const doodlePos = [
      { x:0.35, y:0.12 }, { x:0.7,  y:0.38 }, { x:0.12, y:0.6  },
      { x:0.88, y:0.7  }, { x:0.5,  y:0.9  }, { x:0.22, y:0.25 },
    ]
    doodlePos.forEach((d, i) => {
      ctx.save()
      ctx.translate(d.x * W, d.y * H)
      ctx.fillStyle = 'rgba(254,237,170,0.75)'
      ctx.font = 'bold 28px serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(symbols[i % symbols.length], 0, 0)
      ctx.restore()
    })
 
    // Paint streaks
    for (let i = 0; i < 14; i++) {
      ctx.save()
      ctx.beginPath()
      const sx = (Math.sin(i * 1.37) * 0.5 + 0.5) * W
      const sy = (Math.cos(i * 0.89) * 0.5 + 0.5) * H
      ctx.moveTo(sx, sy)
      ctx.bezierCurveTo(
        sx + Math.sin(i) * 100, sy + Math.cos(i) * 50,
        sx + Math.cos(i) * 100, sy + Math.sin(i) * 50,
        sx + Math.sin(i * 2) * 160, sy + Math.cos(i * 2) * 80,
      )
      ctx.strokeStyle = colors[i % colors.length]
      ctx.lineWidth = 10 + (i % 4) * 4
      ctx.lineCap = 'round'
      ctx.stroke()
      ctx.restore()
    }
  }, [])
 
  const drawPaw = (ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string) => {
    ctx.save()
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.ellipse(x, y, r, r * 0.8, 0, 0, Math.PI * 2)
    ctx.fill()
    const toes: [number, number][] = [[-r * 0.8, -r * 0.95], [-0.3 * r, -r * 1.2], [0.35 * r, -r * 1.2], [0.85 * r, -r * 0.9]]
    toes.forEach(([dx, dy]) => {
      ctx.beginPath()
      ctx.ellipse(x + dx, y + dy, r * 0.42, r * 0.38, 0, 0, Math.PI * 2)
      ctx.fill()
    })
    ctx.restore()
  }
 
  const eraseAt = useCallback((x: number, y: number) => {
    const ec = eraseStoreRef.current?.getContext('2d')
    if (!ec) return
    const r = 65
    const g = ec.createRadialGradient(x, y, 0, x, y, r)
    g.addColorStop(0, 'rgba(0,0,0,1)')
    g.addColorStop(0.6, 'rgba(0,0,0,0.9)')
    g.addColorStop(1, 'rgba(0,0,0,0)')
    ec.fillStyle = g
    ec.beginPath()
    ec.arc(x, y, r, 0, Math.PI * 2)
    ec.fill()
  }, [])
 
  const handleReveal = useCallback(() => {
    if (revealedRef.current) return
    revealedRef.current = true
    if (checkIntervalRef.current) clearInterval(checkIntervalRef.current)
    cancelAnimationFrame(animFrameRef.current)
    onComplete()
  }, [onComplete])
 
  // Erase handlers
 
  useEffect(() => {
    const W = window.innerWidth
    const H = window.innerHeight
 
    // Init canvases
    const smudge = smudgeRef.current!
    const erase  = eraseRef.current!
    const comp   = compositeRef.current!
    const store  = document.createElement('canvas')
    eraseStoreRef.current = store
 
    smudge.width = erase.width = comp.width = store.width = W
    smudge.height = erase.height = comp.height = store.height = H
 
    // Draw smudges onto smudge canvas
    const sc = smudge.getContext('2d')!
    drawSmudges(sc, W, H)
 
    // Render loop: composite - destination-out
    const cc = comp.getContext('2d')!
    const renderLoop = () => {
      cc.clearRect(0, 0, W, H)
      cc.drawImage(smudge, 0, 0)
      cc.save()
      cc.globalCompositeOperation = 'destination-out'
      cc.drawImage(store, 0, 0)
      cc.restore()
      animFrameRef.current = requestAnimationFrame(renderLoop)
    }
    renderLoop()
 
    // Check progress
    checkIntervalRef.current = setInterval(() => {
      const sc2 = store.getContext('2d')!
      const data = sc2.getImageData(0, 0, W, H).data
      let filled = 0
      for (let i = 3; i < data.length; i += 4) {
        if (data[i] > 64) filled++
      }
      const pct = Math.min(100, Math.round((filled / (W * H)) * 100))
      setProgress(pct)
 
      if      (pct >= 70) setPhase('done')
      else if (pct >= 45) setPhase('almost')
      else if (pct >= 20) setPhase('mid')
      else                setPhase('start')
 
      if (pct >= 72) handleReveal()
    }, 250)
 
    return () => {
      if (checkIntervalRef.current) clearInterval(checkIntervalRef.current)
      cancelAnimationFrame(animFrameRef.current)
    }
  }, [drawSmudges, handleReveal])
 
  // Mouse events on erase overlay
  const onMouseMove = (e: React.MouseEvent) => {
    if (cursorRef.current) {
      cursorRef.current.style.left = e.clientX + 'px'
      cursorRef.current.style.top  = e.clientY + 'px'
    }
    if (isErasingRef.current) eraseAt(e.clientX, e.clientY)
  }
  const onMouseDown = (e: React.MouseEvent) => { isErasingRef.current = true; eraseAt(e.clientX, e.clientY) }
  const onMouseUp   = ()                      => { isErasingRef.current = false }
 
  const onTouchStart = (e: React.TouchEvent) => {
    isErasingRef.current = true
    eraseAt(e.touches[0].clientX, e.touches[0].clientY)
  }
  const onTouchMove = (e: React.TouchEvent) => {
    e.preventDefault()
    eraseAt(e.touches[0].clientX, e.touches[0].clientY)
  }
  const onTouchEnd = () => { isErasingRef.current = false }
 
  const { title, sub } = phaseText[phase]
 
  return (
    <>
      {/* Custom broom cursor */}
      <div
        ref={cursorRef}
        className="fixed z-[9999] pointer-events-none"
        style={{ transform: 'translate(-50%, -50%)', transition: 'opacity 0.2s' }}
      >
        <svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
          <g transform="rotate(-40 24 24)">
            <rect x="22" y="4" width="4" height="26" rx="2" fill="#a0784a" />
            <rect x="10" y="28" width="28" height="13" rx="6.5" fill="#f9c0c8" />
            <rect x="10" y="28" width="28" height="5" rx="3" fill="#FCC0C5" />
          </g>
        </svg>
      </div>
 
      {/* Skip button */}
      <button
        type="button"
        onClick={handleReveal}
        className="fixed top-4 right-5 z-[9999] px-4 py-1.5 rounded-full text-sm italic transition-all"
        style={{
          background: 'white',
          border: '1.5px solid #e8c0c8',
          color: '#c08090',
          fontFamily: "'Georgia', serif",
          cursor: 'pointer',
        }}
        onMouseEnter={e => (e.currentTarget.style.background = '#FCC0C5')}
        onMouseLeave={e => (e.currentTarget.style.background = 'white')}
      >
        ✕ skip intro
      </button>
 
      {/* Intro screen */}
      <div
        className="fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #ffe4ee 0%, #fff8e1 50%, #ffe4ee 100%)', cursor: 'none' }}
      >
        {/* Composite canvas (smudge - erase) */}
        <canvas ref={compositeRef} className="absolute inset-0 w-full h-full pointer-events-none" />
 
        {/* Hidden smudge source */}
        <canvas ref={smudgeRef} className="hidden" />
        <canvas ref={eraseRef} className="hidden" />
 
        {/* Erase interaction layer */}
        <div
          className="absolute inset-0 z-10"
          style={{ cursor: 'none' }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        />
 
        {/* Center text */}
        <div className="relative z-20 text-center pointer-events-none select-none">
          <p
            className="text-2xl md:text-3xl italic mb-2"
            style={{
              fontFamily: "'Georgia', serif",
              color: '#8B4560',
              animation: 'introPulse 2s ease-in-out infinite',
            }}
          >
            {title}
          </p>
          <p className="text-sm md:text-base mb-5" style={{ color: '#c08090', opacity: 0.85 }}>
            {sub}
          </p>
 
          {/* Progress bar */}
          <div
            className="w-48 h-2.5 mx-auto mb-3 overflow-hidden"
            style={{ background: 'rgba(200,140,155,0.2)', borderRadius: 99, border: '1.5px solid #f0c0cc' }}
          >
            <div
              className="h-full transition-all duration-150"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #FCC0C5, #f9a0b0)',
                borderRadius: 99,
              }}
            />
          </div>
          <p className="text-xs italic" style={{ color: '#d4a0b0' }}>{progress}% bersih</p>
        </div>
      </div>
 
      <style>{`
        @keyframes introPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.55; }
        }
      `}</style>
    </>
  )
}
 
// ─────────────────────────────────────────────
// MEMBER POPUP (with intro)
// ─────────────────────────────────────────────
 
type MemberPopupProps = {
  isOpen: boolean
  onClose: () => void
}
 
const MemberPopup = ({ isOpen, onClose }: MemberPopupProps) => {
  const [introComplete, setIntroComplete] = useState(false)
  const [cardVisible, setCardVisible] = useState(false)
 
  // Reset intro state every time popup opens
  useEffect(() => {
    if (!isOpen) {
      setIntroComplete(false)
      setCardVisible(false)
      return
    }
    document.body.style.overflow = 'hidden'
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])
 
  const handleIntroComplete = useCallback(() => {
    setIntroComplete(true)
    // Small delay so fade-out is smooth
    setTimeout(() => setCardVisible(true), 50)
  }, [])
 
  if (!isOpen) return null
 
  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto">
 
      {/* ── INTRO ── */}
      {!introComplete && <SwipeIntro onComplete={handleIntroComplete} />}
 
      {/* ── BACKDROP DEKORASI (shows after intro) ── */}
      {cardVisible && (
        <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 101 }}>
          {/* backdrop blur */}
          <div className="absolute inset-0" style={{ background: 'rgba(255,220,230,0.18)', backdropFilter: 'blur(8px)' }} />
 
          {/* ═══ DEKORASI TERSEBAR DI SELURUH LAYAR ═══ */}
 
          {/* tulip pink — pojok kiri atas */}
          <svg viewBox="0 0 120 220" width="130" style={{ position:'absolute', top:'2%', left:'2%', animation:'sway 4s ease-in-out infinite', transformOrigin:'bottom center' }} xmlns="http://www.w3.org/2000/svg">
            <path d="M60 220 Q55 175 58 130" stroke="#6db56d" strokeWidth="5" fill="none" strokeLinecap="round"/>
            <path d="M58 170 Q36 152 30 135" stroke="#6db56d" strokeWidth="3" fill="none" strokeLinecap="round"/>
            <ellipse cx="27" cy="132" rx="11" ry="7" fill="#82c982" transform="rotate(-30 27 132)"/>
            <ellipse cx="60" cy="92" rx="16" ry="32" fill="#FCC0C5"/>
            <ellipse cx="42" cy="98" rx="14" ry="27" fill="#f9aab5" transform="rotate(-22 42 98)"/>
            <ellipse cx="78" cy="98" rx="14" ry="27" fill="#f9aab5" transform="rotate(22 78 98)"/>
            <ellipse cx="49" cy="84" rx="12" ry="24" fill="#fbc8cf" transform="rotate(-10 49 84)"/>
            <ellipse cx="71" cy="84" rx="12" ry="24" fill="#fbc8cf" transform="rotate(10 71 84)"/>
            <ellipse cx="54" cy="74" rx="5" ry="12" fill="white" opacity="0.35"/>
          </svg>
 
          {/* cat head — kiri atas */}
          <svg viewBox="0 0 120 110" width="110" style={{ position:'absolute', top:'18%', left:'1%', animation:'floatUpDown 3.2s 0.5s ease-in-out infinite' }} xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="60" cy="65" rx="42" ry="38" fill="#fff0f3" stroke="#f5c8d0" strokeWidth="1.5"/>
            <polygon points="28,38 18,10 46,32" fill="#FCC0C5" stroke="#f5c8d0" strokeWidth="1"/>
            <polygon points="92,38 102,10 74,32" fill="#FCC0C5" stroke="#f5c8d0" strokeWidth="1"/>
            <polygon points="30,36 22,14 44,32" fill="#f9b0be" opacity="0.7"/>
            <polygon points="90,36 98,14 76,32" fill="#f9b0be" opacity="0.7"/>
            <ellipse cx="46" cy="60" rx="9" ry="10" fill="#5a3040"/>
            <ellipse cx="74" cy="60" rx="9" ry="10" fill="#5a3040"/>
            <circle cx="49" cy="57" r="3" fill="white"/>
            <circle cx="77" cy="57" r="3" fill="white"/>
            <polygon points="60,70 56,75 64,75" fill="#FCC0C5"/>
            <path d="M56 75 Q60 80 64 75" stroke="#c08090" strokeWidth="1.2" fill="none"/>
            <line x1="28" y1="68" x2="50" y2="70" stroke="#d4a0b0" strokeWidth="1.2" opacity="0.7"/>
            <line x1="28" y1="74" x2="50" y2="74" stroke="#d4a0b0" strokeWidth="1.2" opacity="0.7"/>
            <line x1="70" y1="70" x2="92" y2="68" stroke="#d4a0b0" strokeWidth="1.2" opacity="0.7"/>
            <line x1="70" y1="74" x2="92" y2="74" stroke="#d4a0b0" strokeWidth="1.2" opacity="0.7"/>
            <ellipse cx="38" cy="74" rx="10" ry="6" fill="#FCC0C5" opacity="0.5"/>
            <ellipse cx="82" cy="74" rx="10" ry="6" fill="#FCC0C5" opacity="0.5"/>
            <polygon points="60,82 50,87 60,90 70,87" fill="#FEEDAA"/>
            <polygon points="50,87 40,82 43,90" fill="#fde48a"/>
            <polygon points="70,87 80,82 77,90" fill="#fde48a"/>
            <circle cx="60" cy="86" r="3.5" fill="#e8d060"/>
          </svg>
 
          {/* cat full body — kanan atas */}
          <svg viewBox="0 0 140 180" width="140" style={{ position:'absolute', top:'4%', right:'2%', animation:'floatUpDown 3.5s ease-in-out infinite' }} xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="70" cy="118" rx="38" ry="44" fill="#fff0f3" stroke="#f5c8d0" strokeWidth="1.5"/>
            <ellipse cx="70" cy="72" rx="32" ry="30" fill="#fff0f3" stroke="#f5c8d0" strokeWidth="1.5"/>
            <polygon points="46,50 38,22 62,44" fill="#FCC0C5" stroke="#f5c8d0" strokeWidth="1"/>
            <polygon points="94,50 102,22 78,44" fill="#FCC0C5" stroke="#f5c8d0" strokeWidth="1"/>
            <ellipse cx="58" cy="68" rx="7" ry="8" fill="#5a3040"/>
            <ellipse cx="82" cy="68" rx="7" ry="8" fill="#5a3040"/>
            <circle cx="60" cy="65" r="2.5" fill="white"/>
            <circle cx="84" cy="65" r="2.5" fill="white"/>
            <polygon points="70,76 66,81 74,81" fill="#FCC0C5"/>
            <path d="M66 81 Q70 86 74 81" stroke="#c08090" strokeWidth="1.2" fill="none"/>
            <ellipse cx="50" cy="80" rx="9" ry="5.5" fill="#FCC0C5" opacity="0.5"/>
            <ellipse cx="90" cy="80" rx="9" ry="5.5" fill="#FCC0C5" opacity="0.5"/>
            <path d="M108 128 Q132 108 128 80 Q125 65 116 72" stroke="#f5c8d0" strokeWidth="7" fill="none" strokeLinecap="round"/>
            <polygon points="70,94 58,100 70,104 82,100" fill="#FCC0C5"/>
            <circle cx="70" cy="99" r="3.5" fill="#e8909a"/>
          </svg>
 
          {/* paw prints — kanan tengah */}
          <svg viewBox="0 0 110 130" width="105" style={{ position:'absolute', top:'40%', right:'2%', animation:'floatUpDown 2.8s 0.7s ease-in-out infinite' }} xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="55" cy="80" rx="20" ry="16" fill="#FCC0C5" opacity="0.85"/>
            <ellipse cx="34" cy="63" rx="10" ry="9" fill="#FCC0C5" opacity="0.8"/>
            <ellipse cx="48" cy="57" rx="10" ry="9" fill="#FCC0C5" opacity="0.8"/>
            <ellipse cx="64" cy="57" rx="10" ry="9" fill="#FCC0C5" opacity="0.8"/>
            <ellipse cx="76" cy="63" rx="10" ry="9" fill="#FCC0C5" opacity="0.8"/>
          </svg>
 
          {/* palette — kiri bawah */}
          <svg viewBox="0 0 150 120" width="140" style={{ position:'absolute', top:'62%', left:'1%', animation:'floatUpDown 3s 1.5s ease-in-out infinite' }} xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="72" cy="62" rx="62" ry="48" fill="#fff8f0" stroke="#e8c9ce" strokeWidth="1.5"/>
            <ellipse cx="92" cy="44" rx="15" ry="15" fill="#fff8f0" stroke="#e8c9ce" strokeWidth="1"/>
            <circle cx="34" cy="48" r="11" fill="#FCC0C5" opacity="0.9"/>
            <circle cx="55" cy="34" r="10" fill="#FEEDAA" opacity="0.9"/>
            <circle cx="76" cy="29" r="9" fill="#f9b8c0" opacity="0.85"/>
            <circle cx="98" cy="34" r="9" fill="#b8e0f9" opacity="0.85"/>
            <circle cx="112" cy="53" r="9" fill="#c8f0c0" opacity="0.85"/>
            <circle cx="104" cy="72" r="10" fill="#e8c8f8" opacity="0.85"/>
            <circle cx="56" cy="76" r="10" fill="#ffd0a0" opacity="0.9"/>
            <circle cx="34" cy="68" r="9" fill="#f0c8e0" opacity="0.85"/>
            <rect x="105" y="12" width="5" height="40" rx="2.5" fill="#c8a878" transform="rotate(32 105 12)"/>
            <ellipse cx="124" cy="7" rx="5" ry="9" fill="#FCC0C5" transform="rotate(32 124 7)"/>
            <text x="72" y="105" textAnchor="middle" fontSize="9" fill="#c08090" fontFamily="Georgia, serif">✦ palette ✦</text>
          </svg>
 
          {/* watercolor splash — kanan bawah */}
          <svg viewBox="0 0 130 100" width="125" style={{ position:'absolute', top:'82%', right:'1%', animation:'floatUpDown 2.6s 0.4s ease-in-out infinite' }} xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="40" cy="50" rx="30" ry="24" fill="#FCC0C5" opacity="0.55"/>
            <ellipse cx="70" cy="42" rx="28" ry="22" fill="#FEEDAA" opacity="0.55"/>
            <ellipse cx="95" cy="58" rx="25" ry="20" fill="#b8d8f8" opacity="0.5"/>
            <ellipse cx="55" cy="66" rx="22" ry="18" fill="#d0c0f8" opacity="0.5"/>
            <circle cx="40" cy="50" r="8" fill="#f9a0b0" opacity="0.75"/>
            <circle cx="70" cy="42" r="7" fill="#fdd870" opacity="0.75"/>
            <circle cx="95" cy="58" r="7" fill="#90b8e0" opacity="0.75"/>
            <text x="65" y="90" textAnchor="middle" fontSize="8" fill="#c08090" fontFamily="Georgia, serif">✦ art ✦</text>
          </svg>
        </div>
      )}
 
      {/* backdrop click to close */}
      {cardVisible && (
        <button
          type="button"
          aria-label="Close member detail"
          onClick={onClose}
          className="fixed inset-0"
          style={{ zIndex: 102 }}
        />
      )}
 
      {/* ── MEMBER CARD ── */}
      {cardVisible && (
        <div className="flex min-h-full items-start justify-center px-4 pt-16 pb-16" style={{ position: 'relative', zIndex: 103 }}>
          <div className="relative w-full my-8" style={{ maxWidth: '560px' }}>
 
            {/* floating petals around card */}
            {(['🌸', '🌷', '✿', '🌼'] as const).map((p, i) => (
              <span
                key={i}
                className="absolute pointer-events-none z-20"
                style={{
                  fontSize: i >= 2 ? '14px' : '20px',
                  ...[
                    { top: '-10px', left: '20px' },
                    { top: '-8px', right: '30px' },
                    { top: '30px', left: '-12px' },
                    { top: '30px', right: '-10px' },
                  ][i],
                  animation: `swayPetal 2.5s ${i * 0.4}s ease-in-out infinite`,
                }}
              >
                {p}
              </span>
            ))}
 
            {/* window frame */}
            <div
              className="rounded-[18px] overflow-hidden"
              style={{
                border: '2.5px solid #e8c9ce',
                boxShadow: '0 8px 40px rgba(200,140,155,0.3)',
                animation: 'windowOpen 0.55s cubic-bezier(0.34,1.56,0.64,1) both',
              }}
            >
              {/* top bar */}
              <div
                className="flex items-center justify-between px-4 py-2"
                style={{ background: 'linear-gradient(90deg, #FCC0C5 0%, #fbd4b8 50%, #FEEDAA 100%)', borderBottom: '1.5px solid #e8c0c5' }}
              >
                <div className="flex gap-[6px]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#f08080]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#f5c842]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#82d882]" />
                </div>
                <span className="text-[13px] italic" style={{ fontFamily: "'Playfair Display', serif", color: '#7a5c3e', letterSpacing: '0.5px' }}>
                  ✿ Member Card ✿
                </span>
                <button
                  type="button"
                  aria-label="Close member detail"
                  onClick={onClose}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-sm transition-all hover:opacity-80"
                  style={{ border: '1.5px solid #d4a0a8', background: 'white', color: '#7a5c3e' }}
                >
                  ✕
                </button>
              </div>
 
              {/* content */}
              <div style={{ background: '#FFFAEB' }}>
 
                {/* photo section */}
                <div
                  className="relative overflow-hidden flex items-center justify-center"
                  style={{ height: '280px', background: 'linear-gradient(160deg, #fce8ef 0%, #fff5d6 100%)' }}
                >
                  {(['🌷', '🌸', '✿', '🌼', '🌺', '💐'] as const).map((f, i) => (
                    <span
                      key={i}
                      className="absolute pointer-events-none"
                      style={{
                        fontSize: [undefined, '16px', '14px', undefined, '12px', '14px'][i],
                        ...[
                          { top: '10%', left: '8%' },
                          { top: '15%', right: '10%' },
                          { bottom: '15%', left: '12%' },
                          { bottom: '10%', right: '8%' },
                          { top: '50%', left: '3%' },
                          { top: '40%', right: '4%' },
                        ][i],
                        animation: `floatFlower 3s ${i * 0.4}s ease-in-out infinite`,
                      }}
                    >
                      {f}
                    </span>
                  ))}
                  <div
                    className="overflow-hidden"
                    style={{ width: '180px', height: '180px', borderRadius: '50%', border: '4px solid white', boxShadow: '0 4px 20px rgba(200,140,155,0.35)' }}
                  >
                    <Image src={ProfileImage} alt="Profile Image" className="w-full h-full object-cover object-center" />
                  </div>
                </div>
 
                {/* floral divider */}
                <p className="text-center py-2 text-[15px]" style={{ letterSpacing: '6px', color: '#e8909a' }}>
                  ✦ ✿ ✦ ✿ ✦
                </p>
 
                {/* info section */}
                <div className="px-6 pb-6">
                  <h2 className="text-center text-[22px] font-bold mb-1" style={{ fontFamily: "'Playfair Display', serif", color: '#5a3040' }}>
                    Nayla Aisha Hanifa
                  </h2>
                  <p className="text-center text-xs font-medium mb-4" style={{ color: '#c08090' }}>
                    5027251075 · Yogyakarta
                  </p>
 
                  <div className="flex gap-2 justify-center mb-4">
                    {/* Instagram */}
                    <a
                      href="https://instagram.com/nllalaashnfa"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm italic transition-all hover:opacity-75"
                      style={{ background: '#fff0f5', border: '1.5px solid #f0c0d0', color: '#e06090', fontFamily: "'Georgia', serif", textDecoration: 'none' }}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="2" y="2" width="20" height="20" rx="6" stroke="#e06090" strokeWidth="2"/>
                        <circle cx="12" cy="12" r="4.5" stroke="#e06090" strokeWidth="2"/>
                        <circle cx="17.5" cy="6.5" r="1" fill="#e06090"/>
                      </svg>
                      Instagram
                    </a>
                    {/* LinkedIn */}
                    <a
                      href="https://linkedin.com/in/nayla-aisha-hanifa-40472b377"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm italic transition-all hover:opacity-75"
                      style={{ background: '#fff0f5', border: '1.5px solid #f0c0d0', color: '#e06090', fontFamily: "'Georgia', serif", textDecoration: 'none' }}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="2" y="2" width="20" height="20" rx="4" stroke="#e06090" strokeWidth="2"/>
                        <circle cx="7" cy="7.5" r="1" fill="#e06090"/>
                        <path d="M7 10.5v6" stroke="#e06090" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M11 16.5v-3.5c0-1.2.8-2 2-2s2 .8 2 2v3.5" stroke="#e06090" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M11 10.5v6" stroke="#e06090" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                      LinkedIn
                    </a>
                  </div>
 
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    {[
                      { label: '🌸 Hobi',     value: 'Menjadi DD' },
                      { label: '✨ Fun Fact', value: 'Lahir di Jawa tapi ga bisa bahasa Jawa' },
                    ].map(({ label, value }) => (
                      <div key={label} className="rounded-xl p-3 relative overflow-hidden" style={{ background: 'white', border: '1.5px solid #f0d5da' }}>
                        <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-xl" style={{ background: 'linear-gradient(90deg, #FCC0C5, #FEEDAA)' }} />
                        <p className="text-[9px] font-semibold uppercase tracking-widest mb-1" style={{ color: '#c08090' }}>{label}</p>
                        <p className="text-[13px] font-medium leading-snug" style={{ color: '#5a3040' }}>{value}</p>
                      </div>
                    ))}
                  </div>
 
                  <div className="rounded-xl p-3 relative overflow-hidden" style={{ background: 'white', border: '1.5px solid #f0d5da' }}>
                    <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-xl" style={{ background: 'linear-gradient(90deg, #1ed760, #159b45)' }} />
                    <p className="text-[9px] font-semibold uppercase tracking-widest mb-1" style={{ color: '#1a7a3a' }}>🎵 Lagu Favorit</p>
                    <p className="text-sm font-semibold mb-2" style={{ color: '#5a3040' }}>1000X — Ghea Indrawari</p>
                    <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/6xrP29JvvYP5ftteZ7nubf?si=87b18dc9f6fe4282" />
                  </div>
 
                  <p className="text-center pt-4 text-lg" style={{ letterSpacing: '6px', opacity: 0.5 }}>
                    🌷 🌸 🌼 🌷 🌸
                  </p>
                </div>
              </div>
 
              {/* window sill */}
              <div className="h-3" style={{ background: 'linear-gradient(90deg, #e8c9ce, #f5d9c0, #f0e4a0, #f5d9c0, #e8c9ce)', borderTop: '1px solid #d4b0b8' }} />
            </div>
          </div>
        </div>
      )}
 
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&display=swap');
        @keyframes windowOpen {
          0%   { opacity: 0; transform: scale(0.6) translateY(40px); }
          100% { opacity: 1; transform: scale(1)   translateY(0);    }
        }
        @keyframes floatFlower {
          0%, 100% { transform: translateY(0)    rotate(0deg);  }
          50%       { transform: translateY(-10px) rotate(15deg); }
        }
        @keyframes swayPetal {
          0%, 100% { transform: rotate(-10deg) translateY(0);    }
          50%       { transform: rotate(10deg)  translateY(-6px); }
        }
        @keyframes sway {
          0%, 100% { transform: rotate(-5deg); }
          50%       { transform: rotate(5deg);  }
        }
        @keyframes floatUpDown {
          0%, 100% { transform: translateY(0px);   }
          50%       { transform: translateY(-14px); }
        }
      `}</style>
    </div>
  )
}
 
export default MemberPopup