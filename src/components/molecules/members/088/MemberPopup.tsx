'use client'

import React, { useEffect } from 'react'
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

const MemberPopup = ({ isOpen, onClose }: MemberPopupProps) => {
  const bgCanvasRef = useRef<HTMLCanvasElement>(null)
  const hdrCanvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  /* ── Background canvas: stars + big meteors ── */
  useEffect(() => {
    if (!isOpen) return
    const canvas = bgCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let raf: number

    const stars = Array.from({ length: 220 }, () => ({
      x: Math.random(), y: Math.random() * 0.75,
      r: Math.random() * 1.3 + 0.2,
      a: Math.random() * 0.65 + 0.25,
      tw: Math.random() * Math.PI * 2,
      sp: Math.random() * 0.025 + 0.008,
      col: [[200,200,255],[180,160,255],[160,210,255],[255,220,255],[220,200,255]][Math.floor(Math.random()*5)] as number[],
    }))

    type Meteor = {
      x:number; y:number; angle:number; col1:number[]; col2:number[];
      alpha:number; progress:number; splitDone:boolean;
      sX:number; sY:number; sA1:number; sA2:number; spawnT:number;
    }
    const meteors: Meteor[] = []
    let lastSpawn = 0

    const meteorColors = [
      { r:[100,160,255], g:[180,120,255] },
      { r:[220,120,255], g:[80,180,255] },
      { r:[255,200,255], g:[160,100,255] },
      { r:[80,200,255],  g:[220,80,200] },
    ]

    function spawnMeteor(ts: number) {
      const c = meteorColors[Math.floor(Math.random()*meteorColors.length)]
      meteors.push({
        x: Math.random()*0.5, y: Math.random()*0.25,
        angle: Math.PI/4 + (Math.random()-0.5)*0.25,
        col1: c.r, col2: c.g,
        alpha: 1, progress: 0,
        splitDone: false, sX:0, sY:0, sA1:0, sA2:0,
        spawnT: ts,
      })
    }

    function draw(ts: number) {
      canvas!.width  = canvas!.parentElement?.offsetWidth  ?? window.innerWidth
      canvas!.height = canvas!.parentElement?.offsetHeight ?? window.innerHeight
      const W = canvas!.width, H = canvas!.height, t = ts/1000
      ctx.clearRect(0, 0, W, H)

      // stars
      stars.forEach(s => {
        const tw = Math.sin(t*s.sp*4+s.tw)
        const a  = s.a*(0.45+0.55*tw)
        ctx.beginPath()
        ctx.arc(s.x*W, s.y*H, s.r, 0, Math.PI*2)
        ctx.fillStyle = `rgba(${s.col[0]},${s.col[1]},${s.col[2]},${a})`
        ctx.fill()
        if (s.r > 1.1 && tw > 0.8) {
          ctx.strokeStyle = `rgba(${s.col[0]},${s.col[1]},${s.col[2]},${a*0.5})`
          ctx.lineWidth = 0.7
          ctx.beginPath(); ctx.moveTo(s.x*W-s.r*2.5,s.y*H); ctx.lineTo(s.x*W+s.r*2.5,s.y*H); ctx.stroke()
          ctx.beginPath(); ctx.moveTo(s.x*W,s.y*H-s.r*2.5); ctx.lineTo(s.x*W,s.y*H+s.r*2.5); ctx.stroke()
        }
      })

      // meteors
      if (ts - lastSpawn > 3000+Math.random()*2000) { spawnMeteor(ts); lastSpawn = ts }
      for (let i = meteors.length-1; i >= 0; i--) {
        const m = meteors[i]
        m.progress = Math.min((ts-m.spawnT)/3200, 1)
        const cx=m.x*W, cy=m.y*H
        const dx=Math.cos(m.angle), dy=Math.sin(m.angle)
        const tDist=m.progress*W*0.55, tLen=Math.min(0.18*W,tDist)
        const hx=cx+dx*tDist, hy=cy+dy*tDist, tx=hx-dx*tLen, ty=hy-dy*tLen

        // glow halo
        const g0 = ctx.createRadialGradient(hx,hy,0,hx,hy,12+m.progress*8)
        g0.addColorStop(0,`rgba(${m.col1.join(',')},${m.alpha*0.55})`); g0.addColorStop(1,'rgba(0,0,0,0)')
        ctx.beginPath(); ctx.arc(hx,hy,12+m.progress*8,0,Math.PI*2); ctx.fillStyle=g0; ctx.fill()

        // tail
        const g = ctx.createLinearGradient(tx,ty,hx,hy)
        g.addColorStop(0,   `rgba(${m.col2.join(',')},0)`)
        g.addColorStop(0.3, `rgba(${m.col2.join(',')},${m.alpha*0.25})`)
        g.addColorStop(0.75,`rgba(${m.col1.join(',')},${m.alpha*0.75})`)
        g.addColorStop(1,   `rgba(255,255,255,${m.alpha})`)
        ctx.beginPath(); ctx.moveTo(tx,ty); ctx.lineTo(hx,hy)
        ctx.strokeStyle=g; ctx.lineWidth=3.5; ctx.lineCap='round'; ctx.stroke()

        // shimmer
        const g2 = ctx.createLinearGradient(tx,ty,hx,hy)
        g2.addColorStop(0,`rgba(${m.col1.join(',')},0)`); g2.addColorStop(1,`rgba(${m.col1.join(',')},${m.alpha*0.3})`)
        ctx.beginPath(); ctx.moveTo(tx,ty); ctx.lineTo(hx,hy)
        ctx.strokeStyle=g2; ctx.lineWidth=8; ctx.lineCap='round'; ctx.stroke()

        // split
        if (m.progress >= 0.6) {
          if (!m.splitDone) { m.sX=hx; m.sY=hy; m.sA1=m.angle-0.28; m.sA2=m.angle+0.32; m.splitDone=true }
          const sp=(m.progress-0.6)/0.4, sL=sp*W*0.22
          ;([[m.sA1,m.col1,2.2,0.75],[m.sA2,m.col2,1.8,0.65]] as [number,number[],number,number][]).forEach(([ang,col,lw,ao])=>{
            const ex=m.sX+Math.cos(ang)*sL, ey=m.sY+Math.sin(ang)*sL
            const sg=ctx.createLinearGradient(m.sX,m.sY,ex,ey)
            sg.addColorStop(0,`rgba(255,255,255,${m.alpha*ao})`); sg.addColorStop(0.5,`rgba(${col.join(',')},${m.alpha*ao*0.7})`); sg.addColorStop(1,`rgba(${col.join(',')},0)`)
            ctx.beginPath(); ctx.moveTo(m.sX,m.sY); ctx.lineTo(ex,ey)
            ctx.strokeStyle=sg; ctx.lineWidth=lw; ctx.lineCap='round'; ctx.stroke()
            const tg=ctx.createRadialGradient(ex,ey,0,ex,ey,8)
            tg.addColorStop(0,`rgba(${col.join(',')},${m.alpha*ao*0.6})`); tg.addColorStop(1,'rgba(0,0,0,0)')
            ctx.beginPath(); ctx.arc(ex,ey,8,0,Math.PI*2); ctx.fillStyle=tg; ctx.fill()
          })
          if (sp < 0.5) {
            for (let d=0;d<3;d++) {
              const da=m.angle+(Math.random()-0.5)*0.9, dd=sp*W*0.06*Math.random()
              ctx.beginPath(); ctx.arc(m.sX+Math.cos(da)*dd,m.sY+Math.sin(da)*dd,1.5,0,Math.PI*2)
              ctx.fillStyle=`rgba(255,220,255,${m.alpha*0.5*Math.random()})`; ctx.fill()
            }
          }
        }

        // head dot
        ctx.beginPath(); ctx.arc(hx,hy,3.5,0,Math.PI*2)
        ctx.fillStyle=`rgba(255,255,255,${m.alpha*0.95})`; ctx.fill()

        m.alpha -= 0.004
        if (m.alpha <= 0 || m.progress >= 1) meteors.splice(i,1)
      }
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(raf)
  }, [isOpen])

  /* ── Header canvas: small stars + mini meteors ── */
  useEffect(() => {
    if (!isOpen) return
    const canvas = hdrCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let raf: number

    const stars = Array.from({ length: 80 }, () => ({
      x: Math.random(), y: Math.random()*0.85,
      r: Math.random()*1+0.2, a: Math.random()*0.6+0.2,
      tw: Math.random()*Math.PI*2, sp: Math.random()*0.03+0.01,
      col: [[200,200,255],[200,180,255],[180,220,255],[255,230,255]][Math.floor(Math.random()*4)] as number[],
    }))

    type HMeteor = {
      x:number; y:number; angle:number; col1:number[]; col2:number[];
      progress:number; alpha:number; splitDone:boolean;
      sX:number; sY:number; sA1:number; sA2:number; spawnT:number;
    }
    const meteors: HMeteor[] = []
    let lastSpawn = 0
    const cols = [{r:[120,160,255],g:[200,100,255]},{r:[255,150,255],g:[100,180,255]},{r:[200,220,255],g:[160,100,255]}]

    function spawnMeteor(ts: number) {
      const c = cols[Math.floor(Math.random()*cols.length)]
      meteors.push({ x:Math.random()*0.6, y:Math.random()*0.45, angle:Math.PI/4+(Math.random()-0.5)*0.3, col1:c.r, col2:c.g, progress:0, alpha:1, splitDone:false, sX:0,sY:0,sA1:0,sA2:0, spawnT:ts })
    }

    function draw(ts: number) {
      canvas!.width  = canvas!.parentElement?.offsetWidth  ?? 480
      canvas!.height = canvas!.parentElement?.offsetHeight ?? 480 // Update default height assumption
      const W=canvas!.width, H=canvas!.height, t=ts/1000
      ctx.clearRect(0,0,W,H)

      stars.forEach(s => {
        const tw=Math.sin(t*s.sp*4+s.tw), a=s.a*(0.4+0.6*tw)
        ctx.beginPath(); ctx.arc(s.x*W,s.y*H,s.r,0,Math.PI*2)
        ctx.fillStyle=`rgba(${s.col[0]},${s.col[1]},${s.col[2]},${a})`; ctx.fill()
      })

      if (ts-lastSpawn > 1800+Math.random()*1600) { spawnMeteor(ts); lastSpawn=ts }
      for (let i=meteors.length-1;i>=0;i--) {
        const m=meteors[i]
        m.progress=Math.min((ts-m.spawnT)/2400,1)
        const cx=m.x*W,cy=m.y*H,dx=Math.cos(m.angle),dy=Math.sin(m.angle)
        const tDist=m.progress*W*0.6,tLen=Math.min(0.12*W,tDist)
        const hx=cx+dx*tDist,hy=cy+dy*tDist,tx=hx-dx*tLen,ty=hy-dy*tLen

        const g0=ctx.createRadialGradient(hx,hy,0,hx,hy,9)
        g0.addColorStop(0,`rgba(${m.col1.join(',')},${m.alpha*0.5})`); g0.addColorStop(1,'rgba(0,0,0,0)')
        ctx.beginPath(); ctx.arc(hx,hy,9,0,Math.PI*2); ctx.fillStyle=g0; ctx.fill()

        const g=ctx.createLinearGradient(tx,ty,hx,hy)
        g.addColorStop(0,`rgba(${m.col2.join(',')},0)`); g.addColorStop(0.6,`rgba(${m.col2.join(',')},${m.alpha*0.5})`); g.addColorStop(1,`rgba(255,255,255,${m.alpha})`)
        ctx.beginPath(); ctx.moveTo(tx,ty); ctx.lineTo(hx,hy)
        ctx.strokeStyle=g; ctx.lineWidth=2.2; ctx.lineCap='round'; ctx.stroke()

        if (m.progress>=0.55) {
          if (!m.splitDone) { m.sX=hx;m.sY=hy;m.sA1=m.angle-0.3;m.sA2=m.angle+0.35;m.splitDone=true }
          const sp=(m.progress-0.55)/0.45,sL=sp*W*0.18
          ;([[m.sA1,m.col1,1.5],[m.sA2,m.col2,1.2]] as [number,number[],number][]).forEach(([ang,col,lw])=>{
            const ex=m.sX+Math.cos(ang)*sL,ey=m.sY+Math.sin(ang)*sL
            const sg=ctx.createLinearGradient(m.sX,m.sY,ex,ey)
            sg.addColorStop(0,`rgba(255,255,255,${m.alpha*0.8})`); sg.addColorStop(1,`rgba(${col.join(',')},0)`)
            ctx.beginPath(); ctx.moveTo(m.sX,m.sY); ctx.lineTo(ex,ey)
            ctx.strokeStyle=sg; ctx.lineWidth=lw; ctx.lineCap='round'; ctx.stroke()
          })
        }
        ctx.beginPath(); ctx.arc(hx,hy,2.5,0,Math.PI*2)
        ctx.fillStyle=`rgba(255,255,255,${m.alpha*0.9})`; ctx.fill()
        m.alpha-=0.008
        if (m.alpha<=0||m.progress>=1) meteors.splice(i,1)
      }
      raf=requestAnimationFrame(draw)
    }
    raf=requestAnimationFrame(draw)
    return () => cancelAnimationFrame(raf)
  }, [isOpen])

  if (!isOpen) return null

  return createPortal(
    // PADA BAGIAN INI KAMU BOLEH MENGUBAH STYLE SESUKA HATI KAMU, TAPI JANGAN UBAH STRUKTUR DAN FUNGSI DARI KODE INI AGAR FUNGSI POPUP TETAP BERJALAN DENGAN BAIK
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto px-4">
      <button
        type="button"
        aria-label="Close member detail"
        onClick={onClose}
        className="absolute inset-0"
        style={{ background: 'rgba(3,5,20,0.75)', backdropFilter: 'blur(6px)' }}
      />

      <div className="border-neutral-cs-10 bg-blue-cs-40 relative z-10 max-h-[100dvh] w-full max-w-[720px] animate-[member-popup-show_200ms_ease-out] overflow-y-auto rounded-2xl border-2 p-6 text-white shadow-xl sm:p-8">
        <button
          type="button"
          aria-label="Close member detail"
          onClick={onClose}
          style={{
            position: 'absolute', top: 13, right: 13, zIndex: 20,
            width: 30, height: 30, borderRadius: '50%',
            border: '1px solid rgba(160,120,255,0.22)',
            background: 'rgba(10,8,30,0.6)',
            color: 'rgba(200,180,255,0.65)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, cursor: 'pointer', backdropFilter: 'blur(4px)',
          }}
        >
          ✕
        </button>

        {/* ── Body ── */}
        <div style={{ padding: '18px 22px 22px' }}>
          
          {/* ── FOTO PROFIL & ANIMASI (Menyatu dalam satu container dengan tinggi sesuai kode awalmu) ── */}
          <div 
            className="relative border-neutral-cs-10/40 mb-5 overflow-hidden rounded-2xl border w-full h-120"
            style={{ background: 'linear-gradient(160deg,#080e28 0%,#0e1845 45%,#160c30 100%)' }}
          >
            {/* Layer 1: Animasi Canvas (di belakang) */}
            <canvas ref={hdrCanvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 1 }} />
            
            {/* Layer 2: Gradient Overlay (opsional, memberikan efek menyatu ke bagian bawah) */}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,transparent 60%,rgba(6,10,30,0.8) 100%)', zIndex: 2 }} />

            {/* Layer 3: Fotonya (di depan) */}
            <Image 
              src={ProfileImage} 
              alt="Profile Image" 
              className="absolute inset-0 h-full w-full object-cover object-center" 
              style={{ zIndex: 3 }}
            />
          </div>

          {/* Name */}
          <p style={{ fontSize: 21, fontWeight: 700, color: '#eae8ff', letterSpacing: '-0.2px', marginBottom: 3 }}>
            Wildan Alfarezy
          </p>
          <p style={{ fontSize: 11.5, color: 'rgba(170,155,255,0.45)', marginBottom: 14, letterSpacing: '0.5px' }}>
            5027251088 · Palangka Raya
          </p>

          {/* Social buttons */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
            <Instagram username="wildan_azy" />
            <LinkedInButtonLink username="wildan-alfarezy-a5b1a7332" />
          </div>

          {/* divider */}
          <div style={{ height: 1, background: 'linear-gradient(90deg,transparent,rgba(160,120,255,0.3),rgba(80,160,255,0.2),transparent)', margin: '12px 0' }} />

          {/* Info tiles */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9, marginBottom: 10 }}>
            <div style={{ background: 'rgba(15,10,45,0.55)', border: '1px solid rgba(130,100,220,0.15)', borderRadius: 12, padding: '11px 13px' }}>
              <p style={{ fontSize: 8.5, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(160,130,255,0.45)', marginBottom: 5 }}>Hobi</p>
              <p style={{ fontSize: 12, color: 'rgba(215,205,255,0.85)', lineHeight: 1.5 }}>main game dan jalan-jalan ke alam</p>
            </div>
            <div style={{ background: 'rgba(15,10,45,0.55)', border: '1px solid rgba(130,100,220,0.15)', borderRadius: 12, padding: '11px 13px' }}>
              <p style={{ fontSize: 8.5, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(160,130,255,0.45)', marginBottom: 5 }}>Fun Fact</p>
              <p style={{ fontSize: 12, color: 'rgba(215,205,255,0.85)', lineHeight: 1.5 }}>milih IT karena nonton dracin</p>
            </div>
          </div>

          {/* Spotify */}
          <div style={{ background: 'rgba(15,10,45,0.55)', border: '1px solid rgba(130,100,220,0.15)', borderRadius: 12, padding: '11px 14px' }}>
            <p style={{ fontSize: 8.5, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(160,130,255,0.45)', marginBottom: 4 }}>Lagu Favorit</p>
            <p style={{ fontSize: 13, fontWeight: 600, color: 'rgba(215,205,255,0.9)', marginBottom: 8 }}>Best Part</p>
            <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/1Q7EgiMOuwDcB0PJC6AzON?si=da7095857bf745cb" />
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default MemberPopup