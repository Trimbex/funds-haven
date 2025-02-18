import React, { useState, useRef, useEffect } from 'react';
import { useFormContext } from "../../../../context/FormContext";
import { useAuthContext } from '@/app/context/authContext';
import { sendOtp, verifyOtp , signUpNewUser} from '@/app/api/register/verification';
import { addUser } from '@/app/api/register/user';


export default function Step2Verify({ next, back }: { next: () => void; back: () => void }) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { formData } = useFormContext();
  const { authData, setAuthData } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  // Initialize refs array
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 6);
    // Send OTP when component mounts
    handleSendOtp();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    setOtp(currentOtp => {
      const newOtp = [...currentOtp];
      newOtp[index] = value;
      return newOtp;
    });

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    const digits = pastedData.split('').filter(char => /^\d$/.test(char));
    
    setOtp(currentOtp => {
      const newOtp = [...currentOtp];
      digits.forEach((digit, index) => {
        if (index < 6) newOtp[index] = digit;
      });
      return newOtp;
    });

    const nextEmptyIndex = digits.length < 6 ? digits.length : 5;
    inputRefs.current[nextEmptyIndex]?.focus();
  };

  const handleSendOtp = async () => {
    setIsLoading(true);
    setError('');
    setSuccessMessage('TESTING OTP!');
    
    // const response = await sendOtp(formData.email);
    // if (!response.success) {
    //   setError(response.error || 'Failed to send OTP');
    // } else {
    //   setSuccessMessage(`OTP has been sent to ${formData.email}`);
    // }
    
    setIsLoading(false);
  };

  const handleVerifyOtp = async () => {
    setIsLoading(true);
    setError('');
    
    // const response = await verifyOtp({ 
    //   email: formData.email, 
    //   token: otp.join('')
    // });
    
    // if (!response.success) {
    //   setError(response.error || 'Invalid OTP. Please try again.');
    //   setIsVerified(false);
    // } else {
    //   setSuccessMessage('OTP verified successfully!');
    //   setIsVerified(true);
    // }
    setIsVerified(true);

    const response = await signUpNewUser({email: formData.email, password: formData.password});
    
    if(response?.user?.id)
    {
      console.log(response?.user?.id);
      addUser(response?.user?.id, formData.firstName, formData.lastName, formData.email);
      setAuthData({userID: response?.user?.id});
      
    }
   
    else
    console.log("Error in adding user");
 
    setIsLoading(false);
  };

  const isOtpComplete = otp.every(digit => digit !== '');

  return (
    <div className="flex flex-col p-16 pt-3 bg-white dark:bg-gray-950 rounded-lg shadow-lg w-full max-w-6xl mx-auto">
      <div className="row-span-1 text-center">
        <div className="font-normal dark:text-white text-3xl">Verify Your Email</div>
        <div className="font-normal text-slate-400 text-lg pt-3">
          We've sent a verification code to your email address
        </div>
      </div>

      <div className="flex flex-row items-stretch gap-12 mt-6 min-h-[300px]">
        <div className="flex flex-col space-y-8 flex-grow">
          <div className="flex justify-center gap-4 mt-8">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={el => inputRefs.current[index] = el}
                type="text"
                maxLength={1}
                value={digit}
                onChange={e => handleChange(index, e.target.value)}
                onKeyDown={e => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="w-14 h-14 text-center text-2xl border rounded-lg outline-none transition-shadow shadow-sm focus:shadow-md focus:ring-2 focus:ring-[#009dff] dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-600"
                disabled={isVerified}
              />
            ))}
          </div>

          {error && (
            <div className="text-center text-red-500 mt-4">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="text-center text-green-500 mt-4">
              {successMessage}
            </div>
          )}

          <div className="text-center mt-6">
            <button 
              className="text-[#009dff] hover:underline font-medium disabled:opacity-50"
              onClick={handleSendOtp}
              disabled={isLoading || isVerified}
            >
              {isLoading ? 'Sending...' : "Didn't receive the code? Resend"}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-auto pt-6 flex justify-between">
        <button
          type="button"
          onClick={back}
          className="w-40 px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
        >
          Previous
        </button>
        {isVerified ? (
          <button
            onClick={next}
            className="w-40 px-6 py-3 text-white rounded-lg transition-all bg-gradient-to-tl from-[#007acc] to-[#009dff] hover:scale-105"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleVerifyOtp}
            disabled={!isOtpComplete || isLoading}
            className={`w-40 px-6 py-3 text-white rounded-lg transition-all ${
              !isOtpComplete || isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-tl from-[#007acc] to-[#009dff] hover:scale-105"
            }`}
          >
            {isLoading ? "Verifying..." : "Verify"}
          </button>
        )}
      </div>
    </div>
  );
}