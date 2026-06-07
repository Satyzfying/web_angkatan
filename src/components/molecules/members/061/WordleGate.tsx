'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import BgImage from './bg.webp'
import bgMusic from './bgMusic'

const WORDS = [
  'PIXEL','LINUX','SHURA','FRAME','BLEND','CRAFT','QUEST','SWIFT',
  'GRIND','STARK','PRISM','FLARE','STORM','BLAZE','CRISP','CLAMP',
  'FETCH','SPAWN','GLIDE','TRACE','SCOUT','PLUMB','KNACK','DEPOT',
  'FLASK','OXIDE','MERGE','PATCH','RESET','DEBUG','CHUNK','STACK',
]

const KB_ROWS = [
  'QWERTYUIOP'.split(''),
  'ASDFGHJKL'.split(''),
  ['⌫', ...'ZXCVBNM'.split(''), '↵'],
]

type LS = 'correct' | 'present' | 'absent' | 'empty'
type GS = 'playing' | 'won' | 'lost'

/* ── key helpers ─────────────────────────────────────────────────────────── */
export function getTodayKey(offset = 0) {
  const d = new Date()
  d.setDate(d.getDate() - offset)
  return `wordle-solved-${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
}

function getWordForOffset(offset = 0) {
  const base = new Date(2024, 0, 1)
  const days = Math.floor((Date.now() - base.getTime()) / 86400000) - offset
  return WORDS[((days % WORDS.length) + WORDS.length) % WORDS.length]
}

function getMidnight() { const d = new Date(); d.setHours(24,0,0,0); return d }
function fmtCountdown(ms: number) {
  const h = Math.floor(ms/3600000), m = Math.floor((ms%3600000)/60000), s = Math.floor((ms%60000)/1000)
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`
}

const ROWS_N = 6, COLS = 5

const C = {
  bHi: '#ffffff', bLo: '#808080', bDark: '#404040',
  body: '#d4d0c8', mono: '"Courier New", Courier, monospace',
  ui:   '"Trebuchet MS", "Segoe UI", sans-serif',
  tileEmpty:   { bg: '#c0bdb6', border: '#888', letter: '#000' },
  tileAbsent:  { bg: '#7a7a7a', border: '#555', letter: '#fff' },
  tilePresent: { bg: '#c8b400', border: '#9a8a00', letter: '#000' },
  tileCorrect: { bg: '#3ea832', border: '#2a7a20', letter: '#fff' },
}

const raised = (invert = false): React.CSSProperties => ({
  border: '2px solid',
  borderColor: invert
    ? `${C.bLo} ${C.bHi} ${C.bHi} ${C.bLo}`
    : `${C.bHi} ${C.bLo} ${C.bLo} ${C.bHi}`,
})

/* ── Tile ────────────────────────────────────────────────────────────────── */
const Tile = ({ letter, state, filled }: { letter: string; state: LS; filled: boolean }) => {
  const key = `tile${state.charAt(0).toUpperCase()+state.slice(1)}` as keyof typeof C
  const col = (state !== 'empty' ? C[key] : filled ? { ...C.tileEmpty, border: '#555' } : C.tileEmpty) as typeof C.tileEmpty
  return (
    <div style={{
      width: 56, height: 56,
      background: col.bg, border: `3px solid ${col.border}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 28, fontWeight: 900, color: col.letter,
      fontFamily: C.mono, userSelect: 'none',
      boxShadow: `inset 1px 1px 0 rgba(255,255,255,0.25), inset -1px -1px 0 rgba(0,0,0,0.15)`,
    }}>
      {letter}
    </div>
  )
}

/* ── Key ─────────────────────────────────────────────────────────────────── */
const KEY_BG: Record<LS,string> = { empty:'#d4d0c8', absent:'#7a7a7a', present:'#c8b400', correct:'#3ea832' }
const KEY_FG: Record<LS,string> = { empty:'#000', absent:'#fff', present:'#000', correct:'#fff' }

const Key = ({ label, state, onPress }: { label:string; state:LS; onPress:(k:string)=>void }) => {
  const wide = label==='⌫'||label==='↵'
  return (
    <button type="button" onClick={()=>onPress(label)} style={{
      minWidth: wide?52:32, height:34, padding:'0 2px',
      background: `linear-gradient(180deg,rgba(255,255,255,0.45) 0%,${KEY_BG[state]} 100%)`,
      border:'1px solid', borderColor:`${C.bHi} ${C.bDark} ${C.bDark} ${C.bHi}`,
      boxShadow:`inset 0 1px 0 rgba(255,255,255,0.8)`,
      color: KEY_FG[state], fontSize: wide?10:12, fontWeight:700,
      fontFamily:C.mono, cursor:'pointer', userSelect:'none', borderRadius:1,
      transition:'background 0.15s',
    }}>
      {label}
    </button>
  )
}

/* ── WordleGate ──────────────────────────────────────────────────────────── */
type Props = {
  isOpen: boolean
  onClose: () => void
  onSolved: (offset: number) => void
  /** 0 = today (gate), 1+ = historical (help mode from ? button) */
  offsetDays?: number
}

const WordleGate = ({ isOpen, onClose, onSolved, offsetDays = 0 }: Props) => {
  const TARGET = getWordForOffset(offsetDays)
  const isHelpMode = offsetDays > 0

  const fresh = () => ({
    guesses:   Array.from({length:ROWS_N},()=>Array(COLS).fill('')) as string[][],
    states:    Array.from({length:ROWS_N},()=>Array(COLS).fill('empty')) as LS[][],
    curRow:    0, curCol: 0,
    gameState: 'playing' as GS,
    letterMap: {} as Record<string,LS>,
    shake:     false, message: '',
  })

  const [g, setG]             = useState(fresh)
  const [countdown, setCountdown] = useState('')
  const [muted, setMuted]     = useState(false)
  const audioRef              = useRef<HTMLAudioElement | null>(null)

  const toggleMute = () => {
    setMuted(m => {
      const next = !m
      if (audioRef.current) audioRef.current.muted = next
      return next
    })
  }

  /* reset whenever offset changes (new puzzle opened) */
  useEffect(() => { setG(fresh()) }, [offsetDays, isOpen])

  /* scroll lock */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  /* audio: create on open, destroy on close */
  useEffect(() => {
    if (!isOpen) return
    const audio = new Audio(bgMusic)
    audio.loop   = true
    audio.volume = 0.4
    audio.muted  = muted
    audioRef.current = audio
    audio.play().catch(() => {})
    return () => {
      audio.pause()
      audio.src = ''
      audioRef.current = null
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  useEffect(() => {
    if (g.gameState !== 'lost' || isHelpMode) return
    const tick = () => setCountdown(fmtCountdown(Math.max(0,getMidnight().getTime()-Date.now())))
    tick(); const id = setInterval(tick,1000); return ()=>clearInterval(id)
  }, [g.gameState, isHelpMode])

  const evaluate = useCallback((guess: string[]): LS[] => {
    const res: LS[] = Array(COLS).fill('absent')
    const tArr = TARGET.split(''), gArr=[...guess], used=Array(COLS).fill(false)
    for(let i=0;i<COLS;i++) if(gArr[i]===tArr[i]){res[i]='correct';used[i]=true;gArr[i]='#'}
    for(let i=0;i<COLS;i++){
      if(res[i]==='correct') continue
      for(let j=0;j<COLS;j++) if(!used[j]&&gArr[i]===tArr[j]){res[i]='present';used[j]=true;break}
    }
    return res
  }, [TARGET])

  const submit = useCallback(() => {
    if (g.curCol < COLS) {
      setG(p=>({...p, shake:true, message:'Not enough letters'}))
      setTimeout(()=>setG(p=>({...p, shake:false, message:''})), 600)
      return
    }
    const guess = g.guesses[g.curRow]
    const result = evaluate(guess)

    const newStates = g.states.map(r=>[...r])
    newStates[g.curRow] = result

    const newMap = {...g.letterMap}
    guess.forEach((l,i)=>{
      if(newMap[l]==='correct') return
      if(result[i]==='correct') newMap[l]='correct'
      else if(result[i]==='present'&&newMap[l]!=='correct') newMap[l]='present'
      else if(!newMap[l]) newMap[l]='absent'
    })

    const word = guess.join('')
    if (word === TARGET) {
      setG(p=>({...p, states:newStates, letterMap:newMap, gameState:'won', message: isHelpMode ? `Nice! The word was ${TARGET}` : "You're in! 🎉"}))
      if (!isHelpMode) {
        localStorage.setItem(getTodayKey(0),'true')
        setTimeout(()=>onSolved(offsetDays), 1100)
      }
    } else if (g.curRow === ROWS_N-1) {
      setG(p=>({...p, states:newStates, letterMap:newMap, gameState:'lost', message:`The word was: ${TARGET}`}))
    } else {
      setG(p=>({...p, states:newStates, letterMap:newMap, curRow:p.curRow+1, curCol:0}))
    }
  }, [g, evaluate, TARGET, isHelpMode, offsetDays, onSolved])

  const press = useCallback((key: string) => {
    if (g.gameState !== 'playing') return
    if (key==='⌫'||key==='BACKSPACE') {
      if(g.curCol===0) return
      setG(p=>{
        const gs=p.guesses.map(r=>[...r]); gs[p.curRow][p.curCol-1]=''
        return {...p, guesses:gs, curCol:p.curCol-1}
      })
    } else if (key==='↵'||key==='ENTER') {
      submit()
    } else if (/^[A-Z]$/.test(key)&&g.curCol<COLS) {
      setG(p=>{
        const gs=p.guesses.map(r=>[...r]); gs[p.curRow][p.curCol]=key
        return {...p, guesses:gs, curCol:p.curCol+1}
      })
    }
  }, [g, submit])

  useEffect(()=>{
    if(!isOpen) return
    const h=(e:KeyboardEvent)=>{ if(e.key==='Escape'){onClose();return}; press(e.key.toUpperCase()) }
    window.addEventListener('keydown',h); return()=>window.removeEventListener('keydown',h)
  },[isOpen,press,onClose])



  if(!isOpen) return null

  const titleLabel = isHelpMode
    ? `wordle.exe — ${offsetDays} day${offsetDays>1?'s':''} ago`
    : 'wordle.exe'

  const statusLabel = isHelpMode
    ? `Replaying puzzle from ${offsetDays} day${offsetDays>1?'s':''} ago`
    : 'Solve to unlock profile'

  return (
    <div style={{
      position:'fixed', inset:0, zIndex:100,
      display:'flex', alignItems:'center', justifyContent:'center',
      backgroundImage:`url(${BgImage.src})`,
      backgroundSize:'cover', backgroundPosition:'center',
    }}>
      <button type="button" aria-label="Close" onClick={onClose} style={{
        position:'absolute', inset:0, background:'rgba(0,0,0,0.25)', border:'none', cursor:'default',
      }}/>

      <div style={{
        position:'relative', zIndex:10, width:520,
        outline:`1px solid #0a246a`,
        border:'2px solid', borderColor:`${C.bHi} ${C.bDark} ${C.bDark} ${C.bHi}`,
        boxShadow:`1px 1px 0 #0a246a`,
        background:C.body, fontFamily:C.mono,
      }}>

        {/* Title bar */}
        <div style={{
          background:`linear-gradient(180deg,#0a246a 0%,#3169c4 6%,#2558b0 15%,#1d4fa3 50%,#1a47a0 94%,#0a246a 100%)`,
          padding:'3px 3px 3px 6px',
          display:'flex', alignItems:'center', justifyContent:'space-between', userSelect:'none',
        }}>
          <div style={{display:'flex', alignItems:'center', gap:4}}>
            <div style={{width:16,height:16,background:'linear-gradient(135deg,#aef,#48f)',border:'1px solid rgba(255,255,255,0.4)',flexShrink:0}}/>
            <span style={{color:'#fff',fontSize:12,fontWeight:700,fontFamily:`"Trebuchet MS",sans-serif`,textShadow:'1px 1px 1px rgba(0,0,0,0.5)'}}>
              {titleLabel}
            </span>
          </div>
          <div style={{display:'flex',gap:2}}>
            <button type="button" onClick={onClose} style={{
              width:21,height:21,padding:0,
              background:'linear-gradient(180deg,#e8e6e0 0%,#cdc9c0 100%)',
              border:'1px solid', borderColor:`${C.bHi} ${C.bDark} ${C.bDark} ${C.bHi}`,
              boxShadow:`inset 1px 1px 0 rgba(255,255,255,0.9)`,
              color:'#000',fontSize:11,fontWeight:900,
              fontFamily:`"Trebuchet MS",sans-serif`,
              cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',
            }}>X</button>
          </div>
        </div>

        {/* Body */}
        <div style={{padding:'12px',display:'flex',flexDirection:'column',gap:10,background:C.body}}>

          {/* message */}
          <div style={{minHeight:24,display:'flex',alignItems:'center',justifyContent:'center'}}>
            {g.message&&(
              <div style={{
                background:g.gameState==='won'?'#3ea832':g.gameState==='lost'?'#a83232':'#1a1a1a',
                color:'#fff',fontSize:12,fontWeight:700,
                padding:'3px 16px', border:'1px solid rgba(0,0,0,0.35)', fontFamily:C.mono,
              }}>{g.message}</div>
            )}
          </div>

          {/* grid */}
          <div style={{...raised(),background:'#c8c5be',padding:'10px',display:'flex',flexDirection:'column',gap:4,alignItems:'center'}}>
            {g.guesses.map((row,rIdx)=>(
              <div key={rIdx} style={{
                display:'flex',gap:4,
                animation:g.shake&&rIdx===g.curRow?'wg-shake 0.5s ease':undefined,
              }}>
                {row.map((letter,cIdx)=>(
                  <Tile key={cIdx} letter={letter} state={g.states[rIdx][cIdx]} filled={!!letter}/>
                ))}
              </div>
            ))}
          </div>

          {/* keyboard */}
          <div style={{...raised(),background:'#c8c5be',padding:'10px 8px',display:'flex',flexDirection:'column',gap:5,alignItems:'center'}}>
            {KB_ROWS.map((row,i)=>(
              <div key={i} style={{display:'flex',gap:3,justifyContent:'center'}}>
                {row.map(key=>(
                  <Key key={key} label={key} state={g.letterMap[key]??'empty'} onPress={press}/>
                ))}
              </div>
            ))}
          </div>

          {/* lost: countdown (only for today's puzzle, not help mode) */}
          {g.gameState==='lost'&&!isHelpMode&&(
            <div style={{...raised(true),background:'#c8c5be',padding:'8px 12px',textAlign:'center'}}>
              <div style={{fontSize:11,color:'#555',marginBottom:4,fontFamily:C.ui}}>Come back tomorrow</div>
              <div style={{fontSize:30,fontWeight:900,letterSpacing:6,fontFamily:C.mono}}>{countdown}</div>
            </div>
          )}

          {/* help mode: go back further button */}
          {isHelpMode&&(g.gameState==='won'||g.gameState==='lost')&&(
            <div style={{...raised(),background:'#c8c5be',padding:'8px',textAlign:'center'}}>
              <button
                type="button"
                onClick={()=>onSolved(offsetDays + 1)}
                style={{
                  padding:'4px 16px',
                  background:'linear-gradient(180deg,#e8e6e0 0%,#cdc9c0 100%)',
                  border:'2px solid', borderColor:`${C.bHi} ${C.bDark} ${C.bDark} ${C.bHi}`,
                  fontFamily:C.mono, fontSize:12, cursor:'pointer', fontWeight:700,
                }}
              >
                Go back another day ▶
              </button>
            </div>
          )}

        </div>

        {/* status bar / mute button */}
        <button
          type="button"
          onClick={toggleMute}
          style={{
            ...raised(true),
            background: C.body,
            padding: '2px 6px',
            fontSize: 11, fontFamily: C.ui, color: '#444',
            cursor: 'pointer', width: '100%', textAlign: 'left',
            border: '2px solid',
            borderColor: `${C.bLo} ${C.bHi} ${C.bHi} ${C.bLo}`,
          }}
        >
          {muted ? '🔇 Unmute' : '🔊 Mute'} — {statusLabel}
        </button>
      </div>

      <style>{`
        @keyframes wg-shake {
          0%,100%{transform:translateX(0)} 20%{transform:translateX(-8px)}
          40%{transform:translateX(8px)} 60%{transform:translateX(-5px)} 80%{transform:translateX(5px)}
        }
      `}</style>
    </div>
  )
}

export default WordleGate
