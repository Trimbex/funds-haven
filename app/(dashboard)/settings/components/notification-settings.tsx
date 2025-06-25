"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Bell, Shield, Sparkles, TrendingUp } from "lucide-react"
import { toast } from "sonner"
import { useSession } from "next-auth/react"

interface NotificationSettings {
    budget_alerts: boolean
    budget_threshold: number
    new_feature_updates: boolean
    security_alerts: boolean
}

export function NotificationSettings() {
    const { data: session, status } = useSession()
    const [settings, setSettings] = useState<NotificationSettings>({
        budget_alerts: true,
        budget_threshold: 80,
        new_feature_updates: true,
        security_alerts: true,
    })
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    const fetchSettings = async () => {
        try {
            const response = await fetch('/api/notifications/settings')
            if (!response.ok) {
                const errorData = await response.json()
                console.error('API Error:', response.status, errorData)
                throw new Error(`Failed to fetch settings: ${response.status}`)
            }
            const data = await response.json()
            setSettings(data)
        } catch (error) {
            console.error('Error fetching notification settings:', error)
            // Don't show error toast if user is not authenticated
            if (error instanceof Error && !error.message.includes('401')) {
                toast.error('Failed to load notification settings')
            }
        } finally {
            setLoading(false)
        }
    }

    const handleSettingChange = (key: string, value: boolean | number) => {
        setSettings(prev => ({ ...prev, [key]: value }))
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            const response = await fetch('/api/notifications/settings', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(settings),
            })
            
            if (!response.ok) throw new Error('Failed to save settings')
            
            toast.success('Notification preferences saved successfully')
        } catch (error) {
            console.error('Error saving notification settings:', error)
            toast.error('Failed to save notification preferences')
        } finally {
            setSaving(false)
        }
    }

    useEffect(() => {
        if (status === "authenticated") {
            fetchSettings()
        } else if (status === "unauthenticated") {
            setLoading(false)
        }
    }, [status])

    if (loading || status === "loading") {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Bell className="w-5 h-5" />
                        Notifications
                    </CardTitle>
                    <CardDescription>
                        Control what notifications you receive and when.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="animate-pulse space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <div className="space-y-2">
                                    <div className="h-4 w-32 bg-gray-200 rounded"></div>
                                    <div className="h-3 w-48 bg-gray-200 rounded"></div>
                                </div>
                                <div className="h-6 w-11 bg-gray-200 rounded-full"></div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        )
    }

    if (status === "unauthenticated") {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Bell className="w-5 h-5" />
                        Notifications
                    </CardTitle>
                    <CardDescription>
                        Control what notifications you receive and when.
                    </CardDescription>
                </CardHeader>
                <CardContent className="py-12">
                    <div className="text-center text-gray-500">
                        Please log in to configure your notification preferences.
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Notifications
                </CardTitle>
                <CardDescription>
                    Control what notifications you receive and when.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Budget Alerts */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-red-500" />
                                <Label htmlFor="budget-alerts" className="font-medium">Budget Alerts</Label>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Get notified when you're approaching your spending limits
                            </p>
                        </div>
                        <Switch
                            id="budget-alerts"
                            checked={settings.budget_alerts}
                            onCheckedChange={(checked) => handleSettingChange('budget_alerts', checked)}
                        />
                    </div>
                    
                    {settings.budget_alerts && (
                        <div className="ml-6 space-y-3">
                            <Label className="text-sm font-medium">
                                Alert when spending reaches {settings.budget_threshold}% of budget
                            </Label>
                            <div className="px-3">
                                <Slider
                                    value={[settings.budget_threshold]}
                                    onValueChange={(value) => handleSettingChange('budget_threshold', value[0])}
                                    max={100}
                                    min={50}
                                    step={5}
                                    className="w-full"
                                />
                                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                    <span>50%</span>
                                    <span>75%</span>
                                    <span>100%</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <hr className="border-gray-200" />

                {/* Security Alerts */}
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-yellow-500" />
                            <Label htmlFor="security-alerts" className="font-medium">Security Alerts</Label>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Get notified about important security events
                        </p>
                    </div>
                    <Switch
                        id="security-alerts"
                        checked={settings.security_alerts}
                        onCheckedChange={(checked) => handleSettingChange('security_alerts', checked)}
                    />
                </div>

                <hr className="border-gray-200" />

                {/* Feature Updates */}
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-blue-500" />
                            <Label htmlFor="feature-updates" className="font-medium">Feature Updates</Label>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Stay informed about new features and improvements
                        </p>
                    </div>
                    <Switch
                        id="feature-updates"
                        checked={settings.new_feature_updates}
                        onCheckedChange={(checked) => handleSettingChange('new_feature_updates', checked)}
                    />
                </div>

                <hr className="border-gray-200" />

                {/* Save Button */}
                <div className="pt-4">
                    <Button onClick={handleSave} className="w-full" disabled={saving}>
                        {saving ? "Saving..." : "Save Notification Preferences"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
} 