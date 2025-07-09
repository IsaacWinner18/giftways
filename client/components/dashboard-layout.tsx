"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { DashboardContent } from "@/components/dashboard-content"
import { CreateCampaignContent } from "@/components/create-campaign-content"
import { SettingsContent } from "@/components/settings-content"
import { AnalyticsContent } from "@/components/analytics-content"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

export function DashboardLayout() {
  const [activeTab, setActiveTab] = useState("dashboard")

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardContent />
      case "create":
        return <CreateCampaignContent />
      case "analytics":
        return <AnalyticsContent />
      case "settings":
        return <SettingsContent />
      default:
        return <DashboardContent />
    }
  }

  const getBreadcrumbs = () => {
    switch (activeTab) {
      case "dashboard":
        return "Dashboard"
      case "create":
        return "Create Campaign"
      case "analytics":
        return "Analytics"
      case "settings":
        return "Settings"
      default:
        return "Dashboard"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/30">
      <SidebarProvider>
        <AppSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white/80 backdrop-blur-sm px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/" className="text-purple-600">
                    Giftways
                  </BreadcrumbLink>
                  
                </BreadcrumbItem>

                 <BreadcrumbItem className=" md:hidden">
                  <BreadcrumbLink href="/" className="text-purple-600">
                   Home /
                  </BreadcrumbLink>
                  
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-gray-900 font-medium">{getBreadcrumbs()}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4">{renderContent()}</div>
          {/* Floating Action Button */}
          <div className="fixed bottom-6 right-6 z-50">
            <Button
              onClick={() => setActiveTab("create")}
              size="lg"
              className="h-14 w-14 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus className="w-6 h-6" />
            </Button>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
