'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function CategoryCard() {
  return (
        <Card className="relative flex flex-row overflow-hidden w-full lg:w-2/3">
            <div 
            className='absolute top-0 left-0 w-full h-2 bg-cyan-500 z-10' 
            />

            <div className='relative w-1/3 h-72 '>
            <Image src="/regstep3.jpg" alt="category image" fill className='object-cover' />
            </div>

            <div className='w-2/3 '>
            <CardHeader>
            <CardTitle className='mt-4 text-4xl font-bold'>
                Category Name
            </CardTitle>
            <CardDescription className='text-2xl'>
                Category description. Some text for testing 
            </CardDescription>
            </CardHeader>

            <CardContent>
                <div className='flex flex-row justify-between gap-2'>
                    <Card className='h-full w-full'>
                        <CardTitle className='text-2xl'>Budget</CardTitle>
                    </Card>

                </div>


            </CardContent>
            </div>

        </Card>
  );
}