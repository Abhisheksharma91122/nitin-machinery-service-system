import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Button from '@/components/Button';
import Link from 'next/link';
import {
  Droplet,
  Settings,
  Activity,
  ArrowDownToLine,
  Link as LinkIcon,
  Zap,
  Wrench,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  CheckCircle
} from 'lucide-react';


export default function Home() {
  const services = [
    {
      title: 'Pump Sales & Spares',
      description: 'Authorized dealers for leading industrial pumps. Complete sales support and genuine spare parts.',
      icon: Droplet,
    },
    {
      title: 'Diesel/Petrol Engine Repair',
      description: 'Specialized workshop for construction and industrial engines. Petrol/Diesel Engine Overhauling.',
      icon: Settings,
    },
    {
      title: 'Motor Rewinding',
      description: 'Precision rewinding using high-grade copper and Class-H insulation for high HP motors.',
      icon: Activity,
    },
    {
      title: '400-Ton Hydraulic Press',
      description: 'Removal of seized bearings, heavy pin & bushing work, and industrial straightening jobs.',
      icon: ArrowDownToLine,
    },
    {
      title: 'Hose Pipe Crimping',
      description: 'High-pressure hydraulic hoses and custom fittings assembly with precision machine crimping.',
      icon: LinkIcon,
    },
    {
      title: 'Transformer Services',
      description: 'Comprehensive rewinding and maintenance services for industrial transformers.',
      icon: Zap,
    },
    {
      title: 'Pump Repair Services',
      description: 'Submersible & centrifugal repair, impeller & seal change, and site installation support.',
      icon: Wrench,
    },
    {
      title: 'Annual Maintenance (AMC)',
      description: 'Factory-wide motor inspection, priority breakdown response, and reduced repair costs.',
      icon: ShieldCheck,
    }
  ];

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-brand-blue py-24 text-brand-white">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-brand-blue/50 to-brand-blue/90"></div>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-4xl text-center mx-auto">
              <span className="inline-block py-1 px-3 rounded-full bg-brand-light/10 border border-brand-light/20 text-brand-light text-sm font-semibold tracking-wider mb-6">
                EXPERT MOTOR REWINDING & PUMP SOLUTIONS
              </span>
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-7xl text-white mb-6 leading-tight">
                Powering Industry for <br /> <span className="text-brand-light">Nearly Three Decades</span>
              </h1>
              <p className="mt-4 text-xl text-blue-100 max-w-2xl mx-auto mb-10 leading-relaxed">
                We don't just repair equipment; we ensure the heartbeat of your production line never stops. Technical precision and customer longevity in MIDC areas.
              </p>
              <div className="flex items-center justify-center gap-4 flex-col sm:flex-row">
                <Link href="/service-request">
                  <Button variant="primary" className="!bg-white !text-blue-900 hover:!bg-blue-50 border-0 h-14 px-8 text-lg font-bold rounded-full shadow-lg transition-transform hover:scale-105 duration-200">
                    Request Machine Service
                  </Button>
                </Link>
                <Link href="#contact">
                  <Button variant="outline" className="!border-white/40 !text-white !bg-transparent hover:!bg-white hover:!text-blue-900 h-14 px-8 text-lg font-semibold rounded-full">
                    Contact Us Today
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us / Advantage Section */}
        <section className="py-20 bg-white border-b border-zinc-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="flex flex-col items-center text-center p-6 bg-zinc-50 rounded-2xl border border-transparent transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-zinc-200">
                <div className="h-16 w-16 bg-blue-100 text-brand-blue rounded-full flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110">
                  <Settings className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 mb-3">Technical Precision</h3>
                <p className="text-zinc-600">High-grade materials & rigorous testing to ensure your equipment runs flawlessly.</p>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-zinc-50 rounded-2xl shadow-sm border border-zinc-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-zinc-200">
                <div className="h-16 w-16 bg-blue-100 text-brand-blue rounded-full flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 mb-3">Long-term Relationships</h3>
                <p className="text-zinc-600">We prioritize client success over quick fixes. Your consistent uptime is our core objective.</p>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-zinc-50 rounded-2xl border border-transparent transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-zinc-200">
                <div className="h-16 w-16 bg-blue-100 text-brand-blue rounded-full flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110">
                  <Activity className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 mb-3">Local Speed</h3>
                <p className="text-zinc-600">Rapid response for Sinnar & Nashik units to minimize downtime and revenue loss.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-24 bg-zinc-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-5xl">Our Service Portfolio</h2>
              <p className="mt-4 text-xl text-zinc-600 max-w-2xl mx-auto">Comprehensive care and expert repair solutions for your industrial equipment.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {services.map((service, index) => (
                <div key={index} className="group rounded-2xl bg-white p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl border border-zinc-100">
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-blue/5 text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-colors duration-300">
                    <service.icon className="h-7 w-7" />
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-zinc-900 group-hover:text-brand-blue transition-colors duration-300">{service.title}</h3>
                  <p className="text-zinc-600 leading-relaxed text-sm">{service.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-16 text-center">
              <div className="inline-block bg-brand-blue/5 border border-brand-blue/10 rounded-2xl p-8 max-w-3xl">
                <h3 className="text-2xl font-bold text-zinc-900 mb-2">Need an Annual Maintenance Contract?</h3>
                <p className="text-zinc-600 mb-6">Get a free AMC quote today to secure your factory-wide motorized machinery.</p>
                <Link href="#contact">
                  <Button variant="primary" className="rounded-full px-8">Get a Free AMC Quote</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-24 bg-white relative">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row border border-zinc-800">
              <div className="p-12 lg:w-1/2 flex flex-col justify-center">
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-4">Get in Touch</h2>
                <p className="text-zinc-400 text-lg mb-10">
                  Our support team is available 24/7 for emergency troubleshooting and service coordination. We are here to help your industry thrive.
                </p>

                <div className="space-y-8">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1 bg-white/10 p-3 rounded-full">
                      <Phone className="h-6 w-6 text-brand-light" />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-medium text-white">Call Us (24/7)</h4>
                      <p className="text-zinc-400 mt-1 flex flex-col sm:flex-row gap-2">
                        <a href="tel:+919850130575" className="hover:text-white transition-colors">+91 98501 30575</a>
                        <span className="hidden sm:inline border-r border-zinc-600"></span>
                        <a href="tel:+919699577380" className="hover:text-white transition-colors">+91 96995 77380</a>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1 bg-white/10 p-3 rounded-full">
                      <Mail className="h-6 w-6 text-brand-light" />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-medium text-white">Email Us</h4>
                      <p className="text-zinc-400 mt-1">
                        <a href="mailto:info@nitinmachinery.in" className="hover:text-white transition-colors">info@nitinmachinery.in</a>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1 bg-white/10 p-3 rounded-full">
                      <MapPin className="h-6 w-6 text-brand-light" />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-medium text-white">Visit Workshop</h4>
                      <p className="text-zinc-400 mt-1 leading-relaxed">
                        593, Near Ronak Lawn, Pune Highway, <br />
                        Sinnar, Nashik, Maharashtra - 422103
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:w-1/2 p-12 bg-zinc-800 flex flex-col justify-center items-center text-center border-t lg:border-t-0 lg:border-l border-zinc-700">
                <h3 className="text-2xl font-bold text-white mb-4">Request Service Directly</h3>
                <p className="text-zinc-400 mb-8 max-w-sm">
                  Fill out our online service request form for a structured assessment of your machinery needs.
                </p>
                <div className="flex flex-col gap-4 w-full max-w-xs">
                  <Link href="/service-request" className="w-full">
                    <Button variant="primary" className="w-full h-14 rounded-xl text-lg !bg-white !text-zinc-900 hover:!bg-zinc-100 font-bold transition-colors border-0">
                      Fill Service Form
                    </Button>
                  </Link>
                  <a href="https://wa.me/919850130575?text=Hello%20Nitin%20Machinery" target="_blank" rel="noopener noreferrer" className="w-full">
                    <Button variant="outline" className="w-full h-14 rounded-xl !border-zinc-600 !text-white hover:!bg-zinc-700 transition-colors">
                      Chat on WhatsApp
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
