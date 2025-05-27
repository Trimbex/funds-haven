'use client';

import React from 'react';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import BankCard from "./bank-card";
import AddAccount from './add-account'; 
import DotLoader from "@/components/loader/loader";
import { AccountsProvider, useAccounts } from '@/app/context/accountContext';
import DashboardHeader, { StatCard } from '@/app/components/DashboardHeader';
import { CreditCard, BadgeDollarSign, CircleCheck, Clock } from "lucide-react";

function AccountsContent() {
  const { accounts, loading, showDialog, setShowDialog, dialogLoading, addAccount } = useAccounts();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <DotLoader />
      </div>
    );
  }

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
    <div className="container mx-auto py-10">
      <DashboardHeader
        title="My Accounts"
        subtitle="Manage your accounts and track your balances"
        stats={statCards}
        actionButton={{
          label: "Add New Account",
          onClick: () => setShowDialog(true)
        }}
      />

      {/* Accounts List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ml-16 md:ml-24 lg:ml-48 gap-6 mb-20">
        
        {accounts.map((account, index) => (
          <motion.div 
            key={account.account_id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.1 }}
          >
            <BankCard 
              account={account}
              index={index}
            />
          </motion.div>
        ))}

        {/* Add Account Button */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: accounts.length * 0.1 }}
          className="mt-10 max-w-md"
        >
          <Button
            variant="outline"
            className="w-full h-full flex flex-col border-4 border-dotted border-gray-500"
            onClick={() => setShowDialog(true)}
            disabled={dialogLoading}
          >
            {dialogLoading ? (
              <span className="text-8xl font-mono text-gray-600">...</span>
            ) : (
              <span className="text-8xl font-mono text-gray-600">+</span>
            )}
          </Button>
        </motion.div>
      </div>

      {/* Add Account Modal */}
      <AddAccount />
    </div>
  );
}

// Wrapper component that provides the context
export default function Accounts() {
  return (
    <AccountsProvider>
      <AccountsContent />
    </AccountsProvider>
  );
}