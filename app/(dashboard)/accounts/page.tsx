'use client';

import React from 'react';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

import BankCard from "./bank-card";
import AddAccount from './add-account'; 
import DotLoader from "@/components/loader/loader";
import { AccountsProvider, useAccounts } from '@/app/context/accountContext';
import { a } from 'framer-motion/dist/types.d-6pKw1mTI';

function AccountsContent() {
  const { accounts, loading, showDialog, setShowDialog, dialogLoading, addAccount } = useAccounts();

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
  className="w-full bg-gradient-to-r from-[#009dff] to-[#0077c2] py-24 px-6 md:px-12 lg:px-24 relative overflow-hidden"
>
  {/* Animated background elements */}
  <motion.div 
    className="absolute top-0 right-0 w-64 h-64 bg-[#40b5ff] rounded-full opacity-10"
    initial={{ x: 100, y: -100 }}
    animate={{ x: 0, y: 0 }}
    transition={{ duration: 1.5, ease: "easeOut" }}
  />
  <motion.div 
    className="absolute bottom-0 left-0 w-48 h-48 bg-[#40b5ff] rounded-full opacity-10"
    initial={{ x: -100, y: 100 }}
    animate={{ x: 0, y: 0 }}
    transition={{ duration: 1.5, ease: "easeOut" }}
  />
  
  <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative z-10">
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
    >
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
        My Accounts
      </h1>
      <p className="text-gray-100 mt-4 text-lg md:text-xl max-w-2xl">
        Manage your accounts, view balances, and perform transactions seamlessly.
      </p>
    </motion.div>
    
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
      className="mt-6 md:mt-0"
    >
      <Button 
        className="bg-white text-[#009dff] hover:bg-gray-100 hover:text-[#0077c2] transition-all duration-300 px-6 py-2 rounded-lg font-medium shadow-lg"
        onClick={() => setShowDialog(true)}
      >
        Add New Account
      </Button>
    </motion.div>
  </div>
  
  {/* Stats bar */}
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
    className="max-w-7xl mx-auto mt-12 bg-white/10 backdrop-blur-sm rounded-xl p-4 flex flex-wrap justify-between items-center gap-4"
  >
    <div className="text-center px-4 py-2 flex-1">
      <p className="text-white text-sm">Total Balance</p>
      <p className="text-white font-bold text-xl">$ {accounts.reduce((sum,account) => sum + Number(account.balance), 0)}</p>
    </div>
    <div className="text-center px-4 py-2 flex-1 border-l border-white/20">
      <p className="text-white text-sm">Verified Accounts</p>
      <p className="text-white font-bold text-xl">{accounts.reduce((sum,acc) => acc.isVerified ? sum = sum + 1 : sum, 0)}</p>
    </div>
    <div className="text-center px-4 py-2 flex-1 border-l border-white/20">
      <p className="text-white text-sm">Last Update</p>
      <p className="text-white font-bold text-xl">{new Date(accounts.reduce((latest, account) => new Date(account.created_at) > new Date(latest.created_at) ? account : latest).created_at || 'N/A').toLocaleDateString()}</p>
    </div>
  </motion.div>
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