'use client';

import React from 'react';
import { motion } from "framer-motion";
import Header  from './components/header'
import CategoryCard from './components/category-card';
import { CategoryProvider, useCategories } from '@/app/context/categoryContext';

 function CategoriesPage() {
  const { categories } = useCategories();
  React.useEffect(() => {
    console.log(JSON.stringify(categories, null, 2));
  }, [categories]);
  return (
    <>
    <Header />
    <div className="flex justify-center items-center mt-8">
      {
        categories.map((category) => (
          <CategoryCard key={category.category_id} category={category} />
        ))
      }
    
    </div>
    </>
  );
}

export default function Page()
{
  return (
    <CategoryProvider>
      <CategoriesPage />
    </CategoryProvider>
  );
}