"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, ActivityIcon, MessageCircle, BookOpen, Flag } from "lucide-react"

const activityIcons: Record<string, React.ElementType> = {
  login: ActivityIcon,
  story_post: BookOpen,
  comment: MessageCircle,
  report: Flag,
}

export function UserActivity({ selectedUserId }: { selectedUserId?: string }) {
  const searchParams = useSearchParams()
  const [users, setUsers] = useState<any[]>([])
  const [activities, setActivities] = useState<any[]>([])
  const [selectedUser, setSelectedUser] = useState<string>(selectedUserId || "")
  const [userSearch, setUserSearch] = useState("")
  const [viewMode, setViewMode] = useState("timeline")

  useEffect(() => {
    const userIdFromQuery = searchParams.get("userId")
    if (userIdFromQuery) setSelectedUser(userIdFromQuery)
  }, [searchParams])

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:555/api/admin/users/")
        const data = await res.json()
        setUsers(data.users || [])
      } catch (err) {
        console.error("Failed to fetch users:", err)
      }
    }
    fetchUsers()
  }, [])

  useEffect(() => {
    const fetchActivities = async () => {
      if (!selectedUser) return
      try {
        const res = await fetch(`http://localhost:555/api/admin/userActivity?userId=${selectedUser}`)
        const data = await res.json()
        setActivities(data.activities || [])
      } catch (err) {
        console.error("Failed to fetch user activities:", err)
      }
    }
    fetchActivities()
  }, [selectedUser])

  const filteredUsers = users.filter((u) =>
    `${u.name} ${u.email}`.toLowerCase().includes(userSearch.toLowerCase())
  )

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
              <div className="relative">
                <Input
                  placeholder="Search by name or email..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                />
                <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
              {userSearch && (
                <div className="mt-1 max-h-40 overflow-auto border rounded-md bg-white shadow-sm z-10">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <div
                        key={user._id}
                        onClick={() => {
                          setSelectedUser(user._id.toString())
                          setUserSearch(`${user.name} (${user.email})`)
                        }}
                        className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${
                          selectedUser === user._id.toString() ? "bg-gray-200" : ""
                        }`}
                      >
                        {user.name} ({user.email})
                      </div>
                    ))
                  ) : (
                    <p className="px-4 py-2 text-sm text-gray-500">No activity available for this user.</p>
                  )}
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="view">View Mode</Label>
              <Select value={viewMode} onValueChange={setViewMode}>
                <SelectTrigger>
                  <SelectValue placeholder="Select view" />
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
                <Input placeholder="Search activities..." className="pl-10" disabled />
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
                – {users.find((u) => u._id === selectedUser)?.name}
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
                  <div key={activity._id} className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className="p-2 rounded-full bg-gray-100">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{activity.description}</p>
                      <p className="text-sm text-gray-600">{new Date(activity.timestamp).toLocaleString()}</p>
                    </div>
                    <Badge className={getActivityTypeColor(activity.type)}>
                      {activity.type.replace("_", " ")}
                    </Badge>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Type</th>
                    <th className="text-left py-3 px-4">Description</th>
                    <th className="text-left py-3 px-4">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {activities.map((activity) => (
                    <tr key={activity._id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <Badge className={getActivityTypeColor(activity.type)}>
                          {activity.type.replace("_", " ")}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">{activity.description}</td>
                      <td className="py-3 px-4 text-gray-600">
                        {new Date(activity.timestamp).toLocaleString()}
                      </td>
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