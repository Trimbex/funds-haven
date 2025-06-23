'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, PiggyBank, Target } from 'lucide-react';
import { useDashboardAnalytics } from '@/app/hooks/useDashboardAnalytics';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function QuickStats() {
  const { analytics: data, isLoading: loading, error } = useDashboardAnalytics();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-24 mb-3"></div>
              <div className="h-8 bg-gray-200 rounded w-32 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-20"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6 text-center text-red-500">
          <p>Error loading stats</p>
        </Card>
      </div>
    );
  }

  const savingsRate = data.quickStats.monthlyIncome > 0 ? 
    ((data.quickStats.monthlyIncome - data.quickStats.monthlyExpenses) / data.quickStats.monthlyIncome * 100) : 0;

  const stats = [
    {
      title: 'Net Worth',
      value: `$${data.quickStats.totalNetWorth.toLocaleString()}`,
      change: data.quickStats.netWorthChange,
      icon: DollarSign,
      gradient: 'from-emerald-500 to-teal-600'
    },
    {
      title: 'Monthly Income',
      value: `$${data.quickStats.monthlyIncome.toLocaleString()}`,
      change: data.quickStats.incomeChange,
      icon: TrendingUp,
      gradient: 'from-blue-500 to-indigo-600'
    },
    {
      title: 'Monthly Expenses',
      value: `$${data.quickStats.monthlyExpenses.toLocaleString()}`,
      change: data.quickStats.expenseChange,
      icon: TrendingDown,
      gradient: 'from-purple-500 to-pink-600'
    },
    {
      title: 'Savings Rate',
      value: `${savingsRate.toFixed(1)}%`,
      change: data.quickStats.incomeChange - data.quickStats.expenseChange,
      icon: PiggyBank,
      gradient: 'from-orange-500 to-red-600'
    }
  ];

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
    >
      {stats.map((stat, index) => (
        <motion.div key={stat.title} variants={fadeIn}>
          <Card className="group relative overflow-hidden border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
            
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.gradient} text-white shadow-lg`}>
                  <stat.icon className="h-4 w-4" />
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="space-y-2">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
                <div className="flex items-center space-x-1">
                  {stat.change >= 0 ? (
                    <TrendingUp className="h-3 w-3 text-emerald-500" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-500" />
                  )}
                  <span className={`text-xs font-medium ${
                    stat.change >= 0 ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {stat.change >= 0 ? '+' : ''}{stat.change.toFixed(1)}%
                  </span>
                  <span className="text-xs text-gray-500">vs last month</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
} 