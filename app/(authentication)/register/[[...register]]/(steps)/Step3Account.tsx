import React, { useState } from 'react';

export default function Step2Account({ next }: { next: () => void }) {
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [formData, setFormData] = useState({
    accountName: "",
    accountType: "checking",
    balance: "",
    cardNumber: ""
  });

  const handleFocus = (field: string) => setFocusedField(field);
  const handleBlur = () => setFocusedField(null);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSkip = () => {
    if (!formData.accountName.trim()) {
      setShowDialog(true);
    } else {
      next();
    }
  };

  const handleConfirmSkip = () => {
    setShowDialog(false);
    next();
  };

  const handleCancelSkip = () => {
    setShowDialog(false);
  };

  return (
    <div className="flex flex-col p-16 pt-3 bg-white dark:bg-gray-950 rounded-lg shadow-lg w-full max-w-6xl mx-auto">
      {/* Header Section */}
      <div className="row-span-1 text-center">
        <div className="font-normal dark:text-white text-3xl">Account Details</div>
        <div className="font-normal text-slate-400 text-lg pt-3">
          Set up your first account to start managing your finances
        </div>
      </div>

      {/* Outer Flex Container */}
      <div className="flex flex-row items-stretch gap-12 mt-6 min-h-[300px]">
        {/* Input Fields Container */}
        <div className="flex flex-col space-y-6 flex-grow">
          {/* Account Name Field */}
          <div className="block">
            <label
              htmlFor="accountName"
              className="text-left block text-sm font-bold mb-2 text-slate-700 dark:text-white/80 transition-colors"
            >
              Account Name
            </label>
            <input
              type="text"
              id="accountName"
              value={formData.accountName}
              onChange={(e) => handleChange('accountName', e.target.value)}
              onFocus={() => handleFocus("accountName")}
              onBlur={handleBlur}
              className={`w-full px-4 py-3 rounded-lg border outline-none transition-shadow shadow-sm focus:shadow-md focus:ring-2 focus:ring-[#009dff] dark:bg-gray-800 dark:text-white ${
                focusedField === "accountName"
                  ? "border-[#009dff]"
                  : "border-gray-300 dark:border-gray-600"
              }`}
              placeholder="e.g., Main Checking, Personal Savings"
            />
          </div>

          {/* Account Type Field */}
          <div className="block">
            <label
              htmlFor="accountType"
              className="text-left block text-sm font-bold mb-2 text-slate-700 dark:text-white/80 transition-colors"
            >
              Account Type
            </label>
            <select
              id="accountType"
              value={formData.accountType}
              onChange={(e) => handleChange('accountType', e.target.value)}
              onFocus={() => handleFocus("accountType")}
              onBlur={handleBlur}
              className={`w-full px-4 py-3 rounded-lg border outline-none transition-shadow shadow-sm focus:shadow-md focus:ring-2 focus:ring-[#009dff] dark:bg-gray-800 dark:text-white ${
                focusedField === "accountType"
                  ? "border-[#009dff]"
                  : "border-gray-300 dark:border-gray-600"
              }`}
            >
              <option value="checking">Checking</option>
              <option value="savings">Savings</option>
              <option value="credit">Credit Card</option>
              <option value="investment">Investment</option>
            </select>
          </div>

          {/* Balance Field */}
          <div className="block">
            <label
              htmlFor="balance"
              className="text-left block text-sm font-bold mb-2 text-slate-700 dark:text-white/80 transition-colors"
            >
              Current Balance
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                id="balance"
                value={formData.balance}
                onChange={(e) => handleChange('balance', e.target.value)}
                onFocus={() => handleFocus("balance")}
                onBlur={handleBlur}
                className={`w-full pl-8 pr-4 py-3 rounded-lg border outline-none transition-shadow shadow-sm focus:shadow-md focus:ring-2 focus:ring-[#009dff] dark:bg-gray-800 dark:text-white ${
                  focusedField === "balance"
                    ? "border-[#009dff]"
                    : "border-gray-300 dark:border-gray-600"
                }`}
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Card Number Field */}
          <div className="block">
            <label
              htmlFor="cardNumber"
              className="text-left block text-sm font-bold mb-2 text-slate-700 dark:text-white/80 transition-colors"
            >
              Card Number
            </label>
            <input
              type="text"
              id="cardNumber"
              value={formData.cardNumber}
              onChange={(e) => handleChange('cardNumber', e.target.value)}
              onFocus={() => handleFocus("cardNumber")}
              onBlur={handleBlur}
              className={`w-full px-4 py-3 rounded-lg border outline-none transition-shadow shadow-sm focus:shadow-md focus:ring-2 focus:ring-[#009dff] dark:bg-gray-800 dark:text-white ${
                focusedField === "cardNumber"
                  ? "border-[#009dff]"
                  : "border-gray-300 dark:border-gray-600"
              }`}
              placeholder="Last 4 digits only"
              maxLength={4}
            />
          </div>
        </div>

        {/* Image Container */}
        <div className="flex-shrink-0 h-full w-2/5 pt-24">
          <img
            src="./regstep2.svg"
            alt="Step 2 Image"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      </div>

      {/* Skip Button */}
      <div className="mt-auto pt-6">
        <button
          type="button"
          onClick={handleSkip}
          className="w-40 px-6 py-3 text-white rounded-lg transition-all bg-gradient-to-tl from-[#007acc] to-[#009dff] hover:scale-105"
        >
          Skip
        </button>
      </div>

      {/* Confirmation Dialog */}
      {showDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-950 rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="text-center">
              <div className="font-normal dark:text-white text-2xl mb-4">Are you sure?</div>
              <div className="font-normal text-slate-400 text-lg mb-6">
                You have not entered an account name. Are you sure you want to continue?
              </div>
              <div className="flex justify-center gap-4">
                <button
                  onClick={handleConfirmSkip}
                  className="w-32 px-4 py-2 text-white rounded-lg transition-all bg-gradient-to-tl from-[#007acc] to-[#009dff] hover:scale-105"
                >
                  Yes
                </button>
                <button
                  onClick={handleCancelSkip}
                  className="w-32 px-4 py-2 text-slate-700 dark:text-white rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}