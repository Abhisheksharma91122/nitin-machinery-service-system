"use client";

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Button from '@/components/Button';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Settings,
  Activity,
  CheckCircle,
  ArrowRight,
  ShieldCheck,
  Star,
  Users
} from 'lucide-react';

export default function Home() {
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    initial: {},
    whileInView: { transition: { staggerChildren: 0.1 } },
    viewport: { once: true, margin: "-100px" }
  };

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 overflow-hidden">
      <Navbar />

      <main className="flex-1">
        {/* Animated Hero Section */}
        <section className="relative overflow-hidden bg-brand-blue py-32 lg:py-48 text-brand-white">
          <div className="absolute inset-0 bg-[url('/motor.avif')] bg-cover bg-center opacity-20 mix-blend-overlay animate-pulse-slow"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-brand-blue/50 via-brand-blue/80 to-brand-blue/95"></div>
          
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div 
              className="max-w-4xl text-center mx-auto"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.span 
                className="inline-block py-1.5 px-4 rounded-full bg-brand-light/10 border border-brand-light/20 text-brand-light text-sm font-semibold tracking-wider mb-8 shadow-sm backdrop-blur-sm"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                EXPERT MOTOR REWINDING & PUMP SOLUTIONS
              </motion.span>
              <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl text-white mb-6 leading-tight">
                Powering Industry for <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-light to-blue-200">Nearly Three Decades</span>
              </h1>
              <p className="mt-6 text-xl lg:text-2xl text-blue-100/90 max-w-2xl mx-auto mb-12 leading-relaxed font-light">
                We don't just repair equipment; we ensure the heartbeat of your production line never stops. Technical precision in MIDC areas.
              </p>
              
              <motion.div 
                className="flex items-center justify-center gap-4 flex-col sm:flex-row"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <Link href="/services">
                  <Button variant="primary" className="!bg-white !text-blue-900 hover:!bg-blue-50 border-0 h-14 px-8 text-lg font-bold rounded-full shadow-[0_0_40px_-10px_rgba(255,255,255,0.5)] transition-all hover:scale-105 hover:shadow-[0_0_60px_-15px_rgba(255,255,255,0.6)] duration-300 flex items-center gap-2 group">
                    Explore Services <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" className="!border-white/40 !text-white !bg-transparent hover:!bg-white/10 hover:!text-white h-14 px-8 text-lg font-semibold rounded-full backdrop-blur-sm transition-all duration-300">
                    Contact Us Today
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
          
          {/* Decorative shapes */}
          <div className="absolute top-1/4 left-10 w-72 h-72 bg-brand-light/20 rounded-full blur-3xl opacity-50 mix-blend-screen pointer-events-none"></div>
          <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl opacity-50 mix-blend-screen pointer-events-none"></div>
        </section>

        {/* Why Choose Us / Advantage Section */}
        <section className="py-20 lg:py-32 bg-white relative">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="text-center mb-16"
              variants={fadeInUp}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl">The Nitin Machinery Advantage</h2>
              <p className="mt-4 text-xl text-zinc-600 max-w-2xl mx-auto">Why industrial units across Maharashtra trust us with their critical equipment.</p>
            </motion.div>

            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-10"
              variants={staggerContainer}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true }}
            >
              {[
                { icon: Settings, title: "Technical Precision", desc: "High-grade materials & rigorous testing to ensure your equipment runs flawlessly." },
                { icon: CheckCircle, title: "Long-term Focus", desc: "We prioritize client success over quick fixes. Your consistent uptime is our core objective." },
                { icon: Activity, title: "Local Speed", desc: "Rapid response for Sinnar & Nashik units to minimize downtime and revenue loss." }
              ].map((feature, idx) => (
                <motion.div 
                  key={idx}
                  variants={{
                    initial: { opacity: 0, y: 20 },
                    whileInView: { opacity: 1, y: 0 }
                  }}
                  className="group flex flex-col items-center text-center p-8 bg-white rounded-3xl border border-zinc-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_-20px_rgba(0,0,0,0.1)] hover:border-brand-blue/20"
                >
                  <div className="h-20 w-20 bg-gradient-to-br from-blue-50 to-brand-blue/10 text-brand-blue rounded-2xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                    <feature.icon className="h-10 w-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-zinc-900 mb-4">{feature.title}</h3>
                  <p className="text-zinc-600 leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Highlight Service / CTA Section */}
        <section className="py-24 bg-zinc-900 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-[url('/engine.avif')] bg-cover bg-center opacity-20 mix-blend-luminosity"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-transparent"></div>
          
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <div className="inline-flex items-center gap-2 py-1 px-3 rounded-full bg-brand-light/10 text-brand-light text-sm font-semibold mb-6">
                  <Star className="w-4 h-4" /> COMPREHENSIVE SERVICE
                </div>
                <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl mb-6 leading-tight">
                  From High HP Motors <br/> to Hydraulic Systems
                </h2>
                <p className="text-xl text-zinc-400 mb-8 leading-relaxed max-w-lg">
                  Explore our extensive portfolio of services, including pump repairs, diesel engine overhauling, transformer maintenance, and more. We have the expertise to handle it all.
                </p>
                <Link href="/services">
                  <Button variant="primary" className="h-14 px-8 text-lg font-bold rounded-full !bg-brand-blue hover:!bg-blue-600 border-0 flex items-center gap-2 group">
                    View All Services <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </motion.div>
              
              <div className="hidden lg:block relative h-full">
                {/* Decorative floating elements could go here */}
              </div>
            </div>
          </div>
        </section>

        {/* Quick Stats / Trust Section */}
        <section className="py-20 bg-brand-blue text-white border-t border-brand-blue/20">
           <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-white/10">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once:true }}>
                  <div className="text-4xl md:text-5xl font-black mb-2">25+</div>
                  <div className="text-blue-200 text-sm md:text-base font-medium tracking-wide">YEARS EXP.</div>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once:true }} transition={{ delay: 0.1}}>
                  <div className="text-4xl md:text-5xl font-black mb-2">500+</div>
                  <div className="text-blue-200 text-sm md:text-base font-medium tracking-wide">CLIENTS SECURED</div>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once:true }} transition={{ delay: 0.2}}>
                  <div className="text-4xl md:text-5xl font-black mb-2">24/7</div>
                  <div className="text-blue-200 text-sm md:text-base font-medium tracking-wide">EMERGENCY SUPPORT</div>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once:true }} transition={{ delay: 0.3}}>
                  <div className="text-4xl md:text-5xl font-black mb-2">100%</div>
                  <div className="text-blue-200 text-sm md:text-base font-medium tracking-wide">QUALITY ASSURED</div>
                </motion.div>
              </div>
           </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
