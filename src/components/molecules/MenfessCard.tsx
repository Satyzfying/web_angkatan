'use client'

import type { MenfessReactionName } from '@/types/menfess'

import CalendarClock from '../atoms/icon/CalendarClock'
import Mail from '../atoms/icon/Mail'
import SendBlack from '../atoms/icon/SendBlack'

export interface MenfessCardProps {
  id: number | string
  from: string
  to: string
  message: string
  timestamp: string
  reactions: {
    laugh: number
    love: number
    sad: number
    angry: number
  }
  activeReactions?: Partial<Record<MenfessReactionName, boolean>>
  onReactionClick?: (id: number | string, reaction: MenfessReactionName) => void | Promise<void>
}

const MenfessCard = ({
  id,
  from,
  to,
  message,
  timestamp,
  reactions,
  activeReactions,
  onReactionClick
}: MenfessCardProps) => {
  const isReactionActive = (reaction: MenfessReactionName) => Boolean(activeReactions?.[reaction])

  const reactionButtonClassName = (reaction: MenfessReactionName) =>
    `flex items-center gap-1.5 border rounded-md px-3 py-1 text-md transition cursor-pointer hover:bg-white/10 ${
      isReactionActive(reaction) ? 'border-white bg-white/15' : 'border-white/30'
    }`

  return (
    <div className="flex h-[400px] flex-col rounded-xl border border-white bg-[#0B1E38]/75 p-5 text-white">
      {/* Header: From & To */}
      <div className="flex items-start justify-between gap-4 border-b border-white/50 pb-4">
        {/* From */}
        <div className="flex w-1/2 items-center gap-3">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white p-2 text-[#0B1E38]">
            <span>
              <SendBlack width={20} height={20} />
            </span>
          </div>
          <div className="flex w-full flex-col overflow-hidden">
            <span className="text-[10px] font-semibold text-white">From</span>
            <span className="truncate text-sm font-bold" title={from}>
              {from === '-' ? 'Anonymous' : from}
            </span>
          </div>
        </div>

        {/* To */}
        <div className="flex w-1/2 items-center gap-3">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white p-2 text-[#0B1E38]">
            <span>
              <Mail width={20} height={20} />
            </span>
          </div>
          <div className="flex w-full flex-col overflow-hidden">
            <span className="text-[10px] font-semibold text-white">To</span>
            <span className="truncate text-sm font-bold" title={to}>
              {to}
            </span>
          </div>
        </div>
      </div>

      {/* Body: Pesan */}
      <div className="mt-4 flex-grow overflow-hidden">
        <p className="line-clamp-8 text-sm leading-relaxed text-white">{message}</p>
      </div>

      {/* Footer: Reactions & Waktu */}
      <div className="mt-4 flex flex-shrink-0 flex-col gap-3 sm:mt-4 sm:flex-row sm:items-end sm:justify-between">
        {/* Reactions (Menggunakan emoji standar untuk mempermudah, bisa diganti icon SVG) */}
        <div className="flex w-full justify-center gap-2 sm:w-auto sm:justify-start">
          <button
            type="button"
            aria-pressed={isReactionActive('laugh')}
            onClick={() => onReactionClick?.(id, 'laugh')}
            className={reactionButtonClassName('laugh')}
          >
            😆 <span>{reactions.laugh}</span>
          </button>
          <button
            type="button"
            aria-pressed={isReactionActive('love')}
            onClick={() => onReactionClick?.(id, 'love')}
            className={reactionButtonClassName('love')}
          >
            😍 <span>{reactions.love}</span>
          </button>
          <button
            type="button"
            aria-pressed={isReactionActive('sad')}
            onClick={() => onReactionClick?.(id, 'sad')}
            className={reactionButtonClassName('sad')}
          >
            😢 <span>{reactions.sad}</span>
          </button>
          <button
            type="button"
            aria-pressed={isReactionActive('angry')}
            onClick={() => onReactionClick?.(id, 'angry')}
            className={reactionButtonClassName('angry')}
          >
            😡 <span>{reactions.angry}</span>
          </button>
        </div>

        {/* Timestamp */}
        <div className="flex items-center gap-1.5 self-end text-[11px] text-white sm:self-auto">
          <span>
            <CalendarClock width={20} height={20} />
          </span>
          <span>{timestamp}</span>
        </div>
      </div>
    </div>
  )
}

export default MenfessCard
