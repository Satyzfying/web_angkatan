'use client'

import React, { useEffect, useState, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'

import Instagram from '@/components/atoms/button/InstagramButtonLink'
import LinkedInButtonLink from '@/components/atoms/button/LinkedInButtonLink'
import SpotifyEmbed from '@/components/molecules/SpotifyEmbed'

import ProfileImage from './image.png'
import virtuosaGif from './gif/virtuosa.gif'
import tauntingGif from './gif/taunting.gif'
import readingGif from './gif/reading.gif'
import trainBg from './req/Train.png'

import customCursor from './cursor/red_cursor.png'
import lanternBlue   from './cursor/blue_cursor.png'
import lanternOrange from './cursor/orange_cursor.png'
import lanternGreen  from './cursor/green_cursor.png'

const random = (min: number, max?: number) => {
  if (max === undefined) { max = min; min = 0 }
  return Math.random() * (max - min) + min
}
const floor = (val: number) => Math.floor(val)

const useSpotlight = () => {
  const [pos, setPos] = useState({ x: -999, y: -999 })
  useEffect(() => {
    const onMove = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])
  return pos
}

const useCreepyWhisper = (active: boolean, intensity: number) => {
  const ctxRef = useRef<AudioContext | null>(null)
  const gainRef = useRef<GainNode | null>(null)
  const pannerRef = useRef<StereoPannerNode | null>(null)

  useEffect(() => {
    if (!active) {
      if (ctxRef.current?.state === 'running') ctxRef.current.suspend()
      return
    }
    if (!ctxRef.current) {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext
      if (!AudioContext) return
      const ctx = new AudioContext()
      const bufferSize = ctx.sampleRate * 2
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
      const data = buffer.getChannelData(0)
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1
      
      const noise = ctx.createBufferSource()
      noise.buffer = buffer
      noise.loop = true

      const filter = ctx.createBiquadFilter()
      filter.type = 'bandpass'
      filter.frequency.value = 800

      const gain = ctx.createGain()
      gain.gain.value = 0

      let panner = null
      if (ctx.createStereoPanner) {
        panner = ctx.createStereoPanner()
        noise.connect(filter).connect(panner).connect(gain).connect(ctx.destination)
      } else {
        noise.connect(filter).connect(gain).connect(ctx.destination)
      }

      noise.start()
      ctxRef.current = ctx
      gainRef.current = gain
      pannerRef.current = panner
    }

    if (ctxRef.current.state === 'suspended') ctxRef.current.resume()
    if (gainRef.current) gainRef.current.gain.setTargetAtTime(intensity * 0.15, ctxRef.current.currentTime, 0.5)
  }, [active, intensity])

  useEffect(() => {
    if (!active || !pannerRef.current) return
    let af: number
    const pan = () => {
      if (pannerRef.current) pannerRef.current.pan.value = Math.sin(Date.now() / 800) * 0.8
      af = requestAnimationFrame(pan)
    }
    pan()
    return () => cancelAnimationFrame(af)
  }, [active])

  useEffect(() => { return () => { ctxRef.current?.close() } }, [])
}

const useJitteredSpot = (baseX: number, baseY: number, active: boolean) => {
  const [jitter, setJitter] = useState({ x: 0, y: 0 })
  
  useEffect(() => {
    if (!active) { setJitter({ x: 0, y: 0 }); return }
    let af: number
    let lastTime = 0
    const tick = (now: number) => {
      if (now - lastTime > 50 + Math.random() * 80) {
        lastTime = now
        const intensity = 3 + Math.random() * 6  
        setJitter({
          x: (Math.random() - 0.5) * intensity * 2,
          y: (Math.random() - 0.5) * intensity * 2,
        })
      }
      af = requestAnimationFrame(tick)
    }
    af = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(af)
  }, [active])

  return { x: baseX + jitter.x, y: baseY + jitter.y }
}

const useLanternGlitch = (active: boolean) => {
  const [errorLantern, setErrorLantern] = useState<LanternId | null>(null)
  const [flickerOpacity, setFlickerOpacity] = useState(1)

  useEffect(() => {
    if (!active) { setErrorLantern(null); setFlickerOpacity(1); return }

    let tid: NodeJS.Timeout

    const scheduleGlitch = () => {
      tid = setTimeout(() => {
        const lanterns: LanternId[] = ['red', 'blue', 'orange', 'green']
        const victim = lanterns[Math.floor(Math.random() * lanterns.length)]
        setErrorLantern(victim)

        let count = 0
        const maxFlicker = 3 + Math.floor(Math.random() * 5)
        const flicker = () => {
          setFlickerOpacity(prev => prev < 0.5 ? 1 : Math.random() * 0.3)
          count++
          if (count < maxFlicker) {
            setTimeout(flicker, 60 + Math.random() * 120)
          } else {
            const rng = Math.random()
            
            if (rng > 0.8) {
              setFlickerOpacity(0)
              document.body.classList.add('blackout-cursor')
              
              setTimeout(() => {
                setFlickerOpacity(1)
                setErrorLantern(null)
                document.body.classList.remove('blackout-cursor') 
              }, 1500 + Math.random() * 1000)
              
            } else if (rng > 0.4) {
              setFlickerOpacity(0)
              setTimeout(() => {
                setFlickerOpacity(1)
                setErrorLantern(null)
              }, 300 + Math.random() * 600)
              
            } else {
              setFlickerOpacity(1)
              setErrorLantern(null)
            }
          }
        }
        flicker()
        scheduleGlitch()
      }, 4000 + Math.random() * 6000)
    }

    scheduleGlitch()
    return () => clearTimeout(tid)
  }, [active])

  return { errorLantern, flickerOpacity }
}

type LanternId = 'red' | 'blue' | 'orange' | 'green'

interface LanternConfig {
  id: LanternId
  r: number; g: number; b: number
}

const CORNER_LANTERNS: { tl: LanternConfig; tr: LanternConfig; bl: LanternConfig; br: LanternConfig } = {
  tl: { id: 'red',    r: 200, g: 40, b: 20 }, 
  tr: { id: 'blue',   r: 64,  g: 210, b: 210 },   
  bl: { id: 'orange', r: 220, g: 150, b: 40  },   
  br: { id: 'green',  r: 80,  g: 160, b: 80  },   
}

const useCornerLantern = (active: boolean, cardRef: React.RefObject<HTMLDivElement>, spotX: number, spotY: number) => {
  const [activeLantern, setActiveLantern] = useState<LanternId>('red')
  const [blendedRgb, setBlendedRgb] = useState({ r: 200, g: 30, b: 30 }) 
  const [glitchPhase, setGlitchPhase] = useState(0)

  useEffect(() => {
    if (!active) return
    let af: number; let t = 0
    const tick = () => { t += 0.06; setGlitchPhase(t); af = requestAnimationFrame(tick) }
    af = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(af)
  }, [active])

  useEffect(() => {
    if (!active) {
    setActiveLantern('red')
    setBlendedRgb({ r: 200, g: 30, b: 30 })
    return
    }
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return

    const nx = Math.max(0, Math.min(1, (spotX - rect.left) / rect.width))
    const ny = Math.max(0, Math.min(1, (spotY - rect.top)  / rect.height))

    const wTL = (1 - nx) * (1 - ny)
    const wTR =      nx  * (1 - ny)
    const wBL = (1 - nx) * ny
    const wBR =      nx  * ny

    const weights = [
      { id: 'tl' as const, w: wTL },
      { id: 'tr' as const, w: wTR },
      { id: 'bl' as const, w: wBL },
      { id: 'br' as const, w: wBR },
    ]
    const dominant = weights.reduce((a, b) => a.w > b.w ? a : b)

    const activeData = CORNER_LANTERNS[dominant.id]

    setActiveLantern(activeData.id)

    setBlendedRgb({ r: activeData.r, g: activeData.g, b: activeData.b })
  }, [active, spotX, spotY, cardRef])

  return { activeLantern, blendedRgb, glitchPhase }
}

const useCardParallax = (ref: React.RefObject<HTMLDivElement>, active: boolean) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0, scale: 1 })

  useEffect(() => {
    if (!active) { setTilt({ x: 0, y: 0, scale: 1 }); return }
    const el = ref.current
    if (!el) return

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width  / 2
      const cy = rect.top  + rect.height / 2
      const dx = (e.clientX - cx) / (rect.width  / 2)  
      const dy = (e.clientY - cy) / (rect.height / 2)  

      const inside =
        e.clientX >= rect.left && e.clientX <= rect.right &&
        e.clientY >= rect.top  && e.clientY <= rect.bottom

      setTilt({
        x:     inside ? dy * -6 : 0,   
        y:     inside ? dx *  6 : 0,   
        scale: inside ? 1.015   : 1,
      })
    }

    const onLeave = () => setTilt({ x: 0, y: 0, scale: 1 })

    window.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      window.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [active, ref])

  return tilt
}

const useTypewriter = (text: string, speed = 35) => {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)
  const indexRef = useRef(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setDisplayed('')
    setDone(false)
    indexRef.current = 0
    const type = () => {
      indexRef.current++
      setDisplayed(text.slice(0, indexRef.current))
      if (indexRef.current < text.length) {
        const char = text[indexRef.current - 1]
        const delay = char === '.' || char === ',' || char === '!' || char === '?' ? speed * 6 : speed
        timerRef.current = setTimeout(type, delay)
      } else {
        setDone(true)
      }
    }
    timerRef.current = setTimeout(type, 80)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [text, speed])

  const skip = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setDisplayed(text)
    setDone(true)
  }, [text])

  return { displayed, done, skip }
}

type SceneNode =
  | { type: 'dialog'; speaker: string; text: string; next: string }
  | { type: 'input'; speaker: string; prompt: string; placeholder: string; next: (val: string) => string }
  | { type: 'choice'; speaker: string; text: string; choices: { label: string; next: string }[] }
  | { type: 'end' }

const SCRIPT: Record<string, SceneNode> = {
  s01: { type: 'dialog', speaker: 'Kamu', text: '.....', next: 's02' },
  s02: { type: 'dialog', speaker: 'Kamu', text: 'haloo?', next: 's03' },
  s03: { type: 'dialog', speaker: 'Kamu', text: 'ada orang disini?', next: 's04' },
  s04: { type: 'dialog', speaker: '—', text: '.....', next: 's05' },
  s05: { type: 'dialog', speaker: 'Kamu', text: 'haloooo!!', next: 's06' },
  s06: { type: 'dialog', speaker: '—', text: '....', next: 's07' },

  s07: {
    type: 'choice', speaker: 'Kamu', text: '(Melihat sesuatu tertinggal di atas kursi...)',
    choices: [
      { label: 'Mengambil buku bersampul merah gelap.', next: 's08_buku' },
      { label: 'Mengambil foto usang yang terbalik.', next: 's08_foto' },
    ]
  },

  s08_buku: { type: 'dialog', speaker: 'Kamu', text: 'Sebuah buku...? Halamannya penuh coretan teks yang... berdarah?', next: 's09' },
  s08_foto: { type: 'dialog', speaker: 'Kamu', text: 'Sebuah foto...? Wajah orang di foto ini... tergores hancur.', next: 's09' },

  s09: { type: 'dialog', speaker: '—', text: '.....', next: 's10' },
  s10: { type: 'dialog', speaker: '???', text: 'hi, kamu!', next: 's11' },
  s11: { type: 'dialog', speaker: 'Kamu', text: '!!!!', next: 's12' },
  s12: { type: 'dialog', speaker: 'Kamu', text: 'Siapa disana!', next: 's13' },
  s13: { type: 'dialog', speaker: '—', text: '[ Suara bisikan statis terdengar tepat di telingamu ]', next: 's14' },
  s14: { type: 'dialog', speaker: 'Kamu', text: 'keluar kamu!!', next: 's15' },
  s15: { type: 'dialog', speaker: '???', text: 'aku ingat kamu...', next: 's16' },
  s16: { type: 'dialog', speaker: '???', text: 'apakah kamu mengingatku?', next: 's17_a' },
  s17_a: { type: 'dialog', speaker: '???', text: 'Kau sedang memegang barang milikku...', next: 's17' },
  s17: { type: 'dialog', speaker: 'Kamu', text: 'Kamu kan... lylera?', next: 's18' },
  s18: { type: 'dialog', speaker: 'Lylera', text: 'benar. kamu adalah', next: 's19' },

  s19: { type: 'input', speaker: 'Lylera', prompt: '...', placeholder: 'Ketik namamu...', next: (v) => 's20' },

  s20: { type: 'dialog', speaker: 'Lylera', text: '{{name}}...', next: 's21' },
  s21: { type: 'dialog', speaker: 'Lylera', text: 'Sudah lama sekali sejak terakhir kali ada yang berani menyentuh ingatanku.', next: 's22' },
  s22: { type: 'dialog', speaker: 'Kamu', text: 'Ingatan...? Maksudmu barang yang sedang kupegang ini?', next: 's23' },
  s23: { type: 'dialog', speaker: 'Lylera', text: 'Membaca cerita-cerita yang kutinggalkan.', next: 's24' },
  s24: { type: 'dialog', speaker: 'Kamu', text: 'Cerita? Tapi tempat ini... apa yang sebenarnya terjadi?', next: 's25' },
  s25: { type: 'dialog', speaker: 'Lylera', text: 'Batas antara cerita dan kenyataan sudah lama hancur di sini.', next: 's26' },
  s26: { type: 'dialog', speaker: 'Lylera', text: 'Dan karena kau sudah menyentuhnya... dan menyebut namaku...', next: 's27' },
  s27: { type: 'dialog', speaker: 'Lylera', text: 'Sistem ini tidak akan membiarkanmu pergi begitu saja.', next: 's28' },
  
  s28: { type: 'choice', speaker: 'Kamu', text: '...', choices: [
    { label: 'Aku tidak takut.', next: 's29_brave' },
    { label: 'Tolong, lepaskan aku. Aku kembalikan barang ini!', next: 's29_scared' }
  ]},
  
  s29_brave: { type: 'dialog', speaker: 'Lylera', text: 'Sempurna. Karena aku butuh wadah baru.', next: 's30' },
  s29_scared: { type: 'dialog', speaker: 'Lylera', text: 'Sia-sia. Berhentilah menggerakkan mouse-mu, tidak ada gunanya.', next: 's30' },
  
  s30: { type: 'dialog', speaker: 'Lylera', text: 'Dunia ini sudah terlalu sempit untukku.', next: 's31' },
  s31: { type: 'dialog', speaker: 'Lylera', text: 'Jadi...', next: 's32' },
  s32: { type: 'dialog', speaker: 'Lylera', text: 'Biar aku yang mengambil alih ceritamu, {{name}}.', next: 's33' },
  s33: { type: 'dialog', speaker: 'Lylera', text: 'Menjeritlah di akhir ceritamu... D̵A̸N̴ ̶I̷N̶I̶ ̴A̷D̶A̶L̴A̷H̶ ̷A̷W̸A̸L̶ ̸K̷I̸S̸A̸H̴ ̷B̷A̴R̵U̷M̴U̷ ̴U̷N̸T̷U̴K̸ ̴M̴E̵N̷J̷A̶D̷I̴ ̶T̴E̴M̸A̸N̵ ̴B̵E̷R̶M̷A̶I̶N̵K̶U̴!̸', next: 'end' },
  end: { type: 'end' }
}

const LANTERN_CURSOR_STYLES = (
  redSrc: string,
  blueSrc: string,
  orangeSrc: string,
  greenSrc: string
) => `
  * { cursor: url('${redSrc}') 16 16, auto !important; }
  button, input, a, .vn-choice-btn, .vn-submit-btn { cursor: url('${redSrc}') 16 16, pointer !important; }

  .lantern-cursor-blue * { cursor: url('${blueSrc}') 16 16, auto !important; }
  .lantern-cursor-blue button, .lantern-cursor-blue input, .lantern-cursor-blue a, .lantern-cursor-blue .vn-choice-btn, .lantern-cursor-blue .vn-submit-btn { cursor: url('${blueSrc}') 16 16, pointer !important; }

  .lantern-cursor-orange * { cursor: url('${orangeSrc}') 16 16, auto !important; }
  .lantern-cursor-orange button, .lantern-cursor-orange input, .lantern-cursor-orange a, .lantern-cursor-orange .vn-choice-btn, .lantern-cursor-orange .vn-submit-btn { cursor: url('${orangeSrc}') 16 16, pointer !important; }

  .lantern-cursor-green * { cursor: url('${greenSrc}') 16 16, auto !important; }
  .lantern-cursor-green button, .lantern-cursor-green input, .lantern-cursor-green a, .lantern-cursor-green .vn-choice-btn, .lantern-cursor-green .vn-submit-btn { cursor: url('${greenSrc}') 16 16, pointer !important; }
`

const SHARED_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=IM+Fell+English:ital@0;1&display=swap');
  
  @keyframes vn-flicker        { 0%,100%{opacity:1} 92%{opacity:1} 93%{opacity:0.85} 94%{opacity:1} 97%{opacity:0.9} 98%{opacity:1} }
  @keyframes vn-bloom          { 0%,100%{opacity:0.55;transform:scale(1)} 50%{opacity:0.7;transform:scale(1.08)} }
  @keyframes vn-namein         { from{opacity:0;transform:translateX(-6px)} to{opacity:1;transform:translateX(0)} }
  @keyframes vn-boxin          { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
  @keyframes vn-cursorblink    { 0%,100%{opacity:1} 50%{opacity:0} }
  @keyframes vn-advance-bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(4px)} }
  @keyframes vn-grain          { 0%,100%{transform:translate(0,0)} 10%{transform:translate(-1%,1%)} 30%{transform:translate(1%,-1%)} 50%{transform:translate(-0.5%,0.5%)} 70%{transform:translate(0.5%,-0.5%)} 90%{transform:translate(-1%,0)} }
  @keyframes vn-choice-in      { from{opacity:0;transform:translateX(-10px)} to{opacity:1;transform:translateX(0)} }
  @keyframes vn-scanline       { 0%{transform:translateY(-100%)} 100%{transform:translateY(100vh)} }

  @keyframes glitchAnim1     { 0%{clip-path:inset(20% 0 80% 0);transform:translate(-4px,2px)} 20%{clip-path:inset(60% 0 10% 0);transform:translate(4px,-2px)} 40%{clip-path:inset(40% 0 50% 0);transform:translate(-4px,1px)} 60%{clip-path:inset(80% 0 5% 0);transform:translate(4px,-1px)} 80%{clip-path:inset(10% 0 70% 0);transform:translate(-2px,2px)} 100%{clip-path:inset(30% 0 50% 0);transform:translate(2px,-2px)} }
  @keyframes glitchAnim2     { 0%{clip-path:inset(10% 0 50% 0);transform:translate(8px,-4px) skewX(5deg)} 30%{clip-path:inset(70% 0 10% 0);transform:translate(-6px,2px) skewX(-5deg)} 60%{clip-path:inset(30% 0 40% 0);transform:translate(4px,6px) skewX(2deg)} 100%{clip-path:inset(50% 0 30% 0);transform:translate(-8px,-2px) skewX(-2deg)} }
  @keyframes glitchAnim3     { 0%{clip-path:inset(45% 0 45% 0);transform:translate(-2px,1px)} 25%{clip-path:inset(15% 0 80% 0);transform:translate(2px,-1px)} 50%{clip-path:inset(85% 0 10% 0);transform:translate(-2px,-1px)} 75%{clip-path:inset(35% 0 60% 0);transform:translate(2px,1px)} 100%{clip-path:inset(5% 0 90% 0);transform:translate(-1px,2px)} }
  @keyframes glitchAnim4     { 0%{clip-path:inset(0 0 0 0);transform:scaleY(1.05) skewY(2deg)} 20%{clip-path:inset(40% 0 40% 0);transform:translateX(-15px) skewY(-5deg);filter:invert(1)} 40%{clip-path:inset(80% 0 10% 0);transform:translateX(15px);filter:hue-rotate(90deg)} 60%{clip-path:inset(10% 0 80% 0);transform:scaleY(0.85)} 80%{clip-path:inset(50% 0 30% 0);transform:skewX(-15deg)} 100%{clip-path:inset(0 0 0 0);transform:scaleY(1) skewY(0)} }
  @keyframes glitchAnim5     { 0%{clip-path:inset(0 0 0 0);transform:translateY(-5px)} 20%{clip-path:inset(5% 0 95% 0);transform:translateY(10px);filter:grayscale(1) brightness(2) contrast(3)} 40%{clip-path:inset(90% 0 5% 0);transform:translateY(-15px)} 60%{clip-path:inset(40% 0 40% 0);transform:translateY(5px);filter:grayscale(1) brightness(0.2)} 80%{clip-path:inset(0 0 0 0);transform:translateY(15px)} 100%{clip-path:inset(10% 0 10% 0);transform:translateY(-5px);filter:grayscale(1) contrast(5)} }
  @keyframes shakeGlobal     { 10%,90%{transform:translate3d(-2px,0,0)} 20%,80%{transform:translate3d(4px,0,0)} 30%,50%,70%{transform:translate3d(-8px,0,0)} 40%,60%{transform:translate3d(8px,0,0)} }
  @keyframes borderFlicker   { 0%{box-shadow:0 0 10px rgba(200,0,50,0.2);border-color:rgba(200,0,50,0.8)} 50%{box-shadow:0 0 25px rgba(255,0,50,0.6),inset 0 0 15px rgba(255,0,0,0.1);border-color:rgba(255,20,60,1)} 100%{box-shadow:0 0 15px rgba(200,0,50,0.3);border-color:rgba(180,0,40,0.9)} }
  @keyframes corruptBorder   { 0%{box-shadow:0 0 20px rgba(255,0,0,0.5),inset 0 0 10px rgba(200,0,0,0.15);border-color:rgba(255,0,50,0.9)} 50%{box-shadow:0 0 50px rgba(255,0,0,0.9),inset 0 0 25px rgba(200,0,0,0.3);border-color:rgba(255,80,0,1)} 100%{box-shadow:0 0 30px rgba(200,0,0,0.6),inset 0 0 15px rgba(255,0,0,0.2);border-color:rgba(200,0,30,0.95)} }
  @keyframes corruptionShake { 0%,100%{transform:translate(0,0) skewX(0)} 10%{transform:translate(-3px,1px) skewX(-2deg)} 20%{transform:translate(4px,-2px) skewX(3deg)} 30%{transform:translate(-2px,3px) skewX(-1deg)} 40%{transform:translate(5px,-1px) skewX(2deg)} 50%{transform:translate(-4px,2px) skewX(-3deg)} 60%{transform:translate(2px,-3px) skewX(1deg)} 70%{transform:translate(-5px,1px) skewX(-2deg)} 80%{transform:translate(3px,2px) skewX(3deg)} 90%{transform:translate(-1px,-2px) skewX(-1deg)} }
  @keyframes scanline        { 0%{transform:translateY(-100%)} 100%{transform:translateY(100vh)} }
  @keyframes rgbSplit        { 0%,100%{text-shadow:-3px 0 red,3px 0 cyan} 25%{text-shadow:3px 0 red,-3px 0 cyan} 50%{text-shadow:-5px 0 magenta,5px 0 yellow} 75%{text-shadow:5px 0 magenta,-5px 0 yellow} }
  @keyframes boxGlitch       { 0%,100%{transform:skewX(0) translateX(0)} 20%{transform:skewX(-3deg) translateX(-5px)} 40%{transform:skewX(2deg) translateX(8px)} 60%{transform:skewX(-1deg) translateX(-3px)} 80%{transform:skewX(3deg) translateX(5px)} }
  @keyframes textFlicker     { 0%,19%,21%,23%,25%,54%,56%,100%{opacity:1} 20%,24%,55%{opacity:0.3} }
  @keyframes pfpGlitchIn     { 0%{filter:brightness(0) invert(1);transform:scaleX(1.1) skewX(-5deg)} 20%{filter:hue-rotate(180deg) saturate(500%) contrast(200%);transform:scaleX(0.95) skewX(3deg)} 40%{filter:invert(1);transform:scaleX(1.05) skewX(-2deg)} 60%{filter:hue-rotate(90deg) saturate(300%);transform:scaleX(1)} 80%{filter:contrast(150%);transform:scaleX(1) skewX(0)} 100%{filter:none;transform:scaleX(1) skewX(0)} }
  @keyframes horrorBgPulse { 0%{opacity:0.5} 15%{opacity:0.3}   16%{opacity:0.5}40%{opacity:0.4} 41%{opacity:0.15} 42%{opacity:0.4} 70%{opacity:0.25} 100%{opacity:0.5} }
  @keyframes horrorOrbFloat1 { 0%,100%{transform:translate(0,0) scale(1);opacity:0.12} 33%{transform:translate(-40px,30px) scale(1.15);opacity:0.18} 66%{transform:translate(30px,-20px) scale(0.9);opacity:0.08} }
  @keyframes horrorOrbFloat2 { 0%,100%{transform:translate(0,0) scale(1);opacity:0.08} 50%{transform:translate(50px,40px) scale(1.2);opacity:0.15} }
  @keyframes horrorOrbFloat3 { 0%,100%{transform:translate(0,0) scale(1.1);opacity:0.10} 40%{transform:translate(-30px,-50px) scale(0.85);opacity:0.06} 75%{transform:translate(20px,30px) scale(1.3);opacity:0.14} }
  @keyframes grainShift      { 0%,100%{transform:translate(0,0)} 10%{transform:translate(-2%,-1%)} 20%{transform:translate(1%,2%)} 30%{transform:translate(-1%,1%)} 40%{transform:translate(2%,-2%)} 50%{transform:translate(-1%,0)} 60%{transform:translate(1%,-1%)} 70%{transform:translate(0,2%)} 80%{transform:translate(-2%,1%)} 90%{transform:translate(1%,-1%)} }
  @keyframes cardCursorPulse { 0%,100%{opacity:0.85} 50%{opacity:1} }
  @keyframes tearLeft  { 0%{transform:translateX(0) rotate(0) translateY(0);opacity:1} 60%{transform:translateX(-120px) rotate(-18deg) translateY(20px);opacity:1} 100%{transform:translateX(-180px) rotate(-25deg) translateY(120px);opacity:0} }
  @keyframes tearRight { 0%{transform:translateX(0) rotate(0) translateY(0);opacity:1} 60%{transform:translateX(120px) rotate(18deg) translateY(20px);opacity:1} 100%{transform:translateX(180px) rotate(25deg) translateY(120px);opacity:0} }
  @keyframes tearLineAppear { 0%{scaleY:0;opacity:0} 100%{scaleY:1;opacity:1} }
  @keyframes bg-monochrome-glitch {
    0%  { filter: grayscale(1) brightness(0.25) contrast(2) sepia(0.4) hue-rotate(-20deg);   transform: translate3d(4px, 2px, 0) skewX(2deg); }
    25% { filter: grayscale(0.6) brightness(0.35) contrast(3) sepia(0.8) hue-rotate(-30deg); transform: translate3d(-4px, -2px, 0) skewX(-3deg); }
    50% { filter: grayscale(1) brightness(0.08) contrast(1.5);                                transform: translate3d(0px, 6px, 0) skewX(1deg); }
    75% { filter: grayscale(0.7) brightness(0.3) contrast(4) sepia(1) hue-rotate(-40deg);    transform: translate3d(-2px, -4px, 0) skewX(-2deg); }
    100%{ filter: grayscale(1) brightness(0.2) contrast(2.5) sepia(0.3) hue-rotate(-15deg);  transform: translate3d(2px, 2px, 0) skewX(0deg); }
  }

  .vn-flicker        { animation: vn-flicker 8s ease-in-out infinite }
  .vn-bloom-anim     { animation: vn-bloom 3s ease-in-out infinite }
  .vn-grain-layer    { animation: vn-grain 0.15s steps(1) infinite; background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E"); background-size:180px 180px }
  .vn-speaker-tag    { animation: vn-namein 0.25s ease-out both }
  .vn-box            { animation: vn-boxin 0.3s ease-out both }
  .vn-cursor-blink   { animation: vn-cursorblink 0.8s ease-in-out infinite }
  .vn-advance-arrow  { animation: vn-advance-bounce 1s ease-in-out infinite }
  .vn-choice-btn     { animation: vn-choice-in 0.3s ease-out both; transition: background 0.15s, transform 0.1s, border-color 0.15s }
  .vn-choice-btn:hover { background: rgba(210,80,100,0.18) !important; border-color: rgba(210,80,100,0.8) !important; transform: translateX(4px) }
  .vn-scanline-sweep { animation: vn-scanline 6s linear infinite }
  .vn-input-field    { background:rgba(0,0,0,0.5); border:none; border-bottom:1.5px solid rgba(210,80,100,0.6); color:#f0e8e8; outline:none; font-family:'IM Fell English',Georgia,serif; font-size:15px; padding:6px 2px; width:100%; caret-color:rgba(210,80,100,0.9); transition:border-color 0.2s }
  .vn-input-field:focus { border-bottom-color:rgba(210,80,100,1) }
  .vn-input-field::placeholder { color:rgba(200,160,160,0.4); font-style:italic }
  .vn-submit-btn     { background:rgba(210,80,100,0.15); border:1px solid rgba(210,80,100,0.5); color:rgba(210,80,100,0.9); font-family:'IM Fell English',Georgia,serif; font-size:13px; padding:6px 18px; cursor:pointer; letter-spacing:0.1em; transition:background 0.15s, border-color 0.15s }
  .vn-submit-btn:hover { background:rgba(210,80,100,0.28); border-color:rgba(210,80,100,0.9) }

  .crt-texture { position:absolute; top:0; left:0; width:100%; height:100%; pointer-events:none; z-index:0; background:linear-gradient(to bottom,rgba(255,255,255,0),rgba(255,255,255,0) 50%,rgba(0,0,0,0.2) 50%,rgba(0,0,0,0.2)); background-size:100% 4px; border-radius:inherit }
  .crt-texture::after { content:" "; display:block; position:absolute; top:0; left:0; bottom:0; right:0; background:radial-gradient(circle,rgba(0,0,0,0) 60%,rgba(10,0,0,0.8) 100%); border-radius:inherit }

  .vn-horror-box { border-top-width:2px; border-left-width:4px; border-right-width:4px; border-bottom-width:8px; animation:borderFlicker 3s infinite alternate-reverse; background-color:#050001 }
  .vn-horror-box.playing-virtuosa-mode { animation:corruptBorder 0.4s infinite alternate-reverse !important }

  .card-tear-base { animation:shakeGlobal 0.2s cubic-bezier(.36,.07,.19,.97) both }
  .card-tear-base::before,.card-tear-base::after { content:""; position:absolute; top:0; left:0; width:100%; height:100%; background:inherit; pointer-events:none; z-index:-1; border-radius:inherit }
  .card-tear-1 { filter:saturate(150%) contrast(120%) hue-rotate(-10deg); box-shadow:-5px 0 0 rgba(255,0,0,0.7),5px 0 0 rgba(0,255,255,0.7) !important }
  .card-tear-1::before { left:4px; animation:glitchAnim1 0.2s infinite linear alternate-reverse; background:rgba(20,0,0,0.2) }
  .card-tear-1::after  { left:-4px; animation:glitchAnim1 0.3s infinite linear alternate-reverse; background:rgba(0,0,20,0.2) }
  .card-tear-2 { filter:sepia(0.8) hue-rotate(-50deg) saturate(200%); box-shadow:0 10px 0 rgba(255,0,0,0.8) !important }
  .card-tear-2::before { top:6px; animation:glitchAnim2 0.25s infinite steps(2) alternate-reverse; background:rgba(50,0,0,0.3) }
  .card-tear-2::after  { top:-6px; animation:glitchAnim2 0.15s infinite steps(2) alternate-reverse; background:rgba(10,0,0,0.4) }
  .card-tear-3 { filter:invert(0.2) contrast(150%); box-shadow:-4px 0 0 rgba(0,255,0,0.6),4px 0 0 rgba(255,0,255,0.6) !important }
  .card-tear-3::before { left:2px; animation:glitchAnim3 0.1s infinite linear alternate-reverse; background:rgba(0,20,0,0.2) }
  .card-tear-3::after  { left:-2px; animation:glitchAnim3 0.1s infinite linear alternate-reverse; background:rgba(20,0,20,0.2) }
  .card-tear-4 { filter:grayscale(0.8) contrast(200%) brightness(1.2); box-shadow:-8px 8px 0 rgba(255,255,0,0.6),8px -8px 0 rgba(0,0,255,0.6) !important }
  .card-tear-4::before { top:3px; animation:glitchAnim4 0.15s infinite steps(1) alternate-reverse; background:rgba(50,50,0,0.3) }
  .card-tear-4::after  { top:-3px; animation:glitchAnim4 0.1s infinite steps(2) alternate-reverse; background:rgba(0,0,50,0.3) }
  .card-tear-5 { filter:grayscale(100%) contrast(300%); box-shadow:0 0 20px rgba(255,255,255,0.5) !important }
  .card-tear-5::before { top:2px; animation:glitchAnim5 0.1s infinite steps(2) alternate-reverse; background:rgba(255,255,255,0.1); mix-blend-mode:overlay }
  .card-tear-5::after  { top:-2px; animation:glitchAnim5 0.12s infinite steps(1) alternate; background:rgba(0,0,0,0.8) }
  .tear-left  { animation: tearLeft  0.9s cubic-bezier(0.4,0,0.2,1) forwards }
  .tear-right { animation: tearRight 0.9s cubic-bezier(0.4,0,0.2,1) forwards }
  .corruption-container { animation:corruptionShake 0.15s infinite steps(2) }
  .scanline-sweep       { animation:scanline 2s linear infinite }
  .rgb-split-text       { animation:rgbSplit 0.1s infinite steps(2) }
  .box-glitch           { animation:boxGlitch 0.12s infinite steps(3) }
  .text-flicker         { animation:textFlicker 2s infinite }
  .pfp-glitch-in        { animation:pfpGlitchIn 0.6s ease-out forwards }

  .horror-bg-radial { background:radial-gradient(ellipse 80% 60% at 50% 40%,rgba(8,0,0,1) 0%,rgba(3,0,0,1) 60%,rgba(0,0,0,1) 100%); animation:horrorBgPulse 5s ease-in-out infinite }
  .horror-bg-vignette { background:radial-gradient(ellipse at center,transparent 35%,rgba(80,0,0,0.25) 70%,rgba(40,0,0,0.55) 100%) }
  .horror-bg-grain    { width:105%; height:105%; top:-2.5%; left:-2.5%; animation:grainShift 0.08s steps(1) infinite; background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E"); background-size:200px 200px; opacity:0.04; mix-blend-mode:overlay }
  .horror-orb         { border-radius:50%; filter:blur(80px); pointer-events:none }
  .horror-orb-1       { width:600px; height:400px; top:10%; left:20%; background:rgba(60,0,0,0.06); animation:horrorOrbFloat1 8s ease-in-out infinite }
  .horror-orb-2       { width:400px; height:500px; top:40%; right:10%; background:rgba(30,0,0,0.05); animation:horrorOrbFloat2 11s ease-in-out infinite }
  .horror-orb-3       { width:500px; height:300px; bottom:15%; left:5%; background:rgba(40,0,10,0.04); animation:horrorOrbFloat3 9s ease-in-out infinite }

  .card-cursor-glow { animation: cardCursorPulse 2s ease-in-out infinite; pointer-events:none; mix-blend-mode:screen }
  .blackout-cursor, .blackout-cursor * { cursor: none !important; }
  .monochrome-glitch-active {
    animation: bg-monochrome-glitch 0.12s steps(2) infinite;
    z-index: 5;
  }
`

const GlitchCanvas = ({ src }: { src: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return
    let afId: number
    let onResize: (() => void) | undefined

    const img = new window.Image()
    img.crossOrigin = 'Anonymous'
    img.src = src
    img.onload = () => {
      const upd = () => {
        if (!canvas.parentElement) return null
        const w = canvas.parentElement.offsetWidth
        const h = canvas.parentElement.offsetHeight
        canvas.width = w; canvas.height = h
        return { w, h }
      }
      const sz = upd(); if (!sz) return
      let { w, h } = sz
      onResize = () => { const n = upd(); if (n) { w = n.w; h = n.h } }  
      window.addEventListener('resize', onResize)
      ctx.drawImage(img, 0, 0, w, h)
      const orig = new Uint8ClampedArray(ctx.getImageData(0, 0, w, h).data)

      class G {
        w: number; h: number; fl: any[]; sl: any[]; sr: any[]; sc: any[]; tf: boolean
        constructor(w: number, h: number) {
          this.w = w; this.h = h; this.tf = true
          this.fl = [{ t1: floor(random(1000)), speed: floor(random(2, 12)), randX: floor(random(10, 40)) }]
          this.sl = Array(3).fill(null); this.sr = [null]
          this.sc = Array(2).fill({ startX: 0, startY: 0, rectW: 0, rectH: 0, x: 0, y: 0 })
        }
        flowLine(p: Uint8ClampedArray, o: any) {
          const d = new Uint8ClampedArray(p); o.t1 %= this.h; o.t1 += o.speed
          const ty = floor(o.t1)
          for (let y = 0; y < this.h; y++) if (ty === y) for (let x = 0; x < this.w; x++) {
            const i = (y * this.w + x) * 4
            d[i] = p[i] + o.randX; d[i + 1] = p[i + 1] + o.randX; d[i + 2] = p[i + 2] + o.randX
          }
          return d
        }
        shiftLine(p: Uint8ClampedArray) {
          const d = new Uint8ClampedArray(p)
          const mn = floor(random(0, this.h)), mx = mn + floor(random(1, this.h - mn))
          const ox = 4 * floor(random(-20, 20))
          for (let y = mn; y < mx; y++) for (let x = 0; x < this.w; x++) {
            const i = (y * this.w + x) * 4, t = i + ox
            if (t >= 0 && t < d.length) { d[i] = p[t]; d[i + 1] = p[t + 1]; d[i + 2] = p[t + 2] }
          }
          return d
        }
        shiftRGB(p: Uint8ClampedArray) {
          const d = new Uint8ClampedArray(p), rg = 8
          const rR = (floor(random(-rg, rg)) * this.w + floor(random(-rg, rg))) * 4
          const rG = (floor(random(-rg, rg)) * this.w + floor(random(-rg, rg))) * 4
          const rB = (floor(random(-rg, rg)) * this.w + floor(random(-rg, rg))) * 4
          for (let i = 0; i < p.length; i += 4) {
            let r2 = (i + rR) % p.length, g2 = (i + 1 + rG) % p.length, b2 = (i + 2 + rB) % p.length
            if (r2 < 0) r2 += p.length; if (g2 < 0) g2 += p.length; if (b2 < 0) b2 += p.length
            d[i] = p[r2]; d[i + 1] = p[g2]; d[i + 2] = p[b2]
          }
          return d
        }
        show() {
          let cp = new Uint8ClampedArray(orig)
          if (floor(random(100)) > 90 && this.tf) { this.tf = false; setTimeout(() => { this.tf = true }, floor(random(100, 800))) }
          if (!this.tf) { ctx!.putImageData(new ImageData(cp, this.w, this.h), 0, 0); return }
          this.fl.forEach((v) => { cp = this.flowLine(cp, v) })
          this.sl.forEach((v, i, a) => { if (floor(random(100)) > 60) { a[i] = this.shiftLine(cp); cp = a[i] } else if (a[i]) cp = a[i] })
          this.sr.forEach((v, i, a) => { if (floor(random(100)) > 75) { a[i] = this.shiftRGB(cp); cp = a[i] } })
          ctx!.putImageData(new ImageData(cp, this.w, this.h), 0, 0)
          this.sc.forEach((o) => {
            if (floor(random(100)) > 85) {
              o.x = floor(random(-this.w * 0.2, this.w * 0.8)); o.y = floor(random(-this.h * 0.1, this.h))
              o.startX = floor(random(0, this.w - 30)); o.startY = floor(random(0, this.h - 50))
              o.rectW = floor(random(30, this.w - o.startX)); o.rectH = floor(random(1, 30))
            }
            if (o.rectW > 0) ctx!.drawImage(canvas!, o.startX, o.startY, o.rectW, o.rectH, o.x, o.y, o.rectW, o.rectH)
          })
        }
      }

      const g = new G(w, h)
      const render = () => { ctx.clearRect(0, 0, w, h); g.show(); afId = requestAnimationFrame(render) }
      render()
    }
    return () => {
    cancelAnimationFrame(afId)
    if (onResize) window.removeEventListener('resize', onResize)
    }
  }, [src])

  return <canvas ref={canvasRef} className="h-120 w-full object-cover object-center" />
}

type OuterBgProps = {
  spotX: number
  spotY: number
  mode: 'train' | 'horror'
  visible?: boolean
  intenseGlitch?: boolean
}

const OuterBg = ({ spotX, spotY, mode, visible = true, intenseGlitch = false }: OuterBgProps) => {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (mode !== 'horror' || !videoRef.current) return
    const vid = videoRef.current
    vid.volume = 0.3
    vid.play().catch(() => { })
  }, [mode])

  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-black"
      style={{ opacity: visible ? 1 : 0, transition: 'opacity 1.2s ease' }}
    >
      {mode === 'train' && (
      <>
        <img
          src={trainBg.src}
          alt=""
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center',
            filter: intenseGlitch
              ? 'none'
              : 'brightness(0.35) saturate(0.4) sepia(0.3) hue-rotate(-10deg)',
          }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(5,0,0,0.3) 0%, rgba(0,0,0,0.55) 100%)' }} />
        <div className="absolute horror-bg-grain" />
        <div className="absolute horror-orb horror-orb-1" />
        <div className="absolute horror-orb horror-orb-2" />
        <div className="absolute horror-orb horror-orb-3" />
      </>
    )}

      {mode === 'horror' && (
        <video
          ref={videoRef}
          style={{
            position: 'absolute',
            top: 0, left: 0,
            width: '100%', height: '100%',
            opacity: 1,
            mixBlendMode: 'screen',
            objectFit: 'cover',
          }}
          src="/assets/videos/107/Damage.webm"
          autoPlay loop playsInline muted={false} preload="auto"
        />
      )}

      {mode === 'horror' && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.5) 100%)',
          pointerEvents: 'none',
        }} />
      )}

      <div
        className="vn-grain-layer"
        style={{ position: 'absolute', width: '105%', height: '105%', top: '-2.5%', left: '-2.5%', opacity: 0.03, mixBlendMode: 'overlay' }}
      />

      <div
        className="vn-scanline-sweep"
        style={{ position: 'absolute', inset: '0 0 auto 0', height: '120px', background: 'linear-gradient(to bottom, transparent, rgba(255,200,200,0.02), transparent)', pointerEvents: 'none' }}
      />

      {mode === 'train' && (
        <>
          <div
            className="vn-flicker"
            style={{
              position: 'absolute', inset: 0, pointerEvents: 'none',
              background: `radial-gradient(circle 240px at ${spotX}px ${spotY}px, rgba(200,40,20,0.35) 0%, rgba(160,20,10,0.18) 45%, rgba(80,10,5,0.06) 70%, transparent 100%)`,
            }}
          />
          <div
            style={{
              position: 'absolute', inset: 0, pointerEvents: 'none',
              background: `radial-gradient(circle 220px at ${spotX}px ${spotY}px, rgba(0,0,0,0.0) 0%, rgba(0,0,0,0.35) 40%, rgba(0,0,0,0.78) 65%, rgba(0,0,0,0.92) 100%)`,
            }}
          />
        </>
      )}
    </div>
  )
}

type DialogBoxProps = {
  sceneId: string
  scene: SceneNode
  inputValue: string
  setInputValue: (v: string) => void
  inputRef: React.RefObject<HTMLInputElement>
  onAdvance: (nextId?: string) => void
  onInputSubmit: () => void
  userName: string
}

const DialogBox = ({ sceneId, scene, inputValue, setInputValue, inputRef, onAdvance, onInputSubmit, userName }: DialogBoxProps) => {
  const [evadePos, setEvadePos] = useState({ x: 0, y: 0 })
  const baseDialogText =
    scene.type === 'dialog' ? scene.text :
      scene.type === 'choice' ? scene.text :
        scene.type === 'input' ? scene.prompt : ''

  const dialogText = baseDialogText.replace('{{name}}', userName || 'Orang Asing')

  const { displayed, done, skip } = useTypewriter(dialogText)
  const speakerName = 'speaker' in scene ? scene.speaker : ''
  const isInput = scene.type === 'input'
  const isChoice = scene.type === 'choice'

  const isKamu = speakerName === 'Kamu'
  const accent = {
    rgb: isKamu ? '80,120,210' : '210,80,100',
    main: isKamu ? 'rgba(80,120,210,0.9)' : 'rgba(210,80,100,0.9)',
    mid: isKamu ? 'rgba(80,120,210,0.7)' : 'rgba(210,80,100,0.7)',
    dim: isKamu ? 'rgba(80,120,210,0.5)' : 'rgba(210,80,100,0.5)',
    faint: isKamu ? 'rgba(80,120,210,0.35)' : 'rgba(210,80,100,0.35)',
    vfaint: isKamu ? 'rgba(80,120,210,0.06)' : 'rgba(210,80,100,0.06)',
    line: isKamu
      ? 'linear-gradient(90deg,transparent,rgba(80,120,210,0.6),rgba(80,120,210,0.8),rgba(80,120,210,0.6),transparent)'
      : 'linear-gradient(90deg,transparent,rgba(210,80,100,0.6),rgba(210,80,100,0.8),rgba(210,80,100,0.6),transparent)',
      boxSolidBg: isKamu
        ? 'rgba(4, 6, 20, 0.97)'
        : 'rgba(12, 2, 4, 0.97)',
    boxBorder:  isKamu ? 'rgba(80,120,210,0.45)'  : 'rgba(210,80,100,0.45)',
    boxShadow:  isKamu
      ? '0 0 40px rgba(80,120,210,0.08),inset 0 0 30px rgba(40,60,180,0.04)'
      : '0 0 40px rgba(210,80,100,0.08),inset 0 0 30px rgba(180,40,60,0.04)',
    tagBg: isKamu
      ? 'linear-gradient(135deg,rgba(5,8,25,0.97) 0%,rgba(8,12,40,0.95) 100%)'
      : 'linear-gradient(135deg,rgba(25,5,8,0.97) 0%,rgba(40,8,12,0.95) 100%)',
    tagBorder: isKamu ? 'rgba(80,120,210,0.55)' : 'rgba(210,80,100,0.55)',
    tagText: isKamu ? '#b0c8f0' : '#f5d8dc',
    tagLetterSpacing: isKamu ? '0.12em' : '0.18em',
  }

  const handleClick = useCallback(() => {
    if (scene.type === 'dialog') {
      if (!done) skip(); else onAdvance()
    }
  }, [scene, done, skip, onAdvance])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === ' ' || e.key === 'Enter') && scene.type === 'dialog') {
        if (!done) skip(); else onAdvance()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [scene, done, skip, onAdvance])

  const isFinalGlitch = sceneId === 's33';
  return (
    <div
      onClick={!isInput && !isChoice ? handleClick : undefined}
      style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        zIndex: 10, padding: '0 0 28px',
        cursor: isInput || isChoice ? 'default' : 'pointer',
        fontFamily: "'IM Fell English', Georgia, serif",
        isolation: 'isolate', 
      }}
    >
      {speakerName && (
        <div
        key={`speaker-${sceneId}`}
        className={`vn-box mx-3 sm:mx-8 ${isFinalGlitch ? 'corruption-container' : ''}`} 
        style={{
          background: isFinalGlitch ? 'rgba(20, 0, 0, 0.97)' : accent.boxSolidBg,
          border: `1px solid ${isFinalGlitch ? '#ff0000' : accent.boxBorder}`,
          boxShadow: isFinalGlitch ? '0 0 12px rgba(200,0,0,0.6), inset 0 0 8px rgba(150,0,0,0.3)' : accent.boxShadow,
          position: 'relative', overflow: 'hidden',
        }}
      >
          <span style={{ marginRight: '8px', color: accent.mid, fontSize: '14px' }}>✿</span>
          <span style={{
            display: 'inline-block',
            background: accent.tagBg,
            border: `1px solid ${accent.tagBorder}`,
            marginBottom: '-1px',
            color: accent.tagText,
            fontSize: '13px',
            letterSpacing: accent.tagLetterSpacing,
            padding: '5px 20px 5px 16px', textTransform: 'uppercase',
          }}>
            {speakerName}
          </span>
          <span style={{ marginLeft: '8px', color: accent.mid, fontSize: '14px' }}>✿</span>
        </div>
      )}

      <div
        key={`dialog-${sceneId}`} 
        className={`vn-box mx-3 sm:mx-8 ${isFinalGlitch ? 'corruption-container' : ''}`}
        style={{
          background: isFinalGlitch ? 'rgba(20, 0, 0, 0.97)' : accent.boxSolidBg,
          border: `1px solid ${isFinalGlitch ? 'rgba(255,0,0,0.7)' : accent.boxBorder}`,
          borderTop: `2px solid ${isFinalGlitch ? '#ff0000' : accent.boxBorder}`,
          boxShadow: isFinalGlitch
            ? '0 0 20px rgba(255,0,0,0.5), inset 0 0 15px rgba(200,0,0,0.2)'
            : accent.boxShadow,
          position: 'relative', overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', top: 0, left: '20px', right: '20px', height: '1px', background: accent.line }} />

        <div style={{ position: 'absolute', top: '6px', left: '8px', color: accent.dim, fontSize: '18px', lineHeight: 1 }}>❧</div>
        <div style={{ position: 'absolute', top: '6px', right: '8px', color: accent.dim, fontSize: '18px', lineHeight: 1, transform: 'scaleX(-1)' }}>❧</div>

        <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(to bottom,transparent,transparent 3px,rgba(0,0,0,0.06) 3px,rgba(0,0,0,0.06) 4px)', pointerEvents: 'none' }} />

        <div className="px-4 py-4 sm:pl-9 sm:pr-12 sm:pt-[18px] sm:pb-[22px] relative">
          <p style={{
            color: isFinalGlitch ? '#ff3333' : '#ede0e0', textShadow: isFinalGlitch ? '2px 0 blue, -2px 0 red' : 'none', 
            fontSize: '15px', lineHeight: '1.75',
            letterSpacing: '0.02em', margin: '0 0 12px', minHeight: '28px',
            fontStyle: speakerName === '???' ? 'italic' : 'normal',
          }}>
            {displayed}
            {!done && <span className="vn-cursor-blink" style={{ color: accent.main, marginLeft: '2px' }}>|</span>}
          </p>

          {isInput && done && (
            <div style={{ marginTop: '8px', display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
              <input
                ref={inputRef}
                className="vn-input-field"
                placeholder={(scene as any).placeholder}
                value={inputValue}
                maxLength={20}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') onInputSubmit() }}
                style={{
                  borderBottomColor: isKamu ? 'rgba(80,120,210,0.6)' : undefined,
                  caretColor: isKamu ? 'rgba(80,120,210,0.9)' : undefined,
                } as React.CSSProperties}
              />
              <button
                className="vn-submit-btn"
                onClick={onInputSubmit}
                style={isKamu ? {
                  background: 'rgba(80,120,210,0.15)',
                  border: '1px solid rgba(80,120,210,0.5)',
                  color: 'rgba(80,120,210,0.9)',
                } : undefined}
              >↵ Enter</button>
            </div>
          )}

          {isChoice && done && (
            <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {(scene as any).choices.map((c: { label: string; next: string }, i: number) => {
                const isScared = c.next === 's29_scared'; 
                return (
                <button
                  key={c.next}
                  className="vn-choice-btn"
                  onMouseEnter={() => {
                    if (isScared) setEvadePos({ x: (Math.random() - 0.5) * 200, y: (Math.random() - 0.5) * 120 })
                  }}
                onMouseLeave={() => {
                  if (isScared) setEvadePos({ x: 0, y: 0 })
                }}
                  onClick={() => onAdvance(c.next)}
                  style={{
                    animationDelay: `${i * 0.07}s`,
                    background: accent.vfaint,
                    border: `1px solid ${accent.faint}`,
                    color: isScared && Math.abs(evadePos.x) > 0 ? '#ff3333' : '#f0dde0', 
                    fontFamily: "'IM Fell English',Georgia,serif",
                    fontSize: '14px', textAlign: 'left', padding: '8px 16px',
                    cursor: 'pointer', letterSpacing: '0.02em',
                    display: 'flex', alignItems: 'center', gap: '10px',
                    transform: isScared ? `translate(${evadePos.x}px, ${evadePos.y}px)` : undefined,
                    transition: isScared ? 'transform 0.1s ease-out, color 0.2s' : undefined,
                    filter: isScared && Math.abs(evadePos.x) > 30 ? 'blur(0.5px) contrast(200%)' : 'none',
                    zIndex: isScared ? 50 : 1
                  }}
                >
                  <span style={{ color: accent.mid, fontSize: '10px' }}>◆</span>
                  {isScared && Math.abs(evadePos.x) > 20 ? 'T̴O̵L̵O̷N̷G̸ ̴L̸E̸P̸A̴S̸K̴A̶N̴ ̷A̸K̸U̶!̵' : c.label}
                </button>
              )})}
            </div>
          )}

          {scene.type === 'dialog' && done && (
            <div className="vn-advance-arrow" style={{ position: 'absolute', bottom: '14px', right: '20px', color: accent.mid, fontSize: '12px', userSelect: 'none' }}>▼</div>
          )}
        </div>

        <div style={{ position: 'absolute', bottom: 0, left: '20px', right: '20px', height: '1px', background: accent.line }} />
      </div>

      {scene.type === 'dialog' && (
        <p style={{ textAlign: 'center', marginTop: '8px', color: 'rgba(200,160,160,0.3)', fontSize: '11px', fontFamily: "'IM Fell English',Georgia,serif", letterSpacing: '0.12em', userSelect: 'none' }}>
          {done ? 'CLICK  OR  SPACE  TO  CONTINUE' : 'CLICK  TO  SKIP'}
        </p>
      )}
    </div>
  )
}

type IntroProps = { onComplete: () => void }

const IntroVisualNovel = ({ onComplete }: IntroProps) => {
  const [sceneId, setSceneId] = useState('s01')
  const [inputValue, setInputValue] = useState('')
  const [userName, setUserName]     = useState('')
  const [fadeIn, setFadeIn]         = useState(false)
  const [fadeOut, setFadeOut]       = useState(false)
  const [showDialog, setShowDialog] = useState(false) 
  
  const [volume, setVolume] = useState(0.4) 
  const [hasInteracted, setHasInteracted] = useState(false)
  const bgmRef = useRef<HTMLAudioElement>(null)

useEffect(() => {
    if (bgmRef.current) bgmRef.current.volume = volume
  }, [volume])

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const playAudio = () => {
      if (bgmRef.current && bgmRef.current.paused) {
        bgmRef.current.playbackRate = 1.0; 
        bgmRef.current.play().catch(e => {
          console.warn("Autoplay ditahan browser, menunggu interaksi user...", e)
        });
      }
    };

    timeoutId = setTimeout(() => {
      playAudio();
    }, 2000);

    const handleInteraction = () => {
      if (!hasInteracted) {
        setHasInteracted(true);
        playAudio();
      }
    };

    window.addEventListener('click', handleInteraction);
    window.addEventListener('keydown', handleInteraction);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };
  }, [hasInteracted])
  const inputRef = useRef<HTMLInputElement>(null)
  const spot = useSpotlight()
  const scene = SCRIPT[sceneId]
  const whisperActive = ['s13','s14','s15','s16','s17_a','s17','s18','s19','s20','s21','s22','s23','s24','s25','s26','s27','s28','s29_brave','s29_scared','s30','s31'].includes(sceneId)
  const whisperIntensity = sceneId === 's19' ? 1.0 : 0.2
  useCreepyWhisper(whisperActive, whisperIntensity)

    const jitteredSpot = useJitteredSpot(spot.x, spot.y, whisperActive)
  useEffect(() => { 
    const t = setTimeout(() => setFadeIn(true), 100)
    const d = setTimeout(() => setShowDialog(true), 3000)

    return () => { clearTimeout(t); clearTimeout(d) }
  }, [])

  useEffect(() => {
    if (scene?.type === 'input') setTimeout(() => inputRef.current?.focus(), 200)
  }, [sceneId, scene?.type])

  useEffect(() => {
    if (scene?.type !== 'end') return
    setFadeOut(true)
    const t = setTimeout(() => onComplete(), 1200)
    return () => clearTimeout(t)
  }, [scene, onComplete])

  const advance = useCallback((nextId?: string) => {
    const target = nextId ?? (scene && 'next' in scene && typeof (scene as any).next === 'string' ? (scene as any).next : null)
    if (target) setSceneId(target)
  }, [scene])

  const handleInputSubmit = () => {
    if (scene?.type !== 'input') return
    const val = inputValue.trim()
    if (!userName && val) setUserName(val)
    const nextId = (scene as any).next(val)
    setInputValue('')
    setSceneId(nextId)
  }

  if (scene?.type === 'end' && fadeOut) return null

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9998, opacity: fadeIn && !fadeOut ? 1 : 0, transition: 'opacity 1.2s ease' }}>
      <OuterBg spotX={jitteredSpot.x} spotY={jitteredSpot.y} mode="train" visible={fadeIn && !fadeOut} intenseGlitch={sceneId === 's33'} />

      <audio
        ref={bgmRef}
        src='/assets/videos/107/DG.mp3'
        loop
        onLoadedMetadata={() => {
          if (bgmRef.current) bgmRef.current.volume = volume
        }}
      />
      
      <div 
        style={{ 
          position: 'absolute', top: '24px', right: '28px', zIndex: 9999, 
          display: 'flex', alignItems: 'center', gap: '12px', 
          color: 'rgba(210, 80, 100, 0.6)', fontFamily: "'IM Fell English', Georgia, serif", 
          fontSize: '14px', letterSpacing: '0.05em', userSelect: 'none'
        }}
      >
        <span>BGM</span>
        <input 
          type="range" min="0" max="1" step="0.01" 
          value={volume} 
          onChange={(e) => setVolume(parseFloat(e.target.value))} 
          style={{ 
            width: '80px', 
            accentColor: 'rgba(210, 80, 100, 0.8)', 
            cursor: 'pointer' 
          }} 
        />
      </div>

      <div
        className="vn-bloom-anim"
        style={{
          position: 'fixed', top: '-60px', left: '50%', transform: 'translateX(-50%)',
          width: '500px', height: '400px', pointerEvents: 'none', zIndex: 1,
          background: 'radial-gradient(ellipse at 50% 0%,rgba(255,180,100,0.07) 0%,transparent 70%)',
        }}
      />

      {showDialog && scene && scene.type !== 'end' && (
        <DialogBox
          sceneId={sceneId}
          scene={scene}
          inputValue={inputValue}
          setInputValue={setInputValue}
          inputRef={inputRef}
          onAdvance={advance}
          onInputSubmit={handleInputSubmit}
          userName={userName}
        />
      )}
    </div>
  )
}

const GlitchText = ({ active, normalText, glitchText }: { active: boolean; normalText: string; glitchText: string }) => {
  const [text, setText] = useState(normalText)
  useEffect(() => {
    if (!active) { setText(normalText); return }
    let tid: NodeJS.Timeout
    const stutter = () => {
      const g = Math.random() > 0.4
      setText(g ? glitchText : normalText)
      tid = setTimeout(stutter, g ? floor(random(20, 80)) : floor(random(50, 200)))
    }
    stutter()
    return () => clearTimeout(tid)
  }, [active, normalText, glitchText])
  return <>{text}</>
}

type MemberPopupProps = { isOpen: boolean; onClose: () => void }
type CardState = 'ALIVE' | 'PLAYING_VIRTUOSA' | 'TEARING' | 'DEADLOCK' | 'BOOTING'

const MemberPopup = ({ isOpen, onClose }: MemberPopupProps) => {
  const [activeGlitch, setActiveGlitch] = useState<string | null>(null)
  const [cardTear, setCardTear] = useState<number>(0)
  const [cardState, setCardState] = useState<CardState>('ALIVE')
  const [glitchBg, setGlitchBg] = useState('rgba(5,0,1,1)')
  const [glitchBorder, setGlitchBorder] = useState('rgba(200,0,50,0.8)')
  const [glitchBoxBg, setGlitchBoxBg] = useState('rgba(0,0,0,0.9)')
  const [glitchTextVariant, setGlitchTextVariant] = useState(0)
  const [glitchFlicker, setGlitchFlicker] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  const cardContentRef = useRef<HTMLDivElement>(null)

  const spot = useSpotlight()
  const isBlocked = cardState === 'DEADLOCK' || cardState === 'BOOTING' || cardState === 'TEARING'
  const isLocked = cardState === 'DEADLOCK' || cardState === 'BOOTING'
  
  const { activeLantern, blendedRgb, glitchPhase } = useCornerLantern(
    !isLocked && isOpen && isMounted,
    cardContentRef,
    spot.x,
    spot.y
  )

  const { errorLantern, flickerOpacity } = useLanternGlitch(!isLocked && isOpen)

  const tilt = useCardParallax(cardContentRef, !isLocked && isOpen && isMounted)
  useEffect(() => { setIsMounted(true) }, [])

  useEffect(() => {
    if (!isOpen || cardState !== 'ALIVE') return
    const iv = setInterval(() => {
      const targets = ['name', 'hobi', 'funfact', 'spotify', 'social']
      const t = targets[floor(random(targets.length))]
      setActiveGlitch(t)
      setTimeout(() => setActiveGlitch(null), random(500, 2000))
    }, random(4000, 9000))
    return () => clearInterval(iv)
  }, [isOpen, cardState])

  useEffect(() => {
    if (!isOpen || cardState !== 'ALIVE') return
    const iv = setInterval(() => {
      const v = floor(random(1, 6)); setCardTear(v)
      setTimeout(() => setCardTear(0), random(100, 300))
      if (Math.random() > 0.6) {
        setTimeout(() => { setCardTear(floor(random(1, 6))); setTimeout(() => setCardTear(0), random(50, 150)) }, random(300, 500))
      }
    }, random(6000, 12000))
    return () => clearInterval(iv)
  }, [isOpen, cardState])

  useEffect(() => {
    if (!isOpen || cardState !== 'ALIVE') return
    let tid: NodeJS.Timeout
    const roll = () => { tid = setTimeout(() => { if (Math.random() < 0.35) setCardState('PLAYING_VIRTUOSA'); else roll() }, random(5000, 12000)) }
    roll()
    return () => clearTimeout(tid)
  }, [isOpen, cardState])

  useEffect(() => {
    if (cardState !== 'PLAYING_VIRTUOSA') return
    const t = setTimeout(() => setCardState('TEARING'), 4000) 
    return () => clearTimeout(t)
  }, [cardState])

  useEffect(() => {
  if (cardState !== 'TEARING') return
    const t = setTimeout(() => setCardState('DEADLOCK'), 1100)
    return () => clearTimeout(t)
  }, [cardState])
  useEffect(() => {
    if (cardState !== 'BOOTING') return
    const t = setTimeout(() => setCardState('ALIVE'), 4000)
    return () => clearTimeout(t)
  }, [cardState])

  useEffect(() => {
    if (cardState !== 'DEADLOCK' && cardState !== 'BOOTING') return
    const bgs = ['rgba(5,0,1,1)', 'rgba(20,0,0,1)', 'rgba(0,0,5,1)', 'rgba(10,0,0,1)', 'rgba(50,0,10,1)', 'rgba(0,5,0,1)', 'rgba(2,0,8,1)']
    const bords = ['rgba(255,0,0,1)', 'rgba(200,0,50,0.8)', 'rgba(255,50,0,1)', 'rgba(180,0,0,0.9)', 'rgba(255,0,100,0.7)', 'rgba(255,255,0,0.5)', 'rgba(0,255,255,0.3)']
    const boxes = ['rgba(0,0,0,0.9)', 'rgba(30,0,0,0.95)', 'rgba(10,0,5,0.85)', 'rgba(0,0,10,0.92)', 'rgba(20,0,0,0.98)']
    let bt: NodeJS.Timeout, brt: NodeJS.Timeout, tt: NodeJS.Timeout, ft: NodeJS.Timeout
    const cBg = () => { setGlitchBg(bgs[floor(random(bgs.length))]); bt = setTimeout(cBg, floor(random(80, 400))) }
    const cBrd = () => { setGlitchBorder(bords[floor(random(bords.length))]); setGlitchBoxBg(boxes[floor(random(boxes.length))]); brt = setTimeout(cBrd, floor(random(100, 500))) }
    const cTxt = () => { setGlitchTextVariant(floor(random(6))); tt = setTimeout(cTxt, floor(random(50, 300))) }
    const cFlk = () => { setGlitchFlicker(Math.random() > 0.5); ft = setTimeout(cFlk, floor(random(30, 200))) }
    cBg(); cBrd(); cTxt(); cFlk()
    return () => { clearTimeout(bt); clearTimeout(brt); clearTimeout(tt); clearTimeout(ft) }
  }, [cardState])

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && !isLocked) onClose() }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey) }
  }, [isOpen, onClose, isLocked])

  if (!isOpen || !isMounted) return null

  const fatalErrorTexts = ['FATAL ERROR', 'F̷A̴T̸A̷L̵ ̸E̴R̵R̸O̷R̴', 'F̸̡̛̙̟̲̪̥̿̒̓̂Ä̵̰̩́̎T̶̨̮͋̉Ā̴̼͙̯̩͑͝L̸̜̻̊̔ ̷̙͔̫̮̫̓̑Ȅ̴̫̪͖̓̔͘R̷̨̗̄̋̾̒͝Ȑ̵̡̛̬̖̠͘Ö̸̰́R̴̩̙̳͖͑̉͒͠', '▓▒░FATAL░▒▓', 'FATAL_ERROR.exe', '//FATAL ERROR//']
  const corruptTexts   = ['CORRUPTED_DATA_DETECTED', 'C̷O̸R̷R̸U̵P̴T̵E̸D̷_̷D̵A̸T̷A̴ ̵/̶/̷ ̸0̷x̷D̵E̸A̷D̵', 'THEY ARE EVERY⸮⸮ER3! :: H3ļ̷̈́͠ͅl̶̪͈͛, scream, shout, ki⸮⸮', '0xDEAD :: Help me!', 'UnK⸮⸮wn EnT⸮⸮⸮', '????_????_??????? // 0xDEAD', 'Pl3-- ??⸮⸮ en###t3% th⸮s ---??# 1 ## $0??y']
  const buttonTexts    = ['please load this profile again', 'p̷l̴e̷a̶s̸e̵ ̶l̸o̸a̸d̷ ̴t̷h̶i̵s̵ ̵p̷r̷o̴f̸i̶l̶e̸ ̶a̸g̷a̷i̷n̸', 'PLEASE LOAD THIS PROFILE AGAIN', 'please_load_this_profile_again()', 'RELOAD // PLEASE LOAD THIS PROFILE', 'p̸̺̓l̷̙͝ȇ̶͙a̵̞͑ş̵̈e̸̹͋ ̶͖̋l̸͓̎o̶͕̿à̷͔d̴̡̊ ̵͚̽ṫ̸̻h̶̠͌i̴̮͘ş̵̄ ̷̯̐p̷̙̉ȓ̴̩o̶̻͝f̵̰͊i̶̼͑l̵̲̎ê̵͓']

  return createPortal(
    <div className={`fixed inset-0 z-[9999] flex items-start justify-center overflow-y-auto px-4 font-mono lantern-cursor-${activeLantern}`}>
      <OuterBg spotX={-999} spotY={-999} mode="horror" />

      <button
        type="button" aria-label="Close"
        onClick={() => { if (!isLocked) onClose() }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-all duration-1000 cursor-default z-10"
      />

      <div
        ref={cardContentRef}
        className={`relative z-20 w-full max-w-[720px] my-8 rounded-sm vn-horror-box text-white border-solid
          ${cardState === 'PLAYING_VIRTUOSA' ? 'playing-virtuosa-mode' : ''}
          ${cardTear > 0 && cardState === 'ALIVE' ? `card-tear-base card-tear-${cardTear}` : ''}`}
        style={{
          backgroundColor: isLocked ? glitchBg : '#050001',
          borderColor: isLocked ? glitchBorder : undefined,
          boxShadow: isLocked
            ? `0 0 25px ${glitchBorder}`
            : '0 0 60px rgba(180,20,40,0.35), 0 0 120px rgba(120,0,20,0.2), 0 0 200px rgba(60,0,10,0.15)',
          transition: isLocked ? 'none' : undefined,
          overflow: 'hidden',
          transform: isLocked
          ? undefined
          : `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${tilt.scale})`,
        willChange: 'transform',
        }}
      >
        <div className="crt-texture" />

        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 15,
          background: `
            radial-gradient(ellipse 100% 70% at 95% 100%, rgba(200,60,40,0.10) 0%, rgba(0,0,0,0.55) 35%, rgba(0,0,0,0.92) 100%),
            repeating-linear-gradient(to bottom, transparent, transparent 3px, rgba(0,0,0,0.06) 3px, rgba(0,0,0,0.06) 4px)
          `
        }} />

        {!isLocked && (() => {
          const rect = cardContentRef.current?.getBoundingClientRect()
          if (!rect) return null

          const px = ((spot.x - rect.left) / rect.width) * 100
          const py = ((spot.y - rect.top)  / rect.height) * 100
          const inside =
            spot.x >= rect.left && spot.x <= rect.right &&
            spot.y >= rect.top  && spot.y <= rect.bottom

          const { r, g, b } = blendedRgb

          const distLeft   = (spot.x - rect.left)  / (rect.width  * 0.35)
          const distRight  = (rect.right - spot.x) / (rect.width  * 0.35)
          const distTop    = (spot.y - rect.top)   / (rect.height * 0.35)
          const distBottom = (rect.bottom - spot.y)/ (rect.height * 0.35)

          const glowLeft   = inside ? Math.max(0, Math.min(1, 1 - distLeft))   : 0
          const glowRight  = inside ? Math.max(0, Math.min(1, 1 - distRight))  : 0
          const glowTop    = inside ? Math.max(0, Math.min(1, 1 - distTop))    : 0
          const glowBottom = inside ? Math.max(0, Math.min(1, 1 - distBottom)) : 0

          return (
            <>
              <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 16,
                opacity: errorLantern === activeLantern ? flickerOpacity : 1,
                transition: 'opacity 0.05s',
                background: inside
                  ? `radial-gradient(ellipse 50% 40% at ${px}% ${py}%,
                      rgba(${r},${g},${b},0.15) 0%,   
                      rgba(0,0,0,0.35) 45%,
                      rgba(0,0,0,0.88) 70%,
                      rgba(0,0,0,0.96) 100%)`
                  : 'rgba(0,0,0,0.92)',
              }} />

              <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 17,
                opacity: errorLantern === activeLantern ? flickerOpacity : 1,
                transition: 'opacity 0.05s',
                boxShadow: [
                  glowLeft   > 0.01 ? `inset ${Math.round(glowLeft*70)}px 0 ${Math.round(glowLeft*45)}px rgba(${r},${g},${b},${(glowLeft*0.20).toFixed(2)})` : '',
                  glowRight  > 0.01 ? `inset -${Math.round(glowRight*70)}px 0 ${Math.round(glowRight*45)}px rgba(${r},${g},${b},${(glowRight*0.20).toFixed(2)})` : '',
                  glowTop    > 0.01 ? `inset 0 ${Math.round(glowTop*50)}px ${Math.round(glowTop*35)}px rgba(${r},${g},${b},${(glowTop*0.16).toFixed(2)})` : '',
                  glowBottom > 0.01 ? `inset 0 -${Math.round(glowBottom*50)}px ${Math.round(glowBottom*35)}px rgba(${r},${g},${b},${(glowBottom*0.16).toFixed(2)})` : '',
                ].filter(Boolean).join(', ') || 'none',
                transition: 'box-shadow 0.08s ease',
              }} />
            </>
          )
        })()}

        {isLocked && (
          <div className="scanline-sweep absolute inset-x-0 h-8 pointer-events-none z-30"
            style={{ background: 'linear-gradient(to bottom,transparent,rgba(255,0,0,0.08),transparent)' }} />
        )}

        <button
          type="button" aria-label="Close"
          onClick={() => { if (!isLocked) onClose() }}
          className={`border-red-900/50 absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-sm border text-xl leading-none transition-colors z-50
            ${isLocked ? 'text-red-900/40 cursor-not-allowed' : 'hover:bg-red-900/20 text-red-600 cursor-pointer'}`}
        >
          {isLocked ? '✕' : 'x'}
        </button>

        <div
          className="relative z-10 max-h-[100dvh] overflow-y-auto overflow-x-hidden p-6 sm:p-8 scrollbar-thin scrollbar-thumb-red-900 scrollbar-track-black"
        >

          <div style={{ position: 'relative', zIndex: 2 }}>

            {isLocked && (
              <div className={`flex flex-col gap-4 ${glitchFlicker ? 'corruption-container' : ''}`}>
                <div className="relative overflow-hidden rounded-sm" style={{ border: `3px solid ${glitchBorder}`, boxShadow: `0 0 30px ${glitchBorder},inset 0 0 20px rgba(255,0,0,0.2)`, transition: 'none' }}>
                  {cardState === 'BOOTING'
                    ? <Image src={readingGif} alt="system booting..." className="w-full object-cover object-center" unoptimized />
                    : <Image src={tauntingGif} alt="fatal error" className="w-full object-cover object-center" unoptimized style={{ filter: glitchFlicker ? 'hue-rotate(180deg) saturate(200%) contrast(150%)' : 'none' }} />
                  }
                  <div className="crt-texture" />
                  <div className="absolute inset-0 pointer-events-none mix-blend-color-dodge" style={{ background: glitchFlicker ? 'linear-gradient(90deg,rgba(255,0,0,0.15) 0%,transparent 33%,rgba(0,255,255,0.15) 66%,transparent 100%)' : 'none', transition: 'none' }} />
                </div>

                {cardState === 'DEADLOCK' && (
                  <div className="box-glitch rounded-sm p-6 text-center" style={{ border: `3px solid ${glitchBorder}`, backgroundColor: glitchBoxBg, boxShadow: `inset 0 0 40px rgba(200,0,0,0.35),0 0 30px ${glitchBorder}`, transition: 'none' }}>
                    <p className="rgb-split-text text-flicker font-black tracking-[0.3em] uppercase text-sm mb-1 drop-shadow-[0_0_10px_rgba(255,0,0,0.9)]" style={{ color: glitchBorder, transition: 'none' }}>
                      {fatalErrorTexts[glitchTextVariant] ?? 'FATAL ERROR'}
                    </p>
                    <p className="text-xs font-mono mb-5" style={{ color: `${glitchBorder}99`, transition: 'none', filter: glitchFlicker ? 'blur(0.5px)' : 'none' }}>
                      {corruptTexts[glitchTextVariant] ?? 'CORRUPTED_DATA_DETECTED // 0xDEAD'}
                    </p>
                    <button
                      onClick={() => setCardState('BOOTING')}
                      className="px-6 py-3 font-bold rounded-sm uppercase tracking-widest text-sm cursor-pointer"
                      style={{ backgroundColor: 'rgba(0,0,0,0.8)', color: glitchBorder, border: `2px solid ${glitchBorder}`, boxShadow: `0 0 15px ${glitchBorder}`, textShadow: glitchFlicker ? '-2px 0 red,2px 0 cyan' : 'none', transition: 'none' }}
                    >
                      {buttonTexts[glitchTextVariant] ?? 'please load this profile again'}
                    </button>
                  </div>
                )}

                {cardState === 'BOOTING' && (
                  <div className="rounded-sm p-3 text-center" style={{ border: `1px solid ${glitchBorder}66`, backgroundColor: 'rgba(0,0,0,0.6)', transition: 'none' }}>
                    <p className="text-xs font-mono tracking-[0.2em] animate-pulse" style={{ color: glitchBorder }}>SYSTEM BOOTING... PLEASE WAIT</p>
                  </div>
                )}
              </div>
            )}

            {!isLocked && (
              <div>
                <div
              className={`mb-5 overflow-hidden rounded-sm border-[2px] transition-all duration-100 relative bg-black pointer-events-none
                ${cardState === 'PLAYING_VIRTUOSA' || cardState === 'TEARING'
                  ? 'border-red-600 shadow-[0_0_30px_rgba(255,0,0,0.7)]'
                  : activeGlitch === 'image'
                    ? 'border-red-500 scale-[1.03] filter invert sepia-[.8] hue-rotate-[180deg] brightness-75'
                    : 'border-red-900/40 grayscale-[0.2]'}`}
                  >
              {cardState === 'TEARING' ? (
                <div className="relative w-full" style={{ height: '480px' }}>
                  <div className="tear-left absolute inset-0" style={{
                    clipPath: 'polygon(0 0, 51% 0, 50% 25%, 52% 50%, 49% 75%, 51% 100%, 0 100%)',
                    filter: 'drop-shadow(4px 0 8px rgba(0,0,0,0.8))',
                  }}>
                    <Image src={virtuosaGif} alt="" fill style={{ objectFit: 'cover' }} unoptimized />
                  </div>
                  <div className="tear-right absolute inset-0" style={{
                    clipPath: 'polygon(51% 0, 100% 0, 100% 100%, 49% 100%, 52% 75%, 50% 50%, 52% 25%)',
                    filter: 'drop-shadow(-4px 0 8px rgba(0,0,0,0.8))',
                  }}>
                    <Image src={virtuosaGif} alt="" fill style={{ objectFit: 'cover' }} unoptimized />
                  </div>
                  <div style={{
                    position: 'absolute', top: 0, bottom: 0,
                    left: '49.5%', width: '2px',
                    background: 'linear-gradient(to bottom, transparent, white 20%, rgba(255,200,200,0.9) 50%, white 80%, transparent)',
                    filter: 'blur(0.5px)',
                  }} />
                </div>
              ) : cardState === 'PLAYING_VIRTUOSA' ? (
                <>
                  <Image src={virtuosaGif} alt="???" className="h-120 w-full object-cover object-center pfp-glitch-in" unoptimized priority />
                  <div className="crt-texture" />
                  <div className="absolute inset-0 bg-red-950/25 mix-blend-color-burn animate-pulse pointer-events-none" />
                  <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(90deg,rgba(255,0,0,0.08) 0%,transparent 40%,rgba(0,255,255,0.08) 70%,transparent 100%)' }} />
                </>
              ) : (
                <>
                  <GlitchCanvas key={`canvas-${cardState}`} src={ProfileImage.src} />
                  {cardTear > 0 && <div className="absolute inset-0 bg-red-900/30 mix-blend-color-burn animate-pulse pointer-events-none" />}
                </>
              )}
            </div>
            {cardState !== 'TEARING' && (
                  <>
                    {cardState === 'PLAYING_VIRTUOSA' && (
                      <div className="mb-4 py-1 px-3 rounded-sm text-center" style={{ border: '1px solid rgba(255,0,0,0.4)', backgroundColor: 'rgba(20,0,0,0.7)' }}>
                        <p className="rgb-split-text text-xs font-mono tracking-[0.2em] text-red-700">F̵̖͈̓õ̸̼̙͊ṷ̶̎̚ń̶̡̗̊d̵̛̘̲ ̷̺͈̇y̸̥͛o̵̗̞͌̾u̷̯̿̕͜~̴͍̆ͅ.̸̞̞͋̑ ̸̧̙́L̴̘̙̎̓e̷̡̖̾t̵̗̕'̷̮̆͛s̸͓̄ ̶̣͛͝p̶͚͑͆ļ̴̿̇a̶̲͐y̴̻̒̎</p>
                      </div>
                    )}

                    <div className="pr-10 border-l-[4px] pl-4 mb-6 transition-colors" style={{ borderColor: activeGlitch === 'name' ? '#ff0000' : 'rgba(200,0,50,0.6)' }}>
                  <h2 className={`text-2xl font-black transition-all duration-75 ${activeGlitch === 'name' ? 'text-red-500 tracking-[0.3em] skew-x-12 animate-pulse' : 'text-gray-100'}`}>
                    <GlitchText active={activeGlitch === 'name'} normalText="Yovi Prayudya Rizky Ramadhani" glitchText="L̸̩̮̈u̴̞̤̍́n̵͙͎͌̌ą̶̗̅̉ḽ̸̼̑i̷͍̔g̶̻̲̓̀h̷̠͕͗t̴͚̍̕_̶̞͗̔Y̸̞̔ű̶͕͜i̶͙̩̅̈́" />
                  </h2>
                  <p className={`mt-1 text-sm font-semibold transition-colors ${activeGlitch === 'name' ? 'text-white font-black' : 'text-red-700/80'}`}>
                    <GlitchText active={activeGlitch === 'name'} normalText="5027251107 - Probolinggo" glitchText="U̷̲͘n̸̫͊k̵̮̐ṋ̶̂o̷̰͝w̷̜̋n̵͔͌" />
                  </p>
                </div>

                <div className={`mt-5 flex gap-2 transition-all duration-75 relative ${activeGlitch === 'social' ? 'opacity-40 scale-[1.01]' : 'opacity-100'}`}>
                  <Instagram username="yoviprayudya6" />
                  <LinkedInButtonLink username="yoviprayudyarr" />
                  {activeGlitch === 'social' && (
                    <div className="absolute inset-0 flex items-center pointer-events-none">
                      <span className="rgb-split-text text-xs font-mono tracking-[0.15em] animate-pulse px-2 py-1 rounded-sm" style={{ backgroundColor: 'rgba(10,0,0,0.85)', color: 'rgba(255,50,50,0.95)', border: '1px solid rgba(255,0,0,0.4)' }}>
                        Found you~ let's play!
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-6 grid gap-4 text-sm font-semibold sm:grid-cols-2">
                  <div className={`rounded-sm border-[2px] p-4 transition-all duration-75 overflow-hidden backdrop-blur-sm ${activeGlitch === 'hobi' ? 'border-red-500 bg-red-950/40 text-red-400 scale-[1.02] shadow-[0_0_10px_rgba(255,0,0,0.3)]' : 'border-red-900/30 bg-black/20'}`}>
                    <p className="text-red-700/80 text-xs tracking-wide uppercase">Hobi</p>
                    <p className={`mt-2 transition-all ${activeGlitch === 'hobi' ? 'font-black text-lg tracking-tight' : 'text-gray-200'}`}>
                      <GlitchText active={activeGlitch === 'hobi'} normalText="nulis cerita, main game, gambar, suka hal random" glitchText="b̴̗͑ú̴̫r̸̖͆n̵̬͐ ̸̡͆t̶̤̃h̸̤̚ě̸̜m̸̧̃ ̸͖̓ä̶̧́l̷̳͗l̷̄ͅ" />
                    </p>
                  </div>
                  <div className={`rounded-sm border-[2px] p-4 transition-all duration-75 backdrop-blur-sm ${activeGlitch === 'funfact' ? 'border-red-500 bg-red-950/40 text-red-400 font-bold -skew-y-2' : 'border-red-900/30 bg-black/20'}`}>
                    <p className="text-red-700/80 text-xs tracking-wide uppercase">Fun Fact</p>
                    <p className={`mt-2 transition-all ${activeGlitch === 'funfact' ? 'font-black' : 'text-gray-200'}`}>
                      <GlitchText active={activeGlitch === 'funfact'} normalText="A story writer of Yui novel" glitchText="T̴̫̭̈h̵͇̏e̴̬̔̆ ̵̖̿̚o̷̙͝n̴͙̿e̴̢͋ ̶̱̹͘͝y̶̺͝ó̶̬̔u̷̘͌̈́ ̶̳̀h̸̡̏͐û̸̫r̴̀͜t̵̳̬͋͋ ̷̯͑m̴̢͙̓e̸̱̓̈́" />
                    </p>
                  </div>
                </div>

                <div className="mt-4 rounded-sm border-[2px] border-red-900/30 bg-black/20 p-4 font-mono relative overflow-hidden backdrop-blur-sm">
                  <div className="relative">
                    <p className="text-red-700/80 text-xs font-bold tracking-wide uppercase">Lagu Favorit</p>
                    <p className={`my-2 text-sm font-semibold transition-all duration-75 ${activeGlitch === 'spotify' ? 'text-red-500 font-mono tracking-widest animate-pulse' : 'text-gray-200'}`}>
                      <GlitchText active={activeGlitch === 'spotify'} normalText="消えない温度(feat.MIMI) / Kotoha" glitchText="Ď̷͚a̵͍̕m̵͎͋ḁ̶́g̸͖̾e̶̗̔ ̶͙̍-̵̇ͅ ̴̞͘h̴̹͛ō̴̮l̵̦̓o̸̮͝l̷̦̊i̸̹͊v̸̖͑e̶͜͠ ̶͚̈́e̶̤̓r̵̲̊r̷̫͑o̴͚̒ṟ̶̃" />
                    </p>
                    <div className={`transition-all duration-300 ${activeGlitch === 'spotify' ? 'opacity-10 scale-y-75 pointer-events-none filter blur-sm' : 'opacity-100 scale-y-100'}`}>
                      <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/3VCOOqjh2lKggmgbm1rrJ5?si=d170cdf3dcd848de" />
                    </div>
                  </div>
                </div>
              </>
            )}
              </div> 
            )}        
          </div>       
        </div>         
      </div>           
    </div>,
    document.body
  )
}

type MemberWithIntroProps = { isOpen: boolean; onClose: () => void }

const MemberWithIntro = ({ isOpen, onClose }: MemberWithIntroProps) => {
  const [introShown, setIntroShown] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => { setIsMounted(true) }, [])
  useEffect(() => { if (!isOpen) setIntroShown(false) }, [isOpen])

  if (!isOpen || !isMounted) return null

  return createPortal(
    <>
      <style>
        {SHARED_STYLES}
        {LANTERN_CURSOR_STYLES(
          customCursor.src,
          lanternBlue.src,
          lanternOrange.src,
          lanternGreen.src
        )}
      </style>
      {!introShown && <IntroVisualNovel onComplete={() => setIntroShown(true)} />}
      {introShown && <MemberPopup isOpen={true} onClose={onClose} />}
    </>,
    document.body
  )
}

export default MemberWithIntro