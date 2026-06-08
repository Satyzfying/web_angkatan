'use client'

import React, { useState } from 'react'
import MemberPopup from './MemberPopup'

type MemberCardProps = {
  children?: (args: { open: () => void }) => React.ReactNode
}

const MemberCard = ({ children }: MemberCardProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const open = () => setIsOpen(true)
  const handleClose = () => setIsOpen(false)

  return (
    <>
      {children
        ? children({ open })
        : (
          <button
            type="button"
            onClick={open}
            style={{
              border: '1px solid rgba(200,151,42,0.4)',
              color: '#c8972a',
              background: 'transparent',
              fontFamily: "'Oswald', sans-serif",
              letterSpacing: '3px',
              fontSize: '12px',
              textTransform: 'uppercase',
              padding: '8px 16px',
              cursor: 'pointer',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(200,151,42,0.08)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            ★ Lihat Profil
          </button>
        )
      }

      <MemberPopup
        isOpen={isOpen}
        onClose={handleClose}
      />
    </>
  )
}

export default MemberCard