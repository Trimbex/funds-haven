'use client';
import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { getCurrentUserID } from '@/app/api/general';
import BankCard from "./bank-card";
import AddAccount from './add-account'; 
import DotLoader from "@/components/loader/loader";

export default function Accounts() {
  const [user, setUser] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogLoading, setDialogLoading] = useState(false);

  // Get User ID on Component Mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getCurrentUserID(); 
        setUser(response.userId || null);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };
    fetchUser();
  }, []);

  // Fetch Accounts When User is Available
  useEffect(() => {
    if (!user) return;
    
    const fetchAccounts = async () => {
      try {
        const response = await fetch(`/api/accounts?user_id=${user}`);
        const data = await response.json();
        if (data.success) {
          setAccounts(data.accounts);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error("Error fetching accounts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAccounts();
  }, [user]);

  // Handle Adding a New Account
  const handleAddAccount = async (newAccount: {
    accountName: string;
    accountType: string;
    balance: string;
    cardNumber: string;
  }) => {
    setDialogLoading(true);

    try {
      if (!user) return alert("User not found");

      const response = await fetch('/api/accounts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user,
          account_name: newAccount.accountName,
          account_type: newAccount.accountType,
          balance: newAccount.balance,
          cardno: newAccount.cardNumber,
          isVerified: false,
        }),
      });

      const data = await response.json();
      if (data.success) {
        const updatedAccountsResponse = await fetch(`/api/accounts?user_id=${user}`);
        const updatedAccountsData = await updatedAccountsResponse.json();
        if (updatedAccountsData.success) {
          setAccounts(updatedAccountsData.accounts);
        }
        setDialogLoading(false);
        setShowDialog(false);
      } else {
        alert("Failed to add account. Please try again.");
        setDialogLoading(false);
      }
    } catch (error) {
      console.error("Error adding account:", error);
      alert("Failed to add account. Please try again.");
      setDialogLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <DotLoader />
        </div>
      ) : (
        <>
          {/* Header Section */}
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full bg-[#009dff] py-48 px-6 md:px-12 lg:px-24"
          >
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
          </motion.div>

          {/* Accounts List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ml-16 md:ml-24 lg:ml-48 gap-6 mb-20">
            {accounts.map((account, index) => (
              <motion.div 
                key={account.account_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.1 }}
              >
                <BankCard 
                  accountID={account.account_id}
                  accountName={account.account_name} 
                  accountType={account.account_type} 
                  balance={Number(account.balance)} 
                  cardno={account.cardno} 
                  verified={account.isVerified} 
                  created_at={account.created_at ? new Date(account.created_at).toLocaleDateString() : ""} 
                  index={index}
                />
              </motion.div>
            ))}

            {/* Add Account Button */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: accounts.length * 0.1 }}
              className="mt-10 max-w-md"
            >
              <Button
                variant="outline"
                className="w-full h-full flex flex-col border-4 border-dotted border-gray-500"
                onClick={() => setShowDialog(true)}
                disabled={dialogLoading}
              >
                {dialogLoading ? (
                  <span className="text-8xl font-mono text-gray-600">...</span>
                ) : (
                  <span className="text-8xl font-mono text-gray-600">+</span>
                )}
              </Button>
            </motion.div>
          </div>

          {/* Add Account Modal */}
          <AddAccount
            isOpen={showDialog} 
            onClose={() => setShowDialog(false)}
            onAddAccount={handleAddAccount}
            loading={dialogLoading}
          />
        </>
      )}
    </>
  );
}