import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Button from '@/components/Button';
import Link from 'next/link';
import { Settings, Wrench, Clock } from 'lucide-react';

export default function Home() {
  const services = [
    {
      title: 'Preventative Maintenance',
      description: 'Regular check-ups and servicing to ensure your machinery runs at peak performance and avoids sudden breakdowns.',
      icon: Settings,
    },
    {
      title: 'Emergency Repairs',
      description: 'Fast, reliable repair services for when things go wrong unexpectedly. Minimize your downtime.',
      icon: Wrench,
    },
    {
      title: 'Parts Replacement',
      description: 'Quick sourcing and installation of high-quality replacement parts for various machinery brands.',
      icon: Clock,
    }
  ];

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-brand-blue py-20 text-brand-white">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl text-center mx-auto">
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-white">
                Machine Repair & Service Management
              </h1>
              <p className="mt-6 text-xl text-blue-100 max-w-2xl mx-auto">
                Nitin Machinery provides top-tier repair, maintenance, and tracking solutions for all industrial machines. Don't let downtime kill your productivity.
              </p>
              <div className="mt-10 flex items-center justify-center gap-4">
                <Link href="/service-request">
                  <Button variant="outline" className="border-white bg-transparent text-white hover:bg-white hover:text-brand-blue h-12 px-8 text-base transition-colors duration-200 shadow-none">
                    Request Machine Service
                  </Button>
                </Link>
                <Link href="/admin/login">
                  <Button variant="outline" className="border-white bg-transparent text-white hover:bg-white hover:text-brand-blue h-12 px-8 text-base transition-colors duration-200 shadow-none">
                    Admin Portal
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-24 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">Our Services</h2>
              <p className="mt-4 text-lg text-zinc-600">Comprehensive care for your industrial equipment.</p>
            </div>
            
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {services.map((service, index) => (
                <div key={index} className="rounded-2xl border border-zinc-200 bg-brand-light p-8 transition-all hover:-translate-y-1 hover:shadow-lg">
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-brand-blue/10 text-brand-blue">
                    <service.icon className="h-7 w-7" />
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-zinc-900">{service.title}</h3>
                  <p className="text-zinc-600 leading-relaxed">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-24 bg-zinc-50 relative">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center bg-white p-12 rounded-3xl shadow-sm border border-zinc-100">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900">Need immediate assistance?</h2>
            <p className="mt-4 text-lg text-zinc-600 mb-8">
              Our support team is available 24/7 for emergency troubleshooting and service coordination.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/service-request">
                <Button variant="primary" className="h-12 px-8 rounded-full">
                  Fill Service Form
                </Button>
              </Link>
              <a href="mailto:info@nitinmachinery.com">
                <Button variant="secondary" className="h-12 px-8 rounded-full">
                  Email Support
                </Button>
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
