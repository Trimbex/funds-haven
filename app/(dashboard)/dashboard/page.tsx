'use client';

import React, { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useDashboardAnalytics } from '@/app/hooks/useDashboardAnalytics';
import CategoryPieChart from './components/CategoryPieChart';
import BudgetBarChart from './components/BudgetBarChart';

// Lazy load dashboard sections
const QuickStats = lazy(() => import('./components/QuickStats'));
const SpendingAnalytics = lazy(() => import('./components/SpendingAnalytics'));
const AccountBalances = lazy(() => import('./components/AccountBalances'));
const RecentTransactions = lazy(() => import('./components/RecentTransactions'));

// Loading skeleton components
const QuickStatsLoading = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    {[...Array(4)].map((_, i) => (
      <Card key={i} className="p-6">
        <div className="space-y-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
      </Card>
    ))}
  </div>
);

const SpendingAnalyticsLoading = () => (
  <Card className="p-6">
    <div className="space-y-6">
      <Skeleton className="h-6 w-40" />
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-2 w-full" />
          </div>
        ))}
      </div>
    </div>
  </Card>
);

const AccountBalancesLoading = () => (
  <Card className="p-6">
    <div className="space-y-6">
      <Skeleton className="h-6 w-32" />
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex justify-between items-center p-4 rounded-lg border">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
            <Skeleton className="h-6 w-20" />
          </div>
        ))}
      </div>
    </div>
  </Card>
);

const RecentTransactionsLoading = () => (
  <Card className="p-6">
    <div className="space-y-6">
      <Skeleton className="h-6 w-36" />
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex justify-between items-center p-4 rounded-lg border">
            <div className="flex items-center space-x-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <Skeleton className="h-5 w-16" />
          </div>
        ))}
      </div>
    </div>
  </Card>
);

export default function Dashboard() {
  const { analytics: data, isLoading: loading } = useDashboardAnalytics();
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Financial Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Your complete financial overview at a glance
          </p>
        </motion.div>

        {/* Quick Stats - Load immediately */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Suspense fallback={<QuickStatsLoading />}>
            <QuickStats />
          </Suspense>
        </motion.div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Spending Analytics */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Suspense fallback={<SpendingAnalyticsLoading />}>
              <SpendingAnalytics />
            </Suspense>
          </motion.div>

          {/* Right Column */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-6"
          >
            {/* Account Balances */}
            <Suspense fallback={<AccountBalancesLoading />}>
              <AccountBalances />
            </Suspense>
          </motion.div>
        </div>

        {/* New Charts Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          <Card>
            <CardHeader>
              <CardTitle>Spending by Category</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <SpendingAnalyticsLoading />
              ) : (
                <CategoryPieChart data={data?.spendingCategories ?? []} />
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Budget vs. Spending</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <SpendingAnalyticsLoading />
              ) : (
                <BudgetBarChart data={data?.spendingCategories ?? []} />
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Transactions - Load last */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Suspense fallback={<RecentTransactionsLoading />}>
            <RecentTransactions />
          </Suspense>
        </motion.div>
      </div>
    </div>
  );
} 