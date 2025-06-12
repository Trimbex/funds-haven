import { db } from '@/app/db'
import { users } from '@/app/db/schema'
import { eq } from 'drizzle-orm'

async function migrateUsers() {
  console.log('🚀 Starting user migration...')
  
  try {
    // Get all existing users
    const existingUsers = await db.select().from(users)
    
    console.log(`📊 Found ${existingUsers.length} users to migrate`)
    
    for (const user of existingUsers) {
      // Update user record to include NextAuth fields
      await db.update(users)
        .set({
          name: user.firstName && user.lastName 
            ? `${user.firstName} ${user.lastName}` 
            : user.firstName || user.email?.split('@')[0] || 'User',
          emailVerified: new Date(), // Mark as verified since they were using Supabase
        })
        .where(eq(users.id, user.id))
      
      console.log(`✅ Migrated user: ${user.email}`)
    }
    
    console.log('🎉 Migration completed successfully!')
  } catch (error) {
    console.error('❌ Migration failed:', error)
  }
}

// Run migration
migrateUsers() 