import { Separator } from "@/components/ui/separator"
import { ProfileSettings } from "./components/profile-settings"
import { ThemeSettings } from "./components/theme-settings"
import { NotificationSettings } from "./components/notification-settings"
import { DangerZone } from "./components/danger-zone"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Settings</h3>
        <p className="text-sm text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>
      <Separator />
      <ProfileSettings />
      <ThemeSettings />
      <NotificationSettings />
      <DangerZone />
    </div>
  )
} 