"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ChevronsUpDown, Plus, Settings } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Organization } from "better-auth/plugins"
import { Skeleton } from "@/components/ui/skeleton"
import { authClient } from "@/lib/auth-client"

interface OrganizationSwitcherProps {
  organizations: Organization[];
  isLoading?: boolean;
}

export function OrganizationSwitcher({
  organizations,
  isLoading = false,
}: OrganizationSwitcherProps) {
  const router = useRouter()
  const { isMobile } = useSidebar()

  const { data: activeOrganization } = authClient.useActiveOrganization()

  if (isLoading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg">
            <Skeleton className="size-8 rounded-lg" />
            <Skeleton className="h-8 w-24" />
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  if (!activeOrganization) {
    return null
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                {activeOrganization.logo && (
                  <Image 
                    src={activeOrganization.logo} 
                    alt={`${activeOrganization.name} logo`} 
                    width={16}
                    height={16}
                    className="size-4" 
                  />
                )}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{activeOrganization.name}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Teams
            </DropdownMenuLabel>
            {organizations.map((organization, index) => (
              <DropdownMenuItem
                key={organization.name}
                onClick={() => authClient.organization.setActive({ organizationId: organization.id })}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-md border">
                  {organization.logo && (
                    <Image 
                      src={organization.logo} 
                      alt={`${organization.name} logo`} 
                      width={14}
                      height={14}
                      className="size-3.5 shrink-0" 
                    />
                  )}
                </div>
                {organization.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="gap-2 p-2"
              onClick={() => router.push(`/organization/settings`)}
            >
              <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <Settings className="size-4" />
              </div>
              <div className="text-muted-foreground font-medium">Organization settings</div>
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="gap-2 p-2"
              onClick={() => router.push("/organization/new")}
            >
              <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <Plus className="size-4" />
              </div>
              <div className="text-muted-foreground font-medium">Add organization</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}