import Link from 'next/link';
import { Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-zinc-950 text-zinc-400 py-16 mt-auto border-t border-brand-blue/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-8">
        
        {/* Brand Info */}
        <div className="md:col-span-1 lg:col-span-1">
          <Link href="/" className="flex items-center gap-2 mb-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-blue text-white font-bold">
              NM
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Nitin Machinery
            </span>
          </Link>
          <p className="text-sm leading-relaxed mb-6">
            Your specialist partner for High HP Motor Rewinding, Transformer Repairs, and essential industrial machinery maintenance in MIDC areas since 1996.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white text-lg font-bold mb-6">Quick Links</h3>
          <ul className="space-y-3 text-sm flex flex-col">
            <li><Link href="/" className="hover:text-brand-light transition-colors">Home</Link></li>
            <li><Link href="/about" className="hover:text-brand-light transition-colors">About Us</Link></li>
            <li><Link href="/services" className="hover:text-brand-light transition-colors">Our Services</Link></li>
            <li><Link href="/service-request" className="hover:text-brand-light transition-colors">Request Service</Link></li>
            <li><Link href="/contact" className="hover:text-brand-light transition-colors">Contact Us</Link></li>
          </ul>
        </div>

        {/* Services Links */}
        <div>
          <h3 className="text-white text-lg font-bold mb-6">Key Services</h3>
          <ul className="space-y-3 text-sm flex flex-col">
            <li><Link href="/services#rewinding" className="hover:text-brand-light transition-colors">Motor Rewinding</Link></li>
            <li><Link href="/services#pumps" className="hover:text-brand-light transition-colors">Pump Sales & Spares</Link></li>
            <li><Link href="/services#engines" className="hover:text-brand-light transition-colors">Engine Repair</Link></li>
            <li><Link href="/services#press" className="hover:text-brand-light transition-colors">Hydraulic Press Work</Link></li>
            <li><Link href="/services#amc" className="hover:text-brand-light transition-colors">AMC Contracts</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-white text-lg font-bold mb-6">Contact Info</h3>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-brand-blue shrink-0 mt-0.5" />
              <span>593, Near Ronak Lawn, Pune Highway, Sinnar, Nashik - 422103</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-brand-blue shrink-0" />
              <span>+91 98501 30575 <br/> +91 96995 77380</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-brand-blue shrink-0" />
              <a href="mailto:info@nitinmachinery.in" className="hover:text-brand-light transition-colors">info@nitinmachinery.in</a>
            </li>
          </ul>
        </div>

      </div>
      
      {/* Bottom Bar */}
      <div className="border-t border-zinc-900 mt-16 pt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
        <p>&copy; {new Date().getFullYear()} Nitin Machinery. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
