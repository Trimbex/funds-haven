'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useCurrentUserID } from '../api/general';

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

type CategoryContextType = {
    categories: Category[];
    addCategory: (category: Category) => Promise<void>;
    updateCategory: (category: Category) => Promise<void>;
    deleteCategory: (category_id: string) => Promise<void>;
    isLoading: boolean;
};

export const CategoryContext = createContext<CategoryContextType>({
    categories: [],
    addCategory: async () => {},
    updateCategory: async () => {},
    deleteCategory: async () => {},
    isLoading: true, 
});

export const CategoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [userID, setUserID] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Get User ID using the hook
    const userResponse = useCurrentUserID();

    // Set user ID when response changes
    useEffect(() => {
        if (userResponse.success && userResponse.userId) {
            setUserID(userResponse.userId);
        } else if (!userResponse.success && userResponse.message !== "Session is loading.") {
            setUserID(null);
            setIsLoading(false);
        }
    }, [userResponse]);

    useEffect(() => {
        const fetchCategories = async () => {
            if(userID)
            try {
                
                const response = await fetch(`/api/categories?user_id=${userID}`); 
                const data = await response.json();
                if (data.success) {
                    setCategories(data.categories);
                }
                setIsLoading(false);
            } catch (error) {
                console.error('Failed to fetch categories:', error);
                setIsLoading(false);
            }
        };
        fetchCategories();
    }, [userID]);

    const addCategory = async (category: Category) => {
        try {
            const response = await fetch('/api/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({...category, user_id: userID}),
            });
            const data = await response.json();
            if (data.success) {
                setCategories((prev) => [...prev, category]);
            }
        } catch (error) {
            console.error('Failed to add category:', error);
        }
    };

    const updateCategory = async (category: Category) => {
        try {
            const response = await fetch('/api/categories', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(category),
            });
            const data = await response.json();
            if (data.success) {
                setCategories((prev) =>
                    prev.map((cat) => (cat.category_id === category.category_id ? category : cat))
                );
            }
        } catch (error) {
            console.error('Failed to update category:', error);
        }
    };

    const deleteCategory = async (category_id: string) => {
        try {
            const response = await fetch('/api/categories', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ category_id }),
            });
            const data = await response.json();
            if (data.success) {
                setCategories((prev) => prev.filter((cat) => cat.category_id !== category_id));
            }
        } catch (error) {
            console.error('Failed to delete category:', error);
        }
    };

    return (
        <CategoryContext.Provider value={{ categories, addCategory, updateCategory, deleteCategory, isLoading }}>
            {children}
        </CategoryContext.Provider>
    );
};

export const useCategories = () => useContext(CategoryContext);
