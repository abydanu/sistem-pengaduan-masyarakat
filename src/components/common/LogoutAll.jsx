"use client"

import { signOut } from "next-auth/react"
import { LogOut } from "lucide-react"

export function LogoutAll({ 
  callbackUrl = "/masuk", 
  children, 
  className = "",
  variant = "default",
  size = "default",
  ...props 
}) {
  const handleLogout = (e) => {
    e.preventDefault()
    e.stopPropagation()
    signOut({ callbackUrl })
  }

  // If children are provided, render them with onClick handler
  if (children) {
    return (
      <div 
        onClick={handleLogout}
        className={`cursor-pointer ${className}`}
        {...props}
      >
        {children}
      </div>
    )
  }

  // Default logout button
  return (
    <button
      onClick={handleLogout}
      className={`flex items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground ${className}`}
      {...props}
    >
      <LogOut className="size-4" />
      <span>Keluar</span>
    </button>
  )
}