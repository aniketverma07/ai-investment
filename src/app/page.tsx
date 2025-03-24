'use client';

import { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import Papa from 'papaparse';
import LoadingAnimation from '@/components/LoadingAnimation';
import RecommendationResults from '@/components/RecommendationResults';
import Image from 'next/image';

interface FormInputs {
  investmentAmount: string;
  riskTolerance: string;
  volatilityPreference: string;
  moonshotRate: string;
}

interface AccessCodeInputs {
  accessCode: string;
}

interface CryptoData {
  name: string;
  symbol?: string;
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
}

// Define interface for CSV parsing results
interface CsvData {
  Coin: string;
  Volatility: string;
  Risk: string;
  'Moonshot Score': string;
  [key: string]: string;
}

interface RecommendationResultsProps {
  cryptoData: {
    name: string;
    symbol?: string;
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
  }[];
  investmentAmount: string;
  isLoading: boolean;
  onStartOver: () => void;
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [progress, setProgress] = useState(0);
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [usageCount, setUsageCount] = useState<number>(0);
  const [showAccessCodeInput, setShowAccessCodeInput] = useState<boolean>(false);
  const [hasAccessCode, setHasAccessCode] = useState<boolean>(false);

  const { register, handleSubmit, watch, formState: { errors }, setValue } = useForm<FormInputs>({
    defaultValues: {
      investmentAmount: '1000',
      riskTolerance: '5',
      volatilityPreference: '5',
      moonshotRate: '5'
    }
  });
  
  const accessCodeForm = useForm<AccessCodeInputs>();
  
  // Load usage count from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCount = localStorage.getItem('xoracle_usage_count');
      if (savedCount) {
        setUsageCount(parseInt(savedCount, 10));
      }
    }
  }, []);
  
  const watchInvestmentAmount = watch('investmentAmount');
  const watchRiskTolerance = watch('riskTolerance');
  const watchVolatilityPreference = watch('volatilityPreference');
  const watchMoonshotRate = watch('moonshotRate');
  
  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 4));
  };
  
  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };
  
  const handleFormSubmit: SubmitHandler<FormInputs> = async (data) => {
    // Check if user has exceeded usage limit
    if (usageCount >= 3) {
      setShowAccessCodeInput(true);
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Increment usage count
      const newCount = usageCount + 1;
      setUsageCount(newCount);
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('xoracle_usage_count', newCount.toString());
      }
      
      // Process the data from the form
      const { investmentAmount, riskTolerance, volatilityPreference, moonshotRate } = data;
      setInvestmentAmount(investmentAmount);
      
      // Process the CSV data immediately in the background
      fetchCryptoData(
        parseFloat(investmentAmount),
        parseInt(riskTolerance),
        parseInt(volatilityPreference),
        parseInt(moonshotRate)
      )
      .then(processedData => {
        if (processedData && processedData.length > 0) {
          setCryptoData(processedData);
          // Loading animation will handle the timing and call handleLoadingComplete
        } else {
          console.error("Error: No valid data returned from CSV processing");
          setIsLoading(false);
          // Show an error message to the user
          alert("We couldn't process your investment data. Please try again.");
        }
      })
      .catch(error => {
        console.error("Error processing data:", error);
        setIsLoading(false);
        // Show an error message to the user
        alert("An error occurred while analyzing your investment preferences. Please try again.");
      });
      
    } catch (error) {
      console.error("Error processing data:", error);
      setIsLoading(false);
      // Show an error message to the user
      alert("An unexpected error occurred. Please try again.");
    }
  };
  
  const handleAccessCodeSubmit: SubmitHandler<AccessCodeInputs> = (data) => {
    // Check if access code is valid (you can replace this with your actual codes)
    const validCodes = ['XORACLE2025', 'CRYPTO2025', 'MOONSHOT2025'];
    
    if (validCodes.includes(data.accessCode.toUpperCase())) {
      // Set temporary access for this session
      setHasAccessCode(true);
      setShowAccessCodeInput(false);
      
      // Reset usage count to 0 to give them 3 more tries
      setUsageCount(0);
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('xoracle_usage_count', '0');
      }
      
      // Continue with form submission
      handleFormSubmit(watch());
    } else {
      alert('Invalid access code. Please try again or contact support.');
    }
  };
  
  const handleLoadingComplete = () => {
    setLoadingComplete(true);
    setIsLoading(false);
  };
  
  // Process the CSV data and apply user preferences
  const fetchCryptoData = async (
    investmentAmount: number,
    riskTolerance: number,
    volatilityPreference: number,
    moonshotRate: number
  ): Promise<CryptoData[]> => {
    const riskLevel = riskTolerance;
    const volatilityLevel = volatilityPreference;
    const moonshotLevel = moonshotRate;
    const amount = investmentAmount;
    
    // Store previous results to ensure variety on repeated attempts
    const previousResults = sessionStorage.getItem('previous_portfolios');
    const previousPortfolios = previousResults ? JSON.parse(previousResults) : [];
    
    // Add randomization factor that increases with each attempt
    const attemptCount = usageCount;
    const randomFactor = Math.random() * 0.3 * (attemptCount + 1); // Randomization increases with each attempt
    
    try {
      // Fetch the CSV data from the new file
      const response = await fetch('/advanced_crypto_data.csv');
      const csvText = await response.text();
      
      // Parse CSV
      return new Promise((resolve) => {
        Papa.parse<CsvData>(csvText, {
          header: true,
          complete: (results) => {
            // Check if we have valid data
            if (!results.data || results.data.length === 0) {
              console.error('No valid data found in CSV');
              resolve([]);
              return;
            }
            
            // Filter and score coins based on user preferences
            let allCoins = results.data
              .filter(row => row.Coin && row.Volatility && row.Risk && row['Moonshot Score']) // Ensure all required fields exist
              .map(row => {
                // Extract numeric values
                const coinVolatility = parseInt(row.Volatility) || 0;
                const coinRisk = parseInt(row.Risk) || 0;
                const coinMoonshot = row['Moonshot Score'] || '0x'; // Keep the 'x' for display
                
                // Calculate match score based on user preferences
                let matchScore = 0;
                
                // Risk tolerance match (higher is better)
                const riskMatch = 10 - Math.abs(riskLevel - coinRisk);
                matchScore += riskMatch * 2;
                
                // Volatility preference match (higher is better)
                const volatilityMatch = 10 - Math.abs(volatilityLevel - coinVolatility / 10);
                matchScore += volatilityMatch * 2;
                
                // Moonshot preference match (higher is better)
                let moonshotMatch = 0;
                const moonshotValue = parseInt(coinMoonshot.replace('x', '')) || 0;
                if (moonshotLevel <= 3 && moonshotValue <= 3) moonshotMatch = 10;
                else if (moonshotLevel <= 7 && moonshotValue <= 7) moonshotMatch = 10;
                else if (moonshotLevel > 7 && moonshotValue >= 7) moonshotMatch = 10;
                else moonshotMatch = 5 - Math.abs(moonshotLevel - moonshotValue);
                
                matchScore += moonshotMatch * 2;
                
                // Add randomization to ensure variety in results
                matchScore += (Math.random() * 10 * randomFactor);
                
                // Ensure previously shown coins get lower scores on repeat attempts
                if (previousPortfolios.some((portfolio: CryptoData[]) => 
                  portfolio.some(coin => coin.name === row.Coin))) {
                  matchScore *= (0.7 - (0.1 * attemptCount)); // Reduce score for previously shown coins
                }
                
                // Parse coin name and symbol from the Coin field (e.g., "Bitcoin (BTC)")
                const coinNameMatch = row.Coin.match(/(.+) \(([A-Z0-9]+)\)/);
                let name = row.Coin;
                let symbol = '';
                
                if (coinNameMatch && coinNameMatch.length >= 3) {
                  name = coinNameMatch[1].trim();
                  symbol = coinNameMatch[2].trim();
                } else {
                  // If the format doesn't match, just use the whole string as name
                  name = row.Coin;
                  symbol = row.Coin.substring(0, 3).toUpperCase(); // Use first 3 chars as symbol
                }
                
                // Generate a random price based on the coin's scores
                const price = 100 / (coinVolatility * 0.1 + 1) * (1 + (Math.random() - 0.5) * 0.2);
                const marketCap = price * (1000000 + Math.random() * 10000000);
                const volume = marketCap * (0.1 + Math.random() * 0.4);
                
                return {
                  name,
                  symbol,
                  price,
                  marketCap,
                  volume,
                  matchScore,
                  volatility: coinVolatility,
                  risk: coinRisk,
                  moonshot: coinMoonshot, // Keep the original format with 'x'
                  allocation: 0, // Will be calculated later
                  color: getRandomColor(),
                };
              });
            
            // Sort by match score (descending)
            allCoins.sort((a, b) => b.matchScore - a.matchScore);
            
            // Select top coins (between 5-8 depending on risk tolerance)
            const numCoins = Math.min(5 + Math.floor(riskLevel / 3), 8);
            let selectedCoins = allCoins.slice(0, numCoins);
            
            // If we don't have enough matches, add some random coins from the top 20
            if (selectedCoins.length < 5) {
              const remainingCoins = allCoins.slice(selectedCoins.length, 20);
              const randomCoins = remainingCoins
                .sort(() => Math.random() - 0.5)
                .slice(0, 5 - selectedCoins.length);
              selectedCoins = [...selectedCoins, ...randomCoins];
            }
            
            // Calculate allocations based on match score and risk tolerance
            const totalScore = selectedCoins.reduce((sum, coin) => sum + coin.matchScore, 0);
            
            selectedCoins = selectedCoins.map(coin => {
              // Base allocation on match score
              let allocation = (coin.matchScore / totalScore) * 100;
              
              // Adjust based on risk tolerance (higher risk = more varied allocation)
              if (riskLevel < 4) {
                // Lower risk = more balanced portfolio
                allocation = 0.5 * allocation + 0.5 * (100 / selectedCoins.length);
              } else if (riskLevel > 7) {
                // Higher risk = more concentrated on top matches and volatile coins
                const volatilityBonus = (coin.volatility / 20) * (riskLevel / 10); // Higher volatility gets bonus for high risk users
                allocation = allocation * (1 + volatilityBonus);
              }
              
              // For high risk users, give preference to coins with higher volatility
              if (riskLevel > 6 && coin.volatility > 20) {
                allocation *= 1.2; // 20% bonus for volatile coins for high risk users
              }
              
              // For low risk users, penalize highly volatile coins
              if (riskLevel < 4 && coin.volatility > 30) {
                allocation *= 0.8; // 20% reduction for volatile coins for low risk users
              }
              
              // Ensure minimum allocation
              allocation = Math.max(allocation, 5);
              
              return {
                ...coin,
                allocation,
              };
            });
            
            // Normalize allocations to sum to 100%
            const totalAllocation = selectedCoins.reduce((sum, coin) => sum + coin.allocation, 0);
            selectedCoins = selectedCoins.map(coin => ({
              ...coin,
              allocation: Math.round((coin.allocation / totalAllocation) * 100),
            }));
            
            // Adjust to ensure total is exactly 100%
            let currentTotal = selectedCoins.reduce((sum, coin) => sum + coin.allocation, 0);
            if (currentTotal !== 100) {
              const diff = 100 - currentTotal;
              selectedCoins[0].allocation += diff;
            }
            
            // Calculate dollar amounts
            selectedCoins = selectedCoins.map(coin => ({
              ...coin,
              amount: (amount * coin.allocation / 100).toFixed(2),
            }));
            
            // Store this portfolio in session storage for future reference
            const updatedPortfolios = [...previousPortfolios, selectedCoins];
            if (updatedPortfolios.length > 5) updatedPortfolios.shift(); // Keep only last 5 portfolios
            sessionStorage.setItem('previous_portfolios', JSON.stringify(updatedPortfolios));
            
            resolve(selectedCoins);
          },
          error: (error: unknown) => {
            console.error('Error parsing CSV:', error);
            resolve([]);
          }
        });
      });
    } catch (error) {
      console.error('Error fetching crypto data:', error);
      return [];
    }
  };
  
  // Helper functions for calculating scores
  const calculateRiskScore = (riskValue: number, userRiskTolerance: number): number => {
    // Higher user risk tolerance means they prefer higher risk coins
    // Higher risk value means the coin is riskier
    // If user has high risk tolerance, higher risk coins get higher scores
    if (userRiskTolerance >= 7) {
      return (riskValue / 10) * 100; // Higher risk gets higher score
    } else if (userRiskTolerance >= 4) {
      return 50; // Neutral
    } else {
      return (1 - riskValue / 10) * 100; // Lower risk gets higher score
    }
  };

  const calculateVolatilityScore = (volatilityValue: number, userVolatilityPreference: number): number => {
    // Higher user volatility preference means they prefer more volatile coins
    // Higher volatility value means the coin is more volatile
    if (userVolatilityPreference >= 7) {
      return (volatilityValue / 40) * 100; // Higher volatility gets higher score
    } else if (userVolatilityPreference >= 4) {
      return 50; // Neutral
    } else {
      return (1 - volatilityValue / 40) * 100; // Lower volatility gets higher score
    }
  };

  const calculateMoonshotScore = (moonshotValue: number, userMoonshotRate: number): number => {
    // Higher user moonshot rate means they prefer coins with higher potential returns
    // Higher moonshot value means the coin has higher potential returns
    if (userMoonshotRate >= 7) {
      return (Math.min(moonshotValue, 100) / 100) * 100; // Higher moonshot gets higher score
    } else if (userMoonshotRate >= 4) {
      return 50; // Neutral
    } else {
      return (1 - Math.min(moonshotValue, 100) / 100) * 100; // Lower moonshot gets higher score
    }
  };
  
  // Function to generate a random color for charts
  const getRandomColor = (): string => {
    const colors = [
      '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
      '#FF9F40', '#8AC926', '#1982C4', '#6A4C93', '#F15BB5'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };
  
  // Handle start over
  const handleStartOver = () => {
    // Reset all state
    setCurrentStep(1);
    setValue('investmentAmount', '1000');
    setValue('riskTolerance', '5');
    setValue('volatilityPreference', '5');
    setValue('moonshotRate', '5');
    setCryptoData([]);
    setInvestmentAmount('');
    setIsLoading(false);
    setLoadingComplete(false);
    setProgress(0);
  };

  const renderResults = () => {
    return (
      <RecommendationResults 
        cryptoData={cryptoData as RecommendationResultsProps['cryptoData']} 
        investmentAmount={investmentAmount} 
        isLoading={isLoading}
        onStartOver={handleStartOver}
      />
    );
  };

  // Render different steps based on currentStep
  const renderStep = () => {
    if (isLoading) {
      return (
        <LoadingAnimation 
          onComplete={handleLoadingComplete} 
        />
      );
    }
    
    if (loadingComplete) {
      return renderResults();
    }
    
    return (
      <div className="relative">
        {showAccessCodeInput && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="max-w-md w-full glass-dark p-8 rounded-2xl relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-primary/5 z-0"></div>
              
              <div className="relative z-10">
                <h2 className="text-2xl font-bold mb-6 text-white">Access Code Required</h2>
                <p className="text-white/70 mb-6">You've used all 3 free attempts. Please enter a valid access code to continue.</p>
                
                <form onSubmit={accessCodeForm.handleSubmit(handleAccessCodeSubmit)}>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm">
                        <div className="flex items-center mb-4">
                          <label htmlFor="accessCode" className="block text-white/80 font-medium">
                            Enter access code
                          </label>
                        </div>
                        <div className="relative">
                          <input
                            type="text"
                            id="accessCode"
                            className="w-full bg-white/10 border border-white/20 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-xl"
                            placeholder="Enter access code"
                            {...accessCodeForm.register("accessCode", { required: true })}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <button
                        type="submit"
                        className="w-full py-3 px-6 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg shadow-lg shadow-primary/20 transition-all duration-200"
                      >
                        Submit
                      </button>
                    </div>
                    
                    <div className="pt-4 text-center">
                      <p className="text-white/70 mb-3">Don't have an access code?</p>
                      <a 
                        href="https://t.me/excellionxrex" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center py-3 px-6 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg shadow-lg shadow-blue-500/20 transition-all duration-200"
                      >
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.25l-2.173 10.244c-.168.78-.621.936-1.26.578l-3.475-2.553-1.68 1.62c-.173.173-.36.36-.72.36l.274-3.906 7.142-6.45c.313-.285-.068-.446-.48-.285L8.28 13.71l-3.783-1.195c-.781-.237-.781-.825.18-1.215l14.778-5.7c.652-.237 1.215.15.984 1.215z" />
                        </svg>
                        Contact on Telegram
                      </a>
                    </div>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
        
        <motion.div
          key={`step-${currentStep}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="max-w-xl mx-auto glass-dark p-8 rounded-2xl relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-primary/5 z-0"></div>
          
          <div className="relative z-10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                {currentStep === 1 && "Investment Amount"}
                {currentStep === 2 && "Risk Tolerance"}
                {currentStep === 3 && "Volatility Preference"}
                {currentStep === 4 && "Moonshot Rate"}
              </h2>
              
              {!hasAccessCode && (
                <div className="bg-gradient-to-r from-purple-900/70 to-indigo-900/70 border border-purple-500/30 px-4 py-2 rounded-lg text-sm text-white flex items-center shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>
                    <span className="font-bold text-purple-400">{3 - usageCount}</span> <span className="text-white/80">tries remaining</span>
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex justify-between mb-8">
              <div className="flex space-x-1">
                {[1, 2, 3, 4].map((step) => (
                  <div 
                    key={step} 
                    className={`w-6 h-1 rounded-full ${currentStep >= step ? 'bg-primary' : 'bg-white/20'}`}
                  />
                ))}
              </div>
              <div className="text-white/50 text-sm">Step {currentStep} of 4</div>
            </div>
            
            {currentStep === 1 && (
              <>
                <p className="text-white/70 mb-6">How much would you like to invest?</p>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm">
                      <div className="flex items-center mb-4">
                        <label htmlFor="investmentAmount" className="block text-white/80 font-medium">
                          Enter amount in USD
                        </label>
                      </div>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 text-xl">$</span>
                        <input
                          type="number"
                          id="investmentAmount"
                          className="w-full bg-white/10 border border-white/20 text-white px-10 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-xl"
                          placeholder="Enter amount"
                          {...register("investmentAmount", { required: true })}
                        />
                      </div>
                    </div>
                    
                    <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm">
                      <div className="mb-4">
                        <label className="block text-white/80 font-medium mb-2">
                          Quick select
                        </label>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {['500', '1000', '5000', '10000'].map((amount) => (
                          <button
                            key={amount}
                            type="button"
                            onClick={() => setValue('investmentAmount', amount)}
                            className={`p-4 rounded-xl text-center transition-all duration-200 ${
                              watchInvestmentAmount === amount
                                ? 'bg-primary/20 border-2 border-primary text-white'
                                : 'bg-white/5 text-white/70 hover:bg-white/10'
                            }`}
                          >
                            <div className="font-medium text-lg">${parseInt(amount).toLocaleString()}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-8">
                    <button
                      type="button"
                      onClick={nextStep}
                      className="w-full py-3 px-6 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg shadow-lg shadow-primary/20 transition-all duration-200"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              </>
            )}
            
            {currentStep === 2 && (
              <>
                <p className="text-white/70 mb-6">How much risk are you willing to take?</p>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-4">
                    <button 
                      type="button" 
                      className={`p-6 rounded-xl text-center transition-all duration-200 ${parseInt(watchRiskTolerance) <= 3 ? 'bg-green-500/20 border-2 border-green-500 text-white' : 'bg-white/5 text-white/70 hover:bg-white/10'}`}
                      onClick={() => setValue('riskTolerance', '2')}
                    >
                      <div className="flex items-center justify-center">
                        <div className="text-3xl mr-4">🛡️</div>
                        <div className="text-left">
                          <div className="font-medium text-xl">Low Risk</div>
                          <div className="text-sm mt-1 text-white/70">Prioritize safety and stability over high returns</div>
                        </div>
                      </div>
                    </button>
                    
                    <button 
                      type="button" 
                      className={`p-6 rounded-xl text-center transition-all duration-200 ${parseInt(watchRiskTolerance) > 3 && parseInt(watchRiskTolerance) <= 7 ? 'bg-yellow-500/20 border-2 border-yellow-500 text-white' : 'bg-white/5 text-white/70 hover:bg-white/10'}`}
                      onClick={() => setValue('riskTolerance', '5')}
                    >
                      <div className="flex items-center justify-center">
                        <div className="text-3xl mr-4">⚖️</div>
                        <div className="text-left">
                          <div className="font-medium text-xl">Medium Risk</div>
                          <div className="text-sm mt-1 text-white/70">Balance between safety and potential returns</div>
                        </div>
                      </div>
                    </button>
                    
                    <button 
                      type="button" 
                      className={`p-6 rounded-xl text-center transition-all duration-200 ${parseInt(watchRiskTolerance) > 7 ? 'bg-red-500/20 border-2 border-red-500 text-white' : 'bg-white/5 text-white/70 hover:bg-white/10'}`}
                      onClick={() => setValue('riskTolerance', '8')}
                    >
                      <div className="flex items-center justify-center">
                        <div className="text-3xl mr-4">🔥</div>
                        <div className="text-left">
                          <div className="font-medium text-xl">High Risk</div>
                          <div className="text-sm mt-1 text-white/70">Willing to take significant risks for higher potential returns</div>
                        </div>
                      </div>
                    </button>
                  </div>
                  
                  <div className="pt-8 flex justify-between">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="py-3 px-6 bg-white/5 hover:bg-white/10 text-white font-medium rounded-lg transition-all duration-200"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={nextStep}
                      className="py-3 px-6 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg shadow-lg shadow-primary/20 transition-all duration-200"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              </>
            )}
            
            {currentStep === 3 && (
              <>
                <p className="text-white/70 mb-6">How comfortable are you with price fluctuations?</p>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-4">
                    <button 
                      type="button" 
                      className={`p-6 rounded-xl text-center transition-all duration-200 ${parseInt(watchVolatilityPreference) <= 3 ? 'bg-green-500/20 border-2 border-green-500 text-white' : 'bg-white/5 text-white/70 hover:bg-white/10'}`}
                      onClick={() => setValue('volatilityPreference', '2')}
                    >
                      <div className="flex items-center justify-center">
                        <div className="text-3xl mr-4">📊</div>
                        <div className="text-left">
                          <div className="font-medium text-xl">Low Volatility</div>
                          <div className="text-sm mt-1 text-white/70">Prefer stable investments with minimal price fluctuations</div>
                        </div>
                      </div>
                    </button>
                    
                    <button 
                      type="button" 
                      className={`p-6 rounded-xl text-center transition-all duration-200 ${parseInt(watchVolatilityPreference) > 3 && parseInt(watchVolatilityPreference) <= 7 ? 'bg-yellow-500/20 border-2 border-yellow-500 text-white' : 'bg-white/5 text-white/70 hover:bg-white/10'}`}
                      onClick={() => setValue('volatilityPreference', '5')}
                    >
                      <div className="flex items-center justify-center">
                        <div className="text-3xl mr-4">📈</div>
                        <div className="text-left">
                          <div className="font-medium text-xl">Medium Volatility</div>
                          <div className="text-sm mt-1 text-white/70">Balanced approach with moderate price movements</div>
                        </div>
                      </div>
                    </button>
                    
                    <button 
                      type="button" 
                      className={`p-6 rounded-xl text-center transition-all duration-200 ${parseInt(watchVolatilityPreference) > 7 ? 'bg-red-500/20 border-2 border-red-500 text-white' : 'bg-white/5 text-white/70 hover:bg-white/10'}`}
                      onClick={() => setValue('volatilityPreference', '8')}
                    >
                      <div className="flex items-center justify-center">
                        <div className="text-3xl mr-4">🎢</div>
                        <div className="text-left">
                          <div className="font-medium text-xl">High Volatility</div>
                          <div className="text-sm mt-1 text-white/70">Comfortable with significant price fluctuations</div>
                        </div>
                      </div>
                    </button>
                  </div>
                  
                  <div className="pt-8 flex justify-between">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="py-3 px-6 bg-white/5 hover:bg-white/10 text-white font-medium rounded-lg transition-all duration-200"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={nextStep}
                      className="py-3 px-6 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg shadow-lg shadow-primary/20 transition-all duration-200"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              </>
            )}
            
            {currentStep === 4 && (
              <>
                <p className="text-white/70 mb-6">How important is the potential for exponential growth?</p>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-4">
                    <button 
                      type="button" 
                      className={`p-6 rounded-xl text-center transition-all duration-200 ${parseInt(watchMoonshotRate) <= 3 ? 'bg-blue-500/20 border-2 border-blue-500 text-white' : 'bg-white/5 text-white/70 hover:bg-white/10'}`}
                      onClick={() => setValue('moonshotRate', '2')}
                    >
                      <div className="flex items-center justify-center">
                        <div className="text-3xl mr-4">🔍</div>
                        <div className="text-left">
                          <div className="font-medium text-xl">Conservative</div>
                          <div className="text-sm mt-1 text-white/70">Focus on established cryptocurrencies with proven track records</div>
                        </div>
                      </div>
                    </button>
                    
                    <button 
                      type="button" 
                      className={`p-6 rounded-xl text-center transition-all duration-200 ${parseInt(watchMoonshotRate) > 3 && parseInt(watchMoonshotRate) <= 7 ? 'bg-purple-500/20 border-2 border-purple-500 text-white' : 'bg-white/5 text-white/70 hover:bg-white/10'}`}
                      onClick={() => setValue('moonshotRate', '5')}
                    >
                      <div className="flex items-center justify-center">
                        <div className="text-3xl mr-4">🚀</div>
                        <div className="text-left">
                          <div className="font-medium text-xl">Balanced</div>
                          <div className="text-sm mt-1 text-white/70">Mix of established coins and promising newcomers</div>
                        </div>
                      </div>
                    </button>
                    
                    <button 
                      type="button" 
                      className={`p-6 rounded-xl text-center transition-all duration-200 ${parseInt(watchMoonshotRate) > 7 ? 'bg-pink-500/20 border-2 border-pink-500 text-white' : 'bg-white/5 text-white/70 hover:bg-white/10'}`}
                      onClick={() => setValue('moonshotRate', '8')}
                    >
                      <div className="flex items-center justify-center">
                        <div className="text-3xl mr-4">🌕</div>
                        <div className="text-left">
                          <div className="font-medium text-xl">Aggressive</div>
                          <div className="text-sm mt-1 text-white/70">Prioritize high-potential coins with exponential growth possibilities</div>
                        </div>
                      </div>
                    </button>
                  </div>
                  
                  <div className="pt-8 flex flex-col sm:flex-row justify-between gap-4">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="py-3 px-6 bg-white/5 hover:bg-white/10 text-white font-medium rounded-lg transition-all duration-200"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit(handleFormSubmit)}
                      className="py-3 px-6 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg shadow-lg shadow-primary/20 transition-all duration-200"
                    >
                      Generate Portfolio
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="absolute inset-0 bg-grid-pattern opacity-10 z-0"></div>
      
      {/* Floating particles */}
      <BackgroundParticles />
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-primary p-2 rounded-full mr-3 shadow-lg shadow-primary/20">
              <div className="relative w-10 h-10">
                <Image 
                  src="/images/logo.png" 
                  alt="Xoracle AI Logo" 
                  fill
                  className="object-contain"
                />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Xoracle<span className="text-primary">AI</span>
            </h1>
          </div>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Advanced AI-powered crypto investment advisor that creates a personalized portfolio based on your preferences.
          </p>
        </header>
        
        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>
        
        <footer className="mt-16 text-center text-white/50 text-sm">
          <p> 2025 XoracleAI. Not financial advice. For demonstration purposes only.</p>
        </footer>
      </div>
    </main>
  );
}

// Background particles component with client-side only rendering
function BackgroundParticles() {
  const [particles, setParticles] = useState<Array<{top: string, left: string, delay: number, duration: number}>>([]);
  
  useEffect(() => {
    // Generate particles only on the client side to avoid hydration errors
    const newParticles = Array.from({ length: 20 }, () => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      delay: Math.random() * 2,
      duration: 3 + Math.random() * 3
    }));
    
    setParticles(newParticles);
  }, []);
  
  return (
    <>
      {particles.map((particle, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-1.5 h-1.5 rounded-full bg-primary"
          style={{
            top: particle.top,
            left: particle.left,
            zIndex: 1
          }}
          animate={{
            y: [0, -15, 0],
            x: [0, Math.random() * 10 - 5, 0],
            opacity: [0, 0.5, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
          }}
        />
      ))}
    </>
  );
}
