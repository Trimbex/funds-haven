'use server';

import { db } from '@/app/db';
import { transactions, recurrence_settings } from '@/app/db/schema';
import { eq, and, isNull, gte } from 'drizzle-orm';
import { addMonths, addWeeks, addYears, format } from 'date-fns';

// Type definitions
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

// Create a new recurrence setting and link it to a transaction
export async function createRecurrence(userId: string, transactionId: string, input: CreateRecurrenceInput) {
  try {
    // First, check if the transaction exists and belongs to the user
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

    // Create recurrence settings
    const newRecurrenceSettings = {
      user_id: userId,
      frequency: input.frequency,
      interval: input.interval || 1,
      start_date: input.start_date || new Date(),
      end_date: input.end_date,
    };

    const recurrenceResult = await db.insert(recurrence_settings)
      .values(newRecurrenceSettings)
      .returning();

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

    // Generate future transactions based on recurrence settings
    const futureTransactions = await generateFutureTransactions(userId, transactionId, recurrenceResult[0]);

    return { 
      success: true, 
      message: 'Recurrence settings created successfully', 
      recurrence: recurrenceResult[0],
      futureTransactions 
    };
  } catch (error) {
    console.error('Error creating recurrence settings:', error);
    return { success: false, message: 'Failed to create recurrence settings', error: error instanceof Error ? error.message : String(error) };
  }
}

// Generate future transactions based on recurrence settings
export async function generateFutureTransactions(userId: string, parentTransactionId: string, recurrenceSettings: RecurrenceSettings, limit = 12) {
  try {
    // Get the parent transaction
    const parentTransaction = await db.select()
      .from(transactions)
      .where(and(
        eq(transactions.transaction_id, parentTransactionId),
        eq(transactions.user_id, userId)
      ))
      .limit(1);

    if (parentTransaction.length === 0) {
      return { success: false, message: 'Parent transaction not found' };
    }

    const parent = parentTransaction[0];
    const startDate = new Date(parent.transaction_date);
    const endDate = recurrenceSettings.end_date ? new Date(recurrenceSettings.end_date) : null;
    const futureTransactions = [];

    // Calculate future dates based on frequency and interval
    for (let i = 1; i <= limit; i++) {
      let nextDate;
      
      switch (recurrenceSettings.frequency) {
        case 'weekly':
          nextDate = addWeeks(startDate, i * recurrenceSettings.interval);
          break;
        case 'monthly':
          nextDate = addMonths(startDate, i * recurrenceSettings.interval);
          break;
        case 'yearly':
          nextDate = addYears(startDate, i * recurrenceSettings.interval);
          break;
        default:
          nextDate = addMonths(startDate, i);
      }

      // Stop if we've reached the end date
      if (endDate && nextDate > endDate) {
        break;
      }

      // Create a new transaction based on the parent
      const newTransaction = {
        user_id: userId,
        account_id: parent.account_id,
        categories: parent.categories,
        amount: parent.amount,
        description: parent.description,
        transaction_date: nextDate,
        transaction_type: parent.transaction_type,
        payment_method: parent.payment_method,
        status: 'pending', // Future transactions are pending by default
        recurrence_id: recurrenceSettings.recurrence_id,
        parent_transaction_id: parentTransactionId,
      };

      const result = await db.insert(transactions)
        .values(newTransaction)
        .returning();

      if (result.length > 0) {
        futureTransactions.push(result[0]);
      }
    }

    return { success: true, message: 'Future transactions generated successfully', transactions: futureTransactions };
  } catch (error) {
    console.error('Error generating future transactions:', error);
    return { success: false, message: 'Failed to generate future transactions', error: error instanceof Error ? error.message : String(error) };
  }
}

// Update recurrence settings
export async function updateRecurrence(recurrenceId: string, userId: string, input: UpdateRecurrenceInput, updateType: UpdateType = 'future') {
  try {
    // First, check if the recurrence settings exist and belong to the user
    const existingRecurrence = await db.select()
      .from(recurrence_settings)
      .where(and(
        eq(recurrence_settings.recurrence_id, recurrenceId),
        eq(recurrence_settings.user_id, userId)
      ))
      .limit(1);
    
    if (existingRecurrence.length === 0) {
      return { success: false, message: 'Recurrence settings not found or not authorized' };
    }

    // Update the recurrence settings
    const updateResult = await db.update(recurrence_settings)
      .set({
        frequency: input.frequency !== undefined ? input.frequency : existingRecurrence[0].frequency,
        interval: input.interval !== undefined ? input.interval : existingRecurrence[0].interval,
        start_date: input.start_date !== undefined ? input.start_date : existingRecurrence[0].start_date,
        end_date: input.end_date !== undefined ? input.end_date : existingRecurrence[0].end_date,
        updated_at: new Date(),
      })
      .where(eq(recurrence_settings.recurrence_id, recurrenceId))
      .returning();

    if (updateResult.length === 0) {
      return { success: false, message: 'Failed to update recurrence settings' };
    }

    // Handle updates to existing recurring transactions based on updateType
    if (updateType === 'all' || updateType === 'future') {
      // Get the parent transaction
      const parentTransaction = await db.select()
        .from(transactions)
        .where(and(
          eq(transactions.recurrence_id, recurrenceId),
          isNull(transactions.parent_transaction_id)
        ))
        .limit(1);

      if (parentTransaction.length > 0) {
        const today = new Date();
        
        // Delete existing future transactions
        await db.update(transactions)
          .set({ deleted_at: new Date() })
          .where(and(
            eq(transactions.recurrence_id, recurrenceId),
            gte(transactions.transaction_date, today),
            updateType === 'future' ? isNull(transactions.parent_transaction_id).not() : undefined
          ));

        // Regenerate future transactions
        await generateFutureTransactions(userId, parentTransaction[0].transaction_id, updateResult[0]);
      }
    }

    return { success: true, message: 'Recurrence settings updated successfully', recurrence: updateResult[0] };
  } catch (error) {
    console.error('Error updating recurrence settings:', error);
    return { success: false, message: 'Failed to update recurrence settings', error: error instanceof Error ? error.message : String(error) };
  }
}

// Delete recurrence settings and associated transactions
export async function deleteRecurrence(recurrenceId: string, userId: string, deleteType: UpdateType = 'future') {
  try {
    // First, check if the recurrence settings exist and belong to the user
    const existingRecurrence = await db.select()
      .from(recurrence_settings)
      .where(and(
        eq(recurrence_settings.recurrence_id, recurrenceId),
        eq(recurrence_settings.user_id, userId)
      ))
      .limit(1);
    
    if (existingRecurrence.length === 0) {
      return { success: false, message: 'Recurrence settings not found or not authorized' };
    }

    // Handle deletion of recurring transactions based on deleteType
    if (deleteType === 'all') {
      // Soft delete all transactions with this recurrence_id
      await db.update(transactions)
        .set({ deleted_at: new Date(), recurrence_id: null })
        .where(eq(transactions.recurrence_id, recurrenceId));
    } else if (deleteType === 'future') {
      // Soft delete future transactions only
      const today = new Date();
      await db.update(transactions)
        .set({ deleted_at: new Date(), recurrence_id: null })
        .where(and(
          eq(transactions.recurrence_id, recurrenceId),
          gte(transactions.transaction_date, today),
          isNull(transactions.parent_transaction_id).not()
        ));
    } else if (deleteType === 'single') {
      // Don't delete any transactions, just remove the recurrence link
      await db.update(transactions)
        .set({ recurrence_id: null })
        .where(eq(transactions.recurrence_id, recurrenceId));
    }

    // Delete the recurrence settings
    const deleteResult = await db.delete(recurrence_settings)
      .where(eq(recurrence_settings.recurrence_id, recurrenceId))
      .returning();

    if (deleteResult.length === 0) {
      return { success: false, message: 'Failed to delete recurrence settings' };
    }

    return { success: true, message: 'Recurrence settings deleted successfully' };
  } catch (error) {
    console.error('Error deleting recurrence settings:', error);
    return { success: false, message: 'Failed to delete recurrence settings', error: error instanceof Error ? error.message : String(error) };
  }
}

// Get all recurrence settings for a user
export async function getRecurrenceSettings(userId: string) {
  try {
    const result = await db.select()
      .from(recurrence_settings)
      .where(eq(recurrence_settings.user_id, userId));
    
    return { success: true, message: 'Recurrence settings retrieved successfully', recurrenceSettings: result };
  } catch (error) {
    console.error('Error fetching recurrence settings:', error);
    return { success: false, message: 'Failed to fetch recurrence settings', error: error instanceof Error ? error.message : String(error) };
  }
}

// Get all transactions in a recurrence series
export async function getRecurrenceTransactions(recurrenceId: string, userId: string) {
  try {
    const result = await db.select()
      .from(transactions)
      .where(and(
        eq(transactions.recurrence_id, recurrenceId),
        eq(transactions.user_id, userId),
        isNull(transactions.deleted_at)
      ))
      .orderBy(transactions.transaction_date);
    
    return { success: true, message: 'Recurrence transactions retrieved successfully', transactions: result };
  } catch (error) {
    console.error('Error fetching recurrence transactions:', error);
    return { success: false, message: 'Failed to fetch recurrence transactions', error: error instanceof Error ? error.message : String(error) };
  }
}