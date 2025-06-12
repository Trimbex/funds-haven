'use client';

import React from 'react';
import { motion } from "framer-motion";
import CategoryCard from './components/category-card';
import { CategoryProvider, useCategories } from '@/app/context/categoryContext';
import { CategoryCardSkeleton, DashboardStatsSkeleton } from "@/components/ui/skeletons";
import { Button } from "@/components/ui/button";
import { Plus, Search, Layers, TrendingUp, PiggyBank, Wallet, Filter } from "lucide-react";
import CategoryForm from './components/category-form';
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function CategoriesPage() {
  const { categories, isLoading, addCategory } = useCategories();
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchCriteria, setSearchCriteria] = React.useState({
    title: true,
    description: true,
    tags: true
  });

  const filteredCategories = React.useMemo(() => {
    if (!searchQuery.trim()) return categories;
    
    const query = searchQuery.toLowerCase();
    return categories.filter(category => 
      (searchCriteria.title && category.category_name.toLowerCase().includes(query)) ||
      (searchCriteria.description && category.category_description.toLowerCase().includes(query)) ||
      (searchCriteria.tags && category.tags.tags.some(tag => tag.toLowerCase().includes(query)))
    );
  }, [categories, searchQuery, searchCriteria]);

  const handleCriteriaChange = (criteria: keyof typeof searchCriteria) => {
    const newCriteria = { ...searchCriteria, [criteria]: !searchCriteria[criteria] };
    if (Object.values(newCriteria).some(value => value)) {
      setSearchCriteria(newCriteria);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const stats = {
    totalCategories: categories.length,
    totalBudget: categories.reduce((sum, cat) => sum + Number(cat.budget), 0),
    activeCategories: categories.filter(cat => Number(cat.budget) > 0).length,
    totalSpent: categories.reduce((sum, cat) => sum + Number(cat.spent), 0),
  };

  if (isLoading) {
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
        
        {/* Search Bar Skeleton */}
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div className="space-y-3 flex-1">
                <div className="h-10 w-80 bg-gray-200 rounded animate-pulse"></div>
                <div className="flex space-x-4">
                  <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
              <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </CardContent>
        </Card>
        
        {/* Categories Skeleton */}
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <CategoryCardSkeleton key={i} />
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
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Categories <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Overview</span>
          </h1>
          <p className="text-gray-600 text-lg">Organize your finances with customized categories and track your spending habits.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="stat-card group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Categories</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalCategories}</p>
                  <p className="text-xs text-gray-500 mt-1">Active management</p>
                </div>
                <div className="p-3 rounded-2xl bg-gradient-to-r from-purple-500 to-purple-600 group-hover:scale-110 transition-transform duration-300">
                  <Layers className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="stat-card group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Active Categories</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeCategories}</p>
                  <p className="text-xs text-gray-500 mt-1">With budgets set</p>
                </div>
                <div className="p-3 rounded-2xl bg-gradient-to-r from-green-500 to-green-600 group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="stat-card group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Budget</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalBudget)}</p>
                  <p className="text-xs text-gray-500 mt-1">Allocated funds</p>
                </div>
                <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 group-hover:scale-110 transition-transform duration-300">
                  <PiggyBank className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="stat-card group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Spent</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalSpent)}</p>
                  <p className="text-xs text-gray-500 mt-1">Across all categories</p>
                </div>
                <div className="p-3 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 group-hover:scale-110 transition-transform duration-300">
                  <Wallet className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Search and Filter Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Card className="card-modern">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex-1 space-y-4">
                <div className="relative max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search categories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 input-modern"
                  />
                </div>
                
                <div className="flex flex-wrap items-center gap-4">
                  <span className="text-sm font-medium text-gray-600">Search in:</span>
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="title" 
                      checked={searchCriteria.title}
                      onCheckedChange={() => handleCriteriaChange('title')}
                    />
                    <label htmlFor="title" className="text-sm cursor-pointer">Title</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="description" 
                      checked={searchCriteria.description}
                      onCheckedChange={() => handleCriteriaChange('description')}
                    />
                    <label htmlFor="description" className="text-sm cursor-pointer">Description</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="tags" 
                      checked={searchCriteria.tags}
                      onCheckedChange={() => handleCriteriaChange('tags')}
                    />
                    <label htmlFor="tags" className="text-sm cursor-pointer">Tags</label>
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={() => setIsFormOpen(true)} 
                className="btn-primary shrink-0"
              >
                <Plus className="mr-2 h-4 w-4" /> 
                Add Category
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Categories List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="space-y-6"
      >
        {filteredCategories.length > 0 ? (
          filteredCategories.map((category, index) => (
            <motion.div
              key={category.category_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <CategoryCard category={category} />
            </motion.div>
          ))
        ) : (
          <Card className="card-modern">
            <CardContent className="py-16 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Layers className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {searchQuery ? 'No Categories Found' : 'No Categories Yet'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchQuery 
                    ? `No categories match "${searchQuery}". Try adjusting your search criteria.` 
                    : "Get started by creating your first category to organize your finances."
                  }
                </p>
                {!searchQuery && (
                  <Button 
                    onClick={() => setIsFormOpen(true)}
                    className="btn-primary"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Category
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </motion.div>
      
      <CategoryForm 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        mode="add"
      />
    </div>
  );
}

export default function Page() {
  return (
    <CategoryProvider>
      <CategoriesPage />
    </CategoryProvider>
  );
}