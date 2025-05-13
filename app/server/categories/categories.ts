'use server'

import { db } from '@/app/db/index'
import * as t from '@/app/db/schema'
import { eq } from 'drizzle-orm';

export async function getCategories(id: string) {
    const categories = await db.select().from(t.categories).where(eq(t.categories.user_id, id));
    return categories;
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