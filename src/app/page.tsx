'use client';

import { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import Papa from 'papaparse';
import LoadingAnimation from '@/components/LoadingAnimation';
import RecommendationResults from '@/components/RecommendationResults';
import XoracleInvestmentSpecs from '@/components/XoracleInvestmentSpecs';
import Image from 'next/image';

interface FormInputs {
  investmentAmount: number;
  riskTolerance: number;
  volatilityPreference: number;
  moonshotRate: number;
  timeHorizon: number;
}

interface AccessCodeInputs {
  accessCode: string;
}

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

// Define interface for CSV parsing results
interface CsvData {
  Coin: string;
  Volatility: string;
  Risk: string;
  'Moonshot Score': string;
  [key: string]: string;
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

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [progress, setProgress] = useState(0);
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [investmentAmount, setInvestmentAmount] = useState<string>('');
  const [currentStep, setCurrentStep] = useState(1);
  const [usageCount, setUsageCount] = useState<number>(0);
  const [showAccessCodeInput, setShowAccessCodeInput] = useState<boolean>(false);
  const [hasAccessCode, setHasAccessCode] = useState<boolean>(false);
  const [userRiskTolerance, setUserRiskTolerance] = useState(50);
  const [userVolatilityPreference, setUserVolatilityPreference] = useState(50);
  const [userMoonshotRate, setUserMoonshotRate] = useState(10);
  const [userTimeHorizon, setUserTimeHorizon] = useState(1);
  const [pageTransition, setPageTransition] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [loadingStep, setLoadingStep] = useState<number>(0);

  const accessCodeForm = useForm<AccessCodeInputs>();

  const { register, handleSubmit, watch, formState: { errors }, setValue } = useForm<FormInputs>({
    defaultValues: {
      investmentAmount: 1000,
      riskTolerance: 5,
      volatilityPreference: 5,
      moonshotRate: 5,
      timeHorizon: 1
    }
  });
  
  // Check for usage count in localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedCount = localStorage.getItem('xoracle_usage_count');
      if (storedCount) {
        const count = parseInt(storedCount);
        setUsageCount(count);
        
        // If used more than 3 times, require access code
        if (count >= 3) {
          setShowAccessCodeInput(true);
        }
      }
    }
  }, []);

  const nextStep = () => {
    setPageTransition(true);
    setTimeout(() => {
      setCurrentStep(prev => Math.min(prev + 1, 4));
      setTimeout(() => {
        setPageTransition(false);
      }, 300);
    }, 300);
  };

  const prevStep = () => {
    setPageTransition(true);
    setTimeout(() => {
      setCurrentStep(prev => Math.max(prev - 1, 1));
      setTimeout(() => {
        setPageTransition(false);
      }, 300);
    }, 300);
  };

  const handleFormSubmit: SubmitHandler<FormInputs> = (data) => {
    // Check if user has exceeded usage limit
    if (usageCount >= 3 && !hasAccessCode) {
      setShowAccessCodeInput(true);
      return;
    }

    // Save user parameters for results page
    setUserRiskTolerance(data.riskTolerance);
    setUserVolatilityPreference(data.volatilityPreference);
    setUserMoonshotRate(data.moonshotRate);
    setUserTimeHorizon(data.timeHorizon);

    // Format investment amount
    const formattedAmount = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(data.investmentAmount);
    setInvestmentAmount(formattedAmount);

    // First move to loading screen
    setIsLoading(true);
    setLoadingComplete(false); // Reset loading complete state
    setProgress(0); // Reset progress
    setLoadingProgress(0); // Reset loading progress for the new component
    setLoadingStep(0); // Reset loading step for the new component
    setCurrentStep(2); // Move to loading step

    // Fetch data in the background while loading animation plays
    fetchCryptoData(
      data.investmentAmount,
      data.riskTolerance,
      data.volatilityPreference,
      data.moonshotRate
    ).then(data => {
      setCryptoData(data);
      
      // Simulate loading progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 3;
        
        if (progress >= 100) {
          clearInterval(interval);
          progress = 100;
          setLoadingProgress(100);
          
          // Update loading step based on progress
          const newStep = Math.min(Math.floor((progress / 100) * 6), 5);
          setLoadingStep(newStep);
          
          setTimeout(() => {
            setLoadingComplete(true);
            handleLoadingComplete();
          }, 500);
        } else {
          setLoadingProgress(progress);
          
          // Update loading step based on progress
          const newStep = Math.min(Math.floor((progress / 100) * 6), 5);
          setLoadingStep(newStep);
        }
      }, 200);
      
    }).catch(error => {
      console.error('Error fetching data:', error);
      // Use fallback data
      setCryptoData(getFallbackData());
      
      // Complete loading animation
      setTimeout(() => {
        setLoadingComplete(true);
        handleLoadingComplete();
      }, 3000);
    });
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
      handleFormSubmit({
        investmentAmount: 1000,
        riskTolerance: 50,
        volatilityPreference: 50,
        moonshotRate: 10,
        timeHorizon: 10,
      });
    } else {
      alert('Invalid access code. Please try again or contact support.');
    }
  };

  const handleLoadingComplete = () => {
    // Increment usage count
    const newCount = usageCount + 1;
    setUsageCount(newCount);
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('xoracle_usage_count', newCount.toString());
    }
    
    // Move to results page
    setIsLoading(false);
    setCurrentStep(4);
    
    // Reset loading progress
    setLoadingProgress(0);
    setLoadingStep(0);
  };

  // Process the CSV data and apply user preferences
  const fetchCryptoData = async (
    investmentAmount: number,
    riskTolerance: number,
    volatilityPreference: number,
    moonshotRate: number
  ): Promise<CryptoData[]> => {
    console.log('Fetching crypto data with params:', { investmentAmount, riskTolerance, volatilityPreference, moonshotRate });
    
    return new Promise((resolve, reject) => {
      try {
        // Load the CSV data
        console.log('Attempting to parse CSV from:', '/data/crypto_data.csv');
        Papa.parse('/data/crypto_data.csv', {
          download: true,
          header: true,
          complete: function(results) {
            try {
              console.log('CSV parsing complete. Raw results:', results);
              
              // Check if we have valid data
              if (!results.data || results.data.length === 0) {
                console.error('No data found in CSV file');
                // Return fallback data if CSV is empty
                resolve(getFallbackData());
                return;
              }
              
              // Convert CSV data to CryptoData format
              const cryptoData = (results.data as CsvData[])
                .filter((row: CsvData) => {
                  const isValid = row.Coin && row.Volatility && row.Risk && row['Moonshot Score'];
                  if (!isValid) {
                    console.warn('Filtered out invalid row:', row);
                  }
                  return isValid;
                })
                .map((row: CsvData) => {
                  // Parse values from CSV
                  const name = row.Coin;
                  const volatility = parseFloat(row.Volatility) || 5; // Default if parsing fails
                  const risk = parseFloat(row.Risk) || 5; // Default if parsing fails
                  const moonshot = row['Moonshot Score'] || '5'; // Default if missing
                  
                  // Calculate scores based on user preferences
                  const riskScore = calculateRiskScore(risk, riskTolerance);
                  const volatilityScore = calculateVolatilityScore(volatility, volatilityPreference);
                  const moonshotScore = calculateMoonshotScore(parseFloat(moonshot) || 5, moonshotRate);
                  
                  // Calculate overall match score
                  const overallScore = (riskScore + volatilityScore + moonshotScore) / 3;
                  
                  return {
                    name,
                    symbol: name.substring(0, 3).toUpperCase(),
                    risk,
                    volatility,
                    moonshot,
                    allocation: 0, // Will be calculated later
                    color: getRandomColor(),
                    expectedReturn: Math.round(5 + (risk / 10) * 15) // Base return + risk factor
                  };
                });
              
              console.log('Processed crypto data:', cryptoData);
              
              // If we have no valid data after filtering, use fallback
              if (cryptoData.length === 0) {
                console.warn('No valid data after filtering, using fallback data');
                resolve(getFallbackData());
                return;
              }
              
              // Sort by overall score (descending)
              const sortedData = [...cryptoData].sort((a, b) => {
                const scoreA = (a.risk || 0) * (riskTolerance / 100) + 
                              (a.volatility || 0) * (volatilityPreference / 100);
                const scoreB = (b.risk || 0) * (riskTolerance / 100) + 
                              (b.volatility || 0) * (volatilityPreference / 100);
                return scoreB - scoreA;
              });
              
              console.log('Sorted data:', sortedData);
              
              // Take top 5 cryptocurrencies
              const topCryptos = sortedData.slice(0, 5);
              
              // Calculate allocation percentages
              const totalScore = topCryptos.reduce((sum, crypto) => {
                const score = (crypto.risk || 0) * (riskTolerance / 100) + 
                             (crypto.volatility || 0) * (volatilityPreference / 100);
                return sum + Math.max(0.1, score); // Ensure we don't divide by zero
              }, 0);
              
              const cryptosWithAllocation = topCryptos.map(crypto => {
                const score = (crypto.risk || 0) * (riskTolerance / 100) + 
                             (crypto.volatility || 0) * (volatilityPreference / 100);
                const allocation = Math.round((score / totalScore) * 100) || 20; // Default to 20% if calculation fails
                
                return {
                  ...crypto,
                  allocation
                };
              });
              
              // Ensure allocations sum to 100%
              let totalAllocation = cryptosWithAllocation.reduce((sum, crypto) => sum + crypto.allocation, 0);
              if (totalAllocation !== 100) {
                const diff = 100 - totalAllocation;
                cryptosWithAllocation[0].allocation += diff;
              }
              
              console.log('Final crypto data with allocations:', cryptosWithAllocation);
              
              // Add some delay to simulate processing
              setTimeout(() => {
                resolve(cryptosWithAllocation);
              }, 1000);
            } catch (error) {
              console.error('Error processing CSV data:', error);
              // Return fallback data on error
              resolve(getFallbackData());
            }
          },
          error: function(error: unknown) {
            console.error('Error parsing CSV:', error);
            // Return fallback data on error
            resolve(getFallbackData());
          }
        });
      } catch (error) {
        console.error('Error in fetchCryptoData:', error);
        // Return fallback data on error
        resolve(getFallbackData());
      }
    });
  };

  // Provide fallback data if CSV loading fails
  const getFallbackData = (): CryptoData[] => {
    console.log('Using fallback data');
    return [
      {
        name: "Bitcoin",
        symbol: "BTC",
        allocation: 40,
        risk: 7,
        volatility: 8,
        moonshot: "9",
        color: "#F7931A",
        expectedReturn: 15
      },
      {
        name: "Ethereum",
        symbol: "ETH",
        allocation: 30,
        risk: 6,
        volatility: 7,
        moonshot: "8",
        color: "#627EEA",
        expectedReturn: 12
      },
      {
        name: "Solana",
        symbol: "SOL",
        allocation: 15,
        risk: 8,
        volatility: 9,
        moonshot: "9",
        color: "#00FFA3",
        expectedReturn: 18
      },
      {
        name: "Cardano",
        symbol: "ADA",
        allocation: 10,
        risk: 5,
        volatility: 6,
        moonshot: "7",
        color: "#0033AD",
        expectedReturn: 10
      },
      {
        name: "Polkadot",
        symbol: "DOT",
        allocation: 5,
        risk: 7,
        volatility: 8,
        moonshot: "8",
        color: "#E6007A",
        expectedReturn: 14
      }
    ];
  };

  // Helper functions for calculating scores
  const calculateRiskScore = (risk: number, riskTolerance: number): number => {
    // Higher score when risk matches user's tolerance
    return 10 - Math.abs(risk - riskTolerance) / 10;
  };
  
  const calculateVolatilityScore = (volatility: number, volatilityPreference: number): number => {
    // Higher score when volatility matches user's preference
    return 10 - Math.abs(volatility - volatilityPreference) / 10;
  };
  
  const calculateMoonshotScore = (moonshot: number, moonshotRate: number): number => {
    // Higher score when moonshot matches user's preference
    return 10 - Math.abs(moonshot - moonshotRate) / 10;
  };
  
  // Generate a random color for chart visualization
  const getRandomColor = (): string => {
    // Generate colors in the neon palette
    const colors = [
      '#00ffff', // Cyan
      '#ff00ff', // Magenta
      '#ffcc00', // Yellow
      '#00ff99', // Green
      '#0066ff', // Blue
      '#ff6600'  // Orange
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const handleStartOver = () => {
    // Reset all state
    setCurrentStep(1);
    setCryptoData([]);
    setInvestmentAmount('');
    setIsLoading(false);
    setLoadingComplete(false);
    setProgress(0);
    setLoadingProgress(0);
    setLoadingStep(0);
  };

  const renderResults = () => {
    return (
      <RecommendationResults
        cryptoData={cryptoData.length > 0 ? cryptoData : getFallbackData()}
        investmentAmount={investmentAmount || "$10,000"}
        isLoading={isLoading}
        onStartOver={handleStartOver}
        riskTolerance={userRiskTolerance}
        volatilityPreference={userVolatilityPreference}
        moonshotRate={userMoonshotRate}
        timeHorizon={userTimeHorizon}
      />
    );
  };

  // Render different steps based on currentStep
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <XoracleInvestmentSpecs 
            onSubmit={(data) => {
              const formData = {
                investmentAmount: parseFloat(data.investmentAmount) || 10000,
                riskTolerance: data.riskTolerance,
                volatilityPreference: data.volatilityPreference,
                moonshotRate: data.desiredMultiplier,
                timeHorizon: data.timeHorizon
              };
              handleFormSubmit(formData);
            }}
            riskToleranceValue={userRiskTolerance}
            setRiskToleranceValue={setUserRiskTolerance}
            volatilityValue={userVolatilityPreference}
            setVolatilityValue={setUserVolatilityPreference}
            moonshotValue={userMoonshotRate}
            setMoonshotValue={setUserMoonshotRate}
            timeHorizonValue={userTimeHorizon}
            setTimeHorizonValue={setUserTimeHorizon}
          />
        );
      
      case 2:
        return (
          <LoadingAnimation
            progress={loadingProgress}
            currentStep={loadingStep}
            onComplete={handleLoadingComplete}
          />
        );
      
      case 3:
        return renderResults();
      
      case 4:
        return renderResults();
      
      default:
        return (
          <XoracleInvestmentSpecs 
            onSubmit={(data) => {
              const formData = {
                investmentAmount: parseFloat(data.investmentAmount) || 10000,
                riskTolerance: data.riskTolerance,
                volatilityPreference: data.volatilityPreference,
                moonshotRate: data.desiredMultiplier,
                timeHorizon: data.timeHorizon
              };
              handleFormSubmit(formData);
            }}
            riskToleranceValue={userRiskTolerance}
            setRiskToleranceValue={setUserRiskTolerance}
            volatilityValue={userVolatilityPreference}
            setVolatilityValue={setUserVolatilityPreference}
            moonshotValue={userMoonshotRate}
            setMoonshotValue={setUserMoonshotRate}
            timeHorizonValue={userTimeHorizon}
            setTimeHorizonValue={setUserTimeHorizon}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Enhanced background elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Deep space background with stars */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-purple-900/10 to-black">
          <div className="stars-container">
            {Array.from({ length: 100 }).map((_, i) => (
              <div 
                key={`star-${i}`} 
                className="star"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  width: `${Math.random() * 2 + 1}px`,
                  height: `${Math.random() * 2 + 1}px`,
                  animationDelay: `${Math.random() * 10}s`,
                  animationDuration: `${Math.random() * 5 + 5}s`
                }}
              />
            ))}
          </div>
        </div>
        
        {/* Animated grid overlay */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'linear-gradient(rgba(0, 255, 255, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 255, 0.3) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
            backgroundPosition: 'center center',
          }}
        />
        
        {/* Animated border effects */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00ffff] to-transparent opacity-70"></div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00ffff] to-transparent opacity-70"></div>
        <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#00ffff] to-transparent opacity-70"></div>
        <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#00ffff] to-transparent opacity-70"></div>
        
        {/* Animated scan lines */}
        <motion.div 
          className="absolute h-[1px] w-[200%] bg-[#00ffff]/30"
          style={{ top: '30%', left: '-50%' }}
          animate={{ 
            translateX: ['0%', '100%'], 
          }}
          transition={{ 
            duration: 15, 
            repeat: Infinity,
            ease: 'linear'
          }}
        />
        <motion.div 
          className="absolute h-[1px] w-[200%] bg-[#ff00ff]/30"
          style={{ top: '70%', left: '-50%' }}
          animate={{ 
            translateX: ['100%', '0%'], 
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity,
            ease: 'linear'
          }}
        />
        
        {/* Animated particles */}
        <BackgroundParticles />
        
        {/* Glowing orbs */}
        <motion.div
          className="absolute rounded-full blur-[80px] opacity-20"
          style={{ 
            background: 'radial-gradient(circle, #00ffff 0%, transparent 70%)',
            width: '300px',
            height: '300px',
            top: '20%',
            left: '10%'
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
        <motion.div
          className="absolute rounded-full blur-[80px] opacity-20"
          style={{ 
            background: 'radial-gradient(circle, #ff00ff 0%, transparent 70%)',
            width: '250px',
            height: '250px',
            bottom: '10%',
            right: '10%'
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.15, 0.1]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2
          }}
        />
      </div>
      
      {/* Main content with page transitions */}
      <motion.div 
        className="relative z-10 max-w-4xl mx-auto"
        animate={{
          opacity: pageTransition ? 0 : 1,
          y: pageTransition ? 20 : 0
        }}
        transition={{
          duration: 0.3,
          ease: "easeInOut"
        }}
      >
        {/* Branding logo */}
        <motion.div 
          className="mb-8 flex justify-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative">
            <h1 
              className="text-4xl font-bold"
              style={{ 
                color: '#00ffff',
                textShadow: '0 0 15px rgba(0, 255, 255, 0.7)'
              }}
            >
              XoracleAI
            </h1>
            <motion.div 
              className="absolute -bottom-2 left-0 right-0 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, #00ffff, transparent)' }}
              animate={{ 
                opacity: [0.5, 1, 0.5],
                boxShadow: ['0 0 5px #00ffff', '0 0 10px #00ffff', '0 0 5px #00ffff']
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </div>
        </motion.div>
        
        {renderStep()}
      </motion.div>
      
      {/* Add keyframe animations */}
      <style jsx>{`
        @keyframes pulse {
          0% { opacity: 0.7; }
          50% { opacity: 1; }
          100% { opacity: 0.7; }
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .stars-container {
          position: absolute;
          inset: 0;
          overflow: hidden;
        }
        
        .star {
          position: absolute;
          background-color: white;
          border-radius: 50%;
          animation: twinkle infinite;
        }
      `}</style>
    </div>
  );
}

// Background particles component with client-side only rendering
function BackgroundParticles() {
  const [particles, setParticles] = useState<Array<{ top: string, left: string, delay: number, duration: number, size: number, color: string }>>([]);

  useEffect(() => {
    // Generate particles only on the client side to avoid hydration errors
    const newParticles = Array.from({ length: 30 }, () => {
      const colors = ['#00ffff', '#ff00ff', '#ffcc00', '#ffffff'];
      return {
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        delay: Math.random() * 5,
        duration: 5 + Math.random() * 10,
        size: 1 + Math.random() * 3,
        color: colors[Math.floor(Math.random() * colors.length)]
      };
    });

    setParticles(newParticles);
  }, []);

  return (
    <>
      {particles.map((particle, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute rounded-full"
          style={{
            top: particle.top,
            left: particle.left,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            background: particle.color,
            boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
            zIndex: 1
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 50 - 25, 0],
            opacity: [0, 0.8, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut"
          }}
        />
      ))}
    </>
  );
}
