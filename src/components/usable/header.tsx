"use client";

import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";

export const Header = () => {


    const session  = useSession();

    const getNavigationItems = () => {
        if (!session || session.status !== "authenticated") {
            return [
                { href: "/", label: "Home" },
                { href: "/search", label: "Find Care" },
                { href: "/register", label: "Become a Caregiver" },
            ]
        }

        if (session.data.user.role === 'CAREGIVER') {
            return [
                { href: "/", label: "Home" },
                { href: "/profile", label: "My Profile" },
                { href: "/analytics", label: "Analytics" },
                { href: "/history", label: "Bookings" },
            ]
        } else {
            return [
                { href: "/", label: "Home" },
                { href: "/search", label: "Find Care" },
                { href: "/profile", label: "My Profile" },
                { href: "/history", label: "History" },
            ]
        }
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container max-w-7xl w-full mx-auto flex h-16 items-center justify-between px-4">
                <Link href="/" className="flex items-center space-x-2">
                    <div className="size-12 relative">
                        <Image
                            src="/assets/logo.png"
                            alt="NexaCare"
                            layout="fill"
                            objectFit="contain"
                        />
                    </div>
                </Link>
                <nav className="hidden md:flex items-center space-x-6">
                    {getNavigationItems().map((item) => (
                        <Link
                        key={item.href}
                        href={item.href}
                        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                        {item.label}
                        </Link>
                    ))}
                </nav>
                {
                    session.status === "unauthenticated" && (
                        <div className="flex items-center space-x-3">
                            <Link href="/sign-in">
                                <Button variant="ghost" className="rounded-lg">
                                    Sign In
                                </Button>
                            </Link>
                            <Link href="/sign-up" className="rounded-lg">
                                <Button>
                                    Sign Up
                                </Button>
                            </Link>
                        </div>
                    )
                }
                {
                    session.status === "authenticated" && (
                        <Button
                            size="sm"
                            className="rounded-lg"
                            onClick={async()=>await signOut()}
                        >
                            Logout
                        </Button>
                    )
                }
            </div>
        </header>
    )
}
