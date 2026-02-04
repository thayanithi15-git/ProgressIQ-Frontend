'use client'
import { NavGroup } from '@/components/ui/nav-group'
import { NavUser } from '@/components/ui/nav-user'
import { TeamSwitcher } from '@/components/team-switcher'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from '@/components/ui/sidebar'
import { sidebarData, generateSidebarData } from '../../data/sidebar-data'
import { useEffect, useState } from 'react'
import { type SidebarData } from '@/types/types'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [currentSidebarData, setCurrentSidebarData] = useState<SidebarData>(sidebarData)

  useEffect(() => {
    // Generate sidebar data with localStorage values after component mounts
    const dynamicSidebarData = generateSidebarData()
    setCurrentSidebarData(dynamicSidebarData)
  }, [])

  return (
    <Sidebar collapsible='icon' variant='inset' {...props} className="font-[var(--font-poppins)]">
      <SidebarHeader className="relative pt-3 pb-6">
        <TeamSwitcher teams={currentSidebarData.teams} />
      </SidebarHeader>
      <SidebarContent>
        {currentSidebarData.navGroups.map((props) => (
          <NavGroup key={props.title} group={props} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={currentSidebarData.user} />
      </SidebarFooter>
    </Sidebar>
  )
}