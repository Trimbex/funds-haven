'use server'

import { db } from '@/app/db/index'
import * as t from '@/app/db/schema'
import { eq, and, sql } from 'drizzle-orm';
import { createBudgetAlert, createCategoryNotification } from '@/app/server/notifications/notifications';

export async function getCategories(user_id: string) {
  try {
    const result = await db.select().from(t.categories).where(eq(t.categories.user_id, user_id));
    return { success: true, message: "Categories retrieved successfully", categories: result };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return { success: false, message: "Failed to fetch categories", error };
  }
}

export async function addCategory(user_id: string, category_name: string, category_description: string, tags: any, budget: string, spent: string, color: string, predefined: boolean, image: string, icon: string, recurring: boolean) {
    try {
      const result = await db.insert(t.categories).values({
        user_id,
        category_name,
        category_description,
        tags,
        budget: budget.toString(),
        spent: spent.toString(),
        color,
        predefined,
        image,
        icon,
        recurring
      });

      // Create category notification
      try {
        await createCategoryNotification(
          user_id, 
          category_name, 
          budget ? Number(budget) : undefined
        );
      } catch (error) {
        console.warn('Failed to create category notification:', error);
      }
  
      return { success: true, message: "Category added successfully", result };
    } catch (error) {
      console.error("Error adding category:", error);
      return { success: false, message: "Failed to add category", error };
    }
  }

export async function editCategory(category_id: string, category_name: string, category_description: string, tags: any, budget: string, spent: string, color: string, predefined: boolean, image: string, icon: string, recurring: boolean) {
    try {
        const result = await db.update(t.categories).set({
            category_name,
            category_description,
            tags,
            budget,
            spent,
            color,
            predefined,
            image,
            icon,
            recurring
        }).where(eq(t.categories.category_id, category_id));
    
        return { success: true, message: "Category updated successfully", result };
        } catch (error) {
        console.error("Error updating category:", error);
    }
}

export async function deleteCategory(category_id: string) {
    try {
        const result = await db.delete(t.categories).where(eq(t.categories.category_id, category_id));
        return { success: true, message: "Category deleted successfully", result };
    } catch (error) {
        console.error("Error deleting category:", error);
        return { success: false, message: "Failed to delete category", error };
    }
}

// New function to update category spending and check for budget alerts
export async function updateCategorySpending(userId: string, categoryIds: string[]) {
  try {
    for (const categoryId of categoryIds) {
      // Calculate total spending for this category from transactions
      const spendingResult = await db.execute(sql`
        SELECT COALESCE(SUM(CAST(amount AS DECIMAL)), 0) as total_spent
        FROM transactions 
        WHERE user_id = ${userId} 
        AND transaction_type = 'expense'
        AND deleted_at IS NULL
        AND categories::text LIKE '%"id":"' || ${categoryId} || '"%'
      `);

      const totalSpent = Number(spendingResult[0]?.total_spent || 0);

      // Update the category's spent amount
      await db.update(t.categories)
        .set({ spent: totalSpent.toString() })
        .where(eq(t.categories.category_id, categoryId));

      // Get category details for budget checking
      const categoryResult = await db.select()
        .from(t.categories)
        .where(eq(t.categories.category_id, categoryId))
        .limit(1);

      if (categoryResult.length > 0) {
        const category = categoryResult[0];
        const budget = Number(category.budget || 0);
        
        if (budget > 0) {
          const spentPercentage = (totalSpent / budget) * 100;
          
          // Get user's budget threshold from notification settings
          const settingsResult = await db.select()
            .from(t.user_notification_settings)
            .where(eq(t.user_notification_settings.user_id, userId))
            .limit(1);

          const budgetThreshold = settingsResult.length > 0 
            ? settingsResult[0].budget_threshold 
            : 80; // Default to 80%

          const budgetAlertsEnabled = settingsResult.length > 0 
            ? settingsResult[0].budget_alerts 
            : true; // Default to enabled

          // Check if we should send a budget alert
          if (budgetAlertsEnabled && spentPercentage >= budgetThreshold) {
            // Check if we've already sent an alert for this threshold
            const existingAlert = await db.execute(sql`
              SELECT COUNT(*) as count
              FROM notifications 
              WHERE user_id = ${userId}
              AND type = 'budget_alert'
              AND message LIKE '%' || ${category.category_name} || '%'
              AND created_at >= CURRENT_TIMESTAMP - INTERVAL '1 day'
            `);

            const hasRecentAlert = Number(existingAlert[0]?.count || 0) > 0;

            if (!hasRecentAlert) {
              await createBudgetAlert(userId, category.category_name, Math.round(spentPercentage));
            }
          }
        }
      }
    }

    return { success: true, message: "Category spending updated successfully" };
  } catch (error) {
    console.error("Error updating category spending:", error);
    return { success: false, message: "Failed to update category spending", error };
  }
}