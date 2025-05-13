'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { AlertCircle, Trash, RefreshCw, Edit, X } from 'lucide-react'
import { useTransactions } from '@/app/context/transactionsContext'
import { Transaction } from '../transactions-table'
import { CategorySelector } from './category-selector'
import { TransactionCategory } from '@/app/server/transactions/transactions'
import { Badge } from '@/components/ui/badge'
import { RecurrenceModal } from './recurrence-modal'
import { Checkbox } from '@/components/ui/checkbox'

interface TransactionDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  transaction: Transaction
}

export function TransactionDetailsModal({ isOpen, onClose, transaction }: TransactionDetailsModalProps) {
  const { userID, deleteTransaction, updateTransaction } = useTransactions()
  
  const [editMode, setEditMode] = useState(false)
  const [showRecurrenceModal, setShowRecurrenceModal] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cascadeDelete, setCascadeDelete] = useState(true)
  
  // Edit state
  const [description, setDescription] = useState(transaction.description || '')
  const [amount, setAmount] = useState(transaction.amount?.toString() || '')
  const [selectedCategories, setSelectedCategories] = useState<TransactionCategory[]>(
    transaction.categoryData?.map(cat => ({ id: cat.id, name: cat.name })) || []
  )
  const [type, setType] = useState<'income' | 'expense'>(transaction.type as 'income' | 'expense')
  const [date, setDate] = useState(
    transaction.date instanceof Date 
      ? transaction.date.toISOString().split('T')[0] 
      : new Date(transaction.date).toISOString().split('T')[0]
  )
  const [status, setStatus] = useState(transaction.status || 'completed')
  
  const handleCategoryChange = (categories: TransactionCategory[]) => {
    setSelectedCategories(categories)
  }
  
  const handleEdit = () => {
    setEditMode(true)
  }
  
  const handleCancelEdit = () => {
    // Reset form state
    setDescription(transaction.description || '')
    setAmount(transaction.amount?.toString() || '')
    setSelectedCategories(
      transaction.categoryData?.map(cat => ({ id: cat.id, name: cat.name })) || []
    )
    setType(transaction.type as 'income' | 'expense')
    setDate(
      transaction.date instanceof Date 
        ? transaction.date.toISOString().split('T')[0] 
        : new Date(transaction.date).toISOString().split('T')[0]
    )
    setStatus(transaction.status || 'completed')
    
    setEditMode(false)
    setError(null)
  }
  
  const handleSubmitEdit = async () => {
    if (!userID) {
      setError('User ID not found')
      return
    }
    
    setIsSubmitting(true)
    setError(null)
    
    try {
      const parsedAmount = parseFloat(amount)
      if (isNaN(parsedAmount)) {
        throw new Error('Invalid amount')
      }
      
      const result = await updateTransaction(transaction.id, userID, {
        description,
        amount: parsedAmount,
        categories: selectedCategories,
        transaction_type: type,
        transaction_date: new Date(date),
        status: status as 'completed' | 'pending' | 'failed'
      })
      
      if (result) {
        setEditMode(false)
        onClose()
      } else {
        setError('Failed to update transaction')
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while updating the transaction')
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const handleDelete = async () => {
    if (!userID) {
      setError('User ID not found')
      return
    }
    
    setIsSubmitting(true)
    setError(null)
    
    try {
      const options = transaction.recurrence_id && !transaction.parent_transaction_id
        ? { cascade: cascadeDelete }
        : undefined;
        
      const result = await deleteTransaction(transaction.id, userID, options)
      
      if (result) {
        onClose()
      } else {
        setError('Failed to delete transaction')
        setDeleteConfirmation(false)
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while deleting the transaction')
      console.error(err)
      setDeleteConfirmation(false)
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const handleSetupRecurring = () => {
    setShowRecurrenceModal(true)
  }
  
  const formatRecurrenceDetails = () => {
    if (!transaction.recurrence_frequency) return null
    
    const interval = transaction.recurrence_interval || 1
    const frequency = transaction.recurrence_frequency
    
    let text = `Repeats ${interval > 1 ? `every ${interval} ` : 'every '}`
    
    switch (frequency) {
      case 'weekly':
        text += interval > 1 ? 'weeks' : 'week'
        break
      case 'monthly':
        text += interval > 1 ? 'months' : 'month'
        break
      case 'yearly':
        text += interval > 1 ? 'years' : 'year'
        break
    }
    
    if (transaction.recurrence_end_date) {
      text += ` until ${new Date(transaction.recurrence_end_date).toLocaleDateString()}`
    }
    
    return text
  }
  
  const isRecurringParent = transaction.recurrence_id && !transaction.parent_transaction_id;
  
  return (
    <>
      <Dialog open={isOpen} onOpenChange={() => {
        if (!isSubmitting) {
          onClose()
        }
      }}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editMode ? 'Edit Transaction' : 'Transaction Details'}
            </DialogTitle>
          </DialogHeader>
          
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4 mr-2" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {deleteConfirmation && (
            <Alert variant="destructive" className="mb-4">
              <div className="flex flex-col items-center w-full">
                <p className="mb-2">Are you sure you want to delete this transaction?</p>
                
                {isRecurringParent && (
                  <div className="flex items-center mb-3 space-x-2">
                    <Checkbox 
                      id="cascade-delete" 
                      checked={cascadeDelete} 
                      onCheckedChange={(checked) => setCascadeDelete(checked === true)}
                    />
                    <label 
                      htmlFor="cascade-delete" 
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Also delete all instances of this recurring transaction
                    </label>
                  </div>
                )}
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setDeleteConfirmation(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={handleDelete}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Deleting...' : 'Confirm Delete'}
                  </Button>
                </div>
              </div>
            </Alert>
          )}
          
          {transaction.recurrence_id && !editMode && (
            <div className="bg-blue-50 p-3 rounded-md flex items-start mb-4">
              <RefreshCw className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-blue-700 font-medium text-sm">Recurring Transaction</p>
                <p className="text-blue-600 text-sm">{formatRecurrenceDetails()}</p>
              </div>
            </div>
          )}
          
          <div className="grid gap-4 py-4">
            {editMode ? (
              // Edit Form
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-type" className="text-right">
                    Type
                  </Label>
                  <Select
                    value={type}
                    onValueChange={(value: 'income' | 'expense') => setType(value)}
                  >
                    <SelectTrigger id="edit-type" className="col-span-3">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="income">Income</SelectItem>
                      <SelectItem value="expense">Expense</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-description" className="text-right">
                    Description
                  </Label>
                  <Input
                    id="edit-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-amount" className="text-right">
                    Amount
                  </Label>
                  <Input
                    id="edit-amount"
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
                  <Label htmlFor="edit-date" className="text-right">
                    Date
                  </Label>
                  <Input
                    id="edit-date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="col-span-3"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-status" className="text-right">
                    Status
                  </Label>
                  <Select
                    value={status}
                    onValueChange={(value) => setStatus(value)}
                  >
                    <SelectTrigger id="edit-status" className="col-span-3">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            ) : (
              // View Details
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right font-medium">Type</Label>
                  <div className="col-span-3">
                    <Badge variant={transaction.type === 'income' ? 'outline' : 'secondary'}>
                      {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right font-medium">Description</Label>
                  <div className="col-span-3">{transaction.description || 'N/A'}</div>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right font-medium">Amount</Label>
                  <div className={`col-span-3 font-medium ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {transaction.type === 'income' ? '+' : '-'}
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    }).format(transaction.amount)}
                  </div>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right font-medium">Category</Label>
                  <div className="col-span-3 flex flex-wrap gap-2">
                    {transaction.categoryData && transaction.categoryData.length > 0 ? (
                      transaction.categoryData.map((cat, index) => (
                        <Badge 
                          key={index}
                          style={{ backgroundColor: cat.color || '#e5e7eb' }}
                          className="text-xs px-2 py-1"
                        >
                          {cat.name}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-muted-foreground">Uncategorized</span>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right font-medium">Date</Label>
                  <div className="col-span-3">
                    {transaction.date instanceof Date 
                      ? transaction.date.toLocaleDateString() 
                      : new Date(transaction.date).toLocaleDateString()
                    }
                  </div>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right font-medium">Status</Label>
                  <div className="col-span-3">
                    <Badge 
                      variant={
                        transaction.status === 'completed' ? 'default' : 
                        transaction.status === 'pending' ? 'outline' : 'destructive'
                      }
                    >
                      {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </Badge>
                  </div>
                </div>
                
                {transaction.account && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right font-medium">Account</Label>
                    <div className="col-span-3">{transaction.account}</div>
                  </div>
                )}
              </>
            )}
          </div>
          
          <DialogFooter className="gap-2">
            {editMode ? (
              <>
                <Button type="button" variant="outline" onClick={handleCancelEdit} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button type="button" onClick={handleSubmitEdit} disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
              </>
            ) : (
              <>
                {!transaction.recurrence_id && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="gap-1"
                    onClick={handleSetupRecurring}
                  >
                    <RefreshCw className="h-4 w-4" />
                    Make Recurring
                  </Button>
                )}
                
                <div className="flex gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="gap-1"
                    onClick={handleEdit}
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                  
                  <Button 
                    type="button" 
                    variant="destructive" 
                    className="gap-1"
                    onClick={() => setDeleteConfirmation(true)}
                  >
                    <Trash className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {showRecurrenceModal && (
        <RecurrenceModal
          isOpen={showRecurrenceModal}
          onClose={() => setShowRecurrenceModal(false)}
          transactionId={transaction.id}
          transactionDate={transaction.date instanceof Date ? transaction.date : new Date(transaction.date)}
        />
      )}
    </>
  )
}