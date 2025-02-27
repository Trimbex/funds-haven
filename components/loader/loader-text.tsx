import React from 'react';
import { motion } from 'framer-motion';

interface GlowingTextProps {
  text?: string; // Optional text prop
}

const GlowingText: React.FC<GlowingTextProps> = ({ text = 'Glowing Text' }) => {
  return (
    <motion.div
      style={{
        padding: 0,
        margin: 0,
        backgroundColor: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <motion.h1
        style={{
          color: 'hsl(0, 0%, 28%)',
          fontSize: '50px',
          fontWeight: 'bold',
          fontFamily: 'monospace',
          letterSpacing: '7px',
          cursor: 'pointer',
          textTransform: 'uppercase',
          padding: '64px',
          background: 'linear-gradient(to right, hsl(0, 0%, 30%) 0, hsl(0, 0%, 100%) 10%, hsl(0, 0%, 30%) 20%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
        initial={{ backgroundPosition: '0' }}
        animate={{ backgroundPosition: '600px' }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: 'loop',
          ease: 'linear',
        }}
      >
        {text}
      </motion.h1>
    </motion.div>
  );
};

export default GlowingText;