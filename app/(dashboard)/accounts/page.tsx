'use client';

import React from 'react';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BankCard from "./bank-card";
import AddAccount from './add-account'; 
import { AccountCardSkeleton, DashboardStatsSkeleton } from "@/components/ui/skeletons";
import { AccountsProvider, useAccounts } from '@/app/context/accountContext';
import { 
  CreditCard, 
  BadgeDollarSign, 
  CircleCheck, 
  Clock, 
  Plus,
  Building2
} from "lucide-react";

function AccountsContent() {
  const { accounts, loading, showDialog, setShowDialog, dialogLoading, addAccount } = useAccounts();

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

  if (loading) {
    return (
      <div className="space-y-8">
        {/* Header Skeleton */}
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="h-8 w-64 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-96 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <DashboardStatsSkeleton />
        </div>
        
        {/* Accounts Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <AccountCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-6"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              My <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Accounts</span>
            </h1>
            <p className="text-gray-600 text-lg">Manage your financial accounts and track your balances across all institutions.</p>
          </div>
          
          <Button
            onClick={() => setShowDialog(true)}
            className="btn-primary"
            disabled={dialogLoading}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New Account
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="stat-card group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Accounts</p>
                  <p className="text-2xl font-bold text-gray-900">{accounts.length}</p>
                  <p className="text-xs text-gray-500 mt-1">Connected institutions</p>
                </div>
                <div className="p-3 rounded-2xl bg-gradient-to-r from-purple-500 to-purple-600 group-hover:scale-110 transition-transform duration-300">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="stat-card group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Balance</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalBalance)}</p>
                  <p className="text-xs text-gray-500 mt-1">Across all accounts</p>
                </div>
                <div className="p-3 rounded-2xl bg-gradient-to-r from-green-500 to-green-600 group-hover:scale-110 transition-transform duration-300">
                  <BadgeDollarSign className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="stat-card group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Verified</p>
                  <p className="text-2xl font-bold text-gray-900">{verifiedAccounts}</p>
                  <p className="text-xs text-gray-500 mt-1">of {accounts.length} accounts</p>
                </div>
                <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 group-hover:scale-110 transition-transform duration-300">
                  <CircleCheck className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="stat-card group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Last Update</p>
                  <p className="text-2xl font-bold text-gray-900">{lastUpdateDate.getDate()}</p>
                  <p className="text-xs text-gray-500 mt-1">{lastUpdateDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</p>
                </div>
                <div className="p-3 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 group-hover:scale-110 transition-transform duration-300">
                  <Clock className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Accounts Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {accounts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {accounts.map((account, index) => (
              <BankCard 
                key={account.account_id}
                account={account}
                index={index}
              />
            ))}

            {/* Add Account Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: accounts.length * 0.1 }}
              className="w-full max-w-sm"
            >
              <Card className="h-full border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors duration-300 bg-gray-50/50 hover:bg-blue-50/50">
                <CardContent className="flex flex-col items-center justify-center h-64 text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center">
                    <Plus className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Add New Account</h3>
                    <p className="text-sm text-gray-600 mb-4">Connect another financial institution to track more accounts</p>
                    <Button
                      onClick={() => setShowDialog(true)}
                      disabled={dialogLoading}
                      className="btn-primary"
                    >
                      {dialogLoading ? 'Adding...' : 'Add Account'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        ) : (
          <Card className="card-modern">
            <CardContent className="py-16 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No Accounts Connected
                </h3>
                <p className="text-gray-600 mb-6">
                  Get started by connecting your first financial account to begin tracking your finances.
                </p>
                <Button 
                  onClick={() => setShowDialog(true)}
                  className="btn-primary"
                  disabled={dialogLoading}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  {dialogLoading ? 'Adding...' : 'Connect Your First Account'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </motion.div>

      {/* Add Account Modal */}
      <AddAccount />
    </div>
  );
}

export default function Accounts() {
  return (
    <AccountsProvider>
      <AccountsContent />
    </AccountsProvider>
  );
}