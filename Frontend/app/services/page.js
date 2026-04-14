"use client";

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Button from '@/components/Button';
import Image from "next/image";
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Droplet,
  Settings,
  Activity,
  ArrowDownToLine,
  Link as LinkIcon,
  Zap,
  Wrench,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';


export default function Services() {
  const servicesData = [
    {
      id: 'pumps',
      title: 'Pump Sales & Spares',
      description: 'Authorized dealers for leading industrial pumps. Complete sales support and genuine spare parts.',
      details: ['New Submersible & Open-well', 'Stockist of Genuine Spares', 'Sales of New AC/DC Motors'],
      icon: Droplet,
      image: "/pump.avif",
    },
    {
      id: 'engines',
      title: 'Diesel/Petrol Engine Repair',
      description: 'Specialized workshop for construction and industrial engines. Petrol/Diesel Engine Overhauling.',
      details: ['Repairing of Vibrators & Mixers', 'Petrol/Diesel Engine Overhauling', 'Genuine Spares (Pistons, Filters)'],
      icon: Settings,
      image: "/engine.avif",
    },
    {
      id: 'rewinding',
      title: 'Motor Rewinding',
      description: 'Precision rewinding using high-grade copper and Class-H insulation for high HP motors.',
      details: ['AC/DC Motor Rewinding', 'High HP Motor Restoration', 'Stator & Rotor Varnishing'],
      icon: Activity,
      image: "/motor.avif",
    },
    {
      id: 'press',
      title: '400-Ton Hydraulic Press',
      description: 'Removal of seized bearings, heavy pin & bushing work, and industrial straightening jobs.',
      details: ['Removal of Seized Bearings', 'Heavy Pin & Bushing Work', 'Industrial Straightening Jobs'],
      icon: ArrowDownToLine,
      image: "/press.avif",
    },
    {
      id: 'crimping',
      title: 'Hose Pipe Crimping',
      description: 'High-pressure hydraulic hoses and custom fittings assembly with precision machine crimping.',
      details: ['High-Pressure Hydraulic Hoses', 'Custom Fittings Assembly', 'Precision Machine Crimping'],
      icon: LinkIcon,
      image: "/hose-crimping.jpg",
    },
    {
      id: 'transformers',
      title: 'Transformer Services',
      description: 'Comprehensive rewinding and maintenance services for industrial transformers.',
      details: ['Transformer Rewinding', 'General Maintenance', 'Oil Filtering & Testing'],
      icon: Zap,
      image: "/transformer.jpg",
    },
    {
      id: 'repair',
      title: 'Pump Repair Services',
      description: 'Submersible & centrifugal repair, impeller & seal change, and site installation support.',
      details: ['Submersible & Centrifugal Repair', 'Impeller & Seal Change', 'Site Installation Support'],
      icon: Wrench,
      image: "/pump.avif",
    },
    {
      id: 'amc',
      title: 'Annual Maintenance (AMC)',
      description: 'Factory-wide motor inspection, priority breakdown response, and reduced repair costs.',
      details: ['Factory-wide Motor Inspection', 'Priority Breakdown Response', 'Reduced Repair Costs'],
      icon: ShieldCheck,
      image: "/amc.avif",
    }
  ];

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50">
      <Navbar />

      <main className="flex-1">
        {/* Header */}
        <section className="bg-brand-blue py-20 lg:py-24 text-center">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.h1
              className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Our Service Portfolio
            </motion.h1>
            <motion.p
              className="mt-4 text-xl text-blue-100 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Comprehensive care and expert repair solutions for your industrial equipment. We cover everything from high HP motors to hydraulic systems.
            </motion.p>
          </div>
        </section>

        {/* Detailed Services list */}
        <section className="py-20 lg:py-28 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-24">
            {servicesData.map((service, index) => (
              <motion.div
                key={service.id}
                id={service.id}
                className={`flex flex-col lg:flex-row gap-12 lg:gap-20 items-center ${index % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
              >
                <div className="w-full lg:w-1/2">
                  <div className="relative h-[300px] sm:h-[400px] w-full rounded-3xl overflow-hidden shadow-2xl">
                    <div className="absolute inset-0 bg-brand-blue/10 mix-blend-overlay z-10 transition-opacity duration-300 hover:opacity-0"></div>
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                </div>

                <div className="w-full lg:w-1/2 flex flex-col justify-center">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-blue/10 text-brand-blue mb-6">
                    <service.icon className="h-8 w-8" />
                  </div>
                  <h2 className="text-3xl font-bold text-zinc-900 mb-4 leading-tight">{service.title}</h2>
                  <p className="text-lg text-zinc-600 mb-8 leading-relaxed">
                    {service.description}
                  </p>

                  <div className="bg-zinc-50 rounded-2xl p-6 border border-zinc-100 shadow-sm mb-8">
                    <h4 className="font-semibold text-zinc-900 mb-4 bg-white/50 inline-block px-3 py-1 rounded-md text-sm border border-zinc-200">Key Features:</h4>
                    <ul className="space-y-3">
                      {service.details.map((detail, idx) => (
                        <li key={idx} className="flex items-start text-zinc-700">
                          <ChevronRight className="h-5 w-5 text-brand-blue shrink-0 mr-2" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <Link href={`/service-request?service=${encodeURIComponent(service.title)}`}>
                      <Button variant="primary" className="rounded-full px-8 shadow-md hover:shadow-lg transition-all duration-300">
                        Request this Service
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* AMC CTA */}
        <section className="py-20 bg-zinc-900 text-white text-center">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <ShieldCheck className="h-16 w-16 text-brand-light mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4 sm:text-4xl">Secure Your Operations with Our AMC</h2>
            <p className="text-zinc-400 text-lg mb-8 max-w-2xl mx-auto">
              Don't wait for a breakdown. Our Annual Maintenance Contracts ensure factory-wide motor inspection, priority responses, and reduced repair costs.
            </p>
            <Link href="/contact">
              <Button variant="primary" className="!bg-white !text-zinc-900 hover:!bg-zinc-100 h-14 px-10 text-lg font-bold rounded-full shadow-lg border-0">
                Get a Free AMC Quote
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
