"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BarChart3, Users, BookOpen, Eye, Flag, TrendingUp, TrendingDown, Download } from "lucide-react"
import { useData } from "@/hooks/useData"

export function PlatformStats() {
  const { data } = useData()
  const mockStats = data.platformStats
  const [dateRange, setDateRange] = useState("30days")
  const [chartType, setChartType] = useState("overview")

  const statCards = [
    {
      title: "Total Users",
      value: mockStats.overview.totalUsers.toLocaleString(),
      change: mockStats.trends.userGrowth,
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Active Stories",
      value: mockStats.overview.totalStories.toLocaleString(),
      change: mockStats.trends.storyGrowth,
      icon: BookOpen,
      color: "text-green-600",
    },
    {
      title: "Total Reads",
      value: mockStats.overview.totalReads.toLocaleString(),
      change: mockStats.trends.readGrowth,
      icon: Eye,
      color: "text-purple-600",
    },
    {
      title: "Reports",
      value: mockStats.overview.totalReports.toLocaleString(),
      change: mockStats.trends.reportGrowth,
      icon: Flag,
      color: "text-red-600",
    },
  ]

  const exportData = () => {
    console.log("Exporting statistics data...")
    alert("Statistics exported successfully!")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Platform Statistics</h2>
          <p className="text-gray-600">Comprehensive platform analytics and metrics</p>
        </div>
        <Button onClick={exportData} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Data
        </Button>
      </div>

      <div className="flex gap-4">
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">Last 7 Days</SelectItem>
            <SelectItem value="30days">Last 30 Days</SelectItem>
            <SelectItem value="90days">Last 90 Days</SelectItem>
            <SelectItem value="1year">Last Year</SelectItem>
          </SelectContent>
        </Select>

        <Select value={chartType} onValueChange={setChartType}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="overview">Overview</SelectItem>
            <SelectItem value="users">User Analytics</SelectItem>
            <SelectItem value="content">Content Analytics</SelectItem>
            <SelectItem value="engagement">Engagement</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          const isPositive = stat.change.startsWith("+")
          const TrendIcon = isPositive ? TrendingUp : TrendingDown

          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendIcon className={`h-3 w-3 ${isPositive ? "text-green-600" : "text-red-600"}`} />
                      <span className={`text-sm ${isPositive ? "text-green-600" : "text-red-600"}`}>
                        {stat.change} from last month
                      </span>
                    </div>
                  </div>
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Growth Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockStats.monthlyData.map((data, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">{data.month}</span>
                  <div className="flex gap-4 text-sm">
                    <span className="text-blue-600">{data.users} users</span>
                    <span className="text-green-600">{data.stories} stories</span>
                    <span className="text-purple-600">{data.reads.toLocaleString()} reads</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Performing Content</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Dragon's Quest Adventure</p>
                  <p className="text-sm text-gray-600">Fantasy • by @author_mike</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">12.5K reads</p>
                  <Badge className="bg-green-100 text-green-800">Trending</Badge>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Magic Kingdom Chronicles</p>
                  <p className="text-sm text-gray-600">Adventure • by @story_master</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">9.8K reads</p>
                  <Badge className="bg-blue-100 text-blue-800">Popular</Badge>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Cyber Future Tales</p>
                  <p className="text-sm text-gray-600">Sci-Fi • by @future_writer</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">8.2K reads</p>
                  <Badge className="bg-purple-100 text-purple-800">Rising</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Daily Active Users</span>
                <span className="font-medium">8,921</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Weekly Active Users</span>
                <span className="font-medium">11,234</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Monthly Active Users</span>
                <span className="font-medium">12,543</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Average Session Time</span>
                <span className="font-medium">24 min</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Content Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Stories Published</span>
                <span className="font-medium">4,567</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Average Story Length</span>
                <span className="font-medium">2,340 words</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Comments per Story</span>
                <span className="font-medium">12.3</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Stories per Author</span>
                <span className="font-medium">3.7</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Moderation Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Reports</span>
                <span className="font-medium">234</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Resolved Reports</span>
                <span className="font-medium">198</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Pending Reports</span>
                <span className="font-medium">36</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Response Time</span>
                <span className="font-medium">2.4 hours</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
