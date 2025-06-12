"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  ShieldCheck,
  CreditCard,
  Building2,
  CheckCircle,
  AlertCircle,
  Info,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Types
type RegistrationStep = {
  id: number;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
};

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  accountName: string;
  accountType: string;
  balance: string;
  cardNumber: string;
  acceptTerms: boolean;
};

const steps: RegistrationStep[] = [
  {
    id: 1,
    title: "Personal Information",
    subtitle: "Tell us about yourself",
    icon: <User className="w-6 h-6" />
  },
  {
    id: 2,
    title: "Account Security",
    subtitle: "Secure your account",
    icon: <ShieldCheck className="w-6 h-6" />
  },
  {
    id: 3,
    title: "Financial Setup",
    subtitle: "Add your first account",
    icon: <Building2 className="w-6 h-6" />
  },
  {
    id: 4,
    title: "Welcome!",
    subtitle: "You're all set to start",
    icon: <Sparkles className="w-6 h-6" />
  }
];

export function RegistrationWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    accountName: "",
    accountType: "checking",
    balance: "",
    cardNumber: "",
    acceptTerms: false,
  });
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // Password strength validation
  const [passwordRequirements, setPasswordRequirements] = useState({
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
    isLongEnough: false,
  });

  useEffect(() => {
    if (formData.password) {
      setPasswordRequirements({
        hasUpperCase: /[A-Z]/.test(formData.password),
        hasLowerCase: /[a-z]/.test(formData.password),
        hasNumber: /\d/.test(formData.password),
        hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password),
        isLongEnough: formData.password.length >= 8,
      });
    }
  }, [formData.password]);

  const handleChange = useCallback((field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  }, [errors]);

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
        if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
        if (!formData.email.trim()) newErrors.email = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          newErrors.email = "Please enter a valid email address";
        }
        break;
      case 2:
        if (!formData.password) newErrors.password = "Password is required";
        else {
          const { hasUpperCase, hasLowerCase, hasNumber, hasSpecialChar, isLongEnough } = passwordRequirements;
          if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar || !isLongEnough) {
            newErrors.password = "Password doesn't meet all requirements";
          }
        }
        if (!formData.confirmPassword) newErrors.confirmPassword = "Please confirm your password";
        else if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = "Passwords don't match";
        }
        break;
      case 3:
        if (!formData.accountName.trim()) newErrors.accountName = "Account name is required";
        if (!formData.balance.trim()) newErrors.balance = "Initial balance is required";
        else if (isNaN(Number(formData.balance)) || Number(formData.balance) < 0) {
          newErrors.balance = "Please enter a valid amount";
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!formData.acceptTerms) {
      setErrors({ acceptTerms: "You must accept the terms and conditions" });
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement actual registration logic here
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      router.push("/dashboard");
    } catch (error) {
      console.error("Registration failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const ProgressBar = () => (
    <div className="w-full max-w-3xl mx-auto mb-12">
      <div className="relative flex items-center justify-between mb-4">
        {/* Connecting line background */}
        <div className="absolute top-6 left-6 right-6 h-0.5 bg-gray-300 -z-10"></div>
        
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center relative">
            <motion.div
              className={`w-12 h-12 rounded-full border-2 flex items-center justify-center relative z-10 transition-all duration-300 ${
                currentStep > step.id
                  ? "bg-green-500 border-green-500 text-white"
                  : currentStep === step.id
                  ? "bg-blue-500 border-blue-500 text-white"
                  : "bg-white border-gray-300 text-gray-400"
              }`}
              whileHover={{ scale: 1.05 }}
            >
              {currentStep > step.id ? (
                <Check className="w-6 h-6" />
              ) : (
                step.icon
              )}
            </motion.div>
            <div className="text-center mt-2 max-w-[100px]">
              <p className={`text-sm font-medium ${
                currentStep >= step.id ? "text-gray-900" : "text-gray-400"
              }`}>
                {step.title}
              </p>
              <p className={`text-xs ${
                currentStep >= step.id ? "text-gray-600" : "text-gray-400"
              }`}>
                {step.subtitle}
              </p>
            </div>
            
            {/* Progress line for completed steps */}
            {index < steps.length - 1 && currentStep > step.id && (
              <div className="absolute top-6 left-6 w-full h-0.5 bg-green-500 z-0 transition-all duration-500"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const PersonalInfoStep = useMemo(() => (
    <motion.div
      key="personal-info"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Let's get to know you</h2>
        <p className="text-gray-600">We'll use this information to personalize your experience</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">First Name</label>
          <div className="relative">
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
              onFocus={() => setFocusedField('firstName')}
              onBlur={() => setFocusedField(null)}
              className={`w-full px-4 py-4 bg-gray-50 border rounded-2xl outline-none transition-all duration-300 ${
                focusedField === 'firstName'
                  ? 'border-blue-500 ring-4 ring-blue-100 bg-white'
                  : errors.firstName
                  ? 'border-red-500'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              placeholder="Enter your first name"
            />
          </div>
          {errors.firstName && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.firstName}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Last Name</label>
          <div className="relative">
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
              onFocus={() => setFocusedField('lastName')}
              onBlur={() => setFocusedField(null)}
              className={`w-full px-4 py-4 bg-gray-50 border rounded-2xl outline-none transition-all duration-300 ${
                focusedField === 'lastName'
                  ? 'border-blue-500 ring-4 ring-blue-100 bg-white'
                  : errors.lastName
                  ? 'border-red-500'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              placeholder="Enter your last name"
            />
          </div>
          {errors.lastName && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.lastName}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700">Email Address</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Mail className={`w-5 h-5 transition-colors ${
              focusedField === 'email' ? 'text-blue-500' : 'text-gray-400'
            }`} />
          </div>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            onFocus={() => setFocusedField('email')}
            onBlur={() => setFocusedField(null)}
            className={`w-full pl-12 pr-4 py-4 bg-gray-50 border rounded-2xl outline-none transition-all duration-300 ${
              focusedField === 'email'
                ? 'border-blue-500 ring-4 ring-blue-100 bg-white'
                : errors.email
                ? 'border-red-500'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            placeholder="Enter your email address"
          />
        </div>
        {errors.email && (
          <p className="text-sm text-red-500 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.email}
          </p>
        )}
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Info className="w-4 h-4" />
          <span>We'll use this email to send you important account updates</span>
        </div>
      </div>
    </motion.div>
  ), [formData.firstName, formData.lastName, formData.email, focusedField, errors.firstName, errors.lastName, errors.email, handleChange]);

  const SecurityStep = useMemo(() => (
    <motion.div
      key="security"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Secure your account</h2>
        <p className="text-gray-600">Create a strong password to protect your financial data</p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700">Password</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Lock className={`w-5 h-5 transition-colors ${
              focusedField === 'password' ? 'text-blue-500' : 'text-gray-400'
            }`} />
          </div>
          <input
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={(e) => handleChange("password", e.target.value)}
            onFocus={() => setFocusedField('password')}
            onBlur={() => setFocusedField(null)}
            className={`w-full pl-12 pr-12 py-4 bg-gray-50 border rounded-2xl outline-none transition-all duration-300 ${
              focusedField === 'password'
                ? 'border-blue-500 ring-4 ring-blue-100 bg-white'
                : errors.password
                ? 'border-red-500'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            placeholder="Create a strong password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {errors.password && (
          <p className="text-sm text-red-500 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.password}
          </p>
        )}
      </div>

      {/* Password Requirements */}
      <div className="bg-gray-50 rounded-2xl p-4 space-y-2">
        <p className="text-sm font-medium text-gray-700 mb-3">Password must contain:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {[
            { key: 'isLongEnough', text: 'At least 8 characters' },
            { key: 'hasUpperCase', text: 'One uppercase letter' },
            { key: 'hasLowerCase', text: 'One lowercase letter' },
            { key: 'hasNumber', text: 'One number' },
            { key: 'hasSpecialChar', text: 'One special character' },
          ].map((req) => (
            <div key={req.key} className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                passwordRequirements[req.key as keyof typeof passwordRequirements]
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-300'
              }`}>
                {passwordRequirements[req.key as keyof typeof passwordRequirements] && (
                  <Check className="w-3 h-3" />
                )}
              </div>
              <span className={`text-sm ${
                passwordRequirements[req.key as keyof typeof passwordRequirements]
                  ? 'text-green-600'
                  : 'text-gray-500'
              }`}>
                {req.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700">Confirm Password</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Lock className={`w-5 h-5 transition-colors ${
              focusedField === 'confirmPassword' ? 'text-blue-500' : 'text-gray-400'
            }`} />
          </div>
          <input
            type={showConfirmPassword ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={(e) => handleChange("confirmPassword", e.target.value)}
            onFocus={() => setFocusedField('confirmPassword')}
            onBlur={() => setFocusedField(null)}
            className={`w-full pl-12 pr-12 py-4 bg-gray-50 border rounded-2xl outline-none transition-all duration-300 ${
              focusedField === 'confirmPassword'
                ? 'border-blue-500 ring-4 ring-blue-100 bg-white'
                : errors.confirmPassword
                ? 'border-red-500'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            placeholder="Confirm your password"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-sm text-red-500 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.confirmPassword}
          </p>
        )}
      </div>
    </motion.div>
  ), [formData.password, formData.confirmPassword, focusedField, errors.password, errors.confirmPassword, showPassword, showConfirmPassword, passwordRequirements, handleChange]);

  const FinancialStep = useMemo(() => (
    <motion.div
      key="financial"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Add your first account</h2>
        <p className="text-gray-600">This helps us get started tracking your finances (you can add more later)</p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700">Account Name</label>
        <input
          type="text"
          value={formData.accountName}
          onChange={(e) => handleChange("accountName", e.target.value)}
          onFocus={() => setFocusedField('accountName')}
          onBlur={() => setFocusedField(null)}
          className={`w-full px-4 py-4 bg-gray-50 border rounded-2xl outline-none transition-all duration-300 ${
            focusedField === 'accountName'
              ? 'border-blue-500 ring-4 ring-blue-100 bg-white'
              : errors.accountName
              ? 'border-red-500'
              : 'border-gray-200 hover:border-gray-300'
          }`}
          placeholder="e.g., Main Checking, Savings Account"
        />
        {errors.accountName && (
          <p className="text-sm text-red-500 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.accountName}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700">Account Type</label>
        <select
          value={formData.accountType}
          onChange={(e) => handleChange("accountType", e.target.value)}
          className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none transition-all duration-300 hover:border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:bg-white"
        >
          <option value="checking">Checking Account</option>
          <option value="savings">Savings Account</option>
          <option value="credit">Credit Card</option>
          <option value="investment">Investment Account</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700">Current Balance</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span className="text-gray-500 font-medium">$</span>
          </div>
          <input
            type="number"
            step="0.01"
            value={formData.balance}
            onChange={(e) => handleChange("balance", e.target.value)}
            onFocus={() => setFocusedField('balance')}
            onBlur={() => setFocusedField(null)}
            className={`w-full pl-8 pr-4 py-4 bg-gray-50 border rounded-2xl outline-none transition-all duration-300 ${
              focusedField === 'balance'
                ? 'border-blue-500 ring-4 ring-blue-100 bg-white'
                : errors.balance
                ? 'border-red-500'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            placeholder="0.00"
          />
        </div>
        {errors.balance && (
          <p className="text-sm text-red-500 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.balance}
          </p>
        )}
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Info className="w-4 h-4" />
          <span>Don't worry, this information is private and secure</span>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700">Card Number (Optional)</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <CreditCard className={`w-5 h-5 transition-colors ${
              focusedField === 'cardNumber' ? 'text-blue-500' : 'text-gray-400'
            }`} />
          </div>
          <input
            type="text"
            value={formData.cardNumber}
            onChange={(e) => handleChange("cardNumber", e.target.value)}
            onFocus={() => setFocusedField('cardNumber')}
            onBlur={() => setFocusedField(null)}
            className={`w-full pl-12 pr-4 py-4 bg-gray-50 border rounded-2xl outline-none transition-all duration-300 ${
              focusedField === 'cardNumber'
                ? 'border-blue-500 ring-4 ring-blue-100 bg-white'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            placeholder="**** **** **** 1234"
          />
        </div>
        <p className="text-xs text-gray-500">We use bank-level encryption to protect your information</p>
      </div>
    </motion.div>
  ), [formData.accountName, formData.accountType, formData.balance, formData.cardNumber, focusedField, errors.accountName, errors.balance, handleChange]);

  const WelcomeStep = useMemo(() => (
    <motion.div
      key="welcome"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center space-y-8"
    >
      <div className="space-y-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="w-24 h-24 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto"
        >
          <CheckCircle className="w-12 h-12 text-white" />
        </motion.div>
        <h2 className="text-3xl font-bold text-gray-900">Welcome to Funds Haven!</h2>
        <p className="text-gray-600 max-w-md mx-auto">
          Your account is ready! You can now start managing your finances, tracking expenses, and achieving your financial goals.
        </p>
      </div>

      <div className="space-y-4">
        <label className="flex items-center justify-center cursor-pointer">
          <input
            type="checkbox"
            checked={formData.acceptTerms}
            onChange={(e) => handleChange("acceptTerms", e.target.checked)}
            className="sr-only"
          />
          <div className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center transition-all ${
            formData.acceptTerms 
              ? 'bg-blue-500 border-blue-500' 
              : 'border-gray-300 hover:border-gray-400'
          }`}>
            {formData.acceptTerms && (
              <Check className="w-3 h-3 text-white" />
            )}
          </div>
          <span className="text-sm text-gray-700">
            I agree to the{" "}
            <Link href="/terms" className="text-blue-600 hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-blue-600 hover:underline">
              Privacy Policy
            </Link>
          </span>
        </label>
        {errors.acceptTerms && (
          <p className="text-sm text-red-500 flex items-center justify-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.acceptTerms}
          </p>
        )}
      </div>

      <Button
        onClick={handleSubmit}
        disabled={!formData.acceptTerms || loading}
        className={`h-14 px-8 text-lg font-semibold rounded-2xl transition-all duration-300 ${
          !formData.acceptTerms || loading
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:scale-[1.02] shadow-xl hover:shadow-2xl"
        } text-white`}
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Setting up your account...
          </div>
        ) : (
          "Start Using Funds Haven"
        )}
      </Button>
    </motion.div>
  ), [formData.acceptTerms, errors.acceptTerms, loading, handleChange, handleSubmit]);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return PersonalInfoStep;
      case 2:
        return SecurityStep;
      case 3:
        return FinancialStep;
      case 4:
        return WelcomeStep;
      default:
        return null;
    }
  };







  return (
    <div className="min-h-screen py-8 px-4">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-20 w-64 h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-40 w-64 h-64 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-6 shadow-lg">
            <Image
              width={32}
              height={32}
              src="/logo.svg"
              alt="Funds Haven logo"
              className="w-8 h-8 text-white"
            />
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Join Funds Haven</h1>
          <p className="text-gray-600">Let's set up your account in just a few simple steps</p>
        </div>

        {/* Progress Bar */}
        <ProgressBar />

        {/* Form Content */}
        <motion.div
          className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 max-w-2xl mx-auto"
          layout
        >
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>

          {/* Navigation Buttons */}
          {currentStep < 4 && (
            <div className="flex justify-between mt-8 pt-8 border-t border-gray-100">
              <Button
                onClick={prevStep}
                disabled={currentStep === 1}
                variant="outline"
                className={`h-12 px-6 rounded-2xl transition-all ${
                  currentStep === 1 
                    ? "opacity-50 cursor-not-allowed" 
                    : "hover:scale-105"
                }`}
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Previous
              </Button>
              <Button
                onClick={nextStep}
                className="h-12 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:scale-105 transition-all shadow-lg hover:shadow-xl text-white"
              >
                Next
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          )}
        </motion.div>

        {/* Already have account link */}
        <div className="text-center mt-8">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 