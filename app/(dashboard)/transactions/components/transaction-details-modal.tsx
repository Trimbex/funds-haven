'use client'

import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { CalendarIcon, RepeatIcon, CreditCardIcon, TagIcon, InfoIcon } from 'lucide-react'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'

type TransactionDetailsModalProps = {
  isOpen: boolean
  onClose: () => void
  transaction: {
    id: string
    date: string | Date
    description: string
    category: string
    amount: number
    type: 'income' | 'expense'
    status: 'completed' | 'pending' | 'failed'
    account: string
    recurrence_id?: string | null
    recurrence_frequency?: string
    recurrence_interval?: number
    recurrence_start_date?: Date | string
    recurrence_end_date?: Date | string | null
  }
}

export function TransactionDetailsModal({
  isOpen,
  onClose,
  transaction
}: TransactionDetailsModalProps) {
  
  const formatFrequency = () => {
    if (!transaction.recurrence_frequency) return null
    
    const interval = transaction.recurrence_interval || 1
    const intervalText = interval > 1 ? `${interval} ` : ''
    
    switch (transaction.recurrence_frequency) {
      case 'daily':
        return `Every ${intervalText}day${interval > 1 ? 's' : ''}`
      case 'weekly':
        return `Every ${intervalText}week${interval > 1 ? 's' : ''}`
      case 'monthly':
        return `Every ${intervalText}month${interval > 1 ? 's' : ''}`
      case 'yearly':
        return `Every ${intervalText}year${interval > 1 ? 's' : ''}`
      default:
        return transaction.recurrence_frequency
    }
  }

  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return 'Not set'
    try {
      return format(new Date(date), 'PPP')
    } catch (e) {
      return 'Invalid date'
    }
  }

  const formatAmount = (amount: number, type: 'income' | 'expense') => {
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
    
    return `${type === 'income' ? '+' : '-'}${formatted}`
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Transaction Details</DialogTitle>
          <DialogDescription>
            Complete information about this transaction.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-6">
          {/* Basic Transaction Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="font-medium">Description:</div>
              <div className="col-span-2">{transaction.description}</div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="font-medium">Amount:</div>
              <div className={`col-span-2 font-medium ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                {formatAmount(transaction.amount, transaction.type)}
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="font-medium">Date:</div>
              <div className="col-span-2 flex items-center gap-2">
                <CalendarIcon size={14} />
                {formatDate(transaction.date)}
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="font-medium">Category:</div>
              <div className="col-span-2 flex items-center gap-2">
                <TagIcon size={14} />
                {transaction.category}
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="font-medium">Type:</div>
              <div className="col-span-2">
                <Badge variant={transaction.type === 'income' ? 'outline' : 'secondary'}>
                  {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                </Badge>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="font-medium">Status:</div>
              <div className="col-span-2">
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
            
            <div className="grid grid-cols-3 gap-4">
              <div className="font-medium">Account:</div>
              <div className="col-span-2 flex items-center gap-2">
                <CreditCardIcon size={14} />
                {transaction.account}
              </div>
            </div>
          </div>
          
          {/* Recurrence Info - Only show if it's a recurring transaction */}
          {transaction.recurrence_id && (
            <div className="space-y-4 border-t pt-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <RepeatIcon size={18} className="text-blue-500" />
                Recurrence Details
              </h3>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">Frequency:</div>
                <div className="col-span-2">{formatFrequency()}</div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">Start Date:</div>
                <div className="col-span-2 flex items-center gap-2">
                  <CalendarIcon size={14} />
                  {formatDate(transaction.recurrence_start_date || transaction.date)}
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">End Date:</div>
                <div className="col-span-2 flex items-center gap-2">
                  <CalendarIcon size={14} />
                  {transaction.recurrence_end_date ? formatDate(transaction.recurrence_end_date) : 'No end date'}
                </div>
              </div>
            </div>
          )}
          
          {/* Transaction ID for reference */}
          <div className="text-xs text-muted-foreground pt-2 border-t">
            <div className="flex items-center gap-1">
              <InfoIcon size={12} />
              <span>Transaction ID: {transaction.id}</span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex justify-end">
          <DialogClose asChild>
            <Button>Close</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  )
}