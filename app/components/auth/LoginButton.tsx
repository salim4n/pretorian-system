"use client"

import { signIn } from "next-auth/react"
import { Button } from "../ui/button"

export const LoginButton = () => {

    return (
        <div className="grid gap-4">
        <Button type="submit" className="w-full" onClick={async() => await signIn()}>
            Connexion
        </Button>
        </div>
    )
}

