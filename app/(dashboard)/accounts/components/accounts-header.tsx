'use client';

import React from 'react';
import { CreditCard, BadgeDollarSign, CircleCheck, Clock } from "lucide-react";
import { useAccounts } from '@/app/context/accountContext';
import DashboardHeader, { StatCard } from '@/app/components/DashboardHeader';

export function AccountsHeader() {
  const { accounts, setShowDialog } = useAccounts();

  const totalBalance = accounts.reduce((sum, account) => sum + Number(account.balance), 0);
  const verifiedAccounts = accounts.filter(acc => acc.isVerified).length;
  const lastUpdateDate = accounts.length > 0 
    ? new Date(accounts.reduce((latest, account) => 
        new Date(account.created_at || '2000-01-01') > new Date(latest.created_at || '2000-01-01') 
          ? account 
          : latest
      ).created_at || new Date())
    : new Date();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const statCards: StatCard[] = [
    {
      title: 'Total Accounts',
      value: accounts.length,
      description: 'All linked accounts',
      icon: CreditCard,
      iconColor: 'text-purple-300',
      iconBgColor: 'bg-purple-500'
    },
    {
      title: 'Total Balance',
      value: formatCurrency(totalBalance),
      description: 'Combined balance across all accounts',
      icon: BadgeDollarSign,
      iconColor: 'text-green-300',
      iconBgColor: 'bg-green-500'
    },
    {
      title: 'Verified Accounts',
      value: verifiedAccounts,
      description: `${verifiedAccounts} of ${accounts.length} accounts verified`,
      icon: CircleCheck,
      iconColor: 'text-blue-300',
      iconBgColor: 'bg-blue-500'
    },
    {
      title: 'Last Update',
      value: lastUpdateDate.toLocaleDateString(),
      description: 'Latest account activity',
      icon: Clock,
      iconColor: 'text-orange-300',
      iconBgColor: 'bg-orange-500'
    }
  ];

  return (
    <DashboardHeader
      title="My Accounts"
      subtitle="Manage your accounts and track your balances"
      stats={statCards}
      actionButton={{
        label: "Add New Account",
        onClick: () => setShowDialog(true)
      }}
    />
  );
} 