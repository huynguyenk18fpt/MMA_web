"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Flag, Eye, MessageSquare, CheckCircle, XCircle, Clock, AlertTriangle } from "lucide-react"
import { useData } from "@/hooks/useData"

const mockReports = [
  {
    id: 1,
    type: "content",
    title: "Inappropriate Content",
    description: "Story contains violent content not suitable for general audience",
    reportedBy: "user123",
    reportedUser: "author_mike",
    contentId: "story_456",
    contentTitle: "Dark Adventure",
    status: "pending",
    priority: "high",
    createdAt: "2024-01-20 14:30:00",
    category: "Violence",
  },
  {
    id: 2,
    type: "user",
    title: "Harassment",
    description: "User is sending inappropriate messages to other users",
    reportedBy: "user456",
    reportedUser: "baduser789",
    contentId: null,
    contentTitle: null,
    status: "investigating",
    priority: "urgent",
    createdAt: "2024-01-20 13:15:00",
    category: "Harassment",
  },
  {
    id: 3,
    type: "spam",
    title: "Spam Content",
    description: "User is posting repetitive promotional content",
    reportedBy: "user789",
    reportedUser: "spammer123",
    contentId: "comment_789",
    contentTitle: "Promotional Comment",
    status: "resolved",
    priority: "medium",
    createdAt: "2024-01-19 16:45:00",
    category: "Spam",
    resolution: "Content removed and user warned",
  },
  {
    id: 4,
    type: "copyright",
    title: "Copyright Violation",
    description: "Story appears to be copied from another source",
    reportedBy: "user101",
    reportedUser: "copycat456",
    contentId: "story_123",
    contentTitle: "Copied Story",
    status: "pending",
    priority: "high",
    createdAt: "2024-01-19 12:20:00",
    category: "Copyright",
  },
]

export function ReportManagement() {
  const { data, updateReport } = useData()
  const [reports, setReports] = useState(data.reports)
  const [selectedReport, setSelectedReport] = useState<any>(null)
  const [response, setResponse] = useState("")
  const [newStatus, setNewStatus] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("all")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "investigating":
        return "bg-blue-100 text-blue-800"
      case "resolved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "investigating":
        return <Eye className="h-4 w-4" />
      case "resolved":
        return <CheckCircle className="h-4 w-4" />
      case "rejected":
        return <XCircle className="h-4 w-4" />
      default:
        return <Flag className="h-4 w-4" />
    }
  }

  const handleUpdateReport = () => {
    if (!selectedReport || !newStatus) return

    updateReport(selectedReport.id, { status: newStatus, resolution: response })
    setReports(data.reports)

    console.log("Updating report:", selectedReport.id, "Status:", newStatus, "Response:", response)
    alert(`Report #${selectedReport.id} updated successfully`)

    setIsDialogOpen(false)
    setResponse("")
    setNewStatus("")
    setSelectedReport(null)
  }

  const filteredReports = reports.filter((report) => {
    if (activeTab === "all") return true
    return report.status === activeTab
  })

  const reportStats = {
    total: reports.length,
    pending: reports.filter((r) => r.status === "pending").length,
    investigating: reports.filter((r) => r.status === "investigating").length,
    resolved: reports.filter((r) => r.status === "resolved").length,
    urgent: reports.filter((r) => r.priority === "urgent").length,
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Report Management</h2>
        <p className="text-gray-600">View and respond to user reports</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Flag className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Reports</p>
                <p className="text-2xl font-bold">{reportStats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold">{reportStats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Investigating</p>
                <p className="text-2xl font-bold">{reportStats.investigating}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Resolved</p>
                <p className="text-2xl font-bold">{reportStats.resolved}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">Urgent</p>
                <p className="text-2xl font-bold">{reportStats.urgent}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reports</CardTitle>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All Reports</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="investigating">Investigating</TabsTrigger>
              <TabsTrigger value="resolved">Resolved</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Report ID</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Type</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Title</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Reported User</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Priority</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Created</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.map((report) => (
                  <tr key={report.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">#{report.id}</td>
                    <td className="py-3 px-4">
                      <Badge variant="outline">{report.category}</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium">{report.title}</p>
                        <p className="text-sm text-gray-600 truncate max-w-xs">{report.description}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">@{report.reportedUser}</td>
                    <td className="py-3 px-4">
                      <Badge className={getPriorityColor(report.priority)}>{report.priority}</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(report.status)}
                        <Badge className={getStatusColor(report.status)}>{report.status}</Badge>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{report.createdAt}</td>
                    <td className="py-3 px-4">
                      <Dialog open={isDialogOpen && selectedReport?.id === report.id} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setSelectedReport(report)}>
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Respond
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>
                              Report #{selectedReport?.id} - {selectedReport?.title}
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm font-medium text-gray-600">Reported By</p>
                                <p>@{selectedReport?.reportedBy}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-600">Reported User</p>
                                <p>@{selectedReport?.reportedUser}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-600">Category</p>
                                <Badge variant="outline">{selectedReport?.category}</Badge>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-600">Priority</p>
                                <Badge className={getPriorityColor(selectedReport?.priority || "")}>
                                  {selectedReport?.priority}
                                </Badge>
                              </div>
                            </div>

                            <div>
                              <p className="text-sm font-medium text-gray-600 mb-2">Description</p>
                              <p className="p-3 bg-gray-50 rounded-lg">{selectedReport?.description}</p>
                            </div>

                            {selectedReport?.contentTitle && (
                              <div>
                                <p className="text-sm font-medium text-gray-600 mb-2">Reported Content</p>
                                <p className="p-3 bg-gray-50 rounded-lg">{selectedReport.contentTitle}</p>
                              </div>
                            )}

                            <div>
                              <Label htmlFor="status">Update Status</Label>
                              <Select value={newStatus} onValueChange={setNewStatus}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select new status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="investigating">Investigating</SelectItem>
                                  <SelectItem value="resolved">Resolved</SelectItem>
                                  <SelectItem value="rejected">Rejected</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <Label htmlFor="response">Response/Resolution</Label>
                              <Textarea
                                id="response"
                                placeholder="Enter your response or resolution details..."
                                value={response}
                                onChange={(e) => setResponse(e.target.value)}
                                rows={4}
                              />
                            </div>

                            <div className="flex gap-2">
                              <Button onClick={handleUpdateReport} className="flex-1">
                                Update Report
                              </Button>
                              <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                                Cancel
                              </Button>
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
