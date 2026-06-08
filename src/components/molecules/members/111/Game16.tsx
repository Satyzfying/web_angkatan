'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'

type Game16Props = {
  onWin: () => void
}

// Helper untuk mencari kotak kosong di array 4x4
const getEmptyCoordinates = (board: number[][]) => {
  const empty: { r: number; c: number }[] = []
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (board[r][c] === 0) empty.push({ r, c })
    }
  }
  return empty
}

const getRandomEmptyCoordinate = (board: number[][]) => {
  const empty = getEmptyCoordinates(board)
  if (empty.length === 0) return null
  return empty[Math.floor(Math.random() * empty.length)]
}

// Inisialisasi awal matriks dengan dua angka 2 acak
const initializeBoard = () => {
  const board = Array.from({ length: 4 }, () => Array(4).fill(0))
  const pos1 = getRandomEmptyCoordinate(board)
  if (pos1) board[pos1.r][pos1.c] = 2
  const pos2 = getRandomEmptyCoordinate(board)
  if (pos2) board[pos2.r][pos2.c] = 2
  return board
}

export default function Game16({ onWin }: Game16Props) {
  const [board, setBoard] = useState<number[][]>(initializeBoard())
  
  // Referensi untuk mendeteksi posisi sentuhan layar HP
  const touchStart = useRef({ x: 0, y: 0 })

  const checkWin = (b: number[][]) => {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (b[r][c] === 16) return true 
      }
    }
    return false
  }

  // Manipulasi Matriks: Rotasi dan Balik (Reverse)
  const transpose = (matrix: number[][]) => matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]))
  const reverseRows = (matrix: number[][]) => matrix.map(row => [...row].reverse())

  // Algoritma geser elemen ke kiri
  const moveLeft = (currentBoard: number[][]) => {
    let moved = false
    const newBoard = currentBoard.map(row => {
      let filteredRow = row.filter(val => val !== 0)
      for (let i = 0; i < filteredRow.length - 1; i++) {
        if (filteredRow[i] === filteredRow[i + 1]) {
          filteredRow[i] *= 2
          filteredRow[i + 1] = 0
        }
      }
      filteredRow = filteredRow.filter(val => val !== 0)
      while (filteredRow.length < 4) filteredRow.push(0)
      if (filteredRow.join(',') !== row.join(',')) moved = true
      return filteredRow
    })
    return { newBoard, moved }
  }

  // Menangani input pergerakan (dari Keyboard maupun usapan HP)
  const move = useCallback((direction: 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight') => {
    let tempBoard = [...board.map(row => [...row])]
    let moved = false

    if (direction === 'ArrowLeft') {
      const result = moveLeft(tempBoard)
      tempBoard = result.newBoard
      moved = result.moved
    } else if (direction === 'ArrowRight') {
      tempBoard = reverseRows(tempBoard)
      const result = moveLeft(tempBoard)
      tempBoard = reverseRows(result.newBoard)
      moved = result.moved
    } else if (direction === 'ArrowUp') {
      tempBoard = transpose(tempBoard)
      const result = moveLeft(tempBoard)
      tempBoard = transpose(result.newBoard)
      moved = result.moved
    } else if (direction === 'ArrowDown') {
      tempBoard = transpose(tempBoard)
      tempBoard = reverseRows(tempBoard)
      const result = moveLeft(tempBoard)
      tempBoard = reverseRows(result.newBoard)
      tempBoard = transpose(tempBoard)
      moved = result.moved
    }

    if (moved) {
      const newPos = getRandomEmptyCoordinate(tempBoard)
      if (newPos) tempBoard[newPos.r][newPos.c] = 2
      setBoard(tempBoard)

      if (checkWin(tempBoard)) {
        setTimeout(() => onWin(), 400) 
      }
    }
  }, [board, onWin])

  // Deteksi pencetan Panah Keyboard (Untuk PC)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault() 
        move(e.key as any)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [move])

  // === FITUR BARU: Deteksi Usapan (Swipe) untuk Layar HP ===
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    }
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX
    const touchEndY = e.changedTouches[0].clientY

    const deltaX = touchEndX - touchStart.current.x
    const deltaY = touchEndY - touchStart.current.y

    // Jarak minimal usapan agar terdeteksi (mencegah klik biasa dianggap usapan)
    const minSwipeDistance = 30 

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Usapan Horizontal (Kiri/Kanan)
      if (Math.abs(deltaX) > minSwipeDistance) {
        if (deltaX > 0) move('ArrowRight')
        else move('ArrowLeft')
      }
    } else {
      // Usapan Vertikal (Atas/Bawah)
      if (Math.abs(deltaY) > minSwipeDistance) {
        if (deltaY > 0) move('ArrowDown')
        else move('ArrowUp')
      }
    }
  }

  const getBgColor = (val: number) => {
    switch (val) {
      case 2: return 'bg-white/10 text-white/70'
      case 4: return 'bg-white/20 text-white/80'
      case 8: return 'bg-white/30 text-white/95 drop-shadow-md'
      case 16: return 'bg-emerald-500/80 text-white font-black drop-shadow-lg'
      default: return 'bg-black/40'
    }
  }

  return (
    <div className="flex flex-col items-center p-5 rounded-2xl border border-white/20 bg-black/20 backdrop-blur-md w-full">
      <p className="mb-4 text-sm font-semibold text-white/80 text-center drop-shadow-[0_1px_2px_rgba(0,0,0,1)]">
       ayo <span className="text-emerald-400 font-bold">16</span> point masa gabisa <br/> 
        <span className="text-xs text-white/50">(ea ea ea ea)</span>
      </p>

      {/* Area yang bisa diusap/swipe di HP */}
      <div 
        className="grid grid-cols-4 gap-2 bg-black/40 p-2 rounded-xl border border-white/10 touch-none"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {board.map((row, r) => (
          row.map((cell, c) => (
            <div 
              key={`${r}-${c}`} 
              className={`w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-lg text-lg font-bold transition-all duration-150 ${getBgColor(cell)}`}
            >
              {cell !== 0 ? cell : ''}
            </div>
          ))
        ))}
      </div>

      <button 
        onClick={() => setBoard(initializeBoard())}
        className="mt-5 px-4 py-2 text-xs bg-white/10 hover:bg-white/20 text-white/70 rounded-full transition-colors border border-white/10"
      >
        gabisa=bott
      </button>
    </div>
  )
}