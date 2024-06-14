"use client"

import {  signOut } from "next-auth/react"
import { Button } from "../ui/button"

export const LogoutButton = () => {

    return (
        <div className="grid gap-4">
        <Button type="submit" className="w-full" onClick={async() => await signOut()}>
            Deconnexion
        </Button>
        </div>
    )
}
