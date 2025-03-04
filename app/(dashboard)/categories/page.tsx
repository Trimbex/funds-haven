'use client';

import React from 'react';
import { motion } from "framer-motion";
import Header  from './components/header'
import CategoryCard from './components/category-card';

export default function CategoriesPage() {
  return (
    <>
    <Header />
    <div className="flex justify-center items-center mt-8">
    <CategoryCard />
    </div>
    </>
  );
}