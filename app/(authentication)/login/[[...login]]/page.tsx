'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ email, password, remember });
    // Handle authentication logic
  };

  return (
    <section className="py-4 md:py-8 bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center px-6 mx-auto md:h-screen lg:py-0">
      <Link href="/" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
        <Image width={32} height={32} src="/logo.svg" alt="osher.ai logo" className="mr-2" />
        Funds Haven
      </Link>
      <div className="w-full bg-white rounded-lg shadow dark:border sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">Login to your account</h1>

          <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="name@company.com" required />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="••••••••" required />
            </div>
            
            <div className="flex items-center">
              <div className="w-full h-0.5 bg-gray-200 dark:bg-gray-700"></div>
              <div className="px-5 text-center text-gray-500 dark:text-gray-400">or</div>
              <div className="w-full h-0.5 bg-gray-200 dark:bg-gray-700"></div>
            </div>

            <button className="w-full flex items-center justify-center py-2.5 px-5 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700">
              <svg className="w-5 h-5 mr-2" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0)"><path d="M20.3081 10.2303C20.3081 9.55056..." fill="#009dff"></path></g>
              </svg>
              Sign in with Google
            </button>

            <div className="flex items-center justify-between">
              <div className="flex items-start">
                <input type="checkbox" checked={remember} onChange={() => setRemember(!remember)} className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600" />
                <label className="ml-3 text-sm text-gray-500 dark:text-gray-300">Remember me</label>
              </div>
              <Link href="/forgot-password" className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-500">Forgot password?</Link>
            </div>
            <button type="submit" className="text-white bg-blue-500 hover:bg-blue-600 py-1.5 px-4 rounded font-bold w-full">Sign in</button>
            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
              Don’t have an account yet? <Link href="/signup" className="font-medium text-blue-600 hover:underline dark:text-blue-500">Sign up</Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
