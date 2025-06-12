'use client'

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  CreditCard, 
  Target,
  PieChart,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Filter
} from 'lucide-react';
import Link from 'next/link';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

const statsData = [
  {
    title: "Total Balance",
    value: "$24,500.00",
    change: "+12.5%",
    changeType: "positive",
    icon: DollarSign,
    color: "from-blue-500 to-blue-600"
  },
  {
    title: "Monthly Income",
    value: "$5,240.00",
    change: "+8.2%",
    changeType: "positive",
    icon: TrendingUp,
    color: "from-green-500 to-green-600"
  },
  {
    title: "Monthly Expenses",
    value: "$3,180.00",
    change: "-4.3%",
    changeType: "negative",
    icon: TrendingDown,
    color: "from-red-500 to-red-600"
  },
  {
    title: "Savings Goal",
    value: "68%",
    change: "+5.1%",
    changeType: "positive",
    icon: Target,
    color: "from-purple-500 to-purple-600"
  }
];

const recentTransactions = [
  { id: 1, name: "Coffee Shop", amount: "-$4.50", date: "Today", category: "Food" },
  { id: 2, name: "Salary Deposit", amount: "+$2,500.00", date: "Yesterday", category: "Income" },
  { id: 3, name: "Grocery Store", amount: "-$67.89", date: "2 days ago", category: "Food" },
  { id: 4, name: "Netflix", amount: "-$15.99", date: "3 days ago", category: "Entertainment" },
  { id: 5, name: "Gas Station", amount: "-$45.20", date: "4 days ago", category: "Transport" }
];

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0"
      >
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Welcome back, <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Saif</span>
          </h1>
          <p className="text-gray-600 text-lg">Here's what's happening with your finances today.</p>
        </div>
        
                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
            <Button variant="outline" className="btn-outline-modern w-full sm:w-auto">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" className="btn-outline-modern w-full sm:w-auto">
              <Calendar className="w-4 h-4 mr-2" />
              This Month
            </Button>
            <Link href="/transactions" className="w-full sm:w-auto">
              <Button className="btn-primary w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Transaction
              </Button>
            </Link>
          </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {statsData.map((stat, index) => (
          <motion.div key={index} variants={fadeIn}>
            <Card className="stat-card group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <div className="flex items-center mt-2">
                      {stat.changeType === 'positive' ? (
                        <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
                      )}
                      <span className={`text-sm font-medium ${
                        stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.change}
                      </span>
                      <span className="text-sm text-gray-500 ml-1">vs last month</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-2xl bg-gradient-to-r ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Spending Overview Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card className="card-modern">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold">Spending Overview</CardTitle>
                <PieChart className="w-5 h-5 text-gray-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <PieChart className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium">Chart visualization coming soon</p>
                  <p className="text-sm text-gray-500">Integration with Chart.js</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="card-modern">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold">Recent Transactions</CardTitle>
                <Link href="/transactions">
                  <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors duration-200">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      transaction.amount.startsWith('+') 
                        ? 'bg-green-100' 
                        : 'bg-red-100'
                    }`}>
                      <CreditCard className={`w-5 h-5 ${
                        transaction.amount.startsWith('+') 
                          ? 'text-green-600' 
                          : 'text-red-600'
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{transaction.name}</p>
                      <p className="text-sm text-gray-500">{transaction.category} • {transaction.date}</p>
                    </div>
                  </div>
                  <p className={`font-semibold ${
                    transaction.amount.startsWith('+') 
                      ? 'text-green-600' 
                      : 'text-gray-900'
                  }`}>
                    {transaction.amount}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Card className="card-modern">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/transactions">
                <Button variant="outline" className="w-full h-20 flex-col space-y-2 btn-outline-modern group">
                  <Plus className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
                  <span>Add Transaction</span>
                </Button>
              </Link>
              <Link href="/categories">
                <Button variant="outline" className="w-full h-20 flex-col space-y-2 btn-outline-modern group">
                  <PieChart className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
                  <span>Manage Categories</span>
                </Button>
              </Link>
              <Link href="/accounts">
                <Button variant="outline" className="w-full h-20 flex-col space-y-2 btn-outline-modern group">
                  <CreditCard className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
                  <span>View Accounts</span>
                </Button>
              </Link>
              <Button variant="outline" className="w-full h-20 flex-col space-y-2 btn-outline-modern group">
                <Target className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
                <span>Set Goals</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
