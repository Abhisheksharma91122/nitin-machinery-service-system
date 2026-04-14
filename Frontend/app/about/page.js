"use client";

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { CheckCircle, Users, Target, ShieldCheck } from 'lucide-react';

export default function About() {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const values = [
    {
      title: 'Technical Precision',
      description: 'High-grade materials & rigorous testing to ensure your equipment runs flawlessly.',
      icon: Target,
    },
    {
      title: 'Long-term Relationships',
      description: 'We prioritize client success over quick fixes. Your consistent uptime is our core objective.',
      icon: Users,
    },
    {
      title: 'Local Speed',
      description: 'Rapid response for Sinnar & Nashik units to minimize downtime and revenue loss.',
      icon: CheckCircle,
    },
    {
      title: 'Guaranteed Quality',
      description: 'We stand by our work with solid guarantees and continuous support programs.',
      icon: ShieldCheck,
    }
  ];

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-zinc-900 py-24 lg:py-32">
          <div className="absolute inset-0 bg-[url('/motor.avif')] bg-cover bg-center opacity-20"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent"></div>
          <motion.div 
            className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl mb-6">
              About Nitin Machinery
            </h1>
            <p className="mt-4 text-xl text-zinc-300 max-w-3xl mx-auto leading-relaxed">
              Your specialist partner for High HP Motor Rewinding, Transformer Repairs, and essential industrial machinery maintenance since 1996.
            </p>
          </motion.div>
        </section>

        {/* Story Section */}
        <section className="py-20 lg:py-28 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={fadeIn}
              >
                <div className="inline-block py-1 px-3 rounded-full bg-brand-blue/10 text-brand-blue text-sm font-semibold tracking-wider mb-6">
                  OUR LEGACY
                </div>
                <h2 className="text-3xl font-extrabold text-zinc-900 mb-6 lg:text-4xl leading-tight">
                  Powering Industry for Nearly Three Decades
                </h2>
                <div className="space-y-6 text-lg text-zinc-600 leading-relaxed">
                  <p>
                    Established in the heart of the MIDC industrial area, Nitin Machinery has grown to become the most trusted name in motor rewinding, pump sales, and heavy machinery repair. We don't just repair equipment; we ensure the heartbeat of your production line never stops.
                  </p>
                  <p>
                    We understand that in an MIDC unit, downtime is lost revenue. That’s why our approach is built on technical precision and customer longevity. From 400-ton hydraulic presses to precision hose crimping, we've invested in the technology needed to solve complex industrial problems fast.
                  </p>
                </div>
              </motion.div>

              <motion.div 
                className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="absolute inset-0 bg-[url('/press.avif')] bg-cover bg-center"></div>
                <div className="absolute inset-0 bg-brand-blue/20 mix-blend-multiply"></div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-zinc-50 border-t border-zinc-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 mb-4">Our Core Values</h2>
              <p className="text-xl text-zinc-600 max-w-2xl mx-auto">The principles that guide our daily operations and guarantee your satisfaction.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <motion.div 
                  key={index}
                  className="bg-white rounded-2xl p-8 shadow-sm border border-zinc-100 flex flex-col items-center text-center hover:shadow-lg transition-shadow duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="h-16 w-16 bg-brand-blue/10 text-brand-blue rounded-full flex items-center justify-center mb-6">
                    <value.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900 mb-3">{value.title}</h3>
                  <p className="text-zinc-600">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
