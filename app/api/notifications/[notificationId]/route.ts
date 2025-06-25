import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import { db } from '@/app/db'
import * as schema from '@/app/db/schema'
import { eq, and } from 'drizzle-orm'

// PATCH /api/notifications/[notificationId] - Mark a specific notification as read
export async function PATCH(
  request: NextRequest,
  { params }: { params: { notificationId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { notificationId } = await params

    if (!notificationId) {
      return NextResponse.json({ error: 'Notification ID is required' }, { status: 400 })
    }

    const notification = await db
      .update(schema.notifications)
      .set({ is_read: true })
      .where(
        and(
          eq(schema.notifications.notification_id, notificationId),
          eq(schema.notifications.user_id, session.user.id)
        )
      )
      .returning()

    if (notification.length === 0) {
      return NextResponse.json({ error: 'Notification not found' }, { status: 404 })
    }

    return NextResponse.json(notification[0])
  } catch (error) {
    console.error('Error marking notification as read:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/notifications/[notificationId] - Delete a specific notification
export async function DELETE(
  request: NextRequest,
  { params }: { params: { notificationId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { notificationId } = await params

    if (!notificationId) {
      return NextResponse.json({ error: 'Notification ID is required' }, { status: 400 })
    }

    const deletedNotification = await db
      .delete(schema.notifications)
      .where(
        and(
          eq(schema.notifications.notification_id, notificationId),
          eq(schema.notifications.user_id, session.user.id)
        )
      )
      .returning()

    if (deletedNotification.length === 0) {
      return NextResponse.json({ error: 'Notification not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting notification:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 