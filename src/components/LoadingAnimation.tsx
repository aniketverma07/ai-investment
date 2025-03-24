'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface LoadingAnimationProps {
  onComplete: () => void;
}

export default function LoadingAnimation({ onComplete }: LoadingAnimationProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const totalDurationRef = useRef<number | null>(null);
  const stepDurationRef = useRef<number | null>(null);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; size: number; speed: number; opacity: number }[]>([]);
  
  const steps = [
    "Initializing quantum AI algorithms...",
    "Scanning blockchain networks...",
    "Analyzing market volatility patterns...",
    "Evaluating token fundamentals...",
    "Processing on-chain metrics...",
    "Calculating risk-adjusted returns...",
    "Generating optimal portfolio allocation..."
  ];
  
  // Generate particles for the background effect
  useEffect(() => {
    const particleCount = 30;
    const newParticles = Array.from({ length: particleCount }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      speed: Math.random() * 0.5 + 0.1,
      opacity: Math.random() * 0.7 + 0.3
    }));
    setParticles(newParticles);
    
    const interval = setInterval(() => {
      setParticles(prev => 
        prev.map(p => ({
          ...p,
          x: (p.x + p.speed) % 100,
          y: (p.y + p.speed * 0.5) % 100,
          opacity: Math.sin((Date.now() / 1000) * p.speed) * 0.5 + 0.5
        }))
      );
    }, 50);
    
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    // Generate a random total duration between 9-15 seconds
    if (totalDurationRef.current === null) {
      totalDurationRef.current = Math.floor(Math.random() * 6000) + 9000;
      stepDurationRef.current = totalDurationRef.current / steps.length;
    }
    
    const totalDuration = totalDurationRef.current;
    const stepDuration = stepDurationRef.current;
    
    console.log(`Loading will take ${totalDuration/1000} seconds`);
    
    let startTime = Date.now();
    let timer: NodeJS.Timeout;
    
    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min(100, (elapsed / totalDuration) * 100);
      setProgress(newProgress);
      
      // Calculate current step based on progress
      const newStep = Math.min(
        steps.length - 1,
        Math.floor((newProgress / 100) * steps.length)
      );
      setCurrentStep(newStep);
      
      if (newProgress < 100) {
        timer = setTimeout(updateProgress, 50);
      } else {
        // Add a small delay before calling onComplete
        setTimeout(() => {
          onComplete();
        }, 800);
      }
    };
    
    timer = setTimeout(updateProgress, 50);
    
    return () => {
      clearTimeout(timer);
    };
  }, [onComplete, steps.length]);
  
  return (
    <div className="fixed inset-0 flex items-start justify-center bg-black/90 z-50 pt-16 md:pt-24">
      <div className="w-full max-w-2xl mx-auto px-4 relative overflow-hidden">
        {/* Particle background */}
        <div className="absolute inset-0 overflow-hidden">
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute rounded-full bg-purple-500"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                opacity: particle.opacity,
                boxShadow: `0 0 ${particle.size * 2}px ${particle.size}px rgba(147, 51, 234, ${particle.opacity})`
              }}
              animate={{
                opacity: [particle.opacity, particle.opacity * 0.5, particle.opacity],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 2 + particle.speed,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
        
        <div className="bg-black/60 backdrop-blur-xl rounded-xl p-8 border border-purple-500/20 relative z-10">
          {/* Header with logo */}
          <div className="text-center mb-8">
            <div className="w-32 h-32 mx-auto mb-4 relative">
              {/* Glowing rings around logo */}
              <motion.div 
                className="absolute inset-0 rounded-full bg-purple-500/10"
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div 
                className="absolute inset-0 rounded-full bg-purple-500/10"
                animate={{ scale: [1.1, 1.3, 1.1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
              />
              <motion.div 
                className="absolute inset-0 rounded-full bg-purple-500/10"
                animate={{ scale: [1.2, 1.4, 1.2], opacity: [0.1, 0.4, 0.1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
              />
              
              {/* Logo container with rotation effect */}
              <motion.div 
                className="relative flex items-center justify-center w-full h-full rounded-full bg-gradient-to-br from-purple-900/80 to-purple-600/80 p-2 backdrop-blur-sm"
                animate={{ 
                  boxShadow: [
                    "0 0 20px 5px rgba(147, 51, 234, 0.3)",
                    "0 0 30px 8px rgba(147, 51, 234, 0.5)",
                    "0 0 20px 5px rgba(147, 51, 234, 0.3)"
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                {/* Logo image */}
                <Image
                  src="/images/crypto-logo.png"
                  alt="Crypto Investment Advisor"
                  width={100}
                  height={100}
                  className="object-contain"
                />
                
                {/* Scanning effect */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/20 to-transparent"
                  animate={{ top: ["-100%", "200%"] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  style={{ height: "50%", width: "100%" }}
                />
              </motion.div>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">
              <span className="text-purple-400">Xoracle AI</span> Analysis
            </h2>
            <p className="text-white/70 max-w-md mx-auto">
              Our quantum AI is analyzing blockchain data to create your optimal crypto portfolio
            </p>
          </div>
          
          {/* Main progress bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-white/80 mb-2">
              <span>Analysis Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-purple-600/80 via-purple-400 to-purple-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            
            {/* Binary data stream effect */}
            <div className="mt-2 overflow-hidden h-6 rounded-md bg-black/30">
              <motion.div
                className="font-mono text-xs text-purple-400/70 whitespace-nowrap"
                animate={{ x: [0, -1000] }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              >
                {Array.from({ length: 100 }).map((_, i) => 
                  Math.random() > 0.5 ? '1' : '0'
                ).join(' ')}
              </motion.div>
            </div>
          </div>
          
          {/* Steps */}
          <div className="space-y-4 mb-8">
            {steps.slice(Math.max(0, currentStep - 1)).slice(0, 4).map((step, index) => {
              // Calculate the actual step index
              const actualIndex = Math.max(0, currentStep - 1) + index;
              
              return (
                <div 
                  key={actualIndex} 
                  className={`flex items-start ${
                    actualIndex < currentStep ? 'opacity-100' : 
                    actualIndex === currentStep ? 'opacity-100' : 
                    'opacity-40'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 ${
                    actualIndex < currentStep ? 'bg-green-500 text-white' : 
                    actualIndex === currentStep ? 'bg-purple-500 text-white' : 
                    'bg-white/10 text-white/40'
                  }`}>
                    {actualIndex < currentStep ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : actualIndex === currentStep ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </motion.div>
                    ) : (
                      <span>{actualIndex + 1}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">{step}</p>
                    {actualIndex === currentStep && stepDurationRef.current && (
                      <div className="w-full mt-2">
                        <motion.div 
                          className="h-1 bg-purple-500 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          transition={{ 
                            duration: stepDurationRef.current / 1000,
                            ease: "linear"
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Completion message */}
          <AnimatePresence>
            {progress >= 99 && (
              <motion.div 
                className="mt-8 text-center text-white/80"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    boxShadow: [
                      "0 0 0px 0px rgba(34, 197, 94, 0.4)",
                      "0 0 20px 10px rgba(34, 197, 94, 0.4)",
                      "0 0 0px 0px rgba(34, 197, 94, 0.4)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-12 h-12 mx-auto mb-3 rounded-full bg-green-500 flex items-center justify-center"
                >
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </motion.div>
                <p className="text-lg font-medium text-white">Analysis complete!</p>
                <p className="text-sm text-white/70">Preparing your personalized portfolio strategy...</p>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Xoracle AI branding */}
          <div className="absolute bottom-3 right-3 text-xs text-white/40 flex items-center">
            <span>Powered by</span>
            <span className="ml-1 text-purple-400 font-semibold">Xoracle AI</span>
            <span className="ml-1 text-xs">v2.5</span>
          </div>
        </div>
      </div>
    </div>
  );
}
