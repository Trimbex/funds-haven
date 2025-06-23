'use client'

import { db } from '@/app/db/index'
import * as t from '@/app/db/schema'
import { eq } from 'drizzle-orm';
import { useSession } from 'next-auth/react'

export function useCurrentUserID() {
  const { data: session, status } = useSession();
       
  if (status === 'loading') {
    return {
      success: false,
      message: "Session is loading.",
      userId: null,
    };
  }

  if (status === 'unauthenticated' || !session?.user) {
    return {
      success: false,
      message: "User is not logged in.",
      userId: null,
    };
  }

  // User ID is set in the NextAuth session callback
  const userId = (session.user as any).id;

  if (!userId) {
    return {
      success: false,
      message: "User ID not found in session.",
      userId: null,
    };
  }

  return {
    success: true,
    message: "User ID retrieved successfully.",
    userId,
  };
}


