'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-black/90 backdrop-blur-xl border-t border-white/5 pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="relative w-8 h-8">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl"></div>
                <div className="absolute inset-[2px] bg-black/90 rounded-[10px] flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 4L4 8L12 12L20 8L12 4Z" stroke="url(#paint0_linear)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M4 16L12 20L20 16" stroke="url(#paint1_linear)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M4 12L12 16L20 12" stroke="url(#paint2_linear)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <defs>
                      <linearGradient id="paint0_linear" x1="4" y1="8" x2="20" y2="8" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#3B82F6"/>
                        <stop offset="1" stopColor="#8B5CF6"/>
                      </linearGradient>
                      <linearGradient id="paint1_linear" x1="4" y1="18" x2="20" y2="18" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#3B82F6"/>
                        <stop offset="1" stopColor="#8B5CF6"/>
                      </linearGradient>
                      <linearGradient id="paint2_linear" x1="4" y1="14" x2="20" y2="14" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#3B82F6"/>
                        <stop offset="1" stopColor="#8B5CF6"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 tracking-tight font-sans">
                  CryptoSage
                </h3>
              </div>
            </div>
            <p className="text-sm text-white/60 mb-6 leading-relaxed font-light">
              Advanced AI-powered cryptocurrency investment advisor helping you make smarter decisions with data-driven insights.
            </p>
            <div className="flex gap-5">
              <Link href="#" className="text-white/40 hover:text-white/90 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                </svg>
              </Link>
              <Link href="#" className="text-white/40 hover:text-white/90 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </Link>
              <Link href="#" className="text-white/40 hover:text-white/90 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
                </svg>
              </Link>
            </div>
          </div>
          
          <div className="md:col-span-2">
            <h3 className="text-sm font-medium text-white mb-6 tracking-wide">Resources</h3>
            <ul className="space-y-4 text-sm">
              <li><Link href="#" className="text-white/60 hover:text-white transition-colors font-light">Market Analysis</Link></li>
              <li><Link href="#" className="text-white/60 hover:text-white transition-colors font-light">Investment Strategies</Link></li>
              <li><Link href="#" className="text-white/60 hover:text-white transition-colors font-light">Risk Management</Link></li>
              <li><Link href="#" className="text-white/60 hover:text-white transition-colors font-light">Crypto Glossary</Link></li>
            </ul>
          </div>
          
          <div className="md:col-span-2">
            <h3 className="text-sm font-medium text-white mb-6 tracking-wide">Company</h3>
            <ul className="space-y-4 text-sm">
              <li><Link href="#" className="text-white/60 hover:text-white transition-colors font-light">About</Link></li>
              <li><Link href="#" className="text-white/60 hover:text-white transition-colors font-light">Careers</Link></li>
              <li><Link href="#" className="text-white/60 hover:text-white transition-colors font-light">Blog</Link></li>
              <li><Link href="#" className="text-white/60 hover:text-white transition-colors font-light">Contact</Link></li>
            </ul>
          </div>
          
          <div className="md:col-span-4">
            <h3 className="text-sm font-medium text-white mb-6 tracking-wide">Stay Updated</h3>
            <p className="text-sm text-white/60 mb-6 font-light">
              Get the latest insights on cryptocurrency markets and investment strategies.
            </p>
            <form className="flex flex-col space-y-3">
              <input 
                type="email" 
                placeholder="Email address" 
                className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm text-white w-full"
              />
              <button 
                type="submit"
                className="px-4 py-3 bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-lg text-white text-sm font-medium transition-all border border-white/10"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-white/40 font-light">
            {currentYear} CryptoSage. All rights reserved. <span className="block md:inline mt-1 md:mt-0">This is a demo application. Not financial advice.</span>
          </p>
          <div className="mt-6 md:mt-0 flex gap-6 text-xs text-white/40">
            <Link href="#" className="hover:text-white/70 transition-colors font-light">Privacy</Link>
            <Link href="#" className="hover:text-white/70 transition-colors font-light">Terms</Link>
            <Link href="#" className="hover:text-white/70 transition-colors font-light">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
