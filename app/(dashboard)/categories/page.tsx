'use client';

import React from 'react';
import { motion } from "framer-motion";
import Header  from './components/header'
import CategoryCard from './components/category-card';
import { CategoryProvider, useCategories } from '@/app/context/categoryContext';
import DotLoader from "@/components/loader/loader";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import  CategoryForm  from './components/category-form';
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

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

  return (
    <>
      {isLoading ? <div className="h-screen flex items-center justify-center"><DotLoader/></div> :  
        <>
          <Header />
          
          <div className="container mx-auto px-6 py-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow-sm">
              <div className="flex-1 w-full md:w-auto">
                <div className="relative w-full max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search categories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-full"
                  />
                </div>
                
                <div className="flex flex-wrap items-center gap-4 mt-3">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Search in:</span>
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
              
              <Button onClick={() => setIsFormOpen(true)} className="whitespace-nowrap">
                <Plus className="mr-2 h-4 w-4" /> Add Category
              </Button>
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-4 mt-8 px-6">
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category) => (
                <CategoryCard key={category.category_id} category={category} />
              ))
            ) : (
              <div className="text-center py-12">
                <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  No Categories Found
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  {searchQuery 
                    ? "No categories match your search criteria" 
                    : "Get started by adding your first category"}
                </p>
                {/* {!searchQuery && (
                  <Button onClick={() => setIsFormOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Add Category
                  </Button>
                )} */}
              </div>
            )}
          </div>
          
          <CategoryForm 
            isOpen={isFormOpen}
            onClose={() => setIsFormOpen(false)}
            mode="add"
          />
        </>
      }
    </>
  );
}

export default function Page() {
  return (
    <CategoryProvider>
      <CategoriesPage />
    </CategoryProvider>
  );
}