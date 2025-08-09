"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Layers3 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type NavLinkProps = {
    href: string
    label: string
}

function NavLink({ href, label }: NavLinkProps) {
    const pathname = usePathname()
    const isActive = pathname === href || (href !== "/" && pathname.startsWith(href))
    return (
        <Link
            href={href}
            className={cn(
                "text-sm font-medium text-muted-foreground hover:text-foreground transition",
                isActive && "text-foreground",
            )}
        >
            {label}
        </Link>
    )
}

export default function AppHeader() {
    return (
        <header className="border-b bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
                <Link href="/quizzes" className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-foreground text-background">
            <Layers3 className="h-4 w-4" />
          </span>
                    <span className="hidden text-base font-semibold sm:inline">Quiz Builder</span>
                </Link>
                <nav className="flex items-center gap-6">
                    <NavLink href="/quizzes" label="Quizzes" />
                    <NavLink href="/create" label="Create" />
                </nav>
            </div>
        </header>
    )
}
