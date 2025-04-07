'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NeonBackground from './NeonBackground';

interface XoracleInvestmentSpecsProps {
  onSubmit: (data: {
    desiredMultiplier: number;
    timeHorizon: number;
    volatilityPreference: number;
    riskTolerance: number;
    investmentAmount: string;
  }) => void;
  riskToleranceValue?: number;
  setRiskToleranceValue?: React.Dispatch<React.SetStateAction<number>>;
  volatilityValue?: number;
  setVolatilityValue?: React.Dispatch<React.SetStateAction<number>>;
  moonshotValue?: number;
  setMoonshotValue?: React.Dispatch<React.SetStateAction<number>>;
  timeHorizonValue?: number;
  setTimeHorizonValue?: React.Dispatch<React.SetStateAction<number>>;
}

export default function XoracleInvestmentSpecs({ 
  onSubmit,
  riskToleranceValue,
  setRiskToleranceValue,
  volatilityValue,
  setVolatilityValue,
  moonshotValue,
  setMoonshotValue,
  timeHorizonValue,
  setTimeHorizonValue
}: XoracleInvestmentSpecsProps) {
  // Use provided state values if available, otherwise use local state
  const [desiredMultiplier, setDesiredMultiplier] = useState(moonshotValue || 10);
  const [timeHorizon, setTimeHorizon] = useState(timeHorizonValue || 1); // 1 month
  const [volatilityPreference, setVolatilityPreference] = useState(volatilityValue || 50);
  const [riskTolerance, setRiskTolerance] = useState(riskToleranceValue || 50);
  const [investmentAmount, setInvestmentAmount] = useState('10000');
  
  // Animation states
  const [isHovering, setIsHovering] = useState(false);
  const [activeSlider, setActiveSlider] = useState<string | null>(null);
  const [animateIn, setAnimateIn] = useState(false);
  const [sliderGlowColors, setSliderGlowColors] = useState({
    desiredMultiplier: '#ffcc00',
    timeHorizon: '#00ffff',
    volatilityPreference: '#ff00ff',
    riskTolerance: '#00ff88'
  });
  
  // New animation states
  const [dataPoints, setDataPoints] = useState<Array<{x: number, y: number, color: string}>>([]);
  const [particleSystem, setParticleSystem] = useState<Array<{x: number, y: number, size: number, opacity: number, color: string}>>([]);
  const [glitchEffect, setGlitchEffect] = useState(false);
  const [hoverSlider, setHoverSlider] = useState<string | null>(null);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  const valueVariants = {
    initial: { scale: 1 },
    changed: {
      scale: [1, 1.2, 1],
      transition: { duration: 0.3 }
    }
  };

  const buttonVariants = {
    initial: { 
      scale: 1,
      boxShadow: '0 0 15px rgba(0, 255, 255, 0.5)'
    },
    hover: { 
      scale: 1.05,
      boxShadow: '0 0 25px rgba(0, 255, 255, 0.8), 0 0 40px rgba(0, 255, 255, 0.4)'
    },
    tap: { 
      scale: 0.98,
      boxShadow: '0 0 10px rgba(0, 255, 255, 0.3)'
    }
  };
  
  // Slider container variants
  const sliderContainerVariants = {
    initial: { 
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      borderColor: 'rgba(0, 255, 255, 0.2)',
    },
    hover: { 
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      borderColor: 'rgba(0, 255, 255, 0.4)',
      transition: { duration: 0.3 }
    },
    active: {
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      borderColor: 'rgba(0, 255, 255, 0.6)',
      transition: { duration: 0.2 }
    }
  };

  // Trigger animation on mount
  useEffect(() => {
    setAnimateIn(true);
    
    // Generate data points for background effects
    const points = [];
    for (let i = 0; i < 30; i++) {
      points.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        color: `hsl(${Math.random() * 60 + 180}, 100%, 70%)`
      });
    }
    setDataPoints(points);
    
    // Generate particle system
    const particles = [];
    for (let i = 0; i < 20; i++) {
      particles.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 1 + Math.random() * 2,
        opacity: 0.3 + Math.random() * 0.5,
        color: ['#00ffff', '#ff00ff', '#00ff88', '#ffcc00'][Math.floor(Math.random() * 4)]
      });
    }
    setParticleSystem(particles);
    
    // Add cyberpunk background effect
    const interval = setInterval(() => {
      setSliderGlowColors({
        desiredMultiplier: `hsl(${Math.random() * 60 + 40}, 100%, 50%)`, // Gold/yellow range
        timeHorizon: `hsl(${Math.random() * 40 + 180}, 100%, 60%)`, // Cyan range
        volatilityPreference: `hsl(${Math.random() * 40 + 280}, 100%, 60%)`, // Magenta range
        riskTolerance: `hsl(${Math.random() * 40 + 140}, 100%, 60%)` // Green-cyan range
      });
      
      // Random glitch effect
      if (Math.random() < 0.05) {
        setGlitchEffect(true);
        setTimeout(() => setGlitchEffect(false), 150);
      }
      
      // Update particles
      setParticleSystem(prev => prev.map(particle => ({
        ...particle,
        x: (particle.x + (Math.random() - 0.5) * 0.5) % 100,
        y: (particle.y + (Math.random() - 0.5) * 0.5) % 100,
        opacity: 0.3 + Math.random() * 0.5
      })));
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  // Update parent state when local state changes
  const updateDesiredMultiplier = (value: number) => {
    setDesiredMultiplier(value);
    if (setMoonshotValue) {
      setMoonshotValue(value);
    }
  };

  const updateTimeHorizon = (value: number) => {
    setTimeHorizon(value);
    if (setTimeHorizonValue) {
      setTimeHorizonValue(value);
    }
  };

  const updateVolatilityPreference = (value: number) => {
    setVolatilityPreference(value);
    if (setVolatilityValue) {
      setVolatilityValue(value);
    }
  };

  const updateRiskTolerance = (value: number) => {
    setRiskTolerance(value);
    if (setRiskToleranceValue) {
      setRiskToleranceValue(value);
    }
  };

  const updateInvestmentAmount = (value: string) => {
    setInvestmentAmount(value);
  };

  // Format the multiplier display
  const formattedMultiplier = `${desiredMultiplier}x`;
  
  // Format the time horizon display
  const formattedTimeHorizon = timeHorizon === 1 ? '1 Month' : 
    timeHorizon === 3 ? '3 Months' : 
    timeHorizon === 6 ? '6 Months' : 
    timeHorizon === 12 ? '1 Year' : 
    timeHorizon === 24 ? '2 Years' : 
    timeHorizon === 36 ? '3 Years' : 
    timeHorizon === 60 ? '5 Years' : 
    `${timeHorizon} Months`;
    
  // Format the investment amount with commas
  const formattedInvestmentAmount = investmentAmount ? 
    parseInt(investmentAmount).toLocaleString('en-US') : '';

  // Animation for slider glow effect
  const getSliderGlowVariants = (color: string) => ({
    initial: {
      boxShadow: `0 0 5px ${color}40`,
      transition: { duration: 0.3 }
    },
    hover: {
      boxShadow: `0 0 15px ${color}80, 0 0 30px ${color}40`,
      transition: { duration: 0.3 }
    },
    active: {
      boxShadow: `0 0 20px ${color}, 0 0 40px ${color}80`,
      transition: { duration: 0.5 }
    }
  });

  // Animation for slider thumb
  const getThumbVariants = (color: string) => ({
    initial: {
      scale: 1,
      boxShadow: `0 0 5px ${color}`,
      transition: { duration: 0.3 }
    },
    hover: {
      scale: 1.2,
      boxShadow: `0 0 10px ${color}, 0 0 20px ${color}80`,
      transition: { duration: 0.3 }
    },
    active: {
      scale: 1.3,
      boxShadow: `0 0 15px ${color}, 0 0 30px ${color}80`,
      transition: { duration: 0.2 }
    }
  });

  // Separate pulse animation to avoid TypeScript errors
  const getPulseAnimation = (color: string) => ({
    animate: {
      boxShadow: [
        `0 0 5px ${color}80`,
        `0 0 15px ${color}`,
        `0 0 5px ${color}80`
      ],
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse" as const
      }
    }
  });

  // Get slider track style based on value
  const getSliderTrackStyle = (value: number, min: number, max: number, color: string) => {
    const percentage = ((value - min) / (max - min)) * 100;
    return {
      background: `linear-gradient(90deg, ${color}, ${color}40)`,
      width: `${percentage}%`,
      height: '100%',
      borderRadius: '9999px',
      position: 'absolute' as const,
      left: 0,
      top: 0,
      boxShadow: `0 0 10px ${color}80, 0 0 20px ${color}40`,
    };
  };

  const handleSubmit = () => {
    onSubmit({
      desiredMultiplier,
      timeHorizon,
      volatilityPreference,
      riskTolerance,
      investmentAmount
    });
  };

  // Handle slider focus/blur
  const handleSliderFocus = (id: string) => {
    setActiveSlider(id);
  };

  const handleSliderBlur = () => {
    setActiveSlider(null);
  };
  
  // Handle slider hover
  const handleSliderHover = (id: string | null) => {
    setHoverSlider(id);
  };

  return (
    <motion.div 
      className="w-full max-w-4xl mx-auto"
      initial="hidden"
      animate={animateIn ? "visible" : "hidden"}
      variants={containerVariants}
    >
      <NeonBackground>
        <motion.div 
          className="relative z-10 p-8 bg-black/40 backdrop-blur-md rounded-xl overflow-hidden"
          variants={itemVariants}
          style={{ 
            border: '1px solid rgba(0, 255, 255, 0.2)',
            boxShadow: '0 0 20px rgba(0, 255, 255, 0.1), inset 0 0 10px rgba(0, 0, 0, 0.5)'
          }}
          animate={{
            boxShadow: [
              '0 0 20px rgba(0, 255, 255, 0.1), inset 0 0 10px rgba(0, 0, 0, 0.5)',
              '0 0 30px rgba(0, 255, 255, 0.2), inset 0 0 10px rgba(0, 0, 0, 0.5)',
              '0 0 20px rgba(0, 255, 255, 0.1), inset 0 0 10px rgba(0, 0, 0, 0.5)'
            ]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          {/* Corner accents */}
          <div className="absolute w-8 h-8 top-0 left-0 border-t-2 border-l-2 border-cyan-500/50" 
               style={{ boxShadow: '5px 5px 10px rgba(0, 255, 255, 0.2)' }} />
          <div className="absolute w-8 h-8 top-0 right-0 border-t-2 border-r-2 border-purple-500/50" 
               style={{ boxShadow: '-5px 5px 10px rgba(255, 0, 255, 0.2)' }} />
          <div className="absolute w-8 h-8 bottom-0 left-0 border-b-2 border-l-2 border-purple-500/50" 
               style={{ boxShadow: '5px -5px 10px rgba(255, 0, 255, 0.2)' }} />
          <div className="absolute w-8 h-8 bottom-0 right-0 border-b-2 border-r-2 border-cyan-500/50" 
               style={{ boxShadow: '-5px -5px 10px rgba(0, 255, 255, 0.2)' }} />
          
          <motion.div 
            className="text-center mb-6"
            variants={itemVariants}
          >
            <motion.h2 
              className="text-2xl font-bold tracking-wider"
              style={{ 
                background: 'linear-gradient(to right, #00ffff, #0099ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 0 10px rgba(0, 255, 255, 0.5)'
              }}
              animate={{
                textShadow: [
                  '0 0 10px rgba(0, 255, 255, 0.5)',
                  '0 0 20px rgba(0, 255, 255, 0.8)',
                  '0 0 10px rgba(0, 255, 255, 0.5)'
                ]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              INVESTMENT PARAMETERS
            </motion.h2>
            <motion.p 
              className="text-blue-400 mt-2 text-sm"
              animate={{
                opacity: [0.7, 0.9, 0.7]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              Customize your AI-powered investment strategy
            </motion.p>
          </motion.div>

          {/* Sliders */}
          <div className="space-y-6">
            {/* Desired Multiplier */}
            <motion.div 
              className="relative"
              variants={itemVariants}
              onMouseEnter={() => handleSliderHover('desiredMultiplier')}
              onMouseLeave={() => handleSliderHover(null)}
            >
              <div className="mb-3 flex justify-between items-center">
                <label className="text-sm font-medium text-yellow-400">Desired Multiplier</label>
                <motion.div 
                  className="text-xl font-bold text-yellow-400"
                  style={{ textShadow: '0 0 10px rgba(255, 204, 0, 0.7)' }}
                  animate={{
                    textShadow: [
                      '0 0 5px rgba(255, 204, 0, 0.5)',
                      '0 0 10px rgba(255, 204, 0, 0.8)',
                      '0 0 5px rgba(255, 204, 0, 0.5)'
                    ]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  {desiredMultiplier}x
                </motion.div>
              </div>
              <motion.div 
                className="p-5 rounded-xl overflow-hidden"
                style={{ 
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  border: '1px solid rgba(255, 204, 0, 0.3)',
                  boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.5)'
                }}
                animate={
                  activeSlider === 'desiredMultiplier' 
                    ? { 
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        border: '1px solid rgba(255, 204, 0, 0.5)',
                        boxShadow: 'inset 0 0 15px rgba(0, 0, 0, 0.7), 0 0 15px rgba(255, 204, 0, 0.3)'
                      } 
                    : hoverSlider === 'desiredMultiplier'
                      ? {
                          backgroundColor: 'rgba(0, 0, 0, 0.6)',
                          border: '1px solid rgba(255, 204, 0, 0.4)',
                          boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.6), 0 0 10px rgba(255, 204, 0, 0.2)'
                        }
                      : {}
                }
                transition={{ duration: 0.3 }}
              >
                {/* Animated glow effect */}
                <motion.div 
                  className="absolute inset-0 pointer-events-none rounded-xl"
                  animate={getSliderGlowVariants('#ffcc00')}
                />
                
                <div className="relative">
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={desiredMultiplier}
                    onChange={(e) => updateDesiredMultiplier(parseInt(e.target.value))}
                    onFocus={() => handleSliderFocus('desiredMultiplier')}
                    onBlur={handleSliderBlur}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: 'rgba(0, 0, 0, 0.5)',
                      boxShadow: 'inset 0 0 5px rgba(0, 0, 0, 0.5)'
                    }}
                  />
                  
                  {/* Custom track */}
                  <div 
                    className="absolute top-[9px] left-0 h-2 rounded-lg pointer-events-none"
                    style={getSliderTrackStyle(desiredMultiplier, 1, 100, '#ffcc00')}
                  />
                  
                  {/* Custom thumb */}
                  <motion.div
                    className="absolute top-0 w-5 h-5 rounded-full pointer-events-none"
                    style={{
                      left: `calc(${(desiredMultiplier - 1) / 99 * 100}% - ${(desiredMultiplier - 1) / 99 * 20}px)`,
                      backgroundColor: '#ffcc00',
                      boxShadow: '0 0 5px rgba(255, 204, 0, 0.5)'
                    }}
                    animate={getThumbVariants('#ffcc00')}
                  />
                </div>
                
                {/* Slider markers */}
                <div className="flex justify-between mt-2 px-1">
                  <span className="text-xs text-yellow-400/70">Conservative</span>
                  <span className="text-xs text-yellow-400/70">Aggressive</span>
                </div>
              </motion.div>
            </motion.div>
            
            {/* Time Horizon */}
            <motion.div 
              className="relative"
              variants={itemVariants}
              onMouseEnter={() => handleSliderHover('timeHorizon')}
              onMouseLeave={() => handleSliderHover(null)}
            >
              <div className="mb-3 flex justify-between items-center">
                <label className="text-sm font-medium text-cyan-400">Time Horizon</label>
                <motion.div 
                  className="text-xl font-bold text-cyan-400"
                  style={{ textShadow: '0 0 10px rgba(0, 255, 255, 0.7)' }}
                  animate={{
                    textShadow: [
                      '0 0 5px rgba(0, 255, 255, 0.5)',
                      '0 0 10px rgba(0, 255, 255, 0.8)',
                      '0 0 5px rgba(0, 255, 255, 0.5)'
                    ]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  {timeHorizon} {timeHorizon === 1 ? 'month' : 'months'}
                </motion.div>
              </div>
              <motion.div 
                className="p-5 rounded-xl overflow-hidden"
                style={{ 
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  border: '1px solid rgba(0, 255, 255, 0.3)',
                  boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.5)'
                }}
                animate={
                  activeSlider === 'timeHorizon' 
                    ? { 
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        border: '1px solid rgba(0, 255, 255, 0.5)',
                        boxShadow: 'inset 0 0 15px rgba(0, 0, 0, 0.7), 0 0 15px rgba(0, 255, 255, 0.3)'
                      } 
                    : hoverSlider === 'timeHorizon'
                      ? {
                          backgroundColor: 'rgba(0, 0, 0, 0.6)',
                          border: '1px solid rgba(0, 255, 255, 0.4)',
                          boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.6), 0 0 10px rgba(0, 255, 255, 0.2)'
                        }
                      : {}
                }
                transition={{ duration: 0.3 }}
              >
                {/* Animated glow effect */}
                <motion.div 
                  className="absolute inset-0 pointer-events-none rounded-xl"
                  animate={getSliderGlowVariants('#00ffff')}
                />
                
                <div className="relative">
                  <input
                    type="range"
                    min="1"
                    max="12"
                    value={timeHorizon}
                    onChange={(e) => updateTimeHorizon(parseInt(e.target.value))}
                    onFocus={() => handleSliderFocus('timeHorizon')}
                    onBlur={handleSliderBlur}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: 'rgba(0, 0, 0, 0.5)',
                      boxShadow: 'inset 0 0 5px rgba(0, 0, 0, 0.5)'
                    }}
                  />
                  
                  {/* Custom track */}
                  <div 
                    className="absolute top-[9px] left-0 h-2 rounded-lg pointer-events-none"
                    style={getSliderTrackStyle(timeHorizon, 1, 12, '#00ffff')}
                  />
                  
                  {/* Custom thumb */}
                  <motion.div
                    className="absolute top-0 w-5 h-5 rounded-full pointer-events-none"
                    style={{
                      left: `calc(${(timeHorizon - 1) / 11 * 100}% - ${(timeHorizon - 1) / 11 * 20}px)`,
                      backgroundColor: '#00ffff',
                      boxShadow: '0 0 5px rgba(0, 255, 255, 0.5)'
                    }}
                    animate={getThumbVariants('#00ffff')}
                  />
                </div>
                
                {/* Slider markers */}
                <div className="flex justify-between mt-2 px-1">
                  <span className="text-xs text-cyan-400/70">Short-term</span>
                  <span className="text-xs text-cyan-400/70">Long-term</span>
                </div>
              </motion.div>
            </motion.div>
            
            {/* Volatility Preference */}
            <motion.div 
              className="relative"
              variants={itemVariants}
              onMouseEnter={() => handleSliderHover('volatilityPreference')}
              onMouseLeave={() => handleSliderHover(null)}
            >
              <div className="mb-3 flex justify-between items-center">
                <label className="text-sm font-medium text-magenta-400">Volatility Preference</label>
                <motion.div 
                  className="text-xl font-bold text-magenta-400"
                  style={{ textShadow: '0 0 10px rgba(255, 0, 255, 0.7)' }}
                  animate={{
                    textShadow: [
                      '0 0 5px rgba(255, 0, 255, 0.5)',
                      '0 0 10px rgba(255, 0, 255, 0.8)',
                      '0 0 5px rgba(255, 0, 255, 0.5)'
                    ]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  {volatilityPreference}%
                </motion.div>
              </div>
              <motion.div 
                className="p-5 rounded-xl overflow-hidden"
                style={{ 
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  border: '1px solid rgba(255, 0, 255, 0.3)',
                  boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.5)'
                }}
                animate={
                  activeSlider === 'volatilityPreference' 
                    ? { 
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        border: '1px solid rgba(255, 0, 255, 0.5)',
                        boxShadow: 'inset 0 0 15px rgba(0, 0, 0, 0.7), 0 0 15px rgba(255, 0, 255, 0.3)'
                      } 
                    : hoverSlider === 'volatilityPreference'
                      ? {
                          backgroundColor: 'rgba(0, 0, 0, 0.6)',
                          border: '1px solid rgba(255, 0, 255, 0.4)',
                          boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.6), 0 0 10px rgba(255, 0, 255, 0.2)'
                        }
                      : {}
                }
                transition={{ duration: 0.3 }}
              >
                {/* Animated glow effect */}
                <motion.div 
                  className="absolute inset-0 pointer-events-none rounded-xl"
                  animate={getSliderGlowVariants('#ff00ff')}
                />
                
                <div className="relative">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volatilityPreference}
                    onChange={(e) => updateVolatilityPreference(parseInt(e.target.value))}
                    onFocus={() => handleSliderFocus('volatilityPreference')}
                    onBlur={handleSliderBlur}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: 'rgba(0, 0, 0, 0.5)',
                      boxShadow: 'inset 0 0 5px rgba(0, 0, 0, 0.5)'
                    }}
                  />
                  
                  {/* Custom track */}
                  <div 
                    className="absolute top-[9px] left-0 h-2 rounded-lg pointer-events-none"
                    style={getSliderTrackStyle(volatilityPreference, 0, 100, '#ff00ff')}
                  />
                  
                  {/* Custom thumb */}
                  <motion.div
                    className="absolute top-0 w-5 h-5 rounded-full pointer-events-none"
                    style={{
                      left: `calc(${(volatilityPreference / 100) * 100}% - ${(volatilityPreference / 100) * 20}px)`,
                      backgroundColor: '#ff00ff',
                      boxShadow: '0 0 5px rgba(255, 0, 255, 0.5)'
                    }}
                    animate={getThumbVariants('#ff00ff')}
                  />
                </div>
                
                {/* Slider markers */}
                <div className="flex justify-between mt-2 px-1">
                  <span className="text-xs text-magenta-400/70">Low</span>
                  <span className="text-xs text-magenta-400/70">High</span>
                </div>
              </motion.div>
            </motion.div>
            
            {/* Risk Tolerance */}
            <motion.div 
              className="relative"
              variants={itemVariants}
              onMouseEnter={() => handleSliderHover('riskTolerance')}
              onMouseLeave={() => handleSliderHover(null)}
            >
              <div className="mb-3 flex justify-between items-center">
                <label className="text-sm font-medium text-green-400">Risk Tolerance</label>
                <motion.div 
                  className="text-xl font-bold text-green-400"
                  style={{ textShadow: '0 0 10px rgba(0, 255, 128, 0.7)' }}
                  animate={{
                    textShadow: [
                      '0 0 5px rgba(0, 255, 128, 0.5)',
                      '0 0 10px rgba(0, 255, 128, 0.8)',
                      '0 0 5px rgba(0, 255, 128, 0.5)'
                    ]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  {riskTolerance}%
                </motion.div>
              </div>
              <motion.div 
                className="p-5 rounded-xl overflow-hidden"
                style={{ 
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  border: '1px solid rgba(0, 255, 128, 0.3)',
                  boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.5)'
                }}
                animate={
                  activeSlider === 'riskTolerance' 
                    ? { 
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        border: '1px solid rgba(0, 255, 128, 0.5)',
                        boxShadow: 'inset 0 0 15px rgba(0, 0, 0, 0.7), 0 0 15px rgba(0, 255, 128, 0.3)'
                      } 
                    : hoverSlider === 'riskTolerance'
                      ? {
                          backgroundColor: 'rgba(0, 0, 0, 0.6)',
                          border: '1px solid rgba(0, 255, 128, 0.4)',
                          boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.6), 0 0 10px rgba(0, 255, 128, 0.2)'
                        }
                      : {}
                }
                transition={{ duration: 0.3 }}
              >
                {/* Animated glow effect */}
                <motion.div 
                  className="absolute inset-0 pointer-events-none rounded-xl"
                  animate={getSliderGlowVariants('#00ff88')}
                />
                
                <div className="relative">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={riskTolerance}
                    onChange={(e) => updateRiskTolerance(parseInt(e.target.value))}
                    onFocus={() => handleSliderFocus('riskTolerance')}
                    onBlur={handleSliderBlur}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: 'rgba(0, 0, 0, 0.5)',
                      boxShadow: 'inset 0 0 5px rgba(0, 0, 0, 0.5)'
                    }}
                  />
                  
                  {/* Custom track */}
                  <div 
                    className="absolute top-[9px] left-0 h-2 rounded-lg pointer-events-none"
                    style={getSliderTrackStyle(riskTolerance, 0, 100, '#00ff88')}
                  />
                  
                  {/* Custom thumb */}
                  <motion.div
                    className="absolute top-0 w-5 h-5 rounded-full pointer-events-none"
                    style={{
                      left: `calc(${(riskTolerance / 100) * 100}% - ${(riskTolerance / 100) * 20}px)`,
                      backgroundColor: '#00ff88',
                      boxShadow: '0 0 5px rgba(0, 255, 128, 0.5)'
                    }}
                    animate={getThumbVariants('#00ff88')}
                  />
                </div>
                
                {/* Slider markers */}
                <div className="flex justify-between mt-2 px-1">
                  <span className="text-xs text-green-400/70">Low</span>
                  <span className="text-xs text-green-400/70">High</span>
                </div>
              </motion.div>
            </motion.div>
            
            {/* Investment Amount */}
            <motion.div 
              className="mt-4"
              variants={itemVariants}
            >
              <div className="mb-3 flex justify-between items-center">
                <label className="text-sm font-medium text-blue-400">Investment Amount</label>
                <motion.div 
                  className="text-xl font-bold text-blue-400"
                  style={{ textShadow: '0 0 10px rgba(0, 100, 255, 0.7)' }}
                  animate={{
                    textShadow: [
                      '0 0 5px rgba(0, 100, 255, 0.5)',
                      '0 0 10px rgba(0, 100, 255, 0.8)',
                      '0 0 5px rgba(0, 100, 255, 0.5)'
                    ]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  ${formattedInvestmentAmount}
                </motion.div>
              </div>
              <motion.div 
                className="relative p-5 rounded-xl overflow-hidden"
                style={{ 
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  border: '1px solid rgba(0, 100, 255, 0.3)',
                  boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.5)'
                }}
                whileHover={{ 
                  boxShadow: '0 0 15px rgba(0, 100, 255, 0.3), inset 0 0 10px rgba(0, 0, 0, 0.5)',
                  border: '1px solid rgba(0, 100, 255, 0.5)',
                  transition: { duration: 0.3 }
                }}
              >
                {/* Glow effect */}
                <motion.div 
                  className="absolute inset-0 pointer-events-none rounded-xl"
                  animate={{
                    boxShadow: [
                      'inset 0 0 5px rgba(0, 100, 255, 0.1)',
                      'inset 0 0 15px rgba(0, 100, 255, 0.2)',
                      'inset 0 0 5px rgba(0, 100, 255, 0.1)'
                    ]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                />
                
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span className="text-blue-400 text-lg font-bold" style={{ textShadow: '0 0 5px rgba(0, 100, 255, 0.7)' }}>$</span>
                  </div>
                  <input
                    type="text"
                    value={investmentAmount}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '');
                      updateInvestmentAmount(value);
                    }}
                    className="w-full pl-8 pr-3 py-3 bg-black/30 border border-blue-500/30 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    style={{
                      backdropFilter: 'blur(5px)',
                      boxShadow: 'inset 0 0 10px rgba(0, 100, 255, 0.2)'
                    }}
                  />
                  
                  {/* Animated border glow */}
                  <motion.div
                    className="absolute inset-0 rounded-lg pointer-events-none"
                    animate={{
                      boxShadow: [
                        'inset 0 0 5px rgba(0, 100, 255, 0.2)',
                        'inset 0 0 10px rgba(0, 100, 255, 0.4)',
                        'inset 0 0 5px rgba(0, 100, 255, 0.2)'
                      ]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  />
                </div>
              </motion.div>
            </motion.div>

            {/* Submit Button */}
            <motion.div 
              className="mt-8"
              variants={itemVariants}
            >
              <motion.button
                onClick={handleSubmit}
                className="w-full py-4 rounded-xl text-white font-bold relative overflow-hidden"
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  border: '1px solid rgba(0, 255, 255, 0.3)',
                  boxShadow: '0 0 15px rgba(0, 255, 255, 0.2)'
                }}
                whileHover={{
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  border: '1px solid rgba(0, 255, 255, 0.6)',
                  boxShadow: '0 0 25px rgba(0, 255, 255, 0.4), inset 0 0 15px rgba(0, 255, 255, 0.2)',
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Button gradient background */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-cyan-500/20"
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
                
                {/* Button scan line */}
                <motion.div
                  className="absolute inset-0 overflow-hidden"
                  style={{ opacity: 0.3 }}
                >
                  <motion.div
                    className="absolute left-0 right-0 h-[2px] bg-cyan-400"
                    style={{ boxShadow: '0 0 5px #00ffff, 0 0 10px #00ffff' }}
                    animate={{ top: ['-10%', '110%'] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  />
                </motion.div>
                
                {/* Button text */}
                <motion.span 
                  className="relative z-10 tracking-wider text-lg"
                  style={{ textShadow: '0 0 10px rgba(0, 255, 255, 0.7)' }}
                  animate={{
                    textShadow: [
                      '0 0 5px rgba(0, 255, 255, 0.5)',
                      '0 0 15px rgba(0, 255, 255, 0.8)',
                      '0 0 5px rgba(0, 255, 255, 0.5)'
                    ]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  GENERATE PORTFOLIO
                </motion.span>
              </motion.button>
              
              {/* Animated text below button */}
              <motion.div
                className="text-center mt-4 text-xs text-cyan-400/70"
                animate={{ 
                  opacity: [0.5, 0.8, 0.5],
                  textShadow: [
                    '0 0 2px rgba(0, 255, 255, 0.3)',
                    '0 0 4px rgba(0, 255, 255, 0.5)',
                    '0 0 2px rgba(0, 255, 255, 0.3)'
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                Quantum algorithm will optimize your portfolio based on parameters
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </NeonBackground>
    </motion.div>
  );
}
