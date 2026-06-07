"use client";

/* eslint-disable react-hooks/exhaustive-deps -- The game loop intentionally reads from a stable mutable state ref. */

import { useEffect, useRef, useCallback, useState } from "react";

const COLS = 10;
const ROWS = 20;
const SZ = 36;
const TARGET_LINES = 4;

const COLORS = [
  "#534AB7", "#1D9E75", "#E24B4A",
  "#EF9F27", "#378ADD", "#D4537E", "#5DCAA5",
];

const SHAPES = [
  [[1, 1, 1, 1]],
  [[1, 1], [1, 1]],
  [[0, 1, 0], [1, 1, 1]],
  [[1, 0, 0], [1, 1, 1]],
  [[0, 0, 1], [1, 1, 1]],
  [[1, 1, 0], [0, 1, 1]],
  [[0, 1, 1], [1, 1, 0]],
];

type Board = (string | 0)[][];
type Piece = { shape: number[][]; color: string; x: number; y: number };

function emptyBoard(): Board {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
}

function randPiece(): Piece {
  const i = Math.floor(Math.random() * SHAPES.length);
  const shape = SHAPES[i].map((r) => [...r]);
  return {
    shape,
    color: COLORS[i],
    x: Math.floor(COLS / 2) - Math.floor(shape[0].length / 2),
    y: 0,
  };
}

interface TetrisGateProps {
  onSuccess: () => void;
  onClose: () => void;
}

export default function TetrisGate({ onSuccess, onClose }: TetrisGateProps) {
  const boardRef = useRef<HTMLCanvasElement>(null);
  const nextRef = useRef<HTMLCanvasElement>(null);
  const audioCtx = useRef<AudioContext | null>(null);
  const stateRef = useRef({
    board: emptyBoard() as Board,
    piece: randPiece(),
    nextPiece: randPiece(),
    score: 0,
    linesCleared: 0,
    running: false,
    paused: false,
    lastDrop: 0,
    animId: 0,
  });

  const [started, setStarted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);

  const s = stateRef.current;

  const getCtx = useCallback(() => {
    if (!audioCtx.current) {
      audioCtx.current = new AudioContext();
    }
    if (audioCtx.current.state === 'suspended') {
    audioCtx.current.resume();
    }
    return audioCtx.current;
  }, []);

  const playSound = useCallback((type: 'move' | 'rotate' | 'drop' | 'clear' | 'gameover') => {
    const ctx = getCtx();
    const now = ctx.currentTime;

    switch (type) {
      case 'move': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'square';
        osc.frequency.setValueAtTime(220, now);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
        break;
      }
      case 'rotate': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'square';
        osc.frequency.setValueAtTime(330, now);
        osc.frequency.setValueAtTime(440, now + 0.05);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
        break;
      }
      case 'drop': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'square';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.1);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
        break;
      }
      case 'clear': {
        [261, 329, 392, 523].forEach((freq, i) => {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.connect(g);
          g.connect(ctx.destination);
          o.type = 'square';
          o.frequency.setValueAtTime(freq, now + i * 0.08);
          g.gain.setValueAtTime(0.08, now + i * 0.08);
          g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.15);
          o.start(now + i * 0.08);
          o.stop(now + i * 0.08 + 0.15);
        });
        break;
      }
      case 'gameover': {
        [392, 329, 261, 196].forEach((freq, i) => {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.connect(g);
          g.connect(ctx.destination);
          o.type = 'sawtooth';
          o.frequency.setValueAtTime(freq, now + i * 0.15);
          g.gain.setValueAtTime(0.08, now + i * 0.15);
          g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.15 + 0.2);
          o.start(now + i * 0.15);
          o.stop(now + i * 0.15 + 0.2);
        });
        break;
      }
    }
  }, [getCtx]);

  const validPos = useCallback(
    (p: Piece, dx = 0, dy = 0, shape?: number[][]) => {
      const sh = shape ?? p.shape;
      for (let r = 0; r < sh.length; r++) {
        for (let c = 0; c < sh[r].length; c++) {
          if (!sh[r][c]) continue;
          const nx = p.x + c + dx;
          const ny = p.y + r + dy;
          if (nx < 0 || nx >= COLS || ny >= ROWS) return false;
          if (ny >= 0 && s.board[ny][nx]) return false;
        }
      }
      return true;
    },
    []
  );

  const drawBlock = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    color: string
  ) => {
    ctx.fillStyle = color;
    ctx.fillRect(x * SZ + 1, y * SZ + 1, SZ - 2, SZ - 2);
    ctx.fillStyle = "rgba(255,255,255,0.15)";
    ctx.fillRect(x * SZ + 1, y * SZ + 1, SZ - 2, 3);
  };

  const drawNext = useCallback(() => {
    const nc = nextRef.current;
    if (!nc) return;
    const nctx = nc.getContext("2d")!;
    nctx.fillStyle = "#0d1117";
    nctx.fillRect(0, 0, 80, 80);
    const ns = 16;
    const { shape, color } = s.nextPiece;
    const ox = Math.floor((80 - shape[0].length * ns) / 2);
    const oy = Math.floor((80 - shape.length * ns) / 2);
    shape.forEach((row, r) =>
      row.forEach((v, c) => {
        if (v) {
          nctx.fillStyle = color;
          nctx.fillRect(ox + c * ns + 1, oy + r * ns + 1, ns - 2, ns - 2);
        }
      })
    );
  }, []);

  const draw = useCallback(() => {
    const canvas = boardRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#0d1117";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "rgba(255,255,255,0.04)";
    ctx.lineWidth = 0.5;
    for (let r = 0; r < ROWS; r++) {
      ctx.beginPath(); ctx.moveTo(0, r * SZ); ctx.lineTo(COLS * SZ, r * SZ); ctx.stroke();
    }
    for (let c = 0; c < COLS; c++) {
      ctx.beginPath(); ctx.moveTo(c * SZ, 0); ctx.lineTo(c * SZ, ROWS * SZ); ctx.stroke();
    }

    let gy = s.piece.y;
    while (validPos({ ...s.piece, y: gy + 1 })) gy++;
    s.piece.shape.forEach((row, r) =>
      row.forEach((v, c) => {
        if (v && gy + r >= 0) {
          ctx.fillStyle = "rgba(255,255,255,0.07)";
          ctx.fillRect((s.piece.x + c) * SZ + 1, (gy + r) * SZ + 1, SZ - 2, SZ - 2);
        }
      })
    );

    s.board.forEach((row, r) =>
      row.forEach((col, c) => { if (col) drawBlock(ctx, c, r, col as string); })
    );

    s.piece.shape.forEach((row, r) =>
      row.forEach((v, c) => {
        if (v) drawBlock(ctx, s.piece.x + c, s.piece.y + r, s.piece.color);
      })
    );

    drawNext();
  }, [validPos, drawNext]);

  const clearLines = useCallback(() => {
    let cleared = 0;
    for (let r = ROWS - 1; r >= 0; r--) {
      if (s.board[r].every((c) => c)) {
        s.board.splice(r, 1);
        s.board.unshift(Array(COLS).fill(0));
        cleared++;
        r++;
      }
    }
    if (cleared) {
      s.score += cleared * 100 * cleared;
      s.linesCleared += cleared;
      setScore(s.score);
      setLines(s.linesCleared);
      playSound('clear');
      if (s.linesCleared >= TARGET_LINES) {
        s.running = false;
        setWon(true);
      }
    }
  }, [playSound]);

  const lockPiece = useCallback(() => {
    s.piece.shape.forEach((row, ri) =>
      row.forEach((v, ci) => {
        if (v && s.piece.y + ri >= 0)
          s.board[s.piece.y + ri][s.piece.x + ci] = s.piece.color;
      })
    );
    clearLines();
    s.piece = s.nextPiece;
    s.nextPiece = randPiece();
    if (!validPos(s.piece)) {
      s.running = false;
      playSound('gameover');
      setGameOver(true);
    }
  }, [clearLines, validPos, playSound]);

  const loop = useCallback(
    function gameLoop(ts: number = 0) {
      if (!s.running || s.paused) return;
      const speed = Math.max(100, 500 - s.linesCleared * 30);
      if (ts - s.lastDrop > speed) {
        if (!validPos(s.piece, 0, 1)) lockPiece();
        else s.piece.y++;
        s.lastDrop = ts;
      }
      draw();
      s.animId = requestAnimationFrame(gameLoop);
    },
    [draw, lockPiece, validPos]
  );

  const hardDrop = useCallback(() => {
    if (!s.running || s.paused) return;
    while (validPos(s.piece, 0, 1)) s.piece.y++;
    playSound('drop');
    lockPiece();
    draw();
  }, [validPos, lockPiece, draw, playSound]);

  const rotatePiece = useCallback(() => {
    if (!s.running || s.paused) return;
    const rot = s.piece.shape[0].map((_, i) =>
      s.piece.shape.map((r) => r[i]).reverse()
    );
    if (validPos(s.piece, 0, 0, rot)) { s.piece.shape = rot; playSound('rotate'); }
    else if (validPos(s.piece, 1, 0, rot)) { s.piece.x++; s.piece.shape = rot; playSound('rotate'); }
    else if (validPos(s.piece, -1, 0, rot)) { s.piece.x--; s.piece.shape = rot; playSound('rotate'); }
  }, [validPos, playSound]);

  const startGame = useCallback(() => {
    s.board = emptyBoard();
    s.piece = randPiece();
    s.nextPiece = randPiece();
    s.score = 0;
    s.linesCleared = 0;
    s.running = true;
    s.paused = false;
    s.lastDrop = performance.now();
    setScore(0); setLines(0); setGameOver(false); setWon(false); setPaused(false);
    setStarted(true);
    cancelAnimationFrame(s.animId);
    requestAnimationFrame(loop);
  }, [loop]);

  const togglePause = useCallback(() => {
    s.paused = !s.paused;
    setPaused(s.paused);
    if (!s.paused) {
      s.lastDrop = performance.now();
      requestAnimationFrame(loop);
    }
  }, [loop]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!s.running || s.paused) return;
      if (["ArrowLeft","ArrowRight","ArrowDown","ArrowUp","Space"].includes(e.code))
        e.preventDefault();
      if (e.code === "ArrowLeft" && validPos(s.piece, -1, 0)) {
        s.piece.x--;
        playSound('move');
      } else if (e.code === "ArrowRight" && validPos(s.piece, 1, 0)) {
        s.piece.x++;
        playSound('move');
      } else if (e.code === "ArrowDown") {
        if (validPos(s.piece, 0, 1)) { s.piece.y++; s.lastDrop = performance.now(); playSound('move'); }
      } else if (e.code === "ArrowUp") {
        rotatePiece();
      } else if (e.code === "Space") {
        hardDrop();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [validPos, rotatePiece, hardDrop, playSound]);

  useEffect(() => {
    draw();
  }, [draw]);

  const progress = Math.min((lines / TARGET_LINES) * 100, 100);

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center overflow-hidden px-4">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-[#050E1C]/80 backdrop-blur-sm"
      />
      <div className="relative z-10 flex h-[100dvh] max-h-[100dvh] w-full max-w-[720px] flex-col items-center gap-5 overflow-y-auto border-x border-white/10 bg-[#0d1117] p-6 text-white shadow-xl">

        {/* Tombol exit */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white/60 hover:bg-white/10 transition-colors"
          aria-label="Tutup popup"
        >
          ✕
        </button>

        <div className="flex gap-5 items-start w-full justify-center">
          <div className="relative flex-1" style={{ maxWidth: `${COLS * SZ}px` }}>
            <canvas
              ref={boardRef}
              width={COLS * SZ}
              height={ROWS * SZ}
              className="rounded-xl border border-white/10 w-full"
            />

            {!started && (
              <div className="absolute inset-0 rounded-xl bg-black/85 flex flex-col items-center justify-center gap-4 text-center p-6">
                <p className="text-2xl font-semibold">Selesai-in {TARGET_LINES} baris<br />klo mau liat yh</p>
                <p className="text-sm text-white/60">← → move · ↑ rotate · ↓ soft drop<br /><kbd className="px-2 py-0.5 rounded border border-white/30 bg-white/10 text-xs font-mono">space</kbd> hard drop</p>
                <button
                  onClick={startGame}
                  className="mt-2 px-6 py-2.5 rounded-full bg-[#534AB7] text-white text-sm font-medium hover:bg-[#3C3489] transition-colors"
                >
                  Start
                </button>
              </div>
            )}

            {won && (
              <div className="absolute inset-0 rounded-xl bg-black/85 flex flex-col items-center justify-center gap-4 text-center p-6">
                <p className="text-2xl font-semibold">YEY GGWP TMAN!</p>
                <p className="text-sm text-white/60">WELKAM WELKAM!</p>
                <button
                  onClick={onSuccess}
                  className="mt-2 px-6 py-2.5 rounded-full bg-[#534AB7] text-white text-sm font-medium hover:bg-[#3C3489] transition-colors"
                >
                  Open
                </button>
              </div>
            )}

            {gameOver && (
              <div className="absolute inset-0 rounded-xl bg-black/85 flex flex-col items-center justify-center gap-4 text-center p-6">
                <p className="text-2xl font-semibold text-red-400">Game over</p>
                <p className="text-sm text-white/60">NT NT, coba lagi yh (kalo mau)</p>
                <button
                  onClick={startGame}
                  className="mt-2 px-6 py-2.5 rounded-full bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 w-28">
            <div className="bg-white/5 border border-white/10 rounded-xl p-3">
              <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Score</p>
              <p className="text-xl font-medium">{score}</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3">
              <p className="text-[10px] uppercase tracking-widest text-white/40 mb-2">Next</p>
              <canvas ref={nextRef} width={80} height={80} className="mx-auto" />
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3">
              <p className="text-[10px] uppercase tracking-widest text-white/40 mb-2">Lines</p>
              <div className="bg-white/10 rounded h-2 overflow-hidden">
                <div
                  className="h-2 rounded bg-[#534AB7] transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-white/50 mt-2 text-center">{Math.min(lines, TARGET_LINES)} / {TARGET_LINES}</p>
            </div>

            {started && !won && !gameOver && (
              <div className="flex flex-col gap-2">
                <button
                  onClick={togglePause}
                  className="w-full py-2 rounded-xl border border-white/20 text-sm text-white/70 hover:bg-white/10 transition-colors"
                >
                  {paused ? "Resume" : "Pause"}
                </button>
                <button
                  onClick={startGame}
                  className="w-full py-2 rounded-xl border border-white/20 text-sm text-white/70 hover:bg-white/10 transition-colors"
                >
                  Restart
                </button>
              </div>
            )}
          </div>
        </div>

        {started && (
          <div className="flex flex-col items-center gap-2 sm:hidden">
            <button onClick={rotatePiece} className="w-12 h-12 rounded-xl bg-white/10 border border-white/10 text-lg">↻</button>
            <div className="flex gap-2">
              <button onClick={() => { if (validPos(s.piece,-1,0)) { s.piece.x--; playSound('move'); } }} className="w-12 h-12 rounded-xl bg-white/10 border border-white/10 text-lg">←</button>
              <button onClick={() => { if (validPos(s.piece,0,1)) { s.piece.y++; s.lastDrop=performance.now(); playSound('move'); } }} className="w-12 h-12 rounded-xl bg-white/10 border border-white/10 text-lg">↓</button>
              <button onClick={() => { if (validPos(s.piece,1,0)) { s.piece.x++; playSound('move'); } }} className="w-12 h-12 rounded-xl bg-white/10 border border-white/10 text-lg">→</button>
            </div>
            <button onClick={hardDrop} className="w-32 h-10 rounded-xl bg-white/10 border border-white/10 text-sm">Hard drop</button>
          </div>
        )}
      </div>
    </div>
  );
}
