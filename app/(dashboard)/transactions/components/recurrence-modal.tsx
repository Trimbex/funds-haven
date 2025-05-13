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
import { RecurrenceFrequency } from '@/app/server/transactions/recurrence'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { format } from 'date-fns'
import { CalendarIcon, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RecurrenceModalProps {
  isOpen: boolean
  onClose: () => void
  transactionId: string
  transactionDate: Date
}

export function RecurrenceModal({ isOpen, onClose, transactionId, transactionDate }: RecurrenceModalProps) {
  const { userID, fetchTransactions } = useTransactions()
  
  const [frequency, setFrequency] = useState<RecurrenceFrequency>('monthly')
  const [interval, setInterval] = useState<number>(1)
  const [startDate, setStartDate] = useState<Date>(transactionDate)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [hasEndDate, setHasEndDate] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean>(false)

  const handleCreateRecurrence = async () => {
    if (!userID || !transactionId) {
      setError('Missing required information');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('/api/recurrence', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userID,
          transaction_id: transactionId,
          frequency,
          interval,
          start_date: startDate,
          end_date: hasEndDate ? endDate : undefined
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setSuccess(true);
        
        // Refresh transactions to show the changes immediately
        if (userID) {
          await fetchTransactions(userID);
        }
        
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setError(data.message || 'Failed to create recurring transaction');
      }
    } catch (err) {
      setError('An error occurred while setting up the recurring transaction');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Set Up Recurring Transaction</DialogTitle>
          <DialogDescription>
            Configure how often this transaction should repeat.
          </DialogDescription>
        </DialogHeader>
        
        {success ? (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            Recurring transaction has been set up successfully!
          </div>
        ) : (
          <div className="grid gap-4 py-4">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center">
                <AlertCircle className="h-4 w-4 mr-2" />
                {error}
              </div>
            )}
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="frequency" className="text-right">
                Frequency
              </Label>
              <div className="col-span-3">
                <Select
                  value={frequency}
                  onValueChange={(value: RecurrenceFrequency) => setFrequency(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="interval" className="text-right">
                Every
              </Label>
              <div className="col-span-3 flex items-center gap-2">
                <Input
                  id="interval"
                  type="number"
                  min="1"
                  value={interval}
                  onChange={(e) => setInterval(parseInt(e.target.value) || 1)}
                  className="w-20"
                />
                <span className="flex-1">
                  {frequency === 'weekly' ? 'week(s)' : 
                   frequency === 'monthly' ? 'month(s)' : 'year(s)'}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="startDate" className="text-right">
                Start Date
              </Label>
              <div className="col-span-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 z-50" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={(date) => {
                        if (date) {
                          setStartDate(date);
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="text-right">
                <Label htmlFor="hasEndDate" className="mr-2">
                  End Date
                </Label>
              </div>
              <div className="col-span-3 flex items-center gap-2">
                <input
                  id="hasEndDate"
                  type="checkbox"
                  checked={hasEndDate}
                  onChange={(e) => setHasEndDate(e.target.checked)}
                  className="mr-2"
                />
                <Label htmlFor="hasEndDate">Set an end date</Label>
              </div>
            </div>
            
            {hasEndDate && (
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="text-right"></div>
                <div className="col-span-3">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !endDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 z-50" align="start">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={(date) => {
                          if (date) {
                            setEndDate(date);
                          }
                        }}
                        initialFocus
                        disabled={(date) => date < startDate}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            )}
          </div>
        )}
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          {!success && (
            <Button 
              type="button" 
              onClick={handleCreateRecurrence}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Setting up...' : 'Create Recurring Transaction'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 