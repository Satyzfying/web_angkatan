'use client'

import { useEffect, useRef, useState, useTransition } from 'react'

import { toast } from 'sonner'

import { createMenfessAction } from '@/actions/menfess'

import Send from '../atoms/icon/Send'

export default function MenfessForm() {
  const [isPending, startTransition] = useTransition()

  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [message, setMessage] = useState('')

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // auto resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
    }
  }, [message])

  async function submitAction(formData: FormData) {
    const result = await createMenfessAction(formData)

    if (!result.success) {
      toast.error(result.error?.toLowerCase() ?? result.message.toLowerCase())
      return
    }

    toast.success('Menfess berhasil dikirim!')

    setFrom('')
    setTo('')
    setMessage('')

    window.dispatchEvent(new Event('menfess:created'))
  }

  return (
    <form
      action={(formData) =>
        startTransition(async () => {
          await submitAction(formData)
        })
      }
      className="w-full px-6 text-white lg:px-4"
    >
      {/* From & To */}
      <div className="mb-4 flex w-full flex-col gap-4 lg:flex-row lg:gap-6">
        {/* From */}
        <div className="flex flex-1 flex-col gap-1">
          <input
            name="from"
            type="text"
            placeholder="From: ..."
            maxLength={24}
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="h-12 rounded-xl border border-white bg-[#0B1E38]/70 px-4 text-white transition outline-none placeholder:text-white/50 focus:border-white lg:rounded-l-xl lg:rounded-r-none"
          />
          <span className="text-right text-xs text-white/60">{from.length}/24</span>
        </div>

        {/* To */}
        <div className="flex flex-1 flex-col gap-1">
          <input
            name="to"
            type="text"
            placeholder="To: ..."
            maxLength={24}
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="h-12 rounded-xl border border-white bg-[#0B1E38]/70 px-4 text-white transition outline-none placeholder:text-white/50 focus:border-white lg:rounded-l-none lg:rounded-r-xl"
          />
          <span className="text-right text-xs text-white/60">{to.length}/24</span>
        </div>
      </div>

      {/* Message & Send */}
      <div className="flex w-full flex-col items-stretch gap-3 lg:flex-row">
        {/* Message */}
        <div className="flex flex-1 flex-col gap-1">
          <textarea
            ref={textareaRef}
            name="message"
            placeholder="Type your message here..."
            maxLength={240}
            rows={1}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="max-h-[300px] min-h-[60px] resize-none overflow-hidden rounded-xl border border-white bg-[#0B1E38]/70 px-4 py-4 text-white transition outline-none placeholder:text-white/50 focus:border-white lg:rounded-l-xl lg:rounded-r-none"
          />
          <span className="text-right text-xs text-white/60">{message.length}/240</span>
        </div>

        {/* Send Button */}
        <button
          type="submit"
          disabled={isPending}
          className="flex h-[60px] w-full transform cursor-pointer items-center justify-center gap-2 rounded-xl border border-white bg-[#0B1E38]/70 text-white transition hover:scale-[1.02] hover:bg-[#132B66]/70 lg:h-auto lg:w-[120px] lg:self-stretch lg:rounded-l-none lg:rounded-r-xl"
        >
          <span>
            <Send width={20} height={20} />
          </span>

          {isPending ? 'Sending...' : 'Send'}
        </button>
      </div>
    </form>
  )
}
