"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Send, UserSearch } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type User = {
  _id: string
  email: string
  name: string
  role: "User" | "Author" | "Admin"
}

type WarningTemplate = {
  id: string
  title: string
  content: string
}

type SentWarning = {
  _id: string
  userId: string
  userName: string
  templateId: string
  customContent: string
  sentAt: string
  sentBy: string
}

const API_BASE = "http://localhost:555/api/admin"

export function SendWarnings() {
  const [users, setUsers] = useState<User[]>([])
  const [warningTemplates, setWarningTemplates] = useState<WarningTemplate[]>([])
  const [sentWarnings, setSentWarnings] = useState<SentWarning[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [warningContent, setWarningContent] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState("")
  const [userSearch, setUserSearch] = useState("")

  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 10
  const totalPages = Math.ceil(sentWarnings.length / ITEMS_PER_PAGE)
  const currentWarnings = sentWarnings
    .slice()
    .reverse()
    .slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const handlePrevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1)
  const handleNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1)

  const filteredUsers = users.filter((u) =>
    `${u.name} ${u.email}`.toLowerCase().includes(userSearch.toLowerCase())
  )

  useEffect(() => {
    async function fetchData() {
      try {
        const [usersRes, templatesRes, sentRes] = await Promise.all([
          fetch(`${API_BASE}/users/`).then(res => res.json()),
          fetch(`${API_BASE}/warningTemplates/`).then(res => res.json()),
          fetch(`${API_BASE}/getSentWarning/`).then(res => res.json())
        ])

        if (usersRes.success && templatesRes.success && sentRes.success) {
          setUsers(usersRes.users as User[])
          setWarningTemplates(templatesRes.template as WarningTemplate[])
          setSentWarnings(sentRes.sentWarning as SentWarning[])
        } else {
          alert("Failed to fetch data from server.")
        }
      } catch (err) {
        console.error("Error fetching data:", err)
        alert("Error connecting to server.")
      }
    }

    fetchData()
  }, [])

  const handleTemplateSelect = (templateId: string) => {
    const template = warningTemplates.find((t) => t.id === templateId)
    if (template) {
      setWarningContent(template.content)
      setSelectedTemplate(templateId)
    }
  }

  const handleSendWarning = async () => {
    if (!selectedUser || !warningContent) {
      alert("Please select a user and enter warning content")
      return
    }

    const payload = {
      userId: selectedUser._id,
      templateId: selectedTemplate || "custom",
      customContent: warningContent,
      sentBy: "admin01@example.com"
    }

    try {
      const res = await fetch(`${API_BASE}/sentWarning/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })

      const data = await res.json()
      if (data.success) {
        alert(`Warning sent to ${selectedUser.name}`)
        setSentWarnings((prev) => [...prev, data.warning as SentWarning])
        setSelectedUser(null)
        setWarningContent("")
        setSelectedTemplate("")
        setUserSearch("")
        setCurrentPage(1)
      } else {
        alert("Failed to send warning: " + data.message)
      }
    } catch (err) {
      console.error("Error sending warning:", err)
      alert("Server error")
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Send Warnings</h2>
        <p className="text-gray-600">Send formal warnings to users for policy violations</p>
      </div>

      {/* Warning Form + Templates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* === Send Warning === */}
        <Card className="bg-orange-50 border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <AlertTriangle className="h-5 w-5" />
              Send Warning
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>User</Label>
              <div className="relative">
                <Input
                  placeholder="Search by name or email..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                />
                <UserSearch className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
              {userSearch && (
                <div className="mt-1 max-h-40 overflow-auto border rounded-md bg-white shadow-sm">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <div
                        key={user._id}
                        onClick={() => {
                          setSelectedUser(user)
                          setUserSearch(`${user.name} (${user.email})`)
                        }}
                        className={cn(
                          "px-4 py-2 hover:bg-orange-100 cursor-pointer",
                          selectedUser?._id === user._id && "bg-orange-200"
                        )}
                      >
                        {user.name} ({user.email})
                      </div>
                    ))
                  ) : (
                    <p className="px-4 py-2 text-sm text-gray-500">No match found.</p>
                  )}
                </div>
              )}
            </div>

            <div>
              <Label>Warning Template (Optional)</Label>
              <select
                className="w-full border px-3 py-2 rounded-md"
                value={selectedTemplate}
                onChange={(e) => handleTemplateSelect(e.target.value)}
              >
                <option value="">Choose template</option>
                {warningTemplates.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label>Warning Content</Label>
              <Textarea
                placeholder="Enter the warning message..."
                value={warningContent}
                onChange={(e) => setWarningContent(e.target.value)}
                rows={6}
              />
            </div>

            <Button onClick={handleSendWarning} className="w-full">
              <Send className="h-4 w-4 mr-2" />
              Send Warning
            </Button>
          </CardContent>
        </Card>

        {/* === Templates === */}
        <Card className="bg-sky-50 border-sky-200">
          <CardHeader>
            <CardTitle className="text-sky-800">Warning Templates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {warningTemplates.map((template) => (
              <div key={template.id} className="p-4 border rounded-lg bg-white">
                <h4 className="font-medium text-gray-900 mb-2">{template.title}</h4>
                <p className="text-sm text-gray-600 mb-3">{template.content}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleTemplateSelect(template.id)}
                >
                  Use Template
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* === Recent Warnings === */}
      <Card className="bg-green-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-green-800">Recent Warnings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {currentWarnings.length === 0 ? (
              <p className="text-gray-500">No warnings sent yet.</p>
            ) : (
              currentWarnings.map((w) => (
                <div
                  key={w._id}
                  className="flex items-center justify-between p-3 bg-green-100 rounded-lg"
                >
                  <div>
                    <p className="font-medium">Warning sent to {w.userName}</p>
                    <p className="text-sm text-gray-700">
                      {w.customContent} – {new Date(w.sentAt).toLocaleString()}
                    </p>
                  </div>
                  <Badge className="bg-green-600 text-white">Sent</Badge>
                </div>
              ))
            )}
          </div>

          {totalPages > 1 && (
            <div className="mt-4 flex justify-between items-center">
              <Button variant="outline" onClick={handlePrevPage} disabled={currentPage === 1}>
                Previous
              </Button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
