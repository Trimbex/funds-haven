import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import { db } from '@/app/db'
import * as schema from '@/app/db/schema'
import { eq } from 'drizzle-orm'

// GET /api/notifications/settings - Fetch notification settings for the current user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const settings = await db
      .select()
      .from(schema.user_notification_settings)
      .where(eq(schema.user_notification_settings.user_id, session.user.id))
      .limit(1)

    if (settings.length === 0) {
      // Create default settings for the user
      const defaultSettings = await db
        .insert(schema.user_notification_settings)
        .values({
          user_id: session.user.id,
          budget_alerts: true,
          budget_threshold: 80,
          new_feature_updates: true,
          security_alerts: true,
        })
        .returning()

      return NextResponse.json(defaultSettings[0])
    }

    return NextResponse.json(settings[0])
  } catch (error) {
    console.error('Error fetching notification settings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/notifications/settings - Update notification settings for the current user
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { budget_alerts, budget_threshold, new_feature_updates, security_alerts } = body

    // Validate budget_threshold if provided
    if (budget_threshold !== undefined && (budget_threshold < 50 || budget_threshold > 100)) {
      return NextResponse.json({ error: 'Budget threshold must be between 50 and 100' }, { status: 400 })
    }

    const updatedSettings = await db
      .update(schema.user_notification_settings)
      .set({
        budget_alerts: budget_alerts !== undefined ? budget_alerts : undefined,
        budget_threshold: budget_threshold !== undefined ? budget_threshold : undefined,
        new_feature_updates: new_feature_updates !== undefined ? new_feature_updates : undefined,
        security_alerts: security_alerts !== undefined ? security_alerts : undefined,
      })
      .where(eq(schema.user_notification_settings.user_id, session.user.id))
      .returning()

    if (updatedSettings.length === 0) {
      // If no settings exist, create them
      const newSettings = await db
        .insert(schema.user_notification_settings)
        .values({
          user_id: session.user.id,
          budget_alerts: budget_alerts ?? true,
          budget_threshold: budget_threshold ?? 80,
          new_feature_updates: new_feature_updates ?? true,
          security_alerts: security_alerts ?? true,
        })
        .returning()

      return NextResponse.json(newSettings[0])
    }

    return NextResponse.json(updatedSettings[0])
  } catch (error) {
    console.error('Error updating notification settings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 