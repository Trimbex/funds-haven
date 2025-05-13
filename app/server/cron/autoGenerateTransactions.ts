'use server';

import { db } from '@/app/db';
import { recurrence_settings, transactions } from '@/app/db/schema';
import { eq, lt, isNull, desc, and } from 'drizzle-orm';
import { getRecurrenceSettings } from '../transactions/recurrence';
import { addTransaction, TransactionCategory } from '../transactions/transactions';

/**
 * Check and generate upcoming recurring transactions
 * This function can be called periodically from a cron job or manually triggered
 */
export async function checkAndGenerateRecurringTransactions() {
  console.log("Starting automatic generation of recurring transactions...");
  
  try {
    // Get all active recurrence settings
    const recurringSettings = await db.select()
      .from(recurrence_settings)
      .where(
        and(
          isNull(recurrence_settings.end_date),
          // Or end date is in the future
          lt(new Date(), recurrence_settings.end_date)
        )
      );
    
    console.log(`Found ${recurringSettings.length} active recurrence patterns`);
    
    let generatedCount = 0;

    // Process each recurrence setting
    for (const settings of recurringSettings) {
      // Find the parent transaction (the original one with the recurrence setting)
      const parentTransactions = await db.select()
        .from(transactions)
        .where(
          and(
            eq(transactions.recurrence_id, settings.recurrence_id), 
            isNull(transactions.parent_transaction_id),
            isNull(transactions.deleted_at)
          )
        )
        .limit(1);
      
      if (parentTransactions.length === 0) {
        console.log(`No parent transaction found for recurrence ID: ${settings.recurrence_id}`);
        continue;
      }
      
      const parentTransaction = parentTransactions[0];
      
      // Find the most recent instance of this recurring transaction
      const recentInstances = await db.select()
        .from(transactions)
        .where(
          and(
            eq(transactions.recurrence_id, settings.recurrence_id),
            isNull(transactions.deleted_at)
          )
        )
        .orderBy(desc(transactions.transaction_date))
        .limit(1);
      
      // Determine the start date for generation
      let lastDate = recentInstances.length > 0 
        ? new Date(recentInstances[0].transaction_date) 
        : new Date(settings.start_date);
      
      // Calculate the date for the next transaction
      const now = new Date();
      let nextDate = calculateNextDate(lastDate, settings.frequency, settings.interval || 1);
      
      // Generate transactions up to 90 days in the future or until the end date
      const futureLimit = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000); // 90 days from now
      const endDate = settings.end_date ? new Date(settings.end_date) : futureLimit;
      const generateUntil = endDate < futureLimit ? endDate : futureLimit;
      
      console.log(`Generating transactions for recurrence ${settings.recurrence_id} from ${nextDate.toISOString()} to ${generateUntil.toISOString()}`);
      
      // Generate transactions up to the generate_until date
      let count = 0;
      const MAX_TRANSACTIONS = 10; // Safety limit per recurrence pattern
      
      while (nextDate <= generateUntil && count < MAX_TRANSACTIONS) {
        // Check if the transaction already exists for this date (to avoid duplicates)
        const existingTransactions = await db.select()
          .from(transactions)
          .where(
            and(
              eq(transactions.recurrence_id, settings.recurrence_id),
              eq(transactions.transaction_date, nextDate),
              isNull(transactions.deleted_at)
            )
          );
        
        if (existingTransactions.length === 0) {
          // Create a new transaction based on the parent
          const newTransaction = {
            description: parentTransaction.description,
            amount: parentTransaction.amount,
            transaction_date: nextDate,
            transaction_type: parentTransaction.transaction_type,
            categories: parentTransaction.categories as unknown as TransactionCategory[],
            status: parentTransaction.status,
            recurrence_id: settings.recurrence_id,
            parent_transaction_id: parentTransaction.transaction_id,
            // Only include account_id if it's a valid UUID
            ...(parentTransaction.account_id && typeof parentTransaction.account_id === 'string' && 
              /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(parentTransaction.account_id) ? 
              { account_id: parentTransaction.account_id } : {})
          };
          
          try {
            const result = await addTransaction(parentTransaction.user_id, newTransaction);
            if (result.success) {
              generatedCount++;
              console.log(`Generated transaction for date: ${nextDate.toISOString()}`);
            } else {
              console.error(`Failed to create transaction: ${result.message}`);
            }
          } catch (err) {
            console.error('Error creating transaction:', err);
          }
        } else {
          console.log(`Transaction already exists for date: ${nextDate.toISOString()}`);
        }
        
        // Calculate the next date
        const oldDate = new Date(nextDate);
        nextDate = calculateNextDate(nextDate, settings.frequency, settings.interval || 1);
        console.log(`Advanced date from ${oldDate.toISOString()} to ${nextDate.toISOString()}`);
        
        count++;
      }
    }
    
    console.log(`Auto-generation complete. Generated ${generatedCount} transactions.`);
    return { success: true, message: `Generated ${generatedCount} transactions` };
  } catch (error) {
    console.error("Error in auto-generation of recurring transactions:", error);
    return { 
      success: false, 
      message: 'Failed to auto-generate recurring transactions',
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

// Helper function to calculate the next date based on frequency and interval
function calculateNextDate(currentDate: Date, frequency: string, interval: number): Date {
  const nextDate = new Date(currentDate);
  
  switch (frequency) {
    case 'weekly':
      nextDate.setDate(nextDate.getDate() + (7 * interval));
      break;
    case 'monthly':
      nextDate.setMonth(nextDate.getMonth() + interval);
      break;
    case 'yearly':
      nextDate.setFullYear(nextDate.getFullYear() + interval);
      break;
    default:
      // Default to weekly if frequency is unknown
      nextDate.setDate(nextDate.getDate() + 7);
  }
  
  return nextDate;
} 