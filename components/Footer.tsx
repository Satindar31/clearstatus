"use client";


import React from 'react';
import { Github, Heart, Mail } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-sm"></div>
              </div>
              <span className="text-xl font-bold">ClearStatus</span>
            </div>
            <p className="text-gray-400 text-lg leading-relaxed max-w-md">
              The free, open-source status page solution that integrates with your existing monitoring tools. 
              Built by developers, for developers.
            </p>
            <div className="flex items-center space-x-4 mt-6">
              <Link 
                href="https://github.com/satindar31/clearstatus"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Github size={24} />
              </Link>
              <Link
                href="mailto:me@hiihi.xyz"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Mail size={24} />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Product</h3>
            <ul className="space-y-3">
              <li><Link href="#features" className="text-gray-400 hover:text-white transition-colors">Features</Link></li>
              <li><Link href="#integrations" className="text-gray-400 hover:text-white transition-colors">Integrations</Link></li>
              <li><Link href="#documentation" className="text-gray-400 hover:text-white transition-colors">Documentation</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">API</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Community</h3>
            <ul className="space-y-3">
              <li><Link href="https://github.com/satindar31/clearstatus" className="text-gray-400 hover:text-white transition-colors">GitHub</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Discord</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Discussions</Link></li>
              <li><Link href="https://github.com/satindar31/clearstatus" className="text-gray-400 hover:text-white transition-colors">Contributing</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-2 text-gray-400">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-500" />
            <span>for the developer community</span>
          </div>
          <div className="mt-4 md:mt-0 text-gray-400">
            <span>© 2025 ClearStatus. Open source under AGPL-3.0 License.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}