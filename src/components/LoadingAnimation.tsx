'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingAnimationProps {
  progress?: number;
  onComplete?: () => void;
  currentStep?: number;
}

export default function LoadingAnimation({ progress: externalProgress, onComplete, currentStep: externalStep }: LoadingAnimationProps) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [animationComplete, setAnimationComplete] = useState(false);
  const completionCalled = useRef(false);
  
  // Colors
  const primaryColor = '#00ffff';
  const secondaryColor = '#0066ff';
  const accentColor = '#ff00ff';
  const neonGreen = '#00ff88';
  const neonPurple = '#b700ff';
  
  // Animation states
  const [dataFlowParticles, setDataFlowParticles] = useState<Array<{x: number, y: number, size: number, color: string, speed: number}>>([]);
  const [glitchEffect, setGlitchEffect] = useState(false);
  const [pulseRings, setPulseRings] = useState<Array<{size: number, opacity: number}>>([]);
  
  // Steps in the loading process
  const steps = [
    "Initializing quantum networks...",
    "Analyzing market patterns...",
    "Processing risk parameters...",
    "Calculating simulations...",
    "Optimizing strategy...",
    "Finalizing model..."
  ];

  // Animation timing
  useEffect(() => {
    // Start progress animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        // Accelerate progress as we get closer to completion
        const increment = prev < 70 ? 0.7 : prev < 90 ? 0.3 : 0.1;
        
        // Calculate new progress
        const newProgress = Math.min(prev + increment, 100);
        
        // Update step based on progress
        const newStep = Math.min(Math.floor((newProgress / 100) * steps.length), steps.length - 1);
        setCurrentStep(newStep);
        
        // Check if animation is complete
        if (newProgress >= 100 && !completionCalled.current) {
          completionCalled.current = true;
          clearInterval(progressInterval);
          
          // Delay completion to allow final animations to play
          setTimeout(() => {
            setAnimationComplete(true);
            if (onComplete) onComplete();
          }, 500);
        }
        
        return newProgress;
      });
    }, 100);
    
    // Generate data flow particles
    generateDataFlowParticles();
    
    // Generate pulse rings
    const pulseInterval = setInterval(() => {
      setPulseRings(prev => {
        // Add a new ring and filter out ones that are too big
        const newRings = [...prev, { size: 0, opacity: 0.8 }]
          .map(ring => ({ size: ring.size + 2, opacity: Math.max(0, ring.opacity - 0.02) }))
          .filter(ring => ring.opacity > 0);
        return newRings;
      });
    }, 300);
    
    // Add glitch effect occasionally
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setGlitchEffect(true);
        setTimeout(() => setGlitchEffect(false), 150);
      }
    }, 2000);
    
    // Clean up intervals
    return () => {
      clearInterval(progressInterval);
      clearInterval(pulseInterval);
      clearInterval(glitchInterval);
    };
  }, [onComplete, steps.length]);
  
  // Use external progress if provided
  useEffect(() => {
    if (externalProgress !== undefined) {
      setProgress(externalProgress);
    }
  }, [externalProgress]);
  
  // Use external step if provided
  useEffect(() => {
    if (externalStep !== undefined) {
      setCurrentStep(externalStep);
    }
  }, [externalStep]);
  
  // Generate data flow particles
  const generateDataFlowParticles = () => {
    const particles = [];
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        color: [primaryColor, secondaryColor, accentColor, neonGreen, neonPurple][Math.floor(Math.random() * 5)],
        speed: Math.random() * 3 + 1
      });
    }
    setDataFlowParticles(particles);
  };

  // Calculate orbiting dots positions
  const getOrbitingDots = (count: number, radius: number, centerX: number, centerY: number) => {
    const dots = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const x = centerX + radius * Math.cos(angle + progress / 25);
      const y = centerY + radius * Math.sin(angle + progress / 25);
      dots.push({ x, y });
    }
    return dots;
  };
  
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      {/* Background grid effect */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 30px 30px, ${primaryColor}15 2px, transparent 0)`,
            backgroundSize: '60px 60px'
          }}
          animate={{
            opacity: [0.3, 0.5, 0.3],
            backgroundPosition: ['0px 0px', '30px 30px']
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>
      
      {/* Data flow particles */}
      <div className="absolute inset-0 overflow-hidden">
        {dataFlowParticles.map((particle, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute rounded-full"
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: particle.color,
              boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
              x: `${particle.x}%`,
              y: `${particle.y}%`,
              zIndex: 1
            }}
            animate={{
              y: [`${particle.y}%`, `${(particle.y + 100) % 200 - 100}%`],
              opacity: [0, 0.8, 0]
            }}
            transition={{
              duration: 10 / particle.speed,
              repeat: Infinity,
              ease: "linear",
              delay: i * 0.1
            }}
          />
        ))}
      </div>
      
      {/* Main loading animation container */}
      <div 
        className="relative z-10 w-full max-w-md p-8 rounded-xl"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${primaryColor}40`,
          boxShadow: `0 0 30px ${primaryColor}30`
        }}
      >
        {/* Glitch effect overlay */}
        {glitchEffect && (
          <div className="absolute inset-0 z-20 overflow-hidden">
            <div 
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: `linear-gradient(to bottom, transparent, ${primaryColor}, transparent)`,
                transform: 'translateY(-30%) skewX(45deg)',
                animation: 'glitch 0.2s ease'
              }}
            />
            <div 
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: `linear-gradient(to bottom, transparent, ${accentColor}, transparent)`,
                transform: 'translateY(30%) skewX(-45deg)',
                animation: 'glitch 0.2s ease reverse'
              }}
            />
          </div>
        )}
        
        {/* Title */}
        <div className="text-center mb-8">
          <motion.h2 
            className="text-2xl font-bold mb-2"
            style={{ color: primaryColor, textShadow: `0 0 10px ${primaryColor}` }}
            animate={{
              textShadow: [
                `0 0 5px ${primaryColor}80`,
                `0 0 15px ${primaryColor}`,
                `0 0 5px ${primaryColor}80`
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            AI Portfolio Generation
          </motion.h2>
          <motion.div
            className="text-white/70 text-sm"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Quantum-enhanced analysis in progress
          </motion.div>
        </div>
        
        {/* Main circular animation */}
        <div className="relative flex justify-center mb-8">
          <div className="relative w-48 h-48">
            {/* Pulse rings */}
            {pulseRings.map((ring, i) => (
              <motion.div
                key={`ring-${i}`}
                className="absolute rounded-full"
                style={{
                  top: '50%',
                  left: '50%',
                  width: `${ring.size}%`,
                  height: `${ring.size}%`,
                  border: `1px solid ${primaryColor}`,
                  transform: 'translate(-50%, -50%)',
                  opacity: ring.opacity
                }}
              />
            ))}
            
            {/* Rotating circles */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                border: `2px solid ${primaryColor}40`,
                boxShadow: `0 0 15px ${primaryColor}30 inset`
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
            
            <motion.div
              className="absolute inset-2 rounded-full"
              style={{
                border: `2px dashed ${secondaryColor}30`,
              }}
              animate={{ rotate: -360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            />
            
            <motion.div
              className="absolute inset-4 rounded-full"
              style={{
                border: `1px solid ${accentColor}40`,
                boxShadow: `0 0 10px ${accentColor}20`
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            />
            
            {/* Orbiting dots */}
            {getOrbitingDots(8, 80, 96, 96).map((dot, i) => (
              <motion.div
                key={`dot-${i}`}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  backgroundColor: i % 2 === 0 ? primaryColor : accentColor,
                  boxShadow: `0 0 10px ${i % 2 === 0 ? primaryColor : accentColor}`,
                  top: 0,
                  left: 0,
                  transform: `translate(${dot.x}px, ${dot.y}px)`
                }}
              />
            ))}
            
            {/* Data flow pulses */}
            {getOrbitingDots(4, 60, 96, 96).map((dot, i) => (
              <motion.div
                key={`pulse-${i}`}
                className="absolute w-1 h-10 rounded-full"
                style={{
                  background: `linear-gradient(to bottom, transparent, ${i % 2 === 0 ? neonGreen : neonPurple}, transparent)`,
                  top: 0,
                  left: 0,
                  transform: `translate(${dot.x}px, ${dot.y}px) rotate(${i * 90}deg)`,
                  transformOrigin: 'center'
                }}
                animate={{
                  opacity: [0.3, 0.7, 0.3],
                  height: ['10px', '20px', '10px']
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.5
                }}
              />
            ))}
            
            {/* Center circle with progress */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div 
                className="w-24 h-24 rounded-full flex items-center justify-center"
                style={{
                  background: `radial-gradient(circle, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.9) 100%)`,
                  border: `1px solid ${primaryColor}60`,
                  boxShadow: `0 0 20px ${primaryColor}40`
                }}
              >
                <motion.div
                  className="text-3xl font-bold"
                  style={{ color: primaryColor }}
                  animate={{
                    scale: [1, 1.1, 1],
                    textShadow: [
                      `0 0 5px ${primaryColor}80`,
                      `0 0 15px ${primaryColor}`,
                      `0 0 5px ${primaryColor}80`
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {Math.round(progress)}%
                </motion.div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="mb-6">
          <div 
            className="w-full h-2 rounded-full overflow-hidden"
            style={{ 
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              boxShadow: 'inset 0 0 5px rgba(0, 0, 0, 0.5)'
            }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{
                width: `${progress}%`,
                background: `linear-gradient(to right, ${secondaryColor}, ${primaryColor}, ${accentColor})`,
                boxShadow: `0 0 10px ${primaryColor}`
              }}
              animate={{
                boxShadow: [
                  `0 0 5px ${primaryColor}`,
                  `0 0 15px ${primaryColor}`,
                  `0 0 5px ${primaryColor}`
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </div>
        
        {/* Status text */}
        <div className="text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="h-6"
            >
              <div 
                className="text-sm"
                style={{ color: primaryColor }}
              >
                {steps[currentStep]}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        
        {/* Status indicators */}
        <div className="flex justify-center mt-6 space-x-2">
          {steps.map((_, i) => (
            <motion.div
              key={`step-${i}`}
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor: i <= currentStep ? primaryColor : 'rgba(255, 255, 255, 0.2)',
                boxShadow: i <= currentStep ? `0 0 5px ${primaryColor}` : 'none'
              }}
              animate={i === currentStep ? {
                scale: [1, 1.5, 1],
                boxShadow: [
                  `0 0 5px ${primaryColor}`,
                  `0 0 10px ${primaryColor}`,
                  `0 0 5px ${primaryColor}`
                ]
              } : {}}
              transition={{ duration: 1, repeat: Infinity }}
            />
          ))}
        </div>
      </div>
      
      {/* Add keyframe animations */}
      <style jsx>{`
        @keyframes glitch {
          0% { clip-path: inset(40% 0 61% 0); }
          20% { clip-path: inset(92% 0 1% 0); }
          40% { clip-path: inset(43% 0 1% 0); }
          60% { clip-path: inset(25% 0 58% 0); }
          80% { clip-path: inset(54% 0 7% 0); }
          100% { clip-path: inset(58% 0 43% 0); }
        }
        
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(1.5); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
