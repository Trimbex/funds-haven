'use client'

import { db } from '@/app/db/index'
import * as t from '@/app/db/schema'
import { eq } from 'drizzle-orm';
import { supabase } from '@/app/utils/supabase/client'


export async function getCurrentUserID() {
        
    try {
      const { data, error } = await supabase.auth.getUser();
      
      if (error) throw error; // Explicitly handle Supabase errors
  
      const userId = data.user.id;
  
      if (!userId) {
        return {
          success: false,
          message: "User is not logged in.",
          userId: null,
        };
      }
  
      return {
        success: true,
        message: "User ID retrieved successfully.",
        userId,
      };
    } catch (error) {
      console.error("Error fetching user ID:", error);
      return {
        success: false,
        message: "Failed to retrieve user ID.",
        error: error instanceof Error ? error.message : "Unknown error",
        userId: null,
      };
    }
  }


