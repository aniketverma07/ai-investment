import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

// Mock data for the dashboard
const cryptoData = [
  {
    id: 1,
    name: 'Bitcoin',
    symbol: 'BTC',
    apy: '4.55% APY',
    price: '$320.00',
    change: '+4.50%',
    changeType: 'positive',
    marketPrice: '$2500.00',
    chartColor: 'blue',
    logo: '/images/bitcoin.svg'
  },
  {
    id: 2,
    name: 'Ethereum',
    symbol: 'ETH',
    apy: '3.21% APY',
    price: '$150.68',
    change: '-4.71%',
    changeType: 'negative',
    marketPrice: '$1400.20',
    chartColor: 'red',
    logo: '/images/ethereum.svg'
  },
  {
    id: 3,
    name: 'Monero',
    symbol: 'XMR',
    apy: '3.15% APY',
    price: '$310.20',
    change: '-2.50%',
    changeType: 'negative',
    marketPrice: '$1500.60',
    chartColor: 'red',
    logo: '/images/monero.svg'
  },
  {
    id: 4,
    name: 'Solana',
    symbol: 'SOL',
    apy: '5.10% APY',
    price: '$100.15',
    change: '+1.80%',
    changeType: 'positive',
    marketPrice: '$2100.40',
    chartColor: 'blue',
    logo: '/images/solana.svg'
  },
  {
    id: 5,
    name: 'Avalanche',
    symbol: 'AVAX',
    apy: '4.75% APY',
    price: '$140.54',
    change: '-5.10%',
    changeType: 'negative',
    marketPrice: '$1500.20',
    chartColor: 'red',
    logo: '/images/avalanche.svg'
  },
  {
    id: 6,
    name: 'Cosmos',
    symbol: 'ATOM',
    apy: '3.80% APY',
    price: '$230.10',
    change: '-2.50%',
    changeType: 'negative',
    marketPrice: '$1020.85',
    chartColor: 'red',
    logo: '/images/cosmos.svg'
  },
  {
    id: 7,
    name: 'Litecoin',
    symbol: 'LTC',
    apy: '2.95% APY',
    price: '$240.60',
    change: '-1.85%',
    changeType: 'negative',
    marketPrice: '$1300.32',
    chartColor: 'red',
    logo: '/images/litecoin.svg'
  },
  {
    id: 8,
    name: 'Tether USD',
    symbol: 'USDT',
    apy: '1.50% APY',
    price: '$180.80',
    change: '+0.10%',
    changeType: 'positive',
    marketPrice: '$1700.50',
    chartColor: 'blue',
    logo: '/images/tether.svg'
  },
  {
    id: 9,
    name: 'Dogecoin',
    symbol: 'DOGE',
    apy: '2.10% APY',
    price: '$200.30',
    change: '-1.70%',
    changeType: 'negative',
    marketPrice: '$1150.70',
    chartColor: 'red',
    logo: '/images/dogecoin.svg'
  },
  {
    id: 10,
    name: 'Binance',
    symbol: 'BNB',
    apy: '3.55% APY',
    price: '$260.31',
    change: '+0.11%',
    changeType: 'positive',
    marketPrice: '$2600.40',
    chartColor: 'blue',
    logo: '/images/binance.svg'
  }
];

const topMovers = [
  {
    name: 'Bitcoin',
    symbol: 'BTC',
    price: '$54.20',
    change: '+3.75%',
    logo: '/images/bitcoin.svg'
  },
  {
    name: 'Ethereum',
    symbol: 'ETH',
    price: '$58.50',
    change: '+2.10%',
    logo: '/images/ethereum.svg'
  },
  {
    name: 'Tether USD',
    symbol: 'USDT',
    price: '$53.10',
    change: '+0.05%',
    logo: '/images/tether.svg'
  },
  {
    name: 'Binance',
    symbol: 'BNB',
    price: '$810.90',
    change: '+5.95%',
    logo: '/images/binance.svg'
  },
  {
    name: 'Litecoin',
    symbol: 'LTC',
    price: '$87.60',
    change: '+2.80%',
    logo: '/images/litecoin.svg'
  },
  {
    name: 'Monero',
    symbol: 'XMR',
    price: '$81.10',
    change: '+1.45%',
    logo: '/images/monero.svg'
  }
];

// Chart component (simplified for this example)
const MiniChart = ({ color }: { color: string }) => {
  const getPath = () => {
    if (color === 'blue') {
      return "M0,10 L5,8 L10,12 L15,7 L20,9 L25,5 L30,8 L35,3 L40,6";
    } else {
      return "M0,5 L5,7 L10,4 L15,9 L20,6 L25,10 L30,7 L35,12 L40,8";
    }
  };

  return (
    <svg width="60" height="20" viewBox="0 0 60 20" className="ml-2">
      <path
        d={getPath()}
        fill="none"
        stroke={color === 'blue' ? '#3b82f6' : '#ef4444'}
        strokeWidth="1.5"
      />
    </svg>
  );
};

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('prices');
  const [filterType, setFilterType] = useState('watchlist');

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center">
            <div className="bg-blue-500 rounded-full w-10 h-10 flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold">pulse</h1>
          </div>
          
          <nav className="flex space-x-6 text-gray-400">
            <a href="#" className="hover:text-white font-medium text-white">Home</a>
            <a href="#" className="hover:text-white font-medium">My Assets</a>
            <a href="#" className="hover:text-white font-medium">Trade</a>
            <a href="#" className="hover:text-white font-medium">Earn</a>
            <a href="#" className="hover:text-white font-medium">Rewards</a>
            <a href="#" className="hover:text-white font-medium">Watch</a>
            <a href="#" className="hover:text-white font-medium">News</a>
          </nav>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search for an asset..." 
                className="bg-gray-800 rounded-full py-2 px-4 pl-10 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            <button className="bg-blue-600 hover:bg-blue-700 rounded-full py-2 px-4 font-medium transition duration-200">
              Buy & Sell
            </button>
            
            <button className="bg-gray-800 hover:bg-gray-700 rounded-full py-2 px-4 font-medium transition duration-200">
              Send & Receive
            </button>
            
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
              <span className="font-medium">A</span>
            </div>
          </div>
        </header>
        
        {/* Main Content */}
        <main>
          {/* Tabs */}
          <div className="flex justify-between items-center mb-6">
            <div className="text-xl font-bold">Prices</div>
            <div className="flex space-x-2">
              <button 
                className={`px-4 py-2 rounded-full text-sm font-medium ${filterType === 'watchlist' ? 'bg-gray-800' : 'bg-transparent'}`}
                onClick={() => setFilterType('watchlist')}
              >
                Watchlist
              </button>
              <button 
                className={`px-4 py-2 rounded-full text-sm font-medium ${filterType === 'see-less' ? 'bg-gray-800' : 'bg-transparent'}`}
                onClick={() => setFilterType('see-less')}
              >
                See Less
              </button>
            </div>
          </div>
          
          {/* Crypto Table */}
          <div className="grid grid-cols-1 gap-6 mb-8">
            <div className="bg-gray-800 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-gray-400 text-sm border-b border-gray-700">
                      <th className="py-4 px-6 text-left">#</th>
                      <th className="py-4 px-6 text-left">Name</th>
                      <th className="py-4 px-6 text-right">Price</th>
                      <th className="py-4 px-6 text-right">Chart</th>
                      <th className="py-4 px-6 text-right">Change</th>
                      <th className="py-4 px-6 text-right">Market Price</th>
                      <th className="py-4 px-6 text-center">Buy</th>
                      <th className="py-4 px-6 text-center"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {cryptoData.map((crypto) => (
                      <motion.tr 
                        key={crypto.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: crypto.id * 0.05 }}
                        className="border-b border-gray-700 hover:bg-gray-750"
                      >
                        <td className="py-4 px-6">{crypto.id}</td>
                        <td className="py-4 px-6">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center mr-3">
                              {crypto.symbol.charAt(0)}
                            </div>
                            <div>
                              <div className="font-medium">{crypto.name}</div>
                              <div className="text-gray-400 text-sm">{crypto.symbol} | {crypto.apy}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-right font-medium">{crypto.price}</td>
                        <td className="py-4 px-6 text-right">
                          <MiniChart color={crypto.chartColor} />
                        </td>
                        <td className={`py-4 px-6 text-right font-medium ${crypto.changeType === 'positive' ? 'text-green-500' : 'text-red-500'}`}>
                          {crypto.change}
                        </td>
                        <td className="py-4 px-6 text-right font-medium">{crypto.marketPrice}</td>
                        <td className="py-4 px-6 text-center">
                          <button className="bg-blue-600 hover:bg-blue-700 rounded-full py-1 px-6 text-sm font-medium transition duration-200">
                            Buy
                          </button>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <button className="text-gray-400 hover:text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                            </svg>
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          {/* Top Movers and Promo */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Top Movers</h2>
                <button className="text-sm text-gray-400 hover:text-white">See All</button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {topMovers.map((mover, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-gray-800 rounded-xl p-4"
                  >
                    <div className="flex items-center mb-2">
                      <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center mr-3">
                        {mover.symbol.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium">{mover.name}</div>
                        <div className="text-gray-400 text-sm">{mover.symbol}</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="font-bold">{mover.price}</div>
                      <div className="text-green-500 font-medium">{mover.change}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            
            <div>
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-gray-800 rounded-xl p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold mb-2">Transfer your crypto into Pulse.</h3>
                    <p className="text-gray-400 text-sm mb-4">
                      Pulse provides the most secure environment for safeguarding your cryptocurrency assets.
                    </p>
                  </div>
                  <div className="w-16 h-16 bg-blue-900 rounded-lg flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                </div>
                <a href="#" className="text-blue-500 hover:text-blue-400 flex items-center text-sm font-medium">
                  Store your crypto
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </motion.div>
            </div>
          </div>
        </main>
      </motion.div>
    </div>
  );
};

export default Dashboard;
