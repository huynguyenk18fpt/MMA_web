"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { UserX, UserCheck, VolumeX, Volume2 } from "lucide-react"

export function BanUnbanUsers() {
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [banReason, setBanReason] = useState("")
  const [banDuration, setBanDuration] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const [muteReason, setMuteReason] = useState("")
  const [muteDuration, setMuteDuration] = useState("")
  const [isMuteDialogOpen, setIsMuteDialogOpen] = useState(false)

  useEffect(() => {
    fetch("http://localhost:555/api/admin/reportWithExtend")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const uniqueUsers = Object.values(
            data.report.reduce((acc, r) => {
              const u = r.reportedUser
              acc[u._id] = u
              return acc
            }, {})
          )
          setUsers(uniqueUsers)
        }
      })
  }, [])

  const handleBanUser = () => {
    if (!selectedUser || !banReason || !banDuration) return

    const bannedUntil = banDuration === "permanent"
      ? null
      : new Date(Date.now() + parseInt(banDuration) * 24 * 60 * 60 * 1000)

    fetch(`http://localhost:555/api/admin/ban/${selectedUser._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isBanned: true, banReason, bannedUntil })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert("Ban success")
          setUsers(prev => prev.map(u => u._id === selectedUser._id ? { ...u, ...data.user } : u))
          setIsDialogOpen(false)
        } else alert("Ban failed")
      })
  }

  const handleUnbanUser = (user) => {
    fetch(`http://localhost:555/api/admin/ban/${user._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isBanned: false })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert("Unban success")
          setUsers(prev => prev.map(u => u._id === user._id ? { ...u, ...data.user } : u))
        }
      })
  }

  const handleMuteUser = () => {
    if (!selectedUser || !muteReason || !muteDuration) return

    const mutedUntil = new Date(Date.now() + parseInt(muteDuration) * 60 * 60 * 1000)

    fetch(`http://localhost:555/api/admin/mute/${selectedUser._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isMuted: true, muteReason, muteUntil: mutedUntil })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert("Mute success")
          setUsers(prev => prev.map(u => u._id === selectedUser._id ? { ...u, ...data.user } : u))
          setIsMuteDialogOpen(false)
        } else alert("Mute failed")
      })
  }

  const handleUnmuteUser = (user) => {
    fetch(`http://localhost:555/api/admin/mute/${user._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isMuted: false })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert("Unmute success")
          setUsers(prev => prev.map(u => u._id === user._id ? { ...u, ...data.user } : u))
        }
      })
  }

  return (
    <div className="space-y-6">
      <Card className="border border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">User Restriction Management</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="py-3 px-4 text-left font-medium text-gray-700">User</th>
                <th className="py-3 px-4 text-left font-medium text-gray-700">Email</th>
                <th className="py-3 px-4 text-left font-medium text-gray-700">Mute & Ban Details</th>
                <th className="py-3 px-4 text-left font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-900">{user.name}</td>
                  <td className="py-3 px-4 text-gray-600">{user.email}</td>
                  <td className="py-3 px-4 space-y-1">
                    {user.isMuted && (
                      <Badge className="bg-red-100 text-red-700">Muted: {user.muteReason}</Badge>
                    )}
                    {user.isBanned && (
                      <Badge className="bg-red-500 text-white">Banned: {user.banReason}</Badge>
                    )}
                    {!user.isMuted && !user.isBanned && <span className="text-gray-500">No restrictions</span>}
                  </td>
                  <td className="py-3 px-4 flex gap-2 flex-wrap">
                    {user.isMuted ? (
                      <Button onClick={() => handleUnmuteUser(user)} size="sm" className="bg-green-100 text-green-800 border border-green-300"><Volume2 className="w-4 h-4 mr-1" />Unmute</Button>
                    ) : (
                      <Dialog open={isMuteDialogOpen} onOpenChange={setIsMuteDialogOpen}>
                        <DialogTrigger asChild>
                          <Button onClick={() => setSelectedUser(user)} size="sm" className="bg-red-100 text-red-800 border border-red-300"><VolumeX className="w-4 h-4 mr-1" />Mute</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Mute: {selectedUser?.name}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-2">
                            <Label>Reason</Label>
                            <Textarea value={muteReason} onChange={(e) => setMuteReason(e.target.value)} />
                            <Label>Duration (hours)</Label>
                            <Select value={muteDuration} onValueChange={setMuteDuration}>
                              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1">1</SelectItem>
                                <SelectItem value="24">24</SelectItem>
                                <SelectItem value="168">7 days</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button onClick={handleMuteUser}>Confirm Mute</Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                    {user.isBanned ? (
                      <Button onClick={() => handleUnbanUser(user)} size="sm" className="bg-blue-100 text-blue-800 border border-blue-300"><UserCheck className="w-4 h-4 mr-1" />Unban</Button>
                    ) : (
                      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                          <Button onClick={() => setSelectedUser(user)} size="sm" className="bg-red-500 text-white"><UserX className="w-4 h-4 mr-1" />Ban</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Ban: {selectedUser?.name}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-2">
                            <Label>Reason</Label>
                            <Textarea value={banReason} onChange={(e) => setBanReason(e.target.value)} />
                            <Label>Duration (days)</Label>
                            <Select value={banDuration} onValueChange={setBanDuration}>
                              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1">1</SelectItem>
                                <SelectItem value="7">7</SelectItem>
                                <SelectItem value="30">30</SelectItem>
                                <SelectItem value="90">90</SelectItem>
                                <SelectItem value="permanent">Permanent</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button onClick={handleBanUser}>Confirm Ban</Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
