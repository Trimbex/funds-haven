import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard, 
  Building2, 
  CircleCheck, 
  CircleX, 
  Eye, 
  EyeOff,
  MoreVertical,
  TrendingUp,
  CalendarDays
} from 'lucide-react';
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
  index: number;
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
  const [showDetails, setShowDetails] = React.useState<boolean>(false);
  const [showFullCardNumber, setShowFullCardNumber] = React.useState<boolean>(false);
  const [transactionCount, setTransactionCount] = React.useState<number>(0);
  const [loadingTransactions, setLoadingTransactions] = React.useState<boolean>(true);
  
  const balance = typeof account.balance === 'string' 
    ? parseFloat(account.balance) 
    : account.balance;

  // Fetch transaction count for this account
  React.useEffect(() => {
    const fetchTransactionCount = async () => {
      try {
        setLoadingTransactions(true);
        const response = await fetch(`/api/accounts/${account.account_id}/transactions/count`);
        if (response.ok) {
          const data = await response.json();
          setTransactionCount(data.count || 0);
        }
      } catch (error) {
        console.error('Error fetching transaction count:', error);
        setTransactionCount(0);
      } finally {
        setLoadingTransactions(false);
      }
    };

    fetchTransactionCount();
  }, [account.account_id]);

  const formatCardNumber = (cardNumber: string) => {
    if (showFullCardNumber) {
      return cardNumber.replace(/(.{4})/g, '$1 ').trim();
    }
    return `**** **** **** ${cardNumber.slice(-4)}`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="w-full max-w-sm"
    >
      <Card className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white/80 backdrop-blur-sm group">
        {/* Card Header */}
        <CardHeader className="relative bg-gradient-to-br from-gray-50 to-gray-100 pb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                <Building2 className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-700">{account.account_name}</span>
            </div>
            
            <Badge 
              variant="default" 
              className={`${
                account.isVerified 
                  ? 'bg-green-100 text-green-700 hover:bg-green-100' 
                  : 'bg-red-100 text-red-700 hover:bg-red-100'
              } border-0`}
            >
              {account.isVerified ? (
                <>
                  <CircleCheck className="w-3 h-3 mr-1" /> 
                  Verified
                </>
              ) : (
                <>
                  <CircleX className="w-3 h-3 mr-1" /> 
                  Unverified
                </>
              )}
            </Badge>
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 mb-1">{account.account_type}</h3>
          
          <div className="space-y-1">
            <p className="text-3xl font-bold text-gray-900">${balance.toFixed(2)}</p>
            <p className="text-sm text-gray-600">Available Balance</p>
          </div>
        </CardHeader>

        {/* Card Content */}
        <CardContent className="space-y-4 p-6">
          {/* Card Number Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CreditCard className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Card Number</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFullCardNumber(!showFullCardNumber)}
                className="h-auto p-1"
              >
                {showFullCardNumber ? (
                  <EyeOff className="w-4 h-4 text-gray-500" />
                ) : (
                  <Eye className="w-4 h-4 text-gray-500" />
                )}
              </Button>
            </div>
            <p className="font-mono text-sm text-gray-900">{formatCardNumber(account.cardno)}</p>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-xl">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm text-gray-600">
                {loadingTransactions ? 'Loading...' : `${transactionCount} transaction${transactionCount !== 1 ? 's' : ''}`}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <CalendarDays className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-gray-600">Active</span>
            </div>
          </div>

          {/* Expandable Details */}
          <motion.div
            initial={false}
            animate={{ height: showDetails ? 'auto' : 0, opacity: showDetails ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            {showDetails && (
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 mb-1">Account ID</p>
                    <p className="text-gray-900 font-mono text-xs">{account.account_id.slice(0, 8)}...</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Created</p>
                    <p className="text-gray-900">{formatDate(account.created_at)}</p>
                  </div>
                </div>
                
                <div className="pt-2">
                  <EditAccountDialog account={account} />
                </div>
              </div>
            )}
          </motion.div>
        </CardContent>

        {/* Card Footer */}
        <CardFooter className="flex justify-between items-center px-6 pb-6">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
            className="text-gray-600 hover:text-gray-900"
          >
            {showDetails ? 'Show Less' : 'Show More'}
          </Button>
          
          <div className="flex items-center space-x-2">
            {renderCard(account.card_company)}
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default BankCard;