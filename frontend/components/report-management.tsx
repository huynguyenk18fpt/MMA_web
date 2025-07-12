"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Flag,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react"

export function ReportManagement() {
  const [reports, setReports] = useState([])
  const [selectedReport, setSelectedReport] = useState(null)
  const [response, setResponse] = useState("")
  const [newStatus, setNewStatus] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const [activeTab, setActiveTab] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")

  const [currentPage, setCurrentPage] = useState(1)
  const reportsPerPage = 5

  useEffect(() => {
    fetch("http://localhost:555/api/admin/report")
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text())
        return res.json()
      })
      .then((data) => setReports(data.report))
      .catch((err) => console.error("Failed to fetch reports:", err.message))
  }, [])

  useEffect(() => {
    setCurrentPage(1)
  }, [typeFilter, priorityFilter, activeTab])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800"
      case "investigating": return "bg-blue-100 text-blue-800"
      case "resolved": return "bg-green-100 text-green-800"
      case "rejected": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-red-100 text-red-800"
      case "high": return "bg-orange-100 text-orange-800"
      case "medium": return "bg-yellow-100 text-yellow-800"
      case "low": return "bg-green-100 text-green-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <Clock className="h-4 w-4" />
      case "investigating": return <Eye className="h-4 w-4" />
      case "resolved": return <CheckCircle className="h-4 w-4" />
      case "rejected": return <XCircle className="h-4 w-4" />
      default: return <Flag className="h-4 w-4" />
    }
  }

  const handleUpdateReport = () => {
    if (!selectedReport || !newStatus) return

    fetch(`http://localhost:555/api/admin/report/${selectedReport._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus, resolution: response }),
    })
      .then((res) => res.json())
      .then((updated) => {
        alert("Report updated successfully")
        setReports((prev) =>
          prev.map((r) => (r._id === updated._id ? updated : r))
        )
        setIsDialogOpen(false)
        setResponse("")
        setNewStatus("")
        setSelectedReport(null)
      })
      .catch((err) => console.error("Update failed:", err))
  }

  const filteredReports = reports.filter((r) => {
    const statusMatch = activeTab === "all" || r.status === activeTab
    const typeMatch = typeFilter === "all" || r.type === typeFilter
    const priorityMatch = priorityFilter === "all" || r.priority === priorityFilter
    return statusMatch && typeMatch && priorityMatch
  })

  const indexOfLast = currentPage * reportsPerPage
  const indexOfFirst = indexOfLast - reportsPerPage
  const currentReports = filteredReports.slice(indexOfFirst, indexOfLast)
  const totalPages = Math.ceil(filteredReports.length / reportsPerPage)

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Report Management</h2>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(val) => setActiveTab(val)}
        className="mb-4"
      >
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="investigating">Investigating</TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-4">
        <div>
          <Label className="text-sm">Filter by Type</Label>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="content">Content</SelectItem>
              <SelectItem value="spam">Spam</SelectItem>
              <SelectItem value="copyright">Copyright</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm">Filter by Priority</Label>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="py-2 text-left">Type</th>
              <th className="py-2 text-left">Title</th>
              <th className="py-2 text-left">Reported</th>
              <th className="py-2 text-left">Description</th>
              <th className="py-2 text-left">contentType</th>
              <th className="py-2 text-left">Priority</th>
              <th className="py-2 text-left">Status</th>
              <th className="py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentReports.map((r) => (
              <tr key={r._id} className="border-b hover:bg-gray-50">
                <td className="py-2">{r.type}</td>
                <td className="py-2">{r.title}</td>
                <td className="py-2">@{r.reportedUser?.name}</td>
                <td className="py-2">{r.description}</td>
                <td className="py-2">{r.contentId?.type}</td>
                <td className="py-2">
                  <Badge className={getPriorityColor(r.priority)}>{r.priority}</Badge>
                </td>
                <td className="py-2">
                  <div className="flex gap-2 items-center">
                    {getStatusIcon(r.status)}
                    <Badge className={getStatusColor(r.status)}>{r.status}</Badge>
                  </div>
                </td>
                <td className="py-2">
                  <Dialog
                    open={isDialogOpen && selectedReport?._id === r._id}
                    onOpenChange={setIsDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedReport(r)}
                      >
                        Respond
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Respond to Report</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-3">
                        <Label>Status</Label>
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

                        <Label>Resolution</Label>
                        <Textarea
                          placeholder="Enter your response or resolution"
                          value={response}
                          onChange={(e) => setResponse(e.target.value)}
                        />
                        <Button onClick={handleUpdateReport}>Update</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
