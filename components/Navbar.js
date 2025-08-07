'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbarcmp() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeHover, setActiveHover] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Airports', href: '#Airports' },
    { name: 'Blogs', href: '/blog' },
    { name: 'Help', href: '/help' },
  ];

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-gray-900/90 backdrop-blur-md py-2 border-b border-gray-800' : 'bg-transparent py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo with animation */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, type: 'spring' }}
            className="flex items-center"
          >
            <Link href="/" className="flex items-center space-x-2 magnetic">
              <motion.div 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {/* Replace with your logo.png */}
                  <img 
                    src="/favicon.jpg" 
                    alt="Simple Parking Logo"
                    className={`h-12 w-auto rounded-md ${scrolled ? 'opacity-100' : 'opacity-90'}`}
                  />
              </motion.div>

              <motion.span 
                className={`text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${scrolled ? 'from-indigo-400 to-purple-400' : 'from-indigo-300 to-purple-300'}`}
                whileHover={{ scale: 1.05 }}
              >
                Simple parking  
              </motion.span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1, type: 'spring' }}
                onHoverStart={() => setActiveHover(index)}
                onHoverEnd={() => setActiveHover(null)}
                className="relative"
              >
                <Link
                  href={link.href}
                  className={`relative px-4 py-3 text-sm font-medium transition-colors magnetic ${
                    scrolled ? 'text-gray-300 hover:text-white' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
                
                {/* Animated underline */}
                {activeHover === index && (
                  <motion.div 
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-indigo-400 to-purple-400"
                    layoutId="navHover"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    exit={{ scaleX: 0 }}
                    transition={{ duration: 0.3, type: 'spring', bounce: 0.25 }}
                  />
                )}
              </motion.div>
            ))}
            
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: navLinks.length * 0.1, type: 'spring' }}
              className="ml-4"
            >
              <Link
                href="/Manage-booking"
                className={`px-5 py-2.5 rounded-full font-medium transition-all relative overflow-hidden group ${
                  scrolled ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white' : 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white'
                }`}
              >
                <span className="relative z-10">Manage Booking</span>
                <span className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </Link>
            </motion.div>
          </nav>

          {/* Mobile menu button - futuristic design */}
          <div className="md:hidden flex items-center">
            <motion.button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-full focus:outline-none ${
                scrolled ? 'bg-gray-800 text-white' : 'bg-gray-800/80 text-white'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation - Enhanced with animations */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden"
          >
            <div className={`px-4 pt-2 pb-6 ${scrolled ? 'bg-gray-900/95 backdrop-blur-md' : 'bg-gray-900/95 backdrop-blur-md'}`}>
              <motion.div 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ staggerChildren: 0.1 }}
                className="flex flex-col space-y-1"
              >
                {navLinks.map((link, index) => (
                  <motion.div
                    key={index}
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Link
                      href={link.href}
                      className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                        scrolled ? 'text-gray-300 hover:bg-gray-800 hover:text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: navLinks.length * 0.1 }}
                  className="mt-2"
                >
                  <Link
                    href="/login"
                    className={`block px-4 py-3 rounded-lg text-base font-medium text-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500 transition-all`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Manage Booking
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}