"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tags, Edit, Save, Plus, BookOpen, TrendingUp } from "lucide-react"
import { useData } from "@/hooks/useData"

const mockGenres = [
  { id: 1, name: "Fantasy", description: "Magical and mythical stories", storyCount: 1234, isActive: true },
  { id: 2, name: "Romance", description: "Love and relationship stories", storyCount: 987, isActive: true },
  { id: 3, name: "Adventure", description: "Action-packed adventures", storyCount: 756, isActive: true },
  { id: 4, name: "Mystery", description: "Suspenseful mystery stories", storyCount: 543, isActive: true },
  { id: 5, name: "Sci-Fi", description: "Science fiction stories", storyCount: 432, isActive: true },
  { id: 6, name: "Horror", description: "Scary and thrilling stories", storyCount: 321, isActive: false },
]

const mockMisassignedStories = [
  {
    id: 1,
    title: "Dragon's Quest",
    author: "author_mike",
    currentGenre: "Romance",
    suggestedGenre: "Fantasy",
    reason: "Contains magical elements and dragons",
    confidence: 95,
  },
  {
    id: 2,
    title: "Space Explorer",
    author: "sci_writer",
    currentGenre: "Adventure",
    suggestedGenre: "Sci-Fi",
    reason: "Set in space with futuristic technology",
    confidence: 88,
  },
  {
    id: 3,
    title: "Love in the City",
    author: "romance_author",
    currentGenre: "Mystery",
    suggestedGenre: "Romance",
    reason: "Focuses on romantic relationships",
    confidence: 92,
  },
]

export function GenreManagement() {
  const { data, addGenre, updateGenre, removeMisassignedStory } = useData()
  const [genres, setGenres] = useState(data.genres)
  const [misassignedStories, setMisassignedStories] = useState(data.misassignedStories)
  const [selectedGenre, setSelectedGenre] = useState<any>(null)
  const [newGenreName, setNewGenreName] = useState("")
  const [newGenreDescription, setNewGenreDescription] = useState("")
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("genres")

  const handleUpdateGenre = () => {
    if (!selectedGenre) return

    updateGenre(selectedGenre.id, { name: newGenreName, description: newGenreDescription })
    setGenres(data.genres)

    console.log("Updating genre:", selectedGenre.id)
    alert(`Genre "${newGenreName}" updated successfully`)

    setIsEditDialogOpen(false)
    setNewGenreName("")
    setNewGenreDescription("")
    setSelectedGenre(null)
  }

  const handleAddGenre = () => {
    if (!newGenreName || !newGenreDescription) return

    const newGenre = {
      name: newGenreName,
      description: newGenreDescription,
      storyCount: 0,
      isActive: true,
    }

    addGenre(newGenre)
    setGenres(data.genres)

    console.log("Adding new genre:", newGenre)
    alert(`Genre "${newGenreName}" added successfully`)

    setIsAddDialogOpen(false)
    setNewGenreName("")
    setNewGenreDescription("")
  }

  const handleReassignGenre = (storyId: number, newGenre: string) => {
    removeMisassignedStory(storyId)
    setMisassignedStories(data.misassignedStories)
    console.log("Reassigning story", storyId, "to genre", newGenre)
    alert(`Story reassigned to ${newGenre} genre`)
  }

  const handleToggleGenreStatus = (genreId: number) => {
    setGenres((prev) => prev.map((genre) => (genre.id === genreId ? { ...genre, isActive: !genre.isActive } : genre)))
  }

  const openEditDialog = (genre: any) => {
    setSelectedGenre(genre)
    setNewGenreName(genre.name)
    setNewGenreDescription(genre.description)
    setIsEditDialogOpen(true)
  }

  const totalStories = genres.reduce((sum, genre) => sum + genre.storyCount, 0)
  const activeGenres = genres.filter((g) => g.isActive).length

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Genre Management</h2>
        <p className="text-gray-600">Manage story genres and reassign incorrect classifications</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Tags className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Genres</p>
                <p className="text-2xl font-bold">{genres.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Active Genres</p>
                <p className="text-2xl font-bold">{activeGenres}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Total Stories</p>
                <p className="text-2xl font-bold">{totalStories.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Edit className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Misassigned</p>
                <p className="text-2xl font-bold">{misassignedStories.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="genres">Manage Genres</TabsTrigger>
          <TabsTrigger value="reassign">Reassign Stories</TabsTrigger>
        </TabsList>

        <TabsContent value="genres" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Genre List</CardTitle>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Genre
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Genre</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="new-name">Genre Name</Label>
                        <Input
                          id="new-name"
                          value={newGenreName}
                          onChange={(e) => setNewGenreName(e.target.value)}
                          placeholder="Enter genre name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="new-description">Description</Label>
                        <Input
                          id="new-description"
                          value={newGenreDescription}
                          onChange={(e) => setNewGenreDescription(e.target.value)}
                          placeholder="Enter genre description"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleAddGenre} className="flex-1">
                          <Save className="h-4 w-4 mr-2" />
                          Add Genre
                        </Button>
                        <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="flex-1">
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Genre</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Description</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Story Count</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {genres.map((genre) => (
                      <tr key={genre.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">{genre.name}</td>
                        <td className="py-3 px-4 text-gray-600">{genre.description}</td>
                        <td className="py-3 px-4">
                          <Badge variant="outline">{genre.storyCount.toLocaleString()}</Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Badge
                            className={genre.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                          >
                            {genre.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => openEditDialog(genre)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleToggleGenreStatus(genre.id)}>
                              {genre.isActive ? "Deactivate" : "Activate"}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reassign" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Stories with Incorrect Genres</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Story</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Author</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Current Genre</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Suggested Genre</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Confidence</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {misassignedStories.map((story) => (
                      <tr key={story.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium">{story.title}</p>
                            <p className="text-sm text-gray-600">{story.reason}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-600">@{story.author}</td>
                        <td className="py-3 px-4">
                          <Badge className="bg-red-100 text-red-800">{story.currentGenre}</Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Badge className="bg-green-100 text-green-800">{story.suggestedGenre}</Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="outline">{story.confidence}%</Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleReassignGenre(story.id, story.suggestedGenre)}
                            >
                              Accept
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setMisassignedStories((prev) => prev.filter((s) => s.id !== story.id))}
                            >
                              Reject
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Genre Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Genre: {selectedGenre?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Genre Name</Label>
              <Input id="edit-name" value={newGenreName} onChange={(e) => setNewGenreName(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Input
                id="edit-description"
                value={newGenreDescription}
                onChange={(e) => setNewGenreDescription(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleUpdateGenre} className="flex-1">
                <Save className="h-4 w-4 mr-2" />
                Update Genre
              </Button>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
