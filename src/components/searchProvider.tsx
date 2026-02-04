'use client'
import React from 'react'
import { useSearchStore } from '@/store/useSearchStore'
import { CommandMenu } from '@/components/command-menu'

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const toggle = useSearchStore((state) => state.toggle)

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        toggle()
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [toggle])

  return (
    <>
      {children}
      <CommandMenu />
    </>
  )
}
