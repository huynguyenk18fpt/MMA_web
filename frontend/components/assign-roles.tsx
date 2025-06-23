"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { UserCog, Shield, Edit, BookOpen, User } from "lucide-react"
import { useData } from "@/hooks/useData"

const roles = [
  {
    value: "User",
    label: "User",
    description: "Basic user with reading privileges",
    icon: User,
    color: "bg-gray-100 text-gray-800",
  },
  {
    value: "Author",
    label: "Author",
    description: "Can create and publish stories",
    icon: BookOpen,
    color: "bg-orange-100 text-orange-800",
  },
  {
    value: "Moderator",
    label: "Moderator",
    description: "Can moderate content and users",
    icon: Shield,
    color: "bg-blue-100 text-blue-800",
  },
  {
    value: "Admin",
    label: "Admin",
    description: "Full system access",
    icon: UserCog,
    color: "bg-purple-100 text-purple-800",
  },
]

export function AssignRoles() {
  const { data, updateUser } = useData()
  const [users, setUsers] = useState(data.users)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [newRole, setNewRole] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleRoleAssignment = () => {
    if (!selectedUser || !newRole) return

    updateUser(selectedUser.id, { role: newRole })
    setUsers(data.users)

    console.log("Role assignment:", selectedUser.name, "->", newRole)
    alert(`${selectedUser.name} has been assigned the role: ${newRole}`)

    setIsDialogOpen(false)
    setSelectedUser(null)
    setNewRole("")
  }

  const getRoleColor = (role: string) => {
    const roleConfig = roles.find((r) => r.value === role)
    return roleConfig?.color || "bg-gray-100 text-gray-800"
  }

  const getRoleIcon = (role: string) => {
    const roleConfig = roles.find((r) => r.value === role)
    return roleConfig?.icon || User
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Assign Roles</h2>
        <p className="text-gray-600">Manage user roles and permissions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>User Roles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-gray-900">User</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Email</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Current Role</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => {
                      const RoleIcon = getRoleIcon(user.role)
                      return (
                        <tr key={user.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium">{user.name}</td>
                          <td className="py-3 px-4 text-gray-600">{user.email}</td>
                          <td className="py-3 px-4">
                            <Badge className={getRoleColor(user.role)}>
                              <RoleIcon className="h-3 w-3 mr-1" />
                              {user.role}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <Dialog open={isDialogOpen && selectedUser?.id === user.id} onOpenChange={setIsDialogOpen}>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" onClick={() => setSelectedUser(user)}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Change Role
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Change Role for {selectedUser?.name}</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <p className="text-sm text-gray-600 mb-3">
                                      Current role:{" "}
                                      <Badge className={getRoleColor(selectedUser?.role || "")}>
                                        {selectedUser?.role}
                                      </Badge>
                                    </p>
                                    <Select value={newRole} onValueChange={setNewRole}>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select new role" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {roles.map((role) => {
                                          const Icon = role.icon
                                          return (
                                            <SelectItem key={role.value} value={role.value}>
                                              <div className="flex items-center gap-2">
                                                <Icon className="h-4 w-4" />
                                                <div>
                                                  <p className="font-medium">{role.label}</p>
                                                  <p className="text-xs text-gray-500">{role.description}</p>
                                                </div>
                                              </div>
                                            </SelectItem>
                                          )
                                        })}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="flex gap-2">
                                    <Button onClick={handleRoleAssignment} className="flex-1">
                                      Assign Role
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
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Role Descriptions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {roles.map((role) => {
                  const Icon = role.icon
                  return (
                    <div key={role.value} className="p-3 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className="h-4 w-4" />
                        <Badge className={role.color}>{role.label}</Badge>
                      </div>
                      <p className="text-sm text-gray-600">{role.description}</p>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Recent Role Changes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-sm">
                  <p className="font-medium">Jane Smith</p>
                  <p className="text-gray-600">User → Author</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
                <div className="text-sm">
                  <p className="font-medium">Mike Johnson</p>
                  <p className="text-gray-600">Author → Moderator</p>
                  <p className="text-xs text-gray-500">1 day ago</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
