"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search } from "lucide-react"
import { useData } from "@/hooks/useData"
import { ActivityIcon, MessageCircle, BookOpen, Flag } from "lucide-react"

const activityIcons: Record<string, React.ElementType> = {
  login: ActivityIcon,
  story_post: BookOpen,
  comment: MessageCircle,
  report: Flag,
}

export function UserActivity() {
  const { data } = useData()
  const mockUsers = data.users
  const mockActivities = data.userActivities
  const [selectedUser, setSelectedUser] = useState("")
  const [activities, setActivities] = useState(mockActivities)
  const [viewMode, setViewMode] = useState("timeline")

  const handleUserSelect = (userId: string) => {
    setSelectedUser(userId)
    // In real app, fetch activities for selected user
    console.log("Fetching activities for user:", userId)
  }

  const getActivityTypeColor = (type: string) => {
    switch (type) {
      case "login":
        return "bg-green-100 text-green-800"
      case "story_post":
        return "bg-blue-100 text-blue-800"
      case "comment":
        return "bg-purple-100 text-purple-800"
      case "report":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">User Activity</h2>
        <p className="text-gray-600">View detailed user activity history</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activity Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="user">Select User</Label>
              <Select value={selectedUser} onValueChange={handleUserSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a user" />
                </SelectTrigger>
                <SelectContent>
                  {mockUsers.map((user) => (
                    <SelectItem key={user.id} value={user.id.toString()}>
                      {user.name} ({user.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="view">View Mode</Label>
              <Select value={viewMode} onValueChange={setViewMode}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="timeline">Timeline View</SelectItem>
                  <SelectItem value="table">Table View</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="search">Search Activities</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input placeholder="Search activities..." className="pl-10" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Activity History
            {selectedUser && (
              <span className="text-sm font-normal text-gray-600 ml-2">
                - {mockUsers.find((u) => u.id.toString() === selectedUser)?.name}
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {viewMode === "timeline" ? (
            <div className="space-y-4">
              {activities.map((activity) => {
                const Icon = activityIcons[activity.type] ?? ActivityIcon
                return (
                  <div key={activity.id} className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className={`p-2 rounded-full bg-gray-100`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{activity.description}</p>
                      <p className="text-sm text-gray-600">{activity.timestamp}</p>
                    </div>
                    <Badge className={getActivityTypeColor(activity.type)}>{activity.type.replace("_", " ")}</Badge>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Type</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Description</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {activities.map((activity) => (
                    <tr key={activity.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <Badge className={getActivityTypeColor(activity.type)}>{activity.type.replace("_", " ")}</Badge>
                      </td>
                      <td className="py-3 px-4">{activity.description}</td>
                      <td className="py-3 px-4 text-gray-600">{activity.timestamp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
