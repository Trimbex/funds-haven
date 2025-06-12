import { getServerSession } from "next-auth/next"
import { authOptions } from "./auth"
import { db } from "@/app/db"
import { users } from "@/app/db/schema"
import { eq } from "drizzle-orm"

// Server-side function to get current user
export async function getCurrentUser() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.email) {
    return null
  }

  const user = await db.query.users.findFirst({
    where: eq(users.email, session.user.email),
  })

  return user
}

// Server-side function to get current user ID
export async function getCurrentUserID() {
  const user = await getCurrentUser()
  return user?.id || null
}

// Client-side hook for getting session
export { useSession } from "next-auth/react" 