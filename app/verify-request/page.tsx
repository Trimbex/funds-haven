"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { CheckCircle, Mail, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function VerifyRequest() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-20 w-64 h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-40 w-64 h-64 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Mail className="w-10 h-10 text-white" />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Check your email</h1>
            <p className="text-gray-600 mb-8 text-lg leading-relaxed">
              A sign in link has been sent to your email address. 
              Click the link in the email to securely sign in to your account.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="space-y-6"
          >
            {/* Instructions */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-gray-900">What's next?</h3>
              </div>
              <ul className="text-sm text-gray-600 space-y-2 text-left">
                <li>• Check your email inbox</li>
                <li>• Look for an email from Funds Haven</li>
                <li>• Click the "Sign In" button in the email</li>
                <li>• You'll be automatically signed in</li>
              </ul>
            </div>

            {/* Help text */}
            <div className="text-sm text-gray-500 space-y-2">
              <p>
                <strong>Didn't receive the email?</strong>
              </p>
              <p>
                Check your spam folder or try using a different email address.
                The link will expire in 1 hour for security.
              </p>
            </div>

            {/* Back to login */}
            <Link href="/login">
              <Button
                variant="outline"
                className="w-full flex items-center gap-2 hover:bg-gray-50"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Sign In
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="text-center mt-8 text-sm text-gray-500"
        >
          <p>© 2024 Funds Haven. Secure financial management made simple.</p>
        </motion.div>
      </motion.div>
    </div>
  );
} 