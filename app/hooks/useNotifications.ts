"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

export function useNotifications() {
  const { status } = useSession()
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)

  const fetchUnreadCount = async () => {
    try {
      const response = await fetch('/api/notifications?unread_only=true')
      if (!response.ok) {
        if (response.status === 401) {
          // User not authenticated, set count to 0
          setUnreadCount(0)
          return
        }
        throw new Error('Failed to fetch notifications')
      }
      const data = await response.json()
      setUnreadCount(data.length)
    } catch (error) {
      console.error('Error fetching notification count:', error)
      setUnreadCount(0)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (status === "authenticated") {
      fetchUnreadCount()
      
      // Set up interval to check for new notifications every 30 seconds
      const interval = setInterval(fetchUnreadCount, 30000)
      
      return () => clearInterval(interval)
    } else if (status === "unauthenticated") {
      setUnreadCount(0)
      setLoading(false)
    }
  }, [status])

  return { unreadCount, loading, refetch: fetchUnreadCount }
} 