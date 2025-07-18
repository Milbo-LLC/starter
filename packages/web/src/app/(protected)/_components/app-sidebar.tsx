"use client"

import * as React from "react"
import {
  Frame,
  Map,
  PieChart,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "./nav-main"
import { NavProjects } from "./nav-projects"
import { NavUser } from "./nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

import { ComponentProps } from "react"
import { User } from "better-auth"
import { authClient } from "@/lib/auth-client"
import { OrganizationSwitcher } from "./organization-switcher"

const data = {
  navMain: [
    {
      title: "Example",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Example 1",
          url: "#",
        },
        {
          title: "Example 2",
          url: "#",
        },
        {
          title: "Example 3",
          url: "#",
        },
      ],
    },
  ],
  otherMenu: [
    {
      name: "Project 1",
      url: "#",
      icon: Frame,
    },
    {
      name: "Project 2",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Project 3",
      url: "#",
      icon: Map,
    },
  ],
}

interface AppSidebarProps extends ComponentProps<typeof Sidebar> {
  user: User;
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  const { data: organizations, isPending } = authClient.useListOrganizations();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <OrganizationSwitcher organizations={organizations ?? []} isLoading={isPending} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.otherMenu} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
