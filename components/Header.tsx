"use client";

import React from "react";
import { Github, Menu, X } from "lucide-react";

interface HeaderProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export default function Header({
  mobileMenuOpen,
  setMobileMenuOpen,
}: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-sm"></div>
            </div>
            <span className="text-xl font-bold text-gray-900">ClearStatus</span>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="#features"
              className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
            >
              Features
            </a>
            <a
              href="#integrations"
              className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
            >
              Integrations
            </a>
            <a
              href="#pricing"
              className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
            >
              Pricing
            </a>
            <a
              href="https://github.com/satindar31/clearstatus"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors font-medium"
            >
              <Github size={18} />
              <span>Source</span>
            </a>
            <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg">
              Get Started
            </button>
          </nav>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-4 py-4 space-y-4">
            <a
              href="#features"
              className="block text-gray-600 hover:text-blue-600 font-medium"
            >
              Features
            </a>
            <a
              href="#integrations"
              className="block text-gray-600 hover:text-blue-600 font-medium"
            >
              Integrations
            </a>
            <a
              href="#pricing"
              className="block text-gray-600 hover:text-blue-600 font-medium"
            >
              Pricing
            </a>
            <a
              href="https://github.com/satindar31/clearstatus"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 font-medium"
            >
              <Github size={18} />
              <span>Source Code</span>
            </a>
            <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-lg font-semibold">
              Get Started
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
