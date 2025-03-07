'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';


export type Category =
{
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
}

type CategoryContextType = {

    categories: Category[];
    addCategory: (category: Category) => void;
    updateCategory: (category: Category) => void;
    deleteCategory: (category_id: string) => void;
    editCategory: (category_id: string) => void;



}
export const CategoryContext = createContext<CategoryContextType>(
    {   categories: [],
        addCategory: () => {},
        updateCategory: () => {},
        deleteCategory: () => {},
        editCategory: () => {},
    }
);

export const CategoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    

    return(

    )
}





export const useCategories = () => useContext(CategoryContext);
