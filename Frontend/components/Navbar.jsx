import Link from 'next/link';
import Button from './Button';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          {/* Logo representation */}
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-blue text-white font-bold">
            NM
          </div>
          <Link href="/" className="text-xl font-bold tracking-tight text-brand-blue">
            Nitin Machinery
          </Link>
        </div>
        
        <nav className="hidden md:flex gap-6">
          <Link href="/" className="text-sm font-medium text-zinc-600 hover:text-brand-blue transition-colors">Home</Link>
          <a href="#services" className="text-sm font-medium text-zinc-600 hover:text-brand-blue transition-colors">Services</a>
          <a href="#contact" className="text-sm font-medium text-zinc-600 hover:text-brand-blue transition-colors">Contact</a>
        </nav>
        
        <div className="flex items-center gap-4">
          <Link href="/service-request">
            <Button variant="primary">Request Service</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
