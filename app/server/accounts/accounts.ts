'use server'

import { db } from '@/app/db/index'
import * as t from '@/app/db/schema'
import { eq } from 'drizzle-orm';
import { supabase } from '@/app/utils/supabase/client'

export async function getAccounts(id: string) {
    const accounts = await db.select().from(t.accounts).where(eq(t.accounts.user_id, id));
    return accounts;
}


export async function addAccount(user_id: string, account_name: string, account_type: string, balance: string, cardno: string, isVerified: boolean, card_company?: string) {
    try {
      const result = await db.insert(t.accounts).values({
        user_id,
        account_name,
        account_type,
        balance: balance.toString(),
        cardno,
        isVerified,
        card_company
      });
  
      return { success: true, message: "Account added successfully", result };
    } catch (error) {
      console.error("Error adding account:", error);
      return { success: false, message: "Failed to add account", error };
    }
  }

export async function editAccount(account_id: string, account_name: string, account_type: string, balance: string, cardno: string, isVerified?: boolean, card_company?: string) {
    try {
        const result = await db.update(t.accounts).set({
            account_name,
            account_type,
            balance,
            cardno,
            isVerified,
            card_company
        }).where(eq(t.accounts.account_id, account_id));
    
        return { success: true, message: "Account updated successfully", result };
        } catch (error) {
        console.error("Error updating account:", error);
    }
}

export async function deleteAccount(account_id: string) {
    try {
      const result = await db.delete(t.accounts).where(eq(t.accounts.account_id, account_id));
      return { success: true, message: "Account deleted successfully", result };
    } catch (error) {
      console.error("Error deleting account:", error);
      return { success: false, message: "Failed to delete account", error };
    }
  }






