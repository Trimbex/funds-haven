'use client'
import DotLoader from "@/components/loader/loader";
import * as React from 'react'
import { useTransactions } from '@/app/context/transactionsContext'
import { NewTransactionModal } from './components/new-transaction-modal'
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { 
  ArrowUpDown, 
  ChevronDown, 
  MoreHorizontal, 
  Eye, 
  RepeatIcon, 
  Tag, 
  CreditCard, 
  ShoppingCart, 
  Home, 
  Utensils, 
  Car, 
  Gift, 
  Briefcase, 
  Heart, 
  Plane, 
  Book, 
  DollarSign,
  Search,
  X,
  Filter
} from 'lucide-react'
import Image from 'next/image'
import { useState, useEffect, useCallback } from 'react'
import { format } from 'date-fns'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Label } from '@/components/ui/label'
import { Calendar } from '@/components/ui/calendar'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { TransactionDetailsModal } from './components/transaction-details-modal'
import { GenerateRecurrenceModal } from './components/generate-recurrence-modal'
import { useAccounts } from '@/app/context/accountContext'

// Icon mapping object
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

// Define the Transaction type
export type Transaction = {
  id: string
  date: string | Date
  description: string
  category: string
  categoryData: Array<{
    id: string | null
    name: string
    color: string
    image?: string
    icon?: string
  }>
  amount: number
  type: 'income' | 'expense'
  status: 'completed' | 'pending' | 'failed'
  recurring: boolean
  account: string
  account_id?: string
  recurrence_id?: string | null
  recurrence_frequency?: string
  recurrence_interval?: number
  recurrence_start_date?: Date | string
  recurrence_end_date?: Date | string | null
  parent_transaction_id?: string | null
}

// Sample data
const data: Transaction[] = [
  {
    id: '1',
    date: '2023-05-01',
    description: 'Grocery Shopping',
    category: 'Food',
    amount: 85.75,
    type: 'expense',
    status: 'completed',
  },
  {
    id: '2',
    date: '2023-05-03',
    description: 'Salary Deposit',
    category: 'Income',
    amount: 3500.00,
    type: 'income',
    status: 'completed',
  },
  {
    id: '3',
    date: '2023-05-05',
    description: 'Rent Payment',
    category: 'Housing',
    amount: 1200.00,
    type: 'expense',
    status: 'completed',
  },
  {
    id: '4',
    date: '2023-05-10',
    description: 'Freelance Work',
    category: 'Income',
    amount: 750.00,
    type: 'income',
    status: 'pending',
  },
  {
    id: '5',
    date: '2023-05-15',
    description: 'Utility Bills',
    category: 'Utilities',
    amount: 145.30,
    type: 'expense',
    status: 'completed',
  },
  {
    id: '6',
    date: '2023-05-20',
    description: 'Online Shopping',
    category: 'Shopping',
    amount: 67.99,
    type: 'expense',
    status: 'failed',
  },
  {
    id: '7',
    date: '2023-05-25',
    description: 'Dividend Payment',
    category: 'Investment',
    amount: 120.50,
    type: 'income',
    status: 'completed',
  },
]

// Helper function to render category icon
const renderCategoryIcon = (category: any, size = 'small') => {
  // First try to use the icon if available
  if (category.icon && iconMap[category.icon]) {
    return React.cloneElement(iconMap[category.icon] as React.ReactElement, { 
      className: size === 'small' ? "h-2 w-2" : "h-3 w-3",
      color: "currentColor"
    });
  } 
  // Then fall back to image if available
  else if (category.image) {
    return (
      <div className={size === 'small' ? "w-2 h-2" : "w-3 h-3"}>
        <Image 
          src={category.image} 
          alt="" 
          width={size === 'small' ? 8 : 12} 
          height={size === 'small' ? 8 : 12} 
          className="object-contain"
        />
      </div>
    );
  }
  // Finally, use a default tag icon
  else {
    return <Tag className={size === 'small' ? "h-2 w-2" : "h-3 w-3"} />;
  }
};

export function TransactionsTable() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [showNewTransactionModal, setShowNewTransactionModal] = useState<boolean>(false)
  const [highlightedTransaction, setHighlightedTransaction] = useState<string | null>(null)
  const [searchingForParent, setSearchingForParent] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false)
  const [advancedFilters, setAdvancedFilters] = useState({
    amount: { min: '', max: '' },
    dateRange: { from: undefined, to: undefined } as { from: Date | undefined, to: Date | undefined },
    types: [] as string[],
    statuses: [] as string[],
    categories: [] as string[],
    isRecurring: undefined as boolean | undefined
  })

  const { transactions, isLoading, error, categories } = useTransactions()
  const { accounts } = useAccounts()

  const handleAddTransaction = () => {
    setShowNewTransactionModal(true)
  }

  const transformedData = React.useMemo(() => {
    return transactions.map(transaction => {
      // Process categories with their metadata
      const categoryData = transaction.categories && transaction.categories.length > 0 
        ? transaction.categories.map(cat => {
            if (cat.id) {
              // Find the full category data from the categories context
              const fullCategory = categories.find(c => c.category_id === cat.id);
              return {
                id: cat.id,
                name: cat.name,
                color: fullCategory?.color || '#e5e7eb',
                image: fullCategory?.image,
                icon: fullCategory?.icon
              };
            } else {
              // Custom category without ID
              return {
                id: null,
                name: cat.name,
                color: '#e5e7eb',
                image: undefined,
                icon: undefined
              };
            }
          })
        : [];

      return {
        id: transaction.transaction_id,
        date: transaction.transaction_date ? new Date(transaction.transaction_date) : '',
        description: transaction.description || '',
        category: transaction.categories && transaction.categories.length > 0 
          ? transaction.categories.map(cat => cat.name).join(', ') 
          : 'Uncategorized',
        categoryData,
        amount: transaction.amount,
        type: transaction.transaction_type,
        status: transaction.status,
        recurring: transaction.recurring || false,
        account: transaction.account_id === 'cash' || !transaction.account_id 
          ? 'Cash' 
          : accounts.find(acc => acc.account_id === transaction.account_id)?.account_name || 'Unknown Account',
        account_id: transaction.account_id,
        // Add recurrence details
        recurrence_id: transaction.recurrence_id,
        recurrence_frequency: transaction.recurrence_frequency,
        recurrence_interval: transaction.recurrence_interval,
        recurrence_start_date: transaction.recurrence_start_date,
        recurrence_end_date: transaction.recurrence_end_date,
        parent_transaction_id: transaction.parent_transaction_id
      }
    })
  }, [transactions, categories, accounts])

  // Apply advanced filters to the data
  const filteredData = React.useMemo(() => {
    let filtered = transformedData;
    
    // Apply simple search filter
    if (searchTerm.trim()) {
      const lowercasedSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        item.description.toLowerCase().includes(lowercasedSearch) ||
        item.category.toLowerCase().includes(lowercasedSearch)
      );
    }
    
    // Apply advanced filters
    if (showAdvancedSearch) {
      // Filter by amount range
      if (advancedFilters.amount.min) {
        filtered = filtered.filter(item => item.amount >= parseFloat(advancedFilters.amount.min));
      }
      if (advancedFilters.amount.max) {
        filtered = filtered.filter(item => item.amount <= parseFloat(advancedFilters.amount.max));
      }
      
      // Filter by date range
      if (advancedFilters.dateRange.from) {
        const fromDate = new Date(advancedFilters.dateRange.from);
        filtered = filtered.filter(item => {
          const itemDate = new Date(item.date);
          return itemDate >= fromDate;
        });
      }
      if (advancedFilters.dateRange.to) {
        const toDate = new Date(advancedFilters.dateRange.to);
        toDate.setHours(23, 59, 59, 999); // End of the day
        filtered = filtered.filter(item => {
          const itemDate = new Date(item.date);
          return itemDate <= toDate;
        });
      }
      
      // Filter by transaction types
      if (advancedFilters.types.length > 0) {
        filtered = filtered.filter(item => advancedFilters.types.includes(item.type));
      }
      
      // Filter by statuses
      if (advancedFilters.statuses.length > 0) {
        filtered = filtered.filter(item => advancedFilters.statuses.includes(item.status));
      }
      
      // Filter by categories
      if (advancedFilters.categories.length > 0) {
        filtered = filtered.filter(item => 
          item.categoryData.some(cat => advancedFilters.categories.includes(cat.name))
        );
      }
      
      // Filter by recurring status
      if (advancedFilters.isRecurring !== undefined) {
        filtered = filtered.filter(item => 
          advancedFilters.isRecurring ? !!item.recurrence_id : !item.recurrence_id
        );
      }
    }
    
    return filtered;
  }, [transformedData, searchTerm, showAdvancedSearch, advancedFilters]);
  
  // Reset filters
  const resetFilters = () => {
    setAdvancedFilters({
      amount: { min: '', max: '' },
      dateRange: { from: undefined, to: undefined },
      types: [],
      statuses: [],
      categories: [],
      isRecurring: undefined
    });
    setSearchTerm('');
  };
  
  // Get unique categories for filter dropdown
  const uniqueCategories = React.useMemo(() => {
    const categorySet = new Set<string>();
    transformedData.forEach(transaction => {
      transaction.categoryData.forEach(cat => {
        if (cat.name) categorySet.add(cat.name);
      });
    });
    return Array.from(categorySet);
  }, [transformedData]);

  // Define the columns
  const columns = React.useMemo<ColumnDef<Transaction>[]>(() => [
    // Date column
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ row }) => {
        const date = new Date(row.getValue('date'))
        return <div>{date.toLocaleDateString()}</div>
      },
    },
    // Description column with parent link
    {
      accessorKey: 'description',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Description
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const isRecurringParent = !!row.original.recurrence_id && !row.original.parent_transaction_id;
        const isRecurringInstance = !!row.original.parent_transaction_id;
        
        return (
          <div className="flex items-center gap-2">
            <span>{row.getValue('description')}</span>
            {isRecurringParent && (
              <div className="flex items-center">
                <RepeatIcon size={16} className="text-blue-500 flex-shrink-0" title="Recurring parent transaction" />
              </div>
            )}
            {isRecurringInstance && (
              <div className="flex items-center gap-1">
                <span className="text-xs text-muted-foreground">(Instance)</span>
                <button 
                  className="text-blue-500 text-xs underline hover:text-blue-700 focus:outline-none flex items-center gap-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    const parentId = row.original.parent_transaction_id;
                    if (parentId) {
                      scrollToTransaction(parentId);
                    }
                  }}
                  title="View parent transaction"
                >
                  View Parent
                  {searchingForParent === row.original.parent_transaction_id && (
                    <span className="ml-1 animate-spin">⟳</span>
                  )}
                </button>
                <RepeatIcon size={14} className="text-gray-400 flex-shrink-0" title="Generated instance" />
              </div>
            )}
          </div>
        );
      },
    },
    // Other columns
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row }) => {
        const categoryData = row.original.categoryData || []
        
        if (categoryData.length === 0) {
          return <div className="text-muted-foreground">Uncategorized</div>
        }
        
        return (
          <div className="flex flex-wrap gap-1">
            {categoryData.map((cat, index) => (
              <Badge
                key={index}
                style={{ backgroundColor: cat.color || '#e5e7eb' }}
                className="flex items-center gap-1 px-2 py-1 text-xs"
              >
                <span className="mr-1 flex-shrink-0">
                  {renderCategoryIcon(cat)}
                </span>
                {cat.name}
              </Badge>
            ))}
          </div>
        )
      },
    },
    {
      accessorKey: 'amount',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue('amount'))
        const type = row.original.type
        
        // Format the amount as a dollar amount
        const formatted = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(amount)

        return (
          <div className={type === 'income' ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
            {type === 'income' ? '+' : '-'}{formatted}
          </div>
        )
      },
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => {
        const type = row.getValue('type') as string
        return (
          <Badge variant={type === 'income' ? 'outline' : 'secondary'}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as string
        return (
          <Badge 
            variant={
              status === 'completed' ? 'default' : 
              status === 'pending' ? 'outline' : 'destructive'
            }
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'account',
      header: 'Account',
      cell: ({ row }) => {
        const accountId = row.original.account_id
        
        if (!accountId) {
          return <div className="text-muted-foreground">Cash/Other</div>
        }
        
        // Find the account details if available
        const accountDetails = accounts.find(acc => acc.account_id === accountId)
        
        if (!accountDetails) {
          return <div>{row.getValue('account')}</div>
        }
        
        return (
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-muted-foreground" />
            <span>{accountDetails.account_name}</span>
            {accountDetails.cardno && (
              <div className="flex items-center gap-1">
                <span className="text-xs text-muted-foreground font-medium">
                  {accountDetails.card_company}
                </span>
                <span className="text-xs text-muted-foreground">
                  ••••{accountDetails.cardno.slice(-4)}
                </span>
              </div>
            )}
          </div>
        )
      },
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const [showDetails, setShowDetails] = React.useState(false)
        const [showGenerateModal, setShowGenerateModal] = React.useState(false)
        const transaction = row.original

        return (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setShowDetails(true)}>
                  <Eye className="mr-2 h-4 w-4" />
                  View details
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigator.clipboard.writeText(transaction.id)}
                >
                  <ArrowUpDown className="mr-2 h-4 w-4" />
                  Copy ID
                </DropdownMenuItem>
                {transaction.recurrence_id && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Recurrence</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => setShowGenerateModal(true)}>
                      <RepeatIcon className="mr-2 h-4 w-4 text-blue-500" />
                      Generate instances
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <TransactionDetailsModal
              isOpen={showDetails}
              onClose={() => setShowDetails(false)}
              transaction={transaction}
            />
            
            {showGenerateModal && (
              <GenerateRecurrenceModal
                isOpen={showGenerateModal}
                onClose={() => setShowGenerateModal(false)}
                transaction={transaction}
              />
            )}
          </>
        )
      },
    },
  ], [searchingForParent]);

  const table = useReactTable({
    data: filteredData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  // Function to scroll to and highlight a transaction, navigating through pages if needed
  const scrollToTransaction = useCallback(async (transactionId: string) => {
    // First check if transaction is on current page
    const isOnCurrentPage = table.getRowModel().rows.some(row => row.original.id === transactionId);
    
    if (isOnCurrentPage) {
      // If it's on the current page, highlight and scroll to it
      setHighlightedTransaction(transactionId);
      
      // Allow time for the state to update before scrolling
      setTimeout(() => {
        const element = document.getElementById(`transaction-${transactionId}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        
        // Clear the highlight after a few seconds
        setTimeout(() => {
          setHighlightedTransaction(null);
        }, 3000);
      }, 100);
    } else {
      // Set searching state to show loading indicator
      setSearchingForParent(transactionId);
      
      // Not on current page, navigate through pages to find it
      let foundOnPage = false;
      let totalPages = table.getPageCount();
      let currentPage = 0;
      
      while (currentPage < totalPages && !foundOnPage) {
        table.setPageIndex(currentPage);
        
        // Give time for the page to update
        await new Promise(resolve => setTimeout(resolve, 50));
        
        // Check if transaction is on this page
        foundOnPage = table.getRowModel().rows.some(row => row.original.id === transactionId);
        
        if (!foundOnPage) {
          currentPage++;
        }
      }
      
      // Clear searching state
      setSearchingForParent(null);
      
      if (foundOnPage) {
        // Found it, now highlight and scroll
        setHighlightedTransaction(transactionId);
        
        setTimeout(() => {
          const element = document.getElementById(`transaction-${transactionId}`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
          
          setTimeout(() => {
            setHighlightedTransaction(null);
          }, 3000);
        }, 100);
      } else {
        // If not found, show an alert
        alert("Couldn't find the parent transaction. It might have been deleted.");
      }
    }
  }, [table]);

  // Calculate counts for filter summary
  const totalTransactions = filteredData.length;
  const incomeCount = filteredData.filter(t => t.type === 'income').length;
  const expenseCount = filteredData.filter(t => t.type === 'expense').length;
  const recurringCount = filteredData.filter(t => t.recurrence_id).length;

  return (
    <div className="w-full">
      {isLoading ? <div className="h-screen flex items-center justify-center"><DotLoader/></div>: null}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Error loading transactions: {error}
        </div>
      )}

      <NewTransactionModal 
        isOpen={showNewTransactionModal} 
        onClose={() => setShowNewTransactionModal(false)} 
      />

      <div className="flex flex-col space-y-4 py-4">
        {/* Search and filter area */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                className="pl-8 pr-4"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2 top-2.5 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <Button
              variant="outline"
              onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
              className="gap-2"
            >
              <Filter className="h-4 w-4" />
              {showAdvancedSearch ? 'Hide Filters' : 'Filters'}
            </Button>
            <Button 
              onClick={() => setShowNewTransactionModal(true)}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              New Transaction
            </Button>
          </div>

          {/* Advanced search filters */}
          {showAdvancedSearch && (
            <div className="bg-muted/40 rounded-md p-4 border">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-medium">Advanced Filters</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={resetFilters}
                  className="text-xs h-7"
                >
                  Reset Filters
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Amount Range */}
                <div className="space-y-2">
                  <Label className="text-xs">Amount Range</Label>
                  <div className="flex gap-2 items-center">
                    <Input
                      placeholder="Min"
                      type="number"
                      className="h-8 text-xs"
                      value={advancedFilters.amount.min}
                      onChange={(e) => setAdvancedFilters({
                        ...advancedFilters,
                        amount: { ...advancedFilters.amount, min: e.target.value }
                      })}
                    />
                    <span className="text-xs">to</span>
                    <Input
                      placeholder="Max"
                      type="number"
                      className="h-8 text-xs"
                      value={advancedFilters.amount.max}
                      onChange={(e) => setAdvancedFilters({
                        ...advancedFilters,
                        amount: { ...advancedFilters.amount, max: e.target.value }
                      })}
                    />
                  </div>
                </div>
                
                {/* Date Range */}
                <div className="space-y-2">
                  <Label className="text-xs">Date Range</Label>
                  <div className="flex gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="h-8 text-xs w-full justify-start">
                          {advancedFilters.dateRange.from ? (
                            format(advancedFilters.dateRange.from, "PP")
                          ) : (
                            "From Date"
                          )}
                          <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={advancedFilters.dateRange.from}
                          onSelect={(date) => setAdvancedFilters({
                            ...advancedFilters,
                            dateRange: { ...advancedFilters.dateRange, from: date }
                          })}
                        />
                      </PopoverContent>
                    </Popover>
                    
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="h-8 text-xs w-full justify-start">
                          {advancedFilters.dateRange.to ? (
                            format(advancedFilters.dateRange.to, "PP")
                          ) : (
                            "To Date"
                          )}
                          <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={advancedFilters.dateRange.to}
                          onSelect={(date) => setAdvancedFilters({
                            ...advancedFilters,
                            dateRange: { ...advancedFilters.dateRange, to: date }
                          })}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                
                {/* Transaction Type */}
                <div className="space-y-2">
                  <Label className="text-xs">Transaction Type</Label>
                  <div className="flex gap-2">
                    <Button
                      variant={advancedFilters.types.includes('income') ? "default" : "outline"}
                      size="sm"
                      className="h-8 text-xs flex-1"
                      onClick={() => {
                        const newTypes = advancedFilters.types.includes('income')
                          ? advancedFilters.types.filter(t => t !== 'income')
                          : [...advancedFilters.types, 'income'];
                        setAdvancedFilters({
                          ...advancedFilters,
                          types: newTypes
                        });
                      }}
                    >
                      Income
                    </Button>
                    <Button
                      variant={advancedFilters.types.includes('expense') ? "default" : "outline"}
                      size="sm"
                      className="h-8 text-xs flex-1"
                      onClick={() => {
                        const newTypes = advancedFilters.types.includes('expense')
                          ? advancedFilters.types.filter(t => t !== 'expense')
                          : [...advancedFilters.types, 'expense'];
                        setAdvancedFilters({
                          ...advancedFilters,
                          types: newTypes
                        });
                      }}
                    >
                      Expense
                    </Button>
                  </div>
                </div>
                
                {/* Status */}
                <div className="space-y-2">
                  <Label className="text-xs">Status</Label>
                  <div className="flex flex-wrap gap-2">
                    {['completed', 'pending', 'failed'].map(status => (
                      <Button
                        key={status}
                        variant={advancedFilters.statuses.includes(status) ? "default" : "outline"}
                        size="sm"
                        className="h-8 text-xs"
                        onClick={() => {
                          const newStatuses = advancedFilters.statuses.includes(status)
                            ? advancedFilters.statuses.filter(s => s !== status)
                            : [...advancedFilters.statuses, status];
                          setAdvancedFilters({
                            ...advancedFilters,
                            statuses: newStatuses
                          });
                        }}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>
                
                {/* Categories */}
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-xs">Categories</Label>
                  <div className="flex flex-wrap gap-2">
                    {uniqueCategories.length > 0 ? (
                      uniqueCategories.map(category => (
                        <Button
                          key={category}
                          variant={advancedFilters.categories.includes(category) ? "default" : "outline"}
                          size="sm"
                          className="h-8 text-xs"
                          onClick={() => {
                            const newCategories = advancedFilters.categories.includes(category)
                              ? advancedFilters.categories.filter(c => c !== category)
                              : [...advancedFilters.categories, category];
                            setAdvancedFilters({
                              ...advancedFilters,
                              categories: newCategories
                            });
                          }}
                        >
                          {category}
                        </Button>
                      ))
                    ) : (
                      <span className="text-xs text-muted-foreground">No categories available</span>
                    )}
                  </div>
                </div>
                
                {/* Recurring */}
                <div className="space-y-2">
                  <Label className="text-xs">Recurring</Label>
                  <div className="flex gap-2">
                    <Button
                      variant={advancedFilters.isRecurring === true ? "default" : "outline"}
                      size="sm"
                      className="h-8 text-xs flex-1"
                      onClick={() => setAdvancedFilters({
                        ...advancedFilters,
                        isRecurring: advancedFilters.isRecurring === true ? undefined : true
                      })}
                    >
                      Recurring
                    </Button>
                    <Button
                      variant={advancedFilters.isRecurring === false ? "default" : "outline"}
                      size="sm"
                      className="h-8 text-xs flex-1"
                      onClick={() => setAdvancedFilters({
                        ...advancedFilters,
                        isRecurring: advancedFilters.isRecurring === false ? undefined : false
                      })}
                    >
                      Non-Recurring
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Filter results summary */}
          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            <span>Results: {totalTransactions} transaction(s)</span>
            <span>•</span>
            <span>Income: {incomeCount}</span>
            <span>•</span>
            <span>Expenses: {expenseCount}</span>
            <span>•</span>
            <span>Recurring: {recurringCount}</span>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  id={`transaction-${row.original.id}`}
                  className={highlightedTransaction === row.original.id 
                    ? "bg-yellow-100 transition-colors duration-500" 
                    : ""}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={table.getAllColumns().length} className="h-24 text-center">
                  No transactions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}