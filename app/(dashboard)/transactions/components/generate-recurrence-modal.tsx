'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Calendar } from '@/components/ui/calendar'
import { format } from 'date-fns'
import { CalendarIcon, AlertCircle, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTransactions } from '@/app/context/transactionsContext'
import { Transaction } from '../transactions-table'

interface GenerateRecurrenceModalProps {
  isOpen: boolean
  onClose: () => void
  transaction: Transaction
}

export function GenerateRecurrenceModal({ isOpen, onClose, transaction }: GenerateRecurrenceModalProps) {
  const { userID, fetchTransactions } = useTransactions()
  const [generateUntil, setGenerateUntil] = useState<Date>(new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)) // 90 days from now
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [generatedCount, setGeneratedCount] = useState(0)

  if (!transaction.recurrence_id) {
    return null
  }

  const handleClose = async () => {
    if (userID) {
      await fetchTransactions(userID);
    }
    onClose();
  };

  const handleGenerateTransactions = async () => {
    if (!userID || !transaction.recurrence_id) {
      setError('Missing required information')
      return
    }

    setIsSubmitting(true)
    setError(null)
    setSuccess(false)

    try {
      // Ensure proper date conversion for API
      const transactionDate = transaction.date instanceof Date 
        ? transaction.date 
        : new Date(transaction.date)

      const response = await fetch('/api/recurrence', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userID,
          transaction_template: {
            transaction_id: transaction.id,
            account_id: transaction.account,
            amount: transaction.amount,
            description: transaction.description,
            transaction_date: transactionDate.toISOString(),
            transaction_type: transaction.type,
            categories: transaction.categoryData?.map(cat => ({ id: cat.id, name: cat.name })),
            status: transaction.status,
            parent_transaction_id: transaction.parent_transaction_id || null,
          },
          recurrence_id: transaction.recurrence_id,
          generate_until: generateUntil.toISOString(),
        }),
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(true)
        setGeneratedCount(data.transactions.length)
        if (userID) {
          await fetchTransactions(userID)
        }
        setTimeout(() => {
          onClose()
        }, 2000)
      } else {
        console.error('Failed to generate transactions:', data)
        setError(data.message || 'Failed to generate recurring transactions')
      }
    } catch (err) {
      console.error('Error generating transactions:', err)
      setError('An error occurred while generating transactions')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) handleClose();
    }}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Generate Recurring Transactions</DialogTitle>
          <DialogDescription>
            Create future instances of this recurring transaction.
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 flex items-start">
            <RefreshCw className="h-5 w-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Success!</p>
              <p>Generated {generatedCount} new transaction{generatedCount !== 1 ? 's' : ''}.</p>
            </div>
          </div>
        ) : (
          <div className="py-4">
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4 mr-2" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="mb-4">
              <p className="text-sm text-muted-foreground mb-2">
                This will generate future transactions based on:
              </p>
              <ul className="text-sm list-disc pl-5 mb-4 space-y-1">
                <li><span className="font-medium">Frequency:</span> {transaction.recurrence_frequency}</li>
                <li><span className="font-medium">Interval:</span> {transaction.recurrence_interval || 1}</li>
                <li><span className="font-medium">Starting from:</span> {new Date(transaction.date).toLocaleDateString()}</li>
              </ul>
            </div>

            <div className="space-y-2 mb-4">
              <label className="text-sm font-medium">Generate until:</label>
              <div className="mt-2">
                <p className="text-sm mb-2">Selected date: {format(generateUntil, "MMMM d, yyyy")}</p>
                {/* Inline calendar with direct state management - no popover */}
                <div className="border rounded-md p-2">
                  <Calendar
                    mode="single"
                    selected={generateUntil}
                    onSelect={(date) => date && setGenerateUntil(date)}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className="mx-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          {!success && (
            <>
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="button"
                onClick={handleGenerateTransactions}
                disabled={isSubmitting}
                className="gap-2"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4" />
                    Generate Transactions
                  </>
                )}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 