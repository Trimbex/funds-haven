import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Building2, CircleCheck, CircleX } from 'lucide-react';
import EditAccountDialog from './edit-account';
import * as card from "react-payment-logos/dist/flat";
import { useAccounts } from '@/app/context/accountContext';

interface BankCardProps {
  account: {
    account_id: string;
    account_name: string;
    account_type: string;
    balance: number | string;
    cardno: string;
    card_company: string;
    created_at?: string;
    isVerified: boolean;
  };
  index: number; // Index for animation delay
}

const renderCard = (company: string) => {
  switch (company) {
    case "Visa":
      return <card.Visa />;
    case "MasterCard":
      return <card.Mastercard />;
    case "American Express":
      return <card.Amex />;
    case "Paypal":
      return <card.Paypal />;
    default:
      return <card.Generic />;
  }
}

const BankCard = ({ account, index }: BankCardProps) => {
  const [showMore, setShowMore] = React.useState<boolean>(false);
  
  // Animation Variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2, duration: 0.6, ease: 'easeOut' },
    }),
  };

  const balance = typeof account.balance === 'string' 
    ? parseFloat(account.balance) 
    : account.balance;

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
            <span className="text-sm font-medium text-gray-500">{account.account_name}</span>
            <Badge variant="default" className={`${account.isVerified ? 'bg-green-400' : 'bg-red-600'} text-sm`}>
              {account.isVerified ? (
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
          <h3 className="text-xl font-bold tracking-tight">{account.account_type}</h3>
        </CardHeader>

        {/* Card Content */}
        <CardContent className="relative z-10">
          <div className="space-y-4">
            <div>
              <p className="text-3xl font-bold">${balance.toFixed(2)}</p>
              <p className="text-sm text-gray-500">Available Balance</p>
            </div>

            <div className="flex items-center space-x-2 text-gray-600">
              <CreditCard className="w-4 h-4" />
              <span className="text-sm font-medium">**** **** **** {account.cardno.slice(-4)}</span>
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
            <CardContent className="flex flex-col text-lg space-y-4">
              <div>Number of Transactions: 5</div>
              <div>Created At: {account.created_at}</div>
              <div>Account ID: {account.account_id}</div>
              <EditAccountDialog account={account} />
            </CardContent>
          )}
        </motion.div>

        {/* Footer Buttons */}
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => setShowMore(!showMore)}>
            {showMore ? 'Show Less' : 'Show More'}
          </Button>
          {renderCard(account.card_company)}
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default BankCard;