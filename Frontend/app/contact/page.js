"use client";

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Button from '@/components/Button';
import FormInput from '@/components/FormInput';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, MessageSquare, Send } from 'lucide-react';
import { toast } from 'react-toastify';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      toast.success("Message sent successfully!");
      setFormData({ name: '', phone: '', email: '', message: '' });
    } else {
      toast.error("Failed to send message.");
    }
  };

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

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
              Get in Touch
            </motion.h1>
            <motion.p 
              className="mt-4 text-xl text-blue-100 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Our support team is available 24/7 for emergency troubleshooting and service coordination. We are here to help your industry thrive.
            </motion.p>
          </div>
        </section>

        {/* Contact Content */}
        <section className="py-20 lg:py-28 bg-white relative">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
              
              {/* Contact Information */}
              <motion.div 
                className="lg:col-span-5 space-y-8"
                initial="initial"
                animate="animate"
                variants={fadeIn}
              >
                <div>
                  <h2 className="text-3xl font-bold text-zinc-900 mb-6">Contact Information</h2>
                  <p className="text-lg text-zinc-600 mb-10">Whether you need immediate repair assistance or want to discuss an AMC, our experts are ready to respond rapidly.</p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start p-6 bg-zinc-50 rounded-2xl border border-zinc-100 hover:shadow-md transition-shadow">
                    <div className="flex-shrink-0 bg-brand-blue/10 p-4 rounded-full">
                      <Phone className="h-6 w-6 text-brand-blue" />
                    </div>
                    <div className="ml-5">
                      <h4 className="text-lg font-semibold text-zinc-900">Call Us (24/7)</h4>
                      <div className="mt-2 space-y-1">
                        <a href="tel:+919850130575" className="block text-zinc-600 hover:text-brand-blue transition-colors text-lg font-medium">+91 98501 30575</a>
                        <a href="tel:+919699577380" className="block text-zinc-600 hover:text-brand-blue transition-colors text-lg font-medium">+91 96995 77380</a>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start p-6 bg-zinc-50 rounded-2xl border border-zinc-100 hover:shadow-md transition-shadow">
                    <div className="flex-shrink-0 bg-brand-blue/10 p-4 rounded-full">
                      <Mail className="h-6 w-6 text-brand-blue" />
                    </div>
                    <div className="ml-5">
                      <h4 className="text-lg font-semibold text-zinc-900">Email Us</h4>
                      <p className="mt-2">
                        <a href="mailto:info@nitinmachinery.in" className="text-zinc-600 hover:text-brand-blue transition-colors text-lg">info@nitinmachinery.in</a>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start p-6 bg-zinc-50 rounded-2xl border border-zinc-100 hover:shadow-md transition-shadow">
                    <div className="flex-shrink-0 bg-brand-blue/10 p-4 rounded-full">
                      <MapPin className="h-6 w-6 text-brand-blue" />
                    </div>
                    <div className="ml-5">
                      <h4 className="text-lg font-semibold text-zinc-900">Workshop Location</h4>
                      <p className="mt-2 text-zinc-600 text-lg leading-relaxed">
                        593, Near Ronak Lawn, Pune Highway,<br />
                        Sinnar, Nashik, Maharashtra - 422103
                      </p>
                    </div>
                  </div>

                  {/* WhatsApp CTA */}
                  <a href="https://wa.me/919850130575?text=Hello%20Nitin%20Machinery" target="_blank" rel="noopener noreferrer" className="block mt-8">
                    <Button className="w-full h-14 rounded-xl !bg-[#25D366] !text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-2 text-lg font-bold border-0 shadow-lg">
                      <MessageSquare className="h-6 w-6" /> Chat on WhatsApp
                    </Button>
                  </a>
                </div>
              </motion.div>

              {/* Contact Form */}
              <motion.div 
                className="lg:col-span-7"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-2xl border border-zinc-100">
                  <h3 className="text-2xl font-bold text-zinc-900 mb-6">Send Us a Message</h3>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-zinc-700 mb-2">Full Name</label>
                        <FormInput
                          id="name"
                          name="name"
                          type="text"
                          required
                          placeholder="Your Name"
                          value={formData.name}
                          onChange={handleChange}
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-zinc-700 mb-2">Phone Number</label>
                        <FormInput
                          id="phone"
                          name="phone"
                          type="tel"
                          required
                          placeholder="+91 XXXXX XXXXX"
                          value={formData.phone}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-zinc-700 mb-2">Email Address (Optional)</label>
                      <FormInput
                        id="email"
                        name="email"
                        type="email"
                        placeholder="you@company.com"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-zinc-700 mb-2">Message</label>
                      <textarea
                        id="message"
                        name="message"
                        rows="4"
                        required
                        className="w-full rounded-lg border border-zinc-300 px-4 py-3 text-zinc-900 placeholder:text-zinc-400 focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue disabled:opacity-50 transition-colors shadow-sm resize-none"
                        placeholder="How can we help you?"
                        value={formData.message}
                        onChange={handleChange}
                      ></textarea>
                    </div>
                    <Button type="submit" variant="primary" className="w-full h-14 rounded-xl text-lg font-bold shadow-md flex items-center justify-center gap-2">
                      <Send className="h-5 w-5" /> Send Message
                    </Button>
                  </form>
                </div>
              </motion.div>

            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
