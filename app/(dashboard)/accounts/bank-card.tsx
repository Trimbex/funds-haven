import React from 'react';
import {Button} from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Building2, Pencil, CircleCheck, CircleX , Info} from 'lucide-react';
import { Mastercard, Visa, Paypal } from 'react-payment-logos/dist/flat';

const BankCard = () => {

    const [showMore, setShowMore] = React.useState<boolean>(false);
    const [Verified, setVerified] = React.useState<boolean>(false);
  return (
    <div className="mt-10 max-w-md">
      <Card className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-16 -translate-y-8">
          <Building2 className="w-full h-full text-gray-100" />
        </div>
        
        <CardHeader className="relative z-10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-500">Checking Account</span>
        <Badge variant="default" className={`${Verified ? "bg-green-400" : "bg-red-600"} text-sm`}>
                        {Verified ? (
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
          <h3 className="text-xl font-bold tracking-tight">Primary Checking</h3>
        </CardHeader>

        <CardContent className="relative z-10">
          <div className="space-y-4">
            <div>
              <p className="text-3xl font-bold">
                $5,420.50
              </p>
              <p className="text-sm text-gray-500">Available Balance</p>
            </div>
            
            <div className="flex items-center space-x-2 text-gray-600">
              <CreditCard className="w-4 h-4" />
              <span className="text-sm font-medium">**** **** **** 1234</span>
            </div>
            
          </div>
        </CardContent>
       {showMore ? 
        <>
        <CardContent className="flex flex-col text-lg">
            <div>
            Number of Transactions: 5
            </div>
            <div>
            Created At: 12/12/2021
            </div>


            <Button variant="secondary"><Pencil></Pencil> Edit Account</Button>
        </CardContent>
       <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => setShowMore(!showMore)} >Show less</Button>
        <Visa></Visa>
       </CardFooter>
       </>
       
       
       : 
       
       <CardFooter className="flex justify-between">           
            <Button variant="outline" onClick={() => setShowMore(!showMore)} >Show more</Button>
            <Visa></Visa>
        </CardFooter>}

      </Card>
    </div>
  );
};

export default BankCard;