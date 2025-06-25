import { db } from '@/app/db'
import * as schema from '@/app/db/schema'

export interface CreateNotificationParams {
  userId: string
  message: string
  type: 'budget_alert' | 'security' | 'new_feature' | 'transaction_created' | 'account_created' | 'category_created' | 'welcome'
  link?: string | null
}

export async function createNotification({
  userId,
  message,
  type,
  link = null
}: CreateNotificationParams) {
  try {
    const notification = await db
      .insert(schema.notifications)
      .values({
        user_id: userId,
        message,
        type,
        link,
        is_read: false,
      })
      .returning()

    return notification[0]
  } catch (error) {
    console.error('Error creating notification:', error)
    throw new Error('Failed to create notification')
  }
}

export async function createBudgetAlert(userId: string, categoryName: string, percentage: number) {
  return createNotification({
    userId,
    message: `Budget alert: You've spent ${percentage}% of your ${categoryName} budget for this month`,
    type: 'budget_alert',
    link: '/categories'
  })
}

export async function createSecurityAlert(userId: string, deviceInfo: string) {
  return createNotification({
    userId,
    message: `Security alert: New login detected from ${deviceInfo}`,
    type: 'security',
    link: null
  })
}

export async function createFeatureUpdateNotification(userId: string, featureName: string) {
  return createNotification({
    userId,
    message: `New feature: ${featureName} is now available!`,
    type: 'new_feature',
    link: '/settings'
  })
}

// New notification functions for user actions
export async function createTransactionNotification(userId: string, transactionType: 'income' | 'expense', amount: number, description?: string) {
  const message = transactionType === 'income' 
    ? `✅ Income of $${amount.toFixed(2)} added${description ? `: ${description}` : ''}`
    : `💰 Expense of $${amount.toFixed(2)} recorded${description ? `: ${description}` : ''}`;

  return createNotification({
    userId,
    message,
    type: 'transaction_created',
    link: '/transactions'
  })
}

export async function createAccountNotification(userId: string, accountName: string, accountType: string) {
  return createNotification({
    userId,
    message: `🏦 New ${accountType} account "${accountName}" added successfully`,
    type: 'account_created',
    link: '/accounts'
  })
}

export async function createCategoryNotification(userId: string, categoryName: string, budget?: number) {
  const message = budget 
    ? `📊 Category "${categoryName}" created with $${budget.toFixed(2)} budget`
    : `📊 Category "${categoryName}" created successfully`;

  return createNotification({
    userId,
    message,
    type: 'category_created',
    link: '/categories'
  })
}

export async function createWelcomeNotification(userId: string, userName?: string) {
  const message = userName 
    ? `🎉 Welcome to Funds Haven, ${userName}! Your financial journey starts here.`
    : `🎉 Welcome to Funds Haven! Your financial journey starts here.`;

  return createNotification({
    userId,
    message,
    type: 'welcome',
    link: '/dashboard'
  })
} 