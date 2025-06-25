"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function ThemeSettings() {
    const [mounted, setMounted] = useState(false)
    const { setTheme, theme } = useTheme()

    useEffect(() => {
        setMounted(true)
    }, [])


    if (!mounted) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Theme</CardTitle>
                    <CardDescription>
                        Select your preferred color scheme for the application.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex space-x-2">
                    <Skeleton className="h-10 w-20" />
                    <Skeleton className="h-10 w-20" />
                    <Skeleton className="h-10 w-20" />
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Theme</CardTitle>
                <CardDescription>
                    Select your preferred color scheme for the application.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex space-x-2">
                <Button variant={theme === 'light' ? 'default' : 'outline'} onClick={() => setTheme("light")}>Light</Button>
                <Button variant={theme === 'dark' ? 'default' : 'outline'} onClick={() => setTheme("dark")}>Dark</Button>
                <Button variant={theme === 'system' ? 'default' : 'outline'} onClick={() => setTheme("system")}>System</Button>
            </CardContent>
        </Card>
    )
} 