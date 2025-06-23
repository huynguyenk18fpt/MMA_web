"use client"

import { useState } from "react"
import { LoginScreen } from "@/components/login-screen"
import { AdminDashboard } from "@/components/admin-dashboard"

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)

  const handleLogin = (userData: any) => {
    setCurrentUser(userData)
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setIsLoggedIn(false)
  }

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />
  }

  return <AdminDashboard currentUser={currentUser} onLogout={handleLogout} />
}
