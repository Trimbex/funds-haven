'use client';

import React from 'react';
import { TrendingUp, PiggyBank, Wallet, Layers } from "lucide-react";
import { useCategories } from '@/app/context/categoryContext';
import DashboardHeader, { StatCard } from '@/app/components/DashboardHeader';

export default function Header() {
  const { categories } = useCategories();

  const stats = {
    totalCategories: categories.length,
    totalBudget: categories.reduce((sum, cat) => sum + Number(cat.budget), 0),
    activeCategories: categories.filter(cat => Number(cat.budget) > 0).length,
    totalSpent: categories.reduce((sum, cat) => sum + Number(cat.spent), 0),
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const statCards: StatCard[] = [
    {
      title: 'Total Categories',
      value: stats.totalCategories,
      description: 'Custom and system categories',
      icon: Layers,
      iconColor: 'text-purple-300',
      iconBgColor: 'bg-purple-500'
    },
    {
      title: 'Active Categories',
      value: stats.activeCategories,
      description: 'Categories with budget set',
      icon: TrendingUp,
      iconColor: 'text-green-300',
      iconBgColor: 'bg-green-500'
    },
    {
      title: 'Total Budget',
      value: formatCurrency(stats.totalBudget),
      description: 'Allocated budget across all categories',
      icon: PiggyBank,
      iconColor: 'text-blue-300',
      iconBgColor: 'bg-blue-500'
    },
    {
      title: 'Total Spent',
      value: formatCurrency(stats.totalSpent),
      description: 'Amount spent across categories',
      icon: Wallet,
      iconColor: 'text-orange-300',
      iconBgColor: 'bg-orange-500'
    }
  ];

  return (
    <DashboardHeader
      title="Categories Overview"
      subtitle="Organize your finances with customized categories"
      stats={statCards}
    />
  );
}