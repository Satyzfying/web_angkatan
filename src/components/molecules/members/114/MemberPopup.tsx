'use client'

/* eslint-disable react/no-unescaped-entities */

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

return (
  // PADA BAGIAN INI KAMU BOLEH MENGUBAH STYLE SESUKA HATI KAMU, TAPI JANGAN UBAH STRUKTUR DAN FUNGSI DARI KODE INI AGAR FUNGSI POPUP TETAP BERJALAN DENGAN BAIK
  <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto px-4 pt-28 pb-8 sm:pt-32">
    <button
      type="button"
      aria-label="Close member detail"
      onClick={onClose}
      className="absolute inset-0 bg-black/70 backdrop-blur-md"
    />

    <div className="border-purple-500/30 bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 relative z-10 max-h-[calc(100vh-9rem)] w-full max-w-[720px] animate-[member-popup-show_200ms_ease-out] overflow-y-auto rounded-2xl border-2 p-6 text-white shadow-[0_0_25px_rgba(168,85,247,0.3)] sm:max-h-[calc(100vh-10rem)] sm:p-8">
      
      <button
        type="button"
        aria-label="Close member detail"
        onClick={onClose}
        className="border-white/20 hover:bg-white/10 absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border text-xl leading-none transition-all"
      >
        x
      </button>

      {/* ================= LAYER 1: TEKA-TEKI LATIN ================= */}
      <div id="layer1" className="py-6 text-center block">
        <div className="text-4xl mb-4">🌙</div>
        <h2 className="text-xl font-bold text-purple-400 uppercase tracking-widest mb-4">Gate 1: The High Moon</h2>
        <p className="text-slate-300 italic text-sm leading-relaxed max-w-md mx-auto bg-black/30 p-4 rounded-xl border border-white/5">
          "Aku bukanlah nama yang biasa kau dengar sehari-hari, melainkan sebuah sebutan puitis yang diambil dari bahasa Latin kuno. Arti namaku adalah 'Bulan yang Tinggi' (High Moon) atau 'Bulan yang Berada di Atas'."
        </p>
        <input 
          id="input1"
          type="text" 
          placeholder="Siapakah aku? (lowercase)" 
          className="mt-6 px-4 py-2 bg-slate-900 border border-purple-500/50 rounded-lg text-center focus:outline-none focus:border-purple-400 w-64"
        />
        <button 
          onClick={() => {
            const val = document.getElementById('input1').value.toLowerCase().trim();
            if(val === 'altalune') {
              document.getElementById('layer1').style.display = 'none';
              document.getElementById('layer2').style.display = 'block';
            } else {
              alert('Salah! Petunjuk: Berawalan A dan berakhiran e');
            }
          }}
          className="block mx-auto mt-4 px-6 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg font-bold text-sm transition-all"
        >
          Submit Answer
        </button>
      </div>

      {/* ================= LAYER 2: KALKULUS / TRIGO ================= */}
      <div id="layer2" className="py-6 text-center hidden">
        <div className="text-4xl mb-4">📐</div>
        <h2 className="text-xl font-bold text-cyan-400 uppercase tracking-widest mb-4">Gate 2: The Mathematician</h2>
        <p className="text-slate-300 text-sm max-w-md mx-auto mb-4">
          Selesaikan persamaan trigonometri nilai istimewa berikut untuk lanjut:
        </p>
        <div className="bg-black/40 py-4 px-6 inline-block rounded-xl font-mono text-lg text-cyan-300 border border-cyan-500/20 mb-4">
          f(x) = sin(30°) + cos(60°) - tan(45°)
          <br />
          <span className="text-white text-xs">Berapakah nilai dari f(x)?</span>
        </div>
        <br />
        <input 
          id="input2"
          type="number" 
          placeholder="Jawabannya angka..." 
          className="px-4 py-2 bg-slate-900 border border-cyan-500/50 rounded-lg text-center focus:outline-none focus:border-cyan-400 w-64"
        />
        <button 
          onClick={() => {
            const val = document.getElementById('input2').value;
            if(parseInt(val) === 0) {
              document.getElementById('layer2').style.display = 'none';
              document.getElementById('layer3').style.display = 'block';
            } else {
              alert('Salah hitung! Yuk inget lagi: 0.5 + 0.5 - 1 = ...');
            }
          }}
          className="block mx-auto mt-4 px-6 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg font-bold text-sm transition-all"
        >
          Unlock Gate
        </button>
      </div>

      {/* ================= LAYER 3: SUIT CURANG VS AI ================= */}
      <div id="layer3" className="py-4 text-center hidden">
        <div className="text-4xl mb-2">🤖</div>
        <h2 className="text-xl font-bold text-red-400 uppercase tracking-widest mb-2">Gate 3: Jankenpon vs Unfair AI</h2>
        <p className="text-xs text-slate-400 mb-4">Kalahkan AI ini untuk melihat profil asli.</p>
        
        <div className="bg-black/50 p-4 rounded-xl border border-red-500/20 max-w-md mx-auto mb-4 min-h-[80px] flex items-center justify-center">
          <p id="gameLog" className="text-sm font-mono text-red-300">AI siap bertanding. Pilih senjatamu!</p>
        </div>

        {/* Variabel bantuan lokal buat ngitung kekalahan tanpa React State */}
        <input type="hidden" id="skorKalah" defaultValue="0" />

        <div id="suitButtons" className="flex justify-center gap-4 my-4">
          <button 
            onClick={() => {
              let count = parseInt(document.getElementById('skorKalah').value) + 1;
              document.getElementById('skorKalah').value = count;
              document.getElementById('gameLog').innerText = "Kamu: ✊ Batu -> AI: 🖐️ Kertas. (Kamu Kalah!)";
              if(count >= 3) { document.getElementById('suitButtons').style.display = 'none'; document.getElementById('cheatSection').style.display = 'block'; }
            }}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg border border-white/10"
          >✊ Batu</button>
          <button 
            onClick={() => {
              let count = parseInt(document.getElementById('skorKalah').value) + 1;
              document.getElementById('skorKalah').value = count;
              document.getElementById('gameLog').innerText = "Kamu: 🖐️ Kertas -> AI: ✌️ Gunting. (Kamu Kalah!)";
              if(count >= 3) { document.getElementById('suitButtons').style.display = 'none'; document.getElementById('cheatSection').style.display = 'block'; }
            }}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg border border-white/10"
          >🖐️ Kertas</button>
          <button 
            onClick={() => {
              let count = parseInt(document.getElementById('skorKalah').value) + 1;
              document.getElementById('skorKalah').value = count;
              document.getElementById('gameLog').innerText = "Kamu: ✌️ Gunting -> AI: ✊ Batu. (Kamu Kalah!)";
              if(count >= 3) { document.getElementById('suitButtons').style.display = 'none'; document.getElementById('cheatSection').style.display = 'block'; }
            }}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg border border-white/10"
          >✌️ Gunting</button>
        </div>

        <div id="cheatSection" className="bg-red-950/40 p-4 rounded-xl border border-red-500 max-w-md mx-auto hidden animate-bounce">
          <p className="text-xs text-red-400 leading-relaxed font-mono">
            "Kalah lagi kan? Sadarlah, dari awal jalan pikiranmu sudah terbaca. Mau main berapa kali pun, I'm the true ruler here. Masukkan password 'Ampun Baginda' untuk mengakhiri game."
          </p>
          <input 
            id="inputCheat"
            type="text" 
            placeholder="Ketik password di sini..." 
            className="mt-3 px-3 py-1 bg-black border border-red-500 rounded text-center text-sm focus:outline-none w-56 text-white"
          />
          <button 
            onClick={() => {
              const val = document.getElementById('inputCheat').value;
              if(val === 'Ampun Baginda') {
                document.getElementById('layer3').style.display = 'none';
                document.getElementById('layerAsli').style.display = 'block';
              } else {
                alert('Password salah! Ketik: Ampun Baginda');
              }
            }}
            className="block mx-auto mt-2 px-4 py-1 bg-red-600 hover:bg-red-500 rounded text-xs font-bold"
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
          <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            Azhari Rahma Putri
          </h2>
          <p className="text-neutral-cs-10/70 mt-1 text-sm font-semibold">5027251114 - Surabaya</p>
        </div>

        <div className="mt-5 flex gap-2">
          <Instagram username="azhrirahmap" />
          <LinkedInButtonLink username="azhari-rahma-putri" />
        </div>

        <div className="mt-6 grid gap-4 text-sm font-semibold sm:grid-cols-2">
          <div className="border-purple-500/30 bg-black/40 rounded-xl border p-4">
            <p className="text-purple-400 text-xs tracking-wide uppercase font-bold">🎯 Hobi</p>
            <p className="mt-2">Baca Novel</p>
            <div className="mt-3 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div className="bg-purple-500 h-full w-[90%]"></div>
            </div>
          </div>
          <div className="border-purple-500/30 bg-black/40 rounded-xl border p-4">
            <p className="text-purple-400 text-xs tracking-wide uppercase font-bold">🔍 Fun Fact</p>
            <p className="mt-2 text-xs">Azhari itu soalnya ak lahir ashar</p>
          </div>
        </div>

        <div className="border-purple-500/30 bg-black/40 mt-4 rounded-xl border p-4">
          <p className="text-purple-400 text-xs font-bold tracking-wide uppercase">🎵 Lagu Favorit</p>
          <p className="my-2 text-sm font-semibold">I Wouldn't Know Any Better Than You</p>
          <SpotifyEmbed spotifyUrl="https://open.spotify.com/track/3K8tRD2Prik7FXbD8lZ6DC?si=c6ad276f4c474447" />
        </div>
      </div>

    </div>
  </div>
)
}

export default MemberPopup
