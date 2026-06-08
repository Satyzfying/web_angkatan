'use client'

/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { createPortal } from 'react-dom'

import Instagram from '@/components/atoms/button/InstagramButtonLink'
import LinkedInButtonLink from '@/components/atoms/button/LinkedInButtonLink'
import SpotifyEmbed from '@/components/molecules/SpotifyEmbed'

import ProfileImage from './image.jpg'

type MemberPopupProps = {
  isOpen: boolean
  onClose: () => void
}

type StyleVars = React.CSSProperties & Record<`--${string}`, string | number>

const MemberPopup = ({ isOpen, onClose }: MemberPopupProps) => {
  const [answer, setAnswer] = useState('')
  const [isWrong, setIsWrong] = useState(false)
  const [step, setStep] = useState<'quiz' | 'quote' | 'card'>('quiz')

  const magicalFloaters = [
    { e: '⭐', sz: 28 }, { e: '✨', sz: 24 }, { e: '🌟', sz: 32 },
    { e: '🌸', sz: 26 }, { e: '🌷', sz: 24 }, { e: '💫', sz: 30 },
    { e: '✦', sz: 22 }, { e: '💗', sz: 26 }, { e: '🎀', sz: 28 },
    { e: '🫧', sz: 22 }, { e: '👑', sz: 32 }, { e: '💌', sz: 24 },
    { e: '🌺', sz: 26 }, { e: '💕', sz: 22 }, { e: '✨', sz: 28 },
  ]

  const stars = useMemo(() => Array.from({ length: 85 }), [])
  const sakura = useMemo(() => Array.from({ length: 28 }), [])

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

  useEffect(() => {
    if (!isOpen) {
      setAnswer('')
      setIsWrong(false)
      setStep('quiz')
    }
  }, [isOpen])

  if (!isOpen) return null

  const checkAnswer = () => {
    const normalizedAnswer = answer.trim().toLowerCase().replace(/\s+/g, ' ')

    if (normalizedAnswer === 'princess nadya') {
      setStep('quote')
      setIsWrong(false)
      return
    }

    setIsWrong(true)
  }

  const closeWrong = () => {
    setIsWrong(false)
    setAnswer('')
  }

  return createPortal(
    <div
      className="member-popup-shell"
      onClick={(event) => event.stopPropagation()}
      onKeyDown={(event) => event.stopPropagation()}
    >
      <div className="bg-kingdom">
        <div className="castle-wrap">
          <svg viewBox="0 0 900 500" xmlns="http://www.w3.org/2000/svg" fill="rgba(180,80,255,.7)">
            <rect x="60" y="180" width="90" height="320" rx="4" />
            <rect x="45" y="160" width="120" height="40" rx="2" />
            <rect x="50" y="130" width="20" height="50" />
            <rect x="80" y="120" width="20" height="60" />
            <rect x="110" y="130" width="20" height="50" />
            <polygon points="100,60 60,160 140,160" />
            <rect x="170" y="260" width="60" height="240" rx="2" />
            <polygon points="200,210 170,265 230,265" />
            <rect x="260" y="200" width="380" height="300" rx="4" />
            <ellipse cx="450" cy="380" rx="55" ry="75" fill="rgba(100,20,160,.5)" />
            <rect x="395" y="380" width="110" height="120" fill="rgba(100,20,160,.5)" />
            <rect x="370" y="80" width="160" height="200" rx="4" />
            <rect x="355" y="60" width="190" height="35" rx="2" />
            <polygon points="450,0 355,65 545,65" />
            <ellipse cx="450" cy="140" rx="22" ry="28" fill="rgba(100,20,160,.45)" />
            <ellipse cx="410" cy="230" rx="14" ry="18" fill="rgba(100,20,160,.45)" />
            <ellipse cx="490" cy="230" rx="14" ry="18" fill="rgba(100,20,160,.45)" />
            <rect x="670" y="260" width="60" height="240" rx="2" />
            <polygon points="700,210 670,265 730,265" />
            <rect x="750" y="180" width="90" height="320" rx="4" />
            <rect x="735" y="160" width="120" height="40" rx="2" />
            <polygon points="800,60 750,160 850,160" />
          </svg>
        </div>

        <div className="moon">🌙</div>

        <div className="star-field">
          {stars.map((_, i) => (
            <div
              key={i}
              className="star-dot"
              style={{
                width: `${1.5 + (i % 4)}px`,
                height: `${1.5 + (i % 4)}px`,
                top: `${(i * 13.7) % 96}%`,
                left: `${(i * 19.3) % 99}%`,
                '--d': `${1.2 + (i % 4) * 0.6}s`,
                '--dl': `${(i * 0.15) % 4}s`,
              } as StyleVars}
            />
          ))}
        </div>

        <div className="floaters">
          {magicalFloaters.map((item, i) => (
            <div
              key={i}
              className="floater"
              style={{
                top: `${2 + (i * 14.5) % 92}%`,
                left: `${1 + (i * 21.4) % 97}%`,
                '--sz': `${item.sz}px`,
                '--ty': `${-(12 + (i % 6) * 4)}px`,
                '--r0': `${(i % 4) * 8 - 16}deg`,
                '--r1': `${(i % 5) * 8 - 12}deg`,
                '--op': 0.65 + (i % 4) * 0.08,
                '--d': `${2.5 + (i % 3) * 0.8}s`,
                '--dl': `${i * 0.14}s`,
              } as StyleVars}
            >
              {item.e}
            </div>
          ))}
        </div>

        <div className="sakura-layer">
          {sakura.map((_, i) => (
            <span
              key={i}
              className="sakura"
              style={{
                left: `${1 + i * 3.5}%`,
                '--sz': `${14 + (i % 6) * 3}px`,
                '--d': `${5 + (i % 4) * 1.5}s`,
                '--dl': `${i * 0.25}s`,
              } as StyleVars}
            >
              {i % 4 === 0 ? '🌸' : i % 4 === 1 ? '🌺' : i % 4 === 2 ? '🌷' : '💗'}
            </span>
          ))}
        </div>

        <div className="cloud-base cloud-1"><span>☁️</span></div>
        <div className="cloud-base cloud-2"><span>☁️</span></div>
        <div className="cloud-base cloud-3"><span>☁️</span></div>
        <div className="cloud-base cloud-4"><span>☁️</span></div>
      </div>

      <div className="page">
        <div className="card">
          <button type="button" className="close-btn" onClick={onClose} title="Tutup" aria-label="Tutup">
            ×
          </button>

          <div className="cd moon-tl">🌙</div>
          <div className="cd star-tr">⭐</div>
          <div className="cd star2">✨</div>
          <div className="cd flower-tr">🌸</div>
          <div className="cd tulip-r">🌷</div>
          <div className="cd flower-bl">🌸</div>
          <div className="cd flower-br">🌸</div>
          <div className="cd heart-bl">💗</div>
          <div className="cd heart-br">💕</div>

          {step === 'quiz' && (
            <div className="slide">
              <div className="quiz-icon-row">
                <span className="quiz-crown">👑</span>
                <span className="quiz-bow">🎀</span>
              </div>

              <div className="quiz-title">Aku lagi ngumpet nih 🫣</div>
              <div className="quiz-body">
                Kalau mau ketemu,<br />coba panggil aku dulu 💌
              </div>

              <div className="clue-box">
                <p>💌 Clue:<br />coba panggil dulu<br />princess nadya 👑</p>
              </div>

              <div className="input-row">
                <input
                  className="q-input"
                  value={answer}
                  placeholder="ketik jawaban..."
                  onChange={(e) => setAnswer(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') checkAnswer()
                  }}
                />
                <button className="btn-kirim" onClick={checkAnswer}>Kirim</button>
              </div>

              <div className={`wrong-overlay ${isWrong ? 'show' : ''}`}>
                <div className="sad-cloud-wrap">
                  <div className="sad-cloud-img">
                    <div className="cloud-body">
                      <div className="cloud-eye-l" />
                      <div className="cloud-eye-r" />
                      <div className="tear-l" />
                      <div className="tear-r" />
                    </div>
                    <span className="cloud-star-l">✦</span>
                    <span className="cloud-star-r">✨</span>
                  </div>
                </div>
                <div className="wrong-msg-only">
                  Belum bener, coba panggil<br />&quot;Princess Nadya&quot; dulu yaa 💗
                </div>
                <button className="btn-wrong-close" onClick={closeWrong}>✕</button>
              </div>
            </div>
          )}

          {step === 'quote' && (
            <div className="slide">
              <div className="quote-header">Secret quote unlocked 💌</div>

              <div className="env-scene">
                <div className="q-paper">
                  <div className="paper-crown-icon">👑</div>
                  <div className="paper-quote">
                    &quot;You can always<br />
                    <em>begin again!</em><br />
                    Romanticize your life<br />
                    cause you&apos;re the<br />
                    main character.&quot;
                  </div>
                </div>

                <div className="env-body">
                  <div className="env-main">
                    <div className="env-fold-l" />
                    <div className="env-fold-r" />
                    <div className="env-gold-l" />
                    <div className="env-gold-r" />
                    <div className="env-seal">💗</div>
                  </div>
                </div>

                <div className="env-wing l">🪽</div>
                <div className="env-wing r">🪽</div>
                <div className="env-flower-l">🌸</div>
                <div className="env-flower-r">🎀</div>
                <div className="env-cloud-l">☁️</div>
                <div className="env-cloud-r">☁️</div>
              </div>

              <button className="btn-found" onClick={() => setStep('card')}>
                You Found Me 👀
              </button>
            </div>
          )}

          {step === 'card' && (
            <div className="slide">
              <div className="prof-crown">👑</div>

              <div className="photo-frame">
                <Image src={ProfileImage} alt="Profile" className="profile-img" />
                <span className="photo-spark spark-1">✦</span>
                <span className="photo-spark spark-2">✨</span>
                <span className="photo-spark spark-3">💫</span>
                <span className="photo-spark spark-4">⭐</span>
              </div>

              <div className="prof-name">Nadya Putri Agustin 👑</div>
              <div className="prof-id">5027251013 - Surabaya</div>

              <div className="social-row">
                <Instagram username="nadyaputria._" />
                <LinkedInButtonLink username="nadyaputria" />
              </div>

              <div className="info-grid">
                <div className="info-card">
                  <div className="ic-label">Hobi</div>
                  <div className="ic-val">Ketiduran sambil dengerin musik 🎧🎶</div>
                </div>

                <div className="info-card">
                  <div className="ic-label">Fun Fact</div>
                  <div className="ic-val">Kalau aku gak bales chat berarti aku ketiduran 🥱</div>
                </div>
              </div>

              <div className="spotify-box">
                <div className="sp-label-title">Lagu Favorit</div>
                <div className="sp-song-name">Begin Again 🎶</div>
                <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/05GsNucq8Bngd9fnd4fRa0?si=87e953ecc5f4492c" />
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700;900&family=Playfair+Display:ital,wght@0,700;1,700&family=Nunito:wght@600;700;800;900&family=Cormorant+Garamond:ital,wght@0,600;1,500;1,600&display=swap');

        .member-popup-shell * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .member-popup-shell {
          position: fixed;
          inset: 0;
          z-index: 100;
          overflow-y: auto;
          font-family: 'Nunito', sans-serif;
          user-select: none;
        }

        .bg-kingdom {
          position: fixed;
          inset: 0;
          z-index: 0;
          overflow: hidden;
          background: linear-gradient(
            160deg,
            #2c0a5e 0%,
            #5a18a0 18%,
            #8e3bcc 34%,
            #c26ed4 50%,
            #e89ccc 64%,
            #f7c4e0 78%,
            #fde0f0 90%,
            #fff4fa 100%
          );
        }

        .bg-kingdom::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 80% 45% at 50% 0%, rgba(255,200,240,.5) 0%, transparent 65%),
            radial-gradient(ellipse 45% 55% at 8% 28%, rgba(140,60,210,.4) 0%, transparent 55%),
            radial-gradient(ellipse 55% 65% at 92% 22%, rgba(190,80,230,.35) 0%, transparent 58%),
            radial-gradient(ellipse 90% 35% at 50% 100%, rgba(255,210,235,.7) 0%, transparent 65%);
        }

        .castle-wrap {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 100%;
          max-width: 900px;
          pointer-events: none;
          opacity: .35;
          filter: drop-shadow(0 0 50px rgba(200,120,255,.7)) drop-shadow(0 0 25px rgba(255,180,240,.5));
        }

        .castle-wrap svg {
          width: 100%;
          height: auto;
        }

        .moon {
          position: absolute;
          left: 3%;
          top: 4%;
          font-size: clamp(60px, 8vw, 100px);
          filter: drop-shadow(0 0 24px rgba(255,240,120,.95)) drop-shadow(0 0 60px rgba(255,200,80,.4));
          animation: moonFloat 7s ease-in-out infinite;
          z-index: 1;
        }

        @keyframes moonFloat {
          0%, 100% { transform: translateY(0) rotate(-5deg); }
          50% { transform: translateY(-16px) rotate(5deg); }
        }

        .star-field {
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
        }

        .star-dot {
          position: absolute;
          border-radius: 50%;
          background: #fff;
          animation: starBlink var(--d, 2s) ease-in-out infinite var(--dl, 0s);
        }

        @keyframes starBlink {
          0%, 100% { opacity: .15; transform: scale(.6); }
          50% { opacity: 1; transform: scale(1.5); }
        }

        .floaters {
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
        }

        .floater {
          position: absolute;
          font-size: var(--sz, 26px);
          animation: floaterAnim var(--d, 4s) ease-in-out infinite var(--dl, 0s);
          filter: drop-shadow(0 0 8px rgba(255,255,255,.7));
        }

        @keyframes floaterAnim {
          0%, 100% {
            transform: translateY(0) rotate(var(--r0, 0deg)) scale(1);
            opacity: var(--op, .85);
          }
          50% {
            transform: translateY(var(--ty, -14px)) rotate(var(--r1, 5deg)) scale(1.1);
            opacity: 1;
          }
        }

        .sakura-layer {
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          overflow: hidden;
        }

        .sakura {
          position: absolute;
          top: -40px;
          font-size: var(--sz, 20px);
          animation: sakuraFall var(--d, 9s) linear infinite var(--dl, 0s);
        }

        @keyframes sakuraFall {
          0% { transform: translateY(-50px) translateX(0) rotate(0deg); opacity: 0; }
          8% { opacity: .9; }
          90% { opacity: .7; }
          100% { transform: translateY(105vh) translateX(50px) rotate(420deg); opacity: 0; }
        }

        .cloud-base {
          position: absolute;
          z-index: 2;
          pointer-events: none;
        }

        .cloud-base span {
          display: block;
          font-size: var(--sz, 180px);
          animation: cloudSway var(--d, 6s) ease-in-out infinite var(--dl, 0s);
          opacity: .93;
        }

        .cloud-1 {
          left: -50px;
          bottom: -10px;
          --sz: 200px;
          --d: 5s;
          --dl: 0s;
          --sh: 28px;
        }

        .cloud-2 {
          right: -50px;
          bottom: -10px;
          --sz: 220px;
          --d: 6s;
          --dl: .6s;
          --sh: -28px;
        }

        .cloud-3 {
          left: 18%;
          bottom: -5px;
          --sz: 155px;
          --d: 4.5s;
          --dl: .3s;
          --sh: 20px;
        }

        .cloud-4 {
          right: 16%;
          bottom: -5px;
          --sz: 145px;
          --d: 5.5s;
          --dl: 1s;
          --sh: -20px;
        }

        @keyframes cloudSway {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(var(--sh, 20px)); }
        }

        .page {
          position: relative;
          z-index: 10;
          min-height: 100dvh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px 16px;
        }

        .card {
          width: 100%;
          max-width: 430px;
          background: linear-gradient(
            160deg,
            rgba(255,255,255,.93) 0%,
            rgba(255,243,252,.9) 45%,
            rgba(255,218,240,.88) 100%
          );
          border: 3.5px solid rgba(255,170,210,.75);
          border-radius: 36px;
          padding: 32px 28px 28px;
          position: relative;
          overflow: hidden;
          box-shadow:
            0 0 0 7px rgba(255,255,255,.22),
            0 28px 70px rgba(200,0,110,.38),
            0 6px 20px rgba(255,100,180,.25),
            inset 0 1px 0 rgba(255,255,255,.95);
          backdrop-filter: blur(12px);
          animation: cardPop .75s cubic-bezier(.34,1.56,.64,1) both;
        }

        @keyframes cardPop {
          from { opacity: 0; transform: scale(.8) translateY(36px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }

        .card::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 32px;
          pointer-events: none;
          background:
            radial-gradient(circle at 18% 14%, rgba(255,255,255,.88) 0%, transparent 28%),
            radial-gradient(circle at 82% 78%, rgba(255,175,215,.35) 0%, transparent 32%);
        }

        .cd {
          position: absolute;
          pointer-events: none;
          z-index: 0;
        }

        .cd.moon-tl { top: 14px; left: 14px; font-size: 28px; animation: floaterAnim 5s ease-in-out infinite; }
        .cd.star-tr { top: 14px; right: 50px; font-size: 22px; animation: twinkleAnim 2.2s ease-in-out infinite .4s; }
        .cd.star2 { top: 14px; right: 22px; font-size: 18px; animation: twinkleAnim 1.8s ease-in-out infinite .9s; }
        .cd.flower-tr { top: 60px; right: 18px; font-size: 26px; animation: floaterAnim 4.5s ease-in-out infinite .5s; }
        .cd.tulip-r { top: 120px; right: 14px; font-size: 22px; animation: floaterAnim 4s ease-in-out infinite 1s; }
        .cd.flower-bl { bottom: 80px; left: -6px; font-size: 46px; animation: floaterAnim 5s ease-in-out infinite .3s; }
        .cd.flower-br { bottom: 70px; right: -6px; font-size: 46px; animation: floaterAnim 5s ease-in-out infinite .6s; }
        .cd.heart-bl { bottom: 130px; left: 18px; font-size: 22px; animation: heartPop 1.8s ease-in-out infinite; }
        .cd.heart-br { bottom: 115px; right: 16px; font-size: 18px; animation: heartPop 2s ease-in-out infinite .4s; }

        @keyframes heartPop {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.25); }
        }

        .close-btn {
          position: absolute;
          top: 14px;
          right: 14px;
          z-index: 30;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #fff;
          border: 3px solid #ffb3d1;
          font-size: 20px;
          font-weight: 900;
          color: #e91e8c;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 5px 16px rgba(233,30,140,.28);
          transition: transform .15s, box-shadow .15s;
          line-height: 1;
        }

        .close-btn:hover {
          transform: scale(1.12);
          box-shadow: 0 8px 22px rgba(233,30,140,.4);
        }

        .slide {
          position: relative;
          z-index: 5;
        }

        .quiz-icon-row {
          text-align: center;
          margin-bottom: 4px;
        }

        .quiz-crown {
          font-size: 50px;
          animation: floaterAnim 3s ease-in-out infinite;
          display: inline-block;
        }

        .quiz-bow {
          font-size: 42px;
          animation: floaterAnim 3.5s ease-in-out infinite .4s;
          display: inline-block;
          margin-left: 6px;
        }

        .quiz-title {
          font-family: 'Dancing Script', cursive;
          font-size: 30px;
          font-weight: 900;
          color: #c0185a;
          text-align: center;
          margin: 8px 0 4px;
          text-shadow: 0 1px 8px rgba(200,0,100,.15);
        }

        .quiz-body {
          font-size: 18px;
          font-weight: 800;
          color: #d4366e;
          text-align: center;
          line-height: 1.55;
          margin-bottom: 18px;
          font-style: italic;
        }

        .clue-box {
          background: rgba(255,255,255,.82);
          border: 2.5px dashed #ffb3d1;
          border-radius: 22px;
          padding: 14px 18px;
          text-align: center;
          margin-bottom: 18px;
          box-shadow: inset 0 2px 8px rgba(255,100,160,.08);
        }

        .clue-box p {
          font-size: 15px;
          font-weight: 800;
          color: #c0185a;
          line-height: 1.65;
        }

        .input-row {
          display: flex;
          gap: 8px;
          margin-bottom: 6px;
        }

        .q-input {
          flex: 1;
          border: 2.5px solid #ffb3d1;
          border-radius: 16px;
          padding: 11px 16px;
          font-size: 14px;
          font-weight: 700;
          color: #c0185a;
          background: rgba(255,255,255,.92);
          outline: none;
          transition: border-color .2s, box-shadow .2s;
        }

        .q-input:focus {
          border-color: #ff3d8b;
          box-shadow: 0 0 0 3px rgba(255,60,140,.18);
        }

        .q-input::placeholder {
          color: #ffaacc;
          font-weight: 600;
        }

        .btn-kirim {
          background: linear-gradient(135deg, #ff6eb0, #e91e8c);
          color: #fff;
          border: none;
          border-radius: 16px;
          padding: 11px 22px;
          font-size: 14px;
          font-weight: 900;
          cursor: pointer;
          box-shadow: 0 5px 16px rgba(233,30,140,.4);
          transition: transform .15s, box-shadow .15s;
          white-space: nowrap;
        }

        .btn-kirim:hover {
          transform: scale(1.06);
        }

        .btn-kirim:active {
          transform: scale(.96);
        }

        .wrong-overlay {
          display: none;
          position: absolute;
          inset: 0;
          border-radius: 32px;
          z-index: 40;
          background: linear-gradient(160deg, rgba(255,240,250,.97), rgba(255,210,235,.96));
          align-items: center;
          justify-content: center;
          flex-direction: column;
          text-align: center;
          padding: 32px;
          animation: cardPop .35s ease-out both;
        }

        .wrong-overlay.show {
          display: flex;
        }

        .sad-cloud-wrap {
          position: relative;
          margin-bottom: 10px;
        }

        .sad-cloud-img {
          width: 130px;
          height: 100px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cloud-body {
          position: absolute;
          width: 120px;
          height: 70px;
          background: linear-gradient(160deg, #fde0ee, #f9b8d8);
          border-radius: 40px;
          border: 3px solid rgba(255,150,190,.4);
          box-shadow: 0 6px 20px rgba(255,100,160,.25), inset 0 2px 0 rgba(255,255,255,.7);
          bottom: 10px;
          left: 0;
        }

        .cloud-body::before {
          content: '';
          position: absolute;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: linear-gradient(135deg, #fde8f3, #f9c0dc);
          border: 3px solid rgba(255,150,190,.35);
          top: -26px;
          left: 18px;
        }

        .cloud-body::after {
          content: '';
          position: absolute;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: linear-gradient(135deg, #fdeaf5, #f9c8e0);
          border: 3px solid rgba(255,150,190,.3);
          top: -16px;
          left: 52px;
        }

        .cloud-eye-l,
        .cloud-eye-r {
          position: absolute;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #a0405c;
          z-index: 2;
          top: 22px;
        }

        .cloud-eye-l { left: 36px; }
        .cloud-eye-r { left: 66px; }

        .tear-l,
        .tear-r {
          position: absolute;
          width: 7px;
          height: 12px;
          border-radius: 50%;
          background: linear-gradient(180deg, #88c4f0, #4a9fd4);
          z-index: 2;
          animation: tearDrop 1.4s ease-in infinite var(--dl, 0s);
        }

        .tear-l { top: 38px; left: 38px; --dl: 0s; }
        .tear-r { top: 38px; left: 68px; --dl: .3s; }

        @keyframes tearDrop {
          0% { opacity: 1; transform: translateY(0) scaleY(1); }
          80% { opacity: .4; transform: translateY(22px) scaleY(.4); }
          100% { opacity: 0; transform: translateY(28px); }
        }

        .cloud-star-l,
        .cloud-star-r {
          position: absolute;
          font-size: 16px;
          z-index: 2;
          animation: twinkleAnim 1.5s ease-in-out infinite;
        }

        .cloud-star-l { top: -4px; left: -4px; }
        .cloud-star-r { top: 0; right: -8px; animation-delay: .4s; }

        @keyframes twinkleAnim {
          0%, 100% { opacity: .2; transform: scale(.6) rotate(0deg); }
          50% { opacity: 1; transform: scale(1.4) rotate(20deg); }
        }

        .wrong-msg-only {
          font-size: 16px;
          font-weight: 800;
          color: #d4366e;
          margin-top: 14px;
          line-height: 1.65;
          text-align: center;
        }

        .btn-wrong-close {
          margin-top: 20px;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ff5b5b, #e53535);
          border: 3px solid rgba(255,255,255,.5);
          color: #fff;
          font-size: 22px;
          font-weight: 900;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 6px 18px rgba(229,53,53,.45);
          transition: transform .15s;
        }

        .btn-wrong-close:hover {
          transform: scale(1.1);
        }

        .quote-header {
          font-family: 'Dancing Script', cursive;
          font-size: 22px;
          font-weight: 900;
          color: #c0185a;
          text-align: center;
          margin-bottom: 10px;
          text-shadow: 0 1px 8px rgba(200,0,100,.15);
        }

        .env-scene {
          position: relative;
          height: 360px;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          margin-bottom: 14px;
        }

        .q-paper {
          position: absolute;
          top: 0;
          left: 50%;
          width: 240px;
          background: linear-gradient(155deg, #fff9fc, #fff0f6);
          border: 2px solid #ffdaec;
          border-radius: 20px;
          padding: 26px 20px 18px;
          text-align: center;
          z-index: 10;
          box-shadow: 0 -8px 35px rgba(255,100,180,.28), 0 0 0 1px rgba(255,255,255,.85);
          transform: translateX(-50%) translateY(200px);
          opacity: 0;
          animation: paperOut 1.1s cubic-bezier(.34,1.28,.64,1) .25s both;
        }

        @keyframes paperOut {
          0% { transform: translateX(-50%) translateY(200px) scale(.9); opacity: 0; }
          55% { transform: translateX(-50%) translateY(-8px) scale(1.04) rotate(-1.5deg); opacity: 1; }
          100% { transform: translateX(-50%) translateY(4px) scale(1) rotate(-1.5deg); opacity: 1; }
        }

        .paper-crown-icon {
          position: absolute;
          top: -20px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 36px;
          animation: heartPop 2s ease-in-out infinite;
        }

        .paper-quote {
          font-family: 'Dancing Script', cursive;
          font-size: 18px;
          font-weight: 700;
          color: #9b1461;
          line-height: 1.6;
          margin-top: 8px;
        }

        .paper-quote em {
          color: #e91e8c;
          font-style: italic;
        }

        .env-body {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 280px;
          height: 185px;
          z-index: 2;
        }

        .env-main {
          width: 100%;
          height: 100%;
          background: linear-gradient(145deg, #ff9ed4, #e91e8c, #ff5ba7);
          border-radius: 18px 18px 26px 26px;
          border: 3px solid rgba(255,255,255,.45);
          box-shadow: 0 18px 55px rgba(233,30,140,.55), inset 0 2px 0 rgba(255,255,255,.4);
          position: relative;
          overflow: hidden;
        }

        .env-fold-l {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 50%;
          height: 100%;
          background: linear-gradient(to bottom right, rgba(255,190,220,.8), rgba(220,30,130,.7));
          clip-path: polygon(0 100%, 100% 100%, 0 0);
        }

        .env-fold-r {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 50%;
          height: 100%;
          background: linear-gradient(to bottom left, rgba(255,190,220,.8), rgba(220,30,130,.7));
          clip-path: polygon(0 100%, 100% 100%, 100% 0);
        }

        .env-gold-l,
        .env-gold-r {
          position: absolute;
          bottom: 0;
          height: 100%;
          width: 3px;
          background: linear-gradient(to top, rgba(255,210,80,.9), transparent);
          z-index: 3;
        }

        .env-gold-l {
          left: 50%;
          transform-origin: bottom left;
          transform: rotate(-34deg);
        }

        .env-gold-r {
          right: 50%;
          transform-origin: bottom right;
          transform: rotate(34deg);
        }

        .env-seal {
          position: absolute;
          bottom: 14px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 5;
          width: 58px;
          height: 58px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ff4d8c, #bf1862);
          border: 4px solid rgba(255,255,255,.55);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 26px;
          box-shadow: 0 5px 18px rgba(192,24,98,.55);
          animation: heartPop 1.6s ease-in-out infinite;
        }

        .env-wing {
          position: absolute;
          bottom: 36px;
          font-size: 54px;
          z-index: 1;
          filter: drop-shadow(0 4px 8px rgba(255,120,180,.35));
        }

        .env-wing.l {
          left: -14px;
          transform: rotate(-18deg) scaleX(-1);
          animation: wingL 2s ease-in-out infinite;
        }

        .env-wing.r {
          right: -14px;
          transform: rotate(18deg);
          animation: wingR 2s ease-in-out infinite;
        }

        @keyframes wingL {
          0%, 100% { transform: rotate(-18deg) scaleX(-1) translateY(0); }
          50% { transform: rotate(-25deg) scaleX(-1) translateY(-9px); }
        }

        @keyframes wingR {
          0%, 100% { transform: rotate(18deg) translateY(0); }
          50% { transform: rotate(25deg) translateY(-9px); }
        }

        .env-cloud-l,
        .env-cloud-r {
          position: absolute;
          bottom: 0;
          font-size: 60px;
          z-index: 3;
          animation: cloudSway 5s ease-in-out infinite;
        }

        .env-cloud-l { left: -12px; }
        .env-cloud-r { right: -12px; animation-duration: 6s; animation-delay: .5s; }

        .env-flower-l,
        .env-flower-r {
          position: absolute;
          bottom: 55px;
          font-size: 32px;
          z-index: 4;
          animation: floaterAnim 3.5s ease-in-out infinite;
        }

        .env-flower-l { left: 4px; }
        .env-flower-r { right: 2px; animation-delay: .6s; }

        .btn-found {
          display: block;
          width: 100%;
          background: linear-gradient(135deg, #ff5ba7, #e91e8c);
          color: #fff;
          border: none;
          border-radius: 50px;
          padding: 14px 28px;
          font-family: 'Dancing Script', cursive;
          font-size: 21px;
          font-weight: 900;
          cursor: pointer;
          box-shadow: 0 8px 26px rgba(233,30,140,.5);
          transition: transform .15s, box-shadow .15s;
          animation: btnPulse 2s ease-in-out infinite;
          letter-spacing: .3px;
        }

        .btn-found:hover {
          transform: scale(1.05);
          box-shadow: 0 12px 32px rgba(233,30,140,.62);
        }

        @keyframes btnPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.04); }
        }

        .prof-crown {
          text-align: center;
          font-size: 44px;
          animation: heartPop 2s ease-in-out infinite;
          margin-bottom: 6px;
        }

        .photo-frame {
          position: relative;
          margin: 0 auto 18px;
          border-radius: 24px;
          overflow: hidden;
          border: 4px solid #ff6eb0;
          box-shadow: 0 0 0 6px rgba(255,110,176,.22), 0 15px 40px rgba(233,30,140,.4);
          height: 260px;
          background: linear-gradient(135deg, #ffd6f0, #ffaad4);
        }

        .profile-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 30%;
          display: block;
        }

        .photo-spark {
          position: absolute;
          animation: twinkleAnim 2s ease-in-out infinite;
          pointer-events: none;
        }

        .spark-1 { top: 8px; left: 10px; font-size: 16px; }
        .spark-2 { top: 8px; right: 12px; font-size: 14px; animation-duration: 2.5s; }
        .spark-3 { bottom: 10px; left: 14px; font-size: 18px; animation-duration: 2.2s; }
        .spark-4 { bottom: 10px; right: 10px; font-size: 14px; animation-duration: 1.8s; }

        .prof-name {
          font-family: 'Dancing Script', cursive;
          font-size: 28px;
          font-weight: 900;
          color: #c0185a;
          text-align: center;
          margin-bottom: 3px;
        }

        .prof-id {
          font-size: 12px;
          font-weight: 800;
          color: #e86fa0;
          text-align: center;
          letter-spacing: .3px;
          margin-bottom: 12px;
        }

        .social-row {
          display: flex;
          gap: 14px;
          justify-content: center;
          margin-bottom: 14px;
        }

        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-bottom: 10px;
        }

        .info-card {
          background: rgba(255,255,255,.78);
          border: 2px solid #ffd4e8;
          border-radius: 16px;
          padding: 11px 12px;
          text-align: center;
          box-shadow: 0 3px 10px rgba(255,100,160,.12);
          transition: transform .2s;
        }

        .info-card:hover {
          transform: scale(1.04);
        }

        .ic-label {
          font-size: 10px;
          font-weight: 900;
          color: #e91e8c;
          letter-spacing: .6px;
          text-transform: uppercase;
          margin-bottom: 5px;
        }

        .ic-val {
          font-size: 14px;
          font-weight: 600;
          color: #8a1457;
          line-height: 1.45;
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
        }

        .spotify-box {
          background: rgba(255,255,255,.78);
          border: 2px solid #ffd4e8;
          border-radius: 16px;
          padding: 12px 14px;
          box-shadow: 0 3px 10px rgba(255,100,160,.12);
        }

        .sp-label-title {
          font-size: 10px;
          font-weight: 900;
          color: #e91e8c;
          letter-spacing: .6px;
          text-transform: uppercase;
          margin-bottom: 3px;
          text-align: center;
        }

        .sp-song-name {
          font-family: 'Playfair Display', serif;
          font-size: 13px;
          font-style: italic;
          font-weight: 700;
          color: #8a1457;
          text-align: center;
          margin-bottom: 8px;
        }
      `}</style>
    </div>,
    document.body
  )
}

export default MemberPopup
