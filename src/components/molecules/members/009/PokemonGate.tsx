'use client'

import { ClipboardEvent, FormEvent, KeyboardEvent, useState } from 'react'

import Image from 'next/image'

import CharmenderImage from './Charmender.png'
import PikachuImage from './Pikachu.png'
import SnorlaxImage from './Snorlax.png'

type PokemonGateProps = {
  onClose: () => void
  onSuccess: () => void
}

const POKEMONS = [
  {
    name: 'Pikachu',
    image: PikachuImage,
    hint: 'P',
    answers: ['pikachu']
  },
  {
    name: 'Charmender',
    image: CharmenderImage,
    hint: 'C',
    answers: ['charmender', 'charmander']
  },
  {
    name: 'Snorlax',
    image: SnorlaxImage,
    hint: 'S',
    answers: ['snorlax']
  }
]

const PokemonGate = ({ onClose, onSuccess }: PokemonGateProps) => {
  const [introClicks, setIntroClicks] = useState(0)
  const [shakeStep, setShakeStep] = useState(0)
  const [introDone, setIntroDone] = useState(false)
  const [round, setRound] = useState(0)
  const currentPokemon = POKEMONS[round]
  const [guess, setGuess] = useState(currentPokemon.hint)
  const [message, setMessage] = useState('Huruf pertama sudah dibuka. Tebak untuk masuk!')
  const displayPattern = currentPokemon.name
    .split('')
    .map((_, index) => guess[index]?.toUpperCase() ?? '_')
    .join(' ')

  const handlePokeballClick = () => {
    const nextClicks = introClicks + 1

    setIntroClicks(nextClicks)
    setShakeStep(-1)
    window.setTimeout(() => setShakeStep(1), 90)
    window.setTimeout(() => setShakeStep(-1), 180)
    window.setTimeout(() => setShakeStep(1), 270)
    window.setTimeout(() => setShakeStep(0), 360)

    if (nextClicks >= 5) {
      setIntroDone(true)
    }
  }

  const handleGuessKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      return
    }

    if (event.key === 'Backspace') {
      event.preventDefault()
      setGuess((previousGuess) =>
        previousGuess.slice(0, Math.max(currentPokemon.hint.length, previousGuess.length - 1))
      )
      return
    }

    if (/^[a-zA-Z]$/.test(event.key)) {
      event.preventDefault()

      if (guess.length < currentPokemon.name.length) {
        setGuess((previousGuess) => `${previousGuess}${event.key}`)
        setMessage('Isi hurufnya satu-satu sampai lengkap.')
      }
    }
  }

  const handleGuessPaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault()

    const pastedLetters = event.clipboardData.getData('text').replace(/[^a-zA-Z]/g, '')

    if (!pastedLetters) {
      return
    }

    const normalizedPaste = pastedLetters.toLowerCase().startsWith(currentPokemon.hint.toLowerCase())
      ? pastedLetters
      : `${currentPokemon.hint}${pastedLetters}`

    setGuess(normalizedPaste.slice(0, currentPokemon.name.length))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (currentPokemon.answers.includes(guess.trim().toLowerCase())) {
      const nextRound = round + 1

      if (nextRound === POKEMONS.length) {
        setMessage('Benar semua! Membuka profile...')
        onSuccess()
        return
      }

      setRound(nextRound)
      setGuess(POKEMONS[nextRound].hint)
      setMessage('Benar! Lanjut Pokemon berikutnya.')
      return
    }

    setMessage('Belum tepat. Coba lagi!')
  }

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center overflow-y-auto px-4 py-6">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#ef4444dd_0%,#fef3c7dd_46%,#3b82f6dd_100%)] backdrop-blur-md" />

      <div
        className={
          introDone
            ? 'relative z-10 flex w-full max-w-[680px] flex-col items-center rounded-[28px] border-4 border-slate-950 bg-[linear-gradient(180deg,#ef4444_0_88px,#111827_88px_100px,#f8fafc_100px_100%)] p-5 text-center text-slate-950 shadow-[0_24px_70px_rgba(15,23,42,0.45)] sm:p-8'
            : 'relative z-10 flex w-full max-w-[680px] flex-col items-center text-center text-slate-950'
        }
      >
        {introDone && (
          <button
            type="button"
            aria-label="Close Pokemon gate"
            onClick={onClose}
            className="absolute top-4 right-4 z-20 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-4 border-slate-950 bg-white text-xl leading-none font-black text-red-500 shadow-[0_4px_0_#111827] transition-transform hover:-translate-y-0.5 hover:shadow-[0_5px_0_#111827]"
          >
            x
          </button>
        )}

        {!introDone && (
          <div className="flex min-h-[420px] w-full items-center justify-center">
            <button
              type="button"
              aria-label="Click Pokeball to start"
              onClick={handlePokeballClick}
              className="relative h-40 w-40 cursor-pointer overflow-hidden rounded-full border-8 border-slate-950 bg-[linear-gradient(180deg,#ef4444_0_45%,#111827_45%_55%,#f8fafc_55%_100%)] shadow-[0_12px_0_#111827] transition-transform duration-100 hover:-translate-y-1"
              style={{
                transform:
                  shakeStep === 0 ? 'rotate(0deg)' : `rotate(${shakeStep * 14}deg) translateX(${shakeStep * 6}px)`
              }}
            >
              <span className="absolute top-1/2 left-0 h-5 w-full -translate-y-1/2 bg-slate-950" />
              <span className="absolute top-1/2 left-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border-8 border-slate-950 bg-white" />
              <span className="absolute top-1/2 left-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-slate-950 bg-slate-100" />
            </button>
          </div>
        )}

        {introDone && (
          <>
            <h1 className="mt-4 text-3xl leading-tight font-black tracking-normal text-yellow-300 drop-shadow-[3px_0_0_#2563eb,-3px_0_0_#2563eb,0_3px_0_#2563eb,0_-3px_0_#2563eb,3px_3px_0_#1d4ed8,-3px_3px_0_#1d4ed8,3px_-3px_0_#1d4ed8,-3px_-3px_0_#1d4ed8,0_6px_0_#111827] sm:text-5xl">
              WHO IS THAT POKEMON
            </h1>
            <p className="mt-3 rounded-full border-4 border-slate-950 bg-yellow-300 px-4 py-1 text-sm font-black shadow-[0_4px_0_#ca8a04]">
              {round + 1}/{POKEMONS.length}
            </p>

            <div className="mt-8 w-full rounded-[24px] border-4 border-slate-950 bg-yellow-300 p-5 shadow-[0_8px_0_#111827]">
              <div className="mx-auto flex aspect-[6/5] w-full max-w-[360px] items-center justify-center rounded-2xl border-4 border-white bg-[radial-gradient(circle_at_center,#bfdbfe_0%,#60a5fa_58%,#2563eb_100%)]">
                <Image
                  src={currentPokemon.image}
                  alt={`${currentPokemon.name} silhouette`}
                  className="h-[82%] w-[82%] object-contain drop-shadow-[0_10px_0_rgba(15,23,42,0.3)]"
                  priority
                />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-7 flex w-full max-w-[460px] flex-col gap-3">
              <label htmlFor="pokemon-guess" className="text-sm font-black tracking-wide text-slate-700 uppercase">
                Jawaban
              </label>
              <input
                id="pokemon-guess"
                value={displayPattern}
                onKeyDown={handleGuessKeyDown}
                onPaste={handleGuessPaste}
                onChange={() => {}}
                className="w-full rounded-2xl border-4 border-slate-950 bg-white px-5 py-3 text-center text-2xl font-black tracking-[0.2em] text-slate-950 caret-transparent shadow-[0_6px_0_#111827] transition outline-none focus:-translate-y-0.5 focus:shadow-[0_8px_0_#111827]"
                autoComplete="off"
                autoFocus
              />
              <p className="min-h-5 text-sm font-bold text-slate-700">{message}</p>
              <button
                type="submit"
                className="rounded-full border-4 border-slate-950 bg-yellow-300 px-6 py-3 text-base font-black text-slate-950 shadow-[0_6px_0_#ca8a04] transition-transform hover:-translate-y-0.5 hover:shadow-[0_8px_0_#ca8a04]"
              >
                Tebak!
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

export default PokemonGate
