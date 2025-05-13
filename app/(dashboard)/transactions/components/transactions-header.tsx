'use client'

import React, { useEffect, useState } from 'react'
import { ArrowUpRight, ArrowDownRight, Wallet, Calendar } from 'lucide-react'
import { useTransactions } from '@/app/context/transactionsContext'
import DashboardHeader, { StatCard } from '@/app/components/DashboardHeader'

export function TransactionsHeader() {
  const { transactions, isLoading } = useTransactions()
  const [stats, setStats] = useState({
    totalTransactions: 0,
    totalIncome: 0,
    totalExpenses: 0,
    netBalance: 0,
    recentTransactions: 0
  })

  useEffect(() => {
    if (!isLoading && transactions.length > 0) {
      // Calculate statistics
      const now = new Date()
      const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30))
      
      const totalIncome = transactions
        .filter(t => t.transaction_type === 'income')
        .reduce((sum, t) => sum + Number(t.amount), 0)
      
      const totalExpenses = transactions
        .filter(t => t.transaction_type === 'expense')
        .reduce((sum, t) => sum + Number(t.amount), 0)
      
      const recentTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.transaction_date)
        return transactionDate >= thirtyDaysAgo
      }).length
      
      setStats({
        totalTransactions: transactions.length,
        totalIncome,
        totalExpenses,
        netBalance: totalIncome - totalExpenses,
        recentTransactions
      })
    }
  }, [transactions, isLoading])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const statCards: StatCard[] = [
    {
      title: 'Total Income',
      value: formatCurrency(stats.totalIncome),
      description: 'Based on all transactions',
      icon: ArrowUpRight,
      iconColor: 'text-green-300',
      iconBgColor: 'bg-green-500'
    },
    {
      title: 'Total Expenses',
      value: formatCurrency(stats.totalExpenses),
      description: 'Based on all transactions',
      icon: ArrowDownRight,
      iconColor: 'text-red-300',
      iconBgColor: 'bg-red-500'
    },
    {
      title: 'Net Balance',
      value: formatCurrency(stats.netBalance),
      description: 'Income minus expenses',
      icon: Wallet,
      iconColor: 'text-blue-300',
      iconBgColor: 'bg-blue-500'
    },
    {
      title: 'Recent Activity',
      value: stats.recentTransactions,
      description: 'Transactions in last 30 days',
      icon: Calendar,
      iconColor: 'text-purple-300',
      iconBgColor: 'bg-purple-500'
    }
  ];

  return (
    <DashboardHeader
      title="Transaction Overview"
      subtitle="Manage your income and expenses efficiently"
      stats={statCards}
    />
  )
} 