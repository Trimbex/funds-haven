'use server';

import { db } from '@/app/db';
import { accounts, categories, transactions } from '@/app/db/schema';
import { eq, and, desc, isNull, gte, lte, sql } from 'drizzle-orm';

// Analytics types
export type DashboardAnalytics = {
  quickStats: {
    totalNetWorth: number;
    monthlyIncome: number;
    monthlyExpenses: number;
    investmentGrowth: number;
    netWorthChange: number;
    incomeChange: number;
    expenseChange: number;
    investmentChange: number;
  };
  spendingCategories: Array<{
    name: string;
    amount: number;
    budget: number;
    percentage: number;
    color: string;
    icon: string;
    trend: string;
    monthlySpent: number;
    previousMonthSpent: number;
  }>;
  recentTransactions: Array<{
    id: string;
    name: string;
    amount: number;
    category: string;
    time: string;
    status: string;
    account: string;
    merchant: string;
  }>;
  accountBalances: Array<{
    account_id: string;
    account_name: string;
    balance: number;
    account_type: string;
  }>;
  monthlyTrends: {
    income: Array<{ month: string; amount: number }>;
    expenses: Array<{ month: string; amount: number }>;
  };
};

export async function getDashboardAnalytics(userId: string, timeFrame: string = '6m'): Promise<{ success: boolean; analytics?: DashboardAnalytics; message?: string }> {
  try {
    // Get current date and calculate periods
    const now = new Date();
    
    let startDate: Date;
    switch (timeFrame) {
      case '1m':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        break;
      case '3m':
        startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1);
        break;
      case '1y':
        startDate = new Date(now.getFullYear() - 1, now.getMonth(), 1);
        break;
      case 'all':
        startDate = new Date(0); // Epoch start
        break;
      case '6m':
      default:
        startDate = new Date(now.getFullYear(), now.getMonth() - 6, 1);
        break;
    }

    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    // Single optimized query to get all necessary data
    const [
      userAccounts,
      userCategories,
      allTransactions,
      recentTransactionData
    ] = await Promise.all([
      // Get all accounts
      db.select()
        .from(accounts)
        .where(eq(accounts.user_id, userId)),

      // Get all categories
      db.select()
        .from(categories)
        .where(eq(categories.user_id, userId)),

      // Get all transactions for the last 6 months
      db.select()
        .from(transactions)
        .where(and(
          eq(transactions.user_id, userId),
          gte(transactions.transaction_date, startDate),
          isNull(transactions.deleted_at)
        )),

      // Get recent transactions (last 10)
      db.select()
        .from(transactions)
        .where(and(
          eq(transactions.user_id, userId),
          isNull(transactions.deleted_at)
        ))
        .orderBy(desc(transactions.transaction_date))
        .limit(10)
    ]);

    // Filter transactions for current and last month
    const currentMonthTransactions = allTransactions.filter(t => new Date(t.transaction_date) >= currentMonthStart);
    const lastMonthTransactions = allTransactions.filter(t => {
      const date = new Date(t.transaction_date);
      return date >= lastMonthStart && date <= lastMonthEnd;
    });

    // Calculate total net worth
    const totalNetWorth = userAccounts.reduce((total, account) => 
      total + parseFloat(account.balance || '0'), 0
    );

    // Process transactions efficiently
    const currentMonthIncome = currentMonthTransactions
      .filter(t => t.transaction_type === 'income')
      .reduce((total, t) => total + parseFloat(t.amount.toString()), 0);

    const currentMonthExpenses = currentMonthTransactions
      .filter(t => t.transaction_type === 'expense')
      .reduce((total, t) => total + parseFloat(t.amount.toString()), 0);

    const lastMonthIncome = lastMonthTransactions
      .filter(t => t.transaction_type === 'income')
      .reduce((total, t) => total + parseFloat(t.amount.toString()), 0);

    const lastMonthExpenses = lastMonthTransactions
      .filter(t => t.transaction_type === 'expense')
      .reduce((total, t) => total + parseFloat(t.amount.toString()), 0);

    // Calculate percentage changes
    const incomeChange = lastMonthIncome > 0 ? 
      ((currentMonthIncome - lastMonthIncome) / lastMonthIncome) * 100 : 0;
    const expenseChange = lastMonthExpenses > 0 ? 
      ((currentMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100 : 0;

    // Process spending categories efficiently
    const categorySpendingMap = new Map<string, { current: number; last: number }>();
    
    // Process current month spending by category
    currentMonthTransactions
      .filter(t => t.transaction_type === 'expense')
      .forEach(t => {
        const transactionCategories = t.categories as Array<{ id: string | null; name: string }>;
        transactionCategories.forEach(cat => {
          if (cat.id) {
            const existing = categorySpendingMap.get(cat.id) || { current: 0, last: 0 };
            existing.current += parseFloat(t.amount.toString());
            categorySpendingMap.set(cat.id, existing);
          }
        });
      });

    // Process last month spending by category
    lastMonthTransactions
      .filter(t => t.transaction_type === 'expense')
      .forEach(t => {
        const transactionCategories = t.categories as Array<{ id: string | null; name: string }>;
        transactionCategories.forEach(cat => {
          if (cat.id) {
            const existing = categorySpendingMap.get(cat.id) || { current: 0, last: 0 };
            existing.last += parseFloat(t.amount.toString());
            categorySpendingMap.set(cat.id, existing);
          }
        });
      });

    // Build spending categories
    const spendingCategories = userCategories
      .map(category => {
        const spending = categorySpendingMap.get(category.category_id) || { current: 0, last: 0 };
        const budget = parseFloat(category.budget?.toString() || '0');
        const percentage = budget > 0 ? (spending.current / budget) * 100 : 0;
        const trend = spending.last > 0 ? 
          (((spending.current - spending.last) / spending.last) * 100).toFixed(1) : '0';

        return {
          name: category.category_name,
          amount: spending.current,
          budget: budget,
          percentage: Math.min(percentage, 100),
          color: category.color || 'gray',
          icon: category.icon || 'Tag',
          trend: `${parseFloat(trend) >= 0 ? '+' : ''}${trend}%`,
          monthlySpent: spending.current,
          previousMonthSpent: spending.last,
        };
      })
      .filter(cat => cat.amount > 0) // Only show categories with spending
      .sort((a, b) => b.amount - a.amount) // Sort by highest spending
      .slice(0, 6); // Top 6 categories

    // Process recent transactions
    const recentTransactions = recentTransactionData.map(transaction => {
      const account = userAccounts.find(acc => acc.account_id === transaction.account_id);
      const transactionCategories = transaction.categories as Array<{ id: string | null; name: string }>;
      const categoryName = transactionCategories.length > 0 ? transactionCategories[0].name : 'Uncategorized';
      
      // Calculate time ago
      const timeDiff = now.getTime() - new Date(transaction.transaction_date).getTime();
      const hoursAgo = Math.floor(timeDiff / (1000 * 60 * 60));
      const daysAgo = Math.floor(hoursAgo / 24);
      
      let timeAgo: string;
      if (daysAgo > 0) {
        timeAgo = `${daysAgo} day${daysAgo > 1 ? 's' : ''} ago`;
      } else if (hoursAgo > 0) {
        timeAgo = `${hoursAgo} hour${hoursAgo > 1 ? 's' : ''} ago`;
      } else {
        timeAgo = 'Less than an hour ago';
      }

      return {
        id: transaction.transaction_id,
        name: transaction.description || 'Unknown Transaction',
        amount: parseFloat(transaction.amount.toString()) * (transaction.transaction_type === 'income' ? 1 : -1),
        category: categoryName,
        time: timeAgo,
        status: transaction.status || 'completed',
        account: account ? account.account_name || 'Unknown Account' : 'Cash',
        merchant: transaction.description || 'Unknown Merchant',
      };
    });

    // Generate monthly trends for the last 6 months
    const monthlyTrendsData: { [key: string]: { income: number; expenses: number } } = {};
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const dateTo = new Date();
    const dateFrom = new Date(startDate);
    
    while (dateFrom <= dateTo) {
      const monthKey = `${monthNames[dateFrom.getMonth()]} ${dateFrom.getFullYear()}`;
      monthlyTrendsData[monthKey] = { income: 0, expenses: 0 };
      dateFrom.setMonth(dateFrom.getMonth() + 1);
    }

    allTransactions.forEach(t => {
      const d = new Date(t.transaction_date);
      const monthKey = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
      if (monthlyTrendsData[monthKey]) {
        if (t.transaction_type === 'income') {
          monthlyTrendsData[monthKey].income += parseFloat(t.amount.toString());
        } else {
          monthlyTrendsData[monthKey].expenses += parseFloat(t.amount.toString());
        }
      }
    });

    const monthlyTrends = {
      income: Object.entries(monthlyTrendsData).map(([month, { income }]) => ({ month, amount: income })),
      expenses: Object.entries(monthlyTrendsData).map(([month, { expenses }]) => ({ month, amount: expenses })),
    };

    // Calculate investment growth from actual investment accounts
    const investmentAccounts = userAccounts.filter(account => 
      account.account_type === 'investment' || account.account_type === 'savings'
    );
    const investmentGrowth = investmentAccounts.reduce((total, account) => 
      total + parseFloat(account.balance || '0'), 0
    );

    // Calculate investment change based on investment account transactions
    const investmentTransactionsThisMonth = currentMonthTransactions
      .filter(t => {
        const account = userAccounts.find(acc => acc.account_id === t.account_id);
        return account && (account.account_type === 'investment' || account.account_type === 'savings');
      });
    
    const investmentTransactionsLastMonth = lastMonthTransactions
      .filter(t => {
        const account = userAccounts.find(acc => acc.account_id === t.account_id);
        return account && (account.account_type === 'investment' || account.account_type === 'savings');
      });

    const thisMonthInvestmentGains = investmentTransactionsThisMonth
      .filter(t => t.transaction_type === 'income')
      .reduce((total, t) => total + parseFloat(t.amount.toString()), 0);
      
    const lastMonthInvestmentGains = investmentTransactionsLastMonth
      .filter(t => t.transaction_type === 'income')
      .reduce((total, t) => total + parseFloat(t.amount.toString()), 0);

    const investmentChange = lastMonthInvestmentGains > 0 ? 
      ((thisMonthInvestmentGains - lastMonthInvestmentGains) / lastMonthInvestmentGains) * 100 : 0;

    // Calculate net worth change - need to get previous month's account balances
    // For now, calculate based on income vs expenses this month compared to last month
    const thisMonthNetFlow = currentMonthIncome - currentMonthExpenses;
    const lastMonthNetFlow = lastMonthIncome - lastMonthExpenses;
    const netWorthChange = lastMonthNetFlow !== 0 ? 
      ((thisMonthNetFlow - lastMonthNetFlow) / Math.abs(lastMonthNetFlow)) * 100 : 0;

    const analytics: DashboardAnalytics = {
      quickStats: {
        totalNetWorth,
        monthlyIncome: currentMonthIncome,
        monthlyExpenses: currentMonthExpenses,
        investmentGrowth,
        netWorthChange,
        incomeChange,
        expenseChange: expenseChange * -1, // Negative because lower expenses are better
        investmentChange,
      },
      spendingCategories,
      recentTransactions,
      accountBalances: userAccounts.map(account => ({
        account_id: account.account_id,
        account_name: account.account_name || 'Unknown Account',
        balance: parseFloat(account.balance?.toString() || '0'),
        account_type: account.account_type || 'other',
      })),
      monthlyTrends,
    };

    return { success: true, analytics };

  } catch (error) {
    console.error('Error fetching dashboard analytics:', error);
    return { 
      success: false, 
      message: 'Failed to fetch dashboard analytics', 
    };
  }
} 