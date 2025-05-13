'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Transaction, TransactionType, TransactionStatus, PaymentMethod, TransactionCategory } from '@/app/server/transactions/transactions';
import { getCurrentUserID } from '../api/general';

// Define the shape of our context
interface TransactionsContextType {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  userID: string | null;
  categories: any[];
  fetchTransactions: (userId: string) => Promise<void>;
  addTransaction: (
    userId: string,
    transaction: {
      account_id?: string;
      categories: TransactionCategory[];
      amount: number;
      description?: string;
      transaction_date?: Date;
      transaction_type: TransactionType;
      payment_method?: PaymentMethod;
      status?: TransactionStatus;
      recurring?: boolean;
    }
  ) => Promise<Transaction | null>;
  updateTransaction: (
    transactionId: string,
    userId: string,
    updates: Partial<{
      account_id?: string;
      categories?: TransactionCategory[];
      amount?: number;
      description?: string;
      transaction_date?: Date;
      transaction_type?: TransactionType;
      payment_method?: PaymentMethod;
      status?: TransactionStatus;
      recurring?: boolean;
    }>
  ) => Promise<Transaction | null>;
  deleteTransaction: (transactionId: string, userId: string) => Promise<boolean>;
  filterTransactions: (filters: {
    type?: TransactionType;
    startDate?: Date;
    endDate?: Date;
    minAmount?: number;
    maxAmount?: number;
    categories?: string[];
    search?: string;
  }) => Transaction[];
}

// Create the context
const TransactionsContext = createContext<TransactionsContextType | undefined>(undefined);

// Provider component
export const TransactionsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userID, setUserID] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {

    const fetchUserID = async () => {
        try{
            const response = await getCurrentUserID();
            

            if(response.success){
                setUserID(response.userId);
                console.log("User ID:", response.userId);
            } 
            

        } 
        catch (error)
        {
           
                console.error('Failed to fetch user ID:', error);           
        }
}; 
fetchUserID(); 
},[]);



// useEffect(() => {
//   const addTestTransaction = async () => {
//     if (userID && transactions.length === 0) {
//       const testTransaction = {
//         amount: 100,
//         description: "Test Transaction",
//        transaction_date: new Date(),
//         transaction_type: "expense" as TransactionType,
//         categories: [{ id: null, name: "Test Category" }],
//         recurring: false,
//         status: "completed" as TransactionStatus
//       };

//       console.log("Adding test transaction:", testTransaction);
//       await addTransaction(userID, testTransaction);
//     }
//   };

//   addTestTransaction();
// }, [transactions, userID]);

  // Fetch all transactions for a user
  const fetchTransactions = async (userId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/transactions?user_id=${userId}`);
      const data = await response.json();
      
      if (data.success) {
        setTransactions(data.transactions.transactions || []);
       // console.log(data.transactions.transactions);
      } 
      else {
        setError(data.message || 'Failed to fetch transactions');
      }

      //Category fetching
      const responseCat = await fetch(`/api/categories?user_id=${userId}`)
      const dataCat = await responseCat.json();
      
      if (dataCat.success) {
        setCategories(dataCat.categories || []);
      }
    } catch (err) {
      setError('An error occurred while fetching transactions');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userID) {
      fetchTransactions(userID);
    }
  }, [userID]);

  // Add a new transaction
  const addTransaction = async (
    userId: string,
    transaction: {
      account_id?: string;
      categories: TransactionCategory[];
      amount: number;
      description?: string;
      transaction_date?: Date;
      transaction_type: TransactionType;
      payment_method?: PaymentMethod;
      status?: TransactionStatus;
      recurring?: boolean;
    }
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          ...transaction,
        }),
      });
      
      const data = await response.json();
      
      if (data.success && data.transaction) {
        setTransactions(prev => [data.transaction, ...prev]);
        return data.transaction;
      } else {
        setError(data.message || 'Failed to add transaction');
        return null;
      }
    } catch (err) {
      setError('An error occurred while adding the transaction');
      console.error(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Update an existing transaction
  const updateTransaction = async (
    transactionId: string,
    userId: string,
    updates: Partial<{
      account_id?: string;
      categories?: TransactionCategory[];
      amount?: number;
      description?: string;
      transaction_date?: Date;
      transaction_type?: TransactionType;
      payment_method?: PaymentMethod;
      status?: TransactionStatus;
      recurring?: boolean;
    }>
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/transactions', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transaction_id: transactionId,
          user_id: userId,
          ...updates,
        }),
      });
      
      const data = await response.json();
      
      if (data.success && data.transaction) {
        setTransactions(prev => 
          prev.map(t => t.transaction_id === transactionId ? data.transaction : t)
        );
        return data.transaction;
      } else {
        setError(data.message || 'Failed to update transaction');
        return null;
      }
    } catch (err) {
      setError('An error occurred while updating the transaction');
      console.error(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a transaction
  const deleteTransaction = async (transactionId: string, userId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/transactions', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transaction_id: transactionId,
          user_id: userId,
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setTransactions(prev => prev.filter(t => t.transaction_id !== transactionId));
        return true;
      } else {
        setError(data.message || 'Failed to delete transaction');
        return false;
      }
    } catch (err) {
      setError('An error occurred while deleting the transaction');
      console.error(err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Filter transactions based on criteria
  const filterTransactions = (filters: {
    type?: TransactionType;
    startDate?: Date;
    endDate?: Date;
    minAmount?: number;
    maxAmount?: number;
    categories?: string[];
    search?: string;
  }) => {
    return transactions.filter(transaction => {
      // Filter by transaction type
      if (filters.type && transaction.transaction_type !== filters.type) {
        return false;
      }
      
      // Filter by date range
      if (filters.startDate && new Date(transaction.transaction_date) < filters.startDate) {
        return false;
      }
      if (filters.endDate && new Date(transaction.transaction_date) > filters.endDate) {
        return false;
      }
      
      // Filter by amount range
      if (filters.minAmount !== undefined && transaction.amount < filters.minAmount) {
        return false;
      }
      if (filters.maxAmount !== undefined && transaction.amount > filters.maxAmount) {
        return false;
      }
      
      // Filter by categories
      if (filters.categories && filters.categories.length > 0) {
        const transactionCategoryIds = transaction.categories
          .map(cat => cat.id)
          .filter(id => id !== null) as string[];
          
        if (!filters.categories.some(catId => transactionCategoryIds.includes(catId))) {
          return false;
        }
      }
      
      // Filter by search term (in description)
      if (filters.search && !transaction.description?.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      
      return true;
    });
  };

  const value = {
    transactions,
    isLoading,
    error,
    userID,
    categories,
    fetchTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    filterTransactions,
  };

  return (
    <TransactionsContext.Provider value={value}>
      {children}
    </TransactionsContext.Provider>
  );
};

// Custom hook to use the transactions context
export const useTransactions = () => {
  const context = useContext(TransactionsContext);
  if (context === undefined) {
    throw new Error('useTransactions must be used within a TransactionsProvider');
  }
  return context;
};