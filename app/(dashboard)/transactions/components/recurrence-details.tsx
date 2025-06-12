'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog'
import { CalendarIcon, RepeatIcon, Clock, Calendar, X } from 'lucide-react'
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

  const getFrequencyColor = () => {
    switch (frequency) {
      case 'daily':
        return 'from-blue-500 to-blue-600'
      case 'weekly':
        return 'from-green-500 to-green-600'
      case 'monthly':
        return 'from-purple-500 to-purple-600'
      case 'yearly':
        return 'from-orange-500 to-orange-600'
      default:
        return 'from-gray-500 to-gray-600'
    }
  }

  return (
    <>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 text-xs hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 rounded-xl px-3 py-2 group"
      >
        <div className={`p-1 rounded-lg bg-gradient-to-r ${getFrequencyColor()} group-hover:scale-110 transition-transform duration-200`}>
          <RepeatIcon className="w-3 h-3 text-white" />
        </div>
        <span className="font-medium">Details</span>
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md border-0 shadow-2xl bg-white/95 backdrop-blur-xl">
          <DialogHeader className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-2xl bg-gradient-to-r ${getFrequencyColor()} shadow-lg`}>
                  <RepeatIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-bold text-gray-900">
                    Recurring Transaction
                  </DialogTitle>
                  <DialogDescription className="text-gray-600">
                    Transaction frequency and schedule details
                  </DialogDescription>
                </div>
              </div>
            </div>
          </DialogHeader>
          
          <div className="py-6 space-y-6">
            {/* Frequency Card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-100"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-500 rounded-xl">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Frequency</p>
                  <p className="text-blue-700 font-medium">{formatFrequency()}</p>
                </div>
              </div>
            </motion.div>
            
            {/* Start Date Card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-100"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-500 rounded-xl">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Start Date</p>
                  <p className="text-green-700 font-medium">
                    {startDate ? format(new Date(startDate), 'PPP') : 'Not set'}
                  </p>
                </div>
              </div>
            </motion.div>
            
            {/* End Date Card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-2xl p-4 border border-purple-100"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-500 rounded-xl">
                  <CalendarIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">End Date</p>
                  <p className="text-purple-700 font-medium">
                    {endDate ? format(new Date(endDate), 'PPP') : 'No end date'}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
          
          <div className="flex justify-end pt-4 border-t border-gray-100">
            <DialogClose asChild>
              <Button className="btn-primary px-6">
                Got it
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}