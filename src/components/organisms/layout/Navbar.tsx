'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import LogoWithTextHorizontal from '@/components/atoms/icon/LogoWithTextHorizontal'

const Navbar = () => {
  const pathname = usePathname()
  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Profil DTI', href: '/profil-dti' },
    { label: 'About Us', href: '/about-us' },
    { label: 'Members', href: '/members' },
    { label: 'Fun Corners', href: '/fun-corners' },
  ]

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  return (
    <div className="bg-blue-cs-40/85 fixed top-4 left-1/2 z-50 flex w-[calc(100%-3rem)] -translate-x-1/2 items-center justify-between rounded-[20px] px-12 py-4 text-white backdrop-blur-xs">
      <LogoWithTextHorizontal alt="Evastra - Teknologi Informasi ITS 2025" width={186} height={30} />
      <div className="flex">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`mx-4 font-medium transition-colors ${
              isActive(item.href)
                ? 'text-yellow-cs-30 underline decoration-yellow-cs-30 decoration-2 underline-offset-6'
                : 'text-white'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Navbar
