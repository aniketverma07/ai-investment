'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';

const formSchema = z.object({
  investmentAmount: z.string().min(1, 'Investment amount is required'),
  riskTolerance: z.enum(['low', 'medium', 'high']),
  volatilityPreference: z.enum(['low', 'medium', 'high']),
  moonshotRate: z.enum(['conservative', 'balanced', 'aggressive']),
  investmentHorizon: z.enum(['short', 'medium', 'long']),
  techPreference: z.enum(['established', 'mixed', 'emerging']),
  diversification: z.enum(['focused', 'balanced', 'broad'])
});

type FormValues = z.infer<typeof formSchema>;

interface InvestmentFormProps {
  onSubmit: (data: FormValues) => void;
}

export default function InvestmentForm({ onSubmit }: InvestmentFormProps) {
  const [step, setStep] = useState(1);
  
  const { register, handleSubmit, formState: { errors }, watch } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      investmentAmount: '',
      riskTolerance: 'medium',
      volatilityPreference: 'medium',
      moonshotRate: 'balanced',
      investmentHorizon: 'medium',
      techPreference: 'mixed',
      diversification: 'balanced'
    }
  });
  
  const formSubmit = (data: FormValues) => {
    onSubmit(data);
  };
  
  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);
  
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
        type: 'spring', 
        stiffness: 100 
      }
    }
  };

  const renderStepIndicator = () => {
    return (
      <motion.div 
        className="flex justify-center mb-6 md:mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center">
          {[1, 2, 3].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  step === stepNumber 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md' 
                    : step > stepNumber 
                      ? 'bg-green-500/80 text-white' 
                      : 'bg-white/5 backdrop-blur-sm text-white/60 border border-white/10'
                }`}
              >
                {step > stepNumber ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className="text-sm font-medium">{stepNumber}</span>
                )}
              </div>
              {stepNumber < 3 && (
                <div 
                  className={`w-12 h-0.5 ${
                    step > stepNumber ? 'bg-green-500/60' : 'bg-white/10'
                  }`}
                ></div>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    );
  };
  
  return (
    <div className="w-full max-w-md mx-auto glass-card p-6 md:p-8 rounded-2xl shadow-xl border border-white/10 backdrop-blur-xl">
      {renderStepIndicator()}
      
      <form onSubmit={handleSubmit(formSubmit)}>
        {step === 1 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <motion.h2 
              variants={itemVariants} 
              className="text-xl md:text-2xl font-bold text-center text-white mb-4 md:mb-6 tracking-tight"
            >
              How much would you like to invest?
            </motion.h2>
            
            <motion.div variants={itemVariants} className="space-y-3">
              <label htmlFor="investmentAmount" className="block text-sm font-medium text-white/80">
                Investment Amount ($)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-white/60">$</span>
                </div>
                <input
                  id="investmentAmount"
                  type="number"
                  placeholder="Enter amount"
                  className="w-full pl-8 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-white"
                  {...register('investmentAmount')}
                />
              </div>
              {errors.investmentAmount && (
                <p className="text-red-400 text-sm mt-1 font-light">{errors.investmentAmount.message}</p>
              )}
              
              <div className="pt-2">
                <p className="text-white/60 text-sm font-light">
                  Recommended: $1,000 - $10,000 for a balanced portfolio
                </p>
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="pt-6">
              <button
                type="button"
                onClick={nextStep}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all duration-200 transform hover:-translate-y-1"
              >
                Continue
              </button>
            </motion.div>
          </motion.div>
        )}
        
        {step === 2 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <motion.h2 
              variants={itemVariants} 
              className="text-xl md:text-2xl font-bold text-center text-white mb-4 md:mb-6 tracking-tight"
            >
              What's your risk tolerance?
            </motion.h2>
            
            <motion.div variants={itemVariants} className="space-y-6">
              <div className="space-y-3">
                <label className="block text-sm font-medium text-white/80">
                  Risk Tolerance
                </label>
                <div className="grid grid-cols-3 gap-2 md:gap-3">
                  {['low', 'medium', 'high'].map((risk) => (
                    <div key={risk}>
                      <input
                        type="radio"
                        id={`risk-${risk}`}
                        value={risk}
                        className="sr-only peer"
                        {...register('riskTolerance')}
                      />
                      <label
                        htmlFor={`risk-${risk}`}
                        className="flex flex-col items-center justify-center p-2 md:p-4 h-full bg-white/5 border border-white/10 rounded-xl cursor-pointer transition-all duration-200 peer-checked:bg-blue-500/20 peer-checked:border-blue-500/50 peer-checked:shadow-glow-blue hover:bg-white/10"
                      >
                        <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center mb-2 ${
                          risk === 'low' ? 'bg-green-500/20 text-green-400' :
                          risk === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {risk === 'low' && (
                            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                            </svg>
                          )}
                          {risk === 'medium' && (
                            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h8" />
                            </svg>
                          )}
                          {risk === 'high' && (
                            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </svg>
                          )}
                        </div>
                        <span className="capitalize text-white text-sm md:text-base font-medium">{risk}</span>
                        <span className="text-xs text-white/60 mt-1 hidden md:block">
                          {risk === 'low' ? 'Safety first' : 
                           risk === 'medium' ? 'Balanced approach' : 
                           'Higher rewards'}
                        </span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-3">
                <label className="block text-sm font-medium text-white/80">
                  Volatility Preference
                </label>
                <div className="grid grid-cols-3 gap-2 md:gap-3">
                  {['low', 'medium', 'high'].map((volatility) => (
                    <div key={volatility}>
                      <input
                        type="radio"
                        id={`volatility-${volatility}`}
                        value={volatility}
                        className="sr-only peer"
                        {...register('volatilityPreference')}
                      />
                      <label
                        htmlFor={`volatility-${volatility}`}
                        className="flex flex-col items-center justify-center p-2 md:p-4 h-full bg-white/5 border border-white/10 rounded-xl cursor-pointer transition-all duration-200 peer-checked:bg-purple-500/20 peer-checked:border-purple-500/50 peer-checked:shadow-glow-purple hover:bg-white/10"
                      >
                        <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center mb-2 ${
                          volatility === 'low' ? 'bg-blue-500/20 text-blue-400' :
                          volatility === 'medium' ? 'bg-purple-500/20 text-purple-400' :
                          'bg-pink-500/20 text-pink-400'
                        }`}>
                          <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                          </svg>
                        </div>
                        <span className="capitalize text-white text-sm md:text-base font-medium">{volatility}</span>
                        <span className="text-xs text-white/60 mt-1 hidden md:block">
                          {volatility === 'low' ? 'Stable returns' : 
                           volatility === 'medium' ? 'Some fluctuation' : 
                           'High fluctuation'}
                        </span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="flex space-x-3 pt-6">
              <button
                type="button"
                onClick={prevStep}
                className="w-1/3 py-3 px-4 bg-white/5 backdrop-blur-md hover:bg-white/10 text-white/80 font-medium rounded-xl shadow-sm transition-all duration-200 border border-white/10"
              >
                Back
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="w-2/3 py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all duration-200"
              >
                Continue
              </button>
            </motion.div>
          </motion.div>
        )}
        
        {step === 3 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <motion.h2 
              variants={itemVariants} 
              className="text-xl md:text-2xl font-bold text-center text-white mb-4 md:mb-6 tracking-tight"
            >
              Investment Strategy
            </motion.h2>
            
            <motion.div variants={itemVariants} className="space-y-6">
              <div className="space-y-3">
                <label className="block text-sm font-medium text-white/80">
                  Moonshot Rate
                </label>
                <div className="grid grid-cols-3 gap-2 md:gap-3">
                  {['conservative', 'balanced', 'aggressive'].map((rate) => (
                    <div key={rate}>
                      <input
                        type="radio"
                        id={`moonshot-${rate}`}
                        value={rate}
                        className="sr-only peer"
                        {...register('moonshotRate')}
                      />
                      <label
                        htmlFor={`moonshot-${rate}`}
                        className="flex flex-col items-center justify-center p-2 md:p-4 h-full bg-white/5 border border-white/10 rounded-xl cursor-pointer transition-all duration-200 peer-checked:bg-indigo-500/20 peer-checked:border-indigo-500/50 peer-checked:shadow-glow-indigo hover:bg-white/10"
                      >
                        <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center mb-2 ${
                          rate === 'conservative' ? 'bg-blue-500/20 text-blue-400' :
                          rate === 'balanced' ? 'bg-indigo-500/20 text-indigo-400' :
                          'bg-violet-500/20 text-violet-400'
                        }`}>
                          {rate === 'conservative' && (
                            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                          )}
                          {rate === 'balanced' && (
                            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v8m-5-4h10" />
                            </svg>
                          )}
                          {rate === 'aggressive' && (
                            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          )}
                        </div>
                        <span className="capitalize text-white text-sm md:text-base font-medium">{rate}</span>
                        <span className="text-xs text-white/60 mt-1 hidden md:block">
                          {rate === 'conservative' ? 'Fewer risks' : 
                           rate === 'balanced' ? 'Moderate risks' : 
                           'Higher risks'}
                        </span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="flex space-x-3 pt-6">
              <button
                type="button"
                onClick={prevStep}
                className="w-1/3 py-3 px-4 bg-white/5 backdrop-blur-md hover:bg-white/10 text-white/80 font-medium rounded-xl shadow-sm transition-all duration-200 border border-white/10"
              >
                Back
              </button>
              <button
                type="submit"
                className="w-2/3 py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all duration-200 transform hover:-translate-y-1"
              >
                Get Recommendations
              </button>
            </motion.div>
          </motion.div>
        )}
      </form>
    </div>
  );
}
