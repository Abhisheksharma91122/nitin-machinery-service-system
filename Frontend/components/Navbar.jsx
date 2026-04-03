"use client";

import Link from 'next/link';
import Button from './Button';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md transition-all duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 z-50">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-blue text-white font-bold transition-transform duration-300 hover:scale-105">
            NM
          </div>
          <Link href="/" className="text-xl font-bold tracking-tight text-brand-blue hover:opacity-80 transition-opacity">
            Nitin Machinery
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-8">
          <Link href="/" className="text-sm font-medium text-zinc-600 hover:text-brand-blue transition-colors duration-300">Home</Link>
          <a href="#services" className="text-sm font-medium text-zinc-600 hover:text-brand-blue transition-colors duration-300">Services</a>
          <a href="#contact" className="text-sm font-medium text-zinc-600 hover:text-brand-blue transition-colors duration-300">Contact</a>
        </nav>
        
        <div className="hidden md:flex items-center gap-4">
          <Link href="/service-request">
            <Button variant="primary" className="shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
              Request Service
            </Button>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-4 z-50">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-zinc-600 hover:text-brand-blue focus:outline-none transition-colors duration-300 p-2"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      <div 
        className={`md:hidden absolute top-16 left-0 w-full bg-white border-b border-zinc-200 shadow-lg origin-top transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col space-y-4 px-4 py-6">
          <Link 
            href="/" 
            className="text-base font-medium text-zinc-700 hover:text-brand-blue hover:bg-zinc-50 p-3 rounded-lg transition-colors duration-200"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <a 
            href="#services" 
            className="text-base font-medium text-zinc-700 hover:text-brand-blue hover:bg-zinc-50 p-3 rounded-lg transition-colors duration-200"
            onClick={() => setIsMenuOpen(false)}
          >
            Services
          </a>
          <a 
            href="#contact" 
            className="text-base font-medium text-zinc-700 hover:text-brand-blue hover:bg-zinc-50 p-3 rounded-lg transition-colors duration-200"
            onClick={() => setIsMenuOpen(false)}
          >
            Contact
          </a>
          <Link 
            href="/service-request"
            onClick={() => setIsMenuOpen(false)}
            className="pt-2"
          >
            <Button variant="primary" className="w-full justify-center shadow-md">
              Request Service
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
