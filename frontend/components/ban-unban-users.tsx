"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { UserX, UserCheck, VolumeX, Volume2 } from "lucide-react"
import { useData } from "@/hooks/useData"

// Thêm chức năng Mute vào component BanUnbanUsers
// Cập nhật mockUsers để bao gồm trạng thái mute

const mockUsers = [
  { id: 1, name: "John Doe", email: "john@example.com", status: "Active", isBanned: false, isMuted: false },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    status: "Active",
    isBanned: false,
    isMuted: true,
    muteReason: "Spam comments",
    mutedUntil: "2024-02-15",
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike@example.com",
    status: "Banned",
    isBanned: true,
    isMuted: false,
    banReason: "Spam content",
    bannedUntil: "2024-03-15",
  },
  { id: 4, name: "Sarah Wilson", email: "sarah@example.com", status: "Active", isBanned: false, isMuted: false },
]

export function BanUnbanUsers() {
  const { data, updateUser } = useData()
  const mockUsers = data.users
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [banReason, setBanReason] = useState("")
  const [banDuration, setBanDuration] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Thêm state cho mute functionality
  const [muteReason, setMuteReason] = useState("")
  const [muteDuration, setMuteDuration] = useState("")
  const [isMuteDialogOpen, setIsMuteDialogOpen] = useState(false)

  const handleBanUser = () => {
    if (!selectedUser || !banReason || !banDuration) return

    // Simulate API call
    console.log("Banning user:", selectedUser.id, "Reason:", banReason, "Duration:", banDuration)
    alert(`User ${selectedUser.name} has been banned for ${banDuration} days`)

    setBanReason("")
    setBanDuration("")
    setIsDialogOpen(false)
  }

  const handleUnbanUser = (user: any) => {
    // Simulate API call
    console.log("Unbanning user:", user.id)
    alert(`User ${user.name} has been unbanned`)
  }

  // Thêm functions để handle mute/unmute
  const handleMuteUser = () => {
    if (!selectedUser || !muteReason || !muteDuration) return

    console.log("Muting user:", selectedUser.id, "Reason:", muteReason, "Duration:", muteDuration)
    alert(`User ${selectedUser.name} has been muted for ${muteDuration} days`)

    setMuteReason("")
    setMuteDuration("")
    setIsMuteDialogOpen(false)
  }

  const handleUnmuteUser = (user: any) => {
    console.log("Unmuting user:", user.id)
    alert(`User ${user.name} has been unmuted`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Ban/Unban Users</h2>
        <p className="text-gray-600">Manage user bans and restrictions</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Ban Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">User</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Email</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Ban Details</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockUsers.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{user.name}</td>
                    <td className="py-3 px-4 text-gray-600">{user.email}</td>
                    <td className="py-3 px-4">
                      <Badge className={user.isBanned ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}>
                        {user.status}
                      </Badge>
                      {user.isMuted && (
                        <div className="text-sm">
                          <p>Muted: {user.muteReason}</p>
                          <p>Until: {user.mutedUntil}</p>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {user.isBanned ? (
                        <div className="text-sm">
                          <p>Reason: {user.banReason}</p>
                          <p>Until: {user.bannedUntil}</p>
                        </div>
                      ) : (
                        "No restrictions"
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {user.isMuted ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUnmuteUser(user)}
                          className="text-blue-600 hover:text-blue-700 mr-2"
                        >
                          <Volume2 className="h-4 w-4 mr-2" />
                          Unmute
                        </Button>
                      ) : (
                        <Dialog open={isMuteDialogOpen} onOpenChange={setIsMuteDialogOpen}>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedUser(user)}
                              className="text-orange-600 hover:text-orange-700 mr-2"
                            >
                              <VolumeX className="h-4 w-4 mr-2" />
                              Mute User
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Mute User: {selectedUser?.name}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="mute-reason">Mute Reason</Label>
                                <Textarea
                                  id="mute-reason"
                                  placeholder="Enter the reason for muting this user..."
                                  value={muteReason}
                                  onChange={(e) => setMuteReason(e.target.value)}
                                />
                              </div>
                              <div>
                                <Label htmlFor="mute-duration">Mute Duration</Label>
                                <Select value={muteDuration} onValueChange={setMuteDuration}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select mute duration" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="1">1 Hour</SelectItem>
                                    <SelectItem value="24">24 Hours</SelectItem>
                                    <SelectItem value="168">7 Days</SelectItem>
                                    <SelectItem value="720">30 Days</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="flex gap-2">
                                <Button onClick={handleMuteUser} className="flex-1">
                                  Confirm Mute
                                </Button>
                                <Button variant="outline" onClick={() => setIsMuteDialogOpen(false)} className="flex-1">
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                      {user.isBanned ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUnbanUser(user)}
                          className="text-green-600 hover:text-green-700"
                        >
                          <UserCheck className="h-4 w-4 mr-2" />
                          Unban
                        </Button>
                      ) : (
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedUser(user)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <UserX className="h-4 w-4 mr-2" />
                              Ban User
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Ban User: {selectedUser?.name}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="reason">Ban Reason</Label>
                                <Textarea
                                  id="reason"
                                  placeholder="Enter the reason for banning this user..."
                                  value={banReason}
                                  onChange={(e) => setBanReason(e.target.value)}
                                />
                              </div>
                              <div>
                                <Label htmlFor="duration">Ban Duration</Label>
                                <Select value={banDuration} onValueChange={setBanDuration}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select ban duration" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="1">1 Day</SelectItem>
                                    <SelectItem value="7">7 Days</SelectItem>
                                    <SelectItem value="30">30 Days</SelectItem>
                                    <SelectItem value="90">90 Days</SelectItem>
                                    <SelectItem value="permanent">Permanent</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="flex gap-2">
                                <Button onClick={handleBanUser} className="flex-1">
                                  Confirm Ban
                                </Button>
                                <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
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
