import React, { useState, useRef, useEffect } from 'react';

export default function Step2Verify({ next, back }: { next: () => void; back: () => void }) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');

  // Initialize refs array
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 6);
  }, []);

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    setOtp(currentOtp => {
      const newOtp = [...currentOtp];
      newOtp[index] = value;
      return newOtp;
    });

    // Move to next input if value is entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
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

    // Focus the next empty input or the last input
    const nextEmptyIndex = digits.length < 6 ? digits.length : 5;
    inputRefs.current[nextEmptyIndex]?.focus();
  };

  const verifyOtp = async () => {
    setIsVerifying(true);
    setError('');

    try {
      // TODO: Implement OTP verification logic here
      // const response = await verifyOtpWithBackend(otp.join(''));
      // if (response.success) {
      //   next();
      // } else {
      //   setError('Invalid verification code. Please try again.');
      // }

      // Temporary: Just proceed to next step
      next();
    } catch (err) {
      setError('An error occurred during verification. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const isOtpComplete = otp.every(digit => digit !== '');

  return (
    <div className="flex flex-col p-16 pt-3 bg-white dark:bg-gray-950 rounded-lg shadow-lg w-full max-w-6xl mx-auto">
      {/* Header Section */}
      <div className="row-span-1 text-center">
        <div className="font-normal dark:text-white text-3xl">Verify Your Email</div>
        <div className="font-normal text-slate-400 text-lg pt-3">
          We've sent a verification code to your email address
        </div>
      </div>

      {/* OTP Input Section */}
      <div className="flex flex-row items-stretch gap-12 mt-6 min-h-[300px]">
        <div className="flex flex-col space-y-8 flex-grow">
          {/* OTP Input Fields */}
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
              />
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-center text-red-500 mt-4">
              {error}
            </div>
          )}

          {/* Resend Code Link */}
          <div className="text-center mt-6">
            <button 
              className="text-[#009dff] hover:underline font-medium"
              onClick={() => {
                // TODO: Implement resend logic
              }}
            >
              Didn't receive the code? Resend
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="mt-auto pt-6 flex justify-between">
        <button
          type="button"
          onClick={back}
          className="w-40 px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={verifyOtp}
          disabled={!isOtpComplete || isVerifying}
          className={`w-40 px-6 py-3 text-white rounded-lg transition-all ${
            !isOtpComplete || isVerifying
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-tl from-[#007acc] to-[#009dff] hover:scale-105"
          }`}
        >
          {isVerifying ? "Verifying..." : "Next"}
        </button>
      </div>
    </div>
  );
}