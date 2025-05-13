'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useTransactions } from '@/app/context/transactionsContext'
import { useAccounts } from '@/app/context/accountContext'
import { CategorySelector } from './category-selector'
import { TransactionCategory } from '@/app/server/transactions/transactions'
import { CreditCard } from 'lucide-react'

export function NewTransactionModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<TransactionCategory[]>([])
  const [type, setType] = useState<'income' | 'expense'>('expense')
  const [date, setDate] = useState('')
  const [status, setStatus] = useState<'completed' | 'pending' | 'failed'>('completed')
  const [accountId, setAccountId] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { addTransaction, userID } = useTransactions()
  const { accounts } = useAccounts()

  useEffect(() => {
    // Set the current date as default when modal opens
    setDate(new Date().toISOString().split('T')[0])
  }, [isOpen])

  const handleCategoryChange = (categories: TransactionCategory[]) => {
    setSelectedCategories(categories)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      if (!userID) {
        throw new Error('User ID not found')
      }

      // Check if at least one category is selected
      if (selectedCategories.length === 0) {
        throw new Error('Please select at least one category')
      }

      // Ensure we have a valid date string
      if (!date) {
        throw new Error('Invalid date')
      }

      // Create the date object more safely
      const transactionDate = new Date(date + 'T12:00:00Z')
      console.log('Date string input:', date)
      console.log('Transaction date object:', transactionDate)
      console.log('Is valid date?', transactionDate instanceof Date && !isNaN(transactionDate.getTime()))

      const newTransaction = {
        amount: parseFloat(amount),
        description,
        transaction_date: transactionDate, // Send as ISO string
        transaction_type: type,
        categories: selectedCategories,
        recurring: false,
        status: status,
        account_id: accountId === 'cash' ? accountId : (accountId || undefined)
      }

      console.log('Full transaction object:', JSON.stringify(newTransaction, null, 2)) 

      const result = await addTransaction(userID, newTransaction)
      
      if (result) {
        // Reset form and close modal
        setDescription('')
        setAmount('')
        setSelectedCategories([])
        setType('expense')
        setDate(new Date().toISOString().split('T')[0])
        setStatus('completed')
        setAccountId('')
        onClose()
      } else {
        setError('Failed to add transaction')
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while adding the transaction')
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Transaction</DialogTitle>
          <DialogDescription>
            Enter the details of your new transaction below.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm">
              {error}
            </div>
          )}
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              <Select
                value={type}
                onValueChange={(value: 'income' | 'expense') => setType(value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                Amount
              </Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <div className="col-span-3">
                <CategorySelector 
                  selectedCategories={selectedCategories}
                  onChange={handleCategoryChange}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Date
              </Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select
                value={status}
                onValueChange={(value: 'completed' | 'pending' | 'failed') => setStatus(value)}
              >
                <SelectTrigger id="status" className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="account" className="text-right">
                Account
              </Label>
              <Select
                value={accountId}
                onValueChange={(value) => setAccountId(value)}
              >
                <SelectTrigger id="account" className="col-span-3">
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash/Other</SelectItem>
                  {accounts && accounts.map((account) => (
                    <SelectItem key={account.account_id} value={account.account_id}>
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        <span>{account.account_name}</span>
                        {account.cardno && (
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-muted-foreground font-medium">
                              {account.card_company}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              ••••{account.cardno.slice(-4)}
                            </span>
                          </div>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Transaction'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}