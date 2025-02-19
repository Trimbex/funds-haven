import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface AddAccountProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAccount: (account: {
    accountName: string;
    accountType: string;
    balance: string;
    cardNumber: string;
  }) => void;
}

export default function AddAccount({ isOpen, onClose, onAddAccount }: AddAccountProps) {
  const [accountName, setAccountName] = useState("");
  const [accountType, setAccountType] = useState("checking");
  const [balance, setBalance] = useState("");
  const [cardNumber, setCardNumber] = useState("");

  const handleAddAccount = () => {
    if (!accountName.trim()) {
      alert("Account name is required!");
      return;
    }
    // Call the onAddAccount prop with the new account data
    onAddAccount({ accountName, accountType, balance, cardNumber });
    // Reset form fields
    setAccountName("");
    setAccountType("checking");
    setBalance("");
    setCardNumber("");
    onClose(); // Close the dialog
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="text-center">
          <div className="font-bold text-2xl mb-4">Add New Account</div>
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
            <Button
              onClick={onClose}
              className="bg-gray-300 text-gray-700 hover:bg-gray-400"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddAccount}
              className="bg-[#009dff] text-white hover:bg-[#0086e6]"
            >
              Add Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}