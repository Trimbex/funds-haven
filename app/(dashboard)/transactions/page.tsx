'use client'

import React from 'react'
import { TransactionsTable } from './transactions-table'
// import { TransactionsHeader } from './components/transactions-header'

export default function Transactions() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* <TransactionsHeader /> */}
            <div className="container mx-auto py-10">
                <TransactionsTable />
            </div>
        </div>
    )
}