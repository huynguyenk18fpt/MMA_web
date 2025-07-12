"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Edit, Eye, Flag, CheckCircle, XCircle, AlertTriangle } from "lucide-react"

export function ContentModeration() {
  const [content, setContent] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedContent, setSelectedContent] = useState<any>(null)
  const [moderationAction, setModerationAction] = useState("")
  const [moderationNote, setModerationNote] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch("http://localhost:555/api/admin/content/")
        const json = await res.json()
        if (json.success) {
          setContent(json.data)
        } else {
          console.error("Failed to load content:", json.message)
        }
      } catch (error) {
        console.error("Error fetching content:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchContent()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "flagged":
        return "bg-red-100 text-red-800"
      case "reported":
        return "bg-yellow-100 text-yellow-800"
      case "under_review":
        return "bg-blue-100 text-blue-800"
      case "approved":
        return "bg-green-100 text-green-800"
      case "removed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "flagged":
        return <Flag className="h-4 w-4" />
      case "reported":
        return <AlertTriangle className="h-4 w-4" />
      case "under_review":
        return <Eye className="h-4 w-4" />
      case "approved":
        return <CheckCircle className="h-4 w-4" />
      case "removed":
        return <XCircle className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const handleModerationAction = async () => {
    if (!selectedContent || !moderationAction) return

    let newStatus = selectedContent.status
    switch (moderationAction) {
      case "approve":
        newStatus = "approved"
        break
      case "remove":
        newStatus = "removed"
        break
      case "edit":
        newStatus = "under_review"
        break
      case "flag":
        newStatus = "flagged"
        break
    }

    try {
      const res = await fetch(`http://localhost:555/api/admin/content/${selectedContent._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          moderationNote: moderationNote || ""
        })
      })

      const json = await res.json()

      if (json.success) {
        setContent((prev) =>
          prev.map((item) =>
            item._id === selectedContent._id
              ? { ...item, status: newStatus, moderationNote }
              : item
          )
        )
        alert(`Content ${moderationAction}d successfully`)
      } else {
        alert("Failed to update content: " + json.message)
      }
    } catch (error) {
      console.error("Error updating content:", error)
      alert("Error updating content")
    }

    setIsDialogOpen(false)
    setModerationAction("")
    setModerationNote("")
    setSelectedContent(null)
  }

  const filteredContent = content.filter((item: any) => {
    if (activeTab === "all") return true
    return item.status === activeTab
  })

  const contentStats = {
    total: content.length,
    flagged: content.filter((c: any) => c.status === "flagged").length,
    reported: content.filter((c: any) => c.status === "reported").length,
    under_review: content.filter((c: any) => c.status === "under_review").length,
    removed: content.filter((c: any) => c.status === "removed").length,
  }

  if (loading) return <p className="text-center text-gray-500">Loading content...</p>

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Content Moderation</h2>
        <p className="text-gray-600">Edit and delete violating content</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card><CardContent className="p-4"><div className="flex items-center gap-2"><FileText className="h-5 w-5 text-blue-600" /><div><p className="text-sm text-gray-600">Total Content</p><p className="text-2xl font-bold">{contentStats.total}</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-2"><Flag className="h-5 w-5 text-red-600" /><div><p className="text-sm text-gray-600">Flagged</p><p className="text-2xl font-bold">{contentStats.flagged}</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-yellow-600" /><div><p className="text-sm text-gray-600">Reported</p><p className="text-2xl font-bold">{contentStats.reported}</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-2"><Eye className="h-5 w-5 text-blue-600" /><div><p className="text-sm text-gray-600">Under Review</p><p className="text-2xl font-bold">{contentStats.under_review}</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-2"><XCircle className="h-5 w-5 text-gray-600" /><div><p className="text-sm text-gray-600">Removed</p><p className="text-2xl font-bold">{contentStats.removed}</p></div></div></CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Content Management</CardTitle>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="flagged">Flagged</TabsTrigger>
              <TabsTrigger value="reported">Reported</TabsTrigger>
              <TabsTrigger value="under_review">Under Review</TabsTrigger>
              <TabsTrigger value="removed">Removed</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Content</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Type</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Author</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Reason</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Reports</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredContent.map((item: any) => (
                  <tr key={item._id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-gray-600 truncate max-w-xs">{item.content}</p>
                        {item.type === "story" && (
                          <div className="flex gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">{item.genre}</Badge>
                            <Badge variant="outline" className="text-xs">{item.wordCount} words</Badge>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4"><Badge variant="outline">{item.type}</Badge></td>
                    <td className="py-3 px-4 text-gray-600">@{item.author}</td>
                    <td className="py-3 px-4"><Badge variant="outline">{item.reason}</Badge></td>
                    <td className="py-3 px-4"><Badge className="bg-red-100 text-red-800">{item.reportCount}</Badge></td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(item.status)}
                        <Badge className={getStatusColor(item.status)}>{item.status.replace("_", " ")}</Badge>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Dialog open={isDialogOpen && selectedContent?._id === item._id} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setSelectedContent(item)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Moderate
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                          <DialogHeader>
                            <DialogTitle>Moderate Content: {selectedContent?.title}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm font-medium text-gray-600">Author</p>
                                <p>@{selectedContent?.author}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-600">Type</p>
                                <Badge variant="outline">{selectedContent?.type}</Badge>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-600">Violation Reason</p>
                                <Badge variant="outline">{selectedContent?.reason}</Badge>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-600">Report Count</p>
                                <Badge className="bg-red-100 text-red-800">{selectedContent?.reportCount}</Badge>
                              </div>
                            </div>

                            <div>
                              <p className="text-sm font-medium text-gray-600 mb-2">Content Preview</p>
                              <div className="p-4 bg-gray-50 rounded-lg max-h-40 overflow-y-auto">
                                <p>{selectedContent?.content}</p>
                              </div>
                            </div>

                            <div>
                              <Label htmlFor="action">Moderation Action</Label>
                              <Select value={moderationAction} onValueChange={setModerationAction}>
                                <SelectTrigger><SelectValue placeholder="Select action" /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="approve">Approve Content</SelectItem>
                                  <SelectItem value="edit">Request Edit</SelectItem>
                                  <SelectItem value="remove">Remove Content</SelectItem>
                                  <SelectItem value="flag">Flag for Review</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <Label htmlFor="note">Moderation Note</Label>
                              <Textarea
                                id="note"
                                placeholder="Enter moderation notes or feedback..."
                                value={moderationNote}
                                onChange={(e) => setModerationNote(e.target.value)}
                                rows={3}
                              />
                            </div>

                            <div className="flex gap-2">
                              <Button onClick={handleModerationAction} className="flex-1">Apply Action</Button>
                              <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">Cancel</Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
