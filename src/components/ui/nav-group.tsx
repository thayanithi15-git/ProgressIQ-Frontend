"use client"

import { usePathname } from 'next/navigation'
import { type NavGroup as NavGroupType } from '@/types'
import { NavItem } from './nav-item'
import { useSidebar } from '@/components/ui/sidebar'

interface NavGroupProps {
  group: NavGroupType
}

export function NavGroup({ group }: NavGroupProps) {
  const pathname = usePathname()
  const { state } = useSidebar()
  const isCollapsed = state === 'collapsed'

  return (
    <div className='space-y-1'>
      {/* Only show group title when sidebar is not collapsed */}
      {group.title && !isCollapsed && (
        <h4 className='px-2 text-xs font-semibold text-muted-foreground'>
          {group.title}
        </h4>
      )}
      {group.items.map((item) => (
        <NavItem key={item.title} item={item} pathname={pathname} />
      ))}
    </div>
  )
}