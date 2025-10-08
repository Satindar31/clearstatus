"use client";


import React from 'react';
import { Check, Heart } from 'lucide-react';

export default function Pricing() {
  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Simple, Transparent Pricing
        </h2>
        <p className="text-xl text-gray-600 mb-12">
          ClearStatus is completely free and always will be. No hidden costs, no premium tiers.
        </p>

        <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-3xl p-12 border-2 border-blue-200 shadow-xl">
          <div className="flex items-center justify-center mb-6">
            <Heart className="w-8 h-8 text-red-500 mr-3" />
            <span className="text-2xl font-bold text-gray-900">Open Source Forever</span>
          </div>
          
          <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600 mb-4">
            $0
          </div>
          <div className="text-xl text-gray-600 mb-8">
            Forever and always
          </div>

          <div className="space-y-4 mb-10">
            {[
              'Unlimited status pages',
              'All monitoring integrations',
              'Custom domains & branding',
              'Mobile responsive design',
              'Self-hosted deployment',
              'Full source code access',
              'Community support',
              'Regular updates & improvements'
            ].map((feature, index) => (
              <div key={index} className="flex items-center justify-center space-x-3">
                <Check className="w-5 h-5 text-green-600" />
                <span className="text-gray-700 font-medium">{feature}</span>
              </div>
            ))}
          </div>

          <button className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-10 py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-green-700 transition-all shadow-lg hover:shadow-xl">
            Start Building Now
          </button>
          
          <p className="text-gray-600 mt-6">
            Deploy on your own infrastructure. No vendor lock-in, ever.
          </p>
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-600 text-lg">
            Want to support the project? 
            <a 
              href="https://github.com/satindar31/clearstatus" 
              className="text-blue-600 hover:text-blue-700 font-semibold ml-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              Give us a star on GitHub ⭐
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}