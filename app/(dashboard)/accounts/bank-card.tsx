import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Building2, Pencil, CircleCheck, CircleX, Trash2 } from 'lucide-react';
import { Visa } from 'react-payment-logos/dist/flat';
import  EditAccountDialog  from './edit-account';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { editAccount,deleteAccount } from '@/app/api/accounts/account';

interface BankCardProps {
  accountID: string;
  accountName: string;
  accountType: string;
  balance: number;
  cardno: string;
  created_at?: string;
  verified: boolean;
  index: number; // Index for animation delay
}

const BankCard = ({ accountID, accountName, accountType, balance, cardno, verified, created_at, index }: BankCardProps) => {
  const [showMore, setShowMore] = React.useState<boolean>(verified);

  // Animation Variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2, duration: 0.6, ease: 'easeOut' },
    }),
  };

  // Handle saving edited account details
  const handleSave = (updatedAccount: { accountName: string; accountType: string; balance: number; cardno: string }) => {
    console.log('Updated Account:', updatedAccount);
    // You can update state or make an API call here
  };

  return (
    <motion.div
      className="mt-10 max-w-md"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      custom={index} 
    >
      <Card className="relative overflow-hidden">
        {/* Background Icon */}
        <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-16 -translate-y-8">
          <Building2 className="w-full h-full text-gray-100" />
        </div>

        {/* Card Header */}
        <CardHeader className="relative z-10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-500">{accountName}</span>
            <Badge variant="default" className={`${verified ? 'bg-green-400' : 'bg-red-600'} text-sm`}>
              {verified ? (
                <>
                  <CircleCheck className="inline-block mr-1" /> Verified
                </>
              ) : (
                <>
                  <CircleX className="inline-block mr-1" /> Not Verified
                </>
              )}
            </Badge>
          </div>
          <h3 className="text-xl font-bold tracking-tight">{accountType}</h3>
        </CardHeader>

        {/* Card Content */}
        <CardContent className="relative z-10">
          <div className="space-y-4">
            <div>
              <p className="text-3xl font-bold">${balance}</p>
              <p className="text-sm text-gray-500">Available Balance</p>
            </div>

            <div className="flex items-center space-x-2 text-gray-600">
              <CreditCard className="w-4 h-4" />
              <span className="text-sm font-medium">**** **** **** {cardno}</span>
            </div>
          </div>
        </CardContent>

        {/* Expandable Section with Animation */}
        <motion.div
          initial={false}
          animate={{ height: showMore ? 'auto' : 0, opacity: showMore ? 1 : 0 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="overflow-hidden"
        >
          {showMore && (
            <CardContent className="flex flex-col text-lg">
              <div>Number of Transactions: 5</div>
              <div>Created At: {created_at}</div>
              <div>Account ID: {accountID}</div>
              <EditAccountDialog
                accountID={accountID}
                accountName={accountName}
                accountType={accountType}
                balance={balance}
                cardno={cardno}
                onSave={handleSave}
              />
            </CardContent>
          )}
        </motion.div>

        {/* Footer Buttons */}
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => setShowMore(!showMore)}>
            {showMore ? 'Show Less' : 'Show More'}
          </Button>
          <Visa />
        </CardFooter>
      </Card>
    </motion.div>
  );
};



export default BankCard;