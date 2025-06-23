'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wallet, CreditCard, PiggyBank, TrendingUp } from 'lucide-react';
import { useDashboardAnalytics } from '@/app/hooks/useDashboardAnalytics';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const accountTypeIcons: { [key: string]: any } = {
  checking: Wallet,
  savings: PiggyBank,
  credit: CreditCard,
  investment: TrendingUp,
};

const accountTypeColors: { [key: string]: string } = {
  checking: "bg-blue-500",
  savings: "bg-green-500", 
  credit: "bg-red-500",
  investment: "bg-purple-500",
};

export default function AccountBalances() {
  const { analytics: data, isLoading: loading, error } = useDashboardAnalytics();

  if (loading) {
    return (
      <Card className="border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-xl">
        <CardHeader>
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-32 mb-2"></div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 animate-pulse">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex justify-between items-center p-4 rounded-lg border">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-20"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card className="border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-xl">
        <CardHeader>
          <CardTitle className="text-red-500">Error loading accounts</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <motion.div variants={fadeIn} initial="initial" animate="animate">
      <Card className="border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
            Account Balances
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {data.accountBalances.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No accounts found</p>
            </div>
          ) : (
            data.accountBalances.map((account, index) => {
              const IconComponent = accountTypeIcons[account.account_type.toLowerCase()] || Wallet;
              const colorClass = accountTypeColors[account.account_type.toLowerCase()] || accountTypeColors.checking;
              
              return (
                <motion.div
                  key={account.account_id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-gray-50/50 dark:bg-slate-700/50 hover:bg-gray-100/50 dark:hover:bg-slate-600/50 transition-all duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${colorClass} text-white shadow-sm group-hover:shadow-md transition-shadow duration-200`}>
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {account.account_name}
                        </p>
                        <div className="flex items-center space-x-2">
                          <Badge 
                            variant="secondary" 
                            className="text-xs capitalize bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300"
                          >
                            {account.account_type}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className={`font-bold text-lg ${
                        account.balance >= 0 
                          ? 'text-gray-900 dark:text-white' 
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {account.balance >= 0 ? '$' : '-$'}
                        {Math.abs(account.balance).toLocaleString()}
                      </p>
                      {account.account_type.toLowerCase() === 'credit' && account.balance < 0 && (
                        <p className="text-xs text-gray-500">
                          Credit Used
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
          
          {data.accountBalances.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="pt-4 border-t border-gray-200 dark:border-gray-600"
            >
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Total Net Worth:
                </span>
                <span className="font-bold text-lg text-gray-900 dark:text-white">
                  ${data.quickStats.totalNetWorth.toLocaleString()}
                </span>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
} 