'use client';

import React, { useState, useEffect } from 'react';
import { useCategories } from '@/app/context/categoryContext';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  ShoppingCart, Home, Car, Briefcase, Utensils, Plane,
  CreditCard, BookOpen, Heart, Gift, Coffee, Film,
  Music, DollarSign, Smartphone, Wifi, Zap, Droplet,
  ShoppingBag, PieChart, Activity, Award, Calendar, 
  Headphones, Anchor, Globe, Camera, Users
} from 'lucide-react';
import CategoryBasicsTab from './sub-components/category-basics';
import CategoryAppearanceTab from './sub-components/category-appearance';

// Updated Category type to match your actual data structure
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
  icon?: string;
};

// Preset tags users can select from
export const PRESET_TAGS = [
  'Food', 'Transport', 'Healthcare', 'Entertainment', 
  'Education', 'Shopping', 'Utilities', 'Housing', 
  'Travel', 'Fitness', 'Subscriptions', 'Gifts'
];

// Preset images for categories
export const PRESET_IMAGES = [
  { name: 'Food', path: '/images/food.jpg' },
  { name: 'Healthcare', path: '/images/healthcare.svg' },
  { name: 'Transport', path: '/images/transport.jpg' },
  { name: 'Entertainment', path: '/images/entertainment.png' },
  { name: 'Education', path: '/images/education.svg' },
  { name: 'Shopping', path: '/images/shopping.jpg' },
  { name: 'Utilities', path: '/images/utilities.png' },
  { name: 'Housing', path: '/images/housing.png' },
  { name: 'Travel', path: '/images/travel.png' },
  { name: 'Default', path: '/images/default.png' }
];


// Preset colors with labels
export const PRESET_COLORS = [
  { name: 'Blue', value: '#2563eb' },
  { name: 'Green', value: '#16a34a' },
  { name: 'Red', value: '#dc2626' },
  { name: 'Purple', value: '#9333ea' },
  { name: 'Yellow', value: '#ca8a04' },
  { name: 'Pink', value: '#db2777' },
  { name: 'Cyan', value: '#06b6d4' },
  { name: 'Orange', value: '#ea580c' },
  { name: 'Teal', value: '#0d9488' },
  { name: 'Indigo', value: '#4f46e5' },
];

// Complete icons catalog using Lucide icons
export const CATEGORY_ICONS = [
  { name: 'ShoppingCart', component: ShoppingCart },
  { name: 'Home', component: Home },
  { name: 'Car', component: Car },
  { name: 'Briefcase', component: Briefcase },
  { name: 'Utensils', component: Utensils },
  { name: 'Plane', component: Plane },
  { name: 'CreditCard', component: CreditCard },
  { name: 'BookOpen', component: BookOpen },
  { name: 'Heart', component: Heart },
  { name: 'Gift', component: Gift },
  { name: 'Coffee', component: Coffee },
  { name: 'Film', component: Film },
  { name: 'Music', component: Music },
  { name: 'DollarSign', component: DollarSign },
  { name: 'Smartphone', component: Smartphone },
  { name: 'Wifi', component: Wifi },
  { name: 'Zap', component: Zap },
  { name: 'Droplet', component: Droplet },
  { name: 'ShoppingBag', component: ShoppingBag },
  { name: 'PieChart', component: PieChart },
  { name: 'Activity', component: Activity },
  { name: 'Award', component: Award },
  { name: 'Calendar', component: Calendar },
  { name: 'Headphones', component: Headphones },
  { name: 'Anchor', component: Anchor },
  { name: 'Globe', component: Globe },
  { name: 'Camera', component: Camera },
  { name: 'Users', component: Users }
];

interface CategoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  category?: Category;
}

export default function CategoryForm({ isOpen, onClose, category }: CategoryFormProps) {
  const { addCategory, updateCategory } = useCategories();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("basics");
  
  const [formData, setFormData] = useState<Omit<Category, 'category_id'> & { category_id?: string }>({
    category_name: '',
    category_description: '',
    tags: { tags: [] },
    image: '/login.jpg',
    budget: 0,
    spent: 0,
    predefined: false,
    color: '#06b6d4',
    recurring: false,
    icon: 'ShoppingCart',
  });

  useEffect(() => {
    if (category) {
      setFormData({
        category_id: category.category_id,
        category_name: category.category_name,
        category_description: category.category_description,
        tags: category.tags,
        image: category.image,
        budget: category.budget,
        spent: category.spent,
        predefined: false, // Always set to false regardless of actual value
        color: category.color,
        recurring: category.recurring,
        icon: category.icon || 'ShoppingCart',
      });
      setIsEditing(true);
    } else {
      setFormData({
        category_name: '',
        category_description: '',
        tags: { tags: [] },
        image: '/login.jpg',
        budget: 0,
        spent: 0,
        predefined: false,
        color: '#06b6d4',
        recurring: false,
        icon: 'ShoppingCart',
      });
      setIsEditing(false);
    }
  }, [category, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Always set predefined to false
    const categoryData = {
      ...formData,
      predefined: false
    };
    
    if (isEditing && categoryData.category_id) {
      updateCategory(categoryData as Category);
    } else {
      addCategory({
        ...categoryData,
        category_id: '', // This will be generated by the backend
      } as Category);
    }
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[850px] max-h-[90vh] overflow-hidden p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle>{isEditing ? 'Edit Category' : 'Add New Category'}</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-6">
            <TabsList className="w-full">
              <TabsTrigger value="basics" className="flex-1">Basic Info</TabsTrigger>
              <TabsTrigger value="appearance" className="flex-1">Appearance</TabsTrigger>
            </TabsList>
          </div>
          
          <form onSubmit={handleSubmit} className="overflow-hidden">
            <ScrollArea className="h-[60vh]">
              <div className="p-6">
                <TabsContent value="basics" className="mt-0">
                  <CategoryBasicsTab 
                    formData={formData} 
                    setFormData={setFormData} 
                  />
                </TabsContent>
                
                <TabsContent value="appearance" className="mt-0">
                  <CategoryAppearanceTab 
                    formData={formData} 
                    setFormData={setFormData} 
                  />
                </TabsContent>
              </div>
            </ScrollArea>
            
            <DialogFooter className="p-6">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {isEditing ? 'Update' : 'Create'} Category
              </Button>
            </DialogFooter>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}