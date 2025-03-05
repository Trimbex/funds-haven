'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Wallet, CreditCard, DollarSign, ArrowUp, ArrowDown, Pencil, Trash2, Repeat } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

export default function CategoryCard() {
  const budget = 5000;
  const spent = 3500;
  const spentPercentage = Math.round((spent / budget) * 100);

  // Determine progress bar color based on percentage
  const getProgressColor = () => {
    if (spentPercentage <= 50) return "bg-green-500";
    if (spentPercentage <= 75) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
        <Card className="relative flex flex-row overflow-hidden w-full lg:w-2/3">
            <div 
            className='absolute top-0 left-0 w-full h-2 bg-cyan-500 z-10' 
            />

            <div className='relative w-1/3 h-auto '>
            <Image src="/login.jpg" alt="category image" fill className='object-cover' />
            </div>

            <div className='w-2/3 '>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <CardTitle className='mt-4 text-4xl font-bold'>
                            Category Name
                        </CardTitle>
                        <Badge variant="secondary" className="mt-4 flex items-center gap-1">
                            <Repeat className="w-4 h-4" />
                            Recurring
                        </Badge>
                    </div>
                    <CardDescription className='text-2xl'>
                        Category description. Some text for testing 
                    </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" className="text-cyan-500 hover:text-cyan-600">
                        <Pencil className="w-5 h-5" />
                    </Button>
                    <Button variant="destructive" size="icon">
                        <Trash2 className="w-5 h-5" />
                    </Button>
                </div>
            </CardHeader>

            <div className="px-6 mt-2">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-500">
                        Spent: ${spent} of ${budget}
                    </span>
                    <span className="text-sm font-medium text-gray-500">
                        {spentPercentage}%
                    </span>
                </div>
                <Progress 
                    value={spentPercentage} 
                    className={`w-full h-2 ${getProgressColor()}`}
                />
            </div>

            <CardContent>
                <div className='mt-6 flex flex-row justify-between gap-2'>

                    <Card className='h-full w-full flex flex-col items-center justify-center'>
                            <CardTitle className='text-2xl text-center flex items-center gap-2'>
                                <Wallet className="w-6 h-6 text-cyan-500" />
                                Budget
                            </CardTitle>
                            <CardContent className="flex flex-col items-center justify-center">
                                <div className="mt-4 text-4xl font-bold text-center">$5000</div>
                                <div className="flex items-center gap-1 mt-2 text-sm">
                                    <ArrowDown className="w-4 h-4 text-red-500" />
                                    <span className="text-red-500">5% less than last month</span>
                                </div>
                            </CardContent>
                    </Card>
                    
                    <Card className='h-full w-full flex flex-col items-center justify-center'>
                            <CardTitle className='text-2xl text-center flex items-center gap-2'>
                                <CreditCard className="w-6 h-6 text-cyan-500" />
                                Amount Spent
                            </CardTitle>
                            <CardContent className="flex flex-col items-center justify-center">
                                <div className="mt-4 text-4xl font-bold text-center">$2500</div>
                                <div className="flex items-center gap-1 mt-2 text-sm">
                                    <ArrowDown className="w-4 h-4 text-red-500" />
                                    <span className="text-red-500">5% less than last month</span>
                                </div>
                            </CardContent>
                    </Card>
                    
                    <Card className='h-full w-full flex flex-col items-center justify-center'>
                            <CardTitle className='text-2xl text-center flex items-center gap-2'>
                                <DollarSign className="w-6 h-6 text-cyan-500" />
                                Remaining
                            </CardTitle>
                            <CardContent className="flex flex-col items-center justify-center">
                                <div className="mt-4 text-4xl font-bold text-center">$2500</div>
                                <div className="flex items-center gap-1 mt-2 text-sm">
                                    <ArrowUp className="w-4 h-4 text-green-500" />
                                    <span className="text-green-500">12% more than last month</span>
                                </div>
                            </CardContent>
                    </Card>

                </div>


            </CardContent>
            </div>

        </Card>
  );
}