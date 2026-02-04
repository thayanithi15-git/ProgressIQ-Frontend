"use client"

import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { type NavItem as NavItemType, type NavCollapsible } from '@/types'
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { Badge } from '../ui/badge'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../ui/collapsible'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'

interface NavItemProps {
  item: NavItemType
  pathname: string
}

export function NavItem({ item, pathname }: NavItemProps) {
  const { state, setOpenMobile } = useSidebar()
  const isCollapsed = state === 'collapsed'

  if (!item.items) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          isActive={checkIsActive(pathname, item)}
          tooltip={item.title}
          className={cn(
            "group relative h-10 rounded-lg transition-all duration-200 ",
            "hover:bg-accent/40 hover:text-accent-foreground",
            "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            // Better icon centering for collapsed state
            isCollapsed
            ? "justify-center ml-2 my-3"
            : "justify-start px-3", 
            checkIsActive(pathname, item) && [
              "bg-primary/10 text-primary font-medium",
              "before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-primary before:rounded-r-full "
            ]
          )}
        >
          <Link 
            href={item.url} 
            onClick={() => setOpenMobile(false)} 
            className={cn(
              "flex items-center w-full ",
              isCollapsed ? "justify-center" : "gap-4"
            )}
          >
            {item.icon && (
              <item.icon className={cn(
                "h-5 w-5 shrink-0 transition-colors",
                checkIsActive(pathname, item) ? "text-primary" : "text-muted-foreground"
              )} />
            )}
            {!isCollapsed && (
              <>
                <span className="truncate font-medium">{item.title}</span>
                {item.badge && <NavBadge variant="secondary">{item.badge}</NavBadge>}
              </>
            )}
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    )
  }

  if (isCollapsed) {
    return (
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              tooltip={item.title}
              isActive={checkIsActive(pathname, item)}
              className={cn(
                "group relative h-10 rounded-lg transition-all duration-200 ",
                "hover:bg-accent/80 hover:text-accent-foreground",
                "data-[state=open]:bg-accent/50",
                "justify-center px-2", // Center the icon in collapsed state
                isCollapsed
            ? "justify-center ml-2"
            : "justify-start px-3", 
                checkIsActive(pathname, item) && [
                  "bg-primary/10 text-primary font-medium",
                  "before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-primary before:rounded-r-full"
                ]
              )}
            >
              {item.icon && (
                <item.icon className={cn(
                  "h-4 w-4 shrink-0 transition-colors",
                  checkIsActive(pathname, item) ? "text-primary" : "text-muted-foreground"
                )} />
              )}
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            side="right" 
            align="start" 
            sideOffset={8}
            className="w-56 p-2 shadow-lg border-border/50"
          >
            <DropdownMenuLabel className="px-3 py-2 text-sm font-semibold text-foreground">
              {item.title} {item.badge && <span className="text-muted-foreground">({item.badge})</span>}
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="my-1" />
            {(item as NavCollapsible).items.map((sub) => (
              <DropdownMenuItem key={`${sub.title}-${sub.url}`} asChild className="p-0">
                <Link
                  href={sub.url}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors",
                    "hover:bg-accent hover:text-accent-foreground",
                    "focus-visible:bg-accent focus-visible:text-accent-foreground",
                    checkIsActive(pathname, sub) && "bg-primary/10 text-primary font-medium"
                  )}
                >
                  {sub.icon && (
                    <sub.icon className={cn(
                      "h-4 w-4 shrink-0",
                      checkIsActive(pathname, sub) ? "text-primary" : "text-muted-foreground"
                    )} />
                  )}
                  <span className="flex-1 truncate">{sub.title}</span>
                  {sub.badge && (
                    <Badge variant="outline" className="ml-auto h-5 px-1.5 text-xs">
                      {sub.badge}
                    </Badge>
                  )}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    )
  }

  const isOpen = checkIsActive(pathname, item, true)

  return (
    <Collapsible
      asChild
      defaultOpen={isOpen}
      className="group/collapsible"
    >
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton 
            tooltip={item.title}
            className={cn(
              "group relative h-10 rounded-lg transition-all duration-200",
              "hover:bg-accent/80 hover:text-accent-foreground",
              "data-[state=open]:bg-accent/50",
              checkIsActive(pathname, item) && [
                "bg-primary/10 text-primary font-medium",
                "before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-primary before:rounded-r-full"
              ]
            )}
          >
            {item.icon && (
              <item.icon className={cn(
                "h-4 w-4 shrink-0 transition-colors",
                checkIsActive(pathname, item) ? "text-primary" : "text-muted-foreground"
              )} />
            )}
            <span className="truncate font-medium">{item.title}</span>
            {item.badge && <NavBadge variant="secondary">{item.badge}</NavBadge>}
            <ChevronDown className={cn(
              "ml-auto h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
              "group-data-[state=open]/collapsible:rotate-180"
            )} />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
          <SidebarMenuSub className="ml-4 mt-1 space-y-0.5 border-l border-border/50 pl-4">
            {(item as NavCollapsible).items.map((subItem) => (
              <SidebarMenuSubItem key={subItem.title}>
                <SidebarMenuSubButton
                  asChild
                  isActive={checkIsActive(pathname, subItem)}
                  className={cn(
                    "group relative h-9 rounded-md transition-all duration-200",
                    "hover:bg-accent/60 hover:text-accent-foreground",
                    "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                    checkIsActive(pathname, subItem) && [
                      "bg-primary/10 text-primary font-medium",
                      "before:absolute before:-left-4 before:top-0 before:h-full before:w-0.5 before:bg-primary"
                    ]
                  )}
                >
                  <Link href={subItem.url} onClick={() => setOpenMobile(false)} className="flex items-center gap-2.5 w-full">
                    {subItem.icon && (
                      <subItem.icon className={cn(
                        "h-3.5 w-3.5 shrink-0 transition-colors",
                        checkIsActive(pathname, subItem) ? "text-primary" : "text-muted-foreground"
                      )} />
                    )}
                    <span className="truncate text-sm">{subItem.title}</span>
                    {subItem.badge && <NavBadge variant="outline" size="sm">{subItem.badge}</NavBadge>}
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  )
}

interface NavBadgeProps {
  children: React.ReactNode
  variant?: "default" | "secondary" | "outline"
  size?: "default" | "sm"
}

const NavBadge = ({ children, variant = "default", size = "default" }: NavBadgeProps) => (
  <Badge 
    variant={variant}
    className={cn(
      "shrink-0 font-medium transition-colors",
      size === "sm" 
        ? "h-4 px-1.5 text-xs" 
        : "h-5 px-2 text-xs",
      variant === "secondary" && "bg-muted/80 text-muted-foreground hover:bg-muted",
      variant === "outline" && "border-border/60"
    )}
  >
    {children}
  </Badge>
)

function checkIsActive(pathname: string, item: NavItemType, mainNav = false) {
  return (
    pathname === item.url ||
    pathname.split('?')[0] === item.url ||
    !!item?.items?.filter((i) => i.url === pathname).length ||
    (mainNav &&
      pathname.split('/')[1] !== '' &&
      pathname.split('/')[1] === item?.url?.split('/')[1])
  )
}