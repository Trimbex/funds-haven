'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, ArrowDownLeft, Clock } from 'lucide-react';
import { useDashboardAnalytics } from '@/app/hooks/useDashboardAnalytics';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const categoryColors: { [key: string]: string } = {
  food: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  transportation: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  entertainment: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  shopping: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
  utilities: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  healthcare: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  education: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
  travel: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200",
  income: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
  other: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
};

export default function RecentTransactions() {
  const { analytics: data, isLoading: loading, error } = useDashboardAnalytics();

  if (loading) {
    return (
      <Card className="border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-xl">
        <CardHeader>
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-36 mb-2"></div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 animate-pulse">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex justify-between items-center p-4 rounded-lg border">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                  </div>
                </div>
                <div className="h-5 bg-gray-200 rounded w-16"></div>
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
          <CardTitle className="text-red-500">Error loading transactions</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <motion.div variants={fadeIn} initial="initial" animate="animate">
      <Card className="border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
            Recent Transactions
          </CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Your latest financial activity
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {data.recentTransactions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No recent transactions</p>
            </div>
          ) : (
                         data.recentTransactions.map((transaction, index) => {
               const isIncome = transaction.amount > 0;
               const categoryColor = categoryColors[transaction.category?.toLowerCase() || 'other'] || categoryColors.other;
              
              return (
                                 <motion.div
                   key={transaction.id}
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ duration: 0.6, delay: index * 0.05 }}
                   className="group p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-gray-50/50 dark:bg-slate-700/50 hover:bg-gray-100/50 dark:hover:bg-slate-600/50 transition-all duration-200"
                 >
                   <div className="flex items-center justify-between">
                     <div className="flex items-center space-x-3">
                       {/* Transaction Icon */}
                       <div className={`p-2 rounded-full ${
                         isIncome 
                           ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300' 
                           : 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300'
                       } group-hover:shadow-md transition-shadow duration-200`}>
                         {isIncome ? (
                           <ArrowDownLeft className="h-4 w-4" />
                         ) : (
                           <ArrowUpRight className="h-4 w-4" />
                         )}
                       </div>
                       
                       {/* Transaction Details */}
                       <div className="flex-1 min-w-0">
                         <div className="flex items-center space-x-2 mb-1">
                           <p className="font-medium text-gray-900 dark:text-white truncate">
                             {transaction.name}
                           </p>
                           {transaction.category && (
                             <Badge 
                               variant="secondary" 
                               className={`text-xs capitalize ${categoryColor} border-0`}
                             >
                               {transaction.category}
                             </Badge>
                           )}
                         </div>
                         
                         <div className="flex items-center space-x-2 text-xs text-gray-500">
                           <Clock className="h-3 w-3" />
                           <span>{transaction.time}</span>
                           {transaction.account && (
                             <>
                               <span>•</span>
                               <span>{transaction.account}</span>
                             </>
                           )}
                         </div>
                       </div>
                     </div>
                     
                     {/* Amount */}
                     <div className="text-right ml-4">
                       <p className={`font-bold text-lg ${
                         isIncome
                           ? 'text-green-600 dark:text-green-400'
                           : 'text-red-600 dark:text-red-400'
                       }`}>
                         {isIncome ? '+' : '-'}${Math.abs(transaction.amount).toLocaleString()}
                       </p>
                     </div>
                   </div>
                 </motion.div>
              );
            })
          )}
          
          {data.recentTransactions.length >= 5 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="pt-4 border-t border-gray-200 dark:border-gray-600 text-center"
            >
              <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors duration-200">
                View All Transactions →
              </button>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
} 