"use client"

import { Badge } from "@/components/ui/badge"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle, Send } from "lucide-react"
import { useData } from "@/hooks/useData"

export function SendWarnings() {
  const { data, addWarning } = useData()
  const mockUsers = data.users
  const warningTemplates = data.warningTemplates
  const [selectedUser, setSelectedUser] = useState("")
  const [warningContent, setWarningContent] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState("")

  const handleTemplateSelect = (templateId: string) => {
    const template = warningTemplates.find((t) => t.id === templateId)
    if (template) {
      setWarningContent(template.content)
      setSelectedTemplate(templateId)
    }
  }

  const handleSendWarning = () => {
    if (!selectedUser || !warningContent) {
      alert("Please select a user and enter warning content")
      return
    }

    const user = mockUsers.find((u) => u.id.toString() === selectedUser)
    const newWarning = {
      userId: Number.parseInt(selectedUser),
      userName: user?.name || "",
      templateId: selectedTemplate || "custom",
      customContent: warningContent,
      sentAt: new Date().toISOString().replace("T", " ").substring(0, 19),
      sentBy: "admin",
    }

    addWarning(newWarning)
    console.log("Sending warning to:", user?.name, "Content:", warningContent)
    alert(`Warning sent to ${user?.name}`)

    // Reset form
    setSelectedUser("")
    setWarningContent("")
    setSelectedTemplate("")
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Send Warnings</h2>
        <p className="text-gray-600">Send formal warnings to users for policy violations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              Send Warning
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="user">Select User</Label>
              <Select value={selectedUser} onValueChange={setSelectedUser}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a user to warn" />
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
              <Label htmlFor="template">Warning Template (Optional)</Label>
              <Select value={selectedTemplate} onValueChange={handleTemplateSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a template or write custom" />
                </SelectTrigger>
                <SelectContent>
                  {warningTemplates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="content">Warning Content</Label>
              <Textarea
                id="content"
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

        <Card>
          <CardHeader>
            <CardTitle>Warning Templates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {warningTemplates.map((template) => (
                <div key={template.id} className="p-4 border rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">{template.title}</h4>
                  <p className="text-sm text-gray-600 mb-3">{template.content}</p>
                  <Button variant="outline" size="sm" onClick={() => handleTemplateSelect(template.id)}>
                    Use Template
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Warnings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div>
                <p className="font-medium">Warning sent to John Doe</p>
                <p className="text-sm text-gray-600">Spam Content - 2 hours ago</p>
              </div>
              <Badge className="bg-yellow-100 text-yellow-800">Sent</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div>
                <p className="font-medium">Warning sent to Mike Johnson</p>
                <p className="text-sm text-gray-600">Inappropriate Content - 1 day ago</p>
              </div>
              <Badge className="bg-yellow-100 text-yellow-800">Sent</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
