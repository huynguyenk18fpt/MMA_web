"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Users, UserX, AlertTriangle, Activity, UserCog, Megaphone,
  BarChart3, Settings, LogOut, BookOpen, Shield, Flag, FileText, Tags
} from "lucide-react"

import { UserManagement } from "@/components/user-management"
import { BanUnbanUsers } from "@/components/ban-unban-users"
import { SendWarnings } from "@/components/send-warnings"
import { UserActivity } from "@/components/user-activity"
import { SystemAnnouncements } from "@/components/system-announcements"
import { PlatformStats } from "@/components/platform-stats"
import { ProfileSettings } from "@/components/profile-settings"
import { ReportManagement } from "@/components/report-management"
import { ContentModeration } from "@/components/content-moderation"
import { GenreManagement } from "@/components/genre-management"
import { useData } from "@/hooks/useData"

interface AdminDashboardProps {
  currentUser: any
  onLogout: () => void
}

export function AdminDashboard({ currentUser, onLogout }: AdminDashboardProps) {
  const [activeView, setActiveView] = useState("dashboard")
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)

  const handleViewUserActivity = (userId: string) => {
    setSelectedUserId(userId)
    setActiveView("activity")
  }

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "users", label: "View Users", icon: Users },
    { id: "reports", label: "Reports", icon: Flag },
    { id: "content", label: "Content Management", icon: FileText },
    { id: "ban", label: "Ban/Unban", icon: UserX },
    { id: "warnings", label: "Send Warnings", icon: AlertTriangle },
    { id: "activity", label: "User Activity", icon: Activity },
    { id: "genres", label: "Genre Management", icon: Tags },
    { id: "announcements", label: "Announcements", icon: Megaphone },
    { id: "stats", label: "Statistics", icon: BarChart3 },
    { id: "profile", label: "Profile", icon: Settings },
  ]

  const renderContent = () => {
    switch (activeView) {
      case "users":
        return <UserManagement onViewActivity={handleViewUserActivity} />
      case "reports":
        return <ReportManagement />
      case "content":
        return <ContentModeration />
      case "ban":
        return <BanUnbanUsers />
      case "warnings":
        return <SendWarnings />
      case "activity":
        return <UserActivity selectedUserId={selectedUserId ?? undefined} />
      case "genres":
        return <GenreManagement />
      case "announcements":
        return <SystemAnnouncements />
      case "stats":
        return <PlatformStats />
      case "profile":
        return <ProfileSettings currentUser={currentUser} />
      default:
        return <DashboardOverview />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-indigo-600" />
            <Shield className="h-8 w-8 text-indigo-600" />
            <h1 className="text-xl font-bold text-gray-900">Manga&Words Admin</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Welcome, {currentUser?.name}</span>
            <Button variant="outline" size="sm" onClick={onLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className="w-64 bg-white shadow-sm min-h-screen">
          <nav className="p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon
                return (
                  <li key={item.id}>
                    <Button
                      variant={activeView === item.id ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveView(item.id)}
                    >
                      <Icon className="h-4 w-4 mr-3" />
                      {item.label}
                    </Button>
                  </li>
                )
              })}
            </ul>
          </nav>
        </aside>
        <main className="flex-1 p-6">{renderContent()}</main>
      </div>
    </div>
  )
}

function DashboardOverview() {
  const { data } = useData()
  const stats = [
    {
      title: "Total Users",
      value: data.platformStats.overview.totalUsers.toLocaleString(),
      change: data.platformStats.trends.userGrowth,
      icon: Users,
    },
    {
      title: "Active Stories",
      value: data.platformStats.overview.totalStories.toLocaleString(),
      change: data.platformStats.trends.storyGrowth,
      icon: BookOpen,
    },
    {
      title: "Reports Today",
      value: data.platformStats.overview.totalReports.toString(),
      change: data.platformStats.trends.reportGrowth,
      icon: AlertTriangle,
    },
    {
      title: "Banned Users",
      value: data.platformStats.overview.bannedUsers.toString(),
      change: "+2%",
      icon: UserX,
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
        <p className="text-gray-600">Welcome to the Manga&Words admin panel</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-green-600">{stat.change} from last month</p>
                  </div>
                  <Icon className="h-8 w-8 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
