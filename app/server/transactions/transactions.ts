'use server';

import { db } from '@/app/db';
import { transactions } from '@/app/db/schema';
import { eq, and, desc, isNull } from 'drizzle-orm';
// import { v4 as uuidv4 } from 'uuid';

// Type definitions
export type TransactionType = 'income' | 'expense';
export type TransactionStatus = 'completed' | 'pending' | 'failed';
export type PaymentMethod = 'cash' | 'credit' | 'debit' | 'transfer' | 'other';

export type TransactionCategory = {
  id: string | null;
  name: string;
};

export type Transaction = {
  transaction_id: string;
  user_id: string;
  account_id?: string;
  categories: TransactionCategory[];
  amount: number;
  description?: string;
  transaction_date: Date;
  transaction_type: TransactionType;
  payment_method?: PaymentMethod;
  status: TransactionStatus;
  recurring: boolean;
  updated_at?: Date;
  created_at?: Date;
  deleted_at?: Date;
};

export type CreateTransactionInput = Omit<Transaction, 'transaction_id' | 'user_id' | 'created_at' | 'updated_at' | 'deleted_at'>;
export type UpdateTransactionInput = Partial<Omit<Transaction, 'transaction_id' | 'user_id' | 'created_at' | 'updated_at' | 'deleted_at'>>;

export async function getTransactions(userId: string) {
  try {
    const result = await db.select()
      .from(transactions)
      .where(and(
        eq(transactions.user_id, userId),
        isNull(transactions.deleted_at)
      ))
      .orderBy(desc(transactions.transaction_date));
    
    return { success: true, message: 'Transactions retrieved successfully', transactions: result };
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return { success: false, message: 'Failed to fetch transactions', error: error instanceof Error ? error.message : String(error) };
  }
}


export async function addTransaction(userId: string, input: Omit<CreateTransactionInput, 'user_id'>) {
  try {
    const newTransaction = {
      user_id: userId,
      account_id: input.account_id,
      categories: input.categories || [],
      amount: input.amount,
      description: input.description || '',
      transaction_date: new Date(input.transaction_date) || new Date(),
      transaction_type: input.transaction_type,
      payment_method: input.payment_method,
      status: input.status || 'completed',
      recurring: input.recurring || false,
    };

    const result = await db.insert(transactions).values(newTransaction).returning();

    return { success: true, message: 'Transaction added successfully', transaction: result[0] };
  } catch (error) {
    console.error('Error adding transaction:', error);
    return { success: false, message: 'Failed to add transaction', error: error instanceof Error ? error.message : String(error) };
  }
}

  // WHILE userId isn't needed, its just an additional security check
export async function editTransaction(transactionId: string, userId: string, input: UpdateTransactionInput) {
  try {

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
    
    // Update the transaction
    const result = await db.update(transactions)
      .set({
        account_id: input.account_id !== undefined ? input.account_id : existingTransaction[0].account_id,
        categories: input.categories !== undefined ? input.categories : existingTransaction[0].categories,
        amount: input.amount !== undefined ? input.amount : existingTransaction[0].amount,
        description: input.description !== undefined ? input.description : existingTransaction[0].description,
        transaction_date: input.transaction_date !== undefined ? input.transaction_date : existingTransaction[0].transaction_date,
        transaction_type: input.transaction_type !== undefined ? input.transaction_type : existingTransaction[0].transaction_type,
        payment_method: input.payment_method !== undefined ? input.payment_method : existingTransaction[0].payment_method,
        status: input.status !== undefined ? input.status : existingTransaction[0].status,
        recurring: input.recurring !== undefined ? input.recurring : existingTransaction[0].recurring,
        updated_at: new Date(),
      })
      .where(and(
        eq(transactions.transaction_id, transactionId),
        eq(transactions.user_id, userId)
      ))
      .returning();
    
    if (result.length === 0) {
      return { success: false, message: 'Failed to update transaction' };
    }
    
    return { success: true, message: 'Transaction updated successfully', transaction: result[0] };
  } catch (error) {
    console.error('Error updating transaction:', error);
    return { success: false, message: 'Failed to update transaction', error: error instanceof Error ? error.message : String(error) };
  }
}

export async function deleteTransaction(transactionId: string, userId: string) {
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
    
    // Soft delete the transaction by setting deleted_at
    const result = await db.update(transactions)
      .set({
        deleted_at: new Date(),
      })
      .where(and(
        eq(transactions.transaction_id, transactionId),
        eq(transactions.user_id, userId)
      ))
      .returning();
    
    if (result.length === 0) {
      return { success: false, message: 'Failed to delete transaction' };
    }
    
    return { success: true, message: 'Transaction deleted successfully' };
  } catch (error) {
    console.error('Error deleting transaction:', error);
    return { success: false, message: 'Failed to delete transaction', error: error instanceof Error ? error.message : String(error) };
  }
}