'use client'
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, CreditCard, Wallet, Building, CheckCircle2, XCircle, Plus } from "lucide-react";
import { Payment, columns } from './columns';
import AddAccount from './add-account'; 
import {DataTable} from "@/components/ui/data-table";
import  BankCard  from "./bank-card"
import { getCurrentUserID } from '@/app/api/general';
import { getAccounts } from '@/app/api/accounts/account';
import { supabase } from '@/app/utils/supabase/client'


const accounts = [
  {
    account_id: "uuid-1",
    account_name: "Main Checking",
    account_type: "Checking",
    balance: 5249.52,
    cardno: "****-****-****-1234",
    isVerified: true,
    updated_at: "2024-02-19T10:00:00Z",
  },
  {
    account_id: "uuid-2",
    account_name: "Savings Account",
    account_type: "Savings",
    balance: 12750.33,
    cardno: "****-****-****-5678",
    isVerified: true,
    updated_at: "2024-02-19T09:30:00Z",
  },
  {
    account_id: "uuid-3",
    account_name: "Business Account",
    account_type: "Business",
    balance: 35420.18,
    cardno: "****-****-****-9012",
    isVerified: false,
    updated_at: "2024-02-19T08:45:00Z",
  },
];

const data: Payment[] = [
  {
    id: "uuid-1",
    amount: 1000,
    status: "success",
    email: "h@gmail.com"
  },
  {
    id: "uuid-2",
    amount: 1000,
    status: "success",
    email: "y34@gmail.com"
  }
]



export default function Accounts() {
  
  const [user, setUser] = useState<string>();
  const [accounts, setAccounts] = useState<any[]>([]);



  useEffect(() => {
    const getUser = async () => {
      const response = await getCurrentUserID(); 
      setUser(response.userId!);
      
      // console.log("Session Data:", response.userId);
    };

    getUser();
  },[]);




  useEffect(() => {
    const fetchAccounts = async (userId: string) => {
      try {
        const data = await getAccounts(userId); 
        setAccounts(data);
      } catch (error) {
        console.error("Error fetching accounts:", error);
      }
    };

    if (user) {
      fetchAccounts(user);
    }
  }, [user]);


 
  


  // const [showDialog, setShowDialog] = useState(false);

  // const handleAddAccount = (account: {
  //   accountName: string;
  //   accountType: string;
  //   balance: string;
  //   cardNumber: string;
  // }) => {
  //   console.log("New Account:", account);
  //   // Add logic to handle the new account data (e.g., add to state or API call)
  // };
  return (
    <>
        {/* <pre>{JSON.stringify(accounts, null, 2)}</pre> */}
      {/* Header Section */}
      <div className="w-full bg-[#009dff] py-48 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold text-white">
              My Accounts
            </h1>
            <p className="text-gray-100 mt-6 text-xl md:text-2xl max-w-2xl">
              Manage your accounts, view balances, and perform transactions seamlessly.
            </p>
          </div>
        </div>
      </div>


      

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ml-16 md:ml-24 lg:ml-48">
   
      {
        accounts.map((account) => (
          <BankCard 
            key={account.account_id}
            accountName={account.account_name} 
            accountType={account.account_type} 
            balance={Number(account.balance)} 
            cardno={account.cardno} 
            verified={account.isVerified} 
            created_at={account.created_at ? account.created_at.toLocaleDateString() : ""} 
          />
        ))

        
      }
           
      <div className="mt-10 max-w-md">
              <Button
            variant="outline"
            className="w-full h-full flex flex-col border-4 border-dotted border-gray-500"
          >
            <span className="text-8xl font-mono text-gray-600">+</span>
          </Button>
      </div>
      </div>
      
      


















      {/* Accounts List Section */}
      {/* <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
        <Card className="border-none drop-shadow-sm">
          <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
            <CardTitle className="text-xl line-clamp-1">Accounts List</CardTitle>
            <Button onClick={() => setShowDialog(true)}>
              <PlusCircle className="mr-2 h-6 w-6" />
              Add New Account
            </Button>
          </CardHeader>
          <CardContent>
            <DataTable filterKey={'email'} columns={columns} data={data}></DataTable>
            </CardContent>
        </Card>
      </div> */}
      

      {/* Add Account Dialog */}



      {/* <AddAccount
        isOpen={showDialog}
        onClose={() => setShowDialog(false)}
        onAddAccount={handleAddAccount}
      /> */}


    </>
  );
}