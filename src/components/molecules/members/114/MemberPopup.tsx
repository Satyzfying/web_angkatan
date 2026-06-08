'use client'

/* eslint-disable react/no-unescaped-entities */
import React, { useEffect } from 'react'

import Image from 'next/image'

import { createPortal } from 'react-dom'

import Instagram from '@/components/atoms/button/InstagramButtonLink'
import LinkedInButtonLink from '@/components/atoms/button/LinkedInButtonLink'
import SpotifyEmbed from '@/components/molecules/SpotifyEmbed'

import ProfileImage from './image.png'

type MemberPopupProps = {
  isOpen: boolean
  onClose: () => void
}

const MemberPopup = ({ isOpen, onClose }: MemberPopupProps) => {
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

  if (!isOpen) {
    return null
  }

  return createPortal(
    // PADA BAGIAN INI KAMU BOLEH MENGUBAH STYLE SESUKA HATI KAMU, TAPI JANGAN UBAH STRUKTUR DAN FUNGSI DARI KODE INI AGAR FUNGSI POPUP TETAP BERJALAN DENGAN BAIK
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto px-4">
      <button
        type="button"
        aria-label="Close member detail"
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
      />

      <div className="relative z-10 max-h-[calc(100vh-9rem)] w-full max-w-[720px] animate-[member-popup-show_200ms_ease-out] overflow-y-auto rounded-2xl border-2 border-purple-500/30 bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 p-6 text-white shadow-[0_0_25px_rgba(168,85,247,0.3)] sm:max-h-[calc(100vh-10rem)] sm:p-8">
        <button
          type="button"
          aria-label="Close member detail"
          onClick={onClose}
          className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-xl leading-none transition-all hover:bg-white/10"
        >
          x
        </button>

        {/* ================= LAYER 1: TEKA-TEKI LATIN ================= */}
        <div id="layer1" className="block py-6 text-center">
          <div className="mb-4 text-4xl">🌙</div>
          <h2 className="mb-4 text-xl font-bold tracking-widest text-purple-400 uppercase">Gate 1: The High Moon</h2>
          <p className="mx-auto max-w-md rounded-xl border border-white/5 bg-black/30 p-4 text-sm leading-relaxed text-slate-300 italic">
            "Aku bukanlah nama yang biasa kau dengar sehari-hari, melainkan sebuah sebutan puitis yang diambil dari
            bahasa Latin kuno. Arti namaku adalah 'Bulan yang Tinggi' (High Moon) atau 'Bulan yang Berada di Atas'."
          </p>
          <input
            id="input1"
            type="text"
            placeholder="Siapakah aku? (lowercase)"
            onKeyDown={(e) => e.stopPropagation()}
            className="mt-6 w-64 rounded-lg border border-purple-500/50 bg-slate-900 px-4 py-2 text-center focus:border-purple-400 focus:outline-none"
          />
          <button
            onClick={() => {
              const val = (document.getElementById('input1') as HTMLInputElement)!.value.toLowerCase().trim()
              if (val === 'altalune') {
                ;(document.getElementById('layer1') as HTMLElement)!.style.display = 'none'
                ;(document.getElementById('layer2') as HTMLElement)!.style.display = 'block'
              } else {
                alert('Salah! Petunjuk: Berawalan A dan berakhiran e')
              }
            }}
            className="mx-auto mt-4 block rounded-lg bg-purple-600 px-6 py-2 text-sm font-bold transition-all hover:bg-purple-500"
          >
            Submit Answer
          </button>
        </div>

        {/* ================= LAYER 2: KALKULUS / TRIGO ================= */}
        <div id="layer2" className="hidden py-6 text-center">
          <div className="mb-4 text-4xl">📐</div>
          <h2 className="mb-4 text-xl font-bold tracking-widest text-cyan-400 uppercase">Gate 2: The Mathematician</h2>
          <p className="mx-auto mb-4 max-w-md text-sm text-slate-300">
            Selesaikan persamaan trigonometri nilai istimewa berikut untuk lanjut:
          </p>
          <div className="mb-4 inline-block rounded-xl border border-cyan-500/20 bg-black/40 px-6 py-4 font-mono text-lg text-cyan-300">
            f(x) = sin(30°) + cos(60°) - tan(45°)
            <br />
            <span className="text-xs text-white">Berapakah nilai dari f(x)?</span>
          </div>
          <br />
          <input
            id="input2"
            type="number"
            placeholder="Jawabannya angka..."
            onKeyDown={(e) => e.stopPropagation()}
            className="w-64 rounded-lg border border-cyan-500/50 bg-slate-900 px-4 py-2 text-center focus:border-cyan-400 focus:outline-none"
          />
          <button
            onClick={() => {
              const val = (document.getElementById('input2') as HTMLInputElement)!.value
              if (parseInt(val) === 0) {
                ;(document.getElementById('layer2') as HTMLElement)!.style.display = 'none'
                ;(document.getElementById('layer3') as HTMLElement)!.style.display = 'block'
              } else {
                alert('Salah hitung! Yuk inget lagi: 0.5 + 0.5 - 1 = ...')
              }
            }}
            className="mx-auto mt-4 block rounded-lg bg-cyan-600 px-6 py-2 text-sm font-bold transition-all hover:bg-cyan-500"
          >
            Unlock Gate
          </button>
        </div>

        {/* ================= LAYER 3: SUIT CURANG VS AI ================= */}
        <div id="layer3" className="hidden py-4 text-center">
          <div className="mb-2 text-4xl">🤖</div>
          <h2 className="mb-2 text-xl font-bold tracking-widest text-red-400 uppercase">
            Gate 3: Jankenpon vs Unfair AI
          </h2>
          <p className="mb-4 text-xs text-slate-400">Kalahkan AI ini untuk melihat profil asli.</p>

          <div className="mx-auto mb-4 flex min-h-[80px] max-w-md items-center justify-center rounded-xl border border-red-500/20 bg-black/50 p-4">
            <p id="gameLog" className="font-mono text-sm text-red-300">
              AI siap bertanding. Pilih senjatamu!
            </p>
          </div>

          {/* Variabel bantuan lokal buat ngitung kekalahan tanpa React State */}
          <input type="hidden" id="skorKalah" defaultValue="0" />

          <div id="suitButtons" className="my-4 flex justify-center gap-4">
            <button
              onClick={() => {
                let count = parseInt((document.getElementById('skorKalah') as HTMLInputElement)!.value) + 1
                ;(document.getElementById('skorKalah') as HTMLInputElement)!.value = count.toString()
                ;(document.getElementById('gameLog') as HTMLElement)!.innerText =
                  'Kamu: ✊ Batu -> AI: 🖐️ Kertas. (Kamu Kalah!)'
                if (count >= 3) {
                  ;(document.getElementById('suitButtons') as HTMLElement)!.style.display = 'none'
                  ;(document.getElementById('cheatSection') as HTMLElement)!.style.display = 'block'
                }
              }}
              className="rounded-lg border border-white/10 bg-slate-800 px-4 py-2 hover:bg-slate-700"
            >
              ✊ Batu
            </button>
            <button
              onClick={() => {
                let count = parseInt((document.getElementById('skorKalah') as HTMLInputElement)!.value) + 1
                ;(document.getElementById('skorKalah') as HTMLInputElement)!.value = count.toString()
                ;(document.getElementById('gameLog') as HTMLElement)!.innerText =
                  'Kamu: 🖐️ Kertas -> AI: ✌️ Gunting. (Kamu Kalah!)'
                if (count >= 3) {
                  ;(document.getElementById('suitButtons') as HTMLElement)!.style.display = 'none'
                  ;(document.getElementById('cheatSection') as HTMLElement)!.style.display = 'block'
                }
              }}
              className="rounded-lg border border-white/10 bg-slate-800 px-4 py-2 hover:bg-slate-700"
            >
              🖐️ Kertas
            </button>
            <button
              onClick={() => {
                let count = parseInt((document.getElementById('skorKalah') as HTMLInputElement)!.value) + 1
                ;(document.getElementById('skorKalah') as HTMLInputElement)!.value = count.toString()
                ;(document.getElementById('gameLog') as HTMLElement)!.innerText =
                  'Kamu: ✌️ Gunting -> AI: ✊ Batu. (Kamu Kalah!)'
                if (count >= 3) {
                  ;(document.getElementById('suitButtons') as HTMLElement)!.style.display = 'none'
                  ;(document.getElementById('cheatSection') as HTMLElement)!.style.display = 'block'
                }
              }}
              className="rounded-lg border border-white/10 bg-slate-800 px-4 py-2 hover:bg-slate-700"
            >
              ✌️ Gunting
            </button>
          </div>

          <div
            id="cheatSection"
            className="mx-auto hidden max-w-md animate-bounce rounded-xl border border-red-500 bg-red-950/40 p-4"
          >
            <p className="font-mono text-xs leading-relaxed text-red-400">
              "Kalah lagi kan? Sadarlah, dari awal jalan pikiranmu sudah terbaca. Mau main berapa kali pun, I'm the true
              ruler here. Masukkan password 'Ampun Baginda' untuk mengakhiri game."
            </p>
            <input
              id="inputCheat"
              type="text"
              placeholder="Ketik password di sini..."
              onKeyDown={(e) => e.stopPropagation()}
              className="mt-3 w-56 rounded border border-red-500 bg-black px-3 py-1 text-center text-sm text-white focus:outline-none"
            />
            <button
              onClick={() => {
                const val = (document.getElementById('inputCheat') as HTMLInputElement)!.value
                if (val === 'Ampun Baginda') {
                  ;(document.getElementById('layer3') as HTMLElement)!.style.display = 'none'
                  ;(document.getElementById('layerAsli') as HTMLElement)!.style.display = 'block'
                } else {
                  alert('Password salah! Ketik: Ampun Baginda')
                }
              }}
              className="mx-auto mt-2 block rounded bg-red-600 px-4 py-1 text-xs font-bold hover:bg-red-500"
            >
              Tunduk
            </button>
          </div>
        </div>

        {/* ================= LAYER 4: KONTEN ASLI POPUP (MENGGUNAKAN ID) ================= */}
        <div id="layerAsli" className="hidden">
          <div className="border-neutral-cs-10/40 mb-5 overflow-hidden rounded-2xl border">
            <Image src={ProfileImage} alt="Profile Image" className="h-120 w-full object-cover object-center" />
          </div>

          <div className="pr-10">
            <h2 className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-2xl font-black text-transparent">
              Azhari Rahma Putri
            </h2>
            <p className="text-neutral-cs-10/70 mt-1 text-sm font-semibold">5027251114 - Surabaya</p>
          </div>

          <div className="mt-5 flex gap-2">
            <Instagram username="azhrirahmap" />
            <LinkedInButtonLink username="azhari-rahma-putri" />
          </div>

          <div className="mt-6 grid gap-4 text-sm font-semibold sm:grid-cols-2">
            <div className="rounded-xl border border-purple-500/30 bg-black/40 p-4">
              <p className="text-xs font-bold tracking-wide text-purple-400 uppercase">🎯 Hobi</p>
              <p className="mt-2">Baca Novel</p>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                <div className="h-full w-[90%] bg-purple-500"></div>
              </div>
            </div>
            <div className="rounded-xl border border-purple-500/30 bg-black/40 p-4">
              <p className="text-xs font-bold tracking-wide text-purple-400 uppercase">🔍 Fun Fact</p>
              <p className="mt-2 text-xs">Azhari itu soalnya ak lahir ashar</p>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-purple-500/30 bg-black/40 p-4">
            <p className="text-xs font-bold tracking-wide text-purple-400 uppercase">🎵 Lagu Favorit</p>
            <p className="my-2 text-sm font-semibold">I Wouldn't Know Any Better Than You</p>
            <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/3K8tRD2Prik7FXbD8lZ6DC?si=c6ad276f4c474447" />
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default MemberPopup
