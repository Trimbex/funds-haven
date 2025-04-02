'use client';

import React from 'react';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function Header()
{
    return (

        <motion.div 
  initial={{ opacity: 0, y: -50 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, ease: "easeOut" }}
  className="w-full bg-gradient-to-r from-[#009dff] to-[#0077c2] py-24 px-6 md:px-12 lg:px-24 relative overflow-hidden"
>
  {/* Animated background elements */}
  <motion.div 
    className="absolute top-0 right-0 w-64 h-64 bg-[#40b5ff] rounded-full opacity-10"
    initial={{ x: 100, y: -100 }}
    animate={{ x: 0, y: 0 }}
    transition={{ duration: 1.5, ease: "easeOut" }}
  />
  <motion.div 
    className="absolute bottom-0 left-0 w-48 h-48 bg-[#40b5ff] rounded-full opacity-10"
    initial={{ x: -100, y: 100 }}
    animate={{ x: 0, y: 0 }}
    transition={{ duration: 1.5, ease: "easeOut" }}
  />
  
  <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative z-10">
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
    >
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
        Categories
      </h1>
      <p className="text-gray-100 mt-4 text-lg md:text-xl max-w-2xl">
      Manage budgets, track expenses, optimize savings, and plan investments effortlessly.
      </p>
    </motion.div>
    
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
      className="mt-6 md:mt-0"
    >

    </motion.div>

    
  </div>
  

</motion.div>
    )
}