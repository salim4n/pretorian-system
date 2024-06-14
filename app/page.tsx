"use client"

import Image from "next/image"
import Link from "next/link"
import { Input } from "./components/ui/input"
import { Label } from "./components/ui/label"
import { LoginButton } from "./components/auth/LoginButton"

export default  function Home() {

  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Pretorian System Security</h1>
            <p className="text-balance text-muted-foreground">
              Entrer votre email et mot de passe pour continuer
            </p>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Mot de passe</Label>
                <Link
                  href="/forgot-password"
                  className="ml-auto inline-block text-sm underline"
                >
                    Mot de passe oublié ?
                </Link>
              </div>
              <Input id="password" type="password" required />
            </div>
            <LoginButton />
          </div>
          <div className="mt-4 text-center text-sm">
            <span>Vous n'avez pas de compte ?</span>
            <Link href="#" className="underline">
                S'inscrire
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <Image
          src="/icon.jpeg"
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  )
}
