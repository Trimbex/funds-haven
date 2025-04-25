'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog'
import { CalendarIcon, RepeatIcon } from 'lucide-react'
import { format } from 'date-fns'

type RecurrenceDetailsProps = {
  frequency?: string
  interval?: number
  startDate?: Date
  endDate?: Date | null
}

export function RecurrenceDetails({ 
  frequency, 
  interval = 1, 
  startDate, 
  endDate 
}: RecurrenceDetailsProps) {
  const [isOpen, setIsOpen] = useState(false)

  if (!frequency) {
    return null
  }

  const formatFrequency = () => {
    if (!frequency) return 'Not recurring'
    
    const intervalText = interval > 1 ? `${interval} ` : ''
    
    switch (frequency) {
      case 'daily':
        return `Every ${intervalText}day${interval > 1 ? 's' : ''}`
      case 'weekly':
        return `Every ${intervalText}week${interval > 1 ? 's' : ''}`
      case 'monthly':
        return `Every ${intervalText}month${interval > 1 ? 's' : ''}`
      case 'yearly':
        return `Every ${intervalText}year${interval > 1 ? 's' : ''}`
      default:
        return frequency
    }
  }

  return (
    <>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1 text-xs"
      >
        <RepeatIcon size={14} />
        <span>Details</span>
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Recurring Transaction Details</DialogTitle>
            <DialogDescription>
              Information about this recurring transaction.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="font-medium">Frequency:</div>
              <div className="col-span-2">{formatFrequency()}</div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="font-medium">Start Date:</div>
              <div className="col-span-2 flex items-center gap-2">
                <CalendarIcon size={14} />
                {startDate ? format(new Date(startDate), 'PPP') : 'Not set'}
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="font-medium">End Date:</div>
              <div className="col-span-2 flex items-center gap-2">
                <CalendarIcon size={14} />
                {endDate ? format(new Date(endDate), 'PPP') : 'No end date'}
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
    </>
  )
}