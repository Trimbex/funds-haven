'use server';

import { db } from '@/app/db';
import { transactions, recurrence_settings } from '@/app/db/schema';
import { eq, and, isNull, gte } from 'drizzle-orm';


export type RecurrenceFrequency = 'weekly' | 'monthly' | 'yearly';
export type UpdateType = 'single' | 'future' | 'all';

export type RecurrenceSettings = {
  recurrence_id: string;
  user_id: string;
  frequency: RecurrenceFrequency;
  interval: number;
  start_date: Date;
  end_date?: Date;
  updated_at?: Date;
  created_at?: Date;
};

export type CreateRecurrenceInput = Omit<RecurrenceSettings, 'recurrence_id' | 'user_id' | 'updated_at' | 'created_at'>;
export type UpdateRecurrenceInput = Partial<Omit<RecurrenceSettings, 'recurrence_id' | 'user_id' | 'updated_at' | 'created_at'>>;

export async function getRecurrenceSettings(recurrenceId: string, userId: string) {
  try {
    const settings = await db.select()
      .from(recurrence_settings)
      .where(and(
        eq(recurrence_settings.recurrence_id, recurrenceId),
        eq(recurrence_settings.user_id, userId)
      ))
      .limit(1); 

    if (settings.length === 0) {
      return { success: false, message: 'Recurrence settings not found or not authorized' };
    }

    return { success: true, settings: settings[0] };
  } 
  catch (error) {
    console.error('Error fetching recurrence settings:', error);
    throw error;
  }
}

export async function createRecurrenceSettings(userId: string, transactionId: string, input: CreateRecurrenceInput) {
    try{

    const existingTransaction = await db.select()
      .from(transactions)
      .where(and(
        eq(transactions.transaction_id, transactionId),
        eq(transactions.user_id, userId),
        isNull(transactions.deleted_at)
      ))
      .limit(1);
    
    if (existingTransaction.length === 0) {
      return { success: false, message: 'Transaction not found or not authorized' };
    }

        const recurrenceResult = await db.insert(recurrence_settings).values({
            user_id: userId,
            transaction_id: transactionId,
            frequency: input.frequency,
            interval: input.interval || 1,
            start_date: input.start_date || new Date(),
            end_date: input.end_date,
        }).returning();


        if (recurrenceResult.length === 0) {
          return { success: false, message: 'Failed to create recurrence settings' };
        }


    // Update the transaction to link it with the recurrence settings
        const updateResult = await db.update(transactions)
        .set({
        recurrence_id: recurrenceResult[0].recurrence_id,
        updated_at: new Date(),
        })
        .where(eq(transactions.transaction_id, transactionId))
        .returning();

    if (updateResult.length === 0) {
        // Rollback recurrence settings creation if transaction update fails
        await db.delete(recurrence_settings)
        .where(eq(recurrence_settings.recurrence_id, recurrenceResult[0].recurrence_id));
        
        return { success: false, message: 'Failed to link transaction with recurrence settings' };
    }
    } 
    catch (error) {
        console.error('Error creating recurrence:', error);
        throw error;
    }
    
}

