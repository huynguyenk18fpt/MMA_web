"use client"

import { useState, useEffect } from "react"


// Import the JSON data
import data from "@/data/data.json"

export function useData() {
  const [appData, setAppData] = useState(data)

  // Function to update users
  const updateUser = (userId: number, updates: any) => {
    setAppData((prev) => ({
      ...prev,
      users: prev.users.map((user) => (user.id === userId ? { ...user, ...updates } : user)),
    }))
  }

  // Function to update reports
  const updateReport = (reportId: number, updates: any) => {
    setAppData((prev) => ({
      ...prev,
      reports: prev.reports.map((report) => (report.id === reportId ? { ...report, ...updates } : report)),
    }))
  }

  // Function to update content
  const updateContent = (contentId: number, updates: any) => {
    setAppData((prev) => ({
      ...prev,
      content: prev.content.map((content) => (content.id === contentId ? { ...content, ...updates } : content)),
    }))
  }

  // Function to add new genre
  const addGenre = (genre: any) => {
    setAppData((prev) => ({
      ...prev,
      genres: [...prev.genres, { ...genre, id: prev.genres.length + 1 }],
    }))
  }

  // Function to update genre
  const updateGenre = (genreId: number, updates: any) => {
    setAppData((prev) => ({
      ...prev,
      genres: prev.genres.map((genre) => (genre.id === genreId ? { ...genre, ...updates } : genre)),
    }))
  }

  // Function to remove misassigned story
  const removeMisassignedStory = (storyId: number) => {
    setAppData((prev) => ({
      ...prev,
      misassignedStories: prev.misassignedStories.filter((story) => story.id !== storyId),
    }))
  }

  // Function to add warning
  const addWarning = (warning: any) => {
    setAppData((prev) => ({
      ...prev,
      sentWarnings: [{ ...warning, id: prev.sentWarnings.length + 1 }, ...prev.sentWarnings],
    }))
  }

  // Function to add announcement
  const addAnnouncement = (announcement: any) => {
    setAppData((prev) => ({
      ...prev,
      announcements: [{ ...announcement, id: prev.announcements.length + 1 }, ...prev.announcements],
    }))
  }


  

  return {
    data: appData,
    updateUser,
    updateReport,
    updateContent,
    addGenre,
    updateGenre,
    removeMisassignedStory,
    addWarning,
    addAnnouncement,
  }
}
