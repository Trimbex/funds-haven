import * as React from 'react';
import { useFormContext } from '../../context/FormContext';

export default function EmailTemplate() {
  const { formData } = useFormContext();

  return (
    <div className="bg-gray-100 p-5">
      <div className="max-w-lg bg-white p-6 mx-auto rounded-lg shadow-md">
        <div className="text-center mb-4">
          <img src="./logo.svg" alt="Your Business Logo" className="w-32 mx-auto" />
          <h2 className="text-2xl font-semibold text-gray-800">Account Verification</h2>
        </div>
        <p className="text-gray-700">Dear {formData.firstName} {formData.lastName},</p>
        <p className="text-gray-700 mt-2">Thank you for signing up! Please use the following OTP to verify your email address:</p>
        <div className="text-center text-2xl font-bold text-gray-900 bg-gray-200 p-3 rounded-md mt-4">[OTP_CODE_PLACEHOLDER]</div>
        <p className="text-gray-700 mt-4">If you did not request this, please ignore this email.</p>
        <div className="text-center text-sm text-gray-500 mt-6">
          <p>&copy; 2025 Your Business Name. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}