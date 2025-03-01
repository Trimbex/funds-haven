'use client';

import React from 'react';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

import BankCard from "./bank-card";
import AddAccount from './add-account'; 
import DotLoader from "@/components/loader/loader";
import { AccountsProvider, useAccounts } from '@/app/context/accountContext';

function AccountsContent() {
  const { accounts, loading, showDialog, setShowDialog, dialogLoading } = useAccounts();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <DotLoader />
      </div>
    );
  }

  return (
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
              account={account}
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
      <AddAccount />
    </>
  );
}

// Wrapper component that provides the context
export default function Accounts() {
  return (
    <AccountsProvider>
      <AccountsContent />
    </AccountsProvider>
  );
}