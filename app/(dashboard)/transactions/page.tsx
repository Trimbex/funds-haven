"use client"; // Ensure this is a client component

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Transactions() {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Trigger animations after component mounts
    setIsVisible(true);
  }, []);

  return (
    <div className="w-full bg-gradient-to-r from-blue-900 to-indigo-800 shadow-lg rounded-lg overflow-hidden">
      <div className="px-6 py-8">
        {/* Header Content */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Left side - Title with staggered text animation */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: isVisible ? 1 : 0 }}
            transition={{ duration: 0.5 }}
            className="mb-4 md:mb-0"
          >
            <motion.h1 
              className="text-3xl font-bold text-white"
              initial={{ y: -50 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            >
              Transaction History
            </motion.h1>
            
            <motion.p 
              className="text-blue-200 mt-1"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Manage and track your financial activities
            </motion.p>
          </motion.div>
          
          {/* Right side - Stats with counting animation */}
          <motion.div 
            className="flex space-x-6"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="text-center">
              <motion.p 
                className="text-2xl font-semibold text-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <CountAnimation target={1254} /> 
              </motion.p>
              <p className="text-blue-200 text-sm">Transactions</p>
            </div>
            
            <div className="text-center">
              <motion.p 
                className="text-2xl font-semibold text-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <CountAnimation target={42621} prefix="$" />
              </motion.p>
              <p className="text-blue-200 text-sm">Total Amount</p>
            </div>
            
            <div className="text-center">
              <motion.p 
                className="text-2xl font-semibold text-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                <CountAnimation target={14} suffix="%" />
              </motion.p>
              <p className="text-blue-200 text-sm">Growth</p>
            </div>
          </motion.div>
        </div>
        
        {/* Animated line separator */}
        <motion.div 
          className="h-1 bg-blue-400 mt-6 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ delay: 0.8, duration: 0.8 }}
        />
      </div>
    </div>
  );
}

// Animation component for counting effect
function CountAnimation({ target, duration = 2, prefix = "", suffix = "" }) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let startTime;
    let animationFrame;
    
    const updateCount = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      
      setCount(Math.floor(progress * target));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(updateCount);
      } else {
        setCount(target);
      }
    };
    
    animationFrame = requestAnimationFrame(updateCount);
    
    return () => cancelAnimationFrame(animationFrame);
  }, [target, duration]);
  
  return (
    <span>{prefix}{count.toLocaleString()}{suffix}</span>
  );
}