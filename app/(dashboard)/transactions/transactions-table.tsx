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
import { ArrowUpDown, ChevronDown, MoreHorizontal } from 'lucide-react'

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

// Define the Transaction type
export type Transaction = {
  id: string
  date: string
  description: string
  category: string
  amount: number
  type: 'income' | 'expense'
  status: 'completed' | 'pending' | 'failed'
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
    cell: ({ row }) => <div>{row.getValue('description')}</div>,
  },
  {
    accessorKey: 'category',
    header: 'Category',
    cell: ({ row }) => <div>{row.getValue('category')}</div>,
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
  

  {
    accessorKey: 'recurring',
    header: 'Recurring',
    cell: ({ row }) => {
      const recurring = row.getValue('recurring') as boolean
      return recurring ? (
        <Badge variant="outline" className="bg-blue-100">
          Recurring
        </Badge>
      ) : null
    },
  },
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
      const transaction = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(transaction.id)}
            >
              Copy transaction ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View details</DropdownMenuItem>
            <DropdownMenuItem>Edit transaction</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">Delete transaction</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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

  const { transactions, isLoading, error } = useTransactions()

  const handleAddTransaction = () => {
    setShowNewTransactionModal(true)
  }

  const transformedData = React.useMemo(() => {
    // if (!transactions || transactions.length === 0) {  // TODO LATER
    //   return data // Use dummy data if no real transactions
    // }
    
    return transactions.map(transaction => ({
      id: transaction.transaction_id,
      date: transaction.transaction_date ? new Date(transaction.transaction_date).toISOString().split('T')[0] : '',
      description: transaction.description || '',
      category: transaction.categories && transaction.categories.length > 0 
        ? transaction.categories.map(cat => cat.name).join(', ') 
        : 'Uncategorized',
      amount: transaction.amount,
      type: transaction.transaction_type,
      status: transaction.status,
    recurring: transaction.recurring || false,
    account: transaction.account_id || 'Cash'
    }))
  }, [transactions])

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