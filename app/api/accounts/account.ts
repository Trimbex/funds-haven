'use server'

import { db } from '@/app/db/index'
import * as t from '@/app/db/schema'
import { eq } from 'drizzle-orm';
import { supabase } from '@/app/utils/supabase/client'


export async function addAccount(user_id: string, account_name: string, account_type: string, balance: string, cardno: string, isVerified: boolean) {

    await db.insert(t.accounts).values({
      user_id: user_id,
      account_name: account_name,
      account_type: account_type,
      balance: balance,
      cardno: cardno,
      isVerified: isVerified
    });
    
}



export async function getAccounts(id: string) {
    const accounts = await db.select().from(t.accounts).where(eq(t.accounts.user_id, id));
    return accounts;
}



