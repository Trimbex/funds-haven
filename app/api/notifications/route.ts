import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import { db } from '@/app/db'
import * as schema from '@/app/db/schema'
import { eq, desc, and } from 'drizzle-orm'

// GET /api/notifications - Fetch notifications for the current user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const unreadOnly = searchParams.get('unread_only') === 'true'

    let whereConditions = [eq(schema.notifications.user_id, session.user.id)]
    
    if (type) {
      whereConditions.push(eq(schema.notifications.type, type))
    }
    
    if (unreadOnly) {
      whereConditions.push(eq(schema.notifications.is_read, false))
    }

    const notifications = await db
      .select()
      .from(schema.notifications)
      .where(and(...whereConditions))
      .orderBy(desc(schema.notifications.created_at))
      .limit(50)

    return NextResponse.json(notifications)
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/notifications - Create a new notification
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { message, type, link } = body

    if (!message || !type) {
      return NextResponse.json({ error: 'Message and type are required' }, { status: 400 })
    }

    const notification = await db
      .insert(schema.notifications)
      .values({
        user_id: session.user.id,
        message,
        type,
        link: link || null,
        is_read: false,
      })
      .returning()

    return NextResponse.json(notification[0], { status: 201 })
  } catch (error) {
    console.error('Error creating notification:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH /api/notifications - Mark all as read
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await db
      .update(schema.notifications)
      .set({ is_read: true })
      .where(
        and(
          eq(schema.notifications.user_id, session.user.id),
          eq(schema.notifications.is_read, false)
        )
      )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error marking notifications as read:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 