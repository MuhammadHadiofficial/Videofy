import { cn } from '@/lib/utils'
import Link from 'next/link'
import React from 'react'

type Props = {
    icon: React.ReactNode,
    title: string,
    href: string,
    selected?: boolean
    notifications?: number
}

const SidebarItem = ({icon, title, href, selected, notifications}: Props) => {
  return (
    <div className='cursor-pointer my-[5px]'>
        <Link href={href} className={cn('flex items-center justify-between group rounded-lg hover:bg-[#1D1D1D]',selected?'bg-[#1D1D1D]':'')}>
        <div className="flex items-center gap-2 transition-all p-[5px] cursor-pointer">
            {icon}
            <span className={cn(" font-medium group-hover:text-[#9D9D9D] truncate transition-all w-32",selected?'text-[#9D9D9D]':'text-[#545454]')}>{title}</span>
        </div>
        </Link>
    </div>
  )
}

export default SidebarItem