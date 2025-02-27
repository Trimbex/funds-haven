import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { PlusCircle, Loader } from "lucide-react";
import { motion } from "framer-motion";

interface AddAccountProps {
  isOpen: boolean;
  onClose: () => void;
  loading: boolean;
  onAddAccount: (account: {
    accountName: string;
    accountType: string;
    balance: string;
    cardNumber: string;
  }) => void;
}

export default function AddAccount({ isOpen, onClose, onAddAccount, loading }: AddAccountProps) {
  const [accountName, setAccountName] = useState("");
  const [accountType, setAccountType] = useState("checking");
  const [balance, setBalance] = useState("");
  const [cardNumber, setCardNumber] = useState("");

  const handleAddAccount = () => {
    if (!accountName.trim()) {
      alert("Account name is required!");
      return;
    }
    onAddAccount({ accountName, accountType, balance, cardNumber });
    setAccountName("");
    setAccountType("checking");
    setBalance("");
    setCardNumber("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <motion.div 
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <div className="text-center">
          <motion.div 
            className="font-bold text-2xl mb-4"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            Add New Account
          </motion.div>

          <div className="space-y-4">
            {/* Account Name Field */}
            <div>
              <label htmlFor="accountName" className="block text-sm font-bold mb-2 text-slate-700">
                Account Name *
              </label>
              <input
                type="text"
                id="accountName"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border outline-none transition-shadow shadow-sm focus:shadow-md focus:ring-2 focus:ring-[#009dff]"
                placeholder="e.g., Main Checking"
                required
              />
            </div>

            {/* Account Type Field */}
            <div>
              <label htmlFor="accountType" className="block text-sm font-bold mb-2 text-slate-700">
                Account Type
              </label>
              <select
                id="accountType"
                value={accountType}
                onChange={(e) => setAccountType(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border outline-none transition-shadow shadow-sm focus:shadow-md focus:ring-2 focus:ring-[#009dff]"
              >
                <option value="checking">Checking</option>
                <option value="savings">Savings</option>
                <option value="business">Business</option>
                <option value="credit">Credit Card</option>
              </select>
            </div>

            {/* Balance Field */}
            <div>
              <label htmlFor="balance" className="block text-sm font-bold mb-2 text-slate-700">
                Current Balance
              </label>
              <input
                type="number"
                id="balance"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border outline-none transition-shadow shadow-sm focus:shadow-md focus:ring-2 focus:ring-[#009dff]"
                placeholder="0.00"
              />
            </div>

            {/* Card Number Field */}
            <div>
              <label htmlFor="cardNumber" className="block text-sm font-bold mb-2 text-slate-700">
                Card Number
              </label>
              <input
                type="text"
                id="cardNumber"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border outline-none transition-shadow shadow-sm focus:shadow-md focus:ring-2 focus:ring-[#009dff]"
                placeholder="Last 4 digits only"
                maxLength={4}
              />
            </div>
          </div>

          {/* Dialog Buttons */}
          <div className="flex justify-end gap-4 mt-6">
            <motion.button
              onClick={onClose}
              className="bg-gray-300 text-gray-700 hover:bg-gray-400 px-4 py-2 rounded-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Cancel
            </motion.button>

            <motion.div className="flex flex-row-reverse items-center gap-2">
              {loading && (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1 }}
                >
                  <Loader className="w-5 h-5 text-[#009dff]" />
                </motion.div>
              )}
              <motion.button
                onClick={handleAddAccount}
                className="bg-[#009dff] text-white hover:bg-[#0086e6] px-4 py-2 rounded-lg flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <PlusCircle className="w-5 h-5" /> Add Account
              </motion.button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
