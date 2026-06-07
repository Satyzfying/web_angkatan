'use client'

import React, { useEffect, useState, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'

import Instagram from '@/components/atoms/button/InstagramButtonLink'
import LinkedInButtonLink from '@/components/atoms/button/LinkedInButtonLink'
import SpotifyEmbed from '@/components/molecules/SpotifyEmbed'
import ProfileImage from './image.png'

type MemberPopupProps = {
  isOpen: boolean
  onClose: () => void
}

// ═══════════════════════════════════════════════════════
//  AUDIO ENGINE — Web Audio API, zero deps
// ═══════════════════════════════════════════════════════
const useP3Audio = () => {
  const ctxRef = useRef<AudioContext | null>(null)
  const bgmGainRef = useRef<GainNode | null>(null)
  const dataBgmGainRef = useRef<GainNode | null>(null)
  const bgmPlayingRef = useRef(false)
  const dataBgmPlayingRef = useRef(false)

  const getCtx = useCallback((): AudioContext => {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    if (ctxRef.current.state === 'suspended') ctxRef.current.resume()
    return ctxRef.current
  }, [])

  // ── BGM 1: Dark Hour drone (mini game) ──────────────────────────────────
  const startBGM = useCallback(() => {
    if (bgmPlayingRef.current) return
    const ctx = getCtx()
    bgmPlayingRef.current = true

    const master = ctx.createGain()
    master.gain.value = 0.18
    master.connect(ctx.destination)
    bgmGainRef.current = master

    const buildLayer = (freq: number, detune: number, lfoFreq: number, lfoDepth: number) => {
      const osc = ctx.createOscillator()
      osc.type = 'sawtooth'
      osc.frequency.value = freq
      osc.detune.value = detune
      const lfo = ctx.createOscillator()
      lfo.type = 'sine'
      lfo.frequency.value = lfoFreq
      const lfoG = ctx.createGain()
      lfoG.gain.value = lfoDepth
      lfo.connect(lfoG); lfoG.connect(osc.frequency)
      const filt = ctx.createBiquadFilter()
      filt.type = 'lowpass'; filt.frequency.value = 900; filt.Q.value = 6
      const g = ctx.createGain(); g.gain.value = 0.15
      osc.connect(filt); filt.connect(g); g.connect(master)
      lfo.start(); osc.start()
    }
    buildLayer(55, 0, 0.07, 3)
    buildLayer(110, -8, 0.13, 5)
    buildLayer(164.81, 12, 0.19, 7)

    const bufSz = ctx.sampleRate * 2
    const nBuf = ctx.createBuffer(1, bufSz, ctx.sampleRate)
    const nd = nBuf.getChannelData(0)
    for (let i = 0; i < bufSz; i++) nd[i] = (Math.random() * 2 - 1) * 0.08
    const nSrc = ctx.createBufferSource(); nSrc.buffer = nBuf; nSrc.loop = true
    const nFilt = ctx.createBiquadFilter(); nFilt.type = 'bandpass'; nFilt.frequency.value = 200; nFilt.Q.value = 0.8
    const nLfo = ctx.createOscillator(); nLfo.frequency.value = 0.05
    const nLfoG = ctx.createGain(); nLfoG.gain.value = 80
    nLfo.connect(nLfoG); nLfoG.connect(nFilt.frequency)
    nSrc.connect(nFilt); nFilt.connect(master); nLfo.start(); nSrc.start()
  }, [getCtx])

  const stopBGM = useCallback(() => {
    if (!bgmPlayingRef.current) return
    bgmPlayingRef.current = false
    if (bgmGainRef.current) {
      try { bgmGainRef.current.gain.setTargetAtTime(0, bgmGainRef.current.context.currentTime, 0.3) } catch {}
    }
  }, [])

  // ── BGM 2: Data stage — melancholic piano + synth (P3 OST feel) ─────────
  const startDataBGM = useCallback(() => {
    if (dataBgmPlayingRef.current) return
    const ctx = getCtx()
    dataBgmPlayingRef.current = true

    const master = ctx.createGain()
    master.gain.value = 0
    master.connect(ctx.destination)
    dataBgmGainRef.current = master

    // Fade in
    master.gain.setTargetAtTime(0.22, ctx.currentTime, 1.2)

    // Reverb convolver (simple impulse)
    const convolver = ctx.createConvolver()
    const irLen = ctx.sampleRate * 2.5
    const irBuf = ctx.createBuffer(2, irLen, ctx.sampleRate)
    for (let ch = 0; ch < 2; ch++) {
      const d = irBuf.getChannelData(ch)
      for (let i = 0; i < irLen; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / irLen, 2.5)
    }
    convolver.buffer = irBuf
    const dryGain = ctx.createGain(); dryGain.gain.value = 0.6
    const wetGain = ctx.createGain(); wetGain.gain.value = 0.4
    dryGain.connect(master); convolver.connect(wetGain); wetGain.connect(master)

    // Melancholic piano melody — based on P3 "Memories of You" feel
    // A minor pentatonic descending: A4 G4 E4 D4 A3
    const pianoNotes = [
      { freq: 440.00, t: 0.0, dur: 0.8 },   // A4
      { freq: 392.00, t: 0.9, dur: 0.7 },   // G4
      { freq: 329.63, t: 1.7, dur: 1.0 },   // E4
      { freq: 293.66, t: 2.8, dur: 0.7 },   // D4
      { freq: 220.00, t: 3.6, dur: 1.5 },   // A3
      { freq: 261.63, t: 5.2, dur: 0.8 },   // C4
      { freq: 329.63, t: 6.1, dur: 0.7 },   // E4
      { freq: 392.00, t: 6.9, dur: 1.2 },   // G4
      { freq: 440.00, t: 8.2, dur: 2.0 },   // A4 (hold)
    ]
    const loopLen = 10.5

    const playPianoLoop = (startT: number) => {
      pianoNotes.forEach(({ freq, t, dur }) => {
        const noteT = startT + t
        // Piano-like tone: sine + 2nd harmonic
        ;[1, 2, 3].forEach((harmonic, hi) => {
          const osc = ctx.createOscillator()
          osc.type = 'sine'
          osc.frequency.value = freq * harmonic
          const env = ctx.createGain()
          const vol = hi === 0 ? 0.5 : hi === 1 ? 0.15 : 0.05
          env.gain.setValueAtTime(0, noteT)
          env.gain.linearRampToValueAtTime(vol, noteT + 0.015)
          env.gain.exponentialRampToValueAtTime(vol * 0.3, noteT + 0.12)
          env.gain.exponentialRampToValueAtTime(0.001, noteT + dur * 0.9)
          osc.connect(env)
          env.connect(dryGain)
          env.connect(convolver)
          osc.start(noteT); osc.stop(noteT + dur + 0.1)
        })
      })
    }

    // Synth pad underneath — slow moving chord (Am)
    const padNotes = [220, 261.63, 329.63, 392]
    padNotes.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      osc.type = 'triangle'
      osc.frequency.value = freq
      osc.detune.value = (i % 2 === 0 ? -5 : 5)
      const lfo = ctx.createOscillator()
      lfo.frequency.value = 0.15 + i * 0.03
      const lfoG = ctx.createGain(); lfoG.gain.value = 3
      lfo.connect(lfoG); lfoG.connect(osc.frequency)
      const g = ctx.createGain(); g.gain.value = 0.04
      osc.connect(g)
      g.connect(convolver)
      g.connect(dryGain)
      lfo.start(); osc.start()
    })

    // Loop piano melody
    let loopCount = 0
    const scheduleLoop = () => {
      const t = ctx.currentTime + loopCount * loopLen
      playPianoLoop(t)
      loopCount++
      // Schedule next loop slightly before current ends
      const delay = (loopLen - 0.5) * 1000
      setTimeout(() => {
        if (dataBgmPlayingRef.current) scheduleLoop()
      }, delay)
    }
    scheduleLoop()
  }, [getCtx])

  const stopDataBGM = useCallback((fast = false) => {
    if (!dataBgmPlayingRef.current) return
    dataBgmPlayingRef.current = false
    if (dataBgmGainRef.current) {
      try {
        const tc = fast ? 0.15 : 0.8
        dataBgmGainRef.current.gain.setTargetAtTime(0, dataBgmGainRef.current.context.currentTime, tc)
      } catch {}
    }
  }, [])

  // ── SFX: Card flip ──────────────────────────────────────────────────────
  const playFlip = useCallback(() => {
    const ctx = getCtx()
    const osc = ctx.createOscillator()
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(800, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.08)
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.25, ctx.currentTime)
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1)
    osc.connect(g); g.connect(ctx.destination)
    osc.start(); osc.stop(ctx.currentTime + 0.1)
  }, [getCtx])

  // ── SFX: Wrong pair ─────────────────────────────────────────────────────
  const playWrong = useCallback(() => {
    const ctx = getCtx()
    const osc = ctx.createOscillator()
    osc.type = 'square'
    osc.frequency.setValueAtTime(120, ctx.currentTime)
    osc.frequency.setValueAtTime(80, ctx.currentTime + 0.06)
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.3, ctx.currentTime)
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18)
    osc.connect(g); g.connect(ctx.destination)
    osc.start(); osc.stop(ctx.currentTime + 0.18)
    const osc2 = ctx.createOscillator()
    osc2.type = 'sawtooth'
    osc2.frequency.setValueAtTime(340, ctx.currentTime + 0.05)
    osc2.frequency.setValueAtTime(200, ctx.currentTime + 0.12)
    const g2 = ctx.createGain()
    g2.gain.setValueAtTime(0.15, ctx.currentTime + 0.05)
    g2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2)
    osc2.connect(g2); g2.connect(ctx.destination)
    osc2.start(ctx.currentTime + 0.05); osc2.stop(ctx.currentTime + 0.2)
  }, [getCtx])

  // ── SFX: Match chime ────────────────────────────────────────────────────
  const playMatch = useCallback(() => {
    const ctx = getCtx()
    const notes = [523.25, 659.25, 783.99, 1046.5]
    notes.forEach((freq, i) => {
      const t = ctx.currentTime + i * 0.07
      const osc = ctx.createOscillator(); osc.type = 'sine'; osc.frequency.value = freq
      const env = ctx.createGain()
      env.gain.setValueAtTime(0, t); env.gain.linearRampToValueAtTime(0.35, t + 0.02)
      env.gain.exponentialRampToValueAtTime(0.001, t + 0.3)
      osc.connect(env); env.connect(ctx.destination); osc.start(t); osc.stop(t + 0.35)
    })
    const sh = ctx.createOscillator(); sh.type = 'sine'; sh.frequency.value = 2093
    const sG = ctx.createGain()
    sG.gain.setValueAtTime(0.12, ctx.currentTime + 0.1)
    sG.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5)
    sh.connect(sG); sG.connect(ctx.destination)
    sh.start(ctx.currentTime + 0.1); sh.stop(ctx.currentTime + 0.5)
  }, [getCtx])

  // ── SFX: Win fanfare ────────────────────────────────────────────────────
  const playWin = useCallback(() => {
    const ctx = getCtx()
    const melody = [
      { freq: 392, t: 0 }, { freq: 523.25, t: 0.1 }, { freq: 659.25, t: 0.2 },
      { freq: 783.99, t: 0.3 }, { freq: 1046.5, t: 0.4 }, { freq: 1318.5, t: 0.55 },
    ]
    melody.forEach(({ freq, t }) => {
      const osc = ctx.createOscillator(); osc.type = 'square'; osc.frequency.value = freq
      const env = ctx.createGain()
      env.gain.setValueAtTime(0.001, ctx.currentTime + t)
      env.gain.linearRampToValueAtTime(0.22, ctx.currentTime + t + 0.03)
      env.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + 0.25)
      osc.connect(env); env.connect(ctx.destination)
      osc.start(ctx.currentTime + t); osc.stop(ctx.currentTime + t + 0.3)
    })
    const bass = ctx.createOscillator(); bass.type = 'triangle'
    bass.frequency.setValueAtTime(80, ctx.currentTime + 0.55)
    bass.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.85)
    const bG = ctx.createGain()
    bG.gain.setValueAtTime(0.45, ctx.currentTime + 0.55)
    bG.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.9)
    bass.connect(bG); bG.connect(ctx.destination)
    bass.start(ctx.currentTime + 0.55); bass.stop(ctx.currentTime + 0.9)
  }, [getCtx])

  // ── SFX: Evoker shot ────────────────────────────────────────────────────
  const playEvoker = useCallback(() => {
    const ctx = getCtx()
    const bufSize = Math.floor(ctx.sampleRate * 0.15)
    const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate)
    const ch = buf.getChannelData(0)
    for (let i = 0; i < bufSize; i++) ch[i] = (Math.random() * 2 - 1)
    const shot = ctx.createBufferSource(); shot.buffer = buf
    const shotEnv = ctx.createGain()
    shotEnv.gain.setValueAtTime(1.2, ctx.currentTime)
    shotEnv.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15)
    const shotF = ctx.createBiquadFilter(); shotF.type = 'highpass'; shotF.frequency.value = 300
    shot.connect(shotF); shotF.connect(shotEnv); shotEnv.connect(ctx.destination)
    shot.start(); shot.stop(ctx.currentTime + 0.15)
    const ring = ctx.createOscillator(); ring.type = 'sine'
    ring.frequency.setValueAtTime(220, ctx.currentTime + 0.05)
    ring.frequency.exponentialRampToValueAtTime(55, ctx.currentTime + 0.8)
    const rG = ctx.createGain()
    rG.gain.setValueAtTime(0.6, ctx.currentTime + 0.05)
    rG.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.9)
    ring.connect(rG); rG.connect(ctx.destination)
    ring.start(ctx.currentTime + 0.05); ring.stop(ctx.currentTime + 0.9)
    const sweep = ctx.createOscillator(); sweep.type = 'sawtooth'
    sweep.frequency.setValueAtTime(80, ctx.currentTime + 0.1)
    sweep.frequency.exponentialRampToValueAtTime(1800, ctx.currentTime + 0.6)
    const sG = ctx.createGain()
    sG.gain.setValueAtTime(0, ctx.currentTime + 0.1)
    sG.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.2)
    sG.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.65)
    sweep.connect(sG); sG.connect(ctx.destination)
    sweep.start(ctx.currentTime + 0.1); sweep.stop(ctx.currentTime + 0.7)
  }, [getCtx])

  // ── SFX: Click on face (mini evoker zap) ────────────────────────────────
  const playFaceClick = useCallback(() => {
    const ctx = getCtx()
    // Quick zap
    const zap = ctx.createOscillator(); zap.type = 'sawtooth'
    zap.frequency.setValueAtTime(1200, ctx.currentTime)
    zap.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.12)
    const zapG = ctx.createGain()
    zapG.gain.setValueAtTime(0.4, ctx.currentTime)
    zapG.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15)
    zap.connect(zapG); zapG.connect(ctx.destination)
    zap.start(); zap.stop(ctx.currentTime + 0.15)
    // Arcana reveal shimmer
    const shimmer = ctx.createOscillator(); shimmer.type = 'sine'
    shimmer.frequency.setValueAtTime(880, ctx.currentTime + 0.08)
    shimmer.frequency.linearRampToValueAtTime(1760, ctx.currentTime + 0.3)
    const shG = ctx.createGain()
    shG.gain.setValueAtTime(0, ctx.currentTime + 0.08)
    shG.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.12)
    shG.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35)
    shimmer.connect(shG); shG.connect(ctx.destination)
    shimmer.start(ctx.currentTime + 0.08); shimmer.stop(ctx.currentTime + 0.38)
  }, [getCtx])

  // ── SFX: Mouse leave photo (glitch snap) ────────────────────────────────
  const playGlitchSnap = useCallback(() => {
    const ctx = getCtx()
    const osc = ctx.createOscillator(); osc.type = 'square'
    osc.frequency.setValueAtTime(440, ctx.currentTime)
    osc.frequency.setValueAtTime(220, ctx.currentTime + 0.03)
    osc.frequency.setValueAtTime(880, ctx.currentTime + 0.06)
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.18, ctx.currentTime)
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12)
    osc.connect(g); g.connect(ctx.destination)
    osc.start(); osc.stop(ctx.currentTime + 0.12)
  }, [getCtx])

  // ── SFX: Close ──────────────────────────────────────────────────────────
  const playClose = useCallback(() => {
    const ctx = getCtx()
    const osc = ctx.createOscillator(); osc.type = 'triangle'
    osc.frequency.setValueAtTime(200, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.12)
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.3, ctx.currentTime)
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15)
    osc.connect(g); g.connect(ctx.destination)
    osc.start(); osc.stop(ctx.currentTime + 0.15)
  }, [getCtx])

  const destroyCtx = useCallback(() => {
    stopBGM(); stopDataBGM(true)
    setTimeout(() => {
      ctxRef.current?.close()
      ctxRef.current = null
      bgmPlayingRef.current = false
      dataBgmPlayingRef.current = false
    }, 400)
  }, [stopBGM, stopDataBGM])

  return {
    startBGM, stopBGM,
    startDataBGM, stopDataBGM,
    playFlip, playWrong, playMatch, playWin,
    playEvoker, playFaceClick, playGlitchSnap, playClose,
    destroyCtx,
  }
}

// ═══════════════════════════════════════════════════════
//  MEMORY GAME STAGE
// ═══════════════════════════════════════════════════════
type GameAudio = {
  playFlip: () => void
  playWrong: () => void
  playMatch: () => void
  playWin: () => void
}

const MemoryGameStage = ({ onWin, onClose, audio }: { onWin: () => void; onClose: () => void; audio: GameAudio }) => {
  const [cards, setCards] = useState<{ id: number; word: string }[]>([])
  const [flipped, setFlipped] = useState<number[]>([])
  const [matched, setMatched] = useState<number[]>([])
  const [locked, setLocked] = useState(false)

  useEffect(() => {
    const words = ['FOOL', 'MAGICIAN', 'MOON', 'TARTARUS']
    const deck = [...words, ...words]
      .map((word, index) => ({ id: index, word }))
      .sort(() => Math.random() - 0.5)
    setCards(deck)
  }, [])

  const handleCardClick = (index: number) => {
    if (locked || flipped.includes(index) || matched.includes(index)) return
    audio.playFlip()
    const newFlipped = [...flipped, index]
    setFlipped(newFlipped)
    if (newFlipped.length === 2) {
      setLocked(true)
      const match = cards[newFlipped[0]].word === cards[newFlipped[1]].word
      if (match) {
        audio.playMatch()
        const newMatched = [...matched, newFlipped[0], newFlipped[1]]
        setMatched(newMatched)
        setFlipped([]); setLocked(false)
        if (newMatched.length === cards.length) {
          setTimeout(() => audio.playWin(), 100)
          setTimeout(onWin, 600)
        }
      } else {
        audio.playWrong()
        setTimeout(() => { setFlipped([]); setLocked(false) }, 800)
      }
    }
  }

  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 overflow-hidden">
      <div
        className="bg-[#0044cc] border-4 border-white p-6 shadow-[12px_12px_0_0_rgba(255,255,255,1)] max-w-md w-full relative animate-p3-container pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Tombol X nempel di sudut kanan atas border kotak */}
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute -top-[2px] -right-[38px] z-[120] flex h-9 w-9 items-center justify-center border-2 border-l-0 border-white bg-black text-white font-black text-lg leading-none hover:bg-white hover:text-black transition-colors animate-close-pulse"
          title="Kembali (Esc)"
        >
          ✕
        </button>

        <div className="absolute inset-0 bg-[#003399] opacity-50 mix-blend-overlay pointer-events-none"></div>

        <div className="relative z-10 text-center mb-3">
          <p className="text-[10px] font-mono text-blue-200 tracking-[0.3em] uppercase mb-2 opacity-70">
            ― Dark Hour Protocol ―
          </p>
          <h3 className="text-3xl font-black italic text-white uppercase transform -skew-x-6 drop-shadow-[2px_2px_0_rgba(0,0,0,1)]">
            ARCANA LOCK
          </h3>
          <p className="bg-black text-white px-2 py-1 inline-block text-xs font-mono font-bold mt-2 transform skew-x-3">
            MATCH THE ARCANA FRAGMENTS TO AWAKEN
          </p>
        </div>

        <div className="grid grid-cols-4 gap-3 relative z-10">
          {cards.map((card, index) => {
            const isFlipped = flipped.includes(index) || matched.includes(index)
            const isMatched = matched.includes(index)
            return (
              <button
                key={card.id}
                onClick={() => handleCardClick(index)}
                className={`h-24 relative border-2 transition-all duration-300 transform ${
                  isMatched
                    ? 'bg-[#00ddff] border-black scale-105'
                    : isFlipped
                    ? 'bg-white border-black scale-105'
                    : 'bg-black border-white hover:border-blue-400 hover:scale-105'
                }`}
                style={{ perspective: '1000px' }}
              >
                <div className={`absolute inset-0 flex items-center justify-center font-black italic text-sm ${
                  isMatched ? 'text-black' : isFlipped ? 'text-blue-600' : 'text-transparent'
                }`}>
                  {isFlipped
                    ? <span className="transform -skew-x-6">{card.word}</span>
                    : <span className="text-white opacity-20 text-3xl font-mono">?</span>
                  }
                </div>
              </button>
            )
          })}
        </div>

        <p className="relative z-10 text-center text-[9px] font-mono text-blue-300 tracking-widest mt-4 opacity-60 italic">
          "The moment man devoured the fruit of knowledge, he sealed his own fate..."
        </p>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════
//  KOMPONEN UTAMA
// ═══════════════════════════════════════════════════════
const MemberPopup = ({ isOpen, onClose }: MemberPopupProps) => {
  const [popupStage, setPopupStage] = useState<'game' | 'evoker' | 'data'>('game')
  const [ambientOn, setAmbientOn] = useState(true)

  // Photo interaction states
  const imgContainerRef = useRef<HTMLDivElement>(null)
  const [isTracking, setIsTracking] = useState(false)
  const [isGlitching, setIsGlitching] = useState(false)     // cursor leave glitch
  const [faceClickFx, setFaceClickFx] = useState(false)     // click on face overlay
  const [arcanaVisible, setArcanaVisible] = useState(false)  // arcana card overlay

  const audio = useP3Audio()

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imgContainerRef.current) return
    const rect = imgContainerRef.current.getBoundingClientRect()
    imgContainerRef.current.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`)
    imgContainerRef.current.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`)
  }

  // ── Cursor enters photo ──────────────────────────────────────────────────
  const handleMouseEnter = () => {
    setIsTracking(true)
    setIsGlitching(false)
  }

  // ── Cursor LEAVES photo → glitch displacement ────────────────────────────
  const handleMouseLeave = () => {
    setIsTracking(false)
    audio.playGlitchSnap()
    setIsGlitching(true)
    // glitch lasts 600ms then resets
    setTimeout(() => setIsGlitching(false), 600)
  }

  // ── Click on face → semua efek sekaligus ────────────────────────────────
  const handleFaceClick = () => {
    if (faceClickFx) return
    audio.playFaceClick()
    setFaceClickFx(true)
    setArcanaVisible(true)
    setTimeout(() => setFaceClickFx(false), 700)
    setTimeout(() => setArcanaVisible(false), 1800)
  }

  // ── Toggle ambient music ─────────────────────────────────────────────────
  const handleToggleAmbient = () => {
    if (ambientOn) {
      audio.stopDataBGM()
      setAmbientOn(false)
    } else {
      audio.startDataBGM()
      setAmbientOn(true)
    }
  }

  useEffect(() => {
    if (!isOpen) {
      setPopupStage('game')
      setAmbientOn(true)
      audio.destroyCtx()
      return
    }
    audio.startBGM()
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { audio.playClose(); setTimeout(onClose, 120) }
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', handleKeyDown) }
  }, [isOpen])

  if (!isOpen) return null

  const handleClose = () => { audio.playClose(); setTimeout(onClose, 120) }

  const handleWinGame = () => {
    audio.stopBGM()
    setTimeout(() => audio.playEvoker(), 100)
    setPopupStage('evoker')
    setTimeout(() => {
      setPopupStage('data')
      // Start melancholic piano BGM after evoker scene
      setTimeout(() => audio.startDataBGM(), 400)
    }, 2000)
  }

  return createPortal(
    <>
      <style>{`
        @keyframes p3-container-summon {
          0% { opacity: 0; transform: scale(1.05) translateY(-20px); filter: brightness(2); }
          100% { opacity: 1; transform: scale(1) translateY(0); filter: brightness(1); }
        }
        @keyframes evoker-flash {
          0% { background-color: rgba(0,0,0,1); }
          10% { background-color: rgba(255,255,255,1); }
          20% { background-color: rgba(0,68,204,1); }
          100% { background-color: rgba(0,0,0,1); }
        }
        @keyframes evoker-text-zoom {
          0% { transform: scale(0.1) skewX(-20deg); opacity: 0; letter-spacing: -20px; }
          20% { transform: scale(1.2) skewX(-15deg); opacity: 1; letter-spacing: 10px; filter: drop-shadow(0 0 20px cyan); }
          80% { transform: scale(1) skewX(-10deg); opacity: 1; letter-spacing: 5px; }
          100% { transform: scale(5) skewX(-30deg); opacity: 0; filter: blur(10px); }
        }
        @keyframes glass-shatter {
          0% { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); opacity: 1; }
          50% { clip-path: polygon(10% 20%, 90% 10%, 80% 80%, 20% 90%); opacity: 0.8; }
          100% { clip-path: polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%); opacity: 0; }
        }
        @keyframes tracker-glitch {
          0% { filter: hue-rotate(0deg) blur(0px); }
          20% { filter: hue-rotate(45deg) blur(1px); transform: translate(-1px, 1px); }
          40% { filter: hue-rotate(-45deg) blur(0px); transform: translate(1px, -1px); }
          60% { filter: hue-rotate(0deg) blur(1px); transform: translate(0, 0); }
          100% { filter: hue-rotate(0deg) blur(0px); }
        }
        @keyframes ai-scan {
          0% { top: 5%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 95%; opacity: 0; }
        }
        @keyframes close-btn-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(255,255,255,0.4); }
          50% { box-shadow: 0 0 0 6px rgba(255,255,255,0); }
        }

        /* ── Glitch displacement on mouse leave ── */
        @keyframes glitch-displacement {
          0%   { transform: translate(0, 0) skewX(0deg); filter: hue-rotate(0deg); }
          10%  { transform: translate(-8px, 2px) skewX(-4deg); filter: hue-rotate(90deg) saturate(3); clip-path: inset(20% 0 40% 0); }
          20%  { transform: translate(6px, -3px) skewX(3deg); filter: hue-rotate(-90deg) saturate(2); clip-path: inset(60% 0 10% 0); }
          30%  { transform: translate(-4px, 4px) skewX(-2deg); filter: hue-rotate(45deg); clip-path: inset(5% 0 70% 0); }
          40%  { transform: translate(10px, -1px) skewX(5deg); filter: hue-rotate(180deg) saturate(4); clip-path: inset(40% 0 30% 0); }
          50%  { transform: translate(-6px, 0px) skewX(-3deg); filter: hue-rotate(270deg); clip-path: inset(0% 0 0% 0); }
          60%  { transform: translate(4px, 2px) skewX(2deg); filter: hue-rotate(0deg) saturate(2); clip-path: inset(70% 0 5% 0); }
          70%  { transform: translate(-2px, -2px) skewX(-1deg); filter: hue-rotate(30deg); clip-path: inset(0% 0 0% 0); }
          85%  { transform: translate(2px, 0) skewX(0deg); filter: none; clip-path: none; }
          100% { transform: translate(0, 0) skewX(0deg); filter: none; clip-path: none; }
        }
        .animate-glitch-disp { animation: glitch-displacement 0.6s steps(1) forwards; }

        /* ── Face click: full-screen glitch flash ── */
        @keyframes face-click-flash {
          0%   { opacity: 0; }
          10%  { opacity: 0.7; transform: translate(-4px, 0); filter: hue-rotate(180deg); }
          20%  { opacity: 0.3; transform: translate(4px, -2px); filter: hue-rotate(90deg); }
          35%  { opacity: 0.6; transform: translate(-2px, 2px); }
          50%  { opacity: 0.4; transform: translate(0, 0); }
          70%  { opacity: 0.2; }
          100% { opacity: 0; }
        }
        .animate-face-flash { animation: face-click-flash 0.7s steps(2) forwards; }

        /* ── Arcana card reveal ── */
        @keyframes arcana-reveal {
          0%   { opacity: 0; transform: scale(0.3) rotate(-15deg); filter: brightness(3); }
          15%  { opacity: 1; transform: scale(1.08) rotate(2deg); filter: brightness(1.5); }
          30%  { transform: scale(0.96) rotate(-1deg); }
          45%  { transform: scale(1.02) rotate(0deg); }
          70%  { opacity: 1; transform: scale(1) rotate(0deg); }
          85%  { opacity: 0.8; }
          100% { opacity: 0; transform: scale(1.1) rotate(3deg); }
        }
        .animate-arcana { animation: arcana-reveal 1.8s cubic-bezier(0.22, 1, 0.36, 1) forwards; }

        /* ── Ambient toggle button ── */
        @keyframes ambient-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(0, 221, 255, 0.5); }
          50% { box-shadow: 0 0 0 5px rgba(0, 221, 255, 0); }
        }
        .animate-ambient-pulse { animation: ambient-pulse 2s ease-in-out infinite; }

        .animate-p3-container { animation: p3-container-summon 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        .animate-evoker-bg { animation: evoker-flash 2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
        .animate-evoker-text { animation: evoker-text-zoom 1.8s cubic-bezier(0.1, 0.9, 0.2, 1) forwards; }
        .animate-shatter { animation: glass-shatter 0.5s ease-out 1.5s forwards; }
        .animate-tracker-glitch { animation: tracker-glitch 0.3s ease-in-out infinite alternate; }
        .animate-ai-scan { animation: ai-scan 2.5s linear infinite; }
        .animate-close-pulse { animation: close-btn-pulse 2s ease-in-out infinite; }

        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: black; border-left: 1px solid white; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: white; }
      `}</style>

      {/* Backdrop */}
      <div className={`fixed inset-0 z-[90] bg-black/80 backdrop-blur-md transition-opacity duration-300 ${
        popupStage === 'evoker' ? 'opacity-0' : 'opacity-100'
      } ${popupStage === 'data' ? 'hidden' : 'block'}`}></div>

      {/* STAGE 1 & 2: MEMORY GAME & EVOKER */}
      <div className={`fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto px-4 pt-28 pb-8 sm:pt-32 ${
        popupStage === 'data' ? 'hidden' : 'block'
      }`}>
        <button type="button" aria-label="Close" onClick={handleClose} className="absolute inset-0 cursor-default" />

        {popupStage === 'game' && (
          <MemoryGameStage
            onWin={handleWinGame}
            onClose={handleClose}
            audio={{
              playFlip: audio.playFlip,
              playWrong: audio.playWrong,
              playMatch: audio.playMatch,
              playWin: audio.playWin,
            }}
          />
        )}

        {popupStage === 'evoker' && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center overflow-hidden animate-evoker-bg pointer-events-none">
            <div className="absolute inset-0 bg-blue-500 mix-blend-overlay animate-shatter"></div>
            <div className="relative text-center">
              <p className="text-white text-xl tracking-widest font-mono mb-4 opacity-50 italic">
                I am thou, thou art I...
              </p>
              <h1 className="text-6xl sm:text-9xl font-black text-white italic uppercase drop-shadow-[0_0_15px_rgba(0,195,255,0.8)] animate-evoker-text mix-blend-screen">
                PERSONA!
              </h1>
            </div>
          </div>
        )}
      </div>

      {/* STAGE 3: DATA ANGGOTA */}
      {popupStage === 'data' && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto px-4">
          <button type="button" aria-label="Close" onClick={handleClose} className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-default" />

          {/* Kotak Utama */}
          <div className="bg-[#0044cc] relative z-10 max-h-[100dvh] w-full max-w-[720px] animate-p3-container overflow-y-auto rounded-none border-4 border-white p-6 text-white shadow-[12px_12px_0_0_rgba(255,255,255,1)] sm:p-8 custom-scrollbar">

            {/* Tombol X */}
            <button
              type="button"
              aria-label="Close"
              onClick={handleClose}
              className="border-2 border-white hover:bg-white hover:text-black absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-none bg-black text-white font-black text-xl leading-none transition-colors z-20"
            >
              ✕
            </button>

            {/* ── AMBIENT TOGGLE BUTTON ─────────────────────────────── */}
            <button
              type="button"
              onClick={handleToggleAmbient}
              className={`absolute top-4 right-16 z-20 flex items-center gap-1.5 px-2 h-9 border-2 font-mono text-[10px] font-black tracking-widest uppercase transition-all ${
                ambientOn
                  ? 'border-[#00ddff] bg-black text-[#00ddff] animate-ambient-pulse'
                  : 'border-white/40 bg-black/60 text-white/40'
              }`}
              title={ambientOn ? 'Turn off ambient music' : 'Turn on ambient music'}
            >
              {/* Music note icon */}
              <svg width="10" height="12" viewBox="0 0 10 12" fill="currentColor">
                <path d="M9 0v8.5A1.5 1.5 0 1 1 7 7V2.5L3 3.5V10A1.5 1.5 0 1 1 1 8.5V1.5L9 0Z"/>
              </svg>
              {ambientOn ? 'BGM ON' : 'BGM OFF'}
            </button>

            {/* Header P3 */}
            <div className="mb-4 flex items-center gap-3 relative z-10 pr-32">
              <div className="h-[2px] flex-1 bg-white/30"></div>
              <p className="text-[10px] font-mono tracking-[0.4em] text-blue-200 uppercase opacity-70 whitespace-nowrap">
                — Shadow Operatives File —
              </p>
              <div className="h-[2px] flex-1 bg-white/30"></div>
            </div>

            {/* ── AREA FOTO PROFIL ──────────────────────────────────── */}
            <div
              ref={imgContainerRef}
              onMouseMove={handleMouseMove}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleFaceClick}
              className="border-4 border-black mb-5 overflow-hidden rounded-none bg-white relative transform -skew-x-2 cursor-crosshair h-80 sm:h-96"
            >
              {/* Layer 1: B&W base */}
              <Image
                src={ProfileImage}
                alt="Profile Image"
                className={`absolute inset-0 w-full h-full object-cover object-center filter grayscale contrast-125 brightness-90 scale-110 ${
                  isGlitching ? 'animate-glitch-disp' : ''
                }`}
              />
              <div className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '4px 4px' }}
              ></div>

              {/* Layer 2: Colour reveal (cursor clip) */}
              <div
                className="absolute inset-0 transition-opacity duration-200 pointer-events-none"
                style={{
                  opacity: isTracking ? 1 : 0,
                  clipPath: 'polygon(calc(var(--mouse-x) - 60px) calc(var(--mouse-y) - 60px), calc(var(--mouse-x) + 60px) calc(var(--mouse-y) - 60px), calc(var(--mouse-x) + 60px) calc(var(--mouse-y) + 60px), calc(var(--mouse-x) - 60px) calc(var(--mouse-y) + 60px))',
                }}
              >
                <Image
                  src={ProfileImage}
                  alt="Profile Color"
                  className="absolute inset-0 w-full h-full object-cover object-center saturate-[1.2] contrast-110 animate-tracker-glitch scale-110"
                />
                <div className="absolute inset-0 bg-blue-500/20 mix-blend-screen"></div>
              </div>

              {/* Layer 3: Tracker UI box */}
              <div
                className="absolute pointer-events-none transition-opacity duration-200 z-10"
                style={{
                  opacity: isTracking ? 1 : 0,
                  left: 'calc(var(--mouse-x) - 60px)',
                  top: 'calc(var(--mouse-y) - 60px)',
                  width: '120px', height: '120px',
                }}
              >
                <div className="absolute inset-0 border-[1px] border-[#00ddff] shadow-[0_0_8px_rgba(0,221,255,0.5)]"></div>
                <div className="absolute top-[-2px] left-[-2px] w-3 h-3 border-t-2 border-l-2 border-white"></div>
                <div className="absolute top-[-2px] right-[-2px] w-3 h-3 border-t-2 border-r-2 border-white"></div>
                <div className="absolute bottom-[-2px] left-[-2px] w-3 h-3 border-b-2 border-l-2 border-white"></div>
                <div className="absolute bottom-[-2px] right-[-2px] w-3 h-3 border-b-2 border-r-2 border-white"></div>
                <div className="absolute -top-4 left-0 bg-[#0044cc] text-white text-[8px] font-mono px-1 border border-[#00ddff]">
                  SEES:MBR_5027251030
                </div>
                <div className="absolute -bottom-4 right-0 text-[#00ddff] text-[8px] font-mono tracking-widest drop-shadow-[0_0_2px_#00ddff]">
                  [LCK_ON]
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4">
                  <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/70 -translate-y-1/2"></div>
                  <div className="absolute left-1/2 top-0 h-full w-[1px] bg-white/70 -translate-x-1/2"></div>
                </div>
              </div>

              {/* Laser Scanline */}
              <div className={`absolute left-0 w-full h-[2px] bg-[#00ddff] shadow-[0_0_8px_2px_rgba(0,221,255,0.7)] animate-ai-scan ${isTracking ? 'block' : 'hidden'}`}></div>

              {/* ── Face click: glitch flash overlay ── */}
              {faceClickFx && (
                <div className="absolute inset-0 z-30 pointer-events-none animate-face-flash"
                  style={{ background: 'linear-gradient(135deg, #00ddff55, #0044ccaa, #ffffff33)' }}
                >
                  <div className="absolute inset-0 opacity-60" style={{
                    backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,221,255,0.15) 3px, rgba(0,221,255,0.15) 4px)',
                  }}></div>
                  <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white font-black text-lg italic tracking-widest drop-shadow-[0_0_8px_#00ddff] whitespace-nowrap">
                    TARGET LOCKED
                  </p>
                </div>
              )}

              {/* ── Arcana card overlay ── */}
              {arcanaVisible && (
                <div className="absolute inset-0 z-40 pointer-events-none flex items-center justify-center animate-arcana">
                  <div className="bg-black border-4 border-white w-32 h-48 flex flex-col items-center justify-center gap-2 shadow-[0_0_30px_rgba(0,195,255,0.8)]"
                    style={{ transform: 'rotate(-2deg)' }}
                  >
                    {/* Roman numeral */}
                    <p className="text-[#00ddff] font-mono text-xs tracking-widest">— 0 —</p>
                    {/* Star symbol */}
                    <p className="text-white text-4xl">☆</p>
                    {/* Arcana name */}
                    <p className="text-white font-black text-sm italic tracking-wider uppercase">THE FOOL</p>
                    {/* Bottom decoration */}
                    <div className="w-full px-3 mt-1">
                      <div className="h-[1px] bg-white/50 w-full"></div>
                      <p className="text-white/60 font-mono text-[8px] text-center mt-1 tracking-widest">SEES MEMBER</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Level Badge */}
              <div className="absolute bottom-2 right-2 bg-black text-white font-black px-3 py-1 italic tracking-widest text-lg border-2 border-white z-50 transform skew-x-[-12deg]">
                S.LINK Lv.24
              </div>

              {/* Hint text saat hover */}
              {isTracking && (
                <div className="absolute top-2 left-2 z-20 pointer-events-none">
                  <p className="text-[#00ddff] text-[8px] font-mono tracking-widest bg-black/70 px-1 py-0.5 border border-[#00ddff]/50">
                    [CLICK TO REVEAL ARCANA]
                  </p>
                </div>
              )}
            </div>

            {/* Nama & NRP */}
            <div className="pr-10 relative z-10 text-white">
              <h2 className="text-3xl sm:text-4xl font-black italic tracking-tighter uppercase drop-shadow-[3px_3px_0_rgba(0,0,0,1)]">
                Muhammad Syadzili Abdul Muhyi
              </h2>
              <p className="bg-white text-black inline-block px-3 py-1 mt-2 text-sm font-bold italic">
                5027251030 — Jakarta
              </p>
            </div>

            {/* Social Links */}
            <div className="mt-5 flex gap-2 relative z-10">
              <Instagram username="syadzili1969" />
              <LinkedInButtonLink username="muhammad-syadzili-abdul-muhyi-114859333" />
            </div>

            {/* Info Cards */}
            <div className="mt-6 grid gap-4 text-sm font-semibold sm:grid-cols-2 relative z-10 text-black">
              <div className="border-2 border-black bg-white rounded-none p-4 shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform">
                <p className="text-blue-600 font-black text-xs tracking-widest uppercase mb-1">Hobby</p>
                <p className="text-lg font-bold">Reading cool stuff</p>
              </div>
              <div className="border-2 border-black bg-[#00ddff] rounded-none p-4 shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform">
                <p className="text-black font-black text-xs tracking-widest uppercase mb-1">Fun Fact</p>
                <p className="text-base font-bold">Jack of all trades</p>
              </div>
            </div>

            {/* Spotify */}
            <div className="mt-6 bg-black border-2 border-white p-5 text-white relative rounded-none shadow-[6px_6px_0_0_rgba(0,195,255,0.5)] z-10">
              <p className="absolute -top-3 left-4 bg-[#0047b3] px-2 text-white text-xs font-black tracking-wider uppercase italic border border-white">
                Fav Song
              </p>
              <p className="my-2 text-md font-bold italic text-[#b3d9ff]">It's Going Down Now</p>
              <div className="grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-300 mt-2">
                <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/3znIACSXPLn3HFCf7moZ28?si=MqB2MbROSo6j9HJ_TceSNw" />
              </div>
            </div>

            {/* Footer */}
            <p className="relative z-10 text-center text-[9px] font-mono text-blue-200/50 tracking-widest mt-6 italic">
              "Memento Mori" — Remember, you will die. But until then, keep moving forward.
            </p>
          </div>
        </div>
      )}
    </>,
    document.body
  )
}

export default MemberPopup
