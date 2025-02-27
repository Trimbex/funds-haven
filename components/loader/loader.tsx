import React from 'react';
import { motion } from 'framer-motion';

const DotLoader: React.FC = () => {
  const dotVariants = {
    hidden: { opacity: 0, scale: 1 },
    visible: { opacity: 1, scale: 0.7 },
  };

  const dotTransition = {
    duration: 3,
    ease: 'easeInOut',
    repeat: Infinity,
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      style={{ width: '100%', height: '100%' }}
    >
      <g className="g-group">
        {[30, 40, 50, 60, 70].map((cx, index) => (
          <motion.circle
            key={index}
            className="dot"
            cx={`${cx}vw`}
            cy="50%"
            r="max(1vw, 11px)"
            fill="#0088cc"
            stroke="#fff"
            strokeWidth="0.5px"
            filter="saturate(2) opacity(0.85)"
            variants={dotVariants}
            initial="hidden"
            animate="visible"
            transition={{
              ...dotTransition,
              delay: 0.15 * index,
            }}
          />
        ))}
      </g>
    </svg>
  );
};

export default DotLoader;