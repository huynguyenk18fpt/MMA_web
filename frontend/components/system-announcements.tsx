"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Megaphone, Send, Users, BookOpen } from "lucide-react"

const iconMap: Record<string, React.ElementType> = {
  all: Users,
  authors: BookOpen,
  user: Users,
}

export function SystemAnnouncements() {
  const [recipientGroups, setRecipientGroups] = useState<any[]>([])
  const [announcements, setAnnouncements] = useState<any[]>([])
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([])
  const [priority, setPriority] = useState("normal")

  useEffect(() => {
    fetchAnnouncements()
    fetchRecipientGroups()
  }, [])

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch("http://localhost:555/api/admin/announcement/")
      const data = await res.json()
      setAnnouncements(data.announcements || [])
    } catch (err) {
      console.error("Failed to fetch announcements", err)
    }
  }

  const fetchRecipientGroups = async () => {
    try {
      const res = await fetch(
        "http://localhost:555/api/admin/announcement/recipient-groups/"
      )
      const data = await res.json()
      setRecipientGroups(data.groups || [])
    } catch (err) {
      console.error("Failed to fetch recipient groups", err)
    }
  }

  const handleRecipientToggle = (groupId: string) => {
    setSelectedRecipients((prev) =>
      prev.includes(groupId)
        ? prev.filter((id) => id !== groupId)
        : [...prev, groupId]
    )
  }

  const handleSendAnnouncement = async () => {
    if (!title || !content || selectedRecipients.length === 0) {
      alert("Please fill in all fields and select recipients")
      return
    }

    const recipientLabels = selectedRecipients
      .map((id) => recipientGroups.find((g) => g.id === id)?.label)
      .join(", ")

    const newAnnouncement = {
      title,
      content,
      recipients: recipientLabels,
      recipientGroups: selectedRecipients,
      status: "Sent",
      priority,
      sentAt: new Date().toISOString(),
      readCount: 0,
      createdBy: "admin01@example.com",
    }

    try {
      const res = await fetch("http://localhost:555/api/admin/announcement/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAnnouncement),
      })

      if (!res.ok) throw new Error("Failed to send announcement")

      await fetchAnnouncements()
      alert("Announcement sent successfully!")

      // Reset form
      setTitle("")
      setContent("")
      setSelectedRecipients([])
      setPriority("normal")
    } catch (err) {
      console.error(err)
      alert("Error sending announcement")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Sent":
        return "bg-green-100 text-green-800"
      case "Draft":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">System Announcements</h2>
        <p className="text-gray-600">Send important notifications to users</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Megaphone className="h-5 w-5 text-blue-600" />
              Create Announcement
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Announcement Title</Label>
              <Input
                id="title"
                placeholder="Enter announcement title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                placeholder="Enter announcement content..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
              />
            </div>

            <div>
              <Label>Recipients</Label>
              <div className="space-y-3 mt-2">
                {recipientGroups.map((group) => {
                  const Icon = iconMap[group.id] ?? Users
                  return (
                    <div key={group.id} className="flex items-center space-x-3">
                      <Checkbox
                        id={group.id}
                        checked={selectedRecipients.includes(group.id)}
                        onCheckedChange={() => handleRecipientToggle(group.id)}
                      />
                      <label htmlFor={group.id} className="flex items-center gap-2 cursor-pointer">
                        <Icon className="h-4 w-4" />
                        <span>{group.label}</span>
                        <Badge variant="outline" className="text-xs">
                          {group.count?.toLocaleString() ?? 0}
                        </Badge>
                      </label>
                    </div>
                  )
                })}
              </div>
            </div>

            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low Priority</SelectItem>
                  <SelectItem value="normal">Normal Priority</SelectItem>
                  <SelectItem value="high">High Priority</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleSendAnnouncement} className="w-full">
              <Send className="h-4 w-4 mr-2" />
              Send Announcement
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recipient Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recipientGroups.map((group) => {
                const Icon = iconMap[group.id] ?? Users
                const isSelected = selectedRecipients.includes(group.id)
                return (
                  <div
                    key={group.id}
                    className={`p-4 border rounded-lg ${isSelected ? "bg-blue-50 border-blue-200" : ""}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Icon className="h-5 w-5" />
                        <div>
                          <p className="font-medium">{group.label}</p>
                          <p className="text-sm text-gray-600">
                            {group.count?.toLocaleString() ?? 0} users
                          </p>
                        </div>
                      </div>
                      {isSelected && (
                        <Badge className="bg-blue-100 text-blue-800">Selected</Badge>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Announcements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Title</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Recipients</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Sent At</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Read Count</th>
                </tr>
              </thead>
              <tbody>
                {announcements.length > 0 ? (
                  announcements.map((announcement) => (
                    <tr key={announcement._id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium">{announcement.title}</p>
                          <p className="text-sm text-gray-600 truncate max-w-xs">
                            {announcement.content}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{announcement.recipients}</td>
                      <td className="py-3 px-4">
                        <Badge className={getStatusColor(announcement.status)}>
                          {announcement.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {announcement.sentAt
                          ? new Date(announcement.sentAt).toLocaleString()
                          : "Not sent"}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {announcement.readCount?.toLocaleString() ?? 0}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-4 text-center text-gray-500">
                      No announcements found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
