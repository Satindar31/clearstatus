"use client";

import React from "react";
import { ArrowRight, Github, Star } from "lucide-react";
import SignUp from "./auth/signup";
;

export default function Hero() {
  const [authModalOpen, setAuthModalOpen] = React.useState(false);

  return (
    <section className="pt-20 pb-16 bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
              100% Free & Open Source
            </span>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
              Self-Hosted
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Beautiful Status Pages
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">
              Made Simple
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Create stunning status pages for your services with ClearStatus.
            Completely free, open source, and integrates seamlessly with your
            existing monitoring tools.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <button
              onClick={() => setAuthModalOpen(true)}
              className="group bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl flex items-center space-x-2"
            >
              <span>Get Started Free</span>
              <ArrowRight
                className="group-hover:translate-x-1 transition-transform"
                size={20}
              />
            </button>

            <a
              href="https://github.com/satindar31/clearstatus"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center space-x-3 bg-white border border-gray-200 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-50 transition-all shadow-md hover:shadow-lg"
            >
              <Github size={20} />
              <span>View on GitHub</span>
              <div className="flex items-center space-x-1 text-gray-500">
                <Star size={16} />
                <span className="text-sm">Star</span>
              </div>
            </a>
          </div>

          <div className="mt-16 relative">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="ml-4 text-gray-500 text-sm">
                  status.example.com
                </span>
              </div>
              <div className="p-8">
                <div className="text-left">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    System Status
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="font-semibold">Website</span>
                      </div>
                      <span className="text-green-700 font-medium">
                        Operational
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="font-semibold">API Service</span>
                      </div>
                      <span className="text-green-700 font-medium">
                        Operational
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span className="font-semibold">Database</span>
                      </div>
                      <span className="text-yellow-700 font-medium">
                        Degraded
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {authModalOpen && <SignUp />}
    </section>
  );
}
