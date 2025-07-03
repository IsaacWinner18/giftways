"use client"

import { useAuth } from "@/lib/auth-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { Gift, LayoutDashboard, Plus, BarChart3, Settings, LogOut, User, Crown, ChevronUp } from "lucide-react"

interface AppSidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

const navigation = [
  {
    title: "Overview",
    items: [
      {
        title: "Dashboard",
        icon: LayoutDashboard,
        key: "dashboard",
      },
      {
        title: "Create Campaign",
        icon: Plus,
        key: "create",
      },
    ],
  },
  {
    title: "Analytics",
    items: [
      {
        title: "Performance",
        icon: BarChart3,
        key: "analytics",
      },
    ],
  },
  {
    title: "Account",
    items: [
      {
        title: "Settings",
        icon: Settings,
        key: "settings",
      },
    ],
  },
]

export function AppSidebar({ activeTab, setActiveTab }: AppSidebarProps) {
  const { user, logout } = useAuth()

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarHeader>
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center shadow-lg">
            <Gift className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Giftways
            </span>
            <span className="text-xs text-gray-500">Creator Studio</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {navigation.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {group.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.key}>
                    <SidebarMenuButton
                      onClick={() => setActiveTab(item.key)}
                      isActive={activeTab === item.key}
                      className={`w-full justify-start transition-all duration-200 ${
                        activeTab === item.key
                          ? "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-r-2 border-purple-500"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
                    <AvatarFallback className="rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                      {user?.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <div className="flex items-center gap-2">
                      <span className="truncate font-semibold">{user?.name}</span>
                      {user?.isVerified && <Crown className="w-3 h-3 text-yellow-500" />}
                    </div>
                    <span className="truncate text-xs text-gray-500">{user?.email}</span>
                  </div>
                  <ChevronUp className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
                      <AvatarFallback className="rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                        {user?.name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <div className="flex items-center gap-2">
                        <span className="truncate font-semibold">{user?.name}</span>
                        {user?.isVerified && (
                          <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">
                            Pro
                          </Badge>
                        )}
                      </div>
                      <span className="truncate text-xs text-gray-500">{user?.email}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setActiveTab("settings")}>
                  <User className="w-4 h-4 mr-2" />
                  Account Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-red-600">
                  <LogOut className="w-4 h-4 mr-2" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
