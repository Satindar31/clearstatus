"use client";



import React from 'react';
import { Monitor, Zap, Shield, Code, Globe, Smartphone } from 'lucide-react';

const features = [
  {
    icon: <Monitor className="w-8 h-8" />,
    title: 'Multiple Integrations',
    description: 'Connect with Uptime Robot, HetrixTools, Freshping, and many other monitoring services seamlessly.'
  },
  {
    icon: <Zap className="w-8 h-8" />,
    title: 'Lightning Fast',
    description: 'Optimized for performance with minimal load times and instant updates to keep your users informed.'
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: 'Self-Hosted Security',
    description: 'Keep full control of your data. Host on your own infrastructure with complete privacy and security.'
  },
  {
    icon: <Code className="w-8 h-8" />,
    title: 'Open Source',
    description: 'Completely free and open source. Customize, contribute, and make it yours with full access to the code.'
  },
  {
    icon: <Globe className="w-8 h-8" />,
    title: 'Custom Domains',
    description: 'Use your own domain and branding to create a seamless experience for your users.'
  },
  {
    icon: <Smartphone className="w-8 h-8" />,
    title: 'Mobile Responsive',
    description: 'Beautiful on all devices. Your status page looks perfect on desktop, tablet, and mobile.'
  }
];

export default function Features() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Everything You Need
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            ClearStatus provides all the features you need to create professional status pages 
            that keep your users informed and your brand looking great.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-xl hover:border-blue-200 transition-all duration-300"
            >
              <div className="text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}