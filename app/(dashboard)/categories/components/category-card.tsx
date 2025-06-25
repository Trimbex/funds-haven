'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { 
  Wallet, 
  CreditCard, 
  TrendingDown, 
  Pencil, 
  Trash2, 
  Repeat,
  ArrowUpRight,
  ArrowDownRight,
  Target
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import CategoryForm from './category-form'; 
import { useCategories } from '@/app/context/categoryContext';
import { useTransactions } from '@/app/context/transactionsContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export type Category = {
    category_id: string;
    category_name: string;
    category_description: string;
    tags: {
        tags: string[];
    };
    image: string;
    budget: number;
    spent: number;
    predefined: boolean;
    color: string;
    recurring: boolean;
};

export default function CategoryCard({ category }: { category: Category }) {
  const { deleteCategory } = useCategories();
  const { transactions } = useTransactions();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDelete = async () => {
    await deleteCategory(category.category_id);
    setIsDeleteDialogOpen(false);
  };

  const handleEditClick = () => {
    setIsEditDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsEditDialogOpen(false);
  };

  const spent = React.useMemo(() => {
    return transactions
      .filter(t => t.transaction_type === 'expense' && t.categories.some(c => c.id === category.category_id))
      .reduce((sum, t) => sum + Number(t.amount), 0);
  }, [transactions, category.category_id]);

  const budget = Number(category.budget) || 0;
  const remaining = budget - spent;
  const spentPercentage = budget > 0 ? (spent / budget) * 100 : 0;
  const isOverBudget = spent > budget;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl mx-auto"
      >
        <Card className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
          {/* Color accent bar */}
          <div 
            style={{ backgroundColor: category.color || '#1f2937' }}
            className="h-1 w-full"
          />
          
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                {/* Category Image */}
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden shadow-md">
                  <Image 
                    src={category.image} 
                    alt={category.category_name}
                    fill
                    className="object-cover"
                  />
                </div>
                
                {/* Category Info */}
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <CardTitle className="text-2xl font-bold text-gray-900">
                      {category.category_name}
                    </CardTitle>
                    {category.recurring && (
                      <Badge variant="secondary" className="flex items-center gap-1 bg-blue-100 text-blue-700">
                        <Repeat className="w-3 h-3" />
                        Recurring
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="text-gray-600 text-base">
                    {category.category_description}
                  </CardDescription>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {category.tags?.tags.map((tag, index) => (
                      <Badge 
                        key={index} 
                        variant="outline"
                        className="bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleEditClick}
                  className="hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="hover:bg-red-50 hover:text-red-700 hover:border-red-300"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Budget Progress */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Budget Progress</span>
                <span className="text-sm text-gray-500">
                  {spentPercentage.toFixed(1)}% used
                </span>
              </div>
              <Progress 
                value={Math.min(spentPercentage, 100)} 
                className={`h-2 ${isOverBudget ? 'bg-red-100' : 'bg-gray-100'}`}
              />
              {isOverBudget && (
                <p className="text-sm text-red-600 flex items-center">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  Over budget by ${Math.abs(remaining).toFixed(2)}
                </p>
              )}
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Budget Card */}
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-500 rounded-xl">
                      <Target className="w-5 h-5 text-white" />
                    </div>
                                         <div>
                       <p className="text-sm font-medium text-blue-900">Budget</p>
                       <p className="text-xl font-bold text-blue-900">${budget.toFixed(2)}</p>
                     </div>
                  </div>
                </CardContent>
              </Card>

              {/* Spent Card */}
              <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-orange-500 rounded-xl">
                      <CreditCard className="w-5 h-5 text-white" />
                    </div>
                                         <div>
                       <p className="text-sm font-medium text-orange-900">Spent</p>
                       <p className="text-xl font-bold text-orange-900">${spent.toFixed(2)}</p>
                     </div>
                  </div>
                </CardContent>
              </Card>

              {/* Remaining Card */}
              <Card className={`bg-gradient-to-br ${
                isOverBudget 
                  ? 'from-red-50 to-red-100 border-red-200' 
                  : 'from-green-50 to-green-100 border-green-200'
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-xl ${
                      isOverBudget ? 'bg-red-500' : 'bg-green-500'
                    }`}>
                      <Wallet className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${
                        isOverBudget ? 'text-red-900' : 'text-green-900'
                      }`}>
                        {isOverBudget ? 'Over Budget' : 'Remaining'}
                      </p>
                      <p className={`text-xl font-bold ${
                        isOverBudget ? 'text-red-900' : 'text-green-900'
                      }`}>
                        ${Math.abs(remaining).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Stats */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <TrendingDown className="w-4 h-4 text-green-500" />
                  <span>5% less than last month</span>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                Updated just now
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <CategoryForm 
        isOpen={isEditDialogOpen}
        onClose={handleCloseDialog}
        category={category}
        mode='edit'
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="border-0 shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-gray-900">
              Delete Category
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              This will permanently delete the category "{category.category_name}" and all its associated data.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="btn-outline-modern">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete Category
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}