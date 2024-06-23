import {  MenuSquareIcon } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet"
import { Button } from "../ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { ModeToggle } from "../mode-toggle"
import Image from "next/image"
import HeaderMenuNav from "../header-menu-nav"
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Separator } from "../ui/separator"

export default function Header() {

    return (
        <header className="sticky top-0 flex h-16 items-center justify-between gap-4 border-b bg-background mx-auto px-4 md:px-6 lg:px-8">
            <div className="flex items-center gap-4">
                <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
                      <HeaderMenuNav />
                </nav>
            </div>
            <Sheet>
                <SheetTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        className="shrink-0 md:hidden"
                    >
                    <MenuSquareIcon className="h-full w-full" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left">
                    <nav className="grid gap-6 text-lg font-medium">
                        <HeaderMenuNav />
                    </nav>
                </SheetContent>
            </Sheet>
            <div className="flex items-center gap-4 ml-auto">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="secondary" size="icon" className="rounded-full">
                        <Image
                            src="/pretorian.jpeg"
                            alt="Pretorian System Logo"
                            width={48}
                            height={48}
                            className="h-full w-full rounded-full object-cover"
                        />
                            <span className="sr-only">Toggle user menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center">
                        <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Paramètres</DropdownMenuItem>
                        <DropdownMenuItem>Support</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                           <Avatar className='w-4 h-4 mr-2'>
                            <AvatarImage src="/icon.jpeg" />
                            <AvatarFallback>PR</AvatarFallback>
                        </Avatar>
                        <Separator orientation="vertical" />
                            <Link href="/login">Connexion</Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <ModeToggle />
            </div>
        </header>
    )
}
