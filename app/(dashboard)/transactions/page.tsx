'use client'

import React, { useEffect } from 'react'
import { TransactionsTable } from './transactions-table'
import { TransactionsProvider, useTransactions } from '@/app/context/transactionsContext'
// import { TransactionsHeader } from './components/transactions-header'

// Debug component to display transactions
function TransactionsDebug() {
  const { transactions, isLoading, error } = useTransactions();
  
  // No need to call fetchTransactions here as it's already being called in the context

  if (isLoading) return <div>Loading transactions...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div className="mt-4 p-4 bg-gray-100 rounded-md">
      <h3 className="text-lg font-medium mb-2">Transactions Debug View:</h3>
      <pre className="whitespace-pre-wrap text-xs overflow-auto max-h-96">
        {JSON.stringify(transactions, null, 2)}
      </pre>
    </div>
  );
}

export default function Transactions() {
    return (
        <TransactionsProvider>
            <div className="flex flex-col min-h-screen">
                {/* <TransactionsHeader /> */}
                <div className="container mx-auto py-10">
                    <TransactionsTable />
                    <TransactionsDebug />
                </div>
            </div>
        </TransactionsProvider>
    )
}