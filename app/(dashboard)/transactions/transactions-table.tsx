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
  DollarSign 
} from 'lucide-react'
import Image from 'next/image'

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

// Define the columns
export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({ row }) => {
      const date = new Date(row.getValue('date'))
      return <div>{date.toLocaleDateString()}</div>
    },
  },
  {
    accessorKey: 'description',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Description
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
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
              <RepeatIcon size={14} className="text-gray-400 flex-shrink-0" title="Generated instance" />
            </div>
          )}
        </div>
      );
    },
  },
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
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
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
  

  // {
  //   accessorKey: 'recurring',
  //   header: 'Recurring',
  //   cell: ({ row }) => {
  //     const [showRecurrenceDetails, setShowRecurrenceDetails] = React.useState(false)
  //     const recurring = row.getValue('recurring') as boolean
  //     const transaction = row.original
      
  //     if (!recurring && !transaction.recurrence_id) return null
      
  //     return (
  //       <>
  //         <Button 
  //           variant="ghost" 
  //           size="sm" 
  //           onClick={() => setShowRecurrenceDetails(true)}
  //           className="flex items-center gap-1 text-xs"
  //         >
  //           <RepeatIcon size={14} className="text-blue-500" />
  //           <span className="text-blue-500">Details</span>
  //         </Button>
          
  //         <RecurrenceDetailsModal
  //           isOpen={showRecurrenceDetails}
  //           onClose={() => setShowRecurrenceDetails(false)}
  //           frequency={transaction.recurrence_frequency}
  //           interval={transaction.recurrence_interval}
  //           startDate={transaction.recurrence_start_date || transaction.date}
  //           endDate={transaction.recurrence_end_date}
  //         />
  //       </>
  //     )
  //   },
  // },
  {
    accessorKey: 'account',
    header: 'Account',
    cell: ({ row }) => {
      const account = row.getValue('account') as string
      return account ? <div>{account}</div> : <div className="text-muted-foreground">-</div>
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
]

export function TransactionsTable() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const [showNewTransactionModal, setShowNewTransactionModal] = React.useState(false)

  const { transactions, isLoading, error, categories } = useTransactions()

  const handleAddTransaction = () => {
    setShowNewTransactionModal(true)
  }

  const transformedData = React.useMemo(() => {
    // if (!transactions || transactions.length === 0) {  // TODO LATER
    //   return data // Use dummy data if no real transactions
    // }
    
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
        account: transaction.account_id || 'Cash',
        // Add recurrence details
        recurrence_id: transaction.recurrence_id,
        recurrence_frequency: transaction.recurrence_frequency,
        recurrence_interval: transaction.recurrence_interval,
        recurrence_start_date: transaction.recurrence_start_date,
        recurrence_end_date: transaction.recurrence_end_date,
        parent_transaction_id: transaction.parent_transaction_id
      }
    })
  }, [transactions, categories])

  const table = useReactTable({
    data: transformedData,
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

      <div className="flex items-center py-4">
        <Input
          placeholder="Filter descriptions..."
          value={(table.getColumn('description')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('description')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <Button 
          onClick={() => setShowNewTransactionModal(true)}
          className="ml-4 bg-green-600 hover:bg-green-700 text-white"
        >
          New Transaction
        </Button>
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
                <TableCell colSpan={columns.length} className="h-24 text-center">
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