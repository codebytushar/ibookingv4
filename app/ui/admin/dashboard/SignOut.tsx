'use client'

import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export default function SignOutButton() {
  return (
    // <button
    //   onClick={async () => {
    //     await fetch('/api/signout', { method: 'POST' })
    //     window.location.href = '/'
    //   }}
    //   className="text-sm font-medium text-gray-700 hover:text-gray-900"
    // >
    //   Sign out
    // </button>

     <Button
          variant="ghost"
          className="text-white hover:text-indigo-200"
          onClick={async () => {
        await fetch('/api/signout', { method: 'POST' })
        window.location.href = '/'
      }}
        >
          <LogOut className="h-5 w-5 mr-2" />
          Logout
        </Button>
  )
}
