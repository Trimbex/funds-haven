'use client'

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
  Filter,
  Wallet,
  ShoppingCart,
  Home,
  Car,
  Coffee,
  Zap,
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3,
  Activity,
  Banknote,
  Coins,
  Users,
  Building2,
  Smartphone,
  Globe,
  Download,
  RefreshCw,
  Eye,
  EyeOff,
  Settings,
  ChevronRight,
  Percent,
  Calculator,
  LineChart,
  MoreHorizontal
} from 'lucide-react';
import Link from 'next/link';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
}

const slideIn = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6 }
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

// Enhanced financial data
const quickStats = [
  { 
    label: "Total Net Worth", 
    value: "$847,420", 
    change: "+$23,400", 
    changePercent: "+2.84%",
    trend: "up",
    icon: DollarSign,
    description: "Across all accounts",
    gradient: "from-emerald-500 to-teal-500"
  },
  { 
    label: "Monthly Income", 
    value: "$15,240", 
    change: "+$1,240", 
    changePercent: "+8.9%",
    trend: "up",
    icon: TrendingUp,
    description: "vs last month",
    gradient: "from-blue-500 to-cyan-500"
  },
  { 
    label: "Monthly Expenses", 
    value: "$8,180", 
    change: "-$520", 
    changePercent: "-6.0%",
    trend: "down",
    icon: TrendingDown,
    description: "Optimized spending",
    gradient: "from-orange-500 to-red-500"
  },
  { 
    label: "Investment Growth", 
    value: "$124,860", 
    change: "+$8,430", 
    changePercent: "+7.2%",
    trend: "up",
    icon: LineChart,
    description: "Portfolio value",
    gradient: "from-purple-500 to-pink-500"
  }
]

const spendingCategories = [
  { name: "Food & Dining", amount: 2240, budget: 2500, percentage: 89.6, color: "bg-blue-500", icon: Coffee, trend: "+5%" },
  { name: "Transportation", amount: 1680, budget: 2000, percentage: 84.0, color: "bg-green-500", icon: Car, trend: "-12%" },
  { name: "Shopping", amount: 1520, budget: 1800, percentage: 84.4, color: "bg-purple-500", icon: ShoppingCart, trend: "+18%" },
  { name: "Bills & Utilities", amount: 1450, budget: 1500, percentage: 96.7, color: "bg-orange-500", icon: Home, trend: "+2%" },
  { name: "Entertainment", amount: 890, budget: 1200, percentage: 74.2, color: "bg-pink-500", icon: Smartphone, trend: "+8%" },
  { name: "Healthcare", amount: 590, budget: 800, percentage: 73.8, color: "bg-teal-500", icon: Building2, trend: "-3%" }
]

const savingsGoals = [
  { 
    name: "Emergency Fund", 
    current: 28500, 
    target: 50000, 
    deadline: "Dec 2024",
    monthlyContribution: 2500,
    color: "bg-blue-500",
    priority: "High"
  },
  { 
    name: "Dream Vacation", 
    current: 8800, 
    target: 15000, 
    deadline: "Aug 2024",
    monthlyContribution: 1200,
    color: "bg-green-500",
    priority: "Medium"
  },
  { 
    name: "New Car", 
    current: 35000, 
    target: 60000, 
    deadline: "Jan 2025",
    monthlyContribution: 3000,
    color: "bg-purple-500",
    priority: "High"
  },
  { 
    name: "Home Down Payment", 
    current: 75000, 
    target: 120000, 
    deadline: "Jun 2025",
    monthlyContribution: 4500,
    color: "bg-orange-500",
    priority: "Critical"
  }
]

const recentTransactions = [
  { 
    id: 1,
    name: "Amazon Purchase", 
    amount: -247.89, 
    category: "Shopping", 
    time: "2 hours ago", 
    status: "completed",
    account: "Visa **** 4532",
    merchant: "Amazon.com"
  },
  { 
    id: 2,
    name: "Salary Deposit", 
    amount: 7500.00, 
    category: "Income", 
    time: "1 day ago", 
    status: "completed",
    account: "Chase Checking",
    merchant: "TechCorp Inc."
  },
  { 
    id: 3,
    name: "Grocery Store", 
    amount: -156.78, 
    category: "Food", 
    time: "2 days ago", 
    status: "completed",
    account: "Debit **** 7834",
    merchant: "Whole Foods"
  },
  { 
    id: 4,
    name: "Netflix Subscription", 
    amount: -17.99, 
    category: "Entertainment", 
    time: "3 days ago", 
    status: "completed",
    account: "Visa **** 4532",
    merchant: "Netflix Inc."
  },
  { 
    id: 5,
    name: "Investment Transfer", 
    amount: -2000.00, 
    category: "Investment", 
    time: "4 days ago", 
    status: "pending",
    account: "Savings Account",
    merchant: "Vanguard"
  }
]

const upcomingBills = [
  { 
    name: "Mortgage Payment", 
    amount: 2847.50, 
    due: "Dec 1", 
    status: "due",
    category: "Housing",
    account: "Auto-pay enabled"
  },
  { 
    name: "Car Insurance", 
    amount: 245.67, 
    due: "Dec 3", 
    status: "upcoming",
    category: "Insurance",
    account: "Visa **** 4532"
  },
  { 
    name: "Internet & Cable", 
    amount: 129.99, 
    due: "Dec 5", 
    status: "upcoming",
    category: "Utilities",
    account: "Auto-pay enabled"
  },
  { 
    name: "Phone Bill", 
    amount: 89.00, 
    due: "Dec 8", 
    status: "upcoming",
    category: "Utilities",
    account: "Bank Transfer"
  },
  { 
    name: "Credit Card Payment", 
    amount: 1456.89, 
    due: "Dec 12", 
    status: "scheduled",
    category: "Credit",
    account: "Auto-pay enabled"
  }
]

const investmentPortfolio = [
  { name: "S&P 500 Index", allocation: 45, value: 67500, change: "+8.2%", risk: "Medium" },
  { name: "Tech Stocks", allocation: 25, value: 37500, change: "+12.7%", risk: "High" },
  { name: "Bonds", allocation: 20, value: 30000, change: "+2.1%", risk: "Low" },
  { name: "International", allocation: 10, value: 15000, change: "+5.4%", risk: "Medium" }
]

const marketInsights = [
  { metric: "Market Performance", value: "+2.4%", description: "S&P 500 Today", trend: "up" },
  { metric: "Your Portfolio", value: "+1.8%", description: "vs Market", trend: "up" },
  { metric: "Volatility Index", value: "12.4", description: "Low Risk Period", trend: "down" },
  { metric: "Bond Yields", value: "4.2%", description: "10-Year Treasury", trend: "up" }
]

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 p-6">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-4xl font-bold text-gray-900">
                Financial <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Dashboard</span>
              </h1>
              <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200">
                <TrendingUp className="w-3 h-3 mr-1" />
                +2.8% this month
              </Badge>
            </div>
            <p className="text-gray-600 text-lg">Welcome back! Here's your comprehensive financial overview.</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="outline" className="bg-white/50 backdrop-blur-sm border-white/20 hover:bg-white/70">
              <Calendar className="w-4 h-4 mr-2" />
              Nov 2024
            </Button>
            <Button variant="outline" className="bg-white/50 backdrop-blur-sm border-white/20 hover:bg-white/70">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg">
              <Plus className="w-4 h-4 mr-2" />
              Add Transaction
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats Grid */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8"
      >
        {quickStats.map((stat, index) => (
          <motion.div key={index} variants={fadeIn}>
            <Card className="relative overflow-hidden bg-white/60 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-2xl bg-gradient-to-r ${stat.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-medium flex items-center ${
                      stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.trend === 'up' ? 
                        <TrendingUp className="w-3 h-3 mr-1" /> : 
                        <TrendingDown className="w-3 h-3 mr-1" />
                      }
                      {stat.changePercent}
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-500 flex items-center">
                    <span className={`font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.change}
                    </span>
                    <span className="ml-2">{stat.description}</span>
                  </p>
                </div>
              </CardContent>
              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.gradient}`}></div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        
        {/* Spending Analytics - Large Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="lg:col-span-2"
        >
          <Card className="h-full bg-white/60 backdrop-blur-sm border-white/20 shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center text-xl font-bold">
                  <PieChart className="w-5 h-5 mr-2 text-blue-600" />
                  Spending Analytics
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Filter className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {spendingCategories.map((category, index) => (
                <div key={index} className="group">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${category.color} bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-200`}>
                        <category.icon className={`w-4 h-4 ${category.color.replace('bg-', 'text-')}`} />
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">{category.name}</span>
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <span>${category.amount.toLocaleString()} of ${category.budget.toLocaleString()}</span>
                          <Badge 
                            variant={category.trend.startsWith('+') ? 'destructive' : 'default'}
                            className="text-xs"
                          >
                            {category.trend}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">${category.amount.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">{category.percentage.toFixed(1)}% of budget</div>
                    </div>
                  </div>
                  <div className="relative">
                    <Progress value={category.percentage} className="h-3" />
                    <div className={`absolute top-0 left-0 h-3 rounded-full bg-gradient-to-r ${category.color.replace('bg-', 'from-')} to-transparent`} 
                         style={{width: `${category.percentage}%`}}></div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Savings Goals */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="h-full bg-white/60 backdrop-blur-sm border-white/20 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-xl font-bold">
                <Target className="w-5 h-5 mr-2 text-green-600" />
                Savings Goals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {savingsGoals.map((goal, index) => (
                <div key={index} className="group">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="font-medium text-gray-900">{goal.name}</div>
                      <div className="text-xs text-gray-500 flex items-center space-x-2">
                        <span>Due {goal.deadline}</span>
                        <Badge 
                          variant={goal.priority === 'Critical' ? 'destructive' : goal.priority === 'High' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {goal.priority}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-900">
                        {Math.round((goal.current / goal.target) * 100)}%
                      </div>
                    </div>
                  </div>
                  <Progress value={(goal.current / goal.target) * 100} className="h-2 mb-2" />
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>${goal.current.toLocaleString()}</span>
                    <span>${goal.target.toLocaleString()}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    +${goal.monthlyContribution.toLocaleString()}/month
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full mt-4">
                <Plus className="w-4 h-4 mr-2" />
                Add New Goal
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Secondary Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-8">
        
        {/* Investment Portfolio */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="h-full bg-white/60 backdrop-blur-sm border-white/20 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-xl font-bold">
                <BarChart3 className="w-5 h-5 mr-2 text-purple-600" />
                Investment Portfolio
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                <div className="text-2xl font-bold text-gray-900">$150,000</div>
                <div className="text-sm text-gray-600">Total Portfolio Value</div>
                <div className="text-green-600 font-medium text-sm">+$8,430 (5.95%)</div>
              </div>
              {investmentPortfolio.map((investment, index) => (
                <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{investment.name}</div>
                    <div className="text-xs text-gray-500 flex items-center space-x-2">
                      <span>{investment.allocation}% allocation</span>
                      <Badge variant="outline" className="text-xs">
                        {investment.risk}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">${investment.value.toLocaleString()}</div>
                    <div className="text-green-600 text-sm">{investment.change}</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="h-full bg-white/60 backdrop-blur-sm border-white/20 shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center text-xl font-bold">
                  <Activity className="w-5 h-5 mr-2 text-blue-600" />
                  Recent Activity
                </CardTitle>
                <Link href="/transactions">
                  <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                    View All
                    <ChevronRight className="w-3 h-3 ml-1" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentTransactions.slice(0, 5).map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors group">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      transaction.amount > 0 ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {transaction.amount > 0 ? 
                        <ArrowUpRight className="w-5 h-5 text-green-600" /> :
                        <ArrowDownRight className="w-5 h-5 text-red-600" />
                      }
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-900 truncate">{transaction.name}</p>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <span>{transaction.category}</span>
                        <span>•</span>
                        <span>{transaction.time}</span>
                      </div>
                      <p className="text-xs text-gray-400 truncate">{transaction.account}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${
                      transaction.amount > 0 ? 'text-green-600' : 'text-gray-900'
                    }`}>
                      {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                    </p>
                    <div className="flex items-center justify-end">
                      {transaction.status === 'completed' ? 
                        <CheckCircle className="w-3 h-3 text-green-500" /> :
                        <Clock className="w-3 h-3 text-orange-500" />
                      }
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Upcoming Bills & Market Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="space-y-8"
        >
          {/* Upcoming Bills */}
          <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-lg font-bold">
                <AlertCircle className="w-5 h-5 mr-2 text-orange-600" />
                Upcoming Bills
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingBills.slice(0, 3).map((bill, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 text-sm">{bill.name}</div>
                    <div className="text-xs text-gray-500">{bill.due} • {bill.account}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900 text-sm">${bill.amount}</div>
                    <Badge 
                      variant={bill.status === 'due' ? 'destructive' : 'secondary'} 
                      className="text-xs"
                    >
                      {bill.status}
                    </Badge>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full text-xs">
                View All Bills
              </Button>
            </CardContent>
          </Card>

          {/* Market Insights */}
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200/50 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-lg font-bold">
                <Globe className="w-5 h-5 mr-2 text-blue-600" />
                Market Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {marketInsights.map((insight, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900 text-sm">{insight.metric}</div>
                    <div className="text-xs text-gray-600">{insight.description}</div>
                  </div>
                  <div className={`font-bold ${
                    insight.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {insight.value}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-xl">
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row items-center justify-between space-y-6 lg:space-y-0">
              <div>
                <h3 className="text-2xl font-bold mb-2">Take Action on Your Finances</h3>
                <p className="text-indigo-100">Quick actions to optimize your financial health</p>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Link href="/transactions">
                  <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-sm h-16 flex-col space-y-1">
                    <Plus className="w-5 h-5" />
                    <span className="text-xs">Add Transaction</span>
                  </Button>
                </Link>
                <Link href="/categories">
                  <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-sm h-16 flex-col space-y-1">
                    <PieChart className="w-5 h-5" />
                    <span className="text-xs">Manage Budget</span>
                  </Button>
                </Link>
                <Link href="/accounts">
                  <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-sm h-16 flex-col space-y-1">
                    <CreditCard className="w-5 h-5" />
                    <span className="text-xs">View Accounts</span>
                  </Button>
                </Link>
                <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-sm h-16 flex-col space-y-1">
                  <Target className="w-5 h-5" />
                  <span className="text-xs">Set Goals</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
