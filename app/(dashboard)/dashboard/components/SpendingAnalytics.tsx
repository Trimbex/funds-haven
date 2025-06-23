'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useDashboardAnalytics } from '@/app/hooks/useDashboardAnalytics';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const categoryColors: { [key: string]: string } = {
  food: "bg-orange-500",
  transportation: "bg-blue-500", 
  entertainment: "bg-purple-500",
  shopping: "bg-pink-500",
  utilities: "bg-green-500",
  healthcare: "bg-red-500",
  education: "bg-indigo-500",
  travel: "bg-cyan-500",
  other: "bg-gray-500",
};

export default function SpendingAnalytics() {
  const { analytics: data, isLoading: loading, error } = useDashboardAnalytics();

  if (loading) {
    return (
      <Card className="border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-xl">
        <CardHeader>
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-40 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-60"></div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6 animate-pulse">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="h-2 bg-gray-200 rounded w-full"></div>
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
          <CardTitle className="text-red-500">Error loading spending analytics</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <motion.div variants={fadeIn} initial="initial" animate="animate">
      <Card className="border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
            Spending Analytics
          </CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Category breakdown for this month
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {data.spendingCategories.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No spending data available</p>
            </div>
          ) : (
            data.spendingCategories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="space-y-3 p-4 rounded-lg bg-gray-50/50 dark:bg-slate-700/50 hover:bg-gray-100/50 dark:hover:bg-slate-600/50 transition-colors duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      categoryColors[category.name.toLowerCase()] || categoryColors.other
                    }`} />
                    <span className="font-medium text-gray-900 dark:text-white capitalize">
                      {category.name}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900 dark:text-white">
                      ${category.amount.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      of ${category.budget.toLocaleString()} budget
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-600 dark:text-gray-300">
                    <span>{((category.amount / data.quickStats.monthlyExpenses) * 100).toFixed(1)}% of total spending</span>
                    <span>{category.percentage.toFixed(1)}% of budget used</span>
                  </div>
                  
                  <div className="relative">
                    <Progress 
                      value={category.percentage} 
                      className="h-2 bg-gray-200 dark:bg-gray-700"
                    />
                    {category.percentage > 90 && (
                      <div className="absolute -top-1 -right-1">
                        <span className="inline-flex h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                      </div>
                    )}
                  </div>
                  
                  {category.percentage > 100 && (
                    <p className="text-xs text-red-600 dark:text-red-400 font-medium">
                      Over budget by ${(category.amount - category.budget).toLocaleString()}
                    </p>
                  )}
                </div>
              </motion.div>
            ))
          )}
          
          {data.spendingCategories.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="pt-4 border-t border-gray-200 dark:border-gray-600"
            >
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 dark:text-gray-300">Total Monthly Spending:</span>
                <span className="font-bold text-lg text-gray-900 dark:text-white">
                  ${data.quickStats.monthlyExpenses.toLocaleString()}
                </span>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
} 