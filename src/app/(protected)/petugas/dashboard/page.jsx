"use client"
import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"

const PetugasDashboard = () => {
  return (
    <>
    <Button onClick={() => signOut({ callbackUrl: "/masuk" })}>Logout</Button>
    </>
  )
}

export default PetugasDashboard