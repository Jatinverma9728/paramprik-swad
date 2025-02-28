import React from 'react';
import { motion } from 'framer-motion';

export const EmptyCartAnimation = () => {
  return (
    <div className="relative w-64 mx-auto mb-8">
      {/* Animated Cart Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ 
          opacity: 1,
          scale: 1,
          transition: { duration: 0.5 }
        }}
        className="relative h-48 flex items-center justify-center"
      >
        <motion.svg
          viewBox="0 0 128 128"
          width="128"
          height="128"
          className="mx-auto"
        >
          {/* Cart Body */}
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            d="M24 40 H104 L96 88 H32 L24 40"
            fill="none"
            stroke="#C2410C"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Left Wheel with rotation */}
          <motion.circle
            cx="40"
            cy="100"
            r="8"
            fill="#C2410C"
            initial={{ scale: 0 }}
            animate={{ 
              scale: 1,
              rotate: 360
            }}
            transition={{ 
              scale: { delay: 1, duration: 0.3 },
              rotate: { duration: 2, repeat: Infinity, ease: "linear" }
            }}
          />
          
          {/* Right Wheel with rotation */}
          <motion.circle
            cx="88"
            cy="100"
            r="8"
            fill="#C2410C"
            initial={{ scale: 0 }}
            animate={{ 
              scale: 1,
              rotate: 360
            }}
            transition={{ 
              scale: { delay: 1.2, duration: 0.3 },
              rotate: { duration: 2, repeat: Infinity, ease: "linear" }
            }}
          />
          
          {/* Shopping Bag */}
          <motion.path
            d="M48 40 L56 16 H72 L80 40"
            fill="none"
            stroke="#C2410C"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          />
          
          {/* Three Bouncing Dots */}
          {[0, 1, 2].map((i) => (
            <motion.circle
              key={i}
              cx={54 + i * 10}
              cy="64"
              r="3"
              fill="#C2410C"
              initial={{ y: 0, opacity: 0 }}
              animate={{ 
                y: [-8, 0, -8],
                opacity: 1
              }}
              transition={{
                y: { 
                  duration: 1,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.2
                },
                opacity: { duration: 0.2 }
              }}
            />
          ))}
        </motion.svg>

        {/* Animated Shadow */}
        <motion.div
          className="absolute -bottom-4 left-1/2 w-32 h-4 bg-amber-200/30 rounded-full blur-sm -translate-x-1/2"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.2, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>

      {/* Static Text Section */}
      <div className="text-center mt-8">
        <h2 className="text-3xl font-bold text-amber-900 mb-4">
          Your cart is empty
        </h2>
        <p className="text-amber-700 mb-8">
          Time to fill it with some delicious items!
        </p>
      </div>
    </div>
  );
};
