'use client';

import React from 'react';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

export type StatCard = {
  title: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
};

export type DashboardHeaderProps = {
  title: string;
  subtitle: string;
  stats: StatCard[];
  actionButton?: {
    label: string;
    onClick: () => void;
  };
};

export default function DashboardHeader({
  title,
  subtitle,
  stats,
  actionButton,
}: DashboardHeaderProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl py-8 px-6 mb-8 text-white relative overflow-hidden"
    >
      {/* Background decoration elements */}
      <motion.div 
        className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full opacity-5"
        initial={{ x: 100, y: -100 }}
        animate={{ x: 0, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      />
      <motion.div 
        className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full opacity-5"
        initial={{ x: -50, y: 50 }}
        animate={{ x: 0, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      />
      
      <div className="relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">{title}</h1>
            <p className="text-blue-100">{subtitle}</p>
          </div>
          
          {actionButton && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Button 
                className="bg-white text-blue-600 hover:bg-blue-50 mt-4 md:mt-0"
                onClick={actionButton.onClick}
              >
                {actionButton.label}
              </Button>
            </motion.div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          {stats.map((stat, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
              className="bg-white bg-opacity-10 p-4 rounded-lg backdrop-blur-sm"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-blue-100 text-sm">{stat.title}</p>
                  <h3 className="text-2xl font-bold">{stat.value}</h3>
                </div>
                <div className={`p-2 ${stat.iconBgColor} bg-opacity-20 rounded-full`}>
                  <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
                </div>
              </div>
              <div className="text-xs text-blue-100">{stat.description}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
} 