'use client'

import React, { useEffect, useState } from 'react'

import Image from 'next/image'

import { createPortal } from 'react-dom'

import Instagram from '@/components/atoms/button/InstagramButtonLink'
import LinkedInButtonLink from '@/components/atoms/button/LinkedInButtonLink'
import BackgroundImage from './background.jpg'
import FolderIcon from './logo_folder.png'
import MusicIcon from './logo_musik.png'
import ProfileImage from './image.jpeg'

type MemberPopupProps = {
  isOpen: boolean
  onClose: () => void
}

const MemberPopup = ({ isOpen, onClose }: MemberPopupProps) => {
  const [spotifyData, setSpotifyData] = useState<{ title?: string; author_name?: string; thumbnail_url?: string } | null>(null)
  const spotifyUrl = 'https://open.spotify.com/track/41OCQS2Mul3MluLUUsfadr?si=c721971a8b304f3a'

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
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
      return
    }

    const fetchSpotifyOEmbed = async () => {
      try {
        const response = await fetch(`https://open.spotify.com/oembed?url=${encodeURIComponent(spotifyUrl)}`)
        if (!response.ok) {
          return
        }
        const data = await response.json()
        setSpotifyData({
          title: data.title,
          author_name: data.author_name,
          thumbnail_url: data.thumbnail_url,
        })
      } catch {
        setSpotifyData(null)
      }
    }

    fetchSpotifyOEmbed()
  }, [isOpen, spotifyUrl])

  if (!isOpen) {
    return null
  }

  return (
    <>
      {/* PADA BAGIAN INI KAMU BOLEH MENGUBAH STYLE SESUKA HATI KAMU, TAPI JANGAN UBAH STRUKTUR DAN FUNGSI DARI KODE INI AGAR FUNGSI POPUP TETAP BERJALAN DENGAN BAIK */}
      <div
        className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto px-4 pt-28 pb-8 sm:pt-32 outer-shell"
        style={{
          backgroundImage: `url(${BackgroundImage.src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
      <button
        type="button"
        aria-label="Close member detail"
        onClick={onClose}
        className="absolute inset-0 overlay-backdrop"
      />

      <div className="relative z-10 max-h-[calc(100vh-9rem)] w-full max-w-[720px] animate-[member-popup-show_200ms_ease-out] overflow-y-auto retro-card sm:max-h-[calc(100vh-10rem)]">
        <div className="window-titlebar">
          <span className="window-title">Member Details</span>
          <div className="window-controls">
            <button type="button" aria-hidden="true" className="window-button">_</button>
            <button type="button" aria-hidden="true" className="window-button">□</button>
            <button type="button" aria-hidden="true" className="window-button close-button" onClick={onClose}>X</button>
          </div>
        </div>

        <div className="profile-media mb-5 overflow-hidden">
          <Image src={ProfileImage} alt="Profile Image" className="w-full h-[36rem] object-cover object-center" />
        </div>

        <div className="pr-10 pb-4">
          {/* UBAH NAMA ANDA */}
          <h2 className="text-2xl font-black member-name">Arrumanta Ekna Luhkinasih</h2>
          {/* UBAH NRP DAN ASAL */}
          <p className="mt-1 text-sm member-subtitle">5027251044 - Solo</p>
        </div>
  return createPortal(
    // PADA BAGIAN INI KAMU BOLEH MENGUBAH STYLE SESUKA HATI KAMU, TAPI JANGAN UBAH STRUKTUR DAN FUNGSI DARI KODE INI AGAR FUNGSI POPUP TETAP BERJALAN DENGAN BAIK
    <>
      <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto px-4">
        <button
          type="button"
          aria-label="Close member detail"
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        <div className="border-neutral-cs-10 bg-blue-cs-40 relative z-10 max-h-[100dvh] w-full max-w-[720px] animate-[member-popup-show_200ms_ease-out] overflow-y-auto rounded-2xl border-2 p-6 text-white shadow-xl sm:p-8">
          <button
            type="button"
            aria-label="Close member detail"
            onClick={onClose}
            className="border-neutral-cs-10 hover:bg-neutral-cs-10/10 absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border text-xl leading-none"
          >
            x
          </button>

          <div className="border-neutral-cs-10/40 mb-5 overflow-hidden rounded-2xl border">
            <Image src={ProfileImage} alt="Profile Image" className="h-120 w-full object-cover object-center" />
          </div>

          <div className="pr-10">
            {/* UBAH NAMA ANDA */}
            <h2 className="main-name text-2xl font-black">Arrumanta Ekna Luhkinasih</h2>
            {/* UBAH NRP DAN ASAL */}
            <p className="text-neutral-cs-10/70 sub-details mt-1 text-sm font-semibold">5027251044 - Solo</p>
          </div>

        <div className="mt-6 grid gap-4 text-sm font-semibold sm:grid-cols-2">
          <div className="retro-info-card">
            <img src={FolderIcon.src} alt="folder" className="section-icon" />
            {/* UBAH HOBI KAMU */}
            <p className="section-title">HOBI</p>
            <p className="section-body">read you like a magazine ;)</p>
          </div>
          <div className="retro-info-card">
            <img src={FolderIcon.src} alt="folder" className="section-icon" />
            {/* UBAH FUNFACT KAMU */}
            <p className="section-title">FUN FACT</p>
            <p className="section-body">Oh I'm the FUN one, darling :p</p>
          <div className="mt-5 flex gap-2">
            {/* UBAH USERNAME INSTAGRAM */}
            <Instagram username="arrumantaa" />
            {/* UBAH USERNAME LINKEDIN */}
            <LinkedInButtonLink username="arrumanta" />
          </div>

          <div className="mt-6 grid gap-4 text-sm font-semibold sm:grid-cols-2">
            <div className="border-neutral-cs-10/40 rounded-xl border p-4">
              {/* UBAH HOBI KAMU */}
              <p className="text-neutral-cs-10/60 text-xs tracking-wide uppercase">Hobi</p>
              <p className="mt-2">read you like a magazine ;)</p>
            </div>
            <div className="border-neutral-cs-10/40 rounded-xl border p-4">
              {/* UBAH FUNFACT KAMU */}
              <p className="text-neutral-cs-10/60 text-xs tracking-wide uppercase">Fun Fact</p>
              <p className="mt-2">Oh I&apos;m the FUN one, darling :p</p>
            </div>
          </div>

        <div className="music-section mt-4">
          <img src={FolderIcon.src} alt="folder" className="section-icon music-icon" />
          <div className="music-section-header">
            <p className="section-title">LAGU FAVORIT</p>
          </div>
          <p className="song-title">{spotifyData?.title ?? 'Anugerah Terindah Yang Pernah Kumiliki'}</p>

          <div className="retro-player">
            <div className="retro-player-top">
              <img src={MusicIcon.src} alt="music" className="player-icon" />
              <span className="player-label">Now Playing</span>
            </div>

            <div className="retro-player-body">
              <div className="player-album-art">
                {spotifyData?.thumbnail_url ? (
                  <img src={spotifyData.thumbnail_url} alt="Album art" className="player-album-image" />
                ) : (
                  <div className="player-album-placeholder">ART</div>
                )}
              </div>
              <div className="player-details">
                <div className="player-track">{spotifyData?.title ?? 'Anugerah Terindah Yang Pernah Kumiliki'}</div>
                <div className="player-artist">{spotifyData?.author_name ?? 'Sheila On 7'}</div>
                <div className="player-controls">
                  <button type="button">◄◄</button>
                  <button type="button">▶︎</button>
                  <button type="button">■</button>
                  <button type="button">►►</button>
                </div>
                <div className="player-progress-bar">
                  <div className="player-progress-filled" />
                </div>
                <div className="player-time">
                  <span>0:03</span>
                  <span>1:18:43</span>
                </div>
              </div>
            </div>

            <div className="player-status-bar">
              <span className="player-status-text">{spotifyData?.title ?? 'Anugerah Terindah Yang Pernah Kumiliki'}</span>
              <span className="player-status-duration">1:18:43</span>
            </div>
          <div className="border-neutral-cs-10/40 mt-4 rounded-xl border p-4">
            {/* UBAH LAGU FAVORIT KAMU */}
            <p className="text-neutral-cs-10/60 text-xs font-bold tracking-wide uppercase">Lagu Favorit</p>
            <p className="my-2 text-sm font-semibold">Anugerah Terindah Yang Pernah Kumiliki</p>

            {/* UBAH URL SPOTIFY KAMU DENGAN LAGU FAVORIT MU */}
            <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/41OCQS2Mul3MluLUUsfadr?si=c721971a8b304f3a" />
          </div>
        </div>
      </div>
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Pixelify+Sans&display=swap');

        .outer-shell {
          background-image: url('background.jpg');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
        }

        .overlay-backdrop {
          background: rgba(0, 0, 0, 0.65);
          backdrop-filter: blur(5px);
        }

        .retro-card {
          position: relative;
          background: #c0c0c0;
          border-top: 3px solid #f3f3f3;
          border-left: 3px solid #f3f3f3;
          border-bottom: 3px solid #4a4a4a;
          border-right: 3px solid #4a4a4a;
          box-shadow: 12px 12px 0 rgba(0, 0, 0, 0.12);
          color: #111;
          font-family: 'Courier New', Courier, monospace;
          padding: 1rem;
        }

        .profile-media {
          background: #d0d0d0;
          border-top: 3px solid #f3f3f3;
          border-left: 3px solid #f3f3f3;
          border-bottom: 3px solid #4a4a4a;
          border-right: 3px solid #4a4a4a;
        }

        .window-titlebar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.85rem 1rem;
          background: #000080;
          color: #fff;
          font-size: 0.95rem;
          border-bottom: 2px solid #1c3b8c;
        }

        .window-title {
          font-family: 'Pixelify Sans', sans-serif;
          text-transform: uppercase;
          letter-spacing: 0.15rem;
        }

        .window-controls {
          display: flex;
          gap: 0.35rem;
        }

        .window-button {
          width: 2rem;
          height: 2rem;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          background: #1f2f70;
          border-top: 2px solid #ffffff;
          border-left: 2px solid #ffffff;
          border-bottom: 2px solid #4a5f9a;
          border-right: 2px solid #4a5f9a;
          font-family: 'Courier New', Courier, monospace;
          font-size: 0.85rem;
          cursor: default;
        }

        .window-button.close-button {
          background: #8b0000;
          border-top-color: #ffffff;
          border-left-color: #ffffff;
          border-bottom-color: #4a0000;
          border-right-color: #4a0000;
          cursor: pointer;
        }

        .profile-media {
          background: #d0d0d0;
          border-top: 3px solid #f3f3f3;
          border-left: 3px solid #f3f3f3;
          border-bottom: 3px solid #4a4a4a;
          border-right: 3px solid #4a4a4a;
        }

        .member-name {
          font-family: 'Pixelify Sans', sans-serif;
          font-size: 2.4rem;
          line-height: 1.05;
          color: #111;
          text-shadow:
            0 1px 0 #fff,
            0 2px 0 #d1d7e0,
            0 3px 0 #aeb4bc,
            0 4px 3px rgba(0, 0, 0, 0.15),
            0 8px 8px rgba(0, 0, 0, 0.12);
        }

        .member-subtitle {
          font-family: 'Courier New', Courier, monospace;
          color: #222;
          letter-spacing: 0.04em;
          margin-top: 0.35rem;
        }

        .retro-info-card,
        .music-section {
          position: relative;
          padding: 1.1rem 1rem 1.1rem;
          background: #d8d8d8;
          border-top: 2px solid #f1f1f1;
          border-left: 2px solid #f1f1f1;
          border-bottom: 2px solid #484848;
          border-right: 2px solid #484848;
          font-family: 'Courier New', Courier, monospace;
          min-height: 10rem;
        }

        .section-icon {
          position: absolute;
          top: 0.75rem;
          left: 0.75rem;
          width: 2.25rem;
          height: 2.25rem;
          object-fit: contain;
          background: rgba(255, 255, 255, 0.92);
          padding: 0.15rem;
          border: 1px solid #999;
        }

        .music-icon {
          width: 2.5rem;
          height: 2.5rem;
        }

        .music-section-header {
          margin-left: 3.4rem;
          padding-top: 0.3rem;
          padding-bottom: 0.55rem;
          border-bottom: 1px solid #999;
        }

        .retro-player-top {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid #3a3a3a;
        }

        .player-label {
          font-family: 'Pixelify Sans', sans-serif;
          font-size: 0.9rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #daf36a;
        }

        .retro-player-body {
          display: flex;
          gap: 0.85rem;
          padding-top: 0.8rem;
          align-items: flex-start;
        }

        .player-album-art {
          min-width: 6.5rem;
          min-height: 6.5rem;
          background: linear-gradient(180deg, #444 0%, #111 100%);
          border: 2px inset #666;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .player-album-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .player-album-placeholder {
          color: #d8d8d8;
          font-family: 'Courier New', Courier, monospace;
          font-size: 0.85rem;
          letter-spacing: 0.2rem;
        }

        .player-details {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.7rem;
        }

        .player-track {
          font-family: 'Pixelify Sans', sans-serif;
          font-size: 0.95rem;
          color: #dfeeb3;
          text-shadow: 0 1px 0 rgba(0,0,0,0.35);
        }

        .player-artist {
          font-family: 'Courier New', Courier, monospace;
          color: #a8c38e;
          font-size: 0.85rem;
        }

        .player-controls {
          display: flex;
          gap: 0.35rem;
        }

        .player-controls button {
          width: 2.4rem;
          height: 2.4rem;
          border: 2px solid #8e8e8e;
          background: #222;
          color: #fafafa;
          font-family: 'Courier New', Courier, monospace;
          font-size: 0.85rem;
          cursor: pointer;
          box-shadow: inset 1px 1px 0 #ffffff50, inset -1px -1px 0 #00000040;
        }

        .player-progress-bar {
          height: 0.6rem;
          background: #2f2f2f;
          border: 1px solid #4f4f4f;
        }

        .player-progress-filled {
          width: 30%;
          height: 100%;
          background: linear-gradient(90deg, #65d967, #76f4bd);
        }

        .player-time {
          display: flex;
          justify-content: space-between;
          font-size: 0.78rem;
          color: #b8b8b8;
        }

        .player-icon {
          width: 1.6rem;
          height: 1.6rem;
          vertical-align: middle;
          margin-right: 0.55rem;
        }

        .section-title {
          margin: 0;
          margin-left: 3.4rem;
          font-family: 'Pixelify Sans', sans-serif;
          font-size: 1.05rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: #101010;
          text-shadow: 0 1px 0 #fff, 0 2px 0 #d1d7e0, 0 3px 0 #aeb4bc;
        }

        .section-body {
          margin: 0.9rem 0 0;
          line-height: 1.7;
          color: #111;
        }

        .song-title {
          margin: 0.85rem 0 0;
          font-size: 1rem;
          font-weight: 900;
          color: #121212;
          letter-spacing: 0.01em;
        }

        .retro-player {
          margin-top: 1rem;
          padding: 0.75rem;
          background: #131313;
          border: inset 3px #5f5f5f;
        }

        .retro-player-display {
          display: inline-flex;
          align-items: center;
          gap: 0.55rem;
          margin-bottom: 0.5rem;
          font-family: 'Pixelify Sans', sans-serif;
          font-size: 0.82rem;
          color: #f8f8f8;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .player-status-bar {
          display: flex;
          justify-content: space-between;
          padding: 0.55rem 0.6rem 0.55rem;
          margin-top: 0.8rem;
          background: #111;
          border-top: 1px solid #3a3a3a;
          color: #c9ff88;
          font-family: 'Courier New', Courier, monospace;
          font-size: 0.78rem;
          letter-spacing: 0.06em;
        }

        .player-status-text {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 65%;
        }

        .player-status-duration {
          opacity: 0.85;
        }
      `}</style>
    </>
        div[class*='fixed'][class*='inset-0'] > button + div {
          background: linear-gradient(135deg, #ebe6e1 0%, #bdb5b1 100%);
          border: 1px solid #c78d96;
          border-radius: 12px;
          box-shadow:
            8px 8px 0px rgba(108, 73, 82, 0.15),
            inset 0 0 20px rgba(189, 181, 177, 0.5);
          color: #6c4952 !important;
          font-family: 'Cormorant Garamond', 'Lora', serif;
        }
        div[class*='fixed'][class*='inset-0'] > button + div h2,
        div[class*='fixed'][class*='inset-0'] > button + div p {
          font-family: 'Cormorant Garamond', 'Lora', serif !important;
        }
        div[class*='fixed'][class*='inset-0'] > button + div > div:nth-child(2) img {
          padding: 8px;
          background-color: #ebe6e1;
          border: 1px solid #bdb5b1;
          border-radius: 4px;
          box-shadow: 2px 4px 12px rgba(108, 73, 82, 0.2);
          filter: sepia(0.3) contrast(1.1) saturate(0.8) brightness(0.95);
        }

        div[class*='fixed'][class*='inset-0'] > button + div .pr-10 h2.main-name {
          color: #6c4952 !important;
          text-shadow: 2px 2px 4px rgba(108, 73, 82, 0.1);
          font-weight: 500;
          font-family: 'Cormorant Garamond', 'Lora', serif;
        }

        div[class*='fixed'][class*='inset-0'] > button + div .pr-10 p.sub-details {
          color: #c78d96 !important;
          font-style: italic;
          letter-spacing: 0.5px;
          font-family: 'Cormorant Garamond', 'Lora', serif;
        }

        div[class*='fixed'][class*='inset-0'] > button + div > div.mt-6 > div:nth-child(1),
        div[class*='fixed'][class*='inset-0'] > button + div > div.mt-6 > div:nth-child(2) {
          background: linear-gradient(to bottom right, rgba(235, 230, 225, 0.9), rgba(199, 141, 150, 0.15));
          border: 1px solid #c78d96;
          border-radius: 8px;
          box-shadow: 0 4px 10px rgba(199, 141, 150, 0.1);
        }

        div[class*='fixed'][class*='inset-0'] > button + div > div.mt-6 > div > p:first-child {
          color: #6c4952 !important;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          font-size: 0.78rem;
        }

        div[class*='fixed'][class*='inset-0'] > button + div > div.mt-6 > div > p:last-child {
          color: #6c4952 !important;
          font-weight: normal;
        }

        div[class*='fixed'][class*='inset-0'] > button + div > div.mt-4 {
          background: #6c4952;
          border: 3px double #bdb5b1;
          border-radius: 6px;
          color: #ebe6e1;
        }

        div[class*='fixed'][class*='inset-0'] > button + div > div.mt-4 p {
          color: #ebe6e1 !important;
        }

        div[class*='fixed'][class*='inset-0'] > button + div > div.mt-4 iframe {
          filter: sepia(0.4) opacity(0.9) contrast(1.1);
          border-radius: 4px !important;
          border: 1px solid #bdb5b1 !important;
        }
      `}</style>
    </>,
    document.body
  )
}

export default MemberPopup
