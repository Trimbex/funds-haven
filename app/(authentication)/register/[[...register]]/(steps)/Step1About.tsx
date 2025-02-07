import React, { useState, useEffect } from "react";

export default function Step1About({ next }: { next: () => void }) {
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [touched, setTouched] = useState({
    firstName: false,
    lastName: false,
    email: false,
    password: false,
    confirmPassword: false
  });
  const [passwordStrength, setPasswordStrength] = useState<string>("Weak");
  const [passwordsMatch, setPasswordsMatch] = useState<boolean>(true);

  const handleFocus = (field: string) => setFocusedField(field);
  const handleBlur = (field: string) => {
    setFocusedField(null);
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  useEffect(() => {
    if (touched.confirmPassword) {
      setPasswordsMatch(formData.password === formData.confirmPassword);
    }
  }, [formData.password, formData.confirmPassword, touched.confirmPassword]);

  const evaluatePasswordStrength = (password: string) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLongEnough = password.length >= 8;

    if (isLongEnough && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar) {
      setPasswordStrength("Strong");
    } else if (isLongEnough && (hasUpperCase || hasLowerCase) && hasNumber) {
      setPasswordStrength("Medium");
    } else {
      setPasswordStrength("Weak");
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'password') {
      evaluatePasswordStrength(value);
    }
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isFormValid = () => {
    return (
      formData.firstName.trim() !== "" &&
      formData.lastName.trim() !== "" &&
      formData.email.trim() !== "" &&
      isValidEmail(formData.email) &&
      formData.password !== "" &&
      formData.confirmPassword !== "" &&
      formData.password === formData.confirmPassword
    );
  };

  const RequiredAsterisk = () => (
    <span className="text-red-500 ml-1">*</span>
  );

  return (
    <div className="flex flex-col p-16 pt-3 bg-white dark:bg-gray-950 rounded-lg shadow-lg w-full max-w-6xl mx-auto">
      {/* Header Section */}
      <div className="row-span-1 text-center">
        <div className="font-normal dark:text-white text-3xl">Basic Information</div>
        <div className="font-normal text-slate-400 text-lg pt-3">
          Let's get started by telling us your name and your email address
        </div>
      </div>

      {/* Outer Flex Container */}
      <div className="flex flex-row items-stretch gap-12 mt-6 min-h-[300px]">
        {/* Input Fields Container */}
        <div className="flex flex-col space-y-6 flex-grow">
          {/* First Name Field */}
          <div className="block">
            <label
              htmlFor="firstName"
              className="text-left block text-sm font-bold mb-2 text-slate-700 dark:text-white/80 transition-colors"
            >
              First Name<RequiredAsterisk />
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              onFocus={() => handleFocus("firstName")}
              onBlur={() => handleBlur("firstName")}
              className={`w-full px-4 py-3 rounded-lg border outline-none transition-shadow shadow-sm focus:shadow-md focus:ring-2 focus:ring-[#009dff] dark:bg-gray-800 dark:text-white ${
                focusedField === "firstName"
                  ? "border-[#009dff]"
                  : touched.firstName && !formData.firstName
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              }`}
              placeholder="Enter your first name"
            />
            {touched.firstName && !formData.firstName && (
              <div className="mt-2 text-sm text-red-500">First name is required</div>
            )}
          </div>

          {/* Last Name Field */}
          <div className="block">
            <label
              htmlFor="lastName"
              className="text-left block text-sm font-bold mb-2 text-slate-700 dark:text-white/80 transition-colors"
            >
              Last Name<RequiredAsterisk />
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
              onFocus={() => handleFocus("lastName")}
              onBlur={() => handleBlur("lastName")}
              className={`w-full px-4 py-3 rounded-lg border outline-none transition-shadow shadow-sm focus:shadow-md focus:ring-2 focus:ring-[#009dff] dark:bg-gray-800 dark:text-white ${
                focusedField === "lastName"
                  ? "border-[#009dff]"
                  : touched.lastName && !formData.lastName
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              }`}
              placeholder="Enter your last name"
            />
            {touched.lastName && !formData.lastName && (
              <div className="mt-2 text-sm text-red-500">Last name is required</div>
            )}
          </div>

          {/* Email Address Field */}
          <div className="block">
            <label
              htmlFor="email"
              className="text-left block text-sm font-bold mb-2 text-slate-700 dark:text-white/80 transition-colors"
            >
              Email Address<RequiredAsterisk />
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              onFocus={() => handleFocus("email")}
              onBlur={() => handleBlur("email")}
              className={`w-full px-4 py-3 rounded-lg border outline-none transition-shadow shadow-sm focus:shadow-md focus:ring-2 focus:ring-[#009dff] dark:bg-gray-800 dark:text-white ${
                focusedField === "email"
                  ? "border-[#009dff]"
                  : touched.email && (!formData.email || !isValidEmail(formData.email))
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              }`}
              placeholder="Enter your email address"
            />
            {touched.email && !formData.email && (
              <div className="mt-2 text-sm text-red-500">Email is required</div>
            )}
            {touched.email && formData.email && !isValidEmail(formData.email) && (
              <div className="mt-2 text-sm text-red-500">Please enter a valid email address</div>
            )}
          </div>

          {/* Password Field */}
          <div className="block">
            <label
              htmlFor="password"
              className="text-left block text-sm font-bold mb-2 text-slate-700 dark:text-white/80 transition-colors"
            >
              Password<RequiredAsterisk />
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              onFocus={() => handleFocus("password")}
              onBlur={() => handleBlur("password")}
              className={`w-full px-4 py-3 rounded-lg border outline-none transition-shadow shadow-sm focus:shadow-md focus:ring-2 focus:ring-[#009dff] dark:bg-gray-800 dark:text-white ${
                focusedField === "password"
                  ? "border-[#009dff]"
                  : touched.password && !formData.password
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              }`}
              placeholder="Enter your password"
            />
            <div className="mt-2 text-sm font-medium">
              Password Strength: <span className={`font-bold ${
                passwordStrength === "Strong"
                  ? "text-green-600"
                  : passwordStrength === "Medium"
                  ? "text-yellow-600"
                  : "text-red-600"
              }`}>{passwordStrength}</span>
            </div>
            {touched.password && !formData.password && (
              <div className="mt-2 text-sm text-red-500">Password is required</div>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="block">
            <label
              htmlFor="confirmPassword"
              className="text-left block text-sm font-bold mb-2 text-slate-700 dark:text-white/80 transition-colors"
            >
              Confirm Password<RequiredAsterisk />
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
              onFocus={() => handleFocus("confirmPassword")}
              onBlur={() => handleBlur("confirmPassword")}
              className={`w-full px-4 py-3 rounded-lg border outline-none transition-shadow shadow-sm focus:shadow-md focus:ring-2 focus:ring-[#009dff] dark:bg-gray-800 dark:text-white ${
                focusedField === "confirmPassword"
                  ? "border-[#009dff]"
                  : touched.confirmPassword && (!passwordsMatch || !formData.confirmPassword)
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              }`}
              placeholder="Confirm your password"
            />
            {touched.confirmPassword && !formData.confirmPassword && (
              <div className="mt-2 text-sm text-red-500">Please confirm your password</div>
            )}
            {touched.confirmPassword && formData.confirmPassword && !passwordsMatch && (
              <div className="mt-2 text-sm text-red-500">Passwords do not match</div>
            )}
          </div>
        </div>

        {/* Image Container */}
        <div className="flex-shrink-0 h-full w-2/5 pt-24">
          <img
            src="./regstep1.svg"
            alt="Step 1 Image"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      </div>

      {/* Next Button */}
      <div className="mt-auto pt-6">
        <button
          type="button"
          onClick={next}
          disabled={!isFormValid()}
          className={`w-40 px-6 py-3 text-white rounded-lg transition-all ${
            !isFormValid()
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-tl from-[#007acc] to-[#009dff] hover:scale-105"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}