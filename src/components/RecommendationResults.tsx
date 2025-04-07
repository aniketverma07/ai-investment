'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import Image from 'next/image';
import html2canvas from 'html2canvas';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface CryptoData {
  name: string;
  symbol: string;
  price?: number;
  marketCap?: number;
  volume?: number;
  riskScore?: number;
  volatilityScore?: number;
  moonshotScore?: number;
  overallScore?: number;
  allocation: number;
  amount?: string;
  color?: string;
  matchScore?: number;
  volatility?: number;
  risk?: number;
  moonshot?: string;
  expectedReturn?: number;
}

interface RecommendationResultsProps {
  cryptoData: CryptoData[];
  investmentAmount: string;
  isLoading: boolean;
  onStartOver: () => void;
  riskTolerance: number;
  volatilityPreference: number;
  moonshotRate: number;
  timeHorizon: number;
}

export default function RecommendationResults({ 
  cryptoData, 
  investmentAmount, 
  isLoading,
  onStartOver,
  riskTolerance,
  volatilityPreference,
  moonshotRate,
  timeHorizon
}: RecommendationResultsProps) {
  const [adjustedCryptoData, setAdjustedCryptoData] = useState<CryptoData[]>([]);
  const [activeAsset, setActiveAsset] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  
  const investmentAmountNum = parseFloat(investmentAmount.replace(/[^0-9.]/g, ''));
  
  useEffect(() => {
    if (cryptoData.length > 0) {
      console.log("Processing crypto data for charts:", cryptoData);
      
      // Calculate total allocation
      const total = cryptoData.reduce((sum, coin) => sum + coin.allocation, 0);
      
      // Adjust allocations to ensure they sum to 100%
      const adjusted = cryptoData.map(coin => ({
        ...coin,
        allocation: Math.round((coin.allocation / total) * 100)
      }));
      
      console.log("Adjusted crypto data:", adjusted);
      setAdjustedCryptoData(adjusted);
    } else {
      console.warn("No crypto data received in RecommendationResults");
    }
  }, [cryptoData]);

  // Function to calculate investment amount for each crypto
  const calculateInvestmentAmount = (totalAmount: string, allocation: number): string => {
    const totalInvestment = parseFloat(totalAmount.replace(/[^0-9.]/g, ''));
    const amount = (allocation / 100) * totalInvestment;
    return amount.toLocaleString('en-US', { maximumFractionDigits: 2 });
  };

  // Add expected return to each crypto if not present
  const enhancedCryptoData = adjustedCryptoData.map(crypto => {
    // If expectedReturn is not present, calculate it based on risk and moonshot
    if (!crypto.expectedReturn) {
      const baseReturn = 5; // Base return percentage
      const riskMultiplier = crypto.risk ? (crypto.risk / 10) * 15 : 10; // Higher risk, higher potential return
      const expectedReturn = baseReturn + riskMultiplier;
      return { ...crypto, expectedReturn: Math.round(expectedReturn) };
    }
    return crypto;
  });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  // Card hover variants
  const cardHoverVariants = {
    hover: {
      scale: 1.03,
      boxShadow: "0 0 25px rgba(0, 255, 255, 0.5)",
      transition: { duration: 0.3 }
    }
  };
  
  // Function to get user preference text
  const getUserPreferenceText = (value: number, type: string): string => {
    if (type === 'risk') {
      if (value < 33) return 'Conservative';
      if (value < 66) return 'Moderate';
      return 'Aggressive';
    }
    
    if (type === 'volatility') {
      if (value < 33) return 'Low';
      if (value < 66) return 'Medium';
      return 'High';
    }
    
    if (type === 'moonshot') {
      if (value < 5) return 'Conservative';
      if (value < 15) return 'Moderate';
      return 'Aggressive';
    }
    
    return '';
  };
  
  // Format time horizon
  const formattedTimeHorizon = `${timeHorizon} ${timeHorizon === 1 ? 'Month' : 'Months'}`;
  
  // Calculate total expected return
  const totalExpectedReturn = Math.round(
    enhancedCryptoData.length > 0
    ? enhancedCryptoData.reduce((sum, crypto) => {
        return sum + ((crypto.expectedReturn || 0) * crypto.allocation / 100);
      }, 0)
    : 0
  );
  
  // Function to generate and download portfolio as image
  const generatePortfolio = async () => {
    try {
      setIsGenerating(true);
      
      const portfolioElement = document.getElementById('portfolio-container');
      if (!portfolioElement) {
        console.error('Portfolio container element not found');
        setIsGenerating(false);
        return;
      }
      
      const canvas = await html2canvas(portfolioElement, {
        scale: 2,
        backgroundColor: '#0a192f',
        logging: true,
      });
      
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `AI-Investment-Portfolio-${new Date().toISOString().split('T')[0]}.png`;
      link.click();
      
      setIsGenerating(false);
    } catch (error) {
      console.error('Error generating portfolio:', error);
      setIsGenerating(false);
    }
  };

  return (
    <motion.div 
      className="min-h-screen w-full py-12 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        background: 'radial-gradient(circle at center, #0a192f 0%, #020c1b 100%)'
      }}
    >
      <div className="max-w-6xl mx-auto" id="portfolio-container">
        <motion.div 
          className="text-center mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 
            className="text-4xl font-bold mb-4"
            variants={itemVariants}
            style={{ 
              color: '#00ffff',
              textShadow: '0 0 15px rgba(0, 255, 255, 0.5)'
            }}
          >
            Your Optimized Portfolio
          </motion.h1>
          
          <motion.div 
            className="text-white/70 text-lg mb-8"
            variants={itemVariants}
          >
            Based on your investment preferences and our AI analysis
          </motion.div>
          
          {/* User preferences summary */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 max-w-3xl mx-auto"
            variants={itemVariants}
          >
            <div className="bg-black/40 p-4 rounded-lg border border-cyan-500/30">
              <div className="text-white/60 text-sm">Investment</div>
              <div className="text-cyan-400 text-xl font-medium">{investmentAmount}</div>
            </div>
            
            <div className="bg-black/40 p-4 rounded-lg border border-cyan-500/30">
              <div className="text-white/60 text-sm">Risk Profile</div>
              <div className="text-cyan-400 text-xl font-medium">{getUserPreferenceText(riskTolerance, 'risk')}</div>
            </div>
            
            <div className="bg-black/40 p-4 rounded-lg border border-cyan-500/30">
              <div className="text-white/60 text-sm">Volatility</div>
              <div className="text-cyan-400 text-xl font-medium">{getUserPreferenceText(volatilityPreference, 'volatility')}</div>
            </div>
            
            <div className="bg-black/40 p-4 rounded-lg border border-cyan-500/30">
              <div className="text-white/60 text-sm">Time Horizon</div>
              <div className="text-cyan-400 text-xl font-medium">{timeHorizon} {timeHorizon === 1 ? 'month' : 'months'}</div>
            </div>
          </motion.div>
          
          {/* Portfolio allocation */}
          <motion.div
            className="mb-16"
            variants={containerVariants}
          >
            <motion.h2 
              className="text-2xl font-semibold mb-6 text-white"
              variants={itemVariants}
            >
              Recommended Asset Allocation
            </motion.h2>
            
            {/* Portfolio cards */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto"
              variants={containerVariants}
            >
              {enhancedCryptoData.map((crypto, index) => (
                <motion.div
                  key={crypto.symbol}
                  className="bg-black/50 backdrop-blur-sm rounded-xl overflow-hidden border border-cyan-500/20"
                  variants={itemVariants}
                  whileHover={cardHoverVariants.hover}
                  onMouseEnter={() => setActiveAsset(crypto.symbol)}
                  onMouseLeave={() => setActiveAsset(null)}
                  style={{
                    boxShadow: activeAsset === crypto.symbol 
                      ? `0 0 30px ${crypto.color || '#00ffff'}40` 
                      : '0 0 15px rgba(0, 255, 255, 0.1)'
                  }}
                >
                  {/* Card header with gradient */}
                  <div 
                    className="h-2 w-full"
                    style={{ 
                      background: `linear-gradient(90deg, ${crypto.color || '#00ffff'}, transparent)`,
                      boxShadow: `0 0 10px ${crypto.color || '#00ffff'}80`
                    }}
                  />
                  
                  <div className="p-6">
                    {/* Crypto name and symbol */}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white">{crypto.name}</h3>
                        <div className="text-cyan-400/80 text-sm">{crypto.symbol}</div>
                      </div>
                      <div 
                        className="text-2xl font-bold"
                        style={{ color: crypto.color || '#00ffff' }}
                      >
                        {crypto.allocation}%
                      </div>
                    </div>
                    
                    {/* Investment amount */}
                    <div className="mb-4">
                      <div className="text-white/60 text-sm mb-1">Investment Amount</div>
                      <div className="text-white text-lg font-medium">
                        ${calculateInvestmentAmount(investmentAmount, crypto.allocation)}
                      </div>
                    </div>
                    
                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <div className="bg-black/30 p-2 rounded">
                        <div className="text-white/50 text-xs">Risk</div>
                        <div className="text-white text-sm">{crypto.risk ? crypto.risk.toFixed(1) : 'N/A'}/10</div>
                      </div>
                      
                      <div className="bg-black/30 p-2 rounded">
                        <div className="text-white/50 text-xs">Volatility</div>
                        <div className="text-white text-sm">{crypto.volatility ? crypto.volatility.toFixed(1) : 'N/A'}/10</div>
                      </div>
                      
                      <div className="bg-black/30 p-2 rounded">
                        <div className="text-white/50 text-xs">Growth</div>
                        <div className="text-white text-sm">{crypto.expectedReturn}%</div>
                      </div>
                    </div>
                    
                    {/* Animated indicator */}
                    <div className="relative h-1 bg-white/10 rounded overflow-hidden">
                      <motion.div
                        className="absolute h-full rounded"
                        style={{ 
                          background: `linear-gradient(90deg, ${crypto.color || '#00ffff'}, transparent)`,
                          width: `${crypto.allocation}%`
                        }}
                        animate={{
                          opacity: [0.6, 1, 0.6]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
          
          {/* Portfolio summary */}
          <motion.div
            className="bg-black/40 backdrop-blur-md rounded-2xl border border-cyan-500/30 p-8 max-w-3xl mx-auto"
            variants={itemVariants}
            style={{
              boxShadow: '0 0 30px rgba(0, 255, 255, 0.1)'
            }}
          >
            <h3 className="text-2xl font-semibold mb-6 text-white">Portfolio Summary</h3>
            
            <div className="grid grid-cols-3 gap-8">
              {/* Total Assets */}
              <div>
                <h5 className="text-sm text-white/70 mb-2">Total Assets</h5>
                <div className="relative h-32 flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      className="w-24 h-24 rounded-full"
                      style={{ 
                        background: 'conic-gradient(#00ffff 0%, transparent 70%)',
                        opacity: 0.3
                      }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    />
                  </div>
                  <div className="z-10 text-center">
                    <motion.div 
                      className="text-3xl font-bold" 
                      style={{ color: '#00ffff' }}
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {enhancedCryptoData.length}
                    </motion.div>
                    <div className="text-xs text-white/70">cryptocurrencies</div>
                  </div>
                </div>
              </div>
              
              {/* Risk Score */}
              <div>
                <h5 className="text-sm text-white/70 mb-2">Risk Score</h5>
                <div className="relative h-32 flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      className="w-24 h-24 rounded-full"
                      style={{ 
                        background: 'conic-gradient(#ff00ff 0%, transparent 70%)',
                        opacity: 0.3
                      }}
                      animate={{ rotate: -360 }}
                      transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    />
                  </div>
                  <div className="z-10 text-center">
                    <motion.div 
                      className="text-3xl font-bold" 
                      style={{ color: '#ff00ff' }}
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                    >
                      {riskTolerance / 10}
                    </motion.div>
                    <div className="text-xs text-white/70">out of 10</div>
                  </div>
                </div>
              </div>
              
              {/* Moonshot Potential */}
              <div>
                <h5 className="text-sm text-white/70 mb-2">Growth Potential</h5>
                <div className="relative h-32 flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      className="w-24 h-24 rounded-full"
                      style={{ 
                        background: 'conic-gradient(#00ffff 0%, transparent 70%)',
                        opacity: 0.3
                      }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                    />
                  </div>
                  <div className="z-10 text-center">
                    <motion.div 
                      className="text-3xl font-bold" 
                      style={{ color: '#00ffff' }}
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                    >
                      {totalExpectedReturn}%
                    </motion.div>
                    <div className="text-xs text-white/70">annual return</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Action buttons */}
          <motion.div 
            className="flex justify-center gap-4 mt-12"
            variants={itemVariants}
          >
            <button
              onClick={generatePortfolio}
              disabled={isGenerating}
              className="px-8 py-4 rounded-full font-medium transition-all duration-300 transform hover:scale-105 flex items-center"
              style={{
                background: 'black',
                border: '2px solid #00ffff',
                color: '#00ffff',
                boxShadow: '0 0 20px #00ffff',
                textShadow: '0 0 10px #00ffff',
                opacity: isGenerating ? 0.7 : 1,
                cursor: isGenerating ? 'wait' : 'pointer'
              }}
            >
              <svg className="w-5 h-5 mr-3 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              {isGenerating ? 'Generating...' : 'Generate Portfolio'}
            </button>
            
            <button
              onClick={onStartOver}
              className="px-8 py-4 rounded-full font-medium transition-all duration-300 transform hover:scale-105 flex items-center"
              style={{
                background: 'black',
                border: '2px solid #00ffff',
                color: '#00ffff',
                boxShadow: '0 0 20px #00ffff',
                textShadow: '0 0 10px #00ffff'
              }}
            >
              <svg className="w-5 h-5 mr-3 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1020.945 13H11V3.055z" />
              </svg>
              Start Over
            </button>
          </motion.div>
        </motion.div>
        
        {/* Add keyframe animation for pulse effect */}
        <style jsx>{`
          @keyframes pulse {
            0% { opacity: 0.7; }
            50% { opacity: 1; }
            100% { opacity: 0.7; }
          }
          
          @keyframes scanline {
            0% { transform: rotate(45deg) translateX(-100%); }
            100% { transform: rotate(45deg) translateX(100%); }
          }
          
          @keyframes scanlineReverse {
            0% { transform: rotate(-45deg) translateX(100%); }
            100% { transform: rotate(-45deg) translateX(-100%); }
          }
          
          @keyframes glow {
            0% { box-shadow: 0 0 5px #00ffff; }
            50% { box-shadow: 0 0 15px #00ffff, 0 0 30px #00ffff; }
            100% { box-shadow: 0 0 5px #00ffff; }
          }
          
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0px); }
          }
          
          .transform-style-preserve-3d {
            transform-style: preserve-3d;
          }
          
          .perspective-[1200px] {
            perspective: 1200px;
          }
        `}</style>
      </div>
    </motion.div>
  );
}
