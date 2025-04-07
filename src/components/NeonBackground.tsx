'use client';

import { motion } from 'framer-motion';

interface NeonBackgroundProps {
  children: React.ReactNode;
}

export default function NeonBackground({ children }: NeonBackgroundProps) {
  return (
    <motion.div 
      className="relative min-h-screen w-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated grid background */}
      <motion.div 
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 100, 255, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 100, 255, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          opacity: 0.3
        }}
        animate={{
          backgroundPosition: ['0px 0px', '40px 40px']
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      
      {/* Radial gradient overlay */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.8) 70%)',
        }}
      />
      
      {/* Animated data points */}
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={`data-point-${i}`}
          className="absolute rounded-full z-0 pointer-events-none"
          style={{
            width: Math.random() * 4 + 1 + 'px',
            height: Math.random() * 4 + 1 + 'px',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            backgroundColor: i % 3 === 0 ? '#00ffff' : i % 3 === 1 ? '#ff00ff' : '#00ff00',
            boxShadow: i % 3 === 0 ? '0 0 5px #00ffff' : i % 3 === 1 ? '0 0 5px #ff00ff' : '0 0 5px #00ff00',
            opacity: 0.6
          }}
          animate={{
            opacity: [0.2, 0.6, 0.2],
            boxShadow: i % 3 === 0 
              ? ['0 0 2px #00ffff', '0 0 5px #00ffff', '0 0 2px #00ffff'] 
              : i % 3 === 1 
                ? ['0 0 2px #ff00ff', '0 0 5px #ff00ff', '0 0 2px #ff00ff']
                : ['0 0 2px #00ff00', '0 0 5px #00ff00', '0 0 2px #00ff00']
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            delay: Math.random() * 5
          }}
        />
      ))}
      
      {/* Animated horizontal lines */}
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={`h-line-${i}`}
          className="absolute h-[1px] left-0 right-0 z-0 pointer-events-none"
          style={{
            top: `${15 + i * 20}%`,
            backgroundImage: 'linear-gradient(90deg, transparent 0%, rgba(0, 255, 255, 0.5) 20%, rgba(0, 255, 255, 0.5) 80%, transparent 100%)',
            opacity: 0.3
          }}
          animate={{
            opacity: [0.1, 0.3, 0.1],
            boxShadow: ['0 0 2px rgba(0, 255, 255, 0.2)', '0 0 5px rgba(0, 255, 255, 0.5)', '0 0 2px rgba(0, 255, 255, 0.2)']
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: i * 0.5
          }}
        />
      ))}
      
      {/* Animated vertical lines */}
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={`v-line-${i}`}
          className="absolute w-[1px] top-0 bottom-0 z-0 pointer-events-none"
          style={{
            left: `${15 + i * 20}%`,
            backgroundImage: 'linear-gradient(0deg, transparent 0%, rgba(255, 0, 255, 0.5) 20%, rgba(255, 0, 255, 0.5) 80%, transparent 100%)',
            opacity: 0.3
          }}
          animate={{
            opacity: [0.1, 0.3, 0.1],
            boxShadow: ['0 0 2px rgba(255, 0, 255, 0.2)', '0 0 5px rgba(255, 0, 255, 0.5)', '0 0 2px rgba(255, 0, 255, 0.2)']
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: i * 0.5
          }}
        />
      ))}
      
      {/* Animated corner accents */}
      <motion.div
        className="absolute w-20 h-20 top-0 left-0 z-0 pointer-events-none"
        style={{
          borderTop: '1px solid rgba(0, 255, 255, 0.5)',
          borderLeft: '1px solid rgba(0, 255, 255, 0.5)',
          boxShadow: '0 0 10px rgba(0, 255, 255, 0.3)'
        }}
        animate={{
          boxShadow: ['0 0 5px rgba(0, 255, 255, 0.2)', '0 0 15px rgba(0, 255, 255, 0.4)', '0 0 5px rgba(0, 255, 255, 0.2)']
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      <motion.div
        className="absolute w-20 h-20 top-0 right-0 z-0 pointer-events-none"
        style={{
          borderTop: '1px solid rgba(255, 0, 255, 0.5)',
          borderRight: '1px solid rgba(255, 0, 255, 0.5)',
          boxShadow: '0 0 10px rgba(255, 0, 255, 0.3)'
        }}
        animate={{
          boxShadow: ['0 0 5px rgba(255, 0, 255, 0.2)', '0 0 15px rgba(255, 0, 255, 0.4)', '0 0 5px rgba(255, 0, 255, 0.2)']
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      <motion.div
        className="absolute w-20 h-20 bottom-0 left-0 z-0 pointer-events-none"
        style={{
          borderBottom: '1px solid rgba(255, 0, 255, 0.5)',
          borderLeft: '1px solid rgba(255, 0, 255, 0.5)',
          boxShadow: '0 0 10px rgba(255, 0, 255, 0.3)'
        }}
        animate={{
          boxShadow: ['0 0 5px rgba(255, 0, 255, 0.2)', '0 0 15px rgba(255, 0, 255, 0.4)', '0 0 5px rgba(255, 0, 255, 0.2)']
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      <motion.div
        className="absolute w-20 h-20 bottom-0 right-0 z-0 pointer-events-none"
        style={{
          borderBottom: '1px solid rgba(0, 255, 255, 0.5)',
          borderRight: '1px solid rgba(0, 255, 255, 0.5)',
          boxShadow: '0 0 10px rgba(0, 255, 255, 0.3)'
        }}
        animate={{
          boxShadow: ['0 0 5px rgba(0, 255, 255, 0.2)', '0 0 15px rgba(0, 255, 255, 0.4)', '0 0 5px rgba(0, 255, 255, 0.2)']
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      
      {children}
    </motion.div>
  );
}
