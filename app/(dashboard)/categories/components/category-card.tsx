'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Wallet, CreditCard, DollarSign, ArrowUp, ArrowDown, Pencil, Trash2, Repeat } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';


export type Category = {
    category_id: string;
    category_name: string;
    category_description: string;
    tags: string[];
    image: string;
    budget: number;
    spent: number;
    predefined: boolean;
    color: string;
    recurring: boolean;
};


export default function CategoryCard({ category }: { category: Category }) {
  const budget = 5000;
  const spent = 3500;
  
  // Example tags for SEO
  const tags = ["Tag1", "Tag2", "Tag3"];

  return (
        <Card className="relative flex flex-row overflow-hidden w-full lg:w-2/3">
            <div 
            style={{backgroundColor: category.color}}
            className={`absolute top-0 left-0 w-full h-2 ${!category.color ? 'bg-neutral-950' : ''} z-10`}
            />

            <div className='relative w-1/3 h-auto '>
            <Image 
                src={category.image} 
                alt="category image" 
                fill 
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" 
                priority 
                className='object-cover' 
                />

            </div>

            <div className='w-2/3 '>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <CardTitle className='mt-4 text-4xl font-bold'>
                            {category.category_name}
                        </CardTitle>
                        {category.recurring && <Badge variant="secondary" className="mt-4 flex items-center gap-1">
                            <Repeat className="w-4 h-4" />
                            Recurring
                        </Badge>}
                    </div>
                    <CardDescription className='text-2xl'>
                        {category.category_description}
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
                <div className="flex items-center mb-2 flex-wrap gap-2">
                    {category.tags?.tags.map((tag, index) => (
                        <Badge key={index} className="bg-gray-100 text-gray-800 hover:bg-gray-100 text-md rounded-full border-0 shadow-sm px-3 py-1">
                        {tag}
                    </Badge>
                    ))}
                </div>
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