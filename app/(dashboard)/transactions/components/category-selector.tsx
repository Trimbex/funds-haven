'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { useTransactions } from '@/app/context/transactionsContext'
import { Badge } from '@/components/ui/badge'
import { X, Plus, Tag, CreditCard, ShoppingCart, Home, Utensils, Car, Gift, Briefcase, Heart, Plane, Book, DollarSign } from 'lucide-react'
import { TransactionCategory } from '@/app/server/transactions/transactions'
import Image from 'next/image'

const iconMap: { [key: string]: React.ReactNode } = {
  "Tag": <Tag />,
  "CreditCard": <CreditCard />,
  "ShoppingCart": <ShoppingCart />,
  "Home": <Home />,
  "Utensils": <Utensils />,
  "Car": <Car />,
  "Gift": <Gift />,
  "Briefcase": <Briefcase />,
  "Heart": <Heart />,
  "Plane": <Plane />,
  "Book": <Book />,
  "DollarSign": <DollarSign />
}

interface CategorySelectorProps {
  selectedCategories: TransactionCategory[]
  onChange: (categories: TransactionCategory[]) => void
}

export function CategorySelector({ selectedCategories, onChange }: CategorySelectorProps) {
  const { categories } = useTransactions()
  const [inputValue, setInputValue] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) && 
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Helper function to render category icon
  const renderCategoryIcon = (category: any, size = 'small') => {
    // First try to use the icon if available
    if (category.icon && iconMap[category.icon]) {
      return React.cloneElement(iconMap[category.icon] as React.ReactElement, { 
        className: size === 'small' ? "h-3 w-3" : "h-4 w-4",
        color: "currentColor"
      });
    } 
    // Then fall back to image if available
    else if (category.image) {
      return (
        <div className={size === 'small' ? "w-3 h-3" : "w-4 h-4"}>
          <Image 
            src={category.image} 
            alt="" 
            width={size === 'small' ? 12 : 16} 
            height={size === 'small' ? 12 : 16} 
            className="object-contain"
          />
        </div>
      );
    }
    // Finally, use a default tag icon
    else {
      return <Tag className={size === 'small' ? "h-3 w-3" : "h-4 w-4"} />;
    }
  };

  // Filter categories based on input
  const filteredCategories = inputValue 
    ? categories.filter(cat => 
        cat.category_name.toLowerCase().includes(inputValue.toLowerCase()) && 
        !selectedCategories.some(selected => selected.id === cat.category_id)
      )
    : categories.filter(cat => 
        !selectedCategories.some(selected => selected.id === cat.category_id)
      )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
    setIsDropdownOpen(true)
  }

  const handleInputFocus = () => {
    setIsDropdownOpen(true)
  }

  const handleSelectCategory = (category: any) => {
    onChange([...selectedCategories, { 
      id: category.category_id, 
      name: category.category_name 
    }])
    setInputValue('')
    inputRef.current?.focus()
  }

  const handleAddCustomCategory = () => {
    if (inputValue.trim()) {
      onChange([...selectedCategories, { id: null, name: inputValue.trim() }])
      setInputValue('')
      setIsDropdownOpen(false)
      inputRef.current?.focus()
    }
  }

  const handleRemoveCategory = (index: number) => {
    const newCategories = [...selectedCategories]
    newCategories.splice(index, 1)
    onChange(newCategories)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (filteredCategories.length > 0) {
        handleSelectCategory(filteredCategories[0])
      } else if (inputValue.trim()) {
        handleAddCustomCategory()
      }
    }
  }

  return (
    <div className="w-full relative">
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedCategories.map((category, index) => {
          const matchedCategory = category.id ? 
            categories.find(c => c.category_id === category.id) : null;
          
          return (
            <Badge 
              key={index} 
              style={{ 
                backgroundColor: matchedCategory?.color || '#e5e7eb'
              }}
              className="flex items-center gap-1 px-3 py-1 text-sm"
            >
              <span className="mr-1 flex-shrink-0">
                {matchedCategory ? renderCategoryIcon(matchedCategory) : <Tag className="h-3 w-3" />}
              </span>
              {category.name}
              <X 
                className="h-3 w-3 cursor-pointer opacity-70 hover:opacity-100 ml-1" 
                onClick={() => handleRemoveCategory(index)} 
              />
            </Badge>
          );
        })}
      </div>

      <div className="relative">
        <Input
          ref={inputRef}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder="Add category..."
          className="w-full"
        />

        {isDropdownOpen && (
          <div 
            ref={dropdownRef}
            className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          >
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category) => (
                <div
                  key={category.category_id}
                  onClick={() => handleSelectCategory(category)}
                  className="flex items-center px-4 py-2 text-sm cursor-pointer hover:bg-gray-100"
                >
                  <div 
                    className="h-5 w-5 rounded-full mr-2 flex items-center justify-center" 
                    style={{ backgroundColor: category.color || '#e5e7eb' }}
                  >
                    {renderCategoryIcon(category, 'medium')}
                  </div>
                  {category.category_name}
                </div>
              ))
            ) : (
              inputValue.trim() ? (
                <div
                  onClick={handleAddCustomCategory}
                  className="flex items-center px-4 py-2 text-sm cursor-pointer hover:bg-gray-100"
                >
                  <Plus className="h-3 w-3 mr-2" />
                  Add "{inputValue}" as new category
                </div>
              ) : (
                <div className="px-4 py-2 text-sm text-gray-400">
                  Type to create a new category
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  )
} 