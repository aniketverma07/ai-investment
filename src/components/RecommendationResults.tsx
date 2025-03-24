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
  price: number;
  marketCap: number;
  volume: number;
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
  moonshot?: number;
}

interface RecommendationResultsProps {
  cryptoData: CryptoData[];
  investmentAmount: string;
  isLoading: boolean;
  onStartOver: () => void;
}

export default function RecommendationResults({ 
  cryptoData, 
  investmentAmount, 
  isLoading,
  onStartOver
}: RecommendationResultsProps) {
  const [totalAllocation, setTotalAllocation] = useState<number>(0);
  const [chartData, setChartData] = useState<{
    labels: string[];
    datasets: [{
      data: number[];
      backgroundColor: string[];
      borderColor: string[];
      borderWidth: number;
    }]
  }>({
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [],
      borderColor: [],
      borderWidth: 1,
    }]
  });
  
  const [potentialReturnsData, setPotentialReturnsData] = useState<{
    labels: string[];
    datasets: [{
      label: string;
      data: number[];
      backgroundColor: string[];
    }]
  }>({
    labels: [],
    datasets: [{
      label: 'Potential Return ($)',
      data: [],
      backgroundColor: [],
    }]
  });
  
  const [particles, setParticles] = useState<Array<{
    top: string;
    left: string;
    duration: number;
    delay: number;
  }>>([]);
  
  // Only generate particles on client-side to avoid hydration errors
  useEffect(() => {
    const particlesArray = Array.from({ length: 20 }, () => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      duration: 3 + Math.random() * 7,
      delay: Math.random() * 5
    }));
    setParticles(particlesArray);
  }, []);
  
  const investmentAmountNum = parseFloat(investmentAmount.replace(/,/g, ''));
  
  useEffect(() => {
    if (cryptoData.length > 0) {
      console.log("Processing crypto data for charts:", cryptoData);
      
      // Calculate total allocation
      const total = cryptoData.reduce((sum, coin) => sum + coin.allocation, 0);
      setTotalAllocation(total);
      
      // Prepare chart data
      const labels = cryptoData.map(coin => coin.symbol);
      const data = cryptoData.map(coin => coin.allocation);
      
      // Generate colors for the chart with primary color variations
      const backgroundColors = [
        'rgba(139, 92, 246, 0.9)',   // primary
        'rgba(139, 92, 246, 0.8)',   // primary lighter
        'rgba(139, 92, 246, 0.7)',   // primary even lighter
        'rgba(167, 139, 250, 0.9)',  // primary-light
        'rgba(167, 139, 250, 0.8)',  // primary-light lighter
        'rgba(167, 139, 250, 0.7)',  // primary-light even lighter
        'rgba(124, 58, 237, 0.9)',   // primary-dark
        'rgba(124, 58, 237, 0.8)'    // primary-dark lighter
      ];
      
      const borderColors = backgroundColors.map(color => color.replace(/[0-9].[0-9]/, '1'));
      
      // Ensure we have enough colors for all coins
      while (backgroundColors.length < cryptoData.length) {
        backgroundColors.push(...backgroundColors);
        borderColors.push(...borderColors);
      }
      
      setChartData({
        labels,
        datasets: [{
          data,
          backgroundColor: backgroundColors.slice(0, cryptoData.length),
          borderColor: borderColors.slice(0, cryptoData.length),
          borderWidth: 1,
        }]
      });
      
      // Prepare potential returns data
      const potentialReturns = cryptoData.map(coin => {
        const coinInvestment = (coin.allocation / 100) * investmentAmountNum;
        
        // Use the moonshotScore to determine the multiplier
        let moonshotMultiplier = 1;
        
        if (coin.moonshotScore && coin.moonshotScore <= 30) {
          moonshotMultiplier = 1.5;
        } else if (coin.moonshotScore && coin.moonshotScore <= 70) {
          moonshotMultiplier = 3;
        } else if (coin.moonshotScore) {
          moonshotMultiplier = 5;
        }
        
        return coinInvestment * moonshotMultiplier;
      });
      
      setPotentialReturnsData({
        labels,
        datasets: [{
          label: 'Potential Return ($)',
          data: potentialReturns,
          backgroundColor: backgroundColors.slice(0, cryptoData.length),
        }]
      });
    }
  }, [cryptoData, investmentAmount]);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };
  
  if (isLoading) {
    return null;
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0f1a] to-[#1a1a2e] text-white p-6">
      <motion.div
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="text-center mb-6"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white">Your AI-Optimized Portfolio</h2>
          <p className="text-white/70">Based on your investment preferences and risk tolerance</p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
          variants={itemVariants}
        >
          <div className="bg-[#1a1a2e]/80 backdrop-blur-sm p-6 rounded-xl border border-white/10 shadow-xl">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Allocation Breakdown
            </h2>
            <div className="h-64 relative">
              <Pie 
                data={{
                  labels: cryptoData.map(coin => coin.name),
                  datasets: [
                    {
                      data: cryptoData.map(coin => coin.allocation),
                      backgroundColor: [
                        '#8a5cf6', // Primary purple
                        '#a78bfa',
                        '#c4b5fd',
                        '#ddd6fe',
                        '#ede9fe',
                        '#f5f3ff',
                        '#7c3aed',
                        '#6d28d9',
                      ],
                      borderColor: 'rgba(0, 0, 0, 0.1)',
                      borderWidth: 1,
                    },
                  ],
                }}
                options={{
                  plugins: {
                    legend: {
                      position: 'right',
                      labels: {
                        color: 'rgba(255, 255, 255, 0.7)',
                        font: {
                          size: 12
                        },
                        boxWidth: 15,
                        padding: 10
                      }
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          const label = context.label || '';
                          const value = context.raw as number;
                          const percentage = value + '%';
                          return `${label}: ${percentage}`;
                        }
                      }
                    }
                  },
                  cutout: '60%',
                  animation: {
                    animateRotate: true,
                    animateScale: true,
                    duration: 2000
                  },
                  responsive: true,
                  maintainAspectRatio: false
                }}
              />
            </div>
          </div>
          
          <div className="bg-[#1a1a2e]/80 backdrop-blur-sm p-6 rounded-xl border border-white/10 shadow-xl">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              Potential Returns
            </h2>
            <div className="h-64 relative">
              <Bar 
                data={{
                  labels: cryptoData.map(coin => coin.symbol),
                  datasets: [
                    {
                      label: 'Potential Return ($)',
                      data: cryptoData.map(coin => {
                        const coinInvestment = (coin.allocation / 100) * investmentAmountNum;
                        let moonshotMultiplier = 1;
                        if (coin.moonshotScore && coin.moonshotScore <= 30) {
                          moonshotMultiplier = 1.5;
                        } else if (coin.moonshotScore && coin.moonshotScore <= 70) {
                          moonshotMultiplier = 3;
                        } else if (coin.moonshotScore) {
                          moonshotMultiplier = 5;
                        }
                        return coinInvestment * moonshotMultiplier;
                      }),
                      backgroundColor: '#8a5cf6',
                      borderColor: 'rgba(0, 0, 0, 0.1)',
                      borderWidth: 1,
                    }
                  ]
                }}
                options={{
                  plugins: {
                    legend: {
                      display: false
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          return `$${(context.raw as number).toFixed(2)}`;
                        }
                      }
                    }
                  },
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    x: {
                      grid: {
                        color: 'rgba(255, 255, 255, 0.05)',
                      },
                      ticks: {
                        color: 'rgba(255, 255, 255, 0.7)'
                      }
                    },
                    y: {
                      grid: {
                        color: 'rgba(255, 255, 255, 0.05)',
                      },
                      ticks: {
                        color: 'rgba(255, 255, 255, 0.7)',
                        callback: function(value) {
                          return '$' + value;
                        }
                      }
                    }
                  },
                  animation: {
                    duration: 2000
                  }
                }}
              />
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="mb-12"
          variants={itemVariants}
        >
          <h2 className="text-lg font-semibold text-white mb-6 flex items-center">
            <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Recommended Investments
          </h2>
          
          <div className="grid grid-cols-1 gap-4">
            {cryptoData.map((coin, index) => {
              const coinInvestment = (coin.allocation / 100) * investmentAmountNum;
              return (
                <motion.div
                  key={index}
                  className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 hover:bg-white/10 transition-colors duration-150"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <div className="flex flex-col space-y-4">
                    {/* Coin Info and Investment */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center mr-3 shadow-md shadow-primary/20">
                          <span className="text-sm font-bold text-white">{coin.symbol.charAt(0)}</span>
                        </div>
                        <div>
                          <div className="text-lg font-medium text-white">{coin.name}</div>
                          <div className="text-sm text-white/60">{coin.symbol}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-white/70">Investment</div>
                        <div className="text-base text-white font-medium">${coinInvestment.toFixed(2)}</div>
                      </div>
                    </div>
                    
                    {/* Allocation */}
                    <div className="flex flex-col">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-white/70">Allocation</span>
                        <span className="text-sm font-medium text-white">{coin.allocation}%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                        <div 
                          className="h-full bg-primary"
                          style={{ width: `${coin.allocation}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    {/* Ratings */}
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <div className="text-xs text-white/70 mb-1">Risk</div>
                        <div className="inline-flex items-center px-2 py-1 rounded-md bg-red-500/20 text-red-400 text-xs font-medium">
                          <span className="mr-1">🔥</span>
                          High
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-white/70 mb-1">Volatility</div>
                        <div className="inline-flex items-center px-2 py-1 rounded-md bg-orange-500/20 text-orange-400 text-xs font-medium">
                          <span className="mr-1">🎢</span>
                          High
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-white/70 mb-1">Moonshot</div>
                        <div className="inline-flex items-center px-2 py-1 rounded-md bg-pink-500/20 text-pink-400 text-xs font-medium">
                          <span className="mr-1">🚀</span>
                          High
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
        
        <motion.div 
          className="flex justify-center mt-8"
          variants={itemVariants}
        >
          <button
            onClick={onStartOver}
            className="inline-flex items-center px-6 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-full shadow-lg shadow-primary/20 transition-all duration-200 transform hover:scale-105"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1020.945 13H11V3.055z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Start Over
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
