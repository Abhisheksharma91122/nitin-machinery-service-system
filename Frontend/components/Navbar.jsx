"use client";

import Link from 'next/link';
import Button from './Button';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md transition-all duration-300 shadow-sm">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 z-50">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-blue text-white font-bold transition-transform duration-300 hover:scale-105 shadow-md">
            NM
          </div>
          <Link href="/" className="text-2xl font-bold tracking-tight text-brand-blue hover:opacity-80 transition-opacity">
            Nitin Machinery
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-8 items-center bg-zinc-50/50 px-6 py-2 rounded-full border border-zinc-100">
          {navLinks.map((link) => {
            const isActive = pathname === link.path;
            return (
              <Link key={link.name} href={link.path} className={`text-sm font-semibold transition-all duration-300 relative group ${isActive ? 'text-brand-blue' : 'text-zinc-600 hover:text-brand-blue'}`}>
                {link.name}
                {isActive && (
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-brand-blue rounded-full"></span>
                )}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-blue rounded-full transition-all duration-300 group-hover:w-full opacity-0 group-hover:opacity-100"></span>
              </Link>
            )
          })}
        </nav>
        
        <div className="hidden md:flex items-center gap-4">
          <Link href="/service-request">
            <Button variant="primary" className="shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 rounded-full px-6 font-semibold">
              Request Service
            </Button>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-4 z-50">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-zinc-600 hover:text-brand-blue focus:outline-none transition-colors duration-300 p-2 bg-zinc-50 rounded-lg border border-zinc-100"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      <div 
        className={`md:hidden absolute top-20 left-0 w-full bg-white border-b border-zinc-200 shadow-2xl origin-top transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col space-y-2 px-4 py-6 bg-zinc-50/50">
          {navLinks.map((link) => {
            const isActive = pathname === link.path;
            return (
              <Link 
                key={link.name}
                href={link.path} 
                className={`text-lg font-medium p-4 rounded-xl transition-all duration-200 flex items-center ${isActive ? 'bg-brand-blue/10 text-brand-blue' : 'text-zinc-700 hover:bg-white hover:text-brand-blue hover:shadow-sm'}`}
              >
                {link.name}
              </Link>
            )
          })}
          
          <div className="pt-6 pb-2 border-t border-zinc-200 mt-4">
            <Link href="/service-request">
              <Button variant="primary" className="w-full justify-center shadow-md h-14 rounded-xl text-lg font-semibold">
                Request Service
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
